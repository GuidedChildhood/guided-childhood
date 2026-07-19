import Link from 'next/link'
import { LITERACY_AREAS, type LiteracyKey } from '@/lib/content/literacy'
import type { AreaStatus } from '@/lib/pathway/literacy-status'

// The promise made visible: a calm strip that says where this child is on the
// road from 4 to 16, and what the whole thing is for. It leads with the
// destination, safe and AI literate and digitally aware by 16, so daily use
// always sits inside the bigger picture. It uses only what Home already knows,
// the stage and the streak, so it is never empty and never a heavy query. The
// deeper proof, lessons and moments per literacy area, lives on the full path
// this links to, built over the same school curriculum stages.

const STAGE_LABELS = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent'] as const
const STAGE_AGES = ['4 to 7', '8 to 10', '11 to 13', '13 to 15', '16 plus'] as const

// The four strands each start at a stage; before it, the dot stays quietly
// grey rather than pretending progress. Mirrors LiteracyAreas exactly.
const STRAND_START: Record<LiteracyKey, number> = { safe: 1, balance: 1, ai: 3, social: 3 }

export default function RoadToSixteen({
  childName, stageId, streakCount = 0, statuses = {},
}: {
  childName?: string
  stageId: number
  streakCount?: number
  statuses?: Partial<Record<string, AreaStatus>>
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'Your child'
  const current = Math.min(5, Math.max(1, stageId))
  const atEnd = current >= 5

  return (
    <Link
      href="/dashboard/pathway"
      style={{
        display: 'block', textDecoration: 'none',
        background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px',
        padding: '18px 18px 16px', marginBottom: '20px',
        boxShadow: '0 4px 0 rgba(26,26,46,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--terracotta-dark)' }}>
          The road to 16
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, color: 'var(--ink-muted)' }}>
          Stage {current} of 5
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '17px', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.25, margin: '0 0 3px' }}>
        {atEnd
          ? `${kid} is digitally ready`
          : `${kid} is on track, ${STAGE_LABELS[current - 1]} stage`}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
        The pathway to social media access at 16: safe, AI literate and digitally aware, built a little each day.
        {streakCount >= 2 ? ` ${streakCount} days running.` : ''}
      </p>

      {/* The five stages, 4 to 16, current one lit in butter */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 12 }}>
        {STAGE_LABELS.map((label, i) => {
          const n = i + 1
          const done = n < current
          const on = n === current
          return (
            <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, minWidth: 0 }}>
              <div style={{
                width: '100%', height: 6, borderRadius: 100,
                background: done ? 'var(--terracotta-lt)' : on ? 'var(--terracotta)' : 'var(--border)',
                boxShadow: on ? '0 2px 0 var(--terracotta-dark)' : 'none',
              }} />
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.02em',
                color: on ? 'var(--ink)' : 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.2,
              }}>
                {STAGE_AGES[i]}
              </span>
            </div>
          )
        })}
      </div>

      {/* The same four strands the pathway page tracks, compact: the passport
          and the tracker are one thing, read from one source. Green on track,
          red worth a look, grey not started yet at this age. */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        {(Object.keys(LITERACY_AREAS) as LiteracyKey[]).map(k => {
          const live = current >= STRAND_START[k] ? statuses[k] : undefined
          const active = current >= STRAND_START[k]
          const dot = live ? (live.tone === 'green' ? 'var(--retro-green, #2F8F6B)' : '#C0533E') : active ? 'var(--retro-green, #2F8F6B)' : 'var(--border)'
          return (
            <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--cream)', borderRadius: 100, padding: '4px 10px', opacity: active ? 1 : 0.55 }}>
              <span aria-hidden style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.03em', color: 'var(--ink-soft)', whiteSpace: 'nowrap' }}>
                {LITERACY_AREAS[k].name}
              </span>
            </span>
          )
        })}
      </div>

      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12.5px', color: 'var(--terracotta-dark)' }}>
        See the whole path and the proof →
      </span>
    </Link>
  )
}
