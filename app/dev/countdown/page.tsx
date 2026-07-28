'use client'

import { useState } from 'react'
import DeviceTimeCard from '@/components/quests/DeviceTimeCard'

// Harness for the last ten seconds of a screen time block. No auth, no data.
//
// It exists because the happy countdown is the one piece of this app nobody can
// check by hand. A block is at least STAR_MINUTES long, five by default, so
// seeing the final ten seconds means starting a real block on a real child
// account and then sitting in front of it for the best part of five minutes.
// Nobody does that, which is how a silent countdown survived: the blips and the
// finish jingle need an AudioContext, and until now one only ever opened on the
// Start tap, so any block that arrived through initialSession made no sound at
// all and there was no practical way to notice.
//
// Pick a length and it runs for real: the rising blips each second, the spoken
// ten second line, the three two one, the 🎉 and the big terracotta number, then
// the jingle. The stop call goes to the API with a fixture token and fails, which
// is fine, the card already ignores it.
//
// Tap the page once before the last ten seconds. That is what the child does
// naturally and what the browser requires before it will let anything sound.

const LENGTHS = [15, 30, 60]

export default function Page() {
  const [seconds, setSeconds] = useState<number | null>(null)
  const [runId, setRunId] = useState(0)

  const now = Date.now()
  const session = seconds === null ? null : {
    id: `dev-${runId}`,
    device: 'tv' as const,
    // The card measures its progress bar in whole minutes, so a short run wants
    // at least one or the bar starts already full.
    minutes: Math.max(1, Math.round(seconds / 60)),
    stars: 1,
    endsAt: new Date(now + seconds * 1000).toISOString(),
    startedAt: new Date(now).toISOString(),
    treat: true,
  }

  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20 }}>
      <div style={{ maxWidth: 460, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.5rem', marginBottom: 6 }}>
          Countdown harness
        </h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15.5, lineHeight: 1.5, marginBottom: 16 }}>
          Runs a real block so the last ten seconds can be seen and heard. Turn
          the sound on, then pick a length.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {LENGTHS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => { setSeconds(s); setRunId(n => n + 1) }}
              style={{
                border: '1.5px solid var(--border)', background: '#fff', cursor: 'pointer',
                borderRadius: 16, padding: '10px 16px', boxShadow: '0 5px 0 rgba(0,0,0,0.14)',
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
              }}
            >
              {s}s block
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSeconds(null)}
            style={{
              border: '1.5px solid var(--border)', background: 'var(--cream)', cursor: 'pointer',
              borderRadius: 16, padding: '10px 16px',
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
            }}
          >
            Reset
          </button>
        </div>

        <DeviceTimeCard
          key={runId}
          token="dev-harness"
          balanceStars={12}
          initialSession={session}
          usedTodayMinutes={0}
          recommendedMinutes={120}
          ageBand="8 to 10"
          deviceTrust="trusted"
        />
      </div>
    </main>
  )
}
