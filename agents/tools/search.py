"""Web search tool for the Guided Childhood crew."""

from __future__ import annotations


def _ddg_search(query: str, max_results: int = 6) -> str:
    """Run a DuckDuckGo search. Returns formatted results, never raises."""
    DDGS = None
    try:
        from ddgs import DDGS as _DDGS
        DDGS = _DDGS
    except Exception:
        try:
            from duckduckgo_search import DDGS as _DDGS
            DDGS = _DDGS
        except Exception as exc:
            return (
                f"Search unavailable: could not import DuckDuckGo client ({exc}). "
                "Install `ddgs` or `duckduckgo_search`."
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
        return f"Search error for '{query}': {exc}"


try:
    from crewai.tools import tool as _crewai_tool

    @_crewai_tool("Web Search")
    def web_search_tool(query: str) -> str:
        """Search the web (DuckDuckGo, UK region) for current UK education,
        safeguarding, digital-literacy news, journalist requests, or outreach targets."""
        return _ddg_search(query)

except Exception:
    def web_search_tool(query: str) -> str:  # type: ignore[misc]
        return _ddg_search(query)
