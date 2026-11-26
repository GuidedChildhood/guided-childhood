#!/usr/bin/env node
// Step 5 of the authentic founder writing standard (Justin, 26 November 2026):
// "Compare openings and endings against the previous ten posts", and step 4,
// "identify repetitive sentence and paragraph structures".
//
// For a draft, against the ten most recent posts we hold the text of:
//   - the opening sentence and the last two sentences, word overlap
//   - the house tics: any four word phrase that already appears in three or
//     more of those posts and turns up again in the draft
//
// It prints and judges nothing on its own: a repeated phrase can be the right
// one. It is the evidence the founder voice review reads before it decides.
//
// Usage:
//   node scripts/radar/openings.mjs <draft.md> [more drafts]
//   node scripts/radar/openings.mjs --corpus      list what it compares against

import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import * as reg from './register.mjs'
import { parsePostRegister } from './contract.mjs'
import { similarity } from './qa.mjs'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const OPENING_LIMIT = 0.5
export const TIC_MIN_POSTS = 3

const sentences = (t) => String(t).replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z0-9"“])/).map((s) => s.trim()).filter(Boolean)
const words = (t) => String(t).toLowerCase().replace(/[’']/g, '').split(/[^a-z0-9]+/).filter(Boolean)
const grams = (t, n = 4) => { const w = words(t); const out = new Set(); for (let i = 0; i + n <= w.length; i++) out.add(w.slice(i, i + n).join(' ')); return out }

/** The post text only: everything before a first comment or platform marker. */
export function postBody(text) {
  return String(text).split(/\n-{3}\s*(FIRST COMMENT|IG|FB)|\n#{1,3}\s*First comment/i)[0].replace(/^#+.*$/gm, '').trim()
}

/** The ten most recent posts we hold the text of: posted first, then approved, newest number first. */
export function corpus({ limit = 10 } = {}) {
  const rows = parsePostRegister()
  const state = new Map(rows.map((r) => [r.number, r.posted ? 'posted' : /APPROVED/.test(r.state || '') ? 'approved' : 'other']))
  const out = []
  for (const r of reg.all()) {
    const n = r.gdcPostNumber && String(r.gdcPostNumber).padStart(3, '0')
    const f = r.pack?.file && `${ROOT}${r.pack.file}`
    if (!n || !f || !existsSync(f)) continue
    const s = state.get(n)
    if (s !== 'posted' && s !== 'approved') continue
    const body = JSON.parse(readFileSync(f, 'utf8')).linkedin?.body
    if (body) out.push({ id: `GDC-${n}`, state: s, body })
  }
  return out.sort((a, b) => (a.state === b.state ? b.id.localeCompare(a.id) : a.state === 'posted' ? -1 : 1)).slice(0, limit)
}

/** Four word phrases found in at least TIC_MIN_POSTS of the corpus posts. */
export function houseTics(posts) {
  const count = new Map()
  for (const p of posts) for (const g of grams(p.body)) count.set(g, (count.get(g) || 0) + 1)
  return new Set([...count].filter(([, c]) => c >= TIC_MIN_POSTS).map(([g]) => g))
}

export function compare(draftText, posts = corpus(), { exclude = null } = {}) {
  posts = posts.filter((p) => p.id !== exclude)
  const body = postBody(draftText)
  const s = sentences(body)
  const open = s[0] || ''
  const end = s.slice(-2).join(' ')
  const opening = posts.map((p) => ({ id: p.id, score: similarity(open, sentences(p.body)[0] || '') })).filter((x) => x.score >= OPENING_LIMIT)
  const ending = posts.map((p) => ({ id: p.id, score: similarity(end, sentences(p.body).slice(-2).join(' ')) })).filter((x) => x.score >= OPENING_LIMIT)
  const tics = houseTics(posts)
  const repeated = [...grams(body)].filter((g) => tics.has(g))
  return { opening, ending, repeated, compared: posts.map((p) => p.id) }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const posts = corpus()
  if (args.includes('--corpus') || !args.length) {
    console.log(`compared against ${posts.length} posts: ${posts.map((p) => `${p.id} (${p.state})`).join(', ')}`)
    console.log(`house tics (in ${TIC_MIN_POSTS}+ of them): ${[...houseTics(posts)].join(' | ') || 'none'}`)
    if (!args.length) process.exit(0)
  }
  for (const f of args.filter((a) => !a.startsWith('--'))) {
    const n = (f.match(/(\d{3})[^/]*$/) || [])[1]
    const r = compare(readFileSync(f, 'utf8'), posts, { exclude: n ? `GDC-${n}` : null })
    console.log(`\n${f}`)
    console.log(`  opening like: ${r.opening.map((x) => `${x.id} ${x.score.toFixed(2)}`).join(', ') || 'none'}`)
    console.log(`  ending like:  ${r.ending.map((x) => `${x.id} ${x.score.toFixed(2)}`).join(', ') || 'none'}`)
    console.log(`  house tics:   ${r.repeated.join(' | ') || 'none'}`)
  }
}
