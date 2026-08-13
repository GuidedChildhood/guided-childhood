// The one a week rule, as arithmetic, with nothing else attached to it.
//
// Justin, 12 August 2026: "we must be careful only to send one once per week
// from all systems."
//
// This file has no imports on purpose. The rule it holds is the thing standing
// between a parent and the morning five leads got two emails 1.1 seconds apart,
// and a rule that can only be exercised by reaching a database is a rule nobody
// exercises. scripts/check-email-guard.mjs runs everything below in a tenth of
// a second. lib/email/address-guard.ts is the part that talks to Postgres and
// it imports from here rather than the other way round.

/** Six days, not seven, and the missing day is doing real work.
 *
 *  The weekly digest is the busiest programme mail we send and it runs on a
 *  cron, so consecutive weeks land a few seconds either side of the same time.
 *  A seven day floor turns a digest that ran at 08:20:37 last Monday and
 *  08:20:31 this Monday into a suppressed email, and the digest in this
 *  codebase has already been silently killed once by exactly that class of
 *  off by a few seconds thinking.
 *
 *  Six delivers what he asked for, one a week, without a boundary race quietly
 *  deciding otherwise. */
export const MIN_DAYS_BETWEEN_PROGRAMME_EMAILS = 6

/**
 * Lowercased and trimmed, always, so an address cannot be suppressed under one
 * spelling and emailed under another.
 *
 * Gmail dots and plus aliases are deliberately NOT collapsed. It is tempting,
 * because plus aliases are exactly what made thirty four correct sends look
 * like one email thirty four times. But a plus address is a genuinely separate
 * address at most providers, two different people can hold name+a@ and name+b@
 * at a company domain, and folding them together would mean one person's
 * unsubscribe silently gagging somebody else's mail. A confusing inbox is a far
 * smaller problem than that.
 */
export function normaliseAddress(address: string): string {
  return address.trim().toLowerCase()
}

/**
 * Is this address due again?
 *
 * A missing or unparseable last send counts as due. We have no evidence we
 * wrote to them, and inventing one to justify silence is how a programme dies
 * quietly.
 */
export function dueAgain(lastSentAt: string | null | undefined, now: number = Date.now()): boolean {
  if (!lastSentAt) return true
  const last = Date.parse(String(lastSentAt))
  if (!Number.isFinite(last)) return true
  return (now - last) / 86400000 >= MIN_DAYS_BETWEEN_PROGRAMME_EMAILS
}

/**
 * The same PERSON, for deciding whether somebody already has an account.
 *
 * A deliberately different question from normaliseAddress above, and the two
 * must not be merged.
 *
 * normaliseAddress answers "may we write to this address", and it keeps plus
 * aliases and gmail dots apart on purpose, because a parent who unsubscribes
 * one alias has not unsubscribed the other and we must not decide otherwise on
 * their behalf.
 *
 * This answers "is this the same human", and there the opposite is true. Gmail
 * funnels every dotted and plus form into one inbox, so a parent who joined the
 * waitlist as sam+gc@gmail.com and then made an account as sam@gmail.com is one
 * person who now gets told to go and fetch the free starter pack they already
 * have.
 *
 * Justin, 13 August 2026, having received exactly that: "we are sending the set
 * up, go to free starter pack, to the person that has already set up? That needs
 * to stop."
 *
 * Only gmail and googlemail get the dot treatment, because only they ignore
 * dots. Plus addressing is near universal so it is stripped everywhere, and the
 * cost of being wrong is one missed nurture email to somebody who deliberately
 * gave a plus address for a second account. That is a far smaller harm than
 * telling a member to go and sign up.
 */
export function identityKey(address: string): string {
  const addr = normaliseAddress(address)
  if (!addr) return ''
  const at = addr.lastIndexOf('@')
  if (at < 1) return addr
  let local = addr.slice(0, at)
  const domain = addr.slice(at + 1)
  const plus = local.indexOf('+')
  if (plus > 0) local = local.slice(0, plus)
  if (domain === 'gmail.com' || domain === 'googlemail.com') local = local.split('.').join('')
  return local + '@' + domain
}
