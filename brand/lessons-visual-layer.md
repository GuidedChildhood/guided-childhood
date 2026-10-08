# The lessons visual layer

How the Planet Friends carry the lessons, on the child's app and the parent's
app, so both people see the same thing and neither screen is overdone. Written
8 October 2026 from the design lens of the lessons panel (rounds 4 and 5,
scores Looks 4 then 7, Flow 7 then 8). The design system in
`DESIGN_SYSTEM.md` wins wherever this and it disagree.

Hard rule: **no character art is ever generated or regenerated.** Every asset
named here already exists.

## The cast is one friend per stage, not one per module

Read off `school_lessons.character_cast` on all 34 rows, resolved by
`characterKeyFor` in `shared/friend-register.ts` (earliest friend named wins):

| Stage | Modules | Cast |
|---|---|---|
| Foundation, ages 4 to 7 | 7 | Pebble, all 7 |
| Builder, ages 8 to 10 | 9 | Bloop 8, DiGi 1 |
| Explorer, ages 11 to 12 | 9 | Orbit 8, DiGi 1 |
| Shaper, ages 13 to 15 | 7 | Nova 3, DiGi 4 |
| Independent, 16 plus | 2 | Cosmo 2 |

The DiGi fronted modules are the safeguarding ones (algorithms at KS2, bodies
and image at KS3, consent, sextortion, radicalisation and unsought content at
KS4), and that is a standing decision, not a gap.

**The consequence that shapes everything below**: a child only ever sees their
own stage, so the friend cannot tell one row from another. The friend carries
the stage and the state. The number, the title and the tool chip carry the row.
This is the Duolingo path discipline: the character stands on the current node,
the rest of the path is plain.

## The tile, the one device

Every lesson thumbnail on every surface is the same object, at different sizes.

```
 ┌──────────┐   ground : CHARACTERS[key].soft   (child app: t.panel)
 │ ③        │   edge   : 1.5px CHARACTERS[key].accent
 │   ◟◝◞    │   radius : var(--radius-tile)
 │  (art)   │   badge  : the module position, mono 700, top left
 │▁▁▁▁▁▁▁▁▁▁│
 └──────────┘
```

**The default is a numbered tile**: the module position at Nunito 900
`--text-2xl` in `CHARACTERS[key].ink` on the friend's `soft`, no art. Friend
art appears on exactly three rows in a list:

| Row | Art | Edge |
|---|---|---|
| This week's lesson | `moods.thinking` | 3px `accent` plus `--lift` |
| The latest pass | `moods.happy` | 2px `accent` |
| Beside the stage check card | `moods.wave` | 2px `accent` |

Everything else is the numbered tile. **Never a padlock and never a dimmed
friend on a child's row.** Locked on the child's list means unpaid, and three
rounds of this panel took the paywall out of the child's words (the row reads
"After Social workarounds, this one is waiting for you"); a greyed out friend
behind a lock puts it back in the picture, and the picture wins. The one lock
left on the child's app is the stage check card, where it means not yet and the
child can act on it. On the parent's hub a locked row may carry a small ink
padlock, because the parent is who the lock is addressed to.

DiGi fronted modules draw `CHARACTERS.digi.img` (the 3D star) and have no
`moods`, so they carry state on the ground and the edge only, never a second
pose. On a DiGi fronted pass screen the star renders once, at 112, never
twice.

Sizes: 76 on the child's list, 56 on hub rows and the week card, 44 on the
pass screen's Next tile and the stage check card, 26 inside the Today row's
38px plate, 96 in the email. A load failure falls back to the friend's
`emblem` through `FriendMark`, so a failure is a coloured tile and never an
empty box. No `character_cast` means DiGi, the guide.

## `components/lessons/LessonRoadStrip.tsx`

One component, rendered identically on the child's list header and the
parent's hub above the hero. It is the one glance answer to what is
outstanding for the pass of the stage.

```
 ①──②──③──④──○──○──○──○──◉
 passed  ▲ this week        the stamp
         friend, 26px
```

- **Length comes from `childLessonPath().school.total`**, never a constant.
  Explorer is nine dots and a stamp, Foundation seven, Shaper seven.
  **Under four modules no strip renders**: two dots and a stamp is not a road
  and answers nothing, so Independent shows the stage check card instead, with
  "Two lessons, then the check".
- Dots 24px, the module numeral Nunito 800 11px, gap 7px, trail 3px dotted.
  Nine dots and a stamp is 302px, inside a 360px phone less its padding. Past
  nine the dots floor at 18px and the numerals drop before anything overflows.
- The colour recipes are `StageDot`'s (`components/pathway/StageRoad.tsx`), so
  the lessons road and the road to 16 are one family: passed is
  `--terracotta-lt` with a dashed `--terracotta` edge, this week is white with
  a 3px `--terracotta` edge and the chunky shadow, ahead is `--cream` with
  `--edge`.
- **It takes `theme?: KidTheme`.** The child's app is washed in the child's
  chosen accent (`lib/kid/theme.ts`, thirteen accents, two of them dark), so
  the four recipes map onto `{ hex, hexDark, panel, panelBorder, ink,
  inkMuted }` and default to the parent tokens when no theme is passed.
  Without this the road is a smudge on Midnight. The friend's `soft` and
  `accent` never change, per one friend one tint, and that is what keeps the
  two apps one object.
- **The final node is the passport's own stamp**, a circle at 26px, not a
  square: `--terracotta` with a white tick when earned, `--cream` with
  `--edge` and the stage numeral when not, matching
  `components/pathway/PassportStamps.tsx`. The same silhouette appears on the
  child's check card at 44, the last road node, the passport row and the hub's
  check card. Four surfaces, one shape.
- `RoadPulseStyle` on the current dot only. The friend mark
  (`FriendMark ring={false}`) stands on that dot, the one place that device is
  used.
- **The caption differs by reader.** The parent's reads "2 passed · 7 to go",
  because the parent is who the remaining lessons are addressed to. The
  child's reads "You are on lesson 3", because on an unpaid family's list
  "7 to go" names lessons the child cannot open.
- On the day a child ages up the strip starts again at one, with the earned
  stamp shown behind it, so a year of work is visible rather than wiped.

## Surface by surface

**The child's home, above the five a day.** One white card, `--edge`,
`--radius-card`, the chunky ink shadow, 14px above `KidFiveADay`. The week's
lesson: tile at 56 with its badge reading `4 / 9`, so the child's most opened
screen carries the one number; eyebrow mono caps; title Nunito 900
`--text-lg`; a mono line reading the friend's name, a middot, the tool
heading; then "Any day this week". The card is the tap target, no button. The
day before a Remember check is due, the second line reads "Thursday: three
questions from Mood and screens". After a pass the card holds the seven night
log (seven 10px dots, filled `--retro-green`), the parent's returned line in a
`--tint-butter` strip, and "Here when you want it. You have done this week's."
Week three unpassed the card drops to 0.85 opacity and reads "No rush. It is
here when you are." Nothing else fades.

**The child's list.** The road strip under the heading, then rows in the
existing shell with the 52px emoji box replaced by the tile at 76 and the
numbered circle folded into the badge. The tool chip is the row's
distinctness: mono `--text-xs` 700, the friend's `ink` on its `soft`,
`--radius-pill`. On a passed row the chip replaces the score line rather than
adding a fourth. The check card swaps its three emoji for the stamp at 44.

**The pass screen.** The module's friend at 112 with `FriendPlate`'s `arrive`
and the register for its key stage, DiGi at 56 to its right (omitted when DiGi
fronts the module), baseline aligned. The tool is the hero, Nunito 900
`clamp(1.6rem, 6vw, 2.2rem)`, centred. Then three white tiles, `--radius-tile`
and `--edge`, mono caps cap lines in `--terracotta-dark`: `THE CHECK`,
`THE COMMITMENT`, `NEXT UP`, the last carrying the next module's tile at 44.
One mono line under the check tile, "10 stars in your bank", because 10 is the
largest award in the app and the balance should not move unexplained. Then the
commitment input, the tea question, the next line, the dignity line. No motion
beyond the arrive.

**The near miss screen.** Words unchanged, DiGi `speak` at 100 unchanged, the
module friend joining at `thinking`, 56, smaller, no plate. There is no sad
pose and none is made.

**The co viewer pass screen, under 7.** The same frame, Pebble at 112
`register="bouncy"`, the tool as a three line chant, one textarea labelled
"What did Teo say?", then the tea line and `Back to your Home`. No tile row: at
five, three stat boxes are three things to read.

**The Remember page.** The stage friend once at the head at 56, not beside each
question, because within a stage three tiles are three identical friends and
cue nothing. Each question is labelled with its module title in mono caps.
Three 10px dots for the three questions. `KidStageQuiz`'s own DiGi at 72 on
the result only.

**The hub first tab.** Eyebrow, heading, the line, the tabs, then the road
strip and its caption, then the hero, then flat rows. The hero is the only
card on the page with a shadow. `Do it together now` is gold with the chunky
terracotta shadow, the nudge is outline. State lines are mono, never red,
never a count of days. Rows are flat, tiles at 56, no buttons. No stage
pastels on this tab: the friend's colours carry it. The parent's eye goes
strip, hero, rows: outstanding, this week, what happened. The hero's primary
button must be visible with no scroll on a 375 by 667 phone.

**The Today row on Home.** The friend inside the existing 38px plate at 26,
the plate ground taking the friend's `soft` and a 2px `accent` border, because
Pebble's `soft` and `--terracotta-lt` are the same butter and a ground swap
alone shows nothing. This is the one stacked row in the card: the two lines of
text, then the pill right aligned on its own line at 44px tall, Nunito 800
`--text-xs`, white ground, 2.5px `--terracotta-dark` border and the 2px
shadow. **Never the ring**, which on every other row means put away. On commit
the row swaps in place to its done state and stays for the visit. No friend
appears on any other row of the card, in the parent's navigation, or on the
library tab: the parent's app stays an adult's app with one warm row.

**The Sunday email.** A cream panel after the stats table, `1px solid BORDER`,
radius 14. Mono caps `LESSONS THIS WEEK`. Then a two cell table per pass: 96px
holding the teaching friend's email PNG through `emailFriendByCast`, the
sentence at Nunito 800 16px, the tool line at mono 13px. One friend image per
email at most; a second pass is text only. The alt text names the lesson, not
the stage. Images are blocked on a first open for most readers, so the block
must read perfectly with no art at all. Every string that came from a child or
a parent passes through an escape helper before it reaches the HTML.

**The push.** No image. The friend's name carries it.

## Motion

GSAP only, one timeline, on the pass and nowhere else. 900ms: the week dot
fills and scales 1 to 1.25 to 1 on `back.out(2)`; the friend mark travels
along the trail to the next dot; the tool word fades up 12px.
`prefers-reduced-motion` respected, which `FriendPlate` already checks. The
hub has no motion beyond the pill's swap: a parent's screen does not perform.

## Empty, waiting and error states

- **Zero passes**: every dot ahead, the friend on dot one, no counts, the hero
  still there with `Do it together now` primary and full width.
- **Nothing left in the stage**: the hero becomes the stage check card, the
  stamp takes the pulse, the friend stands beside it.
- **Every module passed and the check passed**: the week card names the
  Remember check as the week's thing, the strip shows all dots filled and the
  stamp earned.
- **No child app yet**: the hero's buttons give way to the code block, the
  tile stays, because it is what the child will meet.
- **Under four modules in the stage**: no strip, the check card instead.
- **Art fails to load**: the emblem fallback, the tile keeps its colour.
- **No `character_cast`**: DiGi.
- **Age up day**: the strip restarts at one with the earned stamp behind it,
  and the child's card and the hub hero name it.

## Restraint, deliberately

No confetti on the road (`HappyNews` owns confetti and two celebrations for one
pass is a product that does not trust its own news). No friend scene, no
background illustration, no sticker scatter. No second animation beyond the
register ladder. No friend above 28px on a list row. No friend on the Remember
page's questions, the parent's other rows, the navigation or the library. No
new icon set, radius or shadow. No art on a push. No stage pastels on the
lessons surfaces. Friend colour only.
