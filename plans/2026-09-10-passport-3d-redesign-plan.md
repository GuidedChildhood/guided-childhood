# The Passport, redesigned: a 3D book a kid wants to open

Justin, 10 September 2026, with five photos of a real Kings Fitness and Leisure
Junior Active Passport:

> "Plan a redesign visual 3d passport the outside looks great but could have
> images on corner of planet friends but really make the stage pages inside very
> easy to read for each stage adding days done in child's app to digi stars done
> links or ability to send reminders to child's app lessons outstanding and
> balance reminder to use device timer all usable simple seeing it fill up on
> passport looking super fun for kids view of it ability to see 3d render and
> move it around use higgsfield if necessary some ideas not colours but ideas
> attached."

His words on the photos: **ideas, not colours.** The Kings passport is a paper
booklet a child carries to a leisure centre, gets stamped, and fills up. What we
take from it is the object logic, not its palette: a cover you want to open, one
spread per level, a big obvious place where the proof of doing something lands,
and a page that visibly gets fuller. Checker tokens throughout.

This is a plan. Nothing here is built yet.

---

## 0. The one tension to settle first

CLAUDE.md line 112: **"Motion: GSAP only, subtle fade ups, staggered reveals, no
Three.js."**

Justin has asked for "ability to see 3d render and move it around". Those two
can both be true, and there are exactly two routes that stay inside the house
rule:

**Route A, CSS 3D (recommended).** `components/pathway/PassportBook.tsx` already
does real 3D: `perspective: 1400px` at line 232, `transformStyle: preserve-3d`
at 237, and `rotateY(-88deg / 88deg / 0deg)` page flips at 239. A book with
thickness, a spine, a back cover and drag to rotate is the same technique with
more faces and a pointer handler. No dependency, no bundle cost, works on a
phone, and it inherits everything the book already knows (per child celebration
memory, the certificate page, the print mark).

**Route B, a pre rendered turntable from Higgsfield.** `generate_3d` and the
`scene_builder_3d_*` tools are in this session. A rendered burgundy and gold
book on a short loop, or a frame sequence a parent can scrub, is a video asset,
not a 3D engine, so it also sits inside the rule. It looks more expensive and it
cannot show live progress: it is a marketing object, not a product surface.

**Recommendation: build Route A in the product, and use Route B once, for the
marketing shot and the starter pack reveal.** A live book that shows this
child's real filling up is worth more on the pathway page than a beautiful video
of a generic one. If Justin wants the rendered look inside the app instead, that
is a CLAUDE.md change first, not a quiet exception.

---

## 1. What exists today, so nothing gets rebuilt

| Thing | Where | State |
|---|---|---|
| The book, cover, five stage pages, certificate | `components/pathway/PassportBook.tsx` (979 lines) | Working. CSS 3D flips already. |
| The five rows per stage | `lib/pathway/passport-sections.ts` | Devices, moments, lessons and tests, jobs and routines, screen balance. Each carries `pct`, `label`, `href`, `help`, `alert`, `ongoing`. |
| The stamp model | `components/pathway/PassportStamps.tsx` | `Stamp` and `ChecklistSection` types. The earned seal is the stage's Planet Friend, inked. |
| Planet Friend per stage | `lib/content/stage-characters.ts`, `characterForStage()` | Already on every stage page, under the ring. Local art, cut out, 512 square. |
| The to do lift | `components/pathway/PassportToDo.tsx` | Sits above the book. Sends the child's half to their app via `/api/pathway/passport-todo`. |
| Days done | `kid_days` table, read by `lib/kid/day-report.ts`, `lib/stickers/book.ts`, `lib/pathway/streak-unlock.ts` | Exists. Not on the passport. |
| Stars | `getStarBanks` in `lib/quests/bank.ts` | Exists. Not on the passport. |
| Send to the child's app | `/api/kid/nudges`, `/api/quests/nudge`, `/api/quests/ping`, `/api/digi/send-to-child`, `kid_nudges` table | Four working senders. **Do not write a fifth.** |
| The sticker book, the child's side | `lib/stickers/book.ts`, `components/pathway/StickerBook.tsx` | Reconciles on read from real numbers. Where the kid's fun already lives. |
| Fixtures | `app/dev/passport-sections/page.tsx`, `app/ref-passport-book/page.tsx` | Render the book with no database. Extend, do not replace. |

The passport is not thin. What it is missing is **the child's half of the
truth**: it reads the parent's five rows and says nothing about the days the
child has actually done, the stars they hold, or the device timer sitting unused.

---

## 2. The Mobbin pass, and what it changed

Six reference screens, pulled before designing:

- **Me+ achievement badges.** Not yet earned badges are drawn as embossed ghosts
  in the same slot, same size, same position as earned ones. You can see the
  shape of the whole set on day one. This is the single strongest idea and it is
  what makes a page "fill up" rather than "grow".
- **Withings Health Mate.** A grid of badges reads as a collection, not a list.
- **Skillshare achievements.** Every badge carries its own small progress bar, so
  a locked item still says how close it is.
- **Ten Percent Happier milestones.** Milestones on a path, so order is legible.
- **Finch.** The character visibly grows on a full day. The reward is the
  creature, not a number.
- **Duolingo ABC.** Star collection as the whole reward loop for young children.

What that changes in our design: **the stage page stops being a checklist with a
ring on top, and becomes a page with a fixed set of slots, most of them empty at
first.** Empty slots in the stage's own ink, at full size, from the first day. A
parent scanning it sees the shape of the whole stage, and a child sees exactly
how much book is left to fill.

---

## 3. The cover

Keep the burgundy and gold. It is the best thing on the page and Justin says so.

Add, one change only: **the five Planet Friends around the crest, small, in the
corner, foil ghosted until their stage is stamped.** Nova, Cosmo and the rest at
about 26px each, drawn at `opacity 0.22` with a gold rule around them, going to
full colour art as each stage stamps. That is Me+'s embossed ghost idea applied
to the cover: the cover itself becomes a progress reading, and it answers
"how far in are we" before the book is even opened.

The passport number, the crest, the Tap to open line and the two front door
buttons all stay exactly as they are.

**Thickness.** The book gets a spine and a back face so it reads as an object:
three extra `preserve-3d` faces on the existing wrapper, a gold spine with the
stage count printed down it. Cost is small and it is most of what makes a CSS 3D
book feel real.

**Drag to rotate.** Pointer down on the cover, drag left or right, the whole book
rotates on Y up to about 35 degrees each way and springs back on release. Not a
free orbit: a book you can tilt and look at, which is what a child does with a
real one. `prefers-reduced-motion` turns it off. Keyboard users keep the arrows.

---

## 4. The stage page, redesigned

Justin's exact list for the inside pages: days done in the child's app, DiGi,
stars done, links or the ability to send reminders to the child's app, lessons
outstanding, and a balance reminder to use the device timer. Plus "very easy to
read for each stage" and "simple".

Those six do not all deserve equal space. The page is 340px wide on a phone. The
proposal is three bands.

### Band one, the seal (unchanged in structure)

The big ring, the percent, the stage name and ages, the Planet Friend. This
already works and Justin says the object looks great. One change: the ring's
number gets a **plain English line underneath**, "4 of 9 things done at this
stage", because a percent is a summary and a count is a fact.

### Band two, the five slots (redesigned, this is the heart of it)

The five existing sections from `lib/pathway/passport-sections.ts` become five
**stamp slots** laid out as a row of circles, Me+ style:

- Every slot is drawn at full size from day one, in the stage's ink at low
  opacity, with its emoji ghosted inside.
- A slot at 100 percent fills in solid, ink on the stage colour, with the small
  pressed rotation the earned seal already uses.
- A slot in progress carries a thin arc of its own percent around the ring, which
  is the Skillshare idea: locked but honest about how close.
- The `ongoing` rows (jobs, balance) get a different mark, a ring rather than a
  fill, because they are kept up and not ticked off. That distinction already
  exists in the data and currently only appears as a text chip.

Underneath the five slots: **one row of help for the next open slot only.** That
rule already exists in the current page and is right. Keep it.

Five circles plus one line of help replaces five stacked link rows. That is the
"simple" and the "very easy to read" in one move, and it is why the page can then
afford band three.

### Band three, the child's half (new)

A single strip, four readings, mono labels, no links inside it except one:

| Reading | Source | Why it is here |
|---|---|---|
| Days done | `kid_days` for this child, count since the stage began | Justin asked for it first. It is the only number on the passport that is purely the child's own doing. |
| Stars | `getStarBanks` | The child's currency. A parent currently has to leave the passport to see it. |
| Lessons left | `stamp.lessonsTotal` minus `stamp.lessonsDone`, already on the type | Named as "3 lessons left at this stage", not a percent. |
| Timer | `lib/balance/parent-report` week reading, already fetched by the page | Says one of two things: "Device timer used 4 days this week" or "The device timer has not been used this week". The second is the balance reminder Justin asked for. |

Then **one button under the strip: Send this to their app.** It reuses
`/api/pathway/passport-todo`, which is the exact sender `PassportToDo` already
uses and which already filters to the rows a child can actually move. No fifth
send route, no new table, no new copy path.

The DiGi line goes at the foot of the strip, one sentence, tapping through to
DiGi with the stage in context: "Ask DiGi what to do next at this stage." That is
`/api/digi/send-to-child` territory only if Justin wants DiGi to speak to the
child unprompted, which is a separate decision and is **not** in this plan.

---

## 5. Seeing it fill up

Three things, in order of how much they matter:

1. **The ghost slots.** Above. This is the whole effect. A page that starts with
   five visible empty circles and ends with five solid ones is a page that fills.
2. **The cover's five Friends.** The book's outside becomes a progress reading.
3. **A page turn that lands.** When a slot goes from open to filled between two
   visits, it presses in with the existing `gcStampIn` animation, once, on first
   sight, remembered per child in the same `localStorage` key the celebration
   already uses. Not on every render, which would be a page that never settles.

No confetti, no counters ticking up. The book is a keepsake, and the loud
celebration already lives on the child's day done screen.

---

## 6. The kid's view

Justin: "super fun for kids view of it".

The child does not get a second passport. `components/pathway/StickerBook.tsx`
and `lib/stickers/book.ts` are already the child's collection surface and they
already reconcile from real numbers. What the child gets is **a way to look at
the parent's book**, read only, from their own app:

- The same `PassportBook` component, `readOnly` prop, no links out, no to do.
- Drag to rotate on by default, because that is the fun part and a child will
  find it in two seconds.
- Their own Planet Friend on their own stage page, large.
- The one line that matters to a child: how many days they have done, and what
  the next Friend is.

This is one route and one prop, not a new build, because the book is already a
component with no page dependencies beyond its props.

---

## 7. Phases

| Phase | What | Size | Risk |
|---|---|---|---|
| 1 | Ghost slots and the five circle band. Replaces the five link rows on the stage page. Fixture first, screenshots on both widths. | Medium | Low. Reads data that is already on `Stamp`. |
| 2 | Band three, the child's half. Days done, stars, lessons left, timer. Needs a new gather in `lib/pathway/passport-sections.ts` or beside it, plus the send button wired to the existing route. | Medium | Low, but it adds two queries to the pathway page. Batch them into the existing `Promise.all`. |
| 3 | The cover: five ghosted Friends, spine and back face, drag to rotate. | Medium | Low. Contained to `PassportBook.tsx`. |
| 4 | The child's read only view. One route, one prop. | Small | Low. |
| 5 | The Higgsfield turntable, marketing only. Not in the product. | Small | None to the app. |

Phases 1 and 3 are independent and could go in one PR. Phase 2 depends on
nothing but takes the most care because it touches page level data fetching.

---

## 8. Guards and checks before any of it ships

- New guard `scripts/check-passport-slots.mjs`: every section from
  `buildPassportSections` renders a slot, and a slot with `ongoing` renders the
  ring mark rather than the fill. This is the same failure shape as the lessons
  age gate: a thing that is in the data, in the DOM, and invisible on screen.
- Extend `app/dev/passport-sections/page.tsx` with `?stage=1..5` and `?full=1`
  so an empty stage and a fully stamped one can both be looked at without a
  database.
- Screenshots on 390 and 1280, per non negotiable 5, including the longest
  possible stage name against the longest slot label.
- `token-guard`, `wall-contrast-guard` and the dash grep, as always. Ghosted ink
  at low opacity is exactly where a contrast failure hides.

---

## 9. What is deliberately not in this plan

- **No Three.js.** Settled in section 0.
- **No new send route.** Four exist.
- **No second passport for the child.** One book, two views.
- **No change to what stamps a stage.** `lib/pathway/stamped.ts` stays the one
  definition. This plan changes how the passport reads, never what it counts.
- **No DiGi speaking to the child unprompted from the passport.** Separate call.

---

## 10. What Justin needs to decide

1. **Route A or Route B for the 3D.** Recommendation is A in the product, B for
   marketing. B inside the app needs a CLAUDE.md change.
2. **Does the child get the read only view now, or later.** It is small, but it
   is the first time a child sees a surface built for their parent.
3. **The DiGi line.** A link the parent taps, or DiGi speaking into the child's
   app off the back of a stage. The first is in this plan. The second is not.
