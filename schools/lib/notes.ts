// THE LISTS IN A LESSON'S TEACHER NOTES, READ WITHOUT TRUSTING THEIR SHAPE.
//
// On 19 September 2026 four modules were written with prior_knowledge and
// i_can as prose where the other twenty five carry lists, and the lesson home
// page crashed on all four in production ("notes.prior_knowledge.map is not a
// function"), which a teacher meets as "That page did not load" on the page
// they open first. The data is fixed and the module contract now refuses the
// shape, but a page that a whole school opens should not fall over on a
// field's type either way. So every list the pages read comes through here: a
// list stays a list, a string becomes a one entry list, anything else is
// empty. The page renders what the row has, and never crashes on it.

export function asList(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string' && v.trim()) return [v]
  return []
}

// THE LESSON'S TOOL, read the same way (12 October 2026).
//
// Four modules written in September (ks2-26, ks3-27, ks4-28, ks4-29) held
// teacher_notes.tool as one sentence ("STOP IT, REPORT IT, SAY IT. In that
// order...") where every other lesson holds { heading, lines, strapline }.
// The paper pack read `notes.tool?.heading`, found nothing, and printed the
// reference lesson's three checks on all four sets of bookmarks and in the
// parent note's tool box, so pupils and families took home a tool the lesson
// never taught. Migration 370 reshaped the four rows and the module contract
// now refuses a sentence (rule 11). This is the belt: a sentence comes back as
// one line with no heading, so it prints as the lesson's own words under the
// page's plain heading, never as another lesson's tool. Null means the row
// has no tool at all, and only then does a page fall back.
export type NotesTool = { heading?: string; lines: string[]; strapline?: string }

export function asTool(v: unknown): NotesTool | null {
  const text = (x: unknown) => (typeof x === 'string' && x.trim() ? x : undefined)
  if (typeof v === 'string') return v.trim() ? { lines: [v.trim()] } : null
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null
  const t = v as { heading?: unknown; lines?: unknown; strapline?: unknown }
  const tool = { heading: text(t.heading), lines: asList(t.lines), strapline: text(t.strapline) }
  return tool.heading || tool.lines.length ? tool : null
}
