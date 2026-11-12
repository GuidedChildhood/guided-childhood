#!/usr/bin/env node
// The LinkedIn analytics register: every published post, and what it had
// earned each time somebody looked.
//
// Why this is an import and not a feed. No LinkedIn connector is available to
// a Claude session, and LinkedIn's own API for a member's post analytics is
// open to approved partners only. So nothing here claims automatic access. The
// numbers arrive one of two ways, both checked by code:
//
//   1. Justin copies his "Top performing posts" screen and pastes it, into a
//      session or into a Google Doc in the analytics inbox folder in Drive.
//      `import-paste` reads that text. It was written against a real paste of
//      16 posts on 11 November 2026.
//   2. A CSV with named columns, for anything else (`import-csv`).
//
// What the code will not do: compare posts of different ages as if they were
// the same age, rank groups with fewer than five posts in them, or say why a
// post did well. Those are the three mistakes a week of numbers invites.
//
// The permanent GDC number register is not touched from here. A post is linked
// to a register row by `registerRow`, and where the row's own status disagrees
// with the fact that the post is live, that is recorded for Justin and nothing
// is changed.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
export const REGISTER = `${ROOT}content/analytics/linkedin-post-register.json`
export const SCHEMA = 'gdc.linkedin-post-analytics/1.0'
export const CHECKPOINTS = [
  { name: '24h', from: 18, to: 36 },
  { name: '72h', from: 60, to: 96 },
  { name: '7d', from: 150, to: 192 },
]
/** Below this many posts a group is listed and never ranked. */
export const MIN_GROUP = 5
const DASH = new RegExp('[\\u2010-\\u2015\\u2212]')

const sha = (s) => createHash('sha256').update(s).digest('hex')
const num = (s) => (s == null ? null : Number(String(s).replace(/[^\d.]/g, '')))
const median = (a) => { const s = [...a].sort((x, y) => x - y); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2) }

/**
 * A LinkedIn activity id carries the moment the post was made: the first 41
 * bits are milliseconds since 1970. So the publication time is read from the
 * id and never typed in, and the "3d" label on the screen is not trusted.
 */
export function publishedAtFromId(id) {
  const ms = Number(BigInt(String(id)) >> 22n)
  if (!(ms > Date.UTC(2015, 0, 1) && ms < Date.UTC(2100, 0, 1))) return null
  return new Date(ms).toISOString()
}

export function checkpointFor(ageHours) {
  const c = CHECKPOINTS.find((x) => ageHours >= x.from && ageHours <= x.to)
  return c ? c.name : null
}

export function loadRegister(path = REGISTER) {
  if (!existsSync(path)) return { schema: SCHEMA, imports: [], posts: {} }
  return JSON.parse(readFileSync(path, 'utf8'))
}
function save(reg, path = REGISTER) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(reg, null, 2) + '\n')
}

const unlink = (l) => l.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')

/**
 * Read a pasted "Top performing posts" screen. One block per post. Anything
 * the screen does not show (clicks, saves, follower change) is stored as null
 * and named in the report as not captured, never as zero.
 */
export function parsePaste(text) {
  const blocks = String(text).split(/(?=\[[^\]\n]*posted this • )/).filter((b) => /urn:li:activity:\d+/.test(b) && /posted this • /.test(b))
  const posts = []
  for (const b of blocks) {
    const id = (b.match(/urn:li:activity:(\d+)/) || [])[1]
    const ageLabel = ((b.match(/posted this • (\w+?)\]/) || [])[1] || '').replace(/^(\w+?)\1$/, '$1')
    const lines = b.split('\n').map((l) => l.trim()).filter(Boolean)
    const linked = lines.filter((l) => /^\[.*\]\(https:\/\/www\.linkedin\.com\/feed\/update\//.test(l) && !/posted this • /.test(l)).map(unlink)
    const end = linked.findIndex((l) => /…show more|\.\.\.show more/.test(l))
    // With no "show more" the post was short enough to show whole, and the
    // attachment lines (an article's reading time, a document's page count)
    // sit in the same run of lines. Pull those out by what they say.
    const isMeta = (l) => /min read$/.test(l) || /^\d+ pages$/.test(l)
    const bodyParas = (end >= 0 ? linked.slice(0, end + 1) : linked.filter((l) => !isMeta(l))).map((l) => l.replace(/\s*(…|\.\.\.)show more\s*$/, '').trim()).filter(Boolean)
    const extras = end >= 0 ? linked.slice(end + 1) : linked.filter(isMeta)
    const body = bodyParas.join('\n\n')
    const article = extras.find((l) => /min read/.test(l))
    const pages = extras.find((l) => /^\d+ pages$/.test(l))
    const attachmentTitle = extras.find((l) => !/min read/.test(l) && !/^\d+ pages$/.test(l)) || null
    const impressions = num((b.match(/\[\s*([\d,]+)\]\(https:\/\/www\.linkedin\.com\/analytics\/post-summary\//) || [])[1])
    const bullets = lines.filter((l) => /^\*\s+\S/.test(l)).map((l) => l.replace(/^\*\s+/, ''))
    const reactions = num(bullets.find((x) => /^[\d,]+$/.test(x)) ?? null)
    const comments = num((bullets.find((x) => /comments?$/.test(x)) || '').replace(/comments?/, '') || null)
    const reposts = num((bullets.find((x) => /reposts?$/.test(x)) || '').replace(/reposts?/, '') || null)
    const hook = (body.match(/^[\s\S]*?[.?!](?=\s|$)/) || [body.slice(0, 200)])[0].replace(/\s+/g, ' ').trim()
    posts.push({
      activityId: id,
      url: `https://www.linkedin.com/feed/update/urn:li:activity:${id}`,
      ageLabel,
      format: article ? 'article share' : pages ? `document, ${pages}` : 'text or image, the screen does not say which',
      attachmentTitle,
      hook,
      words: body ? body.split(/\s+/).length : 0,
      metrics: { impressions, reactions, comments, reposts, clicks: null, saves: null, followerChange: null },
    })
  }
  return posts
}

/**
 * Take a parsed screen into the register as one snapshot per post.
 * `windowDays` is the filter on the screen. LinkedIn counts what a post earned
 * inside whole days, so a post published before the first day of the window
 * shows only part of its total. Those snapshots are kept and marked partial.
 * (Inferred from two posts whose count fell between 7 and 11 November. If a
 * post detail export ever disagrees, trust the export.)
 */
export function importPosts(posts, { capturedAt, windowDays = 7, source, sourceText = '', path = REGISTER } = {}) {
  if (!capturedAt || Number.isNaN(Date.parse(capturedAt))) throw new Error('capturedAt is needed, as an ISO time: when was the screen copied')
  const reg = loadRegister(path)
  const digest = sha(sourceText || JSON.stringify(posts)).slice(0, 16)
  if (reg.imports.some((i) => i.digest === digest)) return { added: 0, already: true, digest }
  const cap = new Date(capturedAt)
  const windowStart = windowDays ? new Date(Date.UTC(cap.getUTCFullYear(), cap.getUTCMonth(), cap.getUTCDate() - (windowDays - 1))) : null
  let added = 0
  for (const p of posts) {
    const publishedAt = publishedAtFromId(p.activityId)
    if (!publishedAt) continue
    const ageHours = Math.round((cap - new Date(publishedAt)) / 36e5)
    const partial = windowStart ? new Date(publishedAt) < windowStart : false
    const cur = reg.posts[p.activityId] || {
      activityId: p.activityId, url: p.url, publishedAt,
      registerRow: null, registerStatus: null, topic: null, openingStyle: null, lane: null, visual: null,
      snapshots: [],
    }
    cur.hook = p.hook || cur.hook; cur.words = p.words || cur.words; cur.format = p.format; cur.attachmentTitle = p.attachmentTitle ?? cur.attachmentTitle ?? null
    cur.snapshots.push({ capturedAt: cap.toISOString(), ageHours, checkpoint: partial ? null : checkpointFor(ageHours), partial, window: windowDays ? `past ${windowDays} days` : 'lifetime', ...p.metrics, importDigest: digest })
    cur.snapshots.sort((a, b) => a.capturedAt.localeCompare(b.capturedAt))
    reg.posts[p.activityId] = cur
    added++
  }
  reg.imports.push({ digest, capturedAt: cap.toISOString(), windowDays, source: source || 'pasted screen', posts: added })
  save(reg, path)
  return { added, already: false, digest }
}

/** Tags are a person's judgement (or Claude's), never guessed by this code. */
export function applyTags(tags, { path = REGISTER } = {}) {
  const reg = loadRegister(path); let n = 0
  for (const [id, t] of Object.entries(tags)) {
    if (!reg.posts[id]) continue
    for (const k of ['registerRow', 'registerStatus', 'topic', 'openingStyle', 'lane', 'visual', 'note']) if (k in t) reg.posts[id][k] = t[k]
    n++
  }
  save(reg, path); return n
}

/** Which checkpoints could be captured right now and have not been. */
export function due({ at = new Date().toISOString(), path = REGISTER } = {}) {
  const reg = loadRegister(path); const now = new Date(at); const out = []
  for (const p of Object.values(reg.posts)) {
    const age = (now - new Date(p.publishedAt)) / 36e5
    const c = checkpointFor(age)
    if (c && !p.snapshots.some((s) => s.checkpoint === c)) out.push({ activityId: p.activityId, hook: p.hook, checkpoint: c, ageHours: Math.round(age) })
  }
  return out
}

const latest = (p) => p.snapshots[p.snapshots.length - 1]
const engagement = (s) => (s.reactions || 0) + (s.comments || 0) + (s.reposts || 0)

export function report({ path = REGISTER } = {}) {
  const reg = loadRegister(path)
  const all = Object.values(reg.posts)
  const cmp = all.filter((p) => { const s = latest(p); return s && !s.partial && s.ageHours >= 24 && s.impressions != null })
    .sort((a, b) => latest(b).impressions - latest(a).impressions)
  const early = all.filter((p) => { const s = latest(p); return s && !s.partial && s.ageHours < 24 })
  const partial = all.filter((p) => latest(p)?.partial)
  const base = median(cmp.map((p) => latest(p).impressions))
  const L = []; const line = (s = '') => L.push(s)
  const lastImport = reg.imports[reg.imports.length - 1]
  line('# LinkedIn analytics report')
  line()
  line(`From \`content/analytics/linkedin-post-register.json\`: ${all.length} posts, ${reg.imports.length} ${reg.imports.length === 1 ? 'import' : 'imports'}, the last copied ${lastImport ? lastImport.capturedAt.slice(0, 16).replace('T', ' ') + ' UTC' : 'never'}.`)
  line(`Publication times are read from each post's own id. ${cmp.length} posts can be compared. ${cmp.length < 10 ? '**Under ten, so nothing below is a rule.**' : ''}`)
  line()
  line('## Posts that can be compared')
  line()
  line(`Baseline: the median of these is **${base ?? 'none'} impressions**. It is this register's own middle, not a target.`)
  line()
  line('| Impressions | x baseline | React | Comm | Reposts | Engaged per 1,000 | Age | Lead that age cannot explain | Row | Lane | Opening | Format | Hook |')
  line('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
  cmp.forEach((p, i) => {
    const s = latest(p)
    // A lead is safe from the age objection only if every post below it has
    // had at least as long to collect its numbers.
    const below = cmp.slice(i + 1)
    const safe = below.length ? (below.every((q) => latest(q).ageHours >= s.ageHours) ? 'yes, over all below' : `over ${below.filter((q) => latest(q).ageHours >= s.ageHours).length} of ${below.length} below`) : 'none below'
    line(`| ${s.impressions.toLocaleString('en-GB')} | ${base ? (s.impressions / base).toFixed(1) : ''} | ${s.reactions ?? 'not shown'} | ${s.comments ?? 'not shown'} | ${s.reposts ?? 'not shown'} | ${Math.round((engagement(s) / s.impressions) * 1000)} | ${Math.round(s.ageHours / 24 * 10) / 10}d | ${safe} | ${p.registerRow || 'none'} | ${p.lane || 'untagged'} | ${p.openingStyle || 'untagged'} | ${p.format} | ${p.hook.slice(0, 90)} |`)
  })
  line()
  if (early.length) {
    line('## Too early to read (under 24 hours)')
    line()
    for (const p of early) line(`- ${latest(p).impressions} after ${latest(p).ageHours}h: ${p.hook.slice(0, 110)}`)
    line()
  }
  line('## By group')
  line()
  line(`A group with fewer than ${MIN_GROUP} posts is listed and not ranked. A difference between groups is a difference, not a cause: the posts also differ in topic, day and age.`)
  line()
  for (const [key, label] of [['lane', 'Evidence led or product led'], ['openingStyle', 'Opening style'], ['format', 'Format'], ['visual', 'Still, motion or none'], ['topic', 'Topic']]) {
    const groups = {}
    for (const p of cmp) (groups[p[key] || 'untagged'] ||= []).push(p)
    line(`**${label}**`)
    line()
    line('| Group | Posts | Median impressions | Median comments | Can it be ranked |')
    line('|---|---|---|---|---|')
    for (const [g, ps] of Object.entries(groups).sort((a, b) => b[1].length - a[1].length)) {
      line(`| ${g} | ${ps.length} | ${median(ps.map((p) => latest(p).impressions))} | ${median(ps.map((p) => latest(p).comments || 0))} | ${ps.length >= MIN_GROUP ? 'yes' : `no, ${ps.length} is too few`} |`)
    }
    line()
  }
  line('## Checkpoints')
  line()
  const have = (c) => all.filter((p) => p.snapshots.some((s) => s.checkpoint === c)).length
  line(`Posts with a reading at 24 hours: ${have('24h')}. At 72 hours: ${have('72h')}. At 7 days: ${have('7d')}. Of ${all.length}.`)
  line('Two posts are only truly comparable at the same checkpoint. Until most posts have one, the table above is the honest best.')
  line()
  if (partial.length) {
    line('## Older posts, partial counts only')
    line()
    line('Published before the first day of the screen\'s window, so the count is what they earned inside it and not their total. Not compared.')
    line()
    for (const p of partial.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))) { const s = latest(p); line(`- ${p.publishedAt.slice(0, 10)}, ${s.impressions} in the window, ${s.reactions ?? 0} reactions and ${s.comments ?? 0} comments in total: ${p.hook.slice(0, 100)}`) }
    line()
  }
  const mismatch = all.filter((p) => p.registerRow && p.registerStatus && !/^\s*POSTED/i.test(p.registerStatus))
  if (mismatch.length) {
    line('## Live on LinkedIn, but the number register says otherwise')
    line()
    line('Nothing was changed. Each of these is Justin\'s to settle.')
    line()
    for (const p of mismatch) line(`- ${p.registerRow}, register says ${p.registerStatus}. Live since ${p.publishedAt.slice(0, 10)}: ${p.url}`)
    line()
  }
  line('## Not captured by this source')
  line()
  line('Clicks, saves, sends, follower change and who the viewers were. The Top performing posts screen does not show them. Each post\'s own analytics page does, and LinkedIn will export it as a spreadsheet.')
  const text = L.join('\n') + '\n'
  if (DASH.test(text)) throw new Error('the report contains a dash')
  return text
}

/** A CSV with a header row. Needs activityId or url, and capturedAt. */
export function parseCsv(text) {
  const rows = String(text).trim().split(/\r?\n/).map((r) => r.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((c) => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"')))
  const head = rows.shift().map((h) => h.trim())
  return rows.filter((r) => r.some(Boolean)).map((r) => {
    const o = Object.fromEntries(head.map((h, i) => [h, r[i]]))
    const id = o.activityId || (String(o.url || '').match(/activity[:-](\d+)/) || [])[1]
    return { activityId: id, url: `https://www.linkedin.com/feed/update/urn:li:activity:${id}`, hook: o.hook || '', words: num(o.words) || 0, format: o.format || 'not given', attachmentTitle: null,
      metrics: { impressions: num(o.impressions), reactions: num(o.reactions), comments: num(o.comments), reposts: num(o.reposts), clicks: num(o.clicks), saves: num(o.saves), followerChange: num(o.followerChange) } }
  })
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, ...rest] = process.argv.slice(2)
  const flag = (n, d = null) => { const i = rest.indexOf(`--${n}`); return i >= 0 ? rest[i + 1] : d }
  const file = rest.find((x, i) => !x.startsWith('--') && !(rest[i - 1] || '').startsWith('--'))
  if (cmd === 'import-paste' || cmd === 'import-csv') {
    const t = readFileSync(file, 'utf8')
    const posts = cmd === 'import-paste' ? parsePaste(t) : parseCsv(t)
    const r = importPosts(posts, { capturedAt: flag('at'), windowDays: Number(flag('window-days', cmd === 'import-paste' ? 7 : 0)), source: flag('source', file), sourceText: t })
    console.log(r.already ? `ALREADY IMPORTED ${r.digest}` : `IMPORTED ${r.added} posts, import ${r.digest}`)
  } else if (cmd === 'tag') {
    console.log(`TAGGED ${applyTags(JSON.parse(readFileSync(file, 'utf8')))} posts`)
  } else if (cmd === 'due') {
    const d = due({ at: flag('at', new Date().toISOString()) })
    console.log(d.length ? d.map((x) => `${x.checkpoint}  due now, ${x.ageHours}h old: ${x.hook.slice(0, 80)}`).join('\n') : 'No checkpoint is due right now.')
  } else if (cmd === 'report') {
    const t = report(); const out = flag('out'); if (out) writeFileSync(out, t); console.log(out ? `WROTE ${out}` : t)
  } else {
    console.log('usage: linkedin.mjs import-paste <file> --at <ISO> [--window-days 7] | import-csv <file> --at <ISO> | tag <tags.json> | due | report [--out file.md]')
  }
}
