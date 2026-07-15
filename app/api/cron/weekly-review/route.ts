import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWeeklyReview } from '@/lib/digi/weekly-review'

// The Sunday evening DiGi weekly review cron. Finds families that did anything
// this week, builds each one a private review off their own numbers, stores it,
// and pushes the parent a nudge to read it and set up next week. Gated on
// CRON_SECRET like every other cron, so only Vercel's scheduler can run it.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  const admin = createAdminClient()
  const sinceIso = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)

  // Families with at least one approved tick this week get a review; a dead
  // account gets nothing rather than an empty note.
  const { data: active } = await admin
    .from('quest_ticks')
    .select('user_id')
    .eq('status', 'approved')
    .gte('tick_date', sinceIso)
    .limit(5000)
  const userIds = [...new Set((active ?? []).map(t => t.user_id))]

  const origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin
  let built = 0

  for (const userId of userIds) {
    try {
      const review = await buildWeeklyReview(userId)
      built++
      // Nudge the parent, best effort.
      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
        body: JSON.stringify({
          userId,
          title: 'Your week with DiGi ✨',
          body: review.summary.slice(0, 120),
          url: '/dashboard',
        }),
      }).catch(() => {})
    } catch { /* one family failing never stops the run */ }
  }

  return NextResponse.json({ ok: true, families: userIds.length, built })
}
