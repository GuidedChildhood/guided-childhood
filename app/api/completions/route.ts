import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { sort_order, worked } = await req.json()
  if (!sort_order || typeof sort_order !== 'number') {
    return NextResponse.json({ error: 'missing sort_order' }, { status: 400 })
  }
  if (worked !== undefined && !['yes', 'somewhat', 'no'].includes(worked)) {
    return NextResponse.json({ error: 'invalid worked value' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('script_completions')
    .upsert(
      { user_id: user.id, script_sort_order: sort_order, ...(worked ? { worked } : {}) },
      { onConflict: 'user_id,script_sort_order' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ completions: [] })

  const { data } = await supabase
    .from('script_completions')
    .select('script_sort_order, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  return NextResponse.json({ completions: data ?? [] })
}
