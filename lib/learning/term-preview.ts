import type { SupabaseClient } from '@supabase/supabase-js'
import { nextTermTarget, sheetLabel } from '@/lib/learning/term'
import { groupObjectives, type ObjectiveRow } from '@/lib/learning/year-view'
import { isSchoolHoliday, type Region } from '@/lib/learning/holidays'

// What is coming next term, in three lines.
//
// Justin, 10 August 2026: "could we add a diary entry to give a preview note for
// term what's coming up and what the child could be learning? I need a way for
// this to be put onto platform but in the most useful meaningful way." Asked
// which shape, he chose three subjects with one line each.
//
// ── The data was already here ────────────────────────────────────────────────
//
// nextTermTarget has worked out the next term and year group since the homework
// page shipped, and gets the awkward case right: a half term is not a new term,
// so it returns the term the child is already IN rather than showing work months
// away. curriculum_objectives has been seeded all along.
//
// What was missing was anybody seeing it. The parent had no preview anywhere,
// and the child only got one by opening the homework page during a holiday. So
// this is a reader, not a new source of truth.
//
// ── Why a strand list and not a summary ──────────────────────────────────────
//
// The line under each subject is its STRAND NAMES for that term, joined. Not an
// objective, and not a paraphrase of one. The strands are what the class is
// actually taught, they are the Department's own words, and they fit on a phone.
//
// The alternative was summarising the objectives with a model, which would put a
// paraphrase of statutory curriculum text in front of a parent as though it were
// the curriculum. Everywhere else this data appears the rule is quote, never
// paraphrase. A preview is not a good enough reason to break it.

export type TermPreviewSubject = {
  label: string
  /** The strand names for this subject this term, joined into one line. */
  line: string
  /** One thing to do at home. Hand written per subject, never generated. */
  tryThis: string
}

export type TermPreview = {
  /** "Year 4, Spring term". */
  label: string
  yearGroup: number
  /** True while they are off, false in the first week back. */
  inHoliday: boolean
  subjects: TermPreviewSubject[]
}

// One line per subject, written rather than generated.
//
// Deliberately things that need nothing bought and no adult sitting down for an
// hour. A suggestion a family cannot act on today is a suggestion that teaches
// them to skip the card.
// Three subjects, because three subjects is all we hold: 228 maths, 165 english
// and 55 reading objectives, and nothing else. Science, history and geography
// were in an earlier draft of this map and were quietly dishonest, promising
// lines for subjects that can never appear.
const TRY_AT_HOME: Record<string, string> = {
  maths: 'Count something real together. Change, ingredients, or the minutes until tea.',
  english: 'Read the same book they are reading and ask them what they think happens next.',
  reading: 'Ask them to tell you what happened, then what they think happens next.',
}

const FALLBACK_TRY = 'Ask them to tell you one thing they learned, and one thing they did not get.'

/**
 * Is a preview worth showing today?
 *
 * A school holiday, or the first seven days back.
 *
 * NOT "the last fortnight of term", which is what this was first sketched as.
 * We hold whether a day is a holiday and nothing else, so a fortnight before the
 * end of term cannot be worked out without inventing a school calendar we do not
 * have. Guessing it would put a wrong date in front of a parent, which is worse
 * than showing the card slightly later.
 *
 * The holiday is the honest moment anyway: "what are they doing next term" is a
 * holiday question, and the first week back is when a parent wants to recognise
 * what the child comes home talking about.
 */
export function previewWindow(on: Date, region: Region = 'uk'): { show: boolean; inHoliday: boolean } {
  if (isSchoolHoliday(on, region)) return { show: true, inHoliday: true }
  // Any holiday day in the last week means they have just gone back.
  for (let back = 1; back <= 7; back++) {
    const d = new Date(on)
    d.setUTCDate(d.getUTCDate() - back)
    if (isSchoolHoliday(d, region)) return { show: true, inHoliday: false }
  }
  return { show: false, inHoliday: false }
}

/**
 * The preview for one child, or null when there is nothing honest to show.
 *
 * Null rather than an empty shell in every one of these cases: outside the
 * window, no birthday, outside Years 1 to 6 where we hold no objectives, or a
 * read that failed. A card that appears to explain its own emptiness is worse
 * than no card.
 */
export async function buildTermPreview(
  supabase: SupabaseClient,
  child: { date_of_birth?: string | null } | null,
  on: Date = new Date(),
  region: Region = 'uk',
): Promise<TermPreview | null> {
  if (!child?.date_of_birth) return null

  const window = previewWindow(on, region)
  if (!window.show) return null

  const birth = new Date(`${String(child.date_of_birth).slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(birth.getTime())) return null

  const target = nextTermTarget(birth, on)
  if (!target) return null

  // English and reading are written per year rather than per term, so 'all' has
  // to come along or a parent is told their child does no English next term.
  const { data, error } = await supabase
    .from('curriculum_objectives')
    .select('id, subject, strand, objective, verbatim, sort_order')
    .eq('curriculum', 'england')
    .eq('year_group', target.yearGroup)
    .in('term', [target.term, 'all'])
    .order('sort_order', { ascending: true })

  if (error || !data || data.length === 0) return null

  const subjects = groupObjectives(data as ObjectiveRow[])
    // Three. The whole point of the shape Justin chose: a parent reads three
    // lines, and a full list of every objective is a syllabus nobody opens.
    .slice(0, 3)
    .map(s => ({
      label: s.label,
      // Up to three strands, which is where a subject stops being a line and
      // starts being a list.
      line: joinStrands(s.strands.map(x => x.strand).slice(0, 3)),
      tryThis: TRY_AT_HOME[s.subject] ?? FALLBACK_TRY,
    }))
    .filter(s => s.line.length > 0)

  if (subjects.length === 0) return null

  return {
    label: sheetLabel(target),
    yearGroup: target.yearGroup,
    inHoliday: window.inHoliday,
    subjects,
  }
}

/**
 * "Number and place value, addition and subtraction, multiplication and division"
 *
 * COMMAS ONLY, no "and" before the last one, which looks wrong written down and
 * is right here. Strand names in the England curriculum contain their own "and"
 * ("Addition and subtraction", "Vocabulary, grammar and punctuation"), so a
 * final "and" produced "addition and subtraction and multiplication and
 * division" and a parent could not tell where one topic ended and the next
 * began. Seen on the fixture at 390px before it went anywhere near a family.
 *
 * Case is left exactly as the curriculum writes it. Lowercasing the later items
 * would read more smoothly and would quietly mangle any strand that begins with
 * a proper noun, and quoting rather than editing is the rule for this data.
 */
function joinStrands(strands: string[]): string {
  return strands.map(s => s.trim()).filter(Boolean).join(', ')
}

/**
 * Is the parent asking what is coming, rather than what is happening now?
 *
 * Kept narrow on purpose. This gates an extra database read on every DiGi
 * message, so it only fires on a question that is genuinely about the future of
 * school. "What is he doing in maths" is a different question and the existing
 * learningContextFor already answers it.
 */
export function asksAboutNextTerm(message: string): boolean {
  const m = message.toLowerCase()
  const future = /\b(next term|new term|next year|going back|goes back|back to school|new year group|next year group|coming up|what will (?:they|he|she) be (?:doing|learning)|start(?:ing)? year \d)\b/.test(m)
  if (!future) return false
  // And it has to be about school rather than, say, a phone next year.
  return /\b(school|term|class|teacher|year|learn|learning|taught|curriculum|maths|english|science)\b/.test(m)
}

/** The preview as a line of DiGi context. Empty when there is nothing to say. */
export function previewRules(preview: TermPreview, childName?: string | null): string {
  const who = childName && childName !== 'Your child' ? childName : 'their child'
  const lines = preview.subjects.map(s => `- ${s.label}: ${s.line}`).join('\n')
  return [
    `WHAT ${who.toUpperCase()} MEETS NEXT AT SCHOOL (${preview.label}), from the England curriculum:`,
    lines,
    'Use this when the parent asks what is coming. Name the subjects and the topics as written above, because those are the curriculum\'s own words. Say "the class", never "your child": we know what this year group is taught and we do not know what this child has understood. Never imply anything about how they are doing, we hold no such data. Do not list every objective, three topics is the useful answer.',
  ].join('\n')
}
