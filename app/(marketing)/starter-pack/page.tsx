'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import DigiCharacter from '@/components/digi/DigiCharacter'
import Celebration from '@/components/ui/Celebration'
import {
  STAGES,
  AGE_BAND_OPTIONS,
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

const CHALLENGE_ICONS: Record<string, React.ReactNode> = {
  screens_takeover: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2.5"/>
      <circle cx="12" cy="18" r=".6" fill="currentColor" stroke="none"/>
    </svg>
  ),
  mood_changes: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 15.5c.8-.8 1.4-1 3-1s2.2.2 3 1"/>
      <line x1="9.5" y1="10.5" x2="9.5" y2="10.5" strokeWidth="2.5"/>
      <line x1="14.5" y1="10.5" x2="14.5" y2="10.5" strokeWidth="2.5"/>
    </svg>
  ),
  gaming: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-3z"/>
      <line x1="8" y1="11" x2="8" y2="13"/>
      <line x1="7" y1="12" x2="9" y2="12"/>
      <line x1="15.5" y1="11.5" x2="16.5" y2="11.5"/>
      <line x1="15.5" y1="12.5" x2="16.5" y2="12.5"/>
    </svg>
  ),
  online_safety: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l7 3v5c0 5-3.5 9-7 10C8.5 19 5 15 5 10V5l7-3z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  start_conversation: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="9" y1="13" x2="13" y2="13"/>
    </svg>
  ),
  asking_for_phone: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2.5"/>
      <path d="M12 7v2m0 2v.5"/>
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
  const [emailError, setEmailError] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
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
        const parsed = JSON.parse(saved) as { step: Step; ageBand: AgeBand | null; picks?: ChallengeId[]; challenge?: ChallengeId | null; feeling: FeelingId | null; timeCommitment: TimeCommitmentId | null }
        if (parsed.ageBand) setAgeBand(parsed.ageBand)
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
      localStorage.setItem('gc_starter_progress', JSON.stringify({ step, ageBand, picks, feeling, timeCommitment }))
    } catch {}
  }, [restored, step, ageBand, picks, feeling, timeCommitment])

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
    // straight to the pathway. Update the lead with the full answer set.
    captureLead({ ageBand, concerns: picks, challenge, feeling, timeCommitment: t })
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
    setEmailError('')
    setSavingEmail(true)
    try { localStorage.setItem('gc_starter_name', name.trim()) } catch {}
    await captureLead({})
    setSavingEmail(false)
    setStep('q1')
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
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
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
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '26px', lineHeight: 1.6 }}>
              Your child&apos;s pathway is saved{email ? <> to <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{email}</span></> : ''}. Pick up where you left off.
            </p>
            <button
              onClick={() => setStep('result')}
              style={{ width: '100%', padding: '17px 28px', borderRadius: 16, border: 'none', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15, cursor: 'pointer', boxShadow: '0 5px 0 var(--terracotta-dark)' }}
            >
              See my pathway
            </button>
            <Link
              href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              style={{ display: 'block', marginTop: '14px', textAlign: 'center', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px', color: 'var(--ink)' }}
            >
              Sign in to my account
            </Link>
            <button onClick={() => { setReturning(false); setStep('details') }} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
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
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '30px', lineHeight: 1.6, textAlign: 'center' }}>
              Four quick questions. Two minutes. Free.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
              {[
                { n: '1', title: 'Tell us about your child', sub: 'Their age and the screen struggle you are facing right now' },
                { n: '2', title: 'We build their pathway', sub: 'Matched to their exact stage, from first screens to 16' },
                { n: '3', title: 'Your starter pack arrives tonight', sub: 'The exact words for tonight, free, straight to your inbox' },
              ].map(item => (
                <div key={item.n} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '16px 18px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>{item.n}</div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', color: 'var(--ink)' }}>{item.title}</div>
                    <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '2px', lineHeight: 1.5 }}>{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('details')}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '17px' }}
            >
              Start, it is free
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.06em' }}>
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
              First, a little about you
            </h1>
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.6, textAlign: 'center' }}>
              So everything is personal and your pathway is here whenever you come back.
            </p>

            <input
              className="input"
              type="text"
              autoComplete="given-name"
              placeholder="Your first name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ fontSize: 17, marginBottom: '12px' }}
            />
            <input
              className="input"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => { setEmail(e.target.value); if (emailError) setEmailError('') }}
              onKeyDown={e => { if (e.key === 'Enter') submitDetails() }}
              style={{ fontSize: 17, marginBottom: emailError ? '10px' : '16px' }}
            />
            {emailError && (
              <p style={{ color: 'var(--terracotta-dark)', fontSize: '13px', textAlign: 'center', marginBottom: '14px', lineHeight: 1.5 }}>
                {emailError}
              </p>
            )}

            <button
              onClick={submitDetails}
              disabled={savingEmail}
              className="btn btn-gold"
              style={{ width: '100%', justifyContent: 'center', fontSize: '15px', padding: '17px', opacity: savingEmail ? 0.7 : 1 }}
            >
              {savingEmail ? 'One moment...' : 'Continue'}
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              No card. We save your pathway and email the occasional genuinely useful thing. Unsubscribe any time.
            </p>
            <button onClick={() => setStep('intro')} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
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
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2D5016', fontSize: '12px', fontWeight: 800,
                  }}>✓</span>
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--ink)' }}>{row.t}</span>
                </div>
              ))}
            </div>
            {/* Honest reassurance, no invented numbers: this really is the
                thing parents raise most about growing up today. */}
            <p style={{ color: 'var(--ink-soft)', fontSize: '13.5px', lineHeight: 1.6, maxWidth: '360px', margin: '0 auto' }}>
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
            <p style={{ color: 'var(--ink)', fontSize: '15px', marginBottom: '20px', lineHeight: 1.55 }}>
              Their first name and age, so everything that follows is about them. This maps your stage.
            </p>
            <input
              className="input"
              type="text"
              autoComplete="off"
              placeholder="Your child's first name"
              value={childName}
              onChange={e => { setChildName(e.target.value); try { localStorage.setItem('gc_starter_child_name', e.target.value.trim()) } catch {} }}
              style={{ fontSize: 17, marginBottom: '22px' }}
            />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
              How old are they?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {AGE_BAND_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectAge(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: ageBand === opt.value ? 'var(--terracotta)' : 'var(--cream)',
                    border: `1.5px solid ${ageBand === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    boxShadow: ageBand === opt.value ? '0 5px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: ageBand === opt.value ? '#fff' : 'var(--ink)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: ageBand === opt.value ? 'rgba(255,255,255,0.75)' : 'var(--ink-muted)', marginTop: '3px', letterSpacing: '0.08em' }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{ color: ageBand === opt.value ? '#fff' : 'var(--ink-light)', fontSize: '16px' }}>→</div>
                </button>
              ))}
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
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '24px', lineHeight: 1.55 }}>
              Tick everything that is going on. Tap the one that worries you most first, that is where we begin. You can change focus any time.
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
                      width: 46, height: 46, borderRadius: '14px',
                      background: tint.bg, color: tint.fg, marginBottom: '12px',
                    }}>
                      {CHALLENGE_ICONS[opt.value] ?? opt.icon}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.3 }}>
                      {opt.label}
                    </span>

                    {/* Most pressing marker, and a way to move it */}
                    {isPrimary ? (
                      <span style={{
                        marginTop: '10px',
                        fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)',
                        borderRadius: '100px', padding: '4px 9px',
                      }}>
                        We start here
                      </span>
                    ) : sel ? (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={e => { e.stopPropagation(); makePrimary(opt.value) }}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); makePrimary(opt.value) } }}
                        style={{
                          marginTop: '10px',
                          fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: 'var(--ink-muted)', border: '1px solid var(--border)',
                          borderRadius: '100px', padding: '4px 9px', cursor: 'pointer',
                        }}
                      >
                        Start here instead
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
              <p style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
                This is the hardest part of parenting right now, and how you are doing matters as much as how they are. We have got you, not just your child.
              </p>
            </div>

            <button
              onClick={() => picks.length > 0 && setStep('q4')}
              disabled={picks.length === 0}
              style={{
                marginTop: '24px', width: '100%',
                padding: '17px 28px', borderRadius: 16, border: 'none',
                background: picks.length ? 'var(--terracotta)' : 'var(--border)',
                color: picks.length ? 'var(--ink)' : 'var(--ink-muted)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                cursor: picks.length ? 'pointer' : 'not-allowed',
                boxShadow: picks.length ? '0 5px 0 var(--terracotta-dark)' : 'none',
                transition: 'background 0.16s, box-shadow 0.16s',
              }}
            >
              {picks.length === 0 ? 'Tick at least one' : picks.length === 1 ? 'Continue' : `Continue with ${picks.length}`}
            </button>
            <button onClick={() => setStep('q1')} style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
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
            <p style={{ color: 'var(--ink)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.55 }}>
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
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: feeling === opt.value ? '#fff' : 'var(--ink)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: feeling === opt.value ? 'rgba(255,255,255,0.75)' : 'var(--ink-muted)', marginTop: '3px', letterSpacing: '0.08em' }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{ color: feeling === opt.value ? '#fff' : 'var(--ink-light)', fontSize: '16px' }}>→</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('q2')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
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
            <p style={{ color: 'var(--ink)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.55 }}>
              We will match your daily practice to this. You can change it any time.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {TIME_COMMITMENT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectTimeCommitment(opt.value)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: timeCommitment === opt.value ? 'var(--terracotta)' : 'var(--cream)',
                    border: `1.5px solid ${timeCommitment === opt.value ? 'var(--terracotta)' : 'var(--border)'}`,
                    borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                    boxShadow: timeCommitment === opt.value ? '0 5px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: timeCommitment === opt.value ? '#fff' : 'var(--ink)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: timeCommitment === opt.value ? 'rgba(255,255,255,0.75)' : 'var(--ink-muted)', marginTop: '3px', letterSpacing: '0.08em' }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{ color: timeCommitment === opt.value ? '#fff' : 'var(--ink-light)', fontSize: '16px' }}>→</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('q2')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
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
            <p style={{ color: 'var(--ink-soft)', fontSize: '15px', marginBottom: '26px', lineHeight: 1.6, textAlign: 'center' }}>
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
              style={{ fontSize: 17, textAlign: 'center', marginBottom: emailError ? '10px' : '16px' }}
            />
            {emailError && (
              <p style={{ color: 'var(--terracotta-dark)', fontSize: '13px', textAlign: 'center', marginBottom: '14px', lineHeight: 1.5 }}>
                {emailError}
              </p>
            )}

            <button
              onClick={submitEmail}
              disabled={savingEmail}
              style={{
                width: '100%', padding: '17px 28px', borderRadius: 16, border: 'none',
                background: 'var(--terracotta)', color: 'var(--ink)',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15,
                cursor: savingEmail ? 'default' : 'pointer', opacity: savingEmail ? 0.7 : 1,
                boxShadow: '0 5px 0 var(--terracotta-dark)',
              }}
            >
              {savingEmail ? 'Starting your pathway...' : 'Start your digital pathway'}
            </button>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', textAlign: 'center', marginTop: '14px', letterSpacing: '0.05em', lineHeight: 1.6 }}>
              No card. We email the starter pack and the occasional genuinely useful thing. Unsubscribe any time.
            </p>
            <button onClick={() => setStep('q4')} style={{ marginTop: '10px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0' }}>
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
  fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'var(--ink-muted)', marginBottom: '10px',
}

const RESULT_H2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
  fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)',
  lineHeight: 1.18, marginBottom: '10px',
}

const FEATURES: { title: string; body: string; comingSoon?: boolean; lessons?: boolean; icon: React.ReactNode }[] = [
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

function ResultScreen({
  stage, accent, challenge, feeling, email,
}: {
  stage: ReturnType<typeof getStageFromAgeBand>
  accent: { bold: string; text: string }
  challenge: ChallengeId
  feeling: FeelingId
  email?: string
}) {
  // Carry the captured email into signup so the account is created against the
  // same address the pathway was saved to, landing them in the right place.
  const signupHref = email ? `/signup?email=${encodeURIComponent(email)}` : '/signup'
  const challengeAction = stage.challengeActions[challenge] ?? stage.action
  const challengeLabel = CHALLENGE_OPTIONS.find(c => c.value === challenge)?.label ?? 'what you told us'

  const rootRef = useRef<HTMLDivElement>(null)
  const weekPathRef = useRef<HTMLDivElement>(null)
  const weekDigiRef = useRef<HTMLDivElement>(null)
  const pathwayRef = useRef<HTMLDivElement>(null)
  const pathwayDigiRef = useRef<HTMLDivElement>(null)

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

      {/* Stage accent strip at top */}
      <div style={{ height: '5px', background: accent.bold }} />

      <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 24px 0' }}>

        {/* Straight to the platform: first timers get the guided reveal below,
            but anyone who does not want to scroll can step in right now. */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
          <Link href={signupHref} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700,
            letterSpacing: '0.05em', color: 'var(--deep-teal)', textDecoration: 'none',
            border: '1.5px solid var(--border)', borderRadius: '100px', padding: '8px 15px', background: '#fff',
          }}>
            Skip the tour, take me straight in →
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

        {/* ── Beat 1: reassure and name it ─────────────────────── */}
        <div className="wow-fu" style={RESULT_EYEBROW}>Your pathway</div>
        <h1 className="wow-fu" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '16px' }}>
          Here is where your family is.
        </h1>

        <p className="wow-fu" style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '28px' }}>
          Whatever age your child is now, this is how we keep them safe: the exact words for tonight, a daily fix for the moment that keeps coming back, and a clear pathway from their first screen to full independence at 16.
        </p>

        {/* Problem recognition. Names what they told us before offering the fix. */}
        <div className="wow-fu" style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 32px rgba(26,26,46,0.10)', marginBottom: '14px' }}>
          <div style={{ background: 'var(--deep-teal)', padding: '18px 22px 22px', borderRadius: '0 0 28px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
              Sound familiar?
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {challengeLabel}
            </div>
          </div>
          <div style={{ padding: '18px 22px', background: 'var(--terracotta-lt)' }}>
            <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, margin: 0 }}>
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
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              background: accent.bold, color: accent.text,
              padding: '4px 10px', borderRadius: '100px',
            }}>
              Stage {stage.id} · {stage.name}
            </span>
            {stage.isCritical && (
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                background: 'var(--deep-teal)', color: '#fff',
                padding: '3px 8px', borderRadius: '100px',
              }}>
                Critical window
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', marginBottom: '3px' }}>
            {stage.keyStage} · {stage.yearGroup}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '2px' }}>{stage.ages}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-light)', marginBottom: '12px' }}>{stage.usGrade}</div>
          <div style={{ fontSize: '14px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '12px' }}>{stage.focus}</div>
          <div style={{ padding: '10px 14px', background: 'var(--terracotta-lt)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>
            Recommended: {stage.device}
          </div>
        </div>

        {/* ── Beat 2: your first week with us ──────────────────── */}
        <section style={{ marginTop: 'clamp(64px, 10vw, 96px)' }}>
          <div className="wow-fu" style={RESULT_EYEBROW}>Your first week</div>
          <h2 className="wow-fu" style={RESULT_H2}>Here is how week one goes.</h2>
          <p className="wow-fu" style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '24px' }}>
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
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '6px' }}>
                    {day.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15.5px', color: 'var(--ink)', marginBottom: '5px', letterSpacing: '-0.01em' }}>
                    {day.title}
                  </div>
                  <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
                    {day.body}
                  </p>
                  {day.script && (
                    <div style={{ marginTop: '12px', background: '#fff', border: '1px solid var(--border)', borderRadius: '12px', padding: '13px 15px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
                        The exact script
                      </div>
                      <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>
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
        <section style={{ marginTop: 'clamp(64px, 10vw, 96px)' }}>
          <div className="wow-fu" style={RESULT_EYEBROW}>What you get</div>
          <h2 className="wow-fu" style={RESULT_H2}>Everything waiting inside.</h2>
          <p className="wow-fu" style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
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
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14.5px', color: 'var(--ink)', letterSpacing: '-0.01em' }}>
                        {f.title}
                      </span>
                      {f.comingSoon && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          background: 'var(--deep-teal)', color: '#fff',
                          padding: '3px 8px', borderRadius: '100px',
                        }}>
                          Coming soon
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
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
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px', whiteSpace: 'nowrap' }}>
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
        </section>

        {/* ── Beat 4: the pathway simulation ───────────────────── */}
        <section style={{ marginTop: 'clamp(64px, 10vw, 96px)' }}>
          <div className="wow-fu" style={RESULT_EYEBROW}>The road ahead</div>
          <h2 className="wow-fu" style={RESULT_H2}>One pathway, ages 4 to 16.</h2>
          <p className="wow-fu" style={{ fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.65, marginBottom: '20px' }}>
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
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '11px',
                        color: 'var(--ink-light)', position: 'relative', zIndex: 1,
                        boxShadow: isCurrent ? `0 0 0 3px ${accent.bold}` : 'none',
                      }}>
                        {s.id}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
                          {s.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-soft)' }}>
                          {ages}
                        </div>
                        {isCurrent && (
                          <div style={{
                            display: 'inline-block', marginTop: '4px',
                            fontFamily: 'var(--font-mono)', fontSize: '7.5px', fontWeight: 700,
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
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
            {stage.parentQuote}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '8px', letterSpacing: '0.04em' }}>
            Parent, Stage {stage.id}
          </p>
        </div>

        {/* ── Beat 5: save CTA, the one primary CTA on the page ── */}
        <div className="wow-fu" style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '40px 28px', textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '14px' }}>
            Free to start
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Save your child&apos;s pathway
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: '14px', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 24px' }}>
            Create your free account and your Stage {stage.id} pathway is saved. No card required.
          </p>
          <Link
            href={signupHref}
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '16px 36px', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: '16px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16px',
              letterSpacing: '-0.01em',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            Start your digital pathway, it is free
          </Link>
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--terracotta)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        {/* Free includes */}
        <div className="wow-fu" style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            Free account includes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
            {[
              'Your stage pathway, saved and ready',
              'Daily moments with the exact words',
              '3 DiGi conversations a day',
              '5 free scripts to start with',
              'The wellbeing tracker',
              'Device setting checklists',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--terracotta-dark)', fontSize: '14px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
