'use client'

// The premium DiGi front door, one shared shape wherever DiGi speaks. It is
// the look Justin liked in the reference app, rebuilt in our butter and ink
// and Nunito: a calm cream panel that curves softly at the foot, the DiGi mark
// sitting in its gold speech square, and one big warm line underneath. Used at
// the head of the DiGi chat, the scripts and the school pages so every DiGi
// surface opens the same way, never a copy of another brand.

import DigiCharacter, { type DigiMood } from './DigiCharacter'

export default function DigiHero({
  eyebrow,
  title,
  subtitle,
  mood = 'wave',
  // The curved cream foot is right at the top of a screen. Turned off, the
  // hero sits flat inside a card or a scrolling column.
  curved = true,
  compact = false,
}: {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: React.ReactNode
  mood?: DigiMood
  curved?: boolean
  compact?: boolean
}) {
  return (
    <div
      style={{
        background: 'var(--cream)',
        textAlign: 'center',
        padding: compact ? '22px 22px 30px' : '30px 24px 42px',
        borderBottomLeftRadius: curved ? '52% 34px' : 0,
        borderBottomRightRadius: curved ? '52% 34px' : 0,
      }}
    >
      {/* DiGi in the gold speech square, the same mark as the welcome sheet */}
      <div style={{
        width: compact ? 52 : 62, height: compact ? 52 : 62, borderRadius: 18,
        background: 'var(--terracotta)', boxShadow: '0 5px 0 var(--terracotta-dark)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: compact ? 14 : 18,
      }}>
        <DigiCharacter mood={mood} size={compact ? 34 : 42} once />
      </div>

      {eyebrow && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: 'var(--terracotta-dark)', marginBottom: 10,
        }}>
          {eyebrow}
        </div>
      )}

      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, color: 'var(--ink)',
        fontSize: compact ? 'clamp(1.6rem, 6vw, 2rem)' : 'clamp(1.9rem, 7vw, 2.6rem)',
        lineHeight: 1.08, letterSpacing: '-0.03em',
        margin: '0 auto', maxWidth: 15 + 'ch',
      }}>
        {title}
      </h1>

      {subtitle && (
        <p style={{
          fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--ink-soft)',
          fontSize: 16.5, lineHeight: 1.55, margin: '14px auto 0', maxWidth: 34 + 'ch',
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
