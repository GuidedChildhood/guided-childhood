# UGC videos: the morning, before and after

Two paired short videos for Instagram, TikTok and paid social. Same house, same
child, same seven in the morning. Version A is the fight every parent already
knows. Version B is the same morning running through the app.

Post them as a pair. A carries the reach because it is the pain, B carries the
signups because it is the answer. They also stitch into one forty second cut
with a hard swipe between them.

- `version-a-the-morning-battle.md`
- `version-b-jobs-first.md`
- `screens-shotlist.md` (which app screens to capture, and from where)

## How these get made

The engine is the Higgsfield `ugc-saas-flow` workflow. It builds one continuous
talking head clip per fifteen seconds, seeded from a single locked creator
image, then drops real captured screenshots of the app over the face as cards,
then burns captions. Vertical, 1080p, captions on.

The thing worth knowing before we start: that workflow will never invent our
UI. Every screen on camera has to be real pixels we captured. That is the right
rule and it is why the shotlist exists.

### The pipeline, in order

1. **Capture the screens.** Playwright against the fixture routes, mobile
   viewport, PNG per card. See `screens-shotlist.md`. Six to ten stills.
2. **Lock the creator.** Either a photo of a real mum, which the workflow uses
   as is, or one generated portrait that gets reused for every clip so the face
   never drifts.
3. **Write the beats.** Already done, in the two script files. One beat per
   captured still, in the order they appear on screen.
4. **Render the clips.** Seedance, 9:16, 1080p, fifteen seconds each, all
   submitted in one batch.
5. **Composite.** Screens pop in as large cards anchored to the word that names
   them, roughly one and a half seconds each, never over the hook or the close.
6. **Captions.** Word level transcript of the final audio, burned in one pass.

## Yes, upload your rough recordings

Three separate uses, and they are not interchangeable.

**The app screens.** Send them if you have them, but we should not use phone
recordings of the app in the final cut. The workflow wants crisp stills and we
can capture those straight from the app at exactly the right moment, at retina
resolution, with no thumb, no glare and no notification bar. Your recordings are
still useful as direction: they show me which moment you actually want frozen.

**The creator.** If there is a person on camera you want, send a clear photo of
them, head and shoulders, good daylight, no filter. The workflow takes a real
photo over a generated one and skips the whole generation step.

**The room.** A ten second pan of the actual kitchen or the actual stairs makes
the generated clips sit in a real house rather than a stock one.

To upload, say so in the session and the Higgsfield upload widget opens in the
browser. Files go straight to Higgsfield storage. Do not attach them in chat,
the remote tools cannot read chat attachments.

## The one real constraint: the child on camera

The AI video models are heavily restricted around generating children, and
rightly so. A thirteen year old girl as an AI performance is either refused
outright or comes back wrong in a way that would be worse than not making it.

So the child beats get shot for real, one of three ways:

1. **Your own family, with their consent**, which is also the most honest
   version of this ad and the one that matches the brand.
2. **Hands and shoulders only.** A hand on a phone, a duvet being pulled
   straight, a thumb tapping start. No face. Generates cleanly, shoots even
   more cleanly on a phone in about ten minutes.
3. **A UGC creator with their own child**, briefed from these scripts.

My recommendation is two and one together. Shoot the hands and the bed and the
timer tap yourself on a phone in one morning, use a real mum to camera, and let
the app screens do the explaining. That is a stronger advert than a fully
synthetic one and it costs almost nothing.

Every beat in both scripts is tagged `[REAL]`, `[AI]` or `[SCREEN]` so it is
obvious what needs a camera and what does not.

## Credits

Higgsfield balance at the time of writing: 79.97 credits, Plus plan. One thirty
second render is two Seedance clips plus a creator image, so the balance covers
roughly one video and one retry. Both videos plus the usual reshoots will want a
top up first.
