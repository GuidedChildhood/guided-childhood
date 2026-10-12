# The series plan

Nine videos. Winner: the conversion first concept, with the best of the proof first and story first concepts grafted in. Round one scores, all four judges voting to build: 8, 8.3, 7.5, 8.1.

HOW IT WAS PICKED. Judge totals: Concept 1 (conversion) 8 + 8.2 + 8 + 7.5 = 31.7. Concept 3 (proof) 7.5 + 7.6 + 7.5 + 6.5 = 29.1. Concept 2 (story) 7 + 6.9 + 6.5 + 7 = 27.4.

Concept 1 is the base because it was the most buildable and the most measurable:
- free script 9671 as the payoff;
- tile matched CTAs;
- 15 second and 6 second paid cuts;
- the /v/<code> counter;
- the protected bedtime comparison flash.

Concept 3 brings the fastest hook (the full line on frame one), the most honest thinking beat and the real follow up row. Concept 2 brings the emotional background plates, the send lines that name a person, and the rule that no DiGi reply wording is fixed until it is captured or rails checked.

STRINGS I CHECKED IN THE CODE TODAY:
- Script 9671's Say this is verbatim at supabase/migrations/363_school_day_windows.sql:82: "The hard bit is always the stopping, so let us decide the stopping before we start." The stage direction in brackets before it is never shown.
- "Did you get to try it?" is at components/daily/ConcernCheckIn.tsx:883. "Noted. Now, how is it going?" and "Noted. Sort of counts. Now, how is it going?" are at :907 to 909.
- The middle face line uses the template "{band}, up from {last band}." in lib/concerns/outcome.ts:111, which renders "Getting there, up from hard going."
- "Sorted! That is a great day." is at outcome.ts:84.
- /dev/concern-scale exists.
- ref-ask-first does render a "locked banner" (FixtureViews.tsx:11 and :67), so it is cropped out of every frame.

WHY THIS SHAPE CONVERTS:
1. One concept per video beats one long film for cold reach. In the 103 second film the CTA arrived at 98 seconds. The paid hero now lands it at 25.6 seconds and the organic hero at 39.0.
2. Each problem short is named by its real worry tile (lib/onboarding/worries.ts). The parent ticks the same tile on the stage check, and the result answers it tonight (ResultScreen.tsx). The video's promise is kept on the landing page.
3. The parent's own words from frame one is the strongest hook found in this niche. Saves come from one usable thing, so a free script line is the hero frame, and it is waiting for the parent after sign up.
4. The star quest is the one thing no competitor has, so it gets its own film, built around an ask, never a flat no.

JUSTIN'S NOTES, ALL HONOURED:
- Zoom so the phone text reads big: frameless UI, body text at least 47px, hold = 0.6 seconds + words divided by 3.3, never under 1.4 seconds.
- Top 5 moments: five real worry tiles in the hero close, plus the five moments short. Never called "top" until the starter_leads.answers count is run.
- The real thinking messages: ThinkingReassurance lines 3 and 4 in their true order. Line 1 is never framed.
- The pathway as it appears in the app: TodayPathBig in the organic hero, PassportBook in the first phone short. StageRoad is brand art only.
- A new screen timer video with research: storyboarded below, with the code checks it needs.
- A slick home page backdrop: on every beat and the end card.
- Our Pixar style DiGi: the 3D clay star with its GSAP moods and the Kling idle loop.

THE MUST FIXES, AND WHERE EACH WAS FIXED:
- The hook was typed in at 8 words a second. It is now set in full on frame one.
- The thinking beat showed one line for 2.6 seconds. It is now 4.4 seconds, lines 3 then 4.
- The hero was crammed. Bedtime moved out to the timer film and the bedtime short. The pathway stays only in the organic cut. The paid cut is 30.6 seconds.
- A week on straight after one reply read as an outcome promise. A believable middle step now comes first: "Getting there, up from hard going."
- Script 103 is out everywhere. It is paid, advises a two minute warning, contains dashes and has the parent calling stop.
- Sam's age: the Hiniker tag (ages 1 to 5) appears only if Justin makes Sam 5. Otherwise no research tag.
- Short 5's Xbox "him" contradicted the family ages. That short is folded into an A/B hook on the hero.
- "Jobs earn stars" became "Jobs add stars." The timer film leads with "A plan you make together."
- The bedtime line becomes "Bedtime is protected. No stars can buy it. Only a grown up can say yes."
- The slate becomes REAL APP SCREENS, EXAMPLE REPLIES. The push is a neutral card labelled NOTIFICATION SHOWN AS DESIGNED, never fake iOS chrome.
- The locked banner and the "Make your bed" blockingJobs state are cropped out.
- Gold: one underline per film. On the end card the butter button is the only gold accent.
- The end card has one character: DiGi, with the friends road blurred to texture.
- No directional blur and no 0.1 scale jitter.
- The device stays the same: a tablet throughout the hero, matching "on the Tablet" in ref-timer-nudge.
- The group chat short gets the real SAFEGUARDING_OPENER beat.
- The proof short's safeguarding wording becomes "When it is serious, the safeguarding route comes first."
- The Ofcom 56 to 83 percent figure is used with its source.
- Every reply beat carries ILLUSTRATIVE REPLY and is captured from a seeded dev account. Any rename means the rails check runs again.

PRODUCT FIXES BEFORE ANY FRAME. These go through the feedback filter, and nothing was edited in this pass:
- Script 103: the two minute warning, the dashes, "builds compliance", and the parent calling stop.
- Script 2 and moment card 073:103: both advise a two minute warning.
- Script 9650's Why paragraph: "far better" and "on every measure".
- Script 9671's Why paragraph: it cites Hiniker without the ages 1 to 5. It stays off screen.
- Thinking line 1: suggested rewording "Checking our reviewed research first."
- digi/02-scientists.md: the Orben window and the 0.4 percent credit.
- The DeviceTimeCard.tsx:402 "healthy amount" variant: never filmed.
- ParentDeviceTime hardcodes "five minutes" even when the rate is custom.

NEEDED FROM JUSTIN:
1. Approve DiGi-star-3d.png as the film DiGi, approve the edit to section 3 of brand/GDC_SOCIAL_VISUAL_SYSTEM.md, and pull the full resolution Higgsfield originals 5ba895ef and 9199c10c.
2. Confirm the film family: Ava, 9, and Sam. Say whether Sam becomes 5, which unlocks the Hiniker tag on the early years cut.
3. Approve the /v/<code> counter build, and a migration number if one is needed.
4. Approve the fixture extensions: a Coming off screens row with source digi, a followUp variant on ref-baseline-checkin, and ref-progress if wanted.
5. Pick one GREEN scene for the founder short.
6. Say whether the Rachel quote is a real, permissioned customer. Until then it stays cropped out.
7. Decide the product fixes above.

## 1. Hero: The one thing to do, and the words to say

- **Job:** Converts warm viewers and is the main retargeting film. It shows the whole loop for one fight (switch off, Ava, 9): her parent's words, DiGi thinking, the free script line, the timer calling time, DiGi coming back to ask, the honest middle, Going great, then the stage check. It is also the landing page film and the pinned post. WAVE 1.
- **Length:** 44.0s organic master (end card from 39.0s). Paid cut 30.6s (CTA at 25.6s). 15s cut. 6s cut. 16:9 rebuild at 75 to 90s for YouTube and LinkedIn desktop.
- **Aspect:** 9:16 1080x1920 master; 4:5 by crop (all critical content inside x 90 to 990, y 285 to 1550); 16:9 rebuilt as a split stage
- **Platforms:** Reels, TikTok, Shorts, Facebook Reels and Feed (4:5), retargeting, website hero; 16:9 on YouTube and Justin's LinkedIn
- **Hook:** A/B test on the same body. A: "Switching off the tablet is a fight every night. What do I say?" B: "I'm always the bad guy when the tablet goes off. Every single day." Both are set in full on frame one, labelled AN EXAMPLE FAMILY. REAL APP SCREENS, EXAMPLE REPLIES.
- **CTA:** What stage is your child? Three questions, no sign up. guidedchildhood.com/starter-pack (button: Find my child's stage). Caption first line: Send this to whoever ends screen time in your house.
- **Beats:**
  - 0.0 Parent line set in full in the real periwinkle pill over the home page ground
  - 4.2 Send, then a pull out into the frameless chat. The clay star lands.
  - 5.0 WHAT DIGI SHOWS WHILE IT THINKS: real lines 3 and 4 at 72px
  - 9.4 The captured reply streams, labelled ILLUSTRATIVE REPLY
  - 11.4 Cut on the link shape into free script 9671. The Say this line is lifted, with the film's one gold underline.
  - 17.2 The timer says stop. Not you. A shared countdown, nothing is locked.
  - 22.0 A FEW DAYS ON: Did you get to try it? Then Getting there, up from hard going.
  - 27.6 A WEEK ON: Going great. Sorted! That is a great day. Labelled YOUR OWN CHECK IN.
  - 33.2 Ava's path today (organic cut only)
  - 35.4 Five real worry tiles from the stage check: Whatever tonight's fight is.
  - 39.0 End card on the home hero

## 2. Short 1: The switch off fight (Coming off screens)

- **Job:** Cold reach on the rank 1 problem: Mumsnet's number one, and the most discussed theme in the Reddit comments. WAVE 1.

Main cut: Ava, 9, with free script 9671 and no research tag.

Early years cut: Sam, with free script 9650, "When this episode finishes, the tablet finishes too. Not me, the tablet." It carries the tag "Hiniker et al. 2016, ages 1 to 5" ONLY if Justin makes Sam 5. Otherwise no tag. It is only served to early years audiences.
- **Length:** 21 to 30s, plus 15s and 6s cuts
- **Aspect:** 9:16 and 4:5
- **Platforms:** Reels, TikTok, Shorts, Facebook
- **Hook:** The parent line is set on frame one: "Screens off. Same fight, every single day. What do I say?" The background plate is from Concept 2: a hand on the remote, the TV going black at 2s, objects only. The plate's text card reads: "You press off. The whole house holds its breath."
- **CTA:** Coming off screens? Find your child's stage. Three questions, no sign up. guidedchildhood.com/starter-pack. Caption first line: Send this to the parent who has the five o'clock fight.
- **Beats:**
  - Frame one: the parent line over the remote plate, labelled as an example family
  - WHAT DIGI SHOWS WHILE IT THINKS: real line 4 at 72px, "Never a flat yes or no. Working out your next step."
  - The captured reply (ILLUSTRATIVE REPLY), then the script page with Say this lifted: 9671 for Ava, 9650 for Sam
  - The child's real countdown to "Time for offline fun!", with "SHARED COUNTDOWN. NOTHING IS LOCKED."
  - A FEW DAYS ON: Getting there, up from hard going. Then A WEEK ON: Sorted! That is a great day. Labelled YOUR OWN CHECK IN.
  - End card

## 3. Short 2: Not an age. A stage. (Asking for a phone)

- **Job:** Cold reach on the first phone, which has the best funnel fit: the honest answer to "should I?" is "find the stage", and that is the CTA itself. Also used for Year 5 and 6 transition timing. WAVE 1.
- **Length:** 25 to 34s, plus 15s and 6s cuts
- **Aspect:** 9:16 and 4:5
- **Platforms:** Reels, TikTok, Shorts, Facebook, LinkedIn; the transition cut goes to schools
- **Hook:** "Not an age. A stage. Which is yours?" in text from frame one, over pencil height marks on a door frame (hands only)
- **CTA:** Asking for a phone? Find your child's stage. Three questions, no sign up. Caption first line: Send this to the Year 5 parent who heard it today.
- **Beats:**
  - The parent pill (illustrative, renamed to Ava and run back through the rails check): "Ava's in Year 5 and says she's the only one in her class without a phone. Where do I start?"
  - Real thinking line 3 at 72px: "Finding where your child is on their pathway."
  - The captured reply, punched in on its plan together line and its Tonight line
  - Script 9653: only its Tonight field and its If they push back field. Never Say this, For your child or Why it works.
  - "Phone ownership: 56 percent at 10, 83 percent at 11." Source line: Ofcom, Children and Parents report, May 2026
  - PassportBook stage page (ref-passport-book?stage=2), name swapped. Never captioned ready or safe.
  - The stage check's first question, then the Asking for a phone tile ticked. The CTA is the same tap.

## 4. Star quest and the screen timer: The timer says stop. Not you.

- **Job:** The differentiator no competitor has, and the answer to rank 3 (always the bad guy, policing without a plan). It is the screen timer film Justin asked for, and the second touch for anyone who watched half of a problem short.

It shows: jobs add stars, stars become minutes at the family's rate, the ask, protected bedtime that only a grown up can open, three kinds of time, and the shared countdown.

It never says earn your screens, never claims it cuts screen time, and never shows a lock. WAVE 1.
- **Length:** 44.6s master, plus a 15s retargeting cut
- **Aspect:** 9:16 and 4:5
- **Platforms:** Reels, TikTok, Shorts, Facebook retargeting, LinkedIn native
- **Hook:** "Who says stop in your house?" over the real countdown digits
- **CTA:** What stage is your child? Three questions, no sign up. Caption first line: Send this to whoever ends up being the bad guy at screen time.
- **Beats:**
  - A plan you make together. Jobs add stars.
  - One star is five minutes. You set the rate.
  - The child asks. The parent gets the ask: An ask. Never a flat no.
  - 8.10pm: the child's warm resting line, then the parent's "Saying yes still works."
  - A 1.2s comparison flash: the same popup outside bedtime, with no warning
  - Bedtime is protected. No stars can buy it. Only a grown up can say yes.
  - Their time, three kinds: the deal you agreed holds the line
  - Both phones hit zero: The timer says stop. Not you.
  - End card

## 5. Short 4: Bedtime is protected (Bedtime screens)

- **Job:** Wave 2 reach on bedtime and the phone at night, for parents of 8 to 16 year olds. It has the cleanest proof path in the product and backs the statutory RSHE sleep line. It promises no sleep outcome and makes no blue light claim.
- **Length:** 21 to 30s, plus 15s cut
- **Aspect:** 9:16 and 4:5
- **Platforms:** Reels, TikTok, Shorts, Facebook
- **Hook:** "Ten o'clock. Phone off. Same argument, every single night." (labelled illustrative), over a phone face down on a bedside table whose screen glows once
- **CTA:** Bedtime screens? Find your child's stage. Three questions, no sign up. Caption first line: Send this to whoever does bedtime in your house.
- **Beats:**
  - The marker shows the default bedtime for the age on screen (migration 223: 20:00 for ages 8 to 10), so the marker never contradicts the product
  - The child taps Start and gets: "Screens are resting now. I know that is disappointing. Morning is coming."
  - The parent's real popup (ref-ask-popup?bedtime=1): "Screens are meant to be resting right now. Saying yes still works." with Yes, Not now, Decide later
  - Bedtime is protected. No stars can buy it. Only a grown up can say yes.
  - "Screens rest an hour before bed. Paediatricians say the same." (RCPCH 2019)
  - Small line: Nothing buzzes on their phone from 7pm to 7am (lib/push/quiet-hours.ts)
  - End card

## 6. Short 5: 47 unread in Year 6 chat (What they come across online), plus the school newsletter cut

- **Job:** Wave 2 reach on the most intense worry, and the cut a head will paste into Friday's newsletter. It shows the words and the route to real people. It never shows harm, a uniform, a logo or a child's face.
- **Length:** 25 to 34s; newsletter cut 30 to 45s with no price, no trial and no founder rate
- **Aspect:** 9:16 and 4:5; 16:9 newsletter embed
- **Platforms:** Reels, Facebook, school newsletters via the schools lane, Justin's LinkedIn
- **Hook:** Text only, labelled ILLUSTRATIVE next to the line: "Saturday, 10.52pm. 47 unread in Year 6 chat." Then "Monday, 8.50am."
- **CTA:** What stage is your child? Three questions, no sign up.
- **Beats:**
  - The parent types to DiGi that evening
  - Real thinking line: "If it is ever serious, DiGi points you to real people first."
  - The captured reply's reception line, then one step and the words (rails checked)
  - The real SAFEGUARDING_OPENER from lib/digi/safety.ts naming CEOP and the school's Designated Safeguarding Lead, with the label: When it is serious, this comes first
  - "School keeps phones away all day. The evening is where the plan has to live." (DfE, Mobile phones in schools, statutory from September 2026)
  - End card. WhatsApp's UK minimum age stays off screen because it is unverified.

## 7. Five moments. The words for each.

- **Job:** Justin's top moments note, as a save magnet. A visible countdown (the Dr Julie shape) runs through five real worry tiles, each paired with one verbatim line from a FREE script.

Every line is checked against the two minute warning list (script 2, script 103, moment card 073:103) before filming.

It is never called top until the anonymous starter_leads.answers count is run. Wave 2.
- **Length:** 30 to 40s
- **Aspect:** 9:16 and 4:5; carousel version
- **Platforms:** Reels, TikTok, Shorts, Facebook, Instagram carousel
- **Hook:** "Five fights. The words for each. Which is yours?" with a five step stacker on screen from frame one
- **CTA:** Which one is yours? Find your child's stage. Three questions, no sign up.
- **Beats:**
  - 5 What they come across online
  - 4 Bedtime screens
  - 3 Controller fights
  - 2 Asking for a phone
  - 1 Coming off screens
  - For each moment: the real tile, then one line lifted at 64px, timed by the reading rule
  - End card: the same tiles in the stage check picker

## 8. Founder short: Why I built it

- **Job:** Trust, on Justin's proven channel. One true GREEN scene from content/brand-story/founder-context.md, then cut to the real screens doing what he describes. No children on camera, and no AMBER or RED scene. Wave 2. Blocked until Justin picks the scene.
- **Length:** 30 to 45s
- **Aspect:** 4:5 for LinkedIn, 9:16 for Reels
- **Platforms:** LinkedIn (link in the first comment), Reels, retargeting
- **Hook:** Justin's own first line, 12 words or fewer, taken from the GREEN scene he picks. Not drafted here, so nothing is invented.
- **CTA:** What stage is your child? Three questions, no sign up. guidedchildhood.com/starter-pack
- **Beats:**
  - Justin to camera, shot on a phone, captions burnt in at 60 to 72px
  - One scene, then one sentence on what was missing: a plan, not a ban
  - Three real screen inserts: the thinking line "Looking for the words you can actually use.", the script line, the ask
  - Justin says the stage check line

## 9. Proof short: Where every answer comes from

- **Job:** Answers "is this just ChatGPT?" for people who watched the hero or the timer film. It shows the research base without implying endorsement. Wave 2. Fix digi/02-scientists.md before release.
- **Length:** 20 to 30s
- **Aspect:** 9:16 and 4:5; 16:9 for LinkedIn
- **Platforms:** Retargeting, LinkedIn, website
- **Hook:** "Is it just ChatGPT? Here is what is underneath."
- **CTA:** What stage is your child? Three questions, no sign up.
- **Beats:**
  - Eyebrow: RESEARCH WE DRAW ON. On every paid cut: Their published research, not an endorsement.
  - Orben: Timing matters, girls earlier than boys.
  - Przybylski: Small effects. How, not just how long.
  - Odgers: Offline life predicts online risk.
  - Over 140 findings. Studies, national surveys and charity reports. Each one checked by a person before DiGi can use it. (Use the live count if someone runs it.)
  - When it is serious, the safeguarding route comes first.
  - A deadline is not a plan.
  - End card

## The hero storyboard

### 0.0 (4.2s)

- **visual:** Home page ground: the butter radial gradient, with the Planet Friends road at 35 percent opacity and 24px blur along the bottom. The real periwinkle parent pill (#DCE7FB, ink #1B2A4A, Nunito 800) is ALREADY SET IN FULL on frame one, centred in the critical box. No typing in. Hold = 0.6 + 12 words / 3.3.
- **onScreenText:** Eyebrow (Plex Mono 32px): AN EXAMPLE FAMILY. REAL APP SCREENS, EXAMPLE REPLIES. Pill (96px), hook A: Switching off the tablet is a fight every night. What do I say? (Hook B variant: I'm always the bad guy when the tablet goes off. Every single day.)
- **screen:** DOM lift of the DigiChat composer and pill from /ref-digi-chat?kids=1 on this worktree's own dev server. Teo is swapped to Ava by tools/names.json, and the Next.js badge is hidden (nextjs-portal{display:none!important}).
- **camera:** Locked at S 5 on the pill. Linear drift of 1.5 percent at most.
- **sound:** Soft key taps as sound only under the first second, then a warm low piano note. No voiceover; the UI is the caption.

### 4.2 (0.8s)

- **visual:** Send pop: the pill scales 0.88 to 1 (back.out(2), origin bottom right). The frameless chat assembles around it. DiGi, the 3D clay star (DiGi-star-3d.png), drops into its avatar spot with a landing squash (scaleX 1.12, scaleY 0.88, 0.09s).
- **onScreenText:** None; the pill stays legible as it settles into the thread
- **screen:** Same recording, sent state. A Playwright route holds POST /api/digi about 9s.
- **camera:** Pull from S 5 to S 2.6, 0.8s, power3.inOut
- **sound:** Soft send tick and a star landing tick

### 5.0 (4.4s)

- **visual:** The trust beat and the biggest UI moment. The real thinking row: the clay star in its product thinking mood (minus 10 degree tilt, 4px lift, 1.2s sine), the cream pill with three bouncing dots, and ThinkingReassurance fading on its own 2.2s interval. The edit cuts in 4.4s into the real wait, so lines 3 and 4 show in their true order. Line 1 is never framed. No caption calls them live steps.
- **onScreenText:** Top band (Plex Mono 32px): WHAT DIGI SHOWS WHILE IT THINKS. Then at 72px: Finding where your child is on their pathway. (5.0 to 7.2) Then: Never a flat yes or no. Working out your next step. (7.2 to 9.4)
- **screen:** /ref-digi-chat?kids=1, held thinking state (components/digi/ThinkingReassurance.tsx, real rotation)
- **camera:** Push to S 4.2 on the thinking row in 0.7s, landing 0.2s before line 3 fades in, then locked
- **sound:** Music dips; a very soft three note thinking motif under the dots

### 9.4 (2s)

- **visual:** The reply streams in the real component, with no bubble and words fading in. A wide look at its shape: two bold lead ins, the bold underlined script link inside the text, the check in line, and the bold Tonight. No punch in here.
- **onScreenText:** Top band label (Plex Mono 30px): ILLUSTRATIVE REPLY. The reply's own words appear only as captured.
- **screen:** The reply body is CAPTURED from a seeded dev account asked the hook A question for Ava, 9, or is a stub that has passed the panel's three lens rails check: under 120 words, Tonight last, one script link, no allow or deny, no dashes, no Hiniker claim for a nine year old. It must link [The stopping point agreed in a calm moment](/dashboard/scripts/9671); if the capture links something else, re run it. Organic cut only.
- **camera:** Locked at S 2.6
- **sound:** A very low word shimmer

### 11.4 (5.8s)

- **visual:** Tap ripple on the inline link (44 CSS ink at 20 percent, no finger). A plain cut matched on the link's shape, with no directional blur, into the script page. Only the title, the FREE tag and Say this are in frame. The bracketed stage direction and Why it works are never in frame. The film's ONE gold underline draws under the second half, 0.25s after the line lands.
- **onScreenText:** Eyebrow (34px): FREE SCRIPT. Title: The stopping point agreed in a calm moment. Eyebrow: SAY THIS. Lifted line (72px): The hard bit is always the stopping, so let us decide the stopping before we start.
- **screen:** /dashboard/scripts/9671 on the local dev server with a seeded test account. The Say this text is verbatim from supabase/migrations/363_school_day_windows.sql:82. Check sort_order and is_free against the live table.
- **camera:** S 3.4 on Say this, then still for the full rule (0.6 + 17 words / 3.3 = 5.75s)
- **sound:** A soft paper turn on the cut, and a light pencil sound as the underline draws

### 17.2 (4.8s)

- **visual:** Match cut from the word stopping into the child's real countdown digits at Structured scale, last seconds ticking to the plain end state. A 1s two phone reveal at the end, the only device frames in the film; the alarm lands on both.
- **onScreenText:** Overlay (84px, top band): The timer says stop. Not you. UI: Time for offline fun! Small mono (32px): SHARED COUNTDOWN. NOTHING IS LOCKED.
- **screen:** /ref-ask-first?view=timer with a stubbed clock, names swapped to Ava, device Tablet. Capture the plain "Time for offline fun!" (DeviceTimeCard.tsx:403), never the :402 "healthy amount" variant. The locked banner is never in frame.
- **camera:** Locked at S 4.2 on the digits, then one cut to S 1.9 for the two phone reveal. No research tag on this beat.
- **sound:** Three soft ticks, then the real timer chime on both phones

### 22.0 (5.6s)

- **visual:** Time marker card, then the real check in row "Coming off screens" with DiGi's follow up line above its faces. Tap ripple on Yes, the reply line, then a tap on Getting there and its real outcome line. This is a line on the check in, never a push.
- **onScreenText:** Marker (Plex Mono 34px): A FEW DAYS ON. UI: Did you get to try it? Yes, Sort of, Not yet. Then: Noted. Now, how is it going? Then: Getting there, up from hard going.
- **screen:** /dev/concern-scale (its first row carries a followUp), with the label swapped to Coming off screens and the suggestion swapped to the captured reply's Tonight action. Strings are verified at ConcernCheckIn.tsx:883, :907 and outcome.ts:111.
- **camera:** Locked at S 3.4; each line read in turn by the rule
- **sound:** Button press click (translateY 4px, shadow 0 5px 0 to 0 1px 0)

### 27.6 (5.6s)

- **visual:** A second marker, then the same row's five faces. A tap on Going great, the real pressed state, then the real outcome card. No confetti, no sticker. The clay star does one happy hop at the edge of frame.
- **onScreenText:** Marker (34px): A WEEK ON. Faces (61px): Really tough, Hard going, Up and down, Getting there, Going great. Outcome (58px): Sorted! That is a great day. Off your list. We will check in a week that it held. Small mono label beside the face (32px): YOUR OWN CHECK IN
- **screen:** /ref-baseline-checkin via scenes/checkin-great.json, with Mood after screens swapped to Coming off screens. Capture before the confirm post, which returns 401. Copy from lib/concerns/outcome.ts:84 to 85.
- **camera:** S 3.6 on the faces, then one reframe (0.7s, power3.inOut) to S 3.4 on the outcome card, then hold
- **sound:** A small two note rise

### 33.2 (2.2s)

- **visual:** Match cut: the Going great face circle becomes the current node of the real in app path. Hold on the node and the Next card. No dolly, keeping one move per beat. ORGANIC CUT ONLY.
- **onScreenText:** Ava's path today (57px, the real title). No caption that says ready or safe.
- **screen:** /ref-today-path (TodayPathBig), names swapped. Not StageRoad, which is not mounted live.
- **camera:** Locked at S 3.0 on the current node
- **sound:** Soft footstep ticks

### 35.4 (3.6s)

- **visual:** The real stage check worry picker. Five tiles lift out into a column at frame width, one every 0.7s, each getting a tick, then settle back into the picker. This match cut leads into the CTA. The word top is never used.
- **onScreenText:** Overlay (72px, top band): Whatever tonight's fight is. Tiles (60px): Coming off screens. Asking for a phone. Controller fights. Bedtime screens. What they come across online.
- **screen:** /starter-pack worry step on this worktree's dev server (labels from lib/onboarding/worries.ts:44 to 52)
- **camera:** Locked at S 2.6; the tiles move, the camera does not
- **sound:** Five soft ticks, rising

### 39.0 (5s)

- **visual:** End card on the sharp home page hero, cropped: no announcement bar, no generated photo of children, no Rachel quote, no founder price. ONE character: DiGi on the approved Kling idle loop (blinks, eye squints), 480px wide. The friends road is blurred to texture. A real chunky butter button presses once; it is the only gold accent. The card settles from S 1.04 to 1.0 in 0.7s, then holds fully still.
- **onScreenText:** What stage is your child? (96px) Three questions, no sign up. (56px) Button (60px): Find my child's stage. URL (Plex Mono 42px): guidedchildhood.com/starter-pack. Slate (30px): AN EXAMPLE FAMILY. REAL APP SCREENS, EXAMPLE REPLIES.
- **screen:** www.guidedchildhood.com hero captured at 390x844 at 3x, with the film's own type set over it
- **camera:** Settle, then still for at least 3s. Everything above y 1550.
- **sound:** Music resolves on the button press, then silence for the last second so the loop restarts cleanly

## The timer film

{
 "title": "Star quest and the screen timer: The timer says stop. Not you.",
 "length": "44.6s master. 15s retargeting cut: beat 1 (2.6s), beat 4 (4.0s), beat 10 (4.0s), end card (4.4s).",
 "aspect": "9:16 1080x1920 master; 4:5 by crop",
 "researchNeeded": "CHECK IN THE CODE BEFORE CAPTURE. Every rate and line on screen must match the code.\n1. Star rate. STAR_MINUTES / NEXT_PUBLIC_STAR_MINUTES defaults to 5 (lib/quests/templates.ts:25), with a per child rate (migration 225, TimeTiersCard). ParentDeviceTime hardcodes \"five minutes\", so keep fixtures at 5 or fix that copy.\n2. Weekly cap. Read weeklyStarCap for age 9 in lib/quests/star-week.ts, and what ref-time-tiers renders. Show no number the component does not render.\n3. Ask cases. app/api/quests/time/start/route.ts turns a start into an ask in four cases: Ask first trust (confirm it is the default), a protected window, over 1.5 times the daily guide, or short of stars. Copy the exact push strings (plain ask ⏳ near :335; protected 🌙 near :332). Never film the over the day variant, which cites the unsourced daily guide.\n4. Protected windows. checkProtectedWindow defaults by age band (migration 223): 20:00 to 07:00 for ages 8 to 10. Mealtimes and school hours are OFF by default, so say \"you can protect school hours\", never \"it protects\". The child line is at lib/quests/time-tiers.ts:147. Confirm which ref view renders it; if none does, add a fixture state rather than mocking it.\n5. Quiet hours. Nothing reaches the child's phone from 19:00 to 07:00 (lib/push/quiet-hours.ts).\n6. Parent options. Spend their stars, Gift it, Free bonus on /ref-ask-popup. The bedtime line \"Saying yes still works.\" is at components/quests/AskPopup.tsx:172.\n7. The countdown. Confirm ref-ask-first?view=timer runs to zero with a stubbed clock, and that both phones get the alarm (ParentDeviceTime.tsx near :207). Capture DeviceTimeCard.tsx:403 \"Time for offline fun!\", never the :402 \"healthy amount\" variant.\n8. Crops. Keep the \"locked banner\" (FixtureViews.tsx:11, :67, view=parent) and any blockingJobs \"Make your bed\" state out of every frame.\n9. Not verified, so never claimed: how a second parent joins; that any device locks (none does); that the timer cannot be got round.\n\nEVIDENCE LIMITS FOR THE COPY\n- Tang et al. 2018 and Nagata et al. 2024 (both cross sectional) link screens used as a reward with more screen time. So the film never says earn, never claims stars cut screen time, and never claims they build motivation or responsibility. Stars are for jobs, never for reading or things the child already loves.\n- Hiniker et al. 2016 covers ages 1 to 5, and Ava is 9, so no research tag anywhere in this film.\n- RCPCH 2019 (screens rest about an hour before sleep) and the UK Chief Medical Officers 2019 (phones out of the bedroom at night) back the bedtime line. They go in the bedtime short, not here, to keep the reading load down. No sleep outcome is promised.\n- The 60, 75, 90 and 120 minute guides have no named source in the code, so they stay off screen.\n\nUX REFERENCES (already pulled from Mobbin)\nStructured's giant countdown scale, Jomo's +5min per routine, Finch's dotted trail, GoHenry's one big total. None of them sends protected time to a parent as an ask, which is why the bedtime sequence is the longest stretch.",
 "storyboard": [
  {
   "t": "0.0",
   "dur": 3,
   "visual": "The real countdown digits fill the frame at Structured scale, ticking, frameless, over the blurred butter home page ground.",
   "onScreenText": "Hook (112px): Who says stop in your house? Eyebrow (32px): AN EXAMPLE FAMILY. REAL APP SCREENS.",
   "screen": "/ref-ask-first?view=timer, clock stubbed, Ava swapped in, device Tablet",
   "camera": "Locked at S 4.2 on the digits",
   "sound": "Real countdown ticks, no music for the first second"
  },
  {
   "t": "3.0",
   "dur": 3.6,
   "visual": "A job stone ticks on Ava's real path. \"Claim your star\" is pressed (ripple and the real pressed state, no finger). The gold star flies, as a match cut, into her balance.",
   "onScreenText": "Overlay (72px): A plan you make together. Jobs add stars. UI: Claim your star",
   "screen": "/ref-kid-path, then ?claimed=1, name swapped",
   "camera": "S 2.6, then a single 0.7s reframe following the star into the balance",
   "sound": "Button thunk, a bright star chime, a warm marimba bed enters"
  },
  {
   "t": "6.6",
   "dur": 4.4,
   "visual": "The real timer nudge: balance, device chips, the 15, 30, 45 and 60 min chips, Start 30 min.",
   "onScreenText": "UI line read at S 3.4: 6 stars from Ava's 17 · on the Tablet. Overlay (56px): One star is five minutes. You set the rate.",
   "screen": "/ref-timer-nudge with Teo swapped to Ava. Check the exact rendered string after the swap, and keep the rate at 5.",
   "camera": "Frameless, locked at S 3.4 on the stars line, then hold by the rule",
   "sound": "Soft chip select clicks"
  },
  {
   "t": "11.0",
   "dur": 5,
   "visual": "Ava taps the real ask button on her view. Cut to a neutral notification card built in brand type, never fake iOS lock screen chrome, carrying the real push copy. This is the beat no competitor has.",
   "onScreenText": "Child UI: Ask for 30 min 🙋. Card label (Plex Mono 30px): NOTIFICATION SHOWN AS DESIGNED. Card: Ava is asking for screen time ⏳ / 30 minutes on the TV, that is 6 stars. Tap to say yes on your board. Overlay (72px): An ask. Never a flat no.",
   "screen": "/ref-ask-first?view=child (locked banner and blockingJobs states cropped out), then a card built with the copy from app/api/quests/time/start/route.ts",
   "camera": "S 3.4 on the button, then a plain cut to the card at S 3.4",
   "sound": "Gentle notification tone"
  },
  {
   "t": "16.0",
   "dur": 4.4,
   "visual": "Time marker, then Ava taps Start inside her bedtime window and gets the warm real line, not a lock and not a flat no.",
   "onScreenText": "Marker (34px): 8.10PM. ILLUSTRATIVE. Child UI (64px): 🌙 Screens are resting now. I know that is disappointing. Morning is coming.",
   "screen": "The child view in its protected banner state (confirm or add the fixture state). Copy from lib/quests/time-tiers.ts:147.",
   "camera": "Locked at S 3.4 on the line, then hold for the full rule (0.6 + 12 / 3.3)",
   "sound": "Music drops to a single soft pad, night ambience"
  },
  {
   "t": "20.4",
   "dur": 4.2,
   "visual": "Cut to the parent's real popup in its bedtime state, with the three real buttons. The UI sentence is read in place, with no overlay competing.",
   "onScreenText": "UI: Screens are meant to be resting right now. Saying yes still works. Buttons: Yes, Not now, Decide later",
   "screen": "/ref-ask-popup?bedtime=1 (components/quests/AskPopup.tsx:172)",
   "camera": "Locked at S 3.4",
   "sound": "Soft night chime as the popup slides in (y from minus 110 percent, back.out(1.6))"
  },
  {
   "t": "24.6",
   "dur": 1.2,
   "visual": "A comparison flash: the same popup outside bedtime, without the warning line. The viewer sees that the warning appears only in protected time.",
   "onScreenText": "Small mono tag (34px): OUTSIDE BEDTIME",
   "screen": "/ref-ask-popup with no bedtime flag",
   "camera": "Same framing as the previous beat, so only the line disappears",
   "sound": "None"
  },
  {
   "t": "25.8",
   "dur": 5,
   "visual": "The popup blurs to the ground and the deciding line sets over it. This is the film's one gold underline, on protected.",
   "onScreenText": "Overlay (84px): Bedtime is protected. No stars can buy it. Only a grown up can say yes.",
   "screen": "Built type card over the blurred /ref-ask-popup?bedtime=1 capture",
   "camera": "Locked; 1.5 percent drift only",
   "sound": "A light pencil sound as the underline draws"
  },
  {
   "t": "30.8",
   "dur": 4,
   "visual": "The real three kinds of time card. This beat answers the burned parent's \"so what holds the line, if nothing locks?\"",
   "onScreenText": "UI title read in place: Their time, three kinds. Overlay (64px): The deal you agreed holds the line. (No overlay repeats any \"earn\" wording; if the card itself says earned, it is read in place only.)",
   "screen": "/ref-time-tiers with GET /api/quests/time/settings stubbed",
   "camera": "Locked at S 3.0",
   "sound": "Three soft ticks, the bed lifts"
  },
  {
   "t": "34.8",
   "dur": 4.8,
   "visual": "Daytime. Both phones side by side, the only device frames in the film. The countdown hits zero on both, and both alarms show. Then a cut to the child's end line. No calm child afterwards, no warning shown as the cure. The film peaks here, straight into the end card.",
   "onScreenText": "Child UI: Time for offline fun! Overlay (84px): The timer says stop. Not you. Small mono (32px): SHARED COUNTDOWN. NOTHING IS LOCKED.",
   "screen": "/ref-ask-first?view=timer for the child and /ref-timer-nudge for the parent row, clock stubbed to zero; DeviceTimeCard.tsx:403 plain end state",
   "camera": "S 1.9 two phone establishing shot for 1.2s, then one cut to S 4.2 on the end line, then hold",
   "sound": "Countdown ticks, then the real chime on both sides"
  },
  {
   "t": "39.6",
   "dur": 5,
   "visual": "End card on the sharp home page hero, cropped as in the hero film. One character, the clay star on its idle loop, and the friends road blurred to texture. A real chunky butter button presses once; it is the only gold accent.",
   "onScreenText": "We are not parental controls. (48px) What stage is your child? (96px) Three questions, no sign up. (56px) Button: Find my child's stage. URL (Plex Mono 42px): guidedchildhood.com/starter-pack. Slate (30px): AN EXAMPLE FAMILY. REAL APP SCREENS.",
   "screen": "www.guidedchildhood.com hero capture with the crop list applied",
   "camera": "Settle from S 1.04 to 1.0, then still for at least 3s inside the critical box",
   "sound": "Music resolves on the press, then silence for the loop"
  }
 ]
}

## Measurement

BUILD BEFORE ANY OF THE FIRST £100 IS SPENT, AND BEFORE THE 30 OCTOBER REVIEW. Today the code counts no starts. It has no source tags, no pixel and no analytics, and a lead is only saved once an email exists.
1. Per video links on the existing /s/<code> pattern (app/api/school-link/route.ts): a /v/<code> redirect with one code per video per platform, for example h1-ig, h1b-ig (hook B), s1-tt, t4-fb, s5-news. Use them in bio links, Stories link stickers, LinkedIn first comments and every ad URL.
2. Anonymous counts: post {code, step} once at question one (a start) and once when the result shows (a completion). Store daily counts per code only: no email, no IP, nothing new stored on the device, so PECR consent is not needed.
3. Tag the profile with the code at account creation, the same way profiles.school_link is tagged at the trial grant. Then trials and paid conversions are known per video.
4. If a migration is needed, claim the number in the draft PR first, and fetch origin/main again right before the first push.
5. Run the anonymous aggregate count of worry tiles ticked in starter_leads.answers. It re ranks Wave 2 with first party data, and it is the only thing that unlocks the word top.

THE NUMBER. Starts per 1,000 views = tagged starts divided by platform views in the 7 days after posting, times 1,000. Beneath it, per video: completions over starts, accounts over completions, trials and paid over accounts, and week two return. The series is judged on trials, paid conversions and week two return, not on starts alone.

PLATFORM SIGNALS PER VIDEO. Share still watching at 2s (hook rate), average percent watched, saves plus sends per reach, link taps. Likes last.

Retention diagnostic (from Concept 3). Read the graph at the thinking beat (5 to 9s) and the timer beat (17 to 22s in the hero). If viewers drop at the thinking beat, cut it to one line before touching anything else. If they drop at the timer beat, tighten it before changing the hook.

DECISION RULES
- Hook A/B on the hero (question against bad guy) with the same body, judged on starts per 1,000.
- Compare two videos only once each has at least 20 starts (noise is still about plus or minus 45 percent).
- A short under half the median after 3,000 views gets a new first 3 seconds, never a new film.
- The first £100 (allowed from 30 October) goes to the short with the most starts per 1,000 whose completion rate is at or above the median.
- Wave 2 order follows Wave 1's tile pull and the starter_leads count.
- The spike method stays as a cross check for people who type the address.

RETARGETING (on platform video audiences only, since there is no pixel)
1. Cold: problem shorts.
2. Watched 50 percent of a problem short within 7 days: the timer 15s cut, then the paid hero.
3. Watched 50 percent of the hero or the timer film within 14 days: the proof short, then the founder short.
4. Price lines appear only where CAP 3.9 and 3.24 conditions are stated, and the founder offer stops the day the cap is reached.

HONEST SCALE. On illustrative assumptions (£15 CPM, 0.8 to 1.5 percent link CTR, 70 percent start rate), £1,000 buys about 370 to 700 starts. At 0.5 percent taps per view, organic needs about 2.3 million views for 8,000 starts. So every caption opens on a send line naming a person in the house, and Justin's LinkedIn carries the 16:9 hero and the founder short.

## Changelog

- BASE: Concept 1 (conversion), the top total score at 31.7. Kept: free script 9671 as the payoff, tile matched CTAs, the 15s and 6s paid cuts, the /v/<code> counter and decision rules, the protected bedtime comparison flash, the Olga to Ava swap (AMBER), and the ban on the DeviceTimeCard "healthy amount" end state.
- FROM CONCEPT 3: the parent's full line set on frame one with no typing in (key taps kept as sound only).
- FROM CONCEPT 3: the thinking beat at 4.4s, real lines 3 then 4, under the eyebrow WHAT DIGI SHOWS WHILE IT THINKS. Line 1 is never framed.
- FROM CONCEPT 3: the real follow up row ("Did you get to try it?" Yes, Sort of, Not yet, then "Noted. Now, how is it going?"). Verified today at ConcernCheckIn.tsx:883 and :907 to 909, on the existing /dev/concern-scale.
- FROM CONCEPT 3: the bad guy pain line as hero hook B, made device neutral ("when the tablet goes off") to keep tablet continuity. The retention diagnostic at the thinking and timer beats.
- FROM CONCEPT 2: the emotional plates ("You press off. The whole house holds its breath.", "Ten o'clock. Phone off. Same argument, every single night.") as backgrounds under the parent's own line, never as the stop on their own.
- FROM CONCEPT 2: send lines that name a person in the house, one per short. The end card settle (S 1.04 to 1.0, then still). The rule that no DiGi reply wording is fixed until it is captured from a seeded account or rails checked, especially after a rename.
- FROM CONCEPT 2: "An ask. Never a flat no." as the overlay on the parent push.
- PANEL ADD: a believable middle step before Going great, using the real template line "Getting there, up from hard going." (outcome.ts:111). Going great is labelled YOUR OWN CHECK IN, behind A FEW DAYS ON and A WEEK ON markers.
- PANEL ADD: "The deal you agreed holds the line." in the timer film, so "nothing is locked" does not read as toothless.
- FIX: script 103 removed everywhere. It is paid, advises a two minute warning, contains dashes, claims "builds compliance" and has the parent calling stop, which contradicts "the timer calls time, not you". Replaced by free script 9671, with Say this verbatim from 363_school_day_windows.sql:82 and its bracketed stage direction and Why paragraph never framed.
- FIX: the hero is decluttered to one fight. Bedtime moved to the timer film and the bedtime short. The pathway stays only in the organic cut, held with no dolly. The paid hero is 30.6s with the CTA at 25.6s; the organic master is 44.0s with the end card at 39.0s.
- FIX: every beat is timed by the reading rule. Overlays are split from UI sentences, for example the bedtime sequence becomes child line, parent line, comparison flash, then the overlay card. The tiles run at 0.7s each.
- FIX: one camera move per beat, then a still hold. No directional blur, no 0.1 scale jitter. One gold underline per film (the hero's say this line; protected in the timer film). On the end card the butter button is the only gold accent and DiGi is the only character, with the friends road blurred to texture.
- FIX: "Jobs earn stars" becomes "Jobs add stars". The timer film opens on "A plan you make together." and never shows an earn overlay.
- FIX: the bedtime line becomes "Bedtime is protected. No stars can buy it. Only a grown up can say yes.", which closes the gap beside "Saying yes still works."
- FIX: the slate becomes AN EXAMPLE FAMILY. REAL APP SCREENS, EXAMPLE REPLIES. Every reply beat carries ILLUSTRATIVE REPLY. The push is a neutral card labelled NOTIFICATION SHOWN AS DESIGNED, never fake iOS lock screen chrome.
- FIX: the ref-ask-first locked banner (FixtureViews.tsx:11 and :67, confirmed) and the blockingJobs "Make your bed" state are cropped from every frame.
- FIX: the Hiniker tag appears only on the early years Sam cut, and only if Justin makes Sam 5. There is no research tag on any timer line for Ava, 9. Concept 1's short 5 (Sam on the Xbox, "him", called the older child) is dropped, and its idea lives on as hero hook B.
- FIX: the first phone short is renamed to Ava in Year 5, which fits age 9, and the rails check runs again after the rename. The Ofcom 56 to 83 percent figure is used with its source (Ofcom, May 2026), as the judges confirmed it on the Ofcom page.
- FIX: the group chat short gets the real SAFEGUARDING_OPENER beat (CEOP and the school's DSL) plus the DfE statutory line. Its newsletter cut has no price. The proof short's wording becomes "When it is serious, the safeguarding route comes first", not "before any reply".
- FIX: the series is cut from ten videos to nine. Wave 1 is the hero, switch off, first phone and timer before 30 October; Wave 2 is gated on starts per 1,000 and the starter_leads count. The founder hook stays blocked until Justin picks a GREEN scene.
- FIX: brand. DiGi-star-3d.png and the Kling idle loop need Justin's yes AND an edit to section 3 of brand/GDC_SOCIAL_VISUAL_SYSTEM.md before render. The idle loop is image to video from the approved file only, with off model frames discarded.