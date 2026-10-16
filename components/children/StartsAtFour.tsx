import { turnsFourOn } from '@/lib/children/age'

// WE START AT 4, SAID TO THE PARENT RATHER THAN DONE TO THEM.
//
// Justin, 16 October 2026: the parent of a 2 or 3 year old is a customer
// later, not now. Before this, a birthday under 4 was quietly filed under
// ages 4 to 7 and the parent was shown a stage, lessons and scripts written
// for a child twice the age. One card, the same everywhere a birthday is asked:
// what we cover, and when to come back. No email capture, because none exists
// for this moment and a new one is a separate decision.

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'] as const

export default function StartsAtFour({ dob, name, after }: {
  /** The YYYY-MM-01 birthday the parent just gave. */
  dob: string
  /** The child's first name when we have it. */
  name?: string
  /** One closing line for the screen it sits on (an older child, a sibling). */
  after?: string
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
      {after && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '8px 0 0' }}>
          {after}
        </p>
      )}
    </div>
  )
}
