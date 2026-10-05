import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getOrCreateCode } from '@/lib/referrals/server'
import { REWARD_PENCE } from '@/lib/referrals'

// The parent's own Give £5, get £5: their code (made on first visit), where
// their £5 goes, and how each friend is getting on. Friends are shown by
// status and date only, never by name or email.

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
  let mine: { code: string; paypal_email: string | null }
  try {
    mine = await getOrCreateCode(user.id, (profile?.full_name as string | null)?.split(/\s+/)[0])
  } catch {
    return NextResponse.json({ error: 'not ready' }, { status: 503 })
  }

  const { data: rows } = await supabase
    .from('referrals')
    .select('status, created_at, joined_at, qualified_at, paid_at, reward_pence')
    .eq('referrer_id', user.id)
    .neq('status', 'void')
    .order('created_at', { ascending: false })
    .limit(50)

  const friends = (rows ?? []).map(r => ({
    status: r.status as string,
    since: (r.paid_at ?? r.qualified_at ?? r.joined_at ?? r.created_at) as string,
    joinedAt: r.joined_at as string | null,
  }))
  const earnedPence = (rows ?? []).filter(r => r.status === 'qualified' || r.status === 'paid')
    .reduce((n, r) => n + (Number(r.reward_pence) || REWARD_PENCE), 0)

  return NextResponse.json({ code: mine.code, paypalEmail: mine.paypal_email, friends, earnedPence })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { paypalEmail } = await request.json().catch(() => ({})) as { paypalEmail?: string }
  const email = typeof paypalEmail === 'string' ? paypalEmail.trim().slice(0, 200) : ''
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'That does not look like an email address.' }, { status: 400 })
  }
  const { error } = await supabase.from('referral_codes')
    .update({ paypal_email: email || null, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
  if (error) return NextResponse.json({ error: 'Could not save that.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
