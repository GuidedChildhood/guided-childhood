import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { createClient } from '@/lib/supabase/server'

// The parent's side of the school link: create or update the connection,
// get back the private forwarding address, pause or resume it, delete it.
// GET also returns any Gmail forwarding verification code the inbound
// webhook has caught, so the setup screen can poll and display it in flow.
//
// THE ADDRESS COMES FIRST AND COSTS NOTHING (17 September 2026).
//
// This route used to refuse to create anything without a school name, and the
// screen in front of it also asked for the school's sender addresses. Both are
// questions a parent answers badly or not at all: the name is easy but
// pointless to ask before we have anything to show, and almost nobody knows
// what address their school's system actually sends from. So POST with an
// empty body now mints the address immediately, and both fields became things
// we LEARN from the first email and ask the parent to confirm. Passing a name
// or senders still works, which is what the confirm step and the manage view
// use.

const INBOUND_DOMAIN = process.env.SCHOOL_INBOUND_DOMAIN ?? 'in.guidedchildhood.com'
const forwardAddress = (token: string) => `school+${token}@${INBOUND_DOMAIN}`

// Columns added by migration 303, read separately and guarded, because
// migrations run by hand here and naming a missing column fails the whole
// query it is part of. On this screen that would mean a parent midway through
// setup seeing no address at all. An error just means we cannot say whether an
// email has landed yet, which the screen renders as "nothing yet".
const ARRIVAL_COLUMNS = 'first_email_at, last_email_at, emails_caught, learned_domain'

type Arrival = {
  first_email_at: string | null
  last_email_at: string | null
  emails_caught: number
  learned_domain: string | null
}

const NO_ARRIVAL: Arrival = { first_email_at: null, last_email_at: null, emails_caught: 0, learned_domain: null }

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { data } = await supabase
    .from('school_connections')
    .select('school_name, sender_addresses, forward_token, active, verification_code, verification_link, verification_received_at')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!data) return NextResponse.json({ connection: null })

  let arrival = NO_ARRIVAL
  try {
    const { data: extra, error } = await supabase
      .from('school_connections').select(ARRIVAL_COLUMNS).eq('user_id', user.id).maybeSingle()
    if (!error && extra) arrival = { ...NO_ARRIVAL, ...(extra as Partial<Arrival>) }
  } catch { /* pre 303: we cannot tell whether anything has landed */ }

  return NextResponse.json({
    connection: { ...data, ...arrival, forward_address: forwardAddress(data.forward_token) },
  })
}

export async function POST(req: NextRequest) {
  // An empty body is the normal case: give me my address, ask me nothing.
  let body: Record<string, unknown> = {}
  try { body = (await req.json()) ?? {} } catch { /* no body, all defaults */ }
  const { school_name, sender_addresses } = body as { school_name?: unknown; sender_addresses?: unknown }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: existing } = await supabase
    .from('school_connections')
    .select('id, forward_token, school_name, sender_addresses')
    .eq('user_id', user.id)
    .maybeSingle()

  const token = existing?.forward_token ?? randomBytes(9).toString('hex')

  // Only what was actually passed is written. A confirm step that names the
  // school must not blank the senders we learned, and a senders update must
  // not blank the name, which is what a whole row write would do to both.
  const row: Record<string, unknown> = { user_id: user.id, forward_token: token, active: true }
  if (typeof school_name === 'string' && school_name.trim()) {
    row.school_name = school_name.trim().slice(0, 120)
  } else if (!existing) {
    row.school_name = null
  }
  if (Array.isArray(sender_addresses)) {
    row.sender_addresses = sender_addresses
      .map((s: unknown) => String(s).toLowerCase().trim()).filter(Boolean).slice(0, 10)
  } else if (!existing) {
    row.sender_addresses = []
  }

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
