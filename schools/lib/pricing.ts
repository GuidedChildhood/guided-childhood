// The five band structure, decided 13 August 2026. The per pupil figure sits
// next to every price on purpose: £795 sounds like money, £1.59 per child
// per year does not, and they are the same number.
//
// Corrected 9 September 2026. Three things in the original note were wrong.
//
// The headline. Every page led with "from £1.50 per pupil per year", but
// £1.50 is only reachable in the secondary band at a thousand pupils. A
// primary, which is the main target, pays £2.48 or £1.59. The pages now
// lead with "from £495 a year", which is a real number any school can act
// on and the same money. The per pupil line stays under each band, where
// it does its job without being a claim a head can check and find wrong.
//
// The claim that the smallest schools no longer pay the most per pupil.
// They still do. Primary small at £2.48 is the highest per pupil rate of
// the five bands. That is a defensible thing to charge, because a small
// school costs the same to support, but it should not be described as the
// opposite of what it is.
//
// The competitor benchmark. The note said Jigsaw starts around £795 and
// Kapow prices from £1.80 per child. Verification found Jigsaw starting at
// £495 for a whole primary and Kapow at £300 flat with unlimited users, so
// the bands may have been set against figures that were too high. A fuller
// competitor check is running; revisit the band levels when it lands.

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

// One licence, everything in it, opened by one code for the whole staff
// room. There is no seat counting and no per teacher price, because the
// thing being bought is whole school delivery: every module, printed,
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
