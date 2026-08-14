// WHAT STRIPE SAYS, AND WHAT WE STORE.
//
// Justin, 14 August 2026: "make sure there is countdown on free days and the
// hard lock paywall works and releases once paid and locks if payment stops.
// how can we test that's all working, as vital."
//
// It does all four, and every part of it was already testable except this one:
// the mapping lived inline in the webhook's switch statement, which cannot be
// imported and therefore cannot be checked. That is the single hinge the whole
// paywall turns on. Stripe says a word, this decides which of our three words
// it becomes, and lib/access.ts decides whether the door opens. Two of those
// three links had tests and the middle one did not.
//
// It is a pure function now, so scripts/check-paywall-paths.mjs can walk a
// subscription's whole life without a Stripe account or a database: paid,
// renewed, card bounced, retried, given up on, cancelled.
//
// ── THE THREE WORDS, AND WHY THERE ARE ONLY THREE ──────────────────────────
//
// Stripe has eight subscription statuses. We store three, because the app only
// ever asks three questions: may they in, are they paying, and is something
// wrong that they can fix. See lib/access.ts for what each one opens.
//
//   active     in. Includes 'trialing', because a card up front trial is a
//              paying customer who has not been charged yet, and locking the
//              founder out during their own free days would be absurd.
//   past_due   in, and told. A charge has bounced and Stripe is still
//              retrying, which it does for around three weeks and usually
//              wins. Locking on the first failure costs a paying family the
//              thing they use with their child every morning, over a card that
//              expired. See PAYING_STATUSES in lib/access.ts.
//   cancelled  out. Everything else, which is Stripe telling us it has given
//              up: canceled, unpaid, incomplete_expired, paused.
//
// The default is deliberately 'cancelled' rather than a pass through. A status
// Stripe adds after this was written must fail CLOSED, because the failure that
// costs money is an unknown word being read as permission to use the product
// for free, and the failure that costs a complaint is loud and gets fixed the
// same hour.

export type OurStatus = 'active' | 'past_due' | 'cancelled'

export function ourStatusFor(stripeStatus: string | null | undefined): OurStatus {
  if (stripeStatus === 'active' || stripeStatus === 'trialing') return 'active'
  if (stripeStatus === 'past_due') return 'past_due'
  return 'cancelled'
}
