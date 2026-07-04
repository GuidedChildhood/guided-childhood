import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import Anthropic from '@anthropic-ai/sdk'
import { createAdminClient } from '@/lib/supabase/admin'
import { DIGI_MODEL, DIGI_MODEL_FALLBACKS } from '@/lib/config/digi'

// Inbound school email webhook. The email provider POSTs forwarded school
// emails here. The to address carries the family's private token. DiGi
// extracts the actionable items, writes school_actions, surfaces a dashboard
// prompt, and the raw body is never stored.
//
// Auth, two accepted callers:
// 1. Resend inbound webhooks. Resend signs every webhook per the svix spec
//    (svix-id, svix-timestamp, svix-signature headers over the raw body).
//    We verify manually with HMAC SHA256 and RESEND_INBOUND_SIGNING_SECRET
//    (the whsec_ value from the Resend webhook settings), no svix package
//    needed. Timestamp tolerance five minutes, constant time comparison.
// 2. Fallback for any other provider (SendGrid Inbound Parse or a manual
//    test): the shared secret in the x-inbound-secret header, matched
//    against SCHOOL_INBOUND_SECRET. This is the pre existing path; it is
//    weaker than a signature (no replay protection) but the blast radius is
//    small because a forged request can only create dashboard reminders for
//    a family whose random 18 hex character token the attacker also knows.
//
// Payload shapes: Resend sends { type: 'email.received', data: { from, to,
// subject, text, html } } where to may be an array; the fallback path sends
// flat { to, from, subject, text, html }. Both are normalised below.
//
// Gmail special case: before Gmail will forward anything it emails a
// confirmation code and link TO the forwarding address, from
// forwarding-noreply@google.com. We catch that email, store the code and
// link on the school_connections row, and the setup screen polls
// /api/school/connect to display them so the parent never leaves the flow.

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SVIX_TOLERANCE_SECONDS = 300

function verifySvixSignature(secret: string, id: string, timestamp: string, signatureHeader: string, rawBody: string): boolean {
  const ts = Number(timestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > SVIX_TOLERANCE_SECONDS) return false
  let key: Buffer
  try {
    key = Buffer.from(secret.startsWith('whsec_') ? secret.slice(6) : secret, 'base64')
  } catch { return false }
  const expected = Buffer.from(
    createHmac('sha256', key).update(`${id}.${timestamp}.${rawBody}`).digest('base64')
  )
  // The signature header is space delimited, each entry "v1,<base64>".
  return signatureHeader.split(' ').some(entry => {
    const [version, sig] = entry.split(',')
    if (version !== 'v1' || !sig) return false
    const given = Buffer.from(sig)
    return given.length === expected.length && timingSafeEqual(given, expected)
  })
}

type InboundEmail = { to: string; from: string; subject: string; body: string }

function pickAddress(value: unknown): string {
  const first = Array.isArray(value) ? value[0] : value
  if (first && typeof first === 'object') {
    const rec = first as Record<string, unknown>
    return String(rec.email ?? rec.address ?? '')
  }
  return String(first ?? '')
}

function normalisePayload(payload: unknown): InboundEmail {
  const outer = (payload ?? {}) as Record<string, unknown>
  const source = (outer.type === 'email.received' && outer.data && typeof outer.data === 'object')
    ? outer.data as Record<string, unknown>
    : outer
  return {
    to: pickAddress(source.to),
    from: pickAddress(source.from).toLowerCase(),
    subject: String(source.subject ?? ''),
    body: String(source.text ?? source.html ?? ''),
  }
}

async function extract(subject: string, body: string, schoolName: string) {
  const models = [DIGI_MODEL, ...DIGI_MODEL_FALLBACKS.filter(m => m !== DIGI_MODEL)]
  for (const model of models) {
    try {
      const res = await anthropic.messages.create({
        model,
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Extract actionable items for a parent from this school email from ${schoolName}. Only real actions a parent must do or remember: kit to bring (coat, PE kit, water bottle, wellies), payments due, homework or practice (times tables, reading), events and trips with dates, deadlines, important notices. Ignore newsletters with no action. Today is ${new Date().toISOString().slice(0, 10)}.\n\nSubject: ${subject}\n\n${body.slice(0, 4000)}\n\nReturn ONLY a JSON array (empty if no actions): [{"kind":"kit|payment|homework|event|deadline|notice","title":"max 10 words, imperative","detail":"one sentence","due_date":"YYYY-MM-DD or null"}]`,
        }],
      })
      const text = res.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text).join('')
      const match = text.match(/\[[\s\S]*\]/)
      return match ? JSON.parse(match[0]) as { kind: string; title: string; detail?: string; due_date?: string | null }[] : []
    } catch { /* try next model */ }
  }
  return []
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  const svixId = req.headers.get('svix-id')
  const svixTimestamp = req.headers.get('svix-timestamp')
  const svixSignature = req.headers.get('svix-signature')

  if (svixId && svixTimestamp && svixSignature) {
    const secret = process.env.RESEND_INBOUND_SIGNING_SECRET
    if (!secret || !verifySvixSignature(secret, svixId, svixTimestamp, svixSignature, rawBody)) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  } else if (req.headers.get('x-inbound-secret') !== process.env.SCHOOL_INBOUND_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let payload: unknown
  try { payload = JSON.parse(rawBody) } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }
  const { to, from, subject, body } = normalisePayload(payload)

  // The to value can be a bare address or "Name <address>".
  const toEmail = to.match(/<([^>]+)>/)?.[1] ?? to
  const token = toEmail.split('@')[0]?.replace(/^school\+/, '').trim().toLowerCase()
  if (!token) return NextResponse.json({ ok: true, skipped: 'no token' })

  const supabase = createAdminClient()
  const { data: conn } = await supabase
    .from('school_connections')
    .select('user_id, school_name, sender_addresses')
    .eq('forward_token', token)
    .eq('active', true)
    .maybeSingle()
  if (!conn) return NextResponse.json({ ok: true, skipped: 'unknown token' })

  // Gmail forwarding verification email: catch it before the sender
  // allowlist (Google is never an allowlisted school sender), store the
  // code and link for the setup screen, and stop. Never sent to DiGi.
  if (from.includes('forwarding-noreply@google.com')) {
    const haystack = `${subject}\n${body}`
    const code =
      haystack.match(/confirmation code[:\s#]*([0-9]{6,12})/i)?.[1] ??
      haystack.match(/\(#([0-9]{6,12})\)/)?.[1] ??
      haystack.match(/\b([0-9]{9})\b/)?.[1] ?? null
    const link = haystack.match(/https:\/\/mail-settings\.google\.com\/mail\/[^\s"'<>)\]]+/i)?.[0] ?? null
    if (code || link) {
      await supabase.from('school_connections').update({
        verification_code: code,
        verification_link: link,
        verification_received_at: new Date().toISOString(),
      }).eq('forward_token', token)
    }
    return NextResponse.json({ ok: true, verification: Boolean(code || link) })
  }

  // If the parent listed school senders, only accept those (a forwarded
  // email keeps the school in the payload sender or the forwarding header).
  const senders = (conn.sender_addresses ?? []).map((s: string) => s.toLowerCase())
  if (senders.length > 0 && !senders.some((s: string) => from.includes(s) || body.toLowerCase().includes(s))) {
    return NextResponse.json({ ok: true, skipped: 'sender not allowlisted' })
  }

  const items = (await extract(subject, body, conn.school_name)).slice(0, 5)
  if (items.length === 0) return NextResponse.json({ ok: true, actions: 0 })

  const valid = items.filter(i => ['kit', 'payment', 'homework', 'event', 'deadline', 'notice'].includes(i.kind) && i.title)
  if (valid.length === 0) return NextResponse.json({ ok: true, actions: 0 })

  await supabase.from('school_actions').insert(valid.map(i => ({
    user_id: conn.user_id, kind: i.kind, title: i.title.slice(0, 120),
    detail: i.detail?.slice(0, 300) ?? null, due_date: i.due_date || null,
  })))

  const promptTitle = valid.length === 1 ? valid[0].title : `${valid.length} things from ${conn.school_name}`
  await supabase.from('digi_prompts').insert({
    user_id: conn.user_id,
    kind: 'school',
    title: promptTitle,
    body: valid.map(i => `${i.title}${i.due_date ? ` (by ${i.due_date})` : ''}`).join('. ') + '.',
    reason: `School email: ${subject.slice(0, 100)}`,
  })

  // The Duolingo moment: the parent's phone buzzes while they are away,
  // not when they next happen to open the dashboard.
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.guidedchildhood.co.uk'
    await fetch(`${origin}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
      body: JSON.stringify({ userId: conn.user_id, title: `DiGi caught a school email`, body: promptTitle, url: '/dashboard' }),
    })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, actions: valid.length })
}
