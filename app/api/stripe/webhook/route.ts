import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import { sendEmail, unsubscribeUrl } from '@/lib/email'
import { orderConfirmationEmail, orderFulfilmentEmail } from '@/lib/email/templates'
import { formatPence } from '@/lib/shop/catalogue'
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

// A paid keepsake order: mark it, tell the family, tell ourselves.
//
// Idempotent by construction. Stripe redelivers, and the update is scoped to
// pending rows, so a second delivery changes nothing and sends no second email.
// Everything after the status flip is best effort: a mail outage must never
// make this return an error, because a failed webhook is one Stripe will retry
// and the money has already been taken.
async function fulfilShopOrder(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id
  if (!orderId) return

  const { data: claimed } = await supabaseAdmin
    .from('orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      stripe_session_id: session.id,
      email: session.customer_details?.email ?? null,
      shipping_json: shippingOf(session),
    })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select('id, user_id, child_id, total_pence, email')

  // Already paid on an earlier delivery, or no such order. Either way, done.
  if (!claimed || claimed.length === 0) return
  const order = claimed[0]

  try {
    const [{ data: items }, { data: child }] = await Promise.all([
      supabaseAdmin.from('order_items').select('product_key, qty').eq('order_id', orderId),
      order.child_id
        ? supabaseAdmin.from('children').select('name').eq('id', order.child_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ])

    const keys = (items ?? []).map(i => i.product_key as string)
    const { data: products } = await supabaseAdmin.from('products').select('key, name').in('key', keys)
    const nameFor = new Map((products ?? []).map(p => [p.key as string, p.name as string]))
    const lines = (items ?? []).map(i => ({
      name: nameFor.get(i.product_key as string) ?? (i.product_key as string),
      qty: Number(i.qty) || 1,
    }))

    const totalLabel = formatPence(Number(order.total_pence) || 0)
    const rawName = (child as { name?: string } | null)?.name
    const childName = rawName && rawName !== 'Your child' ? rawName : null
    const to = session.customer_details?.email ?? order.email
    const shipping = shippingLines(session)

    if (to) {
      const mail = orderConfirmationEmail({
        lines, totalLabel, childName,
        unsubscribe: unsubscribeUrl(order.user_id as string),
      })
      // A receipt for money that just left their account. Never throttled and
      // never suppressed: it is a record of a transaction, not our programme.
      await sendEmail({ to, subject: mail.subject, html: mail.html, kind: 'transactional' })
    }

    const desk = process.env.SHOP_FULFILMENT_EMAIL
    if (desk) {
      const mail = orderFulfilmentEmail({
        orderId, email: to ?? 'unknown', lines, totalLabel, childName,
        shipping: shipping.join('<br>') || 'No address collected',
      })
      await sendEmail({ to: desk, subject: mail.subject, html: mail.html, kind: 'operational' })
    }
  } catch { /* the order is paid and recorded, which is the part that matters */ }
}

// Stripe moved the posted address under collected_information; older payloads
// carry it at the top level. Read both so a version bump never silently loses
// the address we have to post a parcel to.
type WithShipping = Stripe.Checkout.Session & {
  shipping_details?: { name?: string | null; address?: Stripe.Address | null } | null
  collected_information?: { shipping_details?: { name?: string | null; address?: Stripe.Address | null } | null } | null
}
function shippingOf(session: Stripe.Checkout.Session) {
  const s = session as WithShipping
  return s.collected_information?.shipping_details ?? s.shipping_details ?? null
}
function shippingLines(session: Stripe.Checkout.Session): string[] {
  const d = shippingOf(session)
  if (!d) return []
  const a = d.address
  return [d.name, a?.line1, a?.line2, a?.city, a?.postal_code, a?.country]
    .filter((x): x is string => Boolean(x))
}

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

      // A keepsake purchase is a one off payment, not a membership. This branch
      // has to come first: the subscription path below only checks for a
      // user_id in the metadata, so without it buying a four pound sticker
      // sheet would quietly mark that parent as a paying subscriber.
      if (session.mode === 'payment' || session.metadata?.kind === 'shop') {
        await fulfilShopOrder(session)
        break
      }

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
        // A card up front trial reports status 'trialing'. Treat it as full
        // access, same as active, so the founder who added a card is never
        // locked out during their 14 free days.
        const status = (sub.status === 'active' || sub.status === 'trialing')
          ? 'active'
          : sub.status === 'past_due' ? 'past_due' : 'cancelled'
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
