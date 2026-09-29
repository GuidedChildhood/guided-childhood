#!/usr/bin/env node
// THE COPY DOES NOT READ AS MACHINE WRITTEN.
//
// Justin, 29 September 2026: do not use words or punctuation that let an
// algorithm, or a reader, place the writing as machine written.
//
// "No dashes in any copy, ever" has been non negotiable 4 in CLAUDE.md since
// the start, and until this file nothing checked it. Every pack was swept by
// hand, which worked because somebody remembered, and the one time the sweep
// was run with plain grep in a C locale it reported dashes that were smart
// quotes, because 0x80 matches inside a multi byte character. So this reads
// the file as text and matches code points, which is the only way the answer
// is trustworthy.
//
// TWO KINDS OF TELL, and only one of them belongs in a guard. The dash, the
// stock phrase and the "it is not X, it is Y" correction are deterministic:
// they are either in the file or they are not, and every hit is worth fixing.
// The other kind, the rule of three, even paragraph lengths, symmetry in the
// close, needs an ear, and a guard firing on those would cry wolf on writing
// that is fine. Those live in .claude/skills/content-engine/ai-tells.md for
// the writer. This file checks only what a machine can be right about.
//
// SCOPE is the marketing copy: content/packs. Lessons are checked by the
// module guards and have their own voice rules, and the skills themselves
// quote the banned phrases in order to ban them, so neither is swept here.
//
// AND SCOPE IS THE COPY, NOT THE FILING. A pack file mixes two things: the
// text that ships, and the scaffolding Justin navigates it by. "## MONDAY —
// The year the ground moved" is a label on a drawer, not a sentence anybody
// reads on LinkedIn, and a planning table's "| — |" is a blank cell. The first
// run of this guard reported 240 findings, 198 of them on heading lines and
// most of the rest in tables and quoted Google Doc titles. A guard that loud
// gets muted, so headings, table rows and quoted titles are not swept for
// dashes. They are still swept for the stock phrases, because a stock phrase
// in a heading is still somebody not choosing their words.
//
// AND IT FAILS ON WHAT WE WRITE NOW. Swept across every pack back to July it
// finds 17 real tells in copy that already went out, and rewriting published
// posts to satisfy a guard written afterwards is churn. So the default is
// every pack folder dated on or after the cutoff below.
//
// The cutoff is a date and not a git diff on purpose. Pack folders are named
// YYYY-MM-DD-slug, so the date is already in the path, and the workflow checks
// out at depth 1: `git merge-base HEAD origin/main` would throw there, the
// guard would sweep nothing, and CI would go green having checked no files.
// That is the same silent pass this file fails a mistyped argument for.
//
// `--all` sweeps every pack and is how you ask for the legacy debt, which is
// worth clearing when an old pack is being revised anyway.
//
// Usage: node scripts/check-ai-tells.mjs [--all] [path ...]

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, isAbsolute, basename } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const args = process.argv.slice(2)
const ALL = args.includes('--all')
const targets = args.filter(a => a !== '--all')

let failures = 0
const fail = (file, line, what, detail) => {
  failures++
  console.log(`FAIL  ${file}:${line}  ${what}${detail ? '  ' + detail : ''}`)
}

// ── WHAT COUNTS AS A DASH ───────────────────────────────────────────────────
//
// U+2010 to U+2015 is hyphen through horizontal bar, U+2212 is the minus sign.
// The ASCII hyphen is legal inside a compound word (phone-free), in a file
// path and in a URL, and illegal as punctuation between two words, which is
// the em dash wearing a disguise: "the thing - the other thing".
const UNICODE_DASH = /[‐-―−]/
const HYPHEN_AS_PUNCTUATION = /\S +- +\S/

// ── THE STOCK PHRASES ───────────────────────────────────────────────────────
//
// Kept in one place so the skills can point at it rather than each carrying a
// drifting copy, which is how the pricing block in linkedin-comment-replies
// went stale and put a wrong number in front of Justin on 27 September.
const PHRASES = [
  'it is worth noting', "it's worth noting", 'it is important to note',
  "it's important to note", 'in today’s world', "in today's world",
  'at the end of the day', 'that being said', 'having said that',
  'with that in mind', 'let us dive in', "let's dive in", 'dive into',
  'delve', 'leverage the', 'leveraging', 'game changer', 'game-changer',
  'seamlessly', 'in conclusion', 'i hope this helps', 'feel free to',
  'great question', 'you raise a valid point', 'thanks for sharing',
  'navigate the landscape', 'in an era where', 'now more than ever',
  'truth be told', 'plays a crucial role', 'plays a vital role',
  'a testament to', 'it goes without saying', 'needless to say',
  'the bottom line is', 'when it comes to',
]

// ── THE CORRECTION SHAPES ───────────────────────────────────────────────────
//
// "It is not just X, it is Y" and its family. The giveaway is the scaffolding
// announcing the contrast, not the contrast itself: Justin's own best line,
// "It is not literacy. It is the willingness to stay", denies a real claim in
// two sentences and is exactly what these patterns are not.
const SHAPES = [
  [/\b(?:it|this|that)(?:'s| is| was)? not just\b/i, 'the "not just X, it is Y" correction'],
  [/\bnot only\b[^.!?]{0,80}\bbut also\b/i, 'the "not only X but also Y" pairing'],
  [/\bis(?:n't| not) about\b[^.!?]{0,60}\bit(?:'s| is) about\b/i, 'the "not about X, about Y" correction'],
  [/\bhere(?:'s| is) the thing\b/i, 'signposting'],
  [/\bhere(?:'s| is) why (?:that|this) matters\b/i, 'signposting'],
  [/\bthe key takeaway\b/i, 'signposting'],
  [/\blet me explain\b/i, 'signposting'],
]

// A fenced code block or an indented block is not copy, and a link's target is
// not copy either, so a URL full of hyphens is not a finding.
const stripNonCopy = text => text
  .replace(/```[\s\S]*?```/g, m => m.replace(/[^\n]/g, ' '))
  .replace(/`[^`\n]*`/g, m => ' '.repeat(m.length))
  .replace(/\]\([^)\s]+\)/g, m => ' '.repeat(m.length))
  .replace(/https?:\/\/\S+/g, m => ' '.repeat(m.length))

const walk = dir => {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

// A line that is a drawer label rather than a sentence. Swept for phrases,
// not for dashes.
const isFiling = line =>
  /^\s*#{1,6}\s/.test(line) ||          // a markdown heading
  /^\s*\|/.test(line) ||                // a row of a planning table
  /^\s*>/.test(line) ||                 // a quoted line
  /^\s*\*\*[^*]+\*\*\s*[‐-―−]/.test(line) || // **Name** — gloss
  /"[^"]*[‐-―−][^"]*"/.test(line)            // a quoted document title

// The day this guard landed. A pack folder dated on or after it is swept by
// default. 2026-09-28 rather than the 29th because that pack passes clean, so
// there is no reason to exempt it.
const CUTOFF = '2026-09-28'

const packsFromCutoff = () => {
  const root = join(ROOT, 'content/packs')
  const dated = readdirSync(root).filter(name => {
    const d = (name.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1]
    return d && d >= CUTOFF
  })
  return dated.flatMap(name => walk(join(root, name)))
}

let files
if (targets.length) {
  files = []
  for (const r of targets) {
    // An absolute path is already the path. join(ROOT, '/tmp/x') would quietly
    // produce <repo>/tmp/x, which then does not exist, which used to print
    // SKIP and exit green: a mistyped argument in CI passed silently. A named
    // target that cannot be read is now a failure, because somebody meant it.
    const p = isAbsolute(r) ? r : join(ROOT, r)
    try { files.push(...(statSync(p).isDirectory() ? walk(p) : [p])) }
    catch { fail(r, 0, 'was named on the command line but cannot be read') }
  }
} else if (ALL) {
  files = walk(join(ROOT, 'content/packs'))
} else {
  files = packsFromCutoff()
}

for (const path of files) {
  // A path outside the repo prints as given; relative() would mangle it.
  const rel = path.startsWith(ROOT) ? relative(ROOT, path) : path
  const lines = stripNonCopy(readFileSync(path, 'utf8')).split('\n')
  lines.forEach((raw, i) => {
    const n = i + 1
    // A markdown bullet or a horizontal rule starts the line, and is structure
    // rather than punctuation inside a sentence.
    const line = raw.replace(/^\s*[-*]\s/, '  ').replace(/^\s*-{3,}\s*$/, '')
    if (!isFiling(raw)) {
      if (UNICODE_DASH.test(line)) fail(rel, n, 'a dash', JSON.stringify(line.trim().slice(0, 70)))
      if (HYPHEN_AS_PUNCTUATION.test(line)) fail(rel, n, 'a hyphen used as punctuation', JSON.stringify(line.trim().slice(0, 70)))
    }
    const low = line.toLowerCase()
    for (const phrase of PHRASES) if (low.includes(phrase)) fail(rel, n, `the phrase "${phrase}"`)
    for (const [re, what] of SHAPES) if (re.test(line)) fail(rel, n, what, JSON.stringify(line.trim().slice(0, 70)))
  })
}

const scope = targets.length ? 'named' : ALL ? 'pack' : `pack, dated ${CUTOFF} or later,`
console.log(
  failures === 0
    ? `PASS  ${files.length} ${scope} file${files.length === 1 ? '' : 's'} carry no dash and no stock phrase`
    : `\n${failures} to fix. The ones an ear has to catch, the rule of three and even paragraph lengths, are in .claude/skills/content-engine/ai-tells.md`,
)
process.exit(failures === 0 ? 0 : 1)
