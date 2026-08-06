'use client'

import { useState } from 'react'
import KidFriendArrival from '@/components/kid/KidFriendArrival'
import { STAGE_CHARACTERS, type StageCharacter } from '@/lib/content/stage-characters'
import { streaksForFriend } from '@/lib/pathway/streak-unlock'

// Layout fixture for the Friend arrival, which otherwise only happens behind a
// kid token on the one day in a child's month when a Planet Friend is earned.
// Built from the REAL characters and the REAL ladder, so a redrawn Friend or a
// moved number shows up here for free.
//
// 404s in production via middleware, like every other ref-* page.

export default function RefFriendArrivalPage() {
  const [playing, setPlaying] = useState<StageCharacter | null>(null)

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: '28px 18px' }}>
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
          letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0,
        }}>
          Reference
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)',
          color: 'var(--ink)', margin: '4px 0 6px',
        }}>
          A Planet Friend comes home
        </h1>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 18px' }}>
          Pick one to play the whole thing: lift off, cross, collect, home, arrival.
          Tap during the flight to skip to the arrival.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {STAGE_CHARACTERS.map(c => (
            <button
              key={c.key}
              onClick={() => setPlaying(c)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                background: '#fff', border: `2px solid ${c.colour}`, borderRadius: 16,
                padding: '13px 15px', cursor: 'pointer', boxShadow: `0 4px 0 ${c.colour}55`,
              }}
            >
              <span style={{
                width: 34, height: 34, borderRadius: '50%', background: c.colour, flexShrink: 0,
              }} />
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
                  {c.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
                  {streaksForFriend(c.stageId)} full days
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {playing && (
        <KidFriendArrival
          friend={playing}
          completedStreaks={streaksForFriend(playing.stageId)}
          childName="Teo"
          onClose={() => setPlaying(null)}
          onOpenBook={() => setPlaying(null)}
        />
      )}
    </main>
  )
}
