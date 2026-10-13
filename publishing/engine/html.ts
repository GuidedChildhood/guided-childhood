// The smallest possible HTML toolkit for the templates: escape what came from
// the issue file, mark citations, and nothing else. No framework, because the
// templates run in plain Node with type stripping (no TSX), in the renderer, in
// the tests and in the dashboard alike.

import type { Block, Source } from './schema'

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
export const esc = (s: string) => s.replace(/[&<>"']/g, c => ESC[c])

const CITE = /\[\[(s\d+)\]\]/g

// The citation ids a string carries, in order.
export const citesIn = (s: string): string[] => [...s.matchAll(CITE)].map(m => m[1])

// A page numbers its own sources 1, 2, 3 in the order its box lists them, so
// the marker in the text and the line in the box always agree.
export type CiteMap = Map<string, number>
export const citeMap = (refs: string[]): CiteMap => new Map(refs.map((id, i) => [id, i + 1]))

// Escape, then turn [[s3]] into the numbered marker. A citation not listed in
// the page's refs throws, because a marker with no line in the box is a claim
// with no visible source.
export function rich(s: string, cites?: CiteMap): string {
  return esc(s).replace(CITE, (_m, id: string) => {
    const n = cites?.get(id)
    if (n === undefined) throw new Error(`cites ${id} but the page's refs do not list it`)
    return `<span class="cite" aria-label="source ${n}">${n}</span>`
  })
}

// The same text with the markers removed, for alt text, captions and the
// plain text email, where a ringed number means nothing.
export const plain = (s: string) => s.replace(CITE, '').replace(/\s+([.,;:!?])/g, '$1').replace(/\s{2,}/g, ' ').trim()

export function blocks(list: Block[], cites?: CiteMap, opts: { lead?: boolean } = {}): string {
  let first = true
  return list.map(b => {
    if (b.type === 'subhead') return `<h3 class="sub">${rich(b.text, cites)}</h3>`
    if (b.type === 'list') return `<ul>${b.items.map(i => `<li>${rich(i, cites)}</li>`).join('')}</ul>`
    const cls = opts.lead && first ? ' class="lead"' : ''
    first = false
    return `<p${cls}>${rich(b.text, cites)}</p>`
  }).join('\n')
}

export function refsBox(refs: string[], sources: Source[], label = 'Where this came from'): string {
  if (!refs.length) return ''
  const byId = new Map(sources.map(s => [s.id, s]))
  const items = refs.map((id, i) => {
    const s = byId.get(id)
    if (!s) throw new Error(`refs lists ${id}, which is not in the issue's sources`)
    // Print shows the site, not the whole address: the title, the publisher and
    // the date find the page, and every full link is one scan away on page 12.
    const host = s.url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')
    return `<li><span class="n">${i + 1}</span><span><b>${esc(s.org)}</b>, ${esc(s.title)}${s.published ? `, ${esc(s.published)}` : ''}. <span class="url">${esc(host)}</span></span></li>`
  }).join('')
  return `<div class="refs"><p class="eyebrow">${esc(label)}</p><ol>${items}</ol></div>`
}

export const pad3 = (n: number) => String(n).padStart(3, '0')
