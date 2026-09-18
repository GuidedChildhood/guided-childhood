# One type scale and one spacing scale, across the schools app

18 September 2026. Session 0u09q9.

Justin, 18 September 2026: "I only wanted best way of making the school app
look as good as Apple UX." The answer given, and the one he said go on:

> The look comes from a small number of system rules held everywhere, not from
> polishing pages one at a time. Start with the type and spacing scale, since
> everything else sits on it.

This is batch one of five. The others (delete most of the boxes, one motion
language, loading and empty states, judge on frames) each get their own PR.

## Measured first, before anything was changed

Counted across `schools/**/*.tsx` on 18 September.

**Type.** 487 `fontSize` call sites, 57 distinct values.

- 384 of them, 79 percent, already read from the `--text-*` token scale. The
  scale is not the problem and does not change.
- **About 30 are one off `clamp()` headings, spread over 18 files, and no two
  agree.** `clamp(1.9rem, 3.4vw, 2.9rem)` on one page, `clamp(1.9rem, 4.5vw,
  2.9rem)` on the next, `clamp(2rem, 4.6vw, 3rem)` on a third. Nobody can see
  the difference on any single page. Across eighteen pages it is the whole
  reason the app reads as eighteen pages rather than one product.
- **About 33 are hand nudges below the base**: 14px, 14.5px, 15px, 15.5px,
  16px, 16.5px, 17px, sitting beside `--text-sm` (14) and `--text-base` (16)
  and `--text-md` (17), which are the same sizes with names.

**Spacing.** There is no spacing scale. None. 104 distinct `padding` values and
39 distinct `gap` values. The gaps alone run 2, 4, 5, 6, 8, 9, 10, 12, 14, 16
and 18px, which is eleven steps where a system wants five.

## Why the headings went feral, which is the interesting part

`--text-3xl` is 2.125rem: **34px, and it is the largest token we have.** A page
heading wants more than 34px. So every page that needed one had nowhere to
read it from, and every page invented its own.

This is the same failure `shared/wall-scale.ts` documents for the projector,
in its own words: "the token scale was built for a phone in a parent's hand and
it is right for that". It is right for a phone and it stops one step below the
size a page heading starts at. The fix there was a named scale for the
instrument. The fix here is the same.

So this is not a tidy up of 30 sloppy values. It is a missing rung, and the
sloppiness is what a missing rung looks like eighteen times.

## What gets built

### 1. `shared/page-scale.ts` — four display roles

Named by what the text is doing, never by size, the same way `WALL` is.

- `hero` — the first heading on a selling page. Home, pilot, pricing.
- `page` — the heading of an inside page. Hub, curriculum, philosophy.
- `section` — a heading inside a page.
- `lead` — the paragraph under a hero, the one that carries the promise.

Four roles absorb all ~30 clamps. Anything that does not fit one of the four is
a sign the page has an extra level of hierarchy it has not earned.

### 2. A spacing ladder in `shared/tokens.css`

One ladder, five steps, on a ratio rather than a straight line, because even
spacing reads as a list and uneven spacing reads as a hierarchy. The near
neighbours collapse into it: 9px and 10px both become one step, and the pages
lose nothing a person can see.

### 3. The page shell

18 files carry `padding: '32px 20px 80px'` and the rest carry a variation of
it. One shell value, read from the ladder.

### 4. A ratchet guard

`scripts/check-schools-scale.mjs`, counting off scale values and failing if the
count goes UP. Not zero, because 104 paddings do not all land today, and a
guard that demands the impossible gets switched off. The number only ever falls.

## What this batch does NOT touch, said out loud

- **Card and control padding.** Roughly 70 of the 104 padding values are inside
  cards and buttons, and most of those boxes are due to be deleted in batch two.
  Restyling a box on Thursday and removing it on Friday is work done twice.
- **The `--text-*` scale itself.** It is right and 384 call sites depend on it.
- **The wall.** `shared/wall-scale.ts` is a different instrument with its own
  guard. Untouched.
- **The print sheets.** The sub 12px sizes live almost entirely in QuizSheet,
  `print/kit.tsx` and the passport sheet. On a dense A4 sheet a 9px label can be
  a deliberate choice, so each is read before it is judged, and any that are
  deliberate stay.
- **The parents and child apps.** The shared `LessonPlayer` phone branch is used
  by three apps and is not in this lane.

## Verification

- Frames at 390 and 1440 on every schools route that has a heading, before and
  after, compared side by side rather than declared.
- Both typechecks, every guard by exit code, the dash scan.
- review.md sections 5 and 7.
- An A4 print check on any sheet whose type was touched.
