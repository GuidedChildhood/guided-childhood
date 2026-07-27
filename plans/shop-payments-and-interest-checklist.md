# Shop: interest email + payments diagnosis (for tomorrow)

## 1. The interest email never sent (fixed in code)

The keepsakes "coming soon" form posted to `/api/keepsakes/interest`, which only
inserted a `keepsake_interest` row and emailed no one. That is why nothing
arrived. Now the route also emails the founder (`FOUNDER_NOTIFY_EMAIL`, default
justin@thesocialbillboard.com) on every signup, best effort, sent even when the
table is missing so the email is the durable copy.

Needs, to actually deliver: `RESEND_API_KEY` set in the deploy env (and
`EMAIL_FROM` if the default sender is not wanted). If Resend is not configured
the send is a quiet no op.

## 2. Basket did not reach Stripe (config, not code)

The checkout route is sound: it re reads price and the earned gate from the DB,
writes a pending order, then creates a Stripe Checkout session with inline
`price_data` (so no Stripe Products need creating). A basket that dies before
Stripe throws inside the session create and returned a single generic line. Now
it also `console.error`s the real cause, so the deploy logs name it.

Check tomorrow, in BOTH Vercel projects (guided-childhood and
guided-childhood-app), the env vars:

- `STRIPE_SECRET_KEY` — the usual suspect. Missing or wrong mode throws on
  session create ("We could not reach the payment page"). Use sk_live_ for real
  payments, sk_test_ for testing with test cards.
- `STRIPE_WEBHOOK_SECRET` — without it a payment completes on Stripe but the
  order never flips to paid and no confirmation or fulfilment email sends.
- `SUPABASE_SERVICE_ROLE_KEY` — without it checkout returns "The shop is not
  configured" (503) before Stripe is even called.
- `NEXT_PUBLIC_APP_URL` — the success and cancel redirect origin.

In the Stripe dashboard:

- Add a webhook endpoint at `{APP_URL}/api/stripe/webhook`, event
  `checkout.session.completed`, and put its signing secret in
  `STRIPE_WEBHOOK_SECRET`.
- Activate the account for live payments if taking real money; otherwise stay in
  test mode and use test cards.

Which error message showed on the basket tells us the cause: "We could not reach
the payment page" is the Stripe key; "The shop is not configured" is the service
key; "is not available to you yet" means a coming soon or gated product was in
the basket. Only `passport_printed` and `sticker_sheet` are active, so test with
one of those.
