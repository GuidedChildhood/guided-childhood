# Print, then onto the next step (2 September 2026)

Justin, from the star chart print page in Safari: "When I click print here it
should update the 1 of 5 jobs on child app and go back to the 5 a day marked
as completed and onto next."

## What was true

The tick landed (Jonny's kid_days row had printable in done at 10:37, the
minute the page opened). Nothing showed it: the five a day card fetched once
on mount and never again, the tick route answered a bare ok so no button
could act on it, and the print page had no way back.

## The build

1. The tick route answers with the day: ticked (one of today's five just
   landed), steps, done, complete, justCompleted, streak.
2. tickPrintableStep resolves to that answer and raises a window event on
   the page it ran on.
3. The five a day card listens for the event (ticks itself at once, star
   sound, celebration if it was the fifth) and refetches whenever the child
   comes back to the screen (visibilitychange, pageshow).
4. Every print button walks the child back to the day when the tick landed:
   the printables tab and the assigned sheet close and scroll to the card on
   the home screen; the star chart and bucket builders push home with
   ?tab=five, which the home screen lands on the card.
5. The Safari print page says when the print counted, and after the dialog
   turns its bar into the way back: close this tab, open the app.

## Not done

A Safari tab cannot open the installed app. The instruction is the honest
whole of it; the app has already moved on by the time they return.
