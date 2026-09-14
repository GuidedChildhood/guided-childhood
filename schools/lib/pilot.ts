// THE PILOT, in numbers a page, a guard and an email can all read.
//
// Justin, 13 September 2026: five schools, one code per school, a free term,
// and the invoice form pre filled when the term ends so a pilot turns into a
// licence in one click. The five lives here and nowhere else: the pilot page
// says "the first five", the places left are counted against it
// (pilot-places.ts), and the home page reads it rather than typing it.
//
// No runtime imports on purpose: scripts/check-pilot-door.mjs loads this file
// under plain node, and the database client next door cannot load there.
export const PILOT_PLACES = 5
export const PILOT_TERM_WEEKS = 12

// The letterbox marker for a pilot request (schools.invoice_requests, band).
// The parent app's cron reads the same word to know it is a lead and not an
// order (app/api/cron/invoice-requests/route.ts).
export const PILOT_BAND = 'pilot'

// THE TWO LESSONS (Justin, 14 September 2026: "I think pilot should be 2
// lessons"). A pilot code opens two lessons matched to the phase the school
// teaches, plus the Hub. Everything else stays visible on the map and locked
// on tap. The sets live here, one list, so swapping a lesson is one edit and
// the guard (scripts/check-pilot-door.mjs) can hold the shape: exactly two
// per phase, all through is primary plus secondary, none carries a DSL note.
// The phase type and its list live in lib/access.ts beside the code lists;
// this is a type only import, which strip types erases, so the guard can
// still load this file under plain node.
import type { PilotPhase } from './access'

const PRIMARY = ['ks1-03-real-pretend-computer', 'ks2-06-how-algorithms-work']
const SECONDARY = ['ks3-24-is-it-doing-my-thinking', 'ks4-15-manipulation-persuasion']
const POST16 = ['ks4-19-readiness-at-16', 'ks5-20-ai-mastery-data-rights']

export const PILOT_SET: Record<PilotPhase, readonly string[]> = {
  primary: PRIMARY,
  secondary: SECONDARY,
  post16: POST16,
  all_through: [...PRIMARY, ...SECONDARY],
}

export function pilotModulesFor(phase: PilotPhase): readonly string[] {
  return PILOT_SET[phase]
}

/** The routes a pilot code reaches, and no others.
 *
 *  The same four teacher shapes as the taster (lib/taster.ts) for the two
 *  modules of the phase, plus the class wall for them, the print room index
 *  and the whole Hub. Deliberately a module id test, never a prefix test, so
 *  a pilot opens exactly its two lessons and every other module meets the
 *  door with the pilot message. The open map (lib/access.ts) is checked
 *  before this ever runs, so this never has to list the selling pages. */
export function isPilotPath(pathname: string, phase: PilotPhase): boolean {
  if (pathname === '/hub' || pathname.startsWith('/hub/')) return true
  if (pathname === '/print' || pathname === '/print/passport' || pathname.startsWith('/print/passport/')) return true

  const parts = pathname.split('/').filter(Boolean)
  if (parts.length < 2) return false
  const [section, moduleId] = parts
  if (!pilotModulesFor(phase).includes(moduleId)) return false

  if (section === 'lesson') return parts.length === 2 || (parts.length === 3 && parts[2] === 'run')
  if (section === 'teach') return parts.length === 2
  if (section === 'class') return parts.length === 2
  if (section === 'print') return parts.length >= 2
  return false
}
