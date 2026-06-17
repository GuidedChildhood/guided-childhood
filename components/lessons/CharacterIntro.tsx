'use client'
import { useState } from 'react'

export type LessonCharacter = 'teo' | 'olga' | 'alam' | 'digi-junior'

const CHARACTERS: Record<LessonCharacter, {
  name: string
  emoji: string
  color: string
  colorLight: string
  colorDark: string
  kit: string
  personality: string
}> = {
  teo: {
    name: 'Teo',
    emoji: '⚽',
    color: 'var(--coral)',
    colorLight: 'var(--coral-lt)',
    colorDark: '#C0392B',
    kit: 'Screen Time Captain',
    personality: 'confident and sporty',
  },
  olga: {
    name: 'Olga',
    emoji: '🔍',
    color: 'var(--gold-dark)',
    colorLight: 'var(--gold-lt)',
    colorDark: '#A07820',
    kit: 'Online Smarts',
    personality: 'curious and sharp',
  },
  alam: {
    name: 'Alam',
    emoji: '🛡️',
    color: 'var(--green-dark)',
    colorLight: 'var(--green-lt)',
    colorDark: '#1E5C3F',
    kit: 'Privacy Guardian',
    personality: 'warm and brave',
  },
  'digi-junior': {
    name: 'DiGi Junior',
    emoji: '🤖',
    color: 'var(--green-dark)',
    colorLight: 'var(--green-lt)',
    colorDark: '#1E5C3F',
    kit: 'Your guide',
    personality: 'fun and helpful',
  },
}

interface CharacterIntroProps {
  character: LessonCharacter
  greeting: string
  lessonTitle: string
  ageStage: string
  onStart: () => void
}

export default function CharacterIntro({ character, greeting, lessonTitle, ageStage, onStart }: CharacterIntroProps) {
  const [ready, setReady] = useState(false)
  const c = CHARACTERS[character]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d2b1a 0%, #1a4a2e 60%, #0f3320 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>

        {/* Stage badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(175,220,162,.15)', border: '1px solid rgba(175,220,162,.3)', borderRadius: '100px', padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '32px' }}>
          {ageStage}
        </div>

        {/* Character avatar — large */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: c.color,
          border: '4px solid rgba(255,255,255,.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.2rem',
          margin: '0 auto 8px',
          boxShadow: `0 0 60px ${c.color}55, 0 20px 40px rgba(0,0,0,.3)`,
          animation: 'float 3s ease-in-out infinite',
        }}>
          {c.emoji}
        </div>

        {/* Name tag */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: '4px' }}>{c.kit}</div>
        <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '32px' }}>{c.name}</h1>

        {/* Speech bubble */}
        <div style={{
          background: 'rgba(255,255,255,.95)',
          borderRadius: '20px',
          borderBottomLeftRadius: '4px',
          padding: '24px 28px',
          marginBottom: '8px',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0,0,0,.3)',
        }}>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            lineHeight: 1.6,
            color: 'var(--ink)',
            margin: 0,
            fontWeight: 500,
          }}>
            {greeting}
          </p>
        </div>
        <div style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '0', borderTop: '14px solid rgba(255,255,255,.95)', marginLeft: '32px', marginBottom: '32px' }} />

        {/* Lesson title */}
        <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '14px', padding: '16px 20px', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: '6px' }}>Today&rsquo;s lesson</div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>{lessonTitle}</div>
        </div>

        {/* Start button */}
        <button
          onClick={() => { setReady(true); onStart() }}
          className="btn btn-gold"
          style={{ fontSize: '1rem', padding: '16px 40px', width: '100%', maxWidth: '320px', cursor: 'pointer' }}
        >
          {ready ? 'Loading...' : `Let’s go with ${c.name}! ${c.emoji}`}
        </button>

        <p style={{ color: 'rgba(255,255,255,.35)', fontFamily: 'var(--font-mono)', fontSize: '.68rem', marginTop: '16px', letterSpacing: '.05em' }}>
          About 5 minutes · Perfect for ages 6 to 12
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  )
}
