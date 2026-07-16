'use client'

// The balance insight card on the child app. Bigger and brighter than the old
// tip line, a DiGi squad friend delivering one warm, true idea about why
// balance is worth it. It rotates a fresh idea each day, and the child can tap
// to see another, which gives them the wheel rather than feeding them an
// endless stream. Deliberately calm: one card, no autoplay, no infinite feed,
// because a screen that teaches balance has to model it.

import { useEffect, useState } from 'react'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { insightsForStage, type InsightCharacter, type InsightTheme } from '@/lib/content/child-insights'

const CHARACTER: Record<InsightCharacter, { src: string | null; name: string; ring: string }> = {
  digi: { src: null, name: 'DiGi', ring: 'var(--terracotta)' },
  oliver: { src: '/digi-squad/Oliver.png', name: 'Oliver', ring: '#D4600A' },
  zara: { src: '/digi-squad/Zara.png', name: 'Zara', ring: '#C9962A' },
  sofia: { src: '/digi-squad/Sofia.jpeg', name: 'Sofia', ring: '#2E7D5A' },
}

// Barely there tints per theme so the six ideas read as distinct, warm cards,
// never a wall of the same colour. Ink stays readable on every one.
const THEME_BG: Record<InsightTheme, string> = {
  offline: 'var(--tint-sage)',
  save: 'var(--terracotta-lt)',
  connect: 'var(--stage-3)',
  brain: 'var(--stage-2)',
  watch: 'var(--stage-5)',
  task: 'var(--terracotta-lt)',
}

export default function BalanceInsight({ stageId }: { stageId: number }) {
  const list = insightsForStage(stageId)
  const [i, setI] = useState(0)

  // Start on a different idea each day, chosen after mount so the server and
  // first client render agree (index 0), then it settles on today's card.
  useEffect(() => {
    const day = Math.floor(Date.now() / 86400000)
    setI(day % list.length)
  }, [list.length])

  if (list.length === 0) return null
  const cur = list[i % list.length]
  const c = CHARACTER[cur.character]

  return (
    <div style={{
      background: THEME_BG[cur.theme], border: '1.5px solid rgba(26,26,46,0.08)',
      borderRadius: '20px', padding: '18px 18px 15px', marginBottom: '16px',
      boxShadow: '0 4px 16px rgba(26,26,46,0.06)',
    }}>
      <style>{`@keyframes gcInsightIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }`}</style>

      <div key={cur.id} style={{ animation: 'gcInsightIn 0.35s ease' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '12px' }}>
          <span style={{
            flexShrink: 0, width: 54, height: 54, borderRadius: '16px', background: '#fff',
            border: `2px solid ${c.ring}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {c.src
              ? <img src={c.src} alt={c.name} width={50} height={50} style={{ objectFit: 'cover', borderRadius: '14px' }} />
              : <DigiCharacter mood="happy" size={38} />}
          </span>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-soft)' }}>
              {cur.emoji} {c.name} says
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.15rem, 5vw, 1.35rem)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em', marginTop: '3px' }}>
              {cur.headline}
            </div>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '15px', lineHeight: 1.55, color: 'var(--ink)', opacity: 0.86, margin: '0 0 14px' }}>
          {cur.body}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {list.slice(0, 6).map((_, d) => (
            <span key={d} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: d === (i % list.length) ? 'var(--ink)' : 'rgba(26,26,46,0.2)',
            }} />
          ))}
        </div>
        <button
          onClick={() => setI(v => (v + 1) % list.length)}
          style={{
            background: '#fff', border: '1.5px solid rgba(26,26,46,0.12)', borderRadius: '100px',
            padding: '8px 15px', cursor: 'pointer',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--ink)',
          }}
        >
          Show me another ✨
        </button>
      </div>
    </div>
  )
}
