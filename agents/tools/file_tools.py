"""File read/write tools for the Guided Childhood crew.

Compass uses these to read/update revenue_data.json; Sage and Pulse use the
write tool to persist drafts and briefings. Paths are resolved relative to the
`agents/` package directory so the tools work the same locally and in CI.
"""

from __future__ import annotations

import os

from crewai.tools import tool

# Directory of the `agents/` package (parent of this tools/ folder).
PACKAGE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _resolve(path: str) -> str:
    """Resolve a possibly-relative path against the package directory.

    Absolute paths are returned unchanged. This keeps file access predictable
    whether an agent passes "revenue_data.json" or a full path.
    """
    if os.path.isabs(path):
        return path
    return os.path.join(PACKAGE_DIR, path)


@tool("Read File")
def file_read_tool(path: str) -> str:
    """Read and return the full text contents of a file.

    Pass a path such as "revenue_data.json". Returns the file contents, or a
    clear error message if the file does not exist.
    """
    resolved = _resolve(path)
    try:
        with open(resolved, "r", encoding="utf-8") as fh:
            return fh.read()
    except FileNotFoundError:
        return f"File not found: {resolved}"
    except Exception as exc:
        return f"Error reading {resolved}: {exc}"


@tool("Write File")
def file_write_tool(path: str, content: str) -> str:
    """Write text content to a file, creating parent folders as needed.

    Pass `path` (e.g. "output/linkedin_post.md") and the `content` string.
    Overwrites any existing file. Returns a confirmation or error message.
    """
    resolved = _resolve(path)
    try:
        os.makedirs(os.path.dirname(resolved) or ".", exist_ok=True)
        with open(resolved, "w", encoding="utf-8") as fh:
            fh.write(content)
        return f"Wrote {len(content)} characters to {resolved}"
    except Exception as exc:
        return f"Error writing {resolved}: {exc}"
