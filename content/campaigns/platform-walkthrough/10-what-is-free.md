# 10 · What is free, and what it costs after

| | |
|---|---|
| Run | Parents, 6 of 13. **The second objection post** |
| Service | The price, said plainly |
| Format | One card, 1080 by 1350. Not built |
| Channels | Guided Childhood Instagram and Facebook |
| Proposed | Tuesday 1 December, 19:00 |
| Free step | The stage check |

## Hook

> What is free, and what it costs after.

## The card

- Eyebrow: INSIDE GUIDED CHILDHOOD · 6 OF 13
- Headline: What is free. And what it costs after.
- Three lines, as a list:
  - The stage check. Three questions, no sign up.
  - Then four days of everything. No card.
  - After that, £12.99 a month.
- Pill: What stage is your child?

## Caption, Instagram

Nobody likes finding the price at the end, so here it is in the middle.

1. The stage check is free. Three questions, no sign up.
2. Save your result and you get four days of everything. No card.
3. Everything means everything: the scripts, DiGi, the jobs board, the child's app.
4. After the four days it is £12.99 a month.
5. The first fifty families pay £7.99 and keep that rate for as long as they stay.

If four days does not show you something useful, you have lost nothing but
the four days.

6 of 13. The link is in our bio.

What would it need to do in four days for you to keep it?

## Caption, Facebook

Nobody likes finding the price at the end, so here it is in the middle of
the walk through.

The stage check is free and needs no sign up. It is three questions and it
tells you which of five stages your child is at.

If you save the result, you get an account with four days of everything
open. No card. That is the scripts, DiGi, the jobs board and your child's
own app.

After the four days it is £12.99 a month. The first fifty families pay £7.99
and keep that rate for as long as they stay. That fifty is counted by the
payment system, not by us, so it is a real number and it will run out when
it runs out.

We would rather you knew all that now.

6 of 13. What stage is your child? Three questions, no sign up:
guidedchildhood.com/v/tour-10-fb

What would it need to do in four days for you to keep it?

## Visual brief

- Format 1, the big hook card, cream, with a short list under the headline.
- One gold detail: the pill. No friend. The logo mark at the foot.
- The price sits in the list at body size. It is not the headline.

## Proof

- "Three questions, two minutes. See your child's stage before you make an account.": the live stage check intro.
- "One tap and it is yours, with four days of everything free. No card.": the save screen in `app/(marketing)/starter-pack/page.tsx`.
- `TRIAL_DAYS = 4` in `lib/access.ts`; no free tier after it, `lib/content/free-script-limit.ts`.
- £7.99 founder rate for the first fifty, then £12.99: the save screen and `/join`. The cap is counted in Stripe (THE-STORY section 7).
- During the four days DiGi takes three messages a day (`platform_config.trial_digi_daily_limit`). The card says "everything" because every part is open; the caption can add the three a day line if Justin wants it exact.

## Checks

- No urgency and no deadline on the fifty. `funnel.md` rule 5: it is the one true scarcity, so it is stated once and not pushed.
- **For Justin:** THE-STORY section 9 still lists a free tier (five free scripts). The code removed it on 11 August. This post follows the code.
- Annual is £99 and is left out to keep the card to three lines. Say if it should be there.
