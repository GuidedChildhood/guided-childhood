"""Run the Guided Childhood daily briefing.

After each run, saves agent outputs to agents/outputs/latest.json so the
Mission Control dashboard can display them live.

Run:  python agents/daily_briefing.py
Env:  ANTHROPIC_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD
"""

from __future__ import annotations

import json
import os
import sys
import traceback
from datetime import datetime, timezone

# Support running as `python agents/daily_briefing.py` from repo root.
try:
    from agents.crew import build_agents, build_daily_tasks, build_llm
    from agents.email_template import render_briefing_html, render_plain
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT
except ModuleNotFoundError:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from agents.crew import build_agents, build_daily_tasks, build_llm
    from agents.email_template import render_briefing_html, render_plain
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT

from crewai import Crew, Process

SPECIALISTS = ["scout", "guardian", "navigator", "sage", "herald", "compass"]
DISPLAY = {
    "scout":    "Scout",
    "guardian": "Guardian",
    "navigator":"Navigator",
    "sage":     "Sage",
    "herald":   "Herald",
    "compass":  "Compass",
}

AGENT_META = {
    "Scout":     ("🔭", "Research & Market Intelligence"),
    "Guardian":  ("🛡️", "Safeguarding & Child Safety"),
    "Navigator": ("🧭", "LinkedIn & Sales Growth"),
    "Sage":      ("✍️", "Content & Thought Leadership"),
    "Herald":    ("📣", "PR & Media"),
    "Compass":   ("🎯", "Revenue & £1M Mission"),
    "Pulse":     ("💓", "Daily Operations"),
}


def _run_single(agent, task) -> str:
    mini = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    result = mini.kickoff()
    return str(result).strip()


def _save_outputs(sections: dict, intro: str, failures: list) -> None:
    """Save agent outputs to agents/outputs/latest.json for the dashboard."""
    now = datetime.now(timezone.utc)
    agents_data = {}
    for name, output in sections.items():
        emoji, role = AGENT_META.get(name, ("•", ""))
        agents_data[name] = {
            "emoji": emoji,
            "role": role,
            "output": output,
            "status": "error" if name in failures else "ok",
        }

    payload = {
        "run_date": now.strftime("%Y-%m-%d"),
        "run_time": now.strftime("%H:%M UTC"),
        "run_timestamp": now.isoformat(),
        "status": "complete" if not failures else f"partial ({len(failures)} failed)",
        "summary": intro,
        "agents": agents_data,
    }

    out_dir = os.path.join(os.path.dirname(__file__), "outputs")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "latest.json")
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, indent=2, ensure_ascii=False)
    print(f"Saved outputs to {out_path}")


def main() -> int:
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("WARNING: ANTHROPIC_API_KEY not set — the run will likely fail.")

    now = datetime.now(timezone.utc)
    today = now.strftime("%Y-%m-%d")
    print(f"=== Guided Childhood daily briefing — {today} ===")

    llm = build_llm()
    agents = build_agents(llm)
    tasks = build_daily_tasks(agents)

    sections: dict[str, str] = {}
    failures: list[str] = []

    for key in SPECIALISTS:
        name = DISPLAY[key]
        print(f"\n--- Running {name} ---")
        try:
            output = _run_single(agents[key], tasks[key])
            sections[name] = output or "(no output produced)"
        except Exception as exc:
            failures.append(name)
            sections[name] = f"⚠️ {name} could not complete today: {exc}"
            print(f"!! {name} failed: {exc}")
            traceback.print_exc()

    # Pulse compiles a top-line summary
    collected = "\n\n".join(f"### {n}\n{t}" for n, t in sections.items())
    pulse_prompt = (
        f"Compile the Guided Childhood morning briefing for {today}.\n"
        "Write a concise 3-4 sentence executive summary: the single most "
        "important thing today, progress toward £1M ARR, and the one action "
        "to take. Sections marked ⚠️ failed — acknowledge briefly.\n\n"
        f"AGENT OUTPUTS:\n{collected}"
    )

    intro = ""
    try:
        from crewai import Task
        summary_task = Task(
            description=pulse_prompt,
            expected_output="A 3-4 sentence executive summary for the founder.",
            agent=agents["pulse"],
        )
        intro = _run_single(agents["pulse"], summary_task)
    except Exception as exc:
        intro = (
            f"Daily briefing for {today}. "
            f"{len(sections) - len(failures)}/{len(SPECIALISTS)} agents reported."
            + (f" Issues: {', '.join(failures)}." if failures else "")
        )
        print(f"!! Pulse summary failed, using fallback: {exc}")

    # Save JSON for the dashboard (must happen before email send)
    try:
        _save_outputs(sections, intro, failures)
    except Exception as exc:
        print(f"!! Could not save outputs JSON: {exc}")

    # Render + send email
    display_order = [DISPLAY[k] for k in SPECIALISTS]
    html_body = render_briefing_html(
        title="Daily Briefing",
        intro=intro,
        sections=sections,
        order=display_order,
        briefing_date=today,
    )
    text_body = render_plain("Daily Briefing", intro, sections, display_order)
    subject = f"🌳 Guided Childhood — Daily Briefing {today}"
    status = send_briefing_email(subject, html_body, text_body, DEFAULT_RECIPIENT)
    print(f"\n{status}")

    print("=== Daily briefing complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
