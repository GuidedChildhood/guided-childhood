# The wall clips, and the ceiling cannot see it

Found 21 September 2026 while rendering migrations 326 to 336. Not caused by
that batch. Live in production now.

## What happens

On a classroom projector at 1920x1080, diagram slides draw their heading, their
caption and all of their step cards at once, and the cards are cut off mid
sentence. The end of each card sits below the fold inside a scrolling area,
faded out. Nobody scrolls a wall mid lesson, so the class reads half a sentence.

**ks2-09-copyright-ownership slide 12** is the clearest case, and it is the
slide carrying that lesson's three moves:

- Card 2, Credit it: `Using someone's picture, words or music? Name the maker, every single` and it stops there.
- Card 3, Ask first: `Want to copy it, change it or share it with everyone? Ask the maker BEFORE,` and it stops there, on the word the whole card exists for.
- The teacher script says **point at the three verdicts along the bottom**. The
  verdicts are below the fold. The bar is telling the teacher to point at
  something the wall is not showing.

**ks3-12-misinfo-deepfakes slide 21** is the same shape. Four cards, all four cut
mid sentence, and the script says *the last line on screen is the identity shift
of the lesson: you are no longer most people*. That line is the one in the fade.

That is the fault this term's must batch spent 102 edits fixing: the presenter
bar tells the teacher something the screen does not do. Here it is not the words
that are wrong, it is that the wall is not drawing them.

## How much of the scheme

Two whole lessons were measured slide by slide at 1920x1080, every slide, not
just the ones this batch touched (measuring only the slides I had made longer
would have answered a question I already knew the answer to):

| Lesson | Slides clipping | Of |
| --- | --- | --- |
| ks3-12-misinfo-deepfakes | 12 | 35 |
| ks2-09-copyright-ownership | 15 | 29 |

Most are small, twelve to thirty pixels, which is about the depth of the fade
mask itself and may be nothing. **Nine of the 64 clip by more than a line of
wall text**, and those are the real ones: 343px, 261px, 210px, 185px, 127px,
108px, 103px, 65px, 61px.

More height does not help, because the type scales with the viewport. ks4-18
slide 11 hides 17px at 1440x900 and 76px at 1920x1080.

## Why every guard passes it

`scripts/council-checks.mjs` has a word ceiling that was properly derived: 105
words for KS2 to KS5, measured by rendering all 78 prose slides at 1920x1080 and
1366x768 rather than asserted. It is a good number and it is not the problem.

The problem is the shape it is applied in. `ON_THE_WALL` splits a slide into
prose and blocks, and blocks are measured **one at a time**, deliberately:

```js
diagram: {
  prose: ['heading', 'caption'],
  blocks: s => (s.steps ?? []).map(x => `${x.title ?? ''} ${x.text ?? ''}`).concat(s.verdicts ?? []),
},
```

The reasoning for not summing is sound. A child reads one block at their own
pace, so summing four cards and calling the slide dense would be the cheat, and
the file says so.

But the wall does not read one card at a time. It draws all four at once, plus
the heading, plus the caption, and they have to fit in one screen height
together. So four eleven word cards each pass comfortably while the slide as a
whole is cut off. **The ceiling measures readability. Nothing measures fit.**

It was originally derived from a fit measurement, which is why this is a
regression in method rather than an oversight: the number came from a browser,
the guard that carries it does not use one.

## What would fix it

Not a copy cut. Cutting good KS2 copy to fit a layout nobody has measured is the
wrong repair to the right complaint, and council-checks.mjs already learned that
once: the first attempt at the ceiling cut copy before noticing the emoji was
eating 15 percent of the height.

So, in order:

1. **Measure before deciding.** Render all 29 lessons, every slide, at 1920x1080
   and 1366x768 through the real player, and record what clips. The harness for
   this already exists in the scratchpad from today; it needs to move into the
   repo. The two lessons measured here are a sample, not the answer.
2. **Look at the layout first.** Step cards are fixed height with the text
   overflowing inside them. Whether the right fix is cards that grow, a smaller
   card type ramp, or fewer cards per row at this width is a layout question,
   and it may remove most of the 64 without touching a word.
3. **Then a guard that uses a browser**, because a static word count provably
   cannot see this. Same ratchet shape as `check-schools-scale.mjs`: record what
   clips today, fail only when the number goes up.
4. **Only then**, whatever copy is genuinely too long for a fixed layout.

## What this is not

It is not migrations 326 to 336. Those touched four of the 64 slides measured
here, and moved them by 13 to 66 pixels on a condition that was already there on
three of them. ks2-09 slide 12, the worst case in this file, is not a slide the
batch edited at all.

It is also not urgent in the way a wrong fact would be. Every one of these
lessons still teaches its point: the teacher script carries the full content,
and the exit quiz and the worksheet are unaffected. What is lost is the class
reading the end of a sentence off the wall, and a teacher being told to point at
something that is not there.

Evidence frames are in the session scratchpad under `render/`:
`worst-ks2-09-copyright-ownership-s12.png`, `fit-ks3-12-misinfo-deepfakes-s21-wall.png`,
`report-whole.json`, `report-fit.json`, `report-fit-pre.json`.

---

# What it turned out to be, same day

## The measurement, on an instrument that can be trusted

1716 measurements, all 29 lessons, every slide, 1920x1080 and 1366x768,
through the real player. **288 slides clip, 227 of them on the projector.**

That number only means anything because of what had to be fixed first. See
"The guard was measuring a demo deck" below before trusting any figure here.

## Two causes, neither of them the copy

**The teacher's script was taking a third of the class's wall.** The presenter
bar is `flexShrink: 0` against a `flex: 1` stage, so every pixel it takes comes
off what thirty children can see:

| slide | presenter bar | stage left for the class |
| --- | --- | --- |
| ks2-08 slide 18 | **363px** | 591px |
| ks4-29 slide 19 | 318px | 633px |
| ks4-17 slide 1 | 285px | 664px |

**Three width constants predated the wall scale.** `WALL.column` is 1400px
because that is seventy characters on ONE line; split three ways for a diagram
grid it is three twenty character ribbons, and ks4-29's 250 character middle
step wrapped to thirteen lines and stood 952px tall in a 633px stage. Both caps
inside `AnimatedIntro` were a flat `900`, from when that text was phone sized:
at `WALL.body` that is forty one characters a line, NARROWER than comfortable.
That is why title clipped on 29 of 29 lessons, with the lesson objective the
thing below the fold.

## Two columns is not the fix

It is the obvious answer for a long list and it is arithmetically impossible.
Halving the width doubles the lines in every item, and a grid row is as tall as
its taller item, so two columns cost `2 x max(a, b)` against one column's
`a + b`. That is never smaller. It only wins where every item already fits on
one line at half width, which a recap point never does. **Widening is the lever
that works.**

## What the five changes bought

Script cap `24vh` to `14vh`; diagram grid, keywords grid and recap list to
`WALL.wide`; both `AnimatedIntro` caps to `WALL.column`. No lesson text touched.

| type | pairs left | worst, before to after | average gained |
| --- | --- | --- | --- |
| diagram | 112 | 726 to 504 | 44px |
| title | 58 | 441 to 327 | 47px |
| keywords | 39 | 505 to 382 | 37px |
| recap | 32 | 723 to 531 | 21px |
| choice | 95 | 183 | 2px |
| objective | 51 | 489 | 1px |
| digi | 34 | 229 | 1px |

The four the width changes touched are the four that moved. The bar cap helped
only where the script was long, which is why choice, objective and digi gained
nothing: their bars were already at the floor. The concept slide, where the bar
reached 363px, is off the list entirely.

## The guard was measuring a demo deck

**This is the part worth remembering.** `GC_DEV_SLIDES` is read by the PAGE, in
the server process. The CI step set it on the guard and not on `npm run dev`:

```yaml
npm run dev &                                        # no GC_DEV_SLIDES
GC_DEV_SLIDES=/tmp/gc-dev-slides.json npm run wall-fit-guard
```

So the server ignored the file and served its built in 21 slide sample deck for
every request. All 29 lessons were measured as one demo deck, 1711 times, and
the results were filed under the real lessons' names. Three commits in a row
returned the identical "1 new, 215 fixed", including one with the layout fix
and one without.

Two wrong diagnoses came first, both checked rather than assumed:

- **Fonts.** Nunito loads in both; the fallback is 2.6 percent narrower. Real,
  and nowhere near enough to move 270 slides.
- **The browser binary.** The same pangram at 40px is 1126px in full Chromium
  and 1131px in the headless shell. That moves one slide in twelve, the one
  sitting at 67px against a 40px SLACK. Real, and far too small.

Both were true and neither was it. What was missing was the cheapest check of
the three: **whether the measurement was pointed at the right thing at all.**

## What the guard does now, so this cannot recur quietly

1. **A sentinel.** A known string is written into a reference slide and must
   come back in the DOM, or the run exits 2 naming the cause and the remedy.
2. **A settle loop.** The same scrollHeight twice running, fonts ready, real
   content in the column. A load that fails or a stage that never settles stops
   the run instead of recording a zero. It is also faster than the fixed 900ms
   wait it replaced.
3. **A provenance line.** Browser build, whether Nunito loaded, the width of a
   known string, and a fixed reference slide's measurements. A baseline of
   pixels carries its conditions or it carries nothing.
4. **The pair, not the key.** An entry is a slide AND a viewport, because CI
   runs the wall alone and 55 entries clip only at laptop size.

The binary is pinned to the one CI launches, and the first list's three false
negatives (ks2-08 s24, ks5-20 s6, ks5-21 s7, all confirmed clipping on the OLD
player at 58, 105 and 74px) are the argument for that.

## What is left, and it is not layout

The median wall slide still clipping carries **530 characters**; the worst run
750 to 1050. ks4-29 s28 is six recap points at 1051 characters, and no
arrangement of a 40px face fits that in 788px.

Only **34 wall slides** still clip while carrying under 300 characters, and the
title slide is most of them, at 170 to 200 characters and still around 300px
over. That one is the **324px character frame** on the opening slide, sized at
`min(440px, 28vh)` of the VIEWPORT while living in a stage a third smaller.
Shrinking the star is a brand decision, so it is named here rather than taken.

So layout has given what layout can give without touching the star or the type
scale. The rest is a curriculum question for the term review, sized per slide
rather than asserted.
