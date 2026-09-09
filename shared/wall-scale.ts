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

  // DECORATION, which has to give way before the words do.
  //
  // The concept slide's emoji cost 108px of a 768px laptop, 15 percent of the
  // height, for an illustration. It was sized on viewport WIDTH only, which is
  // the same bug the text had: a projector is height constrained and a vw only
  // size cannot know that. On a 1920x1080 wall these are unchanged; on a short
  // screen they step back and let the sentence fit.
  //
  // Ordering matters here. Shrinking the emoji is right because it is
  // decoration competing with content. Shrinking the line height would also
  // have bought space and is NOT done, because that trades one legibility
  // property for another and the whole point of this scale is legibility.
  emoji: 'clamp(2.4rem, min(7vw, 7.4vh), 5rem)',        // 80px at 1920x1080, 57px at 1366x768
  emojiSmall: 'clamp(1.6rem, min(3.4vw, 4.4vh), 3.2rem)', // diagram steps, scenario avatars
  figure: 'clamp(2.6rem, min(11vw, 11.6vh), 5.6rem)',   // the one big number on a stat slide

  // Line length still matters at 40px: about 70 characters is the top of the
  // comfortable range, which is what this width gives.
  column: 'min(1400px, 88vw)',
  wide: 'min(1720px, 94vw)',
} as const

// THE INTERACTIVE WIDGETS ARE NOT SCALED FROM HERE, and the removed attempt is
// worth a note because it is a trap anyone reading this file would fall into
// next.
//
// The widgets (shared/components/interactives) take 38 of their 41 font sizes
// from the --text-* scale, so a WALL_TOKENS map that re-pointed those tokens on
// their wrapper looked like the same trick as the WALL roles above: 38 sizes
// fixed at once, no hand edits, every widget keeping its own type ratios.
//
// It shipped, and it broke them. The widgets size their TYPE from tokens and
// their BOXES in pixels, because they were drawn for a phone. Multiplying the
// text by 2.5 and leaving a 170px card at 170px gives a card with the words
// falling out of it: on a 1920 wall the signal meter pushed its fourth option
// off the bottom of the screen and the spread race clipped both posts mid word.
// It passed typecheck, it passed the size guard, and it passed the contrast
// guard, because the colours were perfect. A screenshot found it.
//
// So the widgets are zoomed to fit instead, in their own wrapper, where the
// reasoning lives next to the code that does it. The scale here stays what it
// always was: named roles for the slide content the player itself draws.

// CONTRAST, FOR A ROOM WITH THE BLINDS UP.
//
// plans/kids-player-design.md, move 8: "classroom mode gets a higher contrast
// variant of the tokens", and move (d): "cream washes out under classroom
// lighting". That has been in the brief since the player was designed and was
// never built.
//
// MEASURED FIRST, because "cream washes out" turned out to be the wrong
// diagnosis. The body text was never the problem: --ink on --cream is 16.07:1,
// far above AAA. The problem is the accent and the muted ink, which carry every
// label on the wall: "Hands up, then tap the class answer", "The evidence",
// "Your turn", the cycle map, the source lines. Those eyebrows were made bigger
// on 9 September and 26px at 2.43:1 is still a wash, because size and contrast
// are different properties and only one of them had been fixed.
//
// NOT NEW COLOURS, which is what the brief asks for and also the right answer.
// --stage-1-text is amber-900, already in the system, the same family as the
// butter accent, and it reads 8.17:1 on cream. --ink-soft is already there at
// 7.13:1. So the classroom variant is two existing tokens standing in for two
// others, not a new palette.
//
// KNOWN SIDE EFFECT, stated rather than discovered later. --terracotta-dark is
// used 15 times as a text colour in the player and 4 times as chrome, two
// borders and two button shadows. Overriding the token darkens those too. On a
// washed out projector a darker border and a deeper button shadow are an
// improvement, not a regression, and one override beats fifteen call sites.
//
// AN ALIAS DOES NOT FOLLOW. --coral-dark is declared as var(--terracotta-dark)
// on :root, and a custom property resolves where it is DECLARED, so it keeps
// the root's value no matter what this override says. Anything that has to
// follow the classroom variant must name the real token at the call site.
//
// AND THE TABLE THAT USED TO BE HERE IS GONE, on purpose. It listed pairs by
// hand and passed, while the wall still had seven real failures on it: a table
// cannot see a gradient backdrop, cannot see an opacity group, and cannot see
// an alias resolving somewhere else. scripts/check-wall-contrast.mjs renders
// the player and composites every text node the way the browser does, which is
// the only version of this check that has ever been right. Run it, do not
// reason about it.
export const WALL_CONTRAST: Record<string, string> = {
  '--terracotta-dark': 'var(--stage-1-text)', // 2.43 to 8.17 on cream
  '--ink-muted': 'var(--ink-soft)',           // 3.26 to 7.13 on cream
}
