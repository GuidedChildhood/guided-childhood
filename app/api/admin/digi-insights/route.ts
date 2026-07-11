import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailConfigured } from '@/lib/email'
import { runDigiInsights, renderInsightsEmail } from '@/lib/digi/insights'
import { NextResponse } from 'next/server'

// Founder facing, on demand: run the insight agent for a window and optionally
// email the report. The heavy lifting lives in lib/digi/insights so the daily
// cron shares exactly the same implementation.

export const maxDuration = 120
export const dynamic = 'force-dynamic'

const FOUNDER_EMAIL = (process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com').toLowerCase()

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || (user.email ?? '').toLowerCase() !== FOUNDER_EMAIL) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const alsoEmail: boolean = body.email === true

  let payload
  try {
    payload = await runDigiInsights(Number(body.days) || 30)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Insight run failed' }, { status: 502 })
  }

  if (alsoEmail && payload.count > 0 && emailConfigured()) {
    try { await sendEmail({ to: FOUNDER_EMAIL, subject: `DiGi insight: ${payload.count} questions, ${payload.days} days`, html: renderInsightsEmail(payload) }) }
    catch { /* email is best effort, the report still returns */ }
  }

  return NextResponse.json(payload)
}
