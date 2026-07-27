# DiGi clarity pass: what is done, and the visual handover to the Mobbin session

Written 2026-07-18. Reference: the Good Inside "Ask GiGi" screen (question pinned
to the top in a blue bubble, answer flowing down with bold headline lead ins, a
Listen button top right, an AI disclaimer under the input).

## Done in this pass (the "how it runs" layer, continue-build session)
1. **Answer shape.** DiGi's system prompt (`lib/digi/system.ts`) now asks for the
   GiGi clarity shape in DiGi's own warm voice: a one or two sentence validating
   opener, then two or three suggestions each led by a short **bold lead in**,
   then the one thing to try tonight. Bold only the lead in phrase.
2. **Bold rendering.** The chat (`app/(dashboard)/dashboard/digi/DigiChat.tsx`)
   now renders `**bold**` as real bold and keeps each point whole (no more
   character shatter that split a point across two boxes). The structured lesson
   card path is unchanged.
3. **AI disclaimer.** A line under the input: "DiGi is a guide, not a crisis
   line, and can make mistakes. In an emergency call 999, or Samaritans on
   116 123." Honest, and it carries the crisis routes.

## For the Mobbin session (the look)
The mechanics now produce clean, bold led answers. The visual polish to match the
reference:

1. **Pin the question to the top.** When a parent sends, lift their question into
   a prominent bubble at the top of the answer view (the reference uses a soft
   blue; ours would be a butter or terracotta tint in our tokens), with the
   answer flowing beneath it in one clean column. Today it sits in a normal
   scrolling thread. This is the single biggest visual difference from GiGi.
2. **Listen button.** A small Listen control by the answer for read aloud. The
   app already has DiGi voice and read aloud on scripts, so wire to that, do not
   build new TTS. Place it top right of the answer, reference style.
3. **Typography of the bold lead ins.** Make the bold lead in phrases sit as
   clear mini headlines (weight and a touch of size or spacing), so the answer
   scans like the reference. Keep Nunito and our ink, never a copy of their look.
4. **The compose bar.** The reference has type, mic and a Speak button. We have
   type and send. Mic and speak are optional, only if the read aloud and voice
   input are wanted here too.

Constraints as ever: Checker tokens, Nunito plus IBM Plex Mono, no dashes in
copy, no purple gradients. Translate the reference into our butter and ink,
never a copy of Good Inside.

## Sources: the recommendation (not built, decision needed)
Good Inside does not actually show citations on that screen, and for our AI chat
I recommend we do NOT add a sources list. An LLM asked to cite will sometimes
invent a study, which is the one thing a research credible brand cannot afford.
DiGi already names the basis inside the sentence where it fits ("the research on
social comparison shows...") and the lesson mode names a real source from the
expert knowledge bank. Keep authority on the surfaces where the sources are
real and fixed (the pathway evidence card, the readiness why it works, the
health check), not generated live by the model. If we ever want visible sources
in chat, the safe way is to show only the expert knowledge rows actually
retrieved for that answer, never free text the model wrote.
