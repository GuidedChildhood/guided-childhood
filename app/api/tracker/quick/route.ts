import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Quick one-tap tracker check-in from the daily deck completion screen
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { rating, label } = await request.json() as { rating: number; label: string }

  const { data: child } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', user.id)
    .eq('is_primary', true)
    .single()

  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  const weekStartStr = weekStart.toISOString().split('T')[0]

  const concernLevel = rating <= 1 ? 'high' : rating <= 2 ? 'medium' : rating <= 3 ? 'low' : 'none'

  await supabase.from('wellbeing_checks').upsert({
    child_id: child?.id ?? null,
    parent_id: user.id,
    week_start: weekStartStr,
    mood_score: rating,
    concern_level: concernLevel,
    notes: `Quick check-in: ${label}`,
  }, { onConflict: 'child_id, week_start' })

  return NextResponse.json({ saved: true })
}
