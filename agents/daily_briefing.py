"""Run the Guided Childhood daily briefing.

Each agent runs with the real outputs of upstream agents injected into their
task description. Agents also read their own persistent memory file before
starting, so learnings accumulate across runs: Scout learns which topics
Justin acts on, Diego never repeats a series post topic, Navigator tracks
which hooks get replies, and so on.

After every agent completes, its memory is updated with today's recommended
action and question. The workflow commits all memory files back to the repo.

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

# Which memory fields to surface per agent, and how to label them
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
        ("best_performing_hooks",   "Message hooks that have got replies"),
        ("target_roles_that_respond","Roles that respond well"),
        ("messages_to_avoid_repeating", "Messages already sent — do not repeat"),
    ],
    "sage": [
        ("post_topics_used",        "Topics already covered — do not repeat"),
        ("best_performing_formats", "What structure has worked best"),
        ("effective_hashtags",      "Hashtags with proven reach"),
        ("hooks_already_used",      "News hooks already built into posts"),
    ],
    "diego": [
        ("series_posts_drafted",    "Series posts already written — do not repeat topics"),
        ("substack_drafts_created", "Substack newsletters already drafted"),
        ("objections_to_preempt",   "Recurring objections from comments to address"),
        ("topics_to_develop",       "Series threads to continue"),
        ("voice_reminders",         "Voice and format reminders"),
    ],
    "herald": [
        ("journalists_pitched",     "Journalists already pitched — avoid repeating within 30 days"),
        ("outlets_with_appetite",   "Outlets that respond to Guided Childhood angles"),
        ("angles_already_used",     "Angles already pitched"),
    ],
    "compass": [
        ("revenue_snapshots",       "Recent ARR readings — track the trend"),
        ("actions_recommended",     "Revenue actions already recommended"),
        ("milestones_reached",      "Milestones hit"),
    ],
    "pulse": [
        ("key_themes_this_month",   "Running themes across the team"),
        ("cross_agent_patterns",    "Cross-agent connections that keep appearing"),
    ],
}

MEMORY_DIR = os.path.join(os.path.dirname(__file__), "memory")


# ---------------------------------------------------------------------------
# Memory helpers
# ---------------------------------------------------------------------------

def load_memory(key: str) -> dict:
    """Load agent memory file. Returns empty dict if missing or corrupt."""
    path = os.path.join(MEMORY_DIR, f"{key}_memory.json")
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}


def save_memory(key: str, memory: dict) -> None:
    """Write updated memory back to file."""
    os.makedirs(MEMORY_DIR, exist_ok=True)
    path = os.path.join(MEMORY_DIR, f"{key}_memory.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(memory, fh, indent=2, ensure_ascii=False)


def update_memory_from_output(key: str, output: str) -> None:
    """Auto-extract learnings from agent output and persist to memory file.

    Extracts the YOUR ACTION TODAY and YOUR QUESTION lines (present in every
    agent's expected_output format) and appends them with today's date.
    Also increments run_count so the memory injection kicks in from run 2.
    """
    memory = load_memory(key)
    memory["run_count"] = memory.get("run_count", 0) + 1
    memory["last_updated"] = TODAY

    action_match = re.search(r"YOUR ACTION TODAY:\s*(.+?)(?:\n|$)", output, re.IGNORECASE)
    if action_match:
        recent = memory.setdefault("recent_actions", [])
        recent.append({"date": TODAY, "action": action_match.group(1).strip()})
        memory["recent_actions"] = recent[-15:]

    question_match = re.search(r"YOUR QUESTION:\s*(.+?)(?:\n|$)", output, re.IGNORECASE)
    if question_match:
        recent_q = memory.setdefault("recent_questions", [])
        recent_q.append({"date": TODAY, "question": question_match.group(1).strip()})
        memory["recent_questions"] = recent_q[-15:]

    save_memory(key, memory)


def _format_memory_block(key: str, memory: dict) -> str:
    """Render memory dict as a readable context block to inject into a task.

    Returns empty string on first run (run_count == 0) — no history yet.
    """
    if not memory or memory.get("run_count", 0) == 0:
        return ""

    lines = [
        "---",
        f"YOUR MEMORY — {memory['run_count']} PREVIOUS RUN(S) — last updated {memory.get('last_updated', 'unknown')}",
        "This is what you have learned across previous runs. Use it to improve",
        "today's work. Do NOT repeat topics, hooks, or recommendations already covered.",
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
                    text = (
                        v.get("action")
                        or v.get("question")
                        or v.get("topic")
                        or v.get("hook")
                        or str(v)
                    )
                    lines.append(f"  [{date_str}] {text}")
                else:
                    lines.append(f"  - {v}")
        elif isinstance(values, str) and values:
            lines.append(f"\n{label}: {values}")

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
        _, data = mail.search(
            None,
            f'(FROM "googlealerts-noreply@google.com" SINCE "{since}")',
        )

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
            subject = (
                decoded[0].decode(decoded[1] or "utf-8")
                if isinstance(decoded[0], bytes)
                else decoded[0]
            )
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
                if any(
                    x in href
                    for x in ("google.com/alerts", "accounts.google.com", "support.google.com")
                ):
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
) -> Task:
    """Create a Task, injecting memory then Google Alerts then team intelligence."""
    desc = _fmt(TASKS_CFG[f"{key}_task"]["description"])
    expected = _fmt(TASKS_CFG[f"{key}_task"]["expected_output"])

    # Memory first — agent reads its own history before anything else
    if memory_block:
        desc = memory_block.strip() + "\n\n" + desc

    # Then any inbox pre-context (Google Alerts for Scout)
    if pre_inject:
        desc = desc + "\n\n" + pre_inject.strip()

    # Then live team intelligence from upstream agents
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

    # Google Alerts — pre-filtered leads for Scout
    gmail_user = os.getenv("GMAIL_USER", "")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD", "")
    google_alerts = fetch_google_alerts(gmail_user, gmail_password)
    if google_alerts:
        alert_count = google_alerts.count("\n") + 1
        print(f"Fetched {alert_count} Google Alert headline(s) from Gmail inbox")
        scout_pre_inject = textwrap.dedent(f"""
            ---
            GOOGLE ALERTS — HEADLINES FROM YOUR GMAIL INBOX (last 24 hours)
            These arrived via Google Alerts for relevant topics. Pre-filtered,
            high-signal leads. Start here, then verify and expand with web search.
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

    llm = build_llm()
    agents = build_agents(llm)

    collected: dict[str, str] = {}
    sections:  dict[str, str] = {}
    failures:  list[str] = []

    for key in SPECIALISTS:
        name = DISPLAY[key]
        memory = load_memory(key)
        memory_block = _format_memory_block(key, memory)
        run_num = memory.get("run_count", 0)
        print(f"\n--- Running {name} (run #{run_num + 1}, memory: {'loaded' if memory_block else 'first run'}) ---")

        try:
            pre = scout_pre_inject if key == "scout" else ""
            task = _build_task(key, agents[key], collected, pre_inject=pre, memory_block=memory_block)
            output = _run_single(agents[key], task)
            result = output or "(no output produced)"
            sections[name] = result
            collected[name] = result
            print(f"✓ {name} complete ({len(result)} chars)")
        except Exception as exc:
            failures.append(name)
            err_msg = f"⚠️ {name} could not complete today: {exc}"
            sections[name] = err_msg
            collected[name] = err_msg
            print(f"!! {name} failed: {exc}")
            traceback.print_exc()
        finally:
            # Always update memory — even on failure, we increment run count
            try:
                update_memory_from_output(key, sections.get(name, ""))
                print(f"   Memory updated for {name}")
            except Exception as mem_exc:
                print(f"   Warning: memory update failed for {name}: {mem_exc}")

    # Pulse — reads all seven outputs
    pulse_context = "\n\n".join(f"### {n}\n{t}" for n, t in sections.items())
    pulse_memory = load_memory("pulse")
    pulse_memory_block = _format_memory_block("pulse", pulse_memory)

    pulse_desc = textwrap.dedent(f"""
        {pulse_memory_block}

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
        sections["Pulse"] = intro
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
