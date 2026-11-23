# 23 November 2026: the schools site, reviewed for Apple level simplicity

Justin: review every page of the schools platform from a top UX standpoint. It
must be easy for teachers and heads to understand, look Apple level, with
obvious buttons, super neat, not too texty. Goal: simple to use, 10 out of 10.

Method: 28 key pages screenshotted at 390 and 1280 wide on a local build with
the real lessons (content/modules), words, buttons and page height counted.
No console errors and no sideways scroll on any page. The design is clean and
on brand. **The problem is volume, not looks.**

## The numbers
| Page | Words | Phone height (screens) | Buttons |
|---|---|---|---|
| Home | 2,699 | 28 | 5 |
| Lesson run sheet | 3,942 | 28 | 6 |
| Staff briefings (CPD) | 3,834 | 25 | 1 |
| Safeguarding crosswalk | 3,320 | 22 | 2 |
| Parent pack | 2,620 | 20 | 1 |
| Lesson page | 2,570 | 20 | 12 |
| Curriculum map | 2,277 | 23 | 0 |
| Philosophy | 2,204 | 18 | 1 |
| Print, one lesson | 2,219 | 14 | 1 |
| RSHE mapping (rebuilt 17 Nov) | 1,708 | 16 | 3 |
| Hub | 971 | 10 | 1 |
| Pilot | 339 | 4 | 1 |

Apple's own product pages run 300 to 600 words with one button that matters.
Our best page (pilot, 339 words) is the shape every page should have.

## Scores today, out of 10
- Home 5: strong hero, then 28 screens. A head stops reading by screen 3.
- Hub 4: 19 equal cards and a form; no answer to "what do I do first?".
- Lesson page 6: one clear Teach button, then seven equal buttons and 20 screens.
- Curriculum map 6: good cards, a paragraph wall above them.
- Run sheet 5, CPD 4, DSL 4, Parents 5, Philosophy 5: reference text with no summary first.
- RSHE mapping 8, Pilot 8, Pricing 7, Unlock 8: already close.
- Overall: about 5.5. Clean, honest, on brand; too much to read.

## The rules every page will follow
1. One job per page, said in the headline.
2. At most 30 words before the first button.
3. One primary button (butter). Two quiet ones at most beside it.
4. Detail lives one tap away: a summary first, then folds or a second page.
5. On phone, the first screen shows the headline, one sentence and the button.
6. Every long reference page opens on a three line "what this is, who needs it, what to do".
7. No more than three cards in a row, no more than six on a screen.

## Build order (each a small PR, checked at 390 and 1280)
1. **Hub becomes a launcher.** (Built 23 November: 971 words to 305, six jobs with chips, every document one tap away.) "What do you need today?" Six tiles: Teach a
   lesson, Show what we cover, Safeguarding, Parents, Train staff, Our
   records. The 19 documents sit inside them. The safeguarding names form
   moves to the Safeguarding page.
2. **Lesson page.** (Built 23 November: 2,570 words to 651 on first view; one Teach button, Walk me through it and a Print menu, four folds that open for printing.) Teach this lesson stays the one big button. The seven
   print buttons become one "Print" button opening the print page. The 20
   screens below fold into four sections, closed by default.
3. **Home.** (Built 23 November: 2,699 words to about 1,100, 28 phone screens to 13; the squad becomes one row of faces, the journey six stage cards, the evidence section moves to Philosophy.) Hero, three proof points, one picture of a lesson, pricing line,
   one button. Target 6 phone screens, under 600 words. The rest moves to
   Philosophy and the curriculum map.
4. **Curriculum map.** (Built 23 November: one line and six year buttons before the first lesson; the three step box, the long intro and each card blurb removed; the ten behaviours and each stage reason folded.) Year group chips first, the paragraph wall into one line.
5. **Reference pages** (CPD, DSL, Parents, Philosophy, run sheet). (Built 23 November: words on first view CPD 3,834 to 518, DSL 3,320 to 362, Parents 2,620 to 311, Philosophy 2,204 to 579, run sheet 3,942 to 172; a summary card and jump chips at the top, every section folded in one shared RefFold, a chip opens the fold it lands on, print opens all; the run sheet opens on Teach this lesson.) A summary
   card and jump chips at the top, every section folded, print opens all.
6. **First visit flow for a teacher:** school code, pick your year, teach.

## Tools
HyperFrames or Higgsfield are not needed for this: the fix is structure and
words, built in the pages. A 30 second HyperFrames walkthrough of the new
teacher flow is worth making once batch 6 lands, for the pilot email.
