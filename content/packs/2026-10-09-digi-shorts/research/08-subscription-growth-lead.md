# The DiGi launch series: what converts parents, how many videos, and how to measure it

Subscription growth lead, 9 October 2026. Briefed from THE-STORY.md; funnel facts checked in the code on this branch and on origin/main.

## 0. The short answer

* **Make nine videos, not one.** That is one hero film and eight shorts, released in two waves.
  * Wave 1 is five videos: the hero recut, three problem shorts, and the star quest and timer short.
  * Wave 2 is four videos: two more problem shorts, a founder short and a proof short.
* **Why a series beats a single hero:**
  * Meta says creative diversification is now "the best lever to find the most relevant audiences" (Meta for Business, 22 April 2025).
  * Meta's Reels guide asks for one key concept per video (as reported by Website Builder Expert, July 2025).
  * A YouTube study run by Ipsos found sequenced, linked creative beats repeating one asset (Ipsos for YouTube, 2019).
  * Each problem short maps to one of the nine worry tiles in the stage check. The viewer taps the worry the video showed, and the result screen answers it with "what you can do tonight".
* **Problem shorts reach. The hero converts the warm.** Cold viewers decide in seconds:
  * TikTok: put the proposition in the first 3 seconds and the hook in the first 6 (TikTok Help Center, June 2025).
  * Google: attract within 5 seconds (ABCDs).
  * The 103 second film is the right asset for YouTube, LinkedIn, the website and retargeting. It is not the right first touch on Reels or TikTok.
* **Measuring stage check starts per thousand views is impossible today.** The code never counts a start. A lead is saved only once an email exists, and no new parent has one until the end of the flow. There is no analytics, no pixel and no source tag. The 30 October review in the launch plan asks for "starts to completions", which nothing can currently answer. The fix is small and reuses the existing `/s/<code>` school link pattern (section 9).
* **Paid cannot carry 8,000 stage checks inside the £1,000 cap.** On illustrative assumptions, £1,000 buys roughly 370 to 700 starts (section 9). Organic reach, sharing and Justin's LinkedIn must carry the bulk. Paid amplifies a proven short, as the money rule already says.

## 1. What the code says (facts the plan must respect)

| Fact | Where | Why it matters for video |
|:--|:--|:--|
| "No sign up" is true: the questions come first, then the result, and the account comes last (changed 10 September 2026) | `app/(marketing)/starter-pack/page.tsx`, header comment and `Step` type `intro, q1, q2, q4, reassure, result, account` | The house CTA can run in paid ads without breaching CAP 3.9 or 3.24 |
| The result answers every ticked worry with "what you can do tonight" | `ResultScreen.tsx` lines 221 and 442 (`WorryAnswers ... tonight={action}`) | Problem shorts keep the promise they make |
| The nine worry tiles: Coming off screens, Bedtime screens, Mood after screens, Controller fights, Morning TV, Asking for a phone, Social media, AI chatbots, What they come across online | `lib/onboarding/worries.ts` lines 44 to 52 | The top five problem shorts should be named in these exact words |
| No start event. `captureLead` returns at once when there is no email, which is the normal case for a new parent | `page.tsx` around line 384; `app/api/starter/lead/route.ts` | Starts and completions are invisible |
| `starter_leads.source` exists, but it tags the magnet type, not the channel or the video | `supabase/migrations/062_lead_source.sql` | It cannot tell one video from another |
| No web analytics, no Meta or TikTok pixel, no UTM handling | grep of `app`, `lib`, `components`, `package.json` | Retargeting can only use on-platform audiences, such as people who watched a video |
| A source link pattern already exists: `/s/<code>` sets a cookie, the stage check names the school, and the trial grant tags `profiles.school_link` once | commit a5dee77b, `app/api/school-link/route.ts`, migration 353 | The template for per-video links |
| Star quest facts hold: 5 minutes a star by default (`NEXT_PUBLIC_STAR_MINUTES`), a per-child rate (migration 225), a weekly cap by age band (`weeklyStarCap`), core daily minutes, protected bedtime, meals and school, and a start inside protected time becomes an ask | `lib/quests/templates.ts` line 25, `lib/quests/time-tiers.ts` lines 1 to 33, `lib/quests/bank.ts` | Every line in the timer short has a proof path |
| Budget: £0 until 30 October, then at most £100 on a post that already moved stage checks; creators not before December; £1,000 cap | `plans/week-of-2026-09-28-marketing-launch-plan.md` sections 1 and 10 | The series has to work organically first |
| Scene 6 of the film names four researchers. The brief says "attribution of published work, not endorsement", but no frame says so on screen | `videos/2026-10-08-digi-launch/BRIEF.md` line 110; grep of `index.html` | Paid cuts need the line on screen (section 10) |

Two older parent quotes need correcting:

* THE-STORY cites "It's utterly miserable constantly policing screen time." The quote is real, but it is on page 3 of the thread, not page 1. The link should carry `?page=3` (section 11).
* The Qustodio line "This was a huge waste of money time and energy." was **not** on the US App Store reviews page when I opened it today. Treat it as unverified until it is reopened at its original source.

## 2. What converts parents: the evidence, graded

| Format | Best evidence found | Strength | What it means for us |
|:--|:--|:--|:--|
| **Problem and solution demo on real app UI** | Liftoff found walkthroughs that show "clean app UI" are consistent performers, and "showing off your app UI before they install gives your audience a head start" (Liftoff, 2025 Mobile Ad Creative Index highlights, 21 August 2025). TikTok's conversion analysis found on-screen text in the first 7 seconds gave +43% conversion lift, and an on-screen offer or CTA in captions gave +80% (TikTok for Business, 21 December 2021) | Vendor and platform data, correlational | The spine of every short is the parent's moment, the real DiGi answer, then the result, with the text zoomed in, as Justin asked |
| **Founder story** | Good Inside grew from Dr Becky Kennedy's "bare bones" Instagram videos, for example a three minute video on "how to get your kid to stay in their bed". She has 3.4m followers, the platform passed 100,000 subscribers in Q3 2025, members pay $23.25 to $28 a month, and revenue was $34m, up nearly 50% (Fortune, 27 February 2026). Founders as endorsers were "more effective for new products" in a print experiment that measured brand attitude, not sales (Agnihotri and Bhattacharya, Journal of Advertising Research 59(3), 2019). Agency claims of 31 to 44% lower cost per acquisition for founder ads are unverified vendor data, so I left them out | Case plus one lab study | The founder short runs on LinkedIn, Justin's proven channel, and on Reels. Good Inside is the closest model: one concrete moment, the words to use, from a named person |
| **UGC style** | Advertisers who added UGC raised impression to install conversion by 152% on average (Liftoff, 21 August 2025, app installs, sample not stated). Meta's Reels guide cites survey figures, for example 53% "more likely to buy an item promoted by a creator", with no method published (reported July 2025) | Vendor, installs not subscriptions | We have no customers yet, so "UGC style" at launch means phone-shot founder footage and real screen footage. It never means an actor or an AI avatar playing a customer (section 10). Real creators come in December, on genuine use, labelled as ads |
| **Proof** | No testimonials exist and none may be made. CAP 3.47 requires documentary evidence that any testimonial is genuine. CAP 3.44 bans fake reviews (in force since 6 April 2025 under the DMCC Act) | Rule, not evidence | Proof is the product shown working, the 142 sourced findings with human approval, and "how did that go?" coming back days later. These are claims with a proof path in the code |
| **Voiceover** | A human voiceover with a written offer gave +87% conversion lift on TikTok, but "this result did not hold for Europe and Brazil" (TikTok, December 2021). Google says sound "has been shown to increase conversions by over 20%" on Shorts, without citing a study (Google Ads Help) | Mixed, and weak for the UK | Captions always carry the message. Voice is optional, so do not spend effort on it for TikTok |
| **Retention beats acquisition** | Duolingo's growth came mainly from current user retention, which had about 5x the daily active user impact of the next lever, with only "a little bit" spent on paid acquisition (Jorge Mazal, Lenny's Newsletter, 28 February 2023) | Strong case | Judge each video by trials, paid conversions and week two return, not by stage check starts alone |

I found no sourced data on Calm's or Headspace's video creative in this pass, so I have not cited them.

## 3. Length and format by placement

| Placement | What the platform or best source says | Our cut |
|:--|:--|:--|
| Meta Reels and Stories | 9:16, keep text and CTA in the safe zone, "one key concept per video" (Meta Reels guide, July 2025, as reported). Third-party guides say 15 to 30 seconds, which is not Meta's figure | 9:16, 20 to 35 seconds, plus a 15 second retargeting cut |
| Meta Feed | 4:5, 1440 x 1800; captions and sound "optional, but recommended" (Meta Ads Guide) | 4:5 version of each short, captions burnt in |
| TikTok in-feed | Ads of 21 to 34 seconds got "a 280% lift in conversion" against videos outside that window (TikTok, 21 December 2021). Proposition within 3 seconds, hook within 6 seconds, 9:16, use sound (TikTok Help Center, June 2025) | 21 to 34 seconds |
| YouTube Shorts | "For action-oriented ads, use 10-30 second vertical videos"; under 60 seconds; 9:16 is best (Google Ads Help, 2025) | Same shorts, 9:16 |
| YouTube organic and in-stream | ABCDs: Attract within the first 5 seconds; branding early lifts recall but also lifts skipping (Google with Ipsos, Kantar, Nielsen) | Full hero, 103 seconds, 16:9 |
| LinkedIn | "7–15 second videos seeing up to a 300% lift in completion rates" (LinkedIn data, 2025). "Test longer videos for demand generation". Much viewing is sound off, so burn in subtitles (LinkedIn Business) | Justin's founder short, 30 to 45 seconds, plus the hero for his posts |
| Instagram organic | "The top three signals... are watch time, likes and sends" (Adam Mosseri, reported 22 January 2025) | Build a sendable moment into each short, for example the words a parent forwards to whoever does bedtime |

Where parents are: Facebook and Messenger reached 93% of UK online adults, YouTube 94% and TikTok 56% in May 2025. Facebook leans to users aged 35 and over (Ofcom Online Nation 2025, published 10 December 2025, via ISPreview). For a parent of a primary age child, Facebook and Instagram are the paid home. TikTok is organic and secondary.

## 4. One hero film or a hook series

* **Hero only fails for three reasons:**
  * It gives the delivery system one concept and one opening.
  * It tells us nothing about which problem pulls.
  * Its cold open has to win the first 3 seconds for every parent, whatever their worry.
* **Evidence for a series:**
  * Meta's diversification guidance asks for "different themes, messages, and visuals" and gives no number (22 April 2025).
  * Ipsos for YouTube: "advertising is more effective when creative assets are linked and delivered in sequence" (2019). A figure of "67% higher purchase intent" for different creative is widely quoted, but I could not open the Ipsos PDF to confirm it, so do not use it.
* **How many:** Meta gives no count. One agency's rule of thumb for small advertisers is 3 to 5 genuinely different concepts (Excite Media), which is vendor opinion. Nine videos in total, with five problem concepts, sits there. Each later variant changes only the first 3 seconds of a winner, which is the cheapest diversification there is.

## 5. The series: nine videos, their jobs, in order

Every short follows one template, so the HyperFrames build is mostly reuse:

1. **0 to 2 seconds:** the moment in big text over the real app, with the clay star reacting.
2. **2 to 6 seconds:** the ask typed into DiGi, zoomed.
3. **6 to 10 seconds:** the real thinking lines from `ThinkingReassurance.tsx`.
4. **10 to 22 seconds:** the one thing to do and the words to say, on the script card.
5. **22 to 28 seconds:** what happens next: the pathway tile, the check in face, and "How did that go?" two days later.
6. **28 to 33 seconds:** the end card. "What stage is your child? Three questions, no sign up." with guidedchildhood.com/starter-pack.

Label the scenario on screen: "Example family. Real app screens." Do not say "real conversation", because the screens were rendered from the components with made up data.

| # | Video | Job | Length and format | Where | When |
|:--|:--|:--|:--|:--|:--|
| 1 | **Hero recut** (103 seconds, with Justin's notes: zoomed text, real thinking lines, the pathway as in the app, the clay star, a home page backdrop) | Explain the whole loop to people who already care; landing page and retargeting | 103s 16:9; a 60s 4:5 cut | YouTube, LinkedIn, website, retargeting | Wave 1, day 1 |
| 2 | **Problem short 1:** the top worry from the panel | Cold reach; test hook one | 21 to 34s, 9:16 and 4:5 | Reels, TikTok, Shorts, Facebook | Wave 1, day 1 |
| 3 | **Problem short 2** | Cold reach; hook two | same | same | day 3 |
| 4 | **Problem short 3** | Cold reach; hook three | same | same | day 5 |
| 5 | **Star quest and timer** (the new video Justin asked for): jobs earn stars, 5 minutes a star by default, a weekly cap, protected time no stars can buy, a start inside it goes to the parent as an ask | The differentiator no competitor has; the second touch for people who watched a problem short | 30 to 45s 9:16, plus a 15s cut | Reels, TikTok, retargeting | day 7 |
| 6 | **Problem short 4** | Reach; uses what waves 1 to 3 taught | 21 to 34s | same | Wave 2, week 2 |
| 7 | **Problem short 5** | Reach | same | same | week 2 |
| 8 | **Founder short:** Justin on camera, one GREEN scene from founder-context.md | Trust; LinkedIn native | 30 to 45s, 4:5 or 9:16 | LinkedIn, Reels | week 2 |
| 9 | **Proof short:** "Where every answer comes from": 142 findings, each with a named source, approved by a human; researchers named as published work only | Answer "is this just ChatGPT?"; retargeting | 20 to 30s | retargeting, LinkedIn | week 3 |

Rank the five problems with our own data as well as forum research. `starter_leads.answers` already holds which worry tiles real parents ticked. A count of those picks, aggregated with no personal data, is first party evidence of the top problems. I did not run that query; it should go to whoever owns the panel synthesis.

## 6. Retargeting sequence (once the money rule allows)

Because there is no pixel, the first sequence uses only on-platform video audiences. Meta's video audiences split by watch depth: 3 second, ThruPlay, 25, 50, 75 and 95 percent. I could not open Meta's own page to confirm the maximum retention window, so read it off the Ads Manager dropdown.

1. **Cold:** problem shorts 2 to 4, broad audience, with the creative doing the targeting.
2. **Watched 50% or more of any problem short, in the last 7 days:** the star quest short (15s cut), then the hero 60s cut.
3. **Watched 50% or more of the hero or the star quest short, in the last 14 days:** the proof short, then the founder short.
4. **Last touch, 14 to 30 days:** the founder offer as a plain line.
   * Draft: "Four days free, then £7.99 a month, held for the first 50 families."
   * Only while seats remain. Stop the ad the day the cap is reached (CAP 3.9, significant limitations).

Excluding people who already started the stage check needs a site signal. That means a pixel or the Conversions API, which needs PECR consent: the ICO says non-essential cookies cannot be set "before the user has consented". At £100, accept some wasted impressions rather than build consent machinery.

## 7. CTA wording

* **Keep the house line word for word:** "What stage is your child? Three questions, no sign up."
  * It is true in the code.
  * It is free under CAP 3.23.
  * It promises something the landing page delivers.
  * TikTok found CTAs in text gave a +152% conversion lift (December 2021, correlational).
* **Button:** pick the platform button that does not contradict the line. Avoid "Sign up" and "Subscribe". "Learn more" is the safe default.
* **Per-problem cards can say:** "Bedtime screens? Find your child's stage. Three questions, no sign up." This is honest because the result answers that worry tonight.
* **Never say** "fix", "stop the fights", "get your child off screens" or anything that promises an outcome for a child.
* **Hooks:** do not assert or imply a child's mental health condition ("Is your child addicted?"). Meta's Advertising Standards include a personal attributes rule, but I could not open the page in this pass, so check hooks against it in Ads Manager.

## 8. Benchmarks: what exists and what does not

**I found no public UK parenting benchmark for CTR, CPM or view through.** The nearest proxies, all directional:

* **Facebook, Great Britain, all industries:**
  * Median CPM about 17.38 in an unlabelled currency, probably US dollars.
  * Median CTR about 1.59%, against a 2.04% global baseline.
  * Period roughly July 2025 to July 2026; Superads dataset of $3B spend; the CTR definition is not stated.
* **Facebook, education, US:**
  * 1.45% CTR on traffic campaigns and 1.86% on lead campaigns, against 1.71% and 2.59% across all industries.
  * Source: WordStream/LocaliQ 2025, April 2024 to June 2025, US only. I took these figures from search summaries and did not open the report, which is behind a form.
* **TikTok, UK:** CPM £3 to £12, broad targeting £3 to £5. This is an agency estimate (Nonsensical, 2026), not platform data.
* **LinkedIn completion:** under 15s 35 to 45%; 15 to 30s 25 to 35%; 30 to 60s 15 to 25% (Zenabm, method not disclosed).
* **Hosted video:** videos under a minute average 52% engagement, meaning half the length watched (Wistia, 13m videos, July 2025).
* **Quiz funnels:** 40.1% of quiz starters become leads and 65% finish (Interact, its own portfolio, page updated 8 September 2026). We have no email gate at the start, so expect higher.
* **Funnel context:** trials of four days or less convert at a median 25.5%, against 42.5% for 17 days or more. On monthly plans the figures are 39.6% for four days or less and 45.9% for 5 to 9 days. RevenueCat calls this "a correlational pattern, and a flattering one" (State of Subscription Apps 2026, blog of 28 September 2026). Park this; the four day trial was a deliberate decision (commit b1e0275d).

## 9. Measuring stage check starts per thousand views

**Definition.** Starts per 1,000 views = parents who answer question one from a tagged source, divided by platform views in the 7 days after posting, times 1,000. Track three more ratios per video beneath it: completions over starts, accounts over completions, and paid over accounts. Use "stage check" in the 4% model to mean a completed result, and treat starts as the leading signal.

**The build, small and on the existing pattern:**

1. **Per-video links:**
   * Either `guidedchildhood.com/starter-pack?src=ps1-ig`, or a `/v/<code>` redirect modelled on `/s/<code>`.
   * One code per video and platform, used in the bio link, Stories link sticker, LinkedIn first comment and ad URLs.
2. **Anonymous counts:**
   * Post `{src, step}` once at question one and once at the result.
   * Store daily counts per code only: no email, no IP, nothing new stored on the device.
   * The code rides in the existing flow state.
3. **Trials and paid per video:** tag the profile at account creation, exactly as `profiles.school_link` is tagged at the trial grant.
4. **Migration number:** if this needs one, claim it per CLAUDE.md before building.

From the platforms, log views, 3 second views over impressions (the hook rate), average percent watched, link taps, and Instagram sends per reach.

**Decision rules:**

* Compare two shorts only once each has at least 20 starts. At that count the noise is still about ±45% (Poisson, my arithmetic).
* The £100 goes to the short with the highest starts per 1,000 views whose completion rate is not below the median.
* A short under half the median after 3,000 views gets a new first 3 seconds, not a new film.
* Expect untagged visits from people who type the address. Keep the sheet's spike method as the cross-check.

**Illustrative model.** These are assumptions, not benchmarks.

| Organic tap rate per view | Start rate after landing | Starts per 1,000 views | Views needed for 8,000 starts |
|:--|:--|:--|:--|
| 0.2% | 70% | 1.4 | about 5.7m |
| 0.5% | 70% | 3.5 | about 2.3m |
| 1.0% | 70% | 7.0 | about 1.1m |

Paid, assuming a £15 CPM, 0.8% to 1.5% link CTR and a 70% start rate:

* Cost per start is £2.68 to £1.43, which is 5.6 to 10.5 starts per 1,000 impressions.
* At 4% to paid, that is about £67 to £36 per paying family.
* £100 buys about 37 to 70 starts.
* £1,000 buys about 370 to 700 starts.

## 10. Rules the creative must follow

* **No synthetic or acted customers.**
  * CAP 2.3: ads "must not falsely claim or imply that the marketer is acting as a consumer".
  * CAP 3.47: testimonials need documentary evidence that they are genuine.
  * The ASA said on 11 June 2026 that the Code is "media-neutral", and that a realistic AI-generated endorsement is "likely breaching the Code".
  * TikTok requires a disclosure label on realistic AI content in ads (agency reports of a July 2026 update; I did not open TikTok's policy page).
* **The clay DiGi star is plainly a character, so it is fine.** Scenario families stay labelled as examples.
* **Researchers on screen:** add "Their published research, not an endorsement." to the paid cuts of the hero and the proof short.
* **Prices and trials:** state the commitment (CAP 3.24) and significant limitations (CAP 3.9) wherever a price appears.
* **Parent quotes in paid ads:** the quotes below are anonymous forum posts. Use them in organic posts with the link in the caption. For paid, either get permission or write the line as an example and label it.

## 11. Verified parent lines for hooks (opened today; under 25 words)

* "It's utterly miserable constantly policing screen time." (Mumsnet, AIBU, page 3) https://www.mumsnet.com/talk/am_i_being_unreasonable/5046965-me-and-13-yr-old-the-constant-awful-battle-over-screen-time?page=3
* "I actually just hate family life at moment as it revolves around all this" (Mumsnet, the original post, page 1) https://www.mumsnet.com/talk/am_i_being_unreasonable/5046965-me-and-13-yr-old-the-constant-awful-battle-over-screen-time
* "Wish I never gave her one as her behaviour has been a million times worse since she's had it." (Mumsnet Teenagers) https://www.mumsnet.com/talk/teenagers/4645906-i-have-taken-the-smartphone-away
* "My kid found it within 30 seconds of the first time he got on his computer and immediately uninstalled it." (Qustodio, US App Store review titled "Good in theory, poor in execution") https://apps.apple.com/us/app/qustodio-parental-control-app/id1501720596?see-all=reviews
* What parents say they pay for, from a competitor's reviews: one five star review (paraphrased; the copy guard bans its opening phrase) calls the app transformative "for busy, exhausted, and overwhelmed parents." (Good Inside, US App Store) https://apps.apple.com/us/app/good-inside-parenting/id6463803046?see-all=reviews

## 12. What I could not verify

The shared web search budget ran out partway through. These items are open:

* Meta's personal attributes policy page and the maximum retention window for video audiences: both pages failed to open.
* The Ipsos "67%" figure: the PDF would not parse.
* The primary source for Meta's "19% lower CPA" partnership ads figure: none found.
* TikTok's bio link eligibility.
* Instagram trial reels.
* Changes to the UK analytics cookie exemption under the Data (Use and Access) Act 2025.
* Any UK parenting-specific CTR, CPM or view through benchmark: none found.
* Spark Ads: TikTok's own figures (+30% completion, +43% conversion rate, against non-Spark in-feed ads) come from 2020 to 2021 data (Creative Center playbook, March 2024). Treat them as dated.

## Sources

* Meta, The creative advantage (22 April 2025): https://www.facebook.com/business/news/the-creative-advantage-unlocking-the-power-of-diversification-with-meta-andromeda
* Meta Engineering, Andromeda (2 December 2024): https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/
* Meta Reels guide, as reported (15 July 2025): https://www.websitebuilderexpert.com/news/meta-updates-reels-ads-guide/
* Meta Ads Guide, video: https://www.facebook.com/business/ads-guide/update/video
* TikTok, creative that drives conversions (21 December 2021): https://ads.tiktok.com/business/en/blog/creative-that-drives-conversions
* TikTok, creative best practices (June 2025): https://ads.tiktok.com/help/article/creative-best-practices
* TikTok, Spark Ads playbook: https://ads.tiktok.com/business/creativecenter/quicktok/online/Spark-Ads-Creative-Playbook/pc/en
* Google Ads Help, Shorts ads: https://support.google.com/google-ads/answer/16041697?hl=en
* Google ABCDs: https://business.google.com/us/think/future-of-marketing/youtube-video-ad-creative/
* Ipsos for YouTube, sequencing (2019): https://www.ipsos.com/en-us/node/507601
* LinkedIn video ad tips: https://business.linkedin.com/advertise/ads/sponsored-content/video-ads/tips
* Mosseri, ranking signals (22 January 2025): https://www.socialmediatoday.com/news/instagram-shares-algorithm-insights-2025/738034/
* Ofcom Online Nation 2025, via ISPreview (10 December 2025): https://www.ispreview.co.uk/index.php/2025/12/ofcom-finds-uk-adults-now-spend-over-4-5-hours-online-each-day.html
* Liftoff 2025 creative index highlights: https://www.liftoff.ai/blog/highlights-2025-mobile-ad-creative-index/
* Fortune on Good Inside (27 February 2026): https://fortune.com/2026/02/27/dr-becky-kennedy-good-inside-revenue-leadership-playbook-for-parenting-34-million-a-year-business/
* Journal of Advertising Research (2019): https://thearf.org/access-knowledge-2/publications/journal-of-advertising-research/the-relative-effectiveness-of-endorsers-the-identity-badge-of-ceos-and-founders-versus-the-attractiveness-of-celebrities
* Lenny's Newsletter on Duolingo (28 February 2023): https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth
* RevenueCat, free trial length (28 September 2026): https://www.revenuecat.com/blog/growth/free-trial-length
* Superads, Great Britain CPM: https://www.superads.ai/facebook-ads-costs/cpm-cost-per-mille/united-kingdom
* Superads, Great Britain CTR: https://www.superads.ai/facebook-ads-costs/ctr-click-through-rate/united-kingdom
* Superads, education CTR: https://www.superads.ai/facebook-ads-costs/ctr-click-through-rate/education
* WordStream/LocaliQ Facebook benchmarks: https://localiq.com/blog/facebook-advertising-benchmarks/
* Nonsensical, UK TikTok costs: https://nonsensical.agency/?p=5515
* Zenabm, LinkedIn video benchmarks: https://zenabm.com/blog/linkedin-video-ads-benchmarks
* Wistia, optimal video length: https://wistia.com/learn/marketing/optimal-video-length
* Interact, quiz conversion report: https://www.tryinteract.com/blog/quiz-conversion-rate-report/
* Excite Media, creative diversification: https://www.excitemedia.com.au/meta-creative-diversification/
* CAP Code section 3: https://www.asa.org.uk/type/non_broadcast/code_section/03.html
* ASA, testimonials and endorsements: https://www.asa.org.uk/advice-online/testimonials-and-endorsements.html
* ASA, fake consumer reviews: https://www.asa.org.uk/advice-online/fake-consumer-reviews.html
* ASA, AI and deepfakes (11 June 2026): https://www.asa.org.uk/news/ai-and-deepfakes-four-things-advertisers-need-to-know-before-they-hit-run.html
* TikTok AI ad disclosure, agency report: https://www.stellarsearch.co.uk/insight/tiktoks-ai-ad-disclosure-rules-are-live-what-brands-running-ai-creative-need-to-do-now
* ICO, cookies under PECR: https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/

Repo files this rests on:

* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/app/(marketing)/starter-pack/page.tsx
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/app/(marketing)/starter-pack/ResultScreen.tsx
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/app/api/starter/lead/route.ts
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/app/api/school-link/route.ts
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/lib/onboarding/worries.ts
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/lib/quests/time-tiers.ts
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/lib/quests/templates.ts
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/supabase/migrations/062_lead_source.sql
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/plans/week-of-2026-09-28-marketing-launch-plan.md
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/videos/2026-10-08-digi-launch/BRIEF.md
* /Users/justinphillips/guided-childhood/.claude/worktrees/amazing-khorana-116a1e/research/homepage-audience-language.md