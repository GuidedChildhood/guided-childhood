import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'

// The parent's side of the school link: create or update the connection,
// get back the private forwarding address, pause or resume it, delete it.
// GET also returns any Gmail forwarding verification code the inbound
// webhook has caught, so the setup screen can poll and display it in flow.

const INBOUND_DOMAIN = process.env.SCHOOL_INBOUND_DOMAIN ?? 'in.guidedchildhood.com'
const forwardAddress = (token: string) => `school+${token}@${INBOUND_DOMAIN}`

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data } = await supabase
    .from('school_connections')
    .select('school_name, sender_addresses, forward_token, active, verification_code, verification_link, verification_received_at')
    .eq('user_id', user.id)
    .maybeSingle()
  return NextResponse.json({
    connection: data ? { ...data, forward_address: forwardAddress(data.forward_token) } : null,
  })
}

export async function POST(req: NextRequest) {
  const { school_name, sender_addresses } = await req.json()
  if (!school_name || typeof school_name !== 'string') {
    return NextResponse.json({ error: 'missing school_name' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const senders = Array.isArray(sender_addresses)
    ? sender_addresses.map((s: string) => String(s).toLowerCase().trim()).filter(Boolean).slice(0, 10)
    : []

  const { data: existing } = await supabase
    .from('school_connections').select('id, forward_token').eq('user_id', user.id).maybeSingle()

  const token = existing?.forward_token ?? randomBytes(9).toString('hex')
  const row = { user_id: user.id, school_name: school_name.slice(0, 120), sender_addresses: senders, forward_token: token, active: true }

  const { error } = existing
    ? await supabase.from('school_connections').update(row).eq('id', existing.id)
    : await supabase.from('school_connections').insert(row)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ forward_token: token, forward_address: forwardAddress(token) })
}

// PATCH: pause or resume the connection.
export async function PATCH(req: NextRequest) {
  const { active } = await req.json()
  if (typeof active !== 'boolean') {
    return NextResponse.json({ error: 'missing active' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('school_connections').update({ active }).eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE: remove the connection entirely. The private address stops
// resolving the moment this row is gone.
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('school_connections').delete().eq('user_id', user.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
