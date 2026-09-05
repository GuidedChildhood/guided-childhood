import type { LessonCharacter } from './CharacterIntro'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'

const CHARACTER_EMOJI: Record<LessonCharacter, string> = {
  teo: '⚽',
  olga: '🔍',
  alam: '🛡️',
  'digi-junior': '🤖',
}

const CHARACTER_COLOR: Record<LessonCharacter, string> = {
  teo: 'var(--terracotta)',
  olga: 'var(--terracotta-dark)',
  alam: 'var(--terracotta)',
  'digi-junior': 'var(--terracotta)',
}

const CHARACTER_COLOR_LIGHT: Record<LessonCharacter, string> = {
  teo: 'var(--stage-1)',
  olga: 'var(--stage-5)',
  alam: 'var(--stage-2)',
  'digi-junior': 'var(--stage-3)',
}

const CHARACTER_NAME: Record<LessonCharacter, string> = {
  teo: 'Teo',
  olga: 'Olga',
  alam: 'Alma',
  'digi-junior': 'DiGi Junior',
}

export type StepType = 'think' | 'learn' | 'discover' | 'challenge' | 'mission'

const STEP_LABELS: Record<StepType, { icon: HappyIconName; label: string }> = {
  think: { icon: 'ask', label: 'Think about it' },
  learn: { icon: 'read', label: 'Did you know' },
  discover: { icon: 'cheer', label: 'Discover' },
  challenge: { icon: 'flame', label: 'Your challenge' },
  mission: { icon: 'jobs', label: 'Your mission this week' },
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
          <span aria-hidden style={{ width: 32, height: 32, borderRadius: 9, background: '#fff', border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><HappyIcon name={step.icon} size={22} /></span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>{step.label}</span>
        </div>
      </div>

      {/* Main content card */}
      <div style={{ background: '#fff', border: '2px solid var(--ink)', borderRadius: '16px', overflow: 'hidden', borderTop: `4px solid ${color}`, boxShadow: '0 4px 0 var(--ink)' }}>
        <div style={{ padding: '24px 28px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', marginBottom: '12px', color: 'var(--ink)' }}>{heading}</h3>
          <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, fontSize: '.95rem', margin: 0 }}>{body}</p>
        </div>

        {/* Character says */}
        {characterSays && (
          <div style={{ borderTop: '2px solid var(--ink)', padding: '18px 28px', background: colorLight, display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', flexShrink: 0 }}>
              {emoji}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color, marginBottom: '6px' }}>{name} says</div>
              <p style={{ fontSize: '.9rem', lineHeight: 1.6, color: 'var(--ink)', margin: 0, fontStyle: 'italic', fontWeight: 500 }}>
                &ldquo;{characterSays}&rdquo;
              </p>
            </div>
          </div>
        )}

        {/* Fun fact */}
        {funFact && (
          <div style={{ borderTop: '2px solid var(--ink)', padding: '16px 28px', background: 'var(--cream)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <span aria-hidden style={{ width: 32, height: 32, borderRadius: 9, background: '#fff', border: '2px solid var(--ink)', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><HappyIcon name="lessons" size={22} /></span>
            <p style={{ fontSize: '.85rem', lineHeight: 1.6, color: 'var(--ink-soft)', margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Brain fact: </strong>{funFact}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
