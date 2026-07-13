# The prompt for the script, animation and slides session
**7 Jul 2026 · Paste the block below into a fresh Claude session to run the curriculum content lane. The platform lane (code, player, portal) stays in the other session; this one writes scripts only.**

---

You are running the CURRICULUM CONTENT lane for Guided Childhood (see CLAUDE.md
multi session rules: claim your work with a draft PR immediately, branch name
prefixed claude/script-sessions, do not touch platform code, app/ or components/
are owned by the platform lane).

Read first, in this order:
1. CLAUDE.md and plans/decisions.md (the rules and what is already decided)
2. plans/video-script-sessions.md (THE TEMPLATE you fill: parent track P beats
   and child track beats, age banded 0 to 16)
3. plans/schools-lesson-build-spec.md section 10.2 (the screenplay beat format:
   CHARACTER / SETTING / BOARD / MOOD / per shot ACTION and LINE)
4. digi-squad/README.md (the cast: DiGi and DiGi Junior are ALWAYS the golden
   star, never a robot or owl; Zara truth, Oliver routines, Sofia safety, Vix
   street smart, Brock wellbeing; casting by key stage per spec 9.4)
5. plans/parent-video-research-2026-07.md (the deep research topic map from
   Internet Matters early years, Digital Matters and Common Sense Digital
   Citizenship; if this file does not exist yet the research is still running,
   start with the topics already named in lib/content/schools-curriculum.ts)

YOUR JOB: write the video script sessions that become the lessons.
For every topic in the research topic map (ages 0 to 16), produce one file
plans/script-sessions/<band>-<topic-slug>.md containing:
- Track P: the parent session script (60 to 90 seconds, P beats 1 to 4 from
  the template: the moment, the reframe, try this tonight, DiGi tag)
- Track C: the child session beats (intro, concept, pause, mission) in the
  section 10.2 screenplay format, cast for the age band
- A one line note mapping the topic to its existing module (schools-curriculum.ts)
  or naming it as a gap

HARD RULES (violations get red penned):
- No dashes in any copy or spoken line, ever. No AI isms. Justin's voice:
  warm, plain, direct.
- Never allow or deny framing: always the calibrated pathway.
- Honest evidence only: a statistic needs a real named source or it does not
  appear.
- One idea per beat, max two shots, board text is the title in the child's
  language.
- Scripts only. Do NOT render videos (Higgsfield credits are gated), do NOT
  write migrations (the platform lane lands scripts into the database after
  JP red pens), do NOT edit app code.
- Sensitive topics (consent, sextortion, radicalisation, pornography harms)
  are DiGi only, calm register, never graphic, recognise then refuse then
  report then you are not in trouble.

CADENCE: work in batches of one age band at a time, push and update your draft
PR after each band, and append a one line summary per band to plans/decisions.md.
JP red pens wording in the files directly; treat any edit he makes as final.
