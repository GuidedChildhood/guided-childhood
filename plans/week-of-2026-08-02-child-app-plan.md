# The child's app: lose the road, keep the day, make the wins real

**2 August 2026.** Lane: platform, child side. Migration claimed: **155** (152 to 154 were all taken while this was in flight).
(152 to 154 all went to other sessions while this was in flight, and the
moments loop landed on main twice under two numbers. The stray copy is deleted
here and 154_moment_outcomes.sql is the one that stands.)

Three of Justin's messages, and they turn out to be one job.

> "is pathway overkill? should we just have the 5 jobs to achieve a streak each
> day... what's your advice on the pathway is that too much to manage?"
> → **"yes lets lose the pathway as advised for children only NOT parents"**

> "add read a book tell your parent also the maths, tidy my room, raise a quest
> with parents, exercise played football with daddy, asked parent to have a 30
> min break from phone, anything we can add that is a brilliant offline benefit"

> "when streaks are achieved on child's app the add a family member are real
> celebrations and can pop up then on next login so you can see the family
> growing and they feel they have achieved. need to show clearly what they have
> achieved in streaks so if comparing with sibling they can see how they
> progressed, also letting parents know streaks achieved link to passport
> purchase and family stickers option. they can print or order"

One job because the road is where the celebration currently lives. Take the road
away without moving it and a child loses the only place their stickers pop.

---

## 1. Lose the road, for children only

`/k/[token]/path` is the child's Duolingo trail: lessons, games, printables,
tips, a chest, a quiz, and the sticker book. Every one of those, except the
chest and the tips, is already reachable from the home screen, where the five a
day now lives. Two surfaces asking a child to do the same five things is exactly
the "too much to manage" Justin is describing, and it is the child who pays for
it: the day is finished in one place and still looks unfinished in the other.

**The parent's passport at `/dashboard/pathway` is untouched.** That is the ramp
to 16 and it is for the grown up.

The route becomes a redirect rather than a 404, because it is on home screens,
in old push notifications and in the PWA cache. `components/kid/KidPath.tsx`
stays where it is (the reference page still renders it) so nothing is lost if
this proves wrong.

**What moves before the road goes:** the sticker book and its once only pop.
That is migration 109's `celebrated` flag, which is the only server side
celebration in the whole child app, and it must not go down with the page.

## 2. The five a day gets a proper offline pool

Today the middle two rotate from six: lesson, quiz, reading, homework,
printable, move. Justin's list is longer and better, and every item on it has the
same shape: **a thing that happens away from a screen, with a person.**

Added, and the reason each earns its slot:

| Row | Why |
| --- | --- |
| Read and tell | Reading already existed; telling a grown up about it is the half that makes it stick, and it is the row a parent hears about |
| Ten minutes of numbers | The one bit of school work that rewards daily practice more than any other |
| Tidy your room | A real job with a visible end. Justin's, and he is right that it belongs here |
| Make something | Hands, not a screen. Nothing to buy |
| Something kind | Costs nothing, is noticed by somebody, and is the only row that is about another person |
| Best and worst bit | The child asks a grown up about their day, and answers back. Two minutes, and it is the single most protective daily habit in the whole product |
| **Screen break together** | Justin's, and it is the mission in one row: the child asks the grown up for thirty minutes off their phone |

That last one stays in whatever else changes. A product that asks children to
manage their screens and never asks the adult holding one is only half honest,
and a child is allowed to be the one who asks.

Nine rotating rows, two drawn a day, so a given row comes round about once a
week and the day is never twice the same.

## 3. Celebrations that are real, and are not a browser

Every celebration on the child's home is `localStorage` today:
`gc_kid_friends_earned`, `gc_kid_bank_mile`, `gc_kid_streak_seen`. So a streak
celebrates once per device: twice if a child uses a tablet and a phone, never
again if the browser is cleared, and never at all on a new phone. And nothing
server side knows it happened, so no parent can be told and no sibling
comparison can be drawn.

The one exception is stickers, where migration 109 already got this right:
`earned_stickers.celebrated`, flipped by `/api/kid/stickers/seen`. That is the
pattern, and this generalises it.

**Migration 155, `kid_milestones`.** One row per real win, unique on
`(child_id, kind, key)`, so it is written once however many times it is noticed.
`celebrated_at` null until the child has actually seen it, which is what makes
"pops on next login" true rather than nearly true. `told_parent_at` null until
the parent has been told, which is item three of Justin's ask.

Three kinds, and the ladders are deliberately short:

- **friend** — every four streaks a Planet Friend joins. This is "see the family
  growing" and it is the big one.
- **run** — 3, 5, 7, 10, 14, 21, 30, 50, 100 days in a row. Nine in a childhood,
  not one a day, because a thing that happens daily is not a celebration.
- **bank** — 10, 25, 50, 100, 200, 500 stars, as now.

Because the row survives, the same table is the **record**: "you have earned 26
streaks, your best run is 11 days, three Friends are home". That is what a child
holds up next to their sibling, and it is a true number rather than a feeling.

## 4. Telling the parent

The milestone rows with `told_parent_at` null are the queue. The parent's
existing monthly email and the dashboard both read it, name what the child did,
and offer the two things that exist already in `lib/shop/catalogue.ts`: the
printed passport and the stage sticker sheet. Print at home or order.

**The offer never blocks the child's moment.** The child's celebration is on the
child's screen and mentions no shop at all.

---

## Rails

- A celebration is never for time passing. Every milestone here is a thing the
  child did.
- No loss language, ever. The run is shown when it exists and is silent when it
  is not. Nothing says a streak is at risk (ICO Children's Code, and it is also
  just unkind).
- The sibling comparison is the child's own number shown clearly. We never draw
  the comparison ourselves, and one child's screen never shows another's total.
- Fails soft. Every read is best effort: a celebration that cannot load must
  never take a child's home screen down.

## Order

1. The offline pool (contained, and Justin asked twice)
2. Lose the road, move the stickers home
3. Migration 155, the milestone queue, the pop, the record
4. Tell the parent, with the shop offer

Then back to the stated build order: the stage quiz, and the curriculum review
last.
