'use client'

import { useEffect, useState } from 'react'
import { FamilyDeal } from '@/app/k/[token]/KidQuestScreen'

// Dev fixture: the child's Our family deal sheet, in the three states the
// child's own signature can drive (14 September 2026).
//
//   /dev/kid-deal              the promises are there, nobody has signed on the
//                              child's side: Your turn, and the I agree button
//   /dev/kid-deal?parent=1     the parent has signed, the child has not: the
//                              tap turns the line green as agreed by both
//   /dev/kid-deal?both=1       agreed by both already, no button
//
// The token is a fixture token, so the agree posts to the real route and gets
// a 404 back: that is the "did not save" line, which is also worth seeing.

const ITEMS = [
  { title: 'Phones at bedtime', body: '8pm on school nights, later at weekends · Every device charges in the kitchen overnight' },
  { title: 'Our extra promises', body: 'How screen time is earned: Jobs earn stars, stars buy screen time\nNew apps and games: We look at it together first' },
]

export default function KidDealFixture() {
  const [open, setOpen] = useState(true)
  const [parent, setParent] = useState(false)
  const [both, setBoth] = useState(false)
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    setParent(q.get('parent') === '1')
    setBoth(q.get('both') === '1')
  }, [])
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--app-bg)', padding: '28px 20px' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: 0 }}>
        Reference · Our family deal · {both ? 'agreed by both' : parent ? 'parent signed' : 'nobody signed'}
      </p>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} style={{ marginTop: 16, padding: '12px 16px', borderRadius: 15, border: '1.5px solid var(--border)', background: '#fff', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
          Open the deal
        </button>
      )}
      {open && (
        <FamilyDeal
          onClose={() => setOpen(false)}
          recommendedMinutes={60}
          goal={null}
          bankBalance={4}
          goalRedeemed={false}
          agreementItems={ITEMS}
          agreementSigned={both}
          agreementParentSigned={parent || both}
          agreementChildSigned={both}
          token="0123456789abcdef01"
        />
      )}
    </main>
  )
}
