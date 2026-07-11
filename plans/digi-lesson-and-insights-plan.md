# DiGi: quick lessons on demand, and a daily insight loop

Two capabilities that make DiGi visibly cleverer and make the whole product
learn from what parents actually ask. Grounded in what already exists, so we
build on our assets, not over them.

## Feature A — DiGi turns a how to question into a quick lesson

When a parent asks a teaching or how to question ("how do I talk to my son
about porn", "how do I explain in app spending", "how do I set up WhatsApp
safely"), DiGi should not just answer in chat. It should compose a short
structured lesson in our house format, grounded in our philosophy, the
research bank, and the lesson bank, and offer it as something they can keep.

What we already have to build on:
- `expert_knowledge` (the research bank) plus `getExpertKnowledge`, a relevance
  scorer that pulls the right slice per question. Already injected into DiGi.
- `ai_lessons` (the lesson bank): `the_idea`, `key_message`, typed `slides`,
  `strand`. Our house lesson shape.
- The philosophy and voice in the DiGi brain files and system prompt.

The house quick lesson shape (a light version of a full slide lesson):
1. Title, plain and specific.
2. The big idea (one line, the `key_message` equivalent).
3. Why it works, citing one named source from the research bank.
4. Teach it in three steps (the practise beat).
5. Try tonight (the close beat, one concrete action).

Build order:
- A1 (prompt): teach DiGi a QUICK LESSON MODE. When the message is a teaching
  or how to question, answer in the shape above, grounded in the retrieved
  research and lesson bank, in Justin's voice, no dashes. Detectable so the
  client can render it as a lesson card. Ships value on its own.
- A2 (render): the chat detects a lesson and renders it as a lesson card
  (title, the beats, a source line), not loose bubbles. A keep control:
  print or share now, save later.
- A3 (persist, needs a migration): a `digi_lessons` table so a parent can
  save a generated lesson to their own library, and so good ones can be
  promoted into `ai_lessons`. Claim the next migration number at build time.

## Feature B — the daily insight agent

DiGi already logs every exchange to `digi_questions` (user, question,
response, stage). That is the raw material to make the whole product learn.

A scheduled agent that, each day:
- Reads the recent `digi_questions` (de identified: no names, no child detail).
- Themes them: what parents keep asking, by stage and topic.
- Cross checks against what we have: is there a script for this? a lesson? a
  device guide? an expert_knowledge entry? Gaps become recommendations.
- Produces a short report for Justin: the top themes, the gaps, and concrete
  suggestions (new scripts, new lessons, a philosophy or research addition),
  ranked by how often it came up.

Surfacing options (decide at build):
- Email to Justin (Resend is already wired), or
- An admin only insights page, or
- A markdown drop in the repo/Drive.

Scheduling: a daily cron hitting an admin only API route. The route does the
aggregation and the model pass, and returns/sends the report.

Privacy line (hard): aggregate and de identify. Never surface an individual
family. This is data about children and struggling parents. k anonymise any
theme before it is shown, exactly as the intelligence plan requires.

Build order:
- B1: the aggregation + model recommendation route (admin only), returns JSON.
- B2: the report surface (email or admin page).
- B3: the daily schedule.

## Guardrails (both)
- Never allow or deny. Calibrated pathway only.
- DIGI_MODEL stays config. Data minimisation. No dashes in copy.
- Everything grounded in our real research and lessons, cited, never invented.
