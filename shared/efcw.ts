// The eight strands of Education for a Connected World (UKCIS, 2020
// edition), the single source both products name them from. Before this
// file the list lived four times over: in curriculum-badges, in the
// schools curriculum, in an email template and in page prose, and the
// wordings had already started to drift. One list, one spelling, no
// dashes, exactly as the framework titles them.

export const EFCW_STRANDS = [
  'Self image and identity',
  'Online relationships',
  'Online reputation',
  'Online bullying',
  'Managing online information',
  'Health, wellbeing and lifestyle',
  'Privacy and security',
  'Copyright and ownership',
] as const

export type EfcwStrand = (typeof EFCW_STRANDS)[number]
