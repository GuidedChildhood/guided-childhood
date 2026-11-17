import type { SupabaseClient } from '@supabase/supabase-js'
import { loadChildLessonPath } from '@/lib/pathway/lesson-path-server'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { countsTowardPathway } from '@/lib/pathway/script-status'
import { stampedStickerNums } from '@/lib/pathway/passport-stickers-server'
import { STAGE_IDS } from '@/lib/pathway/passport-print-style'

// THE RECORD BOOK'S ROWS, READ THE ONE WAY (17 November 2026).
//
// Justin: "give them a book like a swimming passport", where every step is on
// its own line and gets ticked as it is done. The printed record book
// (/dashboard/keepsakes/passport-print/record) lists every step a stage asks
// for, in the order the app teaches it, and ticks the ones the app already
// holds as done.
//
// The rows are exactly the three things the stamp counts and nothing else
// (lib/pathway/stamped.ts, lib/pathway/page-count.ts):
//   lessons  the stage's school modules, passed by this child, read through
//            childLessonPath, the same function the page count goes through
//   talks    the stage's scripts that are always on the page (only_on_signal
//            ones excluded, as progress.ts excludes them), done when the
//            status counts toward the pathway ("opened" does not)
//   check    the stage's big check, passed by this child
// So the paper and the app cannot disagree: a tick on paper is a tick the
// passport page already counts.

export type RecordRow = {
  key: string
  kind: 'lesson' | 'talk' | 'check'
  title: string
  done: boolean
  /** ISO date the app recorded it, when it has one. */
  doneOn: string | null
}

export type RecordStage = { n: number; rows: RecordRow[]; stamped: boolean }

export async function loadRecordBook(
  db: SupabaseClient,
  userId: string,
  childId: string,
  paid: boolean,
): Promise<RecordStage[]> {
  const [paths, scripts, scriptDone, passed, stamped, completions] = await Promise.all([
    Promise.all(STAGE_IDS.map(stageId => loadChildLessonPath(db, { userId, childId, stageId, paid }).catch(() => null))),
    db.from('scripts').select('sort_order, title, stage_id, only_on_signal').order('sort_order'),
    db.from('script_completions').select('script_sort_order, status, child_id, completed_at').eq('user_id', userId).or(`child_id.eq.${childId},child_id.is.null`),
    getPassedStageQuizzes(db, userId, childId),
    stampedStickerNums(db, userId, childId),
    db.from('lesson_completions').select('lesson_id, passed, completed_at').eq('user_id', userId).eq('child_id', childId),
  ])

  // The earliest passing completion per lesson, for the date column.
  const passedOn = new Map<string, string>()
  for (const c of (completions.data ?? []) as { lesson_id: string; passed: boolean | null; completed_at: string | null }[]) {
    if (c.passed === false || !c.completed_at) continue
    const prev = passedOn.get(c.lesson_id)
    if (!prev || c.completed_at < prev) passedOn.set(c.lesson_id, c.completed_at)
  }
  const talkOn = new Map<number, string>()
  for (const c of (scriptDone.data ?? []) as { script_sort_order: number; status: string | null; completed_at: string | null }[]) {
    if (!countsTowardPathway(c.status)) continue
    const at = c.completed_at ?? ''
    const prev = talkOn.get(c.script_sort_order)
    if (prev === undefined || (at && at < prev)) talkOn.set(c.script_sort_order, at)
  }
  const allScripts = (scripts.data ?? []) as { sort_order: number; title: string | null; stage_id: string | null; only_on_signal?: boolean | null }[]

  return STAGE_IDS.map((stageId, i) => {
    const n = i + 1
    const path = paths[i]
    const lessons: RecordRow[] = (path?.modules ?? []).map(m => {
      const done = path?.path.statusById[m.id]?.state === 'passed'
      return { key: `l-${m.id}`, kind: 'lesson', title: m.title, done, doneOn: done ? (passedOn.get(m.id) ?? null) : null }
    })
    const talks: RecordRow[] = allScripts
      .filter(s => s.stage_id === stageId && !s.only_on_signal)
      .map(s => {
        const done = talkOn.has(s.sort_order)
        return { key: `s-${s.sort_order}`, kind: 'talk', title: s.title ?? 'A talk together', done, doneOn: done ? (talkOn.get(s.sort_order) || null) : null }
      })
    const check: RecordRow = { key: 'check', kind: 'check', title: 'The big check', done: passed.has(n), doneOn: null }
    return { n, rows: [...lessons, ...talks, check], stamped: stamped.includes(n) }
  })
}
