# Mobbin brief: finish the moments visuals and two child app passes

Three jobs, all visual, all safe to do in parallel with the platform work. The
content and logic are already shipped and live. This brief is the design finish.

No dashes in any copy you add. Butter and ink and Nunito, our tokens only, never
another brand's look. Higgsfield for all illustration.

---

## Job 1 (the big one): illustrate the 26 new moments

We just added 26 research grounded moment cards (migration 073) across every age
band. They are live now but each shows an emoji until it has a picture. Draw them
in the exact same style as the 12 July batch and wire them up.

### Style, match the existing set exactly
Warm, hand drawn, picture book style. Flat art that reads instantly at 84px. No
people ever, the object and the scene tell the story (a rumpled bed, two mugs, a
lunchbox). Soft butter and cream backgrounds, ink line work, the same palette and
weight as the moments already on the cards. Reference the live tiles in
`lib/content/moment-photos.ts` (open any URL there) so the new ones sit in the
same family, not a new style.

Feeling in line with Happy News: gentle, hopeful, never clinical, never scary,
even for the hard ones. The saw something upsetting card is a closed laptop and a
soft night light, not the upsetting thing itself.

### How to wire each one (no code logic, just data)
1. Generate the PNG in Higgsfield, upload to the same CloudFront space the batch
   uses (`BASE` in `lib/content/moment-photos.ts`).
2. Add a key and URL to `MOMENT_PHOTOS`.
3. Add a title match to `TITLE_TO_PHOTO` (regex on the title, most specific first).
   The card resolves art by title, so the regex is the whole wiring.

A few of the 26 already match an existing tile by regex (homework, exam, gaming,
social media, bedtime). Those will show a picture already. Draw fresh ones only
where the list below asks, then point the regex at the new key.

### The 26 titles and the picture to draw

Morning
- Slow to get ready. A child's clothes and shoes laid out in a slow, sleepy morning light. Key idea: gentle, not rushed.
- Wants the tablet first thing. A tablet face down on a breakfast table beside a cereal bowl, morning light. (interim: `tablet_sofa`)
- Hard to wake, late night before. A dark bedroom, curtains just cracked, an alarm glowing. (interim: `bed_morning`)

Food
- Only wants the same few foods. A plate with one small new food beside two familiar favourites. Calm, no pressure.
- Phones at the dinner table. A phone in a small basket beside a set dinner table. (interim: `phone_table`)
- Skipping meals or eating alone. A single place set at a table, a warm light left on. Soft, not bleak.

School
- Will not talk about their day. A school bag by the door and a snack on the side, a quiet after school scene.
- Does not want to go to school. A school bag and coat on a peg, morning light, a hopeful feel. (interim: `shoes_door`)
- Homework becomes a standoff. (already illustrated, `homework`)
- Exam and test stress. (already illustrated, `exam`)

Digital
- Turning the screen off ends in tears. A TV just switched off, a cosy room, a soft toy nearby. (interim: `tv_remote`)
- Everyone else has a phone. A group of phones on a table and one empty space, gentle not sad.
- Cannot come off the game. A game controller resting on a sofa arm, warm room. (interim: `gaming`)
- Comparing themselves on social media. A phone showing a soft blurred feed, quiet mood. (interim: `social_phone`)
- Saw something upsetting online. A closed laptop and a soft night light. Safe and calm, never the content.

Transitions
- Leaving the house takes forever. Shoes and a coat by an open front door, warm daylight. (interim: `shoes_door`)
- Ending a playdate or fun thing. Two mugs and some toys being tidied, a gentle goodbye feel. (interim: `board_game`)
- Settling into a new school or class. A new uniform on a hook, a name label, a fresh start feel. (interim: `uniform`)

Emotions
- Big tantrums and meltdowns. A small storm cloud with a rainbow just behind it. Warm, hopeful, no child.
- Worry and anxiety. A jar of worries with a soft lid, a calm bedside scene.
- Seeming low or flat. A rainy window with a warm light inside. Tender, hopeful.
- Anger that boils over. A kettle just off the boil, steam softening. A held, calm feel.
- Siblings fighting. Two toys and one shared thing between them, a fair share feel. (interim: `board_game`)
- The after school meltdown. A dropped school bag and a cosy blanket, a soft landing.

Evening
- Evening wind down and screens before bed. A phone charging outside the bedroom door, a lamp and a book. (interim: `bedtime_lamp`)
- Bedtime stalling and one more thing. A bedside lamp, a glass of water, a stack of stories. (interim: `bedtime_lamp`)

Anywhere marked interim already shows that tile, so it is a nice to upgrade, not a
blank. The un marked ones are the priority draws.

---

## Job 2: the mix your own colour slider

Shipped as a working hue slider in Make it mine (`app/k/[token]/KidQuestScreen.tsx`,
the `MakeItMine` component). It works and saves. It needs the premium finish:
- The slider handle and track styling (right now it is a plain rainbow range).
- How the live preview swatch and the six named pastels sit with the slider.
Keep the behaviour, restyle the look. The theme it builds from a hue lives in
`hueWash()` in the same file if you want to tune the wash.

---

## Job 3: the countdown to offline fun

Shipped and working in the child device timer (`components/quests/DeviceTimeCard.tsx`).
The last ten seconds are a happy countdown: a soft rising blip each second, a warm
spoken line at ten and a spoken three, two, one, the number turns terracotta, a
party emoji bounces, and the end screen says Time for offline fun.
Needs the design and audio finish:
- The exact spoken wording and voice feel (the `say()` calls, currently plain
  speech synthesis). If we want DiGi's real voice here, that is a bigger swap.
- The motion of the last ten seconds and the end celebration.
Keep the logic, polish the feel.

---

## What not to touch
The content, the age band matching, the wiring logic. Just the pictures, the
slider look, and the countdown feel. Ping the platform session if a change needs
more than art or styling.

---

## Job 4 (new): best in class polish pass on the parent home

Justin wants the app to look super slick, professional, best in class. The home
now has a clean five zone order: header and urgent count, then the hero (Road to
16 strip plus Today strip), one reveal card, at most two quiet rhythm cards, then
stats, quests, and doors to everything else. The structure is done; make it feel
premium. Pull Mobbin references from the best consumer subscription apps (Finch,
GoHenry, Good Inside, Duolingo) for spacing, card depth, type rhythm and micro
motion, then translate into our butter and ink and Nunito. Focus on: consistent
card radii and shadows, breathing room between zones, one accent per zone not
five, and subtle GSAP fade ups on scroll. No layout changes without checking
with the platform session, polish only.

---

## Job 5 (new): one pathway language, Duolingo simple

The pathway story now reads from one data source everywhere (the home strip, the
pathway page four strands, the progress tab). But the pathway page still shows
the same five stages several ways: the strands card, the stage stamp, the road
map circles, the journey and a stage cards row. Make it ONE visual language,
researched on Mobbin against Duolingo's path and the best learning apps: one
road, the passport stamps living on that road (each passport page ties to a
stage on the road to 16), larger more readable text throughout, professional
and calm. Cut the duplicate stage renderings, keep one. Check the flow end to
end: land on home, see the road and today, tap through to the full path, see
the four strands and the next stamp, never the same picture twice.
