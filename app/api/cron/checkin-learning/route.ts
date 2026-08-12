import { withHeartbeat } from '@/lib/ops/heartbeat'
import { runRatingLoop } from '@/lib/digi/rating-loop'
import { NextResponse } from 'next/server'

// The weekly natural selection pass on the check in data. Compares every
// child's wellbeing ratings with the previous week's, records what the family
// did in the window, and files the wins and the plans that did not work into
// the DiGi brain. Runs Sundays at 05:30 UTC, half an hour before the wisdom
// rebuild, so the fresh shifts are already on the table when wisdom reads
// across families. Same auth pattern as the other crons: Vercel adds
// Authorization: Bearer <CRON_SECRET>.

export const maxDuration = 180
export const dynamic = 'force-dynamic'

async function handler(request: Request) {
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get('authorization')
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Not authorised' }, { status: 401 })
  }

  try {
    const result = await runRatingLoop()
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Rating loop failed' }, { status: 502 })
  }
}

export const GET = withHeartbeat('/api/cron/checkin-learning', handler)
