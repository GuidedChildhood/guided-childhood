import { yearGroupFor, academicYearStart } from '@/lib/learning/term'

// The England school calendar, by year group.
//
// This is the quiet half of the curriculum work and probably the more valuable
// one. The 448 objectives tell us what a year covers. This tells us WHEN the
// year gets hard, and that turns out to need no assessment at all: a child's
// birthday gives their year group, and the statutory calendar is fixed and
// identical for every family in England. Knowing a child is in Year 4 in April
// is enough to know the tables check is six weeks away, without knowing one
// thing about how that child is doing.
//
// Worry about school is seasonal and sharp. It spikes in September when nobody
// knows what is expected, and again in the weeks before a check. Those are the
// moments where naming the thing plainly is worth more than any reassurance,
// and they are knowable weeks ahead.
//
// ── Why every date here is approximate ───────────────────────────────────────
//
// The checks are set by the week, not the day, and they move a little each year.
// The phonics screening is the week commencing the second Monday in June. The
// tables check is a three week window from the first Monday in June. KS2 SATs
// are the week commencing the second Monday in May. We store a representative
// day for each and every piece of copy says "around" or "the week of", because
// a precise date a parent plans around and we got wrong is worse than a vague
// one that is right. The only genuinely fixed date here is the secondary school
// application deadline, 31 October, which is set in law.

export type SchoolEventKey =
  | 'new_year'
  | 'secondary_application'
  | 'sats'
  | 'tables_check'
  | 'phonics_check'
  | 'moving_up'

export type SchoolEvent = {
  key: SchoolEventKey
  // Which year groups this lands on. Empty means every year.
  years: number[]
  // Month and day, 1 based, of a representative date in the academic year.
  month: number
  day: number
  // How far ahead we start talking about it. Long enough to be a head start
  // rather than a warning, short enough that it is not noise.
  leadWeeks: number
  // What a parent would call it.
  title: string
  // What it actually is, plainly, in one line. The single most useful thing we
  // can say about most of these, because the name alone tells a parent nothing.
  what: string
  // One thing worth doing, and only one. A list of five is a list nobody does.
  doThis: string
  // The question this puts in a parent's head, ready for DiGi.
  ask: string
}

// Ordered by where they fall in the school year, September first.
export const SCHOOL_EVENTS: SchoolEvent[] = [
  {
    key: 'new_year',
    years: [],
    month: 9, day: 3,
    leadWeeks: 3,
    title: 'A new school year',
    what: 'A new year group, a new teacher, and a jump in what is expected that nobody hands you a list for.',
    doThis: 'Have a look at what their year actually covers, so the first parents evening is not the first time you hear it.',
    ask: 'What is expected of my child in their new school year?',
  },
  {
    key: 'secondary_application',
    years: [6],
    month: 10, day: 31,
    leadWeeks: 8,
    title: 'Secondary school applications close',
    what: 'The deadline to name your secondary schools is 31 October. Miss it and you are offered whatever is left, which is the one date in primary school that genuinely cannot be moved.',
    doThis: 'Get the application in, and put all your allowed choices down rather than only the one you want.',
    ask: 'How do I choose a secondary school, and how many should I put down?',
  },
  {
    key: 'sats',
    years: [6],
    month: 5, day: 11,
    leadWeeks: 6,
    title: 'Year 6 SATs',
    what: 'A week of tests in May covering the whole of key stage 2. They are used to measure the school, not to decide your child, and secondary schools set their own tests anyway.',
    doThis: 'Guard the sleep and the mood rather than the revision. A tired anxious child tests worse than a rested one who did less.',
    ask: 'How do I keep SATs in proportion at home without my child picking up my worry?',
  },
  {
    key: 'tables_check',
    years: [4],
    month: 6, day: 1,
    leadWeeks: 6,
    title: 'The multiplication tables check',
    what: 'A short on screen check in June: 25 questions, times tables up to 12, six seconds each. Speed is the whole point of it, which is why a child who knows their tables can still find it hard.',
    doThis: 'Practise out loud in the car or on the stairs, little and often. Six seconds means recall, and recall comes from repetition, not from sitting down with a worksheet.',
    ask: 'How do I help with the Year 4 tables check without it becoming a drill?',
  },
  {
    key: 'phonics_check',
    years: [1],
    month: 6, day: 8,
    leadWeeks: 6,
    title: 'The phonics screening check',
    what: 'Forty words read aloud to their teacher in June, one to one. Some of the words are made up on purpose, to check they are sounding out rather than remembering.',
    doThis: 'Read together at bedtime as you already do. The made up words are the only thing worth mentioning, so it is not a surprise on the day.',
    ask: 'What is the Year 1 phonics check and should I be doing anything about it?',
  },
  {
    key: 'moving_up',
    years: [],
    month: 7, day: 20,
    leadWeeks: 3,
    title: 'Moving up a year',
    what: 'The end of the year, and six weeks off. Whatever routine you have had since September is about to stop for the summer.',
    doThis: 'Decide the summer screen rhythm before the holidays start, not in week two when it has already got away from you.',
    ask: 'How do we keep screens in proportion over the summer holidays?',
  },
]

export type UpcomingEvent = {
  event: SchoolEvent
  // The real date this year, so the caller can say the month rather than guess.
  on: Date
  daysAway: number
  // In the lead window and still ahead.
  phase: 'ahead' | 'this_week' | 'passed'
}

const DAY = 86_400_000

// When this event falls in the academic year containing `on`. The school year
// turns over on 1 September, so a June date belongs to the calendar year AFTER
// the September that started the year, and an October one belongs to the same.
function dateInAcademicYear(event: SchoolEvent, on: Date): Date {
  const startYear = academicYearStart(on)
  const calendarYear = event.month >= 9 ? startYear : startYear + 1
  return new Date(Date.UTC(calendarYear, event.month - 1, event.day))
}

export function appliesTo(event: SchoolEvent, yearGroup: number): boolean {
  return event.years.length === 0 || event.years.includes(yearGroup)
}

// Every event for this year group in the academic year containing `on`, with
// how far away each one is. Sorted nearest first among those still ahead.
export function eventsFor(yearGroup: number, on: Date): UpcomingEvent[] {
  return SCHOOL_EVENTS
    .filter(e => appliesTo(e, yearGroup))
    .map(event => {
      const date = dateInAcademicYear(event, on)
      const daysAway = Math.round((date.getTime() - Date.UTC(on.getUTCFullYear(), on.getUTCMonth(), on.getUTCDate())) / DAY)
      const phase: UpcomingEvent['phase'] =
        daysAway < -7 ? 'passed' : daysAway <= 7 ? 'this_week' : 'ahead'
      return { event, on: date, daysAway, phase }
    })
    .sort((a, b) => a.daysAway - b.daysAway)
}

// The one thing to lead with today, or null when nothing is close enough to be
// worth saying. Deliberately one: a parent who opens the app to a list of five
// things coming up has been given a worry, not a head start.
//
// A check that happened in the last week still leads, because "that was this
// week, here is what it means" is the most useful thing we can say on the
// Friday after, and silence right then reads as us not knowing.
export function nextEvent(yearGroup: number, on = new Date()): UpcomingEvent | null {
  const inWindow = eventsFor(yearGroup, on).filter(u =>
    u.phase !== 'passed' && u.daysAway <= u.event.leadWeeks * 7,
  )
  return inWindow[0] ?? null
}

// The same thing from a birthday, for callers that hold a child rather than a
// year group. Null whenever we cannot be certain, which is the rule everywhere
// this data is used: no birthday means we say nothing rather than guess.
//
// Year 7 and above is deliberately allowed here even though the sheets stop at
// Year 6, because the secondary transition is the one thing we have to be able
// to talk about on the other side of the line.
export function nextEventForChild(dob: string | null | undefined, on = new Date()): UpcomingEvent | null {
  const yearGroup = yearGroupFromDob(dob, on)
  if (yearGroup === null) return null
  return nextEvent(yearGroup, on)
}

// Year group from a birthday, unbounded, so Year 7 and beyond are real answers
// rather than null. Placed by age on 31 August like everything else.
export function yearGroupFromDob(dob: string | null | undefined, on = new Date()): number | null {
  if (!dob) return null
  const birth = new Date(`${String(dob).slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(birth.getTime())) return null
  const yearGroup = yearGroupFor(birth, on)
  // Below Reception there is no school year to speak of, and past Year 13 the
  // calendar we hold does not apply.
  if (yearGroup < 0 || yearGroup > 13) return null
  return yearGroup
}

// How to name the month of an event without claiming a day we do not know.
export function aroundWhen(u: UpcomingEvent): string {
  const month = u.on.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' })
  if (u.event.key === 'secondary_application') return '31 October'
  if (u.phase === 'this_week') return 'this week'
  if (u.daysAway <= 21) return `in about ${Math.max(1, Math.round(u.daysAway / 7))} weeks`
  return month
}
