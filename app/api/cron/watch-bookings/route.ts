import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'
import { pushToChild } from '@/lib/quests/kid-push'
import { inChildQuietHours } from '@/lib/push/quiet-hours'
import { londonNow } from '@/lib/time/london'
import { REMINDER_LEAD_MIN, RETAIN_DAYS, londonToUtc } from '@/lib/lessons/watch-bookings'

// Watch together bookings (migration 400), every five minutes. Four jobs, each
// flagged before it sends so a slow push can never fire twice:
//
// 1. The parent's reminder, fifteen minutes before. A push to their own
//    phone, not counted as a nudge: it is a reminder of something they chose,
//    once per booking. No email, so the one programme email a week rule is
//    untouched.
// 2. The child's buzz at the time, only when the parent left it on, and only
//    07:00 to 18:59. Inside quiet hours the buzz is marked skipped and never
//    sent later: the card simply appears on the child's page, silent. Held,
//    not queued, the same rule as every other push to a child.
// 3. Missed: a booking whose London day has ended unwatched becomes missed.
//    Nothing goes to the child, ever. The parent sees one line on Home the
//    next day to pick a new time.
// 4. Retention: finished rows older than 90 days are deleted. Completions
//    already record that a film was watched.
//
// Gated on CRON_SECRET like the other crons.

export const dynamic = 'force-dynamic'

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = new Date()
  const nowIso = now.toISOString()
  let reminded = 0, pinged = 0, skipped = 0, missed = 0, removed = 0

  const titles = new Map<string, string>()
  async function titleOf(code: string): Promise<string> {
    if (!titles.has(code)) {
      const { data } = await admin.from('parent_lessons').select('title').eq('lesson_code', code).maybeSingle()
      titles.set(code, (data?.title as string | undefined) ?? 'your Watch together film')
    }
    return titles.get(code)!
  }
  async function childName(id: string): Promise<string> {
    const { data } = await admin.from('children').select('name').eq('id', id).maybeSingle()
    return (data?.name as string | undefined) ?? 'your child'
  }

  // ── 1. The parent's reminder ──
  const { data: dueReminders, error: readErr } = await admin.from('watch_bookings')
    .select('id, parent_id, child_id, lesson_code, starts_at')
    .eq('status', 'booked').is('reminded_at', null)
    .lte('starts_at', new Date(now.getTime() + REMINDER_LEAD_MIN * 60000).toISOString())
    .gte('starts_at', new Date(now.getTime() - 5 * 60000).toISOString())
  if (readErr) {
    // Before migration 400 is applied the table is not there. Say so and stop.
    return NextResponse.json({ ok: true, skipped: 'watch_bookings not available', detail: readErr.message })
  }
  for (const b of dueReminders ?? []) {
    try {
      const { data: claimed } = await admin.from('watch_bookings')
        .update({ reminded_at: nowIso }).eq('id', b.id).is('reminded_at', null).select('id')
      if (!claimed?.length) continue
      const [title, name] = await Promise.all([titleOf(b.lesson_code as string), childName(b.child_id as string)])
      await sendPush({
        userId: b.parent_id as string,
        title: 'Film time soon 🍿',
        body: `${title}, with ${name}. A few minutes on the sofa together.`,
        url: `/dashboard/lessons/together/${b.lesson_code}?child=${b.child_id}`,
      })
      reminded += 1
    } catch { /* best effort per booking */ }
  }

  // ── 2. The child's buzz at the time ──
  const { data: duePings } = await admin.from('watch_bookings')
    .select('id, parent_id, child_id, lesson_code, starts_at, buzz_child')
    .eq('status', 'booked').is('child_pinged_at', null)
    .lte('starts_at', nowIso)
    .gte('starts_at', new Date(now.getTime() - 30 * 60000).toISOString())
  for (const b of duePings ?? []) {
    try {
      const { data: claimed } = await admin.from('watch_bookings')
        .update({ child_pinged_at: nowIso }).eq('id', b.id).is('child_pinged_at', null).select('id')
      if (!claimed?.length) continue
      if (!b.buzz_child || inChildQuietHours(now)) { skipped += 1; continue }
      const r = await pushToChild(admin, b.parent_id as string, b.child_id as string,
        'Film time! 🍿', 'Your grown up has a film for you to watch together. Open your quests to start.')
      if (r.sent > 0) pinged += 1; else skipped += 1
    } catch { /* best effort per booking */ }
  }

  // ── 3. Missed: the London day has ended ──
  const startOfToday = londonToUtc(londonNow(now).dateStr, 0, 0).toISOString()
  const { data: gone } = await admin.from('watch_bookings')
    .update({ status: 'missed', updated_at: nowIso })
    .eq('status', 'booked').lt('starts_at', startOfToday).select('id')
  missed = gone?.length ?? 0

  // ── 4. Retention ──
  const { data: old } = await admin.from('watch_bookings').delete()
    .in('status', ['watched', 'cancelled', 'missed'])
    .lt('updated_at', new Date(now.getTime() - RETAIN_DAYS * 86400000).toISOString())
    .select('id')
  removed = old?.length ?? 0

  return NextResponse.json({ ok: true, reminded, pinged, skipped, missed, removed })
}

export const GET = withHeartbeat('/api/cron/watch-bookings', handler)
