# Lesson quality review: videos, age fit, and the Common Sense gap list

Justin, 1 September 2026: "First 10 seconds of this lesson is black can we
check all lessons are the best for their age and reaches them in line with
school lessons just not as in depth review common sense curriculum and let's
copy what's missing from ours for each age."

Three jobs. The first is done, the second is a verdict, the third is a build
list awaiting a go.

## 1. The black video, found and fixed (done)

Every one of the 41 lesson video files was downloaded and probed frame by
frame. The fault Justin saw is real and it is in the exported files, not the
player: the video track starts late while the narration starts on time, so
the browser shows black until the picture arrives.

| Lesson | File | Fault |
| --- | --- | --- |
| 1.10 The Yes No Button | Part one | No picture 0 to 12.2s (the black Justin saw), and picture missing 21.6 to 49.7s (holds a frozen frame) |
| 1.10 The Yes No Button | Part three | No picture 0 to 17.1s |
| 1.10 The Yes No Button | full | Both faults above plus picture missing 217.1 to 235.0s |
| 1.2 Kind words on screens | full | Picture missing 263.9 to 289.0s (frozen frame, not black) |
| 1.2 Kind words on screens | Part three | Picture missing 47.5 to 72.5s |
| 1.7 My privacy shield | full | Picture missing 154.6 to 174.1s |
| 1.7 My privacy shield | Part two | Picture missing 25.3 to 44.7s |

The other 34 files are clean, including every file of lessons 1.1, 1.3,
1.4, 1.5, 1.6, 1.8, 1.9 and the explorer algorithm clip.

**Fix shipped for 1.10** (the only lesson that opened on black): the three
files were rebuilt with ffmpeg in the Higgsfield sandbox. The opening title
frame now holds from second zero until the animation arrives, the internal
hole is filled the same way, and the narration timing is untouched. Verified
picture from 0.0s and exact duration match, uploaded to the same CDN, and
the `parent_lesson_segments` rows for 1.10 A, C and full now point at the
fixed files. Part two was already clean and keeps its original URL.

**Re-rendered, 1 September 2026 (Justin: "Re render").** Every held frame
and frozen stretch across 1.10, 1.2 and 1.7 now carries real new picture:
the narration in each window was transcribed, a matching illustration was
generated in the existing style (clean frames from each video used as the
style and character reference), and each was spliced in with a gentle slow
zoom, audio untouched and verified bit identical. All seven files (1.10 A,
C and full, 1.2 C and full, 1.7 B and full) rebuilt, uploaded and repointed.
Full record in content/packs/2026-09-01-lesson-video-rerender/production.md.

**Player hardening:** `ParentLessonPlayer` now passes the lesson's
`poster_url` to the video element, so the box before pressing play shows the
lesson art instead of a black rectangle. This applies to every watch
together lesson at once.

## 2. Age fit against school lessons (verdict: sound, keep it)

The library is 81 live interactive decks across the five stages plus the ten
Stage 1 watch together video lessons. Checks made:

- **Structure is uniform and deliberately lighter than school.** Every deck
  is 7 to 8 slides with about 2 real choice questions, ten minutes, against
  a school lesson's 45. Text volume rises gently with age (about 3,500
  characters at Foundation to 4,700 at Independent). That is exactly the
  "in line with school, not as in depth" brief.
- **The strands mirror what schools teach.** The nine strands map onto the
  Education for a Connected World framework the school scheme is built on,
  and the Shaper social media course carries the named RSHE 2025 topics
  (consent and image sharing, deepfakes, scams, grooming, radicalisation).
- **Reading level fits the band.** Foundation decks speak in short concrete
  sentences ("Your body notices first, a funny feeling in your tummy");
  Shaper handles nudes, the law and sextortion in the calm, no shame,
  UK guidance aligned register. Spot checks across stages found no deck
  pitched at the wrong age.
- **We run ahead of schools on AI.** AI lessons exist at every stage from
  age 4 up; Common Sense only starts AI at 11 and most school schemes not
  at all.

## 3. The Common Sense curriculum, mapped, and what is missing (build list)

Common Sense Media's Digital Citizenship Curriculum is 73 lessons, ages 5 to
18, six strands taught every single year at rising depth. Full lesson by
lesson research is verified against their published scope and sequence and
their UK adaptation on Hwb. Mapping their lessons onto our five stages, most
of their ground is already ours. What is genuinely missing, by age:

**Foundation, ages 4 to 7 (2 gaps)**
1. Is this app safe to open? A traffic light judgement for a child facing a
   new game or site (their "Internet Traffic Light", age 5 to 6). Our stop
   and tell covers after something goes wrong; this is the before.
2. My online neighbourhood: belonging to an online community and what good
   members do (their "Who Is in Your Online Community?", age 7). We teach
   rules and safety, not yet belonging.

**Builder, ages 8 to 10 (4 gaps)**
3. Is seeing believing? Altered and staged photos at the age children start
   believing images (their grade 3 lesson). We cover filters at 11 to 12;
   Common Sense is right that 8 is when it needs to land first.
4. Reading news online: what a news story is, what an advert dressed as one
   is (their "Reading News Online", age 10). Our news literacy jumps from
   "Real or pretend?" at 6 to deepfakes at 13. This is the biggest strand
   hole in the library.
5. Keeping games fun: sportsmanship, rage and kindness inside game chat
   (their grade 4 lesson). Our friends lesson covers who, not how to play.
6. Boys, girls and the screen: gender stereotypes in games and videos
   (their grade 5 lesson). Nothing in our library touches stereotypes, and
   RSHE 2025 names misogynistic online culture as compulsory ground.

**Explorer, ages 11 to 12 (3 gaps)**
7. Finding credible news: source checking before sharing, at the age the
   group chat becomes a news source (their grade 6 lesson). Same strand
   hole as item 4, older rung.
8. Phishing and fake messages: the fake login, the too good offer, at the
   first smartphone age (their "Don't Feed the Phish"). Our "Spot the
   trick" is pitched at 8 to 10 and our scams lesson at 13 to 15.
9. Big big data: what companies collect and why the app is free (their
   grade 7 lesson). We teach "The deal you signed" at 13 to 15, after most
   children signed at 13.

**Shaper, ages 13 to 15 (2 gaps)**
10. Hate speech and where the line is: responding to it, not feeding it,
    the misogyny pipeline named (their grades 8 and 10 lessons plus RSHE
    2025). Our bullying lessons cover the pile on; hate as a category is
    uncovered.
11. Confirmation bias: why the feed agrees with you and how to argue with
    yourself (their grade 10 lesson). Pairs with our rabbit holes lesson.

**Independent, 16+ (1 gap, optional)**
12. The privacy line: the civic debate over safety versus surveillance
    (their grade 12 lesson). Nice to have; our coverage of the practical
    side is already strong.

Everything else on their scope and sequence is already covered by an
existing deck, often more directly than their version. Their strongest
design idea, the same strand returning every year a rung deeper, is already
our staircase model.

**Proposed build order:** 4 and 7 first (the news literacy hole, both
rungs), then 3, 8, 9 (the pre teen judgement cluster), then 10, 6 (the RSHE
2025 alignment pair), then 1, 2, 5, 11, and 12 last. Twelve decks in the
established 7 to 8 slide shape with sourced stats where a number is claimed.

**BUILT, 1 September 2026.** Justin said "Yes lessons" and all twelve went
live the same day via migration 236, sort orders 975 to 986: Foundation "Is
this app safe to open?" and "My online neighbourhood"; Builder "Is seeing
believing?", "Reading news online", "Keeping games fun" and "Boys, girls
and the screen"; Explorer "Finding news you can trust", "The bait message"
and "What the app knows about you"; Shaper "When banter becomes hate" and
"Why the feed agrees with you"; Independent "The privacy line". Every deck
follows the house 7 slide arc (title, objective, two teach concepts or a
scenario, practise choice, prove choice, DiGi close), choice option counts
rise with stage, retrieval hooks open each deck by recalling the earlier
rung on the same strand, and no invented statistics: mechanisms are taught
instead of numbers, so nothing needs a citation to survive review. All 12
rows verified live in the database with 7 slide decks and zero dashes.
