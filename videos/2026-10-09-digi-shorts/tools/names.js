// Swaps the real family names that the ref-* fixtures carry (Justin's own
// children, AMBER in content/brand-story/founder-context.md) for the film's
// invented family before any frame is captured. Runs in the page as an init
// script: every text node and placeholder, now and as React re-renders.
// The map is passed in; longest names first so "Alma Rose" wins over "Alma".
;(function (MAP) {
  const keys = Object.keys(MAP).sort((a, b) => b.length - a.length)
  const re = new RegExp('\\b(' + keys.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi')
  const fix = (s) => s.replace(re, (m) => {
    const k = keys.find((x) => x.toLowerCase() === m.toLowerCase()); const v = MAP[k]
    return m === m.toUpperCase() && m !== m.toLowerCase() ? v.toUpperCase() : v
  })
  const walk = (root) => {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    let n; while ((n = w.nextNode())) { const t = fix(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t }
    if (root.querySelectorAll) root.querySelectorAll('[placeholder],[aria-label],[alt],textarea,input').forEach((el) => {
      for (const a of ['placeholder', 'aria-label', 'alt']) { const v = el.getAttribute(a); if (v) { const t = fix(v); if (t !== v) el.setAttribute(a, t) } }
    })
  }
  const start = () => {
    walk(document.body)
    new MutationObserver((ms) => { for (const m of ms) { if (m.type === 'characterData') { const t = fix(m.target.nodeValue); if (t !== m.target.nodeValue) m.target.nodeValue = t } m.addedNodes.forEach((x) => (x.nodeType === 3 ? (x.nodeValue = fix(x.nodeValue)) : x.nodeType === 1 && walk(x))) } })
      .observe(document.body, { subtree: true, childList: true, characterData: true })
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start)
})(window.__FILM_NAMES__ || {})
