'use client'

import type { JobGuide } from '@/lib/quests/job-guide'

// The daily jobs guide, as a card on the Add a job tab.
//
// Justin, 14 September 2026, after adding twelve jobs from the Top picks tab:
// "a little warning and advice, not blocked." So this is a card, never a
// gate. Coral wash when the board is over the guide, butter at the guide,
// quiet when there is room. The headline says where the child is, the advice
// says why and what to do, the sources line says who agrees, and the last
// line says out loud that nothing is stopped. A door to their jobs, so a
// parent who wants to trim can, in one tap.

export default function JobGuideCard({ guide, childName, onSeeJobs }: {
  guide: JobGuide
  childName: string | null
  onSeeJobs?: () => void
}) {
  const name = childName && childName !== 'Your child' ? childName : 'your child'
  const over = guide.status === 'over'
  const at = guide.status === 'at'
  // House tokens. On the parent side --coral is an alias for butter, so the
  // warning uses --alert (the one real red) on a rose wash, at the guide is
  // butter, and room is quiet white with an ink edge.
  const wash = over ? 'var(--tint-rose, #FBE9E9)' : at ? 'var(--tint-butter, #FFF6DE)' : '#fff'
  const edge = over ? 'var(--alert, #C94F3D)' : at ? 'var(--terracotta, #EDC35F)' : 'var(--ink)'

  return (
    <section
      data-job-guide
      data-status={guide.status}
      style={{
        background: wash, border: `2px solid ${edge}`, borderRadius: 'var(--radius-card)',
        boxShadow: `0 4px 0 ${edge}`, padding: over || at ? '14px 16px 13px' : '11px 14px', marginBottom: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: over ? 'var(--alert, #C94F3D)' : 'var(--ink-muted)',
        }}>
          {over ? 'A word before the next one' : 'The daily guide'}
        </span>
        <span data-guide-count style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink-soft)',
        }}>
          {guide.count} of {guide.guide} a day{guide.guide < guide.ceiling ? ` · up to ${guide.ceiling}` : ''}
        </span>
      </div>

      <h3 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: over || at ? 'var(--text-lg)' : 'var(--text-md)',
        color: 'var(--ink)', lineHeight: 1.2, margin: '6px 0 0', letterSpacing: '-0.01em',
      }}>
        {guide.headline}
      </h3>

      {(over || at) && (
        <>
          <p data-guide-advice style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', lineHeight: 1.5, margin: '8px 0 0' }}>
            {guide.advice.replace('The guide right now', `${name}'s guide right now`)}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 0 0' }}>
            NHS Start for Life, the NSPCC and the chores research agree: small responsibilities help, an overloaded child stops.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
            <span data-nothing-blocked style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-soft)', lineHeight: 1.4 }}>
              {guide.nothingBlocked}
            </span>
            {over && onSeeJobs && (
              <button
                type="button"
                onClick={onSeeJobs}
                data-guide-trim
                style={{
                  flexShrink: 0, cursor: 'pointer', background: '#fff', color: 'var(--ink)', border: '2px solid var(--ink)',
                  borderRadius: 'var(--radius-btn)', boxShadow: '0 3px 0 var(--ink)', padding: '9px 14px',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)',
                }}
              >
                Trim their list ›
              </button>
            )}
          </div>
        </>
      )}
      {!over && !at && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--ink-muted)', lineHeight: 1.45, margin: '4px 0 0' }}>
          {guide.advice}
        </p>
      )}
    </section>
  )
}
