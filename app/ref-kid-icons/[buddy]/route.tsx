import { renderHomeIcon } from '@/lib/kid/home-icon'

// The real Home Screen icon renderer, driven by a buddy key instead of a
// database lookup.
//
// The live icon routes resolve the buddy from the child's link token, and the
// sandbox has no service key, so every one of them renders the DiGi fallback
// here. That proves the fallback and nothing else, and the whole point of this
// change is the five faces the fallback is NOT. This calls the same
// renderHomeIcon the live routes call, so what is on screen is what a family
// gets. 404s in production with every other ref- route (middleware.ts).

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: Promise<{ buddy: string }> }) {
  const { buddy } = await params
  // ?band= drives the age fallback, which is the path EVERY child in the
  // database takes today (none of them has a current buddy saved), so it is
  // the one that actually has to be looked at.
  const band = new URL(req.url).searchParams.get('band')
  return renderHomeIcon(band ? null : buddy, 180, band)
}
