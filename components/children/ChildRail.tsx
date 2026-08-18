'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import ChildSwitcher, { type SwitcherChild } from './ChildSwitcher'

// ── THE SWITCHER LIVES IN THE LAYOUT NOW ────────────────────────────────────
//
// Justin, 18 August 2026: "just checking that the whole platform has a child
// selector for each part that works for each child."
//
// It did not. Two pages drew their own switcher and the other fourteen drew
// none, so choosing Alma on Home and tapping Lessons put you back on Teo
// without a word. A parent cannot be asked to re-choose their child on every
// screen; the choice has to follow them.
//
// So the rail is rendered once, by the dashboard layout, and every per child
// page inherits it. That is also why ChildSwitcher itself is untouched: it
// still just draws pills. This decides WHERE they appear and WHICH is lit.
//
// A layout cannot read searchParams in the App Router (only pages can), which
// is the whole reason this is a client component: useSearchParams is the only
// way the shared chrome can see ?child= at all.
//
// See plans/multi-child-two-session-contract.md, section 3. The passport
// session renders none of its own, by agreement.

// WHERE A CHILD IS THE SUBJECT.
//
// Not every dashboard page is about one child. Settings, billing and the setup
// quest are about the FAMILY, and putting a child chooser on them would offer a
// choice that changes nothing, which is worse than offering none: it teaches a
// parent that the pills are decorative.
//
// Exact match for Home, prefix match for the rest, so a lesson or a quest sub
// page keeps the rail its parent had.
//
// /dashboard/pathway and /dashboard/passport are DELIBERATELY ABSENT while the
// passport rebuild is in flight in the other session. Those two pages still
// carry a switcher of their own, and two switchers on one page can disagree.
// They are added here the moment that rebuild lands and its inner switcher
// goes, which is agreed rather than assumed.
const CHILD_ROUTES = [
  // The check in walks one child at a time and hands on to the next by button,
  // but the pills still belong here: a parent who wants to answer about the
  // younger one first should not have to finish the elder's list to get there.
  '/dashboard/checkin',
  '/dashboard/scripts',
  '/dashboard/stats',
  '/dashboard/devices',
  '/dashboard/lessons',
  '/dashboard/moments',
  '/dashboard/daily',
  '/dashboard/digi',
]

export default function ChildRail({ kids, forceShow = false }: { kids: SwitcherChild[]; forceShow?: boolean }) {
  const pathname = usePathname()
  const params = useSearchParams()

  if (kids.length < 2) return null

  // forceShow is for the /ref-child-rail layout fixture only, so the pills can
  // be checked at 390 and 1280 without a login. Nothing in the app passes it.
  const onChildPage = forceShow || pathname === '/dashboard' || CHILD_ROUTES.some(r => pathname.startsWith(r))
  if (!onChildPage) return null

  // The selected child, read the same way the server pages read it: the param
  // when it names one of ours, the primary child otherwise. Deliberately NOT
  // held in state. The URL is the single source of truth, so the pills cannot
  // drift from the page they sit above.
  const param = params.get('child')
  const selected = (param && kids.some(k => k.id === param) ? param : null)
    ?? kids.find(k => k.is_primary)?.id
    ?? kids[0]?.id
    ?? null

  // Keep every OTHER param the page is using. The lessons page carries ?stage=
  // and several pages carry ?from= for the back link, and rebuilding the URL
  // from the pathname alone silently dropped them, which sent a parent back to
  // the wrong place after switching child.
  const rest = new URLSearchParams(params.toString())
  rest.delete('child')
  const basePath = rest.toString() ? `${pathname}?${rest.toString()}` : pathname

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '16px 20px 0' }}>
      <ChildSwitcher kids={kids} selectedId={selected} basePath={basePath} />
    </div>
  )
}
