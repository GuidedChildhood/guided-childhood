# Screens shotlist

Six cards for Version B. Version A uses none. Every one of these is a real
capture of the real components, taken from the fixture routes so no family data
ever ends up in an advert.

Capture at a phone viewport, 390 by 844, device scale factor 3, PNG. Portrait
cards read better than crops of a desktop layout, and the app is designed phone
first anyway.

## The routes

| Card | Route | What to frame |
|---|---|---|
| 1 | `/ref-ask-first?view=child` | The picker, open, device tiles and the minutes. This is the ask being made. |
| 2 | `/ref-ask-first?view=child` | The Chores first banner near the bottom of the stack, with Make your bed listed. |
| 3 | `/ref-ask-first?view=parent` | The ask box with the request sitting in it, child name and minutes visible. |
| 4 | `/ref-ask-first?view=parent` | The locked banner with the blocking jobs listed underneath. |
| 5 | `/ref-ask-first?view=child` | The declined state with the nudge under it, the grown up asked line. |
| 6 | `/ref-ask-first?view=timer` | The countdown running, minutes ticking down. |

Cards 1, 2 and 5 all come off the child view, which stacks every banner state on
one page. Scroll to each and shoot the section rather than the whole page. Same
for 3 and 4 on the parent view.

The `?view=timer` fixture was added for this shotlist. It mounts the real
DeviceTimeCard with a twenty minute session already running.

## Capture

Run the app locally, then Playwright against `localhost:3000`. The
`webapp-testing` skill has the harness. Roughly:

```
viewport 390x844, deviceScaleFactor 3
goto /ref-ask-first?view=child
wait for the banner, scrollIntoView, screenshot the element
```

Element screenshots, not full page. Each card wants to be the component and a
little breathing room, nothing else. No browser chrome, no fixture labels, no
scrollbar.

Save as `card-1-ask.png` through `card-6-timer.png` so the order is the order.

If the fixture routes are live on the deployed site the Higgsfield capture
script can hit them directly, but local capture is the better route: it is
deterministic, it does not depend on a deploy, and we can nudge props to get the
exact state we want on camera.

## Before anything gets uploaded

Check every card for a real name, a real school, a real avatar or a real
timestamp. The fixtures use Alfie and made up jobs, which is fine, but anything
captured from a real dashboard by accident is not going in an advert.

## Then

Six PNGs go to Higgsfield through the upload widget. They come back as media
ids, and those ids are what the composite step anchors to the words in
`version-b-jobs-first.md`.
