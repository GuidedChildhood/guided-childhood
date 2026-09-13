// THE LEGAL IDENTITY, DECLARED ONCE.
//
// Justin, 13 September 2026: the company is Guided Digital Childhood Ltd,
// incorporated 24 June 2026, and it is not VAT registered. Before this file
// the only corporate line on the schools site was a copyright notice with a
// person's name on it, which a school's finance system cannot raise a
// purchase order against. Every footer, invoice line and data protection
// statement reads from here, so the entity can never be written two ways.
export const COMPANY = {
  name: 'Guided Digital Childhood Ltd',
  number: '17299814',
  address: 'Apple Acre, Star, Winscombe, BS25 1QF',
  jurisdiction: 'England and Wales',
  incorporated: '24 June 2026',
  vatRegistered: false,
  email: 'hello@guidedchildhood.com',
} as const

/** One sentence for a footer or a document: who you are dealing with. */
export const LEGAL_LINE = `${COMPANY.name}, company number ${COMPANY.number}, registered in ${COMPANY.jurisdiction}. Registered office: ${COMPANY.address}.`

/** The VAT position, said plainly, because a school reads the price as the invoice total. */
export const VAT_LINE = COMPANY.vatRegistered
  ? 'Prices exclude VAT, which is added at the standard rate on the invoice.'
  : `${COMPANY.name} is not VAT registered, so the price you see is the price on the invoice, with no VAT added.`
