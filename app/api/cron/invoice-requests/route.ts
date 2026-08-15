import { NextResponse } from 'next/server'
import { withHeartbeat } from '@/lib/ops/heartbeat'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'

// The other half of the schools invoice letterbox (migration 195). The
// schools site has no email code by design, so the form only inserts a row
// into schools.invoice_requests; this cron, running hourly in the parent
// app where the email infrastructure lives, picks up anything new and
// emails Justin, then stamps notified_at so a row is never sent twice.
// A school buying a licence is not a minutes matter, so hourly is prompt
// enough and one more cron slot is the whole cost.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

const BAND_LABELS: Record<string, string> = {
  primary_small: 'Primary up to 200 pupils · £495',
  primary_large: 'Primary 200 to 500 · £795',
  secondary: 'Secondary up to 1,000 · £1,495',
  secondary_large: 'Secondary 1,000+ · £1,995',
  trust: 'Trust or MAT · on application',
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  // BOTH parent Vercel projects build from this repo's vercel.json, so both
  // register this cron, and only the app project carries service keys. The
  // marketing project was throwing an opaque 500 here every hour (the log
  // tell is a 500 with no outgoing requests: createAdminClient throws before
  // it can reach Supabase). Say so plainly instead, and let the project that
  // can actually do the work do it.
  const configured = Boolean(
    (process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY) &&
    process.env.NEXT_PUBLIC_SUPABASE_URL
  )
  if (!configured) {
    return NextResponse.json({ ok: true, skipped: 'no service key on this project' })
  }

  const supabase = createAdminClient()
  const { data: requests, error } = await supabase
    .schema('schools')
    .from('invoice_requests')
    .select('id, school_name, band, pupil_count, contact_name, email, po_number, notes, created_at')
    .is('notified_at', null)
    .order('created_at')
    .limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!requests || requests.length === 0) return NextResponse.json({ ok: true, sent: 0 })

  let sent = 0
  for (const r of requests) {
    const result = await sendEmail({
      to: FOUNDER_EMAIL,
      subject: `School invoice request: ${r.school_name}`,
      kind: 'operational',
      key: 'school-invoice-request',
      html: `
        <h2 style="margin:0 0 12px">${esc(r.school_name)} wants a licence</h2>
        <table style="border-collapse:collapse;font-size:15px;line-height:1.7">
          <tr><td style="padding-right:16px;color:#888">Band</td><td><strong>${esc(BAND_LABELS[r.band] ?? r.band)}</strong></td></tr>
          <tr><td style="padding-right:16px;color:#888">Pupils</td><td>${r.pupil_count ?? 'not given'}</td></tr>
          <tr><td style="padding-right:16px;color:#888">Contact</td><td>${esc(r.contact_name)} · ${esc(r.email)}</td></tr>
          <tr><td style="padding-right:16px;color:#888">PO number</td><td><strong>${esc(r.po_number)}</strong></td></tr>
          ${r.notes ? `<tr><td style="padding-right:16px;color:#888">Notes</td><td>${esc(r.notes)}</td></tr>` : ''}
        </table>
        <p style="margin-top:16px">Raise the invoice by hand in the Stripe dashboard, 30 day terms, and quote the PO on it. That is the whole flow.</p>
      `,
    })
    if (result.ok) {
      await supabase.schema('schools').from('invoice_requests')
        .update({ notified_at: new Date().toISOString() }).eq('id', r.id)
      sent++
    }
  }

  return NextResponse.json({ ok: true, sent })
}

export const GET = withHeartbeat('/api/cron/invoice-requests', handler)
