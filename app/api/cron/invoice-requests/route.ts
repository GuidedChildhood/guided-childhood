import { NextResponse } from 'next/server'
import { withHeartbeat } from '@/lib/ops/heartbeat'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { schoolLetter } from '@/lib/email/school-letters'

// The other half of the schools invoice letterbox (migration 195). The
// schools site has no email code by design, so the form only inserts a row
// into schools.invoice_requests; this cron, running hourly in the parent
// app where the email infrastructure lives, picks up anything new and
// emails Justin, then stamps notified_at so a row is never sent twice.
// A school buying a licence is not a minutes matter, so hourly was prompt
// enough for the note to Justin. Since 13 September 2026 this cron also
// sends the SCHOOL its own confirmation (lib/email/school-letters.ts,
// tracked in confirmed_at, migration 299), and a school that has just
// pressed the button is waiting for that one, so it runs every fifteen
// minutes now (vercel.json).
//
// Since 16 September 2026 it also empties the SUPPLIES letterbox
// (schools.supply_requests, migration 302): a school asking for printed
// passport books and sticker sheets. A second table, because a supplies
// request carries items, counts and a delivery address that the invoice
// table has no columns for, but the SAME cron, because a second job to
// forward a second kind of letter would be a second thing to watch.

export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

// The bands that are a LEAD rather than an order. Both post through this
// same letterbox on purpose (no new table, no second cron), so the only thing
// that has to tell them apart is the email, and it very much does: an order
// needs an invoice raised against a PO, and a lead needs a reply.
const LEAD_BANDS = new Set(['draw', 'taster', 'pilot'])

const BAND_LABELS: Record<string, string> = {
  // A free class pack draw entry (schools /draw) uses the same letterbox.
  draw: 'Free class pack draw entry',
  // A teacher who played the sample lesson and asked for its pack (schools
  // taster, 11 September 2026). No PO, by design: asking a browsing teacher
  // for a purchase order is asking them to leave.
  taster: 'Sample lesson taster · lead',
  // A school asking for the free term (schools /pilot, 13 September 2026).
  // Five places; the pilot page counts them from these rows.
  pilot: 'Free one term pilot · lead',
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
    .select('id, school_name, band, pupil_count, contact_name, email, po_number, notes, created_at, notified_at, confirmed_at')
    .or('notified_at.is.null,confirmed_at.is.null')
    .order('created_at')
    .limit(20)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  // An empty invoice pile is not an empty postbag: the supplies letterbox is
  // a separate table and has to be emptied whether or not anyone bought a
  // licence this quarter hour.
  if (!requests || requests.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, supplies: await notifySupplies(supabase) })
  }

  let sent = 0
  let confirmed = 0
  for (const r of requests) {
    const lead = LEAD_BANDS.has(r.band)

    // The school's own confirmation, once, independent of the note to Justin.
    // A kind with no letter (the draw) is stamped without a send, so the row
    // does not come round every quarter hour for ever.
    if (!r.confirmed_at) {
      const letter = schoolLetter(r)
      const ok = letter
        ? (await sendEmail({ to: r.email, subject: letter.subject, html: letter.html, kind: 'transactional', key: 'school-letterbox-confirmation' })).ok
        : true
      if (ok) {
        await supabase.schema('schools').from('invoice_requests')
          .update({ confirmed_at: new Date().toISOString() }).eq('id', r.id)
        if (letter) confirmed++
      }
    }

    if (r.notified_at) continue
    const result = await sendEmail({
      to: FOUNDER_EMAIL,
      subject: lead
        ? `School lead: ${r.school_name}`
        : `School invoice request: ${r.school_name}`,
      kind: 'operational',
      key: 'school-invoice-request',
      html: `
        <h2 style="margin:0 0 12px">${esc(r.school_name)} ${lead ? 'is having a look' : 'wants a licence'}</h2>
        <table style="border-collapse:collapse;font-size:15px;line-height:1.7">
          <tr><td style="padding-right:16px;color:#888">Band</td><td><strong>${esc(BAND_LABELS[r.band] ?? r.band)}</strong></td></tr>
          <tr><td style="padding-right:16px;color:#888">Pupils</td><td>${r.pupil_count ?? 'not given'}</td></tr>
          <tr><td style="padding-right:16px;color:#888">Contact</td><td>${esc(r.contact_name)} · ${esc(r.email)}</td></tr>
          ${lead ? '' : `<tr><td style="padding-right:16px;color:#888">PO number</td><td><strong>${esc(r.po_number)}</strong></td></tr>`}
          ${r.notes ? `<tr><td style="padding-right:16px;color:#888">Notes</td><td>${esc(r.notes)}</td></tr>` : ''}
        </table>
        <p style="margin-top:16px">${r.band === 'pilot'
          ? 'A pilot. Add a code for this school to SCHOOLS_PILOT_CODES on the schools Vercel project as code:phase (primary, secondary, post16 or all_through, from the notes above), redeploy, and reply with it within two working days. The code opens the two lessons for that phase plus the Hub; a licence code goes in SCHOOLS_ACCESS_CODES instead. The school has already had a confirmation saying so.<br><br>And the thing you asked to be reminded of once schools were live: Cosmo still speaks in neither sixth form lesson. It is specced, it costs no credits, and it waits on two decisions from you, in plans/2026-09-14-cosmo-at-sixth-form-spec.md.'
          : lead
            ? 'No invoice to raise. This is a lead: reply to them yourself while the lesson is still fresh.'
            : 'Raise the invoice by hand in the Stripe dashboard, 30 day terms, and quote the PO on it. That is the whole flow. The school has already had a confirmation saying the invoice is on its way.'}</p>
      `,
    })
    if (result.ok) {
      await supabase.schema('schools').from('invoice_requests')
        .update({ notified_at: new Date().toISOString() }).eq('id', r.id)
      sent++
    }
  }

  const supplies = await notifySupplies(supabase)

  return NextResponse.json({ ok: true, sent, confirmed, supplies })
}

// THE SUPPLIES LETTERBOX (migration 302).
//
// No confirmation letter to the school, on purpose: the reply IS the
// product here. A school that asks for a quote wants a price from a person,
// and an automated "we have your request" in front of that is one more email
// and no more information. The form already says two working days.
//
// Fails soft: a supplies send that throws must never cost the invoice run
// above, which is the one with money in it.
async function notifySupplies(supabase: ReturnType<typeof createAdminClient>): Promise<number> {
  try {
    const { data: rows } = await supabase
      .schema('schools')
      .from('supply_requests')
      .select('id, school_name, contact_name, email, want, key_stages, book_count, sticker_count, delivery_address, po_number, notes, created_at')
      .is('notified_at', null)
      .order('created_at')
      .limit(20)
    if (!rows || rows.length === 0) return 0

    let sent = 0
    for (const r of rows) {
      const items = [
        r.want !== 'stickers' && r.book_count ? `${r.book_count} passport book${r.book_count === 1 ? '' : 's'}` : null,
        r.want !== 'books' && r.sticker_count ? `${r.sticker_count} sticker sheet${r.sticker_count === 1 ? '' : 's'}` : null,
      ].filter(Boolean).join(' and ')

      const result = await sendEmail({
        to: FOUNDER_EMAIL,
        subject: `School supplies quote: ${r.school_name}`,
        kind: 'operational',
        key: 'school-supply-request',
        html: `
          <h2 style="margin:0 0 12px">${esc(r.school_name)} wants ${esc(items || r.want)}</h2>
          <table style="border-collapse:collapse;font-size:15px;line-height:1.7">
            <tr><td style="padding-right:16px;color:#888">Wants</td><td><strong>${esc(items || r.want)}</strong></td></tr>
            ${r.key_stages ? `<tr><td style="padding-right:16px;color:#888">Years</td><td>${esc(r.key_stages)}</td></tr>` : ''}
            <tr><td style="padding-right:16px;color:#888">Contact</td><td>${esc(r.contact_name)} · ${esc(r.email)}</td></tr>
            ${r.delivery_address ? `<tr><td style="padding-right:16px;color:#888;vertical-align:top">Deliver to</td><td>${esc(r.delivery_address).replace(/\n/g, '<br>')}</td></tr>` : ''}
            ${r.po_number ? `<tr><td style="padding-right:16px;color:#888">PO number</td><td><strong>${esc(r.po_number)}</strong></td></tr>` : ''}
            ${r.notes ? `<tr><td style="padding-right:16px;color:#888">Notes</td><td>${esc(r.notes)}</td></tr>` : ''}
          </table>
          <p style="margin-top:16px">A QUOTE, not an order. Nothing is charged and the school has been told it decides after seeing a price. Reply within two working days with the unit price, the lead time and the postage. No supplier is signed yet, so if this is the first one, it is the request that tells you the volume to quote against.</p>
        `,
      })
      if (result.ok) {
        await supabase.schema('schools').from('supply_requests')
          .update({ notified_at: new Date().toISOString() }).eq('id', r.id)
        sent++
      }
    }
    return sent
  } catch {
    return 0
  }
}

export const GET = withHeartbeat('/api/cron/invoice-requests', handler)
