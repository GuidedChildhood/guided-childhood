import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { buildWordFor, pushWord } from '@/lib/digi/word'

// DiGi's word, twice a week (Tuesday and Friday 07:00 UK, see vercel.json).
// Every family active in the last three weeks gets one insight, unless one
// is still unread. Best effort per family: one bad model call never stops
// the run. `?user=<id>` with the cron secret writes one for a single family,
// which is how Justin sees a real one before the first Tuesday.

export const dynamic = 'force-dynamic'
export const maxDuration = 300

async function handler(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const admin = createAdminClient()
  const only = req.nextUrl.searchParams.get('user')
  const force = req.nextUrl.searchParams.get('force') === '1'

  let userIds: string[] = []
  if (only) {
    userIds = [only]
  } else {
    const since = new Date(Date.now() - 21 * 86_400_000).toISOString()
    const [ticks, events, asks, scripts, tonight] = await Promise.all([
      admin.from('quest_ticks').select('user_id').gte('tick_date', since.slice(0, 10)).limit(5000),
      admin.from('concern_events').select('user_id').gte('created_at', since).limit(5000),
      admin.from('digi_questions').select('user_id').gte('created_at', since).limit(5000),
      admin.from('script_completions').select('user_id').gte('completed_at', since).limit(5000),
      admin.from('tonight_confirmations').select('user_id').gte('created_at', since).limit(5000),
    ])
    userIds = [...new Set([
      ...(ticks.data ?? []), ...(events.data ?? []), ...(asks.data ?? []), ...(scripts.data ?? []), ...(tonight.data ?? []),
    ].map(r => (r as { user_id: string }).user_id).filter(Boolean))].slice(0, 300)
  }

  let written = 0
  let skipped = 0
  const reasons: Record<string, number> = {}
  for (const userId of userIds) {
    try {
      const result = await buildWordFor(userId, { admin, force })
      if (result.ok) {
        written++
        await pushWord(userId, result.word)
      } else {
        skipped++
        reasons[result.reason] = (reasons[result.reason] ?? 0) + 1
      }
    } catch (err) {
      skipped++
      const why = (err instanceof Error ? err.message : String(err)).slice(0, 80)
      reasons[why] = (reasons[why] ?? 0) + 1
    }
  }
  return NextResponse.json({ ok: true, families: userIds.length, written, skipped, reasons })
}

export const GET = withHeartbeat('/api/cron/digi-word', handler)
