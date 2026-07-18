import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// A parent opening a moment card and reading it counts as doing today's moment,
// so the daily pathway ticks the Moment step from the library too, not only
// from the daily deck. Idempotent on the unique (user, moment, day), so opening
// the same card twice never double counts.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { momentId } = await request.json().catch(() => ({})) as { momentId?: string }
  if (!momentId || !/^[0-9a-f-]{36}$/i.test(momentId)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  const { data: child } = await supabase
    .from('children').select('id').eq('parent_id', user.id).eq('is_primary', true).maybeSingle()

  const { error } = await supabase.from('moment_completions').upsert({
    user_id: user.id,
    child_id: (child as { id?: string } | null)?.id ?? null,
    moment_id: momentId,
  }, { onConflict: 'user_id,moment_id,completed_on' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
