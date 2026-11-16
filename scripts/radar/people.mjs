#!/usr/bin/env node
// The researcher watch. Justin, 16 November 2026: follow what Candice Odgers,
// Catherine Knibbs and Jonathan Haidt publish, so we can back the work we
// support and challenge, on the evidence, the work we disagree with.
//
// What it reads, all public and all probed from this container:
//   - new papers by each person, from Europe PMC (author search) and Crossref
//     (query.author), through the radar's polite fetch layer in sources.mjs
//   - any public feed listed for the person (Haidt's After Babel Substack)
//
// What it cannot read, and does not pretend to: LinkedIn activity (likes,
// reposts, comments). LinkedIn refuses automated reading, and logging in as
// Justin to scrape it would break its terms. Knibbs's own site refuses
// automated reads too. A person can paste anything from either into the
// watch file by hand, under "Pasted by hand".
//
// What it does with what it finds: nothing public. It writes a digest to
// content/research-watch/ built from the Claude reviews in reviews.json, which decides per item: SUPPORT
// (it backs our approach), CHALLENGE (we disagree, and the evidence lets us
// say why), CONTEXT (useful, no position) or SKIP. A CHALLENGE needs a real
// evidential reason, never disagreement for its own sake. Nothing here goes
// near a post until it has been through the radar's normal review, and the
// house rule on naming still holds: a living clinician (Knibbs) is never named
// beside our advice; researchers (Odgers, Haidt) may be named when we cite
// their published work accurately.
//
// Usage:
//   node scripts/radar/people.mjs [--days 30]

import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { get, getJson, mailtoParam } from './sources.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'content', 'research-watch')

export const PEOPLE = [
  {
    id: 'odgers',
    name: 'Candice Odgers',
    role: 'researcher',
    stance: 'Ally. Small average effects, risk concentrated in vulnerable children, against moral panic. Closest to our thesis.',
    epmc: 'AUTH:"Odgers CL" OR AUTH:"Odgers C"',
    crossrefAuthor: 'Candice Odgers',
    match: /odgers/i,
    feeds: [],
    mayName: true,
  },
  {
    id: 'haidt',
    name: 'Jonathan Haidt',
    role: 'researcher',
    stance: 'Respected opponent on mechanism. Agrees the worry is real; we differ on cause (screen time versus what the child carries in and what the feed does with it). Challenge only where the evidence lets us.',
    epmc: 'AUTH:"Haidt J"',
    crossrefAuthor: 'Jonathan Haidt',
    match: /haidt/i,
    feeds: [{ name: 'After Babel (Substack)', url: 'https://www.afterbabel.com/feed' }],
    mayName: true,
  },
  {
    id: 'knibbs',
    name: 'Catherine Knibbs',
    role: 'clinician',
    stance: 'Ally. Child online harm and trauma clinician. Never named beside our advice; her published work may inform it.',
    epmc: 'AUTH:"Knibbs C"',
    crossrefAuthor: 'Catherine Knibbs',
    match: /knibbs/i,
    feeds: [],
    mayName: false,
  },
]

const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim()
const iso = (d) => d.toISOString().slice(0, 10)

async function papersEpmc(p, since, until) {
  const q = `(${p.epmc}) AND (FIRST_PDATE:[${since} TO ${until}])`
  const url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(q)}&format=json&pageSize=25&resultType=core`
  const r = await getJson(url)
  if (!r.ok) return { ok: false, error: r.error || `status ${r.status}`, items: [] }
  const items = (r.json?.resultList?.result || [])
    .filter((x) => p.match.test(x.authorString || ''))
    .map((x) => ({
      kind: 'paper', source: 'europepmc',
      title: clean(x.title), doi: (x.doi || '').toLowerCase() || null,
      url: x.doi ? `https://doi.org/${x.doi}` : null,
      venue: clean(x.journalInfo?.journal?.title || ''), date: x.firstPublicationDate || null,
      authors: clean(x.authorString), preprint: x.source === 'PPR',
      summary: clean(x.abstractText || '').slice(0, 600),
    }))
  return { ok: true, items }
}

async function papersCrossref(p, since, until) {
  const url = `https://api.crossref.org/works?query.author=${encodeURIComponent(p.crossrefAuthor)}&filter=from-online-pub-date:${since},until-online-pub-date:${until}&rows=20&sort=published&order=desc${mailtoParam()}`
  const r = await getJson(url)
  if (!r.ok) return { ok: false, error: r.error || `status ${r.status}`, items: [] }
  const items = (r.json?.message?.items || [])
    // Crossref's author query is fuzzy. Keep only works with the surname AND
    // the given name's initial on an actual author.
    .filter((w) => (w.author || []).some((a) => p.match.test(a.family || '') && (a.given || '')[0] === p.crossrefAuthor[0]))
    .map((w) => ({
      kind: 'paper', source: 'crossref',
      title: clean((w.title || [])[0] || ''), doi: (w.DOI || '').toLowerCase() || null,
      url: w.DOI ? `https://doi.org/${w.DOI}` : w.URL || null,
      venue: clean((w['container-title'] || [])[0] || w.publisher || ''),
      date: (w.published?.['date-parts']?.[0] || []).map((n, i) => (i ? String(n).padStart(2, '0') : n)).join('-') || null,
      authors: (w.author || []).map((a) => clean(`${a.given || ''} ${a.family || ''}`)).join(', '),
      preprint: w.type === 'posted-content',
      summary: clean((w.abstract || '').replace(/<[^>]+>/g, '')).slice(0, 600),
    }))
  return { ok: true, items }
}

/** A small RSS reader: title, link, date, first paragraph of the description. */
export function parseRss(xml) {
  const items = []
  for (const m of String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1]
    const tag = (t) => {
      const x = block.match(new RegExp(`<${t}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${t}>`))
      return x ? x[1] : ''
    }
    items.push({
      title: clean(tag('title')),
      url: clean(tag('link')),
      date: tag('pubDate') ? iso(new Date(tag('pubDate'))) : null,
      authors: clean(tag('dc:creator')),
      summary: clean(tag('description').replace(/<[^>]+>/g, ' ')).slice(0, 600),
    })
  }
  return items
}

async function feed(f, since) {
  const r = await get(f.url, { ttlHours: 6 })
  if (!r.ok) return { ok: false, error: r.error || `status ${r.status}`, items: [] }
  const items = parseRss(r.body)
    .filter((x) => !x.date || x.date >= since)
    .map((x) => ({ kind: 'post', source: f.name, venue: f.name, doi: null, preprint: false, ...x }))
  return { ok: true, items }
}

function dedupe(items) {
  const seen = new Set()
  return items.filter((x) => {
    const k = x.doi || x.url || x.title.toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

export async function watch({ days = 30, now = new Date() } = {}) {
  const until = iso(now)
  const since = iso(new Date(now.getTime() - days * 86400_000))
  const people = []
  for (const p of PEOPLE) {
    const runs = [await papersEpmc(p, since, until), await papersCrossref(p, since, until)]
    for (const f of p.feeds) runs.push(await feed(f, since))
    const lost = runs.filter((r) => !r.ok).map((r) => r.error)
    const items = dedupe(runs.flatMap((r) => r.items)).sort((a, b) => String(b.date).localeCompare(String(a.date)))
    people.push({ id: p.id, name: p.name, role: p.role, stance: p.stance, mayName: p.mayName, items, lost })
  }
  return { since, until, people }
}

const REVIEWS = join(OUT, 'reviews.json')
export function loadReviews(path = REVIEWS) {
  try { return JSON.parse(readFileSync(path, 'utf8')) } catch { return {} }
}
const keyOf = (x) => x.doi || x.url

/** The full watch, as plain text a person or ChatGPT can read in Drive. */
export function digest(w, reviews = loadReviews()) {
  const L = [
    `RESEARCHER WATCH, week to ${w.until}`,
    '',
    `New work from ${w.since} to ${w.until} by Candice Odgers, Jonathan Haidt and Catherine Knibbs, and new After Babel posts.`,
    'Each item has a Claude review: SUPPORT (backs our approach), CHALLENGE (we disagree and the evidence lets us say why), CONTEXT (useful, no position) or SKIP.',
    'NOTHING HERE IS CLEARED FOR A POST. A promising item goes into the 08:00 CANDIDATES file and through the normal review. Only figures that review clears may be used.',
    'A challenge is made on the evidence only, never disagreement for its own sake. Catherine Knibbs is never named beside our advice. Researchers may be named when their published work is cited accurately.',
    'LinkedIn activity (likes, reposts) cannot be read automatically and is not included.',
    '',
  ]
  const counts = {}
  for (const p of w.people) {
    L.push(`== ${p.name.toUpperCase()} (${p.role}) ==`, p.stance, '')
    if (p.lost.length) L.push(`Sources that failed this run: ${p.lost.join('; ')}`, '')
    if (!p.items.length) L.push('Nothing new in the window.', '')
    for (const x of p.items) {
      const r = reviews[keyOf(x)] || {}
      const v = r.verdict || 'PENDING'
      counts[v] = (counts[v] || 0) + 1
      L.push(`${v}: ${x.title}`)
      L.push(`  Type and date: ${x.kind === 'post' ? 'blog post' : x.preprint ? 'preprint' : 'paper'}, ${x.venue || x.source}, ${x.date || 'undated'}`)
      L.push(`  Link: ${x.url || 'none'}`)
      if (x.authors) L.push(`  Authors: ${x.authors.slice(0, 200)}`)
      L.push(`  How much was read: ${r.read || 'not yet read'}`)
      L.push(`  Study design: ${r.design || 'to be reviewed'}`)
      L.push(`  Finding: ${r.finding || 'to be reviewed'}`)
      L.push(`  Limitations: ${r.limitations || 'to be reviewed'}`)
      L.push(`  Our position: ${r.reason || 'to be reviewed'}`)
      L.push(`  Parent problem it speaks to: ${r.parentProblem || 'none'}`, '')
    }
  }
  L.splice(7, 0, `This week: ${Object.entries(counts).map(([k, n]) => `${n} ${k}`).join(', ') || 'nothing new'}.`, '')
  L.push('== PASTED BY HAND ==', 'LinkedIn posts, talks or interviews worth keeping: the link, the words and the date.', '')
  return L.join('\n')
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const i = process.argv.indexOf('--days')
  const days = i > 0 ? Number(process.argv[i + 1]) : 30
  const w = await watch({ days })
  mkdirSync(OUT, { recursive: true })
  const base = join(OUT, w.until)
  writeFileSync(`${base}.json`, JSON.stringify(w, null, 2) + '\n')
  // Reviews live in reviews.json, so the digest can always be rebuilt.
  writeFileSync(`${base}.md`, digest(w))
  for (const p of w.people) console.log(`${p.name}: ${p.items.length} new${p.lost.length ? `, lost ${p.lost.length} source(s)` : ''}`)
}
