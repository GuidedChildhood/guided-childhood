import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { dailyMomentLabel } from '@/lib/content/daily-moments'
import { logConcernEvents } from '@/lib/concerns/events'
import { londonToday } from '@/lib/pathway/today'

// Store which daily moments happened today so tomorrow's card can be
// personalised, and mirror each flagged moment into the concerns ledger:
// a fresh flag opens a concern, a repeat flag bumps times_flagged, and a
// concern the family had resolved reopens if it comes back.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { moments } = await request.json() as { moments: string[] }

  // ── TWO BUGS, ONE LINE, AND BOTH LEFT TODAY SAYING IT WAS NOT DONE ────────
  //
  // Justin, 14 August 2026: "i also went thorugh the moment on today card and
  // it still says needs to be done?"
  //
  // ONE, THE DATE WAS THE WRONG DAY. This wrote session_date from
  // toISOString(), which is UTC, while lib/pathway/daily-tasks.ts reads the row
  // back with londonToday(). From late March to late October Britain is an hour
  // ahead, so anything logged between midnight and 1am wrote to YESTERDAY's row
  // and today's rung could never tick. Late evening is exactly when a parent
  // logs how the day went, so this is not an edge case, it is the busiest hour
  // the feature has.
  //
  // TWO, RAISING MOMENTS DID NOT COUNT AS DOING THEM. momentDone is
  // completed_at being set OR cards_completed being above zero, and this route
  // wrote neither. It only ever wrote moment_feedback. So the ONE path that
  // most parents take, opening the timeline and tapping what actually happened
  // today, left the rung looking untouched. Only swiping to the very last card
  // of the deck ever called /api/daily/complete.
  //
  // Naming what happened today IS the moment step. cards_completed is only
  // raised, never lowered, so a parent who does both still reads as done.
  const today = londonToday()

  const { data: existingSession } = await supabase
    .from('daily_sessions')
    .select('cards_completed')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .maybeSingle()

  await supabase
    .from('daily_sessions')
    .upsert(
      {
        user_id: user.id,
        session_date: today,
        moment_feedback: moments,
        cards_completed: Math.max(1, (existingSession?.cards_completed as number | null) ?? 0),
      },
      { onConflict: 'user_id,session_date' }
    )

  // Concerns ledger: best effort, never blocks the save. The generic Something
  // else tag is a picker, not a real moment, so it is never tracked as a
  // concern; only the specific moments the parent lands on are.
  const GENERIC_CONCERN_SLUGS = new Set(['something-else', 'something_else', 'other'])
  try {
    const slugs = (moments ?? []).filter(m => dailyMomentLabel(m) !== null && !GENERIC_CONCERN_SLUGS.has(m))
    if (slugs.length > 0) {
      const now = new Date().toISOString()

      const [existingResult, childResult] = await Promise.all([
        supabase
          .from('concerns')
          .select('slug, status, times_flagged')
          .eq('user_id', user.id)
          .in('slug', slugs),
        supabase
          .from('children')
          .select('id')
          .eq('parent_id', user.id)
          .eq('is_primary', true)
          .maybeSingle(),
      ])

      const existing = existingResult.data ?? []
      const childId = childResult.data?.id ?? null

      const rows = slugs.map(slug => {
        const prior = existing.find(c => c.slug === slug)
        return {
          user_id: user.id,
          child_id: childId,
          source: 'moment',
          slug,
          label: dailyMomentLabel(slug) as string,
          // A repeat flag bumps the count. A resolved concern that comes
          // back reopens; otherwise the current status is kept.
          status: prior ? (prior.status === 'resolved' ? 'open' : prior.status) : 'open',
          times_flagged: prior ? prior.times_flagged + 1 : 1,
          last_flagged_at: now,
        }
      })

      await supabase.from('concerns').upsert(rows, { onConflict: 'user_id,child_id,slug' })
      await logConcernEvents(supabase, user.id, rows.map(r => r.slug), {
        event: 'flagged',
        source: 'moment',
        linkedType: 'moment',
      })
    }
  } catch { /* the ledger never blocks the daily save */ }

  return NextResponse.json({ saved: true })
}
