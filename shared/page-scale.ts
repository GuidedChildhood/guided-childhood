// THE PAGE SCALE: the sizes a heading on a page is allowed to be.
//
// It exists because the token scale stops one rung too early. --text-3xl is
// 2.125rem, 34px, and it is the largest token in the system. A page heading
// wants more than 34px, so every page that needed one had nowhere to read it
// from and every page invented its own.
//
// Measured across schools/**/*.tsx on 18 September 2026: about thirty one off
// clamp() headings spread over eighteen files, and no two agree.
//
//   clamp(1.9rem, 3.4vw, 2.9rem)   the home page
//   clamp(1.9rem, 4.5vw, 2.9rem)   pricing
//   clamp(2rem,   4.6vw, 3rem)     pilot, and supplies
//   clamp(2.1rem, 5.5vw, 3.2rem)   philosophy
//   clamp(2.3rem, 4.6vw, 3.7rem)   the home hero
//
// Nobody can see the difference on any single page. Across eighteen pages it
// is the entire reason the app reads as eighteen pages rather than one
// product. This is the same missing rung shared/wall-scale.ts documents for
// the projector, and it has the same fix: a named scale for the instrument.
//
// THIS SCALE CONTINUES THE TOKEN SCALE, it does not sit beside it. `section`
// tops out at 2.125rem, which IS --text-3xl, and each rung above is a perfect
// fourth (about 1.32) up from the one below: 34px, then 45px, then 59px. So
// there is one ladder from a caption to a hero and no seam in the middle. Use
// --text-* up to a section heading and reach here only above it.
//
// A ROLE CARRIES THREE THINGS, NOT ONE, because at display sizes the size, the
// tracking and the line height are a single decision rather than three. The
// same eighteen files carried five different letter spacings (-0.01em through
// -0.04em) and five different line heights (1.04 through 1.1) at
// indistinguishable sizes. Type that is set large and not tracked in reads as
// unfinished no matter how well the size was chosen, which is why the roles
// below are objects and are spread whole.
//
// Ordering holds at every viewport width, which is worth stating because two
// clamps can cross over and nobody notices until a screenshot. Checked at 390,
// 600, 900, 1200 and 1440: hero is above page is above section at all five,
// because each rung's minimum is also above the one below it.
export type PageRole = { fontSize: string; lineHeight: number; letterSpacing: string }

export const PAGE = {
  // The first heading on a page that is selling something. Home, pilot,
  // pricing, supplies, philosophy. One value for one job: before this, those
  // five pages carried five sizes, and the fix is not the average of them but
  // the largest, because a selling page's first line should be the biggest
  // thing in the product and four of the five were quietly under it.
  hero: {
    fontSize: 'clamp(2.1rem, 5vw, 3.7rem)',   // 34px on a phone, 59px at 1440
    lineHeight: 1.06,
    letterSpacing: '-0.035em',
  },
  // The heading of a page a teacher is working in rather than being sold to.
  // The hub, the curriculum, a lesson, the print room, draw, unlock.
  page: {
    fontSize: 'clamp(1.7rem, 4.2vw, 2.8rem)', // 27px on a phone, 45px at 1440
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
  },
  // A heading inside a page. The top of this rung is exactly --text-3xl, which
  // is where the token scale ends and this one begins.
  section: {
    fontSize: 'clamp(1.4rem, 3.2vw, 2.125rem)', // 22px on a phone, 34px at 1440
    lineHeight: 1.18,
    letterSpacing: '-0.015em',
  },
  // The paragraph under a hero: the one that carries the promise. Not a
  // heading, so it is not tracked in, and its line height is set for reading
  // rather than for stacking.
  lead: {
    fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)', // 17px on a phone, 20px at 1440
    lineHeight: 1.6,
    letterSpacing: '0',
  },
} as const satisfies Record<string, PageRole>

// THE PAGE SHELL. Eighteen files carried `padding: '32px 20px 80px'` and most
// of the rest carried a variation on it that differed by a few pixels in one
// axis. One value, read from the spacing ladder in tokens.css.
//
// The generous foot is deliberate and is not a spacing rung: it is room for a
// thumb under the last card on a phone, so the final row of a long page is not
// sitting against the bottom bezel where it cannot be tapped comfortably.
export const PAGE_SHELL = 'var(--space-5) var(--space-4) var(--space-7)'

// The reading column. Longer than this and a line of body text runs past the
// comfortable measure; the wall scale makes the same point at its own size.
export const PAGE_COLUMN = 'min(1060px, 100%)'
export const TEXT_COLUMN = 'min(680px, 100%)'
