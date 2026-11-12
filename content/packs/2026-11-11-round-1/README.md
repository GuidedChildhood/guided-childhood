# Ad round 1: five hooks, one treatment

Made 11 November 2026. This is the Round 1 the ad council agreed on 20 October
(`briefings/2026-10-19-ad-campaign-council.md`): the same card five times with
only the hook and its proof changed, so the test measures the hook and nothing
else. Deck: `tools/social-cards/decks/2026-11-11-round-1.json`. Cards at 2160
by 2700.

Nothing here has been posted, boosted, scheduled or uploaded.

## The cards

| Card | Hook | Proof on screen | Link code |
| :-- | :-- | :-- | :-- |
| `01-control-digi.png` (control) | Tell it what went wrong today. Get one thing to do. | DiGi: Tell DiGi what is hard right now | `r1-control-digi` |
| `02-mid-match.png` | They cannot stop in the middle of a match. | The free script, Say this, whole | `r1-mid-match` |
| `03-left-out.png` | Everyone is on Snapchat. They are not. | The free script, Say this, whole | `r1-left-out` |
| `04-before-the-box.png` | Plan the first phone before the box is opened. | The free script, Say this, whole | `r1-before-the-box` |
| `05-earned-time.png` | They earn their screen time. You set the rate. | The child's page: a job waiting, 8 stars in the bank, My time 40 min ready | `r1-earned-time` |

The control is the pitch from THE-STORY section 10, so every other hook is
measured against the line we already use.

Every screen is a real capture. The three scripts are the live public pages
(`/say/<id>`, captured 11 November with `tools/social-cards/capture.mjs`),
cropped in one run from SAY THIS to the end of the quote. The DiGi and My time
screens are the ref fixtures (made up children, Teo and Alfie). The ink edge
is drawn outside each crop; nothing inside one is redrawn.

The mid match script was held on 20 October because it promised "the warning
at the end". The live script no longer says that. It now agrees the number of
matches before the game starts, which matches the 12 October decision, so the
card is cleared.

## The creative director's pass

`npm run ad-gate`: passed, five cards. Butter, measured on the finished card:
0.5 to 2.6 percent against a cap of 10.

Scored on the ten lines in the ad studio skill, one point each:

| Card | Score | Lines it lost |
| :-- | --: | :-- |
| Control | 8 | 1: it names no moment (it is the control, by design). 10: Justin has not read it yet. |
| Mid match | 9 | 10 |
| Left out | 9 | 10 |
| Before the box | 8 | 2: the quote is the longest, so its words are the smallest of the five in the feed. 10 |
| Earned time | 9 | 10 |

Line 10 (Justin would post it without changing a word) is his to give, so no
card can score ten here.

## The words beside each card

The headline under every card is the hook: **What stage is your child?** with
**Three questions, no sign up.** The words above each card are in the deck
(`ad.text`), and are what the uploader sends. Mid match, as the example:

> You say it is time to come off. They go from fine to furious in about four
> seconds, because walking out in the middle of a match costs them something
> real.
>
> There are words for that moment. Agree how many matches before the game
> starts, and they stop at the end of the last one.
>
> Guided Childhood gives you the words for your child's stage, and the plan
> from here to sixteen. Start with three questions.

For an organic Instagram post, use the same words and end "Link in bio." For
Facebook, end with the card's own link: `guidedchildhood.com/v/<link code>`.

## The links

The five codes exist on the live database (channel Facebook), so
`guidedchildhood.com/v/r1-mid-match` and the other four count opens, stage
checks begun and signups from the first click. The founder links page
(`/dashboard/admin/videos`) shows them.

## Two ways to run it

1. **Free first, the house rule.** Post each card as an ordinary post, a few
   days apart, seven days each. The winner is the most stage checks begun per
   thousand reached, with at least 300 reached. Then switch on only the
   winner's advert.
2. **Paid test.** `npm run ad-upload -- 2026-11-11-round-1 --go` loads all
   five into one paused ad set (`content/ads/SETUP.md`). Switched on as it
   stands it is £5 a day for 7 days, £35 at most. This is quicker and it
   breaks the money rule (never pay to find out if something works), so it is
   Justin's call.

## A picture of the moment behind each screen

Justin asked whether these match the finish of the adverts in the talk and of
the competitors' best. Compared against both
(`briefings/notes/competitor-sightings.md`, 11 November): the structure
matched, the picture was missing. He said yes to a picture on all five.

Each card now has a photograph of its moment behind the real screen. The
photographs are generated with GPT Image under visual system section 15: a
room and objects, nobody in them, no text, our palette. The screen on top of
each is the same real capture as before, untouched.

| Card | The picture | File |
| :-- | :-- | :-- |
| Control | A mug of tea, a lunch box and a school jumper on the kitchen table | `content/ads/scenes/control-kitchen-table.jpg` |
| Mid match | A controller left on the arm of the sofa | `content/ads/scenes/mid-match-sofa.jpg` |
| Left out | A school bag and shoes dropped in the hallway | `content/ads/scenes/left-out-hallway.jpg` |
| Before the box | A plain sealed box on brown paper | `content/ads/scenes/before-the-box-table.jpg` |
| Earned time | The dog's bowl and lead by the back door (the job on screen is Feed the dog) | `content/ads/scenes/earned-time-dog-bowl.jpg` |

Cost: ten images, 27.5 credits, agreed by Justin before each batch. One was
picked per card; the rest stay on Higgsfield.

Checked again after the change: the gate passes, butter is 1.4 to 3.7 percent
against the cap of 10, and the scores stand, with line 1 now carried by the
picture as well as the headline. The cards without pictures are kept in
`plain/` in case the plain version is wanted.

Card 5 was "Jobs first. Then their time." until Kairoo began running "Jobs
first. Then screen time." on 6 November. Justin said rewrite it. It now leads
on what Kairoo does not have: the child earns the time, and the parent sets
the rate. Its link code is `r1-earned-time`.

## The benchmark: against the best that is known to work

Added 12 November 2026 (ad studio Phase 4, pass 3). Each card scored against
the proven competitor static closest in format, both on rubric lines 1 to 7
and 9 (eight lines, one point each). The benchmark is Qustodio's static frame,
live 96 and 97 days in several versions (`content/ads/swipe/ads.json`): a
headline left on a pale ground, a cut out photo of a child with a phone, a
full width button.

| Line | Qustodio "Know where they are, always" | Ours, mid match | Ours, left out | Ours, before the box | Ours, earned time | Ours, control |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: |
| 1 One moment named first | 0 | 1 | 1 | 1 | 0 | 0 |
| 2 Reads at thumbnail size | 1 | 1 | 1 | 1 | 1 | 1 |
| 3 The screen proves the headline | 0 | 1 | 1 | 1 | 1 | 1 |
| 4 One gold detail, space, no glow | 1 | 1 | 1 | 1 | 1 | 1 |
| 5 Nothing looks made | 0 | 1 | 1 | 1 | 1 | 1 |
| 6 Nothing cut off | 1 | 1 | 1 | 1 | 1 | 1 |
| 7 A parent's own words | 0 | 1 | 1 | 1 | 0 | 0 |
| 9 One frame, many lines | 1 | 1 | 1 | 1 | 1 | 1 |
| **Total of 8** | **4** | **8** | **8** | **8** | **6** | **6** |

Every card scores above the benchmark. Their frame shows a stock looking child
and a promise; ours shows the moment and the real screen that answers it.

What theirs does that ours does not, and what we do about it:

- **A full width button in a strong colour.** Ours is smaller. Kept for Round
  1 so the test measures only the hook; tried in Round 2 if the click rate is
  low against reach.
- **Their longest runners are not statics at all.** Their three adverts past
  240 days are plain videos in real homes. No card beats that. Ad video 1
  (`content/packs/2026-11-11-ad-video-1/`) is the answer, waiting on Justin's
  filming.
- **A child's face, and "keep my kid safe".** Left out on purpose: never a
  child's face, never a promised outcome.

Earned time and the control lose lines 1 and 7 because they name a mechanism
rather than a moment. That is fine for the control, which is the line we
already use, and it is the open question the test answers for earned time.

## Loaded into Ads Manager, switched off (12 November 2026)

`npm run ad-upload -- 2026-11-11-round-1 --go`: all 17 calls went through on
the first run. One campaign ("GC 2026-11-11-round-1", traffic), one ad set
and five adverts, every one PAUSED, each linking to its own code with
`utm_medium=paid`, each running as The Guided Childhood on Facebook and
@guidedchildhood on Instagram. Meta was still reviewing the five ("in
process") when they were checked. The ids are in
`content/ads/meta/2026-11-11-round-1.json`.

Before switching on, in Ads Manager: the ad set's end date was written as
19 November (seven days from loading), so move it to seven days from the day
it is switched on; and check the audience (UK, 25 and over, Advantage+) and
the budget (£5 a day).

## Switched on: the paid test (12 November 2026)

Justin chose the paid test and said yes to the exact terms: the five adverts,
one ad set, £5 a day until 19 November at about 11:08, about £35 at most, on
the Visa ending 2258, paid as THE SOCIAL BILLBOARD LTD. Meta had passed all
five in review. Campaign, ad set and adverts switched on and confirmed ACTIVE.
This breaks the free first rule knowingly, at a capped cost; the uploader
still only ever creates adverts switched off.

The Monday loop on 16 November reads it first; the verdict needs 300 reached
per card. The test ends on its own on 19 November.

## A sixth card: mid match, the simple version (12 November 2026)

Seeing mid match at feed size, three things looked weak: about sixty words of
script at a size near the edge of readable (Qustodio's proven statics carry
about eight words), the button drawn on the card repeating the button Meta
adds underneath, and the scene mostly hidden behind the script. Justin said
go ahead with a simpler version in the same test.

`06-mid-match-simple.png`, code `r1-mid-match-simple`:

- Same headline and scene.
- The screen is only the opening of the script, SAY THIS and its first
  sentence, about twice the size. It is a real capture of the same live page
  at 365 points wide, a real phone width, chosen because at that width the
  first sentence ends exactly at the end of a line, so the crop cuts no word
  and hides nothing mid line (`capture.mjs --width 365 --lines 3`). The line
  is the opener rather than "Before you start, we agree how many matches",
  because no phone width breaks that one cleanly.
- The hook is set as words, not a drawn button (`"cta": "text"`), word for
  word as before, so the gate still checks it.
- Butter 3.0 percent. Gate passed. Vision pass 9 of 10 (line 10 is Justin's).
  Benchmark 8 of 8 against Qustodio's 4.

It shares the ad set's £5 a day, so the test costs the same. This card tests
the treatment, not the hook, so it is read against mid match only: if simple
wins there, Round 2 is built simple.
