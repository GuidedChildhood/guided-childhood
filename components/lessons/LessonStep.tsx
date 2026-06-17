import type { LessonCharacter } from './CharacterIntro'

const CHARACTER_EMOJI: Record<LessonCharacter, string> = {
  teo: '⚽',
  olga: '🔍',
  alam: '🛡️',
  'digi-junior': '🤖',
}

const CHARACTER_COLOR: Record<LessonCharacter, string> = {
  teo: 'var(--coral)',
  olga: 'var(--gold-dark)',
  alam: 'var(--green-dark)',
  'digi-junior': 'var(--green-dark)',
}

const CHARACTER_COLOR_LIGHT: Record<LessonCharacter, string> = {
  teo: 'var(--coral-lt)',
  olga: 'var(--gold-lt)',
  alam: 'var(--green-lt)',
  'digi-junior': 'var(--green-lt)',
}

const CHARACTER_NAME: Record<LessonCharacter, string> = {
  teo: 'Teo',
  olga: 'Olga',
  alam: 'Alam',
  'digi-junior': 'DiGi Junior',
}

export type StepType = 'think' | 'learn' | 'discover' | 'challenge' | 'mission'

const STEP_LABELS: Record<StepType, { icon: string; label: string }> = {
  think: { icon: '💭', label: 'Think about it' },
  learn: { icon: '📚', label: 'Did you know' },
  discover: { icon: '✨', label: 'Discover' },
  challenge: { icon: '🎯', label: 'Your challenge' },
  mission: { icon: '🚀', label: 'Your mission this week' },
}

interface LessonStepProps {
  type: StepType
  character: LessonCharacter
  heading: string
  body: string
  characterSays?: string
  funFact?: string
  stepNumber: number
}

export default function LessonStep({
  type,
  character,
  heading,
  body,
  characterSays,
  funFact,
  stepNumber,
}: LessonStepProps) {
  const emoji = CHARACTER_EMOJI[character]
  const color = CHARACTER_COLOR[character]
  const colorLight = CHARACTER_COLOR_LIGHT[character]
  const name = CHARACTER_NAME[character]
  const step = STEP_LABELS[type]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Step header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: colorLight, border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color, flexShrink: 0 }}>
          {stepNumber}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>{step.icon}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{step.label}</span>
        </div>
      </div>

      {/* Main content card */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', borderTop: `4px solid ${color}` }}>
        <div style={{ padding: '24px 28px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--ink)' }}>{heading}</h3>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '.95rem', margin: 0 }}>{body}</p>
        </div>

        {/* Character says */}
        {characterSays && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '18px 28px', background: colorLight, display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0, boxShadow: `0 4px 12px ${color}44` }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color, marginBottom: '6px' }}>{name} says</div>
              <p style={{ fontSize: '.9rem', lineHeight: 1.6, color: 'var(--ink)', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
                &ldquo;{characterSays}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Fun fact */}
        {funFact && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '16px 28px', background: 'var(--warm)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>🧠</span>
            <p style={{ fontSize: '.85rem', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Brain fact: </strong>{funFact}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
