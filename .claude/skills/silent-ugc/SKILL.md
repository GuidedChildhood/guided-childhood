---
name: silent-ugc
description: Build short vertical videos in the silent UGC format for TikTok, Reels and Shorts, to drive parents to the stage check. Use whenever Justin asks for TikTok videos, Reels, Shorts, vertical video, a UGC video, a hook video, "make me some short videos", "clone this TikTok", or wants to build or refill a short form account. Produces the hook, the shot list, the Higgsfield generation calls and the stitched MP4. Never generates a synthetic person presented as a real parent.
---

# Silent UGC

The format that is currently working for consumer apps. No talking, no voiceover,
no script to lipsync. A held shot of something real, one line of text over it
carrying the whole hook, then a cut to the product. Ten to fifteen seconds.

It works because the text does the persuading, so nothing depends on an AI voice
sounding human or a mouth moving correctly. That is also why it is cheap enough
to make thirty of and find out which hook lands, which is the entire point. One
video is a guess. Thirty is a test.

Read `THE-STORY.md` before drafting anything, and apply
`content-engine/hidden-thread.md`. This skill produces the video. It does not get
to invent what the product does.

## The one change from the standard playbook

The usual version of this uses an AI generated person holding a phone, implying a
real customer. **We do not do that, and it is not a close call.**

Three reasons, in order of how much they cost us if ignored.

1. **It is the opposite of the thing we sell.** Justin's audience exists because
   he concedes what the evidence does not support before anyone else can raise
   it. His best performing post worked on that move alone. A fabricated parent
   recommending a child safety product is the single most quotable thing a critic
   could ever be handed, and the people who would find it are the safeguarding
   leads and researchers already in his comments.
2. **The house rule already says so.** `family-social` requires the real photo it
   needs. This skill does not get to make an exception for a different aspect
   ratio.
3. **A synthetic person implying real use is a testimonial problem.** UK
   advertising rules expect testimonials to be genuine and evidenced. Do not put
   us there for a format that works just as well without it.

None of the mechanics need a face. Text hook, real thing held, cut to product.
Hands and a kitchen table outperform a stock smile anyway, because they read as a
real house rather than an advert.

## What we actually shoot

In order of preference.

1. **Hands and objects.** The paper star chart on a fridge. A printed passport
   page. A phone face down on a table at dinner. A pen filling in a chart. Nobody
   identifiable, nothing to fake, and it matches the product.
2. **Justin.** He is already the face, and real photos of him already work. Use
   him where the hook is his own observation.
3. **The family, under `family-social` rules.** Their account, their voice, not
   Justin's, and only what they have actually agreed to.
4. **Screen only.** The app, the stage check, the chart builder. Legitimate on
   its own for a "here is the thing" video.

Higgsfield generates the *scene* when we have no footage: a kitchen worktop, a
chart on a wall, light through a window, a hand entering frame. Environments and
objects, not a person delivering a claim. If a shot only works with a face
speaking to camera, the shot is wrong for us.

## The two scenes

**Scene one, about 6 to 9 seconds.** One held shot, barely moving. The text hook
sits over it from frame one. No cuts. Boring on purpose: the eye reads the text,
and dwell is what the ranking wants.

**Scene two, about 4 to 6 seconds.** The product, shot on a real screen. Always
the same clip, reused across the whole batch. This is the part that never needs
regenerating, so record it once properly.

The product scene ends on the stage check, because that is the free front door
and it needs no signup. The line on screen, identical every time, is the one from
THE-STORY: **What stage is your child? Three questions, no sign up.**

## The hook is the whole job

Everything else is production. Spend the thinking here.

A hook earns the watch by naming a moment a parent has actually had, in their
words, with no advice attached. It is not a claim, a statistic or a promise. The
video is not allowed to resolve it either; the product scene is the resolution.

What works for us:

- **The specific domestic moment.** "Four years of arguing about bedtime. I was
  negotiating the wrong thing."
- **The thing nobody warned them about.** "He started secondary in September. No
  one mentioned the group chat."
- **The admission.** "I was the strict one about screens. It did not work."
- **The counted thing that turns out not to matter.** "I stopped counting hours.
  Here is what I count now."
- **The research one, used sparingly.** "The two minute warning makes it worse.
  Somebody actually studied it." Only where the fact base supports it, and only
  about one in ten.

What does not work, and must never ship:

- Any promise about a child. No safer, calmer, happier, less anxious. We claim
  clarity, a calmer conversation and a pathway, and nothing about the child.
- "Safe online" or "ready for social media". The wording is always "completed the
  preparation".
- A number that is not in the verified fact base in `plans/decisions.md`.
- Anything shaped like a testimonial when nobody gave one.
- Fear. A parent should finish more capable, not more frightened.

**No dashes anywhere.** On screen text included. It is the most visible tell we
have and the on screen line is the most read thing in the video.

## Research before drafting

Do not write hooks cold. Look at what is currently landing in this niche, then
write ours.

Search TikTok for the app names parents in this space use, and for the bare hook
phrasings the format runs on: "no one told me", "I just found out", "I cannot
believe", "nobody warned me". Read what is getting watched, take the *shape*, and
write our own line. Never copy someone's words, and never clone a video whose
premise we cannot stand behind.

If a reference video is supplied, study the held shot, the framing, the pace and
where the text sits. Rebuild that structure with our own subject and our own
line.

## Producing it

Higgsfield is connected and `lesson-video` already uses it, so the pipeline
exists. HeyGen is not authorised in this session and is not needed for this
format.

1. **Scene one visual.** `generate_image` for the still if a plate is wanted, then
   `generate_video` on Seedance for the held shot. Vertical, 9 by 16. Keep the
   motion tiny: a hand entering, steam, a curtain. Anything more pulls the eye off
   the text.
2. **Scene two.** The recorded product clip. Not generated.
3. **Stitch.** Higgsfield `explainer_video`, or the batch tools with `jobs_wait`
   when making several. For a batch use `generate_video_batch`, then one
   `show_generation_by_ids`.
4. **Text.** Burned in, top third, large, high contrast, readable with sound off
   and at speed. Most people never hear it.
5. **Approve scene one before the batch runs.** Generating thirty seconds of
   wrong is how credits disappear.

## Two modes

**Clone mode.** One reference video in, one of ours out. Use it to prove the look
before spending on volume.

**Account mode.** Six to thirty videos sharing one product scene and one visual
world, each with a different hook. This is the real use. The product scene is
identical throughout, so the only variable under test is the line, which is
exactly what you want to learn.

## After it is made

- **Warm a new account first.** Do not upload thirty videos into a fresh account
  on day one.
- **Post, then read.** The hooks that get watched are the ones worth putting
  money behind, and they are also the ones worth feeding back into `viral-post`
  and `content-engine`, because a hook that works on TikTok usually works as a
  LinkedIn first line.
- **Log what posted** the way `content/brand-story/posted-log.md` does, so we are
  not guessing next month.

## Cost

Roughly a pound a video at current Higgsfield rates, so a thirty video account is
around thirty pounds plus the hour it takes. Check `balance` before a batch.

## Hard rules

1. No synthetic person presented as a real parent or user. Ever.
2. No dashes in any copy, on screen or in the caption.
3. Never claim an outcome for a child.
4. Never "safe" or "ready for social media".
5. Every claim traces to the verified fact base or it does not go in.
6. Every video ends at the stage check, three questions, no sign up.
7. Justin's voice, or the family's under `family-social`. Never a generic
   advertising voice.
