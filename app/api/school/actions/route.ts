import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// The parent's open school actions: the Things you need to know card reads
// them via the dashboard's server render and marks them done or dismissed
// through PATCH here.

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('school_actions')
    .select('id, kind, title, detail, due_date')
    .eq('user_id', user.id)
    .eq('status', 'open')
    .order('due_date', { ascending: true, nullsFirst: false })
    .limit(12)
  return NextResponse.json({ actions: data ?? [] })
}

export async function PATCH(req: NextRequest) {
  const { id, status } = await req.json()
  if (!id || !['done', 'dismissed'].includes(status)) {
    return NextResponse.json({ error: 'missing or invalid id / status' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('school_actions').update({ status }).eq('id', id).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
