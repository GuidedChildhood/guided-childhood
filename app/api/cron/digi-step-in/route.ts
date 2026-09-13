import { withHeartbeat } from '@/lib/ops/heartbeat'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { readMoment } from '@/lib/digi/moment'

// DiGi's morning look, for families where something changed yesterday.
//
// The dashboard visit already asks the moment reader (app/api/digi/prompts).
// This is for the parent who did not open the app: if their check in moved a
// worry, their child passed a lesson or finished a day, a device arrived, or a
// birthday is inside a month, DiGi reads the moment at 07:20 UK and, when it
// has something worth saying, the push says so. Families with no change are
// not looked at: the reader is judgement, not a calendar, and this cron only
// picks who is worth the judgement today.
//
// The cap and the never two days running rule are inside the reader, so this
// cannot interrupt anybody more often than DIGI_STEP_IN_PER_WEEK allows.

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
    const since = new Date(Date.now() - 26 * 3_600_000).toISOString()
    const [events, passes, days, devices, sessions] = await Promise.all([
      admin.from('concern_events').select('user_id').gte('created_at', since).not('score', 'is', null).limit(5000),
      admin.from('lesson_completions').select('user_id').gte('completed_at', since).limit(5000),
      admin.from('kid_days').select('child_id').not('completed_at', 'is', null).gte('completed_at', since).limit(5000),
      admin.from('family_devices').select('user_id').gte('created_at', since).limit(2000),
      admin.from('device_sessions').select('user_id').gte('started_at', since).limit(5000),
    ])
    // kid_days carries the child, not the parent: resolve through children.
    const childIds = [...new Set(((days.data ?? []) as { child_id: string }[]).map(r => r.child_id).filter(Boolean))]
    const parents = childIds.length > 0
      ? ((await admin.from('children').select('parent_id').in('id', childIds)).data ?? []) as { parent_id: string }[]
      : []
    userIds = [...new Set([
      ...(events.data ?? []), ...(passes.data ?? []), ...(devices.data ?? []), ...(sessions.data ?? []),
    ].map(r => (r as { user_id: string }).user_id).concat(parents.map(p => p.parent_id)).filter(Boolean))].slice(0, 300)
  }

  let spoke = 0
  let quiet = 0
  const reasons: Record<string, number> = {}
  for (const userId of userIds) {
    try {
      const result = await readMoment(admin, userId, { force })
      if (result.ok) {
        spoke++
      } else {
        quiet++
        const key = result.reason.split(':')[0]
        reasons[key] = (reasons[key] ?? 0) + 1
      }
    } catch (err) {
      quiet++
      const why = (err instanceof Error ? err.message : String(err)).slice(0, 80)
      reasons[why] = (reasons[why] ?? 0) + 1
    }
  }
  return NextResponse.json({ ok: true, families: userIds.length, spoke, quiet, reasons })
}

export const GET = withHeartbeat('/api/cron/digi-step-in', handler)
