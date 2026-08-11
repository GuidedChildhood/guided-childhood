import FriendsPoster from '@/components/printables/FriendsPoster'

// The Planet Friends poster on a route with no auth and no database, so it can
// be printed to a real PDF and measured.
//
// Justin, 11 August 2026: "this printable is not good enough, needs to be
// bigger, and images of exact Planet Friends bigger, and this is for under 10s
// I would say."
//
// The live page reads two counters for a signed in parent, which means the only
// way anybody had ever seen this sheet was to be logged in as a family with the
// right number of completed days. That is why it went out with matchbox sized
// characters: nobody could look at the version a child would actually get
// without inventing an account for it.
//
//   /dev/friends-poster            nothing earned yet, every Friend in outline
//   /dev/friends-poster?days=22    three home, two still coming
//   /dev/friends-poster?days=58    the whole family home
//
// scripts/check-friends-poster.mjs drives all three and measures the printed
// character art out of a real PDF.

export const metadata = { title: 'Friends poster fixture' }

export default async function FriendsPosterFixture({
  searchParams,
}: {
  searchParams: Promise<{ days?: string; name?: string }>
}) {
  const { days, name } = await searchParams
  const parsed = Number(days)
  return (
    <FriendsPoster
      childName={name ?? 'Teo'}
      fullDays={Number.isFinite(parsed) ? parsed : 0}
    />
  )
}
