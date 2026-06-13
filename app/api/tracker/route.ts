import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { scores, notes } = await request.json()

  const { data: child } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

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
