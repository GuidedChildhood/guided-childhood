import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// A device row carries a status: 'done' (settings are set up) or 'not_owned'
// (we do not have this yet, keep it off the active checklist but findable).
// POST upserts the row with whichever status is sent, defaulting to done so
// the old callers keep working. DELETE clears the row back to unset.
const STATUSES = new Set(['done', 'not_owned'])

export async function POST(req: NextRequest) {
  const { device_key, status } = await req.json()
  if (!device_key || typeof device_key !== 'string') {
    return NextResponse.json({ error: 'missing device_key' }, { status: 400 })
  }
  const value = typeof status === 'string' && STATUSES.has(status) ? status : 'done'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Try with the status column (migration 090). If it is not applied yet,
  // fall back to the plain upsert so marking set up still works.
  let { error } = await supabase
    .from('device_setup_progress')
    .upsert(
      { user_id: user.id, device_key, status: value },
      { onConflict: 'user_id,device_key' }
    )
  if (error && /status/.test(error.message)) {
    ;({ error } = await supabase
      .from('device_setup_progress')
      .upsert({ user_id: user.id, device_key }, { onConflict: 'user_id,device_key' }))
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { device_key } = await req.json()
  if (!device_key || typeof device_key !== 'string') {
    return NextResponse.json({ error: 'missing device_key' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('device_setup_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('device_key', device_key)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
