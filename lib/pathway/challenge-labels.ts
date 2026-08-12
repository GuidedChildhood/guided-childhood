// What a family said they came here for, in the words a parent would use.
//
// ── WHY THIS IS A FILE OF ITS OWN ───────────────────────────────────────────
//
// It lived inside Home, then got moved into FocusStrip.tsx alongside the
// component that reads it, and in the move four of the six ids onboarding
// actually writes were dropped and two that nothing writes were invented. A
// missing id resolves to an empty label, and an empty label makes the strip
// return null, so for those four families the focus strip silently stopped
// existing. Nobody would report that: there is no error, just an absence.
//
// The reason it could happen is that the map was buried at the bottom of a JSX
// file, where no check script can import it without pulling in React and
// next/link. Out here it has no imports at all, so
// scripts/check-focus-labels.mjs can read it, read the ids out of the
// onboarding page, and fail the moment the two drift apart again.

/**
 * The first six MUST match CHALLENGES in app/onboarding/page.tsx exactly. The
 * rest are legacy ids from before OLD_TO_NEW_CHALLENGE, kept because rows
 * written back then still carry them and those families still deserve a strip.
 *
 * something_else is deliberately empty: "Something else" tells a parent nothing
 * they do not already know, so the strip stays away rather than saying it.
 */
export const CHALLENGE_LABELS: Record<string, string> = {
  morning_tv: 'Morning TV battles', controller_fights: 'Controller fights',
  wont_put_down: 'Will not put the device down', bedtime_screens: 'Bedtime screens',
  mood_after_screens: 'Mood after screens', something_else: '',
  screens_takeover: 'Screens are taking over', mood_changes: 'Mood changes after phone use',
  gaming: 'Gaming concerns', online_safety: 'Online safety worries',
  start_conversation: 'Starting the conversation', asking_for_phone: 'Asking for a phone',
}
