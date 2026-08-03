// Why the timer did not start, in words a child can act on.
//
// Justin, with a screenshot of the card saying "They said yes! Tap to start your
// timer" and a toast saying nothing: "see here it's not starting timer and no
// reason".
//
// WHAT WAS THERE. Every refusal the start route can return became one sentence:
//
//   "That did not start. Try again in a moment."
//
// The route returns nine different errors. Exactly one of them (a genuine 500)
// is worth trying again in a moment. The other eight will refuse identically for
// ever, so the message sent a child to tap a button that could never work, and
// their grown up to look at a screen that gave them nothing to go on.
//
// This is the same fault as the login form that said "Email or password not
// recognised" when the app had never reached the database: a message that reads
// like a diagnosis, blames the person in front of it, and points nowhere.
//
// WHY IT LIVES HERE RATHER THAN AT EACH CALL SITE. Three surfaces start a timer
// (the child's ask banner, the child's device card, the parent's card) and all
// three had their own copy of the same shrug. One map means a new error added to
// the route gets a real sentence everywhere at once, and the fallback below is
// the only place a shrug is still allowed to live.

/**
 * A child facing sentence for each error the start route can return.
 *
 * Every one of them says what happened and what to do about it. None of them
 * says "try again" unless trying again is genuinely the answer, and none of them
 * implies the child did something wrong: a refusal here is almost always the
 * app's own accounting, not a child misbehaving.
 */
const REASONS: Record<string, string> = {
  // The gate the parent set, and the one refusal that is really a to do.
  'chores first': 'One job comes before screens today. Do that one and this starts.',

  // The yes has already been used, or was tidied away. This is the one from
  // Justin's screenshot: a card still offering a Start for an ask that is spent.
  'ask not approved': 'That yes has already been used. Ask again and it will come straight back.',

  // Money, in both pockets.
  'not enough stars': 'Not quite enough stars for that yet. Do a job and it goes up.',

  // Shape of the request. A child cannot cause these from a working screen, so
  // they are the app being wrong, and the words say so rather than blaming them.
  'bad minutes': 'Something went wrong picking the minutes. Ask again and pick the time.',
  'bad device': 'That screen is not on your list any more. Pick another one.',
  'bad request': 'Something went wrong at our end. Ask again.',
  'unknown link': 'This link is not working any more. Show a grown up.',

  // The computer, which is the one device whose bucket cannot be guessed.
  'activity required for this device': 'Tell us what you are doing on it first, then it starts.',
  'bad activity': 'Pick what you are doing on it, then it starts.',
}

/** The only case where trying again in a moment is honest advice. */
export const START_RETRY = 'That did not start. Try again in a moment.'

/**
 * What to say when a start is refused.
 *
 * `error` is whatever the route put in the body. Anything unrecognised falls
 * back to the retry line, which is right for the case it was always meant for: a
 * 500, or a request that never arrived at all.
 */
export function startErrorMessage(error: unknown): string {
  return (typeof error === 'string' && REASONS[error]) || START_RETRY
}

/**
 * The same thing for a grown up, who can be told slightly more.
 *
 * Only where the parent's version genuinely differs. Everything else falls
 * through to the child's wording, which is plain rather than childish and reads
 * fine to an adult.
 */
const PARENT_REASONS: Record<string, string> = {
  'chores first': 'A job you marked as before screens is still open today. Approve that tick, or clear the flag on the job.',
  'ask not approved': 'That request has already been started or was replaced by a newer one.',
  'not enough stars': 'Not enough stars or holiday minutes to cover that block.',
}

export function startErrorMessageForParent(error: unknown): string {
  if (typeof error === 'string' && PARENT_REASONS[error]) return PARENT_REASONS[error]
  return startErrorMessage(error)
}
