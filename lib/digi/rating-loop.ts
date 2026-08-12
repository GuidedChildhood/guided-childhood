import { createAdminClient } from '@/lib/supabase/admin'
import { computeShift, shiftSummary, type ShiftAction, type WeekRow } from './checkin-shift'
import type { createClient } from '@/lib/supabase/server'

type SupabaseClient = Awaited<ReturnType<typeof createClient>>

// The check in data goes onto the DiGi brain.
//
// Justin: "Digi must learn what we did when the rating goes up ... learn from
// what did not work and try other solutions and like natural selection we need
// to examine what works and why from data."
//
// The loop this file closes, in three moves:
//
// 1. SELECTION. Once a week the cron compares each child's wellbeing check in
//    with the previous week's, per dimension, and writes one checkin_shifts
//    row: up, down or flat, plus everything the family actually did in that
//    window (scripts and their verdicts, the agreed Sunday plan, answered
//    follow ups, moments, lessons). The rating is the fitness function; the
//    actions are the variants being selected between.
//
// 2. HEREDITY, PER FAMILY. A rise also writes a digi_memory win ("the week of
//    X they did Y and things got better") so the semantic brain carries it
//    into every future conversation. A fall under a live plan writes an
//    observation, which is the row that earns the family a DIFFERENT plan
//    next Sunday rather than the same one again.
//
// 3. HEREDITY, CROSS FAMILY. rebuildWisdom and the insight agent read the
//    shifts across families (shapes and directions only, never notes), so
//    what keeps preceding a rise becomes wisdom and what keeps preceding a
//    fall becomes caution.
//
// The comparison itself is pure and lives in lib/digi/checkin-shift.ts, so
// scripts/check-checkin-shifts.mjs can throw cases at it without a token.

export type RatingLoopResult = {
  ranAt: string
  familiesSeen: number
  shiftsWritten: number
  ups: number
  downs: number
  flats: number
  memoriesWritten: number
}

/**
 * Compute this week's shifts for every family and write the new ones.
 *
 * Idempotent by construction: a (user, child, week) that already has a shift
 * row is skipped entirely, so re-running the cron writes nothing twice and
 * the digi_memory facts are only ever filed once per shift.
 */
export async function runRatingLoop(now = new Date()): Promise<RatingLoopResult> {
  const admin = createAdminClient()
  const result: RatingLoopResult = {
    ranAt: now.toISOString(),
    familiesSeen: 0,
    shiftsWritten: 0,
    ups: 0,
    downs: 0,
    flats: 0,
    memoriesWritten: 0,
  }

  // Recent check ins only. The two week conventions in the writers (the full
  // form starts weeks on Sunday, the Sunday check in on Monday) mean adjacent
  // rows can sit 6 to 8 days apart, so the pairing below works on each child's
  // two most recent rows rather than assuming a fixed grid.
  const since = new Date(now.getTime() - 28 * 86_400_000).toISOString().slice(0, 10)
  const { data: checks } = await admin
    .from('wellbeing_checks')
    .select('parent_id, child_id, week_start, mood_score, sleep_score, social_score, screen_mood_score, open_communication')
    .gte('week_start', since)
    .order('week_start', { ascending: false })
    .limit(4000)

  type CheckRow = WeekRow & { parent_id: string; child_id: string | null }
  const byChild = new Map<string, CheckRow[]>()
  for (const row of (checks ?? []) as CheckRow[]) {
    const key = `${row.parent_id}:${row.child_id ?? 'none'}`
    const list = byChild.get(key)
    if (list) list.push(row)
    else byChild.set(key, [row])
  }
  result.familiesSeen = byChild.size

  if (byChild.size === 0) return result

  // Names once, for the summaries.
  const { data: childRows } = await admin.from('children').select('id, name')
  const nameById = new Map((childRows ?? []).map(c => [c.id as string, (c.name as string | null) ?? '']))

  for (const rows of byChild.values()) {
    // Rows arrive newest first. The newest is this week's candidate; its
    // partner is the next distinct week. More than 14 days apart is not a
    // week on week comparison, it is two check ins with a hole between them.
    const nowRow = rows[0]
    const prevRow = rows.find(r => r.week_start < nowRow.week_start)
    if (!prevRow) continue
    const gapDays = (new Date(nowRow.week_start).getTime() - new Date(prevRow.week_start).getTime()) / 86_400_000
    if (gapDays > 14) continue

    const shift = computeShift(nowRow, prevRow)
    if (!shift) continue

    // Already recorded? Then everything downstream already happened too.
    let existingQuery = admin
      .from('checkin_shifts')
      .select('id')
      .eq('user_id', nowRow.parent_id)
      .eq('week_start', nowRow.week_start)
    existingQuery = nowRow.child_id === null ? existingQuery.is('child_id', null) : existingQuery.eq('child_id', nowRow.child_id)
    const { data: existing } = await existingQuery.maybeSingle()
    if (existing) continue

    // What the family actually did in the window, from the tables that
    // already record it. The window runs from the start of the previous week
    // to the end of the current one, because the thing that moved this week's
    // rating may have been started the week before.
    const windowStart = `${prevRow.week_start}T00:00:00.000Z`
    const windowEnd = new Date(new Date(`${nowRow.week_start}T00:00:00.000Z`).getTime() + 7 * 86_400_000).toISOString()

    const [scriptsRes, planRes, outcomesRes, momentsRes, lessonsRes] = await Promise.all([
      admin
        .from('script_completions')
        .select('script_sort_order, worked, completed_at')
        .eq('user_id', nowRow.parent_id)
        .gte('completed_at', windowStart)
        .lt('completed_at', windowEnd),
      admin
        .from('wellbeing_checkins')
        .select('week_start, plan, plan_agreed')
        .eq('user_id', nowRow.parent_id)
        .eq('plan_agreed', true)
        .gte('week_start', prevRow.week_start)
        .lte('week_start', nowRow.week_start),
      admin
        .from('digi_outcomes')
        .select('suggestion, verdict, answered_at')
        .eq('user_id', nowRow.parent_id)
        .not('verdict', 'is', null)
        .gte('answered_at', windowStart)
        .lt('answered_at', windowEnd),
      admin
        .from('moment_completions')
        .select('completed_on')
        .eq('user_id', nowRow.parent_id)
        .gte('completed_on', prevRow.week_start)
        .lt('completed_on', windowEnd.slice(0, 10)),
      admin
        .from('lesson_completions')
        .select('completed_at')
        .eq('user_id', nowRow.parent_id)
        .gte('completed_at', windowStart)
        .lt('completed_at', windowEnd),
    ])

    const actions: ShiftAction[] = []

    const scriptOrders = [...new Set((scriptsRes.data ?? []).map(s => s.script_sort_order as number))]
    const { data: scriptTitles } = scriptOrders.length
      ? await admin.from('scripts').select('sort_order, title').in('sort_order', scriptOrders)
      : { data: [] as { sort_order: number; title: string }[] }
    const titleByOrder = new Map((scriptTitles ?? []).map(s => [s.sort_order as number, s.title as string]))
    for (const s of scriptsRes.data ?? []) {
      const title = titleByOrder.get(s.script_sort_order as number) ?? `script ${s.script_sort_order}`
      const worked = s.worked === 'yes' ? 'it worked' : s.worked === 'somewhat' ? 'it partly worked' : s.worked === 'no' ? 'it did not work' : 'no verdict yet'
      actions.push({ kind: 'script', detail: `used the script "${title}" and said ${worked}` })
    }

    const hadPlan = (planRes.data ?? []).length > 0
    for (const p of planRes.data ?? []) {
      const steps = (Array.isArray(p.plan) ? (p.plan as { title?: string }[]) : []).map(x => x.title).filter(Boolean)
      if (steps.length > 0) actions.push({ kind: 'plan', detail: `agreed a Sunday plan: ${steps.join(', ')}` })
    }

    for (const o of outcomesRes.data ?? []) {
      const said = o.verdict === 'worked' ? 'it worked' : o.verdict === 'partly' ? 'it helped a bit' : 'it did not work'
      actions.push({ kind: 'followup', detail: `tried "${String(o.suggestion).slice(0, 120)}" and told us ${said}` })
    }

    const momentCount = (momentsRes.data ?? []).length
    if (momentCount > 0) actions.push({ kind: 'moment', detail: `worked through ${momentCount} calm parenting ${momentCount === 1 ? 'moment' : 'moments'}` })
    const lessonCount = (lessonsRes.data ?? []).length
    if (lessonCount > 0) actions.push({ kind: 'lesson', detail: `completed ${lessonCount} ${lessonCount === 1 ? 'lesson' : 'lessons'}` })

    const childName = nowRow.child_id ? (nameById.get(nowRow.child_id) || 'the child') : 'the child'
    const summary = shiftSummary(childName, shift, actions, hadPlan)

    const { error: insertError } = await admin.from('checkin_shifts').insert({
      user_id: nowRow.parent_id,
      child_id: nowRow.child_id,
      week_start: nowRow.week_start,
      prev_week_start: prevRow.week_start,
      avg_now: shift.avgNow,
      avg_prev: shift.avgPrev,
      direction: shift.direction,
      dimensions: shift.dimensions,
      actions,
      had_plan: hadPlan,
      summary,
    })
    if (insertError) continue

    result.shiftsWritten += 1
    if (shift.direction === 'up') result.ups += 1
    else if (shift.direction === 'down') result.downs += 1
    else result.flats += 1

    // The memory the brain keeps. A rise files a win so every future
    // conversation knows what this family did the week things got better. A
    // fall under a live plan files the observation that earns them a
    // different plan, which is the learning from what did not work. A flat
    // week files nothing, because a brain full of nothing happened is noise.
    const memory =
      shift.direction === 'up'
        ? { kind: 'win', content: `Week of ${nowRow.week_start}: ${summary}` }
        : shift.direction === 'down' && hadPlan
          ? { kind: 'observation', content: `Week of ${nowRow.week_start}: ${summary} The agreed plan did not move things, so next week's plan should take a different angle rather than repeat it.` }
          : null

    if (memory) {
      try {
        const { embedText } = await import('@/lib/digi/embeddings')
        const embedding = await embedText(memory.content.slice(0, 400), 'document').catch(() => null)
        await admin.from('digi_memory').insert({
          user_id: nowRow.parent_id,
          child_id: nowRow.child_id,
          kind: memory.kind,
          content: memory.content.slice(0, 400),
          source: 'rating_loop',
          ...(embedding ? { embedding } : {}),
        })
        result.memoriesWritten += 1
      } catch {
        /* memory is best effort, the shift row already holds the fact */
      }
    }
  }

  return result
}

// ── The context block DiGi reads ────────────────────────────────────────────

/**
 * Recent shifts for one family, as a block for the chat context. This is the
 * sentence Justin asked for, in DiGi's own working memory: what we did when
 * the rating went up, and what did not move it.
 */
export async function getRatingShifts(supabase: SupabaseClient, userId: string, limit = 5): Promise<string> {
  const { data } = await supabase
    .from('checkin_shifts')
    .select('week_start, direction, summary, had_plan')
    .eq('user_id', userId)
    .order('week_start', { ascending: false })
    .limit(limit)

  const rows = (data ?? []).filter(r => r.summary)
  if (rows.length === 0) return ''

  return (
    '\n\nWHAT MOVED THE NEEDLE FOR THIS FAMILY (their own weekly check in ratings against what they did each week, computed from their data. When the rating rose, lean on what they did that week, it is proven for THIS family. When it fell under an agreed plan, do not offer that plan again unchanged, offer a different angle and say why. Never quote the numbers as a score card, use them to choose better suggestions):\n' +
    rows.map(r => `- ${r.summary}`).join('\n')
  )
}
