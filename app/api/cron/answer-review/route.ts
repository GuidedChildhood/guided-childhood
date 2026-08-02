import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextResponse } from 'next/server'
import { runAnswerReview, persistAnswerReview } from '@/lib/digi/self-review'

// The monthly critique of how DiGi answers.
//
// 2nd of the month at 05:00, so the month being reviewed is genuinely closed and
// the run is well clear of the 1st, which already carries the research updater,
// the script refresh and the lesson drip.
//
// It runs the full eval suite as part of the review, which is why maxDuration is
// generous: fourteen cases, each generating a real reply and then graded twice.
//
// Idempotent on the period, so a re-run corrects rather than stacks.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  // An explicit period lets a past month be rebuilt by hand rather than waiting
  // a month to see whether a change to this worked.
  const period = new URL(request.url).searchParams.get('period') ?? undefined
  if (period && !/^\d{4}-\d{2}-01$/.test(period)) {
    return NextResponse.json({ error: 'period must be YYYY-MM-01' }, { status: 400 })
  }

  const review = await runAnswerReview(period)
  await persistAnswerReview(review)

  return NextResponse.json({
    ok: true,
    period: review.period,
    suggestions: review.suggestions.length,
    evalAverage: (review.metrics as { eval_average?: number | null }).eval_average ?? null,
    // Said out loud, because a review with no model behind it is a page of
    // numbers and the reader should know which they are looking at.
    agent: review.model ?? 'unavailable',
  })
}

export const GET = withHeartbeat('/api/cron/answer-review', handler)
