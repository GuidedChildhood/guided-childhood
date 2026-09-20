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
// WHAT IT IS NOT. Not a login, not a school profile, not the start of one.
// Two fields, a name and where to find them, because that is what the
// script asks the teacher to say out loud.

const KEY = 'gc.schools.your-school'
export const YOUR_SCHOOL_EVENT = 'gc:schools-your-school'

export type YourSchool = {
  /** The designated safeguarding lead, as the class should hear it. */
  leadName: string
  /** Where in the building they are, if the school wants that said too. */
  leadWhere: string
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

export function readYourSchool(): YourSchool | null {
  const s = store()
  if (!s) return null
  try {
    const raw = s.getItem(KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as Partial<YourSchool> | null
    const leadName = clean(v?.leadName, 80)
    if (!leadName) return null
    return { leadName, leadWhere: clean(v?.leadWhere, 120) }
  } catch {
    return null
  }
}

function announce() {
  try { window.dispatchEvent(new CustomEvent(YOUR_SCHOOL_EVENT)) } catch { /* SSR */ }
}

export function writeYourSchool(v: YourSchool): YourSchool | null {
  const leadName = clean(v.leadName, 80)
  const next = leadName ? { leadName, leadWhere: clean(v.leadWhere, 120) } : null
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
