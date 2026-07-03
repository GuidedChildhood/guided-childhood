import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { composeEveningReset } from '@/lib/digi/evening-reset'

export const maxDuration = 300

// The 7pm cron. No model call needed: the checklist is deterministic data
// (kit timetable, school actions, standing items), which keeps it instant,
// free, and impossible to hallucinate. DiGi's voice carries the framing.

const USER_CAP = 500

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY!)
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.guidedchildhood.co.uk'
  const now = new Date()
  const todayIso = now.toISOString().slice(0, 10)

  const { data: subs } = await supabase.from('push_subscriptions').select('user_id').limit(USER_CAP)
  const userIds = [...new Set((subs ?? []).map(s => s.user_id))]

  let sent = 0
  for (const userId of userIds) {
    try {
      // One reset per evening, even if the cron re-runs.
      const { data: existing } = await supabase
        .from('digi_prompts').select('id').eq('user_id', userId).eq('kind', 'evening')
        .gte('created_at', `${todayIso}T00:00:00Z`).limit(1)
      if ((existing ?? []).length > 0) continue

      const [{ data: children }, { data: actions }] = await Promise.all([
        supabase.from('children').select('name, kit_schedule').eq('parent_id', userId),
        supabase.from('school_actions').select('title, due_date').eq('user_id', userId).eq('status', 'open').limit(6),
      ])
      if (!children || children.length === 0) continue

      const reset = composeEveningReset(children, actions ?? [], now)
      if (!reset) continue

      await supabase.from('digi_prompts').insert({
        user_id: userId,
        kind: 'evening',
        title: reset.title,
        body: reset.lines.join('. ') + '.',
        reason: 'Evening reset cadence',
      })

      await fetch(`${origin}/api/push/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.CRON_SECRET}` },
        body: JSON.stringify({
          userId,
          title: 'Tonight, five minutes: tomorrow sorted',
          body: reset.lines.slice(0, 3).join('. '),
          url: '/dashboard',
        }),
      })
      sent++
    } catch { /* one family failing never stops the run */ }
  }

  return NextResponse.json({ users: userIds.length, sent })
}
