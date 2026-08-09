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
  /** The trading name, as it appears in the copyright line and on invoices. */
  business: 'The Social Billboard',
  /** The product, which is what a visitor actually recognises. */
  product: 'Guided Childhood',
  /** The person behind it, because families buy from a person here. */
  founder: 'Justin Phillips',
  email: 'hello@guidedchildhood.com',

  /**
   * The geographic address, required for online selling.
   *
   * EMPTY ON PURPOSE, waiting on Justin. Inventing one would be worse than
   * having none: an address is a legal statement about where a business can be
   * served, and a plausible looking wrong one is the failure that actually
   * costs something. Every place that renders it checks for empty first, so the
   * block simply omits the line until the real address lands here.
   *
   * One line per row, in the order it would be written on an envelope.
   */
  address: [] as string[],
} as const

/** True once a real address has been filled in above. */
export function hasAddress(): boolean {
  return CONTACT.address.length > 0
}
