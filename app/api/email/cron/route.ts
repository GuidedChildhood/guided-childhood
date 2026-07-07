import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured, unsubscribeUrl } from '@/lib/email'
import { day2StageEmail, day3TourEmail, day4DigiEmail, day7FounderEmail, weeklyDigestEmail } from '@/lib/email/templates'
import { STAGES, getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { FOUNDER_CAP } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily lifecycle email run, called by Vercel Cron (see vercel.json).
// Day 2 stage guide, day 4 DiGi nudge, day 7 founder rate, and on
// Mondays the weekly digest. Every send is recorded in email_log with a
// unique (user_id, email_key), so re-runs and overlapping windows can
// never double send.

interface ProfileRow {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  subscription_status: string | null
  email_opt_out: boolean
  onboarding_complete: boolean | null
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

// ISO week key so each Monday digest has its own idempotency key
function digestKey(now: Date): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `digest-${d.getUTCFullYear()}-${String(week).padStart(2, '0')}`
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!emailConfigured()) {
    return NextResponse.json({ skipped: true, reason: 'RESEND_API_KEY not set' })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  // Everyone who joined in the last 30 days is in lifecycle range;
  // digests go to anyone who completed onboarding.
  const since = new Date(Date.now() - 30 * 86400000).toISOString()
  const [{ data: profiles }, { data: log }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, subscription_status, email_opt_out, onboarding_complete')
      .gte('created_at', since),
    supabase.from('email_log').select('user_id, email_key'),
  ])

  const sentKeys = new Set((log ?? []).map(l => `${l.user_id}:${l.email_key}`))
  const alreadySent = (userId: string, key: string) => sentKeys.has(`${userId}:${key}`)

  let founderRemaining: number | null = null
  async function getFounderRemaining(): Promise<number> {
    if (founderRemaining === null) {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_founder', true)
        .eq('subscription_status', 'active')
      founderRemaining = Math.max(0, FOUNDER_CAP - (count ?? 0))
    }
    return founderRemaining
  }

  const results: Record<string, number> = { day2: 0, day3: 0, day4: 0, day7: 0, digest: 0, errors: 0 }

  async function deliver(userId: string, email: string, key: string, content: { subject: string; html: string }, counter: string) {
    const { error: logError } = await supabase.from('email_log').insert({ user_id: userId, email_key: key })
    if (logError) return // unique violation means another run got here first
    const sent = await sendEmail({ to: email, subject: content.subject, html: content.html })
    if (sent.ok) {
      results[counter] += 1
    } else {
      results.errors += 1
      await supabase.from('email_log').delete().eq('user_id', userId).eq('email_key', key)
    }
  }

  for (const profile of (profiles ?? []) as ProfileRow[]) {
    if (!profile.email || profile.email_opt_out || !profile.onboarding_complete) continue
    const days = daysSince(profile.created_at)
    const name = profile.full_name?.split(' ')[0] ?? 'there'
    const unsubscribe = unsubscribeUrl(profile.id)

    const { data: child } = await supabase
      .from('children')
      .select('name, age_band, stage_id')
      .eq('parent_id', profile.id)
      .eq('is_primary', true)
      .maybeSingle()
    const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
    const stage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : STAGES[2]

    if (days >= 2 && !alreadySent(profile.id, 'day2-stage')) {
      await deliver(profile.id, profile.email, 'day2-stage', day2StageEmail({
        childName, stageName: stage.name, stageFocus: stage.focus.toLowerCase(), unsubscribe,
      }), 'day2')
    }

    if (days >= 3 && !alreadySent(profile.id, 'day3-tour')) {
      await deliver(profile.id, profile.email, 'day3-tour', day3TourEmail({
        parentName: name, childName, unsubscribe,
      }), 'day3')
    }

    if (days >= 4 && !alreadySent(profile.id, 'day4-digi')) {
      await deliver(profile.id, profile.email, 'day4-digi', day4DigiEmail({ childName, unsubscribe }), 'day4')
    }

    if (days >= 7 && !alreadySent(profile.id, 'day7-founder') && profile.subscription_status !== 'active') {
      const remaining = await getFounderRemaining()
      if (remaining > 0) {
        await deliver(profile.id, profile.email, 'day7-founder', day7FounderEmail({ remaining, unsubscribe }), 'day7')
      }
    }
  }

  // Monday digest, for everyone onboarded (not just the last 30 days)
  const now = new Date()
  if (now.getUTCDay() === 1) {
    const key = digestKey(now)
    const { data: allProfiles } = await supabase
      .from('profiles')
      .select('id, email, full_name, created_at, subscription_status, email_opt_out, onboarding_complete')
      .eq('onboarding_complete', true)
      .eq('email_opt_out', false)

    for (const profile of (allProfiles ?? []) as ProfileRow[]) {
      if (!profile.email || alreadySent(profile.id, key)) continue
      // Only send a digest once the account is at least a week old
      if (daysSince(profile.created_at) < 7) continue

      const [{ data: child }, { data: completions }] = await Promise.all([
        supabase.from('children').select('name, age_band').eq('parent_id', profile.id).eq('is_primary', true).maybeSingle(),
        supabase.from('script_completions').select('completed_at').eq('user_id', profile.id),
      ])
      const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
      const stage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : STAGES[2]
      const weekAgo = Date.now() - 7 * 86400000
      const total = (completions ?? []).length
      const thisWeek = (completions ?? []).filter(c => new Date(c.completed_at).getTime() >= weekAgo).length

      await deliver(profile.id, profile.email, key, weeklyDigestEmail({
        childName, stageName: stage.name, scriptsDoneTotal: total, scriptsDoneThisWeek: thisWeek, unsubscribe: unsubscribeUrl(profile.id),
      }), 'digest')
    }
  }

  return NextResponse.json({ ok: true, ...results })
}
