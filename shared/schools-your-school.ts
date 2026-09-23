// WHO A CHILD SHOULD TELL, IN THIS SCHOOL.
//
// The statutory guidance asks that a child knows who in school to speak to
// (RSHE-P-GW-9), and migration 316 taught it: on the KS2 lesson the body
// says "your teacher is going to say their name out loud now" and the script
// tells the teacher to name the designated safeguarding lead and write it on
// the board. Only the school can supply that name. Justin's decision on
// 20 September 2026 was to let it be typed once rather than remembered every
// time: a box on the Hub, and the name then appears on the slide that asks
// for it, on the flagged lessons' prep pages and on the printed teacher sheet.
//
// WHERE IT LIVES. In this browser, and nowhere else, exactly like the
// tracker (schools-progress) and the passport fill (schools-taught). The
// schools app holds no accounts and no pupil data, and the privacy notice is
// written on that promise, so a member of staff's name cannot start a
// server side record by the back door. It is a fact about a classroom
// screen, the way the name on the board is. Clearing the browser clears it,
// and a second screen in the same school types it again.
//
// WHAT STAFF NEED, FROM 23 SEPTEMBER 2026. A designated safeguarding lead
// reviewing the scheme asked for material she could adapt. The honest version
// of adapt costs nothing: the three facts a DSL otherwise writes on every
// filed safeguarding page by hand. The deputy, for when the lead is out. How
// a concern is recorded here, in the school's own words. The title of the
// school's own policy, so the crosswalk says which document it belongs to.
// They print at the top of the crosswalk and the staff briefings, under every
// briefing's disclosure paragraph and on the teacher sheet. Same browser,
// same promise: a colleague's name is a fact about a building, not a record
// we keep.
//
// WHAT IT IS NOT. Not a login, not a school profile, not the start of one.
// Five short fields, each one something staff would otherwise write on the
// printout in pen. A record saved before the three were added still reads,
// with them blank.

const KEY = 'gc.schools.your-school'
export const YOUR_SCHOOL_EVENT = 'gc:schools-your-school'

export type YourSchool = {
  /** The designated safeguarding lead, as the class should hear it. */
  leadName: string
  /** Where in the building they are, if the school wants that said too. */
  leadWhere: string
  /** The deputy lead, or leads, for when the lead is out. */
  deputyName: string
  /** How a member of staff records a concern here, in the school's words. */
  reportRoute: string
  /** The school's own safeguarding policy, by the title it is filed under. */
  policyTitle: string
}

/** The longest each field may be. The form's maxLength reads the same numbers. */
export const YOUR_SCHOOL_MAX: Record<keyof YourSchool, number> = {
  leadName: 80, leadWhere: 120, deputyName: 120, reportRoute: 160, policyTitle: 140,
}

/** One name per field, used by the form, the saved view and the paper, so a
 *  thing is called the same wherever it appears. */
export const YOUR_SCHOOL_LABEL: Record<keyof YourSchool, string> = {
  leadName: 'Designated safeguarding lead',
  leadWhere: 'Where to find them',
  deputyName: 'Deputy safeguarding lead',
  reportRoute: 'How a concern is recorded',
  policyTitle: 'Safeguarding policy',
}

function store(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null // private mode, or storage blocked
  }
}

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''

// The lead's name is what the record hangs on: the slide, the prep page and
// every printed line start from it, so without it there is no record.
function tidy(v: Partial<YourSchool> | null | undefined): YourSchool | null {
  const leadName = clean(v?.leadName, YOUR_SCHOOL_MAX.leadName)
  if (!leadName) return null
  return {
    leadName,
    leadWhere: clean(v?.leadWhere, YOUR_SCHOOL_MAX.leadWhere),
    deputyName: clean(v?.deputyName, YOUR_SCHOOL_MAX.deputyName),
    reportRoute: clean(v?.reportRoute, YOUR_SCHOOL_MAX.reportRoute),
    policyTitle: clean(v?.policyTitle, YOUR_SCHOOL_MAX.policyTitle),
  }
}

export function readYourSchool(): YourSchool | null {
  const s = store()
  if (!s) return null
  try {
    const raw = s.getItem(KEY)
    if (!raw) return null
    return tidy(JSON.parse(raw) as Partial<YourSchool> | null)
  } catch {
    return null
  }
}

function announce() {
  try { window.dispatchEvent(new CustomEvent(YOUR_SCHOOL_EVENT)) } catch { /* SSR */ }
}

export function writeYourSchool(v: YourSchool): YourSchool | null {
  const next = tidy(v)
  const s = store()
  try {
    if (next) s?.setItem(KEY, JSON.stringify(next))
    else s?.removeItem(KEY)
  } catch { /* full or blocked: the page still draws */ }
  announce()
  return next
}

export function clearYourSchool(): void {
  try { store()?.removeItem(KEY) } catch { /* blocked */ }
  announce()
}

/** "Ms Okafor, the office by the hall" or just the name. */
export function leadLine(v: YourSchool): string {
  return v.leadWhere ? `${v.leadName}, ${v.leadWhere}` : v.leadName
}

/** Typed text with its own full stop, made safe to end one of our sentences. */
export const bare = (s: string) => s.replace(/[\s.]+$/, '')

/** The rows a filed page lists, in order: the lead with where to find them,
 *  then whichever staff facts this screen was told. */
export function schoolRows(v: YourSchool): { label: string; value: string }[] {
  return [
    { label: YOUR_SCHOOL_LABEL.leadName, value: leadLine(v) },
    { label: YOUR_SCHOOL_LABEL.deputyName, value: v.deputyName },
    { label: YOUR_SCHOOL_LABEL.reportRoute, value: v.reportRoute },
    { label: YOUR_SCHOOL_LABEL.policyTitle, value: v.policyTitle },
  ].filter(r => r.value)
}

// WHICH SLIDES ASK FOR THE NAME. A structural fact read off the slide rather
// than a flag someone has to remember to set: the KS2 slide whose body says
// the teacher will say the name out loud, and any slide whose words name
// the safeguarding lead (the KS3 and KS4 choices that list "your tutor, head
// of year, or the safeguarding lead", the AI companion scenario whose script
// says "you or the safeguarding lead are that person"). On those the wall
// shows the name, so the class can copy it down; everywhere else nothing
// changes.
export function slideNamesTheLead(slide: object): boolean {
  let text = ''
  try { text = JSON.stringify(slide).toLowerCase() } catch { return false }
  return text.includes('safeguarding lead') || text.includes('say their name out loud')
}
