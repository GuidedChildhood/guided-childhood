import Link from 'next/link'
import type { AreaStatus } from '@/lib/pathway/literacy-status'
import { MiniRoad, StrandPills, strandsFor } from '@/components/pathway/StageRoad'

// The promise made visible on Home: where this child is on the road from 4 to
// 16, drawn in the exact same road language as the pathway page and DiGi's
// welcome walk, one grammar everywhere. It uses only what Home already knows,
// the stage, the streak and the live strand readings, so it is never empty and
// never a heavy query. The deeper proof lives on the full path this links to.

const STAGE_LABELS = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent'] as const

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

      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '18px', color: 'var(--ink)', letterSpacing: '-0.01em', lineHeight: 1.25, margin: '0 0 3px' }}>
        {atEnd
          ? `${kid} is digitally ready`
          : `${kid} is on track, ${STAGE_LABELS[current - 1]} stage`}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 16px' }}>
        The pathway to social media access at 16: safe, AI literate and digitally aware, built a little each day.
        {streakCount >= 2 ? ` ${streakCount} days running.` : ''}
      </p>

      {/* The same road as everywhere else, at a glance size */}
      <div style={{ marginBottom: 14 }}>
        <MiniRoad currentStage={current} />
      </div>

      {/* The same four strands the pathway page tracks, in the same pills */}
      <div style={{ marginBottom: 13 }}>
        <StrandPills strands={strandsFor(current, statuses)} />
      </div>

      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: 'var(--terracotta-dark)' }}>
        See the whole road and the proof →
      </span>
    </Link>
  )
}
