// EVERY LINK IN THE ISSUE, FETCHED.
//
// A source that 404s is an error: the fact it backs has lost its proof. A site
// that refuses automated readers (Ofcom, Scratch and the BBC all do) is a
// warning, not a pass: it needs a person with a browser before print. The
// paper's own pages on guidedchildhood.com do not exist until the website step
// of publication, so before then they are reported as planned, and after it
// they must answer.

import type { Issue } from '../engine/schema'

export type LinkResult = { url: string; ok: boolean; level: 'ok' | 'warn' | 'error'; status?: number; note?: string }

export function issueLinks(issue: Issue): { url: string; why: string }[] {
  const out = new Map<string, string>()
  for (const s of issue.sources) out.set(s.url, `source ${s.id}`)
  for (const p of issue.pages) {
    if (p.template === 'list') for (const it of p.items) out.set(it.url, `page ${p.n} item`)
    if (p.template === 'passport') { out.set(p.sourcesUrl, `page ${p.n} QR`); out.set(p.grownUps.url, `page ${p.n} QR`) }
  }
  out.set(issue.onlineUrl, 'online edition')
  return [...out].map(([url, why]) => ({ url, why }))
}

export async function checkLinks(issue: Issue, f: typeof fetch = fetch): Promise<LinkResult[]> {
  const res: LinkResult[] = []
  for (const { url, why } of issueLinks(issue)) {
    const own = url.includes(`/guided-planet/${issue.slug}`)
    try {
      const r = await f(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (The Guided Planet link check)' }, signal: AbortSignal.timeout(20000) })
      if (r.ok) res.push({ url, ok: true, level: 'ok', status: r.status, note: why })
      else if (own && r.status === 404) res.push({ url, ok: false, level: 'warn', status: r.status, note: `${why}: planned, goes live with the website step` })
      else if ([401, 403, 405, 429, 999].includes(r.status)) res.push({ url, ok: false, level: 'warn', status: r.status, note: `${why}: the site refuses automated checks, open it in a browser` })
      else res.push({ url, ok: false, level: 'error', status: r.status, note: why })
    } catch (e) {
      res.push({ url, ok: false, level: own ? 'warn' : 'error', note: `${why}: ${(e as Error).message}` })
    }
  }
  return res
}
