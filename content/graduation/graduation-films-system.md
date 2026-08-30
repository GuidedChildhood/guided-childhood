# The graduation films: system, continuity and the derived formats

One system, five films, and two formats derived from the same world. This file
is the bible; the five scripts sit beside it, one per stage, each grounded in
that stage's real syllabus (the lesson titles below come from the database
seeds, not from memory; when the curriculum changes, the montage changes).

## How a film works for every child

The master film per stage is UNIVERSAL and the personal layer is rendered
live by the app, never baked into video:

- **In the film (same for everyone at that stage):** DiGi, plus the stage's
  own Planet Friend from `lib/content/stage-characters.ts`: Pebble at Stage 1,
  Bloop at 2, Orbit at 3, Nova at 4, Cosmo at 5. The Friend who grows up
  alongside the child at that stage greets them at the gate.
- **On the end card (personal, app rendered over the held final shot):** the
  child's name, their passport number, the date, and the full set of Planet
  Friends they have genuinely earned via `earnedFriends()`. A child with
  three Friends sees three.

Five films serve every child forever, at the production cost of five films.

## Design continuity (the look that makes five films one series)

- **The world recurs:** the border gate and the stamp desk appear in every
  film, redressed in the stage's colour. The gate is the series' home.
- **Style lock on every scene:** "Warm hand illustrated style, flat friendly
  shapes, generous white space, Guided Childhood palette of cream, soft green,
  coral and gold on a cream ground, ink line work, gentle and calm not
  corporate, no photorealism, no neon, no dark tech aesthetic, 16 by 9."
- **Colour rule:** cream ground and ink line stay constant; ONE accent per
  film from the stage's own palette. The stamp ink is always gold.
- **Character rule:** DiGi from the canon star art, never a robot, never an
  owl; the Friend from its cutout in `public/digi-squad/friends`. Reference
  images attached to every generation so the cast never drifts.
- **Shape rule:** every film runs the same five beats: the gate, the journey
  montage (echoes of that stage's real lessons), the stamp, what you can do
  now, the hand to the end card. Runtime 75 to 90 seconds, ending on about
  five held seconds of the open passport page, clean, for the overlay.
- **Voice rule:** one narrator voice across all five (currently the warm UK
  preset Arthur; swap once a DiGi voice is decided, then regenerate narration
  only, the scenes stay). Captions burned, warm rounded, lower third, no
  dashes anywhere.

## The syllabus rule

A montage beat may only echo a lesson that stage actually teaches. The
authoritative lists (from the seed migrations):

- **Stage 1 Foundation (4 to 7), Pebble:** The stop and tell rule · When the
  screen goes to sleep · Who is behind the screen · Big feelings and the
  screen · plus the ten co watch adventures (the privacy shield, the yes no
  button, kind words, the internet remembers, real or pretend, someone made
  that).
- **Stage 2 Builder (8 to 10), Bloop:** What we keep private online · Spot
  the trick · Screens and sleep · Why stopping feels hard, and how to win at
  it · What social media really is.
- **Stage 3 Explorer (11 to 13), Orbit:** When the group chat turns · Built
  to be bottomless · Followers are not friends · The feed is built to hold
  you · Before you make an account · Real life is not a highlight reel.
- **Stage 4 Shaper (13 to 15), Nova:** The footprint test · When someone asks
  for a photo · Take back your notifications · The honest check on your
  mood · Strangers, DMs and grooming · How the machine works · A chatbot
  always agrees (and thirteen more; the montage picks four).
- **Stage 5 Independent (16 plus), Cosmo:** Your accounts, your locks ·
  Design your own defaults · The money machine behind the feed · Real, fake
  and AI made · Taking the wheel at 16.

## Derived format one: teacher story shorts

Sixty to ninety seconds, one per school module, for the classroom: the
stage's Planet Friend walks into the module's exact dilemma, makes the
ordinary mistake, and DiGi arrives with the module's tool. Ends frozen on a
question card the teacher reads out. Same world, same style lock, same voice.
Slots into the run sheet as the lesson opener, before the retrieval check.

Sample, Stage 3, "When the group chat turns" (Orbit):

1. (0:00 to 0:10) Orbit's phone hums. The class chat is laughing at one
   photo of one child. Orbit's thumb hovers over the laughing face.
   VO: "Everyone else had reacted. Orbit's thumb was one hover from joining."
2. (0:10 to 0:30) The pile on drawn as weather: each reaction another cloud
   over the small figure in the corner of the screen.
   VO: "Here is the thing about a pile on. Nobody in it feels like weather.
   Everybody under it does."
3. (0:30 to 0:50) DiGi appears beside Orbit, opens a third door in the chat
   wall: not join, not silence, a message straight to the child in the photo.
   VO: "There are never just two doors. Joining is one. Saying nothing is
   another. The third door is the one that goes to the person."
4. (0:50 to 1:05) Orbit sends three words through the third door. The clouds
   thin. The small figure looks up.
   VO: "Three words, sent sideways. That is all the third door needs."
5. (1:05 to 1:15) Freeze on the question card, teacher reads it:
   "What could Orbit say in three words? What would you send?"

## Derived format two: social shorts (the platform, explained)

Thirty to forty five seconds, 9 by 16, cut from the same world, for the
family account and LinkedIn. Each short explains ONE piece of the platform
through the characters, never a feature list. Obeys the hidden thread rules
and the no overclaim line (prepared, never "safe"). Ends on the stage check
line, no link in frame.

Sample, "The passport", 40 seconds:

1. The gate, the desk, the stamp. VO: "Every child in this world walks the
   same road, from four to sixteen."
2. Quick cuts: Pebble learning stop and tell, Orbit closing the bottomless
   feed, Nova running the footprint test. VO: "At every age they learn the
   thing that age actually needs. Not a lecture. A skill."
3. The stamp thunk, gold ink. VO: "When a stage is truly finished, lessons,
   conversations, all of it, the passport is stamped. Earned, never given."
4. The passport with its number. VO: "And at sixteen they walk in trained,
   not just older. The certificate never says safe. It says prepared."
5. End card: "The passport to sixteen · guidedchildhood.com" with the stage
   check line.

## Fixing mistakes in a produced film

The pilot assembles from nine independent blocks, so a mistake never costs
the film: name the block (the production doc maps each to its job id), fix
the prompt or the line here in the script, regenerate that block, restitch.
Red pen the scripts in this folder first; production follows the paper.
