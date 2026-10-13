// THE EDITORIAL GATE, before anything is drawn.
//
// These checks read the issue file and need no browser. They are the rules
// that make an edition safe to print, so a failure here stops the render:
//
//   1. Exactly twelve pages, numbered 1 to 12, page 1 the cover.
//   2. Every [[sN]] citation names a source the page lists in its refs, and
//      every listed source exists in the issue.
//   3. Every source that is cited is 'verified'. A 'flagged' or 'unverified'
//      source may sit in the research record, never on a printed page.
//   4. Every factual page cites something. A page is factual when it states a
//      number (the digit test below) or it is a news, showcase, research or
//      investigation page.
//   5. Every art slot has alt text, and every friend is in the approved library.
//   6. The copy carries no dash and no stock phrase. The rule lives once, in
//      scripts/check-ai-tells.mjs; this runs it over the issue's copy so there
//      are never two lists of banned words to drift apart.
//   7. Nothing in the copy asks a child for a surname, an address or a photo
//      of themselves to be sent to us. We collect nothing from a child.

import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { citesIn } from './html'
import { assetIdFor, manifest, PUB, ROOT } from './library'
import { PAGE_COUNT, type Issue, type Page } from './schema'

export type Finding = { level: 'error' | 'warn'; page?: number; rule: string; detail: string }

// Every human readable string in a page, wherever it sits in the structure.
// Keys that hold identifiers or URLs are skipped, so a slug is not "copy".
const NOT_COPY = new Set(['template', 'slot', 'vector', 'recipe', 'url', 'id', 'pose', 'source', 'icon', 'hex', 'kind', 'destination', 'sourcesUrl', 'type'])
export function copyStrings(node: unknown, key = ''): string[] {
  if (typeof node === 'string') return NOT_COPY.has(key) ? [] : [node]
  if (Array.isArray(node)) return node.flatMap(n => copyStrings(n, key))
  if (node && typeof node === 'object') return Object.entries(node).flatMap(([k, v]) => copyStrings(v, k))
  return []
}

const FACTUAL_TEMPLATES = new Set(['showcase', 'research', 'investigation'])

export function validateIssue(issue: Issue, opts: { aiTells?: boolean } = {}): Finding[] {
  const f: Finding[] = []
  const err = (rule: string, detail: string, page?: number) => f.push({ level: 'error', rule, detail, page })
  const warn = (rule: string, detail: string, page?: number) => f.push({ level: 'warn', rule, detail, page })

  if (issue.pages.length !== PAGE_COUNT) err('page-count', `has ${issue.pages.length} pages, needs ${PAGE_COUNT}`)
  issue.pages.forEach((p, i) => { if (p.n !== i + 1) err('page-order', `page at position ${i + 1} is numbered ${p.n}`, p.n) })
  if (issue.pages[0]?.template !== 'cover') err('cover', 'page 1 must be the cover')

  const sources = new Map(issue.sources.map(s => [s.id, s]))
  const ids = issue.sources.map(s => s.id)
  if (new Set(ids).size !== ids.length) err('sources', 'two sources share an id')
  const library = new Set(manifest().map(a => a.id))

  for (const p of issue.pages) {
    const refs: string[] = 'refs' in p ? p.refs : []
    const strings = copyStrings(p)
    const cited = strings.flatMap(citesIn)
    for (const id of cited) {
      if (!refs.includes(id)) err('cite-not-in-refs', `cites ${id} but its refs list does not`, p.n)
      const s = sources.get(id)
      if (!s) err('cite-unknown', `cites ${id}, which is not in sources`, p.n)
      else if (s.verification !== 'verified') err('cite-unverified', `cites ${id} (${s.org}), which is ${s.verification}. Only verified sources print.`, p.n)
    }
    for (const id of refs) {
      if (!sources.has(id)) err('ref-unknown', `refs lists ${id}, which is not in sources`, p.n)
      if (!cited.includes(id)) warn('ref-uncited', `refs lists ${id} but no sentence on the page cites it`, p.n)
    }
    const statesNumber = strings.some(s => /\b\d[\d,]*(\.\d+)?\s*(%|\b(percent|per cent|young people|children|countries|studies|reviews|creations)\b)/i.test(s))
    // A sample issue (a structure test, watermarked, never published) may
    // hold placeholder story pages; it still may not cite anything unverified.
    if ((FACTUAL_TEMPLATES.has(p.template) || statesNumber) && cited.length === 0) (issue.sample ? warn : err)('factual-uncited', 'a factual page with no citation', p.n)

    for (const a of artSlots(p)) if (!a.alt || a.alt.length < 20) err('alt-text', `art slot ${a.slot} needs real alt text`, p.n)
    for (const fr of friends(p)) if (!library.has(assetIdFor(fr))) err('friend-unapproved', `${assetIdFor(fr)} is not approved art`, p.n)

    for (const s of strings) {
      if (/\b(surname|home address|send us a (photo|picture)|upload a photo of yourself)\b/i.test(s) && !/not (to )?include|first names only|do not include/i.test(s))
        err('child-data', `asks a child for personal data: "${s.slice(0, 60)}"`, p.n)
    }
  }

  for (const s of issue.sources) {
    if (!/^https:\/\//.test(s.url)) err('source-url', `${s.id} url must be https`)
    if (!s.supports) err('source-supports', `${s.id} must say what claim it supports`)
    if (s.verification === 'verified' && !s.quote) warn('source-quote', `${s.id} is verified but carries no quote from the source`)
  }

  if (opts.aiTells !== false) f.push(...aiTells(issue))
  return f
}

export function artSlots(p: Page) {
  const out: { slot: string; alt: string; vector?: string; recipe?: string; paint?: string }[] = []
  if ('art' in p && p.art) out.push(p.art)
  if (p.template === 'welcome') out.push(p.map)
  return out
}

export function friends(p: Page) {
  const out = []
  if ('friend' in p && p.friend) out.push(p.friend)
  return out
}

// Run the repo's own dash and stock phrase guard over the issue's copy.
function aiTells(issue: Issue): Finding[] {
  const dir = join(PUB, '.cache', 'copy')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, `${issue.slug}.md`)
  const lines = issue.pages.flatMap(p => copyStrings(p).map(s => `p${p.n}: ${s.replace(/\[\[s\d+\]\]/g, '')}`))
  writeFileSync(file, lines.join('\n\n') + '\n')
  try {
    execFileSync('node', [join(ROOT, 'scripts/check-ai-tells.mjs'), file], { encoding: 'utf8' })
    return []
  } catch (e) {
    const out = String((e as { stdout?: string }).stdout ?? e)
    return out.split('\n').filter(l => l.startsWith('FAIL')).map(l => {
      const m = l.match(/:(\d+)\s+(.*)$/)
      const lineNo = m ? Number(m[1]) : 0
      const text = lines[Math.floor((lineNo - 1) / 2)] ?? ''
      const page = Number((text.match(/^p(\d+):/) ?? [])[1]) || undefined
      return { level: 'error' as const, page, rule: 'ai-tells', detail: `${m?.[2] ?? l}  in: ${text.slice(0, 80)}` }
    })
  }
}
