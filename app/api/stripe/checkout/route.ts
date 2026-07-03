import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PRICES, FOUNDER_CAP } from '@/lib/stripe'
import { getRecommendedScript } from '@/lib/pathway/recommend'
import type { StageId } from '@/lib/pathway/progress'
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

  // Coming straight from onboarding, success lands in the parent's first
  // recommended script (the activation moment), not the dashboard. Free
  // scripts are preferred so a slow webhook can never bounce a fresh
  // payer into the upgrade redirect.
  let successUrl = `${origin}/dashboard?upgraded=1`
  if (body.from === 'onboarding') {
    const { data: child } = await supabase
      .from('children')
      .select('stage_id')
      .eq('parent_id', user.id)
      .eq('is_primary', true)
      .maybeSingle()
    if (child?.stage_id) {
      const { data: answers } = await supabase
        .from('profiles')
        .select('onboarding_answers')
        .eq('id', user.id)
        .single()
      const challenge = (answers?.onboarding_answers as Record<string, string> | null)?.challenge ?? null
      const recommended = await getRecommendedScript(
        supabase, user.id, child.stage_id as StageId, challenge, { preferFree: true }
      )
      if (recommended) {
        successUrl = `${origin}/dashboard/scripts/${recommended.sort_order}?upgraded=1&from=onboarding`
      }
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICES[tier], quantity: 1 }],
    success_url: successUrl,
    cancel_url: `${origin}/dashboard/upgrade`,
    metadata: { tier, user_id: user.id },
    subscription_data: {
      metadata: { tier, user_id: user.id },
    },
  })

  return NextResponse.redirect(session.url!, { status: 302 })
}
