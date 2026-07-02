# Week 10 — The curriculum: video led lessons, benchmarked against the best, built for change

**Date:** 2026-07-01
**Branch:** claude/agent-management-guided-childhood-lDYLl
**Status:** Approved, step by step build. Supersedes the Day 4 to 5 section of week 9.

## Why plan this now

Everything mechanical shipped this week: the slide player, the video slide type, completion tracking, the daily trail, the pilot video. Content is now the bottleneck, and curriculum written without a benchmark map becomes 90 disconnected lessons. One planning day protects five build days.

## The shape of every lesson

Short, video led, fun first. Each lesson opens with an 8 to 15 second Pixar-short style video of a DiGi Squad character teaching a class (DiGi the golden star as the anchor, Oliver for screen time, Zara for truth finding, Sofia for safety, matched by topic and age). Then the Jigsaw informed rhythm the player already supports: video, concept, quick check, say this tonight, try it, recap. One lesson teaches one skill. Two to three minutes end to end.

Pilot proven: the Explorer algorithm lesson video rendered today in Higgsfield (kling3_0_turbo, 8s, 16:9, classroom scene, board reading HOW THE ALGORITHM WORKS) and is wired into the exemplar lesson as its video slide.

## The benchmark map (what "extensive and focused" means)

The curriculum is built against the frameworks the best schools and the government actually use, so a school, a journalist, or an Ofsted trained eye recognises it instantly:

1. **Education for a Connected World** (UKCIS, the government backed digital literacy framework). Its eight strands become our strand spine: self image and identity, online relationships, online reputation, online bullying, managing online information, health wellbeing and lifestyle, privacy and security, copyright and ownership. It is age banded, which maps cleanly to our five stages.
2. **National Curriculum Computing** programmes of study, KS1 to KS4: the statutory e safety and digital literacy bullets per key stage, so schools see statutory coverage.
3. **RSHE statutory guidance**: online relationships and internet safety and harms are compulsory content; each of our modules tags which statutory bullet it covers (the schools page already promises this alignment).
4. **What the best schools add beyond statutory**: critical media literacy, wellbeing by design, creation over consumption, digital leadership programmes. This is the "better than" layer: most schools teach avoidance, we teach capability, which is the whole brand argument.
5. **AI safety and literacy** as a ninth strand, drawing on the DfE generative AI in education guidance and the UNESCO AI competency framework for students: what AI is and is not, deepfakes and synthetic media, AI companions and parasocial risk, using AI to learn versus using it to avoid learning, data and models, building with AI.

### Built for a changing environment

AI content dates in months, not years. Three design rules keep it current without rewrites:
- Evergreen mechanics in lessons (how recommendation works, what a model is, why synthetic media exists), never app-of-the-month specifics.
- All named examples live in the database (scripts and lessons tables), so a quarterly content refresh is a data update, not a release.
- DiGi is the live layer: the lesson teaches the durable concept and hands the "what about the new thing this week" question to DiGi, which is already stage aware.

### Scale target

Nine strands, five stages, two lessons per strand per stage where age appropriate: roughly 80 lessons full build. This week writes the complete matrix plus the first three stages of lessons; the remaining stages follow the same recipe.

## Two versions of every lesson

Every topic ships in two voices, using the audience column the lessons table already has:

- **Home version (audience parent).** For parents and home educators. Ten minutes at the kitchen table. The child watches the character video and does the quick check; the parent gets the say this tonight script and the try it experiment. For home schooling families this IS the lesson delivery, so it carries a light plan: what to say to open, what the child should be able to say back at the end, and the family question to leave hanging.
- **School version (audience teacher).** Twenty five to thirty minutes, teacher led. Same video, same core slides, plus the materials layer below. This is the schools licence product.

One topic, one video, two slide sets. The Day 2 matrix generates stubs for both audiences.

## Materials per lesson: Jigsaw's package, modernised

What Jigsaw ships per lesson, and what ours is instead:

| Jigsaw ships | We ship | Why ours is better |
|---|---|---|
| PowerPoint deck | The interactive slide player | Self advancing, checks built in, completion is data not a worksheet pile |
| Mascot soft toy moment | The character video beat | The mascot actually teaches, in motion, matched to topic and age |
| Calm Me chime time | DiGi Junior pause beat (already built) | Same regulation moment, no chime bar to buy |
| Jigsaw Families parent leaflet | The say this tonight script plus the printable fridge sheet | One page auto generated from the lesson's own slides JSON: key message, family question, try it |
| Teacher lesson plan booklet | Teacher notes block on the school version | Learning objective, statutory RSHE and Computing bullet tags, timing guide, discussion prompts, differentiation note |
| Assessment maps and evidence files | Completion data per pupil cohort plus the Ofsted alignment doc | The schools page already promises evidence ready for Ofsted; here it is generated, not filed |
| Celebration certificates | Printable stage certificate with DiGi | Earned from real completion data |

The fridge sheet and certificate are small generator routes (print stylesheet over lesson JSON), built on Day 6 alongside the video line.

## Scripting the animations

The production recipe for every video beat, so scripts are written once and rendered mechanically:

**The script template.** Each video beat is a mini screenplay stored with the lesson in the production doc:

```
CHARACTER: Oliver
SETTING:   classroom, ball under foot
BOARD:     BE THE BOSS OF YOUR SCREEN
MOOD:      joyful, sporty
SHOT 1 (0 to 4s)
  ACTION:  Oliver flicks the ball up, catches it, grins at the class
  LINE:    "You know how I love football? Your brain treats screens like a REALLY exciting match!"
SHOT 2 (4 to 8s)
  ACTION:  kids lean in laughing, board reveal behind him
  LINE:    "Today we learn the cool down lap. Ready? Kick off!"
```

**The rules that make scripts work:**
1. Character voice rules from the squad reference are law: Oliver speaks in football, Zara in detective, Sofia in shield and guardian, DiGi warm and calm. The intro speeches in the reference doc are the canonical opening lines.
2. Jigsaw's distancing technique, kept: the character voices the struggle ("Oliver finds it SO hard to stop mid match, do you know that feeling?") so the child agrees with the character instead of being challenged.
3. One idea per beat, one line per shot, maximum two shots per beat. If a script needs a third shot it is two beats with a slide between them.
4. The board text is the lesson title in the child's language. It does the remembering.

**The render pipeline:**
- Scene setter beats (no dialogue): kling3_0_turbo, exactly like the four rendered today.
- Dialogue beats: kling3_0, which supports multi shot and audio, fed the two shot script directly.
- Character voices: one voice per squad member created once in Higgsfield (create_voice), used for every lesson so Oliver always sounds like Oliver. Voice over can also be generated separately (generate_audio) and laid over a silent beat, which is the cheaper refresh path when only words change.
- Identity consistency when it matters: seedance with the character's reference still as start image.

## The week, step by step

**Day 1 (today, done):** slide player, video slide type, daily task trail, DiGi star correction, pilot classroom video rendered and wired into the exemplar lesson.

**Day 2: the matrix.** Write the full curriculum map: 9 strands by 5 stages, every module titled, one line on the skill it teaches, tagged to its UKCIS strand and statutory RSHE bullet. Committed as a seed migration of lesson stubs (title, stage, strand, sort order) so the map lives in the product from day one, plus the human readable version in /plans/. This also becomes the schools sales document and the LITERACY lead magnet skeleton: one content spine, three revenue surfaces.

**Day 3: the expert bar (carried from week 9).** Script audit against Dr Becky Kennedy, Catherine Knibbs, Sue Atkins, Dr Tanya Byron. The same panel sets the QA bar for lesson copy: every "say this tonight" line in a lesson must pass the same test as a script.

**Day 4: write Foundation and Builder lessons.** Full slide sets in the Jigsaw rhythm for the two youngest stages, seeded as migrations. Sofia and DiGi carry most of these ages.

**Day 5: write Explorer, Shaper, Independent lessons.** Including the full AI safety strand across all stages (Zara fronts truth and deepfakes, DiGi fronts AI concepts). Every lesson stub from Day 2 either gets its slides or an explicit deferral note.

**Day 6: the video production line.** The repeatable Higgsfield recipe: one reference still per character (existing squad job IDs), seedance for identity consistent shots, kling for scene motion, one 8 to 15 second classroom video per written lesson, batch rendered, mp4 URLs dropped into each lesson's slides JSON. Document the prompt template per character so a refresh or a new lesson is mechanical.

**Day 7 (Friday ritual): family agreements plus ship check.** Build the family agreement builder (the paywall already sells it, week 9 decision stands), then the full layout and console pass, push, and the deploy conversation.

## Non-negotiables carried

No dashes in copy. Tokens only. GSAP only. Scripts and lessons live in the database. Mobile and desktop checked before done. Justin decides the merge.
