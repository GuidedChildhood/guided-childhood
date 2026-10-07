# Social Billboard: the Top 5 review show

A weekly TikTok, Reel and Short where Justin counts down the five videos that
made this week's playlist. Copied from the structure of one proven video, then
rebuilt inside the Social Billboard rules (plans/sb-parent-launch-control.md).

## The reference

EccyReviews, "Best series you must watch on Netflix 2026"
(tiktok.com/@eccyreviews/video/7596799470730398979). Seen 6 October 2026:
3.4 million plays, 50,300 likes, 26,000 saves, 8,000 shares, 999 comments.
1 minute 48, vertical, one take, his own voice.

How it is built, second by second:

| Time | What happens on screen |
| --- | --- |
| 0 to 15s | Full face to camera, high energy. Top band: big NETFLIX logo, white label box "BEST SERIES ON NETFLIX (2026)". Hook: "sick of endlessly scrolling... I guarantee there's one show on this list for you." |
| 15 to 20s | The ask, early: his name, "follow for more", "tell me your favourite show". A screenshot of his profile flashes up with the follow button. |
| 20s to end | Ten shows, 6 to 12 seconds each. The show's poster fills the screen and he sits cut out (background removed) over the lower half, still talking. |
| The end | No outro. The last show finishes and it stops, so it loops. |

Why it works:

1. The hook names the viewer's own pain (scrolling and not finding anything).
2. The follow and comment ask comes at 15 seconds, while everyone is still
   watching, not at the end when most have gone.
3. A new picture every 8 seconds holds attention without any editing tricks.
4. Each pick gets one line of reason and one "go and watch it". Nothing more.
5. "Tell me your favourite" turns the comments into a list of their own, which
   is where the 999 comments came from.
6. Captions word by word in heavy capitals, the key word boxed in colour.

## Our version

Same skeleton. Our picks, our colours, our gates.

| Theirs | Ours |
| --- | --- |
| NETFLIX logo + white label box | Social Billboard wordmark + white label box: "BEST SPACE VIDEOS FOR AGES 9 TO 11" |
| Ten shows | Five videos, this week's real playlist, counted down 5 to 1 |
| The show's poster behind him | A black card per pick: big yellow number, the video's title in white, chips for the age band and the length. Never a YouTube thumbnail, never a clip (see below) |
| Pink keyword box in the captions | Yellow keyword box (#FFCE1B). Black, white and yellow only |
| "Follow me for recommendations" | "Follow for a new playlist every week, and tell me your child's age in the comments" |
| No outro | One line outro: "Get this week's playlist free. Link in bio." Then it stops |

Length: about 60 to 70 seconds. Hook and ask 15, five picks at about 9 each,
outro 5.

### Gates (from the control document, these hold on every episode)

- Never "safe", "vetted", "nothing autoplays" or "when it ends, it ends".
- Never a YouTube thumbnail or a clip of a creator's video on screen. The cards
  carry the title only. If Justin wants real footage behind him, the only
  allowed source is a real screen recording of the playlist in our own app,
  and even that shows thumbnails inside it, so it is his call (see "Needed").
- Nothing about creators. We say what the video is and why it made the list.
- Real Justin only. No avatar, no synthetic presenter.
- Every line about a video is something Justin has seen himself.

## Episode 1: this week's Space playlist (5 to 11 October)

The five videos and the "18 opened, 5 made it" number come from the live
decks (series-04 and series-12). The bracketed lines are suggestions:
Justin swaps in his own words for anything he did not see in the video.

**Hook, face to camera (0 to 10s)**
> If you're sick of scrolling YouTube trying to find something your child can
> actually watch, these are the five space videos that made this week's
> playlist. We opened eighteen. Only five made it.

**The ask (10 to 15s)** (profile screenshot flashes up)
> I'm Justin, dad of three. Follow for a new playlist every week, and tell me
> your child's age in the comments.

**Number 5. Testing a space telescope**
> [How do you test something you can't fix once it's in space? This shows
> you.] Go and watch it.

**Number 4. Tim Peake's space station tour**
> [A real astronaut, showing you where he slept and ate.] Brilliant.

**Number 3. The Moon**
> [Everything they ask you about the Moon, in one go.] Go and see it.

**Number 2. 8 planets, 8 experiments**
> [Eight experiments you can do at the kitchen table.] Get the kids doing
> this one.

**Number 1. Start stargazing**
> It's top of the list because it ends with them going outside. The Draconids
> peak this Friday, just after dark. No telescope. Just a coat.

**Outro**
> Get this week's playlist free. Link in bio.

### Caption

> We opened 18 space videos this week. These 5 made the playlist.
>
> Ages 9 to 11, about 40 minutes, and it finishes outside under the Draconids
> on Friday night.
>
> Tell me your child's age and I'll tell you what we'd put on theirs.

### What Justin films

One take on the phone, front camera, plain wall behind, good light from a
window, about 70 seconds. Read straight through; mistakes get cut. That one
clip is all that is needed: the background removal, the cards, the captions
and the profile flash are built from it with the talking-head-video skill.

## Making every week after this one

1. Take the week's playlist deck (`tools/tsb-playlist-card/decks/`).
2. Write the hook from the opened versus made it number.
3. One line per pick, countdown order, the strongest reason last.
4. Same ask at 10 seconds, same outro.
5. Justin films, the talking-head-video skill builds it, `npm run ai-tells`
   on the script before it goes out.
