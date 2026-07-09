import { NextResponse } from 'next/server'
import { resolveMx } from 'dns/promises'

// Is the forwarding address actually able to receive mail yet? A parent who
// forwards to a domain with no MX record gets a silent bounce and blames us.
// This checks the one thing that causes that: whether the inbound domain has
// an MX record at all. Live means a forward will be delivered; not live means
// the DNS or provider setup is not finished, and we can warn instead of
// letting the mail bounce quietly.

const INBOUND_DOMAIN = process.env.SCHOOL_INBOUND_DOMAIN ?? 'in.guidedchildhood.com'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const records = await resolveMx(INBOUND_DOMAIN)
    const live = Array.isArray(records) && records.length > 0
    return NextResponse.json({ live, domain: INBOUND_DOMAIN, mx: records.map(r => r.exchange) })
  } catch {
    // No MX record, or the domain does not resolve. Either way, not ready.
    return NextResponse.json({ live: false, domain: INBOUND_DOMAIN, mx: [] })
  }
}
