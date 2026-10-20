import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getMagnet } from '@/lib/magnets/registry'
import { sendEmail, starterCtaUrl } from '@/lib/email'
import { unsuppressAddress } from '@/lib/email/address-guard'
import { magnetEmail } from '@/lib/email/templates'
import { sendPush } from '@/lib/push/send'

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
  // A full product magnet hands over its ready made PDF from public; a one
  // page magnet is generated on the fly by the pdf route.
  const downloadPath = magnet.staticPdf ?? `/api/magnet/${magnet.slug}/pdf`
  const downloadUrl = `${origin}${downloadPath}`

  try {
    const supabase = createAdminClient()

    // Only ping the founder for a brand new email, not a repeat download.
    const { data: existing } = await supabase
      .from('starter_leads').select('email').eq('email', email).maybeSingle()

    // Upsert on email, writing only these columns, so a lead who already
    // did the starter quiz keeps their saved answers and stage. The
    // source records where this touch came from.
    // A fresh opt in lifts an old suppression. Someone who deleted their
    // account in March and asks us for a printable in September has just told
    // us they want to hear from us, and honouring the older instruction over
    // the newer one is not respecting their wishes, it is ignoring them.
    await unsuppressAddress(email)

    await supabase
      .from('starter_leads')
      .upsert(
        { email, source: `magnet:${magnet.slug}`, updated_at: new Date().toISOString() },
        { onConflict: 'email' },
      )

    // Is this address already one of ours? A member taking a printable from
    // the website is common (it is the quickest way to the PDF), and the email
    // used to end by inviting them to the free starter pack for the product
    // they already have. Justin caught it on his own phone, 15 October 2026.
    // ilike, not eq: an address typed with a capital letter is the same person.
    const { data: member } = await supabase
      .from('profiles').select('id').ilike('email', email).limit(1).maybeSingle()

    // Deliver the download to their inbox. Best effort.
    await sendEmail({
      to: email,
      ...magnetEmail({
        magnetTitle: magnet.title, downloadUrl, blurb: magnet.emailBlurb,
        files: (magnet.files ?? []).map(f => ({ label: f.label, url: `${origin}${f.href}` })),
        reader: member?.id ? 'member' : 'lead',
        // A lead gets the signed link that checks again on the tap, so a
        // parent who joins the morning after this lands in their app, not on
        // the pitch. See app/api/go/starter.
        cta: starterCtaUrl(email),
      }),
      kind: 'transactional',
    })

    if (!existing) await notifyFounder(req, supabase, email, magnet.slug)
  } catch {
    // Swallow: the parent still gets their download from the response.
  }

  return NextResponse.json({ ok: true, download: downloadPath, files: magnet.files ?? [] })
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
    await sendPush({
        userId: founder.id,
        title: 'New lead from a free download 🎁',
        body: `${leadEmail} · ${slug}`,
        url: '/dashboard',
      })
  } catch { /* founder ping is best effort */ }
}
