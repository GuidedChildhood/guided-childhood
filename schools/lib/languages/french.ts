import raw from './fr.json'

// THE FRENCH SCHEME, READ (9 November 2026).
//
// fr.json is written by scripts/languages/sync-french.mjs from the author's own
// site, where the scheme is still being built. Nothing here is retyped: every
// page under /languages/fr is generated from this file, so when a unit is
// finished on her site, one sync brings it across.
//
// TWO SHAPES IN ONE FILE, kept as her site keeps them:
//   curriculum.units  every unit of Years 3 and 4 (12), keyed y3-ht1 and so on:
//                     the plan, words, I can, statements. Five are ready.
//   units             the units with the full classroom set, keyed by slug:
//                     interactive decks, songs and the printable sheets.
//
// THE MEDIA is mirrored into our own storage (scripts/languages/
// mirror-french-media.mjs) and served through /languages/fr/media, which
// falls back to her site for anything not copied yet. Every URL to a deck,
// song or sheet goes through mediaUrl() below.

export type Level = 'challenge' | 'class' | 'adapted' | 'inclusion'
export type FileKind = 'sheet' | 'inclusion' | 'game' | 'assess' | 'teacher' | 'mat' | 'activity' | string
// `ans` is the sheet's answer sheet, where the author has made one (13 November 2026).
export type SheetFile = { t: string; f: string; lv?: Level; kind?: FileKind; lessons?: number[]; ans?: string }
export type Song = { t: string; f: string; poster?: string }
export type Statement = { code: string; nc: string; pupil: string; s3: string; s4: string; idea?: string }
export type AssessPlan = { code: string; lessons: number[]; how: string; s5?: string; what: string; files?: string[] }

export type DeckLesson = {
  n: number
  // A culture lesson (Christmas, say) sits outside the unit's numbered lessons
  // and is not assessed. The scheme marks it by naming what it is.
  culture?: string
  fr: string
  en: string
  ican: string
  words: string
  slides?: string
  songs?: number[]
  book?: string
  files?: SheetFile[]
}

type PlanUnit = {
  year: string
  ht: number | string
  ready: boolean
  unit: string
  en: string
  theme?: string
  summary?: string
  sound?: string
  soundHint?: string
  soundSays?: string
  phonicsNote?: string
  grammar?: string
  culture?: string
  lessons?: [string, string][]
  ican?: string[]
  codes?: Statement[]
  vocab?: [string, string][]
  exit?: string[]
}

type DeckUnit = {
  year: number
  ht: number
  fr: string
  en: string
  summary?: string
  assessLesson?: number
  assessPlan?: AssessPlan[]
  sound?: string
  soundHint?: string
  phonics?: string
  lessons: DeckLesson[]
  // Her data holds each of these as a list, or as one object when there is
  // only one file (whatICanDo is). Read them through sheetList(), never raw.
  whatICanDo?: SheetFile[] | SheetFile
  wordMats?: SheetFile[] | SheetFile
  activities?: SheetFile[] | SheetFile
  assessment?: SheetFile[] | SheetFile
  teacher?: SheetFile[] | SheetFile
  // Extra mats for pupils and cards and posters for the wall. These live in
  // the scheme's shared extras folder, not the unit's own: see extrasUrl().
  extras?: SheetFile[]
  displays?: SheetFile[]
  songs?: Song[]
}

type Row2 = [string, string]
type Row3 = [string, string, string]

/** The author's long form text about the scheme: what it is for, how a lesson
 *  runs, how learning builds, how it is assessed (her curriculum_page.js). */
export type FrenchPage = {
  intro?: string
  intent?: Row2[]
  pillars?: string
  lesson?: Row3[]
  research?: Row2[]
  vocabulary?: Row2[]
  activities?: { phonics?: Row2[]; lesson?: Row2[]; assess?: Row2[] }
  phonics?: { y3?: Row3[]; y4?: Row3[]; note?: string }
  grammar?: { y3?: string; y4?: string }
  audience?: string
  books?: string
  culture?: { y3?: Row2[]; y4?: Row2[] }
  inclusion?: Row2[]
  assessment?: Row2[]
  impact?: Row2[]
  directAssociation?: Row2[]
  pupilResources?: Row2[]
  formalAssessment?: FormalAssessment
}

/** THE CHECKPOINT MAP (13 November 2026). The author settled how the scheme is
 *  formally assessed: each code gets one judgement a year, in a named half
 *  term, on a named task, against three descriptors written for that task.
 *  Everything else a unit touches is formative. */
export type FormalTask = { checkpoint: string; code: string; task: string }
export type FormalDescriptor = { year: number; code: string; task: string; solo3: string; solo4: string; solo5: string }
export type FormalAssessment = {
  checkpoints?: { year: number; tasks: FormalTask[] }[]
  descriptors?: FormalDescriptor[]
  phonicsChecks?: { year: number; timing: string; purpose: string }[]
  annualL2?: { year: number; timing: string; purpose: string }[]
}

/** The short pieces that live in her page script: her reasons, how each
 *  statement grows from Year 3 to Year 4, the two class toys, the four levels. */
export type FrenchHandbook = {
  think?: Row2[] | null
  grow?: Record<string, string> | null
  marie?: Row2[] | null
  levels?: Row2[] | null
  progressShows?: Row2[] | null
  shortAnswer?: string | null
  believe?: string | null
  goodGame?: string | null
  everyClass?: { label: string; files: SheetFile[] }[] | null
  pupilGames?: { sites: { year: number; url: string }[]; qr: string | null } | null
}

type Raw = {
  origin: string
  years: { year: number; units: { ht: number; fr: string; en: string; slug?: string }[] }[]
  units: Record<string, DeckUnit>
  curriculum: { units: Record<string, PlanUnit>; order: string[]; solo: string[]; nc: Record<string, string> }
  codes?: Record<string, { codes?: Statement[] }>
  sequence: Record<string, [string, number][]>
  page?: FrenchPage | null
  handbook?: FrenchHandbook | null
}

const data = raw as unknown as Raw

export const FR_ORIGIN = data.origin

/** The handbook: her own words about the scheme, for a head or a subject lead. */
export const FR_PAGE: FrenchPage = data.page ?? {}
export const FR_HANDBOOK: FrenchHandbook = data.handbook ?? {}

/** "a → b → c" as its steps. She writes a progression as one arrowed line. */
export function flowSteps(s: string | undefined): string[] {
  return (s ?? '').split('→').map(x => x.trim()).filter(Boolean)
}

/** The order the scheme lists its statements in: listening, speaking, reading, writing, grammar. */
export const CODE_ORDER = ['L1', 'L2', 'S1', 'S2', 'S3', 'S4', 'R1', 'R2', 'R3', 'W1', 'W2', 'G1']

/** A file list from her data as a real list, whichever of the two shapes it came in. */
export function sheetList(v: SheetFile[] | SheetFile | undefined): SheetFile[] {
  return Array.isArray(v) ? v : v ? [v] : []
}

/** One unit, both halves joined: the plan for every unit, the classroom set where it exists. */
export type FrenchUnit = {
  key: string          // y3-ht2, the URL segment
  year: number         // 3
  ht: number           // 2
  fr: string
  en: string
  ready: boolean
  plan: PlanUnit
  slug: string | null  // the author's folder, where the decks and sheets live
  deck: DeckUnit | null
}

const keyOf = (year: number, ht: number) => `y${year}-ht${ht}`

export const FRENCH_UNITS: FrenchUnit[] = data.curriculum.order.map(key => {
  const plan = data.curriculum.units[key]
  const year = Number(String(plan.year).replace(/\D/g, ''))
  const ht = Number(plan.ht)
  const listed = data.years.find(y => y.year === year)?.units.find(u => u.ht === ht)
  const slug = listed?.slug ?? null
  return {
    key: keyOf(year, ht),
    year,
    ht,
    fr: plan.unit,
    en: plan.en,
    ready: plan.ready === true,
    plan,
    slug,
    deck: slug ? data.units[slug] ?? null : null,
  }
})

export const FRENCH_YEARS = [...new Set(FRENCH_UNITS.map(u => u.year))].sort()

export function frenchUnit(key: string): FrenchUnit | null {
  return FRENCH_UNITS.find(u => u.key === key) ?? null
}

/** The ready plan lessons as one list, with the classroom set joined where it exists.
 *  `culture` is set on a culture lesson, which the scheme keeps outside the
 *  unit's numbered lessons: it is taught, but it is not one of the six and it
 *  is not assessed. */
export type FrenchLesson = { n: number; title: string; detail: string; deck: DeckLesson | null; culture: string | null }

export function lessonsOf(u: FrenchUnit): FrenchLesson[] {
  if (u.deck) {
    return u.deck.lessons.map(l => ({ n: l.n, title: l.fr, detail: l.ican, deck: l, culture: l.culture ?? null }))
  }
  return (u.plan.lessons ?? []).map(([title, detail], i) => ({ n: i + 1, title, detail, deck: null, culture: null }))
}

/** The numbered lessons of a unit, without its culture lessons. */
export function teachingLessons(u: FrenchUnit): FrenchLesson[] {
  return lessonsOf(u).filter(l => !l.culture)
}

/** A unit's culture lessons. */
export function cultureLessons(u: FrenchUnit): FrenchLesson[] {
  return lessonsOf(u).filter(l => !!l.culture)
}

/** What a lesson is called in a list: "Lesson 3", or what a culture lesson is about. */
export function lessonLabel(l: FrenchLesson): string {
  return l.culture ? l.culture : `Lesson ${l.n}`
}

export function frenchLesson(u: FrenchUnit, n: number): FrenchLesson | null {
  return lessonsOf(u).find(l => l.n === n) ?? null
}

/** The slide titles of a deck, in order, which the lesson page shows as its running order. */
export function deckSequence(slides: string | undefined): string[] {
  if (!slides) return []
  return (data.sequence[slides] ?? []).map(([title]) => title)
}

/** A lesson plan's sequence: the slide titles as a teacher would say them,
 *  each once, without the housekeeping slides (the WALT, the title). This is
 *  how the scheme's own printed plan lists them. */
export function planSequence(slides: string | undefined): string[] {
  const named = deckSequence(slides).map(t => t.replace(/Qui est-ce\s*\?/gi, 'Guess Who!').replace(/^(colour )?loto$/i, 'Bingo'))
  return named.filter((t, i, a) => a.indexOf(t) === i && !/^(walt|lq|li|lo|title)$/i.test(t))
}

/** The statements a unit assesses, for every unit of the two years, ready or not. */
export function assessedCodes(u: FrenchUnit): Statement[] {
  return data.codes?.[u.key]?.codes ?? u.plan.codes ?? []
}

/** What is assessed in one lesson: the unit's assessment plan, narrowed to it. */
export function assessedIn(u: FrenchUnit, n: number): AssessPlan[] {
  return (u.deck?.assessPlan ?? []).filter(p => (p.lessons ?? []).includes(n))
}

/** The statements a teacher is asked to count pupils against after one lesson.
 *  The ones the scheme assesses in that lesson, and in the unit's last lesson
 *  every statement of the unit, because that is when the What I can do sheet
 *  is finished. A culture lesson is not assessed, so it asks for none. */
export function codesToRecord(u: FrenchUnit, l: FrenchLesson): Statement[] {
  if (l.culture) return []
  const all = assessedCodes(u)
  const numbered = teachingLessons(u)
  const last = u.deck?.assessLesson ?? numbered[numbered.length - 1]?.n
  if (l.n === last) return all
  const today = new Set(assessedIn(u, l.n).map(a => a.code))
  return all.filter(c => today.has(c.code))
}

/** The unit's extra activities that belong to one lesson. */
export function activitiesFor(u: FrenchUnit, n: number): SheetFile[] {
  return sheetList(u.deck?.activities).filter(a => !a.lessons || a.lessons.includes(n))
}

/** Every deck, song and sheet URL. Sheets live in the unit's print folder.
 *  All of them go through /languages/fr/media, which serves our own copy and
 *  falls back to the author's site for a file not mirrored yet. */
export function mediaUrl(slug: string, file: string, kind: 'deck' | 'sheet'): string {
  const path = kind === 'sheet' ? `print/${file}` : file
  return `/languages/fr/media/${encodeURIComponent(slug)}/${path.split('/').map(encodeURIComponent).join('/')}`
}

/** A sheet in the scheme's shared extras folder: the extra mats, the display
 *  cards and posters, the sheets for every class. Same route, its own folder. */
export const EXTRAS_FOLDER = 'extras'
export function extrasUrl(file: string): string {
  return `/languages/fr/media/${EXTRAS_FOLDER}/${encodeURIComponent(file)}`
}

/** The author's pupil games site for one year, if she has one. Pupils play at
 *  home with only the units their class has met. It is her site, not ours. */
export function pupilGames(year: number): string | null {
  const url = data.handbook?.pupilGames?.sites.find(s => s.year === year)?.url
  return url && /^https:\/\/lets-play-french-y\d\.pages\.dev\/$/.test(url) ? url : null
}
export const PUPIL_GAMES_QR: string | null = data.handbook?.pupilGames?.qr ?? null
export const EVERY_CLASS = data.handbook?.everyClass ?? []

const FORMAL: FormalAssessment = data.page?.formalAssessment ?? {}

/** The formal tasks of one year, in the order the year meets them. */
export function formalTasks(year: number): (FormalTask & { descriptor: FormalDescriptor | null })[] {
  const tasks = FORMAL.checkpoints?.find(c => c.year === year)?.tasks ?? []
  return [...tasks]
    .sort((a, b) => a.checkpoint.localeCompare(b.checkpoint))
    .map(t => ({ ...t, descriptor: FORMAL.descriptors?.find(x => x.year === year && x.code === t.code) ?? null }))
}

/** The codes formally judged in one unit: those whose checkpoint is this half term. */
export function checkpointTasks(u: FrenchUnit): ReturnType<typeof formalTasks> {
  return formalTasks(u.year).filter(t => t.checkpoint === `HT${u.ht}`)
}

/** Where a code a unit practises is formally judged that year, as "HT4". Null if it is not on the map. */
export function checkpointOf(year: number, code: string): string | null {
  return FORMAL.checkpoints?.find(c => c.year === year)?.tasks.find(t => t.code === code)?.checkpoint ?? null
}

export const HAS_CHECKPOINTS = (FORMAL.checkpoints ?? []).some(c => c.tasks.length > 0)
export const PHONICS_CHECKS = FORMAL.phonicsChecks ?? []
export const ANNUAL_L2 = FORMAL.annualL2 ?? []

/** The KS2 languages statements, by code (L1, S2, R3, W4). */
export const KS2_STATEMENTS: Record<string, string> = data.curriculum.nc

export const SOLO_LEVELS: string[] = data.curriculum.solo

/** "SOLO 4 (relational)": the scheme records each pupil at SOLO 3, 4 or 5, and
 *  these are its own names for them. They are not relabelled as "expected" or
 *  "greater depth", which would be our reading of her model, not her model. */
export function soloName(level: 3 | 4 | 5): string {
  const name = SOLO_LEVELS[level - 1]
  return name ? `SOLO ${level} (${name.toLowerCase()})` : `SOLO ${level}`
}

export const LEVEL_LABEL: Record<Level, string> = {
  challenge: 'Challenge',
  class: 'Class',
  adapted: 'Adapted',
  inclusion: 'Inclusion',
}

/** What each letter of a statement code stands for (L1 is a listening statement). */
export const SKILL_LABEL: Record<string, string> = { L: 'Listening', S: 'Speaking', R: 'Reading', W: 'Writing', G: 'Grammar' }

/** Sheets grouped by level, class first, so a page lists the three versions together. */
export function byLevel(files: SheetFile[]): [Level, SheetFile[]][] {
  const order: Level[] = ['class', 'challenge', 'adapted', 'inclusion']
  return order
    .map(lv => [lv, files.filter(f => (f.lv ?? 'class') === lv)] as [Level, SheetFile[]])
    .filter(([, fs]) => fs.length > 0)
}
