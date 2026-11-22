import { NextRequest, NextResponse } from 'next/server'

import { normaliseLinkCode } from '@/lib/school/link'
import { utmFor } from '@/lib/school/parent-pack'

// The short school link on the parent pack: /go/<school>.
//
// A school with no Guided Childhood code still needs a link short enough to
// print on a poster and scan from the back of a hall. This one forwards to the
// stage check with the school's UTM tags, which PostHog keeps, so the visit is
// counted for that school. It stores nothing and sets no cookie: a school WITH
// a code uses /s/<code>, which remembers the school on the family's profile.
//
// Anything that is not a valid slug still lands on the stage check, untagged.

export function GET(req: NextRequest, { params }: { params: Promise<{ school: string }> }) {
  return params.then(({ school }) => {
    const slug = normaliseLinkCode(school)
    const to = new URL('/starter-pack', req.nextUrl.origin)
    if (slug) to.search = utmFor(slug)
    return NextResponse.redirect(to, 307)
  })
}
