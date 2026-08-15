import TwoDoors from '@/components/access/TwoDoors'
import { TRIAL_DAYS } from '@/lib/access'
import { FOUNDER_CAP } from '@/lib/stripe'

// Layout fixture for the two path block on /dashboard/choose.
//
// The real page cannot be opened by the people who need to read its copy, for
// two separate reasons stacked on top of each other: the middleware only ever
// sends a parent there who has finished setup and not yet chosen, and the
// founder address is permanently allowlisted so it never blocks on his
// account at all. Copy nobody can look at is copy that ships unread, which is
// the same argument /ref-upgrade-block was written for.
//
// It renders the REAL component with made up props, never a copy of its
// markup, so what is checked at 390 and 1280 is what a parent gets.
//
// ?soldout=1 draws the other half of it. The sold out branch is a whole
// different card with a different price in the charge sentence, and it is the
// branch that is impossible to see by accident: it only appears after fifty
// families have paid, which is exactly when nobody has time to find a layout
// bug in it.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

export default async function RefChoose({
  searchParams,
}: {
  searchParams: Promise<{ soldout?: string }>
}) {
  const { soldout } = await searchParams
  return (
    <main style={{ background: 'var(--app-bg)' }}>
      <TwoDoors
        remaining={soldout ? 0 : 37}
        cap={FOUNDER_CAP}
        freeDays={TRIAL_DAYS}
        trialDays={TRIAL_DAYS}
        next="/dashboard"
      />
    </main>
  )
}
