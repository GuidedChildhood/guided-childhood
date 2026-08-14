'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// The CTA at the foot of the passport page, which asks a different thing of a
// parent who already has an account.
//
// Justin: "at the botto it has start it's free but they are already registered
// if they see thus page so should direct then to passport not ti re set up".
// He is right, and it is worse than a wasted tap: "Start, it is free" sends a
// signed in parent to /starter-pack, which is the build your child's pathway
// flow. A parent who has already done that, reading the page that explains
// what their passport IS, was being invited to set one up again.
//
// Checked in the browser rather than on the server on purpose. This is a
// marketing page and reading auth in the server component would make it
// dynamic for everyone, losing the cache on the page most likely to be shared
// and hit cold. Signed out is the default and what renders first, so a visitor
// who has never logged in sees the right thing immediately and nothing flashes
// at them; only the signed in minority get a swap, and they are the ones the
// swap is for.

export default function PassportPageCta() {
  const [signedIn, setSignedIn] = useState(false)

  useEffect(() => {
    let live = true
    createClient().auth.getUser()
      .then(({ data }) => { if (live && data.user) setSignedIn(true) })
      .catch(() => { /* signed out is the safe default and already rendered */ })
    return () => { live = false }
  }, [])

  const BODY: React.CSSProperties = {
    fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2.6vw, 1.1rem)',
    color: 'var(--ink)', lineHeight: 1.7,
  }

  return (
    <>
      <h2 style={{
        fontFamily: 'var(--font-display)', fontWeight: 900,
        fontSize: 'clamp(1.5rem, 5vw, 2.1rem)', color: 'var(--ink)',
        letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '16px',
      }}>
        {signedIn ? 'Your passport is waiting' : 'Start building the passport tonight'}
      </h2>
      <p style={{ ...BODY, maxWidth: '480px', margin: '0 auto 28px' }}>
        {signedIn
          ? 'One page per stage, filling as your child goes. Pick up wherever you left off.'
          : 'A couple of minutes to build your child’s pathway, then free access to the platform. No card. The ramp to 16 starts wherever your child is now.'}
      </p>
      <Link
        href={signedIn ? '/dashboard/passport' : '/starter-pack'}
        className="btn btn-gold"
        style={{ display: 'inline-flex', fontSize: 'clamp(1rem, 3vw, 1.15rem)', padding: '17px 36px' }}
      >
        {signedIn ? 'See your passport' : 'Start, it is free'}
      </Link>
    </>
  )
}
