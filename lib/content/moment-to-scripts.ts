// ── FROM A MOMENT TO THE WORDS FOR IT ───────────────────────────────────────
//
// A moment card's last slide hands a parent to the scripts for that moment.
// It sent `?topic=<moment category>`, and the scripts page matched that
// against the SCRIPT categories by substring. The two taxonomies were never
// the same list:
//
//   moments   Morning, Evening, Food, Transitions, Emotions, Digital, School
//   scripts   everyday-routines, screen-time, social-media, gaming,
//             staying-safe, mood-confidence, family-rules, school-and-ai
//
// Only "school" is a substring of anything. Checked against the live table on
// 13 October 2026: 10 of 89 active moments found a single script. The other
// 79 handed off to a page with no "scripts for this moment" at all, so the
// loop the card was built to close stayed open on nine moments in ten. And the
// ten that matched got all 33 school-and-ai scripts, every age at once, under
// a heading promising the scripts "for this moment".
//
// ── WHY RELEVANCE AND NOT JUST THE RIGHT SHELF ──────────────────────────────
//
// The first fix mapped each moment category to its shelves and ranked by
// sort_order. Every moment landed somewhere, and the picks were wrong in a way
// a parent would notice in a second: "Won't get out of bed" offered "School
// bag not packed", "Won't eat dinner" offered "Older sibling being unkind".
// Right shelf, wrong script.
//
// So the moment's own words choose. Its title (weighted three times, because
// the title is how the parent named the problem), its science brief, DiGi's
// opener and its solutions are scored against every script's title and
// situation, TF IDF and cosine, the plainest thing that works. The shelf map
// survives as a boost rather than a fence, because some of the best answers
// live on a neighbouring shelf ("Phone before school" is filed under Morning
// and its best script is under screen time).
//
// Measured on the live data, same day: "Morning TV battle" now leads with
// "The Morning TV Standoff", "Phone before school" with "The Before School
// Phone Argument", "Anger and tantrums" with "The full body tantrum", "Won't
// eat dinner" with "They will not eat what you have made".
//
// ── THE CHILD'S STAGE, AND WHEN TO SAY NOTHING ──────────────────────────────
//
// Only the open child's stage and the stage either side are considered, and
// the child's own stage is preferred unless a neighbour is clearly better. A
// strong match written for a sixteen year old is the wrong script for a six
// year old.
//
// Below a floor score the match is noise, and showing noise under "for this
// moment" is a promise the page cannot keep. When nothing clears the floor the
// page gets the two closest and an honest heading ("The closest scripts")
// instead of a confident one.
//
// No imports, so a guard can load it without the app's module aliases.

export type ScriptForMoment = {
  id: string
  stage_id: string
  title: string
  situation: string
  category: string | null
  sort_order: number
}

export type MomentText = {
  title: string
  category: string
  science_brief?: string | null
  digi_opener?: string | null
  solutions?: string[] | null
}

export type MomentScripts = {
  scripts: ScriptForMoment[]
  /** True when every script shown cleared the floor. False means "closest". */
  confident: boolean
}

/** Shelves that tend to answer each kind of moment: a boost, not a fence. */
export const MOMENT_TO_SCRIPT_CATEGORIES: Record<string, string[]> = {
  morning: ['everyday-routines', 'screen-time'],
  evening: ['everyday-routines', 'screen-time'],
  food: ['everyday-routines'],
  transitions: ['screen-time', 'everyday-routines'],
  emotions: ['mood-confidence', 'family-rules'],
  digital: ['screen-time', 'social-media', 'gaming', 'staying-safe'],
  school: ['school-and-ai'],
}

/** Four, because the block it feeds is the Good Inside "4 Scripts" sheet. */
export const MOMENT_SCRIPT_LIMIT = 4

// Tuned on the live data, 13 October 2026. The median best match scores about
// 0.29; below about 0.12 the top pick is a shared common word and no more.
const FLOOR = 0.12
// A script must score at least this share of the best one to sit beside it,
// so one strong match is not padded out with three weak ones.
const RELATIVE = 0.35
const SHELF_BOOST = 1.4
// What one stage of distance costs, in score. Small enough that "They will
// not eat what you have made", written for Builder, still leads for an
// Explorer whose own stage has nothing close.
const STAGE_PENALTY = 0.08

const STAGES = ['foundation', 'builder', 'explorer', 'shaper', 'independent']

const STOP = new Set((
  'a an the and or but for with when your you they them their what that this from into about just will ' +
  'have does dont cant wont child children kids kid is are was were be been it its of to in on at as by ' +
  'if so not no do get got can could would should may might there here how why who which than then also ' +
  'more most very really much many some any all every each one two make makes made like know need want ' +
  'feel feels felt time times things thing way ways help helps even still often usually own both while ' +
  'after before because gets getting being doing going'
).split(' '))

// A light stem: enough that "tantrums" meets "tantrum" and "refusing" meets
// "refuses", short of a real stemmer this file does not need.
const stem = (w: string) => w.replace(/(ings|ing|edly|ed|ies|es|s|ly)$/, '').slice(0, 7)

function tokens(text: string | null | undefined): string[] {
  return (text ?? '').toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP.has(w))
    .map(stem)
    .filter(w => w.length >= 3)
}

type Vec = Map<string, number>

function unit(words: string[], idf: (w: string) => number): Vec {
  const v: Vec = new Map()
  for (const w of words) v.set(w, (v.get(w) ?? 0) + idf(w))
  let n = 0
  for (const x of v.values()) n += x * x
  n = Math.sqrt(n) || 1
  for (const [k, x] of v) v.set(k, x / n)
  return v
}

function cosine(a: Vec, b: Vec): number {
  let s = 0
  for (const [k, x] of a) s += x * (b.get(k) ?? 0)
  return s
}

/**
 * The scripts for one moment, best first, at most MOMENT_SCRIPT_LIMIT, for
 * the open child's stage. Runs over the whole library on each call; 342
 * short documents is a few milliseconds and not worth a cache.
 */
export function scriptsForMoment(
  scripts: ScriptForMoment[],
  moment: MomentText,
  stageId: string | null,
): MomentScripts {
  if (scripts.length === 0) return { scripts: [], confident: false }

  // The title counts twice on the script side, as it does on the moment side
  // (three times there), because a title is the problem named in a few words.
  const docs = scripts.map(s => [...tokens(s.title), ...tokens(s.title), ...tokens(s.situation)])
  const df = new Map<string, number>()
  for (const doc of docs) for (const w of new Set(doc)) df.set(w, (df.get(w) ?? 0) + 1)
  const N = docs.length
  const idf = (w: string) => Math.log((N + 1) / ((df.get(w) ?? 0) + 1)) + 1

  const t = tokens(moment.title)
  const momentVec = unit([
    ...t, ...t, ...t,
    ...tokens(moment.science_brief),
    ...tokens(moment.digi_opener),
    ...(moment.solutions ?? []).flatMap(s => tokens(String(s))),
  ], idf)

  const shelves = MOMENT_TO_SCRIPT_CATEGORIES[moment.category.toLowerCase().trim()] ?? []
  const home = stageId ? STAGES.indexOf(stageId) : -1

  const ranked = scripts
    .map((s, i) => {
      const gap = home >= 0 ? Math.abs(STAGES.indexOf(s.stage_id) - home) : 0
      const raw = cosine(momentVec, unit(docs[i], idf))
      const score = raw * (s.category && shelves.includes(s.category) ? SHELF_BOOST : 1)
      return { s, gap, score, rank: score - gap * STAGE_PENALTY }
    })
    .filter(x => x.gap <= 1 && x.score > 0)
    .sort((a, b) => b.rank - a.rank || a.s.sort_order - b.s.sort_order)

  if (ranked.length === 0) return { scripts: [], confident: false }

  const best = ranked[0].score
  if (best < FLOOR) {
    return { scripts: ranked.slice(0, 2).map(x => x.s), confident: false }
  }
  const strong = ranked.filter(x => x.score >= Math.max(FLOOR, best * RELATIVE))
  return { scripts: strong.slice(0, MOMENT_SCRIPT_LIMIT).map(x => x.s), confident: true }
}
