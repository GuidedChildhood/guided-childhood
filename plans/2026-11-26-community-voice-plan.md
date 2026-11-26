# Never again on Mumsnet: the plan for posts in other people's spaces

26 November 2026. Justin: "please review feedback and experience with Mumsnet,
I don't want that again with AI writing, so please come up with a plan moving
forward."

## What happened

The ten parents post (24 November) was drafted by Claude. The first reply was
"sounds so ridiculously Chat GPTd that it is actually painful to read". Five more
replies followed. The full weigh up is in `plans/2026-11-24-mumsnet-replies-weighed.md`.

The thread was not wasted. It caught a script line a child would argue with
(PR 1714), a page that loaded itself twice (PR 1717) and a result page that did
not say what happens next (PR 1718). Those fixes came from real parents. But the
first impression was "a bot is selling to us", and on Mumsnet that does not
wash off.

## Why our checks did not catch it

Run today against the post as it went out:

- `npm run ai-tells`: **PASS.** No banned phrase, no dash.
- `npm run rhythm`: mean sentence 12.3 words against his 12.8, spread 74 against
  his 79. **Close to his own writing.**

So it was not the words. It was the kind of post. A forum smells these:

| What was in it | Why Mumsnet read it as a machine |
|---|---|
| "I'll be upfront", "not a company with a marketing team", "which is exactly why I'm asking" | Honesty announced, not shown. A person just says the thing. |
| "The row when the tablet goes off, the everyone else has a phone conversation, not knowing what was going on in the games" | Three neat struggles. Real life comes out as one, messily. |
| "6pm on a Tuesday" | A stock image, and ours: it is in six of our files. |
| A numbered list of three questions, "Blunt is good", "Thank you for reading" | The shape of a survey, not a parent asking. |
| "the words to use tonight and a plan for their age" | Product copy pasted into a chat. One reader rightly called it pointless. |
| A long tracked link | A stranger's link with a code on the end. Nobody clicked. |
| Complete, balanced, tidy | Forum posts are short and a bit rough. A polished one stands out. |

And the reason under all of it: **Claude wrote it from nothing.** The guard and
the meter check a draft against Justin. They cannot turn a draft that was never
his into his.

## The plan

### 1. Other people's spaces: Justin writes, Claude checks

Mumsnet, Reddit, Facebook groups, school and class WhatsApps, Netmums, any
forum, any reply to a parent. Claude never drafts these from nothing again.

- Justin writes it, typed or as a voice note, however rough. Claude can give
  him the four things to cover (who he is, what happened in his house, what it
  is, what he wants from them) as bare prompts, never sentences.
- Claude then does four jobs only: check every fact and claim against the
  product, check the board's rules, flag anything private (AMBER or RED in
  `founder-context.md`), and suggest **at most three** cuts or fixes, each one
  marked so he can say no.
- Claude does not rewrite his sentences, tidy his rhythm or add a line.
  Spelling slips are fixed; his phrasing stays.
- A check counts it: at least 90 percent of the posted words must be his. The
  founder voice review records the share. Below that, it goes back to him.

### 2. Where Claude still drafts (LinkedIn, newsletter, site copy)

These stay as they are, with three additions:

- **A forum tells list** in `scripts/check-ai-tells.mjs`: announced honesty
  ("I'll be upfront", "I'll be honest", "to be clear"), "which is exactly why",
  "blunt is good", "thank you for reading", "6pm on a Tuesday" and its cousins,
  and the product lines that read as copy ("the words to use tonight"). Found
  today: "which is exactly why" is in 24 of our files and "thank you for
  reading" in 13. They are our tics. A new `--community` mode fails on them;
  everywhere else the meter prints them.
- **A genre step** in the founder voice review: before the read aloud, ask
  "where will this be read, and does it look like the posts already there?"
  For a forum: short, no lists, no headings, no link with a code on it, one
  real moment, the ask in the first two lines.
- **His real words as the yardstick.** The replies Justin wrote himself on the
  thread go into the Voice Bible, section 5, and into the meter's baseline, so
  the meter measures against how he writes in a thread, not in his biography.

### 3. Before any post in a new community

- Read ten recent threads on that board first and note how people write there.
- Read the board's rules (Mumsnet asks before links that earn money).
- Send them to a page that is ready: walk the path the post sends people down
  the same day, on a phone.
- A domain to type, never a tracked link. Track with a `/v/` code on our side if needed.

### 4. If anyone says "this sounds like AI" again

Stop. Do not argue the point in the thread. Justin replies in his own words,
Claude logs it in the Voice Bible corrections the same day with the line they
quoted, and the post is reviewed against this plan before anything else goes
out in that space.

### 5. Mumsnet from here

- The thread has been deleted (Justin, 26 November). No new post there for
  now. When Justin next posts on Mumsnet it is his own writing under rule 1.

## Justin's answers (26 November)

1. Rule 1: yes.
2. The thread is deleted, so his replies are not available as samples. The
   first thing he writes himself in a forum goes into the Voice Bible, section 5.

## Built (26 November)

- `--community` mode and the forum tells list in `scripts/check-ai-tells.mjs`;
  the same list printed by `scripts/rhythm.mjs` for everything else.
- The genre step and the 90 percent own words check in
  `.claude/skills/founder-voice-review/SKILL.md`.
- A Voice Bible correction row for 24 November (Mumsnet).
- Rule 1 in the `family-social` and `content-engine` skills, one routing line
  in CLAUDE.md, and `plans/DISTRIBUTION-PLAYBOOK-step-by-step.md`.
