"""File read/write tools for the Guided Childhood crew."""

from __future__ import annotations

import os

PACKAGE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _resolve(path: str) -> str:
    if os.path.isabs(path):
        return path
    return os.path.join(PACKAGE_DIR, path)


def _read_file(path: str) -> str:
    resolved = _resolve(path)
    try:
        with open(resolved, "r", encoding="utf-8") as fh:
            return fh.read()
    except FileNotFoundError:
        return f"File not found: {resolved}"
    except Exception as exc:
        return f"Error reading {resolved}: {exc}"


def _write_file(path: str, content: str) -> str:
    resolved = _resolve(path)
    try:
        os.makedirs(os.path.dirname(resolved) or ".", exist_ok=True)
        with open(resolved, "w", encoding="utf-8") as fh:
            fh.write(content)
        return f"Wrote {len(content)} characters to {resolved}"
    except Exception as exc:
        return f"Error writing {resolved}: {exc}"


try:
    from crewai.tools import tool as _crewai_tool

    @_crewai_tool("Read File")
    def file_read_tool(path: str) -> str:
        """Read and return the contents of a file (e.g. revenue_data.json)."""
        return _read_file(path)

    @_crewai_tool("Write File")
    def file_write_tool(path: str, content: str) -> str:
        """Write text content to a file, creating parent directories as needed."""
        return _write_file(path, content)

except Exception:
    def file_read_tool(path: str) -> str:  # type: ignore[misc]
        return _read_file(path)

    def file_write_tool(path: str, content: str) -> str:  # type: ignore[misc]
        return _write_file(path, content)
