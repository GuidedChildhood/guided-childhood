import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured } from '@/lib/email'
import { readHealth } from '@/lib/ops/health'
import { healthAlertEmail } from '@/lib/ops/alert-email'

// The daily "is anything broken" sweep.
//
// Runs at quarter past nine, after the morning block of email jobs at eight,
// twenty past and twenty to nine. Checking before them would only ever catch
// missing config; checking after catches that plus whether they actually ran
// and what they managed, which is the fault that went unseen for seventeen days.
//
// Only sends when something is actually down. Amber is for the board, not the
// inbox: an alert that arrives every morning stops being read within a week,
// and the first one anybody ignores will be the real one. Silence here is the
// signal that everything is running.
//
// It cannot alert on its own failure, which is the honest limit of any monitor
// living inside the thing it monitors. That gap is what the board is for, and
// the board shows this job's own heartbeat alongside the rest.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

function admin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

/**
 * Has an alert already gone today?
 *
 * Answered from this job's own heartbeat rather than a new table. Every run
 * records its reply, so a run earlier today that reported alerted true is the
 * record, and a manual run while chasing a fault does not send a second copy of
 * an email already sitting in the inbox.
 */
async function alertedToday(): Promise<boolean> {
  const supabase = admin()
  if (!supabase) return false
  const since = new Date(Date.now() - 20 * 3600000).toISOString()
  try {
    const { data } = await supabase
      .from('cron_runs')
      .select('detail')
      .eq('job', '/api/cron/health-alert')
      .gte('started_at', since)
      .limit(50)
    return ((data ?? []) as { detail: { alerted?: boolean } | null }[])
      .some(r => r.detail?.alerted === true)
  } catch {
    // Unreadable history means erring towards sending. A duplicate alert is a
    // nuisance, a missed one is the outage nobody knew about.
    return false
  }
}

async function handler(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const health = await readHealth()
  // Spread into every reply below, so `ok` stays the boolean the caller expects
  // and the count of passing checks travels under its own name.
  const summary = {
    level: health.level,
    down: health.summary.down,
    warn: health.summary.warn,
    passing: health.summary.ok,
  }

  if (health.level !== 'down') {
    return NextResponse.json({ ok: true, alerted: false, reason: 'nothing down', ...summary })
  }

  if (!emailConfigured()) {
    // The irony is worth recording plainly: the alert cannot reach anybody
    // because the thing it would report is the thing that carries it.
    return NextResponse.json({ ok: true, alerted: false, reason: 'RESEND_API_KEY not set, so the alert itself cannot send', ...summary })
  }

  if (await alertedToday()) {
    return NextResponse.json({ ok: true, alerted: false, reason: 'already alerted in the last 20 hours', ...summary })
  }

  const { subject, html } = healthAlertEmail(health)
  const result = await sendEmail({ to: FOUNDER_EMAIL, subject, html })

  return NextResponse.json({
    ok: result.ok,
    alerted: result.ok,
    reason: result.ok ? 'sent' : (result.error ?? 'send failed'),
    ...summary,
  }, { status: result.ok ? 200 : 500 })
}

export const GET = withHeartbeat('/api/cron/health-alert', handler)
