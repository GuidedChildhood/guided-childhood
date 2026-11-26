#!/usr/bin/env node
// How much of a post is still Justin's own words.
//
// Rule 1 of plans/2026-11-26-community-voice-plan.md (Justin, 26 November
// 2026: "yes"): in other people's spaces (Mumsnet, Reddit, Facebook groups,
// school WhatsApps, replies to parents) Justin writes first and Claude only
// checks. This measures it: the share of the final post's words that come, in
// order, from Justin's own draft. Below 90 percent the post goes back to him.
//
// Words are compared lower case with punctuation stripped, so a fixed typo or
// an added comma costs almost nothing and a rewritten sentence costs a lot.
//
// Usage: npm run own-words -- <justin's draft> <final post>

import { readFileSync } from 'node:fs'

export const THRESHOLD = 0.9
const tokens = (s) => s.toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter(Boolean)

/** Share of the final's words that appear, in order, in the draft (longest common subsequence). */
export function ownShare(draft, final) {
  const a = tokens(draft), b = tokens(final)
  if (!b.length) return 1
  let prev = new Array(b.length + 1).fill(0)
  for (let i = 1; i <= a.length; i++) {
    const cur = new Array(b.length + 1).fill(0)
    for (let j = 1; j <= b.length; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1])
    prev = cur
  }
  return prev[b.length] / b.length
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [draftPath, finalPath] = process.argv.slice(2)
  if (!draftPath || !finalPath) { console.log('usage: npm run own-words -- <justin\'s draft> <final post>'); process.exit(2) }
  const share = ownShare(readFileSync(draftPath, 'utf8'), readFileSync(finalPath, 'utf8'))
  const pct = Math.round(share * 100)
  if (share >= THRESHOLD) console.log(`PASS  ${pct} percent of the post is Justin's own words (needs 90)`)
  else console.log(`FAIL  only ${pct} percent of the post is Justin's own words (needs 90). It goes back to him: suggest, do not rewrite.`)
  process.exit(share >= THRESHOLD ? 0 : 1)
}
