#!/usr/bin/env node
// Rolls plans/decisions.md so the file every session reads stays small.
//
// The decisions log is append only and it grew to 1 MB, about 250,000 tokens.
// CLAUDE.md tells every session to read it at start and again after any
// compaction, so the log alone was spending a quarter of a million tokens
// before any work began. That is what was burning the daily model limit.
//
// Nothing is deleted. Entries older than the keep window move into a monthly
// archive under plans/decisions-archive/, each archive carries its own index
// with line numbers so one entry can be read with sed, and plans/decisions.md
// keeps the index plus the last couple of days in full.
//
// Run it at the end of a session, or any time the context guard complains:
//   npm run roll-decisions
//   node scripts/roll-decisions.mjs --keep-days 2 --index 120

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join } from 'node:path'

const LOG = 'plans/decisions.md'
const ARCHIVE_DIR = 'plans/decisions-archive'
const START = '<!-- roll:index:start -->'
const END = '<!-- roll:index:end -->'

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december']

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : Number(process.argv[i + 1])
}

const KEEP_DAYS = arg('keep-days', 2)
const INDEX_ENTRIES = arg('index', 120)

// A heading is either "## 2026-06-13 — title" or "## 13 September 2026: title".
// Three entries carry no date at all; they inherit the one before them so they
// travel with their neighbours instead of landing in the wrong month.
function dateOf(heading) {
  let m = heading.match(/^##\s+(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}`
  m = heading.match(/^##\s+(\d{1,2})\s+([A-Za-z]+)\.?,?\s+(\d{4})/)
  if (m) {
    const i = MONTHS.findIndex(x => x.startsWith(m[2].toLowerCase().slice(0, 3)))
    if (i >= 0) return `${m[3]}-${String(i + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`
  }
  return null
}

function title(heading) {
  return heading.replace(/^##\s+/, '').replace(/\s+$/, '')
}

function key(text) {
  return createHash('sha1').update(text.trim()).digest('hex')
}

// Splits a markdown body into dated entries, inheriting dates forwards.
function parseEntries(body, seedDate) {
  const out = []
  let last = seedDate
  for (const part of body.split(/^(?=## )/m)) {
    if (!part.startsWith('## ')) continue
    const heading = part.split('\n')[0]
    const date = dateOf(heading) ?? last
    last = date
    out.push({ date, heading, title: title(heading), text: part.replace(/\s+$/, '') + '\n' })
  }
  return out
}

const PREAMBLE = `# Decisions Log — Guided Childhood Platform

Append only. This file is the index. The full text lives in the monthly
archives under \`plans/decisions-archive/\`.

**Writing an entry.** Append it to the bottom of this file, under a heading of
\`## <date>, <what it is about>\`. Keep it under a dozen lines: what was decided,
the one reason worth knowing, and the PR number where the detail lives. The
reasoning belongs in the code comments and the pull request body. An entry that
runs to three hundred lines gets read by every session for weeks afterwards.

**Reading one.** Do not load an archive whole. Each archive opens with an index
giving the line number of every entry, so one decision is
\`sed -n '400,460p' plans/decisions-archive/2026-08.md\`, and a search across all
of them is \`grep -n "founder rate" plans/decisions-archive/*.md\`.

**Rolling.** \`npm run roll-decisions\` moves anything older than the keep window
into its month archive and rebuilds the index below. Run it at session end, or
when \`npm run context-guard\` says this file is over budget. Nothing is deleted.
`

function relDays(iso, today) {
  return Math.round((Date.parse(today) - Date.parse(iso)) / 86400000)
}

function archivePath(month) {
  return join(ARCHIVE_DIR, `${month}.md`)
}

// An archive is rewritten whole each time so its index line numbers stay true.
function writeArchive(month, entries) {
  const header = [
    `# Decisions archive — ${month}`,
    '',
    `Full text of the decisions rolled out of plans/decisions.md for ${month}.`,
    'Read one entry by its line number below. Do not load this file whole.',
    '',
    START,
  ]
  const footerOfIndex = [END, '']
  // The index sits between the header and the body, so its own length shifts
  // every line number. Its length is known once the entries are: one line each.
  const indexLines = entries.length
  let cursor = header.length + indexLines + footerOfIndex.length + 1
  const index = []
  const body = []
  for (const e of entries) {
    const lines = e.text.split('\n')
    index.push(`- L${cursor} · ${e.date} · ${e.title}`)
    body.push(e.text)
    cursor += lines.length
  }
  const out = [...header, ...index, ...footerOfIndex, ...body].join('\n').replace(/\n+$/, '\n')
  mkdirSync(ARCHIVE_DIR, { recursive: true })
  writeFileSync(archivePath(month), out)
  return out
}

function readArchive(month) {
  const p = archivePath(month)
  if (!existsSync(p)) return []
  const src = readFileSync(p, 'utf8')
  const after = src.includes(END) ? src.slice(src.indexOf(END) + END.length) : src
  return parseEntries(after, `${month}-01`)
}

function main() {
  const today = (process.env.ROLL_TODAY ?? new Date().toISOString().slice(0, 10))
  const src = readFileSync(LOG, 'utf8')

  // On a rolled file the live entries sit after the generated block. On the
  // first run there is no block, so everything from the first heading counts.
  const body = src.includes(END) ? src.slice(src.indexOf(END) + END.length) : src
  const live = parseEntries(body, '2026-06-13')

  const keep = []
  const toArchive = new Map()
  for (const e of live) {
    if (relDays(e.date, today) < KEEP_DAYS) { keep.push(e); continue }
    const month = e.date.slice(0, 7)
    if (!toArchive.has(month)) toArchive.set(month, [])
    toArchive.get(month).push(e)
  }

  // Merge into the archives, skipping anything already there.
  const months = new Set([...toArchive.keys()])
  if (existsSync(ARCHIVE_DIR)) {
    for (const f of readdirSync(ARCHIVE_DIR)) {
      if (f.endsWith('.md')) months.add(f.replace(/\.md$/, ''))
    }
  }

  const summary = []
  let moved = 0
  for (const month of [...months].sort()) {
    const existing = readArchive(month)
    const seen = new Set(existing.map(e => key(e.text)))
    const added = (toArchive.get(month) ?? []).filter(e => !seen.has(key(e.text)))
    moved += added.length
    const all = [...existing, ...added].sort((a, b) => a.date.localeCompare(b.date))
    writeArchive(month, all)
    const first = all[0]?.date ?? month
    const last = all[all.length - 1]?.date ?? month
    summary.push({ month, count: all.length, first, last })
  }

  // The generated block: where everything lives, then the most recent titles.
  const preamble = src.includes(START) ? src.slice(0, src.indexOf(START)).replace(/\s+$/, '') : PREAMBLE.replace(/\s+$/, '')

  const table = [
    '## Where the full entries live',
    '',
    '| Archive | Covers | Entries |',
    '| --- | --- | --- |',
    ...summary.map(s => `| \`${archivePath(s.month)}\` | ${s.first} to ${s.last} | ${s.count} |`),
  ]

  const indexed = summary
    .flatMap(s => readArchive(s.month).map(e => ({ ...e, month: s.month })))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-INDEX_ENTRIES)

  const recent = [
    '',
    `## The last ${indexed.length} decisions`,
    '',
    'Titles only. Open the archive at the line number in its own index for the full entry.',
    '',
    ...indexed.map(e => `- ${e.date} · ${e.title} · \`${archivePath(e.month)}\``),
  ]

  // The heading for the live entries sits INSIDE the generated block, above the
  // end marker. Everything after that marker is parsed as a decision on the next
  // run, so a generated heading left below it would archive itself as an entry.
  const liveHeading = ['', `## Not yet rolled (the last ${KEEP_DAYS} days, in full)`, '']
  const kept = keep.length ? keep.map(e => e.text) : ['_Nothing since the last roll._']

  const out = [preamble, '', START, ...table, ...recent, ...liveHeading, END, '', ...kept]
    .join('\n').replace(/\n+$/, '\n')
  writeFileSync(LOG, out)

  const before = Buffer.byteLength(src)
  const after = Buffer.byteLength(out)
  console.log(`rolled ${moved} entries into ${summary.length} archives`)
  console.log(`${LOG}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB ` +
    `(about ${Math.round(before / 4000)}k tokens -> ${Math.round(after / 4000)}k)`)
}

main()
