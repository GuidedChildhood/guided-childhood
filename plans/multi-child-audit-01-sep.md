# The child switcher audit, 1 September 2026

Justin: "run a check that child ticks works on every aspect of platform."

A full sweep of the codebase, verified line by line against the 18 August
audit and everything merged since. Every claim below was checked in code on
today's main plus PR 939.

## The headline

The August root cause is half fixed. The switcher lives in the layout, both
nav bars carry ?child=, and three of the four silent corruptions from August
are closed (lesson completions per child since migration 213, quest ticks
per child since 206, DiGi filing per child since 18 August and now the
conversation itself since 235). But the Today path and the Home tiles, the
two surfaces a parent taps most, still drop the choice, and one silent
corruption survives.

## WORKS, verified

- Plumbing: getChildren (lib/children/server.ts), pickChild
  (lib/children/select.ts), currentChildId reads the URL at click time,
  ChildRail rendered once by the layout and keeps every other param,
  NavTabs and MobileTabBar append the child.
- Pages honouring ?child=: home, daily, checkin (redirects so the URL
  matches), stats (every read scoped), devices, moments, lessons, together
  lessons, scripts (all four routes), digi, pathway, strands, quests/deal,
  passport. what-is-working and insights are correctly family wide.
- Writes carrying the right child: lesson_completions (write side),
  together completions, quest ticks and unticks from the child app, all
  six DiGi writes plus the per child thread, check in concern writes,
  daily session completion, moment completions.
- school_actions.child_id exists (migration 215) and the action routes and
  three reminder crons use it. DiGi screen time is per child. The approval
  push names the child. The star cap is right at the spend route, the
  parent start route, the kid home, the rollover cron and the weekly
  review.

## BROKEN, ranked by harm

### A. Wrong writes (rows being written wrongly today)

- A1 THE LAST SILENT CORRUPTION. A shared job approved from
  /dashboard/quests banks stars for EVERY child.
  QuestManager.tsx:203 posts child_id from currentChildId(), but
  /dashboard/quests is not in CHILD_ROUTES so the URL never carries
  ?child= and the value is null; the approve route then inserts a null
  tick (approve/route.ts:131) and the bank counts a null tick for every
  child (lib/quests/bank.ts:199). The same screen shows it credited to
  one child (optimistic row uses quest.child_id ?? activeChild), so the
  display and the database disagree. Same fault in QuestBoard.tsx:219 and
  QuestStatusBoard.tsx:217. Note /dashboard/quests/manage?child= is
  correct, so the identical handler is right on one page and wrong on the
  other.
- A2 The weekly agreement verdict pays the primary child
  (api/agreement/week/route.ts:25, 62, 79).
- A3 The Sunday and weekly check ins write concerns to the primary child
  (api/wellbeing/checkin/route.ts:43, api/wellbeing/weekly/route.ts:155).
  Permanent wrong attachment, the exact failure mode fixed in DiGi.
- A4 Wellbeing tracker writes go to the primary child (api/tracker and
  api/tracker/quick).
- A5 Moment outcomes and moment raised concerns go to the primary child
  (api/moments/tried:45, api/moments/make-quest:44).
- A6 DiGi's reflective answer files against the primary child
  (api/digi/feedback/route.ts:47), the one DiGi route missed in August.
- A7 Right Now raises concerns against the primary child
  (api/rightnow/route.ts:86, api/rightnow/custom/route.ts:72).
- A8 School send to child pushes to ALL children under the primary
  child's name (send-to-child/route.ts:43, 55).
- A9 A keepsake order prints from the primary child's stamps
  (api/shop/checkout/route.ts:72, 107, 130); /dashboard/keepsakes also
  locked to primary.
- A10 Latent: the lesson score carry over reads prior completions with no
  child filter and .maybeSingle() (api/lessons/complete/route.ts:24), so
  two children passing the same lesson breaks the never taken away rule.

### B. Wrong advice

- B1 DiGi's wellbeing scores blend two children into one average and one
  trend (api/digi/route.ts:199, no child_id, no label).
- B2 DiGi's live concerns fetched without child_id and unlabelled
  (api/digi/route.ts:231), so identical baseline worries for two children
  are indistinguishable.
- B3 get_child_history has no child parameter; concerns and screen time
  are scoped underneath but wellbeing_checks is not, and DiGi cannot look
  up a sibling mid conversation (lib/digi/tools.ts:62, 249).
- B4 The parent quests board and five other sites price every child on the
  8 to 10 star cap (getStarBanks called without age bands at
  api/quests/route.ts:77, time/start:238, time/active:32, kid balance
  page:60, kid celebrations:58, the printed contract:39, board-status:144,
  nudge-facts:72). The spend route is right, so a child is shown one
  ceiling and refused at another.
- B5 Three child specific pushes broadcast to every child
  (school/actions/route.ts:135, send-to-child:55, fridge-week:118). Each
  is one childId argument.

### C. Wrong display (and one write hiding inside)

- C1 The Today path drops ?child= on every rung
  (lib/pathway/daily-tasks.ts:332 to 502 bare hrefs). The August root
  cause, still live on the main loop.
- C2 Home's tiles drop it (eleven links in dashboard/page.tsx).
- C3 The lessons grid drops it (LessonsBrowser.tsx watch and library
  tiles), which turns into a WRONG WRITE: a together lesson reached that
  way defaults to primary and the completion, stars and passport land on
  the wrong child. (The library tile hrefs were fixed in PR 939 today;
  the watch together tiles and the back link still drop it.)
- C4 The lessons library shows one child's ticks to the other
  (lessons/page.tsx:97 no child filter; lessons/[id]/page.tsx:90 also
  .maybeSingle() so two passes error the read). Migration 213 did the
  schema, these reads never followed.
- C5 /dashboard/quests has no switcher (by design it shows every board,
  but it is why A1 exists).
- C6 /dashboard/agreement locked to primary; family_agreements.child_id
  exists but nothing writes it, and .maybeSingle() will error the day a
  second row appears.
- C7 /dashboard/homework ignores ?child= (its own picker defaults to the
  first child).
- C8 Minor primary child copy: school, tell-a-parent, printables,
  social-settings, quests/crafts, agreement/print, tracker/checkin.

## Every remaining .eq('is_primary', true) in app/ and lib/

27 live sites, none a proper fallback. Twelve are wrong writes (the A list
above), twelve are wrong display or advice, three are genuinely fine
(daily/complete fallback, children/name, onboarding). Full list in the
audit transcript; the A and C lists above name them all.

## The two changes that clear the most

1. Thread the child through getTodayLoop's hrefs, Home's tiles and the
   remaining LessonsBrowser links. Closes C1, C2, C3 and the wrong write
   inside C3.
2. Pass activeChild instead of currentChildId() in QuestManager (and the
   two boards), or put /dashboard/quests in CHILD_ROUTES. Closes A1, the
   last silent corruption from the August list.

Then the A list top to bottom (each is a small route fix accepting a
child_id with primary as fallback), then B4's age bands, B5's pushes, B1
to B3 in DiGi, then the C display fixes. Nothing here is architectural;
it is the same pattern applied to the routes that missed it.

## FIXED, same day (Justin: "Fix and do all suggested fixes")

Every A, B and C item above is fixed except C5, which stays by design: the
quests page deliberately shows every child's board, and A1 (its harm) is
closed by sending the row's own child instead of reading a URL param the
page never carries. C6 is fixed proportionately: the agreement stays one
per family by design, but the page now honours ?child= for the child it
names and the weekly verdict pays that child; a fully per child agreement
remains open work if Justin ever wants it. The A route fixes all follow one
pattern: the child off the wire, validated as this parent's, primary only
as the fallback, and legacy rows with no child still speak for the
household.
