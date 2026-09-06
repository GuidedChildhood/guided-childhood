# Platform map: the eight candidate moves from the 6 September situations and forecasts briefing

Thesis check (THE-STORY.md sections 1 to 3): every candidate below is judged against one line, "get children to sixteen ready for a phone, ten minutes a day, with the words for the arguments", and against commitment 5, evidence or silence. The briefing's ledger already marks each finding confirmed, corrected or demoted, so only confirmed and corrected rows may enter any surface.

Working tree warning first. The checked out branch is `claude/claude-code-ai-employee-p37w5v` and it already carries uncommitted, in flight work for candidates 1 and 2: `lib/digi/horizons.ts` (untracked skeleton), edits to `lib/digi/brain.ts`, `lib/digi/situation.ts`, `lib/digi/word.ts`, `app/api/digi/route.ts`, and the plan `plans/week-of-2026-08-31-digi-situations-and-forecasts-plan.md`. Migration 256 (`256_digi_word.sql`) is committed on this branch but is NOT on origin/main (origin/main tops out at 255). No migration 257 exists anywhere on origin/main or any remote branch, so 257 is free and is the number the plan and briefing already name.

Two doc paths in CLAUDE.md do not exist in the tree: there is no `docs/` directory (so no docs/11) and no `schools/01`, and no `research/01`. The ban flag's real home is `shared/social-media-law.ts`; the voice rules' real home is `digi/03-voice.md` plus `content/brand-story/founding-story.md` and `.claude/skills/content-engine/SKILL.md`.

---

## 1. Research bank rows tagged by situation

Where it lives
- Table: `public.expert_knowledge` (created `supabase/migrations/019_digi_brain.sql`, columns `source_type, source_name, finding, age_bands text[], topics text[], url, active, embedding`).
- Retrieval: `lib/digi/brain.ts` (`searchKnowledge` semantic via `match_expert_knowledge` from migration 142, `scoreByKeyword` fallback with `WORD_TO_TOPIC`, `getExpertKnowledge` merges both).
- Situation reader: `lib/digi/situation.ts` (`inferSituation`, keyword only, feeds `getRatedForSituation` in `lib/digi/outcomes.ts`).
- New migration: `supabase/migrations/257_*.sql`.

What already exists
- The table, RLS, semantic index and the self healing embed sweep (`lib/digi/knowledge-embed.ts`) so a migration row is searchable without app code.
- Roughly 200 active rows across migrations 019, 042, 054, 072, 084, 085, 091, 139, 145, 218, 222. Topic tags in use today: mood, social_media, safety, screen_time, relationships, routines, parent_wellbeing, anxiety, stage_arrival, normal_moments, sleep, trauma, gaming, crisis, friendships, timing, phones, misinformation, body_image, self_esteem. Note migration 054 already seeded `morning`, `afternoon`, `evening` as topics (one row each) and `normal_moments` for parent stress, which overlaps the new `parent_stress` and `morning` tags.
- Some of the briefing's sources are already in the bank in older form: Carter JAMA Pediatrics bedroom device (migration 218), Orben windows (019 and 218), Przybylski Goldilocks (019), Ferguson (019 and 222), eSafety and Molly Rose ban outcomes (222), Radesky is not present, Nagata ABCD is not present, Pew is not present, Gambling Commission gift card figures are not present.
- In flight and uncommitted on this branch: `WORD_TO_TOPIC` in brain.ts already maps parent phrases to the new tags (`after_school`, `morning`, `holidays`, `parent_stress`, `device_as_helper`, `balanced_use`, `pull_and_design`, `new_phone`, `new_game`, `ai_use`, `adhd`, `autism`, `temperament`), and situation.ts already gained the `holidays` time band and `new_phone`, `new_game`, `parent_stress`, `adhd`, `autism` topics.

Genuinely new
- Migration 257 itself: the rows, one per confirmed or corrected finding, tagged with the new situation slugs plus an existing topic and age bands, with `url` filled from the ledger.
- Nothing else. No new retrieval path is needed; keyword and semantic both pick up the rows.

Build size: SMALL (one seed migration plus committing the in flight keyword edits).

Duplication and collision risks
- `scripts/check-checkin-shifts.mjs` imports `TIME_BANDS` from `lib/digi/outcomes.ts` and asserts every inferred band is in it. outcomes.ts still reads `['morning','after_school','evening','bedtime','weekend','any']`. The in flight `holidays` band in situation.ts will fail that check until `TIME_BANDS` in outcomes.ts and the `time_band` description in `lib/digi/tools.ts` (schedule_followup) gain `holidays`.
- The schedule_followup `topic` enum in `lib/digi/tools.ts` lists only `screen_time, gaming, social_media, sleep, mood, anxiety, safety, school, siblings, routines, devices, friendship, content, ai`. The new situation.ts slugs (`new_phone`, `new_game`, `parent_stress`, `adhd`, `autism`) will never match a `digi_outcomes.topic` row via `getRatedForSituation`'s `eq('topic', ...)`, exactly the silent zero result the file header warns about. Either add them to the tool enum or accept that those five only serve the bank, not the outcomes ledger.
- Do not seed a second Carter or Orben row that repeats 218's wording; prefer tagging the existing row with the new situation or adding the new specific figure as a distinct finding.
- Dedupe guard: existing migrations are idempotent by `source_name` guard (222) or `where not exists` (054). Follow one of those.

---

## 2. Horizons table by age band, rendered into chat and DiGi's word

Where it lives
- `lib/digi/horizons.ts` (untracked skeleton, `HORIZONS: Horizon[] = []`, `horizonsFor(band)` returns this band plus the next, `renderHorizons(band, childName)`).
- Consumers already wired in the working tree: `app/api/digi/route.ts` line 703 (`horizonsKnowledge` appended after `expertKnowledge` in the PRECEDENCE concatenation at line 729) and `lib/digi/word.ts` line 240 (`renderHorizons(band, kidName)` inside the brief).
- Age bands from `lib/content/stages.ts` (`AgeBand = '4-7' | '8-10' | '11-13' | '13-15' | '16+'`).

What already exists
- Three separate "say it before it lands" surfaces are live and must not be duplicated:
  1. Migration 218 stage arrival prompts: `stage_arrivals` table, `digi_prompts.kind = 'stage_arrival'`, fired from `app/api/digi/prompts/route.ts` lines 150 to 229, grounded in `expert_knowledge` rows tagged `stage_arrival` (eight rows, one per crossing, already covering phone ownership climbing at 8 to 10, class WhatsApp at 8 to 13, secondary move at 11 to 13, Orben windows, Carter bedroom device, sextortion at 13 plus). This is the only age triggered DiGi moment and stays that way.
  2. `social_platform_guides.first_seen_stage` (migration 093) tells which platforms become real at which stage.
  3. `lib/learning/transition.ts` plus `/dashboard/secondary` and `components/home/PhoneBridgeCard.tsx`: the Year 6 into Year 7 first phone bridge with five fixed steps (know what changes in September, decide what the phone is for, write the agreement before the handset, start narrow, plan the first half term).
  4. `lib/learning/term-preview.ts` previews next term's curriculum (school, not devices).

Genuinely new
- The `HORIZONS` rows themselves (money and first account at 8 to 10, phone and sleep at 11, AI as a friend at 11 to 13, ban and companions at 13 to 15), each with source and country.
- Nothing in the render path; that is done.

Build size: SMALL if the rows stay in `horizons.ts` as the plan states ("the milestone table by age band"). MEDIUM only if Justin wants it as a database table; the plan says code, and the transition steps set the precedent (a pathway list in code, words in the scripts table).

Duplication and collision risks
- Horizons is a passive context block inside conversations; 218 is the active trigger. Keep horizons as text DiGi may use "when one fits the conversation" (the render already says so). Do not add a cron, a prompt kind or a card for horizons; that would be a second age trigger.
- `horizonsFor` reaches into the next band, so a Stage 2 chat will carry the 11 to 13 rows. Rows must be phrased as "typically arrives" with the country marked, or DiGi will forecast US adoption figures as UK.
- The word brief already pulls 14 bank rows for the band; horizons plus proven solutions plus research could push the brief past the useful length. Keep each horizon row to two sentences.

---

## 3. Three questions before advice (who with, how did they feel after, where does it charge)

Where it lives
- Static prompt: `lib/digi/system.ts` (`STATIC_SYSTEM`, cached by the route). The natural home is a short block near "MESSAGE FORMAT" or "REFLECTIVE QUESTION RULE".
- Dynamic per family: `buildSystemPrompt` in `app/api/digi/route.ts` line 1364, which already injects tracker context, the child's stage and `stage.digiContext`.
- Precedence: `PRECEDENCE` constant at route.ts line 116.
- Lane shaping: `lib/digi/lane.ts` (`laneShape(lane)` goes last and overrides format).

What already exists
- The reflective question rule (one specific question at the end of every reply) in `system.ts` lines 100 to 110 and `digi/03-voice.md` lines 102 to 114.
- "When a parent pushes back, DiGi asks one question to understand the specific obstacle" (`digi/03-voice.md` line 98).
- Stage 4 `challengeActions.gaming` in `lib/content/stages.ts` already says "Ask about the people they play with online"; Stage 2 `mood_changes` already says note mood before and after; the bedroom rule is everywhere.
- The wellbeing tracker already carries `screen_mood_score` ("mood after screens") into the prompt, so question two may already be answered by data for some families.
- The check in and `concern_events` hold the family's ratings; DiGi is told to "USE THIS to personalise".
- DiGi has a `get_child_history` tool and `getFamilyMemory` so it can look before asking.

Genuinely new
- One prompt rule: before giving a pathway on a screen, game or phone worry where the three facts are unknown, ask them (at most one turn, all three in one warm line), and skip any already known from memory, the tracker or the message. Also the rule that the questions are never a judgement of the parent.
- Optionally a `digi_memory` write of the three answers so they are asked once per child, not every chat (the `save_memory` tool already exists; a prompt instruction to save them as `context` kind is enough).

Build size: SMALL (prompt copy in `system.ts`, plus an evals case in `lib/digi/evals.ts`).

Duplication and collision risks
- Naming: "three questions" is already the product's stage check hook ("Three questions, no sign up", `app/page.tsx` line 305, `starter-pack/ResultScreen.tsx`) and "three questions a day" is the free DiGi limit (`lib/email/templates.ts` line 1493). Do not name this feature "three questions" anywhere customer facing; internally call it the intake or the three facts.
- Rail conflict: "3 to 5 sentences" and "End with the next concrete action. Always." A reply that only asks questions breaks the second rule; the new block must say explicitly that on the intake turn the questions are the action.
- Crisis rule and the safety lane must skip the intake entirely (the crisis rule already skips the reflective question; mirror that wording).
- Fast lanes (`lib/digi/lane.ts`) that skip research also need to skip the intake, or a "what is the WhatsApp age" question gets three questions back.

---

## 4. Six new scripts

Where they live
- `public.scripts` (schema `supabase/migrations/001_initial.sql` line 124: `stage_id, title, situation, say_this, not_this, why_it_works, tonight, law_flag, is_free, sort_order`, plus `category` (002), `if_they_push_back, check_back, for_your_child` (032), `embedding` (131), `starter_set` (201)).
- Pattern to copy: `supabase/migrations/186_free_scripts_screens_and_gaming.sql` (idempotent by title, dollar quoted bodies, `for_your_child` filled on every row). Highest sort_order in use is 9641 (migration 254), so 9650 onward is clear.
- Matching to DiGi is automatic via `lib/digi/script-match.ts` and the embed sweep.

What already exists, by candidate (titles from the seeds, 292 script rows read)
1. The no confiscation promise. Closest rows: `tell_a_parent_cards` (migration 163) carries the promise per stage in the child's words ("I will not take your device off you as the first thing I do", builder row), shown to both child and parent. Stage 4 stage script "When Things Go Wrong Online" in `lib/content/stages.ts` ("I will not overreact. I will help"). Migration 153 sextortion script says confiscation "teaches one lesson, which is never let them see". The 27 August plan `plans/2026-08-27-first-whatsapp-moment-plan.md` item 1 specified a NO_CONFISCATION clause for `lib/content/agreement-clauses.ts` under `first-phone`; that clause has NOT landed (the file has "Every device charges in the kitchen overnight" but no confiscation line). Genuinely new: a parent facing scripts row that makes the promise out loud in the parent's voice, and the agreement clause. No title collision.
2. The end of the match rule. Closest: Builder parent lesson "The cool down lap" (warn, finish, swap; migration 018 and the school version in 033), "Why stopping feels hard, and how to win at it" (builder), free gaming scripts from 186 at builder and explorer, and the `cool down lap` moment cards. Genuinely new: a script whose situation is "the match cannot be paused" with the rule "the warning is a match count, not a minute count". Name it so it does not read as the cool down lap; the lesson already owns "finish at a real finishing line".
3. The Year 6 phone plan. Closest: `lib/learning/transition.ts` five step pathway and `/dashboard/secondary`, the `first-phone` agreement type, migration 218's 8 to 10 and 11 to 13 arrival rows, and scripts "The Before School Phone Argument", "When the Phone Breaks or Gets Lost", "Phone to bed, unasked, and a night light for it" (254). The transition file's own comment says "the words DiGi hands a parent to say still live in the scripts table", and no script titled for the Year 6 summer plan exists. Genuinely new: the one script that the bridge links to. It should be linked from the bridge's `agreement_first` step rather than duplicating the step list.
4. The gift card rule. Closest: school module `ks2-05-gaming-time-spend` (loot box as raffle), Roblox guide's monthly spend cap (migration 093), `Kids money and pocket money app` recommended tool (migration 095), independent script "Money of their own" (159), the scam three tells in KS3 module 13, and the lane keyword `robux`, `v bucks`, `loot box` to gaming (150). There is no parent script on gift cards or the first spend loop at 8 to 12. Genuinely new, no collision. Tag category `gaming` or `everyday-routines` at builder.
5. The AI together habit, hints not answers. Closest: shaper scripts "AI wrote their homework" and "AI for coursework", shaper lesson "Using AI to learn, not to skip learning", school module "Homework, honesty and using AI to get stronger instead of weaker", explorer lesson "What AI actually is", builder lesson "What is a robot brain?", and the AI module (`lib/config/ai-module.ts`, `ai_lessons`). All are about the child using AI alone or cheating. Genuinely new: the shared habit at 8 to 12 (parent and child use it together, ask for hints). No title collision, but the copy must not restate "Using AI to learn, not to skip learning".
6. The parent's protected phone free slot. Closest: `normal_moments` rows (054) and MindEd parent wellbeing rows (019) in the bank, the planet mission script "Read your own book in the same room for the same ten minutes. Modelling beats monitoring every time" (253), and `explorer | family-rules | When one parent is stricter`. No script exists whose situation is the parent's own phone. Genuinely new. Risk: the briefing's technoference source (McDaniel and Radesky 2018) is about 0 to 5 year olds and the 46 percent Pew figure is US teens, so `why_it_works` must say "the parent's phone is part of the picture" and not claim a child outcome.

Build size: SMALL (one data migration, six rows, no UI). Note `law_flag` stays `none` for all six; none names a banned platform.

Duplication and collision risks
- Migration 186's comment records the rule that no free script ends in confiscation; the no confiscation script is the one to mark `is_free = true` at builder or explorer, where free screen time and gaming rows are thin.
- `getRecommendedScript` and the pathway stamp count scripts per stage (`lib/pathway/progress`), so six new rows change the stamp percentages for families mid stage. Expected, but say so in the PR.

---

## 5. Stage content: Stage 2 money and accounts, Stage 3 phone and sleep, Stage 4 companions and the ban

Where it lives
- Stage copy in code: `lib/content/stages.ts` (`STAGES[]`: focus, device, script, action, warningSigns, digiContext, challengeActions, and Stage 4 `banWorld`). Read by the starter pack result, the pathway page, and `buildSystemPrompt` (`stage.digiContext`).
- Stage quiz: `lib/content/stage-quizzes.ts`. Path tips: `lib/content/path-tips.ts`. Screen tips: `lib/content/screen-tips.ts`. Readiness: `lib/content/readiness.ts`.
- Lessons: `public.lessons` rows (`stage_id, audience='parent', category, title, ...`), seeded in migrations 018, 049, 050, 074, 076, 103 to 106, 236.
- DiGi's stage guide: `digi/04-stages.md` (loaded nowhere in the prompt; documentation only).

What already exists
- Stage 2 (Builder): parent lessons "Screens and sleep", "Setting the bedroom rule before it is hard", "The cool down lap", "Adverts are everywhere", "Spot the trick", "What social media really is", "Keeping games fun", "Passwords are secrets". Nothing on money, the first account or the first spend loop at the parent lesson level. Stage quiz question about stars versus pocket money exists (`stage-quizzes.ts` line 46).
- Stage 3 (Explorer): "Before you make an account", "Group chats without the drama", "Mood and the scroll", "The feed is built to hold you", "AI companions and real friends" (explorer already has the companion lesson), scripts "They cannot sleep because of their phone", "Social media affecting sleep". `stages.ts` Stage 3 `challengeActions.screens_takeover` already leads with the bedroom rule. Stage 3's `script` is the algorithm conversation, not sleep.
- Stage 4 (Shaper): lessons "AI companions and chatbots" (migration 106, module 15), "A chatbot always agrees", "Sleep is not optional", "Keeping the door open when something goes wrong"; scripts "An AI chatbot as a friend"; `banWorld` block in `stages.ts` for the flag; migration 153's ban script (law_flag full_ban_u16); `app/(marketing)/ban-workarounds/page.tsx`.

Genuinely new
- Stage 2: a parent lesson (or `challengeActions` copy) on the first account and money at 8 to 12, and a `warningSigns` line about spending. This is the one real gap.
- Stage 3: reorder so the bedroom charging rule leads the stage `script` or `action` (currently the algorithm conversation leads). That is a copy change in `stages.ts` plus `digiContext`.
- Stage 4: the companion conversation into `focus` and `challengeActions` (today Stage 4 copy never mentions AI), and the "what the ban does and does not cover" line into `banWorld.focus` (it already says "messaging, gaming, watching, and the workaround trap").

Build size: SMALL for `stages.ts` copy and one or two lesson rows in a seed migration; MEDIUM if a full Rosenshine lesson with slides is wanted for Stage 2 money (pattern in 236).

Duplication and collision risks
- `stages.ts` Stage 3 `ages` says "Ages 11 to 12" and band `11-13`; the briefing's "phone at 11" fits, but the money and first account material dated 8 to 12 spans Stage 2 and Stage 3, so pick Stage 2 and do not duplicate at Stage 3.
- Explorer already owns "AI companions and real friends"; a Stage 4 companion rewrite must build on Shaper's "AI companions and chatbots" rather than adding a third.
- `digi/04-stages.md` calls Stage 4 "Navigator" and Stage 5 "Launcher"; the code says Shaper and Independent. Any stage copy work should fix the doc names or leave the doc alone, not copy from it.

---

## 6. The schools Year 6 summer pitch

Where it lives
- Schools app: `schools/app/page.tsx` (home and pitch), `schools/app/pricing/page.tsx`, `schools/app/philosophy/page.tsx`, hub at `schools/app/hub/{parents,dsl,cpd,policy,year-plan,rshe-mapping}`.
- Curriculum manifest: `shared/schools-curriculum.ts` (modules `ks2-04` to `ks2-09` are "Years 3 to 6"; `ks3-10` to `ks3-14` are "Years 7 to 9"; no Year 6 specific module).
- Plan: `plans/2026-08-27-first-whatsapp-moment-plan.md` item 6 already specifies "Year 6 summer transition lesson plus heads letter (MEDIUM, own lane)", including the note that a 22nd module changes the "21 modules" copy in `schools/app/page.tsx` lines 24, 29, 280 and `philosophy` line 82.
- Parent side of the same moment: `lib/learning/transition.ts`, `/dashboard/secondary`, `PhoneBridgeCard`.

What already exists
- The transition pathway on the parent side, the KS2 group chat module `ks2-08-kind-safe-online` and the KS3 `ks3-11-social-workarounds` that bracket the boundary, the printable parents page pattern in `schools/app/hub/parents`, the pricing bands, and the schools marketing plan `plans/2026-08-31-schools-marketing-apple-plan.md`.
- The ownership jump evidence (Ofcom 2026) and the leavers chat forming in the summer term are new to the bank; nothing in `schools/` cites them yet.

Genuinely new
- A Year 6 summer term offer on the schools site (a section or page: run the phone plan and the no confiscation promise before the box is opened), a heads letter template, and optionally the transition lesson row in `school_lessons` with a manifest entry.

Build size: MEDIUM (new page in an existing pattern plus a lesson row); SMALL if only a pitch section and letter are added.

Duplication and collision risks
- Schools is its own lane under the multi session rules; claim it in a separate draft PR.
- The 21 modules count is hardcoded in several places; adding a 22nd needs all of them changed or the pitch reads wrong.
- Terminology: "handover" in this codebase is the child app link handover (`QrHandoverModal`, `profiles.handover_choice`). The schools pitch must say "first phone deal" or "the Year 6 phone plan", never "handover".

---

## 7. Marketing safe and unsafe claims

Where it lives
- Voice rules: `digi/03-voice.md` (the "Words DiGi never uses" table already bans "addiction"), `content/brand-story/founding-story.md` lines 170 to 185 (the Baby Einstein rule: never claim developmental outcomes; never relitigate the ban), `.claude/skills/content-engine/SKILL.md` (the Scientist agent, the briefing ledger as the only claim source, demoted sources banned).
- Claims audit: `audit/2026-09-05-current-state-audit/A1-claims-evidence.md` (the public claims register, 15 items, finds that no claims register exists and names `research/2026-08-31-marketing-evidence-research.md` as the nearest thing, with its HARD RULE lines).
- Live marketing copy that carries claims: `app/page.tsx` (blue light 90 minutes, "it is the phone", two weeks, nine in ten), `app/(marketing)/join/page.tsx`, `app/(marketing)/ban-workarounds/page.tsx` lines 434 to 445, `app/(marketing)/evidence/page.tsx` (DRAFT), `lib/content/passport.ts` line 41 (Australia figure).

What already exists
- The rule set is spread over four files; the audit's observation 14 says explicitly "Existing claim register: none".
- Several unsafe claims from the briefing's list are already live and unsourced on the homepage (item 1 blue light 90 minutes, item 2 "it is the phone", item 3 "within two weeks"), and three ban figures conflict (60 percent, 61 percent, two thirds).

Genuinely new
- One claims register file in `research/` (the briefing's safe list with sample sizes and country, the unsafe list with the words never to use), pointed at by CLAUDE.md's "research/01 voice rules" line, which currently points at nothing.
- The homepage fixes the audit already lists; the briefing's safe claims (device out of the bedroom, hours are a poor thermometer, the parent's phone is part of the picture) are direct replacements for items 1 to 3.

Build size: SMALL for the register and copy swaps.

Duplication and collision risks
- Do not create a second rules file beside `content/brand-story/founding-story.md`; the register should hold claims, the brand story holds voice.
- `digi/03-voice.md` line 50 replaces "addiction" with "compulsive use" or "habit loop", which is compatible with the briefing's unsafe list; keep them aligned.
- The ledger marks Common Sense and Pew figures as US; the register must carry the country column or the next post will quote "nearly 1 in 4 own a phone by 8" as UK.

---

## 8. Stage 4 content under the social_media_law flag

Where it lives
- Flag: `shared/social-media-law.ts` (`SOCIAL_MEDIA_LAW` from `NEXT_PUBLIC_SOCIAL_MEDIA_LAW`, `banIsActive`, `fullBanActive`, `BANNED_PLATFORMS`, `EXEMPT_PLATFORMS`, `banContextForDigi`).
- Readers: `lib/digi/system.ts` (BAN_CONTEXT and BAN_GUARDS in the static prompt), `lib/content/stages.ts` (`banWorld` on Stage 4), `app/(dashboard)/dashboard/scripts/[id]/page.tsx` line 109 (shows a ban note when `script.law_flag != 'none'` and the flag is on), `lib/config/landscape.ts` (schools volatile data, re exports the flag).
- Rows already flagged: 20 script rows `full_ban_u16` and 7 `partial_ban` across migrations 001, 153, 180 and others.

What already exists
- The whole switch. `banWorld` already leads with "messaging, gaming, watching, and the workaround trap" and its `gaming` action already says "Gaming is untouched by the ban... that is displacement not addiction. The social life moved somewhere."
- `banContextForDigi.full_ban_u16` already pivots DiGi to "the legal surface: messaging known friends, gaming, watching".
- `app/(marketing)/ban-workarounds/page.tsx` covers VPNs, false DOB, borrowed accounts (not flag driven, static copy).

Genuinely new
- Adding the two relocation destinations the current copy misses: the group chat as the named place the social life moves to, and the AI companion as the third. `banWorld.focus`, `banWorld.challengeActions.mood_changes` and `banContextForDigi` all need the companion sentence; none mention AI today.
- Replacing the uncited Australian figures with the briefing's confirmed ones (eSafety eight in ten 10 to 15 year olds still on four months after; 62 percent of girls feel the ban as punishment, with source), in `shared/social-media-law.ts` line 25, `lib/content/passport.ts` line 41 and `public/evidence.html`, so one figure appears everywhere.

Build size: SMALL (copy in three files, one bank row set inside migration 257 tagged `forecast` and `social_media`).

Duplication and collision risks
- `banWorld` only renders when the flag is `partial_ban` or `full_ban_u16`; the audit found `app/page.tsx` line 164 and `components/marketing/FaqAccordion.tsx` line 11 bypass the flag with present tense ban copy. Any Stage 4 rewrite should route those through the flag rather than adding a fourth hardcoded version.
- The `partial_ban` text in `social-media-law.ts` is dated June 2026 and says "Regulations land before the end of 2026"; the landscape refresh protocol in `lib/config/landscape.ts` says to review it monthly. Update the date stamp when the copy changes.
- Never add a second flag; `LANDSCAPE_CONFIG.social_media_law` already re exports the same one.

---

## Already built, surface do not rebuild

- `expert_knowledge` with semantic search, keyword fallback and the self healing embed sweep: `supabase/migrations/019_digi_brain.sql`, `142_expert_knowledge_semantic.sql`, `lib/digi/brain.ts`, `lib/digi/knowledge-embed.ts`. New research is rows only.
- The situation reader and the cross family outcomes ledger: `lib/digi/situation.ts`, `lib/digi/outcomes.ts`, migration 147, wired at `app/api/digi/route.ts` line 411.
- The horizons render path, already in the prompt and the word brief: `lib/digi/horizons.ts`, `app/api/digi/route.ts` line 703, `lib/digi/word.ts` line 240. Only the rows are missing.
- The stage arrival prompt, the one age trigger: migration 218, `app/api/digi/prompts/route.ts` lines 150 to 229, `stage_arrivals` table.
- The Year 6 into Year 7 phone bridge: `lib/learning/transition.ts`, `app/(dashboard)/dashboard/secondary/page.tsx`, `components/home/PhoneBridgeCard.tsx`, the `first-phone` agreement in `lib/content/agreement-clauses.ts`.
- The no confiscation promise in the child's words: `tell_a_parent_cards` in migration 163 (one per stage, shown to parent and child).
- The end of screen time routine: Builder lesson "The cool down lap" (018, 033) and "Why stopping feels hard, and how to win at it".
- AI companions: Explorer lesson "AI companions and real friends", Shaper lesson "AI companions and chatbots" (106, module 15), script "An AI chatbot as a friend", the AI module in `lib/config/ai-module.ts` and `ai_lessons`.
- Money and spend: school module `ks2-05-gaming-time-spend`, Roblox spend cap in `social_platform_guides` (093), "Kids money and pocket money app" tool (095), "Money of their own" script (159).
- Sleep and the bedroom rule at every stage: Builder "Screens and sleep" and "Setting the bedroom rule before it is hard", Shaper "Sleep is not optional", `stages.ts` Stage 2 script, `screen-tips.ts`, the Carter row in 218.
- The ban switch and its readers: `shared/social-media-law.ts`, `stages.ts` `banWorld`, `lib/digi/system.ts` BAN_GUARDS, `scripts/[id]/page.tsx` ban note, 27 flagged script rows, `app/(marketing)/ban-workarounds/page.tsx`.
- Parent wellbeing and normal moments in the bank: migration 054 `normal_moments`, MindEd row in 019, `parent_care` prompt kind.
- The claims audit and the nearest claims register: `audit/2026-09-05-current-state-audit/A1-claims-evidence.md`, `research/2026-08-31-marketing-evidence-research.md`.
- The reflective question and "ask one question on pushback" rules: `lib/digi/system.ts` lines 100 to 110, `digi/03-voice.md` lines 98 and 102 to 114.
- The schools hub print pattern for a heads letter: `schools/app/hub/parents`.

Migration number to claim: 257 (256 is on this branch, unmerged; 255 is the top of origin/main). Name it in the draft PR title before writing it.