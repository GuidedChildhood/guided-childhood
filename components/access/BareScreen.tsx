'use client'

import { useEffect } from 'react'

// STRIP THE APP CHROME FOR A SCREEN THAT MUST BE ANSWERED.
//
// Justin, 18 August 2026, looking at the two doors: "when this page comes up
// there are no tabs at top, so just this page before proceeding."
//
// He is right, and it is not only tidiness. This is the one screen in the
// product that asks for money, and it is a BLOCKING decision: the middleware
// puts a parent back on it precisely so it cannot be skipped. Leaving the nav
// above it hands them seven ways to leave without answering, which quietly
// undoes the reason the screen is a route rather than a step in the wizard.
// See the note at the top of TwoDoors for why that distinction was hard won.
//
// ── WHY A BODY CLASS RATHER THAN A DIFFERENT LAYOUT ─────────────────────────
//
// The chrome lives in app/(dashboard)/dashboard/layout.tsx, which is a SERVER
// component and so cannot read the pathname. The App Router alternatives are
// both worse than they look: a nested layout wraps the parent rather than
// replacing it, so the nav would still be there, and moving the route out of
// the group would either change the URL, which emails and the middleware
// already point at, or collide with the existing /dashboard path.
//
// So the page says what it needs and the shell listens. One class, removed on
// unmount, so nothing leaks into the next page a parent visits.
export default function BareScreen() {
  useEffect(() => {
    document.body.classList.add('gc-bare')
    return () => document.body.classList.remove('gc-bare')
  }, [])
  return null
}
