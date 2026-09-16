'use client'

import { useState } from 'react'
import JobBoardRow, { type BoardJob } from '@/components/quests/JobBoardRow'

// Layout fixture for one job on the child's board. 404s in production via
// middleware, like every other ref-* page.
//
// It mounts the REAL JobBoardRow, which is the only reason it is worth having:
// the fault Justin photographed on 16 September was a wrapping fault, and a
// fixture that reimplemented the markup would have wrapped correctly while the
// live screen went on printing words through words.
//
// The jobs below are the two from his screenshot, at their real lengths,
// because the collision only appears once a title is long enough to wrap. A
// fixture full of "Make your bed" would pass while the bug sat there.

const JOBS: BoardJob[] = [
  { id: '1', title: 'Phone charged outside the bedroom', emoji: '🔌', stars: 0, is_family_job: true },
  { id: '2', title: 'Homework done before the phone comes out', emoji: '✏️', stars: 2 },
  { id: '3', title: 'Bed', emoji: '🛏️', stars: 1 },
  { id: '4', title: 'Dishwasher emptied and everything put back where it lives', emoji: '🍽️', stars: 3, steps: ['Top shelf', 'Bottom shelf', 'Cutlery'] },
  { id: '5', title: 'Walk Bramble before tea', emoji: '🐕', stars: 2 },
]

export default function RefJobBoard() {
  const [stepsOpen, setStepsOpen] = useState<string | null>(null)
  const [stepsDraft, setStepsDraft] = useState('')
  const [pinged, setPinged] = useState<string | null>(null)

  return (
    <main style={{ background: 'var(--butter)', minHeight: '100vh', padding: '20px 16px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--lift)', padding: '18px 18px 20px',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            On Bumble&apos;s board
          </h2>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
            {JOBS.length} jobs running, waiting on Bumble.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {JOBS.map((j, i) => (
              <JobBoardRow
                key={j.id}
                job={j}
                index={i}
                childName="Bumble"
                hasApp
                busy={false}
                pinged={pinged}
                stepsOpen={stepsOpen === j.id}
                stepsDraft={stepsDraft}
                setStepsOpen={open => setStepsOpen(open ? j.id : null)}
                setStepsDraft={setStepsDraft}
                onToggleFamily={() => {}}
                onSaveSteps={() => setStepsOpen(null)}
                onRemind={() => setPinged(j.title)}
                onRemove={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
