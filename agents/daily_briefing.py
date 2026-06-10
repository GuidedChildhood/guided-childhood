"""Run the Guided Childhood daily briefing.

Each agent runs with the real outputs of upstream agents injected into their
task description — so Navigator literally reads Scout's intelligence and
Guardian's safeguarding watch before deciding who to target, Sage uses Scout's
news hook, Diego reads Scout's research AND Sage's post so he takes a different
LinkedIn angle, and so on. Pulse compiles everything into the founder email.

Run:  python agents/daily_briefing.py
Env:  ANTHROPIC_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD
"""

from __future__ import annotations

import json
import os
import sys
import textwrap
import traceback
from datetime import date, datetime, timezone

# CrewAI validates OPENAI_API_KEY at import time even when using Claude.
# Set a dummy value so the validation passes — it is never sent to OpenAI.
os.environ.setdefault("OPENAI_API_KEY", "sk-not-used-we-use-anthropic-claude")

try:
    from agents.crew import build_agents, build_llm, TASKS_CFG
    from agents.email_template import render_briefing_html, render_plain
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT
except ModuleNotFoundError:
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from agents.crew import build_agents, build_llm, TASKS_CFG
    from agents.email_template import render_briefing_html, render_plain
    from agents.tools.email_tool import send_briefing_email, DEFAULT_RECIPIENT

from crewai import Crew, Process, Task

TODAY = date.today().isoformat()

# Run order — each key maps to its tasks.yaml entry.
# Diego runs after Sage so he can read her post and take a different angle.
SPECIALISTS = ["scout", "guardian", "navigator", "sage", "herald", "compass", "diego"]

DISPLAY = {
    "scout":     "Scout",
    "guardian":  "Guardian",
    "navigator": "Navigator",
    "sage":      "Sage",
    "herald":    "Herald",
    "compass":   "Compass",
    "diego":     "Diego",
}

AGENT_META = {
    "Scout":     ("\U0001f52d", "Research & Market Intelligence"),
    "Guardian":  ("\U0001f6e1️", "Safeguarding & Child Safety"),
    "Navigator": ("\U0001f9ed", "LinkedIn & Sales Growth"),
    "Sage":      ("✍️", "Content & Thought Leadership"),
    "Herald":    ("\U0001f4e3", "PR & Media"),
    "Compass":   ("\U0001f3af", "Revenue & £1M Mission"),
    "Diego":     ("\U0001f4ca", "Viral Research & Policy Content"),
    "Pulse":     ("\U0001f493", "Daily Operations"),
}

# Which agents each specialist should read before doing their work.
# Values are DISPLAY names so injected headers match.
CONTEXT_DEPS: dict[str, list[str]] = {
    "scout":     [],
    "guardian":  [],
    "navigator": ["Scout", "Guardian"],   # outreach hooks from news + safeguarding
    "sage":      ["Scout"],               # news hook for educator LinkedIn post
    "herald":    ["Scout", "Sage"],       # news peg + content angle Sage chose
    "compass":   [],                      # reads revenue_data.json directly
    "diego":     ["Scout", "Sage"],       # research hooks; must not duplicate Sage's angle
}


def _fmt(text: str) -> str:
    return text.strip().replace("{date}", TODAY)


def _build_task(key: str, agent, context_outputs: dict[str, str]) -> Task:
    """Create a Task with real upstream outputs injected into the description."""
    desc = _fmt(TASKS_CFG[f"{key}_task"]["description"])
    expected = _fmt(TASKS_CFG[f"{key}_task"]["expected_output"])

    deps = CONTEXT_DEPS.get(key, [])
    relevant = {name: context_outputs[name] for name in deps if name in context_outputs}

    if relevant:
        header = textwrap.dedent("""

            ---
            INTELLIGENCE FROM YOUR TEAM — you MUST read this, reference specific
            findings in your response, and build directly on what your colleagues
            have already found. Do not duplicate their work; extend it.
        """)
        blocks = []
        for name, output in relevant.items():
            blocks.append(f"\n### {name} says:\n{output}")
        desc = desc + header + "\n".join(blocks)

    return Task(description=desc, expected_output=expected, agent=agent)


def _run_single(agent, task: Task) -> str:
    mini = Crew(agents=[agent], tasks=[task], process=Process.sequential, verbose=True)
    return str(mini.kickoff()).strip()


def _save_outputs(sections: dict, intro: str, failures: list) -> None:
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
    key = os.getenv("ANTHROPIC_API_KEY", "")
    if not key:
        print("ERROR: ANTHROPIC_API_KEY is not set — add it to GitHub Secrets. Agents will fail.")
    else:
        print(f"ANTHROPIC_API_KEY set (length {len(key)}, starts {key[:8]}...)")

    print(f"=== Guided Childhood daily briefing — {TODAY} ===")

    llm = build_llm()
    agents = build_agents(llm)

    # Accumulated outputs keyed by DISPLAY name — shared between agents
    collected: dict[str, str] = {}
    sections: dict[str, str] = {}
    failures: list[str] = []

    for key in SPECIALISTS:
        name = DISPLAY[key]
        print(f"\n--- Running {name} (context: {CONTEXT_DEPS.get(key, [])}) ---")
        try:
            task = _build_task(key, agents[key], collected)
            output = _run_single(agents[key], task)
            result = output or "(no output produced)"
            sections[name] = result
            collected[name] = result          # make available to downstream agents
            print(f"✓ {name} complete ({len(result)} chars)")
        except Exception as exc:
            failures.append(name)
            err_msg = f"⚠️ {name} could not complete today: {exc}"
            sections[name] = err_msg
            collected[name] = err_msg         # downstream agents see the failure
            print(f"!! {name} failed: {exc}")
            traceback.print_exc()

    # Pulse compiles everything — gets all seven outputs as injected context
    pulse_context = "\n\n".join(
        f"### {n}\n{t}" for n, t in sections.items()
    )
    pulse_desc = textwrap.dedent(f"""
        You are compiling the Guided Childhood morning briefing for {TODAY}.
        Below are the outputs from all seven specialists on your team. Synthesise
        them into a concise 3-4 sentence executive summary: the single most
        important thing today, where Guided Childhood stands on the £1M ARR
        mission, and the one action to take right now. Acknowledge any ⚠️
        failures briefly. Then compile a clean scannable briefing with one
        labelled section per agent.

        AGENT OUTPUTS:
        {pulse_context}
    """)
    pulse_task = Task(
        description=pulse_desc.strip(),
        expected_output=(
            "A 3-4 sentence executive summary followed by clearly labelled "
            "sections for each agent (Research, Safeguarding, LinkedIn Targets, "
            "Sage's Content, Diego's Content, PR, Revenue). "
            "Highlight cross-agent connections. Suitable for an HTML email."
        ),
        agent=agents["pulse"],
    )

    intro = ""
    try:
        intro = _run_single(agents["pulse"], pulse_task)
        sections["Pulse"] = intro
        collected["Pulse"] = intro
    except Exception as exc:
        intro = (
            f"Daily briefing for {TODAY}. "
            f"{len(sections) - len(failures)}/{len(SPECIALISTS)} agents reported."
            + (f" Issues: {', '.join(failures)}." if failures else "")
        )
        print(f"!! Pulse summary failed, using fallback: {exc}")

    try:
        _save_outputs(sections, intro, failures)
    except Exception as exc:
        print(f"!! Could not save outputs JSON: {exc}")

    display_order = [DISPLAY[k] for k in SPECIALISTS]
    html_body = render_briefing_html(
        title="Daily Briefing",
        intro=intro,
        sections=sections,
        order=display_order,
        briefing_date=TODAY,
    )
    text_body = render_plain("Daily Briefing", intro, sections, display_order)
    subject = f"\U0001f333 Guided Childhood — Daily Briefing {TODAY}"
    status = send_briefing_email(subject, html_body, text_body, DEFAULT_RECIPIENT)
    print(f"\n{status}")

    print("=== Daily briefing complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
