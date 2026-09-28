# Should people wear smart glasses? The third free standalone lesson

Written 26 September 2026, before building. Justin, from his phone, after
Votes for Schools sent the results of their smart glasses vote (7 to 14
September 2026, 58,767 pupils):

> "Ok to reply still and let's do a doc as not able to record vid and give
> lesson teaser and make it a free lesson with Planet Bloop animation
> explaining the required responses. Can we add on the new Meta launch of
> products, research them as we could be ahead of the game."

And earlier the same day: "Don't use the flower icons, use Happy News style
icons."

## What was decided, and by whom

| Decision | Who | Where it lands |
| --- | --- | --- |
| A written reply instead of the video, as a doc Justin sends Penny | Justin | Claude Doc "Smart glasses: our reply to Votes for Schools" |
| The lesson is free, and it is the third standalone lesson | Justin | `schools/lib/taster.ts`, the last of the three free slots the taster wall allows |
| Years 5 and 6, the question the primary pupils were asked | Recommended, not overruled | `year_band`, the free bar |
| Bloop hosts, and a Bloop animation explains the responses | Justin | a Bloop beat in code with the exact words, plus a Bloop clip |
| Drawn Happy News icons, not emoji | Justin | the player gains an `icon` field |
| Meta's newest glasses researched and in the lesson | Justin | the teach cycle on what they can do, and the doc's research section |

## The lesson

`content/standalone/should-people-wear-smart-glasses.json`, module id
`should-people-wear-smart-glasses`, key stage KS2, Years 5 and 6, sort order
902, migration **356** (the highest on main is 354 and 355 is this branch's).

**The tool is the three responses the pupils asked for: ask, say, tell.**

- **Ask** before you film or photograph anyone, and a no means no.
- **Say** "please stop filming me" if someone films you and you do not want it.
- **Tell** a trusted adult if it does not stop, or it happens somewhere private.

That is what "explaining the required responses" means in this plan: the
responses are the tool, and Bloop teaches them. The lesson never says glasses
are good or bad (non negotiable 1); it gives a way to think and the words.

The arc, Rosenshine as every lesson:

1. Title (Bloop's intro), mission, Bloop's arrival.
2. Starter: what they already know about cameras and asking, a discussion
   with what a good answer sounds like, and the retrieval quiz.
3. Keywords, three or four, one new per concept slide at most.
4. Cycle one, **what they can do**: camera, microphone, speakers, an AI that
   sees what you see, and Meta's newest with a screen in the lens. The vote's
   headline results, credited.
5. Cycle two, **the good and the worries**: translation and help for blind and
   partially sighted people, against filming without asking, roads, tests,
   data and letting them do our thinking. The pupils' own words as quote
   slides, credited.
6. Cycle three, **ask, say, tell**: the Bloop animation, where a camera does
   not belong (the law on toilets and changing rooms, exam rules, roads), and
   a choice.
7. Practise: the class writes its own smart glasses rules, the way the pupils
   who voted did, and a sort of situations.
8. Prove: three choice questions. Recap. Bloop's mission to take home. DiGi
   closes.

## The Votes for Schools material

The headline results are on their public results page. The longer comment
list came in Penny's email, so the doc asks her permission to quote it. The
lesson is built with the comments in; **if she says no, the quote slides
swap to the public results page quotes before the free link is shared.**
Every slide that uses their material carries the credit line.

## The plumbing

- `schools/lib/taster.ts`: the third id and title, and a year band per
  standalone lesson, because the free bar says "Year 8 or Year 9" in code and
  its "Also free, for the same classes" line assumes one year group.
- `schools/app/taster/StandaloneBar.tsx`: the year band from the list, and
  the other lessons named with their years.
- `schools/app/print/page.tsx`: the print room lists the manifest's lessons,
  not "every row that is not standalone", so a row applied before its code
  merges never shows up in the scheme's print room.
- `scripts/check-taster-wall.mjs` already caps the list at three. This is the
  third.

## The icons

The player draws emoji on concept slides, diagram steps and scenario cards.
Add an optional `icon` naming a `HappyIconName`; when present the player
draws the Happy News icon instead. Only this lesson uses it, so no other
lesson moves. New drawn icons as the slides need them (smart glasses, a
camera), in the same hand as the set.

## The Bloop animation

Two layers, because they do different jobs:

1. **In code, free, exact words.** A Bloop beat (the `digi` slide type with
   `character: bloop`): Bloop arrives, and ask, say, tell appear one by one in
   Bloop's bubbles. The words are the lesson's, so they are exactly right,
   readable at the back of the room, and need no transcript.
2. **A short Bloop clip**, the same way the ks2-07 clip was made: Seedance 2.5
   in omni reference mode against the published Bloop art, 1080p, about 108
   credits for 12 seconds. Balance on 26 September: 2,957.
   - The voice: the bible decided on 22 September that each friend gets a
     generated voice locked to an id, and Bloop's is still "to be set". So the
     clip is **silent**, Bloop acting out asking first, and the beat that
     follows carries the words. A speaking clip waits for Bloop's voice id.
   - Checked scene by scene before it is wired, as every clip is: on model,
     no stray words, nothing a Year 5 should not see.

## The evidence

Two research agents: Meta's 2026 launches, and the UK evidence (filming law,
permission, school phone guidance, exam rules, the Highway Code, eyesight,
accessibility, translation). Then adversarial verification of every claim
that reaches a slide, the teacher notes or the doc, as for the entrepreneur
lesson. Each pinned claim goes into `check-source-claims.mjs` with a mutation
test that proves it fires.

## Verification before it ships

Contract (standalone mode), rubric, source claims, taster wall, wall fit at
1920 and 1366, helplines, schools typecheck, the CI node steps, context
guard. Production: guarded insert, hash proof. Render the free link and the
slides at 1440 and 390 with no school code.
