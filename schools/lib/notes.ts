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
