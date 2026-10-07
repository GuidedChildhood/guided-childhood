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
