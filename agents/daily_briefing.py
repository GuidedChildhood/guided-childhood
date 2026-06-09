"""Run the Guided Childhood daily briefing.

Each agent reads its own persistent memory, any Google Alerts from Gmail,
any founder feedback sent via the dashboard, and upstream team outputs —
before producing today's work.

Feedback loop:
  1. Justin replies to agents on the dashboard (agents.html)
  2. Taps "Send to agents" — opens a mailto: draft with subject [GC Feedback]
  3. Justin sends the email to himself
  4. This script reads it from Gmail before agents start
  5. Each agent receives Justin's feedback as direct context

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

CONTEXT_DEPS: dict[str, list[str]] = {
    "scout":     [],
    "guardian":  [],
    "navigator": ["Scout", "Guardian"],
    "sage":      ["Scout"],
    "diego":     ["Scout", "Sage"],
    "herald":    ["Scout", "Sage"],
    "compass":   [],
}

MEMORY_DISPLAY_FIELDS: dict[str, list[tuple[str, str]]] = {
    "scout": [
        ("high_signal_topics",      "Topics Justin acts on — prioritise these"),
        ("low_signal_topics",       "Low-signal — deprioritise"),
        ("top_sources",             "Sources that consistently produce intelligence"),
        ("government_policy_watch", "Ongoing policy threads to keep tracking"),
    ],
    "guardian": [
        ("ongoing_threads",         "Ongoing safeguarding threads to keep tracking"),
        ("relevant_school_contexts","School contexts that matter most"),
    ],
    "navigator": [
        ("best_performing_hooks",        "Message hooks that have got replies"),
        ("target_roles_that_respond",    "Roles that respond well"),
        ("messages_to_avoid_repeating",  "Messages already sent — do not repeat"),
    ],
    "sage": [
        ("post_topics_used",        "Topics already covered — do not repeat"),
        ("best_performing_formats", "What structure has worked best"),
        ("effective_hashtags",      "Hashtags with proven reach"),
        ("hooks_already_used",      "News hooks already built into posts"),
    ],
    "diego": [
        ("series_posts_already_published", "Series posts published — do not repeat topics, DO continue the format"),
        ("next_series_directions",         "Directions to build the next post"),
        ("objections_to_preempt",          "Recurring objections to address"),
        ("voice_reminders",                "Voice and format reminders"),
    ],
    "herald": [
        ("journalists_pitched",     "Journalists already pitched"),
        ("outlets_with_appetite",   "Outlets that respond to Guided Childhood angles"),
        ("angles_already_used",     "Angles already pitched"),
        ("strategic_targets",       "Speaking circuit and policy report targets"),
    ],
    "compass": [
        ("revenue_roadmap",         "Six revenue streams — identify which to push today"),
        ("trajectory_forecast",     "Where Guided Childhood should be at each milestone"),
        ("compass_daily_mandate",   "Compass daily operating rules"),
        ("revenue_snapshots",       "Recent ARR readings — track the trend"),
    ],
    "pulse": [
        ("strategic_context",       "Mission, thesis, content engine"),
        ("revenue_roadmap_summary", "Six revenue streams summary"),
        ("trajectory",              "Milestone forecast"),
        ("pulse_daily_mandate",     "Pulse operating rules"),
        ("key_themes_this_month",   "Running themes across the team"),
    ],
}

MEMORY_DIR = os.path.join(os.path.dirname(__file__), "memory")


# ---------------------------------------------------------------------------
# Memory helpers
# ---------------------------------------------------------------------------

def load_memory(key: str) -> dict:
    path = os.path.join(MEMORY_DIR, f"{key}_memory.json")
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_memory(key: str, memory: dict) -> None:
    os.makedirs(MEMORY_DIR, exist_ok=True)
    path = os.path.join(MEMORY_DIR, f"{key}_memory.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(memory, fh, indent=2, ensure_ascii=False)


def update_memory_from_output(key: str, output: str) -> None:
    memory = load_memory(key)
    memory["run_count"] = memory.get("run_count", 0) + 1
    memory["last_updated"] = TODAY

    action_match = re.search(r"YOUR ACTION TODAY[:\s]+(.+?)(?:\n|$)", output, re.IGNORECASE)
    if action_match:
        recent = memory.setdefault("recent_actions", [])
        recent.append({"date": TODAY, "action": action_match.group(1).strip()})
        memory["recent_actions"] = recent[-15:]

    question_match = re.search(r"YOUR QUESTION[:\s]+(.+?)(?:\n|$)", output, re.IGNORECASE)
    if question_match:
        recent_q = memory.setdefault("recent_questions", [])
        recent_q.append({"date": TODAY, "question": question_match.group(1).strip()})
        memory["recent_questions"] = recent_q[-15:]

    save_memory(key, memory)


def _format_memory_block(key: str, memory: dict) -> str:
    if not memory or memory.get("run_count", 0) == 0:
        return ""

    lines = [
        "---",
        f"YOUR MEMORY — {memory['run_count']} PREVIOUS RUN(S) — last updated {memory.get('last_updated', 'unknown')}",
        "Use this to improve today's work. Do NOT repeat topics or recommendations already covered.",
    ]

    for field, label in MEMORY_DISPLAY_FIELDS.get(key, []):
        values = memory.get(field)
        if not values:
            continue
        if isinstance(values, list) and values:
            lines.append(f"\n{label}:")
            for v in values[-6:]:
                if isinstance(v, dict):
                    date_str = v.get("date", "")
                    text = v.get("action") or v.get("question") or v.get("topic") or str(v)
                    lines.append(f"  [{date_str}] {text}")
                else:
                    lines.append(f"  - {v}")
        elif isinstance(values, str) and values:
            lines.append(f"\n{label}: {values}")
        elif isinstance(values, dict) and values:
            lines.append(f"\n{label}:")
            for k2, v2 in list(values.items())[:4]:
                if isinstance(v2, (str, int, float)):
                    lines.append(f"  {k2}: {v2}")

    recent_actions = memory.get("recent_actions", [])
    if recent_actions:
        lines.append("\nYour last 3 recommended actions (build forward, don't repeat):")
        for a in recent_actions[-3:]:
            lines.append(f"  [{a.get('date','')}] {a.get('action','')}")

    lines.append("---")
    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Google Alerts inbox reader
# ---------------------------------------------------------------------------

def fetch_google_alerts(gmail_user: str, gmail_password: str) -> str:
    """Read Google Alerts emails from the last 24h, return formatted bullet list."""
    if not gmail_user or not gmail_password:
        return ""
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(gmail_user, gmail_password)
        mail.select("inbox")

        since = (datetime.now(timezone.utc) - timedelta(hours=24)).strftime("%d-%b-%Y")
        _, data = mail.search(None, f'(FROM "googlealerts-noreply@google.com" SINCE "{since}")')

        if not data or not data[0]:
            mail.logout()
            return ""

        alerts: list[str] = []
        link_re = re.compile(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', re.DOTALL)

        for num in data[0].split()[:10]:
            _, msg_data = mail.fetch(num, "(RFC822)")
            if not msg_data or not msg_data[0]:
                continue
            msg = email_lib.message_from_bytes(msg_data[0][1])
            raw = msg.get("Subject", "Google Alert")
            decoded = _decode_header(raw)[0]
            subject = (decoded[0].decode(decoded[1] or "utf-8") if isinstance(decoded[0], bytes) else decoded[0])
            topic = re.sub(r"^Google Alert\s*[-–:]\s*", "", subject).strip()

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
                if any(x in href for x in ("google.com/alerts", "accounts.google.com", "support.google.com")):
                    continue
                headline = html_lib.unescape(re.sub(r"<[^>]+>", "", inner).strip())
                if len(headline) < 30 or len(headline) > 300:
                    continue
                url_match = re.search(r"url=([^&]+)", href)
                if url_match:
                    try:
                        from urllib.parse import unquote
                        real_url = unquote(url_match.group(1))
                    except Exception:
                        real_url = href
                else:
                    real_url = href
                alerts.append(f"- {headline} [Alert: {topic}] — {real_url}")
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
# Founder feedback reader
# ---------------------------------------------------------------------------

def fetch_founder_feedback(gmail_user: str, gmail_password: str) -> dict[str, str]:
    """Read [GC Feedback] emails from the last 48h and parse per-agent feedback.

    Justin sends these from the dashboard 'Send to agents' button.
    Returns dict like {"scout": "Focus on Ofsted", "navigator": "Sent #1 and #3"}.
    Marks emails as read so they don't repeat.
    """
    if not gmail_user or not gmail_password:
        return {}
    try:
        mail = imaplib.IMAP4_SSL("imap.gmail.com")
        mail.login(gmail_user, gmail_password)
        mail.select("inbox")

        since = (datetime.now(timezone.utc) - timedelta(hours=48)).strftime("%d-%b-%Y")
        _, data = mail.search(None, f'(SUBJECT "[GC Feedback]" SINCE "{since}" UNSEEN)')

        if not data or not data[0]:
            mail.logout()
            return {}

        feedback: dict[str, str] = {}
        valid_agents = set(SPECIALISTS + ["pulse"])

        for num in data[0].split():
            _, msg_data = mail.fetch(num, "(RFC822)")
            if not msg_data or not msg_data[0]:
                continue
            msg = email_lib.message_from_bytes(msg_data[0][1])

            # Get plain text body
            body = ""
            for part in msg.walk():
                ct = part.get_content_type()
                if ct == "text/plain":
                    payload = part.get_payload(decode=True)
                    if payload:
                        body = payload.decode("utf-8", errors="ignore")
                    break
            if not body:
                raw_payload = msg.get_payload(decode=True)
                if raw_payload:
                    body = raw_payload.decode("utf-8", errors="ignore")

            # Parse AGENTNAME: feedback text lines
            for line in body.splitlines():
                line = line.strip()
                if not line or line.startswith("---") or line.startswith("Guided Childhood"):
                    continue
                if ":" in line:
                    agent_raw, text = line.split(":", 1)
                    agent_key = agent_raw.strip().lower()
                    if agent_key in valid_agents and text.strip():
                        feedback[agent_key] = text.strip()

            # Mark as read
            mail.store(num, "+FLAGS", "\\Seen")

        mail.logout()
        return feedback

    except Exception as exc:
        print(f"Warning: founder feedback fetch failed (non-fatal): {exc}")
        return {}


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
    memory_block: str = "",
    founder_feedback: str = "",
) -> Task:
    """Build a Task with memory → founder feedback → Google Alerts → team intelligence."""
    desc = _fmt(TASKS_CFG[f"{key}_task"]["description"])
    expected = _fmt(TASKS_CFG[f"{key}_task"]["expected_output"])

    # 1. Memory — agent reads its own history first
    if memory_block:
        desc = memory_block.strip() + "\n\n" + desc

    # 2. Founder feedback — direct instruction from Justin via dashboard
    if founder_feedback:
        fb_block = textwrap.dedent(f"""

            ---
            DIRECT FEEDBACK FROM JUSTIN (sent via dashboard before this run):
            "{founder_feedback}"
            This is a direct instruction from the founder. Reference it and act on it.
            ---
        """).strip()
        desc = desc + "\n\n" + fb_block

    # 3. Google Alerts or other pre-context (Scout only)
    if pre_inject:
        desc = desc + "\n\n" + pre_inject.strip()

    # 4. Team intelligence from upstream agents
    deps = CONTEXT_DEPS.get(key, [])
    relevant = {name: context_outputs[name] for name in deps if name in context_outputs}
    if relevant:
        header = textwrap.dedent("""

            ---
            INTELLIGENCE FROM YOUR TEAM — read this, reference specific findings,
            and build directly on what your colleagues found. Do not duplicate; extend.
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
        print("ERROR: ANTHROPIC_API_KEY is not set — add it to GitHub Secrets.")
    else:
        print(f"ANTHROPIC_API_KEY set (length {len(anthropic_key)}, starts {anthropic_key[:8]}...)")

    print(f"=== Guided Childhood daily briefing — {TODAY} ===")

    gmail_user     = os.getenv("GMAIL_USER", "")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD", "")

    # Google Alerts for Scout
    google_alerts = fetch_google_alerts(gmail_user, gmail_password)
    if google_alerts:
        count = google_alerts.count("\n") + 1
        print(f"Fetched {count} Google Alert headline(s) from Gmail inbox")
        scout_pre_inject = textwrap.dedent(f"""
            ---
            GOOGLE ALERTS — HEADLINES FROM YOUR GMAIL INBOX (last 24 hours)
            Pre-filtered, high-signal leads. Verify and expand with web search.
            Do NOT invent sources — every claim must be backed by a real URL.

            {google_alerts}
            ---
        """).strip()
    else:
        if gmail_user:
            print("No Google Alerts found in inbox for the last 24h")
        else:
            print("GMAIL_USER not set — skipping Google Alerts check")
        scout_pre_inject = ""

    # Founder feedback from dashboard
    founder_feedback = fetch_founder_feedback(gmail_user, gmail_password)
    if founder_feedback:
        print(f"Founder feedback received for: {', '.join(founder_feedback.keys())}")
        for k, v in founder_feedback.items():
            print(f"  {k}: {v[:80]}{'...' if len(v)>80 else ''}")
    else:
        print("No founder feedback emails found")

    llm    = build_llm()
    agents = build_agents(llm)

    collected: dict[str, str] = {}
    sections:  dict[str, str] = {}
    failures:  list[str]      = []

    for key in SPECIALISTS:
        name         = DISPLAY[key]
        memory       = load_memory(key)
        memory_block = _format_memory_block(key, memory)
        run_num      = memory.get("run_count", 0)
        fb           = founder_feedback.get(key, "")
        print(f"\n--- Running {name} (run #{run_num+1}, memory: {'loaded' if memory_block else 'first run'}{', feedback: yes' if fb else ''}) ---")

        try:
            pre  = scout_pre_inject if key == "scout" else ""
            task = _build_task(key, agents[key], collected,
                               pre_inject=pre,
                               memory_block=memory_block,
                               founder_feedback=fb)
            output = _run_single(agents[key], task)
            result = output or "(no output produced)"
            sections[name]  = result
            collected[name] = result
            print(f"✓ {name} complete ({len(result)} chars)")
        except Exception as exc:
            failures.append(name)
            err_msg = f"⚠️ {name} could not complete today: {exc}"
            sections[name]  = err_msg
            collected[name] = err_msg
            print(f"!! {name} failed: {exc}")
            traceback.print_exc()
        finally:
            try:
                update_memory_from_output(key, sections.get(name, ""))
            except Exception as mem_exc:
                print(f"   Warning: memory update failed for {name}: {mem_exc}")

    # Pulse
    pulse_context    = "\n\n".join(f"### {n}\n{t}" for n, t in sections.items())
    pulse_memory     = load_memory("pulse")
    pulse_memory_blk = _format_memory_block("pulse", pulse_memory)
    pulse_fb         = founder_feedback.get("pulse", "")

    pulse_desc = textwrap.dedent(f"""
        {pulse_memory_blk}

        {f'FOUNDER FEEDBACK FOR PULSE: "{pulse_fb}"' if pulse_fb else ""}

        You are compiling the Guided Childhood morning briefing for {TODAY}.
        Below are the outputs from all seven specialists. Synthesise them into
        a concise 3-4 sentence executive summary: the single most important
        thing today, where Guided Childhood stands on the £1M ARR mission, and
        the one action to take right now. Acknowledge any ⚠️ failures briefly.
        Then compile a clean scannable briefing with one labelled section per
        agent. Note cross-agent connections explicitly.

        AGENT OUTPUTS:
        {pulse_context}
    """).strip()

    pulse_task = Task(
        description=pulse_desc,
        expected_output=(
            "A 3-4 sentence executive summary followed by clearly labelled "
            "sections for each agent. Suitable for an HTML email."
        ),
        agent=agents["pulse"],
    )

    intro = ""
    try:
        intro = _run_single(agents["pulse"], pulse_task)
        sections["Pulse"]  = intro
        collected["Pulse"] = intro
        update_memory_from_output("pulse", intro)
    except Exception as exc:
        intro = (
            f"Daily briefing for {TODAY}. "
            f"{len(sections) - len(failures)}/{len(SPECIALISTS)} agents reported."
            + (f" Issues: {', '.join(failures)}." if failures else "")
        )
        print(f"!! Pulse failed, using fallback: {exc}")

    try:
        _save_outputs(sections, intro, failures)
    except Exception as exc:
        print(f"!! Could not save outputs JSON: {exc}")

    display_order = [DISPLAY[k] for k in SPECIALISTS]
    html_body = render_briefing_html("Daily Briefing", intro, sections, display_order, TODAY)
    text_body = render_plain("Daily Briefing", intro, sections, display_order)
    subject   = f"🌳 Guided Childhood — Daily Briefing {TODAY}"
    status    = send_briefing_email(subject, html_body, text_body, DEFAULT_RECIPIENT)
    print(f"\n{status}")
    print("=== Daily briefing complete ===")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
