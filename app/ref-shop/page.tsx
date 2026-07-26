import Shop from '@/components/shop/Shop'
import type { Product } from '@/lib/shop/catalogue'

// Fixture reference page: the REAL shop component with made up rows, so the
// layout can be seen and screenshotted without migration 102 having run and
// without a logged in parent. Not linked from anywhere.
//
// ?earned=3 sets how many Planet Friends the fixture family has, which is the
// only thing that changes what a card looks like. ?ordered=1 shows the thank
// you banner a parent sees coming back from Stripe.

export const dynamic = 'force-dynamic'

const P = (p: Partial<Product> & { key: string; name: string; price_pence: number; kind: Product['kind'] }): Product => ({
  blurb: '', character_key: null, min_earned: 0, personalised: false,
  image_url: null, sort: 0, active: true, ...p,
})

const PRODUCTS: Product[] = [
  P({ key: 'passport_printed', name: 'The printed passport', price_pence: 1400, kind: 'passport', personalised: true, sort: 10,
      blurb: 'A keepsake quality A6 booklet of their real digital passport. Their name on the cover, every stage they have actually stamped printed inside. Made to order, so no two are the same.' }),
  P({ key: 'sticker_sheet', name: 'Planet Friends sticker sheet', price_pence: 400, kind: 'stickers', sort: 20,
      blurb: 'DiGi and all five Planet Friends, plus the five stage stamps, on one glossy sheet. For the fridge, the folder, the back of the bedroom door.' }),
  P({ key: 'charm_pebble', name: 'Pebble charm', price_pence: 500, kind: 'charm', character_key: 'pebble', min_earned: 1, sort: 30, active: false,
      blurb: 'Pebble as a chunky charm for shoes, a bag or a keyring. Earned in the app first.' }),
  P({ key: 'charm_cosmo', name: 'Cosmo charm', price_pence: 500, kind: 'charm', character_key: 'cosmo', min_earned: 5, sort: 34, active: false,
      blurb: 'Cosmo as a chunky charm for shoes, a bag or a keyring. Earned in the app first.' }),
  P({ key: 'charm_set_six', name: 'The whole family, set of six', price_pence: 2200, kind: 'charm_set', min_earned: 5, sort: 40, active: false,
      blurb: 'All five Planet Friends plus DiGi, boxed as a set, at a saving on buying them one at a time.' }),
  P({ key: 'plush_pebble', name: 'Pebble plush', price_pence: 2800, kind: 'plush', character_key: 'pebble', min_earned: 1, sort: 60, active: false,
      blurb: 'Super soft, marshmallow round, embroidered face. Made in a campaign run, so it only happens when enough families want one.' }),
]

export default async function RefShop({ searchParams }: { searchParams: Promise<{ earned?: string; ordered?: string }> }) {
  const { earned, ordered } = await searchParams
  return (
    <Shop
      products={PRODUCTS}
      earned={Math.max(0, Math.min(5, Number(earned) || 0))}
      childName="Ivy"
      email="parent@example.com"
      ordered={ordered === '1'}
    />
  )
}
