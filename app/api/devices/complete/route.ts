import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { device_key } = await req.json()
  if (!device_key || typeof device_key !== 'string') {
    return NextResponse.json({ error: 'missing device_key' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('device_setup_progress')
    .upsert(
      { user_id: user.id, device_key },
      { onConflict: 'user_id,device_key' }
    )

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
