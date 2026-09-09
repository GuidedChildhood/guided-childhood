// How we fix it, drawn: the parts of the product, in the Happy News hand.
//
// ── WHY THIS EXISTS ─────────────────────────────────────────────────────────
//
// Justin, 9 September 2026, reading the reveal: "this is still offering
// examples and becomes long to read. We just need to acknowledge the problem
// and say how we help solve it, via scripts, moments, daily check in etc. Use
// your brain to simplify how we say what we offer and how we fix the problem,
// the METHOD not examples. So Happy News style diagrams to quickly illustrate
// the solution without too much text."
//
// He is right and the failure was a specific one. Each worry card carried a
// paragraph of mechanism plus a real script in full, quotation marks and all.
// A parent with three worries got three paragraphs and three scripts before
// they reached the price, which is roughly four hundred words of reading to
// answer one question they already knew the answer to: does this deal with my
// evening. Worse, the example was doing the opposite of its job. A script
// about algorithms printed under a worry about a friend's new phone reads as a
// product that has not understood you.
//
// An example is a promise about ONE evening. The method is a promise about
// every evening, and it is the thing actually being bought. So the cards name
// the parts of the product that pick this worry up, drawn rather than
// described, and the examples wait until they are inside where they are real.
//
// Same hand as WorryIcon: filled shapes, ink outline, house colours, slightly
// wonky. Read at 22px on a phone.

export type MethodId =
  | 'script' | 'digi' | 'checkin' | 'moment'
  | 'balance' | 'kidapp' | 'lesson' | 'passport'

const INK = '#1A1A2E'
const BUTTER = '#EDC35F'
const SKY = '#BAE6FD'
const CORAL = '#FECDD3'
const PINK = '#FBCFE8'
const LILAC = '#DDD6FE'
const MINT = '#A7E8C8'
const CREAM = '#FFFBEE'

/** What each part of the product is called on this page, and its colour. */
export const METHOD: Record<MethodId, { label: string; tint: string }> = {
  script:   { label: 'Scripts',        tint: BUTTER },
  digi:     { label: 'DiGi',           tint: LILAC },
  checkin:  { label: 'Daily check in', tint: MINT },
  moment:   { label: 'Moments',        tint: CORAL },
  balance:  { label: 'Device time',    tint: SKY },
  kidapp:   { label: "Their app",      tint: PINK },
  lesson:   { label: 'Lessons',        tint: SKY },
  passport: { label: 'Your record',    tint: BUTTER },
}

export default function MethodIcon({ id, size = 22 }: { id: MethodId; size?: number }) {
  const c = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill: 'none', stroke: INK, strokeWidth: 1.5,
    strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  switch (id) {
    // A speech bubble with the words already in it.
    case 'script':
      return (
        <svg {...c}>
          <path d="M20.6 14.2a2.4 2.4 0 0 1-2.4 2.4H8.6L4.2 20.4V6a2.4 2.4 0 0 1 2.4-2.4h11.6A2.4 2.4 0 0 1 20.6 6z" fill={BUTTER} transform="rotate(-2 12 12)" />
          <path d="M8 8.6h9M8 11.6h6.4" />
        </svg>
      )
    // The guide: a friendly face with a steady light on.
    case 'digi':
      return (
        <svg {...c}>
          <circle cx="12" cy="3.1" r="1.4" fill={BUTTER} />
          <path d="M12 4.5v2.8" />
          <rect x="3.4" y="7.3" width="17.2" height="11.6" rx="3.2" fill={LILAC} transform="rotate(2 12 13)" />
          <circle cx="9.1" cy="12.5" r="1.05" fill={INK} stroke="none" />
          <circle cx="15.1" cy="12.5" r="1.05" fill={INK} stroke="none" />
          <path d="M9.8 16h4.6" />
        </svg>
      )
    // One tap a day: a box with a big tick in it.
    case 'checkin':
      return (
        <svg {...c}>
          <rect x="3.2" y="4.4" width="17.6" height="16.4" rx="3" fill={MINT} transform="rotate(-1.5 12 12)" />
          <path d="M3.4 8.9h17.2" />
          <path d="M7.6 5.6V2.9M16.4 5.6V2.9" />
          <path d="M8.2 14.4l2.7 2.7 5-5.2" stroke={INK} strokeWidth="2.4" />
        </svg>
      )
    // A moment: the flag you plant on the evening that went wrong.
    case 'moment':
      return (
        <svg {...c}>
          <path d="M6 21.2V3.4" />
          <path d="M6 4.2h11.8l-2.4 3.6 2.4 3.6H6z" fill={CORAL} />
          <circle cx="6" cy="2.9" r="1.2" fill={BUTTER} />
        </svg>
      )
    // Device time: a jar with the day's minutes in it.
    case 'balance':
      return (
        <svg {...c}>
          <path d="M7 5.4h10v13a2.6 2.6 0 0 1-2.6 2.6H9.6A2.6 2.6 0 0 1 7 18.4z" fill={SKY} />
          <path d="M7 12.6h10v5.8a2.6 2.6 0 0 1-2.6 2.6H9.6A2.6 2.6 0 0 1 7 18.4z" fill={CREAM} stroke="none" />
          <path d="M7 12.6h10" />
          <path d="M6 5.4h12" strokeWidth="2" />
          <path d="M10 2.9h4v2.5h-4z" fill={BUTTER} />
        </svg>
      )
    // Their app: a phone that is theirs, with a star on it.
    case 'kidapp':
      return (
        <svg {...c}>
          <rect x="6" y="2.6" width="12" height="18.8" rx="2.6" fill={PINK} transform="rotate(-2.5 12 12)" />
          <path d="m12 7.6 1.5 3 3.3.5-2.4 2.3.6 3.3-3-1.6-3 1.6.6-3.3-2.4-2.3 3.3-.5z" fill={BUTTER} />
        </svg>
      )
    // A lesson: a book, open.
    case 'lesson':
      return (
        <svg {...c}>
          <path d="M12 6.4C10.2 4.8 7.6 4.3 3.6 4.5v13c4-.2 6.6.3 8.4 1.9 1.8-1.6 4.4-2.1 8.4-1.9v-13c-4-.2-6.6.3-8.4 1.9z" fill={SKY} />
          <path d="M12 6.4v13" />
        </svg>
      )
    // The record: a stamped page.
    case 'passport':
    default:
      return (
        <svg {...c}>
          <rect x="4.6" y="2.8" width="14.8" height="18.4" rx="2.4" fill={CREAM} />
          <path d="M8 7.4h6M8 10.6h5" />
          <circle cx="14.6" cy="15.4" r="3.4" fill={BUTTER} />
          <path d="m13 15.4 1.2 1.2 2.2-2.3" strokeWidth="2" />
        </svg>
      )
  }
}

/** The method row: what picks this worry up, drawn, no sentences. */
export function MethodRow({ ids }: { ids: MethodId[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 13 }}>
      {ids.map(id => (
        <span key={id} style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: '#fff', border: '2px solid var(--ink)', borderRadius: 100,
          padding: '5px 12px 5px 6px',
          fontFamily: 'var(--font-display)', fontWeight: 800,
          fontSize: 'var(--text-sm)', color: 'var(--ink)', lineHeight: 1.2,
        }}>
          <span aria-hidden style={{
            width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
            background: METHOD[id].tint, border: '2px solid var(--ink)', boxSizing: 'border-box',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MethodIcon id={id} size={17} />
          </span>
          {METHOD[id].label}
        </span>
      ))}
    </div>
  )
}
