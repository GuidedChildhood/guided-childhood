#!/usr/bin/env node
// MIRROR THE FRENCH MEDIA INTO OUR OWN STORAGE (10 November 2026).
//
// Justin, 9 November 2026: the French slides, songs and sheets move to our
// storage now, rather than loading from the author's site for ever. This
// copies every file the scheme names into the Supabase storage bucket
// `languages`, under fr/<unit folder>/<path>, the same layout her site uses,
// so the route that serves them (schools/app/languages/fr/media) needs no map.
//
//   node scripts/languages/mirror-french-media.mjs --dry-run   list, no upload
//   node scripts/languages/mirror-french-media.mjs             upload what changed
//
// WHERE IT RUNS. In GitHub Actions (.github/workflows/languages-media.yml),
// which already holds SUPABASE_SERVICE_ROLE_KEY. The key is never needed on a
// laptop or in a chat, and this script never prints it.
//
// WHAT IT COPIES. Everything schools/lib/languages/fr.json names (decks,
// phonics decks, songs, posters, sheets), plus anything a deck itself points
// at by a relative path, found by reading each deck once. Nothing else: no
// crawl of her site, no file she has not linked.
//
// SAFE TO RUN TWICE. A file whose size already matches is skipped, and every
// upload is an upsert. Nothing is ever deleted from the bucket.

import { readFileSync } from 'node:fs'

const DRY = process.argv.includes('--dry-run')
const BUCKET = 'languages'
const data = JSON.parse(readFileSync('schools/lib/languages/fr.json', 'utf8'))
const ORIGIN = data.origin

const SAFE = /^[A-Za-z0-9_-]+(\/[A-Za-z0-9_-]+)*\.(html|pdf|mp4|mp3|jpg|jpeg|png|webp|svg)$/
const TYPES = {
  html: 'text/html; charset=utf-8', pdf: 'application/pdf', mp4: 'video/mp4', mp3: 'audio/mpeg',
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', svg: 'image/svg+xml',
}
const ext = p => p.split('.').pop().toLowerCase()

/** Her data holds a file list as an array, or as one object when there is only one. */
const list = v => (Array.isArray(v) ? v : v ? [v] : [])

/** Every file fr.json names for one unit, as paths inside the unit folder. */
function namedFiles(u) {
  const out = new Set()
  const sheet = f => f?.f && out.add(`print/${f.f}`)
  for (const l of list(u.lessons)) {
    if (l.slides) out.add(l.slides)
    for (const f of list(l.files)) sheet(f)
  }
  if (u.phonics) out.add(u.phonics)
  for (const s of list(u.songs)) { out.add(s.f); if (s.poster) out.add(s.poster) }
  for (const k of ['whatICanDo', 'wordMats', 'activities', 'assessment', 'teacher']) for (const f of list(u[k])) sheet(f)
  for (const a of list(u.assessPlan)) for (const f of list(a.files)) out.add(`print/${f}`)
  return out
}

/** Relative files a deck points at (src, href, poster), resolved inside the unit folder. */
function linkedFrom(html, deckPath) {
  const dir = deckPath.includes('/') ? deckPath.slice(0, deckPath.lastIndexOf('/') + 1) : ''
  const out = new Set()
  for (const m of html.matchAll(/(?:src|href|poster)\s*=\s*["']([^"'#?]+)(?:[#?][^"']*)?["']/g)) {
    const ref = m[1]
    if (/^([a-z]+:|\/\/|\/|data:)/i.test(ref)) continue
    const path = (dir + ref).replace(/^\.\//, '')
    if (!path.includes('..') && SAFE.test(path)) out.add(path)
  }
  return out
}

const sourceUrl = (slug, path) => `${ORIGIN}/units/${slug}/${path}`

async function fetchSource(slug, path) {
  const res = await fetch(sourceUrl(slug, path))
  const type = res.headers.get('content-type') || ''
  const buf = Buffer.from(await res.arrayBuffer())
  // Her host answers a missing file with the site's own front page, so a
  // non HTML file that arrives as HTML, or a deck that is the front page, is missing.
  const shell = type.includes('text/html') && buf.subarray(0, 4096).toString('utf8').includes('data-page="home"')
  if (!res.ok || (ext(path) !== 'html' && type.includes('text/html')) || shell) return null
  return buf
}

// 1. The list.
const files = []
const missing = []
for (const [slug, unit] of Object.entries(data.units)) {
  const paths = namedFiles(unit)
  for (const p of [...paths]) {
    if (ext(p) !== 'html') continue
    const buf = await fetchSource(slug, p)
    if (buf) for (const linked of linkedFrom(buf.toString('utf8'), p)) paths.add(linked)
  }
  for (const p of paths) {
    if (!SAFE.test(p)) { missing.push(`${slug}/${p} (unsafe path, skipped)`); continue }
    files.push({ slug, path: p })
  }
}
console.log(`${files.length} files named across ${Object.keys(data.units).length} units`)

if (DRY) {
  for (const f of files) console.log(`  ${f.slug}/${f.path}`)
  for (const m of missing) console.log(`  SKIP ${m}`)
  process.exit(0)
}

// 2. The bucket.
const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
if (!base || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both needed. Set them as repository secrets.')
  process.exit(1)
}
const auth = { Authorization: `Bearer ${key}`, apikey: key }
{
  const res = await fetch(`${base}/storage/v1/bucket`, {
    method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  })
  const text = await res.text()
  if (!res.ok && !/already exists|Duplicate/i.test(text)) {
    console.error(`could not create the ${BUCKET} bucket: HTTP ${res.status} ${text.slice(0, 200)}`)
    process.exit(1)
  }
}

// 3. The copy.
let uploaded = 0, skipped = 0, bytes = 0
const failed = []
for (const f of files) {
  const objectPath = `fr/${f.slug}/${f.path}`
  const buf = await fetchSource(f.slug, f.path)
  if (!buf) { missing.push(`${f.slug}/${f.path} (not on the author's site)`); continue }
  const head = await fetch(`${base}/storage/v1/object/public/${BUCKET}/${objectPath}`, { method: 'HEAD' })
  if (head.ok && Number(head.headers.get('content-length')) === buf.length) { skipped++; continue }
  const res = await fetch(`${base}/storage/v1/object/${BUCKET}/${objectPath}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': TYPES[ext(f.path)], 'x-upsert': 'true', 'cache-control': 'max-age=86400' },
    body: buf,
  })
  if (res.ok) { uploaded++; bytes += buf.length } else failed.push(`${objectPath}: HTTP ${res.status} ${(await res.text()).slice(0, 120)}`)
}

console.log(`uploaded ${uploaded} (${(bytes / 1048576).toFixed(1)} MB), already there ${skipped}, missing ${missing.length}, failed ${failed.length}`)
for (const m of missing) console.log(`  MISSING ${m}`)
for (const m of failed) console.error(`  FAILED ${m}`)
process.exit(failed.length ? 1 : 0)
