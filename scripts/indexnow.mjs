// INDEXNOW: tell Bing (and the engines that share it, which feed ChatGPT
// search and Copilot) the moment a public page changes, instead of waiting
// for a crawl. Justin, 22 November 2026 (SEO-SETUP-GUIDE.md, idea 8).
//
// How it works. IndexNow is an open protocol: we POST a list of our own URLs
// with a key, and the engine checks the key is ours by fetching
// /<key>.txt from our site (public/<key>.txt). The key is public by design,
// it proves we own the host and nothing more, so it lives here in code.
//
// What is sent: only URLs from our own live sitemap, and by default only those
// whose lastmod falls in the last few days. The app pages are dated by when
// their facts were checked (lib/app-safety/apps.ts, checked), the guides by
// their updated date, so changing a fact and its date is what sends a page.
//
//   npm run indexnow                    URLs changed in the last 2 days
//   npm run indexnow -- --days 7        a wider window
//   npm run indexnow -- --all           every URL in the sitemap (first run)
//   npm run indexnow -- --dry-run       print what would be sent, send nothing
//
// It never fails a build: a refused or unreachable endpoint prints a warning
// and exits 0, because a missed ping only means Bing finds the page by crawl.
// The GitHub workflow .github/workflows/indexnow.yml runs it after a deploy.

export const KEY = 'bcd2eb7c424e357d36f67c77bc82401b'
export const HOST = 'www.guidedchildhood.com'
export const SITEMAP = `https://${HOST}/sitemap.xml`
export const ENDPOINT = 'https://api.indexnow.org/indexnow'

/** Every <url> in a sitemap, with its lastmod date (YYYY-MM-DD) when it has one. */
export function parseSitemap(xml) {
  const out = []
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = m[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1]
    if (!loc) continue
    const lastmod = m[1].match(/<lastmod>\s*(\d{4}-\d{2}-\d{2})/)?.[1] ?? null
    out.push({ loc: loc.replace(/&amp;/g, '&'), lastmod })
  }
  return out
}

/** The URLs to send: our own host only, all of them or those changed within `days` of today. */
export function pick(entries, { all = false, days = 2, today = new Date().toISOString().slice(0, 10) } = {}) {
  const ours = entries.filter(e => { try { return new URL(e.loc).host === HOST } catch { return false } })
  if (all) return ours.map(e => e.loc)
  const since = new Date(`${today}T00:00:00Z`).getTime() - days * 86400000
  return ours.filter(e => e.lastmod && new Date(`${e.lastmod}T00:00:00Z`).getTime() >= since).map(e => e.loc)
}

/** The body IndexNow takes. At most 10,000 URLs a request; we have a few hundred. */
export function payload(urlList) {
  return { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urlList.slice(0, 10000) }
}

function args(argv) {
  const a = { all: argv.includes('--all'), dryRun: argv.includes('--dry-run'), days: 2 }
  const i = argv.indexOf('--days')
  if (i >= 0 && Number.isFinite(Number(argv[i + 1]))) a.days = Number(argv[i + 1])
  return a
}

async function main(argv) {
  const a = args(argv)
  let xml
  try {
    const r = await fetch(SITEMAP)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    xml = await r.text()
  } catch (e) {
    console.warn(`indexnow: could not read ${SITEMAP} (${e.message}); nothing sent`)
    return
  }
  const urls = pick(parseSitemap(xml), a)
  if (!urls.length) { console.log(`indexnow: no page changed in the last ${a.days} days; nothing to send`); return }
  if (a.dryRun) { console.log(`indexnow: would send ${urls.length} URLs\n${urls.join('\n')}`); return }
  try {
    const r = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(payload(urls)) })
    // 200 and 202 both mean received. 403 means the key file is not live yet.
    if (r.status === 200 || r.status === 202) console.log(`indexnow: sent ${urls.length} URLs (${r.status})`)
    else console.warn(`indexnow: endpoint answered ${r.status}; ${urls.length} URLs not accepted`)
  } catch (e) {
    console.warn(`indexnow: could not reach ${ENDPOINT} (${e.message})`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main(process.argv.slice(2))
