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
// THE MEDIA stays on her host for now (186 MB for the first two full units,
// and still changing). Every URL to a deck, song or sheet goes through
// mediaUrl() below, so moving them to our own storage is one constant.

export type Level = 'class' | 'adapted' | 'inclusion'
export type FileKind = 'sheet' | 'inclusion' | 'game' | 'assess' | 'teacher' | 'mat' | 'activity' | string
export type SheetFile = { t: string; f: string; lv?: Level; kind?: FileKind; lessons?: number[] }
export type Song = { t: string; f: string; poster?: string }
export type Statement = { code: string; nc: string; pupil: string; s3: string; s4: string; idea?: string }
export type AssessPlan = { code: string; lessons: number[]; how: string; s5?: string; what: string; files?: string[] }

export type DeckLesson = {
  n: number
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
  whatICanDo?: SheetFile[]
  wordMats?: SheetFile[]
  activities?: SheetFile[]
  assessment?: SheetFile[]
  teacher?: SheetFile[]
  songs?: Song[]
}

type Raw = {
  origin: string
  years: { year: number; units: { ht: number; fr: string; en: string; slug?: string }[] }[]
  units: Record<string, DeckUnit>
  curriculum: { units: Record<string, PlanUnit>; order: string[]; solo: string[]; nc: Record<string, string> }
  sequence: Record<string, [string, number][]>
}

const data = raw as unknown as Raw

export const FR_ORIGIN = data.origin

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

/** The ready plan lessons as one list, with the classroom set joined where it exists. */
export type FrenchLesson = { n: number; title: string; detail: string; deck: DeckLesson | null }

export function lessonsOf(u: FrenchUnit): FrenchLesson[] {
  if (u.deck) {
    return u.deck.lessons.map(l => ({ n: l.n, title: l.fr, detail: l.ican, deck: l }))
  }
  return (u.plan.lessons ?? []).map(([title, detail], i) => ({ n: i + 1, title, detail, deck: null }))
}

export function frenchLesson(u: FrenchUnit, n: number): FrenchLesson | null {
  return lessonsOf(u).find(l => l.n === n) ?? null
}

/** The slide titles of a deck, in order, which the lesson page shows as its running order. */
export function deckSequence(slides: string | undefined): string[] {
  if (!slides) return []
  return (data.sequence[slides] ?? []).map(([title]) => title)
}

/** Every deck, song and sheet URL. Sheets live in the unit's print folder. */
export function mediaUrl(slug: string, file: string, kind: 'deck' | 'sheet'): string {
  const path = kind === 'sheet' ? `print/${file}` : file
  return `${FR_ORIGIN}/units/${encodeURIComponent(slug)}/${path.split('/').map(encodeURIComponent).join('/')}`
}

/** The KS2 languages statements, by code (L1, S2, R3, W4). */
export const KS2_STATEMENTS: Record<string, string> = data.curriculum.nc

export const SOLO_LEVELS: string[] = data.curriculum.solo

export const LEVEL_LABEL: Record<Level, string> = {
  class: 'Class',
  adapted: 'Adapted',
  inclusion: 'Inclusion',
}

/** Sheets grouped by level, class first, so a page lists the three versions together. */
export function byLevel(files: SheetFile[]): [Level, SheetFile[]][] {
  const order: Level[] = ['class', 'adapted', 'inclusion']
  return order
    .map(lv => [lv, files.filter(f => (f.lv ?? 'class') === lv)] as [Level, SheetFile[]])
    .filter(([, fs]) => fs.length > 0)
}
