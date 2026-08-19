// The passport timeline: what needs doing and when, as a rhythm.
//
// Justin, 18 August 2026: "we need a timeline that fits in with stage of child
// development and that it leads through that, checking on track and letting
// them know what needs to be done and when."
//
// ── WHY A RHYTHM AND NEVER A DATE ───────────────────────────────────────────
//
// Nothing in this product expires. contentComplete (lib/pathway/progress.ts)
// carries no date filter: finish the Foundation scripts when the child is
// fourteen and the stamp lands that day. So any deadline we printed would be a
// thing the code does not believe, and a countdown on a twelve year journey is
// a source of guilt, not motivation. The one thing that IS real is the
// birthday that ends the stage, so the honest sentence is a PACE: items left
// against weeks left, said as one a week, one a fortnight, one a month.
//
// The tone rules are PassportToDo's, which is the surface this feeds: sage
// not red, no rush said out loud, and a family that is behind is told the
// truth WITH the way it still works out, never a red X.
//
// ── THE EXIT BIRTHDAYS, AND DO NOT TIDY THEM TO THE LABELS ──────────────────
//
// lib/children/age.ts bandForYears is the authority: Foundation ends on the
// 8th birthday, Builder the 11th, Explorer the 13th, Shaper the 16th,
// Independent never. That makes Explorer TWO years (11 and 12), whatever the
// stage's ages label says; the label is being fixed to match, not the other
// way round. A later session that "corrects" these numbers from the copy will
// reintroduce a wrong pace for every Explorer family.

export type StagePace =
  /** Nothing left. The page is full. */
  | { kind: 'stamped' }
  /** Three or fewer left: name the count, drop the rhythm. */
  | { kind: 'few'; left: number }
  /** Stage 5 has no exit birthday, so there is no clock at all. */
  | { kind: 'open'; left: number }
  /** No usable birthday on record: a count, honestly without a when. */
  | { kind: 'unknown'; left: number }
  /** The birthday has passed; the page stays open, catch up pace. */
  | { kind: 'past'; left: number }
  /** Comfortable: the rhythm that fills the page in time, with slack. */
  | { kind: 'month' | 'fortnight' | 'week'; left: number; weeksLeft: number }
  /** More items than weeks at one a week: say the measurement, never a
   *  prediction, and say the page never closes. */
  | { kind: 'beyond'; left: number; weeksLeft: number }

/** The birthday that ends each stage, from bandForYears. Null is never. */
const EXIT_AGE: Record<number, number | null> = { 1: 8, 2: 11, 3: 13, 4: 16, 5: null }

/** Whole weeks from now until the child turns `exitAge`. Negative when past. */
export function weeksUntilExit(dob: Date, exitAge: number, now: Date = new Date()): number {
  const exit = new Date(Date.UTC(dob.getUTCFullYear() + exitAge, dob.getUTCMonth(), dob.getUTCDate()))
  return Math.floor((exit.getTime() - now.getTime()) / (7 * 86400000))
}

export function stagePace(
  stageNum: number,
  /** Items left: lessons plus scripts remaining, the two the stamp counts. */
  left: number,
  /** date_of_birth, or null when the family never gave one. */
  dob: Date | null,
  now: Date = new Date(),
): StagePace {
  if (left <= 0) return { kind: 'stamped' }
  if (left <= 3) return { kind: 'few', left }
  const exitAge = EXIT_AGE[stageNum] ?? null
  if (exitAge === null) return { kind: 'open', left }
  if (!dob || Number.isNaN(dob.getTime())) return { kind: 'unknown', left }
  const weeksLeft = weeksUntilExit(dob, exitAge, now)
  if (weeksLeft <= 0) return { kind: 'past', left }
  // Each threshold is the number of weeks that rhythm consumes per item, so a
  // stated rhythm always genuinely fills the page in the time that is left.
  if (weeksLeft >= left * 4.33) return { kind: 'month', left, weeksLeft }
  if (weeksLeft >= left * 2) return { kind: 'fortnight', left, weeksLeft }
  if (weeksLeft >= left) return { kind: 'week', left, weeksLeft }
  return { kind: 'beyond', left, weeksLeft }
}

/**
 * The one line under the header, in Justin's voice, no dashes ever.
 *
 * `kid` is the child's name (already resolved by the caller, never the
 * literal "Your child") and `exitAge` phrasing names the birthday because the
 * birthday is the one true date in the system.
 */
export function paceLine(pace: StagePace, kid: string, stageNum: number): string {
  const exitAge = EXIT_AGE[stageNum]
  const birthday = exitAge ? `before ${kid} turns ${exitAge}` : ''
  switch (pace.kind) {
    case 'stamped':
      return `${kid}'s page is full. The rest is the week, not the page.`
    case 'few':
      return `Only ${pace.left} left on ${kid}'s page, and no rush on them.`
    case 'open':
      return `No end date on ${kid}'s page, so one whenever it comes up.`
    case 'unknown':
      return `${pace.left} left on ${kid}'s page. Add a birthday in settings and the timeline can pace it.`
    case 'past':
      return `${pace.left} left on ${kid}'s page, and no rush: this page stays open until it is done.`
    case 'month':
      return `On track. One a month fills ${kid}'s page ${birthday}.`
    case 'fortnight':
      return `On track. One a fortnight fills ${kid}'s page ${birthday}.`
    case 'week':
      return `On track. One a week fills ${kid}'s page ${birthday}.`
    case 'beyond':
      // The measurement and the rule, never a prediction. One a week is the
      // fastest rhythm this product will ever suggest, and the page not
      // closing is literally what the code does.
      return `${pace.left} left on ${kid}'s page and about ${Math.max(1, Math.round(pace.weeksLeft / 4.33))} months ${birthday}. Steady beats fast: the page never closes, and the stamp lands whenever you finish it.`
  }
}
