# Next build: stage the reveal (onboarding calm start)

Status: LINED UP, ready to run. Not started. Written 2026-07-17.

## The problem this solves
A first time parent currently meets the whole platform at once: quests, DiGi,
scripts, rescue, lessons, printables, games, wellbeing, weekly review, pathway,
balance. The screens are calmer after the consolidation pass, but the breadth
still lands on day one. The fix is not cutting features, it is revealing them one
at a time so the first run is a single simple loop, and the depth arrives as the
parent is ready for it.

## The shape (soft reveal, never a hard lock)
Everything stays reachable from the tabs at all times, for the parent who wants
to explore. The reveal only controls what Home PROMOTES. So a power user is never
blocked, and a new user is never overwhelmed. This is the safe version.

## Phase 1 — first run Home
- A new account (first few days) sees a stripped Home: the greeting, the one
  daily loop (Today's Path plus the quest board), and one DiGi way in. Nothing
  else promoted.
- Hide from Home while in first run: the weekly review card, the Sunday check in
  teaser, the smart alerts, the moments card, and the full Keep going tile grid
  (show only Ask DiGi and Quests as tiles).

## Phase 2 — the reveal schedule
DiGi introduces one new thing every few days, as a small New card the parent taps
to meet it, then it stays available. A gentle cadence, roughly:
- Day 1: the daily loop (already there).
- Day 3: Family Quests and the star balance.
- Day 5: the words for a hard moment (scripts and Help now).
- Day 8: Lessons and printables.
- Day 11: the pathway and the passport (the whole point, once the habit holds).
- Day 14: wellbeing, the weekly round up and the Sunday check in.
Each reveal is a single calm card, DiGi voice, no dashes, dismissable.

## Phase 3 — lighter setup
Cut the six setup steps down for first run: ask only for the essentials to feel
value fast (add a child, set one quest). Defer school, agreement, child link and
push to reveals later, so the first session ends with a real win, not a checklist.

## Implementation notes
- Eligibility is driven by account age (profiles.created_at), so NO MIGRATION is
  required for v1: the schedule is derived from days since signup.
- Which reveals the parent has already met is tracked in localStorage per feature
  key (gc_reveal_seen_<key>), so it is migration free. If cross device memory is
  wanted later, add profiles.reveals jsonb (migration 068) as a v2.
- New lib/onboarding/reveal.ts: given account age and the seen set, return the
  next feature to reveal and whether Home should promote a given surface.
- New component RevealCard (client): the DiGi New card that unlocks a feature.
- Gate the Home surfaces and the Keep going tiles on the reveal lib.
- Everything remains reachable in the tab bar regardless of reveal state.

## Definition of done
- A brand new account lands on a one loop Home and finishes the first session with
  a quest set and a star earned, nothing else shouting.
- Over the first fortnight DiGi introduces the rest, one calm card at a time.
- No feature is ever hard locked; the tabs always work.
- Typecheck clean, mobile and desktop checked, decisions.md updated.
