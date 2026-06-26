import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-05-27.dahlia',
})

export const STRIPE_PRICES = {
  founder: process.env.STRIPE_PRICE_FOUNDER ?? '',     // £7.99/mo lifetime
  standard: process.env.STRIPE_PRICE_STANDARD ?? '',   // £12.99/mo
  annual: process.env.STRIPE_PRICE_ANNUAL ?? '',        // £99/yr
  school_small: process.env.STRIPE_PRICE_SCHOOL_SMALL ?? '',   // £299/yr
  school_medium: process.env.STRIPE_PRICE_SCHOOL_MEDIUM ?? '', // £499/yr
} as const

export const FOUNDER_CAP = 50

export async function getFounderCount(): Promise<number> {
  const result = await stripe.subscriptions.search({
    query: `status:'active' AND metadata['tier']:'founder'`,
    limit: 100,
  })
  return result.data.length
}
