"""Web search tool for the Guided Childhood crew.

Uses DuckDuckGo (via the `duckduckgo_search` / `ddgs` package) so no API key
is required. If the optional `SERPER_API_KEY` env var is present, callers can
swap in crewai_tools.SerperDevTool instead, but DuckDuckGo is the default and
the preferred zero-config path.

The tool is exposed as a CrewAI `@tool` so any agent can call it.
"""

from __future__ import annotations

from crewai.tools import tool


def _ddg_search(query: str, max_results: int = 6) -> str:
    """Run a DuckDuckGo text search and return formatted results.

    Handles both the newer `ddgs` package and the older `duckduckgo_search`
    package, since the project was renamed upstream. Network/library errors are
    caught and returned as a readable string so an agent never crashes the run.
    """
    # Import lazily and tolerate either package name.
    DDGS = None
    try:  # newer package name
        from ddgs import DDGS as _DDGS

        DDGS = _DDGS
    except Exception:
        try:  # legacy package name
            from duckduckgo_search import DDGS as _DDGS

            DDGS = _DDGS
        except Exception as exc:  # pragma: no cover - import-time failure
            return (
                "Search unavailable: could not import a DuckDuckGo client "
                f"({exc}). Install `ddgs` or `duckduckgo_search`."
            )

    try:
        results = []
        with DDGS() as ddgs:
            for r in ddgs.text(query, region="uk-en", max_results=max_results):
                title = r.get("title", "").strip()
                body = r.get("body", "").strip()
                href = r.get("href") or r.get("url") or ""
                results.append(f"- {title}\n  {body}\n  SOURCE: {href}")

        if not results:
            return f"No results found for: {query}"
        return f"Top results for '{query}':\n\n" + "\n\n".join(results)
    except Exception as exc:
        # Never let a flaky search take down the whole crew run.
        return f"Search error for '{query}': {exc}"


@tool("Web Search")
def web_search_tool(query: str) -> str:
    """Search the web (DuckDuckGo, UK region) for current information.

    Use this to find recent UK education, safeguarding, digital-literacy news,
    journalist requests, or potential outreach targets. Pass a concise,
    specific query string. Returns titles, snippets, and source URLs.
    """
    return _ddg_search(query)
