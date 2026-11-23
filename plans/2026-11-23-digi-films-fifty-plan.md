# DiGi question films: a production line to fifty

23 November 2026, marketing lane. Justin: keep producing the DiGi films from the
research we already did on the most common questions, with DiGi answering the way
our philosophy says it would, and get at least fifty out.

## What a film is (unchanged from the three, PR 1665)

One parent question in their own words, DiGi's pathway answer inside the live
rails (under 120 words, never yes or no, the check in line, one real script,
Tonight last), the script card, the check back, Sorted, what DiGi used, one
verified line of research, the stage check. Simpler text, the 3D opening,
Imogen's voice one line per beat. About 58 seconds.

## The production line

One list, `videos/2026-10-09-digi-shorts/cuts/films.json`, holds every film: the
child, the question, DiGi's reply, the script row, the tile, the research line.
`tools/make-film.mjs` turns a row into scenes, records them, measures where the
two steps sit on screen, cuts, renders and lays the voice. No hand tuning.

## The rules that decide what gets a film

- A question only gets a film when a real script row answers it. No script, no film.
- Questions come from the ranked parent problem log and the top twenty document. Nothing invented.
- The child's age fits every app on screen. Example family names only.
- A research line only when a verified study fits the child's age; otherwise the card carries our philosophy line and no citation.

## Batches of ten

Batch 1 (this PR): the tablet scream at five, the Year 6 phone plan, homework on
the iPad, Snapchat at ten, alone with YouTube, sneaking screen time, the ban,
money spent in a game, AI wrote the homework, a chatbot as a friend.

Batches 2 to 5 follow the same list down the ranking, each its own PR, after
Justin has watched the batch before.

## Cost

Voice: three new lines a film (the opening, the check in line when it changes,
the research line). About one and a half credits a film. Rendering is free here.
