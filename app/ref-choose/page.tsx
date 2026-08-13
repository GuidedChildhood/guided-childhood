import TwoDoors from '@/components/access/TwoDoors'
import { TRIAL_DAYS } from '@/lib/access'
import { FOUNDER_CAP } from '@/lib/stripe'

// Layout fixture for the two door block on /dashboard/choose.
//
// The real page cannot be opened by the people who need to read its copy, for
// two separate reasons stacked on top of each other: the middleware only ever
// sends a parent there who has checked in once and not yet chosen, and the
// founder address is permanently allowlisted so it never blocks on his
// account at all. Copy nobody can look at is copy that ships unread, which is
// the same argument /ref-upgrade-block was written for.
//
// It renders the REAL component with made up props, never a copy of its
// markup, so what is checked at 390 and 1280 is what a parent gets.
//
// 404s in production via middleware, like every other ref-* page.

export const dynamic = 'force-dynamic'

export default function RefChoose() {
  return (
    <main style={{ background: 'var(--app-bg)' }}>
      <TwoDoors
        remaining={37}
        cap={FOUNDER_CAP}
        freeDays={TRIAL_DAYS}
        trialDays={TRIAL_DAYS}
        next="/dashboard"
      />
    </main>
  )
}
