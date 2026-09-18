# Batch 3: one motion language, and a promise that was not being kept

18 September 2026. Session 0u09q9. Schools app only, wiring untouched.

## Measured first, again, and it found something worse than inconsistency

The schools app looked inert: one `transition` declaration in the whole app, no
keyframes, no hover rules in its stylesheet, no mouse handlers. That reading was
wrong, and wrong in the useful direction: the motion is not in the app, it is in
the shared primitives the app uses.

```
  .btn              transition: transform 0.1s, box-shadow 0.1s
  .btn-outline      transition: background 0.1s
  .input            transition: border-color 0.15s
  .step-cta .arrow  transition: transform 0.2s ease
  .lift             transition: transform 0.28s cubic-bezier(0.2, 0.6, 0.2, 1)
```

**Five durations and one easing curve that only one rule uses.** Nobody chose
five. Each was chosen once, on its own day, for its own rule, which is the same
story space told this morning and shape told this afternoon.

## The thing that mattered more

`shared/tokens.css` has carried a `prefers-reduced-motion` block since August:

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .lift, .lift:hover { transition: none; transform: none; }
}
```

**It covers one class.** Every rule written after it kept moving. A teacher who
has told their operating system they do not want motion was still getting the
button transform under their thumb, the outline button changing ground, the
input animating its border and the arrow sliding.

The block existed, so the promise looked kept. A grep for
`prefers-reduced-motion` found it and said yes. Only a browser that actually
asks for reduced motion could tell the difference, which is why
`scripts/check-schools-motion.mjs` now does exactly that.

## What landed

1. **Four motion tokens** in `shared/tokens.css`: `--dur-press` (0.1s),
   `--dur-hover` (0.15s), `--dur-move` (0.28s), `--ease`. Named by what the
   thing is doing, because "fast" and "slow" mean nothing next to each other
   and 0.1 against 0.15 means nothing at all.

   **The values are the ones already in use**, so pointing the four existing
   rules at them changes nothing by a single millisecond in either app. That is
   what makes it safe inside a batch scoped to the schools app. The step
   arrow's 0.2s fits no rung and is **left alone rather than nudged**, because
   a batch that promised to change nothing should change nothing.

2. **A reduced motion block that covers everything**, in `schools/app/schools.css`
   rather than in tokens.css, because Justin said schools only and the parents
   app is owed the same block another day. 0.01ms rather than `none`, so
   `transitionend` still fires and nothing waiting on it hangs.

3. **`.gc-tap`**, on the five card shaped links. The buttons have had their
   press answer since August; a module card was the only clickable thing on the
   page that did not know it had been pointed at. Two pixels up on hover, one
   down on press, on the press duration and the house curve.

## Proven in a browser, not asserted

```
  reducedMotion=no-preference   .gc-tap 0.1s, 0.1s   PASS
  hover on a card link: none -> matrix(1, 0, 0, 1, 0, -2)   PASS, it answers
  reducedMotion=reduce          .gc-tap 1e-05s       PASS
```

## The wiring rule, still

`className` only on the five links. No element added or removed, no href
changed, no handler touched. Every `href` in the diff appears an even number of
times, so not one of them moved. `wiring-check`: 0 new.

## Owed, and named rather than quietly skipped

The parents app has the same one class reduced motion block and the same five
durations. It is out of scope today by instruction, not by accident.
