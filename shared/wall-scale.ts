// THE WALL SCALE: what a child at the back of the room can actually read.
//
// It lives in its own file because two components render onto the same wall
// (LessonPlayer and the AnimatedIntro it opens with) and a scale kept inside
// one of them is a scale the other quietly ignores, which is exactly what had
// happened: the title card, the first slide of every lesson, rendered its
// heading at 30px.
//
// `room()` stopped slide types shipping at phone size, but it never said what
// the big value should BE, so every site picked its own and most picked too
// small. Measured on a 1920 canvas before this: body, options and diagram
// steps at 18 to 24px, the choice question at 42px. Three slide types (title,
// objective, keywords) had no projector branch at all and rendered at phone
// size on the wall.
//
// ISO 9241-303 sets the minimum legible cap height at 16 arc minutes. On a two
// metre projected image with the back row at eight metres that is about 50px
// on a 1920 canvas for anything every child must read, with 40px the absolute
// floor and the question of the moment wanting 64px
// (research/2026-09-09-lesson-quality-council.md, section 4). We were at
// roughly half. A child at the back was not reading the lesson, they were
// watching the teacher read it.
//
// WHY THIS IS A SEPARATE SCALE FROM THE DESIGN TOKENS. --text-3xl, the largest
// token we have, is 2.125rem: 34px, below the floor. The token scale was built
// for a phone in a parent's hand and it is right for that. A classroom wall is
// a different instrument and stretching a phone scale to reach it is how we
// ended up with 18px body text on a projector. So the wall gets its own scale,
// named by what the child is doing rather than by size, and every projector
// branch reads from here.
//
// The clamps are lower bound, viewport, upper bound, and the middle term takes
// the SMALLER of a width share and a height share. Height matters as much as
// width on a projector and the first version of this scale ignored it: at
// 1366x768, the resolution on half the teacher laptops in the country, a 60px
// question plus three 40px option cards pushed the Continue button off the
// bottom of the screen. A lesson you have to scroll is a lesson that stops.
//
// So each role names both shares. On a 1920x1080 wall the height term binds
// and the number in each comment is what renders. On a shorter screen
// everything steps down together rather than one element blowing the layout.
export const WALL = {
  // The question the whole class is deciding on. Nothing else competes with it.
  question: 'clamp(1.6rem, min(4.4vw, 6vh), 4rem)',      // 64px at 1920x1080
  // Slide headings.
  display: 'clamp(1.5rem, min(3.6vw, 5vh), 3.4rem)',     // 54px
  // Step titles, card titles, the second level of heading.
  title: 'clamp(1.2rem, min(2.6vw, 3.9vh), 2.6rem)',     // 42px
  // Everything every child must read: prose, options, answer feedback, the
  // text of a diagram step, a recap point, a keyword meaning. The floor.
  body: 'clamp(1rem, min(2.2vw, 3.75vh), 2.5rem)',       // 40px
  // Sources, timestamps, handles, the chrome around a thing. Deliberately
  // below the floor because the class does not need to read it from the back;
  // the teacher does, and the sceptical adult in the room does.
  aside: 'clamp(0.8rem, min(1.5vw, 2.4vh), 1.6rem)',     // 26px

  // Line length still matters at 40px: about 70 characters is the top of the
  // comfortable range, which is what this width gives.
  column: 'min(1400px, 88vw)',
  wide: 'min(1720px, 94vw)',
} as const

// THE SAME FLOOR, FOR A SUBTREE THAT IS NOT OURS TO REWRITE LINE BY LINE.
//
// The interactive widgets (shared/components/interactives) size from the design
// tokens: 38 of their 41 font sizes come from the text scale below. They are
// also the slides where a child DOES something, 22 of them in the school
// scheme, so they are the last place we want phone sized text on a wall.
//
// (Written without a literal var() glob on purpose. scripts/check-tokens.mjs
// reads the repo for token usages and a wildcard inside one parses as a real
// token with no definition, which is a fair catch: an unresolved var makes the
// whole declaration invalid. Prose bends around the guard, not the other way.)
//
// Overriding the tokens on a wrapper fixes all 38 at once AND keeps each
// widget's internal proportions, which is what 41 hand edits would quietly
// destroy: a meter, a tally and a race each depend on their own type ratios,
// and a blanket 40px would flatten them into unreadable blocks.
//
// The factor is 2.5, chosen so --text-base, the body token, lands exactly on
// the 40px floor. Everything else keeps its place in the scale.
//
// Slide content in LessonPlayer uses the named WALL roles above instead,
// because there the right question is "what is the child doing with this", not
// "how big was it before".
export const WALL_TOKENS: Record<string, string> = {
  '--text-xs': 'clamp(0.75rem, min(1.65vw, 2.8vh), 1.875rem)',    // 30px at 1920x1080
  '--text-sm': 'clamp(0.875rem, min(1.9vw, 3.25vh), 2.1875rem)',  // 35
  '--text-base': 'clamp(1rem, min(2.2vw, 3.75vh), 2.5rem)',       // 40, the floor
  '--text-md': 'clamp(1.0625rem, min(2.35vw, 3.93vh), 2.65rem)',  // 42
  '--text-lg': 'clamp(1.1875rem, min(2.6vw, 4.35vh), 2.96rem)',   // 47
  '--text-xl': 'clamp(1.375rem, min(3vw, 5.1vh), 3.4rem)',        // 55
  '--text-2xl': 'clamp(1.75rem, min(3.85vw, 6.5vh), 4.375rem)',   // 70
  '--text-3xl': 'clamp(2.125rem, min(4.7vw, 7.85vh), 5.3rem)',    // 85
}
