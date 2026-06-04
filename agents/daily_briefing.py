"""Run the Guided Childhood daily briefing.

Strategy for graceful degradation:
  We run the six specialist tasks individually (each wrapped in try/except) so
  that if any ONE agent fails, the others still produce output. We then hand the
  collected outputs to Pulse to compile, render a branded HTML email, and send
  it. Even Pulse failing does not stop the email — we fall back to compiling the
  raw sections ourselves.

Run:  python agents/daily_briefing.py
Env:  ANTHROPIC_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD
"""

from __future__ import annotations

import os
import sys
import traceback
from datetime import date

# Support running both as `python agents/daily_briefing.py` and `-m agents...`.
try:
    from agents.crew import build_agents, build_daily_tasks, build_llm
    from agents.email_template import render_briefing_html, render_plain, AGENT_META
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT
except ModuleNotFoundError:  # running from inside the agents/ folder
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from agents.crew import build_agents, build_daily_tasks, build_llm
    from agents.email_template import render_briefing_html, render_plain, AGENT_META
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT

from crewai import Crew, Process

# Order in which specialists run, and the display order in the email.
SPECIALISTS = ["scout", "guardian", "navigator", "sage", "herald", "compass"]
DISPLAY = {
    "scout": "Scout",
    "guardian": "Guardian",
    "navigator": "Navigator",
    "sage": "Sage",
    "herald": "Herald",
    "compass": "Compass",
}


def _run_single(agent, task) -> str:
    """Run one agent+task in an isolated 1-task crew. Returns text or error."""
    mini = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    result = mini.kickoff()
    return str(result).strip()


def main() -> int:
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("WARNING: ANTHROPIC_API_KEY not set — the run will likely fail.")

    today = date.today().isoformat()
    print(f"=== Guided Childhood daily briefing — {today} ===")

    llm = build_llm()
    agents = build_agents(llm)
    tasks = build_daily_tasks(agents)

    sections: dict[str, str] = {}
    failures: list[str] = []

    # --- Run the six specialists, each fault-isolated -------------------- #
    for key in SPECIALISTS:
        name = DISPLAY[key]
        print(f"\n--- Running {name} ---")
        try:
            output = _run_single(agents[key], tasks[key])
            sections[name] = output or "(no output produced)"
        except Exception as exc:  # noqa: BLE001
            failures.append(name)
            sections[name] = f"⚠️ {name} could not complete today: {exc}"
            print(f"!! {name} failed: {exc}")
            traceback.print_exc()

    # --- Pulse compiles the briefing ------------------------------------ #
    # Feed the collected sections to Pulse as explicit context text so it
    # compiles a clean top-line summary even if some agents failed.
    collected = "\n\n".join(
        f"### {name}\n{text}" for name, text in sections.items()
    )
    pulse_intro = (
        f"You are compiling the Guided Childhood morning briefing for {today}.\n"
        "Below are the outputs already produced by the six specialist agents. "
        "Write a concise 3-4 sentence top-line summary for a busy founder: the "
        "single most important thing today, progress toward £1M ARR, and the "
        "one action to take. Do NOT repeat each section in full — just the "
        "executive summary. If any section is marked with ⚠️ it failed; "
        "acknowledge briefly and move on.\n\n"
        f"AGENT OUTPUTS:\n{collected}"
    )

    intro = ""
    try:
        from crewai import Agent, Task

        summary_task = Task(
            description=pulse_intro,
            expected_output="A 3-4 sentence executive summary for the founder.",
            agent=agents["pulse"],
        )
        intro = _run_single(agents["pulse"], summary_task)
    except Exception as exc:  # noqa: BLE001
        intro = (
            f"Daily briefing for {today}. "
            f"{len(sections) - len(failures)}/{len(SPECIALISTS)} agents reported "
            "successfully."
            + (f" Issues: {', '.join(failures)}." if failures else "")
        )
        print(f"!! Pulse summary failed, using fallback: {exc}")

    # --- Render + send --------------------------------------------------- #
    display_order = [DISPLAY[k] for k in SPECIALISTS]
    title = "Daily Briefing"
    html_body = render_briefing_html(
        title=title,
        intro=intro,
        sections=sections,
        order=display_order,
        briefing_date=today,
    )
    text_body = render_plain(title, intro, sections, display_order)

    subject = f"🌳 Guided Childhood — Daily Briefing {today}"
    status = send_briefing_email(subject, html_body, text_body, DEFAULT_RECIPIENT)
    print(f"\n{status}")

    # Save a local copy for debugging / archive.
    try:
        out_path = os.path.join(os.path.dirname(__file__), "last_briefing.html")
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(html_body)
        print(f"Saved local copy: {out_path}")
    except Exception:  # noqa: BLE001
        pass

    print("=== Daily briefing complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
