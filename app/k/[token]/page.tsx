import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { questDueToday } from '@/lib/quests/due'
import { isPrintableAskTitle } from '@/lib/quests/printable-ask'
import { getStarBanks } from '@/lib/quests/bank'
import { getHolidayBanks, holidayBankLine } from '@/lib/quests/holiday-bank'
import { getFamilyRegion } from '@/lib/learning/region'
import { KID_LESSONS, kidLessonBaseTitle } from '@/lib/quests/kid-lessons'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { getParentLessons, getCompletionsForChild } from '@/lib/lessons/parent-lessons'
import { getActiveSession, isAskLive } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { hasFullAccess } from '@/lib/access'
import { contractLevelFor } from '@/lib/content/kid-contract'
import { getPrintable } from '@/lib/printables/registry'
import { isChildVisible, type ChildVisibleAction } from '@/lib/school/child-items'
import { earnedFriends, streakCurrency } from '@/lib/pathway/streak-unlock'
import { starWeekStart } from '@/lib/quests/star-week'
import KidQuestScreen from './KidQuestScreen'
import { toFamilyDevice, type FamilyDevice, type FamilyDeviceRow } from '@/lib/devices/family'
import { getStickerBook } from '@/lib/stickers/book'
import { stickerArt } from '@/lib/stickers/catalog'
import type { KidSticker } from '@/components/kid/KidStickers'

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
    supabase.from('children').select('name, age_band, buddy, accent, daily_limit_minutes, date_of_birth').eq('id', link.child_id).maybeSingle(),
    supabase.from('family_quests')
      .select('id, title, emoji, stars, schedule, schedule_days, blocks_screens, created_at')
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

  // This week at school, phase 2 of the curriculum plan: the same weekly
  // objective the parent sees lands here as ONE calm card a week, never a
  // feed. The child taps that they practised it, the tap becomes a pending
  // quest tick, and the stars land when the parent approves. In the school
  // holidays there is no card at all.
  let weekMission: { line: string; second: string | null; state: 'open' | 'pending' | 'done' } | null = null
  const dob = (childRes.data as { date_of_birth?: string | null } | null)?.date_of_birth
  if (dob) {
    const { getWeekBrief } = await import('@/lib/learning/this-week')
    const brief = await getWeekBrief(supabase, dob)
    if (brief && !brief.preview) {
      const monday = (() => {
        const d = new Date()
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
        d.setHours(0, 0, 0, 0)
        return d.toISOString()
      })()
      const { data: schoolQuest } = await supabase
        .from('family_quests')
        .select('id, quest_ticks(status)')
        .eq('user_id', link.user_id)
        .eq('child_id', link.child_id)
        .eq('title', `School: ${brief.questTitle}`)
        .gte('created_at', monday)
        .limit(1)
        .maybeSingle()
      const tickStatus = ((schoolQuest?.quest_ticks as { status: string }[] | null) ?? [])[0]?.status
      weekMission = {
        line: brief.lead,
        second: brief.second ? brief.second.lead : null,
        state: tickStatus === 'approved' ? 'done' : schoolQuest ? 'pending' : 'open',
      }
    }
  }

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

  // The child's week at a glance: Monday to Sunday, built from the same tick
  // history the streak uses.
  //
  // Justin: "the days should be m to s so Monday to Sunday."
  //
  // It used to be a rolling seven days ending today, which is why his screenshot
  // reads T W T F S S M with Monday on the right hand end. That is a correct
  // window and the wrong shape: a week has a start, every child knows where it
  // is, and a strip whose first column moves every day cannot be compared with
  // yesterday's or with a sibling's. It also disagreed with the star week, which
  // resets on Monday, so "this week" meant two different things on one screen.
  //
  // Days after today are shown empty rather than hidden, so the week keeps its
  // shape all week and a child can see what is still to come.
  const dowToday = new Date(`${dayStr(0)}T00:00:00Z`).getUTCDay()
  // Sunday is 0 in JS, and 6 in a week that starts on Monday.
  const sinceMonday = (dowToday + 6) % 7
  const weekChart = Array.from({ length: 7 }, (_, i) => {
    const off = sinceMonday - i
    const d = dayStr(off)
    const count = off < 0 ? 0 : (streakTicksRes.data ?? []).filter(t => String(t.tick_date) === d).length
    return { label: 'MTWTFSS'[i], count, today: off === 0 }
  })

  // A printable ask that was turned into a job on an older build (before the
  // decide endpoint stopped doing that) is not a real job, so it never shows in
  // the child's list as one. New asks never reach here at all.
  const realQuests = (questsRes.data ?? []).filter(q => !isPrintableAskTitle(q.title as string))
  const quests = realQuests.filter(q => questDueToday(q.schedule, (q as { schedule_days?: number[] | null }).schedule_days))
  const laterQuests = realQuests
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
    // Age band passed so the weekly ceiling is this child's own guidance.
    getStarBanks(supabase, link.user_id, [link.child_id], { [link.child_id]: (childRes.data?.age_band as string | null) ?? null }),
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
  const bank = banks[0] ?? { child_id: link.child_id, earned: 0, spent: 0, balance: 0, minutes: 0, weekEarned: 0, weekSpent: 0, weekBalance: 0, weekMinutes: 0, weekCap: 0, weekSurplus: 0 }
  const usedWeekMinutes = (weekSpendsRes.data ?? []).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)

  // The holiday bank: screen time this child earned beyond what an ordinary
  // week had room for, saved for the school holidays.
  //
  // The child app has to be the place this is said. The Monday rollover pushes
  // a notification when it banks, but a push is a moment and this is a running
  // balance: a child who did extra jobs in June needs to be able to look, in
  // August, and see why there is more time now. Reads soft to zeros before
  // migration 127, and holidayBankLine returns null in term time with an empty
  // bank, so a child it has never happened to sees nothing at all.
  // Which school calendar this family keeps, read once and used for both the
  // bank and the daily guide below, so the two can never disagree about whether
  // it is the holidays.
  const region = await getFamilyRegion(supabase, link.user_id)
  const holidayBank = (await getHolidayBanks(supabase, link.user_id, [link.child_id], new Date(), region))[0] ?? null
  const holidayLine = holidayBank ? holidayBankLine(holidayBank) : null
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
    : recommendedDailyMinutes(ageBand ?? null, { region })

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
        // Same rule as the child lessons list: no authored deck means it is
        // not a child lesson yet. Without this the focus lesson row could
        // offer a lesson whose page refuses to open, which is exactly the
        // dead end Justin hit on 8 August: the app's most enthusiastic
        // moment, a child going for their lesson, ending on a 404.
        .not('slides', 'is', null)
        .order('sort_order', { ascending: true }),
      supabase.from('lesson_completions').select('lesson_id, passed, completed_at').eq('user_id', link.user_id).eq('lesson_source', 'lesson'),
    ])
    if (!lessonsErr && !passErr && (stageLessonRows ?? []).length > 0) {
      const rows = stageLessonRows ?? []
      const ids = new Set(rows.map(l => l.id))
      const passedIds = new Set(
        (passRows ?? []).filter(c => c.passed !== false && ids.has(c.lesson_id)).map(c => c.lesson_id),
      )
      stageLessonsTotal = ids.size
      stageLessonsPassed = passedIds.size
      // One lesson a week, the other door.
      //
      // The five a day caps its own lesson row (see /api/kid/day), but the
      // Today list offers this focus lesson separately and every single day, so
      // capping one and not the other would have left the cadence exactly where
      // it was. Justin: "we only feed one per week at most."
      //
      // Counted on PASSES rather than on what was offered: a child who opened a
      // lesson and did not finish it has not had their lesson this week, and
      // hiding the next one would strand them.
      const weekAgoLesson = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10)
      const passedThisWeek = (passRows ?? []).some(
        c => c.passed !== false && ids.has(c.lesson_id)
          && String((c as { completed_at?: string | null }).completed_at ?? '').slice(0, 10) >= weekAgoLesson,
      )
      const next = passedThisWeek ? undefined : rows.find(l => !passedIds.has(l.id))
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
  // The whole open list rather than only today and tomorrow, and it is one
  // fewer query than it looks: the week viewer needs to know whether there is
  // anything to look at before it offers a link, and a family's school list is
  // a handful of rows, so narrowing it in SQL and then asking again for a count
  // would cost more than reading it once.
  // Child appropriate kinds mirror to the child's own banner so they know
  // too: a PE kit or homework routine, never a parent only thing like a
  // payment. A weekly routine shows on its day by default (no need for the
  // grown up to tick anything), and steps back once cleared for the week.
  // Tomorrow's child items also show, in their own calm heads up, so the
  // child can get the kit ready the night before, the same nudge the parent
  // gets by push.
  // The rule lives in lib/school/child-items now, shared with the week viewer,
  // because two copies of "which reminders may a child see" is how a payment
  // reminder eventually turns up on a nine year old's phone.
  const schoolToday = (schoolRows ?? [])
    .map(a => {
      const cleared = String((a as { cleared_on?: string | null }).cleared_on ?? '')
      const isRoutine = a.recurs_weekday != null
      if (!isChildVisible(a as ChildVisibleAction)) return null
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

  // Is there a week worth opening? The link to it only appears when there is
  // something on it, because a door onto an empty room is worse than no door.
  const schoolWeekCount = (schoolRows ?? []).filter(a => isChildVisible(a as ChildVisibleAction)).length

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
  let initialAsk: { id: string; device: string; minutes: number; status: 'pending' | 'approved' | 'declined' } | null = null
  {
    const { data, error } = await supabase
      .from('device_requests')
      .select('id, device, minutes, status, created_at')
      .eq('child_id', link.child_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    // Same freshness rule as the live poll: pending or declined stales at twelve
    // hours, an approved yes stays startable for a full day.
    if (!error && data && ['pending', 'approved', 'declined'].includes(String(data.status))
        && isAskLive(String(data.status), String(data.created_at))) {
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
  let assignedPrintable: { key: string; title: string; emoji: string; stars: number; sheetUrl: string; previewUrl: string } | null = null
  {
    const { data } = await supabase.from('printable_assignments')
      .select('printable_key')
      .eq('child_id', link.child_id).is('cleared_at', null)
      .order('created_at', { ascending: true }).limit(1).maybeSingle()
    const p = data ? getPrintable(String(data.printable_key)) : null
    // The finished products print their real colour in edition; the card shows
    // the real cover so the child sees exactly what a grown up sent.
    if (p) assignedPrintable = { key: p.key, title: p.title, emoji: p.emoji, stars: p.stars, sheetUrl: p.pdfColourIn ?? p.sheetUrl, previewUrl: p.previewUrl }
  }

  // The Planet Friends this child has earned, so the app only ever offers those.
  //
  // The family's finished pathway stages used to count toward this, taken as a
  // max against the days. That read getAllStagesProgress by user_id, which is
  // the PARENT's lessons and scripts, so a grown up working through Foundation
  // handed the Friend to a child who had done nothing. Gone. Friends are
  // completed days now, the same 2, 10, 22, 38, 58 the sticker book prints on
  // every locked one.
  //
  // Two counters, combined with max in streakCurrency. The jobs run was the
  // only one being counted, which is why finishing all five of the five a day
  // bought a child precisely nothing. Both reads fail soft to zero: a Friend
  // count is a reward, and a query that cannot answer should hand back the
  // quiet number rather than take the child's whole page down.
  let jobStreaks = 0
  try {
    const { count } = await supabase
      .from('job_streaks')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', link.child_id)
    jobStreaks = count ?? 0
  } catch { jobStreaks = 0 }

  // One completed day, one streak. Fails soft before migration 134.
  let completedDays = 0
  try {
    const { count } = await supabase
      .from('kid_days')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', link.child_id)
      .not('completed_at', 'is', null)
    completedDays = count ?? 0
  } catch { completedDays = 0 }

  const completedStreaks = streakCurrency(jobStreaks, completedDays)
  const earnedStages = earnedFriends(completedStreaks)

  // Sheets finished away from a screen and confirmed by a grown up. The parent
  // stats already count these into the off screen total; this is so the child
  // sees their own real world tally too, in the place they do the work. Fails
  // soft before migration 087, where it simply reads zero.
  let sheetsDone = 0
  let sheetStars = 0
  try {
    const { data: sheets } = await supabase
      .from('printable_completions')
      .select('stars')
      .eq('child_id', link.child_id)
      .eq('status', 'confirmed')
    sheetsDone = (sheets ?? []).length
    sheetStars = (sheets ?? []).reduce((sum, r) => sum + (Number(r.stars) || 0), 0)
  } catch { sheetsDone = 0; sheetStars = 0 }

  // The child's sticker book, and the earned but not yet celebrated set.
  //
  // This read used to live on /k/[token]/path. The road is gone from the child
  // app (Justin: "yes lets lose the pathway as advised for children only NOT
  // parents") and the book came home with it, into My wins. Losing the page
  // would otherwise have taken the only server side celebration in the whole
  // child app down with it: migration 109's `celebrated` flag, which is what
  // makes a new sticker pop exactly once per child rather than once per browser.
  //
  // Both reads fail soft, so a family on an older database simply sees no book.
  let kidStickers: KidSticker[] = []
  let celebrateStickers: string[] = []
  let celebratedStickers: string[] = []
  try {
    const book = await getStickerBook(supabase, link.user_id, { id: link.child_id, age_band: ageBand ?? null })
    kidStickers = book.stickers.map(s => ({
      key: s.key, name: s.name, emoji: s.emoji, art: stickerArt(s),
      colour: s.colour, earned: s.earned, rule: s.rule,
      // What it costs and how close they are. Both already existed on the
      // book and neither was reaching the child, which is why a locked
      // sticker could only say "Locked" over a bare number.
      earn: s.earn, have: s.have, need: s.need,
    }))
    // Both halves of the flag, because the child app needs each for a
    // different thing: what is still owed a celebration, and what has already
    // had one. Without the second, a Friend earned on the live path could be
    // celebrated again on another device, which is the thing Justin actually
    // saw. One read, two lists.
    const { data, error } = await supabase
      .from('earned_stickers').select('sticker_key, celebrated')
      .eq('child_id', link.child_id)
    if (!error) {
      const rows = (data ?? []) as { sticker_key: string; celebrated?: boolean | null }[]
      celebrateStickers = rows.filter(r => !r.celebrated).map(r => String(r.sticker_key))
      celebratedStickers = rows.filter(r => r.celebrated).map(r => String(r.sticker_key))
    }
  } catch { kidStickers = []; celebrateStickers = []; celebratedStickers = [] }

  // Has this child already seen the streak screen this star week?
  //
  // Justin, 8 August 2026: the streak should "come up once per week so reminds
  // them once per week what they have achieved, as we show streaks in other
  // places." It fired on every completed day, which for a child doing their
  // five a day is every day.
  //
  // Read on its own and guarded, not folded into the children select above,
  // because streak_week_seen arrives with migration 172, migrations here are
  // run by hand, and naming a column that does not exist yet fails the WHOLE
  // query it is part of. That query is the one that fetches the child's name
  // and age band, so folding it in would have taken the child's home screen
  // down between deploy and migration.
  let streakWeekSeen: string | null = null
  try {
    const { data, error } = await supabase
      .from('children').select('streak_week_seen').eq('id', link.child_id).maybeSingle()
    if (!error) streakWeekSeen = (data as { streak_week_seen?: string | null } | null)?.streak_week_seen ?? null
  } catch { streakWeekSeen = null }

  // The screens this family owns, for the timer picker. Fails soft: before
  // migration 106 there is no table, and the picker falls back to the four
  // kinds exactly as it did before.
  let familyDevices: FamilyDevice[] = []
  try {
    const { data } = await supabase
      .from('family_devices')
      .select('id, label, kind, guide_key, shared, retired_at')
      .eq('user_id', link.user_id)
      .is('retired_at', null)
      .order('created_at', { ascending: true })
    familyDevices = ((data ?? []) as FamilyDeviceRow[]).map(toFamilyDevice)
  } catch { familyDevices = [] }

  return (
    <KidQuestScreen
      familyDevices={familyDevices}
      stickers={kidStickers}
      celebrateStickers={celebrateStickers}
      celebratedStickers={celebratedStickers}
      streakWeekSeen={streakWeekSeen}
      starWeek={starWeekStart()}
      sheetsDone={sheetsDone}
      sheetStars={sheetStars}
      earnedStages={earnedStages}
      completedStreaks={completedStreaks}
      jobStreaks={jobStreaks}
      completedDays={completedDays}
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
      weekMission={weekMission}
      adventures={adventures}
      laterQuests={laterQuests}
      doneLessonKeys={doneLessonKeys}
      bank={bank}
      holidayLine={holidayLine}
      holidayMinutes={holidayBank?.remaining ?? 0}
      holidaySpendable={holidayBank?.spendableNow ?? false}
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
      schoolWeekCount={schoolWeekCount}
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
