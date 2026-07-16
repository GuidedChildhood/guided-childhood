import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMagnet } from '@/lib/magnets/registry'
import { sendEmail } from '@/lib/email'
import { magnetEmail } from '@/lib/email/templates'

// A parent asked for a free printable in exchange for their email. Save
// the lead onto the same list the starter quiz fills (tagged by which
// magnet), email them the download, and ping the founder for a genuinely
// new lead. Best effort throughout: the client already reveals the
// download on a 200, so a save or send hiccup never blocks the parent.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { email?: string; slug?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
  const magnet = getMagnet(slug)

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }
  if (!magnet) return NextResponse.json({ error: 'unknown magnet' }, { status: 400 })

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin
  const downloadPath = `/api/magnet/${magnet.slug}/pdf`
  const downloadUrl = `${origin}${downloadPath}`

  try {
    const supabase = createAdminClient()

    // Only ping the founder for a brand new email, not a repeat download.
    const { data: existing } = await supabase
      .from('starter_leads').select('email').eq('email', email).maybeSingle()

    // Upsert on email, writing only these columns, so a lead who already
    // did the starter quiz keeps their saved answers and stage. The
    // source records where this touch came from.
    await supabase
      .from('starter_leads')
      .upsert(
        { email, source: `magnet:${magnet.slug}`, updated_at: new Date().toISOString() },
        { onConflict: 'email' },
      )

    // Deliver the download to their inbox. Best effort.
    await sendEmail({ to: email, ...magnetEmail({ magnetTitle: magnet.title, downloadUrl }) })

    if (!existing) await notifyFounder(req, supabase, email, magnet.slug)
  } catch {
    // Swallow: the parent still gets their download from the response.
  }

  return NextResponse.json({ ok: true, download: downloadPath })
}

// Ping the founder's phone the moment a new email lands, so leads are
// visible in real time. Looks up the founder account by email and pushes
// through the existing send route. Never blocks the response.
async function notifyFounder(
  req: NextRequest,
  supabase: ReturnType<typeof createAdminClient>,
  leadEmail: string,
  slug: string,
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
        title: 'New lead from a free download 🎁',
        body: `${leadEmail} · ${slug}`,
        url: '/dashboard',
      }),
    })
  } catch { /* founder ping is best effort */ }
}
