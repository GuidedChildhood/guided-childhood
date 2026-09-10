# The starter pack reveal: shrink the scroll, keep the recognition

Justin, 10 September 2026:

> "can we really reduce the text on this page and make it the best marketing
> exciting converting page to make sure parents can not say no to this platform.
> I love the problem shown, also add known problem for our known ideal customer.
> Also like how you have tabs of service for solutions so maybe the actual
> written text with it can be folded away, or really perfect marketing sentences
> short as possible, deliver the problem solution tactic, and just make the other
> information after that a collection of happy news design icons so we can shrink
> the scroll and too much text ... icons such as see optional child's app
> contents and helps with tasks, school help, moments, scripts, they can all live
> under icons. When it's bigger than this, with ways of navigating back to
> starter pack or through to platform. We've got you, not another blocking app,
> our philosophy, all in pretty happy news icons. A number you agreed, child gets
> own app, passport road to 16."

## The measurement

`/ref-reveal` at 390 wide, before any change: **9899px and 1513 words.** Twelve
phone screens. The only button that takes a parent into the product is at the
very bottom of all twelve.

That last fact is the conversion story. A parent who is sold at screen three has
nowhere to say yes.

## What Justin likes, and what stays untouched

- **The problem card.** Coral, chunky, "THE PROBLEM" in mono, the parent's own
  evening in one sentence. It opens every section and it is the reason the page
  works. It stays exactly as it is.
- **The service pills** under each worry (Daily check in, Moments, DiGi, Your
  record). These are the "tabs of service for solutions" he means. They stay.
- **When it is bigger than this.** The safeguarding block: CEOP, Childline, 999,
  the GP. It never collapses, never shortens, never sits behind a chevron. If
  anything on this page must be readable by a frightened parent at speed, it is
  that.

## The Mobbin pass

Five apps doing this exact job, and they agree:

- [Stake](https://mobbin.com/screens/df6b1bf9-968e-44a7-93e6-37d94d7d73c9): a two up grid of icon tiles, each a short bold title and one line under it, grouped under small headings, with a sticky Continue underneath. This is nearly the shape Justin describes in words.
- [Canva Pro](https://mobbin.com/screens/a4852348-52a6-413a-b774-470f9f68c61f): every feature is a one line row with a chevron, detail behind it, and the trial button is pinned.
- [foodpanda](https://mobbin.com/screens/0c5ec889-d62c-4dfc-af4e-c71fb4f43ec9): perk rows, icon plus one bold line, chevron for the rest, sticky CTA.
- [Rocket Money](https://mobbin.com/screens/6ac66e8d-7cd5-48f4-9a58-f4f2e3c450ba): fifteen features in one screen because each is one line. Length is not the problem, line count is.
- [KOHO](https://mobbin.com/screens/42800849-5088-4fdd-af64-a53b0f40ce5c): the FAQ folded, the CTA pinned.

Two lessons: **detail goes behind a chevron, and the button is always on screen.**

## What changes

### 1. The button is always there

A pinned bar from the first scroll: **Finish setting up**, with the free four
days and no card underneath it in one short line. Right now a parent has to
finish reading to find the door.

This is the single biggest change on the page and it is worth more than every
word cut below it.

### 2. Every section keeps three things and folds the rest

Visible: the problem card, the headline, and one sentence. Behind a chevron: the
paragraphs, the numbered beats, the evidence notes. Nothing is deleted. A parent
who wants the reasoning presses once; a parent who is already nodding scrolls on.

### 3. The known problems, in the ideal customer's own words

Justin asked for the known problems of our known customer, and THE-STORY section
2 already has them, mined from Mumsnet, app store reviews and UK surveys:

- "It's utterly miserable constantly policing screen time."
- Nine in ten parents argue with their children about screen time.
- 54 percent regret giving their child a smartphone.
- 47 percent feel their child knows more about technology than they do.
- The blocking apps they already tried: "a huge waste of money time and energy."

These go near the top as a short recognition strip, before we say anything about
ourselves. Every number carries its source, and none of it is a claim about our
product.

### 4. The rest becomes a grid of happy news icons

One two up grid, using the eight `MethodIcon` marks that already exist, each tile
opening to two short lines:

| Tile | What is behind it |
|---|---|
| Their own app | The jobs, the stars, the five a day, no login and nothing buzzing at night |
| Lessons and school | The algorithm, group chats, strangers, passwords, and the school version |
| Moments | The thing that went wrong tonight, and what to do about it |
| Scripts | The words, ready before the moment |
| DiGi | Never allow or deny, always a calibrated pathway |
| Device time | A number you agreed this morning, not one you defend at six |
| The passport | One road from four to sixteen, stamped stage by stage |
| Printables | For the days with no device at all |

Plus two that are the philosophy rather than a feature, in the same grid because
Justin asked for them there: **We have got you** and **Not another blocking app**.

### 5. Getting back

Justin: "ways of navigating back to starter pack or through to platform". Every
folded panel closes on itself, the sticky bar is the way through, and the safety
block gets one line back to the top of the page so a parent who scrolled into it
looking for help can get out.

## The target

Under 5000px and under 700 words visible with everything folded, from 9899px and
1513. Every word still on the page, one tap away.

## Checked

390 and 1280, `token-guard`, the dash grep, and the page rendered with reduced
motion so the GSAP reveal cannot hide a section from the measurement. That
mattered: the first capture of this page showed 2600px of blank, because the
sections sit at opacity 0 until scrolled to and a full page screenshot does not
trigger them.
