# Creator radar and unified content engine: dependency map and plan

13 November 2026. Justin pasted a fifteen phase "master build" brief. This is
Phase 0 of it: what already exists, what each phase rests on, a verdict on each
phase through the feedback filter, and what needs his decision before anything
is built. Nothing in this file is built yet.

## What was checked, and what was not found

Read from origin/main at e45dfc01 and from Drive on 12 and 13 November.

| The brief asks for | What exists |
|---|---|
| GDC Daily Content Operating System, Current Posting Pack | In Drive, linked from the start here document |
| Drive integration contract | `scripts/radar/contract.mjs`, `sync.mjs` |
| Current manifest | `content/research-register/manifest.json`, Drive copy verified 12 Nov |
| Research and verification handoff | `scripts/radar/handoff.mjs`, reviews in `scripts/radar/reviews/` |
| FIGURES CLEARED FOR USE, DO NOT QUOTE | `clearedFigures` and `prohibitedClaims` on every handoff, enforced by `qa.mjs` |
| Permanent register | `content/gdc-post-register.md`, next free number 060 |
| Motion, video and image skills | `talking-head-video` with `motion-standard.md`, `explainer-video`, `silent-ugc`, `product-shorts`, `lesson-video`; film check in `scripts/radar/assets.mjs` |
| Content calendar | `content/brand-story/weekly-rhythm.md`, `content/publication/` |
| Founder dashboard | Post Desk and Radar Desk artifacts, Founder Approval Desk folder |
| Analytics | LinkedIn by pasted screen only, `scripts/analytics/linkedin.mjs`. Nothing for Instagram, Facebook or YouTube |
| GDC Story Bible | Does not exist. The start here document says so |
| TRUST and RHYTHM | Not written anywhere in the repository or the Drive files read |

## What already exists that this brief would duplicate

- **14 October 2026, PR 1293.** Justin asked for family_it_guy to be scraped for
  reels. We did not scrape: Instagram blocks it, its terms forbid it, the work
  is his copyright. Two agents catalogued his public topics and each became the
  parent question underneath: 24 silent stories in
  `content/packs/2026-10-14-reels-story-bank/`.
- `content/brand-story/format-playbook-family-it-guy.md` and
  `reference-accounts.md`: the format teardown of his account and of
  dr_catherine_knibbs, September 2026.
- A Roblox guide is already in the product (`social_platform_guides`,
  migration 093, with the monthly spend cap).
- The research register, the claim by claim review, the number gate, the pack
  QA, the approval desk, the publication register and the duplicate check were
  all built or extended this week.

## Dependency map

```
creator sources ──┐
research feeds ───┼─> research register (exists) ─> review (exists) ─> handoff (exists)
manual links ─────┘        │                                              │
                           │ needs: source type "creator content",        ├─> LinkedIn pack (exists)
                           │ claim records per source                     ├─> Reel and Short scripts (NEW format in the pack)
                           │                                              ├─> long explainer script (NEW)
                           │                                              └─> parent checklist (NEW)
                           v                                              │
                  story opportunity (NEW, a view over the register)       v
                                                            visual decision and assets (exists, film check exists)
                                                                          │   needs: founder footage from Justin
                                                                          v
                                    approval desk (exists) ─> publication register (exists, LinkedIn only)
                                                                          │   needs: Instagram, Facebook, YouTube rows
                                                                          v
                                                   analytics (LinkedIn paste only) ─> what is working (exists)
```

Everything new hangs off the existing register. No second database.

## Verdict on each phase

| Phase | Verdict | Why |
|---|---|---|
| 0 Discover | Done | This file |
| 1 Creator database | **Adapt** | Add creator sources and their claims to the existing research register as a source type. A separate database is the duplicate the brief itself says not to build |
| 2 Historical backfill | **Adapt, smaller** | Public websites, YouTube and podcasts can be read. Instagram cannot be read without logging in, so "comprehensive" is not available there. A manual link and transcript path covers it |
| 3 Daily radar | **Adapt** | Add creator feeds that are genuinely public (YouTube, podcast, blog) to the 09:17 run. No Instagram monitoring |
| 4 Philosophy engine | **Blocked on Justin** | TRUST and RHYTHM are not written down anywhere we can read. The seven response classes are easy to add once they are |
| 5 Verification | **Already built** | The claim review. A creator's claim goes through the same gate |
| 6 Pipeline states | **Already built, adapt names** | Our statuses already run DISCOVERED to PUBLISHED with HOLD and REJECTED. Add PERFORMANCE REVIEWED. Do not rename the rest: the tests and the Drive documents use them |
| 7 Multi platform formats | **Adopt** | Add Reel, Short, long explainer and checklist sections to the pack. One handoff, one set of cleared figures |
| 8 Video and motion | **Adopt, blocked on footage** | Scripts, subtitles, shot lists and storyboards can be written now. A founder led film needs Justin's recorded footage. Without it we report the gap and render nothing |
| 9 Calendar | **Adapt** | `weekly-rhythm.md` and the family account's four anchor days already exist. Extend the publication register to the other platforms. The Monday to Friday pattern is a proposal for Justin, not a rule yet |
| 10 Dashboard | **Adapt** | Add a week view and a filming list to the Post Desk. One desk stays one desk |
| 11 Product feedback | **Adopt** | Proposals only, through `platform-mapper`. Nothing in a lesson changes without review |
| 12 Roblox pilot | **Adopt, first** | The right first test. See the open decisions |
| 13 Top 15 opportunities | **Park** | After the pilot shows the method works |
| 14 Automation | **Mostly built** | Run logs, gates, the flow check and the patch fallback exist. Add a source access log for creator feeds |
| 15 Handover | When built | |

## What needs Justin's decision before building

1. **Naming people.** The house rule since July is that no living clinician is
   named beside our advice. Two of the three creators are practising
   clinicians. Challenging or agreeing with them by name, in public, is a
   change to that rule and it is his to make. The safe version already works:
   answer the parent question underneath and name nobody. Recommendation: keep
   the rule, name the argument and not the person, and cite their public work
   only in the research pack.
2. **A public challenge to Family IT Guy on Roblox.** He is not a clinician, so
   the rule does not cover him. It is still a named disagreement with another
   creator. Recommendation: write the pilot as the parent's question ("is
   Roblox a place for predators, and should I ban it") with the evidence, and
   decide about naming him once the research is in.
3. **Instagram and Facebook voice.** Those accounts are the family voice, not
   Justin's (`family-social`). Founder led Reels there is a change of voice.
   Which account carries them.
4. **TRUST and RHYTHM.** Where they are written, or a paragraph on each.
5. **Footage.** Whether he will film, and roughly how much a week.
6. **The look.** Still open from 12 November: three visual systems are on the
   table and no asset is made until one is chosen.

## Proposed order, once he says go

1. Roblox pilot research pack through `kids-research`, six lenses, every
   citation verified, with the product's existing Roblox guide as the proof
   path. No names in copy until decision 1 and 2 are made.
2. Extend the pack format: Reel script, Short, six minute explainer, parent
   checklist, storyboard, filming pack. One handoff, one figure list, the same
   QA.
3. Creator sources as a register source type, with a manual link and
   transcript inbox in Drive.
4. Publication register rows for the other platforms, and a week view on the
   Post Desk.
5. Public creator feeds added to the 09:17 run, with an access log.
6. The top 15 opportunities report.

One GDC number per story stays the rule. A Reel made from GDC-0NN carries that
number with its own asset id, never a new post number.

## What this will not do

- Log in to, scrape or work around any platform.
- Store a creator's library. A link, a date, a short paraphrase and a hash.
- Publish, schedule or approve.
- Claim a connector, a database or a render exists before it has been run.
