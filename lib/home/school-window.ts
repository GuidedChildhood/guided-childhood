// The two school day windows: the morning before school and the return home.
//
// Justin, 7 October 2026: "research the best morning before school routine
// and after school return so we can build advice in and cleverly pre empt
// what happens ... as well as giving parents opportunity to log as a moment
// so we can track and provide best advice." The briefing that followed
// (briefings/2026-10-07-school-day-routines-v2.html, nine lenses, 75 sources
// verified) changed the ask in three ways, and this file is where they land:
//
// 1. LEAD WITH SLEEP AND FOOD, NOT THE SCREEN. Two randomised crossover
//    experiments, the UK Millennium Cohort and Orben and Przybylski's three
//    datasets (n 355,358) all say the morning is paid for the night before
//    and at the last meal. The association of sleep and breakfast with how a
//    child does is several times the size of technology use. So the first
//    line of a morning card is a state check and one low demand move, and
//    the after school card leads with hunger, company and a stopping point
//    agreed in advance. The only study that isolates the before school screen
//    is a case control of 276 children, and the DfE publishes no lateness
//    figures, so nothing here claims morning screens cause lateness.
// 2. THE MINUTE IS WORTH SINGLE DIGITS; THE LOOP IS THE PRODUCT. Three texts
//    a week beat one and five (five raised opt out 58 percent and helped
//    nobody), timing added a few points at most in two microrandomised
//    trials, and 79 percent of just in time prompts went unanswered. So ONE
//    window per family by default, at a time the parent sets from their
//    child's school day, and the one tap moment on the card itself. Never
//    both windows unless the parent opts up.
// 3. NEVER NAME A SYNDROME. "Restraint collapse" is a 2016 blog term whose
//    proposed mechanism (willpower as a tank) failed a 23 lab replication.
//    Describe the pattern a parent will recognise. Never the label.
//
// Everything here is pure so the cron, the Home card and the guard read the
// same rule. The times live on children (migration 363): school_start_minutes
// and home_minutes, minutes from midnight UK, null meaning the defaults the
// pushes have always used (07:30 and 15:30).

import { roundToHalfHour } from '@/lib/push/evening'

export type SchoolWindow = 'morning' | 'home'

/** The push and card land this long before the school day starts. */
export const MORNING_LEAD_MINUTES = 50
/** And this long after the child is usually home: coat off, bag down, first. */
export const HOME_LAG_MINUTES = 15
/** What the pushes have always been: 07:30 and 15:30, when no time is set. */
export const DEFAULT_MORNING_TARGET = 7 * 60 + 30
export const DEFAULT_HOME_TARGET = 15 * 60 + 30
/** The Home card shows from the target until this long after it. */
export const CARD_OPEN_MINUTES = 90

/** Half hour aligned, because the cron runs on the half hour (lib/push/evening DUE_WINDOW). */
export function morningTarget(schoolStartMinutes: number | null | undefined): number {
  if (typeof schoolStartMinutes !== 'number' || !Number.isFinite(schoolStartMinutes)) return DEFAULT_MORNING_TARGET
  return roundToHalfHour(schoolStartMinutes - MORNING_LEAD_MINUTES)
}

export function homeTarget(homeMinutes: number | null | undefined): number {
  if (typeof homeMinutes !== 'number' || !Number.isFinite(homeMinutes)) return DEFAULT_HOME_TARGET
  return roundToHalfHour(homeMinutes + HOME_LAG_MINUTES)
}

/**
 * One target per family per window. With several children the morning goes
 * by the EARLIEST school start (the house is up for that one) and the
 * afternoon by the LATEST home time (the last one through the door is when
 * the evening actually starts). One push, never one per child.
 */
export function familyTargets(children: { school_start_minutes?: number | null; home_minutes?: number | null }[]): { morning: number; home: number } {
  const starts = children.map(c => c.school_start_minutes).filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
  const homes = children.map(c => c.home_minutes).filter((n): n is number => typeof n === 'number' && Number.isFinite(n))
  return {
    morning: morningTarget(starts.length ? Math.min(...starts) : null),
    home: homeTarget(homes.length ? Math.max(...homes) : null),
  }
}

/** Which window, if any, the Home card is open for at this UK minute. */
export function openWindow(nowMinutes: number, targets: { morning: number; home: number }): SchoolWindow | null {
  if (nowMinutes >= targets.morning && nowMinutes < targets.morning + CARD_OPEN_MINUTES) return 'morning'
  if (nowMinutes >= targets.home && nowMinutes < targets.home + CARD_OPEN_MINUTES) return 'home'
  return null
}

// ── THE WORDS, BY BAND ──────────────────────────────────────────────────────
//
// Primary (4 to 10): the parent is at the gate or in the room, so the card
// speaks to the handover itself: warm, wordless, food first, no questions for
// twenty minutes. Secondary (11 plus): the parent often arrives later than the
// child, so the card speaks to the structure that holds without them: the
// phone charging downstairs, one specific question at tea, the bedroom.
//
// Every line traces to the briefing's verified ledger. The morning lines carry
// the Chief Medical Officers' advice (screen free meals, phones out of the
// bedroom at bedtime), RCPCH (agree the plan in a calm moment) and the NHS
// paediatric leaflet (a heads up, a short fixed sequence, the same cue phrase
// every time). The after school lines carry Hiniker 2016 (a stop agreed in
// advance beats a warning sprung in the moment) and the DfE and Ofcom
// pictures of what the hour actually holds.

export type Primaryish = 'primary' | 'secondary'

export function bandGroup(ageBand: string | null | undefined): Primaryish {
  const b = String(ageBand ?? '')
  // Bands start with their lower age: 4-7, 8-10, 8-11 are primary; 11-13,
  // 12-15, 13-15, 16+ are secondary.
  const lower = parseInt(b, 10)
  return Number.isFinite(lower) && lower >= 11 ? 'secondary' : 'primary'
}

export type WindowCopy = {
  eyebrow: string
  title: string
  /** The one move, in the parent's hands, plain. */
  move: string
  /** The moment keys the one tap logs, in DAILY_MOMENTS vocabulary. */
  momentKey: string
  /** What the parent is told the tap does. */
  tapNote: string
  /** The script to open for the words, by live title (lib/content/signal-map). */
  scriptTitle: string
}

export function windowCopy(window: SchoolWindow, group: Primaryish, childName: string | null): WindowCopy {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  if (window === 'morning') {
    return group === 'primary'
      ? {
          eyebrow: 'Before school',
          title: 'Food before the screen, screen after shoes',
          move: `Breakfast first, no screen at the table. If the TV goes on, it goes on when ${kid} is dressed with the bag by the door, and the stopping point is said before it starts, not when the coat is needed.`,
          momentKey: 'tv_morning',
          tapNote: 'Logging it keeps the check in on this worry and lets DiGi see the pattern.',
          scriptTitle: 'The Morning TV Standoff',
        }
      : {
          eyebrow: 'Before school',
          title: 'The morning was decided last night',
          move: `The phone charged downstairs and screens off an hour before sleep is most of the morning. This morning: food before the phone, and one question about today, not three.`,
          momentKey: 'morning',
          tapNote: 'Logging it keeps the check in on this worry and lets DiGi see the pattern.',
          scriptTitle: 'The Before School Phone Argument',
        }
  }
  return group === 'primary'
    ? {
        eyebrow: 'Home from school',
        title: 'Feed first, ask later',
        move: `A snack in your hand at the gate, and no questions for twenty minutes. ${kid} has held it together all day and may fall apart on you because you are safe. If the screen goes on, agree when it ends before it starts.`,
        momentKey: 'come_off',
        tapNote: 'Logging it keeps the check in on this worry and lets DiGi see the pattern.',
        scriptTitle: 'The After School Snack Battle',
      }
    : {
        eyebrow: 'Home from school',
        title: 'The first hour home is the biggest screen hour of the day',
        move: `Something to eat, then the stopping point agreed before the screen goes on. At tea, one specific question beats how was school. The phone charges downstairs tonight.`,
        momentKey: 'come_off',
        tapNote: 'Logging it keeps the check in on this worry and lets DiGi see the pattern.',
        scriptTitle: 'The After School Device Rush',
      }
}

// ── A DIFFERENT PUSH EACH SCHOOL DAY ────────────────────────────────────────
//
// Justin, 3 November 2026: "home from school is the same reminder every day
// ... these are crucial timings, they need to be more engaging and helpful
// and varied, also like try this? Have you a concern? Talk to DiGi, it learns
// from you", and the services a family has not used yet.
//
// The moment is the right one (the briefing above), the words had gone stale:
// one sentence, every school day, is a sentence a parent stops reading by the
// second week. So the same window now rotates through a few kinds of line:
//   move     the one move for the moment, three wordings per band, each from
//            the same verified ledger as the card (food first, the stopping
//            point agreed before the screen, one specific question at tea,
//            the phone charging downstairs). Opens the card.
//   digi     have a worry, tell DiGi, it remembers this family. Worded as
//            something new for a family that has never asked it anything.
//   tonight  see you tonight: the evening path is on Home.
//   new      one service this family has not tried yet (a job for stars, or
//            the words for the switch off), only while it is untried.
// The day number moves the rotation, so two school days in a row never get
// the same kind, and the move wordings turn over each time the move comes
// round. Pure and deterministic: the same family on the same day always gets
// the same line, which is what lets the guard read every one of them.

export type WindowNudgeContext = {
  /** School days (Monday to Friday) since the epoch, UK date
   *  (schoolDayNumber). Moves the rotation one step each school day, so a
   *  weekend never makes Friday and Monday land on the same kind. */
  dayNumber: number
  /** Has this parent ever asked DiGi anything. */
  usedDigi: boolean
  /** Does this family have a job for stars set. */
  hasQuests: boolean
  /** Has this parent ever marked a script as tried. */
  triedScript: boolean
}

type PushLine = { title: string; body: string; url: string }

function moveLines(window: SchoolWindow, group: Primaryish, kid: string): PushLine[] {
  const card = '/dashboard#school-window'
  if (window === 'morning') {
    return group === 'primary'
      ? [
          { title: 'Before school', body: `Food before the screen, and the screen after shoes. One tap on Home logs how ${kid}'s morning went.`, url: card },
          { title: 'Try this before school', body: `Breakfast at the table with no screen on. If the TV goes on later, say when it ends before it starts.`, url: card },
          { title: 'Try this before school', body: `The same short order every morning: dressed, breakfast, teeth, bag by the door. A fixed order means fewer reminders for ${kid}.`, url: card },
        ]
      : [
          { title: 'Before school', body: `Food before the phone, one question about today. One tap on Home logs how ${kid}'s morning went.`, url: card },
          { title: 'Try this before school', body: `Breakfast before the phone comes out. One question about today, not three, then let the morning run.`, url: card },
          { title: 'Try this before school', body: `A slow morning is usually paid for the night before. Tonight the phone charges downstairs, and yours does too.`, url: card },
        ]
  }
  return group === 'primary'
    ? [
        { title: 'Home from school', body: `Snack in hand, no questions for twenty minutes. One tap on Home logs how ${kid}'s return went.`, url: card },
        { title: 'Try this when they get home', body: `Food and company first, screen second. Agree when the screen ends before it goes on, not when it is time to stop.`, url: card },
        { title: 'Try this at tea', body: `Swap how was school for one specific question: who did you sit with at lunch? It often gets more than a shrug.`, url: card },
      ]
    : [
        { title: 'Home from school', body: `Something to eat, then agree when the screen ends before it starts. One tap on Home logs how it went.`, url: card },
        { title: 'Try this at tea', body: `One specific question beats how was school. Try: what was the best bit of today, and what was the worst?`, url: card },
        { title: 'Try this tonight', body: `Agree together where the phone charges tonight. Downstairs, with yours next to it, protects sleep without a fight about minutes.`, url: card },
      ]
}

function digiLine(window: SchoolWindow, kid: string, usedDigi: boolean): PushLine {
  const when = window === 'morning' ? 'mornings' : 'after school'
  return usedDigi
    ? { title: 'Something on your mind?', body: `A worry about ${kid} and ${when}? Tell DiGi. It remembers what you have told it, so every answer fits your family better.`, url: '/dashboard/digi' }
    : { title: 'New: ask DiGi', body: `Tell DiGi the one thing that makes ${when} hard with ${kid}. It learns your family as you go and answers for you, not for everyone.`, url: '/dashboard/digi' }
}

function tonightLine(window: SchoolWindow, kid: string): PushLine {
  return window === 'morning'
    ? { title: 'Have a good day', body: `See you tonight. There is a short path waiting on Home for you and ${kid}, a few small steps and the day is done.`, url: '/dashboard' }
    : { title: 'See you tonight', body: `Tonight's path is ready on Home: a few short steps for you and ${kid}, and a finish line at the end.`, url: '/dashboard' }
}

function newServiceLine(window: SchoolWindow, kid: string, ctx: WindowNudgeContext): PushLine | null {
  if (!ctx.hasQuests) {
    return window === 'morning'
      ? { title: 'Something new to try', body: `Set ${kid} one small job for stars, like bag by the door. They tick it off in their own app and you approve it.`, url: '/dashboard/quests' }
      : { title: 'Something new to try', body: `Set ${kid} one small job for stars, like bag on the hook. They tick it off in their own app and you approve it.`, url: '/dashboard/quests' }
  }
  if (!ctx.triedScript) {
    return { title: 'Something new to try', body: `Not sure what to say when the screen goes off? The scripts have the exact words, written for ${kid}'s age.`, url: '/dashboard/scripts' }
  }
  return null
}

/** Every line a family could get in this window, in rotation order. */
export function windowPushRotation(window: SchoolWindow, group: Primaryish, childName: string | null, ctx: WindowNudgeContext): { kind: 'move' | 'digi' | 'tonight' | 'new'; line: PushLine }[] {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const moves = moveLines(window, group, kid)
  const fresh = newServiceLine(window, kid, ctx)
  // Five, so one school week is one full turn: the move three days (or two
  // while there is something new to offer), DiGi once, tonight once.
  const kinds: ('move' | 'digi' | 'tonight' | 'new')[] = fresh ? ['move', 'digi', 'move', 'new', 'tonight'] : ['move', 'digi', 'move', 'tonight', 'move']
  // The move wordings turn over each time the move comes round, so a family
  // that sees the move twice in a cycle sees two different wordings.
  let moveTurn = Math.floor(ctx.dayNumber / kinds.length) * kinds.filter(k => k === 'move').length
  return kinds.map(kind => {
    if (kind === 'digi') return { kind, line: digiLine(window, kid, ctx.usedDigi) }
    if (kind === 'tonight') return { kind, line: tonightLine(window, kid) }
    if (kind === 'new' && fresh) return { kind, line: fresh }
    const line = moves[((moveTurn++ % moves.length) + moves.length) % moves.length]
    return { kind: 'move' as const, line }
  })
}

/** This family's line for this window on this day. */
export function windowPushFor(window: SchoolWindow, group: Primaryish, childName: string | null, ctx: WindowNudgeContext): PushLine {
  const rotation = windowPushRotation(window, group, childName, ctx)
  return rotation[((ctx.dayNumber % rotation.length) + rotation.length) % rotation.length].line
}

/** UK date as a day number, for the rotation. */
export function ukDayNumber(now: Date): number {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
  return Math.floor(Date.parse(`${ymd}T00:00:00Z`) / 86_400_000)
}

/** Monday to Friday days before this day number. Day 0 was a Thursday. */
export function schoolDayNumber(day: number): number {
  const weeks = Math.floor(day / 7)
  let n = weeks * 5
  for (let r = 0; r < day - weeks * 7; r++) {
    const dow = (4 + r) % 7
    if (dow >= 1 && dow <= 5) n++
  }
  return n
}

/** The push line for one family in one window. Short, because it is a push. */
export function windowPush(window: SchoolWindow, group: Primaryish, childName: string | null): { title: string; body: string; url: string } {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  if (window === 'morning') {
    return group === 'primary'
      ? { title: 'Before school', body: `Food before the screen, and the screen after shoes. One tap on Home logs how ${kid}'s morning went.`, url: '/dashboard#school-window' }
      : { title: 'Before school', body: `Food before the phone, one question about today. One tap on Home logs how ${kid}'s morning went.`, url: '/dashboard#school-window' }
  }
  return group === 'primary'
    ? { title: 'Home from school', body: `Snack in hand, no questions for twenty minutes. One tap on Home logs how ${kid}'s return went.`, url: '/dashboard#school-window' }
    : { title: 'Home from school', body: `Something to eat, then agree when the screen ends before it starts. One tap on Home logs how it went.`, url: '/dashboard#school-window' }
}

/** Half hour labels for the pickers, e.g. 8:45am. */
export function minutesLabel(m: number): string {
  const h = Math.floor(m / 60), mm = m % 60
  const twelve = h % 12 === 0 ? 12 : h % 12
  return `${twelve}${mm ? ':' + String(mm).padStart(2, '0') : ''}${h < 12 ? 'am' : 'pm'}`
}

/** The picker ranges: school starts 7:30 to 9:30, home 2:30 to 6:30, quarter hours. */
export const SCHOOL_START_OPTIONS = Array.from({ length: 9 }, (_, i) => 7 * 60 + 30 + i * 15)
export const HOME_OPTIONS = Array.from({ length: 17 }, (_, i) => 14 * 60 + 30 + i * 15)

export function isValidSchoolStart(n: unknown): n is number {
  return typeof n === 'number' && SCHOOL_START_OPTIONS.includes(n)
}
export function isValidHome(n: unknown): n is number {
  return typeof n === 'number' && HOME_OPTIONS.includes(n)
}
