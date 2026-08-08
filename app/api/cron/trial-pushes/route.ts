import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendPush } from '@/lib/push/send'
import { trialDaysLeft, lifecycleState } from '@/lib/email/lifecycle'
import { withHeartbeat } from '@/lib/ops/heartbeat'

// The four day funnel's push side, approved by Justin on 8 August: three
// pushes riding the trial clock, each honest, each once, none to payers.
//
//   days left 3   the value push: what their family has built so far
//   days left 2   the honest warning: full access ends tomorrow
//   days left 1   the last call: ends today, founder rate holds it open
//
// The techniques stay the honest three, per TrialCountdown: their own
// evidence (real approved tick counts or nothing), a real clock, and true
// scarcity (the live founder seats count against the cap enforced in
// checkout). No invented urgency, no guilt copy.
//
// Once only rides the email_log table's unique (user_id, email_key) with
// push- prefixed keys: insert first, and the unique violation is the lock,
// same as the email cron. A transport failure deletes the row so tomorrow
// retries; a parent with no push devices keeps the row, because retrying
// a send that has nowhere to land would just burn the cron budget daily.
//
// Runs daily at 08:30 UTC (vercel.json), after the 08:00 email cron so a
// household hears one morning voice at a time, not two at once.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const PUSHES: Record<number, string> = { 3: 'push-trial-value', 2: 'push-trial-warn', 1: 'push-trial-lastcall' }

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = Date.now()

  // Everyone whose trial ends inside the next four days: the whole window
  // the three pushes live in. Payers drop out via lifecycleState below.
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, subscription_status, trial_ends_at, onboarding_complete')
    .not('trial_ends_at', 'is', null)
    .gte('trial_ends_at', new Date(now).toISOString())
    .lte('trial_ends_at', new Date(now + 4 * 86400000).toISOString())
    .limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = { value: 0, warn: 0, lastcall: 0, skipped: 0, errors: 0 }

  // The live founder seats line, computed once per run. If the count cannot
  // be read the last call sends without a number rather than inventing one.
  let seatsLine = 'The founder rate holds everything open.'
  try {
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_founder', true)
      .eq('subscription_status', 'active')
    if (typeof count === 'number' && count >= 0 && count < 50) {
      seatsLine = `The founder rate holds everything open. ${50 - count} of 50 seats left.`
    }
  } catch { /* honest fallback line already set */ }

  for (const p of profiles ?? []) {
    if (!p.onboarding_complete) { results.skipped++; continue }
    const state = lifecycleState(p)
    if (state === 'active' || state === 'lapsed' || state === 'unknown') { results.skipped++; continue }
    const daysLeft = trialDaysLeft(p.trial_ends_at)
    const key = daysLeft != null ? PUSHES[daysLeft] : undefined
    if (!key) { results.skipped++; continue }

    // Insert first: the unique index is the once-only lock across runs.
    const { error: logError } = await supabase.from('email_log').insert({ user_id: p.id, email_key: key })
    if (logError) { results.skipped++; continue }

    let title = ''
    let body = ''
    if (key === 'push-trial-value') {
      // Their own evidence: approved job ticks across the family so far.
      let ticks = 0
      try {
        const { count } = await supabase
          .from('quest_ticks')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', p.id)
          .eq('status', 'approved')
        ticks = count ?? 0
      } catch { /* zero reads as the generic line */ }
      title = 'Two days of full access left'
      body = ticks > 0
        ? `${ticks} job${ticks === 1 ? '' : 's'} ticked and approved already. Everything stays unlocked for two more days.`
        : 'Everything is unlocked for two more days. Tonight is a good night to try a script or ask DiGi anything.'
    } else if (key === 'push-trial-warn') {
      title = 'Full access ends tomorrow'
      body = 'After tomorrow the free tier returns: fewer scripts and DiGi limits. The founder rate keeps everything, capped at 50 families.'
    } else {
      title = 'Your trial ends today'
      body = seatsLine
    }

    const sent = await sendPush({ userId: p.id, title, body, url: '/dashboard/upgrade' })
    if (sent.error) {
      // Transport failure: release the lock so tomorrow's run can retry.
      results.errors++
      await supabase.from('email_log').delete().eq('user_id', p.id).eq('email_key', key)
    } else {
      if (key === 'push-trial-value') results.value++
      else if (key === 'push-trial-warn') results.warn++
      else results.lastcall++
    }
  }

  return NextResponse.json({ ok: true, ...results })
}

export const GET = withHeartbeat('/api/cron/trial-pushes', handler)
