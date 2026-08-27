'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client'

// The two buttons in the marketing header, which now know whether they are
// talking to a stranger or to a member.
//
// Justin, 12 August 2026, working through the go live and hitting the thing
// that had never been thought about: "so how does this work with the homepage?
// And when they log in, I'm a bit confused."
//
// ── THE PROBLEM HE FOUND ────────────────────────────────────────────────────
//
// app/page.tsx has no auth check anywhere in it, so a parent who is signed in
// and types guidedchildhood.com gets the SALES PAGE. Log in, and Get Started
// pointing at the trial funnel, for a product they already pay for. Every
// consumer app sends you to your own screen once it knows who you are.
//
// That mattered little while the app lived on a preview URL nobody typed. It
// matters the moment www is the app, because typing the brand into the address
// bar becomes the most natural way in and it is the one route that does not
// know them.
//
// ── WHY NOT JUST REDIRECT ───────────────────────────────────────────────────
//
// The obvious fix is a session check in app/page.tsx that redirects a signed in
// parent to /dashboard, and it is the wrong trade. That page is static. It is
// also the single most important page for the people who have never heard of
// us, and reading a session on the server makes it dynamic for every one of
// them: an auth round trip in front of the landing page, on every cold visit,
// to serve the small minority who are already members.
//
// So the check happens HERE, in the browser, after the page has already been
// delivered. The static HTML still ships instantly with the stranger's version,
// which is the correct default and the one that must never be slow. A member's
// browser then swaps two buttons a moment later. Strangers pay nothing.
//
// ── WHY IT DOES NOT FLICKER ─────────────────────────────────────────────────
//
// `known` starts null, meaning not asked yet, rather than false. Both states
// render the same two buttons in the same places at the same size, and only
// the words and the destination change, so the swap is a text change rather
// than a layout shift. Nothing appears, disappears or moves.
//
// Fails to the stranger's version on purpose. A missing env var, an auth
// outage, a browser with storage blocked: all of them leave the buttons
// exactly as they render today, which is the version that works for everybody.

export default function HeaderActions() {
  // null = not asked yet. Deliberately not false, so the comment above holds.
  const [known, setKnown] = useState<boolean | null>(null)

  useEffect(() => {
    // A build made without the Supabase env vars points at a domain that does
    // not exist, and asking would throw. The header is not the place to find
    // that out, and LoginForm already reports it where it matters.
    if (!isSupabaseConfigured()) return
    let live = true
    createClient().auth.getSession()
      .then(({ data }) => { if (live) setKnown(!!data.session) })
      .catch(() => { /* stays as the stranger's version, which is correct */ })
    return () => { live = false }
  }, [])

  const member = known === true

  return (
    // is-member lets the phone header drop the Settings pill for members only:
    // "Settings" plus "My dashboard" is four characters wider than "Log in"
    // plus "Get Started" and ran off the right edge of an iPhone (Justin's
    // screenshot, 27 Aug 2026). Settings stays one tap away inside the
    // dashboard, and a stranger's Log in never disappears.
    <div className={member ? 'hdr-actions is-member' : 'hdr-actions'} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(7px, 1.5vw, 13px)', flexShrink: 0 }}>
      {/* "Settings", not "Account", and that came from Justin using it:
          "when I click Account, when I visit the homepage again, it takes me to
          the settings page." It always did, because settings IS where the plan,
          the billing and the family live and there is no separate account page.
          The word was writing a cheque the destination did not cash. Settings
          is the plainer word and it is the one on the door it opens, which
          matters most on a laptop where the header is read rather than tapped
          past. */}
      <Link href={member ? '/dashboard/settings' : '/login'} className="hdr-login">
        {member ? 'Settings' : 'Log in'}
      </Link>
      <Link href={member ? '/dashboard' : '/starter-pack'} className="btn btn-green hdr-cta">
        {member ? 'My dashboard' : 'Get Started'}
      </Link>
    </div>
  )
}
