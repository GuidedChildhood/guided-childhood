import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }


  // The wellbeing check in is health information about a named child and is
  // only written once the parent has said yes to that specifically (privacy
  // notice: "nothing is written down until you have"). The gate lived only in
  // the check in screen; this is the promise kept on the server (audit,
  // 5 September 2026).
  const { data: consentRow } = await supabase.from('profiles').select('wellbeing_consent_at').eq('id', user.id).maybeSingle()
  if (!consentRow?.wellbeing_consent_at) {
    return NextResponse.json({ error: 'consent_required' }, { status: 403 })
  }

  const { scores, notes, child_id } = await request.json()

  // The child off the wire (validated as this parent's), the primary child
  // only as a fallback. Unconditional is_primary here wrote every tracker
  // week against the first child whoever the toggle showed. Also .single()
  // errors outright with two primaries or none, which is its own bug.
  const { data: kids } = await supabase
    .from('children')
    .select('id, is_primary')
    .eq('parent_id', user.id)
  const child = (typeof child_id === 'string' && (kids ?? []).find(k => k.id === child_id))
    || (kids ?? []).find(k => k.is_primary)
    || (kids ?? [])[0]
    || null

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const avgScore = Object.values(scores as Record<string, number>).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  const concernLevel = avgScore <= 2 ? 'high' : avgScore <= 3 ? 'medium' : avgScore <= 3.5 ? 'low' : 'none'

  const { error } = await supabase.from('wellbeing_checks').upsert({
    child_id: child?.id ?? null,
    parent_id: user.id,
    week_start: weekStartStr,
    mood_score: scores.mood ?? null,
    sleep_score: scores.sleep ?? null,
    social_score: scores.social ?? null,
    screen_mood_score: scores.screen_mood ?? null,
    open_communication: scores.communication ?? null,
    concern_level: concernLevel,
    notes: notes ?? null,
  }, { onConflict: 'child_id, week_start' })

  if (error) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ saved: true, concernLevel })
}
