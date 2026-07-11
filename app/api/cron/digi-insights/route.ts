import { sendEmail, emailConfigured } from '@/lib/email'
import { runDigiInsights, renderInsightsEmail } from '@/lib/digi/insights'
import { NextResponse } from 'next/server'

// The daily drop. Vercel Cron hits this each morning and, when it is a genuine
// cron call, runs the insight agent over the last week and emails the report
// to Justin, so what parents asked DiGi lands in his inbox without anyone
// opening the dashboard.
//
// Vercel automatically adds `Authorization: Bearer <CRON_SECRET>` to cron
// requests when CRON_SECRET is set, so that header is what we verify. Nothing
// runs unless it matches.

export const maxDuration = 120
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  let payload
  try {
    payload = await runDigiInsights(7)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Insight run failed' }, { status: 502 })
  }

  // Nothing to say on a quiet week, so no empty email lands.
  if (payload.count > 0 && emailConfigured()) {
    try { await sendEmail({ to: FOUNDER_EMAIL, subject: `DiGi weekly insight: ${payload.count} questions`, html: renderInsightsEmail(payload) }) }
    catch { /* best effort */ }
  }

  return NextResponse.json({ ok: true, emailed: payload.count > 0, count: payload.count })
}
