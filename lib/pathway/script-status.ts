// What a script's status means, and which ones move the pathway.
//
// Its own file, with no imports, because this one rule has now been changed
// twice in opposite directions and both times it was buried in a filter in the
// middle of a bigger function.
//
// ── The four states ──────────────────────────────────────────────────────────
//
//   opened      the page rendered. Worth nothing. A glance is a glance, and a
//               parent who scrolled a library of 236 has not had 236
//               conversations. This is migration 157's whole point.
//   read        they reached the END of the script. Counts. Justin, twice on
//               10 August 2026: "it doesn't update if I read it", then "once
//               read through needs to update pathway." Migration 183.
//   used        they had the conversation. Counts, and retires the script from
//               the recommender for good.
//   not_needed  it does not apply to this family yet. Counts, and comes back
//               round on not_needed_until.
//
// READ AND OPENED ARE NOT THE SAME THING and that distinction is what lets both
// migrations be right at once. Read is written by the end of the reader coming
// into view; opened is written by arriving. Delete that difference and 157's
// bug is back the same afternoon.
//
// One definition, imported by the road and the passport both, because the two
// of them disagreeing about how far a family has got is the bug here that would
// cost us their trust in both at the same time.

export type ScriptStatus = 'opened' | 'read' | 'used' | 'not_needed'

/** The states that count on the pathway. Opened is deliberately not one. */
export const COUNTS_TOWARD_PATHWAY: ReadonlySet<string> = new Set<string>([
  'read',
  'used',
  'not_needed',
])

/** Does this row move a family's pathway on? */
export function countsTowardPathway(status: string | null | undefined): boolean {
  return COUNTS_TOWARD_PATHWAY.has(String(status ?? 'opened'))
}
