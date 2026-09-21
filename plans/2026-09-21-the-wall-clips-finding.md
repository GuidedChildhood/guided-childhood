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
