# The child's passport: the success loop (2 September 2026)

Justin: "Check the passport on the child's app makes sense: they can see
stickers, lessons done are added, completing the passport works with schools
and without and syncs with the parent app. Make sure it matches them getting
better at jobs, offline balance, lessons. The best Mobbin apps on achieving
success, reflecting positively: a moment rated five stars puts a reward on
the child's app. Trace it: the parent said phones in the car were a problem,
the star went to five, so 'great, you scored a stamp in your passport'. All of
it works towards the stage for each age group, per child. Not finished until
it works perfectly and is user friendly. Planet Friends as the success
animations."

## What the book is today (audit)

Eighteen stickers on three pages, reconciled on every read from real numbers
(lib/stickers/book.ts), made permanent in earned_stickers, celebrated once
per child through the celebrated flag:

- The Squad: five Planet Friends, bought with full days (all five of the five
  a day). Parent and child read the same streakCurrency.
- The Stamps: five stage stamps, one per passport page, earned when every
  lesson and script of the stage is done for THIS child (getAllStagesProgress
  with child scope). The same reading the parent's passport page uses, so the
  two agree by construction.
- Saving and Streaks: five saving stickers (credits for time earned and not
  spent), two printable stickers, one seven day streak.

Rare wins (a Friend, a run, stars banked) also land as kid_milestones and pop
once as a full screen KidWinPop with the Friend's face.

## What is missing, against the ask

1. Lessons done are invisible until a whole stage is finished, which takes
   months. Jonny has passed one lesson and his book shows nothing for it.
2. A parent's worry reaching five stars reaches the child nowhere. The
   check in rests the worry (lib/concerns/resting), the parent's what is
   working page says so, and the child's app is silent.
3. The stamp tiles say "0 of 1", a number nobody can act on.

## The build

1. lib/concerns/sorted.ts: one reading of a child's worries with their last
   score, and which are sorted (resolved, or resting at the top band).
2. Two new sticker kinds. `lessons` (First lesson, Five lessons, Ten lessons)
   counted from lesson_completions passed for this child. `sorted`, one per
   worry the parent has raised for this child: locked while it is live, with
   the stars so far, earned when the parent gives it five. Key sorted-<id>,
   ratcheted so a worry that comes back never takes the stamp away.
3. The stage stamp tiles show lessons done of the stage's total.
4. The passport gains a "Sorted together" page and a "Lessons" page, each
   with a how it works line, the Mobbin pattern (Tripadvisor, stoic.): the
   locked tile says what it takes and how far along.
5. A sorted worry is a milestone (kind sorted) so it pops once as a full
   screen win with the child's Planet Friend and a rubber stamp landing:
   "Phones in the car: sorted. Your grown up gave it five stars. Stamped in
   your passport." One tap opens the passport on the new stamp.
6. Fixture at /dev/kid-passport for every state; Playwright at iPhone size.

## Schools

Recorded from the audit when it lands: whether a school lesson completion
reaches lesson_completions for the child. If it does, the lessons ladder and
stage stamps count it with no further work. If it does not, that is the gap
to name, not to paper over.
