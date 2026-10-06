---
name: sb-carousel
description: Build a Social Billboard carousel, single image, Reel cover or Facebook cover for Instagram and Facebook in the house series system, the same way every time. Use whenever Justin asks for a Social Billboard (SB, TSB, playlist) carousel, post image, weekly playlist card, "make the slides", "design the post", "turn this into a carousel", a Reel cover or a Facebook cover. Writes the deck JSON, checks the word budget and the claim gates, renders the PNGs with alt text, and copies the launch set where Justin can open it. Never Guided Childhood, which has its own cream and butter system and the family-social skill.
---

# SB carousel

One system for every Social Billboard post, so the account reads as a shelf of
series rather than a new design each time. The renderer and every token live in
`tools/tsb-playlist-card/`; this skill is the method around it.

## Before writing a slide

Answer these five in one line each. A carousel that cannot answer them is not
ready to design.

1. **Who it is for.** Default: a UK parent of a child aged 3 to 14 who already
   lets them watch YouTube and is tired of what comes after the video ends.
2. **Why it exists.** The one idea, in a sentence.
3. **The call to action.** Product posts end on GET A FREE PLAYLIST. Founder and
   question posts end on a question, with no link.
4. **Slide count.** Six to ten for a carousel (engagement dips after slide 3 and
   peaks near 10, Socialinsider). One for a single image.
5. **The series.** One of: WHY I BUILT THIS, THE NEXT VIDEO, THIS WEEK'S
   PLAYLIST, WHY THIS MADE THE PLAYLIST, WHAT DID WE COME HERE TO FIND?, ONE
   THING WE CHECKED, PARENT REQUEST BOARD, I TRIED IT AS A DAD, HOW IT WORKS,
   GET A FREE PLAYLIST. Do not invent a new series for one post.

## The rules

- **Word budget.** Slide 1 carries 12 words at most; every other slide 25.
  Chips do not count. `node tools/tsb-playlist-card/check-words.mjs` enforces it.
- **Slide 1** holds three things: the masthead, a headline, one proof element
  (Justin's face, the age chip, or a real screen).
- **Real before generated.** Real Justin, real product, real playlist, real
  screenshots first. Generated art only as a background with no text (the night
  skies), made on Higgsfield. Never a child's face, a stock person, a synthetic
  parent, a YouTube thumbnail, or a fake screen.
- **Claims come from the control document.** `plans/sb-parent-launch-control.md`
  section 1 lists what can and cannot be said. "When it ends, it ends",
  "nothing autoplays", the full checking framework, "safe" and "vetted by
  experts" stay out until their gates clear.
- **Founder lines** come only from `content/brand-story/founder-context.md`,
  never invented, never repeated on the family account in the same fortnight.
- **Research lines** go through the citation-verifier agent before they render.
  Name the population (age, country, sample) on the slide.
- **No dashes anywhere.** "9 to 11", never "9–11". Run `npm run ai-tells` on
  any new copy file.
- **Brand colours are black, white and yellow (#FFCE1B) only. No pink.** The age
  band is the one filled chip (white on dark slides, black on light). Yellow means Social Billboard and
  action. One yellow element per slide.
- **Separation.** Guided Childhood appears at most as one small line in a
  founder post. Creators appear only once parent demand is real.

## Making it

1. Copy the closest deck in `tools/tsb-playlist-card/decks/` (`series-*.json`
   for carousels and single images, `reels-01-covers.json`,
   `facebook-cover-01.json`). The fields are documented in the README there.
2. Write the slides. Captions are written at the same time, as short paragraphs,
   ending with one send line or one question.
3. `node tools/tsb-playlist-card/check-words.mjs decks/<deck>.json`
4. `node tools/tsb-playlist-card/render.mjs decks/<deck>.json`. Playwright needs
   a `node_modules/playwright` link to `/opt/node-tools/node_modules/playwright`
   in a cloud session.
5. Look at slide 1 and the last slide before anything else. Fix, render once
   more, stop.
6. Copy the PNGs into the current pack's `renders/` folder (out/ is gitignored),
   so Justin can open them from GitHub, and add the day to the posting page if
   one exists for the week.

## Platform rules (Instagram and Facebook)

Adopted 5 October 2026 through the feedback filter; the verdicts are in
`plans/sb-parent-launch-control.md`, Day 4.

- **Slide 1 is a curiosity gap**, a number or a tension the swipe resolves
  ("18 space videos opened. 13 didn't make it.").
- **Slide 2 is a second hook that stands alone.** Instagram shows a carousel
  again from slide 2 to people who scrolled past slide 1.
- **Story order:** hook, the problem, the tension (what got cut, what nearly
  went wrong), the payoff, the honest limit, the ask.
- **The Instagram ask is a send** ("Send this to a parent with..."), with
  GET A FREE PLAYLIST as the pill. Sends to a friend are what Instagram
  weighs most for reach beyond followers. One ask per post.
- **Caption:** the first line carries the words a parent would search
  ("space videos for 9 to 11 year olds"), short paragraphs, three hashtags
  at most, link in bio.
- **Alt text on every slide**, written into the deck as `alt`; the renderer
  writes the `.alt.txt` files.
- **Facebook:** all slides as one photo post, the post ends on a real
  question, and the link goes in the first comment.
- **After posting:** share to the Story with a link sticker within the hour,
  and reply to every comment in the first hour with a question back.
- **Never:** "comment YES" asks (Meta demotes engagement bait), trending
  audio for its own sake, or a paid boost before a post has a result.
- **A face lifts slide 1.** When a real photo of Justin with the product
  exists, it goes on slide 1 in place of a background.

## Sizes

| Asset | Size | Note |
| --- | --- | --- |
| Carousel slide, single image | 1080 x 1350 | Words inside the central 3:4 band |
| Reel cover | 1080 x 1920 | Inside the 3:4 grid crop, nothing in the bottom 380px |
| Facebook cover | 1640 x 924 | Words inside the middle 1640 x 624 band, clear of the profile picture |
| Weekly card, Facebook and email | 1200 x 630 | `space-9-to-11.json` |

## References

When Justin shares reference carousels (Pinterest, other accounts), take the
layout idea only: slide pacing, where the image sits, how big the words are.
Never copy the artwork, the wording or the colours. Weigh any outside advice
through the feedback-filter skill first.
