# Finish the parents platform — the master roadmap

**Date:** 2026-07-01
**Branch:** claude/agent-management-guided-childhood-lDYLl (PR 43, unmerged)
**How to use this doc:** any session resumes here. Find the first unchecked box, build it, verify it, check it, commit. Each phase has a goal that must be true before moving on. This replaces scattered plans as the single build spine; week 10's curriculum plan stays as the detail doc for Phase 3.

## State of the build (the full review, condensed)

**Working and connected:** 100 plus scripts in the database with challenge personalisation and a recommended next card. DiGi chat with stage, tracker, device, feedback and next step context, 3 free messages a day as the paywall pressure point. Daily moments deck writing real streak data. Device Safety Hub with per device guides and completion. Blended stage progress (scripts, streak, devices, lessons). The daily task trail with DiGi leading to the next real task, and the 4 to 16 overview trail. The slide lesson player with video, quiz, script and try it beats, one exemplar lesson wired with its rendered classroom video. Four squad classroom videos rendered and catalogued. Stripe checkout, webhook and portal. PWA install, service worker, real web push. Homepage with the literacy divide narrative, sitemap, robots, structured data. Design system enforced by audit.

**Half built or missing:** lessons curriculum is one exemplar, not a syllabus (Phase 3). Family agreements are sold on the upgrade page but do not exist (Phase 2). No email system at all (Phase 2, biggest conversion lever). Colour decision pending (Phase 0). Marketing claims like "200 families" predate real data.

**Not live:** every improvement of the last two weeks sits on PR 43. Revenue from an unmerged branch is £0.

## Operating rules (what the two transcripts get right, applied to us)

1. **Distribution beats building now.** The platform is past minimum viable. Every additional feature week without shipping and talking to parents is the classic mistake. Phases 0 to 1 are deliberately not code heavy.
2. **Use their words, not ours.** Mine Reddit (r/Parenting, r/ScreenTime) and Mumsnet threads for the exact phrases parents use about screen fights. Headlines get rewritten in that language. We sell "the 6pm meltdown ends" not "a stage based digital literacy platform."
3. **Ship, then iterate.** Merging PR 43 beats another perfect week on a branch. Minimum in MVP means minimum.
4. **Do not judge anything at week two.** Ninety days of consistent output per channel before deciding an offer is wrong. Small wording fixes first, pivots last.
5. **Ten conversations before the next build sprint.** Warm outreach to parents Justin already knows. The Mom Test rule: never pitch, ask about their life. The five questions, adapted:
   - What is the hardest part of screens in your house right now?
   - What did the last screen fight actually cost you? An evening, sleep, a slammed door?
   - What have you already tried? Apps, bans, taking the phone, a contract?
   - Why did that not stick?
   - If this were solved, what does a good school night look like?
   And the buying signal question: have you ever paid for anything to try to fix this?
6. **This roadmap is checkbox shaped on purpose** so any Claude session can resume mid phase without re planning.

## Phase 0 — Decisions (Justin, 30 minutes, no code)

Goal: the three blockers only Justin can clear are cleared.

- [x] Pick the accent colour: butter and ink chosen, teal fully retired (rebrand landed 2026-07-01)
- [x] Approve merging PR 43 to production (platform branch merged to main in PR 53, 2026-07-03)
- [ ] Name ten parents in the existing network for the five question conversations

## Phase 1 — Ship and listen

Goal: the platform is live and ten real conversations are recorded.

- [x] Apply the chosen colour tokens in globals.css, fix button text contrast if gold chosen, verify mobile and desktop (butter and ink rebrand, 2026-07-01)
- [x] Merge PR 43, deploy on Vercel, smoke test the live site end to end (merged as PR 53, 2026-07-03; Vercel deploys from main)
- [ ] Run the ten parent conversations, write answers verbatim into /plans/parent-conversations.md
- [ ] Mine Reddit and Mumsnet for parent phrasing, rewrite homepage hero, starter pack headline and quiz result copy in their words
- [x] Update dishonest numbers (the "200 families" claim) to true ones or remove (hero star strip and final CTA badge now state the real 50 cap and script count, 2026-07-03)

## Phase 2 — Convert

Goal: a stranger can become a paying family with no human involved, and nothing on the paywall is untrue.

- [x] Email system: Resend plus five emails (welcome with first script, day 2 stage guide, day 4 DiGi nudge, day 7 founder rate with live counter, weekly digest with the child's progress bar) (lib/email, /api/email/welcome, /api/email/cron, migration 022, 2026-07-03. Needs RESEND_API_KEY and CRON_SECRET in Vercel to go live)
- [x] Onboarding ends by opening the recommended script directly, not the dashboard (activation moment) (both exits: skip path and Stripe success URL, free script preferred so nobody bounces into the paywall, 2026-07-03)
- [x] Checkout defaults to annual with monthly as the downgrade (upgrade page reordered and reframed, 2026-07-03)
- [x] Family agreements builder: negotiated per stage agreements, printable, expert panel grounded (makes the upgrade page honest) (/dashboard/agreements, migration 021, clause library per stage, print sheet with signatures, 2026-07-03)

## Phase 3 — Curriculum (the week 10 plan, as checkboxes)

Goal: every stage has real lessons in both voices and the lessons progress signal means something.

- [x] Curriculum matrix: 9 strands by 5 stages, both audiences, seeded as stubs plus the human readable map (migration 018 plus plans/curriculum-matrix.md, 2026-07-02)
- [ ] Expert audit: scripts and lesson copy against Dr Becky, Knibbs, Atkins, Byron
- [ ] Foundation and Builder slide sets written and seeded
- [ ] Explorer, Shaper, Independent slide sets plus the AI safety strand
- [ ] Video production line: screenplay per lesson using the two shot template, one classroom video per lesson, one persistent voice per character
- [ ] Fridge sheet and stage certificate print routes

## Phase 4 — Distribution engine

Goal: three channels running with a 2,500 free signups a month trajectory.

- [ ] LITERACY schools framework PDF as the gated lead magnet behind an email capture
- [ ] Public SEO pages generated from device guides and script problems (40 plus pages, one per real search intent)
- [ ] Script share cards: any script renders as a clean branded image to send to another parent
- [ ] Two school pilot offers (free for the school, parent discount) plus the outreach list
- [ ] Ninety day LinkedIn cadence in the literacy post format, every post feeding the email list

## Phase 5 — Retain

Goal: month three churn is measured and fought with content, not hope.

- [ ] Weekly digest email showing the child's stage progress moving
- [ ] Monthly script drop per stage (new scripts appear, members notified)
- [ ] Push nudges tuned to the daily trail (streak about to break, new lesson live)

## Success markers

Phase 1: live URL, ten transcripts. Phase 2: first stranger payment. Phase 3: lessons percentage real for every stage. Phase 4: 500 plus free signups in a month. Phase 5: month three retention above 80 percent. The £10k MRR maths lives in plans/mrr-10k-review.md.
