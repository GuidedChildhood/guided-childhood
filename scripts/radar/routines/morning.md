# Morning run, 09:17 London, weekdays

The runbook for the scheduled Claude Code task "Stage 1 verification, after the
ChatGPT radar". The task's stored prompt carries the rules that never change
and points here for the steps, so the steps are reviewed in a pull request like
any other change.

Read `scripts/radar/README.md` first. It is the operating guide and this file
only orders its steps.

## Where this sits in the day

```
08:00  ChatGPT writes its brief, and one CANDIDATES document into the inbox
09:17  THIS RUN
11:00  ChatGPT reads the start here document and writes the packs
12:23  the midday run checks those packs (scripts/radar/routines/midday.md)
```

Do not move this earlier than ChatGPT's 08:00. If ChatGPT has written nothing
today, say so in one line, log the INBOX stage as it is, and carry on.

## 0. Tooling and the one register rule

1. Google Drive must be in the session. If it is not, say so in one line and
   stop. Never review from memory.
2. List open pull requests. **If one touches `content/research-register/`,
   check out its branch and carry on from it.** Never start a second register
   from main. Otherwise work from the latest main on a `claude/` branch.
3. `git fetch origin main` and merge it in if the branch is behind.

## 1. Read the inbox and the briefs

1. List every file in the inbox folder (`DRIVE.CANDIDATE_INBOX` in
   `contract.mjs`). Ignore the read me, `candidate.schema.json` and anything
   titled `ZZ`.
2. For each remaining file, download it (the download call, with a plain text
   export for a Google Doc) and pull the bytes out of the transcript:
   `python3 scripts/radar/drive-bytes.py auto <fileId> inbox/<fileId>__candidates`
3. Read ChatGPT's posting pack (`DRIVE.POSTING_PACK`) and save its text with
   `drive-text.py`, so candidates can be checked against it.
4. Read today's daily brief in folder `1Zs7SE-2sDIoZsyFxfYlcmfgLh7Nrb0It`.
   Run its text through `reconcileNumbers`. Where the brief and the register
   disagree about a number, a title or what is posted, **change nothing** and
   record it: `node scripts/radar/daily.mjs disagreement "<one sentence>"`.
5. A brief's recommendations are an input. Apply
   `.claude/skills/feedback-filter`. If the brief names research that is not
   in the inbox document, that is ChatGPT not using the inbox: say so in the
   summary, and do not carry the item across by hand.

## 2. The deterministic stages

```
node scripts/radar/daily.mjs morning --inbox inbox --posting-pack posting-pack.txt
```

This runs preflight, the inbox ingest, discovery and the automatic dossier,
logs each, and lists who is waiting for review. A HOLD is logged and the run
continues. Retitle each inbox document that was read `ZZ INGESTED <date>, ...`.
Never delete one.

## 3. The directed review, which only you can do

Review at most **three** records in one run, in this order: anything that came
through the inbox, then CORE, then ADJACENT, highest score first. The rest wait
for tomorrow and the summary says how many.

For each: gates C, D, E, G and H. Read the source itself, in full text where it
can be reached. A candidate's claims are the sender's and are checked, never
copied. Write `scripts/radar/reviews/<id>.json` in the shape of the existing
ones, then:

```
node scripts/radar/pipeline.mjs review <id>
```

The gate refuses a review with no claims, no limits, no contradictory
evidence, a future date or a dash. A finding that flatters what we sell gets
more scrutiny. Every cleared figure is one you read in the source in this run.
Verdict REJECT and HOLD are real answers: use them.

Then `node scripts/radar/daily.mjs log REVIEW PASS "<how many, which, how many wait>"`.

## 4. Numbers, handoffs and the queue

```
node scripts/radar/daily.mjs handoffs
```

It claims the next free GDC number for each cleared story in
`content/gdc-post-register.md`, builds the handoff, and rewrites the queue. It
is idempotent. Never claim a number any other way.

## 5. Packs that have come back

Follow section 2 onwards of `scripts/radar/routines/midday.md` for any Google
Doc in the Stage 2 folder whose title starts `PACK` and does not carry
`CLAUDE REVIEWED`. On most mornings there is none.

## 6. Copy to Drive, and verify

Commit, push and make sure the draft pull request is open **first**, so every
Drive copy is stamped with a commit that exists in GitHub. Then, following
"Copying to Drive" in the README exactly:

1. `node scripts/radar/sync.mjs state`. For each role that is not current, and
   for the handoff of each story cleared today: prepare, create in the Stage 2
   folder with conversion off, download, `drive-bytes.py`, `acceptSnapshot`.
2. Regenerate the start here document with `stage2Brief`, passing the Drive
   ids of the queue, the number list and every queued handoff
   (`links.handoffJsons` and `links.handoffDocs`, keyed by research id).
   Create it as a Google Doc titled as `stage2Brief` returns with `, CURRENT`
   on the end, verify with `verifyDocExport`, record with `acceptBrief`.
3. `node scripts/radar/approval.mjs approval.txt`. If `approvalDeskCurrent`
   says the Drive copy differs, create a new Doc titled as it returns with
   `, CURRENT, for Justin`, verify, record with `acceptApprovalDesk`.
4. Retitle everything replaced `ZZ SUPERSEDED`, with where the current one is.
5. Never compare by eye and never retype base64.
6. `node scripts/radar/daily.mjs log "DRIVE SYNC" PASS "<what was verified and at what level>"`,
   or HOLD with the reason.

## 7. The desks

- **Post Desk** (`tools/post-desk/desk-data.json`, built with
  `python3 tools/post-desk/build.py`, published to
  `https://claude.ai/artifact/Xb6Jt6JAm2d3wrF7WXxeGY`): a pack goes on it only
  at ASSETS READY. Never create a second desk.
- **Radar Desk**: `npm run radar-dashboard` from a clean commit, published to
  `https://claude.ai/artifact/V6Qj5WeavwNvEt4Gyam3Bi`. Never a second one.
- `node scripts/radar/daily.mjs log "APPROVAL DESK" PASS "<what is on it>"`.

## 8. Finish

```
node scripts/radar/gate.mjs
npm run radar-pipeline-test && npm run radar-relay-test
npm run ai-tells && npm run context-guard
node scripts/radar/pipeline.mjs preflight      # after the last commit and push
node scripts/radar/daily.mjs summary
```

Push. The pull request must be open and its body must say what the run did.
If the previous pull request for the branch has merged, restart the branch
from the latest main: a merged pull request cannot carry new work.

The message to Justin is the output of `daily.mjs summary`, preceded by three
lines: what was verified and the verdicts, what is ready for him and what is
with ChatGPT, and what he needs to decide. Any disagreement, any HOLD and any
pull request that needs merging go in the third line.
