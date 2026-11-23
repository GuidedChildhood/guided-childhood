# Hints, not answers, and the study that went the other way (radar, 23 November 2026)

Posts GDC 065 and GDC 066. Drafts. Justin approves and posts; nothing here is scheduled.

## The two findings

**1. Stanford SCALE, "The Evidence Base on AI in K-12: A 2026 Review", updated November 2026** (landing page dated 10 November). Walker, Fesler, Martinez Claeys, Agnew, Loeb. Read in full from the PDF, 23 pages.

> **The finding.** Across 52 controlled studies (randomised trials and quasi experiments), "AI appears to be better for learning when students use it for learning support than when they use it for producing work, although neither type of use consistently improves learning." No pooled effect size and no interval: it is a narrative review, and we say so.
> **What it means for a parent.** Letting the chatbot do the homework tends to cost something later. Using it to understand is the better bet, and still only a bet.
> **What we already built that answers it.** The child's homework hint card, `app/api/kid/homework-help/route.ts` and `components/kid/HomeworkHelp.tsx`: three hints in order (a nudge, the method, a worked example on a different question), the answer held back by the prompt rails at lines 157 to 161, ages 10 and over, 12 hints a day. Lessons `ks3-24-is-it-doing-my-thinking` and `ks2-25-stay-the-maker`.
> **What it would take to answer it better.** Small. See the product findings below.

**2. RAND, "Higher-Income Parents Use AI More and Encourage Their Children to Do the Same", RR-A4742-5, 12 November 2026.** Schwartz and Diliberti. Read in full from the PDF.

> **The finding.** In May 2026, 20 percent of about 1,000 US parents of teenagers had not talked with their child about AI for schoolwork, 24 percent discouraged all use and 56 percent encouraged it to some degree; 49 percent of about 1,800 teenagers aged 12 to 18 reported using AI for homework, up from 40 percent in May 2025. Survey percentages, no intervals published, and the year on year change was not significance tested.
> **What it means for a parent.** About half of teenagers are using it and one parent in five has not said a word about it.
> **What we already built that answers it.** The free script "Ask the AI together, hints not answers", `supabase/migrations/261_situations_scripts.sql` lines 78 to 92, builder stage, category `school-and-ai`. The `ai_chatbots` worry tile on the stage check, `lib/content/proof.ts` lines 186 to 195.
> **What it would take to answer it better.** Small. A script for 13 to 15 ("you used it anyway"), and an AI line on the Homework and school tile.

## Verified figures (citation-verifier, against the PDF text, 23 November)

22 claims checked: 16 confirmed, 6 corrected, none dropped. Only these may be used.

Stanford:
- 52 causal papers, up from 20 in March, 32 added (28 student facing, 4 educator facing). Drawn from papers published October 2025 to June 2026 plus a small number published after.
- The two verbatim sentences: the one quoted above, and "Using AI to outsource academic work can reduce students' performance when they later work without AI."
- Bastani et al. 2025 (PNAS): Turkish high school students with a general purpose chatbot did worse on an exam than those with a hint based tutor that used teacher provided guidance and withheld answers.
- Cao et al. 2026 (preprint): 199 US college students recruited online. Those given the correct answer and an explanation at once did better than those whose chatbot gave encouragement and hints first. Both arms were AI feedback, and the hint arm revealed the answer in the end.
- Oreopoulos et al. 2026 (working paper): 6,997 US pupils in grades 6 to 8, 20 schools. No statistically significant overall improvement on the delayed assessment.
- Five of the new student studies were in US K-12 settings; most new papers are postsecondary. "The evidence base still does not show whether AI tools can produce long-term learning gains."
- Funders listed: Walton Family Foundation, Overdeck Family Foundation, Google.org.

RAND:
- Parents using AI: 54 percent (February 2025, n = 984) to 72 percent (May 2026, n = 1,000).
- Teens using AI for homework: 40 to 49 percent (n = 1,890 and 1,810), ages 12 to 18, only 10 percent aged 12.
- 56, 24, 20 as above.
- Matched sample, 533 teens to 427 parents, unweighted, "readers should not infer that these results generalize to all U.S. families": 81 percent of those who felt encouraged used AI for homework, 38 percent of those who felt discouraged.
- "parents likely need to be much more explicit for their messages to get through to their teens."
- Sponsored by the Gates Foundation.

## Gate results

- **Odgers test.** Passes narrowed. The Stanford review is mostly university students and we say so before any finding. RAND is a US cross sectional survey, so nothing about what a parent's words cause.
- **Proportionality.** Passes. No platform is the villain. The subject is how a tool is used and whether a parent has spoken.
- **Repetition.** Not argued in the last eight weeks. The 26 October pack mentioned the hint card in one line while arguing about chatbot safeguards.
- **The inconvenient finding goes first.** Our hint card and our script rest on Bastani. The same review now carries Cao, where answers beat hints. Post 1 opens on that.

## Product findings, separate from content (Justin to decide)

1. **The script overstates its evidence.** Script 261's "why it works" gives Bastani's 17 percent and 127 percent as the reason for the rule, as settled. So does the knowledge row in migration 263. With Cao in the review, that paragraph should say one trial, and that a later one disagreed. Small: one migration (next free number to be claimed, main is at 403).
2. **"Still stuck? Another hint" is one tap.** Nothing asks the child to have a go between hints (`HomeworkHelp.tsx` line 197). Small.
3. **A parent cannot see hint card use.** Only a daily count is stored and nothing reads it. Already in THE-STORY.md open work.
4. **The answer is withheld by a prompt rule, with no check on the output.** Fine to describe as "held back", never as "cannot".

## Spine and order

1. LinkedIn post 1, GDC 065: the review, and the study that cuts against our own card.
2. LinkedIn post 2, GDC 066: the parent who has said nothing. At least two days after post 1.
3. Facebook and Instagram, family voice, no figures in the body.
4. Substack, the long version.
5. Mumsnet or Reddit, research only.

**On the opening.** The routine brief says to open on the question we cannot answer. That rule was superseded in `linkedin-engagement.md` on 20 October and again by `content/analytics/linkedin-7-days-2026-11-11.md`: the named body and its finding in one complete sentence opens, the uncertainty goes second, the question goes last. Both posts follow the newer file. Children and AI is still the live lane.

## Must never say

- That AI harms children's learning, or that Stanford found it does. Most samples are university students.
- That hints beat answers. The review files that pair under conflicting.
- "3.2 million students", "a significant rise", or any figure not listed above.
- Any causal verb for the RAND parent finding: drives, shapes, makes, because.
- 81 or 38 percent without "small, unweighted, not representative".
- That any of this is UK data. None of it is.
- Children, tweens or primary age for either source. RAND is 12 to 18. Stanford's youngest are grade 5 to 8.
- That the hint card cannot give the answer, makes the child try first, or that a parent can see what was asked.
- That our approach is proven to improve learning. Never an outcome for a child.
- That a child chats with DiGi. One fixed card, no follow up box.
