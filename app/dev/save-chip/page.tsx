'use client'
import { useState } from 'react'
import SaveChip, { type SaveState } from '@/components/quests/SaveChip'

// Harness for the job save confirmation. No auth.
//
// The real one is inside the job editor on /dashboard/quests, behind a login,
// which is why it needed this: the states are the whole point of the feature
// and none of them could be looked at.
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Page() {
  const [live, setLive] = useState<SaveState>(null)
  const run = (end: SaveState) => {
    setLive('saving')
    window.setTimeout(() => setLive(end), 900)
    if (end === 'saved') window.setTimeout(() => setLive(null), 3100)
  }
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh', padding: 20, maxWidth: 640, margin: '0 auto' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>Every state</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 28 }}>
        <SaveChip state="saving" /><SaveChip state="saved" /><SaveChip state="failed" />
      </div>

      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>In the row, as a parent sees it</p>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', gap: 5 }}>
            {DAYS.map((l, i) => (
              <span key={i} style={{
                width: 26, height: 26, borderRadius: 8, display: 'grid', placeItems: 'center',
                border: `1.5px solid ${i > 3 ? 'var(--terracotta)' : 'var(--border)'}`,
                background: i > 3 ? 'var(--terracotta)' : '#fff',
                fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
              }}>{l}</span>
            ))}
          </span>
          <SaveChip state={live} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
        <button onClick={() => run('saved')} className="btn btn-gold" style={{ padding: '10px 18px' }}>Save that works</button>
        <button onClick={() => run('failed')} className="btn" style={{ padding: '10px 18px', border: '1.5px solid var(--border)', borderRadius: 12, background: '#fff' }}>Save that fails</button>
      </div>
    </main>
  )
}
