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

export const STRIPE_PRICES = {
  founder:       process.env.STRIPE_PRICE_FOUNDER ?? '',
  standard:      process.env.STRIPE_PRICE_STANDARD ?? '',
  annual:        process.env.STRIPE_PRICE_ANNUAL ?? '',
  school_small:  process.env.STRIPE_PRICE_SCHOOL_SMALL ?? '',
  school_medium: process.env.STRIPE_PRICE_SCHOOL_MEDIUM ?? '',
} as const

export const FOUNDER_CAP = 50

export async function getFounderCount(): Promise<number> {
  const result = await client().subscriptions.search({
    query: `status:'active' AND metadata['tier']:'founder'`,
    limit: 100,
  })
  return result.data.length
}
