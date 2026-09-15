import { renderHomeIcon, childIconKeys } from '@/lib/kid/home-icon'

// The Home Screen icon for a child's quest page: their own Planet Friend on
// that Friend's colour, so on a tablet two children share, the two icons are
// two different faces rather than the same star twice.
//
// Served by Next's icon convention, so Add to Home Screen picks it up without
// the page asking for anything. Why the Friend and not the child's name is in
// lib/kid/home-icon.tsx.
//
// Dynamic because the answer lives in the database. Fails soft to DiGi, which
// is the icon every child had before this, so the worst case is the old
// behaviour rather than a missing icon.

export const dynamic = 'force-dynamic'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default async function AppleIcon({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { buddy, ageBand } = await childIconKeys(token)
  return renderHomeIcon(buddy, size.width, ageBand)
}
