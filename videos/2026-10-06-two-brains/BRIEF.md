# Two brains, one clock

6 October 2026. Asked for by Justin: first show a child and her brain, the
real science of what happens when the screen goes on at 9pm, simple and
exact, then on the other side of the same timeline what DiGi gives the parent
at the same minutes, as an example of the difference from being left to
natural watching. Text big enough and held long enough to read.

workflow: faceless-explainer
destination: LinkedIn, YouTube, the DiGi page. 16:9 first. Can run alone or
as the opening of `videos/2026-10-01-how-digi-works`.
length: 85 seconds, seven beats

## The readability rule (Justin, 6 October 2026)

Set in `beats.json` and enforced by `build.mjs`:
- Headline 58 px, body 36 px at 1920 wide. Nothing on screen smaller than the
  21 px mono source line.
- Headline ten words or fewer, body twenty or fewer. The build refuses more.
- Each beat is held for (left words + right words) / 3.6 seconds plus 1.5,
  never under seven seconds. The right card arrives after the left has had
  most of its reading time, so the clock reads in order.
- Cards fade in whole. No word by word entrances, which slow reading.
- No dashes anywhere. The build refuses a dash.

## The science on the left, and its grade

Every line was researched from primary sources on 6 October and then run
through the citation verifier (`plans/2026-10-06-two-brains-research.md`).
Six confirmed, two corrected before the build, none demoted.

| Clock | Line | Source | Grade |
|---|---|---|---|
| 9:00 | Her eyes lock on. That is a reflex. Cuts and sound changes pull a young child's attention automatically. | Lang 2000, Journal of Communication. Anderson and Levin 1976, Child Development | Likely (paywalled, adult and preschool samples) |
| 9:02 | Each clip is a new guess at what comes next. Dopamine drives the wanting, not the pleasure. Up next never offers her the end. | Schultz 2016. Berridge and Robinson 2016. Hiniker and others 2018, CHI | Verified |
| 9:20 | She cannot stop by herself yet. Stopping needs the front of the brain, years from ready at six. | Diamond 2013. Casey and others 2005 | Verified |
| 10:10 | Evening light hits a child's melatonin hard. Even dim room light cut preschoolers' melatonin by about three quarters. | Hartstein and others 2022, Journal of Pineal Research | Verified (5 to 40 lux, ages 3 to 5) |
| 7:30 | A late, irregular bedtime shows up the next day. In 10,000 UK children, regular bedtimes meant better behaviour at seven. | Kelly, Kelly and Sacker 2013, Pediatrics | Verified |

Age caveat: every child sample is 0 to 5, so "six" is the nearest age the
evidence reaches, not inside it. Lines we refused because the evidence does
not support them: a dopamine hit like a drug, addicted, rewires her brain,
the TV's blue light switches off melatonin, a two minute warning fixes it.

## DiGi on the right

The answer lines follow DiGi's voice rules and scenario EB-01 (the timer, the
deal, structure not minutes, relationship before rule). "The ending is built
in" cites Hiniker 2016 as corrected by the verifier: children were less upset
when screen time was routine and when the technology ended it rather than a
parent. Tomorrow's plan cites Mindell 2015 and the AAP 2016 hour before bed.
The morning card asks "did it work" and never claims the child slept.

## Pictures

Five Seedance 2.5 drafts at 480p, 1:1, slowed to half speed so each beat
holds; the pyjamas moment is the brain film's clip cropped to the column. All
original cartoon characters in the same toy world, no real child, no text in
the clips. DiGi from the reference art. One clip was refused for IP and
reworded. 90 credits spent.

## Sound (7 October)

Justin approved the draft and asked for sound, ideally something that could
travel. Two layers, both ours, declared in `beats.json` and written by the
build:

- **Score.** One 90 second original piece (Sonilo): felt piano, a slow
  heartbeat pulse, light strings, tender and slightly uneasy at the start,
  warmer from the middle, calm by the morning. Fades in over two seconds,
  dips under the morning beat so the birdsong reads, fades out at the end.
- **Effects.** The TV clicking on (9:00), the countdown blips and the whoosh
  of the next clip (9:02), the clock ticking (9:20), birdsong and a spoon on
  a bowl (7:30), and a soft two note chime each time a DiGi card lands.

No voice yet; the film reads silent and the music carries it. Why not a
trending sound: the TikTok library needs a connected TikTok account
(none is connected), trending audio on LinkedIn and YouTube is a licensing
problem, and the research this week says original beats reposted. The
vertical cut can take a trending sound at publish time inside TikTok itself,
where the licence is TikTok's.

## The v3 treatment (7 October, Justin: "more cinematic, Nate Herk style")

What was borrowed from that editing style, in our palette: a punch zoom into
the part of the picture the caption is about; a translucent highlight shape
over it (coral on the feed side, butter on the DiGi side, never pure red)
with a pulsing glow and a pointer down to the caption; a marker swipe over
the key phrase in each headline; the clock pill popping and the divider
drawing in on every time jump; a whoosh on each jump, a low pulse when a
highlight lands, a pen swipe under each marker, a riser into the end card.
All declared per beat in `beats.json` (`hl`, `zoom`, `zoomTo`, `hlAt`,
`mark`) and written by the build.

The score is new: a modern documentary trailer underscore (piano motif over a
slow pulse, string ostinato, drum pulses, a swell around sixty seconds, calm
outro) at `assets/music-cinematic.mp3`. The gentler first score is kept at
`assets/music-tender.mp3`; swapping is one line in `beats.json`.

## The thinking streams (8 October, Justin)

DiGi's side now shows the thinking before the answer. At 9:02 the brain
lifts out of DiGi and five streams of chips fly into it in order, each with
a label: the researchers (Orben and Przybylski, Odgers and Jensen,
Livingstone, Kennedy, Diamond, Hartstein), peer reviewed studies (the five on
the left side of the film), our philosophy (never allow or deny, connection
is the protection, the pathway not the ban, repair over punishment), the
guardrails (safety first, never invent a study, a person approves anything
new, crisis routes to a human), and parents who said what worked, each chip
a circumstance and a result. Then the answer card. At 7:30 the houses clip
runs and the feedback chips fly into the web, followed by two chips for new
studies added by a person, under "A brain that learns".

Honesty rule applied: no number of parents is claimed. The product's loop
exists (digi_outcomes, counts only, never words); the volume does not yet.
The chips are illustrative circumstances, written as "Age 6, bedtime, third
night: worked", never as quotes from a named family. "New studies are added
by a person, never by the machine" is the rails rule, stated as it is.

Each stream is declared in `beats.json` under `right.think` and the build
places, flies and sounds it (a soft whoosh per stream, a glow pulse per
arrival). Film is now 99.5 seconds.

## v4: the thinking streams (8 October)

Justin asked for DiGi to visibly think. At 9:02 the right column now shows
five labelled streams flying into the brain in order, each chip a real item:
the researchers (Orben, Odgers, Livingstone, Kennedy, Diamond, Hartstein),
the peer reviewed studies (the same six the film cites), our philosophy in
THE-STORY's own words (never allow or deny, connection is the protection,
the pathway not the ban, repair over punishment), the guardrails from
digi/00 (safety first, never invent a study, a person approves anything new,
crisis routes to a human), then parents who said what worked, each linked to
a circumstance (age, moment, what was tried, worked or did not). Only then
does the answer card land. At 7:30 the same mechanism runs again as the
learning brain: feedback chips and new studies added by a person.

Honesty rule: no number of parents is claimed. The film shows the mechanism,
every answer teaches the next, and the chips are example circumstances, not
quotes. The glow pulse is a single element per beat; the per chip pulse was
dropped because it made the render stall.

## Finals

All six clips finalised at 1080p from their drafts (432 credits), the
pyjamas moment included. Draft and final sources removed; `assets/` holds the
slowed, column cropped versions the composition uses.

## Still to do

- Vertical cut: stack the columns, left above right, same clock.
- Voice: still silent. Decision pending from the brain film.
