# Thursday short film · DiGi, what do I say? Robux

**Format 2, DiGi, what do I say?** From `format-playbook-family-it-guy.md`. The
shape of his "a parent asked" and live chat question card, rebuilt in our own
franchise frame (A THING PARENTS SAY, then DiGi's real reply).

**Status: approved 6 November, waiting on the four film links.** No filming by
Justin. Built with `product-shorts` from the real app. DiGi's reply is captured
live, never written here. Thursday slot, opening line and no tool beat agreed
(see the review).

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

> "She asks for Robux every single day. I don't want to be the one who always
> says no."

Built from the situation in script 9651 and the "Roblox and the Robux" theme in
`research/03-digi-code-mapper.md`. It is not a verbatim quote from one parent,
so the eyebrow and the example family slate carry it. Leads with the feeling,
as the product-shorts checklist asks.

## DiGi's reply, captured 6 November 2026

Generated from DiGi's real prompt the way `lib/digi/evals.ts` does it: the
live static system prompt (`staticSystemFor`), the route's weighing and tool
rules, a minimal family context (Ava, 9, Builder), the script link block for
9651 and the parenting lane shape, on `claude-fable-5-1`. "She" because the
film family's child is Ava (`tools/names.json`). Three runs, all passing
`verifyReply` and all linking 9651; run 2 was chosen as the shortest (154
words) and the closest to the card idea. Not edited. The film streams it
through the real chat renderer. The other two runs are not used.

> Daily asking is a child who does not know the answer yet, so she asks again. The fix is a deal she helped make, so the question stops landing on you.
>
> **Set the Robux deal once, in a calm moment.** Agree a fixed amount and a fixed day, say a gift card on the first of the month. Every ask after that gets the same calm answer: that is the deal, next card is on the first.
>
> **Make the spending hers.** Let her plan what the card buys and feel it run out. Running out teaches more than any no.
>
> The exact words are in [The first gift card, before the first spend](/dashboard/scripts/9651).
>
> **Tonight.** Tell her you want to sort Robux properly this weekend, together, and ask what she would buy first.
>
> ---
>
> Quick one for tonight: when Ava asks for Robux, is it usually straight after playing with friends, or out of nowhere?

---

## Instagram (Reel)

**Caption:**

> Send this to the parent who heard "can I have Robux?" again today.
>
> The asking usually starts before any money has gone anywhere. That is the
> good moment to agree a deal.
>
> We asked DiGi, the guide inside Guided Childhood, built on research. An
> example family, real app screens. The plan in our script for it:
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
> good moment to agree a deal. Once the spending has started, every request
> is a negotiation and you are the person who says no.
>
> We asked DiGi, the guide inside Guided Childhood, built on research. It
> never answers with a yes or a no. It gives you where you are, the next step, and the words.
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
> guidedchildhood.com/v/robux-fb

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
to the check in. Built that way on 6 November; Justin agreed the same day.

**TikTok cut:** 35 seconds, drops the send and the tap lead in, own `/v/` code.

---

## Built 6 November 2026

- **Cuts:** `videos/2026-10-09-digi-shorts/cuts/short-robux.json` (42s, Reels
  and Facebook) and `short-robux-tt.json` (38.6s, TikTok). Scenes
  `robux-chat`, `script-deck-9651`, `followup-robux`, `checkin-great-robux`.
- **Real screens:** the DiGi chat with the captured reply above, the script
  deck for 9651 (`/ref-script-deck?script=9651`, a fixture that reads the
  migration text, checked against the live row), and the check in relabelled
  to Gaming concerns.
- **The arc:** the opening line, DiGi's thinking line ("Never a flat yes or no.
  Working out your next step."), the reply with a push in on its plan line,
  the Tonight line, Say this with two underlined phrases, the check in from a
  few days on to Sorted, then the end card. No send beat and no tool beat.
- **Labels:** example family slate, illustrative reply, illustrative time
  markers, this parent's own rating.
- **Kept off screen:** the chat's empty state, which suggests an Instagram
  question for a nine year old, never appears. The reply streams for 0.6s and
  stops before its word "fix" (banned on screen); the plan and Tonight beats
  are crops of `stills/robux-reply-full.png`, the last frame of the same chat
  recorded at a taller viewport (`robux-chat-tall`), so the plan step reads
  whole instead of under the composer. The deck beat ends on Say this, before
  the Not this card ("Ask me again and the game goes") can flash past.
- **Review:** `plans/2026-11-06-robux-short-review-weighed.md`.
- **Links to make on Admin, Film links, before posting** (one per platform, as
  the series posting plan does): `robux-ig` as the Instagram bio link,
  `robux-fb` in the Facebook text, `robux-tt` on the TikTok cut's end card.
  The Reels end card shows `/v/robux`, so make that one too.

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
