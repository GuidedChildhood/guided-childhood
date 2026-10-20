# The Guided Planet

The monthly illustrated newspaper for children aged 7 to 12 and their families,
from The Guided Digital Childhood. *The good side of screens. A little more
wonder. A lot more understanding.*

This folder is the system that makes every edition. Justin is the Editor in
Chief, not the production department: each edition asks him twice, and the
routine does the rest.

## Who it is for

Three people touch every issue, and each page has to work for all three.

| | Who | What they need from the paper |
| --- | --- | --- |
| **The reader** | A child aged 7 to 12, reading with a grown up. The heart is primary school, Years 3 to 6 (7 to 11); the oldest pages stretch to Year 7. | Short words, big pictures, something to do on every page, never a phone or an account |
| **The chooser** | A UK parent of a primary age child, many of whom followed us as Inspired by Alma (party, craft and celebration design, a boho look). They find the paper on the family Instagram or Facebook, or as a free download. | Something beautiful enough to print, keep and share; screen time that feels positive rather than a fight; a plan, not a ban |
| **The passer on** | A primary teacher, a DSL, a club leader | Free to copy, sources on every page, links to the curriculum |

The chooser decides whether the paper is downloaded, printed and shared, so
the cover and every page preview have to win that parent first; the activities then
have to deliver for the child. That is why the paper wears the Happy News
design system, the same one as The Planet Post, the free four page taster that
leads into it (Justin, 15 October 2026): one family, one look.

## For Justin: the two approvals, about 20 to 30 minutes an edition

You get an email each time, with a link to **/dashboard/admin/planet**.

1. **Approval one, week one.** "Here are the proposed stories." Each card shows
   the story, its score out of 100, its source (tap to open it) and what the
   evidence cannot tell us. Tap Approve, Reject or Needs a revision on each, then
   **Approve these stories** or **Request changes** with a note. About 10 minutes.
2. **Approval two, week three.** "Here is the finished newspaper." Open the PDF,
   scan both QR codes on page 12 with your phone, open a source wherever a number
   matters to you. **Approve the paper** or **Request revisions**. About 15 minutes.
3. **Authorise publication.** Tick the channels and press Authorise. The routine
   does the website and a draft email; social posts are prepared for you to post.

Nothing is published without approval two, and the approval is for the exact
PDF you looked at: if one word changes afterwards, the approval no longer
counts and the paper comes back to you.

## What exists, and where

| | |
| --- | --- |
| Issue 001, The Curiosity Edition | `issues/001/` : `issue.json` (the words), `research.json` (13 candidates, scored), `distribution.json` (email and social words), `dist/` (PDFs, previews, online edition, report) |
| Issue 002, sample | `issues/002/` : the Real or Pretend Edition, made from words alone through the same templates. Watermarked, never published. Its story pages are placeholders until its research week. |
| The design system | `design/newspaper.css`, the Happy News theme `design/happy.css` (on for every issue since 15 October 2026, shared with The Planet Post), the earlier boho theme `design/boho.css`, written rules in `design/DESIGN-SYSTEM.md` |
| The world | `WORLD.md`: the six destinations and Bloop's job |
| The templates | `templates/index.ts` (nine page templates), `templates/art.ts` (our own drawings), `templates/online.ts` (the accessible edition) |
| The engine | `engine/` (schema, validators, workflow, stores, hashes, the character library check) |
| The renderer | `pdf-engine/render.ts` and `pdf-engine/checks.ts` |
| Research | `research/sources.json`, `research/scoring.ts`, `research/run.ts` |
| Drafting | `editorial/draft.ts` |
| Higgsfield | `higgsfield/recipes.json`, `higgsfield/brief.ts`, `higgsfield/README.md` |
| Distribution | `distribution/package.ts`, `distribution/motion.ts`, `distribution/publish.ts` |
| The routine | `automation/cycle.ts`, `.github/workflows/guided-planet.yml` |
| The desk | `app/(dashboard)/dashboard/admin/planet`, `app/api/admin/planet/route.ts`, fixture at `/dev/planet-desk` |
| The database | `supabase/migrations/377_the_guided_planet.sql` |
| Tests | `tests/` (34), `npm run planet-test` |

## The commands

All of it runs as `npm run planet -- <command> <issue>`. Nobody has to run these
by hand once the routine is switched on; they are here for a session or a person
who wants to.

| Command | What it does |
| --- | --- |
| `check 1` | The editorial gate only: twelve pages, every citation verified, no dash, no stock phrase |
| `render 1` | Three PDFs (print with 3mm bleed, download, ink saver), the sources PDF, the previews, the online edition, and every layout check |
| `links 1` | Fetches every link in the issue |
| `higgsfield 1` | The illustration brief and the credit gate, spending nothing |
| `status 1` | Where the issue is and what it waits on |
| `cycle` | The monthly routine: the next automatic step for every open issue |
| `sync 1` | Pushes the issue, its stories and its proofs to the dashboard |
| `package 1` | The publication package, only after final approval (`--preview` builds a labelled preview) |
| `publish 1 website` | One channel, never twice for the same PDF |
| `publish-authorised 1` | Whatever Justin authorised in the dashboard |
| `art-record`, `art-pull` | The Higgsfield ledger, see `higgsfield/README.md` |

## The monthly cycle

The routine runs every Monday (and by hand from the Actions tab). Each run does
the next automatic step and stops at the gates. A failed step is logged and
tried again next run; a failed image or video never holds anything up, because
every page has its own drawings.

| Week | The routine | Justin |
| --- | --- | --- |
| One, discovery | Opens the new edition in the first week of the month once the last one is approved; sweeps the sources with web search; fetches each source page and checks the quoted words are on it; scores and shortlists | Approval one |
| Two, editorial | Drafts the twelve pages from the approved stories in the same templates, and revises until the editorial gate passes | |
| Three, production | Renders, measures every page, fixes overflow with a redraft, makes the proofs; Higgsfield art only within an approved budget | Approval two |
| Four, release | Builds the package; carries out the authorised channels; opens a pull request for the website | Merges the website pull request; posts on social |

## Setting it up: what is needed, in order

Everything below is switched off until it is set, and every step says plainly
what it skipped. Nothing here costs money until the step says so.

1. **Apply migration 377** (`supabase/migrations/377_the_guided_planet.sql`).
   Additive, service role only, no parent or child data. It also creates the
   private `guided-planet` storage bucket.
2. **Sync Issue 001** so it appears on the desk: `npm run planet -- sync 1`
   with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` set.
3. **GitHub Actions secrets** for the routine: `ANTHROPIC_API_KEY` (research and
   drafting), `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
   `RESEND_API_KEY` and `FOUNDER_NOTIFY_EMAIL` (the approval emails). Settings,
   Secrets and variables, Actions, in the repository on GitHub.
4. **Email for the newspaper list: Resend** (Justin, 14 October 2026). The
   house email, one sender reputation, no second account. The channel is
   being moved from a Mailchimp draft campaign to a Resend draft broadcast;
   until that lands, the code still has the Mailchimp channel. Either way
   the engine only ever creates a draft, and Justin presses send.
5. **Google Drive** has no API code in this repo, only the connector in Claude
   sessions. A session uploads the package to "Guided Childhood Research / The
   Guided Planet / Issue NNN" when asked.
6. **Higgsfield**: name a credit budget per issue on the desk. See
   `higgsfield/README.md`.

## Running costs, honestly

| | Per edition | Notes |
| --- | --- | --- |
| Rendering, checks, motion | nothing | Chromium and ffmpeg on a GitHub runner, inside the free minutes |
| Research and drafting | not yet measured | Two to five long Claude calls with web search; the first live run records the real cost in the Anthropic console. No figure is guessed here. |
| Higgsfield art | 0 by default | Every page has vector art. Drafts are about 1 credit each on GPT Image 2.5 (the repo's mood stills run, 13 September 2026), so Issue 001's seven drafts would be about 7 credits; finals are measured on first use. The balance on 13 October 2026 was 1,107 credits on Plus. |
| Hosting | nothing new | Static files on the existing Vercel project |
| Email | the existing Resend plan, or Mailchimp's | |

## The rules this system keeps, in code

- Evidence or silence: a cited source must be verified, and our own code checks
  the quoted words are on the page. Association is never written as causation.
- Characters are never generated: the approved Planet Friends are composited,
  and a changed character file fails its hash check.
- Text stays text: every word is selectable and searchable, art is separate.
- No dashes, no stock phrases: the repo's own `scripts/check-ai-tells.mjs`.
- Nothing published without approval two, bound to the PDF by hash; every
  channel runs once.
- No child data: activities need no phone or account; the paper never asks a
  child for a surname, an address or a photo.
