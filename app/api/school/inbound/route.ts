import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { extractSchoolItems } from '@/lib/school/extract'
import { sendPush } from '@/lib/push/send'

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

function normalisePayload(payload: unknown): InboundEmail & { emailId: string | null } {
  const outer = (payload ?? {}) as Record<string, unknown>
  const source = (outer.type === 'email.received' && outer.data && typeof outer.data === 'object')
    ? outer.data as Record<string, unknown>
    : outer
  // Resend inbound sometimes delivers only metadata in the webhook, with the
  // body empty. Read every field a body might hide in, and keep the email id
  // so we can fetch the full content if the code and link are not here.
  const body = String(source.text ?? source.html ?? source.body ?? source.raw ?? source.content ?? '')
  return {
    to: pickAddress(source.to),
    from: pickAddress(source.from).toLowerCase(),
    subject: String(source.subject ?? ''),
    body,
    emailId: source.email_id ? String(source.email_id) : (source.id ? String(source.id) : null),
  }
}

// The Gmail forwarding confirmation code and link live in the email body.
// These tolerate a truncated subject, HTML wrapping and a missing closing
// paren, so the nine digit code is found however Gmail formats it.
function extractGmailCode(haystack: string): string | null {
  return (
    haystack.match(/confirmation code[:\s#]*([0-9]{6,12})/i)?.[1] ??
    haystack.match(/\(#\s*([0-9]{6,12})\)?/)?.[1] ??
    haystack.match(/\b([0-9]{9})\b/)?.[1] ?? null
  )
}
function extractGmailLink(haystack: string): string | null {
  return haystack.match(/https:\/\/mail-settings\.google\.com\/mail\/[^\s"'<>)\]]+/i)?.[0] ?? null
}

// Fetch the full inbound email from Resend by id, so the body is available
// even when the webhook payload carried only metadata. Best effort: any
// failure just leaves us with what the webhook already gave us.
//
// ── RECEIVED EMAILS LIVE AT /emails/receiving (25 September 2026) ─────────
//
// Justin set up Gmail forwarding and the confirmation code never appeared.
// The live table showed why nothing ever had: not one school connection had
// a code, a link or a first email, ever. Resend's email.received webhook
// carries the envelope only (from, to, subject, id), and this fetched the
// body from /emails/{id}, which is the endpoint for emails WE SENT. A
// received email is at /emails/receiving/{id} (resend 6.x, emails.receiving
// .get), so the fetch came back empty, the code was never read, and every
// school email was extracted from its subject line alone. The old path is
// kept as a fallback in case a provider or an older payload uses it.
async function fetchInboundBody(emailId: string | null): Promise<string> {
  if (!emailId || !process.env.RESEND_API_KEY) return ''
  for (const path of [`/emails/receiving/${emailId}`, `/emails/${emailId}`]) {
    try {
      const res = await fetch(`https://api.resend.com${path}`, {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
      })
      if (!res.ok) continue
      const j = await res.json() as { text?: string | null; html?: string | null }
      const full = `${j.text ?? ''}\n${j.html ?? ''}`.trim()
      if (full) return full
    } catch { /* try the next path */ }
  }
  return ''
}

/**
 * Record that a real school email reached this family's address.
 *
 * Written for the setup screen, which has one question to answer and it is not
 * "how many actions did DiGi find". A parent who has just pasted their address
 * into Gmail is asking "did that work", and a newsletter with nothing to do in
 * it answers that question just as well as a PE kit reminder does. So this is
 * stamped for every email that clears the sender allowlist, whether or not the
 * extraction found anything, because the alternative is a screen that says
 * nothing yet to a parent whose forwarding is working perfectly.
 *
 * It also learns the sender's domain, which is the thing we used to make the
 * parent type in before they were allowed an address at all.
 *
 * Best effort throughout. Migration 303 runs by hand, and none of this is worth
 * failing a real email over: an error here costs a status line, not a reminder.
 * The counter is a read then a write rather than an atomic increment, which can
 * lose a count when two school emails land in the same instant. That is the
 * right trade for a number that exists to tell a parent it is working.
 */
async function recordArrival(
  supabase: ReturnType<typeof createAdminClient>,
  token: string,
  conn: { school_name: string | null; learned_domain?: string | null; emails_caught?: number | null },
  fromAddress: string,
) {
  try {
    const domain = fromAddress.split('@')[1]?.trim().toLowerCase() || null
    const now = new Date().toISOString()
    const patch: Record<string, unknown> = {
      last_email_at: now,
      emails_caught: (conn.emails_caught ?? 0) + 1,
    }
    if (!conn.learned_domain && domain) patch.learned_domain = domain
    // first_email_at is the one that must never move, so it is only written
    // when the row has not got one. Filtering on null rather than reading it
    // back means a second email cannot overwrite the first one's timestamp.
    await supabase.from('school_connections')
      .update({ ...patch, first_email_at: now })
      .eq('forward_token', token)
      .is('first_email_at', null)
    await supabase.from('school_connections')
      .update(patch)
      .eq('forward_token', token)
      .not('first_email_at', 'is', null)
  } catch { /* the status line goes stale, the email still lands */ }
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
  const normalised = normalisePayload(payload)
  const { to, from, subject, emailId } = normalised
  let body = normalised.body
  // A test ping from the setup screen: run the real token lookup and code
  // parse, but never persist and never create actions. Purely a check that
  // the platform side of the pipeline is alive.
  const isTest = Boolean((payload as Record<string, unknown>)?.test)

  // The to value can be a bare address or "Name <address>".
  const toEmail = to.match(/<([^>]+)>/)?.[1] ?? to
  const token = toEmail.split('@')[0]?.replace(/^school\+/, '').trim().toLowerCase()
  if (!token) return NextResponse.json({ ok: true, skipped: 'no token' })

  const supabase = createAdminClient()
  // The arrival columns land with migration 303 and migrations run by hand, so
  // naming them in this select would fail the whole lookup until it has run,
  // which would drop real school emails on the floor. Read separately, guarded,
  // and a failure simply means we cannot stamp the status line.
  const { data: conn } = await supabase
    .from('school_connections')
    .select('user_id, school_name, sender_addresses')
    .eq('forward_token', token)
    .eq('active', true)
    .maybeSingle()
  if (!conn) return NextResponse.json({ ok: true, resolvedToken: false, skipped: 'unknown token' })

  let arrival: { learned_domain: string | null; emails_caught: number } | null = null
  try {
    const { data, error } = await supabase
      .from('school_connections')
      .select('learned_domain, emails_caught')
      .eq('forward_token', token)
      .maybeSingle()
    if (!error && data) arrival = data as { learned_domain: string | null; emails_caught: number }
  } catch { /* pre 303, nothing to stamp */ }

  // Gmail forwarding verification email: catch it before the sender
  // allowlist (Google is never an allowlisted school sender), store the
  // code and link for the setup screen, and stop. Never sent to DiGi.
  if (from.includes('forwarding-noreply@google.com')) {
    let haystack = `${subject}\n${body}`
    let code = extractGmailCode(haystack)
    let link = extractGmailLink(haystack)
    // The webhook can carry only metadata, but the code and link live in the
    // body. If neither is here, fetch the full email from Resend and parse it.
    if (!code && !link) {
      const full = await fetchInboundBody(emailId)
      if (full) {
        haystack = `${subject}\n${full}`
        code = extractGmailCode(haystack)
        link = extractGmailLink(haystack)
      }
    }
    // A test never writes over a real, possibly pending, code.
    if (isTest) {
      return NextResponse.json({ ok: true, test: true, resolvedToken: true, codeFound: Boolean(code || link) })
    }
    // Stamped even when neither could be read, so the setup screen can say
    // Gmail's email arrived rather than watching for ever in silence.
    await supabase.from('school_connections').update({
      verification_code: code,
      verification_link: link,
      verification_received_at: new Date().toISOString(),
    }).eq('forward_token', token)
    // Diagnostics in the response, never secrets, so the Resend delivery log
    // shows what happened: whether a body arrived and what was found.
    return NextResponse.json({ ok: true, verification: Boolean(code || link), codeFound: Boolean(code), linkFound: Boolean(link), bodyChars: body.length })
  }

  // A test that is not the Google branch: prove the token resolved, then
  // stop before any extraction or action is written.
  if (isTest) {
    return NextResponse.json({ ok: true, test: true, resolvedToken: true, codeFound: false })
  }

  // A real school email with no body in the webhook: fetch it, so the sender
  // check and the extraction read the email and not just its subject line.
  if (!body.trim() && emailId) body = await fetchInboundBody(emailId)

  // If the parent listed school senders, only accept those (a forwarded
  // email keeps the school in the payload sender or the forwarding header).
  const senders = (conn.sender_addresses ?? []).map((s: string) => s.toLowerCase())
  if (senders.length > 0 && !senders.some((s: string) => from.includes(s) || body.toLowerCase().includes(s))) {
    return NextResponse.json({ ok: true, skipped: 'sender not allowlisted' })
  }

  // Stamped here, before the extraction, because this is the point at which we
  // know a real school email got through. See recordArrival for why that is not
  // the same question as whether it contained anything to do.
  await recordArrival(supabase, token, { ...conn, ...(arrival ?? {}) }, from)

  // The school's name is optional now: an address is handed out before anyone
  // has been asked anything. Until the parent confirms it, the sender's domain
  // is a better prompt for the extractor than an empty string, and a truthful
  // one for the parent to read back.
  const schoolLabel = conn.school_name?.trim() || from.split('@')[1] || 'your school'

  // The kind check and the field trimming that used to sit here are inside
  // extractSchoolItems now, so the photo path gets exactly the same validation
  // rather than its own copy of it.
  const valid = (await extractSchoolItems({ schoolName: schoolLabel, subject, body })).slice(0, 5)
  if (valid.length === 0) return NextResponse.json({ ok: true, actions: 0, arrival: true })

  await supabase.from('school_actions').insert(valid.map(i => ({
    user_id: conn.user_id, kind: i.kind, title: i.title,
    detail: i.detail ?? null, due_date: i.due_date || null,
  })))

  const promptTitle = valid.length === 1 ? valid[0].title : `${valid.length} things from ${schoolLabel}`
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
    await sendPush({ userId: conn.user_id, title: `DiGi caught a school email`, body: promptTitle, url: '/dashboard/school' })
  } catch { /* push is best effort */ }

  return NextResponse.json({ ok: true, actions: valid.length })
}
