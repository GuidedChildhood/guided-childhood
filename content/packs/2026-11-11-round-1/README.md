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
| `05-jobs-first.png` | Jobs first. Then their time. | The child's page: a job waiting, My time, 40 min ready | `r1-jobs-first` |

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
| Jobs first | 9 | 10 |

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

## Added later the same day: a picture behind the screen

Justin asked whether these match the finish of the adverts in the talk and of
the competitors' best. Compared against both
(`briefings/notes/competitor-sightings.md`, 11 November): the structure
matches, the picture was missing. `scene-proof/` holds the mid match card
again with a photograph of the moment behind the real script, in two
versions. The photographs are generated (GPT Image, 5.5 credits for the two,
agreed by Justin first): a sofa, a lamp and a controller, nobody in them. The
script on top is the same real capture.

These two are a proof of the look, not part of the round. They have no link
codes and are not to be posted. If Justin picks the look, all five cards get a
scene and the round is rendered again before anything goes out.

Open for Justin: card 5's hook. Kairoo began running "Jobs first. Then screen
time." on 6 November.
