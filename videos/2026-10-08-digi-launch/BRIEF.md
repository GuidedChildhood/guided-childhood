# DiGi, now inside Guided Childhood: the launch film

8 October 2026. Asked for by Justin: the QuickSend and Qbot launch brief
rewritten for Guided Childhood with DiGi at the centre, then built. Every
scene shows DiGi working inside a real surface of the platform.

workflow: product-launch-video
flow: standalone
destination: LinkedIn, YouTube, the DiGi page, the schools site. 16:9.
length: 45 seconds, six scenes

## The brief as approved

# DiGi launch video, the brief

Make a 45 second launch video for Guided Childhood, introducing DiGi, the guide built into it. Guided Childhood is the parent app that gets a child to sixteen ready for a phone and social media, ten minutes a day, with the parent and child working on it together instead of fighting about it. DiGi is the part a parent talks to: you tell it what actually went wrong today, it gives you the one thing to do and the words to say, and you watch the number move. Every scene shows DiGi working inside a real surface of the platform (the check in, Home, the scripts, the family's own agreement, the notifications), never floating on its own. Copy the structure, pacing and style of the first 30 seconds of this launch video: https://whatships.com/videos/rene/ No b roll. End on the Guided Childhood logo and the stage check line.

Build it in code with HyperFrames, in a new folder at videos/2026-10-08-digi-launch/ in this repo, the way the other house films are built (videos/2026-10-06-two-brains has the pattern: beats.json for every line and its timing, build.mjs writing the composition, GSAP for every move). Read the hyperframes skill first. Copy the real UI from the live product, never a mock up:

- the DiGi chat: app/(dashboard)/dashboard/digi/DigiChat.tsx
- the script card DiGi hands over: components/digi/DigiScriptNudge.tsx
- the check in faces and what the card says after a tap: components/daily/ConcernCheckIn.tsx and lib/concerns/outcome.ts
- Home with today's path: components/daily/TodayPathBig.tsx
- the follow up card and its push: lib/digi/followup-queue.ts and app/api/cron/followups/route.ts (the card is titled "How did that go?")

Where you need a screen, capture the live app with Playwright at 390 wide (the webapp-testing skill) and rebuild it in code at full resolution. Never invent a screen.

Brand: Nunito for everything (800 to 900 for headlines, 400 to 600 for body and chat), IBM Plex Mono 600 capitals for eyebrows and labels, the self hosted files in app/fonts/. Never Inter. Colours from shared/tokens.css: cream #F9F8F6 for the canvas, ink #1A1A2E for headlines and chat text, butter gold #EDC35F as the accent (the shimmer, the chosen face, the logo square), gold dark #C99A28 for eyebrows and shadows, butter tint #FFF6DE for the card that rests a worry. The chat is drawn the way the real one is: my bubbles are the pale sky #F0F9FF with a 2px ink edge, a 0 4px 0 ink shadow and a 16px radius, sitting on the right; DiGi's replies are plain ink text on the canvas with no bubble at all, with the star in the header; the typing indicator is three pale dots in a cream pill; the input is a cream pill reading "Type or tap the mic". The logo is the butter rounded square with four rising white bars (heights 5, 9, 14 and 8 out of 16, from shared/brand.ts) beside the "Guided Childhood" wordmark in Nunito 800. There is no logo image file, so draw it from the data. DiGi is the golden clay star in public/digi-squad/DiGi-star.svg, redrawn in code so the two eyes, the brows and the smile are their own layers: its eyes do the acting (blink, look around, wink) and it squashes and stretches when it lands. Never a redrawn star, never the green robot, never the owl.

The family is invented: Ava, 9, and her mum, who is the one typing. No real child's name anywhere, no photo of anyone, nothing presented as a testimonial.

Scenes:

1. Cold open (8s): a big pale sky bubble "Bedtime was a fight again. What do I actually say?" floats on cream, then the camera pulls back into the DiGi chat on a phone. DiGi replies "Bedtime has been hard going three check ins running. Here are the words for tonight." with the script card for "Bedtime stalling and one more thing" (eyebrow THE WORDS FOR A TRICKY MOMENT, the small star in its butter circle) and offers "Want me to check back in a few days?" Me: "Yes please". DiGi: "Done. I'll ask you how it went."
2. Introducing (6s): "Introducing", DiGi drops in, opens its eyes, looks left then right, and "DiGi" appears. Then "The one thing to do, and the words to say" with a butter shimmer on "the words to say".
3. "Comes back to check" (7s): a phone rises with a lock screen notification from Guided Childhood: "How did that go? The bedtime words, three nights on." The camera zooms through the notification into the DiGi chat, with Home and today's path blurred behind. Me: "Two calm nights, one wobble." DiGi: "That's a shift. Same words tonight?" Me: "Go on then". DiGi: "Noted on Ava's check in. Warm, and the same every night."
4. "Remembers your family" (12s): twelve small cream cards burst out, one fact DiGi has saved about this family on each: Ava, 9, Year 5 · Bedtime is the fight · Roblox on Saturdays · Screens off at 7 on school nights, agreed 2 September · Stalls with one more thing · Dad does bedtime on Tuesdays · Shares a room with Sam, 6 · Wants a phone like her friends · Loves the star chart · Hard mornings after a late night · Snapchat talk at school · The repair words worked last time. Status chips on four of them: LIVE WORRY, RESTING, AGREED, WORKED. The cloud blurs, a phone rises showing Home, and a DiGi notification lands in the bottom half of the frame: "First school night back. Ava's 7 o'clock deal starts again tonight. Want the words ready?" A finger taps "Open in DiGi" and the app zooms open into a chat about the deal. DiGi: "You both signed 7 o'clock on 2 September. She pushed back the first week too, and the repair words worked." Me: "Wait, you remember that?" Me: "Give me the words". DiGi: "Here they are. I remember, so you don't have to." and DiGi winks.
5. "Watches the number move" (6s): the going great face from the check in, in butter, replaces the "o" in "move". It spins and jumps, the camera pans right, and DiGi's eyes follow it. Floating cards: a butter "Bedtime: going great. Resting for a week.", a tilted pale sky "WE DID IT", and DiGi's "Rested. I'll check it held next week. Mornings next."
6. End card (6s): the DiGi star and "DiGi" with "Now inside Guided Childhood" underneath flip into the Guided Childhood logo and wordmark, with "What stage is your child? Three questions, no sign up." lined up under the G and guidedchildhood.com/starter-pack small in mono beneath it. One gold pathway stroke under the line. Hold it while the music fades out.

Slow scenes 3 and 4 by 10% so every message is easy to read.

Style: clean cream, Apple keynote feel, word by word blur in headlines, smooth camera push and pull, chat bubbles that pop in after the typing dots, real looking phone frames. Motion stays subtle: fade ups, staggered reveals, nothing 3D, no purple gradients, no dark tech look.

Characters and assets: no image generation at all. DiGi comes from the SVG, the logo from the data in shared/brand.ts, the fonts from app/fonts/, every screen from the live app. The twelve cards in scene 4 are text, so nothing needs a face. Never a child's face, never a synthetic parent, never a Planet Friend regenerated from a prompt. If a Friend is ever wanted it is the approved cutout in public/digi-squad/friends/, unaltered, and it is not wanted here.

Sound: synthesize subtle chat sounds (a soft send swoosh and a pop), clicks on taps, a soft chime when the worry rests and tinks for the face. Music: source it with the media-use skill (the HeyGen catalogue when signed in, otherwise generate it locally), never Higgsfield. The brief for the track: warm, light, modern keynote underscore, piano or soft synth over a gentle pulse, major key, around 100 to 110 bpm, a clear first downbeat, no vocals, no drops, calm ending. Place it so its first kick lands on "Introducing" at 8 seconds, keep it low under everything, fade it in at the start and out over the end card. Record where it came from and the licence in the project's media ledger. Do not use a commercial library track.

Render a half size draft first and check it yourself with contact sheets before showing me. No dashes of any kind in any on screen text or in the copy strings in code, ages written as 4 to 16, British English throughout, and every line checked against .claude/skills/content-engine/ai-tells.md. DiGi never says yes or no to anything; every reply ends on the next thing to do. Report back in three things: what changed, whether it worked, and what you need from me.

## How it was built, 8 October 2026

- `beats.json` holds every on screen line and its timing; `build.mjs` writes
  `index.html` (one paused GSAP timeline, HyperFrames owns the audio). The
  build refuses any dash in copy, a short list of the ai-tells phrases, and a
  music kick that does not land on "Introducing".
- Scenes 3 and 4 run 10 percent slower as the brief asks, so the film is
  46.9 seconds, not 45. Scene lengths otherwise as written.
- The chat is drawn as the live thread in `DigiChat.tsx` draws it, which is
  the periwinkle question pill (`#DCE7FB`) with DiGi's answer as plain text
  under the small star, not the pale sky edged bubble the brief described
  (that is the history view). Justin's own screenshot of 8 October set the
  input bar: hands free pill above, butter edge on the pill, grey send
  circle, the crisis line underneath.
- DiGi is the star SVG inlined with the eyes, brows and smile as their own
  groups, so the blink, the look left and right, the wink and the landing
  squash are GSAP on real geometry. Nothing generated.
- The faces, the logo and Home are rebuilt from `ConcernCheckIn.tsx`,
  `shared/brand.ts` and `TodayPathBig.tsx`. The dev server was not started
  in this worktree, so Home is a faithful rebuild from the component rather
  than a Playwright capture.
- Music: no HeyGen sign in, no Lyria key and no MusicGen weights on this Mac,
  so `tools/music.py` composes the underscore in code (C major, 105 bpm,
  piano style plucks over a pad, first kick at exactly 8.0 seconds, 48
  seconds long). Licence: ours, nothing sampled. Swap the file in
  `beats.json` if a catalogue track is preferred. `tools/sfx.py` synthesises
  the ten cues the same way.
- Checked with `tools/frames.mjs`, a headless Playwright grabber that seeks
  the timeline and tiles contact sheets (`renders/sheet-*.png`), because the
  in app browser pane only paints while it is on screen.
- Renders: `renders/digi-launch-draft-960.mp4` (half size, draft quality)
  and `renders/digi-launch-1080.mp4` (looks quality). Not committed.
- Not heard by the builder. The music and sound levels need Justin's ear.

## The second cut, 8 October 2026, afternoon

Justin, after the first draft: slower and more readable; build on DiGi's
brain (the researchers we use for now and why, the peer reviewed papers,
what worked for other families, our own philosophy); keep it sales short;
a soundtrack more of the moment.

- **Pacing is a rule now, not a hand timing.** `beats.json` carries `pace`:
  a line is held for its words at 4.8 a second plus 0.4, never under a
  second; typing dots are 0.6; a script card adds 1.2. Every chat and every
  brain layer is timed from that, and each scene is as long as its lines
  need. The film is 105 seconds. Where the time went: cold open 16, the
  check back 16, remembers your family 22, where every answer comes from 29.
  The two obvious cuts if it must be shorter: the Ferguson row and the
  families layer (about 8 seconds), or the "Want me to check back" line and
  the "Go on then" exchange (about 4).
- **The brain section** (scene 6, "Where every answer comes from") is four
  layers beside the star, each lighting a pill: the five researchers DiGi
  leads with for now, each with a four word why taken from
  `digi/02-scientists.md`; 142 findings every one with a named source
  (`lib/email/momentum.ts`, 7 October), peer reviewed papers and the big UK
  datasets, approved by a human first (the research updater's gate); what
  worked for families like yours, never a family's words
  (`digi/00-how-digi-works.md`, the Sunday wisdom loop and its privacy rule);
  and four lines of our own rules from THE-STORY.md. The names are
  attribution of published work, not endorsement, and no clinician is named.
- **The score is new:** `tools/music2.py`, a house underscore at 118 bpm
  (four on the floor, clap, sixteenth hats, a pumping pad, plucks on an
  I V vi IV in F major, a riser into the first kick). It writes
  `assets/music.json` with the kick it was composed for and the build refuses
  to run out of step with it. Still composed in code, still ours; if Justin
  wants a real track of the moment, drop it in `assets/` and point
  `beats.json` at it.
- Trimmed on the way: the scene 4 push is now "First school night back. Want
  the 7 o'clock words ready?" and DiGi's reply there is 14 words, so each is
  read in the time it has.
