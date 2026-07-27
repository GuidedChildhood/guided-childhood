// Bring every generated image into the repo, so nothing the app shows depends
// on somebody else's CDN staying up.
//
// 335 distinct images (the Planet Friends, lesson covers, moment photos,
// printable thumbnails, the shop) are hotlinked straight from the Higgsfield
// generator's CloudFront bucket. It works today. It works until it does not,
// and the failure mode is every character in the child's app turning into a
// broken box on a paying customer's screen, with nothing in our logs to say
// why. That is not an outage we could even diagnose quickly, let alone fix.
//
// This is not hypothetical. One of them, the stop and tell lesson cover, had
// already gone by the time this script was first run, and had been a broken
// tile in the live library for days with nobody any the wiser.
//
// Run this once, on a machine that can reach the CDN, and commit the result:
//
//   node scripts/vendor-art.mjs
//
// It downloads every referenced image into public/art, then rewrites each
// source file to point at /art instead of the CDN. The filenames the generator
// produces are already unique (hf_<timestamp>_<uuid>), so they are kept as is
// and no mapping table is needed.
//
// Re-runnable. Anything already downloaded is skipped, so adding a new image
// later and running it again fetches only the new one.

import { readFile, writeFile, mkdir, readdir, access } from 'node:fs/promises'
import { join, extname } from 'node:path'

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/'
// The bucket prefix every generated image sits under, needed to rebuild a full
// address from a bare filename found in a data array.
const BUCKET = 'user_3DfAawD3Umi5iqU3oLyR59j3JKD/'
const OUT = 'public/art'
const ROOTS = ['lib', 'components', 'app']
const CODE = new Set(['.ts', '.tsx', '.mjs', '.js'])

// Everything after the host, so a bucket path with a user prefix still lands
// on a flat filename. Stops at the first character that cannot be in a URL
// inside a template literal or a quoted string.
const URL_RE = /https:\/\/d8j0ntlcm91z4\.cloudfront\.net\/[^'"`\s)]+/g

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, out)
    else if (CODE.has(extname(entry.name))) out.push(full)
  }
  return out
}

const exists = async p => access(p).then(() => true, () => false)

const files = (await Promise.all(ROOTS.map(r => walk(r)))).flat()

// Pass one: collect every distinct image.
//
// Two shapes to catch, and missing either one leaves a broken picture:
//
//   1. A whole URL written out, which is most of them.
//   2. A bare generated filename sitting in a data array, joined onto the host
//      at render time. The homepage does this for its six category tiles. A
//      first version of this script only looked for whole URLs, rewrote the
//      host to /art, and would have left those six pointing at files that were
//      never downloaded.
//
// A URL containing a ${} placeholder is not a real address, it is the join
// itself. It gets rewritten like any other so the runtime concatenation still
// works, but there is nothing there to download.
const BARE_RE = /['"`](hf_[0-9]{8}_[0-9]{6}_[0-9a-f-]{36}\.(?:png|jpg|jpeg|webp))['"`]/g

const urls = new Map() // download url -> filename on disk
// Where each image is referenced, so a failure names a line of code rather
// than a hash. "hf_20260720_103442_dff20e6b.png (HTTP 403)" tells you nothing
// you can act on; "lib/content/lesson-covers.ts:13" tells you everything.
const seenAt = new Map() // filename -> "file:line"

function note(name, file, text, needle) {
  if (seenAt.has(name)) return
  const upTo = text.indexOf(needle)
  const line = upTo < 0 ? 1 : text.slice(0, upTo).split('\n').length
  seenAt.set(name, `${file}:${line}`)
}

for (const file of files) {
  const text = await readFile(file, 'utf8')
  for (const url of text.match(URL_RE) ?? []) {
    if (url.includes('${')) continue
    const name = url.split('/').pop()
    urls.set(url, name)
    note(name, file, text, name)
  }
  for (const m of text.matchAll(BARE_RE)) {
    urls.set(CDN + BUCKET + m[1], m[1])
    note(m[1], file, text, m[1])
  }
}

// What is actually left to do, as opposed to what is merely referenced.
//
// A bare filename in a data array stays a bare filename after vendoring: it is
// the base constant beside it that changes to /art/, so the join still lands
// right. Which means this list keeps its full length forever, and a finished
// repo was being greeted with "227 images to bring in", reading like work
// outstanding when there was none left.
//
// So the count that gets announced is the count of files not already on disk,
// and a run with nothing to fetch and nothing to rewrite says so.
const missing = []
for (const [url, name] of urls) {
  if (!(await exists(join(OUT, name)))) missing.push([url, name])
}

// A plain substring, deliberately not URL_RE. A global regex keeps its
// lastIndex between calls, so .test() across a list of files answers about
// where the previous file left off rather than about this one.
const stillRemote = (await Promise.all(
  files.map(async f => (await readFile(f, 'utf8')).includes(CDN))
)).some(Boolean)

if (missing.length === 0 && !stillRemote) {
  console.log(`Already vendored. ${urls.size} images in ${OUT}, nothing pointing at the CDN.`)
  process.exit(0)
}

console.log(missing.length > 0
  ? `${missing.length} images to bring in (${urls.size - missing.length} already here).`
  : `Everything is downloaded. Rewriting the source now.`)
await mkdir(OUT, { recursive: true })

// Pass two: download, skipping anything already here.
let fetched = 0
let skipped = 0
const failed = []

for (const [url, name] of urls) {
  const dest = join(OUT, name)
  if (await exists(dest)) { skipped++; continue }
  try {
    const res = await fetch(url)
    if (!res.ok) { failed.push(`${seenAt.get(name) ?? '?'}  ${name}  (HTTP ${res.status})`); continue }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
    fetched++
    process.stdout.write('.')
  } catch (err) {
    failed.push(`${seenAt.get(name) ?? '?'}  ${name}  (${err.message})`)
  }
}
process.stdout.write('\n')

// A partial vendor is worse than none: half the app on local files and half
// still on the CDN is a state nobody can reason about later. So the rewrite
// only happens if every single image came down.
if (failed.length > 0) {
  console.error(`\n${failed.length} failed, so no source files were changed:`)
  for (const f of failed) console.error('  ' + f)
  console.error('')
  console.error('A 403 on a real filename means that image is GONE from the CDN,')
  console.error('which is the whole reason for doing this. It is already broken in')
  console.error('the live app. Replace it at the line above, then run again.')
  console.error('Nothing has been half done.')
  process.exit(1)
}

console.log(`Downloaded ${fetched}, already had ${skipped}.`)

// Pass three: point the source at /art. The base constants are rewritten
// rather than each URL, since every file builds its URLs by concatenating a
// filename onto a base, and the filenames are already unique.
let changed = 0
for (const file of files) {
  const before = await readFile(file, 'utf8')
  const after = before.replace(URL_RE, m => `/art/${m.split('/').pop()}`)
    // The base constants end in a slash and now resolve to bare "/art/", which
    // is exactly right, but leaves a doubled slash where a filename follows.
    .replaceAll('/art//', '/art/')
    // A bare filename in a data array is left exactly as it is: the host it
    // gets joined onto has just become /art/, so the join still lands right.

  if (after !== before) { await writeFile(file, after); changed++ }
}

console.log(`Rewrote ${changed} source files.`)
console.log(`\nNow: check the app still renders, then commit public/art and the rewrites.`)
console.log(`The remotePatterns entry in next.config can go once nothing points at the CDN.`)
