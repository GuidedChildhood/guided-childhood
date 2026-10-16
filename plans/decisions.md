# Decisions Log — Guided Childhood Platform

Append only. This file is the index. The full text lives in the monthly
archives under `plans/decisions-archive/`.

**Writing an entry.** Append it to the bottom of this file, under a heading of
`## <date>, <what it is about>`. Keep it under a dozen lines: what was decided,
the one reason worth knowing, and the PR number where the detail lives. The
reasoning belongs in the code comments and the pull request body. An entry that
runs to three hundred lines gets read by every session for weeks afterwards.

**Reading one.** Do not load an archive whole. Each archive opens with an index
giving the line number of every entry, so one decision is
`sed -n '400,460p' plans/decisions-archive/2026-08.md`, and a search across all
of them is `grep -n "founder rate" plans/decisions-archive/*.md`.

**Migration numbers.** The authoritative count is `supabase/migrations/` plus
the numbers named in the open pull requests, never this file. Past ledger
entries are in the archives: `grep -n "migration" plans/decisions-archive/*.md`.

**Rolling.** `npm run roll-decisions` moves anything older than the keep window
into its month archive and rebuilds the index below. Run it at session end, or
when `npm run context-guard` says this file is over budget. Nothing is deleted.

<!-- roll:index:start -->
## Where the full entries live

| Archive | Covers | Entries |
| --- | --- | --- |
| `plans/decisions-archive/2026-06.md` | 2026-06-13 to 2026-06-27 | 3 |
| `plans/decisions-archive/2026-07.md` | 2026-07-01 to 2026-07-31 | 217 |
| `plans/decisions-archive/2026-08.md` | 2026-08-01 to 2026-08-30 | 155 |
| `plans/decisions-archive/2026-09.md` | 2026-09-01 to 2026-09-30 | 297 |
| `plans/decisions-archive/2026-10.md` | 2026-10-01 to 2026-10-13 | 79 |

## The last 120 decisions

Titles only. Open the archive at the line number in its own index for the full entry.

- 2026-09-23 · 23 September 2026: the free taster gets its evidence, and two claims are corrected · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: source notes are shown, not hidden behind a badge · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: a DSL can make the crosswalk her school's own · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: evidence for the 8 flagged lessons, and what it waits on · `plans/decisions-archive/2026-09.md`
- 2026-09-23 · 23 September 2026: the parent track asks one thing at a time, and says what parents want · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: the hero names the stage check, and says what a parent gets · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: outside advice is weighed before it is acted on · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: three flagged lessons get evidence, and say only what their sources say · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: Simon Squibb's ideas weighed, and a KS3 module to follow the checks · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: the Squibb lesson stands alone, outside the scheme · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: every page checks who you are without a trip to the auth server · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: DiGi stays at medium effort; the wait explains more · `plans/decisions-archive/2026-09.md`
- 2026-09-24 · 24 September 2026: the standalone lesson is built, and opens free at its own link · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: DiGi's typing box is always on screen, and the page is quieter · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the Devices step ticks on the devices, and "All clear" says what · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: Start is the first thing on the parent's timer card · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the child's Print it bar sits on top of the tabs · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the child's home runs the five a day first · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the standalone lesson's migration is 349, and 350 is next · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the parent's ten minutes are confirmed, Duolingo style · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: trial emails on the trial clock, trial stays four days · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the school link, before any paid school pass · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: a second standalone lesson, on being an entrepreneur · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the first check in says getting started, and a calendar corner · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: school emails were never read past the subject line · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: homework help, hints not answers, no chat · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: a reminder for a child with no phone says so · `plans/decisions-archive/2026-09.md`
- 2026-09-25 · 25 September 2026: the pathway build reveals line by line on every phone · `plans/decisions-archive/2026-09.md`
- 2026-09-26 · 26 September 2026: three flagged lessons now say what their sources say · `plans/decisions-archive/2026-09.md`
- 2026-09-26 · 26 September 2026: the second standalone lesson, Could you be an entrepreneur? · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: no green from last week, no minutes not spent · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: after a pitch, another idea or back to the day · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: Moments to resolve is its own page, with DiGi and scripts on each · `plans/decisions-archive/2026-09.md`
- 2026-09-28 · 28 September 2026: the third standalone lesson, Should people wear smart glasses? · `plans/decisions-archive/2026-09.md`
- 2026-09-29 · 29 September 2026: a video system from Nate Herk's method, weighed first · `plans/decisions-archive/2026-09.md`
- 2026-09-29 · 29 September 2026: every print is branded; the script prints as a fridge card · `plans/decisions-archive/2026-09.md`
- 2026-09-29 · 29 September 2026: lessons, the child learns the school version and the parent closes it · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: four new under 7 lessons, the shelf goes from three to seven · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: the launch plan, three lanes, one number, day by day · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: the Control Room, one page that runs the marketing · `plans/decisions-archive/2026-09.md`
- 2026-09-30 · 30 September 2026: migration 358 is live, the under 7 shelf is seven lessons · `plans/decisions-archive/2026-09.md`
- 2026-10-01 · 1 October 2026: the master plan, the content pack, the explainer template, the daily desk · `plans/decisions-archive/2026-10.md`
- 2026-10-01 · 1 October 2026: the founder context and the weekly image sheet · `plans/decisions-archive/2026-10.md`
- 2026-10-01 · 1 October 2026: The Social Billboard playlist card and Instagram carousels (PR 1184) · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: parents can talk to DiGi, and DiGi can read aloud, both optional · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: the handover series is told by Justin alone · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: why the explainer looked basic, and the DiGi brain film (PR 1184) · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: DiGi reminders, log a moment, worries tracked, hands free (PR 1186) · `plans/decisions-archive/2026-10.md`
- 2026-10-02 · 2 October 2026: migration 359 live, LinkedIn pack, PRs 1187 and 1188 unblocked · `plans/decisions-archive/2026-10.md`
- 2026-10-04 · 4 October 2026: Give £5, get £5 built for Guided Childhood (PR 1190, migration 360) · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: two sessions, one Social Billboard feed · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: the Social Billboard lane is blocked by the site, not by content · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: one control document for the Social Billboard parent launch (PR 1192) · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: Space playlist approved; the review behind it becomes a post (PR 1192) · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: one social visual system, the real assets win · `plans/decisions-archive/2026-10.md`
- 2026-10-05 · 5 October 2026: the six formats built, and the Sunday batch · `plans/decisions-archive/2026-10.md`
- 2026-10-06 · 6 October 2026: the free pilot email campaign, Wessex first, then 15 miles · `plans/decisions-archive/2026-10.md`
- 2026-10-06 · 6 October 2026: Social Billboard cards use black, white and yellow only · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: Two brains, one clock has sound and 1080p clips (PR 1184) · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: every script Justin has to record, as read cards · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: the check in rates on faces, one outcome per tap, two fives still rest a worry · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, later: one five rests a worry, and the faces get the happy news finish · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026: lesson videos are H.264 and ship with the schools site · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, afternoon: the momentum block rides inside the reviews · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, afternoon: DiGi asks "How did that go?" once, and a tough check in leaves one invite · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, evening: the pilot review's fixes, and the sort turns its cards over · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026, evening: the school price weighed against eLIM, decision with Justin · `plans/decisions-archive/2026-10.md`
- 2026-10-07 · 7 October 2026 — the two school day windows: per family pushes and a one tap moment card · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — migration 363 applied, the three school day PRs merged, 1213 unblocked · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the founding schools rate · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the DiGi launch film · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026, afternoon: the DiGi launch film slows down and shows its brain · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026, later: the launch film's researchers layer names four · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — the school day post is bulletproofed before it ships; the hostile panel is standard · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the pilot emails, rewritten to the research · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: DiGi in 3D, and a KS3 lesson on copyright · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the pilot emails link to the proof, and the form comes after the yes · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026 — the loop promise on every surface, the pilot drafts set right, the school day posts in their final shape · `plans/decisions-archive/2026-10.md`
- 2026-10-08 · 8 October 2026: the two brains film is sequential (v5) · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: French and Spanish join, sealed behind their own code · `plans/decisions-archive/2026-10.md`
- 2026-10-09 · 9 October 2026: one curriculum, two rooms; three decisions · `plans/decisions-archive/2026-10.md`
- 2026-10-11 · 11 October 2026: AI and SaaS advice, weighed · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the DiGi hero and Short 1, from real screens · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the extension marks reach the live decks (migration 369) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: every paper pack fits its paper · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: four lessons print their own tool (migration 370) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the ending is agreed, not warned (migration 371) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the films show the script deck, its sources, and the tracking to sorted · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: "Ready", the brand advert, and its series template (PR 1221) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the film link, /v/<code> (migration 372) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: PR 2 of the lessons loop, the home code records coverage (migration 373) · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: the shorts re-cut after the marketer review · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: guilt, not "bad guy" · `plans/decisions-archive/2026-10.md`
- 2026-10-12 · 12 October 2026: readable films, the series line, and the product-shorts skill · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the Digital Health Report is not a service · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: migration 360 was never applied, so the whole referral feature had no tables · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 373 arrives in two halves, because 70 KB will not go through the tool · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: migrations 371 and 372 applied, and the shorts go out on the family account · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the hard questions reach the live decks (migration 374) · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the six heavy lessons wait for a grown up · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the child's home, simpler, and nothing written for the parent reaches it · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: every post in Drive gets a Claude review, and the queue restarts at GDC-018 · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: live DiGi agrees the ending, and the bedroom rule is a pathway (migration 375) · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the starter pack and the welcome agree the ending too · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the Digital Health Report stays linked, and GDC-025 is live · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: GDC-022 was already spent, and the two parked posts are written · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: when the five land, the Planet Friends moonwalk on · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: screen break ideas, and Add your own on every step sheet · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: a child's lesson count is that child's own · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: five free Happy News printables, The Planet Post first · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the child's home, the day first and linked to the grown up · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the grown up's side of the link · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: The Guided Planet, the newspaper engine and Issue 001 · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 373's content half carried in pieces, and proved before it was written · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 375 and 374 applied, and 377 cannot be · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: a correction to what the 373 staging tables were granted · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 377 goes back to the planet lane, not fixed here · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: The Guided Planet wears boho Happy News, and the audience is written down · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: the review board, eleven lenses scored every Friday · `plans/decisions-archive/2026-10.md`
- 2026-10-13 · 13 October 2026: 377's grants are fixed, its name collision is not · `plans/decisions-archive/2026-10.md`

## Not yet rolled (the last 2 days, in full)

<!-- roll:index:end -->

## 14 October 2026: The Guided Planet emails through Resend, and boho is for the printables

Justin: "Resend better than Mailchimp"; "boho printables". The newspaper's email channel moves from a Mailchimp draft campaign to a Resend draft broadcast, so the paper uses the house email and one sender reputation (the swap is its own small PR). Boho is confirmed for the printables (The Guided Planet and the free downloads); the social card system is unchanged. Also found before applying 377: its planet_events name was the children's Planet Friends ledger (252); the newspaper's table is now planet_issue_events. Applied to the live database on 14 October (seven tables, RLS on, service role only, private guided-planet bucket; the children's planet_events untouched). Every earlier attempt timed out because the Supabase tool holds any drop statement for a confirmation that never appears in a cloud session, so 377 now uses create or replace trigger. PR 1294.

## 14 October 2026: competitor sightings logged, and a first phone ad drafted

Justin saw seven parenting and family app ads on Instagram and asked if he should worry. None does our core loop; Kairoo (screen agreement and bedtime reminders) is the closest and takes the job off the parent, the opposite of commitment 2. All seven are logged in `briefings/notes/competitor-sightings.md`, which the competitor watch lens now reads. No ad named the first phone, so an ad that opens on it was drafted (three cards plus captions, organic first per the money rule). A second sweep the same day added Balance Phone (a phone maker now running our readiness hook), Qustodio (now leading on the battle) and Nuet (the plain voice; it overlaps our school letterbox), with seven campaign lessons in the same file: `content/packs/2026-10-14-first-phone-ad/`. Nothing posted.

## 14 October 2026: reels story bank from Family IT Guy's parent questions, not his content

Justin asked for agents to scrape family_it_guy for our reels. We did not scrape
(Instagram blocked, terms, his copyright, his fear engine fails the hidden
thread). Two agents catalogued his public topics; each became the parent
question underneath, answered our way: 24 silent UGC stories, each with a real
app proof path and the stage check at the end. The gap: he says "add more as
they show they are ready" and never says what ready looks like.
`content/packs/2026-10-14-reels-story-bank/`. PR 1293.

## 14 October 2026: the last three ChatGPT posts rewritten, and one register for the numbers

Justin: review the last three ChatGPT posts, make sure the word sequences do not
read as machine written, and put his own writing style in.

**The three.** GDC-037 the film, GDC-038 the Bradford trial, GDC-039 the Ofcom
gaming figures. Rewritten in `content/packs/2026-10-14-gdc-037-to-039/`. A
rewrite keeps its number, so they stay 037, 038 and 039.

**The fingerprint across all three**, which is what an AI check would catch: the
same "imagine two children" framing twice, the concession announced as "the
strongest opposing point" twice, a "design consequence for Guided Childhood"
paragraph in all three, and every paragraph the same length throughout. Any one
is forgivable. The three together are a formula.

**The personal angle was the missing piece and GDC-039 said so out loud:** "no
approved founder or family anecdote naturally connects to this claim." Wrong
three times. Each rewrite now opens on one true green scene, used once, none
repeated, no children in any of them: he watched a feed narrow in his own house
(037), he has argued for years on evidence that cannot settle it (038), he set a
timer because it was the rule he could enforce (039).

**What was kept:** the overclaim notes, nearly whole. All three were right about
the hard parts, including refusing to shorten the coroner's conclusion on Molly
Russell, refusing to state the Bradford daily cap while sources disagree, and
refusing to call the Ofcom parent figures a twelve point gap.

**The numbering broke a second time and the fix is a register.** 036, 037 and 038
were assigned to rewrites yesterday when all three were already in use, missed
because the daily packs are markdown files and the search filtered to Google
Docs. Those three are now 040, 041 and 042. `content/gdc-post-register.md` is the
single place a number is claimed, routed from drive-post-review. The real cause
is that two systems assign numbers and neither can see the other, which the
register fixes only if both write to it.

## 14 October 2026: Happy News design system in Claude Design; printables start from it

After a design critique of The Planet Post canvas (friends band, bigger lead
text and stars, clearer answers), Justin said go on a design system. "Guided
Childhood Happy News" now lives in Claude Design
(https://claude.ai/artifact/LgLM8FhZ63cKbvkYZT6BWT): our tokens, Nunito and
IBM Plex Mono, five components (ChunkyButton, Sticker, Burst, Ribbon,
FriendPlate) and the approved DiGi and Planet Friends art as uploads, never
regenerated. Every next printable canvas (Screen Time Tickets first) starts
from it. It is a copy, not synced: when shared/tokens.css changes, update it.

## 14 October 2026: GDC-039, 037, 038 running order approved

Justin: go ahead on the posts, and suggest an order. It runs 039 on Wednesday 14
October, 037 on Friday 16 October, 038 on Monday 19 October.

The clock on each one sets the order. 039 rests on Ofcom's Growing Up Gaming,
published 13 October, so it is worth most today and least next week. 037 rests on
a film that leaves cinemas. 038 has no clock at all, since the Bradford trial
reports in 2028, so it waits and takes the Monday research slot.

What the order does not fix: all three now open in the first person on something
Justin got wrong. Three in a row is its own pattern, so the fourth post in this
lane must not open on "I".

Drive doc rebuilt with the order at the top and the old copy trashed. Register
rows say planned, not posted, because only Justin can confirm a post went out.
PR 1298.

## 14 October 2026: the Drive post review now runs itself

Justin: "can this review all posts put in gdrive from now on and re write them
with our skills." The review existed as a rule since 13 October but nothing fired
it, so it only ran when a session happened to look. There is now a "Drive post
review" Routine, weekday mornings at 07:59 London, fresh session each time,
trigger trig_014ZRsPNyD2PhAk56Gz2cbWn.

Two things make it safe to run unattended. A reviewed post gets CLAUDE REVIEWED
in its Drive title, which is what stops the next run rewriting a post he has
already published. And `content/brand-story/founder-scenes-used.md` is new: a
ledger of which true scene went into which post, because a routine with no
memory of the last run would use the strongest scene every day until the voice
became a jingle.

It cannot hold the Google Drive connector from here, same refusal as the Monday
radar, so until Justin attaches Drive in the claude.ai Routines page it will say
it cannot see Drive and stop rather than guess. PR 1298.

## 14 October 2026: the Drive sweep nearly rewrote five published posts

Justin attached Google Drive to the Drive post review Routine. Before firing it
I listed the folder: ten files, and not one of them carried the CLAUDE REVIEWED
marker the routine uses to decide what is new. A first run would have rewritten
five posts already published, plus a .docx content waterfall that is not a post.

The marker alone was never enough. The sweep now excludes anything titled POSTED
or marked posted in the register, anything already carrying the marker, and
anything that is not post copy, and it never enters the ARCHIVE subfolder. It
also stops at five posts a run, because a bigger batch means an exclusion rule
was missed rather than that twelve posts appeared overnight.

The four docs that were already ours were retitled by hand to seed the marker,
so the first real run finds nothing, which is the correct answer.

## 15 October 2026: The Planet Post is the taster, The Guided Planet the paper, one look
Justin, "yes to both". The Planet Post (free, four pages, wins the email) leads
into The Guided Planet (monthly, twelve pages). The paper now wears the same
Happy News design system: `"theme": "happy"`, `publishing/design/happy.css`,
both issues switched, boho and editorial kept. Same words, sources and checks;
no copy trimmed, no art generated, no credits spent. The theme change moves
Issue 001's content hash, so its desk record needs a re-sync before approval
two. Detail in PR #1307.

## 16 October 2026: Digital Parenting Week planned as two date free pieces
The date could not be confirmed on a primary source: Parent Zone's site has only
the 2021 edition, and 26 to 30 October 2026 comes from two aggregators. So the
two drafts (an AI companion Wednesday led by Orbit, "the ban is a start line"
Friday led by Nova) never name the week and work whichever dates are real. Also
found: `banWorld` in `lib/content/stages.ts` has no reader in the app, so no post
may say the ban words are in the stage check. Apple iOS 27 Screen Time and Bark
Moments are logged in `briefings/notes/competitor-sightings.md`. Plan:
`plans/2026-10-16-digital-parenting-week-plan.md`. Nothing posted.
## 15 October 2026: The Planet Post downloads now carry the better version

Justin found the emailed download was still the first version. The code
version now matches the canvas: the Planet Friends line up (approved waving
stills), the six critique fixes (one colour for every message so none gives
the answer away, wheel labels clear, readable instructions, word search at the
top, shorter jar lines, "My name"), and tagged PDFs titled "The Planet Post,
Issue 1". All five PDFs and the previews re-rendered; the guard holds the
fixes. Spec: plans/2026-10-14-planet-post-handoff.md.
