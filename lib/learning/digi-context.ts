import { createAdminClient } from '@/lib/supabase/admin'
import { sheetTarget, sheetLabel, type SheetTarget } from '@/lib/learning/term'
import { nextEvent, aroundWhen, type SchoolEventKey } from '@/lib/learning/calendar'

// What DiGi is allowed to say about where a child is at school.
//
// This is deliberately a small, guarded lookup rather than a dump of the
// curriculum into the prompt. 448 objectives in a system prompt would cost a
// fortune, bury the parenting guidance under a wall of statutory text, and
// still leave DiGi free to paraphrase it into something plausible and wrong.
// Instead we fetch only the objectives for the one child, the one subject and
// the one term, and hand them over as quotable lines with their source.
//
// ── The rules that travel with the facts ─────────────────────────────────────
//
// Three of them, and they are the whole reason this file has an opinion.
//
// ONE. Never tell a parent their child is behind. We do not have the evidence
// for it and it is not a thing we do. The curriculum says what a year covers,
// not where one child sits inside it, and a sheet nobody has filled in tells us
// nothing at all. Anything stronger than "this is what the year covers" is DiGi
// inventing an assessment.
//
// TWO. Quote, never paraphrase. Every row carries `verbatim` and `source` for
// exactly this. If DiGi is going to say "the curriculum says", the words after
// it have to be the published words. Where it wants to explain in plainer
// language it has to say that it is doing so.
//
// THREE. The term is ours, not the law's. The programmes of study are set out
// year by year and say nothing about terms, so DiGi must never tell a parent
// their school is teaching this now. It can say the year covers it. Reading and
// writing carry the term 'all' precisely because there is no honest term for
// them.
//
// ── Why the time of year matters ─────────────────────────────────────────────
//
// Parental worry about school is seasonal and sharp. It spikes in September
// when a new year starts and nobody knows what is expected, and again in the
// weeks before a statutory check. Those are the moments where naming the actual
// expectation is worth more than any amount of reassurance, so the season comes
// back with the objectives and DiGi can lead with it.

export type CurriculumLine = { objective: string; strand: string; source: string }

// Is this parent asking about school, and if so about what? Deliberately a
// keyword match rather than a model call: it runs on every message, it has to
// be instant and free, and being wrong is cheap in one direction only. A missed
// question just means DiGi answers without the curriculum, which is how it
// behaved yesterday. A false positive would waste a query and add a block of
// statutory text to a conversation about bedtime, so the words here are ones
// that rarely turn up in a screen time question by accident.
//
// Reading is checked before english because "reading" is the word a parent
// actually uses, and it is its own tab.
const SUBJECT_WORDS: Array<[('maths' | 'english' | 'reading'), RegExp]> = [
  ['reading', /\b(reading|read to|reads?|phonics|decoding|book band|comprehension)\b/i],
  ['maths', /\b(maths|math|number|times table|multiplication|division|fractions?|arithmetic|sums?|counting|numeracy)\b/i],
  ['english', /\b(english|writing|spelling|spell|handwriting|grammar|punctuation|literacy|vocabulary)\b/i],
]

// A school flavoured question, not just any mention of a subject word. Both
// halves have to be present, so "he keeps reading on his tablet at midnight"
// does not pull in the Year 4 reading curriculum.
const SCHOOL_WORDS = /\b(school|teacher|class|classroom|year [1-6]|yr ?[1-6]|homework|curriculum|sats?|behind|struggling|keeping up|falling behind|report|parents evening|expected|learning|study|studying|revis)/i

export function schoolSubjectFor(message: string): 'maths' | 'english' | 'reading' | null {
  if (!SCHOOL_WORDS.test(message)) return null
  for (const [subject, re] of SUBJECT_WORDS) if (re.test(message)) return subject
  // School is clearly the topic but no subject named. Maths is the safest
  // default: it is the one with term by term sequencing and the one carrying
  // the statutory check parents actually ask about.
  return 'maths'
}

export type LearningContext = {
  childName: string
  target: SheetTarget
  label: string
  season: Season
  // The statutory lines for this child's year, for the subject asked about.
  lines: CurriculumLine[]
  // Objectives this child has actually flagged as tricky, most recent first.
  // This is the only genuinely personal thing here, and the only thing that
  // justifies a specific answer rather than a general one.
  tricky: CurriculumLine[]
}

export type Season = {
  key: SchoolEventKey | 'ordinary'
  // One line DiGi can lead with, if it fits what the parent actually asked.
  note: string
}

// What time of year it is for this child, read from the one school calendar in
// lib/learning/calendar.ts rather than from its own copy of the months.
//
// This used to be a second, thinner list of the same dates written by month, and
// two lists of the same facts is one list waiting to disagree with the other. The
// calendar knows its own lead times, so a Year 6 parent now hears about the 31
// October application deadline as well, which the month version missed entirely
// and which is the only genuinely immovable date in primary school.
export function seasonFor(yearGroup: number, on: Date): Season {
  const next = nextEvent(yearGroup, on)
  if (!next) return { key: 'ordinary', note: '' }
  const when = aroundWhen(next)
  const timing = next.phase === 'this_week' ? 'is this week' : `is coming, ${when}`
  return {
    key: next.event.key,
    note: `${next.event.title} ${timing}. ${next.event.what}`,
  }
}

// The instruction block that travels with the facts. Written as rules for DiGi
// rather than as prose for a parent.
export function learningRules(ctx: LearningContext): string {
  return [
    `SCHOOL CONTEXT for ${ctx.childName}: ${ctx.label}.`,
    ctx.season.note ? `Time of year: ${ctx.season.note}` : '',
    '',
    'Rules for using this, all three of which matter more than being helpful:',
    '1. Never say or imply the child is behind, ahead, or at any level. You have no assessment. You know what the school year covers, nothing about where this child sits in it.',
    '2. If you quote the curriculum, use the exact wording below and nothing else. If you put it in plainer words, say that you are doing so.',
    '3. Never say the school is teaching this now. The curriculum is set out by year, not by term. Which term a topic falls in is our own ordering and may not match their school.',
    '',
    ctx.tricky.length
      ? `${ctx.childName} has flagged these as tricky on a learning sheet, which is the child's own honest word and the best thing to work from:\n` +
        ctx.tricky.map(t => `- ${t.objective}`).join('\n')
      : `${ctx.childName} has not flagged anything as tricky yet.`,
    '',
    'What the year covers:',
    ...ctx.lines.map(l => `- [${l.strand}] ${l.objective}`),
    '',
    `Source for every line above: ${ctx.lines[0]?.source ?? 'National curriculum in England'}.`,
  ].filter(Boolean).join('\n')
}

// Fetch the context for one child. Returns null whenever we cannot be certain,
// which is the point: no birthday, an age outside years 1 to 6, or nothing in
// the curriculum map for that year all mean DiGi gets no school context at all
// rather than a guess.
export async function learningContextFor(
  userId: string,
  subject: 'maths' | 'english' | 'reading',
  on = new Date(),
): Promise<LearningContext | null> {
  const admin = createAdminClient()

  const { data: kid } = await admin
    .from('children')
    .select('id, name, date_of_birth')
    .eq('parent_id', userId)
    .order('is_primary', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!kid?.date_of_birth) return null

  const target = sheetTarget(new Date(`${String(kid.date_of_birth).slice(0, 10)}T00:00:00Z`), on)
  if (!target) return null

  const { data: rows } = await admin
    .from('curriculum_objectives')
    .select('id, strand, objective, source')
    .eq('curriculum', 'england')
    .eq('year_group', target.yearGroup)
    .eq('subject', subject)
    .in('term', [target.term, 'all'])
    .order('sort_order', { ascending: true })

  const lines: CurriculumLine[] = (rows ?? []).map(r => ({
    objective: r.objective as string, strand: r.strand as string, source: r.source as string,
  }))
  if (lines.length === 0) return null

  // What this child has said they found hard. Ids only ever resolve against the
  // curriculum table, so a flag can never turn into free text we made up.
  const { data: results } = await admin
    .from('learning_sheet_results')
    .select('tricky')
    .eq('child_id', kid.id)
    .order('completed_at', { ascending: false })
    .limit(5)

  const ids = [...new Set((results ?? []).flatMap(r => (r.tricky as string[]) ?? []))].slice(0, 20)
  let tricky: CurriculumLine[] = []
  if (ids.length) {
    const { data: t } = await admin
      .from('curriculum_objectives')
      .select('strand, objective, source')
      .in('id', ids)
    tricky = (t ?? []).map(r => ({
      objective: r.objective as string, strand: r.strand as string, source: r.source as string,
    }))
  }

  return {
    childName: kid.name && kid.name !== 'Your child' ? String(kid.name) : 'your child',
    target,
    label: sheetLabel(target),
    season: seasonFor(target.yearGroup, on),
    lines,
    tricky,
  }
}
