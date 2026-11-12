// CHECKOUT, END TO END IN CODE (the board's will pay lens, 12 November 2026).
//
// "Checkout is proven" rested on one manual pass with a real card. This runs
// the REAL checkout route and the REAL webhook route on every push, with
// Stripe and Supabase stood in by recorders, so a change that breaks the path
// from the founder button to an unlocked account fails CI rather than a
// parent's card:
//
//   founder, standard and annual each open a Stripe session on their own price,
//     carrying the tier and the user in the metadata the webhook reads
//   the 51st founder is refused at the route, before Stripe is ever called
//   a missing secret key or price fails with a reason the upgrade page shows
//   checkout.session.completed unlocks the account (active, tier, founder flag)
//   a subscription update keeps the tier and maps Stripe's status to ours
//
// It is not a Stripe test mode run: CI holds no Stripe keys, and a test that
// needs a secret to run is a test that quietly stops running. A live test mode
// pass is still worth doing by hand once per pricing change.
//
//   node --experimental-strip-types --experimental-test-module-mocks \
//     --import ./scripts/lib/ts-resolve.mjs --test scripts/checkout-flow.test.mjs

import { test, mock, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_dummy'
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.guidedchildhood.com'

const PRICES = { founder: 'price_founder', standard: 'price_standard', annual: 'price_annual' }
const state = { founders: 0, sessions: [], customers: [], profileUpdates: [], adminUpdates: [] }

mock.module('@/lib/stripe', {
  namedExports: {
    FOUNDER_CAP: 50,
    STRIPE_PRICES: PRICES,
    getFounderCount: async () => state.founders,
    stripe: {
      customers: { create: async (args) => { state.customers.push(args); return { id: 'cus_test' } } },
      checkout: { sessions: { create: async (args) => { state.sessions.push(args); return { url: 'https://checkout.stripe.test/s/1' } } } },
      webhooks: { constructEvent: (body) => JSON.parse(body) },
    },
  },
})

mock.module('@/lib/supabase/server', {
  namedExports: {
    createClient: async () => ({
      auth: { getUser: async () => ({ data: { user: { id: 'user_1', email: 'parent@example.com' } } }) },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: { email: 'parent@example.com', stripe_customer_id: null, trial_ends_at: null, subscription_status: null } }) }) }),
        update: (row) => ({ eq: async () => { state.profileUpdates.push(row); return { error: null } } }),
      }),
    }),
  },
})

mock.module('@supabase/supabase-js', {
  namedExports: {
    createClient: () => ({
      from: (table) => ({
        update: (row) => ({ eq: async (_col, id) => { state.adminUpdates.push({ table, row, id }); return { error: null } } }),
      }),
    }),
  },
})

// next/server has no ESM entry Node can load outside Next, so the two calls
// these routes make are stood in with plain Responses of the same shape.
mock.module('next/server.js', {
  namedExports: {
    NextResponse: {
      redirect: (url, init) => new Response(null, { status: init?.status ?? 307, headers: { location: String(url) } }),
      json: (body, init) => Response.json(body, init),
    },
  },
})

mock.module('@/lib/config/trial',{ namedExports: { getTrialConfig: async () => ({ days: 4 }) } })
mock.module('@/lib/referrals/server', {
  namedExports: { referralForCheckout: async () => null, recordReferralStart: async () => {} },
})
mock.module('@/lib/email', { namedExports: { sendEmail: async () => ({ ok: true }), unsubscribeUrl: () => '' } })
mock.module('@/lib/email/templates', {
  namedExports: { orderConfirmationEmail: () => ({}), orderFulfilmentEmail: () => ({}) },
})

const checkout = await import('../app/api/stripe/checkout/route.ts')
const webhook = await import('../app/api/stripe/webhook/route.ts')

beforeEach(() => {
  state.founders = 0
  state.sessions.length = 0
  state.customers.length = 0
  state.profileUpdates.length = 0
  state.adminUpdates.length = 0
  process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
})

function form(fields) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return new Request('https://app.guidedchildhood.com/api/stripe/checkout', { method: 'POST', body: fd })
}

for (const tier of ['founder', 'standard', 'annual']) {
  test(`${tier}: opens a Stripe session on its own price, with the tier and user the webhook reads`, async () => {
    const res = await checkout.POST(form({ tier, from: 'choose' }))
    assert.equal(res.status, 302)
    assert.equal(res.headers.get('location'), 'https://checkout.stripe.test/s/1')
    assert.equal(state.sessions.length, 1)
    const s = state.sessions[0]
    assert.deepEqual(s.line_items, [{ price: PRICES[tier], quantity: 1 }])
    assert.equal(s.mode, 'subscription')
    assert.equal(s.metadata.tier, tier)
    assert.equal(s.metadata.user_id, 'user_1')
    assert.equal(s.subscription_data.metadata.tier, tier)
    assert.equal(s.subscription_data.trial_period_days, 4, 'the choose door carries the trial')
    assert.equal(state.customers.length, 1, 'a parent with no customer gets one')
  })
}

test('the 51st founder is refused before Stripe is called', async () => {
  state.founders = 50
  const res = await checkout.POST(form({ tier: 'founder' }))
  assert.equal(res.status, 302)
  assert.match(res.headers.get('location'), /\/dashboard\/upgrade\?error=founder_sold_out$/)
  assert.equal(state.sessions.length, 0)
})

test('the 50th founder still gets a session', async () => {
  state.founders = 49
  await checkout.POST(form({ tier: 'founder' }))
  assert.equal(state.sessions.length, 1)
})

test('a missing secret key fails with a reason the upgrade page shows', async () => {
  delete process.env.STRIPE_SECRET_KEY
  const res = await checkout.POST(form({ tier: 'standard' }))
  assert.match(res.headers.get('location'), /error=no_stripe_key$/)
  assert.equal(state.sessions.length, 0)
})

test('an unknown tier is a 400, never a session', async () => {
  const res = await checkout.POST(form({ tier: 'platinum' }))
  assert.equal(res.status, 400)
  assert.equal(state.sessions.length, 0)
})

function event(type, object) {
  return new Request('https://app.guidedchildhood.com/api/stripe/webhook', {
    method: 'POST', headers: { 'stripe-signature': 't=1,v1=x' },
    body: JSON.stringify({ type, data: { object } }),
  })
}

test('checkout.session.completed unlocks the account', async () => {
  const res = await webhook.POST(event('checkout.session.completed', {
    mode: 'subscription', customer: 'cus_test', metadata: { tier: 'founder', user_id: 'user_1' },
  }))
  assert.equal(res.status, 200)
  const u = state.adminUpdates.find(x => x.table === 'profiles' && x.id === 'user_1')
  assert.ok(u, 'the profile was updated')
  assert.equal(u.row.subscription_status, 'active')
  assert.equal(u.row.subscription_tier, 'founder')
  assert.equal(u.row.is_founder, true)
})

test('a standard checkout is not marked founder', async () => {
  await webhook.POST(event('checkout.session.completed', {
    mode: 'subscription', customer: 'cus_test', metadata: { tier: 'standard', user_id: 'user_1' },
  }))
  const u = state.adminUpdates.find(x => x.table === 'profiles')
  assert.equal(u.row.is_founder, false)
  assert.equal(u.row.subscription_tier, 'standard')
})

test('a subscription update keeps the tier and maps the status', async () => {
  await webhook.POST(event('customer.subscription.updated', {
    status: 'active', metadata: { tier: 'annual', user_id: 'user_1' },
  }))
  const u = state.adminUpdates.find(x => x.table === 'profiles')
  assert.equal(u.row.subscription_tier, 'annual')
  assert.equal(u.row.subscription_status, 'active')
})
