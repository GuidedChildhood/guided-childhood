# The animation plan: a cast that behaves the same everywhere

Justin, 22 September 2026: longer animations for the video, which double as
short form, plus a film like introduction to the characters and what each one
specialises in, talking to camera, explaining every aspect of the school
service. Consistent jokes and behaviours. A master document. The best mini
series in the space.

**Nothing in this plan has been built or rendered. It is the plan and the
questions.**

---

## 1. What is actually animated today, counted rather than remembered

| Asset | Count | Made | Where it plays |
| --- | --- | --- | --- |
| Planet Friend intro loop clips | **5**, one per friend | 23 Jul and 30 Aug 2026 | `shared/intro-characters.ts`, the title slide of every lesson |
| Lesson video slides | **10**, across 5 lessons | all 11 Sep 2026 | ks3-12 has 6, ks1-03 / ks2-04 / ks2-06 / ks2-07 have 1 each |
| Expression stills | **15**, three moods per friend | 13 Sep 2026 | `CHARACTERS.moods`, drives `FriendPlate` |
| Motion written in code | every lesson | ongoing | `FriendPlate` GSAP registers, `DigiCharacter`, `star-breath`, slide reveals |
| Retired cast clips | ~9 | Jul 2026 | nothing, kept as history |

So **24 of the 29 lessons have no filmed beat at all** between the title and
the close. Everything filmed to date is 8 to 12 seconds. **No long form
animation exists.** Total filmed running time across the whole product is
roughly 100 seconds.

**One correction to the canon.** `digi-squad/README.md` says eight lesson video
beats still play the retired children and are being remade. That is no longer
true: every one of the 10 video slides was rendered on 11 September, after the
recast. The line is stale and is corrected in step A below.

## 2. What is already written, so this plan extends rather than repeats

Most of what Justin is asking for as a "master document" exists, in four pieces,
in two places, and they do not all agree.

| Document | Where | What it already carries |
| --- | --- | --- |
| **Video Production System v1**, 20 Sep 2026 | Drive | The strongest piece. Eight episode walkthrough series with full spoken drafts, five character entrance and introduction scripts, the SC01 to SC10 screen capture list, the DiGi brain explainer, per platform treatment, the quality gate, and an honest list of what must be verified before anything renders |
| Every lesson animated plan, 13 Sep | `plans/week-of-2026-09-14-...` | Prices the lesson series, sets the register ladder per key stage |
| Planet Friends animation system, 7 Sep | `plans/2026-09-07-...` | The treatment ladder, the recast |
| Animation Style Kit, Jun 2026 | Drive | House look |
| Character reference | `digi-squad/README.md` | **Mostly the retired cast.** Oliver, Zara and Sofia take four fifths of the file, and the voice rules, lesson architecture and "adding new lessons" sections all describe them. The Planet Friends get one table |

**The master document is therefore a consolidation job, not a writing job.**
The gap is not scripts. It is that the single source of truth for characters is
four fifths out of date, and that nothing anywhere defines how a friend
*behaves*.

## 3. What is genuinely missing

1. **A character bible.** The Drive doc gives each friend an entrance and an
   introduction. Nothing anywhere gives them a running joke, a prop they always
   carry, a physical habit, a thing they never do, or how they react to being
   wrong. That is the difference between one show and five adverts, and it is
   what "consistent jokes and behaviours" means in practice.
2. **Voice mapping.** The Drive doc states plainly it was never established.
   Nothing with speech can be rendered until each friend has a decided voice.
3. **The Bloop and Cosmo label mismatch** in the Higgsfield Elements list, flagged
   in the Drive doc and still open.
4. **Long form.** Every clip we own is 8 to 12 seconds. A film like introduction
   is a different craft: continuity, pacing, a cast that shares a frame.
5. **Credits.**

## 3b. The four decisions, 22 September

Justin, answering the questions at the foot of this plan:

1. **Credits are not the gate.** A new Higgsfield account is coming and the API
   will be connected to do the rendering. The instruction is "get ready now", so
   every step that does not need a credit is brought forward and the render
   packs are written so that connecting the account is the only thing left.
2. **The mini series is for parents and schools buying**, not for children
   learning. It lives on the site, LinkedIn and YouTube, and it matches the
   eight episode series already drafted in Drive.
3. **Justin appears in the parent and LinkedIn films only.** Child facing
   lesson animation stays pure cast. No real adult on a classroom wall.
4. **Generated voices, one per friend**, locked to a voice id recorded in the
   bible so they cannot drift between renders.

What that changes: the order below is now **everything free first, finished to
the point of rendering**, rather than a spend sequence. The money table stays
because the totals still decide how much gets made once the account is live.

## 4. The money, so nobody plans in adjectives

**Balance on the current account: 8.54 credits, Plus plan**, which is why
nothing is rendered from here. A new account is coming. Seedance 2.5 at 1080p
costs 72 credits for 8 seconds and 108 for 12, which is **about 9 credits per
second**, and that rate is what the totals below are built on.

| Piece | Runtime | Credits |
| --- | --- | --- |
| Five character entrances, 20s each | 100s | **900** |
| One film like cast introduction, 2 minutes | 120s | **1,080** |
| The eight episode walkthrough series, 60s each | 480s | **4,300** |
| Lesson animation, three 8s shots on each of 24 modules | 576s | **5,200** |
| **Everything** | ~21 minutes | **about 11,500** |

That is the honest headline. It is also why the build order below spends the
first credits on the pieces that get reused three times each.

## 5. The build, in the order it should happen

### A. The character bible, and one source of truth (free)

Rewrite `digi-squad/README.md` so the Planet Friends lead and the retired cast
is a short appendix. Add, per friend, the things nothing currently records:

- **The prop.** Pebble's upside down book, Bloop's controller, Orbit's oversized
  magnifier, Nova's crowding notification cards, Cosmo's folding checklist. All
  five already exist in the Drive entrances; they become canon.
- **The running joke.** One per friend, repeatable, never at a child's expense.
- **The physical habit.** What they do while listening, so they are alive in a
  held shot rather than a still with a mouth.
- **The never list.** Per friend, and one for the whole cast: no jokes during
  distress, abuse, exploitation or a crisis disclosure. KS4 and KS5 get restrained
  humour, not a preschool performance.
- **Reaction to being wrong.** The single most useful behaviour in a teaching
  character, and nothing defines it today.
- **Voice**: id, sample, pronunciation, and the one topic each friend owns.

This is the master document Justin asked for, and it is the input every later
step reads.

### B. Resolve the assets, once (free)

One consolidated list: the Bloop and Cosmo label mismatch, the five approved
character images, Justin's desk reference, and a decided voice per friend. The
Drive doc already says to do this in one pass rather than asking repeatedly.
Nothing renders until it is closed.

### C. One pilot, smallest possible spend

The Drive doc already names it: **E02, the 45 to 60 second Passport
demonstration**. One friend, one entrance, one real screen recording. About 540
credits. It settles the look, the voice and the pacing before anything is made
at scale, and if it is wrong we have lost one clip rather than twenty.

### D. The five entrances, which are the atom

Each 20 second entrance is three products at once: a standalone short, the
character's beat inside the film like introduction, and a lesson opener that
replaces the current silent loop. **Build the atom once, spend 900 credits, use
it three ways.** This is the single highest leverage spend in the plan.

### E. The film like introduction

Two minutes, the whole cast, built by cutting the five entrances together with
new connective material rather than filming from scratch. Talking to camera.
Ends on what the service actually does. Roughly 1,080 credits including the new
joins, less if the entrances carry more of it.

### F. The mini series and the lesson animation

Only after C to E are accepted. The eight episodes already have full spoken
drafts. The lesson animation is already priced and specified.

## 6. What would make it the best in the space

Nothing in the category has a **cast that behaves consistently across a
classroom lesson, a parent app and a short.** Oak and Project Evolve have no
characters. The commercial schemes have mascots that decorate. Our friends
already teach, carry a register that matures with the child, and change face
with mood. The mini series is worth making because it is the first time anybody
sees the whole cast at once, and the bible in step A is what stops it being five
unrelated adverts.

## 7. The questions, and the answers given 22 September

| Question | Answer |
| --- | --- |
| Where do the first credits go? | Not the gate. New Higgsfield account and API coming, get everything render ready now |
| Who is the mini series for? | Parents and schools buying |
| Do you appear in child facing animation? | Parent and LinkedIn films only |
| How do the friends get voices? | Generated, one per friend, locked to an id |

### Still open, and worth an answer before the first render

1. **Which friend fronts the pilot.** The Drive doc drafts E02 with Bloop. Bloop
   is also the friend with the unresolved Elements label. Orbit is the safer
   pilot subject if the label is not cleared first.
2. **Whether the five entrances replace the current silent intro loops** in the
   lesson title slides, or sit alongside them. Replacing means every lesson
   gains a speaking friend on slide one, which is a bigger change to the
   classroom than it sounds.
