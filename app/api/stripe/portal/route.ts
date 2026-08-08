import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

// Managing your own subscription: cancelling, and updating a card that failed.
//
// Justin, 8 August 2026, after both gaps were found in one afternoon.
//
// The upgrade page promised "cancel any time" and there was no way to cancel.
// The past due email wanted to offer "update your card" and there was nothing
// to link to. Both are the same missing thing, so both get the same fix: a
// Stripe hosted billing portal session for the signed in customer.
//
// Hosted rather than built here on purpose. Cancelling and re-entering card
// details are the two flows where getting it subtly wrong costs someone real
// money, and Stripe's own page is PCI handled, localised, and already knows
// about proration, trials and the customer's actual invoices. Nothing we could
// build in a week would be better, and this one cannot drift out of step with
// what Stripe thinks the subscription is.
//
// The customer id is the only thing needed, and profiles already has it.

export const dynamic = 'force-dynamic'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle()

  const customer = profile?.stripe_customer_id
  if (!customer) {
    // Never paid, so there is nothing to manage. Said plainly rather than as an
    // error, because a free tier parent finding this button is not a fault.
    return NextResponse.json({ error: 'no_subscription' }, { status: 400 })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${origin}/dashboard/settings`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    // The portal has to be switched on once in the Stripe dashboard before this
    // works. Until that is done Stripe returns a configuration error, and the
    // honest thing is to say the door is not open yet rather than show a parent
    // a broken button and let them think cancelling is being made difficult.
    const message = e instanceof Error ? e.message : 'unknown'
    const notConfigured = /configuration|portal/i.test(message)
    return NextResponse.json(
      { error: notConfigured ? 'portal_not_configured' : 'stripe_error', detail: message },
      { status: 502 }
    )
  }
}
