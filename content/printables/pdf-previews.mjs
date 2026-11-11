// Page previews straight from a product PDF, for packs whose PDFs are the
// source of truth for the listing photos: the older packs built by their own
// scripts, and the single sheet spin offs cut from a bigger pack's PDFs.
//
//   node content/printables/pdf-previews.mjs <pack> <pdf in product/>
//
// Writes images/preview/page-NN.png at 1588 wide, the size build-pack.mjs
// makes, so listing-images.js and scene-composite.mjs read them the same way.
// Needs pdftoppm (poppler).
import { execFileSync } from 'node:child_process'
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const ROOT = dirname(fileURLToPath(import.meta.url))
const [pack, pdf] = process.argv.slice(2)
if (!pack || !pdf) { console.error('Usage: node pdf-previews.mjs <pack> <pdf in product/>'); process.exit(1) }
const out = join(ROOT, pack, 'images/preview')
mkdirSync(out, { recursive: true })
for (const f of readdirSync(out)) if (/^page-\d+\.png$/.test(f) || /^tmp-/.test(f)) rmSync(join(out, f))
execFileSync('pdftoppm', ['-png', '-scale-to-x', '1588', '-scale-to-y', '-1', join(ROOT, pack, 'product', pdf), join(out, 'tmp')])
let n = 0
for (const f of readdirSync(out).filter(f => /^tmp-\d+\.png$/.test(f)).sort((a, b) => parseInt(a.slice(4)) - parseInt(b.slice(4)))) {
  renameSync(join(out, f), join(out, `page-${String(++n).padStart(2, '0')}.png`))
}
console.log(pack, 'previews', n)
