# 03 · Who chose the next one?

| | |
|---|---|
| Run | Playlists, 1 of 3 |
| Service | The Social Billboard: the next video problem |
| Format | One card, 1080 by 1350. **Built** |
| Channels | The Social Billboard Instagram and Facebook |
| Proposed | Sunday 22 November, 10:00 |
| Free step | The first playlist: `thesocialbillboard.com/safe-youtube-for-kids` |
| Files | `built/03-playlists-who-chose-the-next-one/`, deck at `tools/tsb-playlist-card/decks/walkthrough-01-who-chose-the-next-one.json` |

## Hook

> You chose the first video. Who chose the next one?

## The card

- Masthead: How it works · 1 of 3
- Big line: You chose the first video. Who chose the next one?
- Under it: Pick five things. See every video before they press play. No card needed.
- Chips, the builder's own choices: Age 7 to 10, Calm, Educational, Bedtime, 20 min
- Pill: Get a free playlist
- Foot: thesocialbillboard.com

23 words, inside the 25 word budget for a single image. Chips are labels and are not counted.

## Caption, Instagram

You chose the first video. That one was fine.

The trouble starts when it ends, because the next one was suggested by the
app and not by you.

So I built it the other way round. You pick five things: their age, the tone,
the type, the time of day and how long. It builds a playlist of about five
videos to match, and you see every one before they press play.

Your first playlist is free. One child profile. No card needed. The link is
in the bio.

This is 1 of 3 on how it works.

What's your child into right now? The next playlist could start there.

#youtubekids #screentime #parentinguk

## Caption, Facebook

You chose the first video. That one was fine.

The trouble starts when it ends, because the next one was suggested by the
app and not by you. I watched that happen in my own house, and it is why I
built The Social Billboard.

You pick five things: their age, the tone, the type, the time of day and how
long. It builds a playlist of about five videos to match, and you see every
one before they press play.

Your first playlist is free. One child profile, no card needed:
https://thesocialbillboard.com/safe-youtube-for-kids?utm_source=facebook&utm_medium=social&utm_campaign=walkthrough&utm_content=t1

What's your child into right now? The next playlist could start there.

Justin

## Visual brief

- Near black ground, white Montserrat, the one yellow `#FFD100` on "Who chose
  the next one?" and on the pill. Nothing else in colour.
- The series masthead and the session bar from the template, so it sits with
  the rest of the account.
- No DiGi, no stars, no cream, no Guided Childhood name.

## Proof

- The five choices and "You see every video before they press play": the live sign up page, read 10 November.
- "Your first playlist is free", one child profile, no card: the live pricing block (Free, £0, "One playlist, minimum five videos. One child profile.").
- The buttons work: the page's "Create your first playlist" goes to `/auth/sign-up?role=parent`, and a cold load shows "Get your first playlist free".

## Checks

- None of the words the playlists rules ban: safe, guaranteed, 100%, no algorithm, vetted by experts.
- "When it ends, it ends" and "nothing autoplays" are on the live page but the launch plan holds them until Justin has tested on a phone. This card does not use them.
- The founder scene (the recommendation in his own house) is the one the founder journey uses in its post 6. It is one sentence here, on the Facebook version only. Cut it if the two land too close.
- `node tools/tsb-playlist-card/check-words.mjs` passes.
- The card tool draws its yellow as `#FFCE1B`. The live site's accent is `#FFD100`. The difference is small and it is the tool's, not this deck's, so it is left for whoever owns the tool.
