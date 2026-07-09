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
    // Only ping the founder for a genuinely new lead, not a quiz re run.
    const { data: existing } = await supabase
      .from('starter_leads').select('email').eq('email', email).maybeSingle()

    // Upsert on email so re running the quiz updates the same lead. Never
    // flip converted back to false from here; signup owns that flag.
    const { error } = await supabase
      .from('starter_leads')
      .upsert(
        { email, answers, stage_id: stageId, updated_at: new Date().toISOString() },
        { onConflict: 'email' },
      )
    if (error) return NextResponse.json({ ok: false }, { status: 200 })

    if (!existing) await notifyFounder(req, supabase, email)
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 })
  }

  return NextResponse.json({ ok: true })
}

// Ping the founder's phone the moment a new email lands, so signups are
// visible in real time. Best effort: looks up the founder account by email
// and pushes through the existing send route. Never blocks the response.
async function notifyFounder(
  req: NextRequest,
  supabase: ReturnType<typeof createAdminClient>,
  leadEmail: string,
) {
  try {
    const founderEmail = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
    const { data: founder } = await supabase
      .from('profiles').select('id').eq('email', founderEmail).maybeSingle()
    if (!founder?.id) return
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({
        userId: founder.id,
        title: 'New Guided Childhood signup 🎉',
        body: leadEmail,
        url: '/dashboard',
      }),
    })
  } catch { /* founder ping is best effort */ }
}
