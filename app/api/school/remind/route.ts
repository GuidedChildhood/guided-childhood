import { withHeartbeat } from '@/lib/ops/heartbeat'
import { londonDateIn, londonWeekdayIn } from '@/lib/time/london'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured, unsubscribeUrl } from '@/lib/email'
import { schoolReminderEmail } from '@/lib/email/templates'
import { sendPush } from '@/lib/push/send'
import { isHeldForHolidays } from '@/lib/school/child-items'
import { DEFAULT_REGION, isRegion } from '@/lib/learning/region'
import type { Region } from '@/lib/learning/holidays'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Called once a day, evening UK time, by Vercel Cron (see vercel.json).
// The never miss it promise: anything due tomorrow, whether a one off
// with a due date or a weekly routine (PE every Thursday), whether
// DiGi caught it from a school email or the parent typed it in by
// hand, gets one push tonight while there is still time to pack the
// kit or sign the form, grouped into a single message per family. A
// weekly routine marked auto_send_to_child nudges the child's phone
// too, every week it comes round, no parent tap needed. A nudge only:
// it stopped minting quests on 11 August 2026, see the note below.

function ukTomorrow(): { dateStr: string; weekday: number } {
  return { dateStr: londonDateIn(1), weekday: londonWeekdayIn(1) }
}

async function handler(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { dateStr: tomorrow, weekday } = ukTomorrow()

  const { data: dueTomorrow } = await supabase
    .from('school_actions')
    .select('user_id, title, kind')
    .eq('status', 'open')
    .eq('due_date', tomorrow)

  const { data: routineRows } = await supabase
    .from('school_actions')
    .select('id, user_id, title, kind, auto_send_to_child')
    .eq('status', 'open')
    .eq('recurs_weekday', weekday)

  // THE HOLIDAY HOLD. A school time routine rests through the school
  // holidays, so tonight's push must not fire for one whose tomorrow is a
  // holiday. Justin caught the display half of this on Teo's phone (Show and
  // tell, red, mid August); this is the push half, or the phone would still
  // buzz about a reminder the screens have learned to hold.
  //
  // Both reads are guarded: runs_in_holidays lands with migration 182 and
  // school_region with 129, both run by hand. Errors read as school time and
  // UK, the platform's defaults.
  const holidayFlag = new Map<string, boolean>()
  try {
    const ids = (routineRows ?? []).map(r => r.id)
    if (ids.length) {
      const { data, error } = await supabase
        .from('school_actions').select('id, runs_in_holidays').in('id', ids)
      if (!error) for (const r of (data ?? []) as { id: string; runs_in_holidays?: boolean | null }[]) {
        holidayFlag.set(String(r.id), r.runs_in_holidays === true)
      }
    }
  } catch { /* pre 182, school time */ }
  const regionOf = new Map<string, Region>()
  try {
    const userIds = [...new Set((routineRows ?? []).map(r => r.user_id as string))]
    if (userIds.length) {
      const { data, error } = await supabase
        .from('profiles').select('id, school_region').in('id', userIds)
      if (!error) for (const p of (data ?? []) as { id: string; school_region?: unknown }[]) {
        if (isRegion(p.school_region)) regionOf.set(String(p.id), p.school_region)
      }
    }
  } catch { /* pre 129, UK */ }
  const tomorrowDate = new Date(`${tomorrow}T12:00:00`)
  const routines = (routineRows ?? []).filter(r => !isHeldForHolidays(
    { recurs_weekday: weekday, runs_in_holidays: holidayFlag.get(String(r.id)) ?? false },
    tomorrowDate,
    regionOf.get(String(r.user_id)) ?? DEFAULT_REGION,
  ))

  const byUser = new Map<string, string[]>()
  for (const a of dueTomorrow ?? []) {
    const list = byUser.get(a.user_id) ?? []
    list.push(a.title)
    byUser.set(a.user_id, list)
  }
  for (const r of routines ?? []) {
    const list = byUser.get(r.user_id) ?? []
    list.push(r.title)
    byUser.set(r.user_id, list)
  }

  let sent = 0
  let childSent = 0
  let emailed = 0
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin

  // The parents' emails, for the belt and braces email channel alongside push.
  const emailById = new Map<string, string>()
  if (emailConfigured() && byUser.size > 0) {
    const { data: profs } = await supabase
      .from('profiles').select('id, email').in('id', [...byUser.keys()])
    for (const p of profs ?? []) if (p.email) emailById.set(p.id as string, p.email as string)
  }

  for (const [userId, titles] of byUser) {
    const body = titles.length === 1
      ? `Tomorrow: ${titles[0]}. Sort it tonight while it is easy.`
      : `Tomorrow: ${titles.slice(0, 3).join(', ')}${titles.length > 3 ? ', and more' : ''}. Sort tonight while it is easy.`
    try {
      const res = await sendPush({ userId, title: 'From school, due tomorrow', body, url: '/dashboard/school' })
      const result = res
      if (result.sent > 0) sent++
    } catch { /* best effort */ }

    // The same reminder by email, with a strong subject and a fix it link.
    const email = emailById.get(userId)
    if (email) {
      try {
        const { ok } = await sendEmail({
          to: email,
          ...schoolReminderEmail({ titles, adjustUrl: `${origin}/dashboard/school`, unsubscribe: unsubscribeUrl(userId) }),
          // The parent set this up themselves and it is about tomorrow morning.
          // Throttling it to one a week would simply break the feature.
          kind: 'transactional',
        })
        if (ok) emailed++
      } catch { /* best effort */ }
    }
  }

  // Child appropriate one offs reach the child's phone the night before too,
  // so packing the kit becomes their job, not only the parent's memory.
  // Payments, deadlines and plain notices stay with the parent only.
  const CHILD_KINDS = new Set(['kit', 'event', 'homework'])
  const childByUser = new Map<string, string[]>()
  for (const a of dueTomorrow ?? []) {
    if (!a.kind || !CHILD_KINDS.has(a.kind)) continue
    const list = childByUser.get(a.user_id) ?? []
    list.push(a.title)
    childByUser.set(a.user_id, list)
  }
  for (const [userId, titles] of childByUser) {
    const body = titles.length === 1
      ? `Tomorrow: ${titles[0]}. Get it ready tonight ⭐`
      : `Tomorrow: ${titles.slice(0, 3).join(', ')}. Get them ready tonight ⭐`
    try {
      const res = await sendPush({ userId, audience: 'kids', title: 'From school 🎒', body, url: '/' })
      const result = res
      if (result.sent > 0) childSent++
    } catch { /* best effort */ }
  }

  // The weekly routines that also nudge the child, every week, automatically.
  //
  // A NUDGE, no longer a quest. This loop used to mint a fresh one star
  // family_quests row for every routine every week, which is how Cubs and
  // Show and tell ended up sitting in Teo's balance page and on his star
  // chart as jobs. Justin, 11 August 2026: "surely that does not affect
  // balance, as just alerts not jobs." The routine already shows in the
  // child's own school diary (auto_send_to_child is exactly what
  // isChildVisible reads), so the push is all that is left to do, and the
  // star economy stays for actual jobs.
  for (const routine of (routines ?? []).filter(r => r.auto_send_to_child)) {
    try {
      const { data: child } = await supabase
        .from('children')
        .select('id')
        .eq('parent_id', routine.user_id)
        .eq('is_primary', true)
        .maybeSingle()
      if (!child) continue

      await sendPush({
          userId: routine.user_id, audience: 'kids',
          title: 'From school 🎒', body: `Tomorrow: ${routine.title}. It is in your school diary.`, url: '/',
        })
      childSent++
    } catch { /* best effort, next week tries again */ }
  }

  return NextResponse.json({ families: byUser.size, sent, childSent, emailed, dueDate: tomorrow, weekday })
}

export const GET = withHeartbeat('/api/school/remind', handler)
