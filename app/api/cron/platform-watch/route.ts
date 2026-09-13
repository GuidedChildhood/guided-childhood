import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, emailConfigured } from '@/lib/email'
import { draftUpdates, insertDrafts, platformWatch } from '@/lib/ai-updates/draft'

// The weekly platform watch. See vercel.json (Monday morning).
//
// Justin, 13 September 2026: stay "aware of the social media use changes
// happening on platforms" so the product stays "on top, relevant and a unique
// must have tool." The sources are config (lib/config/platform-sources.ts),
// the drafting is shared with the hand fed refresh route, and the gate is the
// same one the research updater keeps: everything lands as a draft, the
// founder gets an email, and only his click on the insights board publishes.
// A published update then reaches the families it affects as one card.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const FOUNDER_EMAIL = process.env.FOUNDER_NOTIFY_EMAIL ?? 'justin@thesocialbillboard.com'

async function handler(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()

  const items = await platformWatch()
  if (items.length === 0) return NextResponse.json({ ok: true, found: 0, drafted: 0 })

  // Never draft the same headline twice: the watch window overlaps by a day.
  const { data: recent } = await admin.from('ai_updates').select('headline, source_url')
    .gte('created_at', new Date(Date.now() - 21 * 86_400_000).toISOString()).limit(200)
  const seenUrls = new Set((recent ?? []).map(r => r.source_url).filter(Boolean))
  const fresh = items.filter(i => !i.url || !seenUrls.has(i.url))

  const drafts = await draftUpdates(fresh)
  let inserted = 0
  try {
    inserted = await insertDrafts(admin, drafts)
  } catch (err) {
    return NextResponse.json({ ok: false, found: items.length, error: err instanceof Error ? err.message : String(err) }, { status: 502 })
  }

  if (inserted > 0 && emailConfigured()) {
    const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin
    try {
      await sendEmail({
        to: FOUNDER_EMAIL,
        subject: `${fresh.length} platform change${fresh.length === 1 ? '' : 's'} this week to review`,
        html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#1A1A2E">
          <p>The platform watch found <strong>${fresh.length}</strong> change${fresh.length === 1 ? '' : 's'} this week that touch children online, from ${[...new Set(fresh.map(i => i.source_name).filter(Boolean))].join(', ') || 'the listed sources'}.</p>
          <p>DiGi has drafted the family facing summaries. Open the insights board, read each one, and publish it to the families it affects or reject it.</p>
          <p><a href="${origin}/dashboard/insights" style="color:#C29018;font-weight:700">Review the platform changes</a></p>
          <p style="color:#8888A0;font-size:13px">Nothing reaches a family until you publish it.</p>
        </div>`,
        kind: 'operational',
      })
    } catch { /* email is best effort */ }
  }

  return NextResponse.json({ ok: true, found: items.length, fresh: fresh.length, drafted: inserted })
}

export const GET = withHeartbeat('/api/cron/platform-watch', handler)
