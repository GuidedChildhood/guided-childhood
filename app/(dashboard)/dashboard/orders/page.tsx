import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import OrdersBoard, { type OrderRow } from '@/components/shop/OrdersBoard'

// Founder only. The keepsake orders that have actually been paid for and now
// need making and posting.
//
// Fulfilment is by hand for the first fifty, which was the deliberate call: no
// printer is wired up and integrating one before anybody has bought anything is
// work spent on a guess. But by hand still needs somewhere to look, or an order
// lives in an email that scrolls away while a family waits. This is that place.
//
// Read with the service key because RLS makes an order visible only to the
// family that placed it, which is right, and would otherwise hide every order
// from the one person who has to post them.

export const metadata = { title: 'Keepsake orders · Guided Childhood' }
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if ((user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) redirect('/dashboard')

  let admin
  try { admin = createAdminClient() } catch {
    return <Empty note="No service key is configured, so orders cannot be read." />
  }

  const { data: orders, error } = await admin
    .from('orders')
    .select('id, status, total_pence, email, shipping_json, created_at, paid_at, fulfilled_at, child_id')
    .in('status', ['paid', 'fulfilled'])
    .order('created_at', { ascending: false })
    .limit(200)

  // Before migration 102 the table does not exist. Say so rather than crashing.
  if (error) return <Empty note="The shop tables are not there yet. Run migration 102." />
  if (!orders?.length) return <Empty note="No orders yet. They land here the moment one is paid for." />

  const ids = orders.map(o => o.id as string)
  const childIds = [...new Set(orders.map(o => o.child_id).filter(Boolean))] as string[]

  const [{ data: items }, { data: products }, { data: kids }] = await Promise.all([
    admin.from('order_items').select('order_id, product_key, qty, personalisation').in('order_id', ids),
    admin.from('products').select('key, name, personalised'),
    childIds.length
      ? admin.from('children').select('id, name').in('id', childIds)
      : Promise.resolve({ data: [] }),
  ])

  const productByKey = new Map((products ?? []).map(p => [p.key as string, p]))
  const childById = new Map((kids ?? []).map(k => [k.id as string, k.name as string]))

  const rows: OrderRow[] = orders.map(o => {
    const mine = (items ?? []).filter(i => i.order_id === o.id)
    const childName = o.child_id ? childById.get(o.child_id as string) ?? null : null
    return {
      id: o.id as string,
      status: o.status as 'paid' | 'fulfilled',
      totalPence: Number(o.total_pence) || 0,
      email: (o.email as string | null) ?? null,
      placedAt: (o.paid_at as string | null) ?? (o.created_at as string),
      // Only worth showing when something in the order is actually printed for
      // this child. On a sticker sheet the child's name is noise.
      childName: mine.some(i => productByKey.get(i.product_key as string)?.personalised) ? childName : null,
      address: addressLines(o.shipping_json),
      lines: mine.map(i => ({
        name: productByKey.get(i.product_key as string)?.name ?? (i.product_key as string),
        qty: Number(i.qty) || 1,
      })),
    }
  })

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
      <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ‹ Home
      </Link>
      <p className="eyebrow" style={{ color: 'var(--terracotta-dark)', margin: '10px 0 8px' }}>Founder only</p>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 8 }}>
        Keepsake orders
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, marginBottom: 24, maxWidth: 540 }}>
        Paid and waiting to be made. Mark one as posted once it is in the post box, and it drops to the bottom.
      </p>
      <OrdersBoard rows={rows} />
    </div>
  )
}

// The posted address, flattened for reading and copying. Stripe nests it under
// address; older payloads put the name alongside.
function addressLines(shipping: unknown): string[] {
  if (!shipping || typeof shipping !== 'object') return []
  const d = shipping as { name?: string | null; address?: Record<string, string | null> | null }
  const a = d.address ?? {}
  return [d.name, a.line1, a.line2, a.city, a.state, a.postal_code, a.country]
    .filter((x): x is string => Boolean(x && x.trim()))
}

function Empty({ note }: { note: string }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
      <Link href="/dashboard" style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>
        ‹ Home
      </Link>
      <h1 style={{ fontSize: 'clamp(1.9rem, 6vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '14px 0 10px' }}>
        Keepsake orders
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6 }}>{note}</p>
    </div>
  )
}
