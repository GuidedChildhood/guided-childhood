# Child film inventory and release list

14 November 2026. Prompt D of
`plans/2026-11-14-answer-series-email-courses-and-child-films-plan.md`.
Nothing here was uploaded, released or published.

## The answer in five lines

1. **Ten finished child films exist.** They are the ten Stage 1 watch together
   films, ages 4 to 7, four to five minutes each. All ten are live in the
   product today.
2. **Nothing else is a finished film.** The 21 module scripts, the five Stage 2
   films and the five graduation films are scripts. Sixteen short clips (5 to
   12 seconds) are finished, but they are lesson openers, not films.
3. **Four of the ten are clean enough to release as they stand**, and a fifth is
   close. They happen to be the first five in journey order, so they can go out
   as a series without breaking the recap at the top of each one.
4. **Three need remaking** before any public release: 1.6 sleep, 1.9 voices and
   1.10 the Yes No button.
5. **No film is ready for YouTube or the family account today.** Every one is
   landscape only, none ends at the stage check, and each closes on a line that
   promises something for the child.

## Justin's decisions, 14 November

1. The first five go out in the look they have now. A remake can replace them later.
2. The closing promise to the grown up is cut from the public versions.
3. One full test on 1.3 first: `content/child-films/1.3-release-test/`.
4. Remakes start after the first five are out, with 1.6 first.

## How these were checked, and the limit of it

- Every file was downloaded from where the live product plays it, and the links
  were confirmed against the live `parent_lesson_segments` rows (read only).
- Each of the ten films: one frame every 12 seconds looked at by eye, the whole
  narration transcribed by machine and read, and the picture and sound scanned
  for frozen or silent stretches.
- **Not done: nobody listened.** The voice, the music level and how "DiGi" is
  pronounced were not judged by ear. The transcripts are machine made, so a
  quoted line may be a word out. One person should watch 1.1 right through
  before anything is released.

## 1. Finished films, watched

All ten: 1920 by 1080, 30 frames a second, sound, narrated by DiGi, captions
burned in as short labels. Stored on the generator's CDN
(`d2ol7oe51mr4n9.cloudfront.net`), played in the product from `parent_lessons`
and `parent_lesson_segments` (Watch together tab). Each also exists cut into
three parts, A, B and C, with the pause cards between them.

Listed in journey order, which is the order a family meets them.

| Step | Code | Title | Length | Skill it teaches | Routine the child practises | Matches the live lesson | Release as it stands |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 1.1 | Me on a screen and me in real life | 5:15 | A photo shows a tiny slice, the real you is more | Say no and tell my grown up. The mirror game | Yes | **Yes** |
| 2 | 1.5 | Real or pretend? | 4:16 | Some things on screens are made up | Ask the magic question, "Is this real?" | Yes | **Yes** |
| 3 | 1.2 | Kind words on screens | 5:00 | Words land on a real person | Pick the warm words. Send one kind message with a grown up | Yes | **Nearly.** Last 25 seconds change drawing style |
| 4 | 1.4 | When screens make you sad | 5:08 | Notice the uh oh feeling in your body | Turn it over, go and tell. The high five game | Yes | **Yes** |
| 5 | 1.3 | The internet remembers | 4:02 | What you send can stay | Stop. Ask. Then share. Make the sign | Yes | **Yes** |
| 6 | 1.7 | My privacy shield | 4:52 | Four things stay private: name, home, school, photo | Check with your grown up first. Draw the shield | Yes | No. DiGi drawn as a robot, one patched scene |
| 7 | 1.8 | Someone made that | 4:42 | Everything on a screen had a maker | Ask first, say their name. Make it and name it | Yes | No. Ends cut off in the middle of the last line |
| 8 | 1.6 | Screens, sleep and growing bodies | 4:37 | Sleep is growing time | Screens go to bed first. Bath, story, cuddle | Yes | **No. Remake** |
| 9 | 1.9 | Some voices are not people | 5:09 | A machine voice is not a person and can be wrong | Ask "person or machine?" Feels odd, go and tell | Yes | **No. Remake** |
| 10 | 1.10 | The Yes No Button | 4:48 | Pressing yes is a promise | Ask before you press yes. The pop up game | Yes | **No. Remake** |

"Matches the live lesson" means the title, the special word and the catchphrase
in the film are the ones in the live row. The quiz cards were not compared.

All ten suit ages 4 to 7 watched with a grown up. None suits an older child.

### What is true of all ten

1. **They are illustrated stills with a slow zoom, not animation.** A new
   picture every 8 to 12 seconds. Calm and readable, and it looks like a
   storybook, not a cartoon.
2. **They are not in the house look.** Pencil sketch on white with a boy in a
   blue hoodie. No cream ground, no Planet Friends. This predates the recast.
3. **DiGi changes shape.** A gold star on the opening card of every film, then
   a robot with a screen for a face (1.6, 1.7), a blue and an orange blob
   (1.8) and a blue ball (1.9). The rule is that DiGi is never a robot.
4. **Each opens by recapping the one before** and closes "see you next time".
   Fine in the product. In public they only make sense in order.
5. **None ends at the stage check.** Rule 1 asks for it on every public piece.
6. **Each closes with a promise to the grown up about the child.** For example
   "something they'll keep for life" (1.1), "a question they'll use for the
   rest of their life" (1.5), "a shield they'll carry for life" (1.7), "you
   know more about screens than most grown ups" (1.9, said to the child). Rule
   2 says we never claim an outcome for a child. These have been live in the
   product since July. Whether they go public as they are is Justin's call.
7. **Landscape only.** No vertical cut, no subtitle file, no thumbnail.

## 2. Finished clips, not films

Real, rendered, and playing in lessons today, but each is one beat of 5 to 12
seconds. None teaches a skill on its own.

| What | Count | Length | Where it lives | Seen |
| --- | --- | --- | --- | --- |
| School lesson video slides, 3D style, Planet Friends and DiGi in a classroom, spoken | 11 | 8 or 12 seconds | `schools/public/clips/` in this repo | All 11 watched and transcribed |
| Planet Friend intro loops | 5 | 5 seconds, square | Generator CDN, listed in `shared/intro-characters.ts` | All 5 fetched. Three have sound, two are silent |

The eleven lesson clips: six in the Year 7 to 9 misinformation lesson, one each
in real or pretend (KS1), screen routines, algorithms and privacy (KS2), and one
in the smart glasses lesson. They are on model and in the new cast. Two of them
show generated children's faces in a classroom. They are plainly cartoon
children, so no rule is broken, but it is worth a look before any goes on a
public account.

## 3. Scripted only. Not films

| What | Count | Where | State |
| --- | --- | --- | --- |
| Module explainer scripts, ages 4 to 18 | 21 | `content/lesson-scripts/*.md` | Scripts. None rendered. They are also written for the retired cast (Sofia, Zara, Oliver, Vix, Brock), so they need recasting before any render |
| AI additions | 1 new lesson, 2 uplifts, 1 parent lesson | `content/lesson-scripts/ai-panel-additions.md` | Scripts |
| Stage 2 watch together films, ages 8 to 10 | 5 | `content/lesson-scripts/stage-2-films/` | Scripts. Their own README says nothing has been rendered |
| Graduation films, one per stage | 5 | `content/graduation/` | Scripts. No render found |

## 4. Failed or damaged

- **1.10, 1.2 and 1.7** lost stretches of picture and were repaired on 1
  September with new still drawings
  (`content/packs/2026-09-01-lesson-video-rerender/production.md`). The repair
  works but the new drawings are in a different style, and it shows. 1.10 has
  three such stretches, including its opening 12 seconds.
- **1.8** stops on "Remember. Screen." The closing line is cut off.
- **1.9** calls itself "our very last adventure" and says "all nine
  adventures", but it is step 9 of 10 and 1.10 then says ten.
- **About nine July clips of the retired children.** Recorded as kept for
  history and playing nowhere. NOT REACHED: no file or link found.

## 5. NOT REACHED. Never counted as checked

| What | Believed to be | Why not reached |
| --- | --- | --- |
| Year 3 languages lesson 1, Spanish and French teach along films, about 5 minutes each | `videos/2026-10-09-languages-y3-lesson1/renders/es.mp4` and `fr.mp4` on the machine that built them | Render folders are not kept in git. The source clips are in the repo, the finished films are not. Unknown whether they were ever rendered to the end |
| Planet Friends music video | `videos/2026-10-16-planet-friends-mission-control/` renders, same machine | Same reason. No render in the repo |
| The celebration clip in `lib/content/celebration-media.ts` | Generator CDN | Seen in code, not fetched or watched |
| Anything in Google Drive | Drive | One search of video files by title found only the GDC 058 post film. That is one search, not a full check of Drive |
| Anything already on YouTube or the family account | The channels | No access from this session. Unknown whether any child film has ever been posted |
| The Higgsfield project library | Higgsfield account | Not opened. Original project files for the ten films, if they exist, would be here |

The two brains film, the Ready series, the DiGi shorts and the walkthrough
Reels are for parents, so they are outside this inventory.

## 6. The five to release first

Journey steps 1 to 5, in that order: **1.1, 1.5, 1.2, 1.4, 1.3.**

Why these:

- They are the cleanest five. Four have no fault that was found, and 1.2 has
  only a change of drawing style in its last 25 seconds.
- In all five DiGi stays the gold star.
- They are the first five a family meets, so each film's opening recap points
  at the film released before it. No re editing is needed to make the series
  make sense.
- Between them they carry the heart of the philosophy for a small child: tell
  a grown up, you are never in trouble for telling, ask before you share.
- 1.1 has no recap at all, so it stands alone as the first upload.

### Parent notes

**1.1 Me on a screen and me in real life.**
Your child just learned that a photo shows only a tiny slice of a person, and
that if anything on a screen makes them feel funny inside they can say no and
come to you. Tonight, ask: "If something on a screen made you feel funny
inside, what would you do?" Then cheer the answer.

**1.5 Real or pretend?**
Your child just learned that some things on screens are made up, even when they
look real, and that the clever thing is to ask. Tonight, when they ask "Is this
real?", say: "Good question. Let's look together."

**1.2 Kind words on screens.**
Your child just learned that a message lands on a real person with real
feelings, and that if someone is unkind it is never their fault. Tonight, ask:
"Who shall we send one kind message to?" Then send it together.

**1.4 When screens make you sad.**
Your child just learned to notice the uh oh feeling in their tummy, turn the
screen over and come and find you. Tonight, say: "You will never be in trouble
for telling me." Then keep that promise the first time it is tested.

**1.3 The internet remembers.**
Your child just learned that what we send can stay, so we stop and ask before
we share. Tonight, say: "Stop. Ask. Then share. Shall we make our sign?"

These notes also suit day 6 of a topic's seven day email course, the child's
side of it.

### What each channel needs, and what is missing

The same for all five unless a row says otherwise.

| Channel | Format it needs | Have | Missing |
| --- | --- | --- | --- |
| **Inside the product** | The film in three parts with pause cards, 16:9 | Everything. All five are live now | Nothing. The parent note above could be added beside each film |
| **YouTube** | 16:9, 1080p, sound, a thumbnail, a title and description, a playlist in journey order | The 1080p file | (1) An end card at the stage check, built into the film, because a video marked as made for kids cannot carry end screens, cards or comments. Please confirm that on the channel before relying on it. (2) A decision on the closing promise line: leave, or cut the last sentence. (3) A thumbnail in the house look. (4) A checked subtitle file. A machine transcript exists for each, unchecked. (5) The made for kids setting chosen, since these are plainly for under sevens. (6) A channel to put them on |
| **Family account, Instagram and Facebook** | Vertical 9:16 (or 4:5 in the feed), about 60 to 90 seconds, readable with the sound off, ending at the stage check | Nothing in this shape | (1) A short cut. The natural one is the "one big thing" in the first 90 seconds. (2) A vertical frame. The drawings sit in the middle of the picture, so they can be placed on a cream ground with the caption below, no redraw. (3) Full captions, since the burned in labels are only keywords. (4) The stage check end card. (5) The family voice caption and the parent note as the post text |

Per film:

| Film | Extra work before public release |
| --- | --- |
| 1.1 | None beyond the table |
| 1.5 | None beyond the table |
| 1.2 | The last 25 seconds are in a different drawing style. Acceptable in the product. For YouTube either accept it or redraw three pictures to match |
| 1.4 | None beyond the table |
| 1.3 | None beyond the table. Shortest of the five, a good one to test the vertical cut on |

## 7. The three that most need remaking

**1.6 Screens, sleep and growing bodies.**
The phone is drawn as a grinning face on fire with a frightened teddy beside
it. That scares a small child and makes the screen the villain, which is the
opposite of our message. DiGi's helper is a robot with a screen for a face. It
also states as fact that sleep is when the body does "its most important
growing" and that "screens shine like the sun", with no source on screen. The
routine itself, screens go to bed first, then bath, story, cuddle, is good and
should be kept.

**1.9 Some voices are not people.**
It says it is the last adventure and counts nine, when a tenth follows. DiGi
is a blue ball in the very film where DiGi explains what DiGi is. And it is the
AI lesson, the subject that has moved most since July and the one parents will
judge us on. It tells the child they "know more about screens than most grown
ups".

**1.10 The Yes No Button.**
Three repaired stretches in a different drawing style, including the first
thing a family sees. It ends "see you on the next path", and the next path,
Stage 2, has no films yet.

Close behind: **1.8** needs only its last line re exported, and **1.7** needs
the robot redrawn as the star.

A remake should be in the Planet Friends look so the Stage 1 films match the
school clips and the Stage 2 films when those are made.
