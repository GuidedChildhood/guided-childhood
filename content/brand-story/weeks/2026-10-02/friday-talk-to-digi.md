# Service Friday · Talk to DiGi, hands full

**Status: postable now**, once Justin has tried the microphone on his own
iPhone (PR 1185 is merged and live). Proposed as service map entry 22.

The problem first, never the feature. Nobody wants a microphone button. They
want help in the hallway with a coat half on a child and no hand free.

---

## Instagram

> Coat half on. Shoes by the door. The TV still on after three asks. And not
> one hand free to type.
>
> That is the moment we most needed help, and the moment a phone was least use.
>
> So now you can talk to DiGi.
>
> 1. Tap the microphone and say what is happening, the way you would tell a friend.
> 2. Your words land in the box first, so you can fix them before anything sends.
> 3. Ask out loud and DiGi says one line back, usually the words to say to your child.
> 4. It never talks at you by surprise. Reading aloud stays off until you switch it on, and one tap stops it.
> 5. We never keep a recording. DiGi only ever gets the words.
>
> It knows your child's stage, so the line it says back is the one for a six
> year old or a fourteen year old, not both.
>
> The words you say in the hallway are the ones that stick.
>
> What is the moment in your house when you have no hands free?
>
> What stage is your child? Three questions, no sign up, link in bio.

## Facebook

> Coat half on. Shoes by the door. The TV still on after three asks. And not
> one hand free to type.
>
> That is the moment we most needed help, and it was always the moment a
> phone was least use. You cannot type a careful question with a child on one
> arm.
>
> So you can now talk to DiGi, the guide inside Guided Childhood.
>
> 1. Tap the microphone and say what is happening, the way you would tell a friend.
> 2. Your words land in the box first, so you can fix them before anything sends.
> 3. Ask out loud and DiGi says one line back, usually the words to say to your child, so you hear them before you say them.
> 4. It never talks at you by surprise. Reading aloud stays off until you switch it on, and one tap anywhere stops it.
> 5. We never keep a recording. DiGi only ever gets the words, the same as if you had typed them.
>
> It knows your child's stage, so the line it says back is the one for a six
> year old or a fourteen year old, not both. The full answer stays on the
> screen for later, when the coat is on and the door is shut.
>
> The words you say in the hallway are the ones that stick.
>
> What is the moment in your house when you have no hands free?
>
> What stage is your child? Three questions, no sign up:
> https://guidedchildhood.com/starter-pack

---

## Screen recording shot list (default format)

Real screen, real account, any child's name blurred. Phone held portrait, no
mockup frame.

1. The DiGi chat, empty. Thumb taps the microphone. (2s)
2. Words arriving in the box as they are spoken: "The TV is still on and we
   have to leave in five minutes." (4s)
3. Thumb taps send. DiGi's answer arrives. (3s)
4. DiGi's star in its speaking pose, "Speaking, tap anywhere to stop" beside
   the name. Sound on for this beat only. (4s)
5. A tap on the screen. It stops. (1s)
6. End card: "What stage is your child? Three questions, no sign up." (3s)

Text on screen for silent viewers: beat 1 "Hands full?", beat 4 "It says the
one line back", beat 5 "One tap stops it".

Facebook: one tall image, beat 4 as a still, with the full text above.

---

## Proof path

- Microphone and words into the box: `startDictation` in
  `lib/voice/digi-voice.ts`, wired in
  `app/(dashboard)/dashboard/digi/DigiChat.tsx` (PR 1185, merged).
- One line, not the whole reply: `spokenLine` in `lib/voice/digi-voice.ts`.
- Off until switched on, one tap stops it, no audio kept:
  `scripts/check-digi-voice.mjs` guards all three on every push.
- Knows the stage: entry 4 in `service-post-map.md`.
- Careful wording on recordings: we keep none and receive text only. The
  browser does the listening (Chrome via Google, Safari via Apple), so the
  caption says "we never keep a recording", never "nothing leaves your phone".
