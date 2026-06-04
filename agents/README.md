# Guided Childhood — 7-Agent Crew

A CrewAI multi-agent system for **Guided Childhood**, a UK platform helping
children aged 4-16 navigate digital life safely. Mission: **£1,000,000 ARR** +
making children safer and better educated online.

Seven agents run a **daily briefing** and a weekly **Monday meeting**, then
email a branded HTML briefing to `justin@thesocialbillboard.com`.

## The agents

| Emoji | Agent | Remit |
|------|-----------|-------|
| 🔭 | **Scout** | Research & market intelligence (UK education / safeguarding news) |
| 🛡️ | **Guardian** | Safeguarding & child-safety watch (NSPCC, Ofsted, Ofcom, gov) |
| 🧭 | **Navigator** | LinkedIn & sales growth — 5 DSL/Head/PSHE targets + messages |
| ✍️ | **Sage** | Content & thought leadership — a ready-to-publish LinkedIn post |
| 📣 | **Herald** | PR & media — top opportunity + a 3-sentence pitch |
| 🎯 | **Compass** | Revenue & the £1M mission — snapshot + one tactical action |
| 💓 | **Pulse** | Operations — compiles everything, sends the email, chairs the weekly meeting |

## How the agents pass information to each other

- **Daily** (`Process.sequential`): Scout → Guardian → Navigator → Sage →
  Herald → Compass → Pulse. Context is wired explicitly in `crew.py`:
  - Sage's post is informed by Scout's news.
  - Herald's pitch references Scout's intelligence.
  - Navigator's outreach uses Scout + Guardian.
  - Pulse compiles from **all six**.
- **Weekly** (`Process.hierarchical`): **Pulse is the manager** and delegates to
  the six specialists, genuinely passing information between them.

Each specialist is run fault-isolated in the daily runner, so **if one agent
fails, Pulse still compiles the briefing from the others.**

## Setup

```bash
pip install -r agents/requirements.txt
cp agents/.env.example agents/.env   # then fill in your keys
```

Required env vars / GitHub secrets:
`ANTHROPIC_API_KEY`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`
(`GMAIL_APP_PASSWORD` is a Google App Password, not your login password).

## Run

```bash
python agents/daily_briefing.py     # compiled morning briefing
python agents/weekly_meeting.py     # full Monday meeting
```

A local HTML copy is saved as `last_briefing.html` / `last_weekly_meeting.html`.

## Automation (GitHub Actions)

- `.github/workflows/daily_briefing.yml` — daily at 07:00 UTC.
- `.github/workflows/weekly_meeting.yml` — Mondays at 09:00 UTC.

Both also support manual `workflow_dispatch` runs. Add the three secrets under
**Settings → Secrets and variables → Actions**.

> **Note on Actions paths:** GitHub only runs workflows from `.github/workflows`
> at the **repository root**. If this project lives in a subfolder, move the two
> YAML files to `<repo-root>/.github/workflows/` (the `python agents/...` paths
> inside them already assume the repo root).

## Revenue tracking

Edit `agents/revenue_data.json` as deals close — Compass reads it each morning
to compute the gap to £1M and recommend the next action.

## LLM

Claude via CrewAI's `LLM` class, model `claude-opus-4-8`.
