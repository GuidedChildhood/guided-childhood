import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

// Founder only. The legal watch queue behind the insights board. GET lists what
// the quarterly check has raised and not yet been dealt with; POST closes one,
// either actioned (you went and did something) or dismissed (you looked and it
// does not apply).
//
// Closing carries an optional note, because in six months the useful thing is
// not that a row was dismissed but WHY, and that is exactly what nobody writes
// down and everybody later wishes they had.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

async function requireFounder() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) return null
  return user
}

export async function GET() {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('legal_watch_items')
    .select('id, area, headline, summary, impact, confidence, effective_on, url, created_at')
    .eq('status', 'pending')
    // Anything with a date attached first, soonest first, because a duty that
    // commences next month matters more than one that might land some day.
    .order('effective_on', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  return NextResponse.json({ items: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!(await requireFounder())) return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  const { id, action, note } = await req.json().catch(() => ({}))
  if (!id || (action !== 'actioned' && action !== 'dismissed')) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const admin = createAdminClient()
  const { error } = await admin
    .from('legal_watch_items')
    .update({
      status: action,
      note: typeof note === 'string' && note.trim() ? note.trim().slice(0, 500) : null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 502 })
  return NextResponse.json({ ok: true })
}
