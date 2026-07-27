// A child's printable asks travel as quest_requests with a set wording, the
// same three shapes the child app writes and the parent card reads back:
//   "Please can I do the {title} printable"  (locked, asking to unlock)
//   "Print the {title} sheet"                (wants it printed)
//   "Finished the {title} sheet"             (done, claiming the stars)
// These belong to the printables flow, not the jobs board, so they must never
// be turned into a family_quest (the child would then see their own asking
// phrase as a job in the daily list). One matcher, used by the parent decide
// endpoint and the child today list so both agree.

export function isPrintableAskTitle(title: string): boolean {
  const t = String(title ?? '').trim()
  return /^Please can I do the .+ printable$/.test(t)
    || /^Print the .+ sheet$/.test(t)
    || /^Finished the .+ sheet$/.test(t)
}
