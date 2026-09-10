// THE WORRY TABLES: what a parent can name, and what we call it in the ledger.
//
// Split out of lib/concerns/baseline.ts on 10 September 2026. Nothing about
// them changed; where they LIVE did, and for a reason worth writing down.
//
// baseline.ts is database code, and two guards need these tables without a
// database: scripts/check-baseline-seed imported them through Node, and
// scripts/check-focus-labels regexed them out of the file as plain text. Both
// of those made baseline.ts a module that could not import anything of its
// own, because Node's ESM resolver does not guess extensions and the bundler
// rejects the extension that would fix it. That constraint is why the free
// text slug helper was copied into it rather than imported, and it is what
// stopped the typo matcher being wired in at all.
//
// Tables have no dependencies, so a file that holds only tables can be loaded
// by anything. The guards read this file now, and baseline.ts is free to
// import like any other module.

// The onboarding ids, and the ledger slugs they belong on. Both the current
// wizard ids and the older starter quiz ones are here, mapped onto the same
// row where they mean the same thing, so a worry named at signup never lands
// as a second concern saying what an existing one already says.
//
// Concern slugs are free form kebab case across the product (bedtime,
// morning-tv-habit, rightnow-tv-off), written by DiGi and the moments deck.
// There is no registry to add to, so these are simply the same shape.
export const ONBOARDING_TO_SLUG: Record<string, string> = {
  morning_tv: 'morning-tv',
  controller_fights: 'controller-fights',
  wont_put_down: 'wont-put-down',
  bedtime_screens: 'bedtime-screens',
  mood_after_screens: 'mood-after-screens',
  screens_takeover: 'wont-put-down',
  mood_changes: 'mood-after-screens',
  gaming: 'controller-fights',
  // ── THE TWO THAT WERE MISSING, AND COST EVERY NEW FAMILY THEIR CHECK IN ───
  //
  // The canonical list is ChallengeId in lib/content/stages.ts: screens_takeover,
  // mood_changes, gaming, online_safety, start_conversation, asking_for_phone.
  // Three of those six had no key here, and asking_for_phone is the SECOND most
  // common answer on the live product, five of the twelve accounts.
  //
  // The effect was total and silent. No key means no slug, no slug means this
  // returns [], no concerns are seeded, and the check in page opens on "All done
  // for today" on the morning a family signs up, while the rung on Home still
  // reads not done. That is the loop Justin kept hitting, and it was never the
  // rung: there was genuinely nothing to ask about.
  //
  // LABEL already carried 'phones-and-messaging' with nothing pointing at it,
  // which is the tell that this mapping was always meant to exist.
  asking_for_phone: 'phones-and-messaging',
  start_conversation: 'phones-and-messaging',
  // ── THE THREE THE WIZARD NEVER ASKED ABOUT (8 September 2026) ────────────
  //
  // Justin: "the questions they answer makes the check ins as its issues they
  // have raised." Three of the questions parents actually arrive with, the
  // phone, social media and AI chatbots, had no tile at all, so the answer
  // could never be given, let alone rated. The tiles arrive in the same commit
  // as these keys, on purpose: this map has fallen behind the wizard twice and
  // both times the symptom was a family opening their first check in on "All
  // done for today" with nothing to do.
  //
  // seen_something is what online_safety should always have been. A catch all
  // called "online safety" is a subject, and a parent cannot honestly give a
  // subject five stars. This one is an evening they recognise, so it can be
  // rated, and it is what they meant.
  //
  // ── AND WHY IT IS NAMED THE WAY IT IS (10 September 2026) ────────────────
  //
  // It read "Seeing things they should not" and its neighbour read "Will not
  // put it down". Both are statements of the problem, and the check in rates
  // every row out of five with "more stars is a better week" above it, so a
  // parent could end up looking at "Will not put it down: going great", which
  // reads like a joke about them. Justin, asked directly, chose to change both.
  //
  // They are topics now: "Coming off screens" and "What they come across
  // online". Five stars means that went well this week and one star means it
  // did not, which is the only reading a scale can carry. The SLUGS are
  // untouched, so every row already written keeps its history, its count and
  // its stamp; only the words a parent reads have moved.
  social_media: 'social-media',
  ai_chatbots: 'ai-chatbots',
  seen_something: 'seen-something',
  // online_safety and something_else stay deliberately absent. A catch all is a
  // picker, not a rateable thing, and the daily card already filters those out
  // by slug. A baseline row nobody can honestly score is worse than none. They
  // are safe to leave out now that an unmapped answer falls back to the four
  // common ones rather than to nothing.
}

// What the parent sees on the row. Plain, and in their words rather than
// ours: these are the six the wizard offers, spelled out.
export const LABEL: Record<string, string> = {
  'morning-tv': 'Morning TV',
  'controller-fights': 'Controller fights',
  'wont-put-down': 'Coming off screens',
  'bedtime-screens': 'Bedtime screens',
  'mood-after-screens': 'Mood after screens',
  'phones-and-messaging': 'Phones and messaging',
  'social-media': 'Social media',
  'ai-chatbots': 'AI chatbots',
  'seen-something': 'What they come across online',
}

// ── THE FOUR COMMON ONES, FOR A CHILD WITH NO HISTORY ───────────────────────
//
// plans/setup-quest-three-steps.md: "The baseline asks four common ones to
// start, about phones, social media and the rest, rather than reviewing
// concerns a new family does not have yet."
//
// This is what a SECOND child gets, and the distinction from the family
// baseline above matters. That one records an answer the parent actually gave,
// about the child they gave it about. A second child added in month three was
// never asked about at signup, and reusing the first child's answers would be
// the app putting words in a parent's mouth about a different person.
//
// So a new child starts on the four every family recognises. They are a
// starting point to rate, not claims about this child, and the resting rule in
// lib/concerns/resting.ts retires any that come back as fine, so a parent who
// says all four are going great is asked about none of them again.
// ── THE SOURCE VALUE THAT KILLED EVERY BASELINE EVER SEEDED ─────────────────
//
// concerns.source is constrained to ('moment','script','digi','rightnow',
// 'checkin'). This file inserted 'onboarding' below and 'baseline' in
// seedChildBaseline, and BOTH violate that check. Postgres rejected the insert,
// the `if (error) return []` swallowed it, and the caller saw an empty array
// that looks exactly like "nothing to seed".
//
// So the baseline has never worked. Not for a mis-mapped challenge, not for a
// correctly mapped one, not for a second child. Every family who ever signed up
// opened their first check in on "All done for today", and the live database
// agrees: 27 concerns across the product, sourced only moment, digi and
// rightnow. Not one from onboarding.
//
// 'checkin' is the honest value of the five allowed: these rows exist to be
// checked in on, and that is the surface that creates and then reads them. The
// constraint is not widened, because it was doing its job and the code was
// wrong.
export const BASELINE_SOURCE = 'checkin'

export const COMMON_BASELINE_SLUGS = [
  'bedtime-screens',
  'wont-put-down',
  'mood-after-screens',
  'phones-and-messaging',
] as const

// ── TWO TO START, NOT FOUR (2 September 2026) ───────────────────────────────
//
// Justin, looking at his own first check in with three children: "maybe we
// should have 2 each basic standard questions to start to keep it easy, then
// we add based on parents' moments etc from then on each day... just don't
// want too many on first check in until we know issues."
//
// He is right about the shape of the product. The worries a family actually
// has arrive through DiGi, Right now, the moments and the wellbeing check in,
// each of which raises a row for the child it was about (lib/concerns/raise),
// and a worry scored top rests (lib/concerns/resting). The baseline is only
// the first two rungs of that ladder, so it should be the two everybody with
// a screen in the house can honestly answer on day one. The other two common
// ones are still in COMMON_BASELINE_SLUGS for the older readers of it.
export const STARTER_SLUGS = ['bedtime-screens', 'wont-put-down'] as const
