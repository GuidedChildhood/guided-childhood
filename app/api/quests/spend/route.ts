import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStarBanks } from '@/lib/quests/bank'
import { STAR_MINUTES } from '@/lib/quests/templates'

// Screen time gets used: the parent marks the minutes and the stars come
// off the bank. The whole point of the deal is that earned time is real,
// so spending it is one tap, never a negotiation. Balance is computed
// server side and a spend can never take the bank below zero.

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { child_id, minutes } = await req.json()
  const mins = Number(minutes)
  if (!child_id || !Number.isFinite(mins) || mins < STAR_MINUTES || mins > 480) {
    return NextResponse.json({ error: 'child_id and minutes required' }, { status: 400 })
  }

  const { data: child } = await supabase
    .from('children').select('id').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
  if (!child) return NextResponse.json({ error: 'Child not found' }, { status: 404 })

  const [bank] = await getStarBanks(supabase, user.id, [child_id])
  if (!bank || bank.balance <= 0) {
    return NextResponse.json({ error: 'Nothing in the bank yet' }, { status: 400 })
  }

  // Round the ask to whole stars and never spend more than is there
  const stars = Math.min(bank.balance, Math.max(1, Math.round(mins / STAR_MINUTES)))
  const { error } = await supabase.from('star_spends').insert({
    user_id: user.id,
    child_id,
    stars,
    minutes: stars * STAR_MINUTES,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const balance = bank.balance - stars
  return NextResponse.json({
    ok: true,
    spent_stars: stars,
    spent_minutes: stars * STAR_MINUTES,
    balance,
    balance_minutes: balance * STAR_MINUTES,
  })
}
