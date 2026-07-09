import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// The parent gave us their email at the end of the starter quiz. Save it with
// their answers, keyed by email, so a lead is captured even if they never
// finish signup, and a return visit can pick up where they left off. Best
// effort: a failure here never blocks the parent from seeing their pathway,
// the client already holds the answers in localStorage.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { email?: string; answers?: Record<string, unknown>; stageId?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }

  const answers = body.answers && typeof body.answers === 'object' ? body.answers : {}
  const stageId = typeof body.stageId === 'string' ? body.stageId.slice(0, 40) : null

  try {
    const supabase = createAdminClient()
    // Upsert on email so re running the quiz updates the same lead. Never
    // flip converted back to false from here; signup owns that flag.
    const { error } = await supabase
      .from('starter_leads')
      .upsert(
        { email, answers, stage_id: stageId, updated_at: new Date().toISOString() },
        { onConflict: 'email' },
      )
    if (error) return NextResponse.json({ ok: false }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}
