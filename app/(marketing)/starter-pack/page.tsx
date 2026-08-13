'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DigiCharacter from '@gc/shared/components/DigiCharacter'
import Celebration from '@/components/ui/Celebration'
import { createClient } from '@/lib/supabase/client'
import { bandForAge } from '@/lib/children/age'
import {
  STAGES,
  CHALLENGE_OPTIONS,
  FEELING_OPTIONS,
  TIME_COMMITMENT_OPTIONS,
  getStageFromAgeBand,
  type AgeBand,
  type ChallengeId,
  type FeelingId,
  type TimeCommitmentId,
  type StarterAnswers,
} from '@/lib/content/stages'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type Step = 'intro' | 'details' | 'q1' | 'q2' | 'q3' | 'q4' | 'email' | 'reassure' | 'result'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const

// Seventeen years back, newest first, because a parent scrolling for a nine
// year old should not pass 2009 on the way. The product runs from four to
// sixteen and one spare year each side covers a child who is nearly either.
const THIS_YEAR = new Date().getFullYear()
const BIRTH_YEARS = Array.from({ length: 18 }, (_, i) => THIS_YEAR - i)

// ── THE SIX CONCERNS, DRAWN PROPERLY ────────────────────────────────────────
//
// Justin, 13 August 2026, on this grid: better icons, "Happy News or
// Higgsfield style".
//
// What was here was six 1.6 weight outline glyphs, the default of every admin
// panel on the internet, and at 26px inside a 46px well they read as grey
// scratches. Worse, three of the six were near enough the same drawing: a
// rounded rectangle. Screens taking over, asking for a phone, and to a squint
// mood changes, all resolved to a phone outline, so the row a parent is meant
// to scan and recognise themselves in offered three identical shapes.
//
// These are solid. A filled body at low opacity carries the colour of the
// tile, a heavier stroke draws the form on top, and each one has a piece of
// STORY in it rather than a symbol: the screen has a wave breaking over it,
// the mood has a small cloud, the conversation has two bubbles rather than
// one, and asking for a phone is a hand holding one up. That is the Happy News
// trick, and it is why those illustrations read at a glance where an icon set
// does not: the picture shows the situation, not the object.
//
// currentColor throughout, so each one takes the tile's own colour from
// CHALLENGE_TINT below and the grid reads as six different things.
const CHALLENGE_ICONS: Record<string, React.ReactNode> = {
  // A screen with the tide coming over it.
  screens_takeover: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" fill="currentColor" fillOpacity=".18" />
      <rect x="6.5" y="2.5" width="11" height="19" rx="3" />
      <path d="M3.5 14.5c1.4 0 1.4 1.6 2.8 1.6s1.4-1.6 2.8-1.6 1.4 1.6 2.8 1.6 1.4-1.6 2.8-1.6 1.4 1.6 2.8 1.6 1.4-1.6 2.8-1.6" fill="none" />
      <path d="M3.5 18.2c1.4 0 1.4 1.6 2.8 1.6s1.4-1.6 2.8-1.6 1.4 1.6 2.8 1.6 1.4-1.6 2.8-1.6 1.4 1.6 2.8 1.6 1.4-1.6 2.8-1.6" fill="none" strokeOpacity=".5" />
    </svg>
  ),
  // A face gone flat, with its own small weather overhead.
  mood_changes: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="13.5" r="7.6" fill="currentColor" fillOpacity=".18" />
      <circle cx="12" cy="13.5" r="7.6" />
      <path d="M9.4 16.8c1.7-.7 3.5-.7 5.2 0" />
      <path d="M9.2 11.6v.02M14.8 11.6v.02" strokeWidth="2.9" />
      <path d="M4.2 5.4c1.6-2 4.6-1.6 5.3.6" strokeOpacity=".55" strokeWidth="1.7" />
    </svg>
  ),
  // A controller with real buttons, held rather than diagrammed.
  gaming: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.2 7.5h9.6a4.7 4.7 0 0 1 4.6 3.8l.7 4.1a2.6 2.6 0 0 1-4.7 1.9l-1.4-2.1H8l-1.4 2.1a2.6 2.6 0 0 1-4.7-1.9l.7-4.1a4.7 4.7 0 0 1 4.6-3.8z" fill="currentColor" fillOpacity=".18" />
      <path d="M7.2 7.5h9.6a4.7 4.7 0 0 1 4.6 3.8l.7 4.1a2.6 2.6 0 0 1-4.7 1.9l-1.4-2.1H8l-1.4 2.1a2.6 2.6 0 0 1-4.7-1.9l.7-4.1a4.7 4.7 0 0 1 4.6-3.8z" />
      <path d="M7.4 11v2.4M6.2 12.2h2.4" />
      <path d="M16 11.4v.02M17.8 13.1v.02" strokeWidth="2.6" />
    </svg>
  ),
  // A shield that is already holding, not one that might.
  online_safety: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.4l7.4 3.1v5.2c0 5.3-3.7 9.4-7.4 10.6C8.3 20.1 4.6 16 4.6 10.7V5.5L12 2.4z" fill="currentColor" fillOpacity=".18" />
      <path d="M12 2.4l7.4 3.1v5.2c0 5.3-3.7 9.4-7.4 10.6C8.3 20.1 4.6 16 4.6 10.7V5.5L12 2.4z" />
      <path d="M8.7 11.9l2.4 2.4 4.3-4.6" strokeWidth="2.3" />
    </svg>
  ),
  // Two bubbles, because a conversation is not one person talking.
  start_conversation: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.4 8.2a3 3 0 0 1 3-3h8.4a3 3 0 0 1 3 3v3.4a3 3 0 0 1-3 3H7.6L3.6 18v-3.6a3 3 0 0 1-1.2-2.4z" fill="currentColor" fillOpacity=".18" />
      <path d="M2.4 8.2a3 3 0 0 1 3-3h8.4a3 3 0 0 1 3 3v3.4a3 3 0 0 1-3 3H7.6L3.6 18v-3.6a3 3 0 0 1-1.2-2.4z" />
      <path d="M16.8 9.1h1.8a3 3 0 0 1 3 3v3.3a3 3 0 0 1-1.2 2.4V21l-2.8-2.2h-3.2a3 3 0 0 1-2.6-1.5" strokeOpacity=".65" />
    </svg>
  ),
  // A hand holding a phone up. This is the ask, not the object.
  asking_for_phone: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2.2" width="10" height="13.4" rx="2.6" fill="currentColor" fillOpacity=".18" />
      <rect x="7" y="2.2" width="10" height="13.4" rx="2.6" />
      <path d="M10.2 5.6a1.9 1.9 0 1 1 2.6 1.8v1.3" />
      <path d="M12.8 11.3v.02" strokeWidth="2.6" />
      <path d="M5.6 16.4c1.9 2.4 3.6 3.6 6.4 3.6s4.5-1.2 6.4-3.6" strokeOpacity=".6" strokeWidth="1.7" />
    </svg>
  ),
}

// Each concern gets its own soft colour family, so the grid reads as six
// distinct things rather than six identical pale blue tiles. The tint is
// the icon well, the fg is the line icon on top of it.
const CHALLENGE_TINT: Record<string, { bg: string; fg: string }> = {
  screens_takeover:   { bg: 'var(--stage-2)',       fg: 'var(--stage-2-text)' },
  mood_changes:       { bg: 'var(--stage-3)',       fg: 'var(--stage-3-text)' },
  gaming:             { bg: 'var(--stage-5)',       fg: 'var(--stage-5-text)' },
  online_safety:      { bg: 'var(--tint-green)',    fg: '#2D5016' },
  start_conversation: { bg: 'var(--stage-4)',       fg: 'var(--stage-4-text)' },
  asking_for_phone:   { bg: 'var(--terracotta-lt)', fg: 'var(--terracotta-dark)' },
}

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
  // Concerns the parent ticked, most pressing first. picks[0] is the one we
  // start the pathway on, so a single derived value keeps every downstream
  // screen working exactly as before while the parent can now name several.
  const [picks, setPicks] = useState<ChallengeId[]>([])
  const challenge = picks[0] ?? null
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
  // True once the account exists and needs email confirmation before they can
  // step into the platform (only when Confirm email is switched on in
  // Supabase). With it off, a session is created and this stays false.
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const supabase = createClient()
  // A parent who has already been through the quiz on this device. We greet
  // them by name of intent rather than making them start Q1 over again.
  const [returning, setReturning] = useState(false)
  const [restored, setRestored] = useState(false)

  const stage = ageBand ? getStageFromAgeBand(ageBand) : null

  // Resume mid-quiz progress on refresh or return visit, instead of losing
  // everything and starting over at Q1.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gc_starter_progress')
      if (saved) {
        const parsed = JSON.parse(saved) as { step: Step; ageBand: AgeBand | null; dobMonth?: number | null; dobYear?: number | null; picks?: ChallengeId[]; challenge?: ChallengeId | null; feeling: FeelingId | null; timeCommitment: TimeCommitmentId | null }
        if (parsed.ageBand) setAgeBand(parsed.ageBand)
        // A parent part way through keeps the birthday they already gave, and
        // an older saved run has no birthday at all, which is why the band is
        // restored on its own line above rather than derived from this.
        if (parsed.dobMonth) setDobMonth(parsed.dobMonth)
        if (parsed.dobYear) setDobYear(parsed.dobYear)
        if (parsed.picks?.length) setPicks(parsed.picks)
        else if (parsed.challenge) setPicks([parsed.challenge])
        if (parsed.feeling) setFeeling(parsed.feeling)
        if (parsed.timeCommitment) setTimeCommitment(parsed.timeCommitment)
        if (parsed.step && parsed.step !== 'result' && parsed.step !== 'reassure') setStep(parsed.step)
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
          if (a.concerns?.length) setPicks(a.concerns)
          else if (a.challenge) setPicks([a.challenge])
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
      localStorage.setItem('gc_starter_progress', JSON.stringify({ step, ageBand, dobMonth, dobYear, picks, feeling, timeCommitment }))
    } catch {}
  }, [restored, step, ageBand, dobMonth, dobYear, picks, feeling, timeCommitment])

  useEffect(() => {
    if (step === 'result' && ageBand && challenge && feeling && timeCommitment) {
      const answers: StarterAnswers = { ageBand, challenge, concerns: picks, feeling, timeCommitment }
      try {
        localStorage.setItem('gc_starter_answers', JSON.stringify(answers))
        localStorage.removeItem('gc_starter_progress')
      } catch {}
    }
  }, [step, ageBand, challenge, picks, feeling, timeCommitment])

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
  // Tap adds or removes a concern. The first one ticked becomes the most
  // pressing by default (front of the list), the parent can move that with
  // the Start here control on any other ticked card.
  function toggleChallenge(c: ChallengeId) {
    setPicks(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }
  function makePrimary(c: ChallengeId) {
    setPicks(prev => [c, ...prev.filter(x => x !== c)])
  }
  function selectFeeling(f: FeelingId) {
    setFeeling(f)
    setTimeout(() => setStep('q4'), 280)
  }
  function selectTimeCommitment(t: TimeCommitmentId) {
    setTimeCommitment(t)
    // Email and name are already captured up front, so the last answer goes
    // straight to the pathway. Update the lead, and write the account through
    // (onboarding complete, trial, child) while the build animation plays.
    captureLead({ ageBand, concerns: picks, challenge, feeling, timeCommitment: t })
    finishSetup()
    setTimeout(() => setStep('reassure'), 280)
  }

  // Save the lead server side, best effort, keyed by email. Called once up
  // front (so the founder ping fires the moment we have an email) and again
  // with the full answers at the end. Never blocks the flow.
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

  // The first screen now: who you are, before the questions. This front loads
  // name and email so we never ask twice, and lands a return visit in the
  // right place. Then straight into the age question.
  async function submitDetails() {
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
    setSavingEmail(true)
    try {
      localStorage.setItem('gc_starter_name', name.trim())
      localStorage.setItem('gc_starter_email', clean)
    } catch {}

    // Create the account up front, the one click that sets it all up. With
    // Confirm email off a session is established now and they walk straight in
    // at the end; with it on the account is made and they confirm by email
    // before stepping in.
    const { data, error } = await supabase.auth.signUp({
      email: clean,
      password,
      options: { data: { full_name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      const msg = error.message.toLowerCase()
      setEmailError(
        msg.includes('already registered') || msg.includes('already been registered')
          ? 'That email already has an account. Sign in and your pathway is waiting.'
          : error.message
      )
      setSavingEmail(false)
      return
    }
    if (!data.session) setNeedsConfirm(true)

    await captureLead({})
    setSavingEmail(false)
    setStep('q1')
  }

  // Once the questions are done, write the account through: mark onboarding
  // complete, start the free trial, and create the child. This is what the old
  // separate onboarding did, folded into the one flow so the child is never
  // asked again. Best effort; if the session is not ready yet (email
  // confirmation pending) the old onboarding remains the fallback.
  //
  // THE TRIAL IS NOT WRITTEN HERE ANY MORE, and that is the point rather than a
  // tidy up. It used to set trial_ends_at straight onto the parent's own
  // profile row from the browser, which meant two things.
  //
  // A client write can be repeated: run the starter pack again, or call the
  // same update from the console, and the four days start again for ever.
  //
  // And granting it here REQUIRED trial_ends_at to be writable by
  // `authenticated`, which is the same grant that let anyone set
  // subscription_status to active and take the whole product free. Justin, 8
  // August 2026: "we must make sure real users can not continue without
  // subscribing." Migration 175 revokes both columns, and /api/trial/start
  // grants the trial once, on the server, where the rule can be enforced.
  async function finishSetup() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const stg = ageBand ? getStageFromAgeBand(ageBand) : null
      await supabase.from('profiles').update({
        onboarding_complete: true,
        onboarding_answers: { ageBand, challenge, feeling, timeCommitment },
      }).eq('id', user.id)
      // Best effort, like everything else in here. A trial that fails to start
      // is a parent who sees the upgrade page a little early, which is a far
      // better failure than a setup that cannot finish.
      try { await fetch('/api/trial/start', { method: 'POST' }) } catch { /* onboarding is the fallback */ }
      const { data: existing } = await supabase.from('children').select('id').eq('parent_id', user.id).limit(1)
      if (!existing || existing.length === 0) {
        await supabase.from('children').insert({
          parent_id: user.id,
          name: childName.trim() || 'Your child',
          age_band: ageBand,
          // The birthday itself, which is the thing the band is derived FROM.
          // Without it lib/learning/term.ts cannot say which school year they
          // are in and the birthday setup step has to ask all over again.
          date_of_birth: dob,
          stage_id: stg ? stg.name.toLowerCase() : 'explorer',
          is_primary: true,
        })
      }
      try { localStorage.removeItem('gc_starter_answers') } catch {}
    } catch { /* onboarding remains the fallback */ }
  }

  // The one detail we ask for: where to send the starter pack, and the key
  // that lands a return visit back in their account. Answers are already in
  // localStorage; we save the lead server side, best effort, and never block
  // the pathway on it.
  async function submitEmail() {
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailError('Please enter a valid email so we can send your pack.')
      return
    }
    setEmailError('')
    setSavingEmail(true)
    try { localStorage.setItem('gc_starter_email', clean) } catch {}
    try {
      await fetch('/api/starter/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: clean,
          answers: { ageBand, concerns: picks, challenge, feeling, timeCommitment },
          stageId: stage ? String(stage.id) : null,
        }),
      })
    } catch { /* lead capture is best effort, the pathway still builds */ }
    setSavingEmail(false)
    setStep('reassure')
  }

  const progress = (step === 'intro' || step === 'details') ? 0 : step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q3' ? 3 : 4

  if (step === 'result' && stage && ageBand && challenge) {
    return (
      <ResultScreen
        stage={stage}
        accent={STAGE_ACCENT[stage.id]}
        challenge={challenge}
        feeling={feeling!}
        email={email}
        needsConfirm={needsConfirm}
        childName={childName.trim()}
      />
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Segmented progress at the very top, one bar per question, the way
          the best onboarding flows show real momentum rather than a vague
          creeping line (Chime, Nextdoor and the like). */}
      <div style={{ display: 'flex', gap: '4px', padding: '8px 10px 0', flexShrink: 0 }} aria-hidden="true">
        {[1, 2, 3, 4].map(n => (
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
            Question {progress} of 4
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
            <button onClick={() => { setReturning(false); setStep('details') }} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
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
              onClick={() => setStep('details')}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px' }}
            >
              Start, it is free
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.06em' }}>
              No card. No commitment. Built on the research.
            </p>
          </>
        )}

        {/* Details — name and email first, so we never ask twice and a return
            visit lands right where it left off. This is the only email ask. */}
        {step === 'details' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={60} height={60} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px', textAlign: 'center',
            }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
              One step, then straight into your pathway. This is the only setup, your name, email and a password.
            </p>

            <input
              className="input"
              type="text"
              autoComplete="given-name"
              placeholder="Your first name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ fontSize: 'var(--text-md)', marginBottom: '12px' }}
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
              onKeyDown={e => { if (e.key === 'Enter') submitDetails() }}
              style={{ fontSize: 'var(--text-md)', marginBottom: emailError ? '10px' : '16px' }}
            />
            {emailError && (
              <p style={{ color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)', textAlign: 'center', marginBottom: '14px', lineHeight: 1.5 }}>
                {emailError}
              </p>
            )}

            <button
              onClick={submitDetails}
              disabled={savingEmail}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: 'var(--text-base)', padding: '17px', opacity: savingEmail ? 0.7 : 1 }}
            >
              {savingEmail ? 'One moment...' : 'Continue'}
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              No card. We save your pathway and email the occasional genuinely useful thing. Unsubscribe any time.
            </p>
            <button onClick={() => setStep('intro')} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
              ← Back
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
                <div key={row.t} style={{
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
            <style>{`@keyframes buildIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
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
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '24px', lineHeight: 1.55 }}>
              Tick everything that is going on. We cover them all, and more as we go. Tap one to say which we open on tomorrow.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {CHALLENGE_OPTIONS.map(opt => {
                const sel = picks.includes(opt.value)
                const isPrimary = picks[0] === opt.value
                const tint = CHALLENGE_TINT[opt.value] ?? { bg: 'var(--stage-2)', fg: 'var(--terracotta-dark)' }
                return (
                  <button
                    key={opt.value}
                    onClick={() => toggleChallenge(opt.value)}
                    aria-pressed={sel}
                    style={{
                      position: 'relative',
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '18px 16px 16px',
                      background: 'var(--white)',
                      border: `2px solid ${isPrimary ? 'var(--terracotta-dark)' : sel ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '18px', cursor: 'pointer', textAlign: 'left',
                      transition: 'transform 0.16s cubic-bezier(0.22,1,0.36,1), box-shadow 0.16s, border-color 0.16s',
                      transform: sel ? 'translateY(-2px)' : 'none',
                      boxShadow: sel
                        ? '0 10px 28px rgba(201,154,40,0.20), 0 2px 6px rgba(26,26,46,0.05)'
                        : '0 4px 20px rgba(26,26,46,0.06)',
                    }}
                  >
                    {/* Tick, top right, once selected */}
                    <span aria-hidden style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 22, height: 22, borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: sel ? 'var(--terracotta)' : 'transparent',
                      border: sel ? 'none' : '2px solid var(--border)',
                      transition: 'background 0.16s',
                    }}>
                      {sel && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12.5l4.5 4.5L19 7" />
                        </svg>
                      )}
                    </span>

                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 52, height: 52, borderRadius: '16px',
                      background: tint.bg, color: tint.fg, marginBottom: '12px',
                    }}>
                      {CHALLENGE_ICONS[opt.value] ?? opt.icon}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.3 }}>
                      {opt.label}
                    </span>

                    {/* ── WHICH ONE WE OPEN ON, NOT WHICH ONE WE COVER ──────
                        Justin, 13 August 2026: "when you tick one it says we
                        start here, but then tick another one it says start
                        here instead, which does not make sense as they can add
                        many, we will cover them all and more as we go."

                        He is right and the fault is the word INSTEAD. It is
                        the language of choosing between things, on a screen
                        built for ticking as many as apply, so a parent ticking
                        their third worry was told they had just swapped it for
                        the first two. Nothing was being swapped: every one
                        ticked goes on the list and the marker only says which
                        one the first day opens on.

                        "First" says the same thing without implying a trade. */}
                    {isPrimary ? (
                      <span style={{
                        marginTop: '10px',
                        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                        borderRadius: '100px', padding: '4px 9px',
                      }}>
                        First
                      </span>
                    ) : sel ? (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={e => { e.stopPropagation(); makePrimary(opt.value) }}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); makePrimary(opt.value) } }}
                        style={{
                          marginTop: '10px',
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: 'var(--ink-muted)', border: '1px solid var(--border)',
                          borderRadius: '100px', padding: '4px 9px', cursor: 'pointer',
                        }}
                      >
                        Start with this
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>

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

            {/* At the decision point, name plainly that this is only the
                starting focus, so ticking one never reads as missing the rest */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '9px',
              marginTop: '20px', padding: '11px 14px',
              background: 'var(--tint-sage)', border: '1px solid var(--border)', borderRadius: '12px',
            }}>
              <span aria-hidden style={{ fontSize: 'var(--text-base)', flexShrink: 0 }}>🎯</span>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
                You are choosing where to start. Every other part of your child&apos;s age is still in your plan.
              </p>
            </div>

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

        {/* Q3 — Feeling */}
        {step === 'q3' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              How are you feeling about it?
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: 'var(--text-base)', marginBottom: '32px', lineHeight: 1.55 }}>
              There is no wrong answer. This shapes how we frame what comes next.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FEELING_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectFeeling(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: feeling === opt.value ? 'var(--terracotta)' : 'var(--cream)',
                    border: `1.5px solid ${feeling === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    boxShadow: feeling === opt.value ? '0 5px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)', color: feeling === opt.value ? '#fff' : 'var(--ink)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: feeling === opt.value ? 'rgba(255,255,255,0.75)' : 'var(--ink-muted)', marginTop: '3px', letterSpacing: '0.08em' }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{ color: feeling === opt.value ? '#fff' : 'var(--ink-light)', fontSize: 'var(--text-md)' }}>→</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('q2')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}

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
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectTimeCommitment(opt.value)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
                      padding: '15px 16px',
                      background: '#fff',
                      border: `1.5px solid ${on ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '16px', cursor: 'pointer', textAlign: 'left',
                      boxShadow: on ? '0 8px 22px rgba(220,88,50,0.18)' : '0 1px 2px rgba(26,26,46,0.05)',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                  >
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                        {opt.label}
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

        {/* Email — asked last, once the four questions are done and the pack is
            clearly worth having. This is the key that lands a return visit in
            the right place, and where tonight's starter pack is sent. */}
        {step === 'email' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '18px' }}>
              <img src="/digi-squad/DiGi-star.svg" alt="" width={60} height={60} style={{ animation: 'gentleFloat 3.5s ease-in-out infinite' }} />
            </div>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1,
              color: 'var(--ink)', marginBottom: '10px', textAlign: 'center',
            }}>
              Where should we send it?
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-base)', marginBottom: '26px', lineHeight: 1.6, textAlign: 'center' }}>
              Your pathway is ready. Add your email and we save it to your account, so next time you land straight back here, not at the start.
            </p>

            <input
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
              onKeyDown={e => { if (e.key === 'Enter') submitEmail() }}
              style={{ fontSize: 'var(--text-md)', textAlign: 'center', marginBottom: emailError ? '10px' : '16px' }}
            />
            {emailError && (
              <p style={{ color: 'var(--terracotta-dark)', fontSize: 'var(--text-sm)', textAlign: 'center', marginBottom: '14px', lineHeight: 1.5 }}>
                {emailError}
              </p>
            )}

            <button
              onClick={submitEmail}
              disabled={savingEmail}
              style={{
                width: '100%', padding: '17px 28px', borderRadius: 16, border: 'none',
                background: 'var(--terracotta)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)',
                cursor: savingEmail ? 'default' : 'pointer', opacity: savingEmail ? 0.7 : 1,
                boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}
            >
              {savingEmail ? 'Starting your pathway...' : 'Start your digital pathway'}
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              No card. We email the starter pack and the occasional genuinely useful thing. Unsubscribe any time.
            </p>
            <button onClick={() => setStep('q4')} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
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

const RESULT_EYEBROW: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '10px',
}

const RESULT_H2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
  fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)',
  lineHeight: 1.18, marginBottom: '10px',
}

const FEATURES: { title: string; body: string; comingSoon?: boolean; lessons?: boolean; icon: React.ReactNode }[] = [
  // ── QUESTS LEADS, AND IT WAS NOT HERE AT ALL ──────────────────────────────
  //
  // Justin, 13 August 2026: "quests is missing from tabs under everything
  // waiting inside. Manage jobs and balance, outside inside, device use
  // against play and jobs, to create the perfect habit of device."
  //
  // The one genuinely ours was the one missing. Everything else in this grid
  // is a better version of something a parent can picture: scripts, lessons,
  // checklists. Jobs earning the screen time is the mechanic the whole child
  // side turns on and the thing nobody else does, and the page that sells the
  // product did not mention it.
  //
  // First rather than appended, because it is the strongest card here.
  {
    title: 'Jobs that earn the screen time',
    body: 'Real jobs, time outside, a book. They earn stars, stars become minutes, and you set the rate. The argument stops being a negotiation.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/>
      </svg>
    ),
  },
  {
    title: 'The social media passport',
    body: 'The whole pathway to 16 in one place. A stamp earned each stage, so 16 is a step, not a cliff edge.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>
      </svg>
    ),
  },
  {
    title: 'Daily moments',
    body: 'The morning routine, homework, the gaming handover, bedtime. The exact words for each, and what your child learns from it.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        <line x1="12" y1="2" x2="12" y2="5"/>
        <line x1="12" y1="19" x2="12" y2="22"/>
        <line x1="2" y1="12" x2="5" y2="12"/>
        <line x1="19" y1="12" x2="22" y2="12"/>
        <line x1="4.9" y1="4.9" x2="7" y2="7"/>
        <line x1="17" y1="17" x2="19.1" y2="19.1"/>
      </svg>
    ),
  },
  {
    title: '160 exact scripts',
    body: 'The exact words for the hard conversations, from first tablet to first phone.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <line x1="9" y1="9" x2="15" y2="9"/>
        <line x1="9" y1="13" x2="13" y2="13"/>
      </svg>
    ),
  },
  {
    title: 'DiGi, always on',
    body: 'Trained on the research. A real answer at 11pm, calibrated to your child. Never a flat yes or no.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.4 6.2L21 9l-5 4.2 1.6 6.8L12 16.5 6.4 20l1.6-6.8L3 9l6.6-.8L12 2z"/>
      </svg>
    ),
  },
  {
    title: 'Device settings, sorted',
    body: 'Per device, per age checklists, iPhone first. What to set tonight, before anything else.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: 'The wellbeing tracker',
    body: 'One tap a day, a check in each week. Patterns you can act on before they become problems.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="20" x2="6" y2="14"/>
        <line x1="12" y1="20" x2="12" y2="8"/>
        <line x1="18" y1="20" x2="18" y2="11"/>
        <path d="M4 4l4 3 4-4 4 3 4-2"/>
      </svg>
    ),
  },
  {
    title: 'The family agreement',
    body: 'One page you build together, print, and both sign. Agreed, so it actually holds.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
        <path d="M14 2v6h6"/>
        <path d="M9 15l2 2 4-4"/>
      </svg>
    ),
  },
  {
    title: 'The lesson library',
    body: '100 lessons for digital home schooling, written to be taught at the kitchen table.',
    lessons: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2V4z"/>
        <path d="M22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8V4z"/>
      </svg>
    ),
  },
  {
    title: 'Weekly advice emails',
    body: 'Written by a parent, not a robot. One genuinely useful thing each week.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M22 7l-10 6L2 7"/>
      </svg>
    ),
  },
  {
    title: 'School reminders',
    body: 'Forward the school\'s emails and the dates and tasks appear as alerts. Never miss a PE kit day again.',
    comingSoon: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
      </svg>
    ),
  },
]

const LESSON_THUMBS = [
  { band: 'var(--stage-2-bold)', tilt: '-2deg', label: 'The algorithm' },
  { band: 'var(--stage-3-bold)', tilt: '1.5deg', label: 'Group chats' },
  { band: 'var(--stage-5-bold)', tilt: '-1deg', label: 'AI and you' },
]

// The tour reads as chapters. Each pill scrolls to its beat, so a parent
// can see the whole shape of the next sixty seconds before they give it.
const CHAPTERS: { id: string; label: string }[] = [
  { id: 'chapter-week', label: 'Tonight' },
  { id: 'chapter-inside', label: 'What you get' },
  { id: 'chapter-road', label: 'The road to 16' },
  { id: 'chapter-cta', label: 'Step in' },
]

function ResultScreen({
  stage, accent, challenge, feeling, email, needsConfirm, childName,
}: {
  stage: ReturnType<typeof getStageFromAgeBand>
  accent: { bold: string; text: string }
  challenge: ChallengeId
  feeling: FeelingId
  email?: string
  needsConfirm?: boolean
  childName?: string
}) {
  // The account was created on the first screen, so stepping in goes straight
  // to the platform, no second sign up. Only when email confirmation is
  // pending do they confirm by email first, then sign in.
  // INTO SETUP, NOT ONTO THE DASHBOARD. Justin, 13 August 2026: "guide then
  // into the start of set up as discussed." A parent landing on Home with
  // nothing set up meets a page about a family that does not exist yet. Setup
  // opens on the check in that becomes their baseline, which is also the door
  // to everything else. The welcome email points at the same place.
  const enterHref = needsConfirm ? `/login${email ? `?email=${encodeURIComponent(email)}` : ''}` : '/dashboard/setup'
  const challengeAction = stage.challengeActions[challenge] ?? stage.action
  const challengeLabel = CHALLENGE_OPTIONS.find(c => c.value === challenge)?.label ?? 'what you told us'
  // Their child's name carries the whole page: the headline, week one and
  // the final door all belong to them, not to a generic "your child".
  const kid = childName && childName.length > 1 ? childName : ''
  const headline = kid ? `${kid}'s pathway is built.` : 'Your pathway is built.'

  const rootRef = useRef<HTMLDivElement>(null)
  const weekPathRef = useRef<HTMLDivElement>(null)
  const weekDigiRef = useRef<HTMLDivElement>(null)
  const pathwayRef = useRef<HTMLDivElement>(null)
  const pathwayDigiRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  // The floating step in bar: arrives once week one has been read, retires
  // the moment the real door is on screen.
  const [showFloat, setShowFloat] = useState(false)

  const feelingLine =
    feeling === 'anxious' ? 'You said this feels like a lot right now. That is exactly what your first week is built to fix.'
    : feeling === 'unsure' ? 'You said you were not sure where to start. Day 1 is the start.'
    : 'You said you were ready to act. Good. Here is the plan.'

  const week: { label: string; tint: string; dot: string; title: string; body: string; script?: string }[] = [
    { label: 'Day 1', tint: 'var(--stage-1)', dot: 'var(--stage-1-bold)', title: 'The 5pm meltdown, handled', body: challengeAction, script: stage.script.sayThis },
    { label: 'Day 2', tint: 'var(--stage-2)', dot: 'var(--stage-2-bold)', title: 'One tap on the tracker', body: 'How did the evening go? Tap once. The tracker starts spotting the patterns you are too close to see.' },
    { label: 'Day 3', tint: 'var(--stage-3)', dot: 'var(--stage-3-bold)', title: '11pm, and you have a question', body: 'You ask DiGi. You get a real answer for your child and your stage, not a lecture and not a list of links.' },
    { label: 'Every day', tint: 'var(--stage-4)', dot: 'var(--stage-4-bold)', title: 'Five minutes, no more', body: 'Each day asks five minutes of you. Small enough to keep. Big enough to change the week.' },
    { label: 'Friday', tint: 'var(--stage-5)', dot: 'var(--stage-5-bold)', title: 'The Friday check in', body: 'You look back at the week and plan the next one together. You always know your next step.' },
  ]

  // GSAP: gentle staggered reveals for every beat, DiGi scrubbing down the
  // week path and across the five stage pathway. All of it switches off for
  // reduced motion, and content is fully visible without JavaScript because
  // hiding only ever happens in here.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // The arrival: the headline lands word by word, the film title moment.
      const words = gsap.utils.toArray<HTMLElement>('.wow-word', rootRef.current)
      if (words.length) {
        gsap.fromTo(words,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.09, delay: 0.15, clearProps: 'transform,opacity' }
        )
      }

      // A hairline of progress across the very top: how far through the
      // tour you are, start to door.
      if (progressRef.current) {
        gsap.fromTo(progressRef.current, { scaleX: 0 }, {
          scaleX: 1, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom bottom', scrub: 0.3 },
        })
      }

      // The numbers strip counts itself up as it arrives.
      const nums = gsap.utils.toArray<HTMLElement>('.wow-num', rootRef.current)
      nums.forEach(el => {
        const target = Number(el.dataset.count ?? '0')
        const counter = { v: 0 }
        gsap.to(counter, {
          v: target, duration: 1.3, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => { el.textContent = String(Math.round(counter.v)) },
        })
      })

      // Floating step in bar: shows after week one, hides at the real door.
      if (weekPathRef.current) {
        ScrollTrigger.create({
          trigger: weekPathRef.current, start: 'bottom 78%',
          onEnter: () => setShowFloat(true),
          onLeaveBack: () => setShowFloat(false),
        })
      }
      if (ctaRef.current) {
        ScrollTrigger.create({
          trigger: ctaRef.current, start: 'top 95%',
          onEnter: () => setShowFloat(false),
          onLeaveBack: () => setShowFloat(true),
        })
      }

      const fus = gsap.utils.toArray<HTMLElement>('.wow-fu', rootRef.current)
      if (fus.length) {
        gsap.set(fus, { opacity: 0, y: 24 })
        ScrollTrigger.batch(fus, {
          start: 'top 88%',
          once: true,
          onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' }),
        })
      }

      const days = gsap.utils.toArray<HTMLElement>('.wow-day', rootRef.current)
      if (days.length) {
        gsap.set(days, { opacity: 0, x: -18 })
        ScrollTrigger.batch(days, {
          start: 'top 85%',
          once: true,
          onEnter: batch => gsap.to(batch, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out', stagger: 0.12, clearProps: 'transform,opacity' }),
        })
      }

      // DiGi slides down the dotted line beside the week cards as you read.
      if (weekPathRef.current && weekDigiRef.current) {
        gsap.to(weekDigiRef.current, {
          top: 'calc(100% - 44px)',
          ease: 'none',
          scrollTrigger: {
            trigger: weekPathRef.current,
            start: 'top 62%',
            end: 'bottom 72%',
            scrub: 0.6,
          },
        })
      }

      // DiGi walks the five stage pathway, lighting each dot its pastel.
      if (pathwayRef.current && pathwayDigiRef.current) {
        const rootStyles = getComputedStyle(document.documentElement)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pathwayRef.current,
            start: 'top 80%',
            end: 'bottom 35%',
            scrub: 0.6,
          },
        })
        tl.to(pathwayDigiRef.current, { left: 'calc(90% - 22px)', ease: 'none', duration: 5 }, 0)
        const dots = gsap.utils.toArray<HTMLElement>('.wow-stage-dot', pathwayRef.current)
        dots.forEach((dot, i) => {
          const bold = rootStyles.getPropertyValue(`--stage-${i + 1}-bold`).trim() || '#FEF08A'
          const text = rootStyles.getPropertyValue(`--stage-${i + 1}-text`).trim() || '#713F12'
          tl.to(dot, { backgroundColor: bold, borderColor: bold, color: text, scale: 1.12, duration: 0.4 }, Math.min(i * 1.25, 4.6))
        })
        // A little hop of joy as DiGi reaches 16: the road has an end, and
        // it is a good one.
        tl.to(pathwayDigiRef.current, { y: -9, duration: 0.22, ease: 'power2.out' }, 5)
        tl.to(pathwayDigiRef.current, { y: 0, duration: 0.28, ease: 'bounce.out' }, 5.22)
      }
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '0 0 80px' }}>
      {/* The payoff moment: a soft one shot confetti burst over the reveal,
          reduced motion aware, so building the pathway feels like an arrival
          and not just another screen. */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
        <Celebration />
      </div>

      {/* Tour progress hairline: fills as they walk the page, start to door */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '3px', zIndex: 60, pointerEvents: 'none' }} aria-hidden>
        <div ref={progressRef} style={{ height: '100%', background: 'var(--terracotta)', transform: 'scaleX(0)', transformOrigin: 'left' }} />
      </div>

      {/* Stage accent strip at top */}
      <div style={{ height: '5px', background: accent.bold }} />

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px 0' }}>

        {/* THE WAY IN, SAID AS AN INVITATION.

            Justin, 13 August 2026: this becomes "Let's get started", brighter
            and more professional, Apple style.

            "Take me straight in" was written as an escape hatch, and it read
            like one: a white pill with a grey hairline, tucked in the corner,
            phrased as though the parent were asking to skip something. It is
            not a skip. It is the door, and the guided reveal underneath is the
            optional part. So it is now the brightest thing on the screen and it
            says what happens next rather than what is being avoided.

            It takes the stage's own pastel, which is the same colour the bar at
            the foot of the page wears, so a parent sees the same button twice
            in the same colour and knows both go to the same place. Flat fill,
            no chunky drop shadow: this one is the clean confident one. */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Link href={enterHref} style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            fontFamily: 'var(--font-display)', fontSize: 'var(--text-base)', fontWeight: 800,
            letterSpacing: '-0.01em', color: accent.text, textDecoration: 'none',
            border: 'none', borderRadius: '100px', padding: '11px 20px', background: accent.bold,
            boxShadow: '0 4px 14px -4px rgba(26,26,46,0.30)',
          }}>
            Let&apos;s get started <span aria-hidden>→</span>
          </Link>
        </div>

        {/*
          Higgsfield intro slot: an 8 second DiGi welcome clip will sit here
          when it is ready. 16:9, autoplay, muted, no controls, poster frame
          from the clip itself. Do not block launch on it.
          <div style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
            <video src="/video/digi-welcome.mp4" autoPlay muted playsInline poster="/video/digi-welcome-poster.jpg" style={{ width: '100%', display: 'block' }} />
          </div>
        */}

        {/* ── Beat 1: the arrival, and what the next minute shows ── */}
        <div style={RESULT_EYEBROW}>Built from your answers</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.4vw, 2.4rem)', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--ink)', lineHeight: 1.12, marginBottom: '16px' }}>
          {headline.split(' ').map((word, i) => (
            <span key={i} className="wow-word" style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {word}{i < headline.split(' ').length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>

        <p className="wow-fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '12px' }}>
          <strong>Our job:</strong> the exact words for tonight, a two minute daily practice, and DiGi beside you the moment anything kicks off. <strong>Your job:</strong> five minutes a day.
        </p>
        <p className="wow-fu" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.04em', color: 'var(--ink-muted)', marginBottom: '14px' }}>
          Sixty seconds down this page and you will know exactly what happens tonight, this week, and on the road to 16.
        </p>

        {/* The chapters, tappable: the whole tour visible before it starts */}
        <div className="wow-fu" style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '8px 14px', borderRadius: '100px', cursor: 'pointer',
                background: '#fff', border: '1.5px solid var(--border)',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.06em', color: 'var(--ink-soft)',
                boxShadow: '0 2px 8px rgba(26,26,46,0.05)',
              }}
            >
              <span style={{ color: 'var(--terracotta-dark)' }}>{i + 1}</span>
              {c.label}
            </button>
          ))}
        </div>

        {/* Problem recognition. Names what they told us before offering the fix. */}
        <div className="wow-fu" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 32px rgba(26,26,46,0.10)', marginBottom: '14px' }}>
          <div style={{ background: 'var(--deep-teal)', padding: '18px 22px 22px', borderRadius: '0 0 28px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
              Sound familiar?
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {challengeLabel}
            </div>
          </div>
          <div style={{ padding: '18px 22px', background: 'var(--terracotta-lt)' }}>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
              This is one of the most common things parents raise at Stage {stage.id}. It is not a sign you are behind. It is the next thing to fix, and there is a clear next step.
            </p>
          </div>
        </div>

        {/* Stage card */}
        <div className="wow-fu" style={{
          background: '#fff', borderRadius: '16px',
          border: '1px solid var(--border)',
          borderTopWidth: '4px', borderTopColor: accent.bold,
          padding: '22px',
          boxShadow: '0 2px 16px rgba(26,26,46,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: accent.bold, color: accent.text,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {stage.id} · {stage.name}
            </span>
            {stage.isCritical && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'var(--deep-teal)', color: '#fff',
                padding: '3px 8px', borderRadius: '100px',
              }}>
                Critical window
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '3px' }}>
            {stage.keyStage} · {stage.yearGroup}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginBottom: '2px' }}>{stage.ages}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-light)', marginBottom: '12px' }}>{stage.usGrade}</div>
          <div style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '12px' }}>{stage.focus}</div>
          <div style={{ padding: '10px 14px', background: 'var(--terracotta-lt)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>
            Recommended: {stage.device}
          </div>
        </div>

        {/* ── Beat 2: your first week with us ──────────────────── */}
        <section id="chapter-week" style={{ marginTop: 'clamp(64px, 10vw, 96px)', scrollMarginTop: '18px' }}>
          <div className="wow-fu" style={RESULT_EYEBROW}>Chapter 1 · Tonight and your first week</div>
          <h2 className="wow-fu" style={RESULT_H2}>{kid ? `Here is how ${kid}'s first week goes.` : 'Here is how week one goes.'}</h2>
          <p className="wow-fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '24px' }}>
            {feelingLine}
          </p>

          <div ref={weekPathRef} style={{ position: 'relative', paddingLeft: '44px' }}>
            {/* Dotted path down the left, DiGi rides it as you scroll */}
            <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '20px', width: 0, borderLeft: '3px dotted var(--ink-light)' }} />
            <div ref={weekDigiRef} style={{ position: 'absolute', left: '-2px', top: '4px', zIndex: 2 }}>
              <DigiCharacter mood="idle" size={36} />
            </div>

            {week.map((day, i) => (
              <div key={i} className="wow-day" style={{ position: 'relative', marginBottom: '12px' }}>
                <span style={{
                  position: 'absolute', left: '-35px', top: '22px',
                  width: '13px', height: '13px', borderRadius: '50%',
                  background: day.dot, border: '2.5px solid #fff',
                  boxShadow: '0 0 0 1.5px var(--border)', zIndex: 1,
                }} />
                <div style={{ background: day.tint, border: '1px solid var(--border)', borderRadius: '16px', padding: '18px 20px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                    {day.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', marginBottom: '5px', letterSpacing: '-0.01em' }}>
                    {day.title}
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                    {day.body}
                  </p>
                  {day.script && (
                    <div style={{ marginTop: '12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '13px 15px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
                        The exact script
                      </div>
                      <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                        &ldquo;{day.script}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Beat 3: what you get ─────────────────────────────── */}
        <section id="chapter-inside" style={{ marginTop: 'clamp(64px, 10vw, 96px)', scrollMarginTop: '18px' }}>
          <div className="wow-fu" style={RESULT_EYEBROW}>Chapter 2 · What you get</div>
          <h2 className="wow-fu" style={RESULT_H2}>Everything waiting inside.</h2>
          <p className="wow-fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
            Built for real families with school runs and short evenings. Every piece earns its place.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
            {FEATURES.map((f, i) => {
              const n = (i % 5) + 1
              return (
                <div key={f.title} className="wow-fu lift" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '18px', boxShadow: '0 2px 12px rgba(26,26,46,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
                      background: `var(--stage-${n}-bold)`, color: `var(--stage-${n}-text)`,
                    }}>
                      {f.icon}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                        {f.title}
                      </span>
                      {f.comingSoon && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          background: 'var(--deep-teal)', color: '#fff',
                          padding: '3px 8px', borderRadius: '100px',
                        }}>
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                    {f.body}
                  </p>
                  {f.lessons && (
                    <div style={{ display: 'flex', gap: '9px', marginTop: '14px' }}>
                      {LESSON_THUMBS.map(t => (
                        <div key={t.label} style={{
                          width: '76px', borderRadius: '8px', overflow: 'hidden',
                          border: '1px solid var(--border)', background: '#fff',
                          transform: `rotate(${t.tilt})`,
                          boxShadow: '0 3px 10px rgba(26,26,46,0.08)',
                        }}>
                          <div style={{ height: '9px', background: t.band }} />
                          <div style={{ padding: '7px 7px 8px' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px', whiteSpace: 'nowrap' }}>
                              {t.label}
                            </div>
                            <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', marginBottom: '3px' }} />
                            <div style={{ height: '3px', background: 'var(--border)', borderRadius: '2px', width: '70%' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* The numbers, counting themselves up: the quiet proof that this
              is a built thing, not a promise */}
          <div className="wow-fu" style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: 'clamp(22px, 4vw, 30px) clamp(18px, 4vw, 28px)', marginTop: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '18px 12px' }}>
              {[
                { n: 160, label: 'exact scripts' },
                { n: 100, label: 'kitchen table lessons' },
                { n: 5, label: 'stages, one road' },
                { n: 12, label: 'years walked with you' },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 4.5vw, 2.5rem)', color: '#fff', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    <span className="wow-num" data-count={s.n}>{s.n}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginTop: '6px', lineHeight: 1.4 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Beat 4: the pathway simulation ───────────────────── */}
        <section id="chapter-road" style={{ marginTop: 'clamp(64px, 10vw, 96px)', scrollMarginTop: '18px' }}>
          <div className="wow-fu" style={RESULT_EYEBROW}>Chapter 3 · The road ahead</div>
          <h2 className="wow-fu" style={RESULT_H2}>One pathway, ages 4 to 16.</h2>
          <p className="wow-fu" style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
            Stage {stage.id} is where you start, not where it ends. The whole road is already mapped, and DiGi walks it with you.
          </p>

          <div ref={pathwayRef} className="wow-fu" style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', padding: '22px 14px 20px', boxShadow: '0 2px 16px rgba(26,26,46,0.06)' }}>
            <div style={{ position: 'relative', height: '52px' }}>
              <div ref={pathwayDigiRef} style={{ position: 'absolute', left: 'calc(10% - 22px)', bottom: '-8px', zIndex: 2 }}>
                <DigiCharacter mood="idle" size={44} />
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '10%', right: '10%', top: '11px', borderTop: '3px dotted var(--ink-light)' }} />
              <div style={{ display: 'flex', position: 'relative' }}>
                {STAGES.map(s => {
                  const isCurrent = s.id === stage.id
                  const ages = s.ageBand === '16+' ? '16 plus' : s.ageBand.replace('-', ' to ')
                  return (
                    <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <div className="wow-stage-dot" style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: '#fff', border: '2px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                        color: 'var(--ink-light)', position: 'relative', zIndex: 1,
                        boxShadow: isCurrent ? `0 0 0 3px ${accent.bold}` : 'none',
                      }}>
                        {s.id}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                          {s.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)' }}>
                          {ages}
                        </div>
                        {isCurrent && (
                          <div style={{
                            display: 'inline-block', marginTop: '4px',
                            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            background: accent.bold, color: accent.text,
                            padding: '2px 7px', borderRadius: '100px', whiteSpace: 'nowrap',
                          }}>
                            You are here
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Parent quote, warm texture before the ask */}
        <div className="wow-fu" style={{ padding: '18px 22px', borderLeft: '3px solid var(--terracotta)', background: 'var(--terracotta-lt)', borderRadius: '0 12px 12px 0', margin: 'clamp(56px, 9vw, 80px) 0 40px' }}>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
            {stage.parentQuote}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: '8px', letterSpacing: '0.04em' }}>
            Parent, Stage {stage.id}
          </p>
        </div>

        {/* ── Beat 5: the way in, and the only primary CTA on the page ──────
            Justin, 13 August 2026: "tidy up next page where it says you are in
            in green, not necessary... this needs to be all in line with web
            design so tidy, and have passport and quests to run devices etc as
            key, so much slicker, shorter, clearer, and guide then into the
            start of set up."

            It was a solid green block with a second, separate list of what is
            included underneath it, so the one moment that matters was said in
            two places in two visual languages, neither of them the one the rest
            of the page is written in. One white card now, the same card as
            every other card here, with the list inside it rather than after it.

            The list leads with the passport and the quests because those are
            what a parent is actually buying into: a record that fills up, and
            jobs that earn the screen time. The four free days are named plainly
            in their own line rather than being the headline. */}
        <div id="chapter-cta" ref={ctaRef} className="wow-fu" style={{
          background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
          padding: '32px 24px', marginBottom: '12px', scrollMarginTop: '18px',
          boxShadow: '0 4px 24px rgba(26,26,46,0.07)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '12px' }}>
            {needsConfirm ? 'One last step' : `Stage ${stage.id} · ${stage.name}`}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--ink)', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '10px' }}>
            {needsConfirm ? 'Check your email' : kid ? `${kid}'s pathway is ready` : 'Your pathway is ready'}
          </h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-md)', lineHeight: 1.6, marginBottom: '22px' }}>
            {needsConfirm
              ? 'We sent a link to confirm your email. Tap it, then step straight in. Everything you have just told us is saved.'
              : 'Setting up takes a couple of minutes and starts with one question about where things are right now.'}
          </p>

          {/* WHAT THEY ACTUALLY GET, inside the card rather than in a second
              block below it. Passport and quests first. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
            {[
              ['🛂', 'The passport to sixteen', 'Filled in together, a stamp each stage'],
              ['⭐', 'Quests that earn the screen time', 'Real jobs, stars, and you set the rate'],
              ['💬', 'The words for the hard moments', 'Ready before the moment, not after'],
              ['📱', 'Device settings, walked through', 'One at a time, in plain English'],
              ['📊', 'The wellbeing tracker', 'So you can see what is actually working'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', gap: '11px', alignItems: 'flex-start' }}>
                <span aria-hidden="true" style={{ fontSize: 'var(--text-lg)', lineHeight: 1.3, flexShrink: 0 }}>{icon}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{title}</span>
                  <span style={{ display: 'block', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.45 }}>{sub}</span>
                </span>
              </div>
            ))}
          </div>

          <Link
            href={enterHref}
            className="step-cta"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              padding: '17px 28px', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: '16px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              letterSpacing: '-0.01em', boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            <span>
              {needsConfirm ? 'I have confirmed, sign in' : 'Finish setting up'}
              {' '}<span className="arrow" aria-hidden style={{ fontSize: 'var(--text-lg)' }}>→</span>
            </span>
          </Link>
          {/* The four days said once, plainly, where a price would go. */}
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: 'var(--text-base)', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
            Everything open for four days. No card needed to start.
          </p>
          <p style={{ textAlign: 'center', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--terracotta-dark)', textDecoration: 'none', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>

      {/* The floating door: after week one has been read, the way in rides
          along at the bottom until the real CTA takes over. */}
      <div
        aria-hidden={!showFloat}
        style={{
          position: 'fixed', left: 0, right: 0,
          bottom: 'max(12px, env(safe-area-inset-bottom))',
          zIndex: 55, display: 'flex', justifyContent: 'center',
          padding: '0 16px', pointerEvents: showFloat ? 'auto' : 'none',
          transform: showFloat ? 'translateY(0)' : 'translateY(90px)',
          opacity: showFloat ? 1 : 0,
          transition: 'transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease',
        }}
      >
        {/* THE BAR WEARS THE STAGE, NOT BLACK.

            Justin, 13 August 2026: it is "near black", make it a pastel fitting
            the stage colour, matching the top right button.

            The deep teal was carried over from the marketing footer, where a
            dark band is the point. Here it was the last thing a parent saw at
            the end of a page that has spent five screens colouring itself in
            their child's stage, and it arrived looking like a cookie banner.
            The same pastel as the button at the top means the page opens and
            closes on the same colour and the same offer, and the child's name
            is already in it. */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          width: 'min(100%, 460px)',
          background: accent.bold, borderRadius: '18px',
          padding: '10px 10px 10px 18px',
          boxShadow: '0 12px 36px -8px rgba(26,26,46,0.32)',
        }}>
          <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: accent.text, lineHeight: 1.3 }}>
            {kid ? `${kid}'s pathway is ready` : 'Your pathway is ready'}
          </span>
          <Link
            href={enterHref}
            style={{
              flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '11px 18px', background: '#fff', color: accent.text,
              borderRadius: '13px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
              boxShadow: '0 3px 0 rgba(26,26,46,0.13)',
            }}
          >
            Step in <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
