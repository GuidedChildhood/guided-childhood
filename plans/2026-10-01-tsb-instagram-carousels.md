# The Social Billboard: Instagram carousels that sell the free playlist

1 October 2026. Prepared for Justin. Companion to the parent launch plan of
30 September (Drive, 02 The Social Billboard, Content Engine) and the weekly
content sheet for 1 to 11 October. This adds a carousel system; it does not
replace Posts 1 to 5, which stay as planned.

## What a carousel is for here

One job: a parent who has tried YouTube Kids, blocking and filters swipes to
the last slide and taps the bio link to create a free playlist. Saves and
shares are the signals that tell Instagram to show it to more parents like
them, so every carousel is built to be saved (a thing worth keeping) or sent
to another parent (a thing worth forwarding), never just liked.

## The rules every carousel obeys

From the launch plan's claim boundaries and this repo's copy rules:

- Say "playlists built around the choices you make" and "no personalised
  recommendation feed", not "no algorithm" and never "100% safe".
- "Nothing autoplays that you did not choose" and "when it ends, it ends" are
  the site's own claims. Confirm the player behaves that way on a phone
  before either goes in a paid ad.
- No frightening statistic. The Ofcom numbers on the site are about 11 to 17
  year olds; they do not go on a carousel aimed at parents of a six year old.
- Never require a comment, a tag or a share to get the free playlist. Meta
  treats that as engagement bait. A comment keyword can be offered as a
  convenience ("comment PLAYLIST and I will send the link") but the link in
  bio always works too.
- No child's face, no stock children, no fake parent quotes. Real screens of
  the real product, Justin's real desk, or our own flat artwork.
- No dashes anywhere in the copy. "9 to 11", not "9–11".
- Every carousel ends on the same slide: first playlist free, one child
  profile, no card needed, link in bio.

## What the research found (1 October 2026)

Read live on Instagram and from the carousel studies. Full source list at the
end.

- **Dr Becky (Good Inside, 3.5m followers)** opens with a line a parent
  actually said, then "what is really going on", then "here is what you can
  say". Her best carousel last week took 9,100 shares. She never sells the
  $28 a month membership on a slide; she sells the free thing, and rotates
  three endings: a free programme, "Comment PODCAST and I will send the link",
  and link in bio.
- **Duolingo (5.3m)** builds decks where every slide is "send this to the
  person who..." (61,000 likes, 93,000 comments on the latest). It never
  mentions the paid tier on social; the app does that. The mascot carries the
  affection between posts.
- **Headspace (1.4m)** posts pretty quote cards and gets around 700 likes a
  post, about 0.05 per cent. Comfort without a specific scene reads as
  corporate. A warning, not a model.
- **Finch and Yoto** sell relief for the parent in practical terms ("Is
  bedtime a battle?"), never a philosophy, and give the product a face.
- **The numbers.** Socialinsider's study of three million carousels:
  engagement dips after slide three, climbs from slide eight, peaks at ten,
  and only six per cent of brands use all ten. Sends to a friend are the
  signal Instagram weights most (Mosseri, 2025, reconfirmed 2026). Comment
  to DM beats link in bio on every benchmark, though all of that data comes
  from automation vendors, so treat it as a test, not a fact.

## What we take, and what we leave

Weighed against the launch plan and our own rules, as the feedback filter
asks.

| Point from the research | Verdict | Why |
|---|---|---|
| Open with the parent's exact scene, in their words | Adopt | It is our own copy rule already. The site's best lines are scenes. |
| Build slides to be sent to one named parent | Adopt | Sends are the heaviest ranking signal and the ask is honest. "Send this to the parent who does the bedtime shift" is specific; "share with five friends" is bait. |
| Sell the free thing, never the price | Adopt | Matches the launch plan. Parent Pro stays off the feed. |
| Eight to ten slides, one idea each, big plain text | Adopt | The system already exists (black, white, yellow, Montserrat). The words do the work. |
| Comment keyword to get the link | Adapt | Offer it as a convenience on alternate carousels, never as the only route. The launch plan says never gate the free access. Justin can reply by hand at this scale; no ManyChat yet. |
| A mascot to carry affection (Duo, the Finch bird) | Decline for now | DiGi belongs to Guided Childhood, which is a separate company and brand. The Social Billboard does not have a character, and inventing one for Instagram would be a brand decision, not a content one. Justin's own face does this job at launch. |
| Quote card carousels | Decline | Headspace shows what happens. |
| A frightening statistic as the hook | Decline | The launch plan rules it out, and the scene is stronger anyway. |

## The six carousels

All 1080 x 1350, in the SB system. Rendered from
`tools/tsb-playlist-card/decks/*.json` with
`node tools/tsb-playlist-card/render.mjs`. Slide ten is always the free
offer. Captions carry the story again in plain text, because the caption is
what gets read aloud when a parent sends the post.

### 1. "She asked for one episode." The scene carousel (run first)

The Good Inside formula: the scene, what is really going on, what you can do.
Built and rendered in `decks/carousel-01-one-episode.json`.

1. She asked for one episode. That was forty minutes ago.
2. You did not say yes to forty minutes. Nobody did.
3. The video ended. Something else started. Then something else. That is the design, not your child.
4. Blocking is a treadmill. Block a channel and it comes back under another name.
5. Filters let things through. The worst moments happen inside the app you installed to keep them safe.
6. The problem was never your child's willpower. It is what the feed puts in front of them.
7. So we built it the other way round. You set the age, the tone, the type, the time of day and the length. We build the playlist to match.
8. When it ends, it ends. No up next. No Shorts. No comments. Nothing autoplays that you did not choose.
9. Twenty minutes means twenty minutes. The ending is built in, so you do not have to be the ending.
10. Create your first playlist, free. One child profile. No card needed. Link in bio.

Caption: the ten lines as ten short paragraphs, then "Send this to the parent
who does the bedtime shift." Routing: link in bio. Measure: sends, saves,
sign ups in the tracker.

### 2. "Send this to the parent who..." The Duolingo deck

Every slide is one parent, named by the thing they have lived. Warm, not
mocking. Nine parents, then the offer.

1. Send this to the parent who has blocked the same channel four times.
2. Send this to the parent who found out what their kid watches from another parent.
3. Send this to the parent whose "five more minutes" is now a negotiation with a lawyer.
4. Send this to the parent who turned on YouTube Kids and still ended up somewhere weird.
5. Send this to the parent who knows the words to a song they have never chosen.
6. Send this to the parent who has said "where did you even see that?" this week.
7. Send this to the parent who checks the tablet after bedtime.
8. Send this to the parent who just wants the video to stop when it ends.
9. Send this to yourself, honestly.
10. We built it for all of you. Create your first playlist, free. No card needed. Link in bio.

Caption: "Tag nobody. Just send it to the one who needs it." Routing: link in
bio. This is the deck most likely to travel; post it second, once the first
has shown which lines parents quote back.

### 3. "A five year old and a thirteen year old do not get the same shelf." The age band carousel

One slide per band, with real Discovery playlist names from the site. Only
names that are live on the day; nothing promised.

1. A five year old and a thirteen year old do not get the same shelf.
2. Ages 3 to 6: Calm Bedtime Stories and Wind Downs.
3. Ages 3 to 6: First Numbers, Letters and Sounds.
4. Ages 3 to 6: Gentle Wonder. Animals, Dinosaurs and Space.
5. Ages 11 to 14: Minecraft Builders. Clean gaming.
6. Ages 11 to 14: Real Science and How Things Work.
7. Ages 11 to 14: Make Something. Draw, Code, Build.
8. Add a four year old and a thirteen year old and they get different shelves. The younger one never sees the playlists built for teenagers.
9. Every one of these was put together by a person and checked the same way every time.
10. Pick your child's band. First playlist free. No card needed. Link in bio.

Caption ends: "Send this to a parent with one of each." Routing: offer the
comment keyword here as the test ("Comment SHELF and I will send you the
link for your child's age"), with link in bio still in the caption.

### 4. "What checked actually means." The transparency carousel

Only once the transparency page says the true process (launch plan, Post 5).
One slide per check, in order, no adjectives.

1. What does "checked" actually mean? We should be able to show you.
2. First, the hard gates. Child safety and broadcast standards. A channel that fails one is out, whatever its subscriber count.
3. Then teaching quality. Does it actually explain the thing?
4. Then tone. Calm or energetic, and does it match what you asked for?
5. Then age fit. Not YouTube's tags. Ours.
6. For built playlists, the transcript and details of every candidate video are reviewed for tone, clickbait and age fit.
7. Then we verify the results ourselves.
8. The final call on every Discovery playlist is made by a person, not an engine.
9. If something ever gets through, tell us. We remove it and tighten the check. justin@thesocialbillboard.com
10. That is what checked means here. First playlist free. No card needed. Link in bio.

Caption: the process again in Justin's voice, first person. Routing: link in
bio. This one is for saves, not sends.

### 5. "This week's free playlist." The weekly carousel

The night sky card from today is slide one. Then one slide per video, title
only, no thumbnails, no channel logos. Then the stop. Then the offer.

1. The Space card (1080 x 1080 cropped to 1080 x 1350, or rebuilt at that size).
2 to 6. One video per slide: "Video 1 of 5. [Title]. 7 minutes." Big number, plain title.
7. Approx. 40 minutes. Then it stops. Nothing follows it.
8. Built for ages 9 to 11. Checked by a person.
9. Next week: a new one. Tell us what to curate.
10. Get this playlist free. One child profile. No card needed. Link in bio.

Repeatable every week with a new sky and a new deck JSON. Caption: the five
titles as a list, so a parent can judge it before they tap.

### 6. "Five decisions before they press play." The mechanism carousel

The site's own section, one decision per slide, each with the one line that
explains why it matters to a parent.

1. Five decisions, made by you, before your child ever presses play.
2. Age. The band you set. Nothing outside it is offered.
3. Tone. Calm or energetic. Wind them down, or let them run.
4. Type. Educational or entertainment. Some evenings it matters.
5. Time of day. After school is not bedtime, and the playlist should not be either.
6. Length. Twenty minutes means twenty minutes.
7. Then we build the playlist to match.
8. Not the length of the afternoon. Not what a recommendation engine thinks will hold attention longest.
9. They watch what is in the playlist. Then it stops.
10. Set your five. First playlist free. No card needed. Link in bio.

## Running order and what to measure

- Week of 12 October: carousel 1 (Monday), carousel 2 (Thursday). Both link
  in bio.
- Week of 19 October: carousel 3 with the comment keyword test, carousel 5
  with that week's playlist.
- Week of 26 October: carousel 4 once the transparency page is right,
  carousel 6.
- In the launch tracker, add three columns per carousel: sends, saves, and
  sign ups in the 48 hours after. Sends per reach is the number that tells
  us which deck to repeat. Likes are not.
- After the first two, read the comments for the lines parents quote back
  and put those lines on slide one of the next deck.

## What is needed from Justin

- The real Discovery playlist names on the day carousel 3 goes out.
- A yes or no on the comment keyword test (it means replying to comments by
  hand for a week).
- The five video titles and lengths for each weekly playlist.

## Sources

- Live reads on Instagram, 1 October 2026: @duolingo, @drbeckyatgoodinside, @headspace, @finchcare, @yotoplay.
- Socialinsider's carousel study via Search Engine Journal: https://www.searchenginejournal.com/instagram-carousels/379311/
- Socialinsider Instagram benchmarks, Q2 2026: https://www.socialinsider.io/social-media-benchmarks/instagram
- Mosseri's ranking signals: https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers
- Sends per reach playbook: https://influencermarketinghub.com/instagram-sends-per-reach-playbook/
- Dr Becky's post formula, Romper: https://www.romper.com/parenting/dr-becky-kennedy-good-inside-parenting-advice
- Good Inside revenue, Fortune, 27 February 2026: https://fortune.com/2026/02/27/dr-becky-kennedy-good-inside-revenue-leadership-playbook-for-parenting-34-million-a-year-business/
- Duolingo social strategy, Brand24: https://brand24.com/blog/duolingo-social-media-strategy/
- Zaria Parvez on the comment section as the brief: https://sproutsocial.substack.com/p/lessons-from-zaria-parvez
- Bio link vs DM benchmarks (vendor data): https://creatorflow.so/blog/bio-link-vs-dm-automation-affiliate-clicks/
- Yoto paid creative hooks: https://motionapp.com/library/yoto
- Finch growth: https://blog.sparrowapps.io/p/finch-how-a-self-care-app-hit-30m-arr-without-vc-money
