// THE FRENCH PLANET FRIENDS (17 November 2026).
//
// Justin: "a French version of our Planet Friends ... our Planet Friends
// dressed up". The scheme's author runs her lessons with two class toys, a
// shy teddy called Marie and a loud toy duck called Pierre: pupils whisper
// with one and shout with the other, and holding one up sets the volume of a
// song. On our pages those two parts are played by two of our own friends:
//
//   the quiet one  NOVA   Still register, the restraint is the joke
//   the loud one   BLOOP  Stage 2, ages 8 to 10, exactly Years 3 and 4, and
//                         hide and seek is Bloop's own running joke
//
// The reasons are in plans/2026-11-17-french-planet-friends-plan.md.
//
// WHY A MAPPING LAYER AND NOT AN EDIT. fr.json is rewritten every night by
// scripts/languages/sync-french.mjs from her site, so a name changed there
// would be back by morning. Instead french.ts passes her prose through
// friendly() as it is read. Her decks, PDFs and slide titles are her files
// and are not touched (the slide titles are listed verbatim, so a running
// order still matches the board). scripts/check-french-friends.mjs fails if
// either name reaches a page through our copy.
//
// Pure TypeScript with no imports, so the guard can run it directly.

export const QUIET_FRIEND = 'nova' as const
export const LOUD_FRIEND = 'bloop' as const
export const QUIET_NAME = 'Nova'
export const LOUD_NAME = 'Bloop'

// THE FRENCH TOUCH (17 November 2026, on Justin's yes: "add French touches").
// Each friend dressed up, made image to image FROM the approved cutout with
// only the accessory in the prompt (GPT Image 2.6, transparent, 1 credit each,
// two variants per friend, checked against the cutout, all four on model):
//   Nova   pastel blue and white knitted scarf          job 08aaf000
//   Bloop  navy beret and red and white neckerchief      job 15bb5703
// The unused variants are a17c43c2 and 616e3521. The same pose as the cutout,
// so the motion below is unchanged and the dressed friend is used in every
// moment rather than swapping to an undressed face for the shout.
// The originals are on the CDN (hf_20261117_103121_08aaf000, hf_20261117_103125_15bb5703);
// the app serves copies cropped tight to the friend, 512 square, so they fill
// the plate and read from the back row.
export const FRENCH_ART = {
  quiet: '/digi-squad/french/nova-french.png',
  loud: '/digi-squad/french/bloop-french.png',
}

/** The pair as our copy names them. */
export const FRIENDS_PAIR = `${QUIET_NAME} and ${LOUD_NAME}`

/** The anchor the approach page has always used, kept so old links land. */
export const FRIENDS_ANCHOR = 'marie-and-pierre'

// Whole sentences first, where a name swap alone would leave a teddy or a
// duck behind, or claim our friends began as her class mascot. Then the
// pair, then each name on its own, so a sentence she adds tomorrow still
// comes out with our friends in it.
const SENTENCES: [RegExp, string][] = [
  [/Two real toys with their own personalities\.\s*Marie, a teddy, is shy, timid, calm and quiet\.\s*Her best friend Pierre, a toy duck, is loud, cheeky and outgoing\./,
    `Two Planet Friends, dressed up for French, each with a personality of their own. ${QUIET_NAME} is shy, timid, calm and quiet. ${QUIET_NAME}'s best friend ${LOUD_NAME} is loud, cheeky and outgoing.`],
  [/They began as a class mascot\.\s*It went so well that they were given personalities\./,
    'In the classrooms where the scheme was written, two class toys played these parts. It went so well that they were given personalities.'],
  [/Two toys who only speak French/g, 'Two Planet Friends who only speak French'],
  [/The two toys/g, 'The two friends'],
  [/Marie, a teddy,?/g, QUIET_NAME],
  [/Pierre, a toy duck,?/g, LOUD_NAME],
]

const NAMES: [RegExp, string][] = [
  [/Marie and Pierre/g, FRIENDS_PAIR],
  [/Pierre and Marie/g, `${LOUD_NAME} and ${QUIET_NAME}`],
  [/Marie or Pierre/g, `${QUIET_NAME} or ${LOUD_NAME}`],
  [/\bMarie\b/g, QUIET_NAME],
  [/\bPierre\b/g, LOUD_NAME],
]

/** Her prose with our two friends in it. Anything without either name comes back unchanged. */
export function friendly(s: string): string
export function friendly(s: string | null | undefined): string | null | undefined
export function friendly(s: string | null | undefined): string | null | undefined {
  // The mascot line names neither toy, so it is caught by its own words.
  if (!s || !/Marie|Pierre|toys?\b|class mascot/.test(s)) return s
  let out = s
  for (const [re, to] of SENTENCES) out = out.replace(re, to)
  for (const [re, to] of NAMES) out = out.replace(re, to)
  return out
}

// Keys that hold a file name or an address, never prose. Left exactly as her
// data has them, so a file that happened to carry a name would still open.
const PATH_KEYS = new Set(['f', 'ans', 'poster', 'slides', 'url', 'qr', 'phonicsCheck'])

/** The same, through any shape her data takes: strings, lists, rows, objects. */
export function friendlyDeep<T>(v: T): T {
  if (typeof v === 'string') return friendly(v) as T
  if (Array.isArray(v)) return v.map(friendlyDeep) as T
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) out[k] = PATH_KEYS.has(k) ? x : friendlyDeep(x)
    return out as T
  }
  return v
}

// THE SLIDE NOTE (17 November 2026, Justin: "this needs to follow which
// characters you decide"). Her decks are hers and still name the two toys,
// so a lesson whose slides do gets one line telling the teacher which friend
// to use. It is built here, from her names, because this is the one file the
// guard lets say them. It follows QUIET_NAME and LOUD_NAME, so a change of
// friend changes the note too.
const HER_QUIET = 'Marie'
const HER_LOUD = 'Pierre'

/** The teacher's line for a deck whose slide titles name either toy, or null. */
export function slideNote(titles: string[]): string | null {
  const quiet = titles.some(t => t.includes(HER_QUIET))
  const loud = titles.some(t => t.includes(HER_LOUD))
  if (!quiet && !loud) return null
  if (quiet && loud) return `The slides still call them ${HER_QUIET} and ${HER_LOUD}. In class, ${LOUD_NAME} hides and the class answers ${QUIET_NAME}.`
  if (loud) return `The slides still say « Où est ${HER_LOUD} ? ». In class, hide ${LOUD_NAME} and ask « Où est ${LOUD_NAME} ? ».`
  return `The slides still say ${HER_QUIET}. In class, the class answers ${QUIET_NAME}.`
}

/** Does this slide title name one of the toys? The running order marks it with our friend. */
export function friendInTitle(title: string): typeof QUIET_FRIEND | typeof LOUD_FRIEND | null {
  if (title.includes(HER_LOUD)) return LOUD_FRIEND
  if (title.includes(HER_QUIET)) return QUIET_FRIEND
  return null
}
