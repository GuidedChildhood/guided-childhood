import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PRICES, FOUNDER_CAP } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const body = formData
    ? { tier: formData.get('tier') as string, from: formData.get('from') as string | null }
    : await request.json().catch(() => ({ tier: 'annual' }))

  const tier = body.tier as keyof typeof STRIPE_PRICES
  if (!STRIPE_PRICES[tier]) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  // Enforce founder cap
  if (tier === 'founder') {
    const { count } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_founder', true)
      .eq('subscription_status', 'active')

    if ((count ?? 0) >= FOUNDER_CAP) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/upgrade?error=founder_sold_out`,
        { status: 302 }
      )
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, stripe_customer_id')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

  // A payer coming straight from onboarding lands in their first script
  // (the activation moment), same as the free path, instead of the
  // dashboard. The recommended redirect prefers free scripts for accounts
  // the webhook has not upgraded yet, so this can never hit the paywall.
  const successUrl = body.from === 'onboarding'
    ? `${origin}/dashboard/scripts/recommended?upgraded=1`
    : `${origin}/dashboard?upgraded=1`

  // Door two from onboarding: card now, nothing charged for 14 days, then it
  // continues automatically. Everywhere else (an existing trial user
  // upgrading from the dashboard) charges straight away, so nobody ever gets
  // two free trials. The card is always collected so the founder place is
  // genuinely held.
  const isOnboardingTrial = body.from === 'onboarding'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICES[tier], quantity: 1 }],
    success_url: successUrl,
    cancel_url: `${origin}/dashboard/upgrade`,
    payment_method_collection: 'always',
    metadata: { tier, user_id: user.id },
    subscription_data: {
      metadata: { tier, user_id: user.id },
      ...(isOnboardingTrial ? { trial_period_days: 14 } : {}),
    },
  })

  return NextResponse.redirect(session.url!, { status: 302 })
}
