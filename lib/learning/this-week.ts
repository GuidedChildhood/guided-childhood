import { sheetTarget, nextTermTarget, academicYearStart, type SheetTarget, type Term } from './term'
import { splitObjective } from './year-view'

// This week at school: the deterministic weekly walk through the term.
//
// Phase 1 of the curriculum depth plan. The 448 objectives already know the
// year group and the term; this gives them a WEEK, so the same family sees
// the same objective all week and a new one on Monday, with no model call
// and no randomness. Week of term is days since the term started over seven,
// and the pick is that week number walked around the term's rows, so a term
// with nine maths objectives simply comes round again after nine weeks.
//
// ── Holidays ────────────────────────────────────────────────────────────────
// In August school is out and termFor honestly says the year is finished, so
// the brief flips to a preview: week one of what starts when they go back,
// said as a preview and never as "this week". The half terms are left alone
// on purpose: the class returns to the same term, so the current week stays
// honest enough, and a fortnight of "week 8" during a break beats a second
// calendar to maintain.
//
// ── Other countries, asked by Justin on 8 August ────────────────────────────
// Everything here is England: the objectives rows carry curriculum='england'
// and the term dates are the English school year. That is why CURRICULUM is
// an explicit parameter rather than an assumption buried in a query: when
// another country's objectives are imported under their own curriculum slug,
// this picker takes the slug and a matching term calendar, and the honest
// gate below already does the right thing today, which is that a child we
// cannot place in the England system gets NO brief rather than a wrong one.

export type WeekBrief = {
  yearGroup: number
  term: Term
  /** True in the school holidays: the brief looks at what starts when they go back. */
  preview: boolean
  /** 1 based, clamped, wraps around the term's rows. */
  weekOfTerm: number
  /** The lead subject this week, always maths while maths is the only termed subject. */
  subjectLabel: string
  strand: string
  lead: string
  parts: string[]
  /** The lighter second thread, from English or reading. */
  second: { subjectLabel: string; strand: string; lead: string } | null
  /** A short title ready for the jobs board. */
  questTitle: string
}

export type ObjectiveRowLite = {
  subject: string
  strand: string
  objective: string
  sort_order: number
}

const CURRICULUM = 'england'

const SUBJECT_LABEL: Record<string, string> = {
  maths: 'Maths', english: 'English', reading: 'Reading',
}

/** When the term started, for the week count. Matches the boundaries in termFor. */
function termStart(term: Term, on: Date): number {
  const startYear = academicYearStart(on)
  if (term === 'autumn') return Date.UTC(startYear, 8, 1)
  if (term === 'spring') return Date.UTC(startYear + 1, 0, 1)
  return Date.UTC(startYear + 1, 3, 15)
}

/** Where this child is this week, or null when we cannot honestly place them. */
export function weekTargetFor(birthday: Date, on: Date): { target: SheetTarget; weekOfTerm: number; preview: boolean } | null {
  const current = sheetTarget(birthday, on)
  if (current && !current.lookingBack) {
    const week = Math.max(1, Math.floor((on.getTime() - termStart(current.term, on)) / 604_800_000) + 1)
    return { target: current, weekOfTerm: week, preview: false }
  }
  // School is out. Preview week one of what comes next, if the next thing is
  // still a year we hold objectives for.
  const next = nextTermTarget(birthday, on)
  if (!next) return null
  return { target: next, weekOfTerm: 1, preview: true }
}

/** A job title a child can read on the board. The full objective stays on the page. */
export function questTitleFrom(lead: string): string {
  const clean = lead.replace(/[:;]+\s*$/, '').trim()
  if (clean.length <= 56) return clean
  const cut = clean.slice(0, 56)
  return cut.slice(0, Math.max(20, cut.lastIndexOf(' '))).replace(/[,;:.]+$/, '')
}

/**
 * The pure pick, testable without a database. Maths leads because it is the
 * only subject written per term; English and reading are written per year, so
 * they walk their whole list at the same week number.
 */
export function pickWeekBrief(
  rows: ObjectiveRowLite[],
  target: SheetTarget,
  weekOfTerm: number,
  preview: boolean,
): WeekBrief | null {
  const sorted = rows.slice().sort((a, b) => a.sort_order - b.sort_order)
  const maths = sorted.filter(r => r.subject === 'maths')
  const rest = sorted.filter(r => r.subject !== 'maths')
  const leadRow = maths.length ? maths[(weekOfTerm - 1) % maths.length] : rest[(weekOfTerm - 1) % Math.max(1, rest.length)]
  if (!leadRow) return null
  const secondRow = maths.length && rest.length ? rest[(weekOfTerm - 1) % rest.length] : null

  const { lead, parts } = splitObjective(leadRow.objective)
  return {
    yearGroup: target.yearGroup,
    term: target.term,
    preview,
    weekOfTerm,
    subjectLabel: SUBJECT_LABEL[leadRow.subject] ?? leadRow.subject,
    strand: leadRow.strand,
    lead,
    parts,
    second: secondRow
      ? { subjectLabel: SUBJECT_LABEL[secondRow.subject] ?? secondRow.subject, strand: secondRow.strand, lead: splitObjective(secondRow.objective).lead }
      : null,
    questTitle: questTitleFrom(lead),
  }
}

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

/**
 * The brief for one child, or null: no birthday, outside Years 1 to 6, or a
 * read failure all mean no brief rather than a guess, the same rule as every
 * curriculum surface.
 */
export async function getWeekBrief(
  supabase: Client,
  dateOfBirth: string | null | undefined,
  on: Date = new Date(),
): Promise<WeekBrief | null> {
  if (!dateOfBirth) return null
  const birth = new Date(`${String(dateOfBirth).slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(birth.getTime())) return null
  const placed = weekTargetFor(birth, on)
  if (!placed) return null

  const { data, error } = await supabase
    .from('curriculum_objectives')
    .select('subject, strand, objective, sort_order')
    .eq('curriculum', CURRICULUM)
    .eq('year_group', placed.target.yearGroup)
    .in('term', [placed.target.term, 'all'])
    .order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return null

  return pickWeekBrief(data as ObjectiveRowLite[], placed.target, placed.weekOfTerm, placed.preview)
}
