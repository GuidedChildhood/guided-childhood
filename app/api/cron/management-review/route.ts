import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { runManagementReview, persistManagementReview } from '@/lib/ops/management-review'

// Monday morning, the week just gone, reviewed and written down.
//
// Justin: "weekly meetings where an agent reviews it for findings."
//
// Runs after the star week rollover (00:10) so the sticker credits that
// rollover awards are already in the numbers this reads. A review of a week
// that is still being closed would report the week as quieter than it was.
//
// Idempotent by the unique constraint on week_start, so a retry or a manual
// kick corrects the row rather than stacking another one.

export const dynamic = 'force-dynamic'
export const maxDuration = 120

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // An explicit week lets a past one be rebuilt by hand without waiting a week
  // to see whether the change worked.
  const week = new URL(request.url).searchParams.get('week') ?? undefined
  if (week && !/^\d{4}-\d{2}-\d{2}$/.test(week)) {
    return NextResponse.json({ error: 'week must be YYYY-MM-DD' }, { status: 400 })
  }

  const review = await runManagementReview(week)
  await persistManagementReview(review)

  return NextResponse.json({
    ok: true,
    week: review.weekStart,
    findings: review.findings.length,
    // Said out loud rather than hidden, because a review with no model behind it
    // is a page of numbers and the reader should know which they are looking at.
    agent: review.model ?? 'unavailable',
  })
}

export const GET = withHeartbeat('/api/cron/management-review', handler)
