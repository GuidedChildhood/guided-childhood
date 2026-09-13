# Platform review: speed, code efficiency, and a simpler DiGi

Justin, 13 September 2026, after the starter reveal work merged: "Anything
outstanding? Can you review the whole platform and ask me questions if any
area is not clear, and make sure all code is efficient and quick, and DiGi is
simple, easy to read and use."

## Lane

Platform code, whole app, speed and DiGi. Nothing in schools (the 0u09q9
session owns that lane today). No migration unless a finding needs one; the
number will be claimed in the PR title if so.

## Method

Four passes run in parallel, report only, then the clear wins are built in
this PR and the judgement calls go to Justin as questions:

1. Speed and code efficiency: sequential database round trips, client bundles
   that could be server, top level heavy imports, missing caching, first paint
   blockers on the marketing pages and the child app.
2. DiGi readability: the answer shape and length, the chat UI on a phone, the
   size of the system prompt, sequential awaits before the model call, the
   proactive lines a tired parent reads in five seconds.
3. A Playwright walk of every reachable flow and fixture at 390 and 1440:
   load time, console errors, tap targets, text size, the five second test.
4. Dead code and duplication: unimported components, unwired guards, twin
   implementations, the largest files.

## What gets built here

Only findings that are MUST FIX or SHOULD FIX, small, and certain. Anything
that changes how a feature behaves for families is a question to Justin, not
a change.

## Measurement

Before and after for whatever is changed: round trips per page, bundle size
per route from the build, load time from the walk.
