import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { normaliseCode, proposeCode, REF_COOKIE } from '@/lib/referrals'

// The server half of Give £5, get £5. The admin client is used for exactly
// two things here: looking up who owns a code, and writing the referral row,
// because a friend must never be able to read or write another family's
// rows. Nothing here reads a child's data.

/** Statuses that mean this account has paid us before, so it is not a new customer. */
const PAID_BEFORE = new Set(['active', 'past_due', 'cancelled', 'canceled'])

export type CheckoutReferral = { code: string; referrerId: string }

/**
 * The referral to apply to this checkout, or null.
 *
 * Null when there is no shared code on this device, the code is not real, the
 * code is the parent's own (same account or same email), the parent has paid
 * us before, or they have already joined through a referral.
 */
export async function referralForCheckout(
  userId: string,
  email: string | null | undefined,
  subscriptionStatus: string | null | undefined,
): Promise<CheckoutReferral | null> {
  const code = normaliseCode((await cookies()).get(REF_COOKIE)?.value)
  if (!code) return null
  if (subscriptionStatus && PAID_BEFORE.has(subscriptionStatus)) return null

  const admin = createAdminClient()
  const { data: owner } = await admin.from('referral_codes').select('user_id').eq('code', code).maybeSingle()
  if (!owner || owner.user_id === userId) return null

  const { data: referrer } = await admin.from('profiles').select('email').eq('id', owner.user_id).maybeSingle()
  if (email && referrer?.email && referrer.email.trim().toLowerCase() === email.trim().toLowerCase()) return null

  const { data: existing } = await admin.from('referrals').select('status').eq('referred_user_id', userId).maybeSingle()
  if (existing && existing.status !== 'started') return null

  return { code, referrerId: owner.user_id as string }
}

/** Records that this friend opened a checkout with a code. Safe to call again on a retried checkout. */
export async function recordReferralStart(userId: string, customerId: string, ref: CheckoutReferral): Promise<void> {
  const admin = createAdminClient()
  await admin.from('referrals').upsert({
    code: ref.code,
    referrer_id: ref.referrerId,
    referred_user_id: userId,
    stripe_customer_id: customerId,
    status: 'started',
  }, { onConflict: 'referred_user_id' })
}

/**
 * This parent's code, made the first time they ask. Issued server side so a
 * parent cannot choose a code that impersonates someone else.
 */
export async function getOrCreateCode(userId: string, name: string | null | undefined): Promise<{ code: string; paypal_email: string | null }> {
  const admin = createAdminClient()
  const { data: mine } = await admin.from('referral_codes').select('code, paypal_email').eq('user_id', userId).maybeSingle()
  if (mine) return mine as { code: string; paypal_email: string | null }

  for (let attempt = 0; attempt < 8; attempt++) {
    const digits = 10 + Math.floor(Math.random() * (attempt < 4 ? 90 : 9990))
    const code = proposeCode(name, digits)
    const { data, error } = await admin.from('referral_codes')
      .insert({ user_id: userId, code })
      .select('code, paypal_email').single()
    if (!error && data) return data as { code: string; paypal_email: string | null }
    // A clash on our own row means another tab made it a moment ago.
    if (error && /referral_codes_pkey/.test(error.message)) {
      const { data: again } = await admin.from('referral_codes').select('code, paypal_email').eq('user_id', userId).single()
      if (again) return again as { code: string; paypal_email: string | null }
    }
  }
  throw new Error('could not issue a referral code')
}
