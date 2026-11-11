# GDC 058 storyboard: Look at the feed, not only the clock

Silent editorial motion graphic for the LinkedIn post. 1080 by 1350, 30 fps,
594 frames, 19.8 seconds, no audio stream. Rendered from `index.html` with
HyperFrames 0.8.82 (`sh render.sh`).

## The beats

| Beat | Frames | Start | End | Words on screen | What moves |
|---|---|---|---|---|---|
| 1 The clock | 0 to 97 | 0.00 s | 3.23 s | A timer can tell me how long. | The line is there from frame 0. A plain clock ring: the hand and a gold arc sweep two thirds of the way round, then stop. |
| 2 What kept arriving | 97 to 197 | 3.23 s | 6.57 s | A timer can tell me how long. (dimmed to the secondary ink) It cannot tell me what kept arriving. | The clock steps down to head a row and an identical twin joins it. Two rows of blank tiles slide in from the right, one row in warm tints, one in cool tints. Screen leaves upward from frame 191. |
| 3 The finding | 197 to 234 | 6.57 s | 7.80 s | PUBLISHED 6 NOVEMBER 2026. The European Commission has preliminarily found TikTok in breach of the Digital Services Act. | A white card rises in, landed at frame 206. A gold marker sweeps under "preliminarily". |
| 4 The caveat | 234 to 464 | 7.80 s | 15.47 s | The same card, plus: A preliminary finding, not a decision. | A rule draws and the caveat fades up (landed frame 249). Then stillness for reading. Card leaves upward from frame 458. |
| 5 The close | 464 to 594 | 15.47 s | 19.80 s | Look at the feed, not only the clock. | The ground warms to the butter tint. The close rises in, landed at frame 473. A gold line draws under "the feed", a small clock and one row of mixed tiles settle. The words never move again. |

The brand footer (the logo mark and "Guided Childhood") sits bottom left for the whole film and never animates.

Middle frames extracted to `frames/`: 48, 147, 216, 349, 529.

## The reading rule, checked

Rule (product-shorts, rule 8): hold = 0.6 s + words / 3.3, never under 1.4 s, plus 0.5 s for a new screen.

| Text | Words | Needs | Gets |
|---|---|---|---|
| Line one alone, new screen | 7 | 3.22 s | 3.23 s (frame 0 to 97), then stays to frame 191 |
| Line two, same screen | 7 | 2.72 s | 2.73 s (landed 109, exit starts 191) |
| Screen A, both lines | 14 | 5.34 s | 6.37 s |
| The card, all of it, new screen | 24 | 8.37 s | 8.40 s (landed 206, exit starts 458) |
| The caveat on its own | 6 | 2.42 s | 6.97 s (landed 249, exit starts 458) |
| The close, new screen | 8 | 3.52 s | 4.03 s (landed 473, film ends 594). The motion standard asks four seconds or more for the hook. |

## What is not on screen, and why

- "The same amount of time. The same platform. Very different worlds." is carried by the picture (two identical clocks, two rows in different tints), with no words. With those eleven words the film cannot meet the reading rule inside 20 seconds.
- "over the way its For You feed works" is cut from the Commission line for the same reason. The line that remains is a shortening of the approved one and adds nothing.
- No number other than the date. No chart, no app screen, no logo but ours, no person, no character.

## Safe zone

All words sit inside x 90 to 990 and y 90 to 1265 (the 4 to 5 crop of the product-shorts critical box). The footer is raised to bottom 90 px, 18 px higher than the still card template, so it clears y 1265. Tiles are shapes and are allowed to run off the right edge.
