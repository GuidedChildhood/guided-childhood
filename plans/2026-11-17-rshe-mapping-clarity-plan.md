# 17 November 2026: the RSHE mapping page, made obvious

Justin: "review hub, apply Apple UX, super easy for teachers to understand and act
on, make it really obvious and clear". The page is open (no code) and is now the
link in the Mailchimp schools campaign (sch02), so the first reader is a teacher
or PSHE lead who has never seen us.

## What the live page does wrong (checked at 390 and 1280)
1. The answer, 57 of 57 taught, sits about 1,700px down on a phone, under three
   paragraphs that say the same thing.
2. The In short box is stale: it promises "part taught" and "not covered" rows,
   and there are none. Three of four tiles read 0.
3. "Taught" is yellow (the green-dark token maps to terracotta), so done does
   not look done.
4. 57 verbatim requirements in one column, primary and secondary mixed, no way
   to find your phase or a word.
5. KCSIE and 29 lessons of hooks follow at full length: a long scroll for detail
   only a DSL or an inspector needs.
6. No next step for a visitor from the email.

## The rebuild (same data, same guard, nothing claimed that is not checked)
- Hero states the answer in one line, with a ring, and two actions: print for
  your file, and try two lessons free (the pilot).
- Three small steps: pick your phase, find a requirement, print it.
- Primary and Secondary as a segmented control, a search box, strand jump links.
  Status filters and the gap story only appear if a requirement is not taught.
- Each row: the guidance's words, a green tick, and the lesson that teaches it.
- KCSIE 2026 and the per lesson hooks fold away under clear headings; printing
  opens everything and shows both phases.
- One short "how we check" note and the source at the foot, date in words.

Not changed: shared/schools-rshe-2026.ts and scripts/check-rshe-coverage.mjs.
