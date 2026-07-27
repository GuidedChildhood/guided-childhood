import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Shop from '@/components/shop/Shop'
import Keepsakes from '@/components/rewards/Keepsakes'
import { earnedFriendCount } from '@/lib/shop/earned'
import type { Product } from '@/lib/shop/catalogue'

// The keepsakes surface, now a real shop. Phase 1 sells the two lines that need
// no toy safety testing: the personalised passport and the sticker sheet. The
// charms, the bracelet and the plush are in the catalogue but inactive, so they
// show honestly as coming soon.
//
// Before migration 102 the products table does not exist, so this falls back to
// the old register your interest page rather than breaking. That matters
// because the migration is pasted in by hand: the deploy and the schema change
// do not land at the same minute.

export const metadata = { title: 'Keepsakes — Guided Childhood' }

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export default async function KeepsakesPage({
  searchParams,
}: {
  searchParams: Promise<{ ordered?: string; cancelled?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams

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
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '18px 20px 0' }}>
          <Link href="/dashboard/orders" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 12,
            padding: '9px 14px', textDecoration: 'none',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 15.5, color: 'var(--ink)',
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
        ordered={Boolean(params.ordered)}
        cancelled={params.cancelled === '1'}
      />
    </>
  )
}
