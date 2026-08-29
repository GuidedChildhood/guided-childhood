# Stage 3 graduation video: The Stamp Ceremony (Explorer, ages 11 to 13)

The pilot of the five graduation videos. One master video per stage, DiGi only
on screen; the personalised end card (name, passport code, date, and the Planet
Friends this child has actually earned via `earnedFriends()`) is rendered live
by the app over the closing seconds, never baked into the video. Unlocks only
when every Explorer lesson and the stage quiz are passed, the same gate as the
certificate page.

Runtime target: 75 seconds. Tone: proud, warm, a little ceremonial, never
saccharine. DiGi's voice throughout, no other characters in the video.
House style art via the lesson-video pipeline (Higgsfield scenes in the
digi world palette, captions burned in, assembler stitch).

## Beats

### Beat 1. The gate (0:00 to 0:08)
Scene: a tall friendly border gate in the Explorer world colours, early
morning light, a small desk beside it with a lamp and an enormous stamp.
DiGi behind the desk, straightening things, expectant.
VO: "Ah. There you are. I have been expecting this one for a while."

### Beat 2. The journey montage (0:08 to 0:28)
Four quick echo scenes, two to three seconds each, of what Stage 3 actually
taught, so the moment feels earned rather than generic:
1. A group chat turning on someone, and a hand opening the third door out.
   VO: "You learned what to do when a group chat turns."
2. A feed scrolling on and on into fog, then a full stop appearing in it.
   VO: "You found the full stops in a feed built to be bottomless."
3. A follower counter spinning beside one real friend waving.
   VO: "You worked out that followers are not friends."
4. A glossy highlight reel peeling back to show an ordinary, happy day.
   VO: "And you saw what a highlight reel leaves out."

### Beat 3. The stamp (0:28 to 0:45)
Scene: back at the desk. The passport slides across. DiGi lifts the huge
stamp with both hands, holds one beat of silence, and brings it down. One
big satisfying thunk, ink blooms into the Explorer stamp, the pages riffle.
VO: "Every lesson. The quiz. All of it, yours. Which means I get to do my
favourite part of this job."
(The thunk lands, then a beat.)
VO: "There. That is not a sticker someone gave you. That is a record of
work you did."

### Beat 4. What you can do now (0:45 to 1:00)
Scene: DiGi walks round the desk and looks at camera, gate opening behind.
VO: "Here is what is different about you now. You can read a feed instead
of just riding it. You can spot a pile on before it lands. You know the
difference between an audience and a friend. The next stage is where the
accounts get real, and you are walking in ready, not guessing."

### Beat 5. Hand to the end card (1:00 to 1:15)
Scene: DiGi steps aside and gestures to the open passport page, which fills
the frame and gently holds. The app overlays the live end card here.
VO: "This page is yours. And look who came to see it."

## The end card (app rendered, not in the video)

Over the held final frame the app draws:
- "This passport belongs to [child's name]"
- "Explorer complete", the date, the passport code, the verify QR
- The Planet Friends this child has earned (Pebble, Bloop, Orbit, Nova,
  Cosmo, whichever `earnedFriends()` returns), standing around the card.
  A child with three earned Friends sees exactly three. Nobody is
  congratulated by a friend they never earned.

## Production notes

- Master video is identical for every child; all personalisation lives in
  the overlay. Zero per child rendering cost.
- Copy rules apply throughout: no dashes anywhere, Justin's warm plain
  register, never "safe" or "ready for social media" as a claim; the
  strongest line stays "walking in ready, not guessing", which is about
  preparation, not a certification.
- Stage 5's version reuses this shape but graded up: quieter, prouder,
  and it hands into the readiness review rather than the gate opening.
- Estimated build: one day through the lesson-video pipeline once the
  scene set is generated.
