# Lesson films from what parents react to

Week of 16 November 2026. Claim: PR 1576. Lane: the new film series, the 1.6
sleep remake, the parent films, and the plan for booking a watch together time.
Not the re-voice of the first five (PR 1575, another session).

## Justin's brief, 16 November

1. List the last 30 post subjects from Family IT Guy and the two clinicians.
   Group them, map each group to a stage and a module.
2. Each subject gets two films. A child lesson film for the right age, better
   than the first ten: one DiGi voice, portrait and landscape cuts, no closing
   promise for the child. And a 60 to 90 second parent film: watch it, then act.
3. A way for a parent to book a watch together time. Plan it and check before
   building.
4. Start with three subjects that fit films we already have. Remakes start with
   1.6 sleep. No Higgsfield spend without the credit cost first.

Their subjects only, never their words or advice. The clinicians are not named
beside ours. Family IT Guy may be.

## Step 1, done: the 90 subjects

`content/child-films/parent-reaction-series/subjects-2026-11-16.md`. 30 per
account, our own paraphrase, grouped into twelve groups plus Not ours (32 posts
with no child and tech subject, a promotion, or for professionals).

The biggest groups: what to do after a child sees something upsetting (15
posts, mostly the cybertrauma account), the protest when a limit holds (10,
the parenting account, no device in it), what a game is doing rather than the
minutes (8), the first phone (7).

## The voice

Already decided: Tamsin, slower (16 November, PR 1570), the name written
"Didgee". Every film in this series uses it.

## The first three subjects

All three fit a film we already have, so the child film is a remake to the new
standard and the parent film is new.

| Order | Subject | Group | Stage | Existing film | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | Bedtime phones | C | 1 (2.3 later for 8 to 10) | 1.6, the remake you asked for first | Your list, the bedroom at night is fourth in our own parent sweep, and the live film scares children |
| 2 | "Is this real?" | B | 1 (ks2-23 later for 8 to 10) | 1.5 Real or pretend, and 1.9 | Your list, and AI is the subject parents will judge us on |
| 3 | Seen something upsetting, tell a grown up | A | 1 (ks4-29 later for older) | 1.4 When screens make you sad | The largest group by a distance |

Not first, and why:
- **Roblox strangers (Stage 2).** The strongest Family IT Guy topic and a verified
  pack, but no film exists. It is the first NEW film, from the 2.1 script, fourth
  in line.
- **The first group chat, and saying no to a dare (Stage 3).** No film exists
  and none of the three accounts posted on them in their last 30. The WhatsApp
  pack's child film brief is ready when we reach it.

The re-voiced 1.4 and 1.5 (PR 1575) go out first in the old pictures, as
decided on 14 November. The remakes replace them later.

## The standard: better than the first ten

Every child film in this series passes all of these before Justin sees it:

1. DiGi is the gold star in every frame, from the reference art. Never a robot,
   never a blob.
2. The house look: cream ground, ink line, the Planet Friends. The stage's
   friend helps (Pebble for Stage 1).
3. One voice, Tamsin, the name said one way.
4. No screen is a villain and nothing frightens a small child.
5. No fact about the body or the brain unless it is on a cleared list. A line
   that is not cleared is rewritten to claim nothing.
6. No closing promise, to the child or the grown up.
7. Landscape (product and YouTube) and portrait (family account) from one
   picture set: the action drawn inside the middle square.
8. The public cuts stand alone (no recap of the film before) and end at the
   stage check. The product cut keeps the three segment shape the player needs.
9. Full captions on the portrait cut, a subtitle file for YouTube.
10. Someone listens to the whole film before it is called finished. The first
    ten were never listened to.

Every parent film: 60 to 90 seconds, one action tonight, the words to say, one
real product screen, no figures unless cleared, ends at the stage check in
public and at "Book a watch together time" in the product.

## Step 2, started: the 1.6 pair

- Child film script: `content/child-films/parent-reaction-series/1.6-sleep/child-film-script.md`
- Parent film script: `content/child-films/parent-reaction-series/1.6-sleep/parent-film-script.md`

Both are drafts. One line in the child film (what sleep does) is marked CHECK
and has a safe fallback.

### What 1.6 costs on Higgsfield, before any spend

Prices from the account's own spend history (16 November). Balance 509.97
credits, shared with every other session.

| Item | Count | Each | Credits |
| --- | --- | --- | --- |
| Pictures for the child film, Nano Banana 2.1 | 22 | 2 | 44 |
| Redraws, allow a quarter | 6 | 2 | 12 |
| New pictures for the parent film | 3 | 2 | 6 |
| Tamsin lines, child film (1.3 ran about 0.47 a line) | about 50 | about 0.5 | 25 |
| Tamsin lines, parent film | 9 | about 0.5 | 5 |
| Redone lines, allow a sixth | | | 5 |
| **The pair, with motion done in code** | | | **about 97** |
| Optional: DiGi hello and goodnight as Seedance clips | 2 | about 21 | 42 |
| **The pair, with the two clips** | | | **about 139** |

The slow zoom, DiGi's glow, Pebble's pop ins and the captions are built in
HyperFrames, which costs nothing. Recommendation: the 97 version first; add the
two clips only if the stills look flat.

Each later subject costs about the same, so the first three are roughly 290
credits.

## Step 3, plan only: booking a watch together time

Superseded by Justin's fuller brief the same day: `plans/2026-11-16-watch-together-booking-plan.md`. The notes below are the first sketch.

Nothing is built until Justin says yes to this section.

### What exists already

- A parent can already send a watch together film to the child's app
  (`LessonSendButton`, `/api/quests/ping`). It pings now, and the film already
  sits on the child's quest link as an adventure.
- Nothing buzzes a child's phone between 19:00 and 07:00
  (`lib/push/quiet-hours.ts`). A held buzz is dropped, not delayed.
- The parent's home picks one lead a day through `lib/home/next-up.ts`.
- A cron runs every minute already (`/api/cron/device-time`).

### What it would do

1. Under each film, beside Send, a second button: **Book a time**. The parent
   picks a day and a time, in 15 minute steps, over the next seven days, for
   one child.
2. At that time the film appears at the top of the child's app as a card:
   "Film time with Dad: Screens go to bed first", using the name the parent goes by in the app. Before then it shows nothing,
   so it is a nice surprise rather than a countdown. (Question 2.)
3. The parent gets a push ten minutes before, and the film becomes their lead
   on Home for that hour. Push only, so the one email a week rule is untouched.
4. The child's phone gets a buzz at the time only between 07:00 and 18:59. After
   19:00 the card simply appears with no buzz, the quiet hours rule as it is.
5. When they finish, the existing completion route marks it watched and the
   parent sees it ticked. If nobody opened it, the parent is asked once the next
   day to pick a new time. Never a nag to the child.
6. Optional: an "Add to my calendar" file for the parent's own calendar.

### What it needs

- One table, `watch_bookings`: family, child, film code, start time, reminded,
  shown, watched, cancelled. Row level security like the other family tables.
  One migration, number claimed at build time (399 is free today).
- The existing every minute cron picks up bookings that are due: sends the
  parent push, and the child push if inside the allowed hours.
- The child's page reads due, unwatched bookings and shows the card.
- One guard script, like the others, so a booking can never buzz a child inside
  quiet hours.

No model on the child's side, nothing new stored about the child beyond the
booking itself.

### Questions for Justin

1. **Picking the time**: any time in 15 minute steps, or three suggested slots
   (for example after school, before tea, weekend morning)? Recommendation:
   three suggestions plus "pick another time".
2. **The child's side before the time**: nothing until the time (a surprise), or
   "Film time, Thursday at 5" shown ahead? Recommendation: nothing
   until the time, for under 8s. A countdown on a child's screen is a pull.
3. **Evening slots**: a 19:30 booking shows on the child's app with no buzz, as
   the quiet hours rule says. Is that right, or should bookings stop at 19:00?
   Note that the sleep film itself is better watched well before bedtime.
4. **The calendar file for the parent**: yes or not now?

## Order of work

1. Justin: the credit go ahead for 1.6, and answers on the booking questions.
2. 1.6 pictures, then voice, then both cuts, then a listen through, then Justin.
3. The same for subjects 2 and 3.
4. The booking feature, once approved, in its own PR.
5. Roblox strangers, the first new film.
