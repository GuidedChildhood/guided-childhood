'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import DigiCharacter from '@/components/digi/DigiCharacter'
import {
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

type Step = 'q1' | 'q2' | 'q3' | 'q4' | 'result'

const CHALLENGE_ICONS: Record<string, React.ReactNode> = {
  screens_takeover: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2.5"/>
      <circle cx="12" cy="18" r=".6" fill="currentColor" stroke="none"/>
    </svg>
  ),
  mood_changes: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 15.5c.8-.8 1.4-1 3-1s2.2.2 3 1"/>
      <line x1="9.5" y1="10.5" x2="9.5" y2="10.5" strokeWidth="2.5"/>
      <line x1="14.5" y1="10.5" x2="14.5" y2="10.5" strokeWidth="2.5"/>
    </svg>
  ),
  gaming: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10.5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5v-3z"/>
      <line x1="8" y1="11" x2="8" y2="13"/>
      <line x1="7" y1="12" x2="9" y2="12"/>
      <line x1="15.5" y1="11.5" x2="16.5" y2="11.5"/>
      <line x1="15.5" y1="12.5" x2="16.5" y2="12.5"/>
    </svg>
  ),
  online_safety: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l7 3v5c0 5-3.5 9-7 10C8.5 19 5 15 5 10V5l7-3z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  start_conversation: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      <line x1="9" y1="10" x2="15" y2="10"/>
      <line x1="9" y1="13" x2="13" y2="13"/>
    </svg>
  ),
  asking_for_phone: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="2" width="10" height="20" rx="2.5"/>
      <path d="M12 7v2m0 2v.5"/>
    </svg>
  ),
}

const STAGE_ACCENT: Record<number, { bold: string; text: string }> = {
  1: { bold: 'var(--stage-1-bold)', text: 'var(--stage-1-text)' },
  2: { bold: 'var(--stage-2-bold)', text: 'var(--stage-2-text)' },
  3: { bold: 'var(--stage-3-bold)', text: 'var(--stage-3-text)' },
  4: { bold: 'var(--stage-4-bold)', text: 'var(--stage-4-text)' },
  5: { bold: 'var(--stage-5-bold)', text: 'var(--stage-5-text)' },
}

export default function StarterPackPage() {
  const [step, setStep] = useState<Step>('q1')
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null)
  const [challenge, setChallenge] = useState<ChallengeId | null>(null)
  const [feeling, setFeeling] = useState<FeelingId | null>(null)
  const [timeCommitment, setTimeCommitment] = useState<TimeCommitmentId | null>(null)
  const [restored, setRestored] = useState(false)

  const stage = ageBand ? getStageFromAgeBand(ageBand) : null

  // Resume mid-quiz progress on refresh or return visit, instead of losing
  // everything and starting over at Q1.
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gc_starter_progress')
      if (saved) {
        const parsed = JSON.parse(saved) as { step: Step; ageBand: AgeBand | null; challenge: ChallengeId | null; feeling: FeelingId | null; timeCommitment: TimeCommitmentId | null }
        if (parsed.ageBand) setAgeBand(parsed.ageBand)
        if (parsed.challenge) setChallenge(parsed.challenge)
        if (parsed.feeling) setFeeling(parsed.feeling)
        if (parsed.timeCommitment) setTimeCommitment(parsed.timeCommitment)
        if (parsed.step && parsed.step !== 'result') setStep(parsed.step)
      }
    } catch {}
    setRestored(true)
  }, [])

  // Save progress after every answer, not just at the end, so a refresh or
  // an accidental close does not throw away answers already given.
  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem('gc_starter_progress', JSON.stringify({ step, ageBand, challenge, feeling, timeCommitment }))
    } catch {}
  }, [restored, step, ageBand, challenge, feeling, timeCommitment])

  useEffect(() => {
    if (step === 'result' && ageBand && challenge && feeling && timeCommitment) {
      const answers: StarterAnswers = { ageBand, challenge, feeling, timeCommitment }
      try {
        localStorage.setItem('gc_starter_answers', JSON.stringify(answers))
        localStorage.removeItem('gc_starter_progress')
      } catch {}
    }
  }, [step, ageBand, challenge, feeling, timeCommitment])

  function selectAge(band: AgeBand) {
    setAgeBand(band)
    setTimeout(() => setStep('q2'), 280)
  }
  function selectChallenge(c: ChallengeId) {
    setChallenge(c)
    setTimeout(() => setStep('q3'), 280)
  }
  function selectFeeling(f: FeelingId) {
    setFeeling(f)
    setTimeout(() => setStep('q4'), 280)
  }
  function selectTimeCommitment(t: TimeCommitmentId) {
    setTimeCommitment(t)
    setTimeout(() => setStep('result'), 280)
  }

  const progress = step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q3' ? 3 : 4

  if (step === 'result' && stage && ageBand && challenge) {
    return (
      <ResultScreen
        stage={stage}
        accent={STAGE_ACCENT[stage.id]}
        challenge={challenge}
        feeling={feeling!}
      />
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Thin progress bar at very top */}
      <div style={{ height: '4px', background: 'var(--border)', flexShrink: 0 }}>
        <div style={{
          height: '100%', background: 'var(--terracotta)',
          width: `${(progress / 4) * 100}%`, transition: 'width 0.35s ease',
        }} />
      </div>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '32px 24px 48px', maxWidth: '520px', margin: '0 auto', width: '100%',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-muted)', marginBottom: '36px',
        }}>
          Step {progress} of 4
        </div>

        {/* Q1 — Age */}
        {step === 'q1' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              How old is your child?
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.55 }}>
              This maps to your stage and personalises everything that follows.
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

        {/* Q2 — Challenge */}
        {step === 'q2' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15,
              color: 'var(--ink)', marginBottom: '10px',
            }}>
              What is your main concern right now?
            </h1>
            <p style={{ color: 'var(--ink)', fontSize: '15px', marginBottom: '32px', lineHeight: 1.55 }}>
              Pick the one that feels most urgent.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {CHALLENGE_OPTIONS.map(opt => {
                const sel = challenge === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => selectChallenge(opt.value)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                      padding: '16px 14px',
                      background: sel ? 'var(--terracotta)' : 'var(--cream)',
                      border: `1.5px solid ${sel ? 'var(--terracotta)' : 'var(--border)'}`,
                      borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      boxShadow: sel ? '0 5px 0 var(--terracotta-dark)' : 'none',
                    }}
                  >
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, borderRadius: '10px',
                      background: sel ? 'rgba(255,255,255,0.2)' : 'var(--stage-2)',
                      color: sel ? '#fff' : 'var(--terracotta)', marginBottom: '10px',
                    }}>
                      {CHALLENGE_ICONS[opt.value] ?? opt.icon}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '13px', color: sel ? '#fff' : 'var(--ink)', lineHeight: 1.3 }}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => setStep('q1')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}

        {/* Q3 — Feeling */}
        {step === 'q3' && (
          <>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem, 4.5vw, 2.4rem)',
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15,
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
              fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15,
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
            <button onClick={() => setStep('q3')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.06em', padding: '8px 0', textAlign: 'left' }}>
              ← Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function ResultScreen({
  stage, accent, challenge, feeling,
}: {
  stage: ReturnType<typeof getStageFromAgeBand>
  accent: { bold: string; text: string }
  challenge: ChallengeId
  feeling: FeelingId
}) {
  const challengeAction = stage.challengeActions[challenge] ?? stage.action
  const challengeLabel = CHALLENGE_OPTIONS.find(c => c.value === challenge)?.label ?? 'what you told us'
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.plan-step', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.18, ease: 'power2.out', delay: 0.2 })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // One plan, four steps, exactly what happens next. Duolingo clarity:
  // a single column, numbered nodes on a trail, DiGi narrating, one CTA.
  const steps: { label: string; title: string; body: React.ReactNode; digi: string }[] = [
    {
      label: 'Tonight',
      title: stage.script.title,
      digi: 'Say it warmly. Hold it the same way every night.',
      body: (
        <>
          <p style={{ fontSize: 'clamp(15px, 3.5vw, 17px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: '0 0 12px', letterSpacing: '-0.01em' }}>
            &ldquo;{stage.script.sayThis}&rdquo;
          </p>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--ink)' }}>Why it works: </strong>{stage.script.why}
          </p>
        </>
      ),
    },
    {
      label: 'Tomorrow',
      title: `Fix the thing you told us about`,
      digi: `${challengeLabel} is the most common Stage ${stage.id} battle. It has a clear fix.`,
      body: (
        <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
          {challengeAction}
        </p>
      ),
    },
    {
      label: 'Every day',
      title: 'Ten minutes, guided by DiGi',
      digi: 'I will watch for the patterns and tell you before they become fights.',
      body: (
        <>
          <p style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.65, margin: '0 0 10px' }}>
            A two minute daily deck, tonight&rsquo;s script picked for you, and DiGi keeping an eye on the two signs that matter most at this age:
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {stage.warningSigns.slice(0, 2).map((sign, i) => (
              <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--terracotta-dark)', fontSize: '13px', marginTop: '2px', flexShrink: 0 }}>&#9679;</span>
                <span style={{ fontSize: '13.5px', color: 'var(--ink)', lineHeight: 1.5 }}>{sign}</span>
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      label: 'The road to 16',
      title: `Stage ${stage.id} of 5. You never fall behind.`,
      digi: 'I walk the whole trail with you, from first screen to independence.',
      body: (
        <>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 12px' }}>
            <div style={{ position: 'absolute', left: '14px', right: '14px', top: '50%', height: '3px', background: 'var(--border)', transform: 'translateY(-50%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', left: '14px', top: '50%', height: '3px', width: `calc((100% - 28px) * ${(stage.id - 1) / 4})`, background: 'var(--terracotta)', transform: 'translateY(-50%)', zIndex: 1 }} />
            {[1, 2, 3, 4, 5].map(num => {
              const done = num < stage.id
              const isCurrent = num === stage.id
              return (
                <div key={num} style={{
                  position: 'relative', zIndex: 2,
                  width: isCurrent ? '32px' : '25px', height: isCurrent ? '32px' : '25px',
                  borderRadius: '50%',
                  background: done || isCurrent ? 'var(--terracotta)' : '#fff',
                  border: done || isCurrent ? 'none' : '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: done || isCurrent ? 'var(--ink)' : 'var(--ink-light)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isCurrent ? '13px' : '11px',
                  boxShadow: isCurrent ? '0 3px 0 var(--terracotta-dark)' : 'none',
                }}>
                  {done ? '\u2713' : num}
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
            {stage.focus.replace(/[.]?$/, '.')} Recommended for now: {stage.device.toLowerCase()}.
          </p>
        </>
      ),
    },
  ]

  return (
    <div ref={rootRef} style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '0 0 80px' }}>
      <div style={{ height: '5px', background: accent.bold }} />

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px 0' }}>

        {/* Header: DiGi hands over the plan */}
        <div className="plan-step" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '26px' }}>
          <div style={{ flexShrink: 0, marginTop: '4px' }}>
            <DigiCharacter mood="wave" size={54} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
              Your plan is ready
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '8px' }}>
              Here is your family&rsquo;s plan.
            </h1>
            <span style={{
              display: 'inline-flex', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              background: accent.bold, color: accent.text, padding: '4px 11px', borderRadius: '100px',
            }}>
              Stage {stage.id} &middot; {stage.name} &middot; {stage.ages}
            </span>
          </div>
        </div>

        {/* The four steps on a trail */}
        <div style={{ position: 'relative', paddingLeft: '44px', marginBottom: '30px' }}>
          <div style={{ position: 'absolute', left: '15px', top: '18px', bottom: '18px', width: '3px', borderLeft: '3px dotted var(--border)' }} />
          {steps.map((step, i) => (
            <div key={i} className="plan-step" style={{ position: 'relative', marginBottom: i < steps.length - 1 ? '22px' : 0 }}>
              <div style={{
                position: 'absolute', left: '-44px', top: '0px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--terracotta)', color: 'var(--ink)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                boxShadow: '0 3px 0 var(--terracotta-dark)', zIndex: 1,
              }}>
                {i + 1}
              </div>
              <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid var(--border)', boxShadow: '0 6px 24px rgba(26,26,46,0.07)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px 0' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '4px' }}>
                    {step.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '16.5px', color: 'var(--ink)', letterSpacing: '-0.01em', marginBottom: '10px', lineHeight: 1.25 }}>
                    {step.title}
                  </div>
                </div>
                <div style={{ padding: '0 20px 16px' }}>{step.body}</div>
                <div style={{ background: 'var(--terracotta-lt)', padding: '10px 20px', display: 'flex', gap: '9px', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', flexShrink: 0 }}>&#11088;</span>
                  <span style={{ fontSize: '12.5px', color: 'var(--ink)', fontWeight: 600, lineHeight: 1.45 }}>{step.digi}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* One CTA. Everything above is saved by it. */}
        <div className="plan-step" style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '32px 24px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', color: '#fff', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            Save this plan. It is free.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '14px', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 20px' }}>
            Your Stage {stage.id} pathway, tonight&rsquo;s script and DiGi, saved to a free account. No card needed.
          </p>
          <Link
            href="/signup"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '16px 36px', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: '16px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            Save my plan
          </Link>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '18px' }}>
            {['Tonight&rsquo;s script', '3 DiGi questions a day', 'Your stage saved'].map((item, i) => (
              <span key={i} style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.55)' }} dangerouslySetInnerHTML={{ __html: '&#10003; ' + item }} />
            ))}
          </div>
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--terracotta)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
