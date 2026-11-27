import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkBackTiming } from '@/lib/scripts/check-back'

// "Remind me in two weeks" on a script page (walkthrough, 27 November 2026).
//
// A script that sets a trial ("try it for two weeks, then look at it
// together") had no way to bring the parent back when the two weeks were up;
// only DiGi could, and only if a chat happened and it chose to. This writes the
// same digi_followups row DiGi's schedule_followup tool writes, so the reminder
// arrives as the one follow up card the cron already delivers (one card per
// child, the same cap of three pending), and the answer feeds the same record
// of what worked. The timing is read from the script's own check back text on
// the server, never trusted from the client.
//
// RLS scopes the insert to the signed in user.

export const dynamic = 'force-dynamic'

const MAX_PENDING_FOLLOWUPS = 3 // the same cap as lib/digi/tools.ts

export async function POST(req: NextRequest) {
  const { sortOrder, child_id } = await req.json().catch(() => ({}))
  if (typeof sortOrder !== 'number' || !Number.isFinite(sortOrder)) {
    return NextResponse.json({ error: 'missing sortOrder' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { data: script } = await supabase
    .from('scripts')
    .select('title, check_back')
    .eq('sort_order', sortOrder)
    .maybeSingle()
  if (!script) return NextResponse.json({ error: 'no such script' }, { status: 404 })

  const { count } = await supabase
    .from('digi_followups')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'pending')
  if ((count ?? 0) >= MAX_PENDING_FOLLOWUPS) {
    return NextResponse.json({ ok: false, reason: 'full' })
  }

  const { days } = checkBackTiming(script.check_back as string | null)
  const dueOn = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' })
    .format(new Date(Date.now() + days * 86_400_000))
  const title = String(script.title)

  const { error } = await supabase.from('digi_followups').insert({
    user_id: user.id,
    child_id: typeof child_id === 'string' && child_id ? child_id : null,
    due_on: dueOn,
    question: `How did "${title}" go?`,
    context: `The parent asked to be reminded from the script page to check back on "${title}".`,
    suggestion: title,
    situation: { topic: null, time_band: null, trigger: null },
  })
  if (error) return NextResponse.json({ ok: false, reason: 'error' }, { status: 500 })
  return NextResponse.json({ ok: true, dueOn, days })
}
