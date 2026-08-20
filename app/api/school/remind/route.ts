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
    .select('user_id, child_id, title, kind')
    .eq('status', 'open')
    .eq('due_date', tomorrow)

  const { data: routineRows } = await supabase
    .from('school_actions')
    .select('id, user_id, child_id, title, kind, auto_send_to_child')
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

  // Each item wears its child's name, so tonight's push says WHOSE PE kit.
  // Justin, 19 August 2026: "school reminders are per child and the parent can
  // see the name of the child in the reminder." One push per family still,
  // because two pushes at 19:30 is a worse evening than one.
  type RemindItem = { user_id: string; child_id?: string | null; title: string }
  const remindItems: RemindItem[] = [...(dueTomorrow ?? []), ...(routines ?? [])] as RemindItem[]
  const nameOf = new Map<string, string>()
  {
    const userIds = [...new Set(remindItems.map(a => a.user_id))]
    if (userIds.length) {
      const { data } = await supabase.from('children').select('id, name, parent_id').in('parent_id', userIds)
      for (const c of (data ?? []) as { id: string; name: string | null }[]) {
        if (c.name && c.name !== 'Your child') nameOf.set(c.id, c.name)
      }
    }
  }
  const byUser = new Map<string, string[]>()
  for (const a of remindItems) {
    const who = a.child_id ? nameOf.get(a.child_id) : null
    const list = byUser.get(a.user_id) ?? []
    list.push(who ? `${a.title} (${who})` : a.title)
    byUser.set(a.user_id, list)
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
      const res = await sendPush({ userId, title: 'Reminders for tomorrow 🗓️', body, url: '/dashboard/school' })
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
  // Each child hears about THEIR tomorrow: their own items plus the
  // household's, never a sibling's. An item with no child reaches every child,
  // which is what a row from before migration 215 means. Keyed by user AND
  // child so the send below can target one child's devices.
  const CHILD_KINDS = new Set(['kit', 'event', 'homework'])
  const childItems = (dueTomorrow ?? []).filter(a => a.kind && CHILD_KINDS.has(a.kind)) as RemindItem[]
  const involved = new Map<string, Set<string | null>>()
  for (const a of childItems) {
    if (!involved.has(a.user_id)) involved.set(a.user_id, new Set())
    involved.get(a.user_id)!.add(a.child_id ?? null)
  }
  for (const [userId, childIds] of involved) {
    // A null child item goes to every child on the account, so the account's
    // children are needed whenever one is present.
    const targets = new Set<string>()
    for (const id of childIds) if (id) targets.add(id)
    if (childIds.has(null)) {
      const { data: allKids } = await supabase.from('children').select('id').eq('parent_id', userId)
      for (const k of allKids ?? []) targets.add(k.id as string)
    }
    for (const childId of targets) {
      const titles = childItems
        .filter(a => a.user_id === userId && (!a.child_id || a.child_id === childId))
        .map(a => a.title)
      if (titles.length === 0) continue
      const body = titles.length === 1
        ? `Tomorrow: ${titles[0]}. Get it ready tonight ⭐`
        : `Tomorrow: ${titles.slice(0, 3).join(', ')}. Get them ready tonight ⭐`
      try {
        const res = await sendPush({ userId, audience: 'kids', childId, title: 'For tomorrow 🎒', body, url: '/' })
        if (res.sent > 0) childSent++
      } catch { /* best effort */ }
    }
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
      // The routine's OWN child since migration 215, not the primary one:
      // Cubs is one child's Tuesday, and the old is_primary read buzzed the
      // wrong phone in any family where it was not the eldest's. A routine
      // with no child still reaches every child, which is what it meant.
      const rid = (routine as { child_id?: string | null }).child_id ?? null
      await sendPush({
          userId: routine.user_id, audience: 'kids', ...(rid ? { childId: rid } : {}),
          title: 'For tomorrow 🗓️', body: `Tomorrow: ${routine.title}. It is on your calendar.`, url: '/',
        })
      childSent++
    } catch { /* best effort, next week tries again */ }
  }

  return NextResponse.json({ families: byUser.size, sent, childSent, emailed, dueDate: tomorrow, weekday })
}

export const GET = withHeartbeat('/api/school/remind', handler)
