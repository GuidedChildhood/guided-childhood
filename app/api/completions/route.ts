import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { sort_order, worked, worked_line, child_id } = await req.json()
  if (!sort_order || typeof sort_order !== 'number') {
    return NextResponse.json({ error: 'missing sort_order' }, { status: 400 })
  }
  if (worked !== undefined && !['yes', 'somewhat', 'no'].includes(worked)) {
    return NextResponse.json({ error: 'invalid worked value' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // The winning line arrives as a second call after the rating, so it patches
  // rather than replaces: a save carrying only worked_line must not blank the
  // yes it belongs to. Trimmed and bounded, since it is parent typed text.
  const line = typeof worked_line === 'string' && worked_line.trim()
    ? worked_line.trim().slice(0, 400)
    : null

  // Whose child this was done with, checked rather than trusted. Null falls
  // to the first child, which is what the old family wide row meant.
  let forChild: string | null = null
  if (typeof child_id === 'string' && child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
    forChild = owned?.id ?? null
  }
  if (!forChild) {
    const { data: kids } = await supabase
      .from('children').select('id').eq('parent_id', user.id)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }).limit(1)
    forChild = (kids ?? [])[0]?.id ?? null
  }

  // A script is a conversation with ONE child (migration 213), and the key is
  // per child since 219, so reading it with Jody ticks Jody's day and leaves
  // Tray's untouched.
  const { error } = await supabase
    .from('script_completions')
    .upsert(
      {
        user_id: user.id,
        child_id: forChild,
        script_sort_order: sort_order,
        ...(worked ? { worked } : {}),
        ...(line ? { worked_line: line } : {}),
      },
      { onConflict: 'user_id,child_id,script_sort_order' }
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
