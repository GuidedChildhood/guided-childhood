# 1.4 When screens make you sad: the curriculum lens

Panel review for the animated remake, 18 November 2026. Read only: nothing else was edited.

**The question.** Does the film teach the right message, completely and accurately, for ages 4 to 7,
measured against what the government asks for?

**The two versions read.**

- **Original**: the live film as voiced again by Isla, 51 lines, `content/child-films/1.4-release/isla-lines.json`
  (times from `film.json`). Cited below as O plus the line index and time, for example O18 (1:51).
- **Remake**: `content/child-films/parent-reaction-series/1.4-feeling/child-film-script.md`, words as
  recorded in `build/lines.json`, 23 lines. Cited as the line id, for example c19.

**Builds on, does not repeat.** `plans/2026-11-18-digital-curriculum-review.md` scored the scheme and
named three musts for the schools lessons. None of those are reopened here. Two of its shoulds touch
this film: the speaking friend for Reception and KS1, and mapping Reception to the EYFS framework. This
film is a step towards the first, and the EYFS row in the table below is the second, for this one topic.

**What the film is, in curriculum terms.** It is not itself held by `scripts/check-rshe-coverage.mjs`,
which checks school lesson slides. The statutory rows it reinforces at home are carried in school by
`eyfs-01-screens-kindness` and `ks1-02-kind-screens-calm-bodies` (RSHE P OSA 6, P WO 11, P BS 6, P GW 9
in `shared/schools-rshe-2026.ts`). So the bar is: does the home half teach the same thing the school
half is credited with, accurately, and does it leave a child with any gap the guidance names? Nothing
here moves the 57 rows.

## Primary sources, opened today

- DfE, *Relationships Education, RSE and Health Education*, statutory guidance for introduction
  1 September 2026 (the gov.uk page records it came into effect that day).
  https://www.gov.uk/government/publications/relationships-education-relationships-and-sex-education-rse-and-health-education
  PDF read in full text: Online safety and awareness and Being Safe on printed page 10; Mental
  wellbeing on page 21; Where and how to seek support on page 22.
- DfE, *National curriculum in England: computing programmes of study*, key stage 1.
  https://www.gov.uk/government/publications/national-curriculum-in-england-computing-programmes-of-study/national-curriculum-in-england-computing-programmes-of-study
- UKCIS, *Education for a Connected World*, 2020 edition (gov.uk, added 30 June 2020).
  https://www.gov.uk/government/publications/education-for-a-connected-world
  Ages 4 to 7 band read from the PDF: Self image and identity (page 5), Online bullying (page 20),
  Managing online information (page 25), and the glossary entry for trusted adult.
- DfE, *EYFS statutory framework for group and school based providers*, from 1 September 2026, ELG
  Self Regulation (for the Reception children in the 4 to 7 band).
  https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2

## 1. Requirement by requirement

Fully, Partly, Not at all. The quoted line is the one that meets it.

| # | Requirement (source) | Original | Remake |
|---|---|---|---|
| 1 | The internet holds content that is inappropriate and upsetting for children, and where to go when worried (RSHE P OSA 6) | **Fully.** O11 to O13 (1:08 to 1:21) name the kinds of thing; O18 (1:51) "if your tummy does not say anything, but something still seems wrong, you can still turn it over and tell" covers the inappropriate thing that does not upset; O26 (2:28) "Go and tell your grown up" | **Partly.** c08 "something on a screen gives you an uh oh feeling. It might be sad, or scary, or it just feels wrong". The only trigger to act is the feeling (c12 "When you get the uh oh feeling, here's what to do"), so inappropriate content that does not upset has no route |
| 2 | Recognising the triggers for seeking support (RSHE P GW 9) | **Fully.** O14 to O18 (1:29 to 1:51): the uh oh feeling, the body signs, and the fallback when the body says nothing | **Partly.** c09, c10 "That's your body saying uh oh". Body signs only, no fallback |
| 3 | Report a concern about something seen online, with the vocabulary and confidence to do so (RSHE P BS 6) | **Fully.** O27 (2:35) "You don't have to work out why the feeling came"; O30 (2:58) gives the child the sentence: "Something on the screen made me feel yucky"; O31 (3:03) models the reply "Thank you for telling me" | **Partly.** c14 "Find your grown up, and tell them what you saw." Confidence yes, words no, and it asks a four year old to describe the thing |
| 4 | Ask for help and keep trying until heard; advice from family, school and other sources (RSHE P BS 7) | **Not at all.** Only ever "your grown up" | **Not at all.** Only ever "your grown up" (c14, c20) |
| 5 | Not always right to keep secrets that relate to being safe (RSHE P BS 2) | **Not at all** | **Not at all** |
| 6 | Recognise harmful content or harmful contact, and how to report it (RSHE P OSA 2) | **Partly.** O13 (1:21) "Maybe someone says something unkind in a game" brings contact in | **Partly.** Content only: every line is about "something on a screen" |
| 7 | Use technology safely; identify where to go for help and support when they have concerns about content or contact (KS1 computing) | **Partly.** Content and contact both named (O12, O13); one place to go | **Partly.** Content only; one place to go |
| 8 | Positive and negative aspects of the internet (RSHE P WO 1) | **Fully.** O10 (1:02) "something funny and our tummy feels happy"; O11 "But sometimes, not very often" | **Fully.** c07 "Most of the time, screens are fun. Songs, and games, and stories." |
| 9 | Recognise feelings and use varied vocabulary for them (RSHE primary Mental wellbeing 4); show an understanding of their own feelings (EYFS ELG Self Regulation) | **Fully.** O12 (1:15) "A bit wobbly. A bit sad. Or a bit worried."; O49 (4:58) "all your feelings are okay" | **Fully.** c06 "Happy, sad, excited, worried. All feelings are okay."; c09 "A wobbly tummy. A hot face. A heart going fast." |
| 10 | EfCW 4 to 7, Managing online information: "I know how to get help from a trusted adult if we see content that makes us feel sad, uncomfortable worried or frightened." | **Fully.** O24 to O26 (2:19 to 2:28) | **Fully.** c12 to c15 |
| 11 | EfCW 4 to 7, Self image and identity: speaking to "an adult I can trust and how they can help" | **Fully.** O35 (3:33) "when you tell your grown up, they can help you feel better" | **Fully.** c20 "Your grown up helps you carry it." |
| 12 | EfCW glossary, trusted adult: "It is important that young people have a number of trusted adults" | **Not at all** | **Not at all** |
| 13 | EfCW 4 to 7, Online bullying: "I can describe ways that some people can be unkind online." (the strand `plans/curriculum-matrix.md` files this lesson under) | **Partly.** O13 (1:21) | **Not at all** |
| 14 | Never in trouble for telling, including when a rule was broken (the safeguarding message `ks1-02` calls "the single most important" at this age; the 1.4 row in migration 050 says the lesson exists to break the belief that a bad feeling means the child was naughty) | **Fully, implicitly.** O32 (3:11) "You are never in trouble for telling me"; O34 (3:24) "A yucky feeling doesn't mean you did something wrong"; O37 said by the grown up | **Fully, explicitly.** c19 "You will never be in trouble for telling. Even if you were watching something you weren't meant to." Pause card 2 is said by the grown up |
| 15 | Rehearse, retrieve and check (the house teaching spine, Rosenshine arc) | **Fully.** Catchphrase three times O40 to O42 (4:09); the High Five game with a real screen turned face down O44 (4:27); a check, O46 (4:43) "show your grown up one thing you remember" | **Partly.** Catchphrase c15, c21; game rehearsed with hands c16, c17; no check at the end |

Where both versions agree, the message is right: notice the feeling, turn it over, go and tell, never
in trouble. Nothing either version says is wrong. The gaps are things left out, and the remake left
out four things the original had.

## 2. What is missing or wrong, ranked

### Must (two)

**M1. The remake only acts on a feeling. Bring back the original's fallback.**
The remake makes the uh oh feeling the only reason to turn it over and tell. The guidance asks for
content that is "inappropriate and upsetting" (P OSA 6) and for recognising the triggers for seeking
support (P GW 9). Inappropriate is not always upsetting: a sexual image can feel curious, a friendly
stranger can feel lovely, and grooming works precisely because it does not feel wrong. A DSL reading
the remake would mark this down. The original already solved it at O18 (1:51). Add after c10, in
the remake's voice: "And if your tummy says nothing, but something still seems wrong, you can still
turn it over and tell." One line.

**M2. Both versions name only one grown up.**
The guidance asks children to "keep trying until they are heard" and names "family, school and/or
other sources" (P BS 7). EfCW says children need "a number of trusted adults". The KS1 computing
statement is "where to go for help", not who. And our own `ks1-02` already teaches it: its hard
question "My grown up gets cross when I ask" is answered "Then we find you a different grown up",
and its talk task has children name a real grown up at home and at school. A child who sees
something at a friend's house, at Grandma's or at school, or whose grown up is the problem, leaves
this film with nowhere to go. A PSHE lead would mark it down. One line after c14: "If your grown up
is busy, tell them again, or tell another grown up you trust. At home, at school, anywhere."

### Should

**S1. Give the child the words (remake).** P BS 6 asks for "the vocabulary and confidence". The
remake's c14 "tell them what you saw" asks a four year old to describe the thing, which is the hardest
part when it was frightening or embarrassing, and it sits oddly beside the remake's own rule that the
thing is never described. The original's O27 and O30 fix it: you do not have to work out why, and here
is your sentence. Change c14 to: "Then, go and tell. You don't have to explain it. You can just say:
something on the screen gave me an uh oh feeling." Hearing the grown up's reply ("Thank you for
telling me", O31) also builds the expectation of safety; it lives in the parent film now and is worth
one line in the child's.

**S2. Name contact as well as content (remake).** The KS1 computing statement is "concerns about
content or contact", P OSA 2 says "harmful content or harmful contact", and the matrix files this
lesson under Online bullying, where the 4 to 7 statement is that some people can be unkind online.
The original's O13 "Maybe someone says something unkind in a game" covered all three. The remake
dropped it. Add it back to c08 as one example among the three, with no detail.

**S3. Secrets (both).** P BS 2: "it is not always right to keep secrets if they relate to being safe".
Secrecy is the lever an adult uses on a child this age. `ks1-33` teaches it in school, so this is
reinforcement, not coverage, but it costs four words on c19: "Even if someone said keep it a secret."

**S4. A check at the end (remake).** The house spine ends with proving, and the original did it
(O46). The remake recaps but never asks the child to show anything. Before the goodbye: "Show your
grown up what we do. Turn it over. Go and tell!" The two live pause cards stay as they are.

**S5. One routine for one move, across the lesson around the film.** At ages 4 to 7 the same move is
taught four ways: "Stop, look, ask a grown up" (`eyfs-01`), "Feel it, name it, tell a grown up"
(`ks1-02`), "stop and tell" (the keyword slide added to this very lesson by
`supabase/migrations/240_foundation_school_arc.sql`), and the film's "Turn it over. Go and tell!".
A subject lead looking at the home and school link would ask which one the child is meant to know.
Keep the film's catchphrase, which is the most concrete of the four, and align the 240 keyword slide
to it. The schools lessons wait for the term review, as CLAUDE.md asks.

### Could

- **C1. Big screens.** "Turn it over" does not work on a telly or a laptop. "Turn it over, or look away
  and walk away" covers both, and still leaves the thing where the grown up can see it.
- **C2. Rehearse with an object.** The remake's game turns hands over (c16). The original turned a real
  screen face down (O44) and the lesson's own try it slide uses a cushion as a pretend screen. A real
  object is the better rehearsal.
- **C3. Not your fault.** The lesson's prove slide teaches "Not mine, screens sometimes just show
  things" (migration 240). c19 covers the child who was somewhere they should not be; the child to whom
  it simply popped up deserves one line too.
- **C4. Original only, if it stays live while the remake is made.** O38 (3:57) "They'll remember it
  forever" is a promise about the child, already flagged in the 1.4 release README. O15 (1:32) "When
  something isn't right, your body tells you" overclaims, though O18 repairs it.
- **C5. Data tidy.** The 1.4 row in `supabase/migrations/050_parent_lessons_seed.sql` files the lesson
  under Health, wellbeing and lifestyle; `018_curriculum_matrix.sql` files it under Online bullying.
  Pick one. The film's content fits Health, wellbeing and lifestyle and Managing online information
  best; S2 is what earns the Online bullying label.
- **C6.** c20 "the uh oh feeling gets smaller" is a gentle claim. "Can get smaller" is the safer verb.

## 3. Learning intentions for the remake

Keep the special word FEELING, the catchphrase "Turn it over. Go and tell!", and both live pause cards.

**Knowing.** Most of the time screens are fun. Sometimes something on a screen, or something someone
says in a game, gives me an uh oh feeling, or just seems wrong. When that happens I turn it over and go
and tell. I have more than one grown up I can tell.

**Feeling.** All my feelings are okay. I am never in trouble for telling, even if I was watching
something I was not meant to, and even if someone said keep it a secret.

**Doing.** I can turn a screen over or walk away from it, find a grown up and say "Something on the
screen gave me an uh oh feeling." If they are busy, I tell them again or tell another grown up.

Every clause has a line in the table above to prove it once the fixes are in.

## 4. Which version to build the animation on

**The remake, with five lines carried across from the original.**

The remake is the better spine. It is shorter and cleaner for a four year old, it sits in the Pebble
and DiGi house look the animation will use, it never shows or describes the upsetting thing, it says
"even if you were watching something you weren't meant to" out loud (the single most important line
at this age, and only implicit in the original), it gives the promise to the grown up to say, and it
ends on the routine rather than a promise about the child.

But in tightening, the remake lost most of what made the original curriculum complete. Carry these
across, and add the two the original never had:

| Carry across | From | Fixes |
|---|---|---|
| "if your tummy does not say anything, but something still seems wrong, you can still turn it over and tell" | O18 | M1 |
| "Maybe someone says something unkind in a game" | O13 | S2 |
| "You don't have to work out why the feeling came" | O27 | S1 |
| The child's sentence, "Something on the screen made me feel yucky", and the reply "Thank you for telling me" | O30, O31 | S1 |
| "show your grown up one thing you remember" | O46 | S4 |
| New: tell another grown up you trust, at home, at school, anywhere | none | M2 |
| New: even if someone said keep it a secret | none | S3 |

That is about seven short lines, roughly twenty seconds of film, and it lifts the remake from partly to
fully on every statutory row this film should touch.
