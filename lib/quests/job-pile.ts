// Which pile an untouched job belongs in: on their app, or to do with you.
//
// Justin, 11 August 2026, looking at a job filed under "To do with you" with
// Teo's app plainly set up on the same screen: "why does this say not on their
// app as in this case there is a child app set up as you can see?"
//
// The board's rule was `q.child_id && hasApp.has(q.child_id)`, which reads as:
// a job with no child named on it is a job with no app to send it to. That is
// backwards. A whole family job carries child_id null ON PURPOSE, meaning
// everybody, and lib/kid/jobs-read.ts fetches a child's list with
// `child_id.eq.<id>,child_id.is.null`, so a family job is already sitting on
// every linked child's screen. The board was the only part of the system that
// did not know that, and the cost was not cosmetic: it told a parent to go and
// do by hand a job their child could already see and tick.
//
// Kept out of the component so it can be checked without a browser.

/** Where an untouched job sits. Ticked jobs are waiting or done, not here. */
export type JobPile = 'sent' | 'withyou'

/**
 * @param childId   the job's child_id, or null for a whole family job
 * @param hasApp    child ids with a kid link set up
 * @param childIds  every child in the family, so a stale link cannot vote
 */
export function pileFor(
  childId: string | null | undefined,
  hasApp: ReadonlySet<string>,
  childIds: readonly string[],
): JobPile {
  // Named child: only that child's app counts. Teo having an app does nothing
  // for a job addressed to Alma.
  if (childId) return hasApp.has(childId) ? 'sent' : 'withyou'
  // Whole family job: it lands on every linked child's list, so one app in the
  // house is enough for it to have been sent.
  return childIds.some(id => hasApp.has(id)) ? 'sent' : 'withyou'
}
