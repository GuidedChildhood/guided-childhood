# Character appearances: where the friends are today, and how to keep them coming

20 September 2026. Justin: "can we keep seeing appearances from characters,
and how to plan that?" Everything below is read off production this evening
and off the player, not remembered.

## The cast, and the rule it follows

Five Planet Friends, one per key stage, with DiGi carrying the heaviest
lessons and closing every one.

| Friend | Where | Opens | Notes |
| --- | --- | --- | --- |
| Pebble (with DiGi Junior) | Reception and KS1 | 3 of 3 | bouncy register, the star pause |
| Bloop | KS2 | 8 of 9 | ks2-06 (algorithms) opens on DiGi |
| Orbit | KS3 | 7 of 8 | ks3-14 (bodies and image) opens on DiGi, the calm register; ks3-12 arrives on film |
| Nova | KS4 | 3 of 7 | ks4-16, 17, 18 and 29 are DiGi only: consent and images, sextortion, radicalisation, the content nobody went looking for |
| Cosmo | nowhere | 0 | has the cutout, the three stills and a place on the home page wall, and no lesson |
| DiGi | every lesson | 9 of 29 | closes all 29 on "One last thing"; KS5's two lessons are DiGi with motion graphics |

## Where a friend appears in one lesson today, in order

1. **The title slide.** The friend is the intro key; the animated intro plays
   the friend's arrival with the lesson's own line.
2. **The arrival beat** (slide 2, starter). A digi slide in the friend's voice,
   three lines, the friend lands on its plate and speaks.
3. **The chrome.** The friend sits in the presenter bar through every teach
   slide, small, and its face changes with the class: happy on a right
   answer, thinking on a question, from the fifteen expression stills made on
   13 September (three per friend).
4. **Half time.** The star breath the friend leads, four seconds in and four
   out, in the key stage's register (bouncy, playful, level, still), with the
   half time words under it.
5. **The mission beat** (close). The friend hands over the mission in its own
   voice.
6. **The passport beat.** The class fills the page; the friend's stamp is what
   a full page earns.
7. **DiGi closes.**

Film: ks3-12 is the pilot with six film slides and four animated beats;
ks1-03, ks2-04, ks2-06 and ks2-07 carry one film slide each. Every other
lesson's friend moves by the plate's own motion and the stills, not film.

## What this evening found

- The four lessons written on 19 September had a half time breath with no
  friend and a thirty second cycle. Fixed in migration 320. Contract rules 12
  and 13 now refuse a lesson without the friend's breath, arrival and mission,
  so it cannot happen again quietly.
- Cosmo never appears in a lesson.
- Between the arrival and the mission the friend is present and silent for
  about twenty slides. The stills only swap its face.
- The ks3-12 film beats still carry the legacy cast names (digi_junior, zara)
  in their metadata; the clips were remade on the new cast on 11 September,
  the field was not.

## The plan

**A. The rule, written down (this file).** One friend per key stage. DiGi
opens the four heaviest KS4 lessons and the two KS5 lessons, and closes every
lesson. A new lesson inherits its key stage's friend unless its subject is one
DiGi should carry (the law, harm, the safeguarding lead), and the row's cast
line says which and why. Rule 13 holds it.

**B. The next beat to build: the friend's reaction after each check.** Two
checks per lesson already settle on the board with green, amber and one
retry. After each settles, the friend says one line in its register, one for
right first time and one for after the retry, with the happy and thinking
stills. Two lines per check, four per lesson, written into the choice slide's
config as `reaction: { right, retry }`, rendered by the answer beat, guarded
by the contract. About 116 short lines across the 29 lessons, in each
friend's voice, for the review agents to draft and the verifier to hold to the
register. This is the appearance a class notices, because it answers them.

**C. Cosmo's debut.** KS5's two lessons open on Cosmo in the still register,
with DiGi keeping the close. Two title slides, two arrival beats, two
missions, two breaths: one migration, and the wall on the home page stops
showing a friend the lessons never use.

**D. The friend on paper.** The exit card and the parent note carry the
friend's line ("Bloop's question for tonight"), so the appearance carries on
at the kitchen table; the parents app already shows the child's friend on
the passport, so the two ends meet.

**E. Icons are not faces.** The Happy News icons carry the lesson's objects
(a lock, a shield, a magnifier). The friend stays the only face on the wall.
Never an icon of a friend.

**F. The rota check.** A guard that prints, per friend, the lessons it opens,
its beats, breaths, films and stills, and fails when a key stage's lesson
opens on the wrong friend without a cast line saying why, or when a friend has
no lesson at a key stage that has lessons (Cosmo, today).

**G. The film beat names.** Rename the ks3-12 beat metadata to the cast that
was actually rendered, in the next content migration.

Order: A is this file. F ships with the next guard commit. C and B go in the
review batches, B once the rubric says what a reaction line must and must not
do. D goes with the print pass. G goes with B.
