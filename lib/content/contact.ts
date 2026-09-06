// Who we are and how to reach us, in one place.
//
// Justin, 8 August 2026: "Make sure we have contact details on home page my
// name address email hello@guided."
//
// These were scattered: the email existed as a Contact link label on the
// homepage and in the body of four other pages, the name sat in a copyright
// line at 35 per cent opacity, and the postal address did not exist anywhere in
// the repo at all. A visitor could not find out who they were buying from
// without opening the terms.
//
// It is also the law rather than a nicety. A UK business selling online has to
// give its name, a geographic address and an email, and it has to be easy to
// find. A mailto behind the word "Contact" is not that.

export const CONTACT = {
  /**
   * The name that carries the copyright line.
   *
   * Justin, 9 August 2026: "Not by the social billboard." Guided Childhood is
   * its own thing, not a product of it. He founded both, which is what the
   * about paragraph on the homepage says, and that is a different claim from
   * one being owned by the other. So the footer names Guided Childhood and
   * nothing else.
   *
   * NOT the registered legal entity, because nobody has told me what that is.
   * If a company sits behind this, its registered name and number belong here
   * and on the terms page, and that matters for the ICO registration going in
   * today. Asked rather than guessed.
   */
  business: 'Guided Childhood',
  /** The product, which is what a visitor actually recognises. */
  product: 'Guided Childhood',
  /** The person behind it, because families buy from a person here. */
  founder: 'Justin Phillips',
  email: 'hello@guidedchildhood.com',

  /**
   * The geographic address, required for online selling.
   *
   * Given by Justin, 9 August 2026: "Apple Acre, Winscombe, star, BS25 1QF".
   *
   * Written here in Royal Mail order rather than the order he typed it, which
   * is the one judgement call in this file. Star is the hamlet and Winscombe is
   * the post town for BS25, so the locality goes above the post town. Post
   * addressed the other way round still arrives, but the post town line is what
   * sorting reads, and an address on a website is the one a solicitor or the
   * ICO copies without checking it.
   *
   * One line per row, in the order it would be written on an envelope.
   */
  address: ['Apple Acre', 'Star', 'Winscombe', 'BS25 1QF'] as string[],

  /**
   * The registered company behind the product.
   *
   * Justin, 6 September 2026, answering the audit: "limited co". The exact
   * registered name, the company number and the registered office are not
   * yet given, so all three are empty and every surface that would print
   * them prints nothing until they are filled. Never a guess on a legal page.
   */
  companyName: '',
  companyNumber: '',
  registeredOffice: [] as string[],
} as const

/** True once the registered company details above have been filled in. */
export function hasCompany(): boolean {
  return CONTACT.companyName.length > 0 && CONTACT.companyNumber.length > 0
}

/** One plain sentence naming the company, or an empty string until it is known. */
export function companyLine(): string {
  if (!hasCompany()) return ''
  const office = CONTACT.registeredOffice.length > 0 ? `, registered office ${CONTACT.registeredOffice.join(', ')}` : ''
  return `Guided Childhood is operated by ${CONTACT.companyName}, a company registered in England and Wales (company number ${CONTACT.companyNumber})${office}.`
}

/** True once a real address has been filled in above. */
export function hasAddress(): boolean {
  return CONTACT.address.length > 0
}
