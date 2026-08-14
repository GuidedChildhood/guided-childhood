import { createClient } from '@/lib/supabase/server'
import { stripe, STRIPE_PRICES, FOUNDER_CAP, getFounderCount } from '@/lib/stripe'
import { trialDaysToGrant, type AccessProfile } from '@/lib/access'
import { NextResponse } from 'next/server'
import { APP_ORIGIN } from '@/lib/config/site'

export const dynamic = 'force-dynamic'

// ── WHY THIS ROUTE NOW EXPLAINS ITSELF ──────────────────────────────────────
//
// Justin, 13 August 2026, with a screenshot of a blank browser error on
// https://www.guidedchildhood.com/api/stripe/checkout: "first we need to
// diagnose the link to founder member and subscriptions not working."
//
// Every Stripe call in here was unguarded, so anything Stripe disliked, a key
// that is not set on this Vercel project, a price id from the other mode, an
// outage, came out as HTTP 500 and Chrome's "This page isn't working". On the
// one route in the product that takes money. There was nothing on the screen
// for a parent, and nothing for us either.
//
// Three changes, none of which alter the happy path:
//   1  the configuration is checked BEFORE Stripe is called, so a missing key
//      or price says which one rather than throwing,
//   2  every Stripe call is wrapped, with the real reason logged for us and a
//      plain sentence for the parent,
//   3  a GET says what this is instead of 500ing, because the address is
//      pasteable and somebody will paste it.
//
// All failures land on /dashboard/upgrade with ?error=, which that page now
// reads. It already redirected there with error=founder_sold_out and the page
// had never displayed it.

/** Back to the till with a reason a human can act on, never a bare 500. */
function fail(reason: string): NextResponse {
  const origin = APP_ORIGIN
  return NextResponse.redirect(`${origin}/dashboard/upgrade?error=${reason}`, { status: 302 })
}

// A checkout is a POST from a form. Somebody opening the address directly used
// to get a 500, which reads as the payment system being down.
export async function GET() {
  return fail('use_the_button')
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  const body = formData
    ? {
        tier: formData.get('tier') as string,
        from: formData.get('from') as string | null,
        next: formData.get('next') as string | null,
      }
    : await request.json().catch(() => ({ tier: 'annual' }))

  const tier = body.tier as keyof typeof STRIPE_PRICES

  // ── THE CONFIGURATION, CHECKED BEFORE STRIPE IS TOUCHED ──────────────────
  //
  // These two are the likeliest cause of a dead Claim founder rate button and
  // they are invisible from the code: an env var set on the wrong Vercel
  // project reaches nothing, which this repo has been bitten by before (see
  // lib/config/site.ts on NEXT_PUBLIC_APP_URL). Naming which one is missing
  // turns a white error page into a one line fix.
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[checkout] STRIPE_SECRET_KEY is not set on this deployment')
    return fail('no_stripe_key')
  }
  if (!(tier in STRIPE_PRICES)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }
  if (!STRIPE_PRICES[tier]) {
    // The tier is real, the price id for it is empty. STRIPE_PRICE_FOUNDER and
    // friends are per environment, so this is a configuration gap rather than
    // a bad request, and it must not be reported as the parent's fault.
    console.error(`[checkout] no price id configured for tier "${tier}"`)
    return fail(`no_price_${tier}`)
  }

  // Enforce founder cap. Count seats held in Stripe (active or trialing), the
  // same source the public counter reads, so the two can never drift and a
  // founder still in their trial already counts against the 50. Fail open on a
  // transient Stripe error so a blip never blocks a paying customer; exceeding
  // by one during an outage is the lesser harm than a lost sale.
  if (tier === 'founder') {
    const held = await getFounderCount().catch(() => 0)
    if (held >= FOUNDER_CAP) {
      return fail('founder_sold_out')
    }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, stripe_customer_id, trial_ends_at, subscription_status')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    try {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    } catch (e) {
      // Almost always an unusable key: right shape, wrong account, or revoked.
      console.error('[checkout] could not create the Stripe customer:', e)
      return fail('stripe_unreachable')
    }
  }

  const origin = APP_ORIGIN

  // A payer coming straight from onboarding lands in their first script
  // (the activation moment), same as the free path, instead of the
  // dashboard. The recommended redirect prefers free scripts for accounts
  // the webhook has not upgraded yet, so this can never hit the paywall.
  // Back where they were headed when the block caught them, so a parent who
  // tapped Quests and was asked to choose still gets Quests. Only ever an
  // internal dashboard path, never anything off the form.
  const safeNext = body.next && body.next.startsWith('/dashboard') && !body.next.startsWith('//')
    ? body.next
    : null
  const successUrl = body.from === 'onboarding'
    ? `${origin}/dashboard/scripts/recommended?upgraded=1`
    : body.from === 'choose'
      ? `${origin}${safeNext ?? '/dashboard'}${(safeNext ?? '/dashboard').includes('?') ? '&' : '?'}upgraded=1`
      : `${origin}/dashboard?upgraded=1`

  // The founder door: card now, nothing charged while the free days they
  // already have are still running, then it continues automatically.
  //
  // The DAYS COME FROM THEIR OWN CLOCK, not from TRIAL_DAYS, and that is the
  // point of trialDaysToGrant. This door is taken partway through the free
  // days, so a flat four would quietly hand out a longer trial than the copy
  // promises, and none at all would charge a card on a day they were told was
  // free. Either way the screen and the receipt disagree, which this file
  // already carries a comment about from the last time it happened.
  //
  // An existing member upgrading from the dashboard charges straight away, so
  // nobody ever gets two free trials. The card is always collected so the
  // founder place is genuinely held.
  const isTrialDoor = body.from === 'onboarding' || body.from === 'choose'
  const trialDays = trialDaysToGrant(profile as AccessProfile | null)

  let session
  try {
    session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: STRIPE_PRICES[tier], quantity: 1 }],
    success_url: successUrl,
    cancel_url: `${origin}/dashboard/upgrade`,
    payment_method_collection: 'always',
    // Make the member tick that they accept the Terms at checkout. This
    // tightens the trial to charge consent and helps win any card dispute.
    // Requires a Terms of service URL set in the Stripe Dashboard (Settings,
    // Public details), else Stripe rejects the session, so it is behind a
    // flag that stays off until that URL is set.
    ...(process.env.STRIPE_TOS_CONSENT === 'on'
      ? { consent_collection: { terms_of_service: 'required' as const } }
      : {}),
    metadata: { tier, user_id: user.id },
    subscription_data: {
      metadata: { tier, user_id: user.id },
      ...(isTrialDoor ? { trial_period_days: trialDays } : {}),
    },
    })
  } catch (e) {
    // The usual suspect is a price id from the other Stripe mode: a live key
    // cannot see a test price and says so only here, at the last call.
    console.error('[checkout] Stripe refused the checkout session:', e)
    return fail('stripe_refused')
  }

  if (!session?.url) {
    console.error('[checkout] Stripe returned a session with no url')
    return fail('stripe_refused')
  }

  // NOTHING IS RECORDED HERE, and that is deliberate.
  //
  // Marking the founder door taken on the way OUT to Stripe would let anybody
  // who opens the card form and closes it walk past the block having paid
  // nothing and without the free door's limits. Paying is what clears it:
  // needsPlanChoice already answers no for an active subscription, so the
  // webhook closing the loop is the whole record. A parent who abandons the
  // form meets the two doors again, which is honest, and the free door is
  // still right there.
  return NextResponse.redirect(session.url, { status: 302 })
}
