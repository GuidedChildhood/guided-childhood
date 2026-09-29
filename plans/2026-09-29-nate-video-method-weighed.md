# Nate Herk's AI video editing method, weighed against our own objectives

Written 29 September 2026. Justin pasted the transcript of Nate's video on
editing with Claude and HyperFrames and asked for the same as a system here.
Every point has been through `.claude/skills/feedback-filter`. What Nate could
see: his own YouTube channel, his events business, a general audience that
wants high energy. He could not see a parent at 11 o'clock, the five
commitments, or the stage check. So his mechanics transfer and his register
does not.

Objectives referred to: the **goal** (THE-STORY.md section 9, parents to the
stage check), the **five commitments** (review.md section 1), the **customer
test** (review.md section 2), and **evidence or silence**.

| Point | His words | Verdict | Objective | Size |
|---|---|---|---|---|
| Transcribe first, word level | "transcribe is essential ... so the beats can come in at the right time" | **Adopt.** Free and local with whisper-cpp through `hyperframes transcribe`; ElevenLabs stays optional | Goal: every finished video is another road to the stage check | Small |
| Cut dead air and mistakes before anything else | "cut out the mistakes ... cut out the dead space" | **Adopt.** The student kit's cut-silences and cut-mistakes scripts, proposals reviewed before applying | Customer test: a parent gives us seconds | Small |
| Plan the beats and be specific about what you want | "at this point I want this to come in" | **Adopt, with one fixed beat.** Every social video ends on the stage check hook, identical every time | Goal | Small |
| Build skills from anything you repeat | "if you ever find yourself repeating something, throw it in the skill" | **Adopt.** This review produced `.claude/skills/talking-head-video` | | Medium |
| The verification loop | "it delivered output one and then it watched it" | **Adopt.** Already how product-launch-video runs: lint, check, contact sheet, watch, fix, at least two passes before Justin sees it | Commitment 5 in spirit: we check before we claim | Small |
| Analyse a video you like and turn it into a skill | "analyze this video ... figure out why this is so good ... turn that into a skill" | **Adopt.** It is what this file is | | |
| Brief with emotion and let the model improvise | "you know the emotions you want the video to create" | **Adapt.** We brief from THE-STORY.md: the one line story, the perfect customer, the hook. Improvisation is allowed on motion, never on claims or copy | Evidence or silence; Justin's voice | |
| AI generated B roll, images and video via Kie.ai | "generate images and videos for you if it needs it" | **Adapt.** Higgsfield is already our image and clip pipeline (lesson-video, silent-ugc). Product shots are real screens, never generated. No synthetic person presented as a real parent, ever | Commitment 5; silent-ugc rule 1 | |
| Go and grab screenshots and brand assets from the web | "it will grab screenshots" | **Adopt for our own product only.** Never another brand's assets or people in our videos | Evidence or silence | |
| Paid transcription with ElevenLabs | "11 Labs is a little quicker" | **Adapt.** whisper-cpp on the Mac is free; the 8 GB i5 will be slow on long recordings, so we cut long takes into beats first | Cost against the goal | |
| Music synced to beats, sound design | "sync the music to the beats, sound effects" | **Park.** Needs the HeyGen library (not signed in) or a local model the Mac cannot run well. The family account's silent format does not need it; LinkedIn plays muted | | |
| High energy, fast paced, engaging | "high energy, fast-paced" | **Decline for parents.** Our register is warm, plain, direct, big text, one idea per beat (the Good Inside pass). Pace comes from cutting dead air, not from speed | Customer test; non negotiable 8 | |
| Liquid glass cards behind graphics | "liquid glass card behind the element" | **Adapt.** Our card is white with the 3px ink outline and the hard offset shadow, on cream. Same job (legibility), our tokens | Non negotiable 3 | |
| Whiteboard hand drawn explainer style | "simple and clean whiteboard handdrawn style" | **Park.** Lesson explainers already have a house illustration style in lesson-video; revisit if a parent facing explainer wants it | | |
| Course style: big bullet takeaways, rounded camera crop | "bullet points with important takeaways, not too wordy, and they should be big" | **Adopt for CPD and school videos.** Matches gc-slides and the assembly deck register | Goal: schools as distribution | Small |
| A sizzle reel from a folder of event footage | "look through all this and create me a sizzle reel" | **Park.** No event footage yet. Use it for the first schools launch or parent evening | | |
| Run the model on high effort | "I've been running on high" | **Already so.** The session model is a Claude Code setting; DIGI_MODEL is untouched | Non negotiable 2 | |

## What Justin decides

1. **Setup on the Mac, one time.** `brew install whisper-cpp` and ffprobe. Both
   are his to run (recommended: yes, it is the free path).
2. **Who is on camera for the family account.** The account is in Natalia's
   voice, so family posts with a face are Natalia, not Justin. Justin is the
   face on LinkedIn. Recommended: keep that split.
3. **Music.** Stay silent and captioned until HeyGen sign in is worth it.
   Recommended: yes.
