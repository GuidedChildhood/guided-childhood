# SOCIAL BILLBOARD: PARENT LAUNCH CONTROL

The one control document for the Social Billboard parent launch. Started on 5
October 2026. It replaces every earlier Social Billboard plan as the place to look. The
older documents stay where they are as source material, classified in section
13. Nothing here has been published, scheduled or sent.

**The images.** Every rendered card for Days 1 to 10 is in [the renders folder on GitHub](https://github.com/GuidedChildhood/guided-childhood/tree/claude/admiring-bell-nakdyu/content/packs/2026-10-05-sb-launch-control/renders), one folder per day.

**How to use it.** Read section 11 (today), then section 8 (what needs you).
Everything else is reference. When a post goes out, move it to section 9 and
write the numbers in section 10.

---

## 1. Current proposition

**Parents first. Creator services wait.**

> Your choices. A playlist to match.
> You choose the age, the subject, the tone, the time of day and how long.
> We build a playlist around it, and you see every video before they press
> play. Your first playlist is free. One child profile. No card needed.

**Primary CTA, everywhere:** GET A FREE PLAYLIST.

**The story, in order:** Justin, then the parent problem (the next video),
then why he built it, then what was built, then the real product, then the
free playlist, then the weekly playlist, then the research behind it, then
parent participation. Repeat.

**What we can say (proof path in brackets).**

- You choose age band, tone, content type, time of day and session length
  (the live builder; the app's own fields).
- Hand curated Discovery playlists by age band (the live site).
- Free: one child profile, one playlist, no card. Pro £5.95 a month or £55 a
  year (the live site; the app's own limit message).
- No Shorts in playlists (runtime guidance: "never Shorts").
- You see the playlist before your child presses play (the app's preview and
  review screens).

**What we do not say yet.**

- "When it ends, it ends", "nothing autoplays", "it stops by itself": only
  after Justin films what happens when the last video finishes on his phone
  (gate G2).
- Any description of the full checking framework, or a link to the parent
  transparency page: three wordings are in circulation and the page has no
  route in the live site's code (gate G3). Only the broadcaster test is
  named, because every version includes it.
- "Safe", "guaranteed", "100%", "no algorithm", "vetted by experts", "child
  development specialists". The last two are in the live app's own copy;
  posts do not repeat them.
- Anything about creators.

**One business per post.** Guided Childhood appears at most once, later, as
one small line in a founder post about how Justin now builds. Never as a
sell.

---

## 2. Founder story source

**The approved source is `content/brand-story/founder-context.md`,** supplied
by Justin on 1 October 2026, with its GREEN, AMBER and RED levels. Two
supporting sources: `content/brand-story/founding-story.md` (the family
canon, Covid section) and the Drive script "Why I Quit Guessing and Built The
Social Billboard" (June 2025, Justin's own question about age ratings).

**The Social Billboard origin, as the source tells it.**

| Beat | What the source says | Level |
| --- | --- | --- |
| The YouTube moment | A video about relationships appeared through recommendations. He realised how little control a parent has over where a run of recommended videos leads. He watched his children move from one video to another in ways that were hard to predict. He could also see YouTube held extraordinary educational material. | GREEN |
| Choosing it himself | He tried manually selecting suitable videos. It was time consuming, hard to maintain and did not solve the wider problem. "Social Billboard grew from that itch." | GREEN |
| Built with developers | Turning the idea into software meant finding developers and hoping another person understood the vision; he experienced those difficulties. (Drive also holds the developer build documents.) | GREEN. Justin to confirm when it was built. |
| Lockdown | Two little girls at home, a business to keep alive, YouTube used to get through it. | AMBER (the children). The family account runs this scene on Friday 9 October, so it does not run here until the week of 19 October. |
| How he builds now | AI assisted coding changed what he could build himself. | GREEN. Once, small, later. Never "Social Billboard was vibe coded". |

**Rules.** No invented scene, line or detail. No scene on two accounts in the
same fortnight. No child named or shown.

---

## 3. Parent conversion route

```
Post (IG link in bio, FB link in body on product posts)
  -> thesocialbillboard.com/safe-youtube-for-kids
  -> GET A FREE PLAYLIST
  -> Sign up          (check: the 30 Sep audit found this landing on log in)
  -> Add a child (age band only, no name needed)
  -> Build: age, tone, type, time of day, length   OR   open Discover
  -> See the playlist
  -> Play
  -> Feedback: justin@thesocialbillboard.com, or a reply to the post
```

**The number that matters:** activated parents (signed up and opened a first
playlist), then useful replies. Target unchanged: 20 activated of 100
accounts by 13 November.

**Tracking.** Every link carries
`?utm_source=<instagram|facebook>&utm_medium=organic&utm_campaign=sb_launch&utm_content=<post id>`.
Post IDs are `SB-<date>-D<day>`, for example `SB-2026-10-06-D1`. No child
data in any link.

**Instagram profile, @thesocialbillboardco (seen 5 October).** The bio led
with creators and "AI powered tools ... safe content for kids", and there
were four links, two of them waiting lists for a product that is now live.
The parent first version:

- Bio: "Playlists built around your choices. / You pick the age, subject and
  length. You see every video first. / First playlist free. No card."
- Link 1: **Get a free playlist**,
  `https://thesocialbillboard.com/safe-youtube-for-kids?utm_source=instagram&utm_medium=bio&utm_campaign=sb_launch`
- Link 2: **For creators: request a review**, the existing creator waiting
  list, kept last.
- Removed: the parent waiting list (replaced by link 1), "Website beta" (a
  duplicate, and "beta" undercuts the offer), the Chart Show (creator side,
  back when creators open).
- Facebook page button: the same link 1 address, with `utm_source=facebook`.

**Open checks before Day 5 (the invitation day).** The free button goes to
sign up, not log in. The Instagram bio and Facebook button point at the page
above. Footer legal links work (the app now has privacy and terms routes;
check them on a phone).

---

## 4. Approved visual and brand assets

**In use and safe to keep using.**

| Asset | Where |
| --- | --- |
| Palette from the live site: black #0A0A0A, white, yellow #FFD100 (every CTA), grey #A1A1A1 | `tools/tsb-playlist-card/template.html` |
| Montserrat, self hosted | `tools/tsb-playlist-card/fonts/` |
| Weekly playlist card and the four night sky backgrounds (our own art, no text) | `tools/tsb-playlist-card/` |
| Five real product screenshots (criteria and a playlist) | `tools/tsb-playlist-card/shots/` |
| SB logo | Drive: "TheSocial Billboard Logo Design (1).png" |

**New, for your yes (rendered drafts in `content/packs/2026-10-05-sb-launch-control/renders/`, one folder per day).**
One series layer on the existing system, so every post looks like part of one
account rather than a new design each time:

- **Masthead:** the series name top left (WHY I BUILT THIS, THE NEXT VIDEO,
  THIS WEEK'S PLAYLIST, WHY THIS MADE THE PLAYLIST, I TRIED IT AS A DAD), the
  issue top right.
- **Session bar:** a line from a start dot to an END block that fills slide
  by slide. It draws the product's promise, a session with a beginning and an
  end.
- **Chips:** the builder's own choices as pills. Pink always means the age
  band.
- **Reel covers:** words inside the 3:4 grid crop, nothing in the bottom
  380px.

**Order of preference for every image:** real Justin, then the real product,
then the real playlist, then real screenshots. Generated graphics only for
carousel cards, explanations and the recurring formats. Never a child's face,
a stock person, a synthetic parent, a YouTube thumbnail or a fake screen.

---

## 5. Day 0 to 10 launch sequence

SB posts go out at 19:00, clear of the family account's 10:00 slot. Gates:
**G1** playlist approved and live in Discover. **G2** Justin's phone test of
the ending. **F** needs filming or a screen recording.

**No video of Justin yet (decided 5 October).** Days 1 to 10 run on cards,
real screenshots and text. The three video pieces (origin video, product
demo Reel, I Tried It As A Dad) move to the first week you film, and slot in
as extra posts without moving anything else.

| Day | Date | What | Where | Status | Gate |
| --- | --- | --- | --- | --- | --- |
| 0 | Mon 5 Oct | Setup and audit | | Today | |
| 1 | Tue 6 Oct | Why I Built This, chapter 1: the founder letter | IG carousel, FB post | Ready | |
| 2 | Wed 7 Oct | The First Video Wasn't The Problem | IG carousel, FB post | Ready | |
| 3 | Thu 8 Oct | So I Started Choosing It Myself | IG carousel, FB post | Ready, one fact to confirm | |
| 4 | Fri 9 Oct | How it works: the real screens | IG carousel, FB post | Ready, needs one screenshot | |
| 5 | Sat 10 Oct | Free playlist invitation | IG single, FB post | Ready once the route is checked | |
| 6 | Sun 11 Oct | Parent request and question | FB post, IG Story | Ready | |
| 7 | Mon 12 Oct | This Week's Playlist | IG carousel, FB post, Stories | From Thursday's Safe Watch handoff | G1 |
| 8 | Tue 13 Oct | Why This Made The Playlist | IG single, FB post | From the handoff; fallback ready | |
| 9 | Wed 14 Oct | Evidence: why we are building this | IG carousel, FB post | Ready | |
| 10 | Thu 15 Oct | What Did We Come Here To Find? | IG carousel, FB post | Ready | |

**After Day 10, the weekly rhythm (not another campaign).**

| Day | Slot |
| --- | --- |
| Monday | THIS WEEK'S PLAYLIST, from the approved Safe Watch handoff, plus the email |
| Tuesday | WHY THIS MADE THE PLAYLIST, one editorial decision from the same handoff |
| Wednesday | WHY I BUILT THIS, the next founder chapter (lockdown from 21 October) |
| Thursday | Research, or one thing we checked, or I tried it as a dad |
| Saturday | Parent question on Facebook, request board in Stories |

---

### The posts, Day 1 to Day 10, in full

**DAY 1. Why I Built This, chapter 1: the founder letter.** Carousel,
seven slides, text only, `decks/series-01-why-i-built-this-ch1.json`. Plain
text letters were the best scoring format in the 1 October creative audit,
so this is not a lesser version of the video.

1. Justin, dad of three. I was never worried about the first video.
2. YouTube has extraordinary things on it for children. I still think that.
   My three have learned real things from it.
3. Then a video about relationships turned up in the recommendations. I
   hadn't gone looking for it. The recommendations brought it.
4. A parent chooses the first video. Who chooses the next one?
5. I watched my children go from one video to the next in ways I could never
   have guessed. And I saw how little say a parent has over where a run of
   recommended videos ends up.
6. That question is why I built The Social Billboard.
7. What does your child usually watch after the video you chose? Tell me in
   the comments. I read every one. Justin

Slide 6 still trails "next chapter: an ordinary lockdown afternoon"; that
chapter runs from 21 October, so the line stays true.

Instagram caption:

> I was never worried about the first video.
>
> YouTube has extraordinary things on it for children. My three have learned
> real things from it, and I still think that.
>
> Then a video about relationships turned up in the recommendations. I hadn't
> gone looking for it. The recommendations brought it.
>
> A parent chooses the first video. Who chooses the next one? That question
> is why I built The Social Billboard.
>
> What does your child usually watch after the video you chose?
>
> Justin

Facebook (add a real photo of you if you have one; text alone is fine):

> I'm Justin, and I built The Social Billboard. I want to tell you why, a bit
> at a time, because it didn't start with an app. It started with a question.
>
> YouTube has extraordinary things on it for children. My three have learned
> real things from it. I've never thought the answer was to switch it off.
>
> But a few years ago a video about relationships turned up in the
> recommendations. I hadn't gone looking for it. The recommendations brought
> it. And it made me see that as a parent I chose the first video, and had
> very little say over the next one, or the one after that.
>
> That question is the whole reason The Social Billboard exists.
>
> When your child finishes the video you chose, what usually comes on next?

**When you film it:** the 40 second version of the same words, as a Reel,
is in `renders/reel-covers/` with its cover. Post it as an extra, any day.

**DAY 2. The First Video Wasn't The Problem.** Carousel, eight slides,
`decks/series-02-the-next-video-01.json`.

1. The first video wasn't the problem.
2. You chose that one.
3. When it ends, YouTube already has suggestions for the next one. Suggested
   by the app. Not by you.
4. Then the next. Then the next.
5. In one US study of children aged 3 to 5, extra videos that played by
   themselves after their playlist ended meant longer viewing, and more
   parents having to step in. (Hiniker and colleagues, 2018. 24 families,
   three weeks. One small study.)
6. So we built it the other way round. You choose it all: age, subject, tone,
   time of day, how long.
7. You see every video first. About five videos, built around your choices.
   No Shorts.
8. Choose the next video back. GET A FREE PLAYLIST. One child profile. No
   card needed. Link in bio.

Instagram caption:

> The first video wasn't the problem. You chose that one.
>
> When it ends, YouTube already has suggestions for the next one. Suggested
> by the app, not by you. Then the next. Then the next.
>
> So we built it the other way round. You choose the age, the subject, the
> tone, the time of day and how long, and you see every video before they
> press play. No Shorts.
>
> Get a free playlist: link in bio. One child profile, no card needed.
>
> Send this to the parent who always says "just one more".

Facebook:

> Most of the time we choose the first video our children watch. It's the
> next one, and the one after that, that we don't choose.
>
> I'm not saying YouTube is the enemy. My kids have learned real things from
> it. But the suggestions for what comes next are made by the app, not by us.
>
> So with The Social Billboard we've tried to put the next video back in a
> parent's hands. You set the age, the subject, the tone, the time of day and
> the length, and you see the playlist before they press play.
>
> In your house, is it the first video or the next one that causes the
> trouble?
>
> Get a free playlist: https://thesocialbillboard.com/safe-youtube-for-kids

**DAY 3. So I Started Choosing It Myself.** Carousel, seven slides,
`decks/series-07-why-i-built-this-choosing-it-myself.json`. Text only; add a
real photo of you at the laptop to the Facebook version if you have one.

1. So I started choosing it myself.
2. I'd find videos I thought were right and line them up myself.
3. It took ages. It was hard to keep up. And it didn't fix the real problem.
4. The next video still wasn't mine to choose.
5. So I had it built properly. With developers. Explaining what was in my
   head until someone else could build it.
6. That became The Social Billboard. You choose the age, the subject, the
   tone, the time of day and how long. We build the playlist around it.
7. Tomorrow: the real thing, on my phone. What would you want it to find
   first for your child? Justin

Caption (IG and FB):

> After that video, I did what a lot of parents do. I started choosing them
> myself.
>
> I'd find videos I thought were right and line them up. It took ages, it was
> hard to keep up, and the next video still wasn't mine to choose.
>
> So I had it built properly, with developers. That became The Social
> Billboard.
>
> Tomorrow I'll show you the real thing on my phone. What would you want it
> to find first for your child?

Confirm before it goes: that the first version was built with developers
(the source says so; you know the detail).

**DAY 4. How it works: the real screens.** Carousel, six slides,
`decks/series-11-how-it-works-real-screens.json`, built from the real
builder screenshots already on file.

1. Here's how it works. The real screens.
2. Step 1: choose the type and the tone. (real screenshot)
3. Step 2: choose when, and how long. (real screenshot)
4. Step 3: bedtime is its own setting. (real screenshot)
5. Step 4: then you see the playlist before they press play. (**needs one
   new screenshot from your phone: the space playlist, or any real one**)
6. Your first playlist is free. One child profile. No card needed. GET A
   FREE PLAYLIST.

Caption (IG and FB):

> Here's how it works, on the real screens.
>
> You choose the type of video and the tone. You choose when it's for and
> how long it runs. Bedtime is its own setting. Then you see the whole
> playlist before your child presses play.
>
> Your first playlist is free, with one child profile and no card needed.
> Get a free playlist: link in bio. Then tell me the one thing you'd change.

Facebook adds the link:
https://thesocialbillboard.com/safe-youtube-for-kids

If Space is approved, the Space Stories (hero card, link sticker, "Look up
tonight") go up the same evening.

**When you film it:** the 30 second Reel from the 30 September plan, Post 2
("Show it working"), stays the script.

**DAY 5. Free playlist invitation.** Single image,
`decks/series-08-free-playlist-invitation.json` ("Your first playlist is
free. One child profile. No card needed. You see every video first. GET A
FREE PLAYLIST"). Pin it on both.

Facebook (kept from the 30 September plan, Post 1, CTA updated):

> I've built The Social Billboard for parents who want more say in what their
> children watch.
>
> You choose the age band, tone, type of content, time of day and playlist
> length. We build a playlist around those choices. You can also choose from
> our hand picked Discovery playlists, matched to your child's age band.
>
> Your first playlist is free, with one child profile and no card needed.
>
> I'd love you to try it and tell me honestly: was it easy to set up, did the
> videos fit what you wanted, and what would you change? Your judgement about
> what suits your child still matters most.
>
> Get a free playlist: https://thesocialbillboard.com/safe-youtube-for-kids
>
> Justin

Instagram caption:

> Your choices. A playlist to match.
>
> Choose the age band, tone, type, time of day and length, and see every
> video before they press play. Or pick a hand picked Discovery playlist for
> their age.
>
> Your first playlist is free. One child profile. No card needed. Link in
> bio. Then tell me what fitted and what didn't.

**DAY 6. Parent request and question.**

Facebook:

> A question for parents, and I'm genuinely asking.
>
> When your child asks for YouTube, what do they actually ask to watch?
>
> Not what you'd like them to watch. What they ask for. A channel, a game, a
> subject, a song.
>
> I read every answer, and the most asked for subjects will shape what we put
> together next. Please leave out names and schools.

Instagram Story: `decks/series-06-parent-request-board-01.json` (marked as
examples, not real requests), then a question sticker: "Your child's age and
one subject". Every real answer goes into the request bank the same day. No
counts are shown until there are real ones.

**DAY 7. This Week's Playlist.** Made from Thursday's Safe Watch handoff,
once its status says APPROVED, with the same six slide layout as
`decks/series-04-this-weeks-playlist-space.json`: hero with the age chip,
videos and minutes, and an ENDS WITH line; what's in it; why this length;
the editorial reason; what we checked, honestly; GET A FREE PLAYLIST. Not
written in advance, because the playlist does not exist yet.

**DAY 8. Why This Made The Playlist.** One editorial decision from the same
handoff (why it ends where it ends, why this length, why this age). Single
image in the WHY THIS MADE THE PLAYLIST masthead.

Fallback, ready now (`decks/series-09-why-this-made-the-playlist-shorts.json`):

> Why didn't we include Shorts?
>
> Not because every short video is bad. Some are brilliant.
>
> Because a playlist is meant to be a session with a beginning and an end,
> and a run of thirty second clips is neither. Our rule is no Shorts, and for
> most ages we prefer videos of six minutes or more.
>
> Would you want no Shorts at all, or a separate short mode you control?

**DAY 9. Evidence: why we are building this.** Carousel, seven slides,
`decks/series-10-the-next-video-02-research.json`.

1. Does the next video really matter?
2. What happened: researchers gave 24 families a video app for three weeks
   and changed one thing, what happened when the playlist ended.
3. What they found: when extra videos played by themselves, children aged 3
   to 5 watched for longer. Fewer moved on to what they'd planned next, and
   more parents had to step in.
4. What it can tell us: how a video ends can change what a child does next.
5. What it can't: it's one small study, with young children in the US. It
   says nothing about older children, or about harm.
6. Why it matters to a parent: the ending is something you can choose.
7. What we do differently: a playlist you see first, sized to the age. GET A
   FREE PLAYLIST.

Caption: "Does the next video really matter? One small study suggests the
ending does. Hiniker, Heung, Hong and Kientz, CHI 2018: 24 US families,
children aged 3 to 5, three weeks. The reference is in the comments."

First comment: "Hiniker A, Heung S, Hong S, Kientz JA (2018). Coco's Videos:
an empirical investigation of video player design features and children's
media use. CHI 2018. doi.org/10.1145/3173574.3173828"

Checked against the paper on 5 October: the study had 24 families with
children aged 3 to 5; extra autoplayed videos after the playlist meant more
viewing, fewer children making their planned transition and more parent
intervention; locking the app did not reduce viewing. Every line above stays
inside that.

**DAY 10. What Did We Come Here To Find?** Carousel, seven slides,
`decks/series-03-come-here-to-find-01.json`: the question, then Space, Age 9,
20 minutes building up as chips, then the real criteria screen, then GET A
FREE PLAYLIST.

Caption (IG and FB):

> What did we come here to find?
>
> Space. Age 9. Twenty minutes.
>
> That's enough to start making a better choice. You set it, you see the
> playlist, then they press play.
>
> Get a free playlist: link in bio. One child profile, no card needed.

**I Tried It As A Dad moves to the first week you film.** The shot list is
kept here for then:

1. Your face: "I've got twenty minutes and one of mine wants space. Let's see
   what this gives me."
2. Open the page and sign in (blur the email).
3. Choose the age band, saying it out loud.
4. Content type, tone, time of day, 20 minutes.
5. The wait: if it takes a while, a caption that says so.
6. The playlist appears. Scroll it. Read two titles.
7. Play the first for two seconds, then go to the end of the last video and
   show what happens.
8. Your face: "That's it. First one's free, no card. Tell me what you'd
   change."

Step 7 is also the G2 test: "When it ends, it ends" unlocks only once it
shows the session ending cleanly. You can do step 7 alone, as a screen
recording with no face, at any point.

---

## 6. Current week's playlist

**Space for curious 9 to 11 year olds**, week of 5 October. Five videos,
about 40 minutes (40:39), after school, for World Space Week. Ends with a
stargazing guide on purpose; the Draconids peak on Friday 9 October, best
just after dark. Channels include Royal Observatory Greenwich, the National
Space Centre and Maddie Moate.

**Status: PENDING.** `LATEST - status.md` has not been changed to APPROVED.

**Honest limits, from the handoff:** every video opened and checked this
week; the four channels are new, so they had the bounded check, not the full
panel; four of five have open YouTube comments; one video has a flame
experiment captioned for professionals only.

**Where it stands.** Not posted anywhere. Justin confirmed on 5 October the
Facebook post is not live (the posting tracker's POSTED line is wrong). The
draft in "1 To post" still carries the "nine checks" paragraph, so post the
corrected version below instead, once the playlist is APPROVED and the phone
test passes. Instagram runs Space as Stories only on Friday 9 October (hero
card, link sticker, "Look up tonight"). The meteor line expires after Friday
night; World Space Week ends Saturday 10 October.

**The corrected Facebook post, ready to paste.** Image: the Space card,
`tools/tsb-playlist-card/decks/space-9-to-11.json` (landscape).

> It's World Space Week, and on Friday night the Draconid meteor shower
> peaks. It's one of the few that's best in the early evening rather than the
> small hours, so primary age children can actually stay up for it.
>
> So this week's free playlist on The Social Billboard is space for 9 to 11
> year olds. Five videos, about forty minutes: eight planets in eight
> experiments, the Moon, a tour of the space station with Tim Peake, how a
> space telescope gets tested before launch, and a beginner's guide to
> stargazing. That last one is deliberate. The playlist is built to end with
> them going outside.
>
> Here's the check behind this one. Every video was opened this week: we
> confirmed it plays in the UK, who made it, how long it runs and what's in
> it. These channels are new to us, so they've had our shorter check rather
> than our full panel, and I'd rather tell you that than imply more. Four of
> the five have open comments on YouTube, which is one more reason to watch
> from the playlist.
>
> Why five videos and forty minutes? The UK Chief Medical Officers say the
> research isn't strong enough to set a screen time limit at this age. So we
> build one finite session, sized to the age, that you can see before they
> press play.
>
> Your first playlist is free, with one child profile and no card needed. Try
> it and tell me honestly what you'd change. Your judgement about what suits
> your child still matters most.
>
> Get a free playlist: https://thesocialbillboard.com/safe-youtube-for-kids
>
> Justin, founder of The Social Billboard

Changed from the draft: the nine checks paragraph (overclaim), "no autoplay"
(waits for the phone test), and the RCPCH line (reworded to what the source
says).

**Age band question.** The site sells 3 to 6, 7 to 10, 11 to 14 and 15 to
16; Safe Watch uses 9 to 11. A parent of a nine year old needs to know which
shelf to open. Tell me and the posts will say it.

---

## 7. Posts READY

Ready means the words and the image exist and only need your yes.

| Day | Post | Files |
| --- | --- | --- |
| 1 | Why I Built This, chapter 1, the letter | `decks/series-01-...json`, rendered |
| 2 | The First Video Wasn't The Problem | `decks/series-02-...json`, rendered |
| 3 | So I Started Choosing It Myself | `decks/series-07-...json`, rendered |
| 4 | How it works: the real screens | `decks/series-11-...json`, rendered; one screenshot to add |
| 5 | Free playlist invitation | `decks/series-08-...json`, rendered |
| 6 | Parent question and request board | copy above; `decks/series-06-...json`, rendered |
| 8 | Fallback: Why no Shorts? | `decks/series-09-...json`, rendered |
| 9 | Evidence: does the next video matter? | `decks/series-10-...json`, rendered |
| 10 | What Did We Come Here To Find? | `decks/series-03-...json`, rendered |
| Space | Corrected Facebook post | section 6, once the playlist is approved |

## 8. Posts NEEDING JUSTIN

| Day | Post | What is needed |
| --- | --- | --- |
| 1 to 3 | The three founder posts | Read them and say yes; confirm "built with developers" |
| 4 | How it works | One phone screenshot of a real playlist |
| 5 | Free playlist invitation | Check the free button reaches sign up, and the bio link |
| 7 | This Week's Playlist | Approve Thursday's Safe Watch handoff |
| 8 | Why This Made The Playlist | Comes from that handoff |
| Space | Playlist | PENDING to APPROVED, or tell me no |
| Later | Origin video, product Reel, I Tried It As A Dad | The first week you film. Not before. |

## 9. Posts PUBLISHED

None. Justin confirmed on 5 October that the Space Facebook post is not live,
so the posting tracker's POSTED line is wrong. No other Social Billboard post
is recorded as published in any document reviewed; if SB 001 or a START
HERE post went out, tell me and it moves here.

## 10. Performance and results

**None recorded.** The Creative Learning Register and the Content
Intelligence sheet hold no measured results for any Social Billboard post.
Every field is MISSING, not zero.

**What gets recorded, for each post, at 48 hours and 7 days:** reach, saves,
sends, comments, useful replies, profile visits, link clicks, sign ups,
activated parents, subject requests. Into the existing
`SB_Creative_Learning_Register.csv`, one row per post ID.

**After Day 10, one rule:** keep what earns sign ups or useful replies, drop
what only earns likes.

## 11. What to do TODAY (Monday 5 October)

1. Approve the Space playlist, or say no.
2. Day 0 audit on your phone: does GET A FREE PLAYLIST reach sign up; does
   the Instagram bio link go to the playlist page; does
   /transparency/parents load.
3. If Space is approved and the route works, post the corrected Space
   Facebook post (section 6).
4. Read Days 1 to 3 and say yes or change them. No filming needed this week.

## 12. What can WAIT

- Creator posts, the creator bridge, the claim journey and the creator tools
  reveal.
- Any paid test, including the £10 a day plan.
- The full checking framework post and the parent transparency page link.
- "When it ends, it ends" and "nothing autoplays" claims, until the ending is screen recorded.
- All three video pieces, until the first week you film.
- The lockdown founder chapter (week of 19 October) and the "how I build
  now" chapter (November, once).
- The age shelf carousel, the "send this to the parent who" deck, and the
  YouTube four video engine.
- The two scheduled tasks for drafting each week's pack and the 48 hour
  numbers: proposed, not created.

---

## 13. Existing material, classified

| Material | Verdict | Why |
| --- | --- | --- |
| START HERE, 16 Sep (parent first, creators later) | KEEP | The rule this whole document follows. |
| START HERE post 1, "Finding the good parts" | MERGE | Its line feeds Day 3. |
| START HERE post 2, "What did we come here to find?" | KEEP | A weekly format after Day 10. |
| START HERE post 3, request a subject | MERGE | Day 6. |
| START HERE post 4, what checked means | HOLD | Until the framework wording is confirmed (G3). |
| START HERE post 6, why we built playlists | MERGE | Days 2 and 3. |
| START HERE post 7, building in public | KEEP | A founder chapter after Day 10. |
| START HERE posts 5, 8, 9, 10 (creators, flywheel) | HOLD | Creators wait. |
| START HERE image ideas and screenshot list | UPDATE | Kept as a shot list, made as real photos and real screens, never generated people or fake screens. |
| Founder context, 1 Oct (repo) | KEEP | The approved founder source. |
| Founding story (family canon) | KEEP | Source for the lockdown chapter, after the family account runs it. |
| 2025 script "Why I Quit Guessing" | RETIRE as a script | It led with creators and "AI powered". Its age rating question is kept for a later chapter. |
| Soft Launch 7 Day Plan, 10 Sep | MERGE | "Who chooses the next video" became Day 2; no Shorts became Day 8's fallback; requests became Day 6. |
| Weekly Watch and Digital Guide, 15 modules | UPDATE | Cut to three: this week's playlist, why it made the playlist, request a subject. |
| Founding parent test group form | HOLD | A product change. |
| SB 001, brand safety and Meta ads (10 Sep) | RETIRE for the parent launch | A brand and creator story. |
| Parent Launch Plan, 30 Sep: offer, claim limits, three fixes, feedback questions | KEEP | The claim limits in section 1 come from it. |
| 30 Sep Post 1, the launch invitation | KEEP | Day 5, CTA updated. |
| 30 Sep Post 2, show it working | KEEP | Day 4. |
| 30 Sep Post 3, two ways to begin | MERGE | Into Day 5's caption. |
| 30 Sep Post 4, next theme request | MERGE | Day 6. |
| 30 Sep Post 5, what checked means | HOLD | G3. |
| 30 Sep fourteen day sequence | RETIRE | Replaced by Day 0 to 10. |
| 30 Sep £10 a day test | HOLD | After Day 10 and a post that moved sign ups. |
| Instagram carousels plan, 1 Oct, carousel 1 "She asked for one episode" | HOLD | Strong, but its "when it ends" slides need G2. After Day 10. |
| Carousel 2, "Send this to the parent who" | HOLD | After the founder has been met. |
| Carousel 3, age shelves | HOLD | Needs the age band answer. |
| Carousel 4, what checked means | HOLD | G3. |
| Carousel 5, weekly playlist | UPDATE | Now the This Week's Playlist layout (Day 7). |
| Carousel 6, five decisions | MERGE | Days 2 and 4. |
| Creative audit and launch set, 1 Oct | KEEP the findings, UPDATE the statics | Nobody sells a session that ends; the founder letter wins. The offer and letter statics now live in Days 1 and 5; the ones saying "it stops" wait for G2. |
| Weekly playlist card tool | KEEP, extended | The series layer and Reel covers were added on 5 Oct. |
| Marketing master plan, 1 Oct | KEEP for the business plan | Its Social Billboard section is superseded by this document. Justin's LinkedIn playlist post on 12 October stays. YouTube engine HOLD. |
| Launch plan, 30 Sep (GC lanes) | KEEP | The lane rules (SB never on the family account) hold. |
| Control Room, 30 Sep | KEEP | Its playlist row now points here. |
| Content pack, 1 Oct, Part 3 SB posts | MERGE | No Shorts is Day 8's fallback; the checked channels record waits for G3. |
| Content pack, 1 Oct, Part 4 YouTube scripts | HOLD | Until after Day 10. |
| Weekly Safe Watch handoff, prompt and runtime guidance | KEEP | The one input for Days 7 and 8 and every Monday after. |
| Space posts in "1 To post" | UPDATE | Facebook needs the check edit; Instagram becomes Stories on Day 4. |
| Posting tracker (Drive) | UPDATE | It disagrees with the Facebook file. Section 9 here is the record from now on. |
| Swipe Library | KEEP | Reference only. |
| Creative Learning Register | KEEP | The results table (section 10). |
| Content Intelligence sheet | KEEP | Adds a request bank tab when the first real request arrives. |
| Content Agent Build Spec v2, "SB brief needed" | MERGE | Section 1 is that brief. |
| April SB Mailchimp funnel testimonials | RETIRE | Unverified claims. |
| `public/social-billboard-landing.html` in this repo | RETIRE | A static draft that does not match the live site. |
| The strategy draft written earlier today (`plans/2026-10-05-sb-parent-launch-system.md`) | RETIRE | Folded into this document so there is still only one. |

---

## 14. Visual production queue

Priority: real Justin, real product, real playlist, real screenshots.
Generated graphics only for the carousel cards and recurring formats.

| Day | Real (Justin films or captures) | Built here (cards) | Status |
| --- | --- | --- | --- |
| 0 | Phone screenshots: sign up screen, bio link, playlist page | | Justin |
| 1 | | Seven slide letter carousel | Rendered |
| 2 | | Eight slide carousel | Rendered |
| 3 | A photo of you at the laptop, optional | Seven slide carousel | Rendered |
| 4 | One phone screenshot of a real playlist | Six slide real screens carousel; Space Story card | Rendered; one screenshot to add |
| 5 | | Offer card | Rendered |
| 6 | | Request board Story card | Rendered |
| 7 | Screenshot of the new playlist in Discover | Six slide carousel from the handoff; theme background made without text | Waits for Thursday's handoff |
| 8 | | Single card | Fallback rendered |
| 9 | | Seven slide research carousel | Rendered |
| 10 | | Seven slide carousel with the real criteria screen | Rendered |
| Later | Origin video, product Reel, I Tried It As A Dad | Reel covers | Rendered; filming the first week you choose |

Render everything with `node tools/tsb-playlist-card/render.mjs`; fresh PNGs
and alt text land in `tools/tsb-playlist-card/out/`. The launch set is copied into `content/packs/2026-10-05-sb-launch-control/renders/` so it can be opened from GitHub.
