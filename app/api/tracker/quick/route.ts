import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Quick one-tap tracker check-in from the daily deck completion screen.
//
// This upserts on the same (child_id, week_start) key as the full five score
// form, and it used to blindly overwrite. A parent who filled the full form on
// Monday and tapped the quick rating on Wednesday had their week's notes
// replaced with "Quick check-in: okay", and the concern level recomputed from
// the one tap alone while four real scores sat ignored in the same row. Since
// this table now feeds the DiGi learning loop (migration 190), a quick tap
// silently erasing the richer record poisons the very data the brain learns
// from. So the existing row is read first and merged, never clobbered.
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

  let existingQuery = supabase
    .from('wellbeing_checks')
    .select('sleep_score, social_score, screen_mood_score, open_communication, notes')
    .eq('parent_id', user.id)
    .eq('week_start', weekStartStr)
  existingQuery = child?.id ? existingQuery.eq('child_id', child.id) : existingQuery.is('child_id', null)
  const { data: existing } = await existingQuery.maybeSingle()

  // Concern from everything known about the week, not the one tap alone.
  const known = [rating, existing?.sleep_score, existing?.social_score, existing?.screen_mood_score, existing?.open_communication]
    .filter((v): v is number => typeof v === 'number')
  const avg = known.reduce((a, b) => a + b, 0) / known.length
  const concernLevel = avg <= 1.5 ? 'high' : avg <= 2.5 ? 'medium' : avg <= 3.5 ? 'low' : 'none'

  // A full form's notes survive a later quick tap; only a previous quick tap's
  // own note is replaced.
  const quickNote = `Quick check-in: ${label}`
  const priorNotes = existing?.notes?.trim() ?? ''
  const notes = !priorNotes || priorNotes.startsWith('Quick check-in:')
    ? quickNote
    : priorNotes.includes('Quick check-in:')
      ? priorNotes.replace(/Quick check-in:[\s\S]*$/, quickNote)
      : `${priorNotes}\n${quickNote}`

  await supabase.from('wellbeing_checks').upsert({
    child_id: child?.id ?? null,
    parent_id: user.id,
    week_start: weekStartStr,
    mood_score: rating,
    concern_level: concernLevel,
    notes,
  }, { onConflict: 'child_id, week_start' })

  return NextResponse.json({ saved: true })
}
