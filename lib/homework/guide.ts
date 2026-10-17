// How much homework is normal, by school year, for the PARENT (17 October 2026).
//
// Justin: help "when parent is not sure what level of homework the child should
// have and if child is communicating what should be fine compare with the
// school advice". The only guide we had was minutesGuide in ./help.ts, which is
// written to the child ("at your age"), goes by age rather than school year,
// and cites nothing. This is the parent's version, by year group, because that
// is how schools set homework.
//
// ── WHERE THE NUMBERS COME FROM ─────────────────────────────────────────────
//
// England has had no national homework rule since 2012, when the 1998 DfE
// guidelines were withdrawn and the decision went to each headteacher. So
// these are not a rule. They are what school homework policies commonly
// publish now, sampled on 17 October 2026 (Crook Primary, Whitehall Primary,
// Belvedere Academy, Bishop Luffa 2025/26), read against the 1998 figures they
// still echo (Y1 to Y2 an hour a week, Y3 to Y4 an hour and a half a week,
// Y5 to Y6 half an hour a night). Sources and the full sweep are in
// plans/2026-10-17-at-school-homework-plan.md and the PR.
//
// The page says the school's own policy wins, every time, because it does.
//
// ── WHY A RANGE AND NEVER A TARGET ──────────────────────────────────────────
//
// Homework helps secondary pupils more than primary ones, and more time stops
// helping (Cooper, Robinson and Patall 2006; EEF Toolkit). A parent shown a
// number to hit will push for it. A parent shown a normal range relaxes when
// they are inside it, which is the whole job of this card.
//
// Pure, no imports, so a guard can load it.

export type HomeworkBand = {
  /** "Reception", "Year 4", "Year 10". */
  yearLabel: string
  /** The bottom and top of a normal night, in minutes, reading included. */
  low: number
  high: number
  /** Past this, it is more than most schools ask for this year. */
  aLot: number
  /** What a normal night is made of, said the way a school would. */
  kind: string
  /** Primary or secondary, which changes the advice more than the minutes do. */
  phase: 'early' | 'primary' | 'secondary'
}

const BANDS: { from: number; to: number; band: Omit<HomeworkBand, 'yearLabel'> }[] = [
  { from: 0, to: 0, band: { low: 5, high: 10, aLot: 20, kind: 'reading together and a few sounds or tricky words', phase: 'early' } },
  { from: 1, to: 2, band: { low: 10, high: 20, aLot: 30, kind: 'reading every night, plus weekly spellings', phase: 'primary' } },
  { from: 3, to: 4, band: { low: 15, high: 25, aLot: 40, kind: 'reading, times tables and spellings', phase: 'primary' } },
  { from: 5, to: 6, band: { low: 20, high: 30, aLot: 45, kind: 'reading, times tables, spellings and a weekly task', phase: 'primary' } },
  { from: 7, to: 8, band: { low: 40, high: 60, aLot: 90, kind: 'two or three subjects a night, often on a school app', phase: 'secondary' } },
  { from: 9, to: 9, band: { low: 60, high: 90, aLot: 120, kind: 'two or three subjects a night', phase: 'secondary' } },
  { from: 10, to: 13, band: { low: 60, high: 90, aLot: 150, kind: 'GCSE or sixth form work, plus revision as exams get closer', phase: 'secondary' } },
]

/** The normal band for a school year (0 is Reception), or null when we cannot place them. */
export function homeworkBand(yearGroup: number | null | undefined): HomeworkBand | null {
  if (yearGroup === null || yearGroup === undefined) return null
  const row = BANDS.find(b => yearGroup >= b.from && yearGroup <= b.to)
  if (!row) return null
  return { ...row.band, yearLabel: yearGroup === 0 ? 'Reception' : `Year ${yearGroup}` }
}

/** What the child says they have tonight, as the parent would hear it. */
export type ChildSays = 'none' | 'little' | 'some' | 'lots' | 'hours' | 'tears'

export const CHILD_SAYS: { key: ChildSays; label: string }[] = [
  // Short enough that each fits its chip on one line in a three across grid
  // on a 390 phone, tick included.
  { key: 'none', label: 'None' },
  { key: 'little', label: 'A bit' },
  { key: 'some', label: '30 min' },
  { key: 'lots', label: '1 hour' },
  { key: 'hours', label: 'Hours' },
  { key: 'tears', label: 'Tears' },
]

/** Minutes each answer stands for, to place the marker on the bar. */
export const SAYS_MINUTES: Record<ChildSays, number> = {
  none: 0, little: 10, some: 30, lots: 60, hours: 120, tears: 0,
}

export type Verdict = {
  /** Where it lands: fine, check, or talk to school. Drives the colour. */
  tone: 'fine' | 'check' | 'stop'
  title: string
  line: string
}

/**
 * The one sentence a parent needs after saying what they were told. Built on
 * the research: show me rather than tell me (Bergman 2017 found the portal
 * goes unread, so the look has to be together), stop when it is too much
 * (autonomy support over pressure, Patall 2008, Xu 2024), and the teacher is
 * the person to fix a level that is wrong.
 */
export function verdictFor(says: ChildSays, band: HomeworkBand, name: string): Verdict {
  const who = name && name !== 'your child' ? name : 'they'
  if (says === 'tears') {
    return {
      tone: 'stop',
      title: 'Stop for tonight',
      line: `Tears mean the level or the length is wrong, not ${who}. Write one line in the planner or reading record so the teacher knows. That sorts most of these.`,
    }
  }
  if (says === 'none') {
    return band.phase === 'secondary'
      ? { tone: 'check', title: 'Worth a look together', line: `It can be true. Ask ${who} to show you on the school's homework app rather than tell you. If it is empty two weeks running, a short note to the form tutor settles it.` }
      : { tone: 'fine', title: 'Fine some nights', line: `Reading still counts. ${band.low} minutes with a book is the homework most schools ask for every night in ${band.yearLabel}.` }
  }
  const mins = SAYS_MINUTES[says]
  if (mins > band.aLot) {
    return {
      tone: 'stop',
      title: `More than most schools ask for ${band.yearLabel}`,
      line: `It is fine to stop at about ${band.high} minutes and write a line to the teacher. Their policy is the one that counts, and teachers want to know.`,
    }
  }
  if (mins < band.low) {
    return {
      tone: 'fine',
      title: 'On the light side, which is fine',
      line: `If it is light every night for a week, have a look at it together. One night tells you nothing.`,
    }
  }
  return {
    tone: 'fine',
    title: `About right for ${band.yearLabel}`,
    line: band.phase === 'secondary'
      ? `Let ${who} plan it. Your job is the quiet space and the phone in another room, not the answers.`
      : `Sit nearby rather than alongside. Ask what the teacher wants, then let ${who} have a go first.`,
  }
}

/**
 * Three ways to help tonight, by phase. The evidence says HOW a parent helps
 * matters more than how much: supporting the child's own effort helps, taking
 * over does not (Patall, Cooper and Robinson 2008; Xu et al. 2024; EEF parental
 * engagement guidance).
 */
export function helpMoves(phase: HomeworkBand['phase']): string[] {
  if (phase === 'secondary') {
    return [
      'Same time, same place, phone in another room.',
      'Ask "what is due and when?" on Sunday, not every night.',
      'Help them start, then step back. Stuck after ten minutes is a question for the teacher.',
    ]
  }
  if (phase === 'early') {
    return [
      'Read together for five minutes and stop while it is still fun.',
      'Point at words and let them have a go first.',
      'Praise the trying, not the getting it right.',
    ]
  }
  return [
    'Short and early: before screens, not after tea.',
    'Ask "what does your teacher want?" before anything else.',
    'Let them try first. Show the method on a different example, never on theirs.',
  ]
}
