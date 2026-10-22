#!/usr/bin/env node
// SEO for both apps, through gum.
//
// Justin, 21 October 2026, with gumcli.dev on the TV: "Build this for my apps,
// gum for seo plan." The plan is plans/2026-10-21-gum-seo-plan.md and the
// weekly pass is .claude/skills/seo-gum/SKILL.md.
//
// gum (github.com/ehmo/gum) is one Go binary that calls Google APIs from a
// local credential and dispatches every call by risk class. This file is the
// part that has to be exact, so it is code and not a prompt:
//
//   doctor   is gum installed and logged in, and are our properties verified.
//   pull     the last 28 days and the 28 before, by query and page, for each
//            property in content/seo/config.json. Read only. Writes
//            content/seo/pull-<date>.json, which Justin commits.
//   report   the newest pull turned into content/seo/report-<date>.md. Needs
//            no gum and no login, so a cloud session can run it on a pull
//            that was made on the Mac.
//   inspect  URL Inspection on every sitemap URL. Read only.
//   submit   resubmits each sitemap. The one write, behind --allow-write.
//
// Never called from here: sites.delete, sitemaps.delete, and the Indexing API,
// which Google limits to job postings and livestreams.
//
// Why the pull runs on the Mac: Search Console in gum is bring your own OAuth,
// a browser consent on the machine running gum. A cloud container cannot
// finish that loopback login, so the credential stays on the Mac and only the
// numbers, aggregate and anonymous, reach the repo.
//
// No dependencies. GUM_BIN points at a gum other than the one on PATH (the
// tests point it at a fake), SEO_DIR moves the output folder, SEO_TODAY fixes
// the date.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const seoDir = () => process.env.SEO_DIR || join(ROOT, 'content', 'seo')
const today = () => process.env.SEO_TODAY || new Date().toISOString().slice(0, 10)

/** Search Console data settles about three days behind. */
const LAG_DAYS = 3
const WINDOW_DAYS = 28
/** The API's own ceiling for one page of rows. */
const ROW_LIMIT = 25000

/**
 * A rough page one click curve, position to expected CTR. Only used to say a
 * result is clicked at under half the rate its position usually earns, so the
 * exact figures matter less than the shape.
 */
const EXPECTED_CTR = [0, 0.28, 0.15, 0.1, 0.07, 0.05, 0.04, 0.03, 0.025, 0.02, 0.018]

export function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** The current and previous windows, both ending LAG_DAYS before today. */
export function windows(day = today()) {
  const end = addDays(day, -LAG_DAYS)
  const start = addDays(end, -(WINDOW_DAYS - 1))
  return {
    current: { startDate: start, endDate: end },
    previous: { startDate: addDays(start, -WINDOW_DAYS), endDate: addDays(start, -1) },
  }
}

export function loadConfig() {
  return JSON.parse(readFileSync(join(seoDir(), 'config.json'), 'utf8'))
}

// ── gum ─────────────────────────────────────────────────────────────────────

/**
 * One gum call. Read by default; write only when allowWrite is passed, which
 * maps to gum's own --allow-write gate. Throws with gum's how_to_fix when the
 * call is refused, because that text is the next step for whoever is running
 * it (usually a missing login).
 */
export function gum(op, args, { allowWrite = false } = {}) {
  const bin = process.env.GUM_BIN || 'gum'
  const argv = [allowWrite ? 'write' : 'read', op, '--args', JSON.stringify(args), '--format', 'raw', '--max-items', 'all']
  if (allowWrite) argv.push('--allow-write')
  const r = spawnSync(bin, argv, { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 })
  if (r.error) {
    throw new Error(r.error.code === 'ENOENT'
      ? `gum is not installed. On the Mac: brew tap ehmo/tap && brew install ehmo/tap/gum`
      : r.error.message)
  }
  let out = null
  try { out = r.stdout.trim() ? JSON.parse(r.stdout) : {} } catch { /* not JSON, handled below */ }
  // A refusal comes back as a JSON envelope on stderr with an empty stdout.
  let refusal = out && out.error_code ? out : null
  if (!refusal && r.status !== 0) {
    try { refusal = JSON.parse(r.stderr) } catch { /* plain text, handled below */ }
  }
  if (refusal && refusal.error_code) {
    // gum's own SCOPE_MISSING hint points at describe; the step that fixes it
    // for us is always the one login.
    const fix = refusal.error_code === 'SCOPE_MISSING'
      ? 'Not logged in to Search Console. On the Mac: gum login --service searchconsole'
      : refusal.how_to_fix || refusal.message || ''
    throw new Error(`${op}: ${refusal.error_code}. ${fix}`.trim())
  }
  if (r.status !== 0 || out === null) {
    throw new Error(`${op} failed: ${(r.stderr || r.stdout || '').trim().slice(0, 400)}`)
  }
  return out
}

/** The rows array, wherever gum's envelope put it. */
export function findRows(resp, depth = 0) {
  if (!resp || typeof resp !== 'object' || depth > 3) return []
  if (Array.isArray(resp.rows)) return resp.rows
  for (const v of Object.values(resp)) {
    const rows = findRows(v, depth + 1)
    if (rows.length) return rows
  }
  return []
}

function pageFilter(host) {
  return [{ filters: [{ dimension: 'page', operator: 'contains', expression: `${host}/` }] }]
}

/** Every query and page row for one property and window, paged. */
export function queryRows(prop, win) {
  const rows = []
  for (let startRow = 0; ; startRow += ROW_LIMIT) {
    const resp = gum('searchconsole.searchanalytics.query', {
      siteUrl: prop.siteUrl,
      body: {
        ...win,
        dimensions: ['query', 'page'],
        dimensionFilterGroups: pageFilter(prop.host),
        rowLimit: ROW_LIMIT,
        startRow,
        dataState: 'final',
      },
    })
    const page = findRows(resp)
    // Kept as short arrays so a year of weekly pulls stays small in git.
    for (const r of page) rows.push([r.keys[0], r.keys[1], r.clicks, r.impressions, round(r.position, 1)])
    if (page.length < ROW_LIMIT) return rows
  }
}

const round = (n, dp) => Math.round(n * 10 ** dp) / 10 ** dp

// ── sitemaps ────────────────────────────────────────────────────────────────

/**
 * The URLs a property's sitemap lists, read from the sitemap.ts source rather
 * than the live XML, so the report and the inspect pass judge what this
 * branch ships. Both files list literal paths: { path: '/x' } in the parent
 * app, `${BASE}/x` in schools.
 */
export function sitemapUrls(prop, root = ROOT) {
  const file = join(root, prop.sitemapSource)
  if (!existsSync(file)) return []
  const src = readFileSync(file, 'utf8')
  const paths = new Set()
  for (const m of src.matchAll(/path:\s*'([^']*)'/g)) paths.add(m[1])
  for (const m of src.matchAll(/\$\{BASE(?:_URL)?\}(\/[^`]*)?`/g)) paths.add(m[1] || '')
  return [...paths].map(p => `${prop.host}${p === '/' ? '' : p}`)
}

const normal = url => url.replace(/\/$/, '')

// ── report ──────────────────────────────────────────────────────────────────

function rollUp(rows, keyIndex) {
  const by = new Map()
  for (const r of rows) {
    const key = r[keyIndex]
    const a = by.get(key) || { key, clicks: 0, impressions: 0, posWeighted: 0, pages: new Map() }
    a.clicks += r[2]
    a.impressions += r[3]
    a.posWeighted += r[4] * r[3]
    const other = r[keyIndex === 0 ? 1 : 0]
    a.pages.set(other, (a.pages.get(other) || 0) + r[3])
    by.set(key, a)
  }
  for (const a of by.values()) {
    a.position = a.impressions ? round(a.posWeighted / a.impressions, 1) : 0
    a.ctr = a.impressions ? a.clicks / a.impressions : 0
    a.top = [...a.pages.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] || ''
    delete a.pages
    delete a.posWeighted
  }
  return by
}

/**
 * The opportunities in one property's pull. Pure, so the tests can feed it
 * numbers. minImpressions is low on purpose: a young site has small numbers
 * and a query with twelve impressions at position nine is still the lead.
 */
export function analyse(current, previous, sitemap, { minImpressions = 10, limit = 15 } = {}) {
  const q = rollUp(current, 0)
  const qPrev = rollUp(previous, 0)
  const p = rollUp(current, 1)
  const pPrev = rollUp(previous, 1)
  const queries = [...q.values()]
  const byImpr = (a, b) => b.impressions - a.impressions

  const striking = queries
    .filter(a => a.position >= 8 && a.position <= 20 && a.impressions >= minImpressions)
    .sort(byImpr).slice(0, limit)

  const ctrGaps = queries
    .filter(a => a.position >= 1 && a.position <= 10 && a.impressions >= minImpressions * 2)
    .map(a => ({ ...a, expected: EXPECTED_CTR[Math.max(1, Math.round(a.position))] }))
    .filter(a => a.ctr < a.expected / 2)
    .sort(byImpr).slice(0, limit)

  const newQueries = queries.filter(a => !qPrev.has(a.key)).sort(byImpr).slice(0, limit)

  const pages = new Set([...p.keys(), ...pPrev.keys()])
  const movers = [...pages].map(key => {
    const now = p.get(key) || { clicks: 0, impressions: 0 }
    const before = pPrev.get(key) || { clicks: 0, impressions: 0 }
    return { key, clicks: now.clicks, clicksBefore: before.clicks, impressions: now.impressions, impressionsBefore: before.impressions, delta: now.impressions - before.impressions }
  })
  const rising = movers.filter(m => m.delta > 0).sort((a, b) => b.delta - a.delta).slice(0, 10)
  const falling = movers.filter(m => m.delta < 0).sort((a, b) => a.delta - b.delta).slice(0, 10)

  const seen = new Set([...p.keys()].map(normal))
  const neverShown = sitemap.filter(u => !seen.has(normal(u)))

  const totals = {
    clicks: queries.reduce((s, a) => s + a.clicks, 0),
    impressions: queries.reduce((s, a) => s + a.impressions, 0),
    clicksBefore: [...qPrev.values()].reduce((s, a) => s + a.clicks, 0),
    impressionsBefore: [...qPrev.values()].reduce((s, a) => s + a.impressions, 0),
    queries: queries.length,
  }
  return { totals, striking, ctrGaps, newQueries, rising, falling, neverShown }
}

const pct = n => `${(n * 100).toFixed(1)}%`
const path = (url, host) => url.startsWith(host) ? (url.slice(host.length) || '/') : url
const cell = s => String(s).replace(/\|/g, '\\|')

function table(head, rows) {
  if (!rows.length) return '_Nothing this week._\n'
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...rows.map(r => `| ${r.map(cell).join(' | ')} |`)].join('\n') + '\n'
}

export function renderReport(pull, analyses) {
  const out = [`# Search report, ${pull.day}`, '',
    `Window ${pull.windows.current.startDate} to ${pull.windows.current.endDate}, against the 28 days before. Made by \`npm run seo -- report\` from \`pull-${pull.day}.json\`.`, '',
    'Each row is a lead, not a task. The seo-gum skill decides which ones have a proof path in the product.', '']
  for (const { prop, a } of analyses) {
    const h = prop.host
    out.push(`## ${prop.name} (${h.replace('https://', '')})`, '',
      `${a.totals.clicks} clicks and ${a.totals.impressions} impressions across ${a.totals.queries} queries (before: ${a.totals.clicksBefore} and ${a.totals.impressionsBefore}).`, '',
      '### Striking distance, position 8 to 20', 'A better page or a stronger internal link moves these onto page one.', '',
      table(['Query', 'Impressions', 'Clicks', 'Position', 'Page'], a.striking.map(x => [x.key, x.impressions, x.clicks, x.position, path(x.top, h)])),
      '### Seen but not clicked', 'On page one, clicked at under half the usual rate. The title and description are the fix.', '',
      table(['Query', 'Impressions', 'CTR', 'Usual', 'Position', 'Page'], a.ctrGaps.map(x => [x.key, x.impressions, pct(x.ctr), pct(x.expected), x.position, path(x.top, h)])),
      '### New queries this window', '',
      table(['Query', 'Impressions', 'Position', 'Page'], a.newQueries.map(x => [x.key, x.impressions, x.position, path(x.top, h)])),
      '### Pages rising', '',
      table(['Page', 'Impressions', 'Before', 'Clicks', 'Before'], a.rising.map(m => [path(m.key, h), m.impressions, m.impressionsBefore, m.clicks, m.clicksBefore])),
      '### Pages falling', '',
      table(['Page', 'Impressions', 'Before', 'Clicks', 'Before'], a.falling.map(m => [path(m.key, h), m.impressions, m.impressionsBefore, m.clicks, m.clicksBefore])),
      '### In the sitemap, never shown in search', 'Run `npm run seo -- inspect` to see whether Google has indexed these at all.', '',
      a.neverShown.length ? a.neverShown.map(u => `- \`${path(u, h)}\``).join('\n') + '\n' : '_Every sitemap page was shown at least once._\n')
  }
  return out.join('\n')
}

export function newestPull(dir = seoDir()) {
  const files = existsSync(dir) ? readdirSync(dir).filter(f => /^pull-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort() : []
  return files.length ? join(dir, files.at(-1)) : null
}

// ── commands ────────────────────────────────────────────────────────────────

function doctor() {
  const config = loadConfig()
  const resp = gum('searchconsole.sites.list', {})
  const entries = resp.siteEntry || findEntries(resp)
  const verified = new Set(entries.filter(e => e.permissionLevel !== 'siteUnverifiedUser').map(e => e.siteUrl))
  console.log('Properties this login can read:')
  for (const e of entries) console.log(`  ${e.siteUrl}  (${e.permissionLevel})`)
  let ok = true
  for (const prop of config.properties) {
    const has = verified.has(prop.siteUrl)
    ok &&= has
    console.log(`${has ? 'ok  ' : 'MISSING'} ${prop.name}: ${prop.siteUrl}`)
  }
  if (!ok) console.log('\nVerify the missing property in Search Console, or change siteUrl in content/seo/config.json to one listed above.')
  return ok ? 0 : 1
}

function findEntries(resp) {
  for (const v of Object.values(resp || {})) if (v && Array.isArray(v.siteEntry)) return v.siteEntry
  return []
}

export function pull() {
  const config = loadConfig()
  const day = today()
  const win = windows(day)
  const properties = {}
  for (const prop of config.properties) {
    properties[prop.name] = {
      siteUrl: prop.siteUrl,
      host: prop.host,
      current: queryRows(prop, win.current),
      previous: queryRows(prop, win.previous),
    }
    console.log(`${prop.name}: ${properties[prop.name].current.length} rows now, ${properties[prop.name].previous.length} before`)
  }
  const file = join(seoDir(), `pull-${day}.json`)
  mkdirSync(seoDir(), { recursive: true })
  writeFileSync(file, JSON.stringify({ day, windows: win, columns: ['query', 'page', 'clicks', 'impressions', 'position'], properties }) + '\n')
  console.log(`Wrote ${file}. Commit it, then npm run seo -- report.`)
  return file
}

export function report(file = newestPull()) {
  if (!file) throw new Error('No pull yet. On the Mac: npm run seo -- pull, then commit content/seo/pull-<date>.json.')
  const pullData = JSON.parse(readFileSync(file, 'utf8'))
  const config = loadConfig()
  const analyses = config.properties
    .filter(prop => pullData.properties[prop.name])
    .map(prop => {
      const d = pullData.properties[prop.name]
      return { prop, a: analyse(d.current, d.previous, sitemapUrls(prop)) }
    })
  const out = join(seoDir(), `report-${pullData.day}.md`)
  writeFileSync(out, renderReport(pullData, analyses))
  console.log(`Wrote ${out}`)
  return out
}

function inspect() {
  const config = loadConfig()
  const results = []
  for (const prop of config.properties) {
    for (const url of sitemapUrls(prop)) {
      const resp = gum('searchconsole.urlInspection.index.inspect', { body: { inspectionUrl: url, siteUrl: prop.siteUrl, languageCode: 'en-GB' } })
      const r = resp.inspectionResult || Object.values(resp).find(v => v && v.inspectionResult)?.inspectionResult || {}
      const ix = r.indexStatusResult || {}
      const canonicalOk = !ix.googleCanonical || !ix.userCanonical || normal(ix.googleCanonical) === normal(ix.userCanonical)
      results.push({ url, verdict: ix.verdict, coverage: ix.coverageState, lastCrawl: ix.lastCrawlTime, googleCanonical: ix.googleCanonical, userCanonical: ix.userCanonical, canonicalOk })
      const flag = ix.verdict === 'PASS' && canonicalOk ? 'ok  ' : 'LOOK'
      console.log(`${flag} ${url}  ${ix.coverageState || 'no result'}${canonicalOk ? '' : `  (Google chose ${ix.googleCanonical})`}`)
    }
  }
  const file = join(seoDir(), `inspect-${today()}.json`)
  writeFileSync(file, JSON.stringify(results, null, 2) + '\n')
  console.log(`Wrote ${file}`)
  return results.every(r => r.verdict === 'PASS' && r.canonicalOk) ? 0 : 1
}

function submit(flags) {
  if (!flags.includes('--allow-write')) {
    console.log('submit tells Google to recrawl each sitemap. It is a write, so it needs --allow-write.')
    return 1
  }
  for (const prop of loadConfig().properties) {
    gum('searchconsole.sitemaps.submit', { siteUrl: prop.siteUrl, feedpath: prop.sitemap }, { allowWrite: true })
    console.log(`Submitted ${prop.sitemap}`)
  }
  return 0
}

const USAGE = `npm run seo -- <command>

  doctor             gum installed, logged in, properties verified
  pull               28 days by query and page into content/seo/ (read only)
  report [file]      the newest pull as content/seo/report-<date>.md (no gum needed)
  inspect            URL Inspection on every sitemap URL (read only)
  submit --allow-write   resubmit both sitemaps

First time on the Mac: see .claude/skills/seo-gum/SKILL.md`

export function main(argv) {
  const [cmd, ...rest] = argv
  switch (cmd) {
    case 'doctor': return doctor()
    case 'pull': pull(); return 0
    case 'report': report(rest[0] || newestPull()); return 0
    case 'inspect': return inspect()
    case 'submit': return submit(rest)
    default: console.log(USAGE); return cmd ? 1 : 0
  }
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (e) {
    console.error(e.message)
    process.exitCode = 1
  }
}
