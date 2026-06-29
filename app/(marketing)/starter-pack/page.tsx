'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  STAGES,
  AGE_BAND_OPTIONS,
  CHALLENGE_OPTIONS,
  FEELING_OPTIONS,
  getStageFromAgeBand,
  type AgeBand,
  type ChallengeId,
  type FeelingId,
  type StarterAnswers,
} from '@/lib/content/stages'

type Step = 'q1' | 'q2' | 'q3' | 'result'

const STAGE_COLORS: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: 'var(--stage-1)', text: 'var(--ink)', border: 'var(--stage-1)' },
  2: { bg: 'var(--stage-2)', text: 'var(--ink)', border: 'var(--stage-2)' },
  3: { bg: 'var(--stage-3)', text: 'var(--ink)', border: 'var(--stage-3)' },
  4: { bg: 'var(--stage-4)', text: 'var(--ink)', border: 'var(--stage-4)' },
  5: { bg: 'var(--stage-5)', text: 'var(--ink)', border: 'var(--stage-5)' },
}

export default function StarterPackPage() {
  const [step, setStep] = useState<Step>('q1')
  const [ageBand, setAgeBand] = useState<AgeBand | null>(null)
  const [challenge, setChallenge] = useState<ChallengeId | null>(null)
  const [feeling, setFeeling] = useState<FeelingId | null>(null)
  const [saved, setSaved] = useState(false)

  const stage = ageBand ? getStageFromAgeBand(ageBand) : null
  const stageColor = stage ? STAGE_COLORS[stage.id] : null

  useEffect(() => {
    if (step === 'result' && ageBand && challenge && feeling) {
      const answers: StarterAnswers = { ageBand, challenge, feeling }
      try {
        localStorage.setItem('gc_starter_answers', JSON.stringify(answers))
        setSaved(true)
      } catch {}
    }
  }, [step, ageBand, challenge, feeling])

  function selectAge(band: AgeBand) {
    setAgeBand(band)
    setTimeout(() => setStep('q2'), 300)
  }

  function selectChallenge(c: ChallengeId) {
    setChallenge(c)
    setTimeout(() => setStep('q3'), 300)
  }

  function selectFeeling(f: FeelingId) {
    setFeeling(f)
    setTimeout(() => setStep('result'), 300)
  }

  const progress = step === 'q1' ? 1 : step === 'q2' ? 2 : step === 'q3' ? 3 : 3

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '0 0 80px' }}>
      {/* Top bar */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--cream)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', textDecoration: 'none' }}>
            Guided Childhood
          </Link>
          {step !== 'result' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
              STEP {progress} OF 3
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px 0' }}>

        {/* Q1 — Age Band */}
        {step === 'q1' && (
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Your child</p>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '12px' }}>
              How old is your child?
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px', marginBottom: '32px' }}>
              This sets your stage and personalises everything that follows.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {AGE_BAND_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectAge(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 22px',
                    background: ageBand === opt.value ? 'var(--stage-5)' : 'var(--cream)',
                    border: `2px solid ${ageBand === opt.value ? 'var(--stage-5)' : 'var(--border)'}`,
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: ageBand === opt.value ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: 'var(--ink)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '4px', letterSpacing: '0.08em' }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{ color: 'var(--ink-light)', fontSize: '20px' }}>→</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q2 — Main Challenge */}
        {step === 'q2' && (
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>The challenge</p>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '12px' }}>
              What is your main concern right now?
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px', marginBottom: '32px' }}>
              Pick the one that feels most urgent. We will address it directly.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {CHALLENGE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectChallenge(opt.value)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '18px 16px',
                    background: challenge === opt.value ? 'var(--stage-5)' : 'var(--cream)',
                    border: `2px solid ${challenge === opt.value ? 'var(--stage-5)' : 'var(--border)'}`,
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: challenge === opt.value ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  <span style={{ fontSize: '24px', marginBottom: '10px' }}>{opt.icon}</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '14px', color: 'var(--ink)', lineHeight: 1.3 }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('q1')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)' }}>
              ← Back
            </button>
          </div>
        )}

        {/* Q3 — How Feeling */}
        {step === 'q3' && (
          <div>
            <p className="eyebrow" style={{ marginBottom: '16px' }}>Right now</p>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '12px' }}>
              How are you feeling about it?
            </h1>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px', marginBottom: '32px' }}>
              There is no wrong answer. This shapes how we frame what comes next.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FEELING_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => selectFeeling(opt.value)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 22px',
                    background: feeling === opt.value ? 'var(--stage-5)' : 'var(--cream)',
                    border: `2px solid ${feeling === opt.value ? 'var(--stage-5)' : 'var(--border)'}`,
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    boxShadow: feeling === opt.value ? '0 3px 0 var(--terracotta-dark)' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: 'var(--ink)' }}>
                      {opt.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', marginTop: '4px', letterSpacing: '0.08em' }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{ color: 'var(--ink-light)', fontSize: '20px' }}>→</div>
                </button>
              ))}
            </div>
            <button onClick={() => setStep('q2')} style={{ marginTop: '24px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--ink-muted)' }}>
              ← Back
            </button>
          </div>
        )}

        {/* Result screen */}
        {step === 'result' && stage && stageColor && ageBand && challenge && (
          <ResultScreen
            stage={stage}
            stageColor={stageColor}
            challenge={challenge}
            feeling={feeling!}
          />
        )}
      </div>
    </div>
  )
}

function ResultScreen({
  stage,
  stageColor,
  challenge,
  feeling,
}: {
  stage: ReturnType<typeof getStageFromAgeBand>
  stageColor: { bg: string; text: string; border: string }
  challenge: ChallengeId
  feeling: FeelingId
}) {
  const challengeAction = stage.challengeActions[challenge] ?? stage.action
  const challengeLabel = CHALLENGE_OPTIONS.find(c => c.value === challenge)?.label ?? ''

  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: '16px', color: 'var(--terracotta)' }}>Your pathway</p>
      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', marginBottom: '8px' }}>
        Here is where your family is.
      </h1>
      <p style={{ color: 'var(--ink-muted)', fontSize: '15px', marginBottom: '32px' }}>
        Based on your answers, we have mapped your starting point.
      </p>

      {/* Stage card */}
      <div style={{
        background: stageColor.bg,
        border: `2px solid ${stageColor.border}`,
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        ...(stage.isCritical ? { borderLeftWidth: '5px' } : {}),
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: stageColor.text,
            color: stageColor.bg,
            padding: '4px 10px',
            borderRadius: '100px',
          }}>
            Stage {stage.id} · {stage.name}
          </span>
          {stage.isCritical && (
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              background: 'var(--terracotta)',
              color: '#fff',
              padding: '3px 8px',
              borderRadius: '100px',
            }}>
              Critical Window
            </span>
          )}
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '20px', color: 'var(--ink)', marginBottom: '4px' }}>
          {stage.keyStage} · {stage.yearGroup}
        </div>
        <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '2px' }}>{stage.ages}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-light)', marginBottom: '14px' }}>{stage.usGrade}</div>
        <div style={{ fontSize: '14px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>{stage.focus}</div>
        <div style={{ marginTop: '10px', padding: '10px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-soft)' }}>
          Recommended: {stage.device}
        </div>
      </div>

      {/* Action for tonight */}
      <div style={{
        background: 'var(--stage-5)',
        border: '2px solid var(--stage-5)',
        borderRadius: '14px',
        padding: '20px 22px',
        marginBottom: '20px',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '10px' }}>
          One thing for tonight
        </div>
        <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6 }}>
          {challengeAction}
        </p>
      </div>

      {/* Script block */}
      <div style={{
        background: 'var(--cream)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '20px 22px',
        marginBottom: '20px',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
          Script: {stage.script.title}
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Say this
          </div>
          <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.6, fontStyle: 'italic' }}>
            "{stage.script.sayThis}"
          </p>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Not this
          </div>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
            {stage.script.notThis}
          </p>
        </div>

        <div style={{ padding: '12px 14px', background: 'var(--stage-2)', borderRadius: '10px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--terracotta)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Why it works
          </div>
          <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
            {stage.script.why}
          </p>
        </div>
      </div>

      {/* Warning signs */}
      <div style={{
        background: 'var(--cream)',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        padding: '20px 22px',
        marginBottom: '32px',
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '12px' }}>
          Watch for these signs
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {stage.warningSigns.map((sign, i) => (
            <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--terracotta)', fontSize: '14px', marginTop: '2px', flexShrink: 0 }}>•</span>
              <span style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>{sign}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Parent quote */}
      <div style={{ padding: '20px 22px', borderLeft: '3px solid var(--terracotta)', marginBottom: '32px' }}>
        <p style={{ fontSize: '15px', color: 'var(--ink-soft)', fontStyle: 'italic', lineHeight: 1.7 }}>
          {stage.parentQuote}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-light)', marginTop: '8px' }}>
          — Parent, Stage {stage.id}
        </p>
      </div>

      {/* CTA */}
      <div style={{
        background: 'var(--ink)',
        borderRadius: '20px',
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '14px' }}>Free to start</p>
        <h2 style={{ fontSize: '1.5rem', color: '#fff', marginBottom: '12px', fontWeight: 800 }}>
          Save your child's pathway
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
          Create your free account and your Stage {stage.id} pathway is saved, ready to go. No card required.
        </p>
        <Link
          href="/signup"
          className="btn btn-gold"
          style={{ display: 'inline-flex', fontSize: '14px', padding: '16px 36px' }}
        >
          Save my pathway — it is free
        </Link>
        <p style={{ marginTop: '14px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>

      {/* What you get */}
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '16px' }}>
          Free account includes
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px', margin: '0 auto', textAlign: 'left' }}>
          {[
            'Your Stage card, saved and ready',
            '3 DiGi conversations per day',
            '3 conversation scripts',
            'Stage 1 curriculum access',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ color: 'var(--terracotta)', fontSize: '14px' }}>✓</span>
              <span style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
