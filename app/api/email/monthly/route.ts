import { NextRequest, NextResponse } from 'next/server'
import { emailConfigured, unsubscribeUrl } from '@/lib/email'
import { monthlyBalanceEmail } from '@/lib/email/templates'
import { buildMonthPace } from '@/lib/balance/pace'
import { deviceLabel } from '@/lib/quests/device-time'
import { recommendedDailyMinutes } from '@/lib/quests/screen-balance'
import {
  adminClient, cronAuthorised, daysSince, deadline, deliverOnce, monthKey,
  loadSentKeys, type ProfileRow,
} from '@/lib/email/cron-kit'

// The monthly screen time review.
//
// Sent monthly rather than weekly on purpose. A weekly screen time verdict
// makes a parent feel marked every seven days, and a single bad week is almost
// always a holiday or an illness rather than a pattern. A month is long enough
// to be a pattern and short enough to still be actionable, and it is the only
// window where "less than last month" means anything.
//
// It has never sent a single email. It was the LAST block of one long daily
// handler, behind the lifecycle sequence, the lead drip and the weekly digest,
// and the run never once reached it inside its sixty seconds. balance-2026-06,
// which should have gone out on 1 July, has no rows at all. Nothing errored and
// nothing was logged, so there was no sign of it anywhere.
//
// Its own route now, and scheduled daily rather than only on the 1st, but it
// does real work only in the first week of the month (see CATCH_UP_DAYS). The
// key is the month, so the first run that reaches a parent sends it and every
// run after that finds nothing to do. On the 1st it goes out as intended; if
// that run cannot finish, the 2nd carries on rather than the month being lost.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const BUDGET_MS = 45_000

// How long into the new month a missed review is still worth sending.
//
// The date gate could not simply be removed, the way the digest's Monday gate
// could. A week's digest is naturally bounded, because the ISO week key changes
// when the week does, so a daily run can only ever send the CURRENT week. A
// month key does not turn over for thirty days, so an ungated daily run would
// have posted the June review on 30 July: a month stale, about a period the
// parent has stopped thinking about, which is worse than not sending it.
//
// A week is the right window. Long enough that a slow 1st, or a run that could
// not finish, is caught rather than lost. Short enough that the month being
// reviewed is still the one just gone.
const CATCH_UP_DAYS = 7

export async function GET(req: NextRequest) {
  if (!cronAuthorised(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!emailConfigured()) {
    return NextResponse.json({ skipped: true, reason: 'RESEND_API_KEY not set' })
  }

  const clock = deadline(BUDGET_MS)
  const supabase = adminClient()
  const now = new Date()

  // Outside the catch up window there is nothing this route should do. Cheap,
  // and it means the daily schedule costs one no op on twenty three days out of
  // thirty rather than a full profile scan.
  if (now.getUTCDate() > CATCH_UP_DAYS) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'outside catch up window', day: now.getUTCDate() })
  }

  // The month just finished, and the one before it for the comparison.
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))
  const prevStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 2, 1))
  const daysIn = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000)
  const key = monthKey(monthStart)
  const monthLabel = monthStart.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })

  const [sentKeys, { data: profiles }] = await Promise.all([
    loadSentKeys(supabase),
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, subscription_status, trial_ends_at, email_opt_out, onboarding_complete')
      .eq('onboarding_complete', true)
      .eq('email_opt_out', false),
  ])

  const due = ((profiles ?? []) as ProfileRow[]).filter(p =>
    // A month of data is the point of the email, so an account younger than
    // that gets nothing rather than a review of nine days.
    p.email && !sentKeys.has(`${p.id}:${key}`) && daysSince(p.created_at) >= 30,
  )

  let sent = 0, failed = 0, skipped = 0, noData = 0
  let remaining = due.length

  for (const profile of due) {
    if (clock.out()) break
    remaining -= 1

    try {
      const { data: child } = await supabase
        .from('children').select('id, name, age_band').eq('parent_id', profile.id).eq('is_primary', true).maybeSingle()
      if (!child) { noData += 1; continue }

      const { data: sessions } = await supabase
        .from('device_sessions')
        .select('device, minutes, started_at')
        .eq('user_id', profile.id).eq('child_id', child.id)
        .gte('started_at', prevStart.toISOString()).lt('started_at', monthEnd.toISOString())

      const rows = sessions ?? []
      const inRange = (from: Date, to: Date) => rows.filter(r => {
        const t = String(r.started_at)
        return t >= from.toISOString() && t < to.toISOString()
      })
      const thisMonth = inRange(monthStart, monthEnd)
      const lastMonth = inRange(prevStart, monthStart)
      const sum = (list: typeof rows) => list.reduce((n, r) => n + (Number(r.minutes) || 0), 0)

      // Nothing logged is not a zero minute month, it is a family who has not
      // used the timer. Reporting "0 minutes a day, on track" to them would be
      // a lie dressed as praise, so they get no email at all.
      if (thisMonth.length === 0) { noData += 1; continue }

      const pace = buildMonthPace({
        usedThisMonth: sum(thisMonth),
        // Dated to the month being reviewed, not to today. The guide is holiday
        // adjusted, so reading it on the day the email happens to send would
        // judge June against July's school calendar.
        dailyGuide: recommendedDailyMinutes((child as { age_band?: string | null }).age_band ?? null, { on: monthStart }),
        days: daysIn(monthStart, monthEnd),
        usedPreviousMonth: lastMonth.length > 0 ? sum(lastMonth) : null,
        previousDays: lastMonth.length > 0 ? daysIn(prevStart, monthStart) : null,
      })

      // The heaviest device of the month, named where we know its real name.
      const byDevice = new Map<string, number>()
      for (const r of thisMonth) {
        const d = String(r.device)
        byDevice.set(d, (byDevice.get(d) ?? 0) + (Number(r.minutes) || 0))
      }
      const top = [...byDevice.entries()].sort((a, b) => b[1] - a[1])[0]
      const heaviest = top ? { label: `the ${deviceLabel(top[0]).toLowerCase()}`, minutes: top[1] } : null

      const childLabel = child.name && child.name !== 'Your child' ? child.name : 'your child'
      const result = await deliverOnce(supabase, profile.id, profile.email!, key, monthlyBalanceEmail({
        childLabel, monthLabel, pace, heaviest, unsubscribe: unsubscribeUrl(profile.id),
      }))
      if (result === 'sent') sent += 1
      else if (result === 'failed') failed += 1
      else skipped += 1
    } catch {
      failed += 1
      remaining += 1
    }
  }

  return NextResponse.json({
    ok: true, key, monthLabel, due: due.length, sent, failed, skipped, noData, remaining,
    spentMs: clock.spentMs(),
  })
}
