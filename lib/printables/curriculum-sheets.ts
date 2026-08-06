import type { SupabaseClient } from '@supabase/supabase-js'
import type { CurriculumTask } from '@/components/printables/CurriculumSheet'

// Choosing what goes on a toolkit sheet.
//
// One sheet is ONE STRAND. That is the whole selection rule and it is the thing
// that makes these worth printing: a page of six unrelated objectives is a
// worksheet, and a page of six objectives that are all fractions is a lesson.
// It is also how a school teaches, in blocks, which is what makes the sheet
// recognisable to a child who has been doing fractions all fortnight.
//
// Five tasks, because that is what leaves working space a child can
// actually use. Thirty millimetres of squared paper per task is a real box to do
// a column method in; ten tasks would be ten decorative lines.

/**
 * Five, measured rather than chosen.
 *
 * Six with a fixed working box came out at 515mm on a 297mm side. The tasks
 * flex to fill the page now, so the count sets how much room each one gets
 * rather than whether it fits: five leaves roughly 30mm of squared paper per
 * task, which is a real box to do a column method in. Six squeezes to 24mm and
 * starts to feel like a form. Four is generous and wastes a side.
 */
export const TASKS_PER_SHEET = 5

export type SheetPick = {
  strand: string
  tasks: CurriculumTask[]
}

/**
 * The strands available for a year and subject, largest first.
 *
 * Largest first because a strand with eleven objectives fills a sheet and a
 * strand with two does not, and the first sheet a family ever prints should be
 * a full one.
 */
export function groupByStrand(rows: CurriculumTask[]): SheetPick[] {
  const byStrand = new Map<string, CurriculumTask[]>()
  for (const r of rows) {
    const list = byStrand.get(r.strand)
    if (list) list.push(r)
    else byStrand.set(r.strand, [r])
  }
  return [...byStrand.entries()]
    .map(([strand, tasks]) => ({ strand, tasks: tasks.slice(0, TASKS_PER_SHEET) }))
    .sort((a, b) => b.tasks.length - a.tasks.length)
}

/**
 * Objectives for one year and subject, optionally one term.
 *
 * Fails soft to an empty list rather than throwing. A printable is a nice to
 * have on a page that has other things on it, and a curriculum table that
 * cannot be read should cost a family the sheet, not the screen.
 */
export async function curriculumTasks(
  supabase: SupabaseClient,
  yearGroup: number,
  subject: string,
  term?: string | null,
): Promise<CurriculumTask[]> {
  try {
    let q = supabase
      .from('curriculum_objectives')
      .select('id, strand, objective, sort_order')
      .eq('year_group', yearGroup)
      .eq('subject', subject)
    if (term) q = q.eq('term', term)
    const { data, error } = await q.order('sort_order', { ascending: true })
    if (error || !data) return []
    return data.map(r => ({
      id: String(r.id),
      strand: String(r.strand ?? 'Practice'),
      objective: String(r.objective ?? ''),
    })).filter(t => t.objective.length > 0)
  } catch {
    return []
  }
}

/**
 * The school year a child is in, from their age band.
 *
 * A rough map, and deliberately so. The app asks for an age band and not a date
 * of birth, so this cannot be exact and should not pretend to be: the sheet
 * names the year on it, and a parent who can see "Year 5" at the top can pick a
 * different one if their child is in Year 4. Guessing silently and being wrong
 * is worse than showing the guess.
 *
 * Clamped to 1 to 6 because curriculum_objectives only covers primary. An older
 * child gets the Year 6 material, which is the honest ceiling of what we hold
 * rather than an empty page.
 */
export function yearGroupForBand(ageBand: string | null | undefined): number {
  switch (ageBand) {
    case '4-7': return 2
    case '8-10': return 4
    case '11-13': return 6
    case '13-15': return 6
    case '16+': return 6
    default: return 4
  }
}
