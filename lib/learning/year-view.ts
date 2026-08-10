import { sheetTarget, sheetLabel, MIN_YEAR, MAX_YEAR, type SheetTarget } from './term'
import { yearGroupFromDob, nextEvent, aroundWhen, type UpcomingEvent } from './calendar'
import { transitionFor, type TransitionState } from './transition'

// What your child is learning, assembled for one child.
//
// Justin: "can we also analyse why we collected all the school curriculum data
// and how we are using it? It was a lot of data and if I am not sure what it
// does then parents will not either."
//
// He was right to ask, and the honest answer at the time was uncomfortable. We
// hold 448 statutory objectives, seeded across three migrations, and they
// reached a parent through exactly ONE screen: a homework decoder you had to
// know existed and paste homework into. The learning sheet that uses the same
// rows was linked from nowhere at all. So the data was doing almost nothing a
// parent could see, which is precisely why he could not tell what it was for.
//
// This is the front door it never had. One page that answers, without being
// asked anything: what year are they in, what are they being taught this term,
// what is coming up at school, and what happens next.
//
// ── The rule this inherits, and must not break ──────────────────────────────
//
// No birthday means we show NOTHING. Never a guess, never the nearest year,
// never an average child. It is the rule on every curriculum surface we have,
// and it exists because a parent acts on what this says: tell them their Year 3
// child should know their four times table when the child is in Year 2 and you
// have invented a problem in a family that did not have one.
//
// So the empty state is not an afterthought here. Plenty of families have not
// filled in a birthday, and for them this page is only the ask.
//
// ── Never a comparison, never a verdict ─────────────────────────────────────
//
// This says what a school is teaching. It does NOT say whether a child is
// keeping up, and there is no score anywhere in it. We hold no assessment data
// and could not answer that question honestly if we tried, and a parent handed
// a number they cannot check will believe it. The wording is always "this is
// what the class is working on", which is true, useful, and not a judgement of
// anybody's child.

export type Strand = {
  strand: string
  objectives: { id: string; objective: string; verbatim: boolean; lead: string; parts: string[] }[]
}

/**
 * Break a statutory objective into its lead and its sub points.
 *
 * The Department writes the long ones as one sentence ending "by:" followed by
 * six or seven clauses separated by semicolons. Verbatim that is a wall: the
 * Year 4 reading comprehension objective is 90 words in a single bullet, and a
 * parent skims straight past the only part they wanted.
 *
 * Splitting on the semicolons is presentation, not editing. Every word survives
 * in its original order, which is the rule everywhere we show this data: quote,
 * never paraphrase. We are laying out their sentence the way a school would on
 * a worksheet, and a reader can still see it is one objective because the lead
 * keeps its colon.
 *
 * Anything without that shape comes back as a lead and no parts, so short
 * objectives are untouched.
 */
export function splitObjective(text: string): { lead: string; parts: string[] } {
  const at = text.indexOf(': ')
  // Needs both a colon introducing a list AND real semicolons after it. A
  // stray colon inside a short objective must not turn it into a heading with
  // nothing under it.
  if (at === -1 || !text.slice(at).includes('; ')) return { lead: text, parts: [] }
  const lead = text.slice(0, at + 1)
  const parts = text.slice(at + 1)
    .split(';')
    .map(s => s.trim())
    .filter(Boolean)
  // One part is not a list, it is a sentence with a colon in it.
  if (parts.length < 2) return { lead: text, parts: [] }
  return { lead, parts }
}

export type SubjectBlock = {
  subject: string
  /** What a parent calls it. */
  label: string
  strands: Strand[]
  count: number
}

export type YearView = {
  childId: string
  childName: string
  /** Null when we have no birthday, which is the one thing that hides everything. */
  yearGroup: number | null
  /** Null outside Years 1 to 6, where we hold no objectives. */
  target: SheetTarget | null
  /** "Year 4, Spring term", or the looking back wording in August. */
  label: string | null
  subjects: SubjectBlock[]
  /** The one school thing worth mentioning now, or null. */
  event: UpcomingEvent | null
  eventWhen: string | null
  /** Live only in the Year 6 to Year 7 window. */
  transition: TransitionState | null
  /** Why there is nothing to show, when there is nothing to show. */
  blocked: 'no_birthday' | 'too_young' | 'secondary' | null
}

const SUBJECT_LABEL: Record<string, string> = {
  maths: 'Maths',
  english: 'English, writing and grammar',
  reading: 'Reading',
}

// Reading before writing, because that is the order a parent thinks in and the
// order the two are taught in. Maths last only because it is the longest.
const SUBJECT_ORDER = ['reading', 'english', 'maths']

type Client = Pick<import('@supabase/supabase-js').SupabaseClient, 'from'>

export type ObjectiveRow = {
  id: string
  subject: string
  strand: string
  objective: string
  verbatim: boolean
  sort_order: number
}

/**
 * Group the flat objective rows into subjects and strands, in a stable order.
 *
 * Pure, so the grouping can be tested without a database, and because this is
 * the part where a silent mistake would show a parent another year's work.
 */
export function groupObjectives(rows: ObjectiveRow[]): SubjectBlock[] {
  const bySubject = new Map<string, Map<string, ObjectiveRow[]>>()
  for (const r of rows) {
    if (!bySubject.has(r.subject)) bySubject.set(r.subject, new Map())
    const strands = bySubject.get(r.subject)!
    if (!strands.has(r.strand)) strands.set(r.strand, [])
    strands.get(r.strand)!.push(r)
  }

  const out: SubjectBlock[] = []
  for (const subject of SUBJECT_ORDER) {
    const strands = bySubject.get(subject)
    if (!strands) continue
    const blocks: Strand[] = [...strands.entries()].map(([strand, items]) => ({
      strand,
      objectives: items
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(o => ({ id: o.id, objective: o.objective, verbatim: o.verbatim, ...splitObjective(o.objective) })),
    }))
    out.push({
      subject,
      label: SUBJECT_LABEL[subject] ?? subject,
      strands: blocks,
      count: blocks.reduce((n, b) => n + b.objectives.length, 0),
    })
  }
  // Any subject we have not named yet still shows, rather than silently
  // vanishing because someone seeded a fourth one.
  for (const [subject, strands] of bySubject) {
    if (SUBJECT_ORDER.includes(subject)) continue
    const blocks: Strand[] = [...strands.entries()].map(([strand, items]) => ({
      strand,
      objectives: items.slice().sort((a, b) => a.sort_order - b.sort_order)
        .map(o => ({ id: o.id, objective: o.objective, verbatim: o.verbatim, ...splitObjective(o.objective) })),
    }))
    out.push({ subject, label: SUBJECT_LABEL[subject] ?? subject, strands: blocks, count: blocks.reduce((n, b) => n + b.objectives.length, 0) })
  }
  return out
}

/**
 * Everything this page needs for one child.
 *
 * Reads nothing about the child's performance, because we hold none. The only
 * per child input is the birthday.
 */
export async function buildYearView(
  supabase: Client,
  child: { id: string; name: string; date_of_birth?: string | null },
  on: Date = new Date(),
): Promise<YearView> {
  const base: YearView = {
    childId: child.id,
    childName: child.name,
    yearGroup: null, target: null, label: null,
    subjects: [], event: null, eventWhen: null, transition: null,
    blocked: 'no_birthday',
  }

  const yearGroup = yearGroupFromDob(child.date_of_birth, on)
  if (yearGroup === null) return base

  // The secondary transition is worked out first and independently, because it
  // is the one thing that must still speak once a child is past Year 6 and the
  // objectives have run out.
  const transition = transitionFor(child.date_of_birth ?? null, on)
  const event = nextEvent(yearGroup, on)

  const withYear: YearView = {
    ...base,
    yearGroup,
    event,
    eventWhen: event ? aroundWhen(event) : null,
    transition,
    blocked: null,
  }

  if (yearGroup < MIN_YEAR) return { ...withYear, blocked: 'too_young' }
  if (yearGroup > MAX_YEAR) return { ...withYear, blocked: 'secondary' }

  const birth = new Date(`${String(child.date_of_birth).slice(0, 10)}T00:00:00Z`)
  const target = sheetTarget(birth, on)
  if (!target) return { ...withYear, blocked: 'secondary' }

  // English and reading are written per year rather than per term, so they
  // carry term 'all'. Asking for the current term alone would return maths only
  // and quietly tell a parent their child does no English this term.
  const { data, error } = await supabase
    .from('curriculum_objectives')
    .select('id, subject, strand, objective, verbatim, sort_order')
    .eq('curriculum', 'england')
    .eq('year_group', target.yearGroup)
    .in('term', [target.term, 'all'])
    .order('sort_order', { ascending: true })

  // A read failure shows the year and the school dates without the objectives,
  // rather than an error page. The calendar half is still worth having.
  if (error || !data) return { ...withYear, target, label: sheetLabel(target) }

  return {
    ...withYear,
    target,
    label: sheetLabel(target),
    subjects: groupObjectives(data as ObjectiveRow[]),
  }
}

/**
 * The one line under the heading, in plain words.
 *
 * Deliberately says "the class", never "your child". We know what a Year 4 in
 * England is taught. We do not know what this particular child has understood,
 * and the sentence has to be honest about which of those two it is.
 */
export function yearBlurb(v: YearView): string {
  if (v.blocked === 'no_birthday') {
    return 'Add their birthday and this fills in with the actual objectives their class is working through this term.'
  }
  if (v.blocked === 'too_young') {
    return 'Nursery and Reception work to the early years framework rather than the national curriculum, so there is no term by term list to show yet. This page fills in when they reach Year 1.'
  }
  if (v.blocked === 'secondary') {
    return 'The national curriculum sets out primary years one to six in this kind of detail. Secondary is set by the school, so from here the useful thing is what changes rather than what is on the list.'
  }
  if (v.target?.lookingBack) {
    return 'School is out, so this is the year they have just finished rather than the one starting in September. Nothing here is new to them.'
  }
  return 'This is what schools in England are asked to teach this term. It is the class list, not a checklist for your child, and there is no score anywhere in it.'
}
