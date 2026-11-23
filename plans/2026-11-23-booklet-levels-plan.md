# 23 November 2026: pupil booklets at three levels, and a support mat

Justin: review his wife's French scheme for its different printouts for
different levels, and build on it.

## What her scheme does
Every activity comes as **Expected**, **Adapted** and **Inclusion**, each with
an answer sheet, plus a ★ Challenge. Adapted starts the sentence for the pupil
and adds a help card (sentence starters and a word box). Inclusion swaps
writing for colour, trace, join, cut and stick. A support mat sits on the
table for every two pupils. Inclusion pupils may start the next lesson's
activities when a whole lesson of listening is too much.

## What we built (generated from each lesson row, so all 34 modules)
- `/print/[module]/booklet?level=adapted`: the same cards, a word box (the
  verdicts, then the lesson's key words), and every reason sentence started.
- `/print/[module]/booklet?level=inclusion`: the first four cards, big
  choices to point at and colour, no writing, done with an adult. The
  mission is a drawing.
- `/print/[module]/support-mat`: key words with meanings, the choices,
  sentence starters, and the words to say. One for every two pupils.
- A level switch on the booklet screen (never printed), and three new rows in
  the print room.
- Rules in `schools/lib/booklet-level.ts`, tested by `npm run booklet-level-test`.

## Not yet
- Per level answer sheets. The existing answer key covers all three levels,
  because the cards are the same; Inclusion is the first four of them.
- A ★ Challenge on the Expected booklet (the stretch line is teacher facing
  today).
- His wife to check two modules at all three levels before pilots use them.
