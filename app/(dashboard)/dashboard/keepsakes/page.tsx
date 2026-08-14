import { redirect } from 'next/navigation'

// The shop is a tab on the passport now, which is where Justin put it on
// 13 August: "click for passport, click to buy passport and stickers."
//
// This route stays only to keep old links working: bookmarks, the Home tiles
// and the quest shortcuts, and above all a Stripe session that was created
// before the deploy and comes back to the address it was given. The query
// string is forwarded whole, so ?ordered=<id> still lands on the thank you
// banner rather than on a cold shop.

export default async function KeepsakesRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string') qs.set(key, value)
  }
  // Last, so this route can only ever land on the shop whatever it was handed.
  qs.set('tab', 'shop')
  redirect(`/dashboard/passport?${qs.toString()}`)
}
