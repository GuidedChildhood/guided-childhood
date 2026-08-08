import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured, unsubscribeUrl, leadUnsubscribeUrl, starterCtaUrl } from '@/lib/email'
import { welcomeEmail, day2StageEmail, day3TourEmail, day4DigiEmail, day7FounderEmail, weeklyDigestEmail, trialEndingEmail, winBackEmail, leadNurtureEmail, childPhoneEmail, screenTimeEmail, lessonsEmail, schoolRemindersEmail, familyAgreementEmail, printablesRevealEmail, balanceRevealEmail, mentalHealthRevealEmail, passportRevealEmail, digiTeaserEmail, scriptsTeaserEmail, printablesTeaserEmail, balanceTeaserEmail, mentalHealthTeaserEmail, safetyTeaserEmail, passportTeaserEmail, founderLeadEmail, curriculumStrandsEmail, curriculumSchoolEmail, digiBrainEmail, digiLearnsEmail, digiFeedbackLoopEmail, digiChecksEmail } from '@/lib/email/templates'
import type { EmailContent } from '@/lib/email/templates'
import { lifecycleState, trialDaysLeft } from '@/lib/email/lifecycle'
import { STAGES, getStageFromAgeBand, type AgeBand } from '@/lib/content/stages'
import { FOUNDER_CAP } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Daily lifecycle email run, called by Vercel Cron (see vercel.json).
// Welcome, the day 2 to day 7 sequence, the service reveals, trial ending and
// win back, plus the pre sign up lead drip. Every send is recorded in email_log
// with a unique (user_id, email_key), so re-runs and overlapping windows can
// never double send.
//
// The weekly digest and the monthly review are NOT here. They are their own
// routes, for the reason set out at the foot of this handler.

interface ProfileRow {
  id: string
  email: string | null
  full_name: string | null
  created_at: string
  subscription_status: string | null
  trial_ends_at: string | null
  email_opt_out: boolean
  onboarding_complete: boolean | null
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

async function handler(req: NextRequest) {
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

  // Everyone still inside the lifecycle programme; digests go to anyone who
  // completed onboarding.
  //
  // This window is a hard ceiling on the whole sequence, and a silent one: an
  // email scheduled past it never sends, never errors and never logs. It was 30
  // days when the programme ended at day 25. The curriculum and DiGi emails run
  // to day 43, so 60 gives the last of them a fortnight of daily runs to land
  // even if a run is missed, while still keeping the query off the full table.
  const since = new Date(Date.now() - 200 * 86400000).toISOString()
  const [{ data: profiles }, { data: log }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, subscription_status, trial_ends_at, email_opt_out, onboarding_complete')
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

  const results: Record<string, number> = { welcome: 0, day2: 0, day3: 0, day4: 0, day7: 0, svcChildPhone: 0, svcScreenTime: 0, svcLessons: 0, svcSchool: 0, svcAgreement: 0, revealPrintables: 0, revealBalance: 0, revealMind: 0, revealPassport: 0, curriculumStrands: 0, curriculumSchool: 0, digiBrain: 0, digiLearns: 0, digiFeedbackLoop: 0, digiChecks: 0, trialEnding: 0, winback: 0, leadNurture: 0, leadTeaser: 0, errors: 0 }

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

    // Day 0 welcome, the moment onboarding is done. Held to genuinely new
    // accounts (first couple of days) so switching this on never lands a
    // welcome in an established parent's inbox on the next run.
    if (days <= 2 && !alreadySent(profile.id, 'welcome')) {
      await deliver(profile.id, profile.email, 'welcome', welcomeEmail({ parentName: name, childName, unsubscribe }), 'welcome')
    }

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

    // The service drip: one benefit email per service through the second week,
    // each only sent when that service is NOT set up yet, so it is a genuine
    // "here is why, here is where" nudge and never nags about something done.
    // The setup signal is only queried once the day and the log both allow it.
    if (days >= 14 && !alreadySent(profile.id, 'svc-childphone') && !!child?.age_band && child.age_band !== '4-7') {
      const { data: link } = await supabase.from('kid_links').select('child_id').eq('user_id', profile.id).limit(1).maybeSingle()
      if (!link) await deliver(profile.id, profile.email, 'svc-childphone', childPhoneEmail({ childName, unsubscribe }), 'svcChildPhone')
    }

    if (days >= 21 && !alreadySent(profile.id, 'svc-screentime')) {
      const { count } = await supabase.from('family_quests').select('id', { count: 'exact', head: true }).eq('user_id', profile.id).eq('active', true)
      if ((count ?? 0) === 0) await deliver(profile.id, profile.email, 'svc-screentime', screenTimeEmail({ childName, unsubscribe }), 'svcScreenTime')
    }

    if (days >= 28 && !alreadySent(profile.id, 'svc-lessons')) {
      const { data: done } = await supabase.from('lesson_completions').select('lesson_id').eq('user_id', profile.id).limit(1).maybeSingle()
      if (!done) await deliver(profile.id, profile.email, 'svc-lessons', lessonsEmail({ childName, unsubscribe }), 'svcLessons')
    }

    if (days >= 35 && !alreadySent(profile.id, 'svc-school')) {
      const [{ data: conn }, { data: act }] = await Promise.all([
        supabase.from('school_connections').select('id').eq('user_id', profile.id).eq('active', true).maybeSingle(),
        supabase.from('school_actions').select('id').eq('user_id', profile.id).limit(1).maybeSingle(),
      ])
      if (!conn && !act) await deliver(profile.id, profile.email, 'svc-school', schoolRemindersEmail({ childName, unsubscribe }), 'svcSchool')
    }

    if (days >= 42 && !alreadySent(profile.id, 'svc-agreement')) {
      const { data: agreement } = await supabase.from('family_agreements').select('id').eq('user_id', profile.id).limit(1).maybeSingle()
      if (!agreement) await deliver(profile.id, profile.email, 'svc-agreement', familyAgreementEmail({ childName, unsubscribe }), 'svcAgreement')
    }

    // The pillar reveals: one warm feature spotlight each, spaced through the
    // third and fourth week so the free plan keeps giving. Sent once each, so a
    // parent who already lives in that feature simply never sees a second one.
    if (days >= 49 && !alreadySent(profile.id, 'reveal-printables')) {
      await deliver(profile.id, profile.email, 'reveal-printables', printablesRevealEmail({ childName, unsubscribe }), 'revealPrintables')
    }
    if (days >= 56 && !alreadySent(profile.id, 'reveal-balance')) {
      await deliver(profile.id, profile.email, 'reveal-balance', balanceRevealEmail({ childName, unsubscribe }), 'revealBalance')
    }
    if (days >= 63 && !alreadySent(profile.id, 'reveal-mind')) {
      await deliver(profile.id, profile.email, 'reveal-mind', mentalHealthRevealEmail({ unsubscribe }), 'revealMind')
    }
    if (days >= 70 && !alreadySent(profile.id, 'reveal-passport')) {
      await deliver(profile.id, profile.email, 'reveal-passport', passportRevealEmail({ childName, unsubscribe }), 'revealPassport')
    }

    // Weeks 5 to 7. The first four weeks show the tools; these explain the
    // thinking underneath them, because a parent this far in has stopped
    // needing a tour and started asking whether the thing they are trusting is
    // any good. Spaced every three days rather than every two: six straight
    // weeks at onboarding pace stops reading as help.
    if (days >= 77 && !alreadySent(profile.id, 'curriculum-strands')) {
      await deliver(profile.id, profile.email, 'curriculum-strands', curriculumStrandsEmail({
        childName, keyStage: stage.keyStage, unsubscribe,
      }), 'curriculumStrands')
    }
    if (days >= 84 && !alreadySent(profile.id, 'curriculum-school')) {
      await deliver(profile.id, profile.email, 'curriculum-school', curriculumSchoolEmail({
        childName, stageName: stage.name, stageId: stage.id, unsubscribe,
      }), 'curriculumSchool')
    }
    if (days >= 91 && !alreadySent(profile.id, 'digi-brain')) {
      await deliver(profile.id, profile.email, 'digi-brain', digiBrainEmail({ childName, unsubscribe }), 'digiBrain')
    }
    if (days >= 98 && !alreadySent(profile.id, 'digi-learns')) {
      await deliver(profile.id, profile.email, 'digi-learns', digiLearnsEmail({ unsubscribe }), 'digiLearns')
    }
    if (days >= 105 && !alreadySent(profile.id, 'digi-feedback-loop')) {
      await deliver(profile.id, profile.email, 'digi-feedback-loop', digiFeedbackLoopEmail({ childName, unsubscribe }), 'digiFeedbackLoop')
    }
    if (days >= 112 && !alreadySent(profile.id, 'digi-checks')) {
      await deliver(profile.id, profile.email, 'digi-checks', digiChecksEmail({ unsubscribe }), 'digiChecks')
    }

    // The status aware layer: branch on where the contact actually is, not on
    // the day count. Trial nurture stops on payment (an active member is never
    // in trial_ending or lapsed), and win back starts on lapse. Both send once.
    const state = lifecycleState(profile)

    if (state === 'trial_ending' && !alreadySent(profile.id, 'trial-ending')) {
      const left = trialDaysLeft(profile.trial_ends_at) ?? 1
      await deliver(profile.id, profile.email, 'trial-ending', trialEndingEmail({
        childName, daysLeft: Math.max(1, left), unsubscribe,
      }), 'trialEnding')
    }

    if (state === 'lapsed' && !alreadySent(profile.id, 'winback-1')) {
      // Give it a couple of days after the lapse so it does not land the same
      // day as the day 7 founder email. A cancellation (no trial date) sends.
      const left = trialDaysLeft(profile.trial_ends_at)
      if (left == null || left <= -2) {
        await deliver(profile.id, profile.email, 'winback-1', winBackEmail({ childName, unsubscribe }), 'winback')
      }
    }
  }

  // Lead nurture: emails captured before an account exists (magnet downloads
  // and quiz drop offs). One warm nudge to come start the free trial, at least
  // a day after capture, guarded once by nurtured_at. Anyone who already has
  // an account is excluded, so a real member never gets a start your trial
  // email (the converted flag is not reliably set, so profiles is the source
  // of truth here).
  //
  // Both lead reads skip anyone who has clicked stop, and both fall back to the
  // unfiltered read if that column is not there yet. Without the fallback, a
  // deploy landing before migration 104 would error the query, return nothing,
  // and silently switch the whole lead programme off with nothing to say why.
  const dayAgo = new Date(Date.now() - 86400000).toISOString()
  const nurtureQuery = () => supabase
    .from('starter_leads')
    .select('email')
    .is('nurtured_at', null)
    .lte('created_at', dayAgo)
    .limit(200)
  let { data: leads, error: leadsErr } = await nurtureQuery().is('unsubscribed_at', null)
  if (leadsErr) ({ data: leads } = await nurtureQuery())

  const leadEmails = (leads ?? []).map(l => l.email as string).filter(Boolean)
  if (leadEmails.length > 0) {
    const { data: existing } = await supabase
      .from('profiles').select('email').in('email', leadEmails)
    const hasAccount = new Set((existing ?? []).map(p => (p.email as string)?.toLowerCase()))

    for (const email of leadEmails) {
      if (hasAccount.has(email.toLowerCase())) continue
      // Stamp first so a send failure never re-sends on the next run.
      const { error: stampErr } = await supabase
        .from('starter_leads').update({ nurtured_at: new Date().toISOString() })
        .eq('email', email).is('nurtured_at', null)
      if (stampErr) continue
      const sent = await sendEmail({ to: email, ...leadNurtureEmail(leadUnsubscribeUrl(email), starterCtaUrl(email)) })
      if (sent.ok) results.leadNurture += 1
      else {
        results.errors += 1
        await supabase.from('starter_leads').update({ nurtured_at: null }).eq('email', email)
      }
    }
  }

  // Lead teaser drip: the pre sign up sequence. One clever thing per email on a
  // gentle cadence (day 3 to 15, then the founder close), each earning the sign
  // up by showing not telling. Leads have no account id, so the sequence is
  // deduped in lead_email_log, mirroring the account email_log. Anyone who has
  // since made an account drops out, so a real member never gets a teaser.
  {
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString()
    const teaserQuery = () => supabase
      .from('starter_leads')
      .select('email, created_at')
      .gte('created_at', monthAgo)
      .lte('created_at', dayAgo)
      .limit(500)
    let { data: teaserLeads, error: teaserErr } = await teaserQuery().is('unsubscribed_at', null)
    if (teaserErr) ({ data: teaserLeads } = await teaserQuery())
    const rows = (teaserLeads ?? []).filter(l => !!l.email)
    if (rows.length > 0) {
      const originals = rows.map(l => l.email as string)
      const [{ data: accounts }, { data: sentLog }] = await Promise.all([
        supabase.from('profiles').select('email').in('email', originals),
        supabase.from('lead_email_log').select('email, email_key').in('email', originals),
      ])
      const hasAccount = new Set((accounts ?? []).map(p => (p.email as string)?.toLowerCase()))
      const leadSent = new Set((sentLog ?? []).map(l => `${(l.email as string).toLowerCase()}:${l.email_key}`))

      // Days since capture, the key, and the content. Day 1 is the existing
      // nurture above, so the teasers start at day 3.
      // Each teaser carries a real one click stop keyed to the address it is
      // going to, so a parent who has since joined under a different address
      // can end the sequence themselves. The account check below only ever
      // catches the same address, and it always will.
      const schedule: { day: number; key: string; make: (unsub: string, cta: string) => EmailContent }[] = [
        { day: 3, key: 'teaser-digi', make: (u, c) => digiTeaserEmail(u, c) },
        { day: 5, key: 'teaser-scripts', make: (u, c) => scriptsTeaserEmail(u, c) },
        { day: 7, key: 'teaser-printables', make: (u, c) => printablesTeaserEmail(u, c) },
        { day: 9, key: 'teaser-balance', make: (u, c) => balanceTeaserEmail(u, c) },
        { day: 11, key: 'teaser-mind', make: (u, c) => mentalHealthTeaserEmail(u, c) },
        { day: 13, key: 'teaser-safety', make: (u, c) => safetyTeaserEmail(u, c) },
        { day: 15, key: 'teaser-passport', make: (u, c) => passportTeaserEmail(u, c) },
      ]

      const deliverLead = async (email: string, key: string, content: EmailContent) => {
        const { error: logErr } = await supabase.from('lead_email_log').insert({ email, email_key: key })
        if (logErr) return // unique violation means another run got here first
        const sent = await sendEmail({ to: email, subject: content.subject, html: content.html })
        if (sent.ok) results.leadTeaser += 1
        else {
          results.errors += 1
          await supabase.from('lead_email_log').delete().eq('email', email).eq('email_key', key)
        }
      }

      for (const lead of rows) {
        const email = lead.email as string
        if (hasAccount.has(email.toLowerCase())) continue
        const age = daysSince(lead.created_at as string)
        // At most one teaser per lead per run, the earliest milestone they have
        // reached and not yet had, so a lead found late catches up one email a
        // day rather than a burst all at once.
        const due = schedule.find(s => age >= s.day && !leadSent.has(`${email.toLowerCase()}:${s.key}`))
        const unsub = leadUnsubscribeUrl(email)
        const cta = starterCtaUrl(email)
        if (due) {
          await deliverLead(email, due.key, due.make(unsub, cta))
        } else if (age >= 18 && !leadSent.has(`${email.toLowerCase()}:teaser-founder`)) {
          // The founder close, only while places remain.
          const remaining = await getFounderRemaining()
          if (remaining > 0) await deliverLead(email, 'teaser-founder', founderLeadEmail({ remaining, unsubscribe: unsub, cta }))
        }
      }
    }
  }

  // The weekly digest and the monthly balance review used to live here, as the
  // last two blocks of this handler, and that is exactly why neither reached
  // anybody. Everything above still works because it runs first; those two ran
  // last and the sixty second budget was gone by the time it got to them. The
  // digest degraded as the data grew (5 of 12 parents in week 29, then none at
  // all), and the monthly review never sent a single email in its life.
  //
  // They are their own routes now, /api/email/digest and /api/email/monthly,
  // each with its own budget and each self healing across the days of its
  // period. Adding a phase back here would recreate the fault.

  return NextResponse.json({ ok: true, ...results })
}

export const GET = withHeartbeat('/api/email/cron', handler)
