import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

// Resend email events webhook. Resend POSTs delivery events here (sent,
// delivered, bounced, complained). We care about the two that mean an address
// must never be emailed again: a hard bounce (the mailbox does not exist) and
// a spam complaint (they hit report spam). Both suppress the recipient, which
// is the single most important thing for keeping the funnel's sender
// reputation healthy: a list that keeps hitting dead addresses lands the whole
// domain in spam.
//
// Suppression is honest and reversible: a member's email_opt_out flips true
// (the same flag the unsubscribe link uses, so the lifecycle cron already
// respects it), and a lead's nurtured_at is stamped so the nurture never
// fires. No new table.
//
// Auth: Resend signs every webhook per the svix spec (svix-id,
// svix-timestamp, svix-signature over the raw body). Verified with HMAC
// SHA256 and RESEND_WEBHOOK_SECRET (the whsec_ value from the Resend webhook
// settings), no svix package needed. Set that env var and point a Resend
// webhook at /api/email/webhook for bounced and complained events.

const SVIX_TOLERANCE_SECONDS = 300

function verifySvix(secret: string, id: string, timestamp: string, signatureHeader: string, rawBody: string): boolean {
  const ts = Number(timestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > SVIX_TOLERANCE_SECONDS) return false
  let key: Buffer
  try {
    key = Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64')
  } catch { return false }
  const expected = Buffer.from(createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest('base64'))
  return signatureHeader.split(' ').some(entry => {
    const [version, sig] = entry.split(',')
    if (version !== 'v1' || !sig) return false
    const given = Buffer.from(sig)
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}

function recipients(data: Record<string, unknown>): string[] {
  const to = data.to ?? data.email ?? []
  const arr = Array.isArray(to) ? to : [to]
  return arr
    .map(v => {
      if (v && typeof v === 'object') return String((v as Record<string, unknown>).email ?? '')
      return String(v ?? '')
    })
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET ?? process.env.RESEND_INBOUND_SIGNING_SECRET
  const rawBody = await req.text()

  if (secret) {
    const id = req.headers.get('svix-id') ?? ''
    const timestamp = req.headers.get('svix-timestamp') ?? ''
    const signature = req.headers.get('svix-signature') ?? ''
    if (!verifySvix(secret, id, timestamp, signature, rawBody)) {
      return NextResponse.json({ error: 'bad signature' }, { status: 401 })
    }
  }

  let payload: Record<string, unknown>
  try { payload = JSON.parse(rawBody) } catch { return NextResponse.json({ error: 'bad body' }, { status: 400 }) }

  const type = String(payload.type ?? '')
  const data = (payload.data ?? {}) as Record<string, unknown>

  // A complaint always suppresses. A bounce suppresses when it is hard, ie the
  // mailbox is gone; a transient soft bounce is left alone so a temporary blip
  // never opts out a real member.
  let suppress = type === 'email.complained'
  if (type === 'email.bounced') {
    const bounce = (data.bounce ?? {}) as Record<string, unknown>
    const kind = String(bounce.type ?? bounce.subType ?? '').toLowerCase()
    suppress = !kind || /hard|permanent|undetermined|suppress/.test(kind)
  }

  if (!suppress) return NextResponse.json({ ok: true, ignored: type })

  const emails = recipients(data)
  if (emails.length === 0) return NextResponse.json({ ok: true, suppressed: 0 })

  const supabase = createAdminClient()
  let suppressed = 0
  for (const email of emails) {
    try {
      await supabase.from('profiles').update({ email_opt_out: true }).ilike('email', email)
      await supabase.from('starter_leads').update({ nurtured_at: new Date().toISOString() }).eq('email', email).is('nurtured_at', null)
      suppressed++
    } catch { /* best effort per address */ }
  }

  return NextResponse.json({ ok: true, type, suppressed })
}
