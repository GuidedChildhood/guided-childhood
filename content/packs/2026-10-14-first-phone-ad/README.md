# The first phone ad

Drafted 14 October 2026, after Justin's Instagram sweep
(`briefings/notes/competitor-sightings.md`). None of the seven parenting and
family apps advertising to him named the first phone, social media or the road
to 16. This ad opens on exactly that and ends at the stage check.

Nothing here has been posted, boosted or scheduled.

## How to run it

**Organic first, paid only once it works.** The money rule
(`plans/DISTRIBUTION-PLAYBOOK-step-by-step.md`) is never pay to find out if
something works, only to scale something proven. So post both cards as
ordinary posts on the family account, a few days apart. Whichever brings more
stage checks is the one to boost, if Justin decides to spend.

## The cards

Rendered from `tools/social-cards/decks/first-phone-ad.json` with
`npm run social-cards -- tools/social-cards/decks/first-phone-ad.json`.
Format 1 of the visual system, one character (Orbit, ages 11 to 13, the stage
where most first phones arrive), cream ground, one gold mark.

- `01-a-the-phone-moment.png`: "One day you'll hand them a phone." The lead.
- `02-b-times-up.png`: "Tired of saying time's up every night?" The pain line
  the Kairoo ad found, given our answer instead of theirs.

## Caption A, Instagram (no link in the caption)

> Most of us never planned the first phone. It arrived because half the class
> already had one, and the arguments started that same week.
>
> You wouldn't hand a teenager the car keys without a single lesson.
>
> Guided Childhood gets your child ready for a phone and social media, ten
> minutes a day, with you working through it together. You get the words for
> the hard conversations. Your child earns their screen time with jobs and
> stars.
>
> What stage is your child? Three questions, no sign up. Link in bio.

## Caption A, Facebook (link in the body)

> Most of us never planned the first phone. It arrived because half the class
> already had one, and the arguments started that same week.
>
> You wouldn't hand a teenager the car keys without a single lesson. A phone
> deserves the same.
>
> Guided Childhood gets your child ready for a phone and social media, ten
> minutes a day, from age 2 to 16, with you working through it together. You
> get the words for the hard conversations. Your child earns their screen time
> with jobs and stars, and some time stays protected whatever they earn.
>
> What stage is your child? Three questions, no sign up:
> https://www.guidedchildhood.com/starter-pack

## Caption B, Instagram

> Every night, the same two words. Time's up. Then the door, the sulk, and the
> feeling that you're policing rather than parenting.
>
> There is another way to do this. A plan you and your child work through
> together, ten minutes a day, so evenings get calmer and the phone arrives
> to a child who is ready for it.
>
> What stage is your child? Three questions, no sign up. Link in bio.

## Proof path for every claim

| Claim | Where it is in the product |
|---|---|
| Ready for a phone and social media, 2 to 16 | The stages road and lessons, THE-STORY.md section 1 and 6 |
| Ten minutes a day | The daily page, `lib/home/next-up.ts` |
| The words for the hard conversations | The `scripts` table, five free |
| Earns screen time with jobs and stars | The child app, `app/k/[token]/page.tsx`, `lib/quests/time-tiers.ts` |
| Some time stays protected | Protected windows, `lib/quests/time-tiers.ts` |
| Three questions, no sign up | `app/(marketing)/starter-pack` |

## Checks run

- No dashes in any card or caption (the `&rarr;` on the button is an arrow).
- `npm run ai-tells` on this file.
- No outcome promised for a child: "ready" is the plan's aim, not a claim
  about results. "Evenings get calmer" in caption B is the calmer homes
  claim family-social allows.
- No statistic, so nothing to verify. The car keys line is a common parent
  analogy (`research/homepage-audience-language.md`), used as our own sentence,
  not a quote.
- Hidden thread: the phone is not the villain. The ad is about readiness, not
  fear.
