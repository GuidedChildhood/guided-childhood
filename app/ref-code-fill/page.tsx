'use client'

import { useState } from 'react'
import PassportPage from '@gc/shared/components/PassportPage'

// The fill a parent sees when a home code lands, without a login.
//
// The card at the foot of the lessons page draws this and plays the ring
// sweep, the four area bars and the seal pulse. It is a shared component
// that has only ever rendered inside the SCHOOLS app, so this fixture exists
// to prove it renders correctly in the parents app too: the stage tokens
// resolve, the Planet Friend art loads from the CDN, and the fill runs.
//
// Press the button to replay it, which is also how the second code of an
// evening is meant to behave (SchoolCodeCard keys the component by module).
//
// Middleware 404s every /ref- route in production.

export default function RefCodeFill() {
  const [n, setN] = useState(0)
  const [filled, setFilled] = useState(false)

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 16px 80px' }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Ref: the code lands</p>
      <button
        type="button"
        onClick={() => { setFilled(false); setN(v => v + 1); setTimeout(() => setFilled(true), 30) }}
        className="btn btn-primary"
        style={{ marginBottom: 20 }}
      >
        Play the fill
      </button>
      <PassportPage
        key={n}
        placement="builder"
        moduleId="ks2-09-copyright-ownership"
        taught={['ks2-06-how-algorithms-work', 'ks2-07-privacy-reputation']}
        filled={filled}
        animate
        register="playful"
        compact
      />
    </div>
  )
}
