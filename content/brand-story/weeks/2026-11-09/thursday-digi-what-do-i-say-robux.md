# Thursday short film · DiGi, what do I say? Robux

**Format 2, DiGi, what do I say?** From `format-playbook-family-it-guy.md`. The
shape of his "a parent asked" and live chat question card, rebuilt in our own
franchise frame (A THING PARENTS SAY, then DiGi's real reply).

**Status: draft.** No filming by Justin. Built with `product-shorts` from the
real app. DiGi's reply is captured live, never written here. The Thursday slot
is a proposal (see the review).

**Proposed date:** Thursday 12 November 2026, 19:30.

**Why this problem.** Roblox is the main flashpoint at primary age in our own
parent research (`content/packs/2026-10-09-digi-shorts/research/02-parent-voice-mumsnet-and-uk-data.md`,
finding 5), and game money is the one Roblox problem the DiGi shorts series has
not filmed. It also lands where his audience is (his Roblox Reels did 290
thousand and 109 thousand) with the opposite answer: a plan rather than a
deletion.

---

## The opening line (illustrative)

Eyebrow, IBM Plex Mono: A THING PARENTS SAY

> "He asks for Robux every single day. I don't want to be the one who always
> says no."

Built from the situation in script 9651 and the "Roblox and the Robux" theme in
`research/03-digi-code-mapper.md`. It is not a verbatim quote from one parent,
so the eyebrow and the example family slate carry it. Leads with the feeling,
as the product-shorts checklist asks.

---

## Instagram (Reel)

**Caption:**

> Send this to the parent who heard "can I have Robux?" again today.
>
> The asking usually starts before any money has gone anywhere. That is the
> good moment, and it does not come round again.
>
> The plan in our script for it:
>
> 1. One card a month, an amount you agree together.
> 2. It is theirs, to spend however they like in the game.
> 3. When it is gone, it is gone until next month. No top ups in between.
> 4. They show you what they bought. Not to check up, so it gets talked about rather than hidden.
> 5. When the card runs out, ask what they bought and whether it still felt worth it a week later.
>
> A card with a number on it teaches running out, and running out is most of
> budgeting.
>
> What was the first thing your child ever wanted to buy inside a game?
>
> What stage is your child? Three questions, no sign up, link in bio.

## Facebook

> Send this to the parent who heard "can I have Robux?" again today.
>
> The asking usually starts before any money has gone anywhere. That is the
> good moment, and it does not come round again. Once the spending has
> started, every request is a negotiation and you are the person who says no.
>
> We asked DiGi, the guide inside Guided Childhood. It never answers with a
> yes or a no. It gives you where you are, the next step, and the words.
>
> The plan in our script for it:
>
> 1. One card a month, an amount you agree together.
> 2. It is theirs, to spend however they like in the game.
> 3. When it is gone, it is gone until next month. No top ups in between.
> 4. They show you what they bought. Not to check up, so it gets talked about rather than hidden.
> 5. When the card runs out, ask what they bought and whether it still felt worth it a week later. That conversation is the lesson. The card is just the way in.
>
> A card with a number on it teaches running out, and running out is most of
> budgeting. It also takes you out of the job of saying no every time.
>
> What was the first thing your child ever wanted to buy inside a game?
>
> What stage is your child? Three questions, no sign up:
> https://guidedchildhood.com/starter-pack

---

## The film, 30 to 40 seconds (product-shorts arc)

| Beat | Picture | Label |
|---|---|---|
| Frame one | The opening line in the DiGi chat bubble, `typedFrom` set so the words are already there | EXAMPLE FAMILY slate, A THING PARENTS SAY eyebrow |
| Thinking | DiGi's real thinking line, held 2.2s | |
| Reply | DiGi's captured reply, punched in on its plan line and its Tonight line | ILLUSTRATIVE REPLY |
| The words | Script 9651 as the deck, pushed in on one line from Say this, under a band | |
| Checked in | The check in, first face tap, then A FEW DAYS ON and A WEEK ON | THIS PARENT'S OWN RATING, ILLUSTRATIVE TIME MARKERS |
| End card | Eyebrow: GAMING CONCERNS? Then the series line, the `/v/` link, the slate | |

Tracker rail: Asked DiGi, The words, Checked in, Sorted.

**What to type into DiGi on the fixture account:** the opening line above, for
an example child of 9. Rename through `tools/names.json` before any frame
exists. If the live reply misses the card idea or runs over 120 words, do not
edit the reply: rerun, or change the question, and say so in the review.

**No tool beat.** The arc's tool step has no natural match for game money (the
star deal buys minutes, not Robux), so this film goes straight from the words
to the check in. Justin's call whether that is fine or whether it waits.

**TikTok cut:** 35 seconds, drops the send and the tap lead in, own `/v/` code.

---

## Proof path

- **The plan in the caption:** script "The first gift card, before the first
  spend", `supabase/migrations/261_situations_scripts.sql` lines 58 to 72, sort
  order 9651, builder stage, gaming category, `is_free` true. Each numbered line
  is taken from its say this, tonight and check back fields. "Running out is
  most of budgeting" and "takes you out of the role of the person who says no"
  are from its why it works field.
- **DiGi never says yes or no:** the rails in `lib/digi/system.ts`.
- **The check in:** `components/daily/ConcernCheckIn.tsx`.
- **End card eyebrow:** the worry tile "Gaming concerns" in
  `lib/pathway/challenge-labels.ts`.

## Checks

- The script's why it works field carries statistics (97 percent play, 53
  percent spend, a loot box study, a Fortnite settlement). **None of them is in
  this post**, because none was re opened at source today. If Justin wants a
  number in the caption, it goes through the claim check first.
- Allow or deny: none. The card is a structure with a review, which is a
  pathway.
- Dashes: none.
