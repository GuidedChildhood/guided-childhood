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

  const { moments, child_id } = await request.json() as { moments: string[]; child_id?: string | null }

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

  // ── WHOSE DAY, AND IT IS THE WHOLE BUG (19 August 2026) ───────────────────
  //
  // Justin: "we add moments for Jody then when I flick to Tray it shows
  // moments done. The data needs to be saved per child and fresh for the next
  // child. Do not finish fixing until Today works by child."
  //
  // Two faults sat here. The session upsert still said onConflict
  // user_id,session_date, a constraint migration 210 REPLACED, so on the new
  // database the upsert failed or landed on a row with no child, and a no
  // child row counts for every child by the grandfather rule, which is exactly
  // Jody's moments showing done on Tray's day. And the concern rows below went
  // to the PRIMARY child regardless of whose day the parent was on, so the
  // vital thing, a flagged moment feeding THAT child's next check in, fed the
  // wrong child's.
  //
  // The child comes from the caller, checked against the account, falling back
  // to the first child, which is what is_primary meant.
  let forChild: string | null = null
  if (typeof child_id === 'string' && child_id) {
    const { data: owned } = await supabase
      .from('children').select('id').eq('id', child_id).eq('parent_id', user.id).maybeSingle()
    forChild = owned?.id ?? null
  }
  if (!forChild) {
    const { data: kids } = await supabase
      .from('children').select('id').eq('parent_id', user.id)
      .order('is_primary', { ascending: false }).order('created_at', { ascending: true }).limit(1)
    forChild = (kids ?? [])[0]?.id ?? null
  }

  const { data: existingSession } = await supabase
    .from('daily_sessions')
    .select('cards_completed, child_id')
    .eq('user_id', user.id)
    .eq('session_date', today)
    .or(forChild ? `child_id.eq.${forChild},child_id.is.null` : 'child_id.is.null')
    .limit(1)
    .maybeSingle()

  const sessionRow = {
    user_id: user.id,
    session_date: today,
    moment_feedback: moments,
    cards_completed: Math.max(1, (existingSession?.cards_completed as number | null) ?? 0),
  }
  const { error: upsertErr } = await supabase
    .from('daily_sessions')
    .upsert({ ...sessionRow, child_id: forChild }, { onConflict: 'user_id,child_id,session_date' })
  // A database that has not run 210 keeps the old key; the old shape is
  // retried rather than costing the parent their save.
  if (upsertErr) {
    await supabase.from('daily_sessions').upsert(sessionRow, { onConflict: 'user_id,session_date' })
  }

  // Concerns ledger: best effort, never blocks the save. The generic Something
  // else tag is a picker, not a real moment, so it is never tracked as a
  // concern; only the specific moments the parent lands on are.
  const GENERIC_CONCERN_SLUGS = new Set(['something-else', 'something_else', 'other'])

  // ── A MOMENT LANDS ON THE CONCERN IT IS, NOT ON ITS OWN SPELLING ──────────
  //
  // The check in tells a parent who five stars a worry: "If it comes back,
  // log it as a moment and it returns here on its own." The wake-up wire is
  // real (last_flagged_at newer than the resting score un-rests the row, see
  // lib/concerns/resting.ts), but it matches on SLUG, and the moment deck and
  // the seeded baseline grew separate vocabularies for the same worries. So
  // logging the bedtime moment created a brand new "Getting to bed" concern
  // and the retired "Bedtime screens" row, with the family's whole history on
  // it, slept on. Found by the 1 September 2026 audit.
  //
  // Only the unambiguous same-worry pairs are mapped, carrying the ledger
  // row's own label so an upsert never renames it. Every other moment stays
  // its own concern, because "Snacks and food" genuinely is not "Mood after
  // screens" and guessing would file a parent's worry under the wrong name.
  const MOMENT_TO_CONCERN: Record<string, { slug: string; label: string }> = {
    bedtime: { slug: 'bedtime-screens', label: 'Bedtime screens' },
    come_off: { slug: 'wont-put-down', label: 'Will not put it down' },
    tv_morning: { slug: 'morning-tv', label: 'Morning TV' },
  }
  try {
    const momentKeys = (moments ?? []).filter(m => dailyMomentLabel(m) !== null && !GENERIC_CONCERN_SLUGS.has(m))
    if (momentKeys.length > 0) {
      const now = new Date().toISOString()
      const targets = momentKeys.map(key => MOMENT_TO_CONCERN[key] ?? { slug: key, label: dailyMomentLabel(key) as string })
      const slugs = [...new Set(targets.map(t => t.slug))]

      // THIS child's prior rows, so a repeat of Jody's bedtime battle bumps
      // Jody's count rather than finding a sibling's row by slug alone.
      const existingResult = await supabase
        .from('concerns')
        .select('slug, status, times_flagged')
        .eq('user_id', user.id)
        .in('slug', slugs)
        .or(forChild ? `child_id.eq.${forChild},child_id.is.null` : 'child_id.is.null')

      const existing = existingResult.data ?? []
      const childId = forChild

      const rows = slugs.map(slug => {
        const target = targets.find(t => t.slug === slug)!
        const prior = existing.find(c => c.slug === slug)
        return {
          user_id: user.id,
          child_id: childId,
          source: 'moment',
          slug,
          label: target.label,
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
