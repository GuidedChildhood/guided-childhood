"""Branded HTML email rendering for Guided Childhood briefings.

Cream background, serif headings, warm earthy palette. Each agent gets a card
with its emoji, name and output. Kept dependency-free (pure string building)
so it works in any environment.
"""

from __future__ import annotations

import html
from datetime import date as _date
from typing import Dict, List, Optional

# Warm, earthy Guided Childhood palette.
CREAM = "#F7F1E5"
CARD = "#FFFDF8"
INK = "#3A2E25"
CLAY = "#B5651D"
SAGE_GREEN = "#6B7A4F"
BORDER = "#E5D9C3"

# Agent display metadata: emoji + one-line descriptor.
AGENT_META = {
    "Scout": ("🔭", "Research & Market Intelligence"),
    "Guardian": ("🛡️", "Safeguarding & Child Safety"),
    "Navigator": ("🧭", "LinkedIn & Sales Growth"),
    "Sage": ("✍️", "Content & Thought Leadership"),
    "Herald": ("📣", "PR & Media"),
    "Compass": ("🎯", "Revenue & £1M Mission"),
    "Pulse": ("💓", "Daily Operations"),
}


def _card(name: str, body: str) -> str:
    emoji, descriptor = AGENT_META.get(name, ("•", ""))
    # Preserve line breaks from agent text while escaping HTML.
    safe = html.escape(body or "(no output)").replace("\n", "<br>")
    return f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
           style="margin:0 0 20px 0;border-collapse:separate;">
      <tr>
        <td style="background:{CARD};border:1px solid {BORDER};border-radius:12px;
                   padding:22px 24px;">
          <div style="font-size:20px;line-height:1.2;margin-bottom:2px;">
            <span style="font-size:22px;">{emoji}</span>
            <span style="font-family:Georgia,'Times New Roman',serif;
                         color:{CLAY};font-weight:bold;">{html.escape(name)}</span>
          </div>
          <div style="font-size:12px;color:{SAGE_GREEN};letter-spacing:.5px;
                      text-transform:uppercase;margin-bottom:12px;">
            {html.escape(descriptor)}
          </div>
          <div style="font-size:15px;line-height:1.65;color:{INK};">{safe}</div>
        </td>
      </tr>
    </table>
    """


def render_briefing_html(
    title: str,
    intro: str,
    sections: Dict[str, str],
    order: Optional[List[str]] = None,
    briefing_date: Optional[str] = None,
) -> str:
    """Build the full HTML email.

    sections: mapping of agent name -> their output text.
    order: optional explicit ordering of agent names.
    """
    briefing_date = briefing_date or _date.today().isoformat()
    order = order or list(sections.keys())

    cards = "".join(_card(name, sections.get(name, "")) for name in order)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)}</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
         style="background:{CREAM};padding:28px 0;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0"
             style="max-width:640px;width:100%;">

        <!-- Header -->
        <tr><td style="padding:0 8px 8px 8px;">
          <div style="font-family:Georgia,'Times New Roman',serif;
                      font-size:30px;color:{INK};font-weight:bold;">
            🌳 Guided Childhood
          </div>
          <div style="font-family:Georgia,serif;font-size:18px;color:{CLAY};
                      margin-top:4px;">{html.escape(title)}</div>
          <div style="font-size:13px;color:{SAGE_GREEN};margin-top:6px;">
            {html.escape(briefing_date)} &nbsp;•&nbsp; Helping children 4-16
            navigate digital life safely
          </div>
        </td></tr>

        <!-- Intro / top-line summary -->
        <tr><td style="padding:16px 8px;">
          <div style="background:{CARD};border-left:4px solid {SAGE_GREEN};
                      border-radius:8px;padding:16px 20px;font-size:15px;
                      line-height:1.6;color:{INK};">
            {html.escape(intro).replace(chr(10), '<br>')}
          </div>
        </td></tr>

        <!-- Agent cards -->
        <tr><td style="padding:8px;">
          {cards}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 8px 0 8px;text-align:center;
                       font-size:12px;color:{SAGE_GREEN};">
          Compiled by your 7-agent crew • Mission: £1,000,000 ARR &amp;
          safer, better-educated children online.<br>
          <span style="color:#A99;">This is an automated briefing.</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>"""


def render_plain(title: str, intro: str, sections: Dict[str, str],
                 order: Optional[List[str]] = None) -> str:
    """Plain-text fallback version of the briefing."""
    order = order or list(sections.keys())
    lines = [f"GUIDED CHILDHOOD — {title}", "=" * 48, "", intro, ""]
    for name in order:
        emoji, descriptor = AGENT_META.get(name, ("•", ""))
        lines.append(f"{emoji} {name} — {descriptor}")
        lines.append("-" * 40)
        lines.append(sections.get(name, "(no output)"))
        lines.append("")
    return "\n".join(lines)
