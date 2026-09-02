import type { SupabaseClient } from '@supabase/supabase-js'
import { londonNow } from '@/lib/time/london'
import { getTimeSettings } from '@/lib/quests/time-tiers'
import { getActiveSession, isAskLive } from '@/lib/quests/device-time'
import { sendPush } from '@/lib/push/send'
import {
  TIERS, applyEvent, bedtimePhase, minutesLeft, newGarden, nightKeyFor, reconcile, tierFor,
  type Garden, type GardenAsk, type Tier,
} from './logic'
import { starterPlants, SPECIES } from './registry'

// Planter Friends on the server: the only place the garden is decided.
//
// The rules are in ./logic and are pure; this file gives them a clock, a
// database and the family's bedtime. Every read reconciles first (rests that
// ended, the night that is owed) and every event reconciles before it
// applies, so the client can count down from the server's numbers and a
// device clock wound forward moves nothing. No model, no push to a child,
// ever: a nap that ends waits for the next open.

type Admin = Pick<SupabaseClient, 'from'>

export type ChildForGarden = {
  name?: string | null
  age_band?: string | null
  date_of_birth?: string | null
}

export type { GardenView, ScreenAsk, ClientEvent } from './view'
import type { GardenView, ScreenAsk, ClientEvent } from './view'

type Row = { state: Garden; ask: GardenAsk | null; version: number }

const ASK_FRESH_HOURS = 12

function freshAsk(ask: GardenAsk | null | undefined, nowMs: number): GardenAsk | null {
  if (!ask) return null
  const at = new Date(ask.answeredAt ?? ask.createdAt).getTime()
  if (!Number.isFinite(at) || nowMs - at > ASK_FRESH_HOURS * 3600000) return null
  return ask
}

async function clock(admin: Admin, userId: string, childId: string, child: ChildForGarden) {
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
    .from('planter_gardens').select('state, ask, version').eq('child_id', childId).maybeSingle()
  if (!data) return null
  return { state: data.state as Garden, ask: (data.ask as GardenAsk | null) ?? null, version: Number(data.version) || 1 }
}

async function saveState(admin: Admin, childId: string, garden: Garden, extra: Record<string, unknown> = {}) {
  await admin.from('planter_gardens')
    .update({ state: garden, updated_at: new Date().toISOString(), ...extra })
    .eq('child_id', childId)
}

async function log(admin: Admin, userId: string, childId: string, kind: string, payload: Record<string, unknown> = {}) {
  try { await admin.from('planter_events').insert({ user_id: userId, child_id: childId, kind, payload }) } catch { /* the state is the truth, the ledger is best effort */ }
}

/**
 * The garden, brought up to now. Creates it on first look (upsert on conflict
 * do nothing, then read, because two tabs opening at once is a real thing on
 * a child's phone). A child who has grown into the next tier keeps their
 * plants and gains the tier's extra starter.
 */
async function loadReconciled(admin: Admin, userId: string, childId: string, child: ChildForGarden) {
  const c = await clock(admin, userId, childId, child)
  const tier = tierFor(child.date_of_birth ?? null, child.age_band ?? null, c.now)
  let row = await readRow(admin, childId)
  let created = false
  if (!row) {
    const fresh = newGarden(tier, c.nowIso, starterPlants(tier), c.nightKey)
    await admin.from('planter_gardens')
      .upsert({ child_id: childId, user_id: userId, state: fresh, version: 1 }, { onConflict: 'child_id', ignoreDuplicates: true })
    row = (await readRow(admin, childId)) ?? { state: fresh, ask: null, version: 1 }
    created = true
  }
  const before = JSON.stringify(row.state)
  let garden = reconcile({ ...row.state, tier }, c.nowIso, c.nightKey)
  const want = TIERS[tier].plants
  if (garden.plants.length < want) {
    const extra = starterPlants(tier).slice(garden.plants.length, want)
      .map(p => ({ ...p, id: `p${garden.plants.length + 1}`, energy: 100, growthStage: 1, growthProgress: 0, cooldown: null, grewWhileAway: 0, shade: false }))
    garden = { ...garden, plants: [...garden.plants, ...extra] }
  }
  const nightLanded = garden.lastNightAppliedOn !== row.state.lastNightAppliedOn && !created
  if (JSON.stringify(garden) !== before) {
    await saveState(admin, childId, garden)
    if (nightLanded) await log(admin, userId, childId, 'night_applied', { on: garden.lastNightAppliedOn })
  }
  return { ...c, tier, garden, ask: freshAsk(row.ask, c.now.getTime()), version: row.version }
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

async function toView(admin: Admin, childId: string, loaded: Awaited<ReturnType<typeof loadReconciled>>): Promise<GardenView> {
  const phase = bedtimePhase(loaded.minutesNow, loaded.startMin, loaded.endMin)
  let windowUntil: string | null = null
  let screenAsk: ScreenAsk | null = null
  if (phase === 'bedtime') {
    // The parent's yes to minutes inside bedtime is an ordinary device time
    // session, the same one the timer card counts down. While it runs, the
    // greenhouse is open.
    const session = await getActiveSession(admin, childId).catch(() => null)
    windowUntil = session?.endsAt ?? null
    screenAsk = await screenAskFor(admin, childId)
  }
  return {
    garden: loaded.garden,
    serverNow: loaded.nowIso,
    tier: loaded.tier,
    bedtime: { phase, startMin: loaded.startMin, endMin: loaded.endMin, minutesNow: loaded.minutesNow, windowUntil },
    ask: loaded.ask,
    screenAsk,
    starMinutes: loaded.starMinutes,
  }
}

export async function loadGardenView(admin: Admin, userId: string, childId: string, child: ChildForGarden): Promise<GardenView> {
  const loaded = await loadReconciled(admin, userId, childId, child)
  return toView(admin, childId, loaded)
}

const LOGGED: Set<string> = new Set(['nap_start', 'sunlight_start', 'ambient_start'])

/**
 * One event from the child's screen. Reconcile, apply, save, and answer with
 * the whole view so the client never has to guess what changed.
 */
export async function applyGardenEvent(admin: Admin, userId: string, childId: string, child: ChildForGarden, ev: ClientEvent): Promise<GardenView> {
  const loaded = await loadReconciled(admin, userId, childId, child)
  let garden = loaded.garden
  let ask = loaded.ask

  if (ev.kind === 'ask_wake') {
    // One live ask at a time, and only while something is actually resting.
    const resting = garden.plants.filter(p => p.cooldown)
    if (resting.length > 0 && !(ask && ask.status === 'pending')) {
      const left = Math.max(...resting.map(p => minutesLeft(p.cooldown!, loaded.nowIso)))
      ask = {
        id: `ask_${Date.now().toString(36)}`, kind: 'wake', status: 'pending',
        createdAt: loaded.nowIso, answeredAt: null, minutesLeft: left,
      }
      await saveState(admin, childId, garden, { ask })
      await log(admin, userId, childId, 'ask_wake', { minutesLeft: left })
      const name = child.name ?? 'Your child'
      try {
        await sendPush({
          userId,
          title: `${name} wants to wake the plants 🌱`,
          body: `The plants in the greenhouse have ${left} minute${left === 1 ? '' : 's'} of rest left. Yes wakes them now. Not now keeps the nap.`,
          url: '/dashboard/quests',
        })
      } catch { /* best effort, the pop up carries it */ }
    }
  } else if (ev.kind === 'ask_seen') {
    // The child has read the answer. Clear it so it never shows twice.
    if (ask && ask.status !== 'pending') {
      ask = null
      await saveState(admin, childId, garden, { ask: null })
    }
  } else {
    const next = applyEvent(garden, ev, loaded.nowIso)
    if (JSON.stringify(next) !== JSON.stringify(garden)) {
      garden = next
      await saveState(admin, childId, garden)
      if (LOGGED.has(ev.kind)) {
        const plantId = 'plantId' in ev ? ev.plantId : null
        const plant = plantId ? garden.plants.find(p => p.id === plantId) : null
        await log(admin, userId, childId, ev.kind, { plantId, species: plant ? SPECIES[plant.species].label : null })
      }
    }
  }
  return toView(admin, childId, { ...loaded, garden, ask })
}

/**
 * The grown up answers the wake ask from AskPopup. A yes ends every rest now
 * and pays the growth for the minutes actually slept; a not now leaves the
 * nap running and tells the child kindly. Runs on the parent's own session
 * client, so RLS scopes it to their family.
 */
export async function answerGardenAsk(
  client: Admin,
  childId: string,
  askId: string,
  status: 'approved' | 'declined',
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const row = await readRow(client, childId)
  if (!row) return { ok: false, reason: 'no garden' }
  if (!row.ask || row.ask.id !== askId) return { ok: false, reason: 'no such ask' }
  if (row.ask.status !== 'pending') return { ok: true }
  const nowIso = new Date().toISOString()
  const ask: GardenAsk = { ...row.ask, status, answeredAt: nowIso }
  let garden = row.state
  if (status === 'approved') garden = applyEvent(garden, { kind: 'wake_all' }, nowIso)
  await client.from('planter_gardens')
    .update({ state: garden, ask, updated_at: nowIso })
    .eq('child_id', childId)
  try {
    await client.from('planter_events').insert({
      user_id: (await client.from('planter_gardens').select('user_id').eq('child_id', childId).maybeSingle()).data?.user_id,
      child_id: childId, kind: 'ask_answered', payload: { askId, status },
    })
  } catch { /* best effort */ }
  return { ok: true }
}
