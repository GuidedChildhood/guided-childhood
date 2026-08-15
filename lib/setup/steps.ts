// The Setup Quest: four steps, in one place, so the page, the floating next
// step bar and the rung on Today all read the same list in the same order.
//
// ── WHY THREE, WHEN IT WAS SEVEN (14 August 2026) ───────────────────────────
//
// plans/setup-quest-three-steps.md, from Justin walking signup end to end.
// Setup is the things that must happen ONCE. Today is the things that come
// round. Four of the seven were on the wrong side of that line:
//
//   daily     The first daily practice IS the daily loop. Putting it in setup
//             made the habit look like a chore to get out of the way.
//   birthday  Asked at signup now, as month and year, so allBirthdaysIn is
//             already true for every new family. It was green and absent
//             before this cut; removing it only stops the machinery carrying a
//             step nobody sees.
//   quests    Jobs come round every day. They are already a rotation item in
//   school    lib/home/next-up.ts, both of them, so nothing is lost by taking
//             them off setup: they simply take their turn under Today.
//
// What is left is the three things a family does once and never again, in the
// order that a family actually does them.
//
// ── THE RULE THAT DECIDES EVERYTHING BELOW ──────────────────────────────────
//
// A step ticks from being DONE, never from being LOOKED at. See the completion
// note against each flag in lib/setup/flags.ts, which is where the reads live.

// ── AND THEN THERE WERE FOUR (15 August 2026) ───────────────────────────────
//
// Justin, having watched the check in read done for a child it had never asked
// about: "this will need to be child by child so part of the set up list will
// need to have add other children."
//
// It goes last on purpose. The first three are about the family and can be done
// in any household; this one is about who else is IN the household, and asking
// it first would make a one child family answer a question about a second child
// before they had seen what the product does with the first.
export type SetupFlags = {
  agreement: boolean
  childLink: boolean
  homeScreen: boolean
  children: boolean
}

export type SetupStep = {
  key: keyof SetupFlags
  title: string
  /** The long line, on the step's own card. */
  what: string
  href: string
}

// ── THE ORDER IS A DEPENDENCY, NOT A PREFERENCE (15 August 2026) ────────────
//
// Justin: "it should be add children simple easy form as per when they sign up
// so easy to add, then next one is share app with child for quests receiving
// device use."
//
// Children moved AHEAD of the share step, and that is the one ordering in this
// list that could not be any other way. Sharing the app means showing a QR code
// that belongs to a particular child, so a family who has not added their second
// child yet has nothing to share with them. Asking to share first and to add
// second meant the share step could only ever cover the first child, and the
// second would be handed the app by a route that is not in setup at all.
//
// The rest of the order is what a family can actually do in one sitting: agree
// the rules, put us where they can reach us, say who is in the house, then hand
// out the app.
export const STEPS: SetupStep[] = [
  {
    key: 'agreement',
    title: 'Build your family agreement',
    what: 'Decided together and signed, so every boundary is one you both chose rather than one you imposed. It is also what sets the price of screen time in stars.',
    href: '/dashboard/agreement',
  },
  {
    key: 'homeScreen',
    title: 'Put us on your home screen, and turn on reminders',
    what: 'One tap away instead of a tab you have to find, and a few gentle nudges at the hours screens turn up in your house.',
    href: '/dashboard/setup#home-screen',
  },
  {
    key: 'children',
    title: 'Add your other children',
    what: 'The same two questions we asked at signup, so it takes a moment. Each child gets their own stage, their own worries and their own check in, so nothing about one of them is answered by the other.',
    href: '/dashboard/setup#children',
  },
  {
    // Both doors live on the setup page itself rather than behind a link.
    //
    // The old href was /dashboard/quests?tab=share, and that is the button
    // Justin reported dead on 13 August: it pointed at a page that never read
    // a tab parameter, so it navigated to itself and nothing opened. It was
    // fixed on the Quests page by opening the sheet in place, and the same
    // answer is the right one here. A setup step whose job is one tap should
    // not spend that tap on a journey to somewhere the parent then has to
    // search.
    key: 'childLink',
    title: "Share the app with your child",
    what: 'Their side, for ticking off jobs and seeing what they have earned. Show them the code and it lands on their phone, nothing to install. No phone yet? Say so and we keep the whole thing on paper instead.',
    href: '/dashboard/setup#share',
  },
]

// ── EVERY STEP IS VISIBLE, AND THAT IS A CHANGE ─────────────────────────────
//
// The phone link step used to be filtered OUT of the list for a family with a
// young child or one who had said no to a child device. That was right when
// the list was seven long and the step could sit there unticked for ever.
//
// It is wrong now, and the plan says so in as many words: "no child device
// ticks it too. A parent who chooses the printable route has answered the
// question." An answer is a completion, so it belongs in the flag rather than
// in the filter, and lib/setup/flags.ts reads it there.
//
// The difference a parent sees is the difference between two of two, with the
// question they answered nowhere on the page, and three of three with a green
// tick against the answer they gave. The second one is the truth.
//
// Kept as a function, taking nothing, because three callers already ask the
// list this way and a step could yet earn a condition. It is the seam.
export function visibleSteps(): SetupStep[] {
  return STEPS
}
