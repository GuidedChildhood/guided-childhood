import FlashpointsView from '@/app/(dashboard)/dashboard/flashpoints/FlashpointsView'
import { FAMILY_FLASHPOINTS } from '@/lib/content/family-flashpoints'

// Dev fixture: the usual rows for an 11 year old called Ava, with the room
// already claimed, so the page can be checked at 390 and 1280 without a signed
// in parent. ?open=messy_room in the hash opens a row. Posts will 401 here.

export const dynamic = 'force-dynamic'

export default function FlashpointsFixture() {
  const titles = [...new Set(FAMILY_FLASHPOINTS.flatMap(f => f.proof.scripts))]
  const scriptAt = new Map(titles.map((t, i) => [t, i + 1]))
  return <FlashpointsView kid="Ava" band="11-13" childId="fixture-child" mine={new Set(['messy_room'])} scriptAt={scriptAt} />
}
