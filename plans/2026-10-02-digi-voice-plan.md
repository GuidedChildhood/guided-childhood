# DiGi voice: talk to DiGi, and DiGi reads aloud (2 October 2026)

Justin, 2 October 2026, on speaking to DiGi: "how do we make it an option DiGi
speaks out loud so not annoying? And how do we make it an option parent can
speak to DiGi with voice". He approved both, and three DiGi answer videos for
social.

## What gets built

Both in the parent's DiGi chat (app/(dashboard)/dashboard/digi/DigiChat.tsx),
parents only. The child app gets no microphone: recording children is a
different decision with different care.

### Talk to DiGi (voice in)

- A microphone button in the compose pill, beside send. Tap to start, tap to
  stop. Typing stays the normal way.
- The words land in the box as the parent speaks, so they can check and fix
  them before sending. Nothing sends on its own.
- Browser speech recognition, en-GB, free. Hidden where the browser has none,
  so a parent never sees a button that does nothing. The phone keyboard's own
  microphone still works everywhere as the fallback.
- No audio is kept anywhere by us. Only the words, exactly as typed words are.
  Worth knowing for the privacy page and the DPIA: the browser does the
  listening, and Chrome sends the sound to Google to turn into words (Safari
  to Apple), the same as the microphone on a phone keyboard does. We receive
  text only.

### DiGi reads aloud (voice out), built not to annoy

- Off by default. A small "Read aloud" pill in the header turns it on, and the
  choice is remembered on that phone.
- It follows the parent: a question asked by voice gets a spoken answer even
  with the pill off. A typed question with the pill off stays silent.
- Short when spoken: the line to say (the first quoted line of five words or
  more), or else the first two sentences. The full answer stays on screen.
- Instant stop: tapping anywhere stops it. Opening the microphone stops it.
  Sending a new question stops it. Leaving the page stops it.
- Never on by surprise: it only speaks straight after a reply finishes, never
  when a page opens.
- DiGi's avatar on the answer being read moves to its speak mood while it
  talks, the GSAP character that already exists, with "Speaking, tap
  anywhere to stop" beside the name.
- The setting sits beside DiGi's name as a small Aloud pill (On when on), so
  the header stays one row at 390.
- The voice is the shared British device voice (lib/voice/english-voice). A
  recorded DiGi voice from a paid service is the later step, once Justin picks
  one from samples.

## Files

- lib/voice/digi-voice.ts: dictation wrapper, the spoken line picker, the
  remembered setting. Pure helpers, guarded.
- DigiChat.tsx: the microphone, the header pill, the speaking state.
- scripts/check-digi-voice.mjs: guards the not annoying rules (off by default,
  stop on tap, stop on mic, no audio stored, no microphone in the child app).

## Gates

- [x] tsc, the new guard (shown to fire on three broken rules), the existing guards
- [x] Phone (390) and desktop screenshots: idle, listening with words arriving, read aloud on
- [x] review.md pass (dropped a CSS pulse on the microphone: motion is GSAP only)
- [ ] PR, CI green

## Also from this message: three DiGi answer videos for social

Through .claude/skills/silent-ugc, a post asking parents to comment the moment
they need help with, with the reply guard: never repeat a child's details, and
anything that reads as a safeguarding worry goes to a private message with
signposting, never a public answer.
