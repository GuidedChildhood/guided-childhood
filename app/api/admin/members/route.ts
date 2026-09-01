import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { lifecycleState, type LifecycleState } from '@/lib/email/lifecycle'
import { NextResponse } from 'next/server'

// Who is actually here, and are they coming back.
//
// Justin: "have all stats on insight board, users login patterns of users, non
// paid and any other useful stats we could see on dashboard."
//
// The board already answers is DiGi working and what are parents asking. It
// could not answer how many people are there, how many pay, and are they still
// turning up, which is the question underneath every other decision.
//
// Login is the one number that had no home in our own tables. profiles has no
// last_seen column, so it comes from auth.users via the admin API, which is the
// only place Supabase records it. That read is paginated and therefore the
// expensive part of this route: fine at the current size, and the note below
// says plainly when it stops being fine rather than leaving a silent cliff.
//
// Founder gated, same rule as the page.

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

const PAGE = 1000
const MAX_PAGES = 10 // 10k members, then the numbers get marked partial

function daysAgo(iso: string | null | undefined): number | null {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const admin = createAdminClient()

  const [{ data: profiles }, { data: convos }, { data: log }] = await Promise.all([
    admin.from('profiles').select('id, created_at, subscription_status, trial_ends_at, email_opt_out, onboarding_complete, is_founder'),
    admin.from('digi_conversations').select('user_id, last_message_date, message_count'),
    admin.from('email_log').select('user_id, email_key, sent_at'),
  ])

  // last_sign_in_at lives only in auth.users, which the JS client cannot reach
  // with .from(), so it comes through the admin listUsers pages.
  const signInByUser = new Map<string, string | null>()
  let truncated = false
  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PAGE })
      if (error) throw error
      for (const u of data.users) signInByUser.set(u.id, u.last_sign_in_at ?? null)
      if (data.users.length < PAGE) break
      if (page === MAX_PAGES) truncated = true
    }
  } catch {
    // A missing service key or a permission change must not take the whole
    // board down. The panel says login data is unavailable rather than
    // quietly showing zeroes, which would read as nobody logging in.
    signInByUser.clear()
  }

  const rows = profiles ?? []
  const states: Record<LifecycleState, number> = {
    lead: 0, trialing: 0, trial_ending: 0, active: 0, past_due: 0, lapsed: 0, unknown: 0,
  }

  let onboarded = 0
  let optedOut = 0
  let founders = 0
  const logins = { day: 0, week: 0, month: 0, older: 0, never: 0, known: 0 }
  const newSignups = { day: 0, week: 0, month: 0 }
  // Engagement split by whether they pay, which is the comparison that tells
  // you whether the paywall sits in the right place.
  const asked = { paidWeek: 0, paidTotal: 0, freeWeek: 0, freeTotal: 0 }

  // One thread per child since migration 235, so a family can hold several
  // rows. The board thinks per member: counts summed, the newest date wins.
  const convoByUser = new Map<string, { user_id: string; last_message_date: string | null; message_count: number | null }>()
  for (const c of convos ?? []) {
    const key = c.user_id as string
    const prev = convoByUser.get(key)
    if (!prev) {
      convoByUser.set(key, { user_id: key, last_message_date: c.last_message_date ?? null, message_count: c.message_count ?? 0 })
    } else {
      prev.message_count = (prev.message_count ?? 0) + (c.message_count ?? 0)
      if ((c.last_message_date ?? '') > (prev.last_message_date ?? '')) prev.last_message_date = c.last_message_date
    }
  }

  for (const p of rows) {
    const state = lifecycleState(p as { subscription_status: string | null; trial_ends_at: string | null })
    states[state] += 1
    if (p.onboarding_complete) onboarded += 1
    if (p.email_opt_out) optedOut += 1
    if (p.is_founder && state === 'active') founders += 1

    const age = daysAgo(p.created_at as string)
    if (age != null) {
      if (age < 1) newSignups.day += 1
      if (age < 7) newSignups.week += 1
      if (age < 30) newSignups.month += 1
    }

    if (signInByUser.size > 0) {
      const seen = daysAgo(signInByUser.get(p.id as string) ?? null)
      logins.known += 1
      if (seen == null) logins.never += 1
      else if (seen < 1) logins.day += 1
      else if (seen < 7) logins.week += 1
      else if (seen < 30) logins.month += 1
      else logins.older += 1
    }

    const convo = convoByUser.get(p.id as string)
    const askedDays = daysAgo(convo?.last_message_date as string | null)
    const paid = state === 'active'
    if (convo && (convo.message_count ?? 0) > 0) {
      if (paid) asked.paidTotal += 1
      else asked.freeTotal += 1
      if (askedDays != null && askedDays < 7) {
        if (paid) asked.paidWeek += 1
        else asked.freeWeek += 1
      }
    }
  }

  // What the email programme actually did lately, so a run that quietly stops
  // is visible here rather than only in a Vercel log nobody opens.
  const weekAgo = Date.now() - 7 * 86400000
  const recent = (log ?? []).filter(l => new Date(l.sent_at as string).getTime() >= weekAgo)
  const byKey = new Map<string, number>()
  for (const l of recent) byKey.set(l.email_key as string, (byKey.get(l.email_key as string) ?? 0) + 1)
  const topKeys = [...byKey.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)

  const paying = states.active
  const total = rows.length

  return NextResponse.json({
    total,
    onboarded,
    optedOut,
    founders,
    states,
    logins: signInByUser.size > 0 ? logins : null,
    newSignups,
    asked,
    emails: { last7: recent.length, total: (log ?? []).length, topKeys },
    conversion: total > 0 ? Math.round((paying / total) * 1000) / 10 : 0,
    truncated,
  })
}
