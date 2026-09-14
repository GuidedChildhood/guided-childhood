# The pilot is two lessons, matched to the school's phase (14 September 2026)

Justin, 14 September 2026, on /pilot: "shouldn't the free pilot only include
one lesson, as we need to get paying customers from it, not give too much
away", then "I think pilot should be 2 lessons".

Decision as taken: a pilot code opens TWO lessons, matched to the phase the
school teaches, plus the Hub documents. Everything else stays visible on the
curriculum map and locked on tap. The free sample lesson (lib/taster.ts,
ks3-12) stays open to the world as before; that is a separate decision.

## The facts today

- One kind of code (`SCHOOLS_ACCESS_CODES`) opens everything, for a licence
  and for a pilot alike. The pilot page, the pilot letter, the terms (section
  6), the unlock page and the pricing page all say the pilot is the whole
  scheme for a term.
- The gate is `schools/proxy.ts` composing `isOpenPath` (lib/access.ts) and
  `isTasterPath` (lib/taster.ts). The cookie is `code|expires|signature`,
  verified against the env list on every request.
- The pilot form captures a phase (primary, secondary, all through, sixth
  form) but nothing reads it yet. Justin issues codes by hand.

## The design

1. **Pilot codes are their own list.** `SCHOOLS_PILOT_CODES` in the env,
   comma separated, each entry `code:phase` (a bare code means all through).
   Licence codes stay in `SCHOOLS_ACCESS_CODES`. The cookie is unchanged; the
   tier and the phase are looked up from the env on every request, so moving
   a school from pilot to licence is an env edit and a redeploy.
2. **The set per phase, in code** (`schools/lib/pilot.ts`, plain node so the
   guard loads it):
   - primary: ks1-03 (Pebble, real, pretend or computer made) and ks2-06
     (DiGi, how algorithms work)
   - secondary: ks3-24 (Orbit, is it doing my thinking) and ks4-15 (Nova,
     manipulation and persuasion)
   - post16: ks4-19 (readiness at 16) and ks5-20 (AI mastery and data rights)
   - all_through: primary plus secondary
   None carries a DSL note, so no pilot needs a safeguarding briefing before
   its first lesson. Justin can swap any of these; they are one list.
3. **What a pilot code reaches.** The pilot modules in the four teacher shapes
   the taster already defines (the prep page, its run sheet, the player, the
   printables), the class wall for those modules, the print room index, and
   the whole Hub. Any other module's page redirects to `/unlock?pilot=1`,
   which says which two lessons the pilot opens and where the prices are.
4. **The map says which.** For a pilot holder the curriculum cards carry an
   "In your pilot" chip on the set and "In the full scheme" on the rest. The
   lesson and teach pages of a pilot module carry a slim strip naming the
   pilot and pointing at the prices, in place of the taster bar.
5. **Every promise updated.** /pilot (hero, the included list, the
   description), the pilot letter, the terms section 6, the unlock headline,
   the pricing page's "teach any module", the cron email to Justin (which env
   var and the `code:phase` shape), `.env.local.template`.
6. **Guards.** `scripts/check-pilot-door.mjs` grows: each phase has exactly
   two modules (all through four), every id is in the curriculum and in that
   phase's key stages, none is DSL flagged, the proxy composes `isPilotPath`,
   a pilot token cannot reach a stranger module in any shape, and no page or
   letter still promises the pilot "everything", "the whole scheme" or
   "every module".

## Not in this plan

- A change to the licence tier, the taster, or the cookie format.
- Reading the pilot form's phase automatically into a code. Codes are still
  issued by hand; the email to Justin tells him the shape to type.
- The staffroom. Still after the first pilot signs.

## Verification

Both typechecks, every guard in wiring.yml, and a walk of the gate with a
pilot cookie in the local harness: a pilot module opens in all four shapes, a
stranger module lands on /unlock with the pilot message, the Hub opens, the
map shows the chips.
