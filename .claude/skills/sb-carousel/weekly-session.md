# The weekly playlist session: imaging, motion, and the prompt

Justin, 6 October 2026: better imaging on the Social Billboard carousels,
well known clips or thumbnails to illustrate, firm rules on how much text and
how the motion comes up, and one prompt to paste every week. This file is the
session. SKILL.md is the system under it and wins where they differ.

## 1. Imaging: how a well known video appears without us copying it

A parent recognises a video by its thumbnail. The thumbnail belongs to the
creator, so we never lift it and place it as our own image. It appears in one
way only: **inside a real screenshot or screen recording of our own playlist
page**, where YouTube's own embed shows it. That is a real product screen,
which the system already allows, and it is what a parent will actually see.

- **Carousel:** one slide carries a real screenshot of the week's playlist on
  thesocialbillboard.com, the five videos visible, cropped to the phone frame.
  Take it with the existing shot method in `tools/tsb-playlist-card/shots/`.
- **Reel:** a screen recording of the same page, scrolled slowly, is the B
  roll. Nothing else from the videos. No clips from inside a creator's video,
  ever, unless the creator has said yes in writing and the file name records it.
- **Recognition without the picture:** the channel name and the video title in
  type, with the age chip in pink. "Kurzgesagt, Why the moon is leaving" is
  enough for the parent who knows it, and it is ours to write.
- **Our own imagery:** Justin's face on slide 1 when a real photo exists; the
  night skies from `backgrounds/` with no text; the product screens. Never a
  stock parent, never a generated child, never a fake screen.

## 2. Text: the amounts

| Asset | Limit | Why |
|---|---|---|
| Slide 1 | 12 words | Read in one second at thumb speed |
| Other slides | 25 words | `check-words.mjs` fails above it |
| Reel text beat | 5 words on screen at once | A phone held at arm's length |
| Reel total | 8 beats or fewer in 15 seconds | One idea per beat |
| Caption first line | The words a parent would search | "space videos for 9 to 11 year olds" |
| Hashtags | 3 at most | More reads as spam |

Type sizes are fixed by the template; do not shrink type to fit more words,
cut words instead. One yellow element per slide. Pink means age band.

## 3. Motion: how the words come up on a Reel

The Reel is built from the same deck JSON with HyperFrames, through the
`talking-head-video` skill, lane B, to its `motion-standard.md` translated to
the Social Billboard tokens (near black, yellow, Montserrat; no stars, no
DiGi, no cream).

- **Silent first.** Most feed plays are muted. The text hook does the work.
  Captions burned in. Music only when a licensed track exists.
- **The hook is on screen by 0.5 seconds** and holds until 2.0. The first
  frame is the cover: the series masthead, the hook, one proof element.
- **Words arrive in groups, never letter by letter.** The first word group
  slides 360px and the rest decay (120, 60, 25, 12px), `expo.out` 0.33s. A
  word group holds at least 1.5 seconds before the next replaces it. Nothing
  loops.
- **One move per beat.** A slide up, a hard cut on the half second grid, or a
  yellow marker sweep under the key word. Never two moves at once.
- **The screen recording plays under the words from beat 3**, dimmed to 60
  percent so the type stays legible, with the five videos scrolling past at
  reading pace.
- **The ask holds four seconds.** GET A FREE PLAYLIST in the yellow pill, the
  site under it, nothing moving. Inside the 3:4 grid crop, nothing in the
  bottom 380px.
- **Every cut rides motion, every tween is finite, every timeline fills its
  slot.** The pre flight list in `motion-standard.md` section 4 runs before
  Justin sees it.

## 4. The formats that work on Instagram and Facebook

Adopted through the feedback filter on 5 October (the verdicts are in
`plans/sb-parent-launch-control.md`, Day 4). The weekly playlist uses three.

1. **The carousel, 7 slides.** Slide 1 the curiosity gap ("18 space videos
   opened. 13 didn't make it."). Slide 2 a second hook that stands alone.
   Then the problem, the cut (what nearly made it and why it did not), the real
   screen, the honest limit, the ask as a send ("Send this to a parent with a
   space fan"). Facebook gets the same slides as one photo post, the argument
   in the text, the link in the first comment.
2. **The Reel, 7 to 15 seconds, silent.** Cover, hook, three beats on what is
   in the playlist and why it ends where it does, the screen recording, the
   ask. Reels are what reaches people who do not follow us.
3. **The weekly card, 1200 x 630.** The email and Facebook image, unchanged
   from `space-9-to-11.json`.

After posting: Story with a link sticker within the hour, reply to every
comment with a question back in the first hour. Never "comment YES", never a
boost before a result.

## 5. The prompt to paste each week

Replace the four bracketed items. Everything else stays.

```
Run the Social Billboard weekly playlist session with the sb-carousel skill and its weekly-session.md.

This week's playlist: [subject], ages [age band], live at [URL of the playlist page].
What nearly made it and why it was cut: [one line, or "ask me"].
Where it ends and why: [one line, for example "ends outside, a moon spotting walk"].
Real photo of me with the product this week: [path, or "none"].

Build three things from one deck JSON in tools/tsb-playlist-card/decks/:
1. The 7 slide carousel (1080 x 1350) with alt text, Facebook text and captions.
2. The silent Reel (1080 x 1920, 7 to 15 seconds) through talking-head-video lane B, with the screen recording of the playlist page as the only B roll.
3. The weekly card (1200 x 630).

Rules that win: well known thumbnails appear only inside the real screenshot or screen recording of our playlist page, never placed as our own image; 12 words on slide 1, 25 after, 5 words per Reel beat; one yellow element per slide, pink for age; no dashes; every claim from plans/sb-parent-launch-control.md section 1; nothing from Guided Childhood.

Check the word budget and the pre flight list before you show me. Then show me slide 1, the last slide and the Reel contact sheet, with the caption, and tell me what you need from me.
```

## 6. Learned

Add one line per week, from Justin's feedback, so the next session starts
better. If a note appears twice it becomes a rule above.
