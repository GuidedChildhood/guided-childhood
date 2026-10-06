import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { HAND_CHECK_OVER } from '@/lib/referrals'

// The founder's monthly PayPal run for Give £5, get £5 (migration 360).
//
// GET lists everyone owed, grouped by the person who shared: their PayPal
// email, how many friends qualified, the total, and a flag when one link
// earned more than ten rewards this month (checked by hand before paying, the
// plan's stand in for a cap). ?format=csv gives the same as a PayPal payouts
// file. POST { referrerIds } marks those people's owed rewards as paid, after
// the PayPal payment has gone out. Founder gated, same rule as the members
// board.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function founder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user && (user.email ?? '').toLowerCase() === FOUNDER_EMAIL ? user : null
}

type Owed = { referrerId: string; code: string; paypalEmail: string | null; count: number; pence: number; thisMonth: number; handCheck: boolean }

async function owedList(): Promise<Owed[]> {
  const admin = createAdminClient()
  const { data: rows } = await admin.from('referrals')
    .select('referrer_id, code, reward_pence, qualified_at')
    .eq('status', 'qualified')
    .limit(2000)
  const monthStart = new Date(); monthStart.setUTCDate(1); monthStart.setUTCHours(0, 0, 0, 0)
  const by = new Map<string, Owed>()
  for (const r of rows ?? []) {
    const id = r.referrer_id as string
    const o = by.get(id) ?? { referrerId: id, code: r.code as string, paypalEmail: null, count: 0, pence: 0, thisMonth: 0, handCheck: false }
    o.count++
    o.pence += Number(r.reward_pence) || 500
    if (r.qualified_at && new Date(String(r.qualified_at)) >= monthStart) o.thisMonth++
    by.set(id, o)
  }
  if (by.size > 0) {
    const { data: codes } = await admin.from('referral_codes').select('user_id, paypal_email').in('user_id', [...by.keys()])
    for (const c of codes ?? []) {
      const o = by.get(c.user_id as string)
      if (o) o.paypalEmail = (c.paypal_email as string | null) ?? null
    }
  }
  return [...by.values()].map(o => ({ ...o, handCheck: o.thisMonth > HAND_CHECK_OVER }))
    .sort((a, b) => b.pence - a.pence)
}

export async function GET(request: Request) {
  if (!(await founder())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const owed = await owedList()

  if (new URL(request.url).searchParams.get('format') === 'csv') {
    // Only people with a PayPal email and no hand check outstanding. Check the
    // columns against PayPal's current payouts template before uploading.
    const lines = ['Email,Amount,Currency,Reference,Note']
    for (const o of owed.filter(o => o.paypalEmail && !o.handCheck)) {
      lines.push([o.paypalEmail, (o.pence / 100).toFixed(2), 'GBP', `GC-${o.code}`, `Guided Childhood: thank you for ${o.count} friend${o.count === 1 ? '' : 's'}`].join(','))
    }
    return new NextResponse(lines.join('\n') + '\n', {
      headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="guided-childhood-referral-payouts.csv"' },
    })
  }
  return NextResponse.json({ owed })
}

export async function POST(request: Request) {
  if (!(await founder())) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  const { referrerIds } = await request.json().catch(() => ({})) as { referrerIds?: string[] }
  const ids = Array.isArray(referrerIds) ? referrerIds.filter(i => /^[0-9a-f-]{36}$/i.test(i)) : []
  if (ids.length === 0) return NextResponse.json({ error: 'nothing to mark' }, { status: 400 })
  const admin = createAdminClient()
  const { data, error } = await admin.from('referrals')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .in('referrer_id', ids).eq('status', 'qualified')
    .select('id')
  if (error) return NextResponse.json({ error: 'could not mark paid' }, { status: 500 })
  return NextResponse.json({ ok: true, marked: data?.length ?? 0 })
}
