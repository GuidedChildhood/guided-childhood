# Quests redesign — Mobbin UX reference

Source: live Mobbin pull, 16 July 2026, to unblock the Quests redesign brief
(plans/quests-redesign.md). Mobbin was offline when Justin gave the brief, so
StarSummary and the front door were built from the documented spirit only.
These are the real screens behind GoHenry, Greenlight, Finch and the live
timer and child insight patterns the plan calls for.

Rule, same as good-inside-notes.md: copy the structure, never the brand. Our
butter and ink and Nunito, our chunky 16px buttons and drop shadow, never
their purple or teal or their fonts.

Every pattern below links to the exact screen it came from so a builder can
open it while working.

---

## 1. Control centre header — one big number, then the actions

The plan wants a rebuilt StarSummary: one big number (stars and the minutes
they buy), tappable tiles, a live timer slot. The money apps all lead the
same way.

**GoHenry parent home** ([screen](https://mobbin.com/screens/b40b68b8-c923-4155-8a8f-12983e659ad8)):
the balance is the biggest thing on the screen, a label above it (Parent
balance) and one huge numeral, then a single line of next action
(Set up your weekly allowance) and exactly two pill buttons (Top up /
Transfer). Nothing competes with the number. Our StarSummary already leads
with the star count and the minutes line, which is right, keep it, but cut
the button row from three to two so the primary action stands alone.

**GoHenry child earning** ([screen](https://mobbin.com/screens/0ecaacc9-e38b-42ea-aea0-63e3bb8452ef)):
the best single idea in the whole pull for us. One segmented progress bar
splits the child's week into **Allowance · Tasks done · To do** with a small
coloured dot legend and a money figure under each. This is exactly our
stars vs time vs waiting split, but shown as one bar instead of three flat
tiles, so a parent reads the balance of the week at a glance. Consider
folding our three tiles (waiting your yes / to do today / this week) into a
single three segment bar in the header, tiles below it for the tap targets.
Also here: a plain **Tick all tasks** shortcut and a red **New** badge on a
freshly added task.

**GoHenry money list** ([screen](https://mobbin.com/screens/3419e5e3-89b6-40db-8f72-9c790cf8e0fa)):
Money in as a list of rounded icon rows (Allowance / Tasks / Giftlinks), each
an icon tile, a bold label, a one word state (Set / Add / Share). This is the
list form of our front door.

GC translation: keep the big star number and the "= N minutes ready" line.
Add the segmented week bar. Reduce the action buttons under it to two, the hot
one (Approve N) plus one secondary. Butter gold primary with the 0 5px 0
shadow, cream secondary with a 1.5px border, never GoHenry purple.

---

## 2. The tappable tiles — a stat grid, not flat boxes

Our current tiles read as flat and not obviously tappable (the plan's own
complaint). Greenlight solves this.

**Greenlight parent home** ([screen](https://mobbin.com/screens/6491097a-3861-4c87-ac75-caed6336b83b)):
a top row of three round icon actions (Send money / Get paid / Profile), then
a **2x2 grid of stat cards** (Spending $5.00 / Saving $0.00 / Investing /
Allowance $15.00). Each card is a white rounded panel with an icon top left, a
big number, and a quiet **Manage controls** sublabel that signals "tap me".
That sublabel is what makes a stat card read as a button. Our three tiles
should each gain a one word action sublabel (Review / Open / Adjust) so the
tap affordance is obvious.

**Greenlight chores home** ([screen](https://mobbin.com/screens/03ce4a0b-ad29-45e2-af14-fd030a5b4ca5)):
the empty state is warm, not blank: "No chores due today" with a small emoji,
then a single **View all chores** button, then a "Let's add some jobs" card
that explains the loop in one plain sentence before the **Add job** button.
Every empty state in our Quests area should do this: a warm line, one action,
one sentence of why.

GC translation: rebuild the three tiles as chunky white cards, icon + big
number + a mono sublabel that names the tap. Keep the red danger treatment on
"waiting your yes" when the count is above zero (we already do this, it is
good). Give every empty tab a Greenlight style warm empty state.

---

## 3. Live device timer — a running session card

The plan wants a live countdown to appear in the header the moment a child
starts their device time. Opal is the reference.

**Opal Blocks** ([screen](https://mobbin.com/screens/795f6a5b-707a-4509-877a-fcca671145f8)):
a **Now** section holds one active card, "Work Time · Remaining 0:20:31" with
a status pill (Blocking) and a thin green progress underline that drains as the
session runs. Upcoming sessions sit quietly below. A slim persistent bar at the
bottom mirrors the live session anywhere in the app. This is precisely our
"child is on their device right now" slot: a single live card with the
remaining time counting down and a draining progress line.

**Whatnot watch time** ([screen](https://mobbin.com/screens/039d569d-c47e-43bd-aad8-be56557d89c3)):
a limit shown as "12m watched" with a progress bar toward "2h 30m", a calm way
to show how much of the allowance is spent without a scary red until it matters.

**TikTok screen time** ([screen](https://mobbin.com/screens/f7b1f461-08e7-47f7-be3b-e925d6368b85)):
the limit is a plain icon list of rules with a passcode behind it. Not our
tone (we do trust and agreement, not a lock), but the passcode gate is worth
noting for the parked Parent PIN decision.

GC translation: when the device timer is running, swap the static timer line in
StarSummary for an Opal style live card, remaining time big, a draining butter
underline, a soft "on their time now" label. When idle, the slot collapses.
The PWA carries the same live bar. Placeholder ready for the native app, as the
plan says. Never a lock or a countdown that shames, it is a shared clock both
ends can see.

---

## 4. DiGi screen time balance insight — the age-aware recommendation

The plan wants a new card: age aware recommended balance across screen, play,
games, chores, saying if the child is on track. Greenlight already ships the
recommendation pattern.

**Greenlight set allowance** ([screen](https://mobbin.com/screens/7ca5c9bc-bf78-4a41-abff-d2564bed20be)):
a big value, then a grey **Recommended amount: $15** box that explains itself
in warm plain words and, crucially, references the child's age ("Since your
child is 15, we recommend..."). This is the exact shape of our DiGi insight:
a recommended balance, age named, one honest sentence of why, never a hard
rule.

**Greenlight allowance detail** ([screen](https://mobbin.com/screens/f5a370ed-955a-4090-acb7-a628b7d88b47)):
a split shown as "70% Spend · 20% Savings · 10%" plus explanatory cards
("Hard work pays off", "Keep them on track"). The percentage split is how we
can show screen vs play vs games vs chores in one line.

GC translation: a DiGi card that reads the child's age band and shows a
recommended balance (a one line split), a plain sentence in DiGi's voice
saying on track or gently suggesting less, and a time of day nudge (wind down
in the evening). Grounded only in our science bank. A calibrated pathway, never
allow or deny, per non negotiable 1. Cream card, DiGi avatar, the split as a
slim four colour bar.

---

## 5. Front door — four big labelled buttons

The plan wants a front door of four big buttons with icons and one line each
(Quests · Rewards · Set up · Share) so a first time parent knows where to go.

**LookUp Start Learning** ([screen](https://mobbin.com/screens/8553b7f6-286e-443f-ba4e-c94a742313a8)):
the cleanest version, a grid of rounded square tiles, each a solid colour, a
line icon, a bold label, a tiny subcount. Calm and legible.

**Byte categories** ([screen](https://mobbin.com/screens/5c34a9d3-c31e-4694-a1e9-b58e6fb4320a)):
the bold end, two column vivid tiles with a chunky 3D icon and a big label.
More energy than LookUp, closer to our playful side, but watch the contrast,
white on saturated needs care.

**GoHenry Learn** ([screen](https://mobbin.com/screens/9bcd500f-f446-492e-8af1-1a50702b6db5)):
big illustrated mission cards two up, each a scene, a bold title, a subcount
(6 missions). Good if we want each front door button to carry a little
illustration rather than a flat icon.

**Headspace Kids** ([screen](https://mobbin.com/screens/f3300779-5e33-440a-9aa2-29c43dde5d83)):
an **Ages 5 and under** band above circular topic icons (Appreciation /
Balance). The age band header is a pattern we can reuse anywhere content is
stage banded.

GC translation: four tiles in a 2x2 grid, each a chunky rounded card with our
16px radius and drop shadow, a friendly icon (or a small Teo/Olga/Alma
illustration per GoHenry), a bold Nunito label, one mono line under it
(Quests → set tasks, etc). Butter and cream alternating, not one saturated
wall. This is the "front door that explains what each is for" the plan asks
for.

---

## 6. Rewards and celebration — reward the choice, not the streak

Rewards tab and the earn loop. Finch is the model for celebration that is
warm and non addictive, which matters doubly because the child app surface has
to be safe by our own rules (plans/quests-redesign.md, safety rules).

**Finch goal celebration** ([screen](https://mobbin.com/screens/9f5f5f5d-d475-403e-9aa0-902da053bc4b)):
"Your Micropet egg just got one step closer to hatching" with a progress bar
"4 goal completions until hatch". The reward is **growth toward a warm goal**,
not a naked point counter. Our stars saving toward a real goal already works
this way, lean into the "closer to" framing.

**Finch weekly star** ([screen](https://mobbin.com/screens/c246a0cd-fc4a-4ebc-af35-c7f033c3fce9)):
"A Shiny Star for You! 2 days of Calm goals done this week" praises the effort
and names the behaviour, gentle confetti, no pressure to keep a run alive.

**Finch streak** ([screen](https://mobbin.com/screens/879b0749-a269-4d19-abb9-bdc6d38041e8)):
a day streak with a S M T W T F dot row, one filled. Note it frames the streak
as encouragement ("Great job"), never "don't lose it". If we show a streak,
copy that framing, celebrate the days done, never threaten the loss.

**Finch trait discovery** ([screen](https://mobbin.com/screens/b81477a0-dcc8-4751-ac87-9c093a02fc1e)):
"New Discovery: Loves Cherries · +5.5 Compassion" turns progress into character
growth. A model for tying a finished quest to a squad character trait rather
than only stars.

GC translation: keep confetti gentle and rare, tie it to a real goal getting
closer or a genuine weekly win. Praise the choice ("you chose to save your
time"), never manufacture loss aversion. No dark patterns, per the plan's
safety rules and non negotiable 1.

---

## 7. Child insight surface — big bubble, one character, one idea

The plan's child app brief: grow HappyNews into a bigger rotating insight
surface, one idea per card, a squad character delivering it, positive framing
only. The children's apps all use the same shape.

**Duolingo ABC** ([screen](https://mobbin.com/screens/4f83679d-78e6-48f4-a6a5-c65b7815907d)):
a huge glossy speech bubble headline (LISTEN UP) with the character below it
reacting. One idea, enormous type, a character selling it. This is the size and
energy the plan asks for ("bigger, happier art than the current pop up").

**Duolingo ABC instruction** ([screen](https://mobbin.com/screens/c40a6d09-ce3a-4f39-80dd-d374daa42f5a)):
"Spell at least 5 words to earn a star" a star, the character, one clear
sentence, a single forward arrow. One idea, one action, nothing else.

**Finch professor tip** ([screen](https://mobbin.com/screens/5df628a7-e72f-4fa8-86e1-1b7544861768)):
a character (Professor Oat) delivers a tip in a speech bubble, then a soft
bottom sheet with a warm heading and a dead simple Turn on / Not now. Our
"discard is dead simple" rule from the Good Inside brief, applied to a child
tip.

**BitePal** ([screen](https://mobbin.com/screens/904bb160-7998-47a0-acd8-f0ea3b401004)):
"Now you should take care of Caramel" a big display headline, a warm sub, a
four heart meter, the character, one **Got it!** pill. A clean template for a
single insight card: headline, one line, one friendly graphic, one dismiss.

GC translation: each insight card is one idea (try this task today / you can
save your device time / the good stuff offline / face to face / why your brain
needs balance / what is worth watching), a big Nunito headline, a squad
character (Teo, Olga, Alma, DiGi Junior) delivering it in a bubble, bright
generous art, one gentle dismiss (Got it), age banded language. Every claim
traceable to the science bank, passed through DiGi's safety lens. Positive
framing, praise the balanced choice, never scare, never guilt, per the plan's
safety rules.

---

## Pattern to component map

| Redesign slice | Pattern | Reference screen |
|---|---|---|
| Slice 1 header | one big number + 2 actions | GoHenry parent home |
| Slice 1 header | segmented week bar (waiting/to do/done) | GoHenry child earning |
| Slice 1 tiles | stat cards with a tap sublabel | Greenlight parent home |
| Slice 1 empty states | warm line + one action + one sentence | Greenlight chores home |
| Slice 1 front door | 2x2 labelled tiles | LookUp / Byte / GoHenry Learn |
| Slice 1 timer | live running session card, draining bar | Opal Blocks |
| Slice 2 DiGi insight | age aware recommended balance box | Greenlight set allowance |
| Slice 2 DiGi insight | percentage split line | Greenlight allowance detail |
| Slice 3 rewards | celebrate the choice, growth not loss | Finch goal / weekly / streak |
| Child insight surface | big bubble, one character, one idea | Duolingo ABC / BitePal / Finch |

## What to skip

- No saturated single colour walls (Byte, GoHenry purple). We alternate butter
  and cream, ink text, per the design system.
- No loss aversion streak copy (some apps flirt with it). Celebrate days done.
- No passcode lock as the timer's spine (TikTok). We do trust and a shared
  clock. Parent PIN stays parked (decisions.md, 15 July).
- Never their fonts. Nunito and IBM Plex Mono only.
