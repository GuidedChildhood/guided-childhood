# Starter pack result page: the three "fixes" graphics, redrawn to match the app

Justin, 18 November 2026, with a screenshot of "The words, ready" and "Ten seconds a day":
still a little clunky; research the best first look at a service on Mobbin (Good Inside etc.);
"the graphics need to be way more stylish and in fit with app".

## What Mobbin shows
- Good Inside is not on Mobbin. Closest first-look patterns:
  - Alma: stacked, slightly tilted cards, each with a small coloured chip (Insight, Trend, You asked).
  - X creator tour: the real notification lifted off the screen behind it.
  - Finch, Duolingo, BitePal: progress as a row of the app's own marks, not a bar chart.
- Our current graphics fail on two counts: thin grey borders (the app is ink edge and lift),
  and the progress chart shows pink bars and stars that the real check in does not have
  (the real one is five faces).

## Build
1. Extract the five check-in faces to components/daily/CheckFace.tsx, used by the app's
   ConcernCheckIn and by the page, so the picture is the real instrument.
2. Stars they earn: MockAsk on a tinted stage, the child's ask peeking behind the parent's card.
3. The words, ready: a stacked pair. "Not this" peeks behind, tilted, struck through;
   "Say this" sits on top in the app's script card finish, with Rehearse with DiGi and
   Print for the fridge chips (both real features).
4. Ten seconds a day: tonight's five faces with one chosen, then six weeks of faces
   climbing, ending in the real rest rule (going great rests a worry, checked again in a week).
   The concern shows as the parent typed it, sentence case, not shouted in mono capitals.
5. Screenshots at 390 and 1280, light. No data change.
