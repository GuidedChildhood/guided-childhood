'use client'

import { useState } from 'react'
import JobBoardRow, { type BoardJob } from '@/components/quests/JobBoardRow'
import HappyIcon, { type HappyIconName } from '@/components/kid/HappyIcon'
import { jobIconFor } from '@/lib/quests/job-icon'

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
  { id: '4', title: 'Dishwasher emptied and everything put back where it lives', emoji: '🫧', stars: 3, steps: ['Top shelf', 'Bottom shelf', 'Cutlery'] },
  { id: '5', title: 'Walk Bramble before tea', emoji: '🐾', stars: 2 },
]

// Every drawing in the job set, at the size the plate actually renders it.
// Thirty icons judged one at a time all look fine; the only way to see whether
// they are ONE hand is to put them in a grid, which is what this is for.
const SHEET: { name: HappyIconName; label: string }[] = [
  { name: 'teeth', label: 'teeth' }, { name: 'laundry', label: 'laundry' },
  { name: 'shoes', label: 'shoes' }, { name: 'clothes', label: 'clothes' },
  { name: 'dishes', label: 'dishes' }, { name: 'plug', label: 'plug' },
  { name: 'phone', label: 'phone' }, { name: 'plate', label: 'plate' },
  { name: 'teddy', label: 'teddy' }, { name: 'sun', label: 'sun' },
  { name: 'pan', label: 'pan' }, { name: 'bowl', label: 'bowl' },
  { name: 'star', label: 'star' }, { name: 'tree', label: 'tree' },
  { name: 'bed', label: 'bed' }, { name: 'ball', label: 'ball' },
  { name: 'paint', label: 'paint' }, { name: 'car', label: 'car' },
  { name: 'bin', label: 'bin' }, { name: 'tv', label: 'tv' },
  { name: 'paw', label: 'paw' }, { name: 'music', label: 'music' },
  { name: 'shower', label: 'shower' }, { name: 'bike', label: 'bike' },
  // The ones that already existed and are reused by the map, here so the new
  // drawings can be judged against the hand they are meant to match.
  { name: 'bag', label: 'bag' }, { name: 'read', label: 'read' },
  { name: 'homework', label: 'homework' }, { name: 'tidy', label: 'tidy' },
  { name: 'kind', label: 'kind' }, { name: 'sprout', label: 'sprout' },
  { name: 'games', label: 'games' }, { name: 'maths', label: 'maths' },
]

// Real jobs a family has actually typed, to prove the words fall through to a
// sensible drawing when no emoji was stored.
const WORDS = ['Walk the dog before tea', 'Put your washing away', 'Practise the piano', 'Pack lunch', 'Something we never thought of']

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

        {/* THE SHEET. Every drawing at plate size, then the fallback path. */}
        <div style={{
          background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--lift)', padding: '18px', marginTop: 18,
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
            The whole set
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 12 }}>
            {SHEET.map(i => (
              <div key={i.name} style={{ textAlign: 'center' }}>
                <span aria-hidden style={{
                  width: 46, height: 46, borderRadius: '50%', background: '#fff', border: 'var(--edge)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <HappyIcon name={i.name} size={30} />
                </span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: 4 }}>{i.label}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '18px 0 8px', letterSpacing: '-0.02em' }}>
            Typed by a family, no emoji stored
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {WORDS.map(w => (
              <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span aria-hidden style={{
                  width: 40, height: 40, borderRadius: '50%', background: '#fff', border: 'var(--edge)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <HappyIcon name={jobIconFor('', w)} size={26} />
                </span>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
