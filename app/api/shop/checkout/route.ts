import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'
import { earnedFriendCount } from '@/lib/shop/earned'
import { canBuy, formatPence, MAX_QTY, SHIP_COUNTRIES, type BasketLine, type Product } from '@/lib/shop/catalogue'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Takes a basket and hands back a Stripe Checkout URL. Everything that decides
// what the family is charged and what they are allowed to buy is re read here
// from the database. The basket only ever says WHICH products and how many.
//
// Two things a browser could otherwise lie about, both closed here:
//
//   1. Price. Read from the products row, never from the request. A doctored
//      basket claiming the passport costs 1p buys nothing.
//   2. The earned gate. Re checked against the real stage progress and streak
//      count. That gate is the whole idea behind the shop, and a rule enforced
//      only by a greyed out button is not a rule.
//
// The order row is written before Stripe is called, so a payment always has
// something to land against, and the webhook flips it to paid.

type Body = { items?: BasketLine[] }

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = (await request.json().catch(() => ({}))) as Body
  const requested = Array.isArray(body.items) ? body.items : []
  if (!requested.length) return NextResponse.json({ error: 'Your basket is empty' }, { status: 400 })

  // Collapse duplicates and clamp, so a basket cannot ask for a thousand of
  // anything or list the same charm eleven times to sneak past the cap.
  const wanted = new Map<string, BasketLine>()
  for (const line of requested) {
    if (!line?.key || typeof line.key !== 'string') continue
    const existing = wanted.get(line.key)
    const qty = Math.max(1, Math.min(MAX_QTY, Math.floor(Number(line.qty) || 1)))
    wanted.set(line.key, {
      key: line.key,
      qty: Math.min(MAX_QTY, (existing?.qty ?? 0) + qty),
      personalisation: line.personalisation ?? existing?.personalisation,
    })
  }
  if (!wanted.size) return NextResponse.json({ error: 'Your basket is empty' }, { status: 400 })

  const { data: rows, error: catalogueError } = await supabase
    .from('products')
    .select('*')
    .in('key', [...wanted.keys()])

  if (catalogueError) {
    // Before migration 102 the table does not exist. Say so plainly rather than
    // failing as though the card was declined.
    return NextResponse.json({ error: 'The shop is not open yet', needsMigration: true }, { status: 503 })
  }

  const products = (rows ?? []) as Product[]
  if (products.length !== wanted.size) {
    return NextResponse.json({ error: 'Something in your basket is no longer available' }, { status: 400 })
  }

  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  // Only pay for the earned read when something in the basket actually needs
  // it. Most Phase 1 baskets are a sticker sheet and a passport.
  const gated = products.some(p => (p.min_earned ?? 0) > 0)
  const earned = gated ? await earnedFriendCount(supabase, user.id, child?.id ?? null) : 0

  for (const product of products) {
    if (!canBuy(product, earned)) {
      return NextResponse.json(
        { error: `${product.name} is not available to you yet` },
        { status: 403 },
      )
    }
  }

  const items = products.map(p => {
    const line = wanted.get(p.key)!
    return { product: p, qty: line.qty, personalisation: line.personalisation ?? null }
  })
  const totalPence = items.reduce((sum, i) => sum + i.product.price_pence * i.qty, 0)

  // The order is recorded first so a completed payment always has a row to
  // land on. Written with the service key because orders are read only to the
  // family under RLS: nothing a browser sends can create one directly.
  let admin
  try { admin = createAdminClient() } catch {
    return NextResponse.json({ error: 'The shop is not configured' }, { status: 503 })
  }

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      child_id: child?.id ?? null,
      status: 'pending',
      total_pence: totalPence,
      email: user.email ?? null,
    })
    .select('id')
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: 'We could not start that order' }, { status: 500 })
  }

  const { error: itemsError } = await admin.from('order_items').insert(
    items.map(i => ({
      order_id: order.id,
      product_key: i.product.key,
      qty: i.qty,
      unit_price_pence: i.product.price_pence,
      // The passport is printed from this child's real stamps, so the name and
      // the child go on the line. Fulfilment reads the stamps from the child_id
      // rather than trusting a name typed into a box.
      personalisation: i.product.personalised
        ? { childName: child?.name ?? null, childId: child?.id ?? null, ...(i.personalisation ?? {}) }
        : (i.personalisation ?? null),
    })),
  )

  if (itemsError) {
    await admin.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
    return NextResponse.json({ error: 'We could not start that order' }, { status: 500 })
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? 'https://guidedchildhood.com'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email ?? undefined,
      line_items: items.map(i => ({
        quantity: i.qty,
        price_data: {
          currency: 'gbp',
          unit_amount: i.product.price_pence,
          product_data: {
            name: i.product.name,
            // Stripe rejects an empty description outright, and blurb defaults
            // to an empty string, so a product added without one would fail
            // checkout rather than simply show no subtitle.
            ...(i.product.blurb.trim() ? { description: i.product.blurb.trim().slice(0, 300) } : {}),
          },
        },
      })),
      shipping_address_collection: { allowed_countries: [...SHIP_COUNTRIES] },
      success_url: `${origin}/dashboard/keepsakes?ordered=${order.id}`,
      cancel_url: `${origin}/dashboard/keepsakes?cancelled=1`,
      // order_id is what the webhook matches on, and it is also how the webhook
      // tells a keepsake purchase apart from a subscription so buying a four
      // pound sticker sheet never marks anyone as a paying member.
      metadata: { order_id: order.id, user_id: user.id, kind: 'shop' },
    })

    await admin.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id)

    return NextResponse.json({ url: session.url, total: formatPence(totalPence) })
  } catch (err) {
    // The real reason a basket never reached Stripe lands here and used to be
    // swallowed, so a missing STRIPE_SECRET_KEY read as the same generic line
    // as a network blip. Log it so the cause is one look in the deploy logs.
    console.error('[shop/checkout] Stripe checkout session failed', err)
    await admin.from('orders').update({ status: 'cancelled' }).eq('id', order.id)
    return NextResponse.json({ error: 'We could not reach the payment page' }, { status: 502 })
  }
}
