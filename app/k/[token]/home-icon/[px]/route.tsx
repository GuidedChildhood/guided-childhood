import { NextResponse } from 'next/server'
import { renderHomeIcon, childIconKeys } from '@/lib/kid/home-icon'

// The same icon at the two sizes a web app manifest asks for.
//
// apple-icon.tsx covers iOS, which takes one 180. Android and the desktop
// install both read the manifest's icons array and want 192 and 512, and until
// now that array pointed at /icons/icon-192.png, the PARENT app's logo. So a
// child who installed from an Android tablet got the company mark while a child
// on an iPhone got DiGi, and on a shared Android tablet every child got the
// same mark as every other.
//
// One renderer behind all three, so an icon cannot mean one thing on one
// device and another thing on the next.

export const dynamic = 'force-dynamic'

const ALLOWED = new Set([192, 512])

export async function GET(_req: Request, { params }: { params: Promise<{ token: string; px: string }> }) {
  const { token, px } = await params
  const size = Number(px)
  // Only the two the manifest names. An open size parameter is an invitation to
  // render an 8000 square image on our bill.
  if (!ALLOWED.has(size)) return new NextResponse('Not found', { status: 404 })
  if (!/^[0-9a-f]{18}$/.test(token)) return new NextResponse('Not found', { status: 404 })
  const { buddy, ageBand } = await childIconKeys(token)
  return renderHomeIcon(buddy, size, ageBand)
}
