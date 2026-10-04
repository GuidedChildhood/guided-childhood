import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'
import { referralStage, type PaidInvoice } from '@/lib/referrals'

// Give £5, get £5: the daily check (migration 360).
//
// For every referral not yet settled, ask Stripe what the friend has actually
// paid, and move it along: started, joined (first real payment), qualified
// (second paid month, or 60 days into a year: £5 now owed to the person who
// shared). A refund voids it. A friend who never pays within 45 days, or who
// leaves before qualifying, is voided too, so the list stays honest.
//
// Read from Stripe rather than from webhooks on purpose: one daily pass over a
// handful of rows is simpler to trust than counting events that can arrive
// late, twice, or not at all. Paying out is separate and by hand, from the
// founder's payout list (/api/admin/referrals).

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const NEVER_JOINED_DAYS = 45

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  if (!process.env.STRIPE_SECRET_KEY) return NextResponse.json({ ok: true, skipped: 'no stripe key', processed: 0 })

  const admin = createAdminClient()
  const { data: open } = await admin
    .from('referrals')
    .select('id, code, stripe_customer_id, status, created_at, joined_at')
    .in('status', ['started', 'joined'])
    .order('created_at', { ascending: true })
    .limit(200)

  let joined = 0, qualified = 0, voided = 0
  for (const r of open ?? []) {
    if (!r.stripe_customer_id) continue
    try {
      const subs = await stripe.subscriptions.list({ customer: r.stripe_customer_id, status: 'all', limit: 10 })
      const sub = subs.data.find(s => s.metadata?.ref_code === r.code) ?? subs.data[0] ?? null
      const interval = (sub?.items.data[0]?.price?.recurring?.interval as 'month' | 'year' | undefined) ?? null

      const invoices = await stripe.invoices.list({ customer: r.stripe_customer_id, status: 'paid', limit: 12 })
      const paidInvoices: PaidInvoice[] = invoices.data
        .filter(i => !sub || !i.parent?.subscription_details?.subscription || i.parent.subscription_details.subscription === sub.id)
        .map(i => ({ paidAt: new Date(((i.status_transitions?.paid_at ?? i.created) as number) * 1000), amountPaid: i.amount_paid }))

      const charges = await stripe.charges.list({ customer: r.stripe_customer_id, limit: 12 })
      const refunded = charges.data.some(c => c.refunded || (c.amount_refunded ?? 0) > 0)

      const stage = referralStage({ interval, subscriptionStatus: sub?.status ?? null, paidInvoices, refunded })
      const ageDays = (Date.now() - new Date(String(r.created_at)).getTime()) / 86_400_000
      const gone = !sub || sub.status === 'canceled' || sub.status === 'incomplete_expired'

      let next: { status: string; void_reason?: string } | null = null
      if (stage.status === 'void') next = { status: 'void', void_reason: stage.reason }
      else if (stage.status === 'qualified') next = { status: 'qualified' }
      else if (stage.status === 'joined' && gone) next = { status: 'void', void_reason: 'left before qualifying' }
      else if (stage.status === 'joined' && r.status === 'started') next = { status: 'joined' }
      else if (stage.status === 'started' && ageDays > NEVER_JOINED_DAYS) next = { status: 'void', void_reason: 'never joined' }

      if (!next) continue
      const now = new Date().toISOString()
      await admin.from('referrals').update({
        ...next,
        ...(next.status === 'joined' ? { joined_at: now } : {}),
        ...(next.status === 'qualified' ? { qualified_at: now, joined_at: r.joined_at ?? now } : {}),
      }).eq('id', r.id)
      if (next.status === 'joined') joined++
      else if (next.status === 'qualified') qualified++
      else voided++
    } catch (e) {
      console.error('[referrals cron] could not read Stripe for a referral', r.id, e)
    }
  }

  return NextResponse.json({ ok: true, processed: open?.length ?? 0, joined, qualified, voided })
}

export const GET = withHeartbeat('/api/cron/referrals', handler)
