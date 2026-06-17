'use client'
import { useState } from 'react'

interface DigiJuniorPauseProps {
  message: string
  onContinue: () => void
}

export default function DigiJuniorPause({ message, onContinue }: DigiJuniorPauseProps) {
  const [breathing, setBreathing] = useState(false)

  function handleBreath() {
    setBreathing(true)
    setTimeout(() => { setBreathing(false) }, 4000)
  }

  return (
    <div style={{
      background: 'var(--green-lt)',
      border: '2px solid var(--green)',
      borderRadius: '20px',
      padding: '28px',
      textAlign: 'center',
      maxWidth: '480px',
      margin: '0 auto',
    }}>
      {/* DiGi Junior avatar */}
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'var(--green-dark)',
        border: '3px solid var(--green)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        margin: '0 auto 12px',
        boxShadow: '0 0 24px rgba(46,125,90,.3)',
        animation: breathing ? 'breathe 4s ease-in-out' : 'bobble 2s ease-in-out infinite',
      }}>
        🤖
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--green-dark)', marginBottom: '12px' }}>
        DiGi Junior · Pause point
      </div>

      {/* Speech bubble */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: '0 4px 16px rgba(46,125,90,.1)',
      }}>
        <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--ink)', margin: 0, fontWeight: 500 }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleBreath}
          style={{
            background: 'var(--green-dark)',
            color: '#fff',
            border: 'none',
            borderRadius: '100px',
            padding: '10px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '.78rem',
            fontWeight: 600,
            letterSpacing: '.05em',
            cursor: 'pointer',
            opacity: breathing ? 0.6 : 1,
          }}
        >
          {breathing ? 'Breathing... 🌬️' : 'Take a breath 🌬️'}
        </button>
        <button
          onClick={onContinue}
          className="btn btn-green"
          style={{ fontSize: '.78rem', padding: '10px 20px', cursor: 'pointer' }}
        >
          Keep going! →
        </button>
      </div>

      <style>{`
        @keyframes bobble {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(-3deg); }
          75% { transform: translateY(-2px) rotate(3deg); }
        }
        @keyframes breathe {
          0% { transform: scale(1); }
          50% { transform: scale(1.25); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
