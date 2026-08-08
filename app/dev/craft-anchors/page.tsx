import CraftPack from '@/app/(dashboard)/dashboard/quests/crafts/CraftPack'

// A harness for the game pack, so the sheet anchors can be driven.
//
// Justin, 8 August 2026: "Play good night screens should take you there." A job
// row now links to /dashboard/quests/crafts#<slug>, and a hash into a page that
// does not carry that id is the quietest kind of broken link: the route
// resolves, nothing errors, and the parent is simply at the top of a nine sheet
// page wondering which one was meant.
//
// The real page is behind auth, so this renders the same component on a bare
// route where the ids can actually be checked.

export const dynamic = 'force-static'

export default function CraftAnchorsFixture() {
  return <CraftPack childName="Teo" />
}
