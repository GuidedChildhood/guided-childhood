# The Founder Voice Bible

Living. Read by `.claude/skills/founder-voice-review/SKILL.md` before any
outward writing is called ready. Started 24 November 2026 at Justin's request:
"Learn how I think, challenge arguments, explain research and speak to parents
and educators."

Every example here is his own published or supplied writing, or a rule he gave
in his own words. Nothing is invented. Private context stays outside the repo;
`founder-context.md` holds the public safe biography and its privacy levels.

## 1. Where the examples come from

| Source | Status | Use |
|---|---|---|
| His best performing post, the Wrong Villain "beta = 0.061" post (about 74,000 impressions) | in `.claude/skills/viral-post/SKILL.md`, Part 1 | the reference for how he explains research |
| His supplied founder context, 1 October 2026 | `content/brand-story/founder-context.md` | his positions and true scenes |
| The family account's founding story | `content/brand-story/founding-story.md` | the family voice |
| Posts 054 to 058, live on LinkedIn by 23 November | packs and handoffs named in `content/gdc-post-register.md` | edited by us before posting, so evidence of what he accepts, not of how he writes unedited |
| His instructions to Claude, quoted in `plans/decisions.md` and the archives | in repo | his corrections, section 6 |
| ChatGPT conversations, voice transcripts, newsletters he wrote alone | **not accessible from here** | add when he shares one: paste it into section 5 with the date and where it came from |

## 2. What he thinks, which the writing must never contradict

From `config/content-engine.json` `philosophy` and `founder-context.md`.

- Don't dismiss the risks. Don't exaggerate the evidence.
- Don't make a ban the only respectable parenting choice. Give parents the
  information and tools to decide.
- A delay is not preparation. That does not make delay useless: "delaying
  something and preparing a child for it are different jobs."
- No single age describes every child's readiness for every digital experience.
  Staged introduction, adult support, gradually more independence.
- He changed his mind. Five years ago he thought technology was largely bad for
  children; now he thinks it can matter enormously, and that the job is skills
  and judgement. **Never flatten this to "technology is good".** Different
  technologies, children and contexts produce very different experiences.
- He is not the parent who solved it. He is a parent who found the simple
  answers did not survive real family life, researched it, changed his view and
  started building the tools he wished he had.

## 3. How he explains research, his moves

Taken from the Wrong Villain post, his strongest piece.

1. **Open on the named study and what it found, with its number, in one
   sentence.** "A peer reviewed meta analysis published this year looked at 46
   studies and 79 effect sizes on the relationship between social media use and
   adolescent mental health." Then the number on its own line.
2. **Credibility by naming, not by adjectives.** Institutions, sample sizes,
   pre registration, open data. Precision is how a stranger trusts him.
3. **The honest pivot, in its own sentence.** "That number is not zero." He
   concedes the strongest opposing point before the reader can raise it. If a
   piece has no concession, it is not his yet.
4. **A borrowed comparison, attributed.** "That is not a metaphor I invented."
5. **One ratio a reader remembers**, then what it is for: "If you want to
   understand why the response ... keeps missing the mark, that ratio is the
   answer."
6. **A principle in the ask**, never a favour: "The response to this crisis
   should be proportional to the evidence."

How he challenges an argument: agrees with the worry, disputes the mechanism,
names what the evidence can and cannot show, and never mocks the other side.

## 4. His words

- **British English**: behaviour, organise, prioritise, programme, mum,
  colour, centre, practise (verb) and practice (noun), towards, whilst only if
  he uses it.
- Plain verbs. "Shows", "found", "asked", "counted", not "reveals",
  "underscores", "highlights".
- Numbers as numbers, ages as "4 to 16", never with a dash.
- He says "parents" and "children", and "kids" when he is being informal.
- He writes "we" for Guided Childhood and "I" only for something he did,
  thought or changed his mind about.
- No dashes. Ever.

## 5. Examples in his voice

Add his own writing here when he shares it, with the date and where it came
from. Do not paste an edited version as if it were his raw writing.

- (24 Nov 2026) The Wrong Villain post: see section 3 and viral-post Part 1.
- (4 Aug 2026, to Claude) "please summarise in general as a rule, as no need to
  go into so much detail as takes too long to read, as long as vital info
  there, it worked and why, and let me know what you need from me." The voice in
  short: say the vital thing, say whether it worked, stop.

## 6. Corrections log

Append only. Newest at the bottom. One row each time Justin corrects wording
or a writing rule. If the rule is mechanical, it is also in
`scripts/check-ai-tells.mjs`.

| Date | What he said or did | Rule it teaches | Enforced by |
|---|---|---|---|
| Since the start | "No dashes in any copy, ever" (CLAUDE.md non negotiable 4) | restructure, never swap in another dash | the guard |
| 4 Aug 2026 | asked for summaries, not detail | reports to him are three things and stop | CLAUDE.md |
| 29 Sep 2026 | "do not use words or punctuation that let an algorithm, or a reader, place the writing as machine written" | the hard list and the ear | the guard, ai-tells.md |
| 13 Oct 2026 | "lets always apply a claude review over posts put in drive" | a post in Drive marked READY has not been reviewed | drive-post-review.md |
| 16 Oct 2026 | GDC 043's hook rewritten: it referred to a post nobody had read | a hook stands alone; never lean on an earlier post | the ear |
| 6 Nov 2026 | comment keyword DMs banned in the fix pack | no "comment X and I will send it" | QA (`linkedin.commentKeyword: false`) |
| 9 Nov 2026 | asked how to avoid AI detection | aim at his rhythm, never at a detector | rhythm.mjs |
| 11 Nov 2026 | the best post of the week opened on the named study and its finding | open on the named study and finding, not a question | QA, the ear |
| 24 Nov 2026 | "Avoid generic AI vocabulary, corporate language, repetitive rhetorical contrasts, predictable three-part sentences, excessive one-line paragraphs, unnecessary em dashes, formulaic hooks and forced closing questions." "Do not reproduce accidental spelling errors." "Do not invent anecdotes, personal experiences, quotations or family stories." | this skill | the guard (stock phrases, stiff openers), the ear, the meter |
| 25 Nov 2026 | "Replies need to be my voice and no AI phrases or tells in future" | every comment and DM reply drafted for him is in his voice and gets the same read as a post: run the guard and the ear before handing it over; no stock openers ("That's the X in one sentence", "Two things can be true"), no "not X, it's Y" contrasts, no tidy threes, no closing question by reflex; short, plain, his rhythm | the guard, founder-voice-review |
| 24 to 26 Nov 2026 | The Mumsnet ten parents post, drafted by Claude: "sounds so ridiculously Chat GPTd that it is actually painful to read". It passed the guard and the meter. Justin, 26 Nov: "I don't want that again" and yes to Justin writes, Claude checks | in other people's spaces Justin writes first and Claude only checks (at least 90 percent his words); no announced honesty ("I'll be upfront"), no three neat struggles, no "6pm on a Tuesday", no numbered survey, no product copy, no tracked link, no "thank you for reading" | `--community` guard, `own-words`, founder-voice-review |

## 7. How to keep this alive

- After every correction: a row in section 6 the same day.
- When he shares a piece he wrote alone: section 5, and consider adding the
  file to `BASELINE_FILES` in `scripts/rhythm.mjs` if it is unedited.
- Each January: re date the weak word list in the skill (the sources say these
  lists move year to year).
- If a rule here and a rule in a skill disagree, the newest dated correction
  from Justin wins and the other file is fixed the same day.
