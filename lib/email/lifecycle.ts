// The one place that decides what state a contact is in, so every email can
// branch on it instead of on raw day counts. This is the spine of the status
// aware funnel: trial nurture stops the moment someone pays, and win back
// starts the moment a trial lapses unpaid.
//
// Card door trials (the Stripe subscription with a 14 day trial) come through
// the webhook as subscription_status 'active' already (decision 2026-07-10),
// so 'active' covers both paying members and card holding trialists. The no
// card trial lives only in trial_ends_at, so a future trial_ends_at with no
// active subscription is the no card trialist, and a past one with no active
// subscription is the lapse we win back.

export type LifecycleState =
  | 'lead' // an email with no account yet (starter_leads, magnet leads)
  | 'trialing' // no card trial running, more than two days left
  | 'trial_ending' // no card trial running, two days or less left
  | 'active' // paying, or a card door trial holding a place
  | 'lapsed' // trial ended or subscription cancelled, now on the free tier
  | 'unknown'

export function trialDaysLeft(trialEndsAt: string | null): number | null {
  if (!trialEndsAt) return null
  const ms = new Date(trialEndsAt).getTime() - Date.now()
  return Math.ceil(ms / 86400000)
}

export function lifecycleState(p: {
  subscription_status: string | null
  trial_ends_at: string | null
}): LifecycleState {
  const status = (p.subscription_status ?? '').toLowerCase()
  if (status === 'active') return 'active'
  if (status === 'canceled' || status === 'cancelled') return 'lapsed'

  const left = trialDaysLeft(p.trial_ends_at)
  if (left != null) {
    if (left > 0) return left <= 2 ? 'trial_ending' : 'trialing'
    return 'lapsed' // trial end date has passed and they never became active
  }
  return 'unknown'
}
