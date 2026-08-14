import Stripe from 'stripe'

let _instance: Stripe | null = null

function client(): Stripe {
  if (!_instance) {
    _instance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    })
  }
  return _instance
}

// Lazy proxy — Stripe constructor is deferred until first request (never called at build time)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe = new Proxy({} as Stripe, { get: (_, p) => (client() as any)[p] })

// No school keys here, deliberately. Schools pay on invoice, raised by hand
// in the Stripe dashboard with 30 day terms (pricing decided 13 August
// 2026); a price id exists only to feed a checkout button and there is no
// school checkout. The old school_small and school_medium keys sat here
// unreferenced with the wrong prices baked into env, waiting to be wired up
// by mistake. Revisit past about fifty schools.
export const STRIPE_PRICES = {
  founder:  process.env.STRIPE_PRICE_FOUNDER ?? '',
  standard: process.env.STRIPE_PRICE_STANDARD ?? '',
  annual:   process.env.STRIPE_PRICE_ANNUAL ?? '',
} as const

export const FOUNDER_CAP = 50

// The authoritative founder seat count, read from Stripe itself so the public
// counter and the checkout cap gate share one source and can never drift. A
// founder holds their seat while active OR trialing: the card is collected at
// checkout, so a trial founder has genuinely claimed a place. Only canceled or
// past due subscriptions free a seat back up. Counting active only used to let
// extra founders slip in during their trials.
export async function getFounderCount(): Promise<number> {
  const result = await client().subscriptions.search({
    query: `metadata['tier']:'founder'`,
    limit: 100,
  })
  return result.data.filter(s => s.status === 'active' || s.status === 'trialing').length
}
