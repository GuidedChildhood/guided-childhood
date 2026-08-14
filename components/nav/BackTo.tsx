import Link from 'next/link'

// The way back to where you actually came from.
//
// Justin: "when they are clicking through passport and they click devices or
// moments then it needs to be clever enough to give them a way back to the page
// they clicked it from so they can easily navigate to continue what they were
// doing."
//
// THE SHAPE OF THE PROBLEM. The passport checklist is a list of five things to
// go and do. Every row is a link out, and every destination used to send the
// parent back to Home, which is not where they were and not where the remaining
// four rows are. So a parent working down the list had to find the passport
// again after each one. The list gets longer to work through the more of it you
// have done, which is exactly backwards.
//
// WHY A QUERY PARAM AND NOT THE REFERRER. Already written on the devices page
// and worth keeping in one place: a referrer is stripped by enough browsers and
// privacy settings that the back link would silently change meaning depending
// on the reader's setup. A link that says where it came from always knows.
//
// WHY NOT router.back(). It would go back to whatever was previously in the
// history stack, which after a redirect or a refresh is not the passport, and
// after arriving from an email is nothing at all. This says a place, not a
// direction, so it is right however the parent got here.

/**
 * Where each `from` value goes back to.
 *
 * A small fixed map rather than an arbitrary URL in the query string. Taking a
 * destination from the address bar and turning it into a link is an open
 * redirect, and there is no reason to accept one for a back button.
 */
const ORIGINS: Record<string, { href: string; label: string }> = {
  passport: { href: '/dashboard/passport', label: 'Passport' },
  road: { href: '/dashboard/road', label: 'the road' },
  // The old key, kept because `from=pathway` is already in links out in the
  // wild and a back button that silently does nothing is worse than a rename.
  pathway: { href: '/dashboard/road', label: 'the road' },
  home: { href: '/dashboard', label: 'Home' },
  // Back to the checkup card itself, not the top of Home. Justin: "once done
  // the fix, return to where you clicked fix so they can run down list." A
  // parent working through four red strands should find the next one where
  // they left it, not scroll Home again after every single fix.
  'home-check': { href: '/dashboard#home-check', label: 'the check list' },
  quests: { href: '/dashboard/quests', label: 'Quests' },
  school: { href: '/dashboard/school', label: 'School' },
}

export default function BackTo({
  from,
  fallback = { href: '/dashboard', label: 'Home' },
}: {
  /** The `from` query param. Anything unrecognised falls back. */
  from?: string | null
  /** Where to go when the parent arrived with no origin, from a link or an email. */
  fallback?: { href: string; label: string }
}) {
  const origin = (from && ORIGINS[from]) || fallback
  return (
    <Link
      href={origin.href}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 18,
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700,
        letterSpacing: '0.04em', color: 'var(--ink-muted)', textDecoration: 'none',
      }}
    >
      ‹ {origin.label}
    </Link>
  )
}

/**
 * Add the origin to a link, keeping any query string it already has.
 *
 * Here rather than written out at each call site because four of the five
 * passport rows already carry a `?stage=`, and hand appending is exactly where
 * a `?` gets used twice.
 */
export function withOrigin(href: string, from: string): string {
  return `${href}${href.includes('?') ? '&' : '?'}from=${from}`
}
