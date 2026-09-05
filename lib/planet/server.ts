import type { SupabaseClient } from '@supabase/supabase-js'
import { randomInt } from 'node:crypto'
import { londonNow } from '@/lib/time/london'
import { getTimeSettings } from '@/lib/quests/time-tiers'
import { getActiveSession, isAskLive } from '@/lib/quests/device-time'
import { sendPush } from '@/lib/push/send'
import {
  ACTIVE_BY_TIER, applyEvent, bedtimePhase, childAgeFor, codeModeFor, makeCode, minutesLeft, newFriend, newHome, nightKeyFor, reconcile, tierFor, withChildAnswers,
  type CodeMode, type Home, type HomeAsk, type Tier,
} from './logic'
import { friendArt } from './registry'
import { MISSION_DEFS, missionByKey } from './missions'
export type { HomeView, ScreenAsk, ClientEvent } from './view'
import type { HomeView, ScreenAsk, ClientEvent } from './view'

// Planet Friends on the server: the only place the planet is decided.
//
// The rules are in ./logic and are pure; this file gives them a clock, a
// database and the family's bedtime. Every read reconciles first (rests that
// ended, the night that is owed) and every event reconciles before it
// applies, so the client can count down from the server's numbers and a
// device clock wound forward moves nothing. No model, no push to a child,
// ever: a rest that ends waits for the next open.

type Admin = Pick<SupabaseClient, 'from'>

export type ChildForPlanet = {
  name?: string | null
  age_band?: string | null
  date_of_birth?: string | null
}

type Row = { state: Home; ask: HomeAsk | null; version: number }

const ASK_FRESH_HOURS = 12

function freshAsk(ask: HomeAsk | null | undefined, nowMs: number): HomeAsk | null {
  if (!ask) return null
  const at = new Date(ask.answeredAt ?? ask.createdAt).getTime()
  if (!Number.isFinite(at) || nowMs - at > ASK_FRESH_HOURS * 3600000) return null
  return ask
}

async function clock(admin: Admin, userId: string, childId: string, child: ChildForPlanet) {
  const now = new Date()
  const settings = await getTimeSettings(admin, userId, [{ id: childId, age_band: child.age_band ?? null }])
    .then(m => m.get(childId) ?? null).catch(() => null)
  const ln = londonNow(now)
  const minutesNow = ln.hour * 60 + ln.minute
  const startMin = settings?.bedtimeStartMin ?? null
  const endMin = settings?.bedtimeEndMin ?? null
  return {
    now, nowIso: now.toISOString(), minutesNow, startMin, endMin,
    nightKey: nightKeyFor(ln.dateStr, minutesNow, endMin),
    starMinutes: settings?.starMinutes ?? 5,
  }
}

async function readRow(admin: Admin, childId: string): Promise<Row | null> {
  const { data } = await admin
    .from('planet_homes').select('state, ask, version').eq('child_id', childId).maybeSingle()
  if (!data) return null
  return { state: data.state as Home, ask: (data.ask as HomeAsk | null) ?? null, version: Number(data.version) || 1 }
}

async function saveState(admin: Admin, childId: string, home: Home, extra: Record<string, unknown> = {}) {
  await admin.from('planet_homes')
    .update({ state: home, updated_at: new Date().toISOString(), ...extra })
    .eq('child_id', childId)
}

// ── The hidden code cards (slice 2b) ────────────────────────────────────────
// One row per child per card mission in planet_codes (migration 253). The
// code is made here, printed by the parent, and checked here. The child's
// screen learns only that a card exists and what shape its pad should be.

type CodeRow = { mission_key: string; code: string[]; mode: CodeMode; printed_at: string | null }

async function codeRows(client: Admin, childId: string): Promise<CodeRow[]> {
  try {
    const { data, error } = await client.from('planet_codes').select('mission_key, code, mode, printed_at').eq('child_id', childId)
    if (error) return []
    return (data ?? []).map(r => ({
      mission_key: String(r.mission_key),
      code: Array.isArray(r.code) ? (r.code as unknown[]).map(String) : [],
      mode: r.mode === 'letters' ? 'letters' : 'pictures',
      printed_at: r.printed_at ? String(r.printed_at) : null,
    }))
  } catch { return [] }
}

const cardsOf = (rows: CodeRow[]) => rows.map(r => ({ key: r.mission_key, mode: r.mode, printed: !!r.printed_at }))
const answersOf = (rows: CodeRow[]) => Object.fromEntries(rows.filter(r => r.printed_at).map(r => [r.mission_key, r.code]))

/**
 * The code for one child's card: made on the first print, the same on every
 * print after, so a lost card prints again and still matches. Pictures
 * before 8, letters from 8, fixed at the moment it is made. Runs on the
 * parent's session client, so RLS scopes it to their own children.
 */
export async function ensureMissionCode(client: Admin, childId: string, missionKey: string, childAge: number): Promise<{ code: string[]; mode: CodeMode } | null> {
  const def = MISSION_DEFS[missionKey]
  if (!def?.perChild) return null
  const nowIso = new Date().toISOString()
  try {
    const { data } = await client.from('planet_codes').select('code, mode, printed_at')
      .eq('child_id', childId).eq('mission_key', missionKey).maybeSingle()
    if (data && Array.isArray(data.code) && (data.code as unknown[]).length > 0) {
      if (!data.printed_at) {
        await client.from('planet_codes').update({ printed_at: nowIso }).eq('child_id', childId).eq('mission_key', missionKey)
      }
      return { code: (data.code as unknown[]).map(String), mode: data.mode === 'letters' ? 'letters' : 'pictures' }
    }
    const mode = codeModeFor(childAge)
    const code = makeCode(mode, n => randomInt(n))
    const { error } = await client.from('planet_codes')
      .upsert({ child_id: childId, mission_key: missionKey, code, mode, printed_at: nowIso }, { onConflict: 'child_id,mission_key' })
    if (error) return null
    return { code, mode }
  } catch { return null }
}

async function log(admin: Admin, userId: string, childId: string, kind: string, payload: Record<string, unknown> = {}) {
  try { await admin.from('planet_events').insert({ user_id: userId, child_id: childId, kind, payload }) } catch { /* the state is the truth, the ledger is best effort */ }
}

/**
 * The planet, brought up to now. Creates it on first look (upsert on conflict
 * do nothing, then read, because two tabs opening at once is a real thing on
 * a child's phone). A child who has grown into the next tier keeps their
 * Friends and the tier's next Friend joins them.
 */
async function loadReconciled(admin: Admin, userId: string, childId: string, child: ChildForPlanet) {
  const c = await clock(admin, userId, childId, child)
  const tier = tierFor(child.date_of_birth ?? null, child.age_band ?? null, c.now)
  const childAge = childAgeFor(child.date_of_birth ?? null, child.age_band ?? null, c.now)
  let row = await readRow(admin, childId)
  let created = false
  if (!row) {
    const fresh = newHome(tier, c.nowIso, c.nightKey)
    await admin.from('planet_homes')
      .upsert({ child_id: childId, user_id: userId, state: fresh, version: 1 }, { onConflict: 'child_id', ignoreDuplicates: true })
    row = (await readRow(admin, childId)) ?? { state: fresh, ask: null, version: 1 }
    created = true
  }
  const before = JSON.stringify(row.state)
  let home = reconcile({ ...row.state, tier }, c.nowIso, c.nightKey)
  const want = ACTIVE_BY_TIER[tier]
  const missing = want.filter(k => !home.friends.some(f => f.key === k))
  if (missing.length) home = { ...home, friends: [...home.friends, ...missing.map(newFriend)] }
  const nightLanded = home.lastNightAppliedOn !== row.state.lastNightAppliedOn && !created
  if (JSON.stringify(home) !== before) {
    await saveState(admin, childId, home)
    if (nightLanded) await log(admin, userId, childId, 'night_applied', { on: home.lastNightAppliedOn })
  }
  return { ...c, tier, childAge, home, ask: freshAsk(row.ask, c.now.getTime()), version: row.version }
}

async function screenAskFor(admin: Admin, childId: string): Promise<ScreenAsk | null> {
  try {
    const { data } = await admin
      .from('device_requests').select('id, minutes, status, created_at')
      .eq('child_id', childId).order('created_at', { ascending: false }).limit(1).maybeSingle()
    if (!data) return null
    const status = String(data.status)
    if (!['pending', 'approved', 'declined'].includes(status)) return null
    if (!isAskLive(status, String(data.created_at))) return null
    return { id: String(data.id), minutes: Number(data.minutes), status: status as ScreenAsk['status'] }
  } catch { return null }
}

async function toView(admin: Admin, childId: string, loaded: Awaited<ReturnType<typeof loadReconciled>>): Promise<HomeView> {
  const phase = bedtimePhase(loaded.minutesNow, loaded.startMin, loaded.endMin)
  let windowUntil: string | null = null
  let screenAsk: ScreenAsk | null = null
  if (phase === 'bedtime') {
    // The parent's yes to minutes inside bedtime is an ordinary device time
    // session, the same one the timer card counts down. While it runs, the
    // planet is open.
    const session = await getActiveSession(admin, childId).catch(() => null)
    windowUntil = session?.endsAt ?? null
    screenAsk = await screenAskFor(admin, childId)
  }
  return {
    home: loaded.home,
    serverNow: loaded.nowIso,
    tier: loaded.tier,
    childAge: loaded.childAge,
    bedtime: { phase, startMin: loaded.startMin, endMin: loaded.endMin, minutesNow: loaded.minutesNow, windowUntil },
    ask: loaded.ask,
    screenAsk,
    starMinutes: loaded.starMinutes,
    cards: cardsOf(await codeRows(admin, childId)),
  }
}

export async function loadHomeView(admin: Admin, userId: string, childId: string, child: ChildForPlanet): Promise<HomeView> {
  const loaded = await loadReconciled(admin, userId, childId, child)
  return toView(admin, childId, loaded)
}

const LOGGED: Set<string> = new Set(['nap_start', 'sunlight_start', 'ambient_start', 'mission_start', 'mission_claim', 'mission_approve', 'mission_notnow'])

/**
 * A lesson passed on the child's own link since the mission started. The
 * lesson's own pass is the proof (design 3.2), read from the tables the
 * lessons write, never trusted from the client. Two tables, because the
 * child has two kinds of lesson: the stage lessons on the Learn tab, which
 * /api/kid/lesson-complete records in lesson_completions (the card says
 * "pass a lesson on the Learn tab", so this one is the main road), and the
 * Star Lessons a parent sends, which land in kid_lesson_missions. Until
 * 5 September 2026 only the second was read, so a Learn tab pass never
 * counted and the mission could not land for a child with no Star Lesson.
 * lesson_completions keeps the first completed_at, so only a lesson passed
 * for the first time after the mission started counts, which is the point.
 */
async function lessonPassedSince(admin: Admin, childId: string, sinceIso: string): Promise<boolean> {
  const count = async (q: PromiseLike<{ count: number | null }>) => { try { return (await q).count ?? 0 } catch { return 0 } }
  const [learnTab, starLessons] = await Promise.all([
    count(admin.from('lesson_completions').select('lesson_id', { count: 'exact', head: true })
      .eq('child_id', childId).eq('passed', true).gte('completed_at', sinceIso)),
    count(admin.from('kid_lesson_missions').select('id', { count: 'exact', head: true })
      .eq('child_id', childId).eq('status', 'done').gte('completed_at', sinceIso)),
  ])
  return learnTab + starLessons > 0
}

/**
 * One event from the child's screen. Reconcile, apply, save, and answer with
 * the whole view so the client never has to guess what changed.
 */
export async function applyHomeEvent(admin: Admin, userId: string, childId: string, child: ChildForPlanet, ev: ClientEvent): Promise<HomeView> {
  const loaded = await loadReconciled(admin, userId, childId, child)
  let home = loaded.home
  let ask = loaded.ask

  if (ev.kind === 'ask_wake') {
    // One live ask at a time, and only while somebody is actually resting.
    const resting = home.friends.filter(f => f.cooldown)
    if (resting.length > 0 && !(ask && ask.status === 'pending')) {
      const left = Math.max(...resting.map(f => minutesLeft(f.cooldown!, loaded.nowIso)))
      ask = {
        id: `ask_${Date.now().toString(36)}`, kind: 'wake', status: 'pending',
        createdAt: loaded.nowIso, answeredAt: null, minutesLeft: left,
      }
      await saveState(admin, childId, home, { ask })
      await log(admin, userId, childId, 'ask_wake', { minutesLeft: left })
      const name = child.name ?? 'Your child'
      try {
        await sendPush({
          userId,
          title: `${name} wants to wake the Planet Friends 🪐`,
          body: `The Friends have ${left} minute${left === 1 ? '' : 's'} of rest left in their pods. Yes wakes them now. Not now keeps the nap.`,
          url: '/dashboard/quests',
        })
      } catch { /* best effort, the pop up carries it */ }
    }
  } else if (ev.kind === 'ask_seen') {
    // The child has read the answer. Clear it so it never shows twice.
    if (ask && ask.status !== 'pending') {
      ask = null
      await saveState(admin, childId, home, { ask: null })
    }
  } else if (ev.kind === 'mission_approve' || ev.kind === 'mission_notnow') {
    // Only a grown up (through the ask) or the server itself lands a mission.
    return toView(admin, childId, { ...loaded, home, ask })
  } else {
    // A claim on a card mission is checked against the code made for this
    // child; the pure rules see it as an ordinary answer.
    const defs = ev.kind === 'mission_claim' ? withChildAnswers(MISSION_DEFS, answersOf(await codeRows(admin, childId))) : MISSION_DEFS
    let next = applyEvent(home, ev, loaded.nowIso, defs)
    // The two proofs decided outside the pure rules.
    if (ev.kind === 'mission_claim') {
      const def = MISSION_DEFS[ev.key]
      const st = next.missions.find(m => m.key === ev.key)
      if (def && st && st.status === 'claimed') {
        if (def.proof === 'lesson') {
          if (await lessonPassedSince(admin, childId, st.startedAt)) {
            next = applyEvent(next, { kind: 'mission_approve', key: ev.key }, loaded.nowIso, defs)
          } else {
            // Not yet: the claim is undone so the child can try again after the lesson.
            next = { ...next, missions: next.missions.map(m => (m.key === ev.key ? { ...m, status: 'doing' as const, claimedAt: null } : m)) }
          }
        } else if (def.proof === 'grownup_tap' && !(ask && ask.status === 'pending')) {
          const card = missionByKey(ev.key)
          ask = {
            id: `ask_${Date.now().toString(36)}`, kind: 'mission', status: 'pending',
            createdAt: loaded.nowIso, answeredAt: null, minutesLeft: 0,
            missionKey: ev.key, title: card?.askLine ?? 'did a mission.',
          }
          const name = child.name ?? 'Your child'
          try {
            await sendPush({
              userId,
              title: `${name} did a mission 🪐`,
              body: `${name} ${card?.askLine ?? 'did a mission.'} Say yes on your board and it lands on their planet.`,
              url: '/dashboard/quests',
            })
          } catch { /* best effort, the pop up carries it */ }
        }
      }
    }
    if (JSON.stringify(next) !== JSON.stringify(home) || ask !== loaded.ask) {
      home = next
      await saveState(admin, childId, home, ask !== loaded.ask ? { ask } : {})
      if (LOGGED.has(ev.kind)) {
        const friend = 'friend' in ev ? ev.friend : null
        const key = 'key' in ev ? ev.key : null
        await log(admin, userId, childId, ev.kind, { friend, name: friend ? friendArt(friend).name : null, mission: key })
      }
    }
  }
  return toView(admin, childId, { ...loaded, home, ask })
}

/**
 * The grown up answers the wake ask from AskPopup. A yes ends every rest now
 * and pays the growth for the minutes actually slept; a not now leaves the
 * nap running and tells the child kindly. Runs on the parent's own session
 * client, so RLS scopes it to their family.
 */
export async function answerHomeAsk(
  client: Admin,
  childId: string,
  askId: string,
  status: 'approved' | 'declined',
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const row = await readRow(client, childId)
  if (!row) return { ok: false, reason: 'no planet' }
  if (!row.ask || row.ask.id !== askId) return { ok: false, reason: 'no such ask' }
  if (row.ask.status !== 'pending') return { ok: true }
  const nowIso = new Date().toISOString()
  const ask: HomeAsk = { ...row.ask, status, answeredAt: nowIso }
  let home = reconcile(row.state, nowIso, null)
  if (row.ask.kind === 'mission' && row.ask.missionKey) {
    home = applyEvent(home, { kind: status === 'approved' ? 'mission_approve' : 'mission_notnow', key: row.ask.missionKey }, nowIso, MISSION_DEFS)
  } else if (status === 'approved') {
    home = applyEvent(home, { kind: 'wake_all' }, nowIso)
  }
  await client.from('planet_homes')
    .update({ state: home, ask, updated_at: nowIso })
    .eq('child_id', childId)
  try {
    const { data } = await client.from('planet_homes').select('user_id').eq('child_id', childId).maybeSingle()
    await client.from('planet_events').insert({ user_id: data?.user_id, child_id: childId, kind: 'ask_answered', payload: { askId, status } })
  } catch { /* best effort */ }
  return { ok: true }
}
