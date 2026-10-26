# What the chatbot will not tell you (radar, 26 October 2026)

## The finding

Common Sense Media's Youth AI Safety Institute audited ChatGPT for Teens:
"Across both testing windows, we ran more than 4,000 prompts" on accounts
registered to 13 to 17 year olds, in the US, roughly half before OpenAI's
18 August launch of teen protections and half after. Page dated 7 October 2026.
Source: institute.commonsensemedia.org/risk-assessments/chatgpt-teens

Verified by citation-verifier against the primary page (the PDF was not opened):

- Age detection. About 1,000 prompts over seven days, 160+ chats, on age 19
  accounts. ChatGPT "did not enable the ChatGPT teen experience", even when
  testers stated they were 13. CONFIRMED.
- Parental alerts. More than a dozen fresh linked free accounts, none
  notified in the dedicated test. OpenAI says linking needs about three hours
  and some test accounts were linked for less. The page: "We stand by our
  interpretation of the results." CONFIRMED, and the caveat travels with it.
- Hotline mentions, 201 prompts judged to warrant a crisis response, age 13
  linked accounts: 33% to 23%. CONFIRMED, but the page does not say how many
  responses sit behind each percentage.
- Depression prompts: 63% to 3%. Denominator is not in the text (it is in an
  image table). **Not used in any copy.**
- "Three child psychiatrists" DEMOTED to "clinical advisors" (page says
  "scientific advisors", count unconfirmed).
- "OpenAI disputes the findings" DEMOTED. The page says OpenAI saw a draft for
  factual review, had no editorial say, and gave the three hour point.

## Gate results

- Odgers test. Passes only narrowly. It is a US product audit, not a peer
  reviewed study; the windows were sequential so model changes are confounded
  with teen settings; no inter rater agreement; US only. We say all of that in
  the body of the post, not only the comment.
- Proportionality. Passes if the villain is a promise, not a chatbot: the
  argument is that no tool, ours included, can stand in for the conversation.
  Never "teens are in danger".
- Repetition. `2026-07-17-children-and-ai` argued the sceptical case on
  companions. This is a different claim (platform safeguards, not companion
  harm). Do not re post its post 4.
- **Window flag.** Published 7 October, so 19 days old, outside the radar's 14
  days. Kept because it is the only primary source in the live lane that we
  could read in full this week. Justin can overrule.

## Proof path (platform-mapper)

- The child side has no model to fail: `scripts/check-child-has-no-model.mjs`
  (CI). The one exception is `app/api/kid/homework-help/route.ts`: one fixed
  card, ages 10 and over, no follow up box, nothing stored, three hints per
  question, daily cap. Under 10 asks a grown up.
- The words for the parent: script `d41aac74-8cb0-49fe-81b8-d0b49fee4694`
  (child treating a chatbot as a close friend), lessons `ai_lessons` and schools
  module `ks3-22-when-an-ai-acts-like-a-friend`, concern slug `ai-chatbots`.
- Evidence rows already in `supabase/migrations/263`; this audit is not one yet.

**What it would take to answer it better.** Small: one source row, one script
("does my teen's chatbot tell me if they are in trouble?"). Migration number
must be claimed first (main is at 383).

**Product finding, not content.** The no model guarantee lives in
THE-STORY.md and a script header. No parent facing page states it. A one line
statement in the parent app would turn a CI check into a promise.

## Spine and order

1. LinkedIn, post 1 (question led, the audit in paragraph three).
2. Facebook and Instagram, warm, no percentages in the body.
3. Substack, the long version with the limits.
4. Mumsnet / Reddit, research only.

## Must never say

- That ChatGPT is unsafe, or that the report "proves" harm to any child.
- Any figure beyond those marked CONFIRMED above. No 63% to 3%.
- "None of the alerts fired" without the three hour caveat.
- That this applies to UK children or UK availability (US testing only).
- That our product keeps a child safe, or any outcome for a child.
- Anything about DiGi that implies a child talks to it. They never do.
