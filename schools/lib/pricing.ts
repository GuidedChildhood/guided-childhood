// The five band structure, decided 13 August 2026. The per pupil figure sits
// next to every price on purpose: £795 sounds like money, £2.65 per child
// per year does not, and they are the same number. Jigsaw starts around
// £795 and Kapow prices from £1.80 per child, so these bands sit at the
// market rate rather than under half of it, and the smallest schools no
// longer pay the most per pupil.

export type PricingBand = {
  key: string
  tier: string
  pupils: string
  price: string
  perPupil: string
  featured?: boolean
  onApplication?: boolean
}

export const PRICING_BANDS: PricingBand[] = [
  { key: 'primary_small', tier: 'Primary', pupils: 'Up to 200 pupils', price: '£495', perPupil: 'from £2.48 per pupil per year' },
  { key: 'primary_large', tier: 'Primary', pupils: '200 to 500 pupils', price: '£795', perPupil: 'from £1.59 per pupil per year', featured: true },
  { key: 'secondary', tier: 'Secondary', pupils: 'Up to 1,000 pupils', price: '£1,495', perPupil: 'from £1.50 per pupil per year' },
  { key: 'secondary_large', tier: 'Secondary', pupils: '1,000 pupils and above', price: '£1,995', perPupil: 'under £2 per pupil per year' },
  { key: 'trust', tier: 'Trust or MAT', pupils: 'Every school in the trust', price: 'On application', perPupil: 'priced per school, not per pupil', onApplication: true },
]

// One licence, everything in it. The open catalogue stays free for any
// teacher to try, which is exactly why the licence does not need to be
// cheap: the paid tier is whole school delivery with everything printed,
// evidenced and supported.
export const LICENCE_INCLUDES = [
  'All 21 modules, Reception to Year 13, and every update through the year',
  'The word for word teacher script on every slide',
  'Every printable pack, pupil booklet and knowledge organiser',
  'The compliance Hub: RSHE 2025 mapping, policy text, DPIA support, DSL notes',
  'Staff CPD briefings for every sensitive module',
  'Parent notes home for every module',
  'Unlimited teacher use across the school',
  'Invoice payment with 30 day terms. No card, no online checkout',
]
