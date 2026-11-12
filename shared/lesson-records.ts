// THE RULES OF THE SCHOOL'S RECORD, WITH NO IMPORTS (10 November 2026).
//
// schools.lesson_records (migration 391) holds one row per lesson a school
// taught to a class. This file is everything about that row that is a rule
// rather than a query: what a class name may be, which academic year a date
// falls in, what a level count is, how long an undo lasts, and the sums a
// progress page shows. It imports nothing, so the server actions, the pages
// and scripts/check-lesson-records.mjs under plain node all read the same
// rules.
//
// NO PUPIL, EVER. Nothing in here can hold a child's name. A class is a short
// label. A level record is three counts. A note is 280 characters with "no
// pupil names" under the box.

export type Subject = 'digital' | 'fr'
export const SUBJECTS: Subject[] = ['digital', 'fr']

/** How the class did, as the teacher judged it. `levels` means the counts are
 *  in the marks (French). `not_assessed` is the honest default: a lesson that
 *  was delivered has not thereby been assessed. */
export type Judgement = 'secure' | 'developing' | 'revisit'
export type Assessment = Judgement | 'levels' | 'not_assessed'
export const JUDGEMENTS: Judgement[] = ['secure', 'developing', 'revisit']
export const JUDGEMENT_LABEL: Record<Judgement, string> = {
  secure: 'Secure',
  developing: 'Developing',
  revisit: 'Needs revisiting',
}

/** What each judgement looks like in ONE lesson: a line a teacher can see or
 *  hear in the room. Written per lesson, from that lesson's own misconceptions
 *  and check questions, and kept in the lesson row at
 *  assessment.teacher_judgement.descriptors (migration 392). */
export type Descriptors = Record<Judgement, string>

/** The three descriptor lines out of a lesson's assessment block, or null when
 *  the lesson has none. Reads the one shape migration 392 writes, and the older
 *  shape four lessons carried before it (secure, developing, needs_support at
 *  the top), so a row that has not been migrated still shows what it has.
 *  All three or nothing: two lines beside three buttons would read as a slip. */
export function descriptorsOf(assessment: unknown): Descriptors | null {
  if (!assessment || typeof assessment !== 'object') return null
  const tj = (assessment as Record<string, unknown>).teacher_judgement
  if (!tj || typeof tj !== 'object' || Array.isArray(tj)) return null
  const held = (tj as Record<string, unknown>).descriptors
  const from = (held && typeof held === 'object' && !Array.isArray(held) ? held : tj) as Record<string, unknown>
  const line = (v: unknown) => (typeof v === 'string' && v.trim() ? v.replace(/\s+/g, ' ').trim() : null)
  const secure = line(from.secure), developing = line(from.developing), revisit = line(from.revisit ?? from.needs_support)
  return secure && developing && revisit ? { secure, developing, revisit } : null
}

/** Pupils at each level of the French scheme's own model, for one statement. */
export type LevelCount = { s3: number; s4: number; s5: number }

/** One delivery as a page reads it. */
export type Delivery = {
  id: string
  subject: Subject
  lessonKey: string
  deliveredOn: string        // 2026-11-10
  academicYear: string       // 2026-27
  groups: string[]
  assessment: Assessment
  marks: Record<string, unknown>
  note: string | null
  createdAt: string          // ISO
}

// ---------------------------------------------------------------- dates ----

/** The academic year a date falls in, September to August: "2026-27". */
export function academicYear(d: Date): string {
  const y = d.getUTCMonth() >= 8 ? d.getUTCFullYear() : d.getUTCFullYear() - 1
  return `${y}-${String((y + 1) % 100).padStart(2, '0')}`
}

/** "2026-27" as a page says it: "2026 to 27". */
export function yearLabel(academicYearKey: string): string {
  return academicYearKey.replace('-', ' to ')
}

/** An academic year a page was asked for, or null. Only ever one of the years
 *  the school has rows in: a made up year in the address shows the current one. */
export function cleanYear(raw: unknown, known: string[]): string | null {
  return typeof raw === 'string' && /^\d{4}-\d{2}$/.test(raw) && known.includes(raw) ? raw : null
}

/** A date as the table stores it. */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** A date a teacher may record a lesson on: a real day, not in the future,
 *  and inside the last two academic years. Null for anything else. */
export function cleanDeliveredOn(raw: unknown, now: Date): string | null {
  if (typeof raw !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null
  const d = new Date(`${raw}T00:00:00Z`)
  if (Number.isNaN(d.getTime()) || isoDate(d) !== raw) return null
  if (d.getTime() > now.getTime()) return null
  if (now.getTime() - d.getTime() > 2 * 366 * 24 * 60 * 60 * 1000) return null
  return raw
}

/** An undo is offered for ten minutes. After that a record is corrected with
 *  a reason, never removed. */
export const UNDO_MINUTES = 10
export function canUndo(createdAt: string, now: Date): boolean {
  const made = new Date(createdAt).getTime()
  return Number.isFinite(made) && now.getTime() - made <= UNDO_MINUTES * 60 * 1000 && now.getTime() >= made - 60 * 1000
}

// --------------------------------------------------------------- classes ---

export const MAX_GROUPS = 12
const GROUP_RE = /^[\p{L}\p{N}][\p{L}\p{N} ]{0,15}$/u

/** One class name: "4B", "Year 5", "Maple". Letters, digits and spaces, at
 *  most 16 characters, stored in capitals so 4b and 4B are one class. */
export function cleanGroup(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const g = raw.replace(/\s+/g, ' ').trim().toUpperCase()
  return GROUP_RE.test(g) ? g : null
}

/** The classes on a delivery: one for a lesson, several for an assembly.
 *  Null when there are none, too many, or any one is not a class name. */
export function cleanGroups(raw: unknown): string[] | null {
  const list = Array.isArray(raw) ? raw : typeof raw === 'string' ? raw.split(',') : null
  if (!list) return null
  const out: string[] = []
  for (const item of list) {
    if (typeof item === 'string' && !item.trim()) continue
    const g = cleanGroup(item)
    if (!g) return null
    if (!out.includes(g)) out.push(g)
  }
  return out.length >= 1 && out.length <= MAX_GROUPS ? out : null
}

/** The year groups a list of classes names, where a name says: "6B" is 6,
 *  "YEAR 5" is 5, "Y4 OAK" is 4, "RECEPTION" is 0. "MAPLE" says nothing. */
export function yearGroupsOf(groups: string[]): number[] {
  const out = new Set<number>()
  for (const g of groups) {
    if (/^RECEPTION\b/.test(g) || /^YR\b/.test(g)) { out.add(0); continue }
    const m = g.match(/^(?:YEAR ?|Y)?(\d{1,2})(?![0-9])/)
    if (m) { const n = Number(m[1]); if (n >= 1 && n <= 13) out.add(n) }
  }
  return [...out].sort((a, b) => a - b)
}

// ----------------------------------------------------------------- marks ---

export const MAX_PUPILS = 120

/** Level counts for the statements a French lesson assesses. Only codes the
 *  lesson names are kept; a count is a whole number from 0 to 120; a statement
 *  with every count at zero is dropped, because nobody was counted. */
export function cleanLevels(raw: unknown, codes: string[]): Record<string, LevelCount> {
  const out: Record<string, LevelCount> = {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out
  const n = (v: unknown) => {
    const x = typeof v === 'string' && v.trim() !== '' ? Number(v) : v
    return typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= MAX_PUPILS ? x : null
  }
  for (const code of codes) {
    const row = (raw as Record<string, unknown>)[code]
    if (!row || typeof row !== 'object') continue
    const r = row as Record<string, unknown>
    const s3 = n(r.s3), s4 = n(r.s4), s5 = n(r.s5)
    if (s3 === null || s4 === null || s5 === null) continue
    if (s3 + s4 + s5 === 0 || s3 + s4 + s5 > MAX_PUPILS) continue
    out[code] = { s3, s4, s5 }
  }
  return out
}

/** A judgement per objective, by its position in the lesson's "I can" list. */
export function cleanObjectiveMarks(raw: unknown, count: number): Record<string, Judgement> {
  const out: Record<string, Judgement> = {}
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return out
  for (let i = 0; i < count; i++) {
    const v = (raw as Record<string, unknown>)[String(i)]
    if (typeof v === 'string' && (JUDGEMENTS as string[]).includes(v)) out[String(i)] = v as Judgement
  }
  return out
}

/** HOW MANY, ON THE TWO QUIZZES THE LESSON ALREADY HAS (11 November 2026).
 *  A lesson opens on a starter quiz that looks back and closes on an exit
 *  quiz about today. A teacher who counts hands on each has two honest facts
 *  about the class: how many still had the earlier learning, and how many
 *  left with today's. Three numbers, no names, and never subtracted from each
 *  other: they are two different quizzes, so the pair is not a gain score.
 *  Kept inside the marks under one reserved key, beside the judgements. */
export type QuizCounts = { pupils: number; starter: number | null; exit: number | null }
export const QUIZ_KEY = '_quiz'

/** Quiz counts as typed. Pupils is 1 to 120; each count is 0 to pupils or
 *  left empty. Null unless there are pupils and at least one count, because
 *  a class size alone says nothing. */
export function cleanQuizCounts(raw: unknown): QuizCounts | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const n = (v: unknown) => {
    const x = typeof v === 'string' && v.trim() !== '' ? Number(v) : v
    return typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= MAX_PUPILS ? x : null
  }
  const r = raw as Record<string, unknown>
  const pupils = n(r.pupils)
  if (pupils === null || pupils < 1) return null
  const within = (v: unknown) => { const x = n(v); return x !== null && x <= pupils ? x : null }
  const starter = within(r.starter), exit = within(r.exit)
  return starter === null && exit === null ? null : { pupils, starter, exit }
}

/** The quiz counts read back out of a stored mark, or null. */
export function quizCountsIn(marks: Record<string, unknown>): QuizCounts | null {
  return cleanQuizCounts(marks[QUIZ_KEY])
}

/** The two shares across a set of deliveries, each over the pupils counted
 *  for that quiz. Null for a quiz nobody counted. */
export function quizShares(list: Delivery[]): { starter: number | null; exit: number | null; lessons: number } {
  let sp = 0, sr = 0, ep = 0, er = 0, lessons = 0
  for (const d of list) {
    const q = quizCountsIn(d.marks)
    if (!q) continue
    lessons += 1
    if (q.starter !== null) { sp += q.pupils; sr += q.starter }
    if (q.exit !== null) { ep += q.pupils; er += q.exit }
  }
  return { starter: sp > 0 ? Math.round((sr / sp) * 100) : null, exit: ep > 0 ? Math.round((er / ep) * 100) : null, lessons }
}

export function cleanJudgement(raw: unknown): Judgement | null {
  return typeof raw === 'string' && (JUDGEMENTS as string[]).includes(raw) ? raw as Judgement : null
}

/** A staff note: one line, 280 characters. Null when empty. */
export function cleanNote(raw: unknown): string | null {
  if (typeof raw !== 'string') return null
  const s = raw.replace(/\s+/g, ' ').trim().slice(0, 280)
  return s || null
}

/** A level count read back out of a stored mark, or null. */
export function levelsIn(marks: Record<string, unknown>, code: string): LevelCount | null {
  const got = cleanLevels(marks, [code])[code]
  return got ?? null
}

/** The scheme's own headline measure: the share of counted pupils at SOLO 4
 *  or above, as a whole percentage. Null when nobody was counted. */
export function shareAtFourOrAbove(l: LevelCount): number | null {
  const total = l.s3 + l.s4 + l.s5
  return total > 0 ? Math.round(((l.s4 + l.s5) / total) * 100) : null
}

// --------------------------------------------------------------- lessons ---

/** A French lesson's key in the record: unit and lesson, "y3-ht2/3". */
export function frLessonKey(unitKey: string, n: number): string {
  return `${unitKey}/${n}`
}

export function parseFrLessonKey(key: string): { unitKey: string; n: number } | null {
  const m = key.match(/^(y\d+-ht\d+)\/(\d{1,2})$/)
  return m ? { unitKey: m[1], n: Number(m[2]) } : null
}

// ------------------------------------------------------------- summaries ---

const live = (d: Delivery) => d.groups.length > 0

/** Every class that appears in a set of deliveries, in a steady order. */
export function classesIn(deliveries: Delivery[]): string[] {
  const out = new Set<string>()
  for (const d of deliveries.filter(live)) for (const g of d.groups) out.add(g)
  return [...out].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
}

/** The deliveries for one class, or all of them when no class is given. */
export function forClass(deliveries: Delivery[], group: string | null): Delivery[] {
  return group ? deliveries.filter(d => d.groups.includes(group)) : deliveries
}

/** The first date each lesson was delivered, by lesson key. One delivery of a
 *  lesson and five deliveries of it are both "delivered": a count of lessons
 *  counts lessons, never rows. */
export function deliveredLessons(deliveries: Delivery[]): Map<string, string> {
  const out = new Map<string, string>()
  for (const d of deliveries) {
    const had = out.get(d.lessonKey)
    if (!had || d.deliveredOn < had) out.set(d.lessonKey, d.deliveredOn)
  }
  return out
}

/** The most recent level count recorded for one statement in one unit, with
 *  the date it was recorded. "Most recent" because a class is counted again
 *  as it moves, and the latest count is where it is now. Counts from several
 *  classes on the same latest lessons are added together. */
export function latestLevels(deliveries: Delivery[], unitKey: string, code: string): { levels: LevelCount; on: string } | null {
  // The latest count for each class, then the classes added together. A
  // delivery to two classes with one count is one count, so each delivery is
  // added once however many classes it names.
  const perClass = new Map<string, { id: string; levels: LevelCount; on: string; at: string }>()
  for (const d of deliveries) {
    const key = parseFrLessonKey(d.lessonKey)
    if (!key || key.unitKey !== unitKey) continue
    const l = levelsIn(d.marks, code)
    if (!l) continue
    for (const g of d.groups) {
      const had = perClass.get(g)
      if (!had || d.deliveredOn > had.on || (d.deliveredOn === had.on && d.createdAt > had.at)) perClass.set(g, { id: d.id, levels: l, on: d.deliveredOn, at: d.createdAt })
    }
  }
  if (perClass.size === 0) return null
  const sum: LevelCount = { s3: 0, s4: 0, s5: 0 }
  const counted = new Set<string>()
  let on = ''
  for (const v of perClass.values()) {
    if (v.on > on) on = v.on
    if (counted.has(v.id)) continue
    counted.add(v.id)
    sum.s3 += v.levels.s3; sum.s4 += v.levels.s4; sum.s5 += v.levels.s5
  }
  return { levels: sum, on }
}

// ------------------------------------------------------------------- csv ---

/** One cell of a spreadsheet file. Quoted when it must be, and a cell that
 *  would open as a formula (it starts with = + - or @, which a note typed by a
 *  teacher can) is given a leading apostrophe so a spreadsheet shows it as
 *  text and runs nothing. */
export function csvCell(raw: unknown): string {
  let s = raw === null || raw === undefined ? '' : String(raw).replace(/\r?\n/g, ' ')
  if (/^[=+\-@\t]/.test(s)) s = `'${s}`
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Rows as a file a spreadsheet opens, with the mark that makes Excel read
 *  it as UTF-8 so an accent in a class or lesson name survives. */
export function csvFile(rows: unknown[][]): string {
  return '\uFEFF' + rows.map(r => r.map(csvCell).join(',')).join('\r\n') + '\r\n'
}
