import Link from 'next/link'

// The whole promise in four things a parent can hold in their head, with the
// proof behind each one: a big tick or a cross, the real numbers, and when it
// is a cross, the one thing that turns it back. Age honest throughout: a five
// year old is not doing AI literacy yet, and the row says when it comes and
// why, grounded in the research, rather than showing a fake bar. Every row
// links to the place where acting on it happens.

const STAGE_LABELS = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent'] as const

type Area = { key: string; icon: string; name: string; startStage: number; blurb: string; comesWhy: string; comesAge: string }

const AREAS: Area[] = [
  {
    key: 'safe', icon: '🛡️', name: 'Safe online', startStage: 1,
    blurb: 'Device settings set, worries worked through, and DiGi asking gently along the way.',
    comesWhy: '', comesAge: '4',
  },
  {
    key: 'balance', icon: '⚖️', name: 'Healthy balance', startStage: 1,
    blurb: 'Real world jobs against screen time, held in a good balance.',
    comesWhy: '', comesAge: '4',
  },
  {
    key: 'ai', icon: '🤖', name: 'AI and chatbots', startStage: 3,
    blurb: 'What AI is, how chatbots work, and how to tell what is real.',
    comesWhy: 'Orben and Odgers place the algorithm conversation in the 11 to 13 window, when abstract thinking can hold it.',
    comesAge: '11',
  },
  {
    key: 'social', icon: '💬', name: 'Social media ready', startStage: 3,
    blurb: 'The judgement for the platforms, built in good time before 16.',
    comesWhy: 'Built before any account exists, so the skills are there first. From 13, DiGi asks what they are actually seeing.',
    comesAge: '11',
  },
]

export type { AreaStatus } from '@/lib/pathway/literacy-status'
import type { AreaStatus } from '@/lib/pathway/literacy-status'

// The one way a reading is marked: a big confident circle, tick or cross.
function Mark({ tone }: { tone: 'green' | 'red' }) {
  const green = tone === 'green'
  return (
    <span aria-hidden style={{
      flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: green ? 'var(--retro-green, #2F8F6B)' : '#C0533E',
      color: '#fff', fontSize: 20, fontWeight: 900,
      boxShadow: green ? '0 3px 0 var(--retro-green-dark, #236F52)' : '0 3px 0 #93392A',
    }}>
      {green ? '✓' : '✕'}
    </span>
  )
}

export default function LiteracyAreas({ stageId, childName, statuses = {} }: {
  stageId: number
  childName?: string
  statuses?: Partial<Record<string, AreaStatus>>
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const current = Math.min(5, Math.max(1, stageId))

  return (
    <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '20px 18px 8px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 4px' }}>
          The four things we build
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
          Everything {kid} does adds up to these, ready by 16. Green is on track. A cross tells you the one thing to do.
        </p>

        {AREAS.map(area => {
          const active = current >= area.startStage
          const live = active ? statuses[area.key] : undefined

          // Not this age yet: say when it comes and why, never a fake bar.
          if (!active) {
            return (
              <div key={area.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderTop: '1px solid var(--border)', opacity: 0.75 }}>
                <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', filter: 'grayscale(0.6) opacity(0.7)' }}>{area.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.25 }}>
                    {area.name}
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px', color: 'var(--ink-soft)', marginTop: 4 }}>
                    Comes at age {area.comesAge}, {STAGE_LABELS[area.startStage - 1]} stage
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: 3 }}>
                    {area.comesWhy}
                  </span>
                </span>
              </div>
            )
          }

          const tone = live?.tone ?? 'green'
          return (
            <Link
              key={area.key}
              href={live?.href ?? '/dashboard/lessons'}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, textDecoration: 'none', padding: '16px 0', borderTop: '1px solid var(--border)' }}
            >
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--tint-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{area.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '17px', color: 'var(--ink)', lineHeight: 1.25 }}>
                    {area.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: tone === 'green' ? 'var(--retro-green, #2F8F6B)' : '#C0533E' }}>
                    {live?.label}
                  </span>
                </span>
                {/* The proof, big and bold: the real numbers behind the mark */}
                {live?.value && (
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '19px', color: 'var(--ink)', lineHeight: 1.2, marginTop: 5 }}>
                    {live.value}
                  </span>
                )}
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '13.5px', color: 'var(--ink-muted)', lineHeight: 1.5, marginTop: 4 }}>
                  {live?.note ?? area.blurb}
                </span>
                {/* A cross always comes with the one thing that fixes it */}
                {live?.improve && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, background: '#FDF0EE', border: '1px solid #E8C4BC', borderRadius: 10, padding: '7px 12px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '13px', color: '#93392A', lineHeight: 1.35 }}>
                    → {live.improve}
                  </span>
                )}
              </span>
              <Mark tone={tone} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
