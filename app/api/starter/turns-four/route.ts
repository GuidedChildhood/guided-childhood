import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { cleanMonth, UNDER_FOUR_STAGE } from '@/lib/starter/turns-four'

// The parent of a child under 4 asked us to write the month they turn 4.
// See lib/starter/turns-four.ts. Best effort and quiet: a failure tells the
// parent it did not save, it never throws.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { email?: unknown; turnsFour?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const turnsFour = cleanMonth(body.turnsFour)
  if (!email || email.length > 254 || !EMAIL_RE.test(email) || !turnsFour) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  try {
    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from('starter_leads').select('email, answers, stage_id').eq('email', email).maybeSingle()
    const now = new Date().toISOString()
    if (existing) {
      // Already a lead (an older child's stage check, a printable). Keep what
      // is there and add the month; never move an older child's stage.
      const answers = { ...((existing.answers as Record<string, unknown> | null) ?? {}), turnsFour }
      const { error } = await supabase.from('starter_leads').update({ answers, updated_at: now }).eq('email', email)
      if (error) return NextResponse.json({ ok: false }, { status: 200 })
    } else {
      const { error } = await supabase.from('starter_leads').insert({
        email, answers: { turnsFour }, stage_id: UNDER_FOUR_STAGE,
        // Stamped now so the generic lead nurture passes this parent by.
        nurtured_at: now, updated_at: now,
      })
      if (error) return NextResponse.json({ ok: false }, { status: 200 })
    }
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }
  return NextResponse.json({ ok: true })
}
