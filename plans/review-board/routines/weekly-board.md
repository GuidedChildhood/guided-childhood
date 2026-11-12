# Weekly review board: the scheduled run

Added 12 November 2026 (board task `board-routine-saves-its-run`). The Friday
routine fires at 06:49 London time and follows this file. Read it from
`origin/main`, never from a checkout on disk. The rules in the routine's own
message win over anything here.

**Why it exists.** The routine fired every Friday from 17 October to
6 November and saved nothing. The 6 November run started with no repository
(`config:no-git-repo`), finished in 71 seconds, and left no run file, no
scorecard and no pull request. Its last instruction pointed at a branch and a
pull request (1288) that merged in October. The radar routine failed the same
way on 11 November: the run believed it had no way to attach the repository,
and it did. A scheduled run also has no tool that lists pull requests, so any
step that depends on one stops the run.

## 1. Get the repository with push access, and prove the push

The tool is `add_repo` on the claude-code-remote server
(`mcp__claude-code-remote__add_repo`, or `mcp__Claude_Code_Remote__add_repo`).
If it is not in the visible tool list it is deferred: search the tools for
`add_repo` and load it. Call it with owner `GuidedChildhood`, repo
`guided-childhood`, access `push`, BEFORE cloning, and clone the way its answer
says. Do not check the repository any other way first.

Then, before any other work:

```
git fetch origin --prune
git checkout -B claude/review-board-<date> origin/main
git push --dry-run origin HEAD:refs/heads/claude/review-board-<date>
```

If the dry run is refused, call `add_repo` again with access `push` and try
once more. If it is still refused, do the whole run anyway and print the full
report in the reply (step 5).

## 2. The week, found with git

Follow `.claude/skills/review-board/SKILL.md` Phase 0, with these swaps for a
scheduled run:

- **Open pull requests.** If no tool lists them, use git:
  `git for-each-ref --sort=-committerdate --format="%(committerdate:short) %(refname:short)" refs/remotes/origin/claude/ | head -30`
  and for each branch from the last seven days, `git log origin/main..<ref> --oneline | head -3`.
  A branch with commits main does not have is open work. Say in the brief that
  the list came from branches, not pull requests.
- **The routines.** `list_triggers` if it is there. If not, name the routines
  from `plans/review-board/README.md` and say their state is unknown.
- **Real behaviour.** The routine has no Supabase connector, so the pulse line
  is "unknown" unless the connector is in the session. Write "unknown", never a
  number from memory or from last week's report.

## 3. The lenses, the skeptic, the chief

SKILL.md Phases 1 to 3, unchanged. If an agent type is not found, use the
general purpose fallback the skill describes. A lens that fails twice is left
out and named.

## 4. Write it down

SKILL.md Phase 4, unchanged: run file, `npm run review-board -- ingest`,
`npm run review-board-test`, `npm run ai-tells`.

## 5. Never finish without a trace

Whatever happens, before stopping:

1. `plans/review-board/runs/<date>.md` exists. If the run stopped early, write
   it by hand with what was done, what was not and why, under the heading
   `# Review board <date>: incomplete`, and still commit it.
2. Commit only `plans/review-board/`, push `claude/review-board-<date>`.
3. If a pull request tool is in the session, open a pull request titled
   `Review board <date>: <n> of 11 at ten`. If not, say so in the reply and
   give the branch name so Justin can open it.
4. If the push was refused, print the whole run report in the reply and say
   plainly in the first line that it could not be saved. Never say it was
   saved when it was not.

A run that leaves no file is indistinguishable from a run that never happened.

## 6. Hand over

Publish the dashboard to the URL in `scorecard.json` if the Artifact tool is
there (say so if it is not). Then three lines for Justin: the scores and what
moved, the one thing, what he needs to do. Then the dashboard link and the
branch or pull request.

This is a scheduled run with nobody to answer, so skip the session start
alert's questions.
