# Midday run, 12:23 London, weekdays

The runbook for the scheduled Claude Code task "Stage 3, packs back from
ChatGPT". It exists so a pack ChatGPT writes at 11:00 reaches Justin the same
day instead of the next morning.

Read `scripts/radar/README.md` first, in particular "Who fixes a pack that is
not right".

This run does **not** discover research, review research or claim numbers.
Those are the morning run's. If no pack is waiting, say so in one line, log it,
and stop: finding nothing is a result.

## 0. Tooling and the one register rule

Same as the morning run: Drive must be in the session, and if an open pull
request touches `content/research-register/`, carry on from its branch.

## 1. Find the packs

In the Stage 2 folder (`DRIVE.STAGE2_FOLDER`), every Google Doc whose title
starts `PACK` and does not carry `CLAUDE REVIEWED`, `READY FOR JUSTIN` or `ZZ`.
A finished pack is moved into the Founder Approval Desk folder, so what is
left in the Stage 2 folder is work in progress.

If there is none: `node scripts/radar/daily.mjs log "PACK QA" PASS "no pack was waiting"`
and go to step 6.

## 2. The automatic checks

For each pack, read it, then pull exactly what Drive returned:

```
python3 scripts/radar/drive-text.py auto "<its title>" packs/<fileId>__pack.txt
node scripts/radar/daily.mjs packs packs
```

Every pack gets PASS or HOLD with reasons. The same text is never submitted
twice.

## 3. Who fixes what

- **A breach of the handoff goes back to ChatGPT.** An uncleared figure, a
  prohibited claim, a wrong or invented number, an old handoff version, a
  causal claim, a format the handoff did not ask for. Do not repair it and do
  not pass it. The reasons reach ChatGPT through the start here document.
- **Voice and house style you edit yourself**, under
  `.claude/skills/content-engine/drive-post-review.md`: rhythm
  (`npm run rhythm`), the shapes the ai-tells guard cannot see, the proof
  path, the repost ask before the question, the line saying the source is in
  the comments. Keep ChatGPT's argument, order and good sentences. Use only
  cleared figures. Save the edit as a new Google Doc titled
  `PACK <research id> GDC-<number> DRAFT v<n+1>, Claude edit of v<n>`, verify
  it with `verifyDocExport`, parse it back from what Drive holds, and submit
  that. Retitle the version you edited with `CLAUDE REVIEWED <date>, edited,
  use v<n+1>`. Never delete it.

## 3a. The visual decision, and a film only when it earns one

Justin, 11 November 2026: decide for each story whether text, a still image, a
carousel or a motion graphic fits, on the performance evidence and editorial
judgement, "not a rule that every post needs an image".

1. Read the newest report in `content/analytics/`. Then record the decision
   with `decideVisual` in `assets.mjs`: the choice and the reason in a
   sentence. **Text only is the default while the evidence is silent**, and the
   handoff's own formats still bind.
2. A film is made from code, in the house look, by the method in
   `.claude/skills/explainer-video` and `talking-head-video/motion-standard.md`.
   Only words the review cleared go on screen. No chart, no number that is not
   cleared, no platform logo, no invented screen, no person, no character.
3. `recordAsset` runs `ffprobe` and a full decode, hashes the file and stores
   your review of the frames you looked at. An asset that does not verify, or
   was not looked at, holds the pack. Upload the file to the Founder Approval
   Desk folder with conversion off and record it with `recordAssetDrive`.
4. **If production fails, record the failure** (`recordAsset` with `failure`)
   and the pack goes forward as text only with the failure on the sheet. Never
   put a generated image in its place.

## 4. Review, save, ready

1. `reviewPack` with real notes: what ChatGPT got right, what you changed and
   why, and when you edited, the plain statement that the editor and the
   reviewer are the same, the mechanical checks are independent, and whether
   it sounds like Justin is his to judge.
2. `recordPackSave` with the verification of the Drive copy.
3. `node scripts/radar/pipeline.mjs ready <id>`. That is as far as you go.
   Once it passes, retitle the Doc Justin will open so it no longer says
   DRAFT: `PACK <research id> GDC-<number> v<n> READY FOR JUSTIN, checked <date>`.
   Then move that Doc into the Founder Approval Desk folder.
   A draft is never shown as the final version.
4. `node scripts/radar/daily.mjs log "PACK REVIEW" PASS "<which packs, which verdicts>"`.

**Never call `approve`. Never call `requestChanges` unless Justin's own words
asking for the change are in front of you. Never call `publish` without a URL
he has given you.**

## 5. Put it in front of Justin

1. Add each pack that reached ASSETS READY to the top of `posts` in
   `tools/post-desk/desk-data.json`, with a `checked` note saying where it
   came from, how many checks it passed, whether you edited it, and that it is
   not approved until he says so. Build, look at it at phone width, publish to
   the same Post Desk URL.
2. Regenerate the approval sheet and the start here document, copy both to
   Drive and verify them, as in section 6 of the morning runbook. The approval
   sheet goes in the Founder Approval Desk folder (`DRIVE.APPROVAL_DESK_FOLDER`),
   whose link never changes. The start
   here document carries what happened to each pack, which is how ChatGPT
   learns a pack was held.
3. Rebuild and publish the Radar Desk.
4. `node scripts/radar/daily.mjs log "APPROVAL DESK" PASS "<what is on it>"`.

## 5a. The Metricool handoff, in Drive where ChatGPT can read it

ChatGPT cannot read this repository. For every pack that reached READY FOR
JUSTIN or APPROVED in this run, and for any whose status changed:

    node scripts/radar/metricool.mjs handoff <researchId>
    npm run radar-reconcile

Copy content/publication/metricool-handoff-GDC-NNN.json into the Founder
Approval Desk folder as a document titled `METRICOOL HANDOFF GDC-NNN`, replacing
the earlier one (retitle the old one with ZZ in front, never leave two). Read
it back. The file says whether a draft may be made and whether it may be
scheduled, and both are no until Justin has approved. Never change those two
lines by hand.

## 6. Finish

```
node scripts/radar/gate.mjs
npm run radar-pipeline-test && npm run radar-relay-test
npm run ai-tells
node scripts/radar/pipeline.mjs preflight
node scripts/radar/daily.mjs summary
```

Commit and push to the day's branch. Make sure the pull request is open. The
message to Justin is three lines, then the summary: which packs were checked
and the verdicts, what is now ready for him on the Post Desk, and what he needs
to decide.
