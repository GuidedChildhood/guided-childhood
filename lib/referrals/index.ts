// Give £5, get £5 (migration 360, plan: plans/2026-10-03-cross-referral-plan.md).
//
// Justin, 3 to 4 October 2026: a referral system "proven to work", cash, no
// cap. The friend gets £5 off their first month at checkout. The person who
// shared is owed £5 once the friend has stayed: a second paid monthly bill, or
// 60 days after paying for a year. It is paid by PayPal in a monthly run.
//
// The rules live here as plain functions so the guard can test them without
// Stripe or a database.

/** The cookie a shared link sets, read at checkout. */
export const REF_COOKIE = 'gc_ref'

/** How long a shared link is remembered on the friend's device. */
export const REF_COOKIE_DAYS = 60

/** The reward to the person who shared, and the friend's discount. */
export const REWARD_PENCE = 500

/** Days an annual friend must have paid before the £5 is owed. */
export const ANNUAL_QUALIFY_DAYS = 60

/** Rewards in one calendar month above which a referrer is checked by hand before payout. */
export const HAND_CHECK_OVER = 10

/** A code as a parent might type or paste it, cleaned, or null when it cannot be one. */
export function normaliseCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const code = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  return /^[A-Z0-9]{4,16}$/.test(code) ? code : null
}

/**
 * A code built from the parent's first name, so it reads as theirs when a
 * friend sees it ("SARAH47"), with digits so it is not guessable as a list.
 */
export function proposeCode(name: string | null | undefined, digits: number): string {
  const letters = (name ?? '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 8)
  const stem = letters.length >= 2 ? letters : 'FRIEND'
  return `${stem}${digits}`.slice(0, 16)
}

export type PaidInvoice = { paidAt: Date; amountPaid: number }

export type QualifyInput = {
  interval: 'month' | 'year' | null
  subscriptionStatus: string | null
  paidInvoices: PaidInvoice[]
  refunded: boolean
}

export type ReferralStatus = 'started' | 'joined' | 'qualified' | 'paid' | 'void'

/**
 * Where a referral stands, from what Stripe says about the friend.
 *
 * Only real money counts: a trial invoice of £0 is not a payment. A refund
 * voids it. Monthly: the second paid bill. Annual: 60 days after paying.
 */
export function referralStage(input: QualifyInput, now: Date = new Date()): { status: Exclude<ReferralStatus, 'paid'>; reason?: string } {
  if (input.refunded) return { status: 'void', reason: 'refunded' }
  const paid = input.paidInvoices.filter(i => i.amountPaid > 0).sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime())
  if (paid.length === 0) return { status: 'started' }

  if (input.interval === 'year') {
    const days = (now.getTime() - paid[0].paidAt.getTime()) / 86_400_000
    const stillThere = input.subscriptionStatus === 'active' || input.subscriptionStatus === 'past_due'
    if (days >= ANNUAL_QUALIFY_DAYS && stillThere) return { status: 'qualified' }
    return { status: 'joined' }
  }

  return paid.length >= 2 ? { status: 'qualified' } : { status: 'joined' }
}

/** The message a parent shares. It says plainly that they get £5, as CAP Code rule 2.1 requires. */
export function shareMessage(link: string): string {
  return `I use Guided Childhood for the screen time stuff at home. If you join with my link you get £5 off your first month, and I get £5 too. ${link}`
}
