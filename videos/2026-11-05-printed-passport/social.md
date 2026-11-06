# Captions for the printed Passport film

For the family account (Instagram and Facebook, the family voice under
`.claude/skills/family-social`) and TikTok (`.claude/skills/silent-ugc`).
Film: `renders/printed-passport-social-1080x1920.mp4`. Drafts only:
nothing is posted until the printed listing is live and Justin says go.

This is a brick, not the one in ten: it shows a thing we made and does not
state the thesis.

## Instagram (Reel)

On screen hook (already burned in): A stamp for learning it. Not for turning
a year older.

Caption:

> The Passport comes printed now.
>
> A little burgundy book with their name on the cover. One spread for every
> stage from four to sixteen, and real stickers for the stamps.
>
> 1. Have the talk. The words are on the page.
> 2. Do the one small thing together.
> 3. They tell you the big idea back, in their own words.
> 4. Then the stamp goes in.
>
> Printed one at a time and posted to your door. It is in our Etsy shop, link
> in bio.
>
> Which page would your child be on?

Cover frame: frame 0 of the film. No link in the caption.

## Facebook

One video, the full argument in the text, and the link in the body.

> We have printed the Passport.
>
> It started as a page in the Guided Childhood app: five stages from four to
> sixteen, each one a Planet Friend, each one stamped when a family has done
> three things. Have the talk, do one small thing together, and let your
> child tell you the big idea back in their own words. A stamp for learning
> it, not for turning a year older.
>
> Now it is a real little book. Their name in gold on the cover, if you like,
> or leave it blank and let them write it. A spread for every stage, with the
> words to say printed on the page, and a sheet of real stickers for the
> stamps.
>
> Each one is printed on its own in the UK and posted to your door.
>
> [Etsy listing link, once live]
>
> Not sure which page your child is on? Three questions, no sign up:
> guidedchildhood.com

## TikTok

> A stamp for learning it, not for turning a year older. The Passport, printed.
> #parenting #screentime #parentsoftiktok #onlinesafety #kidsandtech

## Proof paths

| Claim | Where it is true |
|---|---|
| Five stages, four to sixteen, the Planet Friends | `lib/content/stages.ts`, `lib/content/stage-characters.ts` |
| Talk, doing, check stamps a page | `content/printables/guided-childhood-passport/passport-data.js`, `lib/pathway/stamped.ts` |
| Name on the cover, optional | `printed.html` (PASSPORT_NAME), the listing's personalisation box |
| Real stickers | `printed/guided-childhood-passport-printed-A6-stickers.pdf` |
| Printed one at a time in the UK, posted to your door | Mixam UK, true once the listing is live and the first order goes through |
| Three questions, no sign up | the stage check on guidedchildhood.com |

No outcome claim about any child. No dashes.
