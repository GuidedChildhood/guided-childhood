# The teacher film, researched and re-storyboarded (24 November 2026)

Read only research for a re-cut of the schools teacher film
(`videos/2026-11-24-schools-teacher-start/`, cut
`videos/2026-10-09-digi-shorts/cuts/schools-teacher-start.json`). Nothing was
built, committed or posted. Every on screen claim below is checked against the
schools code and the bridge audit (`plans/2026-11-24-school-home-bridge-audit.md`).

## Summary in five lines

1. A teacher keeps watching when second one names their own week in their own words (a non specialist, a slot this week, no time to plan) and the brand is visible in the first two seconds.
2. "I could teach this tomorrow" rests on four proofs, all on real screens today: the words to say under every slide, the minutes and slide count, the pack that prints, and the safeguarding note before slide 1. The fifth, the note home with one question for tea, is what nobody else shows and what Oak told us to lead with.
3. The film should stay teacher first, with one 3.5 second handoff shot to the RSHE mapping for the lead; the head and DSL get their own film from the Hub.
4. Silent, burned in words, 30 to 40 seconds, vertical for the feed and horizontal for the pilot page, one offer on the end card; in email it is a poster with a play button, never an embed.
5. The current cut looks like a zoomed phone screenshot. Three changes make it read as premium: real device frames (the player on a classroom board, not a phone), the home page's own layered warm shadow under every frame, and eased camera moves that settle rather than cut.

## What the current film does (baseline)

28.6 seconds, eight shots: problem pill, turn, code, year, Teach, words on every
slide (two shots), end card. Every screen is a 390 pixel wide phone capture
scaled 2.4 to 2.6 times with a static camera (`cam` has one keyframe in every
shot but `s4b`), no device frame and no shadow. It proves the start is quick.
It does not show minutes, the pack, safeguarding or the parent note, which are
the four things the research below says a teacher and a lead look for.

## Findings, with sources and confidence

### 1. The first five seconds: pain recognised, in their words

- **Confidence is the gap, and it is widest in new teachers.** Teacher Tapp
  (article dated 28 April 2026): 77 percent of primary teachers felt very or
  quite confident teaching sex education, down from 87 percent in 2023; only
  18 percent of teachers with under five years' experience said very
  confident, against 40 percent with over twenty years.
  https://teachertapp.com/articles/attendance-awards-sex-education-plus-the-return-of-the-behaviour-tracker/ (2026).
  Earlier: 46 percent of primary teachers did not feel prepared for the RSE
  requirements (Teacher Tapp for Bett, December 2019, reported by DfE's
  Education Hub https://educationhub.blog.gov.uk/2020/01/13/survey-on-teacher-preparedness-for-new-relationships-and-sex-education, 2020).
  *Confidence: medium.* The measure is sex education, not online safety; I
  found no Teacher Tapp figure on online safety confidence. So the hook uses
  the feeling, not a number.
- **Time is the binding constraint.** DfE Working Lives of Teachers and
  Leaders wave 4 (2025, published November 2025): full time primary teachers
  51.4 hours a week, secondary 49.3; planning and marking named as key
  drivers of workload in the qualitative report (June 2025).
  https://www.gov.uk/government/publications/working-lives-of-teachers-and-leaders-wave-4 ,
  https://dera.ioe.ac.uk/id/eprint/41322/ (2025). *Confidence: high* on the
  hours, which are DfE's own.
- **Over 60 percent of classroom teachers had no cyberbullying training and
  felt ill equipped** (Teacher Tapp for the Early Intervention Foundation, via
  Internet Matters https://www.internetmatters.org/hub/research/the-role-of-schools-in-keeping-children-safe-online/, around 2023). *Confidence: low to medium*, read
  in a secondary summary only.
- **Oak's call (23 November 2026):** gatekeepers hear from 10 to 20 EdTech
  companies a week; lead with PSHE and parents, both of which cost staff time.
  *Confidence: high* as a first hand account, one person's view.
- **What it means for second one.** The teacher's own sentence on screen, the
  brand in the first two seconds (LinkedIn's Creative Lab reports a 17
  percent click lift for a visible logo in that window, via Storykit's
  webinar write up https://storykit.io/blog/linkedin-video-ads-best-practices, 2024; *confidence: low*, vendor relayed), and no product claim until
  the pain has landed. Wistia reads a big drop in the first 10 to 15 seconds
  as a promise not kept fast enough
  (https://wistia.com/learn/marketing/engagement-graph-learnings, undated,
  *confidence: medium*), so the first real screen arrives by second four.

### 2. The moments that make a teacher think "I could teach this tomorrow"

What the market leaders put first, read on their own pages on 24 November 2026:
Oak leads with "Free, time saving teacher resources" and slides, worksheets,
quizzes and teacher notes (https://www.thenational.academy/, its online safety
blog https://www.thenational.academy/blog/teaching-online-safety-in-schools-tackling-real-risks-to-help-pupils-stay-safe);
Jigsaw with "Save up to 250+ hours planning" and "all the lessons, slides,
resources, and assessments you need", plus Book a Demo
(https://jigsaweducationgroup.com/); Kapow with teacher testimonials about
staff who were "a little nervous to teach this part of the curriculum", a free
trial and "No credit card required"
(https://kapowprimary.com/subjects/rse-pshe/lower-key-stage-2). Project Evolve
shows no teacher proof at all on its home page (https://projectevolve.co.uk/).
EEF's independent trial of Oak's Aila found 49 minutes a week saved on
preparation (https://educationendowmentfoundation.org.uk/projects-and-evaluation/projects/aila-teacher-choices-trial, 2026). *Confidence: high* that time saved,
complete resources and reassurance on sensitive topics are the category's
three promises; nobody in it shows parents being brought along.

The proofs, and whether our product shows each on a real screen today:

| Proof | Shown today? | Route | Note |
|---|---|---|---|
| The words to say, under every slide | Yes | `/teach/<module>`, Teacher script in the bottom bar | Already in the film |
| Minutes and slide count, read from the slides | Yes | `/lesson/<module>`, the line "N minutes · N slides" (`schools/app/lesson/[module]/page.tsx:302`) | Capture the number, never type it. ks2-04 authored as 29 slides, 69 minutes |
| A short route if time runs out | Yes | `/lesson/<module>/run`, "Choose your route before the bell" | Good for a later cut |
| Code, year, Teach in three steps | Yes | `/unlock` then `/start` then `/start?stage=KS2` | Already in the film |
| The pack prints | Yes | `/print/<module>`: six sheets (one pager, bookmarks, worksheet, answer key, start and exit cards, parent note); booklet, quizzes and organiser on their own print pages | Not in the film |
| Safeguarding before slide 1 | Yes, on the 17 flagged lessons | `/teach/ks2-08-kind-safe-online` opens on Before slide 1 (`schools/components/tracker/BeforeSlideOne.tsx`): your lead, the quiet exit, the script folded | Type a made up lead in the Hub first; it is stored on that laptop only |
| Parents told, one question for tea | Yes | `/print/ks2-04-screen-routines`, Sheet 6, the Ask at tea box: "Can you teach me the cool down lap?" | Crop to the Ask at tea box. Do NOT show the home code block: its line "opens your child's own passport record" is a broken promise in the audit |
| Every online RSHE requirement mapped | Yes | `/hub/rshe-mapping`, open to read | The lead's shot |
| "Home code fills the passport" | NO | | False since 12 October. Never film or say it |
| "It is on your child's record" | NO | | The record is invisible. Never film it |

### 3. What a lead or head needs, and whether one film serves both

A PSHE lead or head buys on accountability: the statutory guidance in force
from 1 September 2026 asks schools to show parents materials and to help them
"continue conversations started in class" (RSHE statutory guidance, July 2025,
https://assets.publishing.service.gov.uk/media/687a3d473f4bde279ef4528c/RSHE_statutory_guidance_-July_2025.pdf);
Ofsted's 2026 toolkit looks for partnerships between home and school
(`content/packs/2026-10-09-digi-shorts/research/06-head-teacher-and-dsl.md`
section 1). What we can show them today: the RSHE mapping (`/hub/rshe-mapping`),
the coverage page that records lessons delivered with no pupil data
(`/hub/coverage`, school code needed), the DSL crosswalk and staff briefings
(`/hub/dsl`), and the parent pack (`/hub/parents`). *Confidence: high* on the
routes, medium on what heads weigh most, which comes from our own research and
the Oak call rather than a survey.

**Verdict: keep the teacher film for the teacher.** A teacher's attention goes
on "can I do this on Thursday"; a lead's on "can I evidence it". Mixing them
doubles the words. Give the lead one shot near the end, framed as something the
teacher passes on ("For your PSHE lead"), because in a primary the teacher who
watches is often the one who forwards. Make a separate 30 second lead film from
the Hub: mapping, coverage, DSL, parent pack, pilot.

### 4. Pace, length and format

- **Silent first.** Mobile LinkedIn autoplays muted; the commonly quoted 79 to
  80 percent sound off figure traces to IAB UK and vendors, not LinkedIn
  (Opus, Kapwing and Storykit guides, 2024 to 2026; *confidence: medium* on
  the habit, low on the number). Burn the words in; never rely on auto captions.
- **Length.** LinkedIn's own research says short video wins dwell time; vendor
  advice runs 15 to 30 seconds for ads and 30 to 90 for organic
  (https://www.brandwatch.com/blog/linkedin-video-specs/,
  https://kapwing.com/resources/linkedin-video-size-guide-aspect-ratios-resolution-length-and-best-practices-3, 2025 to 2026). Wistia: under a minute averages
  about half watched, and engagement drops once a video passes a minute
  (https://wistia.com/blog/optimal-video-length). Target 35 to 40 seconds: long
  enough for the five proofs, under the one minute cliff. *Confidence: medium.*
- **Format.** Vertical 1080 by 1920 (or 4:5) for the feed, horizontal 1920 by
  1080 for `/pilot` and the schools home page. At most three lines of words on
  screen at once.
- **Email.** Clients do not play embedded video reliably; use a poster frame or
  short GIF with a play button that links to the film on `/pilot`
  (Campaign Monitor https://www.campaignmonitor.com/resources/guides/video-in-email, Litmus https://www.litmus.com/blog/video-in-email/, 2024 to 2025;
  *confidence: high*). The poster should be the parent note shot or the
  script shot, not the hook card.
- **End card.** One offer, the one the pilot page makes: two lessons free for a
  term, no card, no contract, no pupil data. Kapow's "No credit card required"
  shows the category expects that line.

### 5. The visual quality bar

What reads as premium in Apple style product films, turned into rules we can
build: one idea per shot; the product sits in a real object (a device or a
sheet of paper) that casts a soft shadow onto a calm ground; the camera moves
like a person's attention, easing out and settling, never linear; one palette
the whole way; large margins; text and screen never compete. Sources on motion
are design guidance rather than evidence (Material's asymmetric easing
https://m1.material.io/motion/duration-easing.html, Apple's motion guidelines
https://developer.apple.com/design/human-interface-guidelines/motion,
open design's product easing note https://open-design.ai/blog/easing-for-motion-graphics/). *Confidence: medium*, a craft judgement.

## The home page design tokens (exact values)

Read from `shared/tokens.css`, `shared/page-scale.ts`, `schools/app/page.tsx`
and `schools/components/home/HeroWall.tsx`.

| Role | Token | Value |
|---|---|---|
| Page ground | `--cream` | `#F9F8F6` (also the theme colour) |
| App ground | `--app-bg` | `#F1EFEA` |
| Warm paper | `--warm-bg` | `#F7F3EE` |
| Ink | `--ink` | `#1A1A2E` |
| Ink soft, muted, light | `--ink-soft`, `--ink-muted`, `--ink-light` | `#52526A`, `#65657C`, `#AEAEC0` |
| Border | `--border` | `#EAEAF0` |
| Butter (the one button colour) | `--terracotta` / `--butter` | `#EDC35F` |
| Butter shadow | `--terracotta-dark` | `#C99A28` |
| Butter tint | `--terracotta-lt`, `--tint-butter` | `#FEF7E0`, `#FFF6DE` |
| Hero and closing teal | inline gradient | `linear-gradient(150deg, #2B5665 0%, #1E4652 55%, #173C46 100%)` |
| Stats strip | inline | `#211C10` |
| Espresso (featured price card, footer) | `--deep-teal` | `#2E2818`; its button shadow `#171307` |
| Text on teal | inline | `rgba(255,250,240,0.9)` lead, `0.84` body, `0.6` small print |
| Quiet button on teal | inline | ground `rgba(255,255,255,0.1)`, border `1.5px solid rgba(255,255,255,0.24)` |
| Hero wall inner ground | inline | `linear-gradient(180deg, #FBF6EA 0%, #F6EDDA 100%)` |
| Card shadow (softShadow) | inline | `0 1px 2px rgba(46,40,24,0.05), 0 30px 60px -34px rgba(46,40,24,0.42)` |
| Featured card shadow | inline | `0 2px 4px rgba(46,40,24,0.1), 0 40px 70px -34px rgba(46,40,24,0.55)` |
| Hero wall shadow (the deepest) | inline | `0 2px 4px rgba(46,40,24,0.08), 0 50px 90px -40px rgba(46,40,24,0.6)` |
| Lesson opens shadow, compact | inline | `0 2px 4px rgba(46,40,24,0.08), 0 24px 40px -28px rgba(46,40,24,0.45)` |
| Hover lift | `.lift:hover` | `0 16px 40px rgba(26,26,46,0.12)`, up 4px |
| Button | `.btn-gold` | butter ground, ink text, `box-shadow: 0 5px 0 #C99A28`, radius 16px, pressed `0 2px 0` and down 2px |
| Radii | `--radius-btn`, `--radius-card`, `--radius-tile`, `--radius-pill` | 16px, 20px, 14px, 100px |
| Display font | `--font-display` | Nunito 900 for headings, 800 for buttons |
| Body font | `--font-body` | Nunito 400 to 700 |
| Label font | `--font-mono` | IBM Plex Mono 700, uppercase, tracking `0.16em` (eyebrows) or `0.14em` |
| Hero heading | `PAGE.hero` | `clamp(2.1rem, 5vw, 3.7rem)`, line height 1.06, tracking `-0.035em` |
| Section heading | `PAGE.section` | `clamp(1.4rem, 3.2vw, 2.125rem)`, line height 1.18, tracking `-0.015em` |
| Lead paragraph | `PAGE.lead` | `clamp(1.05rem, 1.6vw, 1.25rem)`, line height 1.6 |
| Spacing | `--space-1` to `--space-7` | 4, 8, 12, 20, 32, 56, 80px |
| House ease | `--ease` | `cubic-bezier(0.2, 0.6, 0.2, 1)`; durations 0.1s press, 0.15s hover, 0.28s move |
| Reveal | `HeroWall.tsx` | `power3.out` 0.38s fade up 10px; stickers `back.out(1.6)` |

Note the shadow colour is always warm espresso `rgba(46,40,24,a)`, never black
or grey. That one choice is most of why the home page looks expensive.

## Premium motion spec (for the walkthrough engine)

All values at 1080 by 1920 (vertical); scale by 1920/1080 for horizontal.

1. **Ground.** Cream `#F9F8F6` with a very soft radial lift behind the device:
   `radial-gradient(60% 45% at 50% 42%, #FFFFFF 0%, #F9F8F6 60%, #F1EFEA 100%)`.
   Teal gradient only on the hook and the end card, as on the home page.
2. **Device frames, real objects only.**
   - *Phone* for `/unlock` and `/start` (a teacher on their phone in the staff
     room): body `#1A1A2E`, radius 64px, bezel 18px, inner screen radius 46px,
     no notch artwork, screen capture at 390 by 844 at 3x.
   - *Classroom board* for `/teach/<module>`: a plain 16:10 screen, body
     `#1A1A2E`, radius 28px, bezel 22px, a 6px foot shadow line, capture at
     1440 by 900 at 2x. The player is projected in real life; filming it on a
     phone frame is the current film's biggest false note.
   - *Paper* for `/print/<module>`: A4 sheets, `#FFFFFF`, radius 6px, fanned
     three deep at rotations of 0, minus 3 and plus 4 degrees, offset 28px.
3. **Shadow, three layers, warm.** Device:
   `0 2px 4px rgba(46,40,24,0.08), 0 24px 48px -20px rgba(46,40,24,0.28), 0 70px 120px -50px rgba(46,40,24,0.55)`.
   Paper: `0 1px 2px rgba(46,40,24,0.06), 0 30px 60px -34px rgba(46,40,24,0.42)` (the home page softShadow). Highlight boxes inside a screen
   keep the house butter: `background rgba(237,195,95,0.28)`, `outline 3px solid #EDC35F`, radius 10px.
4. **Depth.** Device sits at scale 0.92 of the safe zone with a 2 degree
   `rotateX` tilt on entry that settles to 0 (perspective 2400px). Words sit on
   a separate layer that moves 40 percent as far as the device (parallax), so
   the screen feels behind the words, not under a sticker.
5. **Camera.** Every screen shot has two keyframes minimum: an entry push from
   scale 1.00 to 1.06 over 1.2s, `power3.out`
   (`cubic-bezier(0.215, 0.61, 0.355, 1)`), then a focus move that pans to the
   proof line over 0.9s with `power2.inOut` (`cubic-bezier(0.455, 0.03, 0.515, 0.955)`), then a hold of at least 0.8s. No linear moves. No move longer than
   1.4s. At most one move after the focus.
6. **Transitions.** Between screens, a 0.35s cross push: outgoing device moves
   up 60px and fades to 0, incoming rises from 80px with `power3.out`. A hard
   cut only on the turn after the hook. Taps: the house ripple, 0.45s.
7. **Words.** Nunito 900, 72px vertical (hero rung feel), tracking
   `-0.035em`, line height 1.06, ink on cream or white on teal; eyebrows IBM
   Plex Mono 700 28px, tracking `0.16em`, `#C99A28` on cream, `#EDC35F` on
   teal. Enter with the house reveal: fade up 18px, 0.38s `power3.out`, lines
   staggered 0.08s. Three lines at most on screen.
8. **Safe zones.** Vertical: words between y 220 and y 640, device centred
   between y 700 and y 1620; keep 120px clear at the bottom and 64px at each
   side for the platform interface.
9. **Palette discipline.** Butter appears only on the one thing to look at
   (highlight, button, end card button). Everything else is ink, cream, white
   and the teal ground.
10. **Reduced motion.** Not relevant to a render, but the site film on
   `/pilot` should show its poster, not autoplay, when the reader asks for
   reduced motion (the schools sheet's own promise).

## The new storyboard (9 shots, about 40 seconds)

Reading rule: 0.6s plus words divided by 3.3, at least 1.4s, plus 0.5s for each
new screen. Words counted are the words the viewer must read, overlay plus any
highlighted line inside the screen. Every move sits inside its shot's time.
Made up school, made up lead, real screens; module ks2-04 Screen routines
unless named.

| # | On screen words | Real route filmed | Camera and frame | Duration |
|---|---|---|---|---|
| 1 | Pill: "I teach Year 4, not online safety." Marker under it: "Guided Childhood Schools" | None, teal ground (the home page hero gradient) | Pill types on as now; marker fades up at 0.6s so the brand is in by second two | 10 words: 0.6 + 3.03 + 0.5 = **4.1s** |
| 2 | "The lesson is already written." Eyebrow: "Real screens. A made up school." Highlighted in screen: the minutes and slides line, as the page prints it | `/lesson/ks2-04-screen-routines`, the hero with title, minutes and slides, Teach this lesson | Hard cut from teal to cream. Phone frame rises in with the 2 degree tilt settling; push to 1.06; pan to the minutes line | 11 words plus the captured line (about 3), so 14: 0.6 + 4.24 + 0.5 = **5.3s** |
| 3 | "School code. Your year. Teach." | `/unlock` (made up code typed), `/start` (Years 3 to 6 tapped), `/start?stage=KS2` (Teach this lesson tapped) | Same phone frame stays put; the screen inside it slides left twice, each 0.35s, a tap ripple on each button. Step chips 1 2 3 light in butter in turn | 5 words, three new screens: 0.6 + 1.52 + 1.5 = **3.6s** |
| 4 | "The words to say, under every slide." Highlighted: the script's first line, "Settle everyone with this slide up." | `/teach/ks2-04-screen-routines`, slide 1 with Teacher script open | Phone frame lifts away; the classroom board frame rises in; push down from slide to the open script, 0.9s `power2.inOut`, hold | 7 + 5 = 12 words: 0.6 + 3.64 + 0.5 = **4.7s** |
| 5 | "A sensitive lesson? Your safeguarding lead comes first." | `/teach/ks2-08-kind-safe-online`, the Before slide 1 screen (lead, quiet exit, script folded) | Board frame stays; screen cross fades; slow push to 1.04 on the lead line | 8 words: 0.6 + 2.42 + 0.5 = **3.5s** |
| 6 | "The whole pack prints. Ready to photocopy." | `/print/ks2-04-screen-routines`, Sheets 1, 3 and 5 | Board slides off; three A4 sheets drop in fanned (minus 3, 0, plus 4 degrees), staggered 0.08s, `back.out(1.4)` with a small settle | 7 words: 0.6 + 2.12 + 0.5 = **3.2s** |
| 7 | "And a note goes home." Highlighted in the Ask at tea box: "Can you teach me the cool down lap?" | `/print/ks2-04-screen-routines`, Sheet 6, cropped to the headline and Ask at tea box (never the home code block) | The parent note slides out of the fan to the front and the camera pushes into the Ask at tea box, 1.2s `power3.out`, hold | 5 + 8 = 13 words: 0.6 + 3.94 + 0.5 = **5.0s** |
| 8 | Eyebrow: "For your PSHE lead". "Every online RSHE requirement, mapped to a lesson." | `/hub/rshe-mapping`, the heading and the first requirement row with its module | Laptop width capture in the board frame, pulled back to 0.88 so it reads as a document; one slow pan down to the first row | 4 + 7 = 11 words: 0.6 + 3.33 + 0.5 = **4.4s** |
| 9 | DiGi. "Two lessons free for a term." "No card. No contract. No pupil data." Button: "Request a pilot". "schools.guidedchildhood.com/pilot" | End card, teal ground; the button is the house butter `.btn-gold` | Lines reveal staggered 0.08s; the button lands with the house squash; hold to the end for the loop | 18 words: 0.6 + 5.45 + 0.5 = **6.6s** |

Total about **40.4s**, a little over the old 28.6s, and every added second is a
proof the old cut did not have. If it must come down to 30s, drop shot 8 (it
becomes the opening of the lead film) and shot 5 (it moves to the DSL film),
which leaves about 32.5s.

Claims check, shot by shot: 2 is the lesson page's own line and "A made up
school" is said once, early; 3 is the `/start` three steps; 4 is the player's
Teacher script ("The words to say are on every slide", `schools/app/start/page.tsx:87`);
5 is `BeforeSlideOne.tsx` on a flagged lesson; 6 is the print page's six sheets;
7 is Sheet 6 and the ks2-04 `parent_note.family_question`; 8 is the open mapping
page; 9 is the pilot page's terms (`schools/app/pilot/page.tsx:75`). No shot says
or shows that a code fills the passport or that anything is on a child's record.

## Before the re-cut (what the build needs)

1. New captures: the lesson page hero, the ks2-08 Before slide 1 screen (with a
   made up lead typed into the Hub on the capture laptop), print Sheets 1, 3, 5
   and 6 at A4, and `/hub/rshe-mapping`, plus the player and mapping at 1440 by
   900 for the board frame. `tools/capture-schools.mjs` captures only the four
   phone screens today.
2. Engine work: a frame layer (phone, board, paper), the three layer warm
   shadow, a second camera keyframe as the default, and the 0.35s cross push.
   The cut's `css` field can carry the shadows and frames without touching
   other cuts.
3. Fix the parent note's home code line (audit finding 1) before any film or
   email points a head at the print page, even though the film crops it out.
