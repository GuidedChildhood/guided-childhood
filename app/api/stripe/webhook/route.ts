import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Placeholder fallbacks so a missing env var at build time (the marketing
// Vercel project has no Supabase keys) never crashes the whole build. The
// real keys win on the app project; this route is never hit on marketing.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'build-placeholder'
)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const sub = (event.data.object as Stripe.Subscription)
  const tier = sub?.metadata?.tier as string | undefined
  const userId = sub?.metadata?.user_id as string | undefined

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const sessionUserId = session.metadata?.user_id ?? userId
      const sessionTier = session.metadata?.tier ?? tier
      if (sessionUserId) {
        await supabaseAdmin.from('profiles').update({
          subscription_status: 'active',
          subscription_tier: sessionTier,
          is_founder: sessionTier === 'founder',
          stripe_customer_id: session.customer as string,
        }).eq('id', sessionUserId)
      }
      break
    }

    case 'customer.subscription.updated': {
      if (userId) {
        const status = sub.status === 'active' ? 'active' : sub.status === 'past_due' ? 'past_due' : 'cancelled'
        await supabaseAdmin.from('profiles').update({
          subscription_status: status,
          subscription_tier: tier,
        }).eq('id', userId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      if (userId) {
        await supabaseAdmin.from('profiles').update({
          subscription_status: 'cancelled',
        }).eq('id', userId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const invoiceUserId = (invoice as { metadata?: { user_id?: string } }).metadata?.user_id
      if (invoiceUserId) {
        await supabaseAdmin.from('profiles').update({
          subscription_status: 'past_due',
        }).eq('id', invoiceUserId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
