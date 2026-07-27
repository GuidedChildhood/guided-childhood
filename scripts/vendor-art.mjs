// Bring every generated image into the repo, so nothing the app shows depends
// on somebody else's CDN staying up.
//
// Right now 109 distinct images (the Planet Friends, lesson covers, moment
// photos, printable thumbnails, the shop) are hotlinked straight from the
// Higgsfield generator's CloudFront bucket. It works today. It works until it
// does not, and the failure mode is every character in the child's app turning
// into a broken box on a paying customer's screen, with nothing in our logs to
// say why. That is not an outage we could even diagnose quickly, let alone fix.
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

import { readFile, writeFile, mkdir, readdir, stat, access } from 'node:fs/promises'
import { join, extname } from 'node:path'

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/'
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

// Pass one: collect every distinct URL and the file it appears in.
const urls = new Map() // url -> filename on disk
for (const file of files) {
  const text = await readFile(file, 'utf8')
  for (const url of text.match(URL_RE) ?? []) {
    urls.set(url, url.split('/').pop())
  }
}

if (urls.size === 0) {
  console.log('Nothing left on the CDN. Already vendored.')
  process.exit(0)
}

console.log(`${urls.size} images to bring in.`)
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
    if (!res.ok) { failed.push(`${name} (HTTP ${res.status})`); continue }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()))
    fetched++
    process.stdout.write('.')
  } catch (err) {
    failed.push(`${name} (${err.message})`)
  }
}
process.stdout.write('\n')

// A partial vendor is worse than none: half the app on local files and half
// still on the CDN is a state nobody can reason about later. So the rewrite
// only happens if every single image came down.
if (failed.length > 0) {
  console.error(`\n${failed.length} failed, so no source files were changed:`)
  for (const f of failed) console.error('  ' + f)
  console.error('\nFix the failures and run again. Nothing has been half done.')
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
  if (after !== before) { await writeFile(file, after); changed++ }
}

console.log(`Rewrote ${changed} source files.`)
console.log(`\nNow: check the app still renders, then commit public/art and the rewrites.`)
console.log(`The remotePatterns entry in next.config can go once nothing points at the CDN.`)
