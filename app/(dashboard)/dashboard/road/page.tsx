import { redirect } from 'next/navigation'

// THE SPLIT WAS REVERSED, AND THIS ROUTE STAYS AS ITS FORWARDING ADDRESS.
//
// For two days in August 2026 the pathway page was split in two: the stages
// road here, and the passport as a tabbed page of its own. Justin, seeing the
// result: "the passport page is completely wrong, please return to previous
// passport page we designed and we can start again." So the one page at
// /dashboard/pathway is back, exactly as designed, and the redesign will start
// from there rather than from the tabs.
//
// This route survives only because links to it exist in the wild: emails sent
// on 14 and 15 August carry /dashboard/road, and so does any bookmark from
// those two days. The query string is forwarded whole, so ?child= survives.

export default async function RoadRedirect({
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
  redirect(`/dashboard/pathway${query ? `?${query}` : ''}`)
}
