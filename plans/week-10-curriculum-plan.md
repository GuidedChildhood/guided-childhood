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
