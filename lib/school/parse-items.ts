// Reading the model's reply into a list, including a reply that was cut short.
//
// Justin, 22 November 2026: the photo add "didn't read one letter that had a
// date". One way that happens: a letter with a dozen dates on it makes a long
// answer, the answer hits the token limit before the closing bracket, and a
// reader that insists on a whole list throws all twelve away. So a cut list
// keeps every item that was finished. Pure, tested in parse-items.test.ts.

/** Every complete {...} object in the text's first array, in order. */
export function parseItemArray(text: string): unknown[] {
  const start = text.indexOf('[')
  if (start === -1) return []
  const end = text.lastIndexOf(']')
  if (end > start) {
    try {
      const whole = JSON.parse(text.slice(start, end + 1))
      if (Array.isArray(whole)) return whole
    } catch { /* fall through and salvage */ }
  }
  const out: unknown[] = []
  let depth = 0, from = -1, inString = false, escaped = false
  for (let i = start + 1; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (escaped) escaped = false
      else if (c === '\\') escaped = true
      else if (c === '"') inString = false
      continue
    }
    if (c === '"') inString = true
    else if (c === '{') { if (depth === 0) from = i; depth++ }
    else if (c === '}') {
      depth--
      if (depth === 0 && from !== -1) {
        try { out.push(JSON.parse(text.slice(from, i + 1))) } catch { /* a broken one is skipped */ }
        from = -1
      }
    }
  }
  return out
}
