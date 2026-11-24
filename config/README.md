# Where to change the content engine

One file: `config/content-engine.json`. Edit it in GitHub (pencil icon), commit
to main, and the next run uses it. Nothing else needs changing for these.

| I want to change | Edit this part | Takes effect in |
|---|---|---|
| Stop everything after research | `pause.all: true` | every stage reads it before writing or handing off |
| Keep producing but stop scheduling | `pause.scheduling: true` | START HERE tells ChatGPT not to schedule; the Metricool handoff says so |
| Posts a week | `linkedin.personalPostsPerWeek` | START HERE, the reserve rule |
| Posting time | `linkedin.time` | START HERE, the Metricool handoff |
| Post length, opening, closing question | `linkedin.words`, `linkedin.characters`, `linkedin.opening`, `linkedin.closingQuestion` | the pack checks (QA) and START HERE |
| Which formats a pack carries | `formats` (`required`, `where_appropriate`, `when_the_handoff_asks`) | the pack checks and START HERE |
| How many finished packs to keep in reserve | `reserve.targetFinishedPacks` | START HERE |
| Visual style and sizes | `visual` | visual briefs, the motion engine's checks |
| Motion rules and the paid rendering limit | `motion` | the motion engine run |
| Newsletter day, length and parts | `newsletter` | the weekly newsletter run |
| Scheduling rule | `scheduling` | START HERE, the Metricool handoff |
| What runs without asking | `permissions` (A to F) | every stage; automatic publishing only turns on with the exact word `"on"` |
| Daily report | `notifications` | ChatGPT's 14:30 task |
| Philosophy, voice, audiences, research checks | `philosophy`, `voice`, `audiences`, `research` | the founder voice skill, the research review |

Rules that are not settings, and never change here:

- GDC numbers are claimed only in `content/gdc-post-register.md`.
- Only Justin approves, marks posted, or turns on automatic publishing.
- Claude has no Metricool access; Metricool actions are ChatGPT's.
- No dashes in any copy.

The code reads the file through `scripts/radar/settings.mjs`. A broken or
missing file stops the run with an error rather than falling back to old
defaults.
