'use client'

import { bandForAge } from '@/lib/children/age'
import type { AgeBand } from '@/lib/content/stages'

// ONE WAY TO ASK HOW OLD A CHILD IS, FOR EVERY CHILD.
//
// Justin, 11 September 2026: "when we add other child it asks for age and at
// the start up we ask for birth year, is it better these forms match?"
//
// Yes, and the mismatch was doing real damage rather than looking untidy. The
// starter pack asks month and year and saves a date of birth. Every other way
// into the product saved an age BAND and no birthday at all, so those children
// could never age up: bandForAge has nothing to read, and the child sits on the
// band their parent picked until somebody edits a birthday in Settings that
// most people will never find.
//
// A product whose whole promise is a pathway from 4 to 16 cannot have children
// who do not get older. The first child grew and the second did not.
//
// MONTH AND YEAR, NEVER THE DAY. The exact date buys us nothing the band and
// the birthday month do not already give, and it is more of a child's personal
// data than we need. The starter pack settled this in August and this follows
// it rather than inventing a second answer.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const

const THIS_YEAR = new Date().getFullYear()
// Newest first, because a parent adding a nine year old should not scroll past
// 2009 to reach 2017. Eighteen years covers four to sixteen with a spare each
// side for a child who is nearly either.
const BIRTH_YEARS = Array.from({ length: 18 }, (_, i) => THIS_YEAR - i)

/** The first of the birth month, which is what the whole product stores. */
export function dobFrom(month: number | null, year: number | null): string | null {
  if (month == null || year == null) return null
  return `${year}-${String(month).padStart(2, '0')}-01`
}

/** The band that birthday puts them in today, and will keep putting them in. */
export function bandFrom(month: number | null, year: number | null): AgeBand | null {
  const dob = dobFrom(month, year)
  return dob ? bandForAge(dob) : null
}

export default function BirthdayFields({
  month, year, onChange, fieldStyle,
}: {
  month: number | null
  year: number | null
  onChange: (month: number | null, year: number | null) => void
  /** The host form's own input style, so this looks native wherever it lands. */
  fieldStyle: React.CSSProperties
}) {
  return (
    <div>
      <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>
        When is their birthday
      </span>
      <div style={{ display: 'flex', gap: '8px' }}>
        <select
          aria-label="Birth month"
          value={month ?? ''}
          onChange={e => onChange(e.target.value ? Number(e.target.value) : null, year)}
          style={{ ...fieldStyle, flex: 1, minWidth: 0 }}
        >
          <option value="">Month</option>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
        </select>
        <select
          aria-label="Birth year"
          value={year ?? ''}
          onChange={e => onChange(month, e.target.value ? Number(e.target.value) : null)}
          style={{ ...fieldStyle, flex: 1, minWidth: 0 }}
        >
          <option value="">Year</option>
          {BIRTH_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      {/* The band is derived, not asked, and said back so a parent can see we
          got it right without having to trust us. */}
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '6px 0 0', lineHeight: 1.5, minHeight: '1.2em' }}>
        {bandFrom(month, year)
          ? `Month and year is plenty. That puts them in ages ${bandFrom(month, year)!.replace('-', ' to ')}, and we move them up on their birthday.`
          : 'Month and year is plenty, and it means they move up a stage on their own birthday.'}
      </p>
    </div>
  )
}
