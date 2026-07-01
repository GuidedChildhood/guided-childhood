'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
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

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '0 0 80px' }}>
      {/* Stage accent strip at top */}
      <div style={{ height: '5px', background: accent.bold }} />

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '32px 24px 0' }}>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
          Your pathway
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--ink)', lineHeight: 1.15, marginBottom: '16px' }}>
          Here is where your family is.
        </h1>

        {/* Mission statement */}
        <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.7, marginBottom: '28px' }}>
          Whatever age your child is now, this is how we keep them safe: the exact words for tonight, a daily fix for the moment that keeps coming back, and a clear pathway from their first screen to full independence at 16.
        </p>

        {/* Problem recognition — names what they told us before offering the fix */}
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 32px rgba(26,26,46,0.10)', marginBottom: '14px' }}>
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
        <div style={{
          background: '#fff', borderRadius: '16px',
          borderTop: `4px solid ${accent.bold}`,
          border: '1px solid var(--border)',
          borderTopWidth: '4px', borderTopColor: accent.bold,
          padding: '22px', marginBottom: '14px',
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
          <div style={{ padding: '10px 14px', background: 'var(--terracotta-lt)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.04em' }}>
            Recommended: {stage.device}
          </div>
        </div>

        {/* Tonight — Good Inside style curved card */}
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 32px rgba(26,26,46,0.10)', marginBottom: '14px' }}>
          <div style={{ background: 'var(--terracotta)', padding: '18px 22px 22px', borderRadius: '0 0 28px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', marginBottom: '6px' }}>
              Your fix for tonight
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              One thing to try
            </div>
          </div>
          <div style={{ padding: '20px 22px', background: 'var(--terracotta-lt)' }}>
            <p style={{ fontSize: 'clamp(15px, 3.5vw, 17px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: 0, letterSpacing: '-0.01em' }}>
              {challengeAction}
            </p>
          </div>
        </div>

        {/* Script — Good Inside style curved card */}
        <div style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 32px rgba(26,26,46,0.10)', marginBottom: '14px' }}>
          <div style={{ background: 'var(--deep-teal)', padding: '18px 22px 22px', borderRadius: '0 0 28px 28px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
              The full script
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              {stage.script.title}
            </div>
          </div>
          <div style={{ padding: '20px 22px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Say this</div>
              <p style={{ fontSize: 'clamp(15px, 3.5vw, 17px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.55, margin: 0, letterSpacing: '-0.01em' }}>"{stage.script.sayThis}"</p>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--danger)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Not this</div>
              <p style={{ fontSize: '14px', color: 'var(--danger)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>{stage.script.notThis}</p>
            </div>
            <div style={{ padding: '14px 16px', background: 'var(--terracotta-lt)', borderRadius: '12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Why it works</div>
              <p style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>{stage.script.why}</p>
            </div>
          </div>
        </div>

        {/* Watch for */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '14px', boxShadow: '0 2px 12px rgba(26,26,46,0.05)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
            Watch for these signs
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stage.warningSigns.map((sign, i) => (
              <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ color: 'var(--terracotta)', fontSize: '14px', marginTop: '2px', flexShrink: 0 }}>•</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>{sign}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mini pathway — every stage, current one marked */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '22px', marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '18px' }}>
            Every stage is covered, ages 4 to 16
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ position: 'absolute', left: '16px', right: '16px', top: '50%', height: '3px', background: 'var(--border)', transform: 'translateY(-50%)', zIndex: 0 }} />
            <div style={{
              position: 'absolute', left: '16px', top: '50%', height: '3px',
              width: `calc((100% - 32px) * ${(stage.id - 1) / 4})`,
              background: 'var(--terracotta)', transform: 'translateY(-50%)', zIndex: 1,
            }} />
            {[1, 2, 3, 4, 5].map(num => {
              const done = num < stage.id
              const isCurrent = num === stage.id
              return (
                <div key={num} style={{
                  position: 'relative', zIndex: 2,
                  width: isCurrent ? '34px' : '26px', height: isCurrent ? '34px' : '26px',
                  borderRadius: '50%',
                  background: done || isCurrent ? 'var(--terracotta)' : '#fff',
                  border: done || isCurrent ? 'none' : '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: done || isCurrent ? '#fff' : 'var(--ink-light)',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: isCurrent ? '13px' : '11px',
                  boxShadow: isCurrent ? '0 3px 0 var(--terracotta-dark)' : 'none',
                }}>
                  {done ? '✓' : num}
                </div>
              )
            })}
          </div>
          <Link href="/pathway" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--terracotta)', letterSpacing: '0.06em', textDecoration: 'none' }}>
            See what every stage covers →
          </Link>
        </div>

        {/* Parent quote */}
        <div style={{ padding: '18px 22px', borderLeft: '3px solid var(--terracotta)', background: 'var(--terracotta-lt)', borderRadius: '0 12px 12px 0', marginBottom: '32px' }}>
          <p style={{ fontSize: '15px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
            {stage.parentQuote}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--terracotta)', marginTop: '8px', letterSpacing: '0.04em' }}>
            Parent, Stage {stage.id}
          </p>
        </div>

        {/* Primary CTA */}
        <div style={{ background: 'var(--deep-teal)', borderRadius: '20px', padding: '32px 24px', textAlign: 'center', marginBottom: '12px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '14px' }}>
            Free to start
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Save your child's pathway
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '14px', lineHeight: 1.6, maxWidth: '340px', margin: '0 auto 24px' }}>
            Create your free account and your Stage {stage.id} pathway is saved. No card required.
          </p>
          <Link
            href="/signup"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '16px 36px', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: '16px', textDecoration: 'none',
              fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '13px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            Save my pathway. It is free.
          </Link>
          <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.32)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--terracotta)', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>

        {/* Founder CTA */}
        <div style={{ border: '1px solid var(--border)', borderRadius: '20px', padding: '24px', textAlign: 'center', marginBottom: '16px', background: '#fff' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '10px' }}>
            Founding members · 50 places
          </div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: 'var(--ink)', fontWeight: 700, marginBottom: '6px' }}>
            Ready to unlock everything?
          </p>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.6, marginBottom: '18px' }}>
            £7.99 a month for life. All 5 stages, unlimited DiGi, every script.
          </p>
          <Link
            href="/signup?intent=founder"
            style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '13px 28px', background: 'var(--terracotta)',
              color: 'var(--ink)', borderRadius: '16px', textDecoration: 'none',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '14px',
              boxShadow: '0 5px 0 var(--terracotta-dark)',
            }}
          >
            Join as a founding member
          </Link>
        </div>

        {/* Free includes */}
        <div style={{ padding: '24px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '16px' }}>
            Free account includes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto', textAlign: 'left' }}>
            {[
              'Your Stage card, saved and ready',
              '3 DiGi conversations per day',
              '3 conversation scripts',
              'Stage 1 curriculum access',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ color: 'var(--terracotta)', fontSize: '14px', flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
