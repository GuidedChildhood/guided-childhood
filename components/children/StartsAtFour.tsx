import { turnsFourOn } from '@/lib/children/age'
import TurnsFourEmail from '@/components/children/TurnsFourEmail'

// WE START AT 4, SAID TO THE PARENT RATHER THAN DONE TO THEM.
//
// Justin, 16 October 2026: the parent of a 2 or 3 year old is a customer
// later, not now. Before this, a birthday under 4 was quietly filed under
// ages 4 to 7 and the parent was shown a stage, lessons and scripts written
// for a child twice the age. One card, the same everywhere a birthday is asked:
// what we cover, and when to come back. Since 12 November 2026 (Justin agreed
// the under 4 list) the parent can also leave an email for that month; see
// lib/starter/turns-four.ts. Off with capture={false} where an account
// already exists, since a signed in parent has nothing to leave.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const

export default function StartsAtFour({ dob, name, after, capture = false }: {
  /** The YYYY-MM-01 birthday the parent just gave. */
  dob: string
  /** The child's first name when we have it. */
  name?: string
  /** One closing line for the screen it sits on (an older child, a sibling). */
  after?: string
  /** Offer the turns four email. Only where the parent has no account yet. */
  capture?: boolean
}) {
  const four = turnsFourOn(dob)
  const who = name?.trim() || 'Your little one'
  return (
    <div role="status" style={{
      background: 'var(--tint-butter)', border: '1.5px solid var(--border)',
      borderRadius: 'var(--radius-tile)', padding: '14px 16px', marginTop: '12px',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.3 }}>
        We start at 4
      </p>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
        {who} is still a bit young for us. Everything here is written for children aged 4 to 16, so anything we showed you now would be meant for an older child.
      </p>
      {four && (
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: '8px 0 0' }}>
          Come back when they turn 4, in {MONTHS[four.month - 1]} {four.year}. We will be ready for them.
        </p>
      )}
      {four && capture && (
        <TurnsFourEmail
          turnsFour={`${four.year}-${String(four.month).padStart(2, '0')}`}
          monthLabel={`${MONTHS[four.month - 1]} ${four.year}`}
        />
      )}
      {after && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 0 0' }}>
          {after}
        </p>
      )}
    </div>
  )
}
