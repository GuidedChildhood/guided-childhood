'use client'

import TimeTiersCard from '@/components/quests/TimeTiersCard'

// Layout fixture for a child's three kinds of time.
//
// The card reads /api/quests/time/settings, which needs a parent session and a
// service key, so in the sandbox it would render nothing at all. The browser
// check stubs that ONE route with Playwright and mounts the real component, so
// what is on screen is the real card with real copy rather than a replica that
// proves nothing.
//
// What has to be looked at here, because none of it shows up in a typecheck:
// the age guide line beside the free time row, the hour before bed line, the
// one tap back to the age window, and the time fields not writing while the
// picker is being scrolled. 404s in production via middleware, like every
// other ref-* page.

export const dynamic = 'force-dynamic'

export default function RefTimeTiers() {
  return (
    <main style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '22px 16px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <TimeTiersCard childId="00000000-0000-0000-0000-000000000000" childName="Bumble" />
      </div>
    </main>
  )
}
