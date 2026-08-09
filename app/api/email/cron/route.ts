import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, emailConfigured, unsubscribeUrl, leadUnsubscribeUrl, starterCtaUrl } from '@/lib/email'
import { welcomeEmail, day2StageEmail, day3TourEmail, day4DigiEmail, day7FounderEmail, weeklyDigestEmail, trialEndingEmail, winBackEmail, leadNurtureEmail, childPhoneEmail, screenTimeEmail, lessonsEmail, schoolRemindersEmail, familyAgreementEmail, printablesRevealEmail, balanceRevealEmail, mentalHealthRevealEmail, passportRevealEmail, digiTeaserEmail, scriptsTeaserEmail, printablesTeaserEmail, balanceTeaserEmail, mentalHealthTeaserEmail, safetyTeaserEmail, passportTeaserEmail, founderLeadEmail, curriculumStrandsEmail, curriculumSchoolEmail, digiBrainEmail, digiLearnsEmail, digiFeedbackLoopEmail, digiChecksEmail, winBackUnusedEmail, winBackLastEmail, paidUnlockedEmail, paidAskMeEmail, paidCommonQuestionsEmail, pastDueEmail, paidChildSideEmail, paidTellYouEmail, paidReadAheadEmail, paidTheNumbersEmail, paidWholeFamilyEmail } from '@/lib/email/templates'
import type { EmailContent } from '@/lib/email/templates'
import { founderStoryEmail, philosophyEmail, researchAnchorsEmail, wisdomInsightsEmail, jobsStarsEmail, checkinEvidenceEmail, scriptsDeepEmail, schoolWeekEmail, deviceTimeEmail, yearAheadEmail } from '@/lib/email/weekly-programme'
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

  // EVERYONE who finished onboarding. No created_at window.
  //
  // Justin, 8 August 2026: "the emails are not just new sign ups we need to be
  // emailing everyone that registers including users".
  //
  // The window used to be on this query, and wherever it was set it was a
  // silent ceiling on the entire system: a parent who registered a day past it
  // was not loaded at all, so no win back, no trial nurture, no service help,
  // permanently and with nothing logged to say so. Widening it only moves the
  // day that happens.
  //
  // It survives as a guard on the onboarding programme below (days <= 200),
  // where it belongs: the 26 week programme genuinely IS a function of how long
  // someone has been here, and without the guard, widening this query would
  // have restarted it from week 1 for every existing member. The state tracks
  // are not a function of tenure and now see the whole table.
  //
  // Everything the loop needs is read in bulk, because the loop now runs over
  // every member and a query inside it would be one round trip per member.
  const [{ data: profiles }, { data: log }, { data: children }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, email, full_name, created_at, subscription_status, trial_ends_at, email_opt_out, onboarding_complete')
      .eq('onboarding_complete', true),
    supabase.from('email_log').select('user_id, email_key, sent_at'),
    supabase.from('children').select('parent_id, name, age_band, stage_id').eq('is_primary', true),
  ])

  const sentKeys = new Set((log ?? []).map(l => `${l.user_id}:${l.email_key}`))
  const alreadySent = (userId: string, key: string) => sentKeys.has(`${userId}:${key}`)

  // When a given email actually went out, so a sequence can pace itself off the
  // previous send instead of off a signup date. That is what lets a win back
  // run properly for someone who registered eleven months ago.
  const sentAt = new Map((log ?? []).map(l => [`${l.user_id}:${l.email_key}`, l.sent_at as string]))
  function daysSinceSent(userId: string, key: string): number | null {
    const at = sentAt.get(`${userId}:${key}`)
    return at ? daysSince(at) : null
  }

  const childByParent = new Map((children ?? []).map(c => [c.parent_id as string, c]))

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

  const results: Record<string, number> = { welcome: 0, day2: 0, day3: 0, day4: 0, day7: 0, svcChildPhone: 0, svcScreenTime: 0, svcLessons: 0, svcSchool: 0, svcAgreement: 0, revealPrintables: 0, revealBalance: 0, revealMind: 0, revealPassport: 0, curriculumStrands: 0, curriculumSchool: 0, digiBrain: 0, digiLearns: 0, digiFeedbackLoop: 0, digiChecks: 0, weekFounder: 0, weekPhilosophy: 0, weekResearch: 0, weekWisdom: 0, weekJobsStars: 0, weekEvidence: 0, weekScripts: 0, weekSchoolWeek: 0, weekDeviceTime: 0, weekYearAhead: 0, trialEnding: 0, winback: 0, winback2: 0, winback3: 0, winbackTease: 0, pastDue: 0, paid1: 0, paid2: 0, paid3: 0, paid4: 0, paid5: 0, paid6: 0, paid7: 0, paid8: 0, leadNurture: 0, leadTeaser: 0, errors: 0 }

  // ONE EMAIL PER PERSON PER RUN.
  //
  // Justin, 9 August 2026, with a screenshot of his inbox: three of ours at
  // 09:00, svc-screentime, svc-school and svc-agreement, all to the same
  // address. Checked against email_log and it was one account, not three test
  // ones.
  //
  // The cause is that the service drip is written as independent `if (days >=
  // N && !alreadySent(...))` blocks. Each one is correct on its own. Together
  // they are not, because an account past day 42 that has set none of those
  // services up satisfies every condition on the same run and gets the lot in
  // one minute. The block's own comment says "one benefit email per service"
  // and nothing in the code made that true.
  //
  // The guard lives here rather than in the twenty odd call sites, so every
  // sender inherits it, including the pillar reveals below and anything added
  // later. Same reasoning as the child quiet hours gate: a rule enforced at
  // the call sites is a rule somebody forgets.
  //
  // Per RUN, not per day: the cron can fire more than once, and the email_log
  // unique key already stops the same email going twice. What this stops is
  // three DIFFERENT ones arriving together, which is the fastest way to get
  // marked as spam by somebody who liked us yesterday.
  const emailedThisRun = new Set<string>()

  async function deliver(userId: string, email: string, key: string, content: { subject: string; html: string }, counter: string) {
    if (emailedThisRun.has(userId)) return
    const { error: logError } = await supabase.from('email_log').insert({ user_id: userId, email_key: key })
    if (logError) return // unique violation means another run got here first
    // Claimed before the send, not after. Two emails cannot both be in flight
    // for one person, and a send that fails still counts as this person's turn
    // rather than freeing the slot for the next template in the same run.
    emailedThisRun.add(userId)
    const sent = await sendEmail({ to: email, subject: content.subject, html: content.html })
    if (sent.ok) {
      results[counter] += 1
    } else {
      results.errors += 1
      await supabase.from('email_log').delete().eq('user_id', userId).eq('email_key', key)
    }
  }

  for (const profile of (profiles ?? []) as ProfileRow[]) {
    if (!profile.email || profile.email_opt_out) continue
    const days = daysSince(profile.created_at)
    const name = profile.full_name?.split(' ')[0] ?? 'there'
    const unsubscribe = unsubscribeUrl(profile.id)

    const child = childByParent.get(profile.id)
    const childName = child?.name && child.name !== 'Your child' ? child.name : 'your child'
    const stage = child?.age_band ? getStageFromAgeBand(child.age_band as AgeBand) : STAGES[2]

    const state = lifecycleState(profile)

    // ── Pass A · the 26 week onboarding programme ──
    //
    // The 200 day guard is what the query filter used to be. It has to live
    // somewhere: without it, removing the window would start week 1 of the
    // programme over again for every member who joined before it existed.
    if (days <= 200) {

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

    // The weekly service programme, weeks 17 to 26 (Justin, 8 August: one a
    // week, cover everything). Each teaches one part of the service, the
    // philosophy behind it, and one thing to do today. Content in
    // lib/email/weekly-programme.ts; same once only lock as everything above.
    const weekly: [number, string, EmailContent, string][] = [
      [119, 'week-founder-story', founderStoryEmail({ unsubscribe }), 'weekFounder'],
      [126, 'week-philosophy', philosophyEmail({ unsubscribe }), 'weekPhilosophy'],
      [133, 'week-research', researchAnchorsEmail({ unsubscribe }), 'weekResearch'],
      [140, 'week-wisdom', wisdomInsightsEmail({ unsubscribe }), 'weekWisdom'],
      [147, 'week-jobs-stars', jobsStarsEmail({ unsubscribe }), 'weekJobsStars'],
      [154, 'week-evidence', checkinEvidenceEmail({ unsubscribe }), 'weekEvidence'],
      [161, 'week-scripts', scriptsDeepEmail({ unsubscribe }), 'weekScripts'],
      [168, 'week-school-week', schoolWeekEmail({ unsubscribe }), 'weekSchoolWeek'],
      [175, 'week-device-time', deviceTimeEmail({ unsubscribe }), 'weekDeviceTime'],
      [182, 'week-year-ahead', yearAheadEmail({ unsubscribe }), 'weekYearAhead'],
    ]
    for (const [day, key, content, counter] of weekly) {
      if (days >= day && !alreadySent(profile.id, key)) {
        await deliver(profile.id, profile.email, key, content, counter)
      }
    }

    } // end pass A

    // ── Pass B · the state tracks, for everyone ──
    //
    // Branch on where the contact actually is rather than on tenure, with no
    // window, so a parent who joined last year is reached exactly as one who
    // joined last week. Trial nurture stops on payment (an active member is
    // never in trial_ending or lapsed) and win back starts on lapse.

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

    // Win back 2 and 3, paced off the previous send rather than off signup,
    // which is the point: a parent who registered eleven months ago and lapsed
    // last week gets a properly spaced sequence, where before they got one
    // email or, past the window, none at all.
    //
    // Each step re-checks state, so paying at any point stops the rest of the
    // sequence dead on the next run.
    if (state === 'lapsed' && !alreadySent(profile.id, 'winback-2')) {
      const since1 = daysSinceSent(profile.id, 'winback-1')
      if (since1 != null && since1 >= 7) {
        await deliver(profile.id, profile.email, 'winback-2', winBackUnusedEmail({
          childName, stageName: stage.name, unsubscribe,
        }), 'winback2')
      }
    }

    if (state === 'lapsed' && !alreadySent(profile.id, 'winback-3')) {
      const since2 = daysSinceSent(profile.id, 'winback-2')
      if (since2 != null && since2 >= 21) {
        const remaining = await getFounderRemaining()
        await deliver(profile.id, profile.email, 'winback-3', winBackLastEmail({
          childName, remaining, unsubscribe,
        }), 'winback3')
      }
    }

    // Weekly teases after the three win backs, for the ones who disappear when
    // the trial ends.
    //
    // Justin, 8 August: "make sure we tease sign ups that disappear after trial
    // ends and keep emailing them weekly to entice back."
    //
    // These reuse the pre signup teaser bank rather than adding seven more
    // templates, and that is the right call rather than a lazy one: a lapsed
    // parent is in exactly the position a lead is in, holding an email address
    // and no subscription, and each teaser is already one service, one hook,
    // one door. The only difference is the unsubscribe link, which is theirs
    // rather than the lead one, so it is passed in.
    //
    // Seven weeks of these on top of the three win backs is ten weekly emails
    // over about eleven weeks, and then this track genuinely ends. The weekly
    // digest carries on regardless.
    const teases: [string, EmailContent, string][] = [
      ['wb-tease-digi', digiTeaserEmail(unsubscribe), 'DiGi'],
      ['wb-tease-scripts', scriptsTeaserEmail(unsubscribe), 'scripts'],
      ['wb-tease-printables', printablesTeaserEmail(unsubscribe), 'printables'],
      ['wb-tease-balance', balanceTeaserEmail(unsubscribe), 'balance'],
      ['wb-tease-mind', mentalHealthTeaserEmail(unsubscribe), 'mind'],
      ['wb-tease-safety', safetyTeaserEmail(unsubscribe), 'safety'],
      ['wb-tease-passport', passportTeaserEmail(unsubscribe), 'passport'],
    ]
    if (state === 'lapsed') {
      // One a week, in order, and only ever one per run: find the first unsent
      // one and check a week has passed since whatever went before it. Sending
      // the whole backlog at once to someone the cron reaches for the first
      // time is the failure mode this guards against, and with the window now
      // gone that is every lapsed parent from before today.
      const prevKeys = ['winback-3', ...teases.map(t => t[0])]
      for (let i = 0; i < teases.length; i++) {
        const [key, content] = teases[i]
        if (alreadySent(profile.id, key)) continue
        const sincePrev = daysSinceSent(profile.id, prevKeys[i])
        if (sincePrev != null && sincePrev >= 7) {
          await deliver(profile.id, profile.email, key, content, 'winbackTease')
        }
        break // only the next one in the run, never a catch up burst
      }
    }

    // The failed card. Not a decision, an accident, and the cheapest save in
    // the system. past_due fell through lifecycleState to 'unknown' before
    // this, so a member who wanted to stay simply stopped being one, silently.
    if (state === 'past_due' && !alreadySent(profile.id, 'past-due')) {
      await deliver(profile.id, profile.email, 'past-due', pastDueEmail({ parentName: name, unsubscribe }), 'pastDue')
    }

    // The paid service track. They have already bought, so all three give
    // rather than ask. Paying members were the worst served group in here
    // before this: the same onboarding as everyone else, and nothing of their
    // own, ever.
    //
    // Day 60 start keeps it clear of the dense opening weeks. Anyone who
    // upgrades later than that gets it on the next run, which is the right
    // moment anyway: just after they paid is exactly when to show them what
    // they just bought.
    if (state === 'active' && days >= 60 && !alreadySent(profile.id, 'paid-1')) {
      await deliver(profile.id, profile.email, 'paid-1', paidUnlockedEmail({
        parentName: name, childName, unsubscribe,
      }), 'paid1')
    }

    if (state === 'active' && !alreadySent(profile.id, 'paid-2')) {
      const since1 = daysSinceSent(profile.id, 'paid-1')
      if (since1 != null && since1 >= 14) {
        await deliver(profile.id, profile.email, 'paid-2', paidAskMeEmail({
          parentName: name, childName, unsubscribe,
        }), 'paid2')
      }
    }

    if (state === 'active' && !alreadySent(profile.id, 'paid-3')) {
      const since2 = daysSinceSent(profile.id, 'paid-2')
      if (since2 != null && since2 >= 30) {
        await deliver(profile.id, profile.email, 'paid-3', paidCommonQuestionsEmail({ childName, unsubscribe }), 'paid3')
      }
    }

    // The paid depth track, three weeks apart, on ground none of the other
    // forty odd emails walk. Two of the five are about what the CHILD
    // experiences, which nothing had covered: every other email in the system
    // is written to the parent about the parent's side of the glass.
    //
    // Same one at a time rule as the win back teases. With the window gone,
    // every long standing member becomes eligible for this track on the same
    // day, and firing five emails into their inbox at once would be the worst
    // possible first impression of a track meant to reward paying.
    const depth: [string, EmailContent, string][] = [
      ['paid-4', paidChildSideEmail({ childName, unsubscribe }), 'paid4'],
      ['paid-5', paidTellYouEmail({ childName, unsubscribe }), 'paid5'],
      ['paid-6', paidReadAheadEmail({ childName, stageName: stage.name, unsubscribe }), 'paid6'],
      ['paid-7', paidTheNumbersEmail({ childName, unsubscribe }), 'paid7'],
      ['paid-8', paidWholeFamilyEmail({ childName, unsubscribe }), 'paid8'],
    ]
    if (state === 'active') {
      const prevDepth = ['paid-3', 'paid-4', 'paid-5', 'paid-6', 'paid-7']
      for (let i = 0; i < depth.length; i++) {
        const [key, content, counter] = depth[i]
        if (alreadySent(profile.id, key)) continue
        const sincePrev = daysSinceSent(profile.id, prevDepth[i])
        if (sincePrev != null && sincePrev >= 21) {
          await deliver(profile.id, profile.email, key, content, counter)
        }
        break // one per run, never a catch up burst
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
