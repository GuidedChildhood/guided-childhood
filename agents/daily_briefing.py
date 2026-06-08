"""Run the Guided Childhood daily briefing.

Each agent runs with the real outputs of upstream agents injected into their
task description — so Navigator literally reads Scout's intelligence and
Guardian's safeguarding watch before deciding who to target, Sage uses Scout's
news hook, Diego reads Scout + Sage to write the content series and Substack
newsletter, and so on. Pulse compiles everything into the founder email.

Scout also reads any Google Alerts that arrived in GMAIL_USER's inbox in the
last 24 hours before starting web research — those headlines act as pre-filtered
leads so Scout can verify and expand rather than start from scratch.

Run:  python agents/daily_briefing.py
Env:  ANTHROPIC_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD
"""

from __future__ import annotations

import email as email_lib
import html as html_lib
import imaplib
import json
import os
import re
import sys
import textwrap
import traceback
from datetime import date, datetime, timedelta, timezone
from email.header import decode_header as _decode_header

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

# Run order — each key maps to its tasks.yaml entry
SPECIALISTS = ["scout", "guardian", "navigator", "sage", "diego", "herald", "compass"]

DISPLAY = {
    "scout":     "Scout",
    "guardian":  "Guardian",
    "navigator": "Navigator",
    "sage":      "Sage",
    "diego":     "Diego",
    "herald":    "Herald",
    "compass":   "Compass",
}

AGENT_META = {
    "Scout":     ("🔭", "Research & Market Intelligence"),
    "Guardian":  ("🛡️", "Safeguarding & Child Safety"),
    "Navigator": ("🧭", "LinkedIn & Sales Growth"),
    "Sage":      ("✍️", "Content & Thought Leadership"),
    "Diego":     ("📝", "Brand, Content Series & Substack"),
    "Herald":    ("📣", "PR & Media"),
    "Compass":   ("🎯", "Revenue & £1M Mission"),
    "Pulse":     ("💓", "Daily Operations"),
}

# Which agents each specialist should read before doing their work.
# The values are DISPLAY names so the injected headers match.
CONTEXT_DEPS: dict[str, list[str]] = {
    "scout":     [],
    "guardian":  [],
    "navigator": ["Scout", "Guardian"],  # outreach hooks from news + safeguarding
    "sage":      ["Scout"],              # news hook for LinkedIn post
    "diego":     ["Scout", "Sage"],      # series post + Substack built on news + Sage's post
    "herald":    ["Scout", "Sage"],      # news peg + content angle Sage chose
    "compass":   [],                     # reads revenue_data.json directly
}


# ---------------------------------------------------------------------------
# Google Alerts inbox reader
# ---------------------------------------------------------------------------

def fetch_google_alerts(gmail_user: str, gmail_password: str) -> str:
    """Read Google Alerts emails from the last 24h and return a formatted list.

    Connects to Gmail via IMAP, finds emails from
    googlealerts-noreply@google.com, extracts article headlines and URLs,
    and returns them as a bullet list ready to inject into Scout's prompt.
    Returns an empty string if credentials are missing or no alerts arrived.
    """
    if not gmail_user or not gmail_password:
        return ""

    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(gmail_user, gmail_password)
        mail.select("inbox")

        since = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%d-%b-%Y")
        _, data = mail.search(
            None,
            f'(FROM "googlealerts-noreply@google.com" SINCE "{since}")',
        )

        if not data or not data[0]:
            mail.logout()
            return ""

        alerts: list[str] = []
        link_re = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.DOTALL)

        for num in data[0].split()[:10]:  # cap at 10 alert emails
            _, msg_data = mail.fetch(num, "(RFC822)")
            if not msg_data or not msg_data[0]:
                continue

            msg = email_lib.message_from_bytes(msg_data[0][1])

            # Decode subject → extract the alert topic
            raw = msg.get("Subject", "Google Alert")
            decoded = _decode_header(raw)[0]
            subject = (
                decoded[0].decode(decoded[1] or "utf-8")
                if isinstance(decoded[0], bytes)
                else decoded[0]
            )
            topic = re.sub(r"^Google Alert\s*[-–:]\s*", "", subject).strip()

            # Find HTML body
            body = ""
            for part in msg.walk():
                if part.get_content_type() == "text/html":
                    raw_payload = part.get_payload(decode=True)
                    if raw_payload:
                        body = raw_payload.decode("utf-8", errors="ignore")
                    break

            if not body:
                continue

            for href, inner in link_re.findall(body):
                # Skip Google internal links (preferences, unsubscribe, etc.)
                if any(
                    x in href
                    for x in ("google.com/alerts", "accounts.google.com", "support.google.com")
                ):
                    continue

                # Clean HTML tags from link text
                headline = html_lib.unescape(re.sub(r"<[^>]+>", "", inner).strip())

                # Filter out nav fragments and very long strings
                if len(headline) < 30 or len(headline) > 300:
                    continue

                # Unwrap Google redirect to get the real URL
                url_match = re.search(r"url=([^&]+)", href)
                if url_match:
                    try:
                        from urllib.parse import unquote
                        real_url = unquote(url_match.group(1))
                    except Exception:
                        real_url = href
                else:
                    real_url = href

                alerts.append(f"- {headline} [Alert topic: {topic}] — {real_url}")
                if len(alerts) >= 20:
                    break

            if len(alerts) >= 20:
                break

        mail.logout()
        return "\n".join(alerts)

    except Exception as exc:
        print(f"Warning: Google Alerts fetch failed (non-fatal): {exc}")
        return ""


# ---------------------------------------------------------------------------
# Task builder
# ---------------------------------------------------------------------------

def _fmt(text: str) -> str:
    return text.strip().replace("{date}", TODAY)


def _build_task(
    key: str,
    agent,
    context_outputs: dict[str, str],
    pre_inject: str = "",
) -> Task:
    """Create a Task with real upstream outputs injected into the description.

    pre_inject is prepended verbatim before the task description — used to
    pass Google Alerts headlines to Scout before web research starts.
    """
    desc = _fmt(TASKS_CFG[f"{key}_task"]["description"])
    expected = _fmt(TASKS_CFG[f"{key}_task"]["expected_output"])

    if pre_inject:
        desc = pre_inject.strip() + "\n\n" + desc

    deps = CONTEXT_DEPS.get(key, [])
    relevant = {name: context_outputs[name] for name in deps if name in context_outputs}

    if relevant:
        header = textwrap.dedent("""

            ---
            INTELLIGENCE FROM YOUR TEAM — you MUST read this, reference specific
            findings in your response, and build directly on what your colleagues
            have already found. Do not duplicate their work; extend it.
        """)
        blocks = [f"\n### {name} says:\n{output}" for name, output in relevant.items()]
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


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    anthropic_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not anthropic_key:
        print("ERROR: ANTHROPIC_API_KEY is not set — add it to GitHub Secrets. Agents will fail.")
    else:
        print(f"ANTHROPIC_API_KEY set (length {len(anthropic_key)}, starts {anthropic_key[:8]}...)")

    print(f"=== Guided Childhood daily briefing — {TODAY} ===")

    # Fetch Google Alerts from Gmail before agents start.
    # Scout gets these as pre-filtered leads — it verifies and expands via web search.
    gmail_user = os.getenv("GMAIL_USER", "")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD", "")
    google_alerts = fetch_google_alerts(gmail_user, gmail_password)
    if google_alerts:
        alert_count = google_alerts.count("\n") + 1
        print(f"Fetched {alert_count} Google Alert headline(s) from Gmail inbox")
        scout_pre_inject = textwrap.dedent(f"""
            ---
            GOOGLE ALERTS — HEADLINES FROM YOUR GMAIL INBOX (last 24 hours)
            These arrived via Google Alerts set up for relevant topics. They are
            pre-filtered, high-signal leads. Start here, then verify and expand
            each with your web search tools. Do NOT invent sources — every claim
            must be backed by a real URL you can find.

            {google_alerts}
            ---
        """).strip()
    else:
        if gmail_user:
            print("No Google Alerts found in inbox for the last 24h (or Gmail fetch failed)")
        else:
            print("GMAIL_USER not set — skipping Google Alerts inbox check")
        scout_pre_inject = ""

    llm = build_llm()
    agents = build_agents(llm)

    # Accumulated outputs keyed by DISPLAY name — shared between agents
    collected: dict[str, str] = {}
    sections:  dict[str, str] = {}
    failures:  list[str] = []

    for key in SPECIALISTS:
        name = DISPLAY[key]
        print(f"\n--- Running {name} (context: {CONTEXT_DEPS.get(key, [])}) ---")
        try:
            # Scout gets Google Alerts prepended; all other agents get nothing extra
            pre = scout_pre_inject if key == "scout" else ""
            task = _build_task(key, agents[key], collected, pre_inject=pre)
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
    pulse_context = "\n\n".join(f"### {n}\n{t}" for n, t in sections.items())
    pulse_desc = textwrap.dedent(f"""
        You are compiling the Guided Childhood morning briefing for {TODAY}.
        Below are the outputs from all seven specialists on your team. Synthesise
        them into a concise 3-4 sentence executive summary: the single most
        important thing today, where Guided Childhood stands on the £1M ARR
        mission, and the one action to take right now. Acknowledge any ⚠️
        failures briefly. Then compile a clean scannable briefing with one
        labelled section per agent. Note cross-agent connections explicitly
        (e.g. Diego built the content series on Scout's finding about X and
        aligned the Substack newsletter to Sage's LinkedIn post).

        AGENT OUTPUTS:
        {pulse_context}
    """)
    pulse_task = Task(
        description=pulse_desc.strip(),
        expected_output=(
            "A 3-4 sentence executive summary followed by clearly labelled "
            "sections for each agent. Suitable for an HTML email."
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
    subject = f"🌳 Guided Childhood — Daily Briefing {TODAY}"
    status = send_briefing_email(subject, html_body, text_body, DEFAULT_RECIPIENT)
    print(f"\n{status}")

    print("=== Daily briefing complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
