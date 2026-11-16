import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, unsubscribeUrl } from '@/lib/email'
import { stalledAskEmail } from '@/lib/email/templates'
import { parentFirstName } from '@/lib/email/parent-name'
import { askDue, askUrl } from '@/lib/asks/stalled'
import { hasPaidPlan } from '@/lib/access'
import { withHeartbeat } from '@/lib/ops/heartbeat'

// ASK THE PARENT WHO SIGNED UP AND STOPPED (Justin, 15 November 2026).
//
// Daily. A parent who made an account and then did nothing (no first check
// in, no finished day, not paying) is asked what stopped them: three days
// after sign up, four days after that, a week after that, then never again.
// Any answer on /tell-us stops the series, and so does starting to use the
// app, because a parent who came back does not need asking why they left.
//
// ITS OWN ROUTE, not a block in /api/email/cron, for the reason cron-kit
// gives: that route is one budget shared by twenty programmes, and the last
// one in the file is the one that never sends.
//
// Sent as a programme email, so it rides the one a week floor with everything
// else. A held send hands its log row back and is due again tomorrow.
//
// ONLY ACCOUNTS UNDER 45 DAYS OLD. The table holds months of test accounts and
// old sign ups; asking somebody from August why they stopped is noise to them
// and to us.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_AGE_DAYS = 45

const days = (iso: string) => Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorised' }, { status: 401 })
  }
  const supabase = createAdminClient()
  const since = new Date(Date.now() - MAX_AGE_DAYS * 86400000).toISOString()

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, created_at, subscription_status, trial_ends_at, email_opt_out, onboarding_complete, first_checkin_at')
    .eq('onboarding_complete', true)
    .is('first_checkin_at', null)
    .gte('created_at', since)
    .limit(500)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const ids = (profiles ?? []).map(p => p.id as string)
  const results = { sent: 0, notDue: 0, stopped: 0, throttled: 0, errors: 0 }
  if (ids.length === 0) return NextResponse.json({ ok: true, ...results })

  const [{ data: log }, { data: answered }, { data: sessions }, { data: kids }] = await Promise.all([
    supabase.from('email_log').select('user_id, email_key, sent_at').in('user_id', ids).in('email_key', ['ask-1', 'ask-2', 'ask-3']),
    supabase.from('parent_answers').select('user_id').in('user_id', ids),
    supabase.from('daily_sessions').select('user_id').in('user_id', ids).not('completed_at', 'is', null),
    supabase.from('children').select('parent_id, name, is_primary').in('parent_id', ids),
  ])
  const hasAnswered = new Set((answered ?? []).map(a => a.user_id as string))
  const hasDay = new Set((sessions ?? []).map(s => s.user_id as string))
  const childOf = new Map<string, string>()
  for (const k of kids ?? []) {
    const id = k.parent_id as string
    if (k.name && (k.is_primary || !childOf.has(id))) childOf.set(id, k.name as string)
  }

  for (const p of profiles ?? []) {
    const id = p.id as string
    if (!p.email || p.email_opt_out || hasAnswered.has(id) || hasDay.has(id)
      || hasPaidPlan({ subscription_status: p.subscription_status as string | null })) {
      results.stopped++
      continue
    }
    const sent: Record<string, number | undefined> = {}
    for (const l of log ?? []) if (l.user_id === id) sent[l.email_key as string] = days(l.sent_at as string)
    const due = askDue(days(p.created_at as string), sent) as 'ask-1' | 'ask-2' | 'ask-3' | null
    if (!due) { results.notDue++; continue }

    const { error: logError } = await supabase.from('email_log').insert({ user_id: id, email_key: due })
    if (logError) { results.notDue++; continue }

    const ends = p.trial_ends_at ? new Date(p.trial_ends_at as string) : null
    const freeUntil = ends && ends.getTime() > Date.now() + 12 * 3600000
      ? new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/London' }).format(ends)
      : null
    const content = stalledAskEmail({
      step: due,
      parentName: parentFirstName(p.full_name as string | null, p.email as string),
      childName: childOf.get(id) ?? 'your child',
      askUrl: askUrl(id),
      freeUntil,
      unsubscribe: unsubscribeUrl(id),
    })
    const r = await sendEmail({ to: p.email as string, subject: content.subject, html: content.html, key: due, kind: 'programme' })
    if (r.ok) results.sent++
    else {
      if (r.skipped) results.throttled++
      else results.errors++
      await supabase.from('email_log').delete().eq('user_id', id).eq('email_key', due)
    }
  }
  return NextResponse.json({ ok: true, ...results })
}

export const GET = withHeartbeat('/api/cron/stalled-ask', handler)
