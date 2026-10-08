# Two brains: is the split screen confusing, and what is the industry way

8 October 2026. Justin asked whether running the child's brain and DiGi at
the same time is confusing, what the standard way to show a problem and
solution comparison is, and what the best looking motion text is. Two
researchers ran. Full source lists at the end.

## Verdict: his instinct is right

The simultaneous split with two text streams is the stacked case the
evidence warns against. Where split screen works (Apple's fifteen second
"Your phone vs iPhone" spots, TikTok duets, before and after beauty ads) both
halves are near wordless and the contrast is a single variable. Ours has two
running narratives, two clocks of text and about eight comparisons.

- Mayer's multimedia principles: split attention and redundancy both say two
  sources of words at once cost working memory. Temporal contiguity (nine of
  nine experiments) says one picture synced to one line wins.
- Reading limits: BBC 160 to 180 words a minute, nothing on screen past seven
  seconds. Two caption streams double the load; viewers read one and lose
  the other.
- The structure that dominates the best films (Dollar Shave Club, Samsung
  Growing Up, Headspace, Kurzgesagt, Huberman clips, Get a Mac) is
  sequential: problem, the turn, solution. Get a Mac, the most famous
  comparison campaign, is two characters taking turns, not a split.

## The recommended structure, under 90 seconds, same clock device

| Time | What | Text on screen |
|---|---|---|
| 0 to 5 | The clock fills the frame, 9:00 PM. "It is 9pm. She is six. YouTube is on." | one line |
| 5 to 35 | Her brain, full frame, clock in the corner. Four beats, one idea each: the reflex, the next clip, cannot stop, melatonin | a three to five word label per beat, source line small |
| 35 to 42 | The turn. The clock stops. The parent's question types on: "She will not stop. What do I do?" The brain shrinks to a live tile in the corner, still ticking | the question only |
| 42 to 75 | DiGi, full frame, the clock resumes. The thinking streams, then three answer beats that land on the same minute marks the brain beats used | DiGi's lines only, nothing over seven seconds |
| 75 to 85 | The morning. The one place a side by side earns its keep: a static two image frame, one label each, tired morning, rested morning | two labels |
| 85 to 90 | Start free | the stage check |

The same clock survives as a callback the viewer can feel, not a race they
must read.

## The text treatment

From the second researcher, the styles that read on a phone and render in
headless Chromium: a frosted glass panel (white at twelve percent over a
sixteen pixel blur, a one pixel light rim, an inset top highlight) over a
dark scrim, never a solid box; headline words rising from blur to sharp with
an expo out ease, staggered; a mirror look done with a gradient text fill and
a shadow stack, not blend modes (a Chrome bug corrupts backdrop blur when
blend modes are on the page). Rules: three to seven words in one place, a six
word line holds at least two seconds, body text at least 44 px at 1080 wide,
text lands then the camera keeps drifting. Refraction and chromatic text are
invisible or unreadable at phone size, so they stay off.

## What this means for the build

A new composition, not a patch. The current `beats.json` keeps the verified
copy and the clips; the build gains full frame beats, the hinge, the corner
tile, and the glass text system. Estimated render: shorter than v4 because
only one column is live at a time.

## Sources

Structure: yansmedia.com/blog/explainer-video-structure; thedrum.com (Apple split screen social campaign); campaignlive.com oral history of Get a Mac; theaddoctor.com Apple Relax it's iPhone; Mayer and Moreno 1998 and the 2014 principles papers on researchgate; en.wikipedia.org Split attention effect; closedcaptioncreator.com subtitle reading speed; the six second rule eye tracking study (researchgate 331570180); wistia.com audience retention; vidyard.com benchmarks; link.springer.com 2026 sludge video study (no harm found from a muted irrelevant second clip, not our case).

Text: developer.apple.com WWDC 2025 session 219 (Liquid Glass); trydemotion.com Apple style motion; buildmvpfast.com glass recipes; blog.logrocket.com liquid glass CSS; optious.com Apple kinetic typography; designmd.co Linear vs Vercel motion; gsapvault.com and lab.good-fella.com text animation; issuetracker.google.com 461838017 (blend mode corrupts backdrop blur); opus.pro and itnavideo.com caption size; w3.org WCAG G18.
