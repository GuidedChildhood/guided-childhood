'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ResultScreen from './ResultScreen'
import { createClient, isSupabaseConfigured, NOT_CONFIGURED_MESSAGE, networkAuthMessage } from '@/lib/supabase/client'
import ProviderButtons from '@/components/auth/ProviderButtons'
import SavingPathway from '@/components/starter/SavingPathway'
import { writeStarterSetup, keepPendingSetup, takePendingSetup, clearPendingSetup, type PendingSetup } from '@/lib/starter/finish-setup'
import { enabledProviders } from '@/lib/auth/providers'
import { bandForAge } from '@/lib/children/age'
import WorryPicker from '@/components/onboarding/WorryPicker'
import { WORRIES, CATCH_ALL_ID, challengeFor, toWorryIds, worryLabel } from '@/lib/onboarding/worries'
import {
  FEELING_OPTIONS,
  TIME_COMMITMENT_OPTIONS,
  getStageFromAgeBand,
  type AgeBand,
  type ChallengeId,
  type FeelingId,
  type TimeCommitmentId,
  type StarterAnswers,
} from '@/lib/content/stages'

// ── THE ACCOUNT COMES LAST (10 September 2026) ────────────────────────────
//
// Every advert we run says "Three questions. No sign up." (app/page.tsx). The
// second screen of this flow used to be Create your account, with a name, an
// email and a password, before a single question about the child. That is the
// funnel's headline claim broken at the first step, and THE-STORY puts the
// whole route to 4,000 a month through this one page.
//
// It was front loaded in July (commit 619150bc) for a good reason: the old
// flow asked about the child twice, once here and once in a separate
// onboarding. Asking once is still right. Asking once at the END costs nothing,
// because the answers are already held in state and in localStorage.
//
// Calm Sleep, Brilliant and Life Reset all do it this way: the questions, then
// the personalised result, then the account framed as the thing that saves it.
// See plans/2026-09-10-starter-account-last.md for the numbers.
type Step = 'intro' | 'q1' | 'q2' | 'q4' | 'reassure' | 'result' | 'account'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const

// Seventeen years back, newest first, because a parent scrolling for a nine
// year old should not pass 2009 on the way. The product runs from four to
// sixteen and one spare year each side covers a child who is nearly either.
const THIS_YEAR = new Date().getFullYear()
const BIRTH_YEARS = Array.from({ length: 18 }, (_, i) => THIS_YEAR - i)

// The six drawn concern icons that used to live here went with the six option
// grid on 9 September 2026. The quiz asks the nine worries now, from
// lib/onboarding/worries, drawn by components/onboarding/WorryIcon, so there
// is one hand and one list for the quiz, the setup wizard and the fixture.


const STAGE_ACCENT: Record<number, { bold: string; text: string }> = {
  1: { bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  2: { bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  3: { bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  4: { bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  5: { bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
}

export default function StarterPackPage() {
  const [step, setStep] = useState<Step>('intro')
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null)
  // ── MONTH AND YEAR, NOT A BAND ──────────────────────────────────────────────
  //
  // Justin, 13 August 2026: "is it best to ask the stage or are we going to ask
  // for month and year of child birth like we do internally... could that be a
  // barrier to set up, we can say why."
  //
  // The birthday, and the code already agreed before he asked. children
  // .date_of_birth exists, lib/children/age.ts derives the band from it, and
  // lib/learning/term.ts needs the real date for the 31 August cutoff: without
  // it the app cannot say which school year a child is in and refuses to guess.
  // A band is a VIEW of the birthday, so asking for the band means asking for
  // something we cannot use and then asking again later as a chore, which is
  // exactly what the birthday setup step was.
  //
  // ON THE BARRIER, WHICH IS THE REAL QUESTION. A date is a heavier ask than a
  // chip, so this is month and year only, two taps on a phone, no day. Nobody
  // has to remember anything or dig out a certificate, it cannot be got wrong,
  // and it is visibly less than a full date of birth, which is what makes
  // people hesitate. The reason is said on the screen rather than assumed,
  // because an unexplained date question at signup is where a parent stops.
  //
  // It also stops a child silently ageing out of a band nobody updated.
  const [dobMonth, setDobMonth] = useState<number | null>(null)
  const [dobYear, setDobYear] = useState<number | null>(null)
  // ── THE WORRIES THE PARENT TICKED ─────────────────────────────────────────
  //
  // Justin, 9 September 2026, on the live quiz: "You said we were changing to
  // 9 here still only 6? Also not happy new design?"
  //
  // He had seen the nine worries land on the setup screen after sign up and
  // reasonably expected them here. They had not arrived because this screen
  // kept its own older copy of the same question, so the same parent was asked
  // what was hard twice, in two vocabularies, either side of a card payment.
  // Asked which way he wanted it, he chose: ask once, here, before they pay.
  //
  // So `picks` now holds WORRY ids from lib/onboarding/worries, the parent's
  // own words, and the two values below are DERIVED from them. ChallengeId
  // stays exactly as it was, because it is not the parent's vocabulary any
  // more, it is the routing key every stage's challengeActions is written
  // against. The parent sees their words, the pathway sees a key it has
  // content for, and neither has to know about the other.
  const [picks, setPicks] = useState<string[]>([])
  // Their own words, when Something else is ticked. Kept even while the tile is
  // off, so unticking by accident does not wipe what they typed.
  const [worryOther, setWorryOther] = useState('')
  const challenge = challengeFor(picks[0])
  // Every worry ticked, as pathway keys, most pressing first and deduped.
  // Three worries can share one key (bedtime, mornings and will not put it
  // down are all screens_takeover), so this is shorter than picks and that is
  // correct: it is what the pathway starts on, not what the parent said.
  const concerns = Array.from(new Set(picks.map(p => challengeFor(p)).filter((c): c is ChallengeId => c !== null)))
  // The feeling question was dropped (age, concerns and usage are the ones
  // that drive the first fixes). A calm default keeps the reveal copy working
  // without asking for it.
  const [feeling, setFeeling] = useState<FeelingId | null>('unsure')
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitmentId | null>(null)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [childName, setChildName] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  /** True once the account exists, so the reveal stops offering to make one. */
  const [accountMade, setAccountMade] = useState(false)
  // True once the account exists and needs email confirmation before they can
  // step into the platform (only when Confirm email is switched on in
  // Supabase). With it off, a session is created and this stays false.
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const supabase = createClient()
  // A parent who has already been through the quiz on this device. We greet
  // them by name of intent rather than making them start Q1 over again.
  const [returning, setReturning] = useState(false)
  const [restored, setRestored] = useState(false)
  // True only while we are landing back from Google or Apple. The page draws a
  // different screen for it, because the alternative is a parent who has just
  // signed in watching question one flash up at them.
  const [finishing, setFinishing] = useState(false)

  const stage = ageBand ? getStageFromAgeBand(ageBand) : null
  // Is there a faster way in on this deployment? Only the copy needs to know;
  // ProviderButtons decides for itself whether to draw anything.
  const oneTap = enabledProviders().length > 0

  // ── COMING BACK FROM A PROVIDER ──────────────────────────────────────────
  //
  // ProviderButtons sends the parent to /auth/callback with this page and
  // ?finish=1 as the destination, so the code lands here with a live session
  // and no React state whatsoever. Everything the write through needs was put
  // in one blob the instant before the browser left.
  //
  // The session is checked rather than assumed. /auth/callback already sends a
  // failed exchange to /login, so arriving here without one should not happen,
  // and "should not happen" is exactly the case that writes a child row against
  // nobody if it is not looked at.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('finish') !== '1') return
    setFinishing(true)
    let cancelled = false
    ;(async () => {
      const pending = takePendingSetup()
      // The round trip cleared React state, so the child's name comes back off
      // the blob. Without this the screen says "your pathway" to a parent who
      // has been reading their child's name on every screen up to here.
      if (pending?.childName) setChildName(pending.childName)
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        // No session, so there is nothing to write and nothing to save. Send
        // them to sign in rather than leave them on a screen that says saving.
        clearPendingSetup()
        window.location.replace('/login?error=auth')
        return
      }
      if (pending) await writeStarterSetup(supabase, pending)
      if (cancelled) return
      // replace, not href: back from the Setup Quest should reach the site,
      // never bounce through this screen and run the write again.
      window.location.replace('/dashboard/setup')
    })()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resume mid-quiz progress on refresh or return visit, instead of losing
  // everything and starting over at Q1.
  useEffect(() => {
    // Dev only: /starter-pack?preview=result renders the reveal with a
    // fixture family, so it can be checked without running the quiz.
    // Landing back from a provider: the effect above owns this render and is
    // about to navigate away. Restoring a half finished quiz underneath it only
    // repaints a screen nobody sees.
    if (new URLSearchParams(window.location.search).get('finish') === '1') return
    if (process.env.NODE_ENV !== 'production' && new URLSearchParams(window.location.search).get('preview') === 'result') {
      setAgeBand('11-13'); setPicks(['mood_after_screens']); setTimeCommitment('5min'); setChildName('Ava'); setStep('result'); setRestored(true)
      return
    }
    try {
      const saved = localStorage.getItem('gc_starter_progress')
      if (saved) {
        const parsed = JSON.parse(saved) as { step: Step | 'details' | 'q3' | 'email'; ageBand: AgeBand | null; dobMonth?: number | null; dobYear?: number | null; picks?: string[]; worryOther?: string; challenge?: ChallengeId | null; feeling: FeelingId | null; timeCommitment: TimeCommitmentId | null }
        if (parsed.ageBand) setAgeBand(parsed.ageBand)
        // A parent part way through keeps the birthday they already gave, and
        // an older saved run has no birthday at all, which is why the band is
        // restored on its own line above rather than derived from this.
        if (parsed.dobMonth) setDobMonth(parsed.dobMonth)
        if (parsed.dobYear) setDobYear(parsed.dobYear)
        // toWorryIds carries a run saved before 9 September 2026 forward: back
        // then `picks` held the old six ids, so a parent who was mid quiz when
        // this shipped lands on the tile they would have picked today rather
        // than on an empty grid.
        if (parsed.picks?.length) setPicks(toWorryIds(parsed.picks))
        else if (parsed.challenge) setPicks(toWorryIds([parsed.challenge]))
        if (parsed.worryOther) setWorryOther(parsed.worryOther)
        if (parsed.feeling) setFeeling(parsed.feeling)
        if (parsed.timeCommitment) setTimeCommitment(parsed.timeCommitment)
        // A saved step from the old order can name a screen that no longer
        // exists (details, q3, email). Those resume at the first question
        // rather than at a blank page, and their answers are still restored
        // above, so nobody who was mid quiz when this shipped loses anything.
        const LIVE: Step[] = ['intro', 'q1', 'q2', 'q4']
        if (parsed.step && (LIVE as string[]).includes(parsed.step)) setStep(parsed.step as Step)
        else if (parsed.step) setStep('q1')
      }
      // A saved email plus a completed answer set means they have finished the
      // quiz here before. Hydrate those answers so See my pathway can render
      // the result, and offer to take them straight there or to sign in, so
      // returning lands them in the right place, not back at Q1.
      const savedEmail = localStorage.getItem('gc_starter_email')
      const savedName = localStorage.getItem('gc_starter_name')
      const savedChildName = localStorage.getItem('gc_starter_child_name')
      const savedAnswers = localStorage.getItem('gc_starter_answers')
      if (savedEmail) setEmail(savedEmail)
      if (savedName) setName(savedName)
      if (savedChildName) setChildName(savedChildName)
      if (savedEmail && savedAnswers && !saved) {
        try {
          const a = JSON.parse(savedAnswers) as StarterAnswers
          if (a.ageBand) setAgeBand(a.ageBand)
          if (a.worryOther) setWorryOther(a.worryOther)
          if (a.worries?.length) setPicks(toWorryIds(a.worries))
          else if (a.concerns?.length) setPicks(toWorryIds(a.concerns))
          else if (a.challenge) setPicks(toWorryIds([a.challenge]))
          if (a.feeling) setFeeling(a.feeling)
          if (a.timeCommitment) setTimeCommitment(a.timeCommitment)
          setReturning(true)
        } catch {}
      }
    } catch {}
    setRestored(true)
  }, [])

  // Save progress after every answer, not just at the end, so a refresh or
  // an accidental close does not throw away answers already given.
  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem('gc_starter_progress', JSON.stringify({ step, ageBand, dobMonth, dobYear, picks, worryOther, feeling, timeCommitment }))
    } catch {}
  }, [restored, step, ageBand, dobMonth, dobYear, picks, worryOther, feeling, timeCommitment])

  useEffect(() => {
    if (step === 'result' && ageBand && challenge && feeling && timeCommitment) {
      // `worries` is what the parent actually said and what setup reads back.
      // `challenge` and `concerns` are derived and still written, so every
      // pathway reader that has only ever known ChallengeId keeps working.
      const answers: StarterAnswers = { ageBand, challenge, concerns, worries: picks, worryOther: worryOther.trim() || undefined, feeling, timeCommitment }
      try {
        localStorage.setItem('gc_starter_answers', JSON.stringify(answers))
        localStorage.removeItem('gc_starter_progress')
      } catch {}
    }
  }, [step, ageBand, challenge, concerns, picks, worryOther, feeling, timeCommitment])

  useEffect(() => {
    if (step !== 'reassure') return
    const t = setTimeout(() => setStep('result'), 2900)
    return () => clearTimeout(t)
  }, [step])

  function selectAge(band: AgeBand) {
    setAgeBand(band)
    setTimeout(() => setStep('q2'), 280)
  }

  /** The first of the month they were born, which is all we ask for and all the
   *  school year cutoff needs. Stored as YYYY-MM-DD because every reader of
   *  date_of_birth slices the first ten characters. */
  const dob = dobMonth != null && dobYear != null
    ? `${dobYear}-${String(dobMonth).padStart(2, '0')}-01`
    : null

  /** Both halves answered, so derive the band and walk on. The band is never
   *  asked for now, only worked out, which is why nothing downstream changes. */
  function setBirthday(month: number | null, year: number | null) {
    setDobMonth(month)
    setDobYear(year)
    if (month == null || year == null) return
    const derived = bandForAge(`${year}-${String(month).padStart(2, '0')}-01`)
    if (!derived) return
    setAgeBand(derived)
    setTimeout(() => setStep('q2'), 420)
  }
  // Tap adds or removes a worry. The first one ticked is the one tomorrow
  // opens on, said once on that tile and once under the grid.
  //
  // The old "Start with this" control is gone. It sat on every ticked tile
  // except the first, so a parent who ticked three was looking at three tiles
  // all appearing to claim they were the starting point. Justin, 9 September
  // 2026: "says start here on several icons which does not make sense."
  // Untick and retick changes the order, which is two taps and needs no
  // chrome on nine tiles to explain.
  function toggleChallenge(c: string) {
    setPicks(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }
  function selectTimeCommitment(t: TimeCommitmentId) {
    setTimeCommitment(t)
    // The lead is saved with whatever we have, which at this point is the
    // answers and no email. finishSetup does NOT run here any more: there is no
    // account yet, and there will not be one until the parent has read their
    // pathway and chosen to save it.
    captureLead({ ageBand, concerns: picks, challenge, feeling, timeCommitment: t })
    setTimeout(() => setStep('reassure'), 280)
  }

  // Save the lead server side, best effort, keyed by email. Never blocks the
  // flow, and returns immediately when there is no email, which is the normal
  // case for a new parent now that the account comes last: the first time we
  // have an email is the moment they save the pathway, and the founder ping
  // fires then. A returning parent still has theirs in localStorage, so their
  // answers keep updating the same lead row as they go.
  async function captureLead(extra: Record<string, unknown>) {
    const clean = email.trim().toLowerCase()
    if (!clean) return
    try { localStorage.setItem('gc_starter_email', clean) } catch {}
    try {
      await fetch('/api/starter/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clean,
          answers: { name: name.trim() || null, ...extra },
          stageId: stage ? String(stage.id) : null,
        }),
      })
    } catch { /* lead capture is best effort */ }
  }

  // The LAST screen now: the account, once the pathway has been built and read.
  //
  // It used to be the first, which broke the promise in every advert we run
  // ("Three questions. No sign up.") and spent a parent's patience before they
  // had been asked anything about their child. The order is the questions, the
  // build beat, the pathway, and only then this. See
  // plans/2026-09-10-starter-account-last.md.
  //
  // Everything it needs is already in hand: the answers are in state, and
  // finishSetup writes them through the moment the session exists.
  async function submitAccount() {
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailError('Please enter a valid email so we can save your pathway.')
      return
    }
    if (password.length < 8) {
      setEmailError('Choose a password of at least 8 characters.')
      return
    }
    setEmailError('')

    // NEXT_PUBLIC values are baked in at build time, so a build made without
    // them points at placeholder.supabase.co, a domain that does not exist, and
    // every request dies in the browser. The login form has said so in words
    // since August. This screen, the first one a new customer meets, said
    // "Failed to fetch".
    if (!isSupabaseConfigured()) {
      setEmailError(NOT_CONFIGURED_MESSAGE)
      return
    }

    setSavingEmail(true)
    try { localStorage.setItem('gc_starter_email', clean) } catch {}

    // Create the account up front, the one click that sets it all up. With
    // Confirm email off a session is established now and they walk straight in
    // at the end; with it on the account is made and they confirm by email
    // before stepping in.
    const { data, error } = await supabase.auth.signUp({
      email: clean,
      password,
      // No name is collected any more, so none is set here. The dashboard
      // recovers a first name from the email when the profile has none, which
      // it has done since August.
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      // A dead fetch is not an answer about this account, so it must never be
      // shown as one. Everything else Supabase says is a real reply.
      const offline = networkAuthMessage(error.message)
      setEmailError(
        offline ??
        (msg.includes('already registered') || msg.includes('already been registered')
          ? 'That email already has an account. Sign in and your pathway is waiting.'
          : error.message)
      )
      setSavingEmail(false)
      return
    }
    await captureLead({})

    // With confirmation off a session exists now, so the answers are written
    // through and they walk into the product. With it on there is no session
    // yet: the reveal says check your email, and the old onboarding is the
    // fallback that writes the answers once they are in.
    if (!data.session) {
      setNeedsConfirm(true)
      setAccountMade(true)
      setSavingEmail(false)
      setStep('result')
      return
    }

    await finishSetup()
    setSavingEmail(false)
    window.location.href = '/dashboard/setup'
  }

  // Everything the write through needs, gathered from state in one place, so
  // the password path and the return from Google hand over exactly the same
  // thing. See lib/starter/finish-setup.ts for why the birthday has to travel
  // with it rather than be looked up from the older keys.
  function pendingNow(): PendingSetup {
    return { ageBand, challenge, picks, worryOther, feeling, timeCommitment, childName, dob }
  }

  // Write the account through: onboarding complete, the trial, the child. One
  // copy of it, in lib/starter/finish-setup.ts, called from both ways in.
  async function finishSetup() {
    await writeStarterSetup(supabase, pendingNow())
  }

  // submitEmail, the end of quiz email screen from the older order, was
  // deleted here on 10 September 2026 along with its screen. The account
  // step does its job now, at the same point in the flow, and it captures
  // the lead through the same route (captureLead).

  // THREE QUESTIONS, AND THE BUILD BEAT IS NOT ONE OF THEM.
  //
  // This read "Question 3 of 4" on the Building your pathway screen, which is
  // wrong twice over: there are three questions now that the feeling one is
  // gone, and the build beat is not a question at all. A counter that keeps
  // counting while nothing is being asked is how a parent starts wondering
  // what they missed.
  // The bar counts the three questions, and the account step comes AFTER all
  // of them, so it shows full rather than empty. An empty bar at the moment a
  // parent has answered everything reads as "you have done nothing yet", which
  // is the opposite of what has just happened.
  const progress = step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q4' ? 3 : step === 'account' ? 3 : 0

  if (step === 'result' && stage && ageBand && challenge) {
    return (
      <ResultScreen
        stage={stage}
        accent={STAGE_ACCENT[stage.id]}
        challenge={challenge}
        worry={picks[0] ?? null}
        worries={picks}
        worryOther={worryOther.trim() || undefined}
        feeling={feeling!}
        onJoin={accountMade ? undefined : () => { setStep('account'); window.scrollTo({ top: 0 }) }}
        email={email}
        needsConfirm={needsConfirm}
        childName={childName.trim()}
      />
    )
  }

  // Landing back from Google or Apple. One beat, in the words of the thing they
  // just did, rather than the quiz reappearing behind them. The screen lives in
  // its own file because walking the funnel never reaches it: see
  // components/starter/SavingPathway.tsx and /dev/starter-finishing.
  if (finishing) return <SavingPathway childName={childName} />

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Segmented progress at the very top, one bar per question, the way
          the best onboarding flows show real momentum rather than a vague
          creeping line (Chime, Nextdoor and the like). */}
      <div style={{ display: 'flex', gap: '4px', padding: '8px 10px 0', flexShrink: 0 }} aria-hidden="true">
        {[1, 2, 3].map(n => (
          <div key={n} style={{ flex: 1, height: '4px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '4px',
              background: 'var(--terracotta)',
              width: progress >= n ? '100%' : '0%',
              transition: 'width 0.35s ease',
            }} />
          </div>
        ))}
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '32px 24px 48px', maxWidth: '520px', margin: '0 auto', width: '100%',
      }}>
        <style>{`
          @keyframes stepIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes gentleFloat {
            0%, 100% { transform: translateY(0); }
            50%      { transform: translateY(-8px); }
          }
        `}</style>
        {progress > 0 && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'var(--ink-muted)', marginBottom: '36px',
            animation: 'stepIn 0.45s ease both',
          }}>
            Question {progress} of 3
          </div>
        )}
        <div key={step} style={{ animation: 'stepIn 0.45s ease both' }}>

        {/* Welcome back — a return visit with a saved email skips the quiz and
            goes straight to the saved pathway or sign in. */}
        {step === 'intro' && returning && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={72} height={72} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.3rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              Welcome back.
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '26px', lineHeight: 1.6 }}>
              Your child&apos;s pathway is saved{email ? <> to <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{email}</span></> : ''}. Pick up where you left off.
            </p>
            <button
              onClick={() => setStep('result')}
              style={{ width: '100%', padding: '17px 28px', borderRadius: 16, border: 'none', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', cursor: 'pointer', boxShadow: '0 5px 0 var(--terracotta-dark)' }}
            >
              See my pathway
            </button>
            <Link
              href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              style={{ display: 'block', marginTop: '14px', textAlign: 'center', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)' }}
            >
              Sign in to my account
            </Link>
            <button onClick={() => { setReturning(false); setStep('q1') }} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
              Start again for another child
            </button>
          </div>
        )}

        {/* Intro — the story of what happens */}
        {step === 'intro' && !returning && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={72} height={72} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px', textAlign: 'center',
            }}>
              Let us build your child&apos;s pathway.
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '30px', lineHeight: 1.6, textAlign: 'center' }}>
              A couple of minutes, then free access to the platform. No card.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
              {[
                { n: '1', title: 'Tell us about your child', sub: 'Their age and the screen battle you are facing right now' },
                { n: '2', title: 'We build their pathway', sub: 'The digital literacy plan for their exact stage, guiding you year by year to a safe, capable 16' },
                { n: '3', title: 'Step into the platform, free', sub: 'The words for tonight, safe lessons by age, and a plan that protects your child and you' },
              ].map(item => (
                <div key={item.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '16px 18px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{item.n}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{item.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.5 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('q1')}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px' }}
            >
              Start, it is free
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.06em' }}>
              No card. No commitment. Built on the research.
            </p>
          </>
        )}

        {/* The account, at the END, framed by what it saves.
            The parent has just watched their child's pathway being built and
            read the whole of it. Now it asks for the least that can make an
            account: an email and a password. The name is gone, and nothing is
            lost by it, because dashboard/page.tsx already recovers a first name
            from the email when the profile has none. A form asking only for an
            email outperforms one asking name and email by 12 to 18 points, and
            this one is the last thing between a convinced parent and the
            product. */}
        {step === 'account' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={60} height={60} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px', textAlign: 'center',
            }}>
              {childName.trim() ? `Save ${childName.trim()}'s pathway` : 'Save your pathway'}
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
              {/* The line has to tell the truth in whichever state ships. With a
                  provider switched on it is one tap, and "two boxes" is then a
                  worse promise than the one we are actually making. Found by
                  walking the screen with the flag on, which is the only way it
                  could have been found. */}
              {oneTap ? 'One tap and it is yours, with four days of everything free. No card.'
                      : 'Two boxes and it is yours, with four days of everything free. No card.'}
            </p>

            {/* Above the email, not below it. The Mobbin sweep of account
                creation is split: Strava, monday.com and Finimize put the
                providers first, Zocdoc and Swarm bury them under the form. The
                whole value of one tap is that it is the fast way, and a fast
                way printed below the slow way is decoration.

                Draws nothing at all until a provider is switched on, so this
                screen is byte for byte what merged in PR 1036 until then. */}
            <ProviderButtons
              redirectTo="/starter-pack?finish=1"
              onBeforeRedirect={() => keepPendingSetup(pendingNow())}
            />

            <input
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
              style={{ fontSize: 'var(--text-md)', marginBottom: '12px' }}
            />
            <input
              className="input"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              value={password}
              onChange={e => { setPassword(e.target.value); if (emailError) setEmailError('') }}
              onKeyDown={e => { if (e.key === 'Enter') submitAccount() }}
              style={{ fontSize: 'var(--text-md)', marginBottom: emailError ? '10px' : '16px' }}
            />
            {emailError && (
              <p style={{ color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)', textAlign: 'center', marginBottom: '14px', lineHeight: 1.5 }}>
                {emailError}
              </p>
            )}

            <button
              onClick={submitAccount}
              disabled={savingEmail}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px', opacity: savingEmail ? 0.7 : 1 }}
            >
              {savingEmail ? 'One moment...' : 'Save it and step in'}
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              No card. We save your pathway and email the occasional genuinely useful thing. Unsubscribe any time.
            </p>
            <button onClick={() => setStep('result')} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
              ← Back to the pathway
            </button>
          </>
        )}

        {/* The build beat: the wait is used to show real work happening, the
            way the best onboarding flows earn the pause instead of spinning a
            blank loader. Three steps tick in, then it moves to the result. */}
        {step === 'reassure' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={72} height={72} style={{ animation: 'gentleFloat 2.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.2rem)',
              fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: '18px',
            }}>
              Building your pathway.
            </h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto 20px' }}>
              {[
                { t: `Matching to your stage`, d: '0.1s' },
                { t: 'Writing the exact words for tonight', d: '0.9s' },
                { t: 'Mapping the pathway to 16', d: '1.7s' },
              ].map(row => (
                <div key={row.t} className="build-row" style={{
                  display: 'flex', alignItems: 'center', gap: '11px', textAlign: 'left',
                  background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '13px',
                  padding: '12px 15px', opacity: 0, animation: `buildIn 0.5s ease ${row.d} forwards`,
                }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, background: 'var(--tint-sage)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D5016', fontSize: 'var(--text-sm)', fontWeight: 800,
                  }}>✓</span>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink)' }}>{row.t}</span>
                </div>
              ))}
            </div>
            {/* Honest reassurance, no invented numbers: this really is the
                thing parents raise most about growing up today. */}
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
              You are far from alone. Screens are the hardest daily battle most UK parents name, and there is a calm way through.
            </p>
            {/* THE LINES ARE THE CONTENT, NOT THE ANIMATION.
                They start at opacity 0 and are revealed BY the keyframe, and
                globals.css turns every animation off under reduced motion, so
                on a phone with that setting the three ticks never appeared at
                all: the screen was a heading, a gap, and a sentence. The rule
                below hands them back, visible and still, which is what reduced
                motion is asking for rather than nothing to read. */}
            <style>{`
              @keyframes buildIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              @media (prefers-reduced-motion: reduce) {
                .build-row { opacity: 1 !important; animation: none !important; transform: none !important; }
              }
            `}</style>
          </div>
        )}

        {/* Q1 — Age */}
        {step === 'q1' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              Tell us about your child
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: 'var(--text-base)', marginBottom: '20px', lineHeight: 1.55 }}>
              Their first name and age, so everything that follows is about them. This maps your stage.
            </p>
            <input
              className="input"
              type="text"
              autoComplete="off"
              placeholder="Your child's first name"
              value={childName}
              onChange={e => { setChildName(e.target.value); try { localStorage.setItem('gc_starter_child_name', e.target.value.trim()) } catch {} }}
              style={{ fontSize: 'var(--text-md)', marginBottom: '22px' }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
              When were they born?
            </p>
            {/* THE REASON, ON THE SCREEN. An unexplained date question at signup
                is where a parent stops, and this one earns its place twice: it
                sets the stage, and it is the only way to know which school year
                they are in, which the 31 August cutoff decides. Month and year
                only, so nothing has to be looked up. */}
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.55, marginBottom: '14px' }}>
              Just the month and year. It sets their stage and their school year, so what we send you always matches where they actually are.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <select
                className="input"
                aria-label="Birth month"
                value={dobMonth ?? ''}
                onChange={e => setBirthday(e.target.value ? Number(e.target.value) : null, dobYear)}
                style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)' }}
              >
                <option value="">Month</option>
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
              </select>
              <select
                className="input"
                aria-label="Birth year"
                value={dobYear ?? ''}
                onChange={e => setBirthday(dobMonth, e.target.value ? Number(e.target.value) : null)}
                style={{ flex: 1, minWidth: 0, fontSize: 'var(--text-md)' }}
              >
                <option value="">Year</option>
                {BIRTH_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* THE STAGE IS NOT ANNOUNCED HERE ANY MORE.

                Justin, 13 August 2026, walking his own signup: "it just flashes
                stage but should be a little slower". Then, in the same message:
                "and actually it says stage here so we do not even need to flash
                up stage on previous age entry."

                Asked which he meant, he chose to drop it. He is right, and the
                reason is that a card which appeared and animated for under a
                second was doing the WORST version of both jobs. It was too fast
                to read, so it never actually told a parent what the stage was,
                and it spent the reveal anyway, so by the time the result screen
                named the stage properly it was old news.

                A stage is worth one moment, not two, and the moment it is worth
                is the one where there is room to say what it means. That screen
                already exists and already says it. So the birthday screen goes
                back to being a birthday screen, and the reveal lands once, on
                the screen built for it. */}

            {/* SIBLINGS, SAID PROPERLY. This was a grey line at the bottom that
                read as small print, so a parent with three children could not
                tell whether this product was for one of them. */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '11px',
              background: 'var(--cream)', border: '1.5px solid var(--border)',
              borderRadius: '14px', padding: '13px 15px', marginTop: '16px',
            }}>
              <span aria-hidden="true" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.2, flexShrink: 0 }}>👧🧒</span>
              <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--ink)' }}>More than one child?</strong> Start with whoever is on your mind today. You can add their brothers and sisters as soon as you are in, each with their own stage.
              </p>
            </div>
          </>
        )}

        {/* Q2 — Challenge (multi select, most pressing first) */}
        {step === 'q2' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              What are you dealing with right now?
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '20px', lineHeight: 1.55 }}>
              Pick as many or as few as you like. We cover them all, and more as we go.
            </p>

            {/* ── THE ONE QUESTION, ASKED HERE ──────────────────────────────
                The same grid the setup wizard draws, from the same list, in
                the same hand. It used to be a second, older copy of this
                question with six options and emoji, which is what Justin was
                looking at on 9 September 2026 when he asked why the nine had
                not arrived. There is one copy now: answer it here, and setup
                shows it back rather than asking again. */}
            <WorryPicker selected={picks} onToggle={toggleChallenge} primary={picks[0] ?? null} other={worryOther} onOther={setWorryOther} />

            {/* What the marker on the first tile means, in words, once. */}
            {picks.length > 1 && (
              <p style={{
                marginTop: '14px', fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)', color: 'var(--ink-muted)',
                lineHeight: 1.6, letterSpacing: '0.02em',
              }}>
                {/* Their words, not our label. A parent who has just typed
                    their worry and watched the tile take it should not read a
                    sentence underneath calling it "Something else" again. */}
                We open on {picks[0] === CATCH_ALL_ID && worryOther.trim() ? worryOther.trim() : worryLabel(picks[0])} first. Untick it to start somewhere else.
              </p>
            )}

            {/* The other half of the promise, and the same words setup used to
                say at this point: this list is not a one time form. Moments,
                DiGi and Right now all raise a new worry the day it happens, so
                nothing here has to be right first time. */}
            <p style={{ marginTop: picks.length > 1 ? '10px' : '14px', color: 'var(--ink-muted)', fontSize: 'var(--text-sm)', lineHeight: 1.55 }}>
              We keep asking as things come up, so this does not have to be right first time.
            </p>

            {/* Parent wellbeing: the quiet reminder that this is about them too,
                shown right where they name the hard stuff. Warm, brief, never a
                lecture. */}
            <div style={{
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)',
              borderRadius: '16px', padding: '14px 16px', marginTop: '20px',
            }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={34} height={34} style={{ flexShrink: 0, marginTop: '1px' }} />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                This is the hardest part of parenting right now, and how you are doing matters as much as how they are. We have got you, not just your child.
              </p>
            </div>

            {/* The sage "you are choosing where to start" note stood here
                until 9 September 2026. Its two jobs, that ticking one is not
                choosing against the rest and that the list stays open, are
                both said under the grid now, in the same words setup uses, so
                a third card saying it a third way was one more thing to read
                on a screen that should take fifteen seconds. */}

            <button
              onClick={() => picks.length > 0 && setStep('q4')}
              disabled={picks.length === 0}
              style={{
                marginTop: '14px', width: '100%',
                padding: '16px 22px', borderRadius: 16, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: picks.length ? 'var(--terracotta)' : 'var(--border)',
                color: picks.length ? 'var(--ink)' : 'var(--ink-muted)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                cursor: picks.length ? 'pointer' : 'not-allowed',
                boxShadow: picks.length ? '0 5px 0 var(--terracotta-dark)' : 'none',
                transition: 'background 0.16s, box-shadow 0.16s',
              }}
            >
              {picks.length === 0 ? (
                'Tick what is going on'
              ) : (
                <>
                  <span>Start with {picks.length === 1 ? 'this focus' : 'these'}</span>
                  {picks.length > 1 && (
                    <span style={{
                      minWidth: '22px', height: '22px', padding: '0 7px', borderRadius: '100px',
                      background: 'rgba(26,26,46,0.16)', color: 'var(--ink)',
                      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {picks.length}
                    </span>
                  )}
                  <span aria-hidden style={{ fontSize: 'var(--text-md)' }}>→</span>
                </>
              )}
            </button>
            <button onClick={() => setStep('q1')} style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}

        {/* Q3, the feeling question, and the second email screen were both
            deleted on 10 September 2026. Neither had been reachable for
            some time: the worry tiles go straight to the time question,
            and the account step at the front made a later email ask
            redundant. Justin, asked directly, chose to take them out
            rather than leave two screens in the file that nobody could
            ever see. The feeling VALUE stays, defaulted to unsure, because
            the reveal copy reads it and the lead row carries it. */}
        {/* Q4 — Time commitment */}
        {step === 'q4' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              How much time can you give this each day?
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: 'var(--text-base)', marginBottom: '32px', lineHeight: 1.55 }}>
              We will match your daily practice to this. You can change it any time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {TIME_COMMITMENT_OPTIONS.map(opt => {
                const on = timeCommitment === opt.value
                // ── TEN MINUTES IS THE RECOMMENDATION, AND IT SAYS SO ────────
                //
                // Justin, 13 August 2026: "this page should highlight the 10
                // minutes as recommended."
                //
                // The three read as equals with a faint tint on the middle one,
                // and "the pace most families use" is doing the persuading in
                // grey uppercase underneath, which is where a reader's eye goes
                // last. A parent picking blind here picks 5, and 5 minutes is
                // not enough day to build a habit on.
                //
                // Ten is also the number the whole product already promises:
                // the welcome email says ten minutes a day and TASK_MINUTES
                // budgets the road to ten. So this is not a nudge invented for
                // the screen, it is the page finally agreeing with everything
                // else.
                const recommended = opt.value === '10min'
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectTimeCommitment(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
                      padding: '15px 16px',
                      background: recommended && !on ? 'var(--stage-1)' : '#fff',
                      border: `${recommended ? 2 : 1.5}px solid ${on || recommended ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '16px', cursor: 'pointer', textAlign: 'left',
                      boxShadow: on
                        ? '0 8px 22px rgba(220,88,50,0.18)'
                        : recommended ? '0 5px 0 var(--terracotta-dark)' : '0 1px 2px rgba(26,26,46,0.05)',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                          {opt.label}
                        </span>
                        {recommended && (
                          <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--ink)', background: 'var(--gold)',
                            borderRadius: '100px', padding: '3px 9px',
                          }}>
                            Recommended
                          </span>
                        )}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {opt.sub}
                      </span>
                    </span>
                    <span style={{ color: on ? 'var(--terracotta)' : 'var(--ink-light)', fontSize: 'var(--text-xl)', flexShrink: 0, lineHeight: 1, fontWeight: 300 }}>›</span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep('q2')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────
   Result screen. The wow page. Five beats, in order:
   1. Reassure and name it (dark Sound familiar card + stage card)
   2. Your first week with us (day strip on a dotted path, DiGi walks it)
   3. What you get (feature flash cards)
   4. The pathway simulation (five stages, DiGi walks as you scroll)
   5. Save CTA (dark card, the one primary CTA)
   Spec: /plans/starter-result-wow-spec.md
──────────────────────────────────────────────────────────────── */
