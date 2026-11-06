# Happy News Saturday · The ladder, in five

**Format 4, The ladder, in five.** From `format-playbook-family-it-guy.md`. The
shape of his pinned numbered five (1.4 million views), with house rules turned
into a ladder: every rung a stage, every stage a next step.

**Status: draft.** No filming. A seven card carousel in THE ROAD TO 16
franchise, built with `gdc-instagram-carousel` from approved assets, plus a
Reel cut from the same cards to test against it (his carousels underperform
his Reels badly, so we test rather than assume).

**Proposed date:** Saturday 14 November 2026.

---

## The cards (Instagram carousel, 4:5)

Every card: cream canvas, one Planet Friend on the gold pathway, Nunito 900
headline, IBM Plex Mono eyebrow. Approved character art only
(`brand/GDC_SOCIAL_VISUAL_SYSTEM.md` section 3).

| Card | Eyebrow | Headline | Body (two lines at most) | Art |
|---|---|---|---|---|
| 1 | THE ROAD TO 16 | Nobody goes from no phone to everything in one birthday. | Five steps. Where is yours? | The pathway, all five friends small |
| 2 | 4 TO 8 | No personal phone. | Shared family screens, in the same room. This is where the first habits form. | Pebble |
| 3 | AROUND 9 TO 10 | A first feature phone, if one is needed. | Calls and texts, no apps, no feed. The walk home, without the algorithm. | Bloop |
| 4 | 11 TO 12 | Still no social media. | If a smartphone is truly needed, it is locked down and set up together. | Orbit |
| 5 | 13 TO 15 | A smartphone, with agreed guidelines. | Social media introduced slowly and talked through. Each step earned. | Nova |
| 6 | 16 | The full phone. | They step onto real feeds already knowing how they work and how to get help. | Cosmo, then the Passport |
| 7 | SAVE THIS | Prepared, not postponed. | Save it for the day the phone conversation starts. | The Passport, gold pathway ending |

Check each friend against its stage in `digi-squad/README.md` before render.

## Instagram caption

> Five steps, from 4 to 16. Where is yours?
>
> Most of us were handed a plan with two steps: no phone, then everything. The
> phone plan in the app has five.
>
> 1. 4 to 8: no personal phone. Shared screens, same room.
> 2. Around 9 to 10: a first feature phone, if one is needed. Calls and texts, no feed.
> 3. 11 to 12: still no social media. A locked down smartphone only if one is truly needed, set up together.
> 4. 13 to 15: a smartphone with agreed guidelines, and social media introduced slowly.
> 5. 16: the full phone, and they arrive already knowing how it works.
>
> The ages are a guide. Your child sets the pace, which is why each step is
> earned and talked through rather than given on a birthday.
>
> Which step was the hardest one in your house?
>
> What stage is your child? Three questions, no sign up, link in bio.

## Facebook (one tall image: card 1, with the full list in the text)

> Nobody goes from no phone to everything in one birthday. Or rather, most of
> us were handed exactly that plan: no phone, then the lot.
>
> The phone plan in Guided Childhood has five steps.
>
> 1. 4 to 8: no personal phone. Shared family screens, always in the same room. This is where the very first habits form.
> 2. Around 9 to 10: a first feature phone, if one is needed. Calls and texts, no apps, no feed. The independence of a walk home, without handing over the algorithm.
> 3. 11 to 12: still no social media. If a smartphone is truly needed, it is a locked down one, strong settings, set up together.
> 4. 13 to 15: a smartphone with agreed guidelines. Social media introduced slowly and watched, each step talked through.
> 5. 16: the full phone and real social media. They arrive already knowing how feeds work and how to get help.
>
> The ages are a guide. Your child sets the pace, which is why each step is
> earned and talked through rather than handed over on a birthday. Prepared,
> not postponed.
>
> Which step was the hardest one in your house?
>
> What stage is your child? Three questions, no sign up:
> https://guidedchildhood.com/starter-pack

## The Reel version, 20 to 25 seconds

The same seven cards as a held sequence, one rung per beat, the gold pathway
drawing left to right across the cuts. Reading rule from `product-shorts`
(0.6s plus words divided by 3.3, never under 1.4s). Ends on the stage check end
card instead of card 7. Post it a fortnight later as an A/B against the
carousel, not the same week.

---

## Proof path

- **Every rung:** `PHONE_LADDER` in `lib/content/passport.ts` lines 83 to 113.
  The card and caption wording is condensed from each rung's `device` and
  `detail` fields, nothing added.
- **Where a parent sees it:** `/dashboard/phone-setup`, the section "What phone,
  at what age" (`app/(dashboard)/dashboard/phone-setup/page.tsx` line 62).
- **"Each step earned" and "prepared, not postponed":** rungs 4 and 5 of the
  same constant.
- **The passport:** `/dashboard/passport`.

## Checks

- Allow or deny: the ladder names what each rung looks like, never "never" or
  "must". "The ages are a guide. Your child sets the pace" carries the stage
  rather than age line.
- The ban: not mentioned. The ladder stands on its own whatever the law does.
- Dashes: ages written "4 to 8", never with a dash. Run `npm run ai-tells`.
- Public wording (6 November): "ladder" and "rung" are kept out of the cards
  and captions under the carousel skill's rule (`references/ladder.md`); the
  public copy says "steps" and "phone plan". They stay in file names and these
  notes, which are internal.
