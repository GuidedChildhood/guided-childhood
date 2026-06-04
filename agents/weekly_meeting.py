"""Run the Guided Childhood weekly "Monday meeting".

Uses the hierarchical crew with Pulse as the manager agent. In hierarchical
mode the manager genuinely delegates to and collects from the six specialists,
so information passes between agents as Pulse chairs the meeting. The resulting
weekly strategic briefing is rendered as a branded HTML email and sent.

Run:  python agents/weekly_meeting.py
Env:  ANTHROPIC_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD
"""

from __future__ import annotations

import os
import sys
import traceback
from datetime import date

try:
    from agents.crew import build_weekly_crew
    from agents.email_template import render_briefing_html
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT
except ModuleNotFoundError:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from agents.crew import build_weekly_crew
    from agents.email_template import render_briefing_html
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT


def main() -> int:
    if not os.getenv("ANTHROPIC_API_KEY"):
        print("WARNING: ANTHROPIC_API_KEY not set — the run will likely fail.")

    today = date.today().isoformat()
    print(f"=== Guided Childhood weekly Monday meeting — week of {today} ===")

    result_text = ""
    try:
        crew, _agents = build_weekly_crew()
        result = crew.kickoff()
        result_text = str(result).strip()
    except Exception as exc:  # noqa: BLE001
        result_text = (
            f"⚠️ The weekly meeting could not complete this week: {exc}\n\n"
            "Please check ANTHROPIC_API_KEY and dependencies, then re-run "
            "manually via the GitHub Actions 'workflow_dispatch'."
        )
        print(f"!! Weekly meeting failed: {exc}")
        traceback.print_exc()

    # Render: a single Pulse-chaired strategic briefing.
    intro = (
        f"Weekly strategic briefing for the week of {today}, chaired by Pulse. "
        "All seven agents met; cross-team hand-offs and the week's priorities "
        "are below."
    )
    sections = {"Pulse": result_text}

    title = "Weekly Monday Meeting"
    html_body = render_briefing_html(
        title=title,
        intro=intro,
        sections=sections,
        order=["Pulse"],
        briefing_date=today,
    )
    text_body = f"Guided Childhood — {title} ({today})\n\n{intro}\n\n{result_text}"

    subject = f"🌳 Guided Childhood — Weekly Monday Meeting {today}"
    status = send_briefing_email(subject, html_body, text_body, DEFAULT_RECIPIENT)
    print(f"\n{status}")

    try:
        out_path = os.path.join(os.path.dirname(__file__), "last_weekly_meeting.html")
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(html_body)
        print(f"Saved local copy: {out_path}")
    except Exception:  # noqa: BLE001
        pass

    print("=== Weekly meeting complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
