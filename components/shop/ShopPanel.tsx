import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Shop from '@/components/shop/Shop'
import Keepsakes from '@/components/rewards/Keepsakes'
import { earnedFriendCount } from '@/lib/shop/earned'
import type { Product } from '@/lib/shop/catalogue'

// THE SHOP, BUILT ONCE.
//
// Justin, 13 August 2026: "click for passport, click to buy passport and
// stickers ... It is also the monthly shop rotation on the daily list, so build
// the destination once."
//
// This was the body of /dashboard/keepsakes. It is a component now, and the
// Shop tab of the passport page is the only thing that renders it; the old
// route redirects here carrying its query string. There is one shop with one
// URL, which matters more than it sounds: this codebase has already been
// through the two pages both calling themselves the passport problem, and a
// second shop reachable at a second address is the same mistake with a
// different noun.
//
// Phase 1 sells the two lines that need no toy safety testing, the personalised
// passport and the sticker sheet. The charms, the bracelet and the plush are in
// the catalogue but inactive, so they show honestly as coming soon.
//
// Before migration 102 the products table does not exist, so this falls back to
// the old register your interest card rather than breaking. That matters
// because the migration is pasted in by hand: the deploy and the schema change
// do not land at the same minute.

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export default async function ShopPanel({
  ordered,
  cancelled,
}: {
  /** Set coming back from a paid Stripe session, for the thank you banner. */
  ordered?: string
  cancelled?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: child } = await supabase
    .from('children')
    .select('id, name')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .maybeSingle()

  const childName = child?.name && child.name !== 'Your child' ? child.name : null

  const { data: rows, error } = await supabase
    .from('products')
    .select('*')
    .order('sort', { ascending: true })

  if (error || !rows?.length) {
    return <Keepsakes email={user.email ?? ''} childName={childName} />
  }

  // Only pay for the earned read if something in the catalogue is actually
  // gated on it.
  const products = rows as Product[]
  const earned = products.some(p => (p.min_earned ?? 0) > 0)
    ? await earnedFriendCount(supabase, user.id, child?.id ?? null)
    : 0

  return (
    <>
      {/* The way in to the fulfilment board, for the one person who has to post
          the parcels. Nobody else ever sees it. */}
      {(user.email ?? '').toLowerCase() === FOUNDER_EMAIL && (
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '4px 20px 0' }}>
          <Link href="/dashboard/orders" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12,
            padding: '9px 14px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)',
          }}>
            📦 Keepsake orders
          </Link>
        </div>
      )}
      <Shop
        products={products}
        earned={earned}
        childName={childName}
        email={user.email ?? ''}
        ordered={Boolean(ordered)}
        cancelled={cancelled === '1'}
      />
    </>
  )
}
