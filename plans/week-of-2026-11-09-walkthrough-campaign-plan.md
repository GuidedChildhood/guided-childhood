# The walkthrough: 20 posts, three platforms, one goal

Written 10 November 2026, marketing lane, PR 1475 (1471 was the claim and was merged empty). **Drafts only.** Nothing is
posted, scheduled or spent until Justin says yes in chat.

Justin's ask: "A walkthrough of platforms, a series of 20 posts explaining each
service benefit, eg moments, scripts, DiGi, school reminders, crafts, every
service and benefit, walkthroughs that are engaging with goal of free sign ups."

The drafts are in `content/campaigns/platform-walkthrough/`, one file per post.
Posts 1 to 3 are built, one per format and one per brand, so the look can be
judged before the other 17 are made.

---

## 1. The strategy, and why this one

**The spine is the sideways launch sequence** (Jeff Walker's Product Launch
Formula, the most copied launch structure there is): give away the useful
content first, in a numbered run, and let the run do the selling. It has three
movements and so does this campaign.

| Movement | Launch formula name | Here |
|---|---|---|
| Posts 1 to 3 | The opportunity | One opening post per platform. The problem in the audience's own words, and the whole answer in thirty seconds |
| Posts 4 to 19 | The transformation and the ownership experience | One service a post, shown on the real screen, so the reader feels what owning it is like before they have it |
| Post 20 | The open door | The recap that indexes the run and points at the free step |

**Each post is the four P shape**: the problem, the promise (what we made), the
proof (the real screen doing the job), the proposal (one free step). The famous
version of this is problem, agitate, solve. We leave the agitate out on purpose.
Fear selling is against the house rules and the line on the bio is "Not a ban.
A plan."

**Three other proven mechanics sit on top.**

1. **The product is the free step.** The stage check is a diagnosis, the free
   lesson is the real lesson, the first playlist is a real playlist. Nothing is
   a brochure. That is product led growth, and it is why every claim can carry
   a proof path.
2. **A numbered set.** "1 of 13" tells a parent there is more and that it ends.
   A run that reads as a set earns return visits and saves, and the recap
   becomes the one post worth pinning.
3. **An objection every fifth post.** Launches lose people on the questions
   nobody answers out loud. Posts 5, 10 and 15 answer them: "is this just
   parental controls?", "what does it cost?", "does it cover the guidance?"
   Post 13 does the same job for playlists.

**Why not one "1 of 20" on every account.** The 20 posts are one campaign in
this plan, but they reach three different audiences on three different
accounts, and Guided Childhood is not by The Social Billboard (9 August). A
parent following the family account would see 1, 4, 5, 7 and wonder where 2,
3 and 6 went. So the screen says the run that account carries: **1 of 13** for
parents, **1 of 4** for schools, **1 of 3** for playlists. The campaign
numbers 1 to 20 are ours. If Justin wants one "of 20" set in public, the only
account where all three honestly belong together is his own LinkedIn. That is
decision 2 in section 8.

## 2. Three things the brief had that the live product does not

Checked on the live sites on 10 November. Each changes copy, so each is
written down.

1. **Schools has no open catalogue.** It was withdrawn on 15 August
   (`schools/lib/access.ts`). `/catalogue` now redirects to the school code
   page. What is open with no login: the curriculum map (`/curriculum`, every
   module card readable), **one whole lesson free to teach, no login and no
   email** (`/lesson/ks3-12-misinfo-deepfakes`), the RSHE mapping, the
   safeguarding crosswalk, and the free pilot request (`/pilot`, "4 of 5
   places left" today). The schools posts use those.
2. **There is no free tier for parents.** `lib/content/free-script-limit.ts`:
   "everything should be 4 days free paywall" (Justin, 11 August). The free
   step is the stage check, then an account with **four days of everything, no
   card**. THE-STORY section 9 still says five free scripts and is out of date.
   No post says "free scripts" or "free for ever".
3. **"School chest" is not a name a parent sees.** The live page is "School
   alerts and reminders". The chest component is only in dev fixtures. Posts
   use the live name.

Also found, and good news: **school email forwarding is live** (the Letterbox,
17 September), so it can now be shown. The printables library is **47**, not
29. The child's scripts, the timer, the check in faces and every route in
`service-post-map.md` still exist; the detail is in each draft's proof block.

## 3. The free step, one per audience

| Audience | The one free step | Route, checked live 10 Nov | What may be said |
|---|---|---|---|
| Parents | The stage check | `guidedchildhood.com/starter-pack` (through a `/v/` code) | "What stage is your child? Three questions, no sign up." The email is asked only after the result, at Save. Then "four days of everything free. No card." |
| Schools, posts 2 and 6 | Teach one whole lesson | `schools.guidedchildhood.com/lesson/ks3-12-misinfo-deepfakes` | "No login, no email." The printable pack does ask for a school email, so the posts do not say the pack is ungated |
| Schools, posts 11 and 15 | Request the free pilot | `schools.guidedchildhood.com/pilot` | "Two lessons for a term, no card, no contract, no pupil data." Five places. Never print the places left; the page counts them live |
| Playlists | The first playlist | `thesocialbillboard.com/safe-youtube-for-kids`, button to `/auth/sign-up?role=parent` | "Your first playlist is free. One child profile. No card needed." The 5 October placeholder buttons are fixed: the cold load shows "Get your first playlist free" |

Only the stage check says "no sign up". A printable download asks for an
email, so post 17 sends people to the stage check like every other parents
post.

## 4. The 20 posts

Reel = a vertical film of the real app, made the `product-shorts` way.
Carousel = cards. Card = one image. IG = Instagram, FB = Facebook, LI =
LinkedIn. Every parents post ends on the stage check. Times are UK.

| # | Run | Service (map entry) | Hook | Format | Free step | Proof path | Channel | Proposed |
|---|---|---|---|---|---|---|---|---|
| 1 | Parents 1 of 13 | The pitch: the loop, star quest leading | "It's utterly miserable constantly policing screen time." | Reel, 31s. **Built** | Stage check | `/dashboard/quests/timer`, `/starter-pack`, `/dashboard/scripts`, `/dashboard/checkin` | GC IG and FB Reels, TikTok cut | Tue 17 Nov, 19:30 |
| 2 | Schools 1 of 4 | Zero prep lessons: the free lesson | "The deepfakes lesson is already written." | Carousel, 8 pages. **Built** | Free lesson | `schools.guidedchildhood.com/lesson/ks3-12-misinfo-deepfakes` and `/teach/` | Justin's LI (document post), GC LI page, FB | Thu 19 Nov, 07:45 |
| 3 | Playlists 1 of 3 | The next video problem | "You chose the first video. Who chose the next one?" | Card. **Built** | First playlist | `thesocialbillboard.com/safe-youtube-for-kids` | TSB IG and FB | Sun 22 Nov, 10:00 |
| 4 | Parents 2 of 13 | The star quest: jobs, stars, minutes (2, 15) | "We stopped negotiating about screen time. We wrote down the price instead." | Reel | Stage check | `/dashboard/quests`, `lib/quests/templates.ts`, `lib/quests/holiday-bank.ts` | GC IG and FB, TikTok | Sun 22 Nov, 19:30 |
| 5 | Parents 3 of 13 | **Objection:** is this just parental controls? Devices, first phone, the bridge (12, 14) | "Is this just parental controls?" | Carousel, 7 cards | Stage check | `/dashboard/devices`, `/dashboard/phone-setup`, `/dashboard/social-settings`, `/dashboard/secondary` | GC IG, FB single image | Tue 24 Nov, 19:00 |
| 6 | Schools 2 of 4 | The curriculum map, Reception to Year 13 | "Online safety gets taught in a panic, the week after something happens." | Carousel, 7 pages | Free lesson | `/curriculum`, `shared/schools-curriculum.ts` (34 modules) | Justin's LI, GC LI page | Thu 26 Nov, 07:45 |
| 7 | Parents 4 of 13 | Ask first and the shared timer (1) | "Two more minutes" is never two more minutes. | Reel | Stage check | `/dashboard/quests/timer`, `lib/quests/device-time.ts` | GC IG and FB, TikTok | Fri 27 Nov, 19:00 |
| 8 | Playlists 2 of 3 | Five choices, real screens | "Five choices. Then you press play." | Carousel, 6 slides | First playlist | The live builder; `tools/tsb-playlist-card/shots/` | TSB IG and FB | Sun 29 Nov, 10:00 |
| 9 | Parents 5 of 13 | Scripts, and the child's own (5, 19) | "I had the whole conversation planned. Then I said 'because I said so'." | Carousel, 7 cards | Stage check | `/dashboard/scripts`, `/api/scripts/rehearse`, `/k/[token]/tell` | GC IG, FB single image | Sun 29 Nov, 19:30 |
| 10 | Parents 6 of 13 | **Objection:** what is free and what it costs | "What is free, and what it costs after." | Card | Stage check | `/starter-pack` save screen, `/join`, `lib/access.ts` (`TRIAL_DAYS = 4`) | GC IG and FB | Tue 1 Dec, 19:00 |
| 11 | Schools 3 of 4 | The safeguarding crosswalk for the DSL | "A good online safety lesson makes a disclosure more likely. The plan should say so." | Carousel, 6 pages | Pilot | `/hub/dsl` (open), `/hub/cpd` (in the pilot) | Justin's LI, GC LI page | Thu 3 Dec, 07:45 |
| 12 | Parents 7 of 13 | DiGi, and the check back (4, 21) | "Every parenting expert gives advice. Ours asks if it worked." | Reel. **Reused:** Film 10, DiGi learns you, built and unposted | Stage check | `/dashboard/digi`, `lib/digi/tools.ts` `schedule_followup`, `lib/digi/safety.ts` | GC IG and FB, TikTok | Fri 4 Dec, 19:00 |
| 13 | Playlists 3 of 3 | **Objection:** is this just YouTube Kids? | "Is this just YouTube Kids?" | Card | First playlist | The live page's own answer to that question | TSB IG and FB | Sun 6 Dec, 10:00 |
| 14 | Parents 8 of 13 | Moments, the check in, what is working (13, 20) | "Write the problem down the day it starts." | Carousel, 7 cards | Stage check | `components/daily/MomentTimeline.tsx`, `/dashboard/checkin`, `/dashboard/what-is-working`, `/dashboard/stats` | GC IG, FB single image | Sun 6 Dec, 19:30 |
| 15 | Schools 4 of 4 | **Objection:** does it cover the statutory guidance? | "The new RSHE guidance has 57 requirements about online life. Here is where each one is taught." | Card, with a document version | Pilot | `/hub/rshe-mapping` (open) | Justin's LI, GC LI page | Tue 8 Dec, 07:45 |
| 16 | Parents 9 of 13 | School alerts and reminders, the homework helper (7, 8) | "I have never once forgotten swimming. I have remembered it at ten past eight." | Reel | Stage check | `/dashboard/school`, `/api/school/[id]/ics`, `/dashboard/homework`, `/dashboard/learning` | GC IG and FB, TikTok | Fri 11 Dec, 19:00 |
| 17 | Parents 10 of 13 | Printables, crafts, the family agreement (9, 10) | "Every tool for managing screens is itself a screen. Ours prints." | Carousel, 7 cards | Stage check | `/dashboard/printables` (47), `/dashboard/quests/crafts`, `/dashboard/agreement` | GC IG, FB single image | Sun 13 Dec, 19:30 |
| 18 | Parents 11 of 13 | The passport, the lessons, the printed keepsake (3, 6, 17) | "A sixteenth birthday is not a training course." | Carousel, 8 cards, THE ROAD TO 16 | Stage check | `/dashboard/pathway`, `/passport`, `/dashboard/lessons`, `/dashboard/keepsakes` | GC IG, FB single image | Tue 15 Dec, 19:00 |
| 19 | Parents 12 of 13 | The child's app, the games, AI (11, 16) | "Every screen time app is built for the parent. So the child pushes back." | Reel | Stage check | `/k/[token]`, `lib/quest-games/registry.ts`, `/dashboard/ai-module`, `scripts/check-child-has-no-model.mjs` | GC IG and FB, TikTok | Fri 18 Dec, 19:00 |
| 20 | Parents 13 of 13 | The recap: everything, in one swipe | "Twelve things we built so you can stop policing." | Carousel, 10 cards. Pin it | Stage check | Every route above | GC IG (pinned), FB, Justin's LI version | Sun 20 Dec, 19:30 |

**Every service in `service-post-map.md` has a home.** 1 in post 7, 2 and 15
in 4, 3 and 6 and 17 in 18, 4 and 21 in 12, 5 and 19 in 9, 7 and 8 in 16, 9
and 10 in 17, 11 and 16 in 19, 12 and 14 in 5, 13 and 20 in 14, 18 in posts
2, 6, 11 and 15. Nothing from the "Do not post about these" list appears.
Keepsakes are the printed passport and the sticker sheet only.

**The split is 13, 4, 3**, as proposed. Formats: 6 Reels, 10 carousels, 4 cards.

## 5. The calendar, and what it sits around

Read from the Business Suite record on the `hoggfield-billboard-image` branch,
the Carousels Review Queue and the sibling plans. **Nothing here moves a post
that is already scheduled.**

- **Through 15 November: nothing from this campaign.** That week holds Alma
  Part 5, After the Bell (Wed 11), the Robux film (Thu 12), The Five O'Clock
  Handover (Fri 13), the Planet Post (Sat 14) and the DiGi hero film (Sun 15).
- **The family account** keeps Founder Monday, Research Wednesday, the
  Thursday film trial and the Saturday free download exactly as they are. The
  walkthrough takes **Tuesday** and **Sunday**, which the rhythm leaves empty,
  and **Service Friday**, which is its natural home. Friday 20 November is
  left free for the Snap Map film from the format playbook lane.
- **Justin's LinkedIn** runs Monday, Wednesday and Friday. The schools posts
  go on **Thursday at 07:45**, and the last on Tuesday 8 December, so no two
  posts land within eight hours and the run finishes before the last week of
  term. Tuesday 24 November is Product Hunt day; post 5 is on the family
  account that evening and needs nothing from him in the morning.
- **The Social Billboard** queue is full on 16 to 21 and 24 to 27 November.
  The three playlists posts take the free **Sunday mornings**: 22 and 29
  November, 6 December.
- **Justin's personal Instagram** carries the founder journey on Sunday and
  Wednesday evenings. The family account's Sunday walkthrough is a different
  account and is scheduled ahead, but replies will land the same evening. If
  that is too much, the Sunday posts move to 10:00.
- **The timing does some work.** Post 5 (set a device up once) lands in Black
  Friday week. Post 16 (school reminders) lands in the last full week of term,
  when the reminders are at their worst. Posts 18 and 19 land the week before
  a phone goes under the tree. The recap closes on the first Sunday of the
  holidays.

**One honest cost.** The house rule is one direct ask in five posts
(`weekly-rhythm.md`). For five weeks this run puts an ask on three posts a
week on the family account. Every ask is the free step, soft, and Monday and
Wednesday still carry none. It is still a change to the ratio and it is
Justin's call (decision 3).

## 6. The look, one per brand

| Brand | Look | Source |
|---|---|---|
| Guided Childhood | Cream and butter, ink text, Nunito and IBM Plex Mono, one gold detail, DiGi only from the approved star. Franchise frame INSIDE GUIDED CHILDHOOD with the count as the tag | `brand/GDC_SOCIAL_VISUAL_SYSTEM.md`, `tools/social-cards`, the film engine in `videos/2026-10-09-digi-shorts` |
| Schools | The schools site's own teal, cream and butter, Nunito, the franchise frame EVERY YEAR HAS A JOB. Real screens of the live site. No DiGi on the covers | `schools/app/page.tsx` hero colours, section 9 of the visual system |
| The Social Billboard | Near black, white, one yellow `#FFD100`, Montserrat. No DiGi, no stars, no cream | `tools/tsb-playlist-card`, the live site's `--accent` |

Every screen is a real one. Parents screens come from the reference preview
pages with the film family's names (Ava and Sam, swapped by
`videos/2026-10-09-digi-shorts/tools/names.json`). Schools screens are
captures of the public live site. No character is regenerated, no screen is
invented, no person stands in for a parent, no child's face appears, and the
Planet Post's "Read for 20 minutes" line is never shown.

**The photo carousels are a separate decision.** The `gdc-instagram-carousel`
skill makes the film photo carousels in Montserrat and Instrument Serif. They
need generated photos (credits) and Justin's signature, and their look is not
the butter and Nunito one this brief asked for. So the campaign's carousels
are real screen carousels, which cost nothing. Any of them can also be run
through that skill if Justin wants the photo version (decision 4).

## 7. Reused and new

**Reused, already made**

- Film 10, "DiGi learns you" (`content/packs/2026-10-09-digi-shorts/films/digi-short-10-learns.mp4`), built 4 November and never posted. It is post 12 as it stands.
- 37 real app stills and 15 real screen recordings in `videos/2026-10-09-digi-shorts/assets/`. Post 1 is cut entirely from these. Posts 4 and 7 can be too.
- The film engine (`build.mjs`), its end card, its sound cues and the Pixabay track Justin supplied.
- `tools/social-cards` and `tools/tsb-playlist-card`, both free to render.
- The five real playlist builder screenshots in `tools/tsb-playlist-card/shots/`.
- The printable page previews in `public/printables/` for post 17.
- Hooks from `service-post-map.md` where they have not gone out.

**New**

- All 20 drafts: hooks, scripts, slide copy, captions per channel, visual briefs.
- The post 1 cut (`cuts/walkthrough-01.json`), the post 2 carousel deck and the post 3 card deck.
- Nine captures of the public schools site.
- To film later, each from an existing reference page, no credits: the jobs board (`ref-job-board`, `ref-kid-jobs`), school and homework (`ref-school-card`, `ref-homework-help`), the child's app (`ref-kid-home`, `ref-kid-five`).

**Not repeated.** The Alma five parter, After the Bell, The Five O'Clock
Handover (the ENDS words; post 7 shows the timer instead), the Planet Post,
the DiGi hero film, the Robux film and the phone carousel of 14 November
(post 5 shows the device setup, not the five steps).

## 8. Tracked links

`/v/<code>` counts a visit and lands on the stage check at question one. It
only points at the parents stage check, so it covers the 13 parents posts.

- **Codes to make on Admin, Film links, before anything is posted** (30).
  Twelve plain codes for end cards and Story stickers: `tour-01`, `tour-04`,
  `tour-05`, `tour-07`, `tour-09`, `tour-10`, `tour-14` and `tour-16` to
  `tour-20`. Twelve `-fb` twins for the Facebook post text. Five `-tt` twins
  for the TikTok cuts of posts 1, 4, 7, 16 and 19. One `tour-20-li` for the
  LinkedIn recap. Post 12 is Film 10 and keeps its own codes (`digi-learns`,
  `digi-learns-fb`, `digi-learns-tt`, `digi-learns-ig`). Set the channel on
  each. An unknown code still lands on the stage check, it is just not
  counted, so a film is never broken by a missing code.
- **Schools.** `/v/` cannot point at the schools site. The first comment link
  carries `?utm_source=linkedin&utm_medium=social&utm_campaign=walkthrough&utm_content=s1`
  (to `s4`). The pilot form records these. The free lesson page records
  nothing until the PostHog key is set in Vercel, which is still open.
- **Playlists.** The Social Billboard's site is not in this repo. The same
  four UTM values go on the link; whether its analytics reads them is unknown.

## 9. What Justin decides

1. **The look.** The three built pieces on the review page: yes, or what to change.
2. **The numbering.** Per run on screen (recommended), or one "of 20" set on his own LinkedIn as well.
3. **The ask ratio.** Three asks a week on the family account for five weeks, or stretch the run to two a week and finish in January.
4. **Credits.** None are needed for any of the 20 as planned. Only if he wants photo carousels or generated cover loops.
5. **The dates**, and Sunday 19:30 or 10:00.
6. **Schools free step.** The free lesson on posts 2 and 6 and the pilot on 11 and 15 (recommended), or the pilot on all four.
7. **Three stale lines found on the way**, none fixed here: the schools home hero still says "ready for September 2026", `schools/public/og.png` says 25 modules (there are 34), and THE-STORY section 9 still lists a free tier that the code removed in August.

## 10. Checks

- `node scripts/check-ai-tells.mjs content/campaigns/platform-walkthrough`
- `node tools/tsb-playlist-card/check-words.mjs` on the playlists decks
- Every proof path opened in the code or on the live site on 10 November
- The film read frame by frame from contact sheets (the checklist in `product-shorts`)
- Not done: the marketer review and feedback filter pass that `product-shorts` asks for before a film is posted. It runs once Justin has said yes to the look, on the final cut.
