'use client'

// The days a job happens on, when none of the four words fit.
//
// ── WHY IT IS ITS OWN FILE ──────────────────────────────────────────────────
//
// Two flows add a job: JobPicker (the ranked list) and JobComposer (writing
// your own). They already had the repeat chips drift apart once. One picker,
// used by both, is the only way "Tuesday and Thursday" means the same thing in
// both places.
//
// ── THE ORDER, AND WHY IT IS NOT SUNDAY FIRST ───────────────────────────────
//
// Monday first, because this is a British family app and a school week starts
// on Monday. The VALUES are still 0 Sunday through 6 Saturday, because that is
// what Date.getDay returns and what the column holds; only the reading order
// changes. Getting that backwards silently shifts every job by a day.

const DAYS: { value: number; label: string; full: string }[] = [
  { value: 1, label: 'M', full: 'Monday' },
  { value: 2, label: 'T', full: 'Tuesday' },
  { value: 3, label: 'W', full: 'Wednesday' },
  { value: 4, label: 'T', full: 'Thursday' },
  { value: 5, label: 'F', full: 'Friday' },
  { value: 6, label: 'S', full: 'Saturday' },
  { value: 0, label: 'S', full: 'Sunday' },
]

export default function DayPicker({
  days, onChange, idPrefix,
}: {
  /** Weekday numbers, 0 Sunday through 6 Saturday. */
  days: number[]
  onChange: (days: number[]) => void
  /** Keeps the labels unique when two pickers are on one screen. */
  idPrefix?: string
}) {
  const toggle = (v: number) => {
    const next = days.includes(v) ? days.filter(d => d !== v) : [...days, v]
    onChange(next.sort((a, b) => a - b))
  }
  // Two groups, not one wrapping row. Seven 44px squares do not fit across a
  // phone, so the row wrapped wherever it happened to run out: five and two on
  // one screen, six and one on another. Split on purpose, it wraps in the only
  // place that means something, and the shape says school days and weekend
  // before a single label is read.
  const group = (list: typeof DAYS) => (
    <div style={{ display: 'flex', gap: 6 }}>
      {list.map(d => {
        const on = days.includes(d.value)
        return (
          <button
            key={`${idPrefix ?? ''}${d.value}`}
            type="button"
            onClick={() => toggle(d.value)}
            aria-pressed={on}
            aria-label={d.full}
            style={{
              // 44 square, because this is the smallest thing on the screen and
              // a thumb has to hit one of seven of them.
              width: 44, height: 44, flexShrink: 0,
              borderRadius: 13,
              border: '2px solid var(--ink)',
              boxSizing: 'border-box',
              background: on ? 'var(--terracotta)' : '#fff',
              boxShadow: on ? '0 4px 0 var(--terracotta-dark)' : '0 3px 0 var(--ink)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'var(--text-md)',
              color: 'var(--ink)',
              cursor: 'pointer',
              transition: 'background 0.12s, box-shadow 0.12s',
            }}
          >
            {d.label}
          </button>
        )
      })}
    </div>
  )
  return (
    <div role="group" aria-label="Which days" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {group(DAYS.slice(0, 5))}
      {group(DAYS.slice(5))}
    </div>
  )
}
