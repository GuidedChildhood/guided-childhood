'use client'

import Link from 'next/link'
import type { DeviceGuide } from '@/app/(dashboard)/dashboard/devices/DeviceList'

// The settings walkthrough for one device, on its own.
//
// Pulled out of DeviceList so the same panel can open from a row in the
// family's own list of screens and from the catalogue, without the steps being
// written twice and drifting apart. The list around it decides what a row looks
// like; this only knows how to explain one device.

// Steps are seeded as "**bold lead in** rest of the step". Render the bold part
// as a real bold span instead of shipping raw markup to the client.
function renderStep(step: string) {
  const match = step.match(/^\*\*(.+?)\*\*(.*)$/)
  if (!match) return <span>{step}</span>
  return (
    <>
      <strong style={{ color: 'var(--ink)' }}>{match[1]}</strong>
      <span>{match[2]}</span>
    </>
  )
}

export default function GuideBody({
  guide,
  childAge,
  isDone,
  busy,
  onToggle,
  footer,
}: {
  guide: DeviceGuide
  childAge: number
  isDone: boolean
  busy: boolean
  onToggle: () => void
  /** Anything the surrounding list wants under the buttons, like the escape
   *  from a device the family does not own. */
  footer?: React.ReactNode
}) {
  const ageReady = childAge >= guide.min_age

  return (
    <div style={{ padding: '16px 18px 20px 18px', borderTop: '1px solid var(--border)' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: ageReady ? 'var(--stage-2)' : 'var(--stage-5)',
        color: ageReady ? 'var(--stage-2-text)' : 'var(--stage-5-text)',
        fontSize: 'var(--text-base)', fontWeight: 600, padding: '6px 12px', borderRadius: '10px', marginBottom: '14px',
      }}>
        {ageReady ? '✓ Suitable to set up now' : `Most families introduce this around age ${guide.min_age} plus, here is how, for when you are ready`}
      </div>

      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '16px' }}>
        {guide.why}
      </p>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: '16px' }}>
        {guide.steps.map((step, i) => (
          <li key={i} style={{ display: 'flex', gap: '12px', padding: '11px 0', borderBottom: i < guide.steps.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--ink)', color: 'var(--terracotta-lt)', fontSize: 'var(--text-sm)', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.65 }}>
              {renderStep(step)}
            </span>
          </li>
        ))}
      </ol>

      <div style={{ background: 'var(--stage-5)', borderLeft: '2.5px solid var(--terracotta)', borderRadius: '10px', padding: '12px 14px', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.6, marginBottom: '14px' }}>
        <strong style={{ color: 'var(--terracotta)', fontWeight: 700 }}>Pathway note: </strong>
        {guide.note}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={onToggle}
          disabled={busy}
          className={isDone ? 'btn btn-outline' : 'btn btn-gold'}
          style={{ flex: 1, minWidth: '140px', justifyContent: 'center', fontSize: 'var(--text-base)' }}
        >
          {isDone ? 'Marked as set up ✓' : 'Mark as set up'}
        </button>
        <Link
          href={`/dashboard/digi?device=${guide.device_key}&q=${encodeURIComponent(`Can you walk me through setting up ${guide.name} step by step?`)}`}
          className="btn btn-outline"
          style={{ flex: 1, minWidth: '140px', justifyContent: 'center', fontSize: 'var(--text-base)' }}
        >
          {/* Short enough to keep its padding. The full sentence needed about
              190px of the 115px a half width button leaves after .btn's 28px
              sides, so the words ran to the edges and the pair stopped looking
              like a pair. The question it sends is still the full one. */}
          Ask DiGi to help
        </Link>
      </div>

      {footer}
    </div>
  )
}
