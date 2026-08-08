# Type and readability review: how our text compares to the best, and the plan

7 August 2026. Justin's ask: review our font sizes against the top performing
apps and the apps similar to ours, make all text as readable and as big as it
can be, learn what techniques they use to highlight reminders and things to do,
and keep it super easy to navigate and stylish. Review first, then the plan.

A note on method, honestly. The Mobbin tools were in the session but the
search calls did not complete, so per CLAUDE.md this review proceeds on the
reference set we already lean on (GoHenry, Greenlight, Finch, Good Inside, and
the general top performers Duolingo and Headspace) plus measured data from our
own codebase, which turned out to be the more useful half anyway. When Mobbin
is available in a session, the screen by screen comparison in part 4 is the
one worth re-running against live captures.

## 1. Where we actually are, measured

Our scale, from `app/globals.css`:

| Token | Size | Declared purpose |
|---|---|---|
| `--text-xs` | 12px | mono eyebrows and labels ONLY, never a sentence |
| `--text-sm` | 14px | timestamps, captions, the quiet second line |
| `--text-base` | 16px | body, the default |
| `--text-md` | 17px | body that carries weight, rows, buttons |
| `--text-lg` | 19px | card titles |
| `--text-xl` | 22px | section headings |
| `--text-2xl` | 28px | page headings |

How it is actually used, counted across every component:

| Token | Uses | Share |
|---|---|---|
| `--text-xs` (12px) | 943 | 23% |
| `--text-sm` (14px) | 443 | 11% |
| `--text-base` (16px) | 1092 | 26% |
| `--text-md` (17px) | 953 | 23% |
| `--text-lg` (19px) | 426 | 10% |
| `--text-xl` + `--text-2xl` | 322 | 8% |

Two findings, one good and one not.

**The good one.** The system has discipline. Exactly one hardcoded pixel size
bypasses the tokens in the whole app (an 11px in `KidStickers.tsx`). Everything
else goes through the scale, which means one change to the scale changes the
whole app at once. That is leverage most codebases do not have.

**The bad one. A third of all text in the app is below 16px.** 1,386 of 4,179
text instances are 12px or 14px. The comment in globals.css says 12px is never
a sentence, and at 943 uses it is not plausible that all of them are eyebrows.
Some of what a parent reads at ten at night, tired, on a phone, is small print.
The reference apps do not do this: their quiet text starts where our body text
starts.

**The structural gap, and the biggest single finding: our sizes are fixed
pixels.** Every top performing app honours the phone's own text size setting
(Dynamic Type on iOS, font scale on Android). A parent who has turned their
phone's text up because their eyes need it gets bigger text in Finch, in
GoHenry, in WhatsApp, and exactly nothing from us, because px ignores the
setting. Our audience skews to parents in their 30s and 40s and to
grandparents on the child link. This is the single highest value fix on the
list and it is nearly free: the tokens become rem, one file, and the whole app
starts respecting what the user already asked their phone for.

## 2. What the best apps do, and what we borrow

**Finch** (the star and reward loop we already lean on). Tasks are big
full width rows, one per line, with a fat tap target and a visible circle to
tick. Nothing to do today is ever presented as a list of small text; it is a
stack of chunky rows a thumb cannot miss. Completion is celebrated in the row
itself, then the row settles. We already built this pattern once, in
`ConcernCheckIn` (tap, beat, fold away). The borrow is to make that the house
pattern for every "thing to do" everywhere, not just the daily check in.

**Good Inside** (the simplicity we name in CLAUDE.md). One thing per screen.
The coach speaks first, in display size text, and everything secondary is a
swipe away rather than crowded underneath. Their body text is visibly larger
than the mobile default, and they spend whitespace instead of shrinking type.
The borrow: when a screen feels crowded, the answer is fewer things on it, and
never a smaller font. Our instinct under pressure has been the opposite, which
is where 943 uses of 12px came from.

**GoHenry and Greenlight** (family apps, the closest analogues). The number or
fact that matters is huge, and everything explaining it is one size, not four.
Tasks and chores get a colour chip and a count ("3 to do"), not a paragraph.
Navigation is a bottom bar of four or five things and a child switcher at the
top with faces, not names in small text. The borrow: the count chip pattern
for "things that need you", and the ruthless one size for supporting text.

**Duolingo and Headspace** (the top of the store, any category). One primary
action per screen, styled like the only button in the world. The streak is one
number with one flame, always in the same place, never explained again. Body
text 17px equivalent or larger, everywhere, with the system setting honoured
on top. The borrow: one glowing thing per screen. A reminder highlight only
works when it has no competition, and our home has historically had several
things glowing at once (the pop up allowance work already started on this).

**The common thread across all of them:** none of these apps have more type
sizes in practice than we have, they just refuse to use the small end for
anything a person must read. The small sizes exist for decoration and
timestamps, and the floor for meaning is 16 to 17px scaled by the system.

## 3. The plan

### Phase 1: the floor and the setting (one PR, biggest win, lowest risk)

1. **Tokens go from px to rem** so the phone's text size setting works.
   16px becomes 1rem, 17px 1.0625rem, and so on. One file. Parents who have
   asked their phone for bigger text get it everywhere at once.
2. **The scale shifts up one notch at the reading end.** base 16→17, md 17→18,
   lg 19→20. Headings stay (22/28 are already generous). xs and sm stay for
   true labels, and the rule about them tightens from a comment into a check.
3. **Fix the one 11px hardcode.**
4. **Chrome DevTools pass, mobile and desktop, on the six screens that matter**
   (home, pathway, daily, scripts, a moment card, the child home), per
   non-negotiable 5, because a one notch shift can wrap a button label.

### Phase 2: the small print audit (one PR, mechanical but long)

The 943 uses of `--text-xs` get sorted into two piles: true eyebrows and
labels (keep), and sentences a person must read (move up to sm or base). Same
for the 443 sm uses that are actually body text. The wiring check gets a new
rule so a sentence at xs cannot come back: it already reads every component,
so teaching it "font-body plus text-xs in the same style object is a warning"
keeps the floor without anyone remembering to.

### Phase 3: one way to say "this needs you" (design decision, then one PR)

Today a reminder might be a banner, a card, a toast, a glowing path step or a
chip depending on which feature shipped it. The borrow from the reference apps
is one pattern with three levels, used everywhere:

- **Now**: one full width row at the top of home, terracotta band, one
  sentence, one tap. Only ever one of these at a time; if two things qualify,
  the second waits.
- **Today**: chunky Finch style rows inside the Today card, tick and fold.
- **Count**: a small chip on the tab or card ("2"), mono, never a sentence.

Everything currently shouting gets remapped to one of the three. This is the
stylish part as much as the usable part: one voice, three volumes.

### Phase 4: the Mobbin pass, when the tools connect

Re-run the screen comparison against live captures of Finch, GoHenry,
Greenlight and Good Inside, screen by screen against our six key screens, and
fold anything that contradicts this document back into it. The document is
honest that part 2 is from the reference set and best practice rather than
from this week's captures.

## 4. What this does not touch

The fonts themselves (Nunito and IBM Plex Mono are right, and non-negotiable
3 stands), the colour system, GSAP motion, and the kid app's playful scale,
which is doing a different job and doing it well.

## Order and effort

Phase 1 is an afternoon and carries almost all the value. Phase 2 is a long
mechanical sweep best done once phase 1 has settled. Phase 3 needs Justin's
eye on the three volume pattern before it is built. Phase 4 waits for Mobbin.

## 5. Phase 4 run: the Mobbin pass, 8 August 2026

Justin reconnected Mobbin and the captures came through, so the honesty note
in the header is now settled: here is what the live screens say against what
this document claimed from memory and best practice.

**Confirmed by live captures.**

- [Finch's home](https://mobbin.com/screens/b5d29fad-9c88-43e0-9aa0-05b7602ab48d)
  is our Today card almost line for line: chunky white rows, one bold title a
  size above body, a small grey category line, a fat tick circle, and one
  plain count sentence above the list ("10 goals left for today!"). Their tab
  bar carries tiny red count badges exactly like our quests chip. The three
  volume pattern phase 3 built is what the best in this category actually ship.
- [Finch's quiet state](https://mobbin.com/screens/6e24c2f2-42f4-42da-9450-5c021b7d3678)
  puts the character and ONE pill button on an otherwise empty screen. One
  glowing thing per screen, confirmed as built practice, not just doctrine.
- [GoHenry's money screen](https://mobbin.com/screens/929c807f-7601-462d-82ba-85e6c61f7a6f)
  runs counts even quieter than a chip: a grey subline word inside the row
  ("Tasks · 1 to do"). Their one urgent thing
  ([a missed allowance](https://mobbin.com/screens/94c2596d-e167-41d3-81c2-4992ccda2db6))
  is a single soft pink sentence band at the top of the screen. One voice at
  the top, everything else quiet: the Now row's shape, independently arrived at.
- [Greenlight's parent home](https://mobbin.com/screens/7e97e03a-4c8e-47f3-8aab-2798ba5514ab)
  leads a new account with a setup tile row and a bare "17% complete" bar, and
  keeps notifications in one titled list section. Our one conductor setup path
  and the folded From school section match it.
- [Greenlight's chores empty state](https://mobbin.com/screens/03ce4a0b-ad29-45e2-af14-fd030a5b4ca5)
  is a friendly sentence and one soft button ("No chores due today. Check back
  tomorrow"), which is our calm Now slot line doing the same job.

**Two things worth folding forward.**

1. **Finch's tick sits on the right edge of the row, the thumb side; ours
   sits on the left.** Every Finch row is tickable one handed without the
   thumb crossing the screen. Worth trying on the Today card and the concern
   check in when they next get touched: move the circle right, keep the emoji
   tile left.
2. **The count volume has a floor below the chip.** GoHenry writes counts as
   a subline word inside the row it belongs to. Where a count already lives
   inside a row (the setup line, the school fold), words beat a chip; the
   chip earns its place only on a tab or card corner where there is no
   sentence to join.

**What could not be checked.** Good Inside is not on Mobbin; searches
substitute other apps. The Good Inside claims in part 2 stay sourced from the
reference notes in design-refs/good-inside-notes.md rather than live captures,
and that is now a permanent state rather than a pending one.

Phase 4 is done. All four phases of this plan are complete.
