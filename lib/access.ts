// Full access to Guided Childhood: an active subscription, or a short free
// trial that has not yet passed. One helper so every feature gate agrees.

// Justin: "it should be 4 days free not 7".
//
// Four rather than seven because the thing this trial has to prove happens
// daily. A parent who is going to get it gets it in the first two or three
// days: they set a job, the child ticks it, they say yes, the minutes land.
// Seven days does not add a fifth proof, it adds four days for the habit to go
// quiet in, and a trial that ends after the family has already drifted converts
// worse than one that ends while they are still in it.
//
// Changing this number changes the Stripe checkout's trial_period_days too, so
// the card and the app can never disagree about when it runs out.
//
// IT IS THE FALLBACK NOW, not the only copy. The live number is
// platform_config.trial_days, read by lib/config/trial.ts, because Justin
// asked for the trial limits to be configurable rather than hardcoded. This
// file stays pure and synchronous on purpose: the middleware and the .mjs
// checks both import it, and neither can await a database. Everything here
// reads a date that was already written, so only the routes that GRANT the
// trial need the config value.
export const TRIAL_DAYS = 4

export type AccessProfile = {
  subscription_status?: string | null
  trial_ends_at?: string | null
  /** Which path they took: 'founder', 'free', or null while still owed. */
  plan_choice?: string | null
  /** Setup finished, which is what makes the choice owed. */
  onboarding_complete?: boolean | null
  /** Their first ever check in. */
  first_checkin_at?: string | null
  /**
   * When the account was made. The floor under the whole trial.
   *
   * Read here so a missing trial_ends_at can be answered from the one date
   * that always exists, rather than being read as "the trial is over". See
   * hasFullAccess.
   */
  created_at?: string | null
}

// The founder and any test logins are never paywalled on their own product.
//
// This used to key off FOUNDER_NOTIFY_EMAIL, which is really the answer to a
// different question (where do founder notifications go). One env value doing
// two unrelated jobs meant that pointing notifications at another address
// silently switched the paywall back on for the founder, with nothing to say
// why. FOUNDER_EMAILS is the allowlist now, a comma separated list so a test
// login can be added without a deploy, and the notify address is still honoured
// as a fallback so nothing that worked before stops working.
//
// Server side only, the env never reaches a client.
const ACCESS_ALLOWLIST: string[] = (
  process.env.FOUNDER_EMAILS
  ?? process.env.FOUNDER_NOTIFY_EMAIL
  ?? 'justin@thesocialbillboard.com'
)
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)

// The founder address is always in, whatever the env says, so a typo or a
// reassigned notify address can never lock him out of his own product.
if (!ACCESS_ALLOWLIST.includes('justin@thesocialbillboard.com')) {
  ACCESS_ALLOWLIST.push('justin@thesocialbillboard.com')
}

// A subscription that is trying to pay is still a subscription.
//
// Justin, 11 August 2026: "so will this work if payment is not received even
// though they subscribed?"
//
// It would not have, and after this morning's change it would have been much
// worse than it used to be. The webhook writes past_due the moment a renewal
// charge fails, and this function only accepted 'active', so the first bounced
// payment locked a family out. Before the paywall moved into the middleware
// that cost them about fifteen screens. After it, it costs them the entire
// product, on a Tuesday, over an expired card.
//
// Stripe does not give up when a charge fails. It retries for around three
// weeks, and most of those retries succeed: a card replaced, a bank that
// blocked a foreign transaction, a balance that arrives on payday. Throughout
// that window the family is a paying customer who intends to keep paying.
//
// So past_due keeps its access and STRIPE decides when it is over, which it
// already tells us: when the retries finally fail it either cancels the
// subscription, firing customer.subscription.deleted, or leaves it unpaid,
// and the webhook maps both of those to 'cancelled'. That is the door closing,
// and it closes on Stripe's judgement rather than on a first failed charge.
//
// The asymmetry is deliberate. Letting a lapsed family keep the app for three
// more weeks costs a few pounds. Locking a paying family out of the thing they
// use with their child every morning costs the family.
const PAYING_STATUSES = ['active', 'past_due'] as const

/**
 * The founder and the test logins, asked directly.
 *
 * hasFullAccess consults the same list on its first line, but "may they use
 * everything" and "are they exempt from a limit" are different questions, and
 * a caller that needs the second one should not have to infer it from an
 * answer about access. The DiGi message cap is the first caller.
 */
export function isAllowlisted(email?: string | null): boolean {
  if (!email) return false
  return ACCESS_ALLOWLIST.includes(email.trim().toLowerCase())
}

export function hasFullAccess(profile: AccessProfile | null | undefined, email?: string | null): boolean {
  if (isAllowlisted(email)) return true
  if (!profile) return false
  if ((PAYING_STATUSES as readonly string[]).includes(profile.subscription_status ?? '')) return true
  if (profile.trial_ends_at) return new Date(profile.trial_ends_at).getTime() > Date.now()

  // ── NO TRIAL DATE MEANS NOT STARTED, NEVER MEANS FINISHED ─────────────────
  //
  // Justin, 15 August 2026: "just signed up as new user and it blocked me as
  // says i have had the 4 days but only just signed up."
  //
  // He was locked out of a brand new account, and the live database showed why:
  // that profile had trial_ends_at NULL while every earlier signup carried a
  // date. So the write that grants the trial did not fire for him, and this
  // function read the absence of a date as the absence of a trial and returned
  // false. A missing value was being treated as an expired one.
  //
  // Those are opposite meanings and only one of them is ever true of a row that
  // was created minutes ago. The rule Justin states is that the four free days
  // start AT SIGNUP, whichever door they take: "a new user can sign up there for
  // founder rate and gets 4 days free after signing up, or has the chance to not
  // sign up and pay and continue on 4 day trial."
  //
  // created_at is the one date that cannot be missing, so it is the floor. A
  // parent gets their four days from the moment the account existed even if
  // nothing ever wrote trial_ends_at, and after those four days they are
  // blocked and offered the subscription exactly as before. The grant write is
  // still worth having, because it is what a founder checkout moves; this only
  // stops its absence costing a parent the product on their first evening.
  if (profile.created_at) {
    return new Date(profile.created_at).getTime() + TRIAL_DAYS * 86400000 > Date.now()
  }

  // No status, no trial date and no created_at is not a real profile, so this
  // stays exactly as strict as it was.
  return false
}

/**
 * Are they actually PAYING us, as opposed to merely having access?
 *
 * Justin, 12 August 2026, after setting up on a brand new email in a private
 * window and still being told there was nothing to buy: "set up with new email
 * and still saying no plan to set up, so please investigate."
 *
 * hasFullAccess answers "may this person use everything", and during the free
 * days the honest answer is yes. The upgrade page was asking THAT question to
 * decide whether to show the paywall, so every parent in their trial was met
 * with "you already have everything, nothing to unlock" and could not buy.
 *
 * Those are two different questions and they only agree once the trial is over.
 * The trial is precisely the window where the founder offer has its urgency, so
 * the one page built to sell was dark for the only people ready to be sold to.
 *
 * The allowlist is deliberately NOT consulted here. It is a grant of access, not
 * a record of payment, and letting it answer this question is how the confusion
 * started.
 */
export function hasPaidPlan(profile: AccessProfile | null | undefined): boolean {
  if (!profile) return false
  return (PAYING_STATUSES as readonly string[]).includes(profile.subscription_status ?? '')
}

/**
 * A payment has bounced and Stripe is still retrying.
 *
 * They keep everything, and they need telling, because the one way this goes
 * wrong is silently: three weeks of retries fail, the subscription cancels, and
 * the first a family hears about it is the app shutting. The card takes a
 * minute to fix in the billing portal while the door is still open.
 */
export function paymentNeedsAttention(profile: AccessProfile | null | undefined): boolean {
  return profile?.subscription_status === 'past_due'
}

export function inTrial(profile: AccessProfile | null | undefined): boolean {
  if (!profile || profile.subscription_status === 'active' || !profile.trial_ends_at) return false
  return new Date(profile.trial_ends_at).getTime() > Date.now()
}

// Whole days left in the trial, rounded up, floored at zero. Zero once it has
// passed. Only meaningful when inTrial is true.
export function trialDaysLeft(profile: AccessProfile | null | undefined): number {
  if (!profile?.trial_ends_at) return 0
  const ms = new Date(profile.trial_ends_at).getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86400000))
}

// The trial start value to write at onboarding completion.
export function trialEndsFromNow(): string {
  return new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString()
}

// ── THE TWO PATHS, AT THE END OF SIGN UP ────────────────────────────────────
//
// Justin, 14 August 2026: "At the end of sign up, the parent chooses one of
// exactly two paths." The homepage says the same thing in the trial card:
// "The founder rate is claimed at sign up, first 50 families only."
//
// It moved here from after the first check in, which is where it went on 13
// August, which is itself where it went from the last screen of onboarding.
// Three placements in three days is worth explaining, because the middle one
// was a fix for a real bug and this must not undo it.
//
// THE BUG. The offer used to be a SCREEN INSIDE THE WIZARD, and
// onboarding_complete is written four screens before it, at personalisation.
// The init guard sends anybody carrying that flag straight to the dashboard.
// So any pause between DiGi's introduction and the final tap, a reload, a
// phone locking, deleted the one screen in the product that asks for money,
// permanently, for that parent.
//
// WHAT ACTUALLY FIXED IT was not the timing. It was moving the offer OUT of
// the wizard and onto its own route with the middleware in front of it, so a
// parent who reloads, closes the tab or wanders off is put back on it. That
// part is kept exactly as it is. Only the condition below changes: finishing
// setup makes the choice owed, rather than the first check in.
//
// So the ask lands where the front page promised it, and it still cannot be
// skipped by anything a browser does.

/**
 * Is the two path block owed on this request?
 *
 * Deliberately pure and deliberately narrow: it never consults the allowlist
 * and never looks at the trial clock. Whether they may USE the product is
 * hasFullAccess's question and it runs first, so a family whose trial has run
 * out meets the upgrade page rather than a choice they can no longer make.
 *
 * Null profile is a no. A failed read must never conjure a payment screen in
 * front of a paying family.
 */
export function needsPlanChoice(profile: AccessProfile | null | undefined): boolean {
  if (!profile) return false
  if (profile.plan_choice) return false
  // Mid setup. A parent still answering questions about their child is not
  // being asked for a card in the middle of it, and the wizard's own routes
  // are not behind this gate anyway.
  if (!profile.onboarding_complete) return false
  // Already paying, by any route. The question answers itself.
  if ((PAYING_STATUSES as readonly string[]).includes(profile.subscription_status ?? '')) return false
  return true
}

/**
 * Are the four free days running right now?
 *
 * THE ONE RULE THE WHOLE TRIAL TURNS ON, and it is deliberately blind to which
 * path they took. Justin, 14 August 2026: "The trial itself is identical: 4
 * days inside the platform with DiGi on a daily limit and a starter set of
 * scripts." Both paths, same four days, same limits.
 *
 * So the founder is limited too, and that is not an oversight. Their card is
 * on file and their subscription_status reads 'active', because Stripe says
 * trialing and ourStatusFor maps that to active so they are never locked out
 * of days they were promised. But nothing has been charged yet, and the offer
 * on the front page is the same offer for both.
 *
 * IT ENDS WHEN THE MONEY STARTS. The webhook writes trial_ends_at = now() the
 * moment Stripe moves the subscription out of trialing, so the limits lift on
 * the same event that takes the first payment rather than on a second clock
 * that could disagree with it. That is also what stops a parent who pays
 * outright, with no trial at all, from being handed a sample of a product
 * they have just bought in full.
 *
 * The allowlist is not consulted here, because a caller asking about limits
 * asks isAllowlisted separately. The founder must never be capped on his own
 * product and that exemption belongs at the caller, said out loud.
 */
export function inStarterTrial(profile: AccessProfile | null | undefined): boolean {
  if (!profile?.trial_ends_at) return false
  return new Date(profile.trial_ends_at).getTime() > Date.now()
}

/**
 * Whole free days still owed, for Stripe's trial_period_days.
 *
 * The founder door is taken DURING the free days, so charging four more from
 * that moment would quietly hand out a longer trial than the copy promises,
 * and passing nothing would charge a card on a day the parent was told was
 * free. Either way the screen and the receipt disagree, which is the fault
 * this file already carries a comment about.
 *
 * Floored at 1 rather than 0: Stripe rejects a zero day trial, and a parent
 * choosing founder in the last hours of their trial gets the rest of that day
 * free rather than an error at the card form. Capped at the trial length so no
 * route can mint a longer trial than the product offers.
 *
 * Taken at the end of sign up, which is where the choice lives now, the clock
 * has been running for seconds and this returns the full four. It still earns
 * its keep for the parent who closes the tab on the choice screen and comes
 * back on day three: the middleware puts the same choice back in front of
 * them, and without this they would be handed four fresh days on top of the
 * three they have already had.
 *
 * maxDays is injectable because the length is platform_config.trial_days now,
 * and this file has to stay synchronous for the middleware and the .mjs
 * checks. Callers that can await pass the configured value, everything else
 * gets TRIAL_DAYS, and the two agree unless somebody has deliberately changed
 * the offer.
 */
export function trialDaysToGrant(
  profile: AccessProfile | null | undefined,
  maxDays: number = TRIAL_DAYS,
): number {
  if (!profile?.trial_ends_at) return maxDays
  const days = Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / 86400000)
  return Math.min(maxDays, Math.max(1, days))
}

// ── WHAT STAYS OPEN WHEN THE FOUR DAYS ARE UP ───────────────────────────────
//
// Justin, 11 August 2026, asked whether the free daily path went behind the
// paywall too: "yes everything is behind the paywall after 4 days and if not
// subscribed."
//
// So the rule is the whole dashboard, and the interesting part of the rule is
// the short list of things that cannot be behind it, because a paywall that
// locks these does not collect any money, it just traps people.
//
//   upgrade      the paywall itself. Locking the till is its own punchline.
//   settings     billing, the card, cancelling, exporting, signing out. A
//                parent who cannot reach this cannot leave, and a subscription
//                somebody cannot cancel is a chargeback and a complaint rather
//                than a customer.
//   orders       what a family has already bought and paid for. Locking a
//                receipt behind a new payment is not a paywall, it is taking
//                something back.
//   admin        the founder's own console, which has its own allowlist and is
//                how the paywall gets fixed when it goes wrong.
//   email-check  unsubscribing and verifying an address. Making somebody pay
//                to stop being emailed is the one that draws regulators.
//
// A prefix list rather than a list of exact paths, so /dashboard/settings/x
// stays reachable without anybody remembering to add it.
const PAYWALL_OPEN_PREFIXES = [
  '/dashboard/upgrade',
  '/dashboard/settings',
  '/dashboard/orders',
  '/dashboard/admin',
  '/dashboard/email-check',
] as const

/**
 * Does this path need a membership?
 *
 * Deliberately a pure function of the path, with no database in it, so the rule
 * can be tested exhaustively without a Supabase instance and so the middleware
 * only pays for a profile read on the paths that can actually be blocked.
 */
export function needsMembership(pathname: string): boolean {
  if (!pathname.startsWith('/dashboard')) return false
  return !PAYWALL_OPEN_PREFIXES.some(
    p => pathname === p || pathname.startsWith(p + '/'),
  )
}
