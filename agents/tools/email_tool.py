"""Email tool for the Guided Childhood crew.

Sends mail via Gmail SMTP using an app password. Credentials come from env vars
GMAIL_USER and GMAIL_APP_PASSWORD — never hardcoded.

Exposes:
  send_briefing_email()  — plain Python helper called by runner scripts (no crewai needed)
  send_html_email()      — lower-level helper
  send_email_tool        — CrewAI @tool wrapper (only created when crewai is available)
"""

from __future__ import annotations

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

DEFAULT_RECIPIENT = "justin@thesocialbillboard.com"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def send_html_email(
    subject: str,
    html_body: str,
    to_address: str = DEFAULT_RECIPIENT,
    text_fallback: str | None = None,
) -> str:
    """Send an HTML email via Gmail SMTP. Returns a status string, never raises."""
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")

    if not gmail_user or not gmail_password:
        return (
            "Email NOT sent: GMAIL_USER and/or GMAIL_APP_PASSWORD are not set. "
            "Add them as GitHub secrets."
        )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = gmail_user
    msg["To"] = to_address
    msg.attach(MIMEText(text_fallback or "View this briefing in HTML.", "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
            server.starttls()
            server.login(gmail_user, gmail_password)
            server.sendmail(gmail_user, [to_address], msg.as_string())
        return f"Email sent to {to_address}: {subject}"
    except Exception as exc:
        return f"Email send failed: {exc}"


def send_briefing_email(
    subject: str,
    html_body: str,
    text_body: str = "",
    to_address: str = DEFAULT_RECIPIENT,
) -> str:
    """Send the compiled briefing. Called directly by the runner scripts."""
    return send_html_email(subject, html_body, to_address, text_body or None)


# CrewAI @tool wrapper — only registered when crewai is importable.
# Uses try/except so this module always loads cleanly even before crewai is installed.
try:
    from crewai.tools import tool as _crewai_tool

    @_crewai_tool("Send Email")
    def send_email_tool(subject: str, html_body: str) -> str:
        """Send an HTML email to the Guided Childhood founder (justin@thesocialbillboard.com)."""
        return send_html_email(subject=subject, html_body=html_body)

except Exception:
    # crewai not installed yet or version mismatch — plain fallback so imports never fail
    def send_email_tool(subject: str, html_body: str) -> str:  # type: ignore[misc]
        return send_html_email(subject=subject, html_body=html_body)
