# Editorial watchlist: what readers say gives writing away

Living. Read by `.claude/skills/founder-voice-review/SKILL.md`. Started
26 November 2026 at Justin's request, after the Mumsnet thread of 24 November.

**What this is for.** Understanding what parents, teachers and LinkedIn readers
criticise in machine written posts, so our writing is better. It is not a way
to detect AI and it is not a way to dodge detectors. Every source below says
the signs are weak on their own and that people judge them at about chance.
Stripping markers without fixing the thinking makes writing harder to place,
not better. The fix readers ask for is always the same: the specific detail,
the person's own words, shorter, and a real point.

## Sources (read 26 November 2026, re read each quarter)

| Source | What it is | Use it for |
|---|---|---|
| [Wikipedia, Signs of AI writing](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing) | Advice page, "as of October 2026", CC BY-SA (summarised here, not copied) | Word and structure lists; "regression to the mean"; cautions for reviewers |
| [Mumsnet, Is it always wrong to use AI to write a post?](https://www.mumsnet.com/talk/_chat/5382700-is-it-always-wrong-to-use-ai-to-write-a-post) | Chat thread, 30 July 2025, about half the replies readable | What parents resent and what they accept |
| [Mumsnet, Declaring AI posts](https://www.mumsnet.com/talk/site_stuff/5591459-declaring-ai-posts) | Site Stuff thread, 21 October 2026, 246 replies, no official HQ reply seen | Disclosure norms on the site we were caught on |
| [r/linkedin 1w37lm2](https://www.reddit.com/r/linkedin/comments/1w37lm2/), [r/linkedin 1qyo80o](https://www.reddit.com/r/linkedin/comments/1qyo80o/) | Reddit threads | **Not read**: Reddit refuses automated reading. Justin can paste them in and they will be added |
| [Pew Research Center, How much of the internet is written with AI?](https://www.pewresearch.org/data-labs/2026/08/20/how-much-of-the-internet-is-written-with-ai/) | Data lab report, 20 August 2026 | Scale and which markers rose; its own caveats |
| [UNESCO IdeasLAB, AI and the great linguistic flattening](https://www.unesco.org/en/articles/ai-and-great-linguistic-flattening) | Opinion piece by Aristotelis Paschalidis (University of Nottingham), 24 June 2025, updated 27 October 2025; the author's views, not UNESCO's | Why sameness is the real cost |

## What readers say gives it away

Already caught by code (`npm run ai-tells`, `--community`, `npm run rhythm`):
dashes, stock phrases, "not X but Y" scaffolding, stiff openers, tacked on
"-ing" clauses, announced honesty, numbered survey asks, tracked links, our own
tics. The list below is what code cannot judge. Each is a question for the read
back.

1. **Specific turned generic.** A precise fact replaced by safe praise or a
   broad claim. Wikipedia calls it regression to the mean. Ask: is there a
   number, a named body, a real thing a parent does, in every paragraph?
2. **Long and flowery where short and plain would do.** Mumsnet, 2025:
   "devoid of character and meaning". Ask: could it lose a third and say the same?
3. **No person in it.** Mumsnet, 2025: AI "strips your post of any personality".
   Ask: would anyone who knows Justin recognise him in it?
4. **Invented or drifted details.** Mumsnet, 2025: added details changed what
   the poster meant. Ask: is every detail in the source or in his own words?
5. **Invented reflection.** "The number that stayed with me", "the part I keep
   coming back to", "I am not sure which group I would have been in". A feeling
   he never told us is a manufactured experience. Ask: did Justin say this?
6. **Customer service voice and stacked reassurance.** Wikipedia. "Rest
   assured", "we take this seriously", three reassurances in a row.
7. **Answering critics by asking them for more feedback.** Wikipedia. Answer
   the point they made.
8. **Ending on a vague upbeat note or a summary.** Wikipedia. End on the last
   real thing.
9. **Headed sections or lists inside a comment or forum post.** Wikipedia;
   Mumsnet 2026 ("AI formatted stuff").
10. **Polish too perfect for the place.** Mumsnet, 2025: "I would much rather
    read a post that isn't 'perfect'." Never fake mistakes; just do not
    over smooth his words.
11. **Words that puff up importance.** A "testament" to something, a lasting "mark", "serves as" where "is" would do.
12. **Sameness across posts.** UNESCO: a "default pull" makes everything sound
    alike. Ours, measured 26 November by `node scripts/radar/openings.mjs`:
    "I build a parent tool", "the source is in the comments, if you", "with no
    promise about what happens next", "the stage check we built asks three
    questions about one child", "the strongest objection is" in every first
    comment, and a repost ask plus closing question on every post.

## Replies to people

From the same sources and the Voice Bible (25 November): answer the person's
actual point, in a sentence or two. No automated praise ("great point"), no
repeating their words back, no generic agreement, no question by reflex, no
headed list. If they criticise, say what is true in it and what changed.

## Disclosure

- Mumsnet has no official rule that we could find. The October 2026 thread
  proposes declaring AI help at the start of a post, allowed only for
  organising thoughts or literacy help. Readers in both threads draw the same
  line: **AI as an editor of your own words is largely fine; AI as the author
  is resented.** That is our rule 1 (Justin writes in other people's spaces).
- Justin's LinkedIn post of 26 November says plainly that he uses AI and that
  the decisions and claims are his. Keep that stance consistent everywhere.

## Figures we may quote, exactly as Pew gives them

- "Of all the pages in this sample, 10% show significant signs of AI
  authorship" (a random sample of 10,000 English web pages, July 2026).
- Signs of AI authorship "can be found in over one-third of pages published
  after ChatGPT was released".
- Since 2023, em dashes appear "about twice as frequently"; negative
  parallelism "has nearly tripled", though "still fairly rare overall".
- Pew's caveats travel with any of these: the detector (Open Pangram) is
  imperfect in both directions, pages are "likely written or substantially
  edited by AI", and single markers "on their own don't necessarily mean" AI
  was used. The fetched page carried a passage that may not be Pew's own;
  check the live page before quoting anything from its "written by AI" section.

## Cautions

- People tell machine text from human text at about chance (Wikipedia, citing
  a 2025 study). Never accuse anyone, and never claim our text "passes".
- The signs describe; they are not a checklist to optimise against (Wikipedia).
- Single markers prove nothing (Pew). Judge the piece, not the punctuation.
