# Content engine audit, 24 November 2026

Stage 1 of `plans/2026-11-24-content-engine-plan.md`. Read only: the repo
(instructions, skills, agents, pipeline code, run logs), the scheduled tasks and
the Drive operating documents. Three parallel read only passes plus Claude's
own check of the scheduled tasks. Nothing was changed by the audit itself; the
two fixes made the same day are listed at the end.

## The five things that stop it running on its own

1. **The scheduled radar cannot commit.** 18, 19 and 24 November: `git commit`
   refused by the session permission check ("auto mode classifier, Destructive
   or Unwanted Actions") although the dry run push passes. Each day's work was
   left as a patch in Drive and recovered by hand. 20 and 23 November have no
   run file at all. Until this is fixed nothing the radar does reaches main.
2. **ChatGPT reads documents that disagree.** START HERE links the Daily
   Content Operating System (still carrying a "current 7 day queue" for 1 to 7
   October) and the "Current LinkedIn Posting Pack" (30 September, an October
   order). Two other Drive files call themselves CURRENT LinkedIn guidance.
3. **Five engines write LinkedIn posts, three claim numbers.** Radar Stage 2,
   the Monday LinkedIn pass, the Monday research radar, content-engine and
   viral-post write; post-picker picks; ChatGPT books in Metricool. This is why
   numbers collided (ChatGPT's provisional 064 to 066) and the week of 23
   November held five posts against a cap of three.
4. **The Metricool handoff is LinkedIn only and radar only.** No platform
   variants, no slot field, nothing for posts outside the radar (060, 064 to
   067), nothing reads back what ChatGPT did. Handoffs exist only for 054 to 059
   and 061; those for 054 to 058 are live and not marked finished, so they could
   be booked again.
5. **No single settings file.** Cadence, lengths, formats, visual specs,
   permissions and folder ids are constants spread across `qa.mjs`,
   `packformat.mjs`, `metricool.mjs`, `contract.mjs`, `daily.mjs`, the motion
   theme and six skills, and the skills disagree with the code.

## Contradictions, with the rule that wins

| Topic | Disagreement | Wins (latest founder instruction) |
|---|---|---|
| Cadence | 3 cap (decisions, README) vs 3 to 5 floor (linkedin-week, viral-post, post-picker) vs weekdays (Drive OS, Posting Pack) vs "every other day" (evidence-reveal) | Brief of 24 Nov: 3 to 4 strong posts a week; scheduling takes the next free date then every other day, 08:00 UK |
| Hook | number in a sentence (linkedin-engagement, viral-post) vs named study and finding (what-is-working.json, 11 Nov) vs open on a question (research-radar skill and its scheduled task, drive-post-review) vs never a question | Newest evidence: named study and its finding (11 Nov) |
| Length | 250 to 450 words (QA) vs 150 to 400 (content-engine) vs 1,800 to 2,900 chars (viral-post) vs "short can win, five sentences" | QA's band stays; a short post may be cleared by the reviewer with a reason |
| Call to action | comment keyword banned in five files, still prescribed by content-engine and two parts of viral-post | Banned |
| Follow ask | hard ask (content-engine, viral-post) vs earn it through the profile | No follow ask |
| Voice lists | six separate banned phrase lists; eight listed words not enforced; the guard only scans dated pack folders | One list in the settings file, one guard over all outward copy |
| Dashes | three regexes | One |
| Visual | app system (cream, ink, butter, Nunito) vs serif research card vs black and white paper with one yellow highlight vs motion engine ivory, navy and gold; two different "terracotta" values | Evidence posts: black and white paper, yellow highlight (evidence-reveal, 18 Nov); app and family posts: the app system |
| Newsletter | Sunday (running order) vs Thursday Substack (weekly-rhythm) vs 1,800 to 2,500 words (content-engine) vs 600 minimum (QA) | Addendum: Sunday edition, ready by Friday, 1,200 to 1,800 words, LinkedIn and Substack versions |
| Approval | Claude never posts (eight skills) vs automatic publishing approved for app safety week only (decisions) vs START HERE "never switch on" | Addendum: ChatGPT may schedule editorially cleared posts; automatic publishing off |
| Instagram and Facebook | required in every pack (24 Nov morning) vs declined in approved 059 and 061 | Brief: where appropriate, with a reason when left out |
| Voice of the family account | Natalia and Justin "we" vs Natalia vs Justin or the family | Needs Justin (founder decision) |

## Obsolete or stale

- Drive: Daily Content Operating System (October queue), Current LinkedIn
  Posting Pack (30 Sep), "Founder LinkedIn posts, CURRENT" (July), Social
  Billboard Current Posting Pack (Sep), the Approval Desk CURRENT (17 Nov, shows
  054 to 058 unposted), the queue manifest in Drive (19 Nov), the motion folder's
  own "00 START HERE" (18 Nov, a second START HERE), and several ZZ files whose
  titles still end in CURRENT.
- Repo: research-radar skill and its scheduled task still follow the 6 October
  analytics; linkedin-week and post-picker treat the 20 October file as the
  base; viral-post Part 8 (27 August, daily posting); weekly-rhythm and
  family-social point at a July calendar; evidence-reveal cites a decision of 18
  November that does not exist; `linkedin-schedule.json` last observed 12 Nov.
- Scheduled tasks: the daily radar prompt still carries the 17 to 19 November
  "five a run" note; the Friday review board failed on the usage limit on 20
  November; the switched off "Stage 3" task is correctly off.
- Paths named in instructions that do not exist: `research/01*` voice rules
  (named in CLAUDE.md, AGENTS.md, content-engine, qa.mjs), `docs/05`, `docs/07`,
  `schools/01`.
- Motion files in Drive's Metricool Ready Motion folder carry ChatGPT's
  provisional 064 to 066 numbers, which belong to other posts.
- An unrelated personal document sits in the ChatGPT folder.

## Manual steps today, and which can go

| Step | Can it go |
|---|---|
| Justin merges each radar PR | Yes, once the run can commit: an auto merge for register only PRs that pass the gate (needs his say) |
| Justin relays between ChatGPT and Claude | Yes: one stable manifest in Drive both read (stage 5) |
| Justin pastes Metricool lists back | Yes: ChatGPT writes a result file to the METRICOOL HANDOFF folder (stage 7) |
| Justin re-applies Drive patches | Yes, when the commit permission is fixed |
| Justin approves | Stays, by design, but scheduling of cleared posts is now ChatGPT's standing permission (addendum) |
| Justin posts | Stays while automatic publishing is off |
| Justin pastes analytics screenshots | Partly: Metricool analytics through ChatGPT (stage 9) |
| Native LinkedIn newsletter and Substack sending | Stays manual unless a tested route exists (stage 8) |

## Gaps

- Motion engine renders 1080 by 1350 only: no 9:16 Reel or landscape teaser;
  specs exist only for 055, 056, 057, 059 and 061; build needs a radar record.
- Newsletter: no script builds it; the running order is kept by hand.
- No daily founder report in one place (the addendum gives this to ChatGPT's
  14:30 task; Claude's runs must leave their status where it can read it).

## Fixed today

- START HERE no longer stops on an older date (PR 1702).
- START HERE is a Google Doc again, with the 062 and 063 handoff links filled
  in, after the 11:17 copy was saved as plain text, which ChatGPT's 11:00 task
  (searching for a Google Doc) would not find. Verified text identical.

## Founder decisions this audit needs

1. The scheduled radar's permission to commit (the classifier refusal).
2. Whose voice the family Instagram and Facebook account speaks in.
3. Whether register only radar PRs that pass the gate may merge on their own.
