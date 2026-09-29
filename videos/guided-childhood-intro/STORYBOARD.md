---
format: 1920x1080
duration: 10s
message: "Guided Childhood gets your child to sixteen ready for a phone, ten minutes a day, together"
arc: PAS compressed → hook (ban or give in) → the third way → proof → stage check CTA
audience: UK parents of children aged 2 to 16 who feel the phone cliff edge coming
mode: autonomous
music: none
---

## Video direction

- **Palette (from frame.md, by role):** cream `#FFFBEE` is the default canvas; ink `#1A1A2E` is every headline on cream and the one dark field (Frame 1 beat 3); butter `#EDC35F` is the button fill and badge pills; butter dark `#C99A28` is the hard button shadow and the only marker accent; white cards with the 3px ink outline and 6px hard offset shadow. Pastel tints (sky, mint, lavender, peach) are the Planet Friend badge fills, one each. Never a purple or blue gradient, never pure black.
- **Type (by role):** display and headline ramp in Nunito 900 for every headline, sentence case, tracking as the pack states; the mono ramp (IBM Plex Mono, uppercase, letterspaced) for eyebrows, age labels and the URL. Body ramp Nunito 600. No dashes in any on screen copy, not in headings, not in buttons.
- **Motion grammar:** one paused GSAP timeline per frame, all entrances `fromTo`, long tail `power3` settles. Every reveal waits for its cue in the shot sequence, never front loaded. Two explicitly playful overshoots are allowed in the whole film, because the brand is a picture book for parents: the DiGi star bloom and the button press in Frame 4. Everything else settles smooth.
- **Rhythm:** Frame 1 is the fast beat (three swaps in under three seconds). Frame 2 develops across its whole length. Frame 3 and Frame 4 each end on a deliberate held read, the second held to the final frame. Only Frame 4 has a real exit (it does not exit, it holds).
- **Ornament layer:** the pack's hand drawn ornaments are stars only here (DiGi is a star), two to four per frame, cream or butter fill with the ink stroke, clustered at corners and cropping past the edge. No daisies, suns or rainbows.
- **Negative list:** no slideshow (dump then freeze), no screensaver drift, no breathing loops, no back half pan or push, no `repeat` or `yoyo`, no `Math.random`, no CSS transitions for motion. No browser chrome, nav bars or cursors. No Inter. No dashes.
- **Caption band:** captions are off (silent film) but every frame still keeps its content in the top 83% of the canvas.

## Frame 1 — Ban or give in

- scene: Three short lines swap through dead centre, the last one on an ink field
- voiceover: ""
- duration: 2.8s
- transition_in: cut
- status: animated
- src: compositions/frames/01-ban-or-give-in.html
- type: hook
- persuasion: Negative contrast
- beat: tension → recognition
- blueprint: kinetic-type-beats (Adapt)
- focal: typography only
- roles: none
- asset_candidates:

narrativeRole: Names the only two answers parents ever hear, then says neither one works. The viewer recognises their own nightly fight in three seconds.
keyMessage: Ban it all or give in, and neither teaches your child a thing.

Adapt: sub shape B, the multi beat statement build, with the Problem relay swap (prior line shrinks and split slides off both edges as the next scale pops in). Kept: the in place beat replacement at one centre anchor, the hard background flip on the climax beat. Changed: three beats only, no caret, no particle burst.
Scene 1 (0.0 to 0.8s): cream field. "Ban it all?" scale pops into dead centre, display ramp, ink, on a smooth long tail settle (`spring-pop-entrance`, no overshoot). Centered, the line is about 60% of the frame width. Two small outline stars sit in the top left and bottom right corners from t=0, cropping past the edge.
Scene 2 (0.8 to 1.6s): relay swap. "Ban it all?" shrinks and split slides off both left and right edges with a clip fade while "Or give in?" scale pops into the same centre (`scale-swap-transition`, `discrete-text-sequence`). Cut at peak velocity so the two halves read as one move.
Scene 3 (1.6 to 2.8s): the field hard flips to ink and the type inverts to cream (bg invert, `discrete-text-sequence`). "Neither teaches your child a thing." arrives by per word staggered reveal (`dynamic-content-sequencing`) across two lines, headline ramp, then holds still to the end of the frame. The two corner stars flip to a butter fill on the ink field.

## Frame 2 — The third way

- scene: A headline lands, then the five Planet Friends assemble along a drawn pathway with their age labels
- voiceover: ""
- duration: 3.0s
- transition_in: zoom-through
- status: animated
- src: compositions/frames/02-the-third-way.html
- type: product_intro
- persuasion: Future pacing
- beat: relief → clarity
- blueprint: grid-card-assemble (Adapt)
- focal: assets/pebble-this-stages-planet-friend.png
- roles: pebble = cutout · bloop = cutout · orbit = cutout · nova = cutout · cosmo = cutout
- asset_candidates: assets/pebble-this-stages-planet-friend.png — Pebble, the yellow ages 4 to 7 Planet Friend; assets/bloop-the-ages-8-to-10-planet-friend.png — Bloop, the green ages 8 to 10 Planet Friend; assets/orbit-the-ages-11-to-13-planet-friend.png — Orbit, the blue ages 11 to 12 Planet Friend; assets/nova-the-ages-13-to-15-planet-friend.png — Nova, the purple ages 13 to 15 Planet Friend; assets/cosmo-the-ages-16-planet-friend.png — Cosmo, the orange 16 plus Planet Friend

narrativeRole: Lands the promise by beat two: there is a third way, a clear pathway from first screen to sixteen. The Planet Friends are the site's own stage art, so the pathway is shown, not described.
keyMessage: A clear digital pathway from first screen to sixteen.

Adapt: the item stagger assemble is kept as the signature (five cutouts cascade into their slots along a horizontal strip), and the array holds. Changed: the grid becomes a single left to right pathway with a self drawing line beneath it, the closing line is the site's own promise rather than a price or URL, no camera zoom out.
Scene 1 (0.0 to 0.8s): cream field. "There is a third way." arrives by per word staggered reveal (`dynamic-content-sequencing`) in the upper third, headline ramp, ink, centred. Nothing else on screen. One outline star in the top right corner.
Scene 2 (0.8 to 2.1s): a pathway line self draws left to right across the middle band (`svg-path-draw`, ink stroke, a gentle rising curve). As the line reaches each station the matching Planet Friend fades and slides a short distance up into its slot (`center-outward-expansion` kept low drama, item stagger assemble), left to right: Pebble, Bloop, Orbit, Nova, Cosmo, each about 14% of the frame height so the row spans about 70% of the width. A badge pill pops beneath each as it lands (`spring-pop-entrance`, smooth settle) in the mono ramp: "4 TO 7", "8 TO 10", "11 TO 12", "13 TO 15", "16 PLUS", pastel fills sky, mint, lavender, peach and butter, 3px ink outline, 4px hard shadow. Full width strip, three depth layers: field, line, cutouts and pills.
Scene 3 (2.1 to 3.0s): the sub line "From first screen to 16. Ten minutes a day, together." reveals by per word stagger (`dynamic-content-sequencing`) beneath the row in the subtitle ramp, Nunito 700, muted ink. Everything then holds still. No drift, no breathing.

## Frame 3 — The real thing

- scene: The child's star bank screen and an earned passport page tilt in from opposite wings under one line
- voiceover: ""
- duration: 2.0s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-the-real-thing.html
- type: feature_showcase
- persuasion: Show-don't-tell proof
- beat: trust → control
- blueprint: compose
- focal: assets/kid-page.png
- roles: kid-page = cutout · passport page = cutout
- asset_candidates: assets/kid-page.png — the child app screen, star bank of 21, today's goal, saving for Saturday film night, quests; assets/an-earned-passport-page-the-foundation-s.png — an earned Digital Passport page, Foundation stage stamped

narrativeRole: Proof that the product is real and already lived in: the child earns stars, the passport gets stamped. It is the one piece competitors do not have, the star quest leading the list as the story says it must.
keyMessage: They earn their screen time and their passport, ten minutes a day, together.

Compose: two real screens as split tilt cards, then the line lands over them. No blueprint dictates the pair so the shot is composed from the vocabulary.
Scene 1 (0.0 to 0.9s): cream field. The two screens enter as split tilt cards (`split-tilt-cards`): the child app screen from the left wing, the passport page from the right wing, each on a white card with the 3px ink outline, 28px radius and the 6px hard shadow, mirrored small rotationY tilts settling to near flat. Centred pair, together about 55% of the frame width, sitting in the middle band with clear air above.
Scene 2 (0.9 to 1.5s): the headline "Ten minutes a day. Together." arrives by per word staggered reveal (`dynamic-content-sequencing`) in the upper third, headline ramp, ink. A badge pill spring pops onto the bottom edge of each card (`spring-pop-entrance`, smooth): "STARS EARNED" on the child screen in butter, "PASSPORT STAMPED" on the passport in mint, mono ramp.
Scene 3 (1.5 to 2.0s): held read. Nothing moves except the sanctioned subtle jitter on the two cards at the lowest amplitude (`sine-wave-loop`, finite, no repeat).

## Frame 4 — What stage is your child

- scene: The DiGi star blooms, the stage check question lands, the butter button presses, the URL wipes in and holds
- voiceover: ""
- duration: 2.2s
- transition_in: crossfade
- status: animated
- src: compositions/frames/04-stage-check.html
- type: cta
- persuasion: Friction reduction
- beat: urgency to act → ease
- blueprint: logo-assemble-lockup (Adapt)
- focal: assets/icon-apple-touch-icon-unsized.png
- roles: DiGi star = cutout
- asset_candidates: assets/icon-apple-touch-icon-unsized.png — the DiGi star mark, the brand's app icon, smiling yellow star

narrativeRole: The hook every piece of Guided Childhood marketing ends on, identical every time. The button is the site's own CTA and the sub line removes every excuse.
keyMessage: What stage is your child? Three questions, no sign up.

Adapt: the CTA text clear bloom variant, inverted: the mark blooms first from zero at centre (the one signature kept, with its playful overshoot), then the question, the button and the URL build beneath it. Changed: no wordmark cascade, no camera push through, the button is the site's real CTA.
Scene 1 (0.0 to 0.7s): cream field. The DiGi star mark spring blooms from zero at the upper centre (`spring-pop-entrance`, this one with the playful overshoot and a hint of rotation), about 16% of the frame height. Three small outline stars sit at the corners, one butter filled. Then "What stage is your child?" arrives by per word staggered reveal (`dynamic-content-sequencing`) directly beneath, display ramp, ink, centred.
Scene 2 (0.7 to 1.5s): the butter button "Find my child's stage" rises into place beneath the question (`spring-pop-entrance`, smooth), Nunito 800, ink text on butter, 16px radius, the site's own 5px hard shadow in butter dark, then performs one tactile press with a spring recovery (`press-release-spring`, the second and last playful overshoot). As it recovers, the sub line "THREE QUESTIONS. NO SIGN UP." reveals beneath it in the mono ramp, muted ink (`dynamic-content-sequencing`).
Scene 3 (1.5 to 2.2s): "guidedchildhood.com" wipes in left to right beneath the sub line in the mono ramp (`stat-bars-and-fills` used as a mask wipe), butter dark, and everything holds dead still to the final frame. The whole stack sits in the top 80% of the canvas, centred, about 50% of the frame width.
