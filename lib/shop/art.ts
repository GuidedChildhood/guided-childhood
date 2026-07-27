// The shop's product photography, keyed by product key.
//
// Deliberately here in code rather than in the products.image_url column, for
// the same reason the character art is not in the database: art gets re shot,
// and re shooting should be a commit, not a hand pasted UPDATE against live
// data. The column stays as an escape hatch for a one off product added
// without a deploy, and the UI prefers this file when both exist.
//
// These are renders, not photographs of real stock. Every one is a faithful
// picture of what the supplier brief asks for, generated in the house style:
// one product, warm cream paper, bright even light, soft shadow, nothing else
// in frame. When the real samples arrive from Vograce and the booklet printer,
// swap these for photographs of the actual thing. Selling from a render once
// real stock exists would be the wrong side of honest.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

export const SHOP_ART: Record<string, string> = {
  passport_printed: BASE + 'hf_20260726_161334_0cd5007c-1bfb-4e26-a466-3f783d9d80e6.png',
  sticker_sheet:    BASE + 'hf_20260726_161401_3a8a0d72-fc50-4a07-b525-d3c24bbd9088.png',
  charm_pebble:     BASE + 'hf_20260726_161337_89814f5d-8fd5-488f-b476-6b66fdc3142d.png',
  charm_bloop:      BASE + 'hf_20260726_161339_7ec21532-8856-4b65-9524-48b545251d7c.png',
  charm_orbit:      BASE + 'hf_20260726_161340_a80b0907-1bdf-48af-88d3-270a0e93011a.png',
  charm_nova:       BASE + 'hf_20260726_161348_f6797d34-1bb6-45f0-a754-c88986126018.png',
  charm_cosmo:      BASE + 'hf_20260726_161351_34d0041e-3116-481b-bee9-e107c0fdfd38.png',
  charm_digi:       BASE + 'hf_20260726_161352_aed94cac-68f2-4c5f-b691-2df429fd160e.png',
  charm_set_six:    BASE + 'hf_20260726_161403_898a2e59-d644-4a4c-b598-b5f206a6593e.png',
  charm_bracelet:   BASE + 'hf_20260726_161355_1a4ec61b-ea57-4a10-88a6-c912d412fd4e.png',
  plush_pebble:     BASE + 'hf_20260726_161406_b63515b9-fb95-4de5-8769-f1e54ab7f6e2.png',
}

// The ones we serve ourselves, from /public/shop.
//
// Anything a customer can actually buy has to be here. Hotlinking a third
// party CDN for the photograph on a page that takes money means someone
// else's housekeeping can put a broken image on our checkout, and we would
// find out from a customer rather than from a build.
//
// The coming soon items are still remote. They are not purchasable, nothing
// is charged against them, and the fallback below means the worst case is a
// character illustration rather than a broken box. They get vendored as they
// go on sale.
const VENDORED = new Set(['passport_printed', 'sticker_sheet'])

/** The picture to show for a product, or null to fall back to character art. */
export function shopArt(key: string, imageUrl?: string | null): string | null {
  if (VENDORED.has(key)) return `/shop/${key}.webp`
  return SHOP_ART[key] ?? imageUrl ?? null
}
