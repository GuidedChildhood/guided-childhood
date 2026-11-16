import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { unsuppressAddress } from '@/lib/email/address-guard'
import { getCourse, courseStartKey, courseDayKey } from '@/lib/courses/registry'
import { courseEmailFor } from '@/lib/courses/email'
import { sendPush } from '@/lib/push/send'

// A parent asked for a topic email course on the stage check result page
// (16 November 2026). Asking IS the consent: the button names the course and
// what follows, so the lead is marked marketing_consent true and dated, the
// way a ticked box is (migration 396). Day 1 goes now; the email cron sends
// one a morning after that. Best effort past validation: a hiccup never shows
// the parent an error once their address is good.
//
// No new table. The start row in lead_email_log is the clock and its unique
// (email, email_key) is what makes a second press a no op, not a restart.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  let body: { email?: unknown; slug?: unknown; stageId?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'bad request' }, { status: 400 }) }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const course = typeof body.slug === 'string' ? getCourse(body.slug.trim()) : null
  const stageId = typeof body.stageId === 'string' ? body.stageId.slice(0, 40) : null
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'invalid email' }, { status: 400 })
  }
  if (!course) return NextResponse.json({ error: 'unknown course' }, { status: 400 })

  try {
    const supabase = createAdminClient()
    const { data: existing } = await supabase
      .from('starter_leads').select('email, stage_id').eq('email', email).maybeSingle()

    // A fresh request lifts an old suppression, as on the free pages: the
    // newer instruction is the one to honour.
    await unsuppressAddress(email)

    // Upsert on email and write only these columns, so a lead who already
    // saved their stage check keeps their answers. The stage is filled only
    // if the row has none.
    const now = new Date().toISOString()
    await supabase.from('starter_leads').upsert(
      { email, updated_at: now, ...(existing?.stage_id || !stageId ? {} : { stage_id: stageId }), ...(existing ? {} : { source: `course:${course.slug}` }) },
      { onConflict: 'email' },
    )
    // Two writes, not one: until migration 396 is applied the consent columns
    // are missing, and a single update naming them would fail whole and leave
    // an old stop in place on a lead who has just asked again.
    await supabase.from('starter_leads').update({ unsubscribed_at: null }).eq('email', email)
    await supabase.from('starter_leads')
      .update({ marketing_consent: true, marketing_consent_at: now })
      .eq('email', email)

    const { error: startErr } = await supabase.from('lead_email_log').insert({ email, email_key: courseStartKey(course.slug) })
    if (startErr) return NextResponse.json({ ok: true, already: true })

    const content = courseEmailFor(email, course, 1)
    const dayKey = courseDayKey(course.slug, 1)
    const { error: logErr } = await supabase.from('lead_email_log').insert({ email, email_key: dayKey })
    if (content && !logErr) {
      const sent = await sendEmail({ to: email, subject: content.subject, html: content.html, key: dayKey, kind: 'series' })
      // Not sent (a bad address, the provider down): free the day so the
      // morning run tries again.
      if (!sent.ok) await supabase.from('lead_email_log').delete().eq('email', email).eq('email_key', dayKey)
    }

    if (!existing) await notifyFounder(supabase, email, course.slug)
  } catch {
    // Swallow: the parent has asked, and the morning run picks up any day
    // that did not go.
  }

  return NextResponse.json({ ok: true })
}

async function notifyFounder(supabase: ReturnType<typeof createAdminClient>, leadEmail: string, slug: string) {
  try {
    const founderEmail = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()
    const { data: founder } = await supabase.from('profiles').select('id').eq('email', founderEmail).maybeSingle()
    if (!founder?.id) return
    await sendPush({ userId: founder.id, title: 'New lead from an email course 📬', body: `${leadEmail} · ${slug}`, url: '/dashboard' })
  } catch { /* best effort */ }
}
