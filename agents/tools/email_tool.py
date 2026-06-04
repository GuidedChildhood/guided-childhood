"""Email tool for the Guided Childhood crew.

Sends mail via Gmail SMTP using an app password. Credentials come from env vars
GMAIL_USER and GMAIL_APP_PASSWORD -- never hardcoded. Pulse calls this to
deliver the compiled briefing.

The module exposes both:
  * `send_html_email(...)` -- a plain Python helper the runner scripts call
    directly with their fully rendered HTML, and
  * `send_email_tool` -- a CrewAI @tool wrapper so an agent can send mail itself.
"""

from __future__ import annotations

import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from crewai.tools import tool

DEFAULT_RECIPIENT = "justin@thesocialbillboard.com"
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587


def send_html_email(
    subject: str,
    html_body: str,
    to_address: str = DEFAULT_RECIPIENT,
    text_fallback: str | None = None,
) -> str:
    """Send an HTML email via Gmail SMTP.

    Returns a status string. Raises nothing -- failures are returned as text so
    a failed send never crashes a scheduled run (the briefing is also saved to
    disk by the runner as a backup).
    """
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")

    if not gmail_user or not gmail_password:
        return (
            "Email NOT sent: GMAIL_USER and/or GMAIL_APP_PASSWORD are not set. "
            "Configure them as environment variables / GitHub secrets."
        )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = gmail_user
    msg["To"] = to_address

    # Provide a plain-text part for clients that won't render HTML.
    if text_fallback is None:
        text_fallback = "Your Guided Childhood briefing is best viewed in HTML."
    msg.attach(MIMEText(text_fallback, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
            server.starttls()
            server.login(gmail_user, gmail_password)
            server.sendmail(gmail_user, [to_address], msg.as_string())
        return f"Email sent to {to_address}: {subject}"
    except Exception as exc:
        return f"Email send failed: {exc}"


@tool("Send Email")
def send_email_tool(subject: str, html_body: str) -> str:
    """Send an HTML email to the Guided Childhood founder.

    Pass `subject` and `html_body` (HTML string). Sends to
    justin@thesocialbillboard.com via Gmail SMTP. Returns a status message.
    """
    return send_html_email(subject=subject, html_body=html_body)
