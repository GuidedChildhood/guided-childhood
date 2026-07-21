import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { questDueToday } from '@/lib/quests/due'
import { getStarBanks } from '@/lib/quests/bank'
import { KID_LESSONS, kidLessonBaseTitle } from '@/lib/quests/kid-lessons'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { getParentLessons, getCompletionsForChild } from '@/lib/lessons/parent-lessons'
import { getActiveSession } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { hasFullAccess } from '@/lib/access'
import { contractLevelFor } from '@/lib/content/kid-contract'
import { getPrintable } from '@/lib/printables/registry'
import KidQuestScreen from './KidQuestScreen'

// The kid's own screen. Opened from the private link their parent sends,
// no account, no login, nothing to install. Today's quests, big ticks,
// their star count and what they are saving for. The token scopes
// everything; no parent data is reachable from here.

export const dynamic = 'force-dynamic'

// The same category emoji the lesson player and the path use, so the Today
// "Learn" headline, the road stone and the lesson itself never disagree.
const KID_LESSON_EMOJI: Record<string, string> = {
  safety: '🛡️', screen_habits: '📱', wellbeing: '💛',
  online_risks: '🔍', ai_safety: '🤖', ai_literacy: '🤖',
}

// On a child's Home Screen this page is called My Quests, opens full
// screen like a real app (which is also what lets reminders work on
// iPhone), and wears the DiGi star icon from apple-icon.tsx.
export const metadata = {
  title: 'My Quests ⭐',
  appleWebApp: { capable: true, title: 'My Quests', statusBarStyle: 'black-translucent' as const },
}

export default async function KidPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!/^[0-9a-f]{18}$/.test(token)) notFound()

  const supabase = createAdminClient()
  const { data: link } = await supabase
    .from('kid_links')
    .select('user_id, child_id')
    .eq('token', token)
    .maybeSingle()
  if (!link) notFound()

  const today = new Date().toISOString().slice(0, 10)
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)

  const [childRes, questsRes, todayTicksRes, weekTicksRes, goalRes, streakTicksRes] = await Promise.all([
    supabase.from('children').select('name, age_band, buddy, accent, daily_limit_minutes').eq('id', link.child_id).maybeSingle(),
    supabase.from('family_quests')
      .select('id, title, emoji, stars, schedule, schedule_days, blocks_screens')
      .eq('user_id', link.user_id)
      .eq('active', true)
      .or(`child_id.eq.${link.child_id},child_id.is.null`)
      .order('created_at'),
    supabase.from('quest_ticks')
      .select('quest_id, status')
      .eq('child_id', link.child_id)
      .eq('tick_date', today),
    supabase.from('quest_ticks')
      .select('quest_id, status')
      .eq('child_id', link.child_id)
      .eq('status', 'approved')
      .gte('tick_date', weekAgo),
    supabase.from('star_goals')
      .select('*')
      .eq('child_id', link.child_id)
      .maybeSingle(),
    supabase.from('quest_ticks')
      .select('tick_date')
      .eq('child_id', link.child_id)
      .in('status', ['approved', 'pending'])
      .gte('tick_date', new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10))
      .limit(400),
  ])

  // Star lessons sent to this child: pending ones to play, and stars from
  // lessons completed this week join the star bank alongside quest stars.
  const { data: missionRows } = await supabase
    .from('kid_lesson_missions')
    .select('id, stars, status, completed_at, school_lessons(title)')
    .eq('child_id', link.child_id)
    .order('sent_at', { ascending: false })
  const missions = (missionRows ?? []).map(m => ({
    id: m.id,
    title: (m.school_lessons as unknown as { title: string })?.title ?? 'A lesson from DiGi',
    stars: m.stars,
    status: m.status,
  }))
  const lessonWeekStars = (missionRows ?? [])
    .filter(m => m.status === 'done' && m.completed_at && m.completed_at >= new Date(Date.now() - 7 * 86400000).toISOString())
    .reduce((sum, m) => sum + m.stars, 0)

  // The child's own streak: consecutive days with at least one quest
  // ticked, ending today or yesterday. Pending counts, because the tick
  // is the child's act; approval is the parent's.
  const tickDays = new Set((streakTicksRes.data ?? []).map(t => String(t.tick_date)))
  const dayStr = (o: number) => new Date(Date.now() - o * 86400000).toISOString().slice(0, 10)
  let streakDays = 0
  if (tickDays.has(dayStr(0)) || tickDays.has(dayStr(1))) {
    let offset = tickDays.has(dayStr(0)) ? 0 : 1
    while (tickDays.has(dayStr(offset))) { streakDays++; offset++ }
  }

  // The child's week at a glance: how many quests they ticked each of the
  // last seven days, built from the same tick history the streak uses.
  const weekChart = Array.from({ length: 7 }, (_, i) => {
    const off = 6 - i
    const d = dayStr(off)
    const count = (streakTicksRes.data ?? []).filter(t => String(t.tick_date) === d).length
    const dow = new Date(`${d}T00:00:00Z`).getUTCDay()
    return { label: 'SMTWTFS'[dow], count, today: off === 0 }
  })

  const quests = (questsRes.data ?? []).filter(q => questDueToday(q.schedule, (q as { schedule_days?: number[] | null }).schedule_days))
  const laterQuests = (questsRes.data ?? [])
    .filter(q => !questDueToday(q.schedule, (q as { schedule_days?: number[] | null }).schedule_days))
    .map(q => ({ title: q.title, emoji: q.emoji, schedule: q.schedule }))
  const starsByQuest = new Map((questsRes.data ?? []).map(q => [q.id, q.stars]))
  const weekStars = (weekTicksRes.data ?? []).reduce((sum, t) => sum + (starsByQuest.get(t.quest_id) ?? 1), 0)
    + lessonWeekStars

  // Once quests stay due until ticked, then leave the list on later days
  // (today's tick still shows today, as waiting or done). Finished kid
  // lessons are recognised by their quest title.
  const onceIds = (questsRes.data ?? []).filter(q => q.schedule === 'once').map(q => q.id)
  const { data: onceTicks } = onceIds.length
    ? await supabase.from('quest_ticks')
        .select('quest_id, tick_date')
        .in('quest_id', onceIds)
        .neq('status', 'rejected')
    : { data: [] as { quest_id: string; tick_date: string }[] }
  const tickedOnceBeforeToday = new Set(
    (onceTicks ?? []).filter(t => String(t.tick_date) < today).map(t => t.quest_id)
  )
  const tickedOnceEver = new Set((onceTicks ?? []).map(t => t.quest_id))
  const dueQuests = quests.filter(q => !(q.schedule === 'once' && tickedOnceBeforeToday.has(q.id)))

  const doneLessonKeys = KID_LESSONS
    .filter(l => {
      const base = kidLessonBaseTitle(l)
      return (questsRes.data ?? []).some(q => String(q.title).startsWith(base) && tickedOnceEver.has(q.id))
    })
    .map(l => l.key)

  // The child's stage decides which games and mini lessons are age
  // appropriate, so a four year old never meets an eleven year old's game.
  const ageBand = childRes.data?.age_band as AgeBand | undefined
  const stageId = ageBand ? getStageFromAgeBand(ageBand).id : 2

  // Watch together adventures: the co view lessons, age gated forward
  // only. A child sees everything from Stage 1 up to their own stage,
  // so a late joiner still gets the early habits, and the copy calls
  // them earlier adventures, never catching up.
  const [{ lessons: adventureLessons }, adventureCompletions] = await Promise.all([
    getParentLessons(supabase),
    getCompletionsForChild(supabase, link.child_id),
  ])
  const adventures = adventureLessons
    .filter(l => l.stage_id <= stageId)
    .map(l => {
      const completion = adventureCompletions.get(l.lesson_code)
      return {
        code: l.lesson_code,
        title: l.title,
        catchphrase: l.catchphrase,
        stageId: l.stage_id,
        posterUrl: l.poster_url ?? null,
        done: Boolean(completion),
        timesCompleted: completion?.times_completed ?? 0,
      }
    })

  // The star bank (earned ever, spent as screen time, what is left) and
  // the child's own quest asks. Both tables land with migration 047, so
  // failures fall back to empty rather than breaking the page.
  const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString()
  const [banks, requestsRes, weekSpendsRes, parentProfileRes] = await Promise.all([
    getStarBanks(supabase, link.user_id, [link.child_id]),
    supabase.from('quest_requests')
      .select('id, title, emoji, status, created_at')
      .eq('child_id', link.child_id)
      .gte('created_at', weekAgoIso)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('star_spends')
      .select('minutes')
      .eq('child_id', link.child_id)
      .gte('created_at', weekAgoIso),
    // The parent's access decides whether the printables show on the child
    // link: a member family gets the paper adventures, a free family does
    // not, matching the paywall on the parent side.
    supabase.from('profiles').select('subscription_status, trial_ends_at, email').eq('id', link.user_id).maybeSingle(),
  ])
  const printablesUnlocked = hasFullAccess(
    parentProfileRes.data as { subscription_status?: string | null; trial_ends_at?: string | null } | null,
    (parentProfileRes.data as { email?: string | null } | null)?.email,
  )
  const bank = banks[0] ?? { child_id: link.child_id, earned: 0, spent: 0, balance: 0, minutes: 0 }
  const usedWeekMinutes = (weekSpendsRes.data ?? []).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)
  // A live device time session, if one is running, so the countdown picks
  // up where it left off on a refresh.
  const activeSession = await getActiveSession(supabase, link.child_id)

  // The recommended daily viewing for this age, and how much has already been
  // logged today, so the child's timer can show the balance and gently pause
  // once they have had their healthy amount. A soft guide, never a hard block.
  const usedTodayMap = await getMinutesUsedToday(supabase, link.user_id, [link.child_id])
  const usedTodayMinutes = usedTodayMap.get(link.child_id) ?? 0
  // The daily limit the child's app shows and caps against: the parent's own
  // number if they set one, otherwise the healthy age recommendation.
  const parentLimit = (childRes.data as { daily_limit_minutes?: number | null } | null)?.daily_limit_minutes
  const recommendedMinutes = parentLimit != null && parentLimit > 0
    ? parentLimit
    : recommendedDailyMinutes(ageBand ?? null)

  // The child's stage library lessons and their passes, the exact same count
  // the parent's progress report uses, so the road's proof and the report can
  // never disagree. Fails soft to nulls on any read error.
  //
  // From the same read we also pick the child's focus lesson: the next one for
  // this stage they have not passed yet, in the curriculum's own order. This
  // is what the Today "Learn" headline points at, so the real Rosenshine
  // lessons are put in front of the child one at a time, and passing one
  // ticks the parent's progress report through the lesson player. Nulls fall
  // back to the mini lessons on any read error.
  let stageLessonsPassed: number | null = null
  let stageLessonsTotal: number | null = null
  let focusLesson: { id: string; title: string; emoji: string; stars: number } | null = null
  {
    const stageSlug = ageBand ? getStageFromAgeBand(ageBand).name.toLowerCase() : 'builder'
    const [{ data: stageLessonRows, error: lessonsErr }, { data: passRows, error: passErr }] = await Promise.all([
      supabase.from('lessons').select('id, title, category, sort_order')
        .eq('audience', 'parent').eq('stage_id', stageSlug).neq('status', 'stub')
        .order('sort_order', { ascending: true }),
      supabase.from('lesson_completions').select('lesson_id, passed').eq('user_id', link.user_id).eq('lesson_source', 'lesson'),
    ])
    if (!lessonsErr && !passErr && (stageLessonRows ?? []).length > 0) {
      const rows = stageLessonRows ?? []
      const ids = new Set(rows.map(l => l.id))
      const passedIds = new Set(
        (passRows ?? []).filter(c => c.passed !== false && ids.has(c.lesson_id)).map(c => c.lesson_id),
      )
      stageLessonsTotal = ids.size
      stageLessonsPassed = passedIds.size
      const next = rows.find(l => !passedIds.has(l.id))
      if (next) {
        focusLesson = {
          id: next.id as string,
          title: next.title as string,
          emoji: KID_LESSON_EMOJI[String(next.category)] ?? '📘',
          stars: 10,
        }
      }
    }
  }

  // Notes and scripts a grown up shared to this child's own app, newest first.
  // These land here instead of a text message, and stay to be read again.
  const { data: shareRows } = await supabase
    .from('child_shares')
    .select('id, kind, title, body, created_at, read_at')
    .eq('child_id', link.child_id)
    .order('created_at', { ascending: false })
    .limit(12)
  const notes = (shareRows ?? []).map(n => ({
    id: n.id as string,
    kind: n.kind as string,
    title: n.title as string,
    body: n.body as string,
    read: Boolean(n.read_at),
  }))

  // From school, for the child themselves: the reminders their grown up sent
  // through (one offs due today) and any weekly routine set to reach them
  // automatically on its day. These show as a banner on the child's own
  // screen that goes red as a timed one nears, so the child sees it too, not
  // only the parent. Only ever the items meant for the child.
  const todayWeekday = new Date().getDay()
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const tomorrowWeekday = (todayWeekday + 1) % 7
  const { data: schoolRows } = await supabase
    .from('school_actions')
    .select('id, title, kind, due_date, due_time, recurs_weekday, sent_to_child, auto_send_to_child, cleared_on')
    .eq('user_id', link.user_id)
    .eq('status', 'open')
    .or(`due_date.eq.${today},due_date.eq.${tomorrowDate},recurs_weekday.eq.${todayWeekday},recurs_weekday.eq.${tomorrowWeekday}`)
  // Child appropriate kinds mirror to the child's own banner so they know
  // too: a PE kit or homework routine, never a parent only thing like a
  // payment. A weekly routine shows on its day by default (no need for the
  // grown up to tick anything), and steps back once cleared for the week.
  // Tomorrow's child items also show, in their own calm heads up, so the
  // child can get the kit ready the night before, the same nudge the parent
  // gets by push.
  const CHILD_KINDS = new Set(['kit', 'event', 'homework'])
  const schoolToday = (schoolRows ?? [])
    .map(a => {
      const cleared = String((a as { cleared_on?: string | null }).cleared_on ?? '')
      const isRoutine = a.recurs_weekday != null
      const childOk = isRoutine ? (a.auto_send_to_child || CHILD_KINDS.has(a.kind as string)) : (a.sent_to_child || CHILD_KINDS.has(a.kind as string))
      if (!childOk) return null
      const dueToday = isRoutine ? a.recurs_weekday === todayWeekday : a.due_date === today
      const dueTomorrow = isRoutine ? a.recurs_weekday === tomorrowWeekday : a.due_date === tomorrowDate
      // A routine cleared for today steps back from today, but still shows a
      // tomorrow heads up if it comes round again tomorrow.
      const when: 'today' | 'tomorrow' | null =
        dueToday && cleared !== today ? 'today' : dueTomorrow ? 'tomorrow' : null
      if (!when) return null
      return {
        id: a.id as string,
        title: a.title as string,
        kind: a.kind as string,
        time: typeof a.due_time === 'string' ? (a.due_time as string).slice(0, 5) : null,
        when,
      }
    })
    .filter((x): x is { id: string; title: string; kind: string; time: string | null; when: 'today' | 'tomorrow' } => x !== null)

  // Our family deal: the agreement the parent and child built and signed
  // together. The child sees it in Our deal, so the contract they agreed is
  // always there to read, not only on the parent side. Only the sections the
  // family actually filled in show, in child friendly words.
  const { data: agreementRow } = await supabase
    .from('family_agreements')
    .select('family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements, signed_by_parent, signed_by_child')
    .eq('user_id', link.user_id)
    .maybeSingle()
  const agreementItems: { title: string; body: string }[] = []
  if (agreementRow) {
    const add = (title: string, body?: string | null) => {
      const t = (body ?? '').trim()
      if (t) agreementItems.push({ title, body: t })
    }
    add('What matters to us', agreementRow.family_values as string | null)
    const bedtime = [agreementRow.bedroom_rule_time, agreementRow.bedroom_rule_location]
      .map(s => String(s ?? '').trim()).filter(Boolean).join(' · ')
    add('Phones at bedtime', bedtime)
    add('Apps and social media', agreementRow.social_media_terms as string | null)
    add('If something goes wrong', agreementRow.when_things_go_wrong as string | null)
    add('Our extra promises', agreementRow.extra_agreements as string | null)
  }
  const agreementSigned = Boolean(agreementRow?.signed_by_parent && agreementRow?.signed_by_child)

  // The age based timer contract and the gifted time still owed. Both land
  // with migration 080, so each read is its own best effort query that fails
  // soft on an older database: the contract gate simply waits until the
  // columns exist, and the owed row stays hidden until the table does.
  let contractAgreedAt: string | null = null
  let contractReady = false
  {
    const { data, error } = await supabase
      .from('kid_links').select('agreed_at').eq('token', token).maybeSingle()
    if (!error) {
      contractReady = true
      contractAgreedAt = (data?.agreed_at as string | null) ?? null
    }
  }
  let giftStarsOwed = 0
  {
    const { data, error } = await supabase
      .from('gift_debts').select('stars_owed')
      .eq('child_id', link.child_id).eq('settled', false)
    if (!error) giftStarsOwed = (data ?? []).reduce((sum, d) => sum + (Number(d.stars_owed) || 0), 0)
  }

  // Who starts the timer for this child, unset reading as ask, plus the
  // latest screen time ask (last twelve hours, so a stale answer never
  // greets them) and any unread nudges. The nudges table lands with
  // migration 081, so that read fails soft to none.
  let deviceTrust = 'ask'
  {
    const { data, error } = await supabase
      .from('children').select('device_trust').eq('id', link.child_id).maybeSingle()
    if (!error && (data?.device_trust === 'watch' || data?.device_trust === 'trusted')) {
      deviceTrust = data.device_trust
    }
  }
  const askSinceIso = new Date(Date.now() - 12 * 3600000).toISOString()
  let initialAsk: { id: string; device: string; minutes: number; status: 'pending' | 'approved' | 'declined' } | null = null
  {
    const { data, error } = await supabase
      .from('device_requests')
      .select('id, device, minutes, status')
      .eq('child_id', link.child_id)
      .gte('created_at', askSinceIso)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!error && data && ['pending', 'approved', 'declined'].includes(String(data.status))) {
      initialAsk = {
        id: String(data.id), device: String(data.device),
        minutes: Number(data.minutes), status: data.status as 'pending' | 'approved' | 'declined',
      }
    }
  }
  let initialNudges: { id: string; message: string }[] = []
  {
    const { data, error } = await supabase
      .from('kid_nudges')
      .select('id, message')
      .eq('child_id', link.child_id)
      .eq('seen', false)
      .order('created_at', { ascending: false })
      .limit(4)
    if (!error) initialNudges = (data ?? []).map(n => ({ id: String(n.id), message: String(n.message) }))
  }

  // A printable a grown up sent straight to this child lands at the top of
  // their to do. The oldest open one leads. Fails soft to none before 089.
  let assignedPrintable: { key: string; title: string; emoji: string; stars: number; sheetUrl: string } | null = null
  {
    const { data } = await supabase.from('printable_assignments')
      .select('printable_key')
      .eq('child_id', link.child_id).is('cleared_at', null)
      .order('created_at', { ascending: true }).limit(1).maybeSingle()
    const p = data ? getPrintable(String(data.printable_key)) : null
    if (p) assignedPrintable = { key: p.key, title: p.title, emoji: p.emoji, stars: p.stars, sheetUrl: p.sheetUrl }
  }

  return (
    <KidQuestScreen
      assignedPrintable={assignedPrintable}
      token={token}
      agreementItems={agreementItems}
      agreementSigned={agreementSigned}
      childName={childRes.data?.name ?? 'Superstar'}
      buddy={(childRes.data?.buddy as string | null) ?? null}
      accent={(childRes.data?.accent as string | null) ?? null}
      stageId={stageId}
      quests={dueQuests}
      todayTicks={todayTicksRes.data ?? []}
      weekStars={weekStars}
      goal={goalRes.data ?? null}
      streakDays={streakDays}
      missions={missions}
      adventures={adventures}
      laterQuests={laterQuests}
      doneLessonKeys={doneLessonKeys}
      bank={bank}
      usedWeekMinutes={usedWeekMinutes}
      usedTodayMinutes={usedTodayMinutes}
      recommendedMinutes={recommendedMinutes}
      stageLessonsPassed={stageLessonsPassed}
      stageLessonsTotal={stageLessonsTotal}
      focusLesson={focusLesson}
      printablesUnlocked={printablesUnlocked}
      activeSession={activeSession}
      weekChart={weekChart}
      requests={(requestsRes.data ?? []) as { id: string; title: string; emoji: string; status: string }[]}
      schoolToday={schoolToday}
      notes={notes}
      contractLevel={contractLevelFor(ageBand ?? null)}
      contractAgreedAt={contractAgreedAt}
      contractReady={contractReady}
      giftStarsOwed={giftStarsOwed}
      deviceTrust={deviceTrust}
      initialAsk={initialAsk}
      initialNudges={initialNudges}
    />
  )
}
