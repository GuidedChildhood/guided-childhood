# School AI governance: implementation report

10 September 2026. Written against the twelve points the brief asked for.
The reasoning behind each decision is in `plans/decisions.md` under
"10 September 2026: the school AI governance layer"; the audit that came
first is `plans/week-of-2026-09-07-school-ai-governance-plan.md`.

---

## 1. What already existed

**The schools app** (`schools/`, its own Next workspace, deployed separately).
Eleven compliance hub pages under `/hub`: RSHE mapping matrix, policy pack,
parent letters, data protection pack, safeguarding crosswalk, CPD, induction,
year plan, vocabulary, FAQ, accessibility. Plus `/`, `/pricing`, `/curriculum`,
`/draw`, `/philosophy`, `/print`, `/unlock`.

**Access.** `schools/lib/access.ts`. One HMAC SHA256 signed cookie derived from
a shared code in `SCHOOLS_ACCESS_CODES` with `SCHOOLS_ACCESS_SECRET`. `OPEN_PATHS`
is an exact match allow list; everything else under `/hub` is gated.

**What did not exist, and this is the finding that reshaped the brief:** no
session, no user, no school row, no role, no API routes in the schools app. The
`schools` Postgres schema holds two tables, `school_lessons` and
`invoice_requests`, and neither identifies who is asking. There is no tenancy.

**The curriculum.** 21 modules EYFS to KS5 in `shared/schools-curriculum.ts`,
each with slides, scripts, a Rosenshine arc, starter and exit quizzes.

**The Digital Passport.** A parents app mechanic (`shared/passport-stages.ts`),
not a schools one. Competencies a child earns, staged by age.

## 2. What changed

Nothing was changed. Every behaviour that existed before this PR behaves
identically after it. The single edit to an existing file is a card added to
the `/hub` index so the new area is reachable.

## 3. New files

| File | What it is |
|---|---|
| `shared/ai-governance/types.ts` | `Review` and friends. Shaped as a database row from the start, so the later move to Postgres is a store swap and not a rewrite. |
| `shared/ai-governance/questions.ts` | The instrument. 85 questions across 10 sections. 37 pupil only, 26 asking for evidence. |
| `shared/ai-governance/rating.ts` | Answers to eight independent category ratings, then an overall status. No composite score anywhere. |
| `shared/ai-governance/passport-links.ts` | The join: 7 links from a risk raised in procurement to a competency and the lesson that teaches it. |
| `shared/ai-governance/storage.ts` | `ReviewStore` interface, `BrowserReviewStore`, export and import, `SaveFailed`. |
| `shared/ai-governance/policy.ts` | Suggested policy clauses, a draft letter to parents, a decision line. All from the school's own answers. |
| `schools/app/hub/ai-governance/page.tsx` | Route shell. |
| `schools/app/hub/ai-governance/Dashboard.tsx` | The tools a school has looked at, worst first. |
| `schools/app/hub/ai-governance/ratings.ts` | The four rating colours, measured for contrast. |
| `schools/app/hub/ai-governance/review/[id]/page.tsx` | Route shell. |
| `schools/app/hub/ai-governance/review/[id]/Review.tsx` | The assessment, section by section, saved on every keystroke. |
| `schools/app/hub/ai-governance/review/[id]/Result.tsx` | The result, the readiness view, the join, the policy wording, the decision. |
| `scripts/ai-governance.test.mjs` | The framework's own tests. No database, no browser, no secrets. |
| `plans/week-of-2026-09-07-school-ai-governance-plan.md` | The audit, gap analysis, architecture, reuse plan, breakage risk and phasing. |

## 4. Modified files

| File | Change |
|---|---|
| `schools/app/hub/page.tsx` | One card added to `DOCS`, between the data protection pack and the safeguarding crosswalk. Five lines. |
| `.github/workflows/wiring.yml` | One step added to the existing `concern-guards` job. |
| `package.json` | One npm script, `governance-test`. |
| `plans/decisions.md` | Append only, as the rules require. |

## 5. Migrations

**None.** No schema change, no new table, no new column, no new policy, no
number claimed from the ledger. Nothing in this feature reaches Postgres.

## 6. New routes

| Route | Gated | Indexed |
|---|---|---|
| `/hub/ai-governance` | yes | no, `robots: { index: false }` |
| `/hub/ai-governance/review/[id]` | yes | no |

Both are gated by being under `/hub` and absent from `OPEN_PATHS`, which this
PR does not touch. Verified live rather than assumed: both return 307 to
`/unlock?next=...` without a valid cookie.

Neither route reads or writes server data. Both are shells around a client
component.

## 7. Permissions and RLS

**No RLS policy was added, changed or removed, because no table is involved.**

The brief asked, correctly, that one school's supplier reviews must never be
visible to another. The audit found no tenancy to enforce that with. A shared
access code identifies a licence, not a school, so a server side store without
accounts would have made every review readable by every code holder. Rather
than build that and describe it as isolated, reviews are kept on the device
that made them and never transmitted. There is no cross tenant surface because
there is no tenant surface.

**When accounts arrive**, the swap is `BrowserReviewStore` to
`SupabaseReviewStore` behind the same interface, a `school_ai_reviews` table
keyed by school id, and one policy of the shape the rest of the schema already
uses. `Review` is already a row.

**No child's data is collected by this feature at any point.** It records a
school's own answers about a vendor.

## 8. Existing features reused

- The access gate. Not extended, not modified, not bypassed.
- The design tokens and `schools/components/ui` (`panel`, `eyebrow`, `btnGold`,
  `btnQuiet`, `input`, `label`, `h1`). No new component primitives.
- `shared/schools-curriculum.ts`. Every lesson the result page offers comes
  from the scheme that already exists, and a test asserts each id resolves.
- `shared/passport-stages.ts`. The competencies named are the ones children
  already earn, not new ones invented for this feature.
- The `concern-guards` CI job and the `<style>` block pattern from
  `/hub/rshe-mapping` for the media queries.
- The app wide `.no-print` convention, so the printed record drops the site
  nav, the section rail, the step buttons and the print button itself.

## 9. What was deliberately not changed

- Navigation, lessons, Digital Passport logic, school pathways, parent
  pathways, child profiles, DiGi, compliance mapping, rewards, progress.
- `OPEN_PATHS`. See item 11.
- Any existing school policy document. The policy builder suggests wording in a
  collapsed block for a human to copy. It writes nothing.
- Pricing. Nothing in this feature is sold separately or gated by tier.
- No field was renamed or deleted anywhere.

## 10. Tests completed

| Check | Result |
|---|---|
| `tsc --noEmit`, root workspace | pass |
| `tsc --noEmit`, `schools/` workspace | pass |
| 16 existing source guards | pass |
| `scripts/ai-governance.test.mjs` (new, 37 assertions) | pass |
| `check-wall-contrast` against the live wall | 252 text nodes, all clear of WCAG AA |
| Desktop 1280x900, full flow | pass |
| Phone 390x844, full flow | pass |
| Console | clean, beyond a pre existing app wide `/favicon.ico` 404 |
| Access gate on both new routes | 307 to `/unlock` |
| The printed record, under real print media | nav, rail, step buttons and print button all drop; the collapsed policy wording and parent letter both open and print in full |
| Rating colours | 5.37, 8.38, 8.87 and 7.13 against their backgrounds, all past AA |

The four error paths were tested rather than reasoned about, by making
`Storage.setItem` throw and by feeding the import a file that is not ours:

| Path | Behaviour |
|---|---|
| Import a JSON file that is not an export | names the problem, imports nothing |
| Import a file that is not JSON | names the problem, imports nothing |
| Storage refuses on "Review a tool" | says so, stays put, no dead button |
| Storage refuses mid review | banner stays up, typing carries on, nothing crashes |

The printed record was a finding of its own. The policy wording and the parent
letter sit in collapsed `<details>`, and what a school hands its governors
cannot depend on which sections the person who printed it happened to have
open. CSS could not fix it: a closed `<details>` hides its content through
`::details-content`, which no `display` rule reaches. It is opened for real on
`beforeprint` and put back after.

The assertion that matters most: **every lesson this feature offers a school
has to resolve in `CURRICULUM`.** A governance tool that links a teacher to a
404 is worse than one that links nothing.

## 11. Risks that need a human

1. **Reviews are on one device.** If a school clears site data or the machine
   is replaced, an unexported review is gone. Export exists and the page says
   so twice. This is the accepted cost of shipping before accounts, and it is
   the thing to revisit first when tenancy lands.

2. **`/hub/ai-governance` is gated, and it is arguable it should not be.**
   `/hub/data-protection` was opened this morning on the reasoning that a
   procurement document is a reason to buy and should be readable before
   buying. The same argument may apply here. Left gated because the brief did
   not ask for it to be public and it links into the scheme. **Justin's call.**

3. **The companion gap is real.** No module covers "an AI that talks like a
   friend and is not one". The nearest are the persuasion and mood lessons and
   neither is about it. The result page says so rather than linking a near
   miss. **This is a curriculum commission, not a code task.**

4. **The question set is our reading of the field, not a standard.** It leans
   on what the DfE, the ICO age appropriate design code and the KCSIE filtering
   and monitoring standards actually ask of schools, but no external body has
   reviewed it. A school treating it as a compliance certificate would be
   overreading it. The copy is careful about this. **Worth a DPO reading it
   before it is promoted.**

5. **Migrations 279 and 280 are merged but not applied.** Unrelated to this
   feature, still outstanding, still needs someone with database access.

## 12. Recommended next, in order

1. **Apply 279 and 280.** Outstanding from the previous piece of work.
2. **Write the companion lesson.** The gap the tool now names in front of
   schools. One module, KS2 and KS3, on the difference between a machine that
   talks like a friend and a friend.
3. **A DPO reads the question set** before this is promoted anywhere.
4. **Decide the gate.** Open or keep closed, per risk 2.
5. **`SupabaseReviewStore` when tenancy lands.** One class, one table, one
   policy. Everything above it is already written for it.
6. **A worked example.** One filled in review of a real product a school has
   probably already met, as a reference. Best done by a person, not generated.
