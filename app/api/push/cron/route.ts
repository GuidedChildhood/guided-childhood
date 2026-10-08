import { withHeartbeat } from '@/lib/ops/heartbeat'
import { londonNow } from '@/lib/time/london'
import { isSchoolDay } from '@/lib/quests/job-time'
import { NextRequest, NextResponse } from 'next/server'
import { sendPush } from '@/lib/push/send'
import { createAdminClient } from '@/lib/supabase/admin'
import { getDailyStreak } from '@/lib/pathway/streak'
import { londonToday, londonDayStart } from '@/lib/pathway/today'
import { dueNow, eveningLine, reminderTargetMinutes, ukMinutesOf, REMINDER_EARLIEST, REMINDER_LATEST, DUE_WINDOW } from '@/lib/push/evening'
import { familyTargets, windowPush, bandGroup, DEFAULT_MORNING_TARGET, DEFAULT_HOME_TARGET, type SchoolWindow } from '@/lib/home/school-window'
import { DEFAULT_REGION, isRegion } from '@/lib/learning/region'
import type { Region } from '@/lib/learning/holidays'

// Called by Vercel Cron every 30 minutes — see vercel.json. Vercel cron
// schedules are fixed UTC, but the promise shown in Settings is a UK
// WALL CLOCK time (before school, after school, the evening), and UK time is UTC+1 all
// summer. A fixed UTC schedule drifts an hour off its own promise for
// more than half the year. So instead of firing at a few exact UTC
// moments, this runs every half hour and only actually sends when the
// UK LOCAL clock, computed fresh each run, is within the window below
// of a family's target. No seasonal edits, ever: the correct
// side of the clock change is worked out live on every single run.

const WINDOW_MINUTES = 10

// ── THE TWO SCHOOL DAY WINDOWS, PER FAMILY (7 October 2026) ─────────────────
//
// Until today these were two broadcasts, "Morning check in" at 07:30 and
// "School is out" at 15:30, one message to every parent at the same minute
// whatever their day looked like. Justin asked for the morning before school
// and the return home to be researched so the product could pre empt them, and
// the briefing (briefings/2026-10-07-school-day-routines-v2.html) came back
// with three things that reshape the send:
//
// - The windows belong to the family's clock, not ours. A Reception child
//   starts at 8.50 and is home at 3.20; a Year 9 starts at 8.30 and is home
//   at 5 after rugby. Each child now carries school_start_minutes and
//   home_minutes (migration 363), and the family's morning target is 50
//   minutes before the earliest start, the afternoon 15 minutes after the
//   latest home time. Null keeps 07:30 and 15:30, so nobody's push moved
//   because of the deploy.
// - One window per family by default. Three texts a week beat five in the one
//   direct test, and five raised opt out by 58 percent. The slot picker
//   decides which window; new subscriptions default to after school (the
//   largest screen block of the day) and the evening.
// - The words lead with sleep and food, not the screen, and never name a
//   syndrome. lib/home/school-window.ts holds them so the push and the Home
//   card say the same thing.
//
// Gated on the family's own school calendar (profiles.school_region), so a
// Scottish family on holiday in early July is not told school is out. On a
// non school day the window is simply quiet: the afternoon stretch in the
// holidays is real, and the Home card still carries the moment deck for it.
//
// Reads are batched: one query per table for every subscribed parent, then a
// send for each family whose target is due on this half hour.

const WINDOW_SLOT: Record<SchoolWindow, 'morning' | 'afternoon'> = { morning: 'morning', home: 'afternoon' }

async function runWindowPass(nowMinutes: number) {
  // The earliest morning target is 06:30 (a 7:30 start less 50, rounded) and
  // the latest afternoon one 19:00; outside that there is nothing to do.
  if (nowMinutes < DEFAULT_MORNING_TARGET - 60 - DUE_WINDOW || nowMinutes > 19 * 60 + DUE_WINDOW) {
    return { skipped: true, reason: 'outside the school day windows' }
  }
  const admin = createAdminClient()
  const { data: subs } = await admin.from('push_subscriptions').select('user_id, slots').is('child_id', null)
    .or('slots.cs.{morning},slots.cs.{afternoon}')
  const slotsOf = new Map<string, Set<string>>()
  for (const r of subs ?? []) {
    const u = r.user_id as string
    if (!u) continue
    if (!slotsOf.has(u)) slotsOf.set(u, new Set())
    for (const sl of (r.slots as string[] | null) ?? []) slotsOf.get(u)!.add(sl)
  }
  const users = [...slotsOf.keys()]
  if (users.length === 0) return { sent: 0, due: 0 }

  // Children carry the times and the band; the profile carries the calendar.
  // The times read fails soft to the defaults until migration 363 has run.
  const [kidsRes, profilesRes] = await Promise.all([
    admin.from('children').select('parent_id, name, age_band, is_primary, school_start_minutes, home_minutes').in('parent_id', users).order('is_primary', { ascending: false })
      .then(r => r.error ? admin.from('children').select('parent_id, name, age_band, is_primary').in('parent_id', users).order('is_primary', { ascending: false }) : r),
    admin.from('profiles').select('id, school_region').in('id', users),
  ])
  type Kid = { parent_id: string; name: string | null; age_band: string | null; is_primary: boolean | null; school_start_minutes?: number | null; home_minutes?: number | null }
  const kidsOf = new Map<string, Kid[]>()
  for (const k of (kidsRes.data ?? []) as Kid[]) {
    if (!kidsOf.has(k.parent_id)) kidsOf.set(k.parent_id, [])
    kidsOf.get(k.parent_id)!.push(k)
  }
  const regionOf = new Map<string, Region>()
  for (const p of profilesRes.data ?? []) regionOf.set(p.id as string, isRegion(p.school_region) ? p.school_region : DEFAULT_REGION)

  const now = new Date()
  let due = 0, sent = 0, failed = 0, quiet = 0
  for (const user of users) {
    const kids = kidsOf.get(user) ?? []
    const targets = familyTargets(kids)
    const slots = slotsOf.get(user)!
    const window: SchoolWindow | null =
      slots.has('morning') && dueNow(nowMinutes, targets.morning) ? 'morning'
      : slots.has('afternoon') && dueNow(nowMinutes, targets.home) ? 'home'
      : null
    if (!window) continue
    due++
    if (!isSchoolDay(now, regionOf.get(user) ?? DEFAULT_REGION)) { quiet++; continue }
    // The primary child names the push and sets the register; one push per
    // family, never one per child.
    const lead = kids[0] ?? null
    const line = windowPush(window, bandGroup(lead?.age_band), lead?.name ?? null)
    const r = await sendPush({ title: line.title, body: line.body, url: line.url, userId: user, slot: WINDOW_SLOT[window] })
    sent += r.sent
    failed += r.failed
  }
  return { due, quiet, sent, failed }
}

// The children's quest nudges stay on the fixed clock they have always had.
// They are a broadcast to every child device, so they cannot use a family's
// own times the way the parent pass above does, and 07:30 and 15:30 are right
// for almost everyone. Worth saying rather than leaving silent: the fix, if it
// ever matters, is per child sends keyed on the same two columns.
const KID_NUDGE_TIMES = [
  { hour: 7, minute: 30 },
  { hour: 15, minute: 30 },
]

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

// ── THE EVENING, PER PARENT ─────────────────────────────────────────────────
//
// Justin, 13 September 2026: a Duolingo grade habit. The 21:00 push was one
// message to everyone, and it never looked at the day. Now, on every half
// hourly run through the evening, each parent subscribed to the evening slot
// is reminded at THEIR target (chosen in Settings, learned from when they
// usually finish, or 21:00), and the words depend on whether today is done:
// a finished day gets the wind down it always got, an open day gets the one
// tap that keeps the streak going. Never a loss (lib/push/evening.ts).
//
// Reads are batched: one query per table for every evening subscriber, then
// one streak read for each parent who is due and not done, which on any
// given half hour is a handful.
async function runEveningPass(nowMinutes: number) {
  if (nowMinutes < REMINDER_EARLIEST - DUE_WINDOW || nowMinutes > REMINDER_LATEST + DUE_WINDOW) {
    return { skipped: true, reason: 'outside the evening' }
  }
  const admin = createAdminClient()
  const { data: subs } = await admin.from('push_subscriptions').select('user_id').is('child_id', null).contains('slots', ['evening'])
  const users = [...new Set((subs ?? []).map(r => r.user_id as string).filter(Boolean))]
  if (users.length === 0) return { sent: 0, due: 0 }

  const today = londonToday()
  const dayStart = londonDayStart()
  const fortnightAgo = addDays(today, -14)
  const [profilesRes, finishesRes, sessionsRes, momentsRes, ticksRes, feedbackRes, childrenRes] = await Promise.all([
    admin.from('profiles').select('id, reminder_minutes').in('id', users),
    admin.from('daily_sessions').select('user_id, completed_at').in('user_id', users).gte('session_date', fortnightAgo).not('completed_at', 'is', null),
    admin.from('daily_sessions').select('user_id').in('user_id', users).eq('session_date', today).not('completed_at', 'is', null),
    admin.from('moment_completions').select('user_id').in('user_id', users).eq('completed_on', today),
    admin.from('quest_ticks').select('user_id').in('user_id', users).eq('status', 'approved').gte('approved_at', dayStart),
    admin.from('digi_feedback').select('user_id').in('user_id', users).eq('feedback_date', today).not('parent_response', 'is', null),
    admin.from('children').select('parent_id, name, is_primary').in('parent_id', users).order('is_primary', { ascending: false }),
  ])
  const chosen = new Map<string, number | null>()
  for (const p of profilesRes.data ?? []) chosen.set(p.id as string, (p.reminder_minutes as number | null) ?? null)
  const finishes = new Map<string, number[]>()
  for (const r of finishesRes.data ?? []) {
    const m = ukMinutesOf(r.completed_at as string)
    if (m === null) continue
    const u = r.user_id as string
    if (!finishes.has(u)) finishes.set(u, [])
    finishes.get(u)!.push(m)
  }
  // Done today by the same reading the streak uses (lib/pathway/streak.ts):
  // any meaningful showing up, never one particular screen.
  const done = new Set<string>()
  for (const rows of [sessionsRes.data, momentsRes.data, ticksRes.data, feedbackRes.data]) {
    for (const r of rows ?? []) if (r.user_id) done.add(r.user_id as string)
  }
  const childName = new Map<string, string>()
  for (const c of childrenRes.data ?? []) {
    const u = c.parent_id as string
    if (!childName.has(u) && c.name) childName.set(u, c.name as string)
  }

  let due = 0, sent = 0, failed = 0, open = 0
  for (const user of users) {
    const target = reminderTargetMinutes(chosen.get(user) ?? null, finishes.get(user) ?? [])
    if (!dueNow(nowMinutes, target)) continue
    due++
    const isDone = done.has(user)
    if (!isDone) open++
    // The streak read reuses the app's own function on the admin client: the
    // same supabase-js API, a different type name.
    const streakCount = isDone ? 0 : (await getDailyStreak(admin as unknown as Parameters<typeof getDailyStreak>[0], user)).count
    const line = eveningLine({ done: isDone, streakCount, childName: childName.get(user) ?? null })
    const r = await sendPush({ title: line.title, body: line.body, url: line.url, userId: user, slot: 'evening' })
    sent += r.sent
    failed += r.failed
  }
  return { due, open, sent, failed }
}

async function handler(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // This used to read the hour off an Invalid Date, so ukHour was NaN and
  // nowMinutes with it, which is why the reply carried "ukHour": null.
  //
  // Read the guard below carefully, because the failure is the opposite of the
  // obvious one. distanceMinutes was also NaN, and NaN > WINDOW_MINUTES is
  // false, so it never skipped. It fell through and sent on every single run:
  // a check in every thirty minutes, forty eight times a day, instead of three.
  // The live runs prove it, replying with a checkin name rather than the
  // skipped shape.
  //
  // Nobody was buried in notifications only because the send was 401ing on the
  // protected deployment host and every one of them was thrown away. Fixing
  // NEXT_PUBLIC_APP_URL without fixing this would have turned a silent failure
  // into forty eight pushes a day to every parent.
  const uk = londonNow()
  const ukHour = uk.hour
  const nowMinutes = ukHour * 60 + uk.minute

  // The evening pass runs on every half hour through the evening, and the
  // school day pass on every half hour through the day, whatever the children's
  // fixed clock below decides.
  const evening = await runEveningPass(nowMinutes)
  const windows = await runWindowPass(nowMinutes)

  const nearest = KID_NUDGE_TIMES.reduce((best, c) => {
    const dist = Math.abs(c.hour * 60 + c.minute - nowMinutes)
    const bestDist = Math.abs(best.hour * 60 + best.minute - nowMinutes)
    return dist < bestDist ? c : best
  })
  const distanceMinutes = Math.abs(nearest.hour * 60 + nearest.minute - nowMinutes)

  if (distanceMinutes > WINDOW_MINUTES) {
    return NextResponse.json({ skipped: true, reason: 'outside the kid nudge window', ukHour, nowMinutes, windows, evening })
  }

  // Kid quest reminders ride the morning and after school clock only, never
  // the evening: no buzzing children at bedtime.
  //
  // This is a BROADCAST, one message to every child at once, so it cannot use a
  // family's own school region the way the job reminders do. It assumes the
  // England and Wales calendar, which is right for almost everyone here and
  // will be a few days out for Scotland at the start and end of summer.
  //
  // Sent in process, so there is no host to get wrong. This used to post to
  // `${origin}/api/push/send`, and Vercel Cron invokes the function on the
  // deployment specific host, which sits behind Deployment Protection, so the
  // call answered 401 and not a single push went out while this route still
  // replied 200. Calling the function directly means there is nothing left to
  // point wrong.
  const schoolDay = isSchoolDay(new Date())
  const KID_NUDGES: Record<number, { title: string; body: string }> = {
    7: schoolDay
      ? { title: 'Your quests are ready ⭐', body: 'Tick them off today and stack your stars.' }
      : { title: 'Your quests are ready ⭐', body: 'No rush today. Tick them off whenever and stack your stars.' },
    15: schoolDay
      ? { title: 'After school quests ⭐', body: 'A few ticks now and the screen minutes are yours.' }
      : { title: 'Afternoon quests ⭐', body: 'A few ticks now and the screen minutes are yours.' },
  }
  const kidNudge = KID_NUDGES[nearest.hour]
  let kidResult = null
  if (kidNudge) {
    // sendPush never throws, so no try needed. A failure comes back in the
    // result and rides out in the reply, where the heartbeat can see it.
    kidResult = await sendPush({ title: kidNudge.title, body: kidNudge.body, url: '/', audience: 'kids' })
  }

  return NextResponse.json({ checkin: nearest.hour === 7 ? 'morning' : 'afternoon', ukHour, windows, kids: kidResult, evening })
}

export const GET = withHeartbeat('/api/push/cron', handler)
