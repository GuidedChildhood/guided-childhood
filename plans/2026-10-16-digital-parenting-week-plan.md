# UK Digital Parenting Week: two pieces for the Sunday batch

Review board task `digital-parenting-week-in-batch`, 16 October 2026. Plan and
drafts only. Nothing posted, nothing in Drive.

## 1. The date, checked

**Not confirmed on a primary source.** What was found:

- The organiser is Parent Zone (founded the week in 2020). Its own site has the
  2021 edition page (`parentzone.org.uk/article/digital-parenting-week-2021-whats-on`,
  11 to 15 October 2021, contact dpw@parentzone.org.uk) and nothing for 2026.
  The home page, the Be Internet Legends events page and a search of the site
  for 2026 dates all return no mention of the week this year.
- The only source for 26 to 30 October 2026 is two aggregators:
  `nationaltoday.com/digital-parenting-week/` and
  `daysoftheyear.com/days/digital-parenting-week/` (which says 26 to 30 October
  2026, 20 to 24 October 2025). Neither links an announcement. National Today
  itself says the timing alternates between the second and fourth week of
  October. 26 to 30 October is also the week the 2020 edition ran.
- A 2025 "Digital Parenting Week" from Parent Zone was not found. What ran on
  20 to 24 October 2025 was Parenting Week (Parentline NI, Children in Wales),
  a different campaign, which suggests the aggregators may be blending the two.
- A Parent Zone article of January 2026 (seen only as a search snippet, the page
  returned 403) says the VoiceBox report was published "to mark Digital
  Parenting Week", so the week still exists in some form.

**Decision:** treat 26 to 30 October as a likely week and not a fact. Neither
piece names the week, so neither can be wrong whichever dates are real. If
Parent Zone announces dates, the only change is an optional hashtag on the
Instagram caption. Before relying on the week for anything else (a newsletter,
an ad), ask Justin to look at Parent Zone's social channels or email
dpw@parentzone.org.uk, which this session could not do.

## 2. Where the two pieces sit

Week of Monday 26 October. The Sunday batch (25 October) builds that pack. The
drafts are already in the pack folder, numbered so Monday founder photo takes
slot 1 and Saturday happy news takes slot 4:

| Slot | Day | Piece | Lead | Franchise |
|---|---|---|---|---|
| 2 | Wednesday 28 October, 19:30 | AI companion: "Does a chatbot feel like a friend?" | Orbit | One study. Properly explained. |
| 3 | Friday 30 October, 19:30 | The ban is a start line | Nova | The ban, honestly |

Files: `content/packs/2026-10-26-social-week/2-wed-ai-companion.json` and
`3-fri-ban-start-line.json`. Both Instagram and Facebook, cards rendered clean
(`npm run social-week` rendered both, seven and six cards, nothing
overlapping; the generated `THIS-WEEK.md` was left out because a two post
version would mislead, the Sunday run writes the real one). The Sunday session
renumbers if it adds a Tuesday or Thursday post.

Wednesday is Research Wednesday (share line, concession, finding, tonight line,
question), so the AI piece takes it. Friday is Service Friday, which normally
names a service. The ban piece is a words piece with the stage check as its
only product claim, see section 4.

## 3. The two pieces

**AI companion.** Orbit owns AI and checking. Open on the question (Justin's own
account says question led posts beat number led ones six to one), concede first
that using a chatbot is not the worry, then the finding: of the UK 9 to 17 year
olds who use a chatbot, 35% say it is like talking to a friend, about half of
those the study counts as vulnerable. Honest reading: how it feels, not cause.
Tonight line: "Show me the best thing it has helped you with. Who do you tell
when something is really hard?" Not: "Stop talking to that thing." The action is
more reach to a person, never take it away (never allow or deny).

**The ban is a start line.** Nova, the ban as the cliff edge not the answer.
Concede that some parents will be relieved. State what the plan names and does
not (named apps, messaging left out, list not final). The group chat, the game
and the late night watching are still there. Then the words before it starts,
adapted from our own Stage 4 script, and the line for the workaround day. This
is deliberately a different angle from Wednesday 21 October's "does a school
phone ban fix it", which was about a study of school rules; this one is about
the national plan and what to say. Do not reuse that card's wording.

## 4. Proof paths, claim by claim

| Claim in the pieces | Proof |
|---|---|
| What stage is your child, three questions, no sign up, guidedchildhood.com/starter-pack | `app/(marketing)/starter-pack/page.tsx` (header comment: every advert says "Three questions. No sign up."). Domain `.com`, never `.co.uk`; PR 1313's `live-domain-guard` enforces it once merged, and the facebook captions here already use `.com`. |
| "Tick AI chatbots as your worry and the result gives you words for their age" | `lib/onboarding/worries.ts` line 51 (the AI chatbots tile) and line 97 (maps to `online_safety`); `app/(marketing)/starter-pack/ResultScreen.tsx` line 221 shows `stage.challengeActions[challenge]`; the `online_safety` lines per stage are in `lib/content/stages.ts`. Honest limit: the words are the open door lines, not an AI companion script. Nothing says otherwise. |
| The companion lesson exists for parents | `ai_lessons` row "AI companions and your child's heart" in `supabase/seed-ai-module.sql`, read at `/dashboard/ai-module`. Not claimed on the card (members only); available if Justin wants a first comment line. |
| 35%, about half, 1,000 UK children aged 9 to 17 | Internet Matters, Me, Myself and AI, July 2025. Also held as a row in `supabase/migrations/263_digi_situations_bank.sql` (line 88). Internet Matters' own page returned 403 to this session; the 64% and 35% came from its published summary through search and the vulnerable figures (71% use, 50% friend) from the SAN write up. **Needs the citation-verifier agent against the PDF before it ships.** The 35% is of chatbot users, stated so on the card and in the caption. |
| Ban announced, named platforms, WhatsApp left out, spring 2027 | UK government announcement of 15 June 2026 (Al Jazeera, `aljazeera.com/news/2026/6/15/britain-announces-sweeping-social-media-ban-for-under-16s`, with wire and Jurist coverage); matches `shared/social-media-law.ts`. Regulations not yet laid, list "still being set" says so on the card. Re check the status on Friday 30 October before it ships; a wrong date is the one way this piece goes stale. |
| The ban words | Our own words, adapted from `lib/content/stages.ts` `banWorld.script` (Stage 4). Not claimed to appear in the product. |

**A finding that changes what can be claimed.** `banWorld` in
`lib/content/stages.ts` (the Stage 4 "Ban Conversation" script and the workaround
actions) has no reader anywhere in the app. `plans/2026-09-06-situations-platform-map.md`
says the starter pack result and pathway read it; a search of every .ts and
.tsx file finds only its definition. So a post that said "it is in the stage
check" would be false. The Friday piece makes no such claim. The fix is small
and is worth its own task (render `banWorld` in `ResultScreen.tsx` and the
pathway page when `social_media_law` is on, and confirm
`NEXT_PUBLIC_SOCIAL_MEDIA_LAW` in production). Until then no post may say the
ban words live in the product. The same map notes Stage 4 copy never mentions
AI companions.

## 5. The checks run on the drafts

- Context routing read: THE-STORY sections 1, 2 and 10, social-week skill,
  `hidden-thread.md`, `linkedin-engagement.md`, `weekly-rhythm.md`,
  `GDC_SOCIAL_VISUAL_SYSTEM.md`.
- Hidden thread: the AI piece carries the vulnerable tail brick (the child most
  likely to lean on a chatbot is the one with fewer people), the ban piece
  carries proportionality (a ban removes the visible thing and leaves the
  pressure). Neither states the thesis. Neither is the one in ten post.
- Mechanism not mandate test: no hook that frightens, no platform as villain
  (named once as a list, then the camera turns to the child), the answer is
  more preparation and not less contact, the evidence limits are stated (a
  survey, association not cause), the reader ends with words to say.
- Never allow or deny: both end on a pathway (a question, a next step).
- Instagram caption has no link, Facebook caption has the `.com` link, no
  dashes, UK English, ends on a question then the stage check line.
- `npm run ai-tells` run: see the PR body for the result.

## 6. What Justin needs to do

1. Check Parent Zone's channels for the real 2026 dates (or confirm 26 to 30
   October from anywhere he trusts). Optional hashtag only.
2. Let the Sunday session run the citation-verifier on the Internet Matters
   figures, and re check the ban status on the day.
3. Decide whether to open a task for the unwired `banWorld`.
4. Apple and Bark are logged in `briefings/notes/competitor-sightings.md`
   (16 October entry). Neither does our core loop; the one idea worth a later
   look is Bark's private then reveal weekly family question.
