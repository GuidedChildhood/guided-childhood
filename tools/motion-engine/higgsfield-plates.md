# Footage and objects for the motion engine

Read 16 November 2026. Higgsfield is connected and the account is on the Plus
plan with 75.37 credits. Nothing is generated without Justin's yes.

## What the catalogue offers that fits

| Use | Model | Why | Notes |
| --- | --- | --- | --- |
| A background plate, from a prompt | `seedance_2_5` (mode `t2v`) | Seedance 2.5, 4 to 30 seconds, up to 1080p | No 4:5 ratio. Ask for `3:4`; the card crops it to 4:5. Set `generate_audio` false |
| A plate from one approved still | `seedance_2_0` with `start_image` | Holds the look of a picture we already have | `mode` std needs the Plus plan, which the account has |
| A cheaper rough draft first | `seedance_2_5` with `draft` true | A 480p draft that can be finalised within seven days | Approve the draft, then finalise |
| A 3D object still | `generate_image` (house default model) | A single object on a plain ground, cut out afterwards with `remove_background` | Never a character. Characters come only from the approved cutouts |

Credits per job are shown by Higgsfield before it runs. Ask for the quote,
give it to Justin, and wait.

## The rules for any plate or object

1. **No text in the picture, ever.** No signs, screens with words, labels or
   numbers. All words are set by the engine. The visual system says never
   trust text inside a generated image.
2. **No people presented as real.** No children, no parents, no faces. Hands at
   a distance at most, and only if Justin agrees.
3. **No characters.** Pebble, Bloop, Orbit, Nova, Cosmo and DiGi come from the
   approved cutouts, never a prompt.
4. **No invented app screens.** A phone may appear dark or out of focus, never
   showing a made up interface.
5. **Quiet movement.** A slow push, light moving across a surface, paper
   settling. Nothing that pulls the eye from the words.
6. **Our palette.** Warm ivory, soft navy shadow, one touch of gold light.

## A prompt to start from

> Slow, gentle camera push across a warm ivory linen surface in soft morning
> light. A small smooth object casts a long soft shadow. Shallow depth of
> field, calm, premium, editorial. Colour palette of warm ivory, soft navy
> shadow and one warm gold highlight. No people, no faces, no text, no
> letters, no numbers, no screens, no logos.

## Putting it into a card

1. Download the finished file into `public/plates/` (or `public/objects/`).
2. Name it after the story, for example `plates/gdc-061-light.mp4`.
3. Set `backgroundVideo` or `objectImage` in the spec.
4. Render and check as normal. The check measures the finished card, plate
   included.

## Not tested yet

No Higgsfield or Seedance footage has been generated or rendered into a card.
The footage and object layers were tested with a plain moving gradient made by
FFmpeg and the approved DiGi star, so the pipeline is proven and the generated
footage is not.
