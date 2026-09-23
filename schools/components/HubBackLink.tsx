import Link from 'next/link'
import { hasLicence } from '@/lib/licence'

// The back link at the top of the three OPEN hub pages: the RSHE mapping
// matrix, the data protection pack and the safeguarding crosswalk.
//
// It used to be a plain "← The Hub" on all three. That is right for a school
// with a code and a dead end for everybody else, because /hub itself is
// gated, so the first thing a head or a DSL could click on our own sales
// document bounced them to /unlock.
//
// Found 23 September 2026, an hour after /hub/dsl was opened so a designated
// safeguarding lead could read it. She would have landed on the page written
// for her and hit a wall at the top of it. The same was true of the mapping
// matrix, open since 31 August, which is the page we ask every head to check.
//
// So the link asks who is reading. A licensed school goes back to the Hub it
// paid for. Everyone else goes to the curriculum map, which is open, and is
// the honest next step for somebody still deciding.
export default async function HubBackLink() {
  const licensed = await hasLicence()
  const mono: React.CSSProperties = {
    fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
    letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)',
    textDecoration: 'none',
  }
  return licensed
    ? <Link href="/hub" style={mono}>&larr; The Hub</Link>
    : <Link href="/curriculum" style={mono}>&larr; The curriculum</Link>
}
