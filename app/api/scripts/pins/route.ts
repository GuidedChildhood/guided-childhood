import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// MY SCRIPTS: keep a script to hand, or take it out (migration 402).
//
// Up to five, held here rather than in the table, so a parent who somehow has
// six loses nothing and simply cannot add a seventh. The parent's own session
// writes their own rows (RLS), so there is no service role in this route.

const MAX_PINS = 5

export async function POST(req: NextRequest) {
  const { sortOrder, pinned } = await req.json().catch(() => ({}))
  const order = Number(sortOrder)
  if (!Number.isInteger(order) || order < 0 || typeof pinned !== 'boolean') {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  if (!pinned) {
    const { error } = await supabase.from('script_pins').delete().eq('user_id', user.id).eq('script_sort_order', order)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  } else {
    const { count } = await supabase.from('script_pins').select('script_sort_order', { count: 'exact', head: true }).eq('user_id', user.id)
    if ((count ?? 0) >= MAX_PINS) return NextResponse.json({ error: 'full', max: MAX_PINS }, { status: 409 })
    const { error } = await supabase.from('script_pins').upsert({ user_id: user.id, script_sort_order: order }, { onConflict: 'user_id,script_sort_order', ignoreDuplicates: true })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = await supabase.from('script_pins').select('script_sort_order').eq('user_id', user.id).order('created_at')
  return NextResponse.json({ ok: true, pins: (data ?? []).map(r => r.script_sort_order as number) })
}
