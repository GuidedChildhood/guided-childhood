import { redirect } from 'next/navigation'

// THE TABBED PASSPORT WAS REVERSED, AND THIS ROUTE STAYS AS ITS FORWARDING
// ADDRESS.
//
// For two days in August 2026 this was a real page: the passport book, an is
// it working tab, the four strands and the shop, behind four pastel tabs.
// Justin, seeing it live: "the passport page is completely wrong, please
// return to previous passport page we designed and we can start again." So the
// passport lives back on /dashboard/pathway, in the header where he put it,
// and the redesign starts from there.
//
// Links to this route exist in the wild: emails sent on 14 and 15 August, the
// nav on anybody's open phone, and Stripe return URLs created while the shop
// tab was live. Each old tab forwards to where its content actually is now,
// so a parent coming back from a Stripe checkout still lands on the shop and
// still sees the thank you banner.

export default async function PassportRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && key !== 'tab') qs.set(key, value)
  }
  const query = qs.toString()
  const tab = typeof params.tab === 'string' ? params.tab : undefined

  // The shop tab, including a Stripe return carrying ?ordered= or ?cancelled=.
  if (tab === 'shop') redirect(`/dashboard/keepsakes${query ? `?${query}` : ''}`)
  // The other two tabs land on the section of the one page that holds them.
  if (tab === 'working') redirect(`/dashboard/pathway${query ? `?${query}` : ''}#is-it-working`)
  if (tab === 'four') redirect(`/dashboard/pathway${query ? `?${query}` : ''}#four-things`)
  redirect(`/dashboard/pathway${query ? `?${query}` : ''}#passport`)
}
