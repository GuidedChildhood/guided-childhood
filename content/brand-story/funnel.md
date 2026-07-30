# The sign up funnel, from a caption to an account

**No dashes in any copy.**

The hook is not new and must not be reinvented. It is already set in
`plans/DISTRIBUTION-PLAYBOOK-step-by-step.md` and it is used everywhere:

> **What stage is your child? Three questions, no sign up.**

Everything routes to `guidedchildhood.co.uk/starter-pack`. One destination. It
does not change week to week because a new feature shipped.

---

## Why this hook and not a lead magnet

`/starter-pack` is not a PDF in exchange for an email. It is a diagnosis. A
parent answers three things, age band, the worry, how much time they have, and
gets back which of five stages their child is at, named, with something they can
actually say at bedtime.

That is worth an email address, and more importantly it earns the right to sell
later. A parent who has been told their child is at Builder, ages 8 to 10, and
that the job right now is healthy habits, is a parent who now has a frame. Every
Friday post afterwards lands inside that frame.

**Proof it is real:** `app/(marketing)/starter-pack/page.tsx`, `/api/starter/lead`,
table `starter_leads`. Every CTA on `/join` already routes here, per
non negotiable 9.

---

## The path

```
Mon / Wed post          Fri / Sat post
(no ask, builds trust)  (the ask)
        |                     |
        +----------+----------+
                   |
        Instagram: link in bio
        Facebook:  link in the body
                   |
            /starter-pack
                   |
    age band, worry, time. About 90 seconds
                   |
      Their child's stage, named,
      plus one thing to say tonight
                   |
              email capture
                   |
          account, 7 day trial
                   |
             /onboarding
```

After that the built email sequence takes over: welcome, day 2 stage guide, day
4 DiGi nudge, day 7 founder rate, then the Monday digest. Already shipped, see
`plans/decisions.md`.

---

## Rules

1. **One post in five carries a direct ask.** Friday carries it. Saturday
   carries a soft one when the carousel is a printable. Monday and Wednesday
   never do.
2. **Instagram: no links in captions.** Bio link, plus a Story link on Friday
   and Saturday. **Facebook: real links in the body**, because Facebook does not
   punish them and parent groups click them.
3. **Never say "link in bio" as the whole call to action.** Say what happens when
   they get there. "Three questions, ninety seconds, and it tells you which
   stage they are at."
4. **No engagement bait.** No comment a keyword and I will DM you. It is against
   the standing rules and it reads as a marketer, which is exactly what the 6,000
   are not expecting from this account.
5. **No fake urgency.** The founder rate is capped at 50 and enforced in code, so
   it is the one true scarcity we have. Do not use it until the story has landed.
   Not in the handover fortnight.
6. **Never a shame based before and after.** From the growth plan's never
   transfers list: the contrast is confusion before, calm plan after, and the
   transformation is the parent's, never the child's face.

---

## Stories, the first 30 days

Stories are where the link lives and where the replies come from. Four a week is
plenty and they should take ten minutes.

- **Monday.** A photo from the archive with a sticker asking a question. Poll
  stickers get replies from people who would never comment.
- **Wednesday.** The tonight line from the Wednesday post, on its own, as a
  single card worth screenshotting.
- **Friday.** A real screen recording of the thing that Friday's post is about,
  20 seconds, with the link sticker.
- **Saturday.** Reshare the best reply of the week. Ask permission first, every
  time.

**Highlights to build in week one.** Our Story, first and pinned. Then Printables,
Ask DiGi, and The Stages.

---

## The gap in this plan, named honestly

**Carousels are not the reach format.** They are the save and conversion format.
Reels reach roughly twice as far, and they are how a cold parent finds this
account at all. Carousels are what makes them stay and save.

So the four day rhythm as written is a depth engine with no discovery engine
attached. That is a real hole, and it is worth naming rather than discovering it
in month three when the numbers are flat.

**The fix is not a fifth posting day.** Four is already the number that survives
a real week. The fix is that **Monday and Saturday can each be a Reel instead of
a static post** without changing the rhythm at all. Founder Monday told to
camera is a Reel. A Happy News item filmed rather than laid out is a Reel. Same
slot, same job, different format.

**And the honest caveat.** Smartphone Free Childhood, the biggest UK account in
this space, did not grow on design. It grew on **one founder writing plainly in
the first person**, which went viral and took the whole movement with it. That
account is also framed entirely around banning, which is the gap our pathway
thesis sits in.

Design the system, but do not expect the system to be the growth. The founder
post is. Which is another reason post 3 matters more than everything else in the
handover.

---

## What to measure

Monthly, not weekly, because a rebrand is noisy for the first eight weeks.

| Number | Where | What good looks like at 90 days |
|---|---|---|
| Followers kept | Native | Losing under 10% of the 6,000 |
| Saves and shares | Native | Saves rising faster than likes |
| Bio link clicks | Native | The real top of funnel |
| Starter pack starts | `starter_leads` | The number that matters |
| Starter pack completions | `starter_leads` | Watch drop off between question one and the email |
| Replies and DMs | Native, qualitative | Parents telling us their own guilt story |

**We do not chase reach as a headline number.** Chasing it on a rebrand pushes
straight into the panic content we have spent two years refusing to post.

Some of the 6,000 are event suppliers and wedding people. They will go. That is
not failure and it should not trigger a change of plan.
