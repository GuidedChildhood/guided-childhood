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
    ? { tier: formData.get('tier') as string }
    : await request.json().catch(() => ({ tier: 'standard' }))

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

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: tier === 'annual' ? 'subscription' : 'subscription',
    line_items: [{ price: STRIPE_PRICES[tier], quantity: 1 }],
    success_url: `${origin}/dashboard?upgraded=1`,
    cancel_url: `${origin}/dashboard/upgrade`,
    metadata: { tier, user_id: user.id },
    subscription_data: {
      metadata: { tier, user_id: user.id },
    },
  })

  return NextResponse.redirect(session.url!, { status: 302 })
}
