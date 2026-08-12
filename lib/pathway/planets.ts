// The planets under the pathway: one thing we offer, one week at a time.
//
// Justin, 12 August 2026: "make it planets, make it more parent focussed but
// like duolingo, so something that attracts them to click and not much text",
// and before that: "a clickable button always next to this pathway, rotated each
// week it changed to other like school alerts or quests or digi chat, just
// giving insight to what we offer, do not interfering with pathway."
//
// ── WHY A ROTATION AND NOT A MENU ───────────────────────────────────────────
//
// A parent who has been here three months has still never opened the homework
// decoder, because nothing ever mentioned it at the moment they were looking.
// A menu of six things is a menu: it gets skimmed once and then becomes
// furniture. One thing a week is a recommendation, and it gets a proper look.
//
// The week is the unit because the rest of this product runs on weeks: the
// balance report, the star cap, the school spotlight. A planet that changed
// daily would be noise on a page a parent visits weekly, and one that changed
// monthly would take half a year to show them everything.
//
// The dots underneath are the compromise. The week picks what shows, but a
// parent who wants to see the rest can, in one tap, without the page turning
// into the menu we just avoided. That is the Wanderlog shape: image first and
// large, four to six bold words, one grey line, dots rather than arrows.
//
// ── WHAT IS NOT IN HERE ─────────────────────────────────────────────────────
//
// No dismiss. Justin asked for it to be there "always", and a thing a parent
// can permanently close is a thing that will be closed on day two by the
// families who most need to know what is in here.
//
// No progress, no counts, no badges. Every one of these is an invitation. The
// moment one of them says "3 waiting" it becomes an obligation, and the pathway
// already carries all the obligation this page can hold.

export type Planet = {
  /** Stable key. Used by the art, the dots, and the check script. */
  key: string
  /** Where it goes. */
  href: string
  /** Four to six bold words. This is the whole pitch. */
  title: string
  /** One grey line under it. Never two. */
  line: string
  /** The planet's body colour. */
  body: string
  /** Its ring, a darker relative of the body. */
  ring: string
  /** The soft disc it sits on, a house tint. */
  tint: string
  /** Read out in place of the drawing. */
  alt: string
}

export const PLANETS: Planet[] = [
  {
    key: 'school',
    href: '/dashboard/school',
    title: 'Never miss a school date',
    line: 'Kit days, trips and payments, all in one place.',
    body: '#8FB8DC', ring: '#5E8FBE', tint: 'var(--stage-2)',
    alt: 'A blue planet with a small calendar beside it',
  },
  {
    key: 'quests',
    href: '/dashboard/quests',
    title: 'Turn jobs into screen time',
    line: 'Stars they earn become minutes they choose.',
    body: '#EDC35F', ring: '#C99A28', tint: 'var(--stage-1)',
    alt: 'A gold planet with a star beside it',
  },
  {
    key: 'digi',
    href: '/dashboard/digi',
    title: 'Ask DiGi anything tonight',
    line: 'One hard moment, one calm answer.',
    body: '#F0A48E', ring: '#D4785F', tint: 'var(--stage-3)',
    alt: 'A coral planet with a speech bubble beside it',
  },
  {
    key: 'learning',
    href: '/dashboard/learning',
    title: 'Homework into a real lesson',
    line: 'Paste it in and a lesson lands on their phone.',
    // Grass green rather than the sage it started as. Sage and the teal below
    // it were four degrees apart on the wheel and read as the same planet twice
    // when the six were finally seen side by side, which is the entire reason
    // /dev/planets shows them as a grid.
    body: '#8FC46B', ring: '#568F3C', tint: '#EDF6E4',
    alt: 'A green planet with an open book beside it',
  },
  {
    key: 'scripts',
    href: '/dashboard/scripts',
    title: 'The words for a hard moment',
    line: 'Say the thing you meant to say.',
    body: '#B9A8E8', ring: '#8B76C4', tint: 'var(--stage-5)',
    alt: 'A lilac planet with quote marks beside it',
  },
  {
    key: 'balance',
    href: '/dashboard/stats',
    title: 'See their week honestly',
    line: 'What they watched, and what it is doing.',
    body: '#45A8B0', ring: '#256E77', tint: '#DEF0F2',
    alt: 'A teal planet with an hourglass beside it',
  },
]

/**
 * Monday 5 January 2026, in UTC. Any fixed Monday would do; this one is the
 * first of the year the product launched in, which makes the arithmetic
 * readable when somebody checks it against a calendar.
 */
const ANCHOR = Date.UTC(2026, 0, 5)

/** Whole weeks since the anchor. Negative before it, which is handled below. */
export function weekNumber(now: Date = new Date()): number {
  return Math.floor(Math.floor((now.getTime() - ANCHOR) / 86400000) / 7)
}

/**
 * Which planet this week belongs to.
 *
 * The double modulo is not decoration: a negative week number (a clock set
 * wrong, a test date before the anchor) would otherwise return a negative index
 * and the card would render nothing at all.
 */
export function planetOfTheWeek(now: Date = new Date()): number {
  const n = PLANETS.length
  return ((weekNumber(now) % n) + n) % n
}
