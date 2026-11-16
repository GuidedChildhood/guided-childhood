import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, unsubscribeUrl, leadUnsubscribeUrl } from '@/lib/email'
import { stalledAskEmail, leadAskEmail } from '@/lib/email/templates'
import { parentFirstName } from '@/lib/email/parent-name'
import { askDue, askUrl, leadAskDue, leadAskUrl, LEAD_ASK_WINDOW_DAYS } from '@/lib/asks/stalled'
import { identityKey } from '@/lib/email/floor'
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
// Sent as kind 'ask' (Justin, 16 November 2026, "skip the rule"): the floor
// held both due asks on the first run, which would have put the one live
// family's ask after her free days ended. It still honours a stop, and there
// are only ever three. A send that fails hands its log row back for tomorrow.
//
// AND THE SAME FOR A STAGE CHECK WITH NO ACCOUNT (16 November 2026, "Yes, two
// short emails"): day 2 and four days after, then silence. See leadAsks below.
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
  const results = { sent: 0, notDue: 0, stopped: 0, throttled: 0, errors: 0, leadSent: 0 }
  // The leads first: they are cheap, and an empty list of accounts must not
  // skip them.
  await leadAsks(supabase, results)
  if (ids.length === 0) return NextResponse.json({ ok: true, ...results, processed: results.sent + results.leadSent })

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
    const r = await sendEmail({ to: p.email as string, subject: content.subject, html: content.html, key: due, kind: 'ask' })
    if (r.ok) results.sent++
    else {
      if (r.skipped) results.throttled++
      else results.errors++
      await supabase.from('email_log').delete().eq('user_id', id).eq('email_key', due)
    }
  }
  return NextResponse.json({ ok: true, ...results, processed: results.sent + results.leadSent })
}

export const GET = withHeartbeat('/api/cron/stalled-ask', handler)

// ── THE STAGE CHECK VISITORS WHO NEVER MADE AN ACCOUNT ─────────────────────
//
// A lead with a stage (they finished the stage check) from the last fortnight,
// no account under any form of the address, no stop clicked, no answer given
// and no topic course running (they asked us for something, so they did not
// stop). Logged in lead_email_log like every lead email. If migration 399 is
// not applied, the answers read errors and this whole step sends nothing,
// because a link whose answer cannot be saved must not go out.
async function leadAsks(
  supabase: ReturnType<typeof createAdminClient>,
  results: { leadSent: number; throttled: number; errors: number },
) {
  const since = new Date(Date.now() - (LEAD_ASK_WINDOW_DAYS + 6) * 86400000).toISOString()
  const { data: leads, error } = await supabase
    .from('starter_leads')
    .select('*') // every column, so the read works before and after migration 396
    .not('stage_id', 'is', null)
    .gte('created_at', since)
    .limit(300)
  if (error || !leads || leads.length === 0) return
  const live = leads.filter(l => l.email && !l.unsubscribed_at && l.marketing_consent !== false)
  if (live.length === 0) return

  const emails = live.map(l => l.email as string)
  const leadIds = live.map(l => l.id as string)
  const [{ data: accounts }, { data: log }, answered] = await Promise.all([
    supabase.from('profiles').select('email').in('email', emails),
    supabase.from('lead_email_log').select('email, email_key, sent_at').in('email', emails),
    supabase.from('parent_answers').select('lead_id').in('lead_id', leadIds),
  ])
  if (answered.error) return // 399 not applied: no lead link may go out yet
  const hasAccount = new Set((accounts ?? []).map(a => identityKey(a.email as string)).filter(Boolean))
  const hasAnswered = new Set((answered.data ?? []).map(a => a.lead_id as string))

  for (const lead of live) {
    const email = lead.email as string
    if (hasAccount.has(identityKey(email)) || hasAnswered.has(lead.id as string)) continue
    const mine = (log ?? []).filter(l => (l.email as string).toLowerCase() === email.toLowerCase())
    if (mine.some(l => String(l.email_key).startsWith('course:'))) continue
    const sent: Record<string, number | undefined> = {}
    for (const l of mine) if (String(l.email_key).startsWith('lead-ask-')) sent[l.email_key as string] = days(l.sent_at as string)
    const due = leadAskDue(days(lead.created_at as string), sent)
    if (!due) continue

    const { error: logErr } = await supabase.from('lead_email_log').insert({ email, email_key: due })
    if (logErr) continue
    const name = typeof (lead.answers as { childName?: unknown } | null)?.childName === 'string'
      ? String((lead.answers as { childName: string }).childName).trim() : ''
    const content = leadAskEmail({
      step: due,
      childName: name.length > 1 ? name : 'your child',
      askUrl: leadAskUrl(lead.id as string),
      unsubscribe: leadUnsubscribeUrl(email),
    })
    const r = await sendEmail({ to: email, subject: content.subject, html: content.html, key: due, kind: 'ask' })
    if (r.ok) results.leadSent++
    else {
      if (r.skipped) results.throttled++
      else results.errors++
      await supabase.from('lead_email_log').delete().eq('email', email).eq('email_key', due)
    }
  }
}
