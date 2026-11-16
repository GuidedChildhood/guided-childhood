import type { ReactNode } from 'react'
import { eyebrow } from './ui'

// IN SHORT (13 November 2026).
//
// Taken from the French scheme's own site, where every long page opens with a
// box of five lines: what a busy teacher needs if they read nothing else. Her
// assessment page can be used after one look because of it. The same box now
// opens our long pages, in each subject's colour.
//
// `fold` shuts it behind one line, for a page whose reader usually knows the
// rules already and has come for the numbers underneath.

export default function InShort({ points, title = 'In short', accent = 'var(--green)', ink = 'var(--green-dark)', fold = false }: {
  points: ReactNode[]; title?: string; accent?: string; ink?: string; fold?: boolean
}) {
  if (points.length === 0) return null
  const list = (
    <ul style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', lineHeight: 1.6, color: 'var(--ink)', margin: 0, paddingLeft: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      {points.map((p, i) => <li key={i}>{p}</li>)}
    </ul>
  )
  const box: React.CSSProperties = { background: 'var(--butter-lt)', borderLeft: `4px solid ${accent}`, borderRadius: 'var(--radius-tile)', padding: 'var(--space-3) var(--space-4)' }
  if (fold) {
    return (
      <details className="gc-inshort no-print" style={box}>
        <summary style={{ ...eyebrow, color: ink, cursor: 'pointer', minHeight: 44, display: 'flex', alignItems: 'center' }}>{title}</summary>
        <div style={{ paddingBottom: 'var(--space-2)' }}>{list}</div>
      </details>
    )
  }
  return (
    <aside aria-label={title} style={box}>
      <h2 style={{ ...eyebrow, color: ink, margin: '0 0 var(--space-2)' }}>{title}</h2>
      {list}
    </aside>
  )
}
