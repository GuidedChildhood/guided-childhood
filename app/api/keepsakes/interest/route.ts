import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// A parent registering interest in a real world keepsake: a printed passport, a
// set of Planet Friend charms, or both. Best effort, exactly like the starter
// lead capture: a failure never blocks the page, and the table (migration 097)
// may not exist yet in every environment, so a missing table is treated as a
// quiet no op rather than an error the parent ever sees.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ITEMS = new Set(['printed_passport', 'charm_set', 'both'])

export async function POST(req: NextRequest) {
  let body: { email?: string; item?: string; childName?: string; note?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const item = typeof body.item === 'string' ? body.item : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }
  if (!ITEMS.has(item)) return NextResponse.json({ error: 'invalid item' }, { status: 400 })

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('keepsake_interest').insert({
      user_id: user?.id ?? null,
      email,
      item,
      child_name: typeof body.childName === 'string' ? body.childName.slice(0, 80) : null,
      note: typeof body.note === 'string' ? body.note.slice(0, 500) : null,
    })
    // A missing table or any write error is a quiet no op: the parent still
    // gets a warm confirmation, and we lose nothing the client cannot resend.
    if (error) return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}
