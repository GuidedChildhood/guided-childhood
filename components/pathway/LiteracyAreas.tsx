import Link from 'next/link'

// The whole promise in four things a parent can hold in their head, not a grid.
// Each is a digital literacy strand we build from 4 to 16, shown as one simple
// row: what it is, and whether it is being built now or comes at the right age.
// It is deliberately age honest: a five year old is not doing AI literacy yet,
// and saying so plainly is more trustworthy than a fake progress bar. The four
// map onto the existing lesson strands, so this is a simple face on real
// content, never a second source of truth.

const STAGE_LABELS = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent'] as const
const STAGE_AGES = ['4 to 7', '8 to 10', '11 to 13', '13 to 15', '16 plus'] as const

type Area = { key: string; icon: string; name: string; startStage: number; blurb: string }

const AREAS: Area[] = [
  { key: 'safe',    icon: '🛡️', name: 'Safe online',        startStage: 1, blurb: 'Being kind, spotting what is not right, and always asking a grown up.' },
  { key: 'balance', icon: '⚖️', name: 'Healthy balance',    startStage: 1, blurb: 'Screens, sleep, play and mood held in a good balance.' },
  { key: 'ai',      icon: '🤖', name: 'AI and chatbots',    startStage: 3, blurb: 'What AI is, how chatbots work, and how to tell what is real.' },
  { key: 'social',  icon: '💬', name: 'Social media ready', startStage: 3, blurb: 'The judgement for the platforms, built in good time before 16.' },
]

// A live reading per area, computed server side from the family's real data:
// green when on track, red when it needs a look, plus the proof line (lessons
// done, balance this week, open worries). Absent means fall back to the static
// age based status.
export type AreaStatus = { tone: 'green' | 'red'; label: string; note?: string }

export default function LiteracyAreas({ stageId, childName, statuses = {} }: {
  stageId: number
  childName?: string
  statuses?: Partial<Record<string, AreaStatus>>
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const current = Math.min(5, Math.max(1, stageId))

  return (
    <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '18px', padding: '18px 18px 8px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 4px' }}>
          The four things we build
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 14px' }}>
          Everything {kid} does adds up to these, ready by 16.
        </p>

        {AREAS.map(area => {
          const active = current >= area.startStage
          const ready = current >= 5
          const live = active ? statuses[area.key] : undefined
          const statusLabel = live
            ? live.label
            : active
            ? ready ? 'Ready' : 'Building now'
            : `Comes at ${STAGE_LABELS[area.startStage - 1]}, ${STAGE_AGES[area.startStage - 1]}`
          const dotColour = live
            ? live.tone === 'green' ? 'var(--retro-green, #2F8F6B)' : '#C0533E'
            : active ? 'var(--retro-green, #2F8F6B)' : 'var(--border)'
          return (
            <Link
              key={area.key}
              href="/dashboard/lessons"
              style={{
                display: 'flex', alignItems: 'center', gap: 13, textDecoration: 'none',
                padding: '12px 0', borderTop: '1px solid var(--border)',
              }}
            >
              <span style={{
                flexShrink: 0, width: 40, height: 40, borderRadius: '12px',
                background: active ? 'var(--tint-sage)' : 'var(--cream)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                filter: active ? 'none' : 'grayscale(0.6) opacity(0.7)',
              }}>{area.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2 }}>
                  {area.name}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', lineHeight: 1.45, marginTop: 1 }}>
                  {live?.note ?? area.blurb}
                </span>
              </span>
              <span style={{
                flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: 5,
                fontFamily: 'var(--font-mono)', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.03em',
                color: live ? dotColour : active ? 'var(--retro-green, #2F8F6B)' : 'var(--ink-light)',
                textAlign: 'right', maxWidth: '92px', lineHeight: 1.3,
              }}>
                <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: dotColour }} />
                {statusLabel}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
