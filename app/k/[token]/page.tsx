import { notFound } from 'next/navigation'
import type { DrawnKey } from '@/components/printables/drawn'
import { createAdminClient } from '@/lib/supabase/admin'
import { readKidJobs } from '@/lib/kid/jobs-read'
import { getStarBanks } from '@/lib/quests/bank'
import { starLessonTitles } from '@/lib/quests/star-lesson-catalogue'
import { getHolidayBanks, holidayBankLine } from '@/lib/quests/holiday-bank'
import { getFamilyRegion } from '@/lib/learning/region'
import { KID_LESSONS, kidLessonBaseTitle } from '@/lib/quests/kid-lessons'
import { getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { getParentLessons, getCompletionsForChild } from '@/lib/lessons/parent-lessons'
import { getActiveSession, isAskLive } from '@/lib/quests/device-time'
import { getMinutesUsedToday } from '@/lib/quests/usage'
import { getTimeSettings, getCoreUsedToday, checkProtectedWindow, PROTECTED_CHILD_LINE } from '@/lib/quests/time-tiers'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import { dealLinesFrom } from '@/lib/content/agreement-clauses'
import { promisesFrom } from '@/lib/content/agreement-promises'
import { hasFullAccess } from '@/lib/access'
import { contractLevelFor } from '@/lib/content/kid-contract'
import { getPrintable } from '@/lib/printables/registry'
import { isChildVisible, isHeldForHolidays, type ChildVisibleAction } from '@/lib/school/child-items'
import { earnedFriends, streakCurrency } from '@/lib/pathway/streak-unlock'
import { buildPassportSections } from '@/lib/pathway/passport-sections'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import { getReadinessAreas } from '@/lib/pathway/readiness-areas'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import type { Stamp as PassportStamp } from '@/components/pathway/PassportStamps'

// The five stages, in order, so the child's read only book prints the same
// spine the parent's does. Named here rather than imported because the parent
// page builds them inline too and there is no shared list yet.
const STAGE_ORDER: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
const STAGE_TITLES = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent']
const STAGE_AGES = ['4 to 7', '8 to 10', '11 to 13', '13 to 15', '16 plus']
import { starWeekStart } from '@/lib/quests/star-week'
import KidQuestScreen from './KidQuestScreen'
import { tierFor } from '@/lib/planet/logic'
import { PLANET_FRIENDS_LIVE } from '@/lib/planet/flag'
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
  const weekAgoIso = new Date(Date.now() - 7 * 86400000).toISOString()

  // A read that may throw (a table or column that lands with a later migration,
  // a dropped connection) resolves to null instead, so it can sit inside a
  // Promise.all wave without one failure rejecting every other read in the
  // wave. Each caller below then falls back exactly as its old try/catch did.
  // Reads that were never guarded stay unguarded: a throw there took the page
  // down before and still does.
  const soft = <T,>(p: PromiseLike<T>): Promise<T | null> => Promise.resolve(p).catch(() => null)

  // ── WAVE ONE: everything that needs only the link ───────────────────────────
  //
  // Every read here depends on link.user_id, link.child_id, the token and the
  // clock, and nothing else, so they all go to the database at once and the
  // page waits once for the slowest instead of once per read. Before this most
  // of them sat on their own line, each blocking the next for a full round
  // trip. They keep their original order so the comment that explains each
  // read is still beside it. Anything that needs the child's age band, date of
  // birth or region waits for wave two below.
  const [
    childRes, jobs, weekTicksRes, goalRes, streakTicksRes,
    missionRowsRes,
    { lessons: adventureLessons }, adventureCompletions,
    requestsRes, weekSpendsRes, parentProfileRes,
    region, activeSession, usedTodayMap, coreUsedRes,
    passRowsRes,
    shareRowsRes, schoolRowsRes, runsInHolidaysRes,
    agreementRes, contractRes, giftRes,
    askRes, nudgeRes, remindersRes,
    printableRes, tutorRes,
    jobStreaksRes, passportReads, completedDaysRes, sheetsRes,
    streakWeekSeenRes, familyDevicesRes,
  ] = await Promise.all([
    // device_trust rides along here rather than in a read of its own: it
    // landed with migration 058, long before any database still running this
    // code, and the deal page in this same segment already selects it beside
    // name unguarded. streak_week_seen does NOT ride along, see its own read.
    supabase.from('children').select('name, age_band, buddy, accent, daily_limit_minutes, date_of_birth, passport_code, device_trust').eq('id', link.child_id).maybeSingle(),
    // Which jobs are due and ticked, through the same read the jobs page
    // uses, so the two screens can never disagree about the day.
    readKidJobs(supabase, link.user_id, link.child_id),
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

    // Star lessons sent to this child: pending ones to play, and stars from
    // lessons completed this week join the star bank alongside quest stars.
    // Two queries rather than the old school_lessons(title) join: since the
    // FK dropped in migration 176 there is no relationship for PostgREST to
    // embed across, and the lessons live in the schools schema anyway. The
    // titles read is in wave two, because it needs these ids first.
    supabase
      .from('kid_lesson_missions')
      .select('id, lesson_id, stars, status, completed_at')
      .eq('child_id', link.child_id)
      .order('sent_at', { ascending: false }),

    // Watch together adventures: the co view lessons, age gated forward
    // only. A child sees everything from Stage 1 up to their own stage,
    // so a late joiner still gets the early habits, and the copy calls
    // them earlier adventures, never catching up.
    getParentLessons(supabase),
    getCompletionsForChild(supabase, link.child_id),

    // The child's own quest asks and this week's spends. Both tables land
    // with migration 047, so failures fall back to empty rather than
    // breaking the page. The star bank itself is in wave two: it takes the
    // age band so the weekly ceiling is this child's own guidance.
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

    // Which school calendar this family keeps, read once and used for both the
    // holiday bank and the daily guide below, so the two can never disagree
    // about whether it is the holidays.
    getFamilyRegion(supabase, link.user_id),
    // A live device time session, if one is running, so the countdown picks
    // up where it left off on a refresh.
    getActiveSession(supabase, link.child_id),
    // How much has already been logged today, so the child's timer can show
    // the balance and gently pause once they have had their healthy amount.
    getMinutesUsedToday(supabase, link.user_id, [link.child_id]),
    // Today's core minutes, for the three tiers below. This used to be read
    // only after the settings said the tier had a core, which put it a full
    // round trip behind them. It needs nothing but the link, so it comes
    // along here and is simply unused when the core is zero. Guarded, as it
    // was inside the tiers try.
    soft(getCoreUsedToday(supabase, link.user_id, [link.child_id])),

    // THIS child's passes plus the household's legacy rows. Without the
    // filter, the eldest passing on Monday consumed the one lesson a week
    // gate for every sibling: the youngest opened her app and was told her
    // lesson was done by someone else's afternoon. The stage lessons they are
    // matched against need the age band, so that read is in wave two.
    supabase.from('lesson_completions').select('lesson_id, passed, completed_at').eq('user_id', link.user_id).eq('lesson_source', 'lesson').or(`child_id.eq.${link.child_id},child_id.is.null`),

    // Notes and scripts a grown up shared to this child's own app, newest first.
    // These land here instead of a text message, and stay to be read again.
    supabase
      .from('child_shares')
      .select('id, kind, title, body, created_at, read_at')
      .eq('child_id', link.child_id)
      .order('created_at', { ascending: false })
      .limit(12),

    // From school, for the child themselves: the reminders their grown up sent
    // through (one offs due today) and any weekly routine set to reach them
    // automatically on its day. These show as a banner on the child's own
    // screen that goes red as a timed one nears, so the child sees it too, not
    // only the parent. Only ever the items meant for the child.
    supabase
      .from('school_actions')
      .select('id, title, kind, due_date, due_time, recurs_weekday, sent_to_child, auto_send_to_child, cleared_on')
      .eq('user_id', link.user_id)
      .eq('status', 'open'),
    // Which routines keep going in the school holidays. Read on its own and
    // guarded, not folded into the select above: runs_in_holidays lands with
    // migration 182, migrations run by hand, and naming a missing column fails
    // the whole query it is part of, which here would blank the child's school
    // banner. An error reads as "school time", the truthful default, which is
    // also what holds every routine in August before the column exists.
    soft(supabase
      .from('school_actions')
      .select('id, runs_in_holidays')
      .eq('user_id', link.user_id)
      .eq('status', 'open')),

    // Our family deal: the agreement the parent and child built and signed
    // together. The child sees it in Our deal, so the contract they agreed is
    // always there to read, not only on the parent side.
    supabase
      .from('family_agreements')
      .select('agreement_type, clauses, family_values, bedroom_rule_time, bedroom_rule_location, social_media_terms, when_things_go_wrong, extra_agreements, signed_by_parent, signed_by_child, review_date')
      .eq('user_id', link.user_id)
      .maybeSingle(),

    // The age based timer contract and the gifted time still owed. Both land
    // with migration 080, so each read is its own best effort query that fails
    // soft on an older database: the contract gate simply waits until the
    // columns exist, and the owed row stays hidden until the table does. The
    // agreed_at read is not folded into the link read at the top for the same
    // reason: a missing column would fail the read that finds the child.
    supabase
      .from('kid_links').select('agreed_at').eq('token', token).maybeSingle(),
    supabase
      .from('gift_debts').select('stars_owed')
      .eq('child_id', link.child_id).eq('settled', false),

    // The latest screen time ask (last twelve hours, so a stale answer never
    // greets them) and any unread nudges. The nudges table lands with
    // migration 081, so that read fails soft to none.
    supabase
      .from('device_requests')
      .select('id, device, minutes, status, created_at')
      .eq('child_id', link.child_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('kid_nudges')
      .select('id, message')
      .eq('child_id', link.child_id)
      .eq('seen', false)
      .order('created_at', { ascending: false })
      .limit(4),

    // Whether this child's reminders already work SOMEWHERE. The client cannot
    // know this on its own: on an iPhone the installed app and Safari share
    // nothing, so a child following their link from a text message was shown
    // "add me to your Home Screen, then turn reminders on" on a phone that
    // already buzzes. Justin, 12 August 2026: "still prompting on childs phone
    // to set up notification even though i have set that up." One head count,
    // failing soft to false, and the prompt only ever asks a family that truly
    // has nothing set up.
    supabase
      .from('push_subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', link.user_id)
      .eq('child_id', link.child_id),

    // A printable a grown up sent straight to this child lands at the top of
    // their to do. The oldest open one leads. Fails soft to none before 089.
    supabase.from('printable_assignments')
      .select('printable_key')
      .eq('child_id', link.child_id).is('cleared_at', null)
      .order('created_at', { ascending: true }).limit(1).maybeSingle(),

    // A tutor lesson a grown up read and sent (migration 188). The oldest one
    // still open leads, the same rule as the printable above, so a parent sending
    // two does not bury the first. Fails soft to none before the migration runs:
    // the read errors, the card is absent, and nothing else on the page notices.
    supabase.from('tutor_lessons')
      .select('id, title, emoji, stars, subject')
      .eq('child_id', link.child_id)
      .not('sent_at', 'is', null).is('done_at', null).is('cleared_at', null)
      .order('sent_at', { ascending: true }).limit(1).maybeSingle(),

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
    soft(supabase
      .from('job_streaks')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', link.child_id)),

    // The child's read only copy of the passport, first half: the three reads
    // that need only the link. buildPassportSections needs the stage, so it is
    // in wave two. The three are one soft group because the old try wrapped
    // them together: any one failing meant no book, and it still does.
    //
    // 0 streak weeks: the streak feeds the parent's daily habit row, and the
    // child's book only draws the slots, so counting it would cost a query for
    // a number nothing here renders. childId scopes the lessons to THIS child
    // rather than the family, which is what a passport with their name on it
    // has to mean in a house with two children.
    // The four things, counted by the one rule, so the child's copy of the
    // book shows the same "3 of 7" the parent's does. Lesson counts only.
    // Their own check passes, so the child's copy stamps a page by the one
    // rule (lib/pathway/stamped.ts) and can print the three parts of a pass.
    soft(Promise.all([
      getAllStagesProgress(supabase, link.user_id, 0, link.child_id),
      getReadinessAreas(supabase, link.user_id, link.child_id),
      getPassedStageQuizzes(supabase, link.user_id, link.child_id),
    ])),

    // One completed day, one streak. Fails soft before migration 134.
    soft(supabase
      .from('kid_days')
      .select('id', { count: 'exact', head: true })
      .eq('child_id', link.child_id)
      .not('completed_at', 'is', null)),

    // Sheets finished away from a screen and confirmed by a grown up. The parent
    // stats already count these into the off screen total; this is so the child
    // sees their own real world tally too, in the place they do the work. Fails
    // soft before migration 087, where it simply reads zero.
    soft(supabase
      .from('printable_completions')
      .select('stars')
      .eq('child_id', link.child_id)
      .eq('status', 'confirmed')),

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
    soft(supabase
      .from('children').select('streak_week_seen').eq('id', link.child_id).maybeSingle()),

    // The screens this family owns, for the timer picker. Fails soft: before
    // migration 106 there is no table, and the picker falls back to the four
    // kinds exactly as it did before.
    soft(supabase
      .from('family_devices')
      .select('id, label, kind, guide_key, shared, retired_at')
      .eq('user_id', link.user_id)
      // THEIR devices plus the household's, never a sibling's. The token is
      // one child, so the picker they choose a timer from is their own list.
      .or(`child_id.eq.${link.child_id},child_id.is.null`)
      .is('retired_at', null)
      .order('created_at', { ascending: true })),
  ])

  const missionRows = missionRowsRes.data
  const dob = (childRes.data as { date_of_birth?: string | null } | null)?.date_of_birth

  // The child's stage decides which games and mini lessons are age
  // appropriate, so a four year old never meets an eleven year old's game.
  const ageBand = childRes.data?.age_band as AgeBand | undefined
  const stageId = ageBand ? getStageFromAgeBand(ageBand).id : 2
  const stageSlug = ageBand ? getStageFromAgeBand(ageBand).name.toLowerCase() : 'builder'

  const monday = (() => {
    const d = new Date()
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
  })()

  // ── WAVE TWO: everything that needs the child row, the region or wave one ──
  //
  // These each take something wave one fetched: the age band (star bank, time
  // tiers, stage lessons, sticker book, passport build), the date of birth
  // (this week's brief), the region (holiday bank) or the mission ids (lesson
  // titles). None of them depends on another read in this wave, so they run
  // as one wave, and the page has waited exactly twice after finding the link.
  const [
    missionTitles, banks, holidayBank, tierSettingsRes, stageLessonRes,
    brief, schoolQuestRes, passportBuilt, stickerRead, dailyWeekRes,
  ] = await Promise.all([
    starLessonTitles(supabase, (missionRows ?? []).map(m => m.lesson_id)),
    // The star bank (earned ever, spent as screen time, what is left). Age
    // band passed so the weekly ceiling is this child's own guidance.
    getStarBanks(supabase, link.user_id, [link.child_id], { [link.child_id]: (childRes.data?.age_band as string | null) ?? null }),
    // The holiday bank: screen time this child earned beyond what an ordinary
    // week had room for, saved for the school holidays.
    //
    // The child app has to be the place this is said. The Monday rollover pushes
    // a notification when it banks, but a push is a moment and this is a running
    // balance: a child who did extra jobs in June needs to be able to look, in
    // August, and see why there is more time now. Reads soft to zeros before
    // migration 127, and holidayBankLine returns null in term time with an empty
    // bank, so a child it has never happened to sees nothing at all.
    getHolidayBanks(supabase, link.user_id, [link.child_id], new Date(), region).then(b => b[0] ?? null),
    // The three tiers (migration 223), settings half. Fails soft to null,
    // which the block below reads as the old behaviour: zero core, no window.
    soft(getTimeSettings(supabase, link.user_id, [
      { id: link.child_id, age_band: (ageBand as string | null) ?? null },
    ])),
    // The child's stage library lessons, matched below against the passes
    // from wave one. Same rule as the child lessons list: no authored deck
    // means it is not a child lesson yet. Without this the focus lesson row
    // could offer a lesson whose page refuses to open, which is exactly the
    // dead end Justin hit on 8 August: the app's most enthusiastic moment, a
    // child going for their lesson, ending on a 404.
    supabase.from('lessons').select('id, title, category, sort_order')
      .eq('audience', 'parent').eq('stage_id', stageSlug).neq('status', 'stub')
      .not('slides', 'is', null)
      .order('sort_order', { ascending: true }),
    // This week at school: the brief, from the date of birth. The module is
    // still loaded lazily, as before, just inside the wave.
    dob
      ? import('@/lib/learning/this-week').then(({ getWeekBrief }) => getWeekBrief(supabase, dob))
      : Promise.resolve(null),
    // The school quests raised this week for this child. It used to be read
    // AFTER the brief, filtered on the brief's exact title, which put it a
    // whole round trip behind. A family raises at most a handful of these a
    // week, so all of this week's are read here by their School: prefix and
    // the one with the brief's title is picked out below. Same row, one wave
    // earlier. Skipped entirely without a date of birth, as before.
    dob
      ? supabase
        .from('family_quests')
        .select('id, title, quest_ticks(status)')
        .eq('user_id', link.user_id)
        .eq('child_id', link.child_id)
        .like('title', 'School: %')
        .gte('created_at', monday)
      : Promise.resolve({ data: null }),
    // The passport build, second half of the child's book. Skipped when the
    // three reads above failed, soft to null if it fails itself.
    passportReads
      ? soft(buildPassportSections(
        supabase, link.user_id,
        { id: link.child_id, age_band: ageBand ?? null },
        passportReads[0], stageId,
        { openMoments: 0, solvedMoments: 0, parentReport: null },
      ))
      : Promise.resolve(null),
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
    // They are one soft group because the old try wrapped them together: either
    // failing cleared all three lists, and it still does.
    // ── IN ORDER, NOT IN PARALLEL (14 September 2026) ──────────────────────
    //
    // These two used to run side by side, and the seen read usually finished
    // before the book had written the sticker it just derived, so the load a
    // sticker was earned on was the one load that could not celebrate it. It
    // showed up next time, on a day it meant less. The book writes first now,
    // and tells the parent (notify) on the child's own load only.
    soft(getStickerBook(supabase, link.user_id, { id: link.child_id, age_band: ageBand ?? null }, { notify: { childName: childRes.data?.name ?? null } })
      .then(async book => [
        book,
        // Both halves of the flag, because the child app needs each for a
        // different thing: what is still owed a celebration, and what has
        // already had one. Without the second, a Friend earned on the live path
        // could be celebrated again on another device, which is the thing
        // Justin actually saw. One read, two lists.
        await supabase
          .from('earned_stickers').select('sticker_key, celebrated')
          .eq('child_id', link.child_id),
      ] as const)),
    // This week's daily stickers, for the Every day page and the week row
    // under the five a day. Both read the one column migration 284 wrote.
    soft(supabase
      .from('kid_days').select('day, sticker_awarded_at, completed_at')
      .eq('child_id', link.child_id).gte('day', new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10))),
  ])

  // ── EVERYTHING BELOW IS SHAPING, NO MORE WAITING ────────────────────────────

  const missions = (missionRows ?? []).map(m => ({
    id: m.id,
    title: missionTitles.get(m.lesson_id) ?? 'A lesson from DiGi',
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
  if (brief && !brief.preview) {
    const wanted = `School: ${brief.questTitle}`
    const schoolQuest = (schoolQuestRes.data ?? []).find(q => String(q.title) === wanted) ?? null
    const tickStatus = ((schoolQuest?.quest_ticks as { status: string }[] | null) ?? [])[0]?.status
    weekMission = {
      line: brief.lead,
      second: brief.second ? brief.second.lead : null,
      state: tickStatus === 'approved' ? 'done' : schoolQuest ? 'pending' : 'open',
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

  // The jobs read itself (due, later, ticks, once history) moved to
  // lib/kid/jobs-read, shared with the jobs page. What stays here is only
  // what this screen builds on top of it.
  const { dueQuests, laterQuests, todayTicks, tickedOnceEver, rawQuests } = jobs
  const starsByQuest = new Map(rawQuests.map(q => [q.id, q.stars]))
  const weekStars = (weekTicksRes.data ?? []).reduce((sum, t) => sum + (starsByQuest.get(t.quest_id) ?? 1), 0)
    + lessonWeekStars

  // Finished kid lessons are recognised by their quest title.
  const doneLessonKeys = KID_LESSONS
    .filter(l => {
      const base = kidLessonBaseTitle(l)
      return rawQuests.some(q => String(q.title).startsWith(base) && tickedOnceEver.has(q.id))
    })
    .map(l => l.key)

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

  const printablesUnlocked = hasFullAccess(
    parentProfileRes.data as { subscription_status?: string | null; trial_ends_at?: string | null } | null,
    (parentProfileRes.data as { email?: string | null } | null)?.email,
  )
  const bank = banks[0] ?? { child_id: link.child_id, earned: 0, spent: 0, balance: 0, minutes: 0, weekEarned: 0, weekSpent: 0, weekBalance: 0, weekMinutes: 0, weekCap: 0, weekSurplus: 0 }
  const usedWeekMinutes = (weekSpendsRes.data ?? []).reduce((sum, s) => sum + (Number(s.minutes) || 0), 0)

  const holidayLine = holidayBank ? holidayBankLine(holidayBank) : null

  // The recommended daily viewing for this age, and how much has already been
  // logged today, so the child's timer can show the balance and gently pause
  // once they have had their healthy amount. A soft guide, never a hard block.
  const usedTodayMinutes = usedTodayMap.get(link.child_id) ?? 0

  // The three tiers (migration 223): how much of today's free baseline is
  // left, and whether this moment sits inside a protected window, so the card
  // can show the resting state instead of inviting a start that will only
  // become an ask. Fails soft to zero core and no window, the old behaviour.
  let coreMinutesLeft = 0
  let protectedLine: string | null = null
  try {
    const tierSettings = tierSettingsRes?.get(link.child_id)
    if (tierSettings) {
      if (tierSettings.coreMinutesDaily > 0) {
        // The core read used to sit inside this try, so a failure there
        // skipped the protected window too. Kept the same shape on purpose.
        if (!coreUsedRes) throw new Error('core minutes read failed')
        coreMinutesLeft = Math.max(0, tierSettings.coreMinutesDaily - (coreUsedRes.get(link.child_id) ?? 0))
      }
      const check = checkProtectedWindow(tierSettings, { region })
      if (check.protected) protectedLine = PROTECTED_CHILD_LINE[check.reason]
    }
  } catch { /* fail soft */ }
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
    const { data: stageLessonRows, error: lessonsErr } = stageLessonRes
    const { data: passRows, error: passErr } = passRowsRes
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

  const notes = (shareRowsRes.data ?? []).map(n => ({
    id: n.id as string,
    kind: n.kind as string,
    title: n.title as string,
    body: n.body as string,
    read: Boolean(n.read_at),
  }))

  const todayWeekday = new Date().getDay()
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  const tomorrowWeekday = (todayWeekday + 1) % 7
  const schoolRows = schoolRowsRes.data
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

  const runsInHolidays = new Map<string, boolean>()
  if (runsInHolidaysRes && !runsInHolidaysRes.error) {
    for (const r of (runsInHolidaysRes.data ?? []) as { id: string; runs_in_holidays?: boolean | null }[]) {
      runsInHolidays.set(String(r.id), r.runs_in_holidays === true)
    }
  } /* else pre 182, every routine is school time */

  const tomorrowDay = new Date(Date.now() + 86400000)
  const schoolToday = (schoolRows ?? [])
    .map(a => {
      const cleared = String((a as { cleared_on?: string | null }).cleared_on ?? '')
      const isRoutine = a.recurs_weekday != null
      if (!isChildVisible(a as ChildVisibleAction)) return null
      const hold = { recurs_weekday: a.recurs_weekday as number | null, runs_in_holidays: runsInHolidays.get(a.id as string) ?? false }
      const dueToday = (isRoutine ? a.recurs_weekday === todayWeekday : a.due_date === today)
        && !isHeldForHolidays(hold, new Date(), region)
      const dueTomorrow = (isRoutine ? a.recurs_weekday === tomorrowWeekday : a.due_date === tomorrowDate)
        && !isHeldForHolidays(hold, tomorrowDay, region)
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

  // Only the sections the family actually filled in show, in child friendly words.
  const agreementRow = agreementRes.data
  // ONE READER (14 September 2026): the same promises the fridge sheet and
  // the parent's copy print, each with its icon and its why, so the deal on
  // the phone is the deal on the wall.
  const agreementItems: { title: string; body: string; emoji?: string; why?: string | null }[] =
    promisesFrom(agreementRow as Parameters<typeof promisesFrom>[0]).map(p => ({ title: p.title, body: p.body, emoji: p.emoji, why: p.why }))
  const agreementSigned = Boolean(agreementRow?.signed_by_parent && agreementRow?.signed_by_child)
  // Each side on its own, so the child's Our deal can offer their own I agree
  // when it is their signature that is missing (14 September 2026).
  const agreementParentSigned = Boolean(agreementRow?.signed_by_parent)
  const agreementChildSigned = Boolean(agreementRow?.signed_by_child)
  // The two lines the device time card says back at the moment of asking.
  const dealLines = dealLinesFrom(agreementRow as Parameters<typeof dealLinesFrom>[0]).map(l => l.text)

  let contractAgreedAt: string | null = null
  let contractReady = false
  if (!contractRes.error) {
    contractReady = true
    contractAgreedAt = (contractRes.data?.agreed_at as string | null) ?? null
  }
  let giftStarsOwed = 0
  if (!giftRes.error) giftStarsOwed = (giftRes.data ?? []).reduce((sum, d) => sum + (Number(d.stars_owed) || 0), 0)

  // Who starts the timer for this child, unset reading as ask. Read with the
  // child row in wave one, see the note there.
  let deviceTrust = 'ask'
  {
    const trust = (childRes.data as { device_trust?: string | null } | null)?.device_trust
    if (trust === 'watch' || trust === 'trusted') deviceTrust = trust
  }
  let initialAsk: { id: string; device: string; minutes: number; status: 'pending' | 'approved' | 'declined' } | null = null
  {
    const { data, error } = askRes
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
  if (!nudgeRes.error) initialNudges = (nudgeRes.data ?? []).map(n => ({ id: String(n.id), message: String(n.message) }))

  let hasReminders = false
  if (!remindersRes.error) hasReminders = (remindersRes.count ?? 0) > 0

  // pdfColourIn travels separately rather than being folded into sheetUrl.
  // It used to overwrite it, so the screen could not tell a built pack from a
  // single image and handed a PDF to a print window that renders an <img>.
  let assignedPrintable: { key: string; title: string; emoji: string; stars: number; sheetUrl: string; pdfColourIn?: string; drawn?: DrawnKey; previewUrl: string; sheetHeading?: { name: string; kicker: string }; extraSheetUrls?: string[] } | null = null
  {
    const p = printableRes.data ? getPrintable(String(printableRes.data.printable_key)) : null
    // The finished products print their real colour in edition; the card shows
    // the real cover so the child sees exactly what a grown up sent.
    if (p) assignedPrintable = { key: p.key, title: p.title, emoji: p.emoji, stars: p.stars, sheetUrl: p.sheetUrl, pdfColourIn: p.pdfColourIn, previewUrl: p.previewUrl, sheetHeading: p.sheetHeading, extraSheetUrls: p.extraSheetUrls, drawn: p.drawn }
  }

  let tutorLesson: { id: string; title: string; emoji: string | null; stars: number; subject: string | null } | null = null
  {
    const { data } = tutorRes
    if (data) tutorLesson = {
      id: String(data.id), title: String(data.title),
      emoji: (data.emoji as string | null) ?? null,
      stars: Number(data.stars) || 3,
      subject: (data.subject as string | null) ?? null,
    }
  }

  const jobStreaks = jobStreaksRes?.count ?? 0

  // ── THE BOOK THE GROWN UPS KEEP, FOR THE CHILD TO LOOK AT ─────────────────
  //
  // Justin, 10 September 2026, choosing between now and later for the child's
  // read only view: "2 now".
  //
  // Until today the child had a sticker book and the parent had a passport, two
  // different objects with the same name on the cover. This is the real one,
  // read only, so a child can see what their family is actually working on.
  //
  // The slots draw a mark and one word each and never the detail, so the child
  // sees that the moments slot is not filled in and never what an adult wrote in
  // it. See the book prop on KidPassport for why that line is where it is.
  //
  // Fails soft to null throughout. This decorates a screen a child opens every
  // day, and a passport query that times out must never take that screen down.
  let kidBook: { stamps: PassportStamp[]; currentStage: number | null } | null = null
  try {
    if (passportReads && passportBuilt) {
      const [allProgress, areasRead, passed] = passportReads
      const built = passportBuilt
      const stamps: PassportStamp[] = STAGE_ORDER.map((slug, i) => {
        const id = i + 1
        const prog = allProgress?.[slug]
        const built1 = built[id]
        const pct = built1?.blended ?? 0
        return {
          id,
          name: STAGE_TITLES[i],
          ages: STAGE_AGES[i],
          pct,
          status: isStageStamped(prog, passed, id) ? 'earned' : id === stageId ? 'current' : id < stageId ? 'catchup' : 'upcoming',
          href: '#',
          lessonsDone: prog?.lessonsDone ?? 0,
          lessonsTotal: prog?.lessonsTotal ?? 0,
          scriptsDone: prog?.scriptsDone ?? 0,
          scriptsTotal: prog?.scriptsTotal ?? 0,
          checkPassed: passed.has(id),
          sections: built1?.sections,
          areas: areasRead.byStage[id],
        }
      })
      if (stamps.some(st => (st.sections?.length ?? 0) > 0)) kidBook = { stamps, currentStage: stageId }
    }
  } catch { kidBook = null }

  const completedDays = completedDaysRes?.count ?? 0

  const completedStreaks = streakCurrency(jobStreaks, completedDays)
  const earnedStages = earnedFriends(completedStreaks)

  const sheets = sheetsRes?.data ?? []
  const sheetsDone = sheets.length
  const sheetStars = sheets.reduce((sum, r) => sum + (Number(r.stars) || 0), 0)

  let kidStickers: KidSticker[] = []
  let celebrateStickers: string[] = []
  let celebratedStickers: string[] = []
  if (stickerRead) {
    const [book, { data, error }] = stickerRead
    kidStickers = book.stickers.map(s => ({
      key: s.key, name: s.name, emoji: s.emoji, art: stickerArt(s),
      colour: s.colour, earned: s.earned, rule: s.rule,
      // What it costs and how close they are. Both already existed on the
      // book and neither was reaching the child, which is why a locked
      // sticker could only say "Locked" over a bare number.
      earn: s.earn, have: s.have, need: s.need,
    }))
    if (!error) {
      const rows = (data ?? []) as { sticker_key: string; celebrated?: boolean | null }[]
      celebrateStickers = rows.filter(r => !r.celebrated).map(r => String(r.sticker_key))
      celebratedStickers = rows.filter(r => r.celebrated).map(r => String(r.sticker_key))
    }
  }

  // ── THIS WEEK'S DAILY STICKERS, MONDAY TO SUNDAY ─────────────────────────
  //
  // The same seven the day done screen draws, but from the day's own row
  // (kid_days.sticker_awarded_at) rather than from job ticks, so a day where
  // the child ticked one job and stopped is not drawn as a full day. Days
  // ahead are drawn empty so the week keeps its shape.
  const dailyRows = ((dailyWeekRes as { data?: { day: string; sticker_awarded_at?: string | null; completed_at?: string | null }[] | null } | null)?.data ?? [])
  const stickerDays = new Set(dailyRows.filter(r => r.sticker_awarded_at || r.completed_at).map(r => String(r.day)))
  const dailyWeek = Array.from({ length: 7 }, (_, i) => {
    const off = sinceMonday - i
    return { letter: 'MTWTFSS'[i], earned: off >= 0 && stickerDays.has(dayStr(off)), isToday: off === 0 }
  })
  const dailyStickers = { total: completedDays, week: dailyWeek }

  let streakWeekSeen: string | null = null
  if (streakWeekSeenRes && !streakWeekSeenRes.error) {
    streakWeekSeen = (streakWeekSeenRes.data as { streak_week_seen?: string | null } | null)?.streak_week_seen ?? null
  }

  const familyDevices: FamilyDevice[] = ((familyDevicesRes?.data ?? []) as FamilyDeviceRow[]).map(toFamilyDevice)

  return (
    <>
      {/* The pre welcome hold: runs before first paint, parser blocking on
          purpose. If the one time welcome has not been seen, a same colour
          cover (globals.css) hides the quest screen until the welcome is on
          screen, so the app never flashes its home under the greeting. The
          timeout is the safety net against a stalled hydration. */}
      <script dangerouslySetInnerHTML={{ __html:
        `(function(){try{if(localStorage.getItem('gc_kid_welcome')!=='1'){document.documentElement.setAttribute('data-gc-hold','kid');setTimeout(function(){document.documentElement.removeAttribute('data-gc-hold')},3000)}}catch(e){}})();`,
      }} />
      <KidQuestScreen
      familyDevices={familyDevices}
      stickers={kidStickers}
      dailyStickers={dailyStickers}
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
      tutorLesson={tutorLesson}
      token={token}
      agreementItems={agreementItems}
      agreementSigned={agreementSigned}
      agreementParentSigned={agreementParentSigned}
      agreementChildSigned={agreementChildSigned}
      dealLines={dealLines}
      childName={childRes.data?.name ?? 'Superstar'}
      passportCode={(childRes.data as { passport_code?: string | null } | null)?.passport_code ?? null}
      planetTier={PLANET_FRIENDS_LIVE ? tierFor(dob ?? null, ageBand ?? null) : null}
      buddy={(childRes.data?.buddy as string | null) ?? null}
      accent={(childRes.data?.accent as string | null) ?? null}
      stageId={stageId}
      kidBook={kidBook}
      quests={dueQuests}
      todayTicks={todayTicks}
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
      coreMinutesLeft={coreMinutesLeft}
      protectedLine={protectedLine}
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
      hasReminders={hasReminders}
      />
    </>
  )
}
