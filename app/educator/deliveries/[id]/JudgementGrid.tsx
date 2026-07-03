'use client'

import { useTransition } from 'react'
import { setJudgement } from '../../actions'

// One tap marking: every pupil defaults to met when the register is taken,
// so the teacher only touches exceptions. Three states, no typing.

const LEVELS = [
  { key: 'working_towards', label: 'Working towards', bg: 'var(--coral-lt)', fg: 'var(--coral-dark)' },
  { key: 'met', label: 'Met', bg: 'var(--green-lt)', fg: 'var(--green-dark)' },
  { key: 'exceeded', label: 'Exceeded', bg: 'var(--gold-lt)', fg: 'var(--gold-dark)' },
] as const

type Level = (typeof LEVELS)[number]['key']

export default function JudgementGrid({
  deliveryId,
  rows,
}: {
  deliveryId: string
  rows: { pupilId: string; name: string; level: Level }[]
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: pending ? 0.7 : 1 }}>
      {rows.map(row => (
        <div key={row.pupilId} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px',
          background: 'var(--warm)', border: '1.5px solid var(--border)', borderRadius: '16px',
          padding: '12px 16px', flexWrap: 'wrap',
        }}>
          <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '14.5px', color: 'var(--ink)' }}>
            {row.name}
          </span>
          <span style={{ display: 'flex', gap: '6px' }}>
            {LEVELS.map(l => {
              const active = row.level === l.key
              return (
                <button
                  key={l.key}
                  onClick={() => startTransition(() => setJudgement(deliveryId, row.pupilId, l.key))}
                  style={{
                    padding: '7px 12px', borderRadius: '10px', cursor: 'pointer',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px',
                    border: active ? `2px solid ${l.fg}` : '1.5px solid var(--border)',
                    background: active ? l.bg : '#fff',
                    color: active ? l.fg : 'var(--ink-muted)',
                  }}
                >
                  {l.label}
                </button>
              )
            })}
          </span>
        </div>
      ))}
    </div>
  )
}
