import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'
import { LATE_LIMIT_MS } from '@/lib/digi/reminders'

// Sends the reminders a parent asked DiGi for (migration 359).
//
// Every five minutes, so "remind me at six" arrives by five past at the
// latest. Each due reminder goes to the parent's own devices as a push. A
// family with no push device gets a Home card instead, so the reminder is
// never sent into nothing.
//
// MORE THAN AN HOUR LATE IS MISSED, NOT SENT. Unlike a follow up, where a day
// late is still a promise kept, a reminder is about a moment: "start the wind
// down" at nine is worse than silence. A missed run marks it missed, and the
// parent can see that in the chat rather than getting it at the wrong time.
//
// A REPEATING reminder moves on a day and counts down instead of closing. It
// moves to the same London clock time on the next date, never by adding
// twenty four hours, which would be an hour out across a clock change.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = Date.now()

  const { data: due } = await admin
    .from('digi_reminders')
    .select('id, user_id, child_id, body, remind_at, repeat_days')
    .eq('status', 'pending')
    .lte('remind_at', new Date(now).toISOString())
    .order('remind_at', { ascending: true })
    .limit(200)

  if (!due || due.length === 0) return NextResponse.json({ ok: true, sent: 0, processed: 0 })

  const { londonNow } = await import('@/lib/time/london')
  const { londonWallClockToUtc } = await import('@/lib/digi/reminders')

  let sent = 0, carded = 0, missed = 0
  for (const r of due) {
    const at = new Date(String(r.remind_at))
    const late = now - at.getTime() > LATE_LIMIT_MS

    if (!late) {
      const push = await sendPush({
        title: 'A reminder you asked DiGi for',
        body: String(r.body),
        url: '/dashboard/digi',
        userId: r.user_id as string,
        audience: 'parents',
      })
      if (push.sent > 0) {
        sent++
      } else {
        // No device took it: a Home card instead. The card's own status
        // carries it from here, so it is dismissed like any other.
        await admin.from('digi_prompts').insert({
          user_id: r.user_id,
          child_id: r.child_id,
          kind: 'reminder',
          title: 'Your reminder',
          body: String(r.body),
          reason: 'You asked DiGi to remind you.',
          href: '/dashboard/digi',
        })
        carded++
      }
    } else {
      missed++
    }

    const repeats = Number(r.repeat_days) || 0
    if (repeats > 0) {
      // The same London clock time on the next London date.
      const clock = londonNow(at)
      const nextDate = new Date(Date.UTC(clock.year, clock.month - 1, clock.day + 1)).toISOString().slice(0, 10)
      const next = londonWallClockToUtc(nextDate, clock.hour, clock.minute)
      await admin.from('digi_reminders')
        .update({ remind_at: next.toISOString(), repeat_days: repeats - 1, ...(late ? {} : { sent_at: new Date().toISOString() }) })
        .eq('id', r.id)
      continue
    }

    await admin.from('digi_reminders')
      .update(late ? { status: 'missed' } : { status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', r.id)
  }

  return NextResponse.json({ ok: true, sent, carded, missed, processed: due.length })
}

export const GET = withHeartbeat('/api/cron/digi-reminders', handler)
