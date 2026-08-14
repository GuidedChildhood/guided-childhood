import { redirect } from 'next/navigation'

// ═══ THE WORD PATHWAY CAUSED A WRONG BUILD, SO THE ROUTE GAVE IT UP ════════
//
// Justin, 13 August 2026: "pathway was what I was calling today, the things to
// do today. So anything I asked to be moved to pathway, I meant to rotate on
// the coins on today's things."
//
// Two different things were called the pathway. To Justin it is the daily list
// on Home. In the code it was this route, the stages road from four to sixteen.
// The collision has already cost one wrong build: Your focus was moved to this
// page when he had asked for it to take its turn in the daily rotation, and a
// long comment was written arguing for the wrong home.
//
// So the road is at /dashboard/road, which is what every component on it is
// already called (StageRoad, RoadToSixteen) and what its own copy already says.
// This route stays for ever as a redirect: emails already sent point here, and
// so do bookmarks and anything on a parent's phone home screen.
//
// The lib/pathway folder keeps its name. The collision Justin named is the
// ROUTE, which is the thing he types and talks about; renaming twenty helper
// modules would be a much larger change for no gain in clarity.

export default async function PathwayRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') qs.set(key, value)
  }
  const query = qs.toString()
  redirect(`/dashboard/road${query ? `?${query}` : ''}`)
}
