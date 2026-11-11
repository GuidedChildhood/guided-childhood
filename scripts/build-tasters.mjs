#!/usr/bin/env node
// The free tasters, built from the paid packs (11 November 2026).
//
// Justin, 9 November: "Tasters free, full on Etsy." A follower gets two or
// three pages of a pack for their email; the full pack stays paid on Etsy and
// free inside the app. This script is what makes that true on paper. For every
// row in content/printables/free-tasters.json it:
//
//   1. copies only the listed pages out of the A4 product PDF (never more than
//      three, and always fewer than half the pack, checked below, so a
//      taster can never quietly become the whole thing);
//   2. stamps a band along the foot of every page: "Free taster · the full
//      pack is on Etsy" with the listing link, or the /free link while a pack
//      has no listing yet, so a page that travels on its own still says what
//      it is and where the rest lives;
//   3. renders a preview PNG of each taster page with pdftoppm, for the
//      /free/<slug> page and the index.
//
// Out: public/printables/free/tasters/<slug>-taster-a4.pdf and
// <slug>-taster-p1.png to p3. Run it after changing pages or a listing:
//
//   node scripts/build-tasters.mjs            every taster
//   node scripts/build-tasters.mjs say-this   one taster
//
// pdftoppm (poppler) makes the previews. It is a local build tool only: the
// outputs are committed, so Vercel never runs this.
//
// The band uses Helvetica, a standard PDF font, because pdf-lib needs fontkit
// to embed Nunito and the repo does not carry it. A one line stamp in the
// house butter and ink reads fine in Helvetica; the pages themselves keep the
// fonts they were printed with.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { PDFDocument, StandardFonts, rgb, PDFName, PDFString } from 'pdf-lib'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const DATA = path.join(ROOT, 'content/printables/free-tasters.json')
const OUT = path.join(ROOT, 'public/printables/free/tasters')
const SITE = 'https://www.guidedchildhood.com'

// The house colours, from shared/tokens.css.
const BUTTER = rgb(0xED / 255, 0xC3 / 255, 0x5F / 255)
const BUTTER_LT = rgb(0xFE / 255, 0xF7 / 255, 0xE0 / 255)
const INK = rgb(0x1A / 255, 0x1A / 255, 0x2E / 255)

export function etsyUrl(listing) {
  return listing ? `https://www.etsy.com/uk/listing/${listing}` : null
}

// The guard on the ruling. Exported so the test can hold every row to it.
export function tasterPagesAreFair(t) {
  if (!Array.isArray(t.pages) || t.pages.length < 2 || t.pages.length > 3) return false
  if (new Set(t.pages).size !== t.pages.length) return false
  if (!t.pages.every(n => Number.isInteger(n) && n >= 1 && n <= t.pageCount)) return false
  return t.pages.length * 2 < t.pageCount
}

function addLink(pdf, page, x, y, w, h, url) {
  const annot = pdf.context.obj({
    Type: 'Annot', Subtype: 'Link', Rect: [x, y, x + w, y + h], Border: [0, 0, 0],
    A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
  })
  const ref = pdf.context.register(annot)
  const existing = page.node.lookup(PDFName.of('Annots'))
  if (existing) existing.push(ref)
  else page.node.set(PDFName.of('Annots'), pdf.context.obj([ref]))
}

async function buildOne(t) {
  if (!tasterPagesAreFair(t)) throw new Error(`${t.slug}: pages ${JSON.stringify(t.pages)} are not a fair taster of ${t.pageCount}`)
  const src = await PDFDocument.load(fs.readFileSync(path.join(ROOT, t.source)))
  if (src.getPageCount() !== t.pageCount) throw new Error(`${t.slug}: source has ${src.getPageCount()} pages, the data says ${t.pageCount}`)

  const out = await PDFDocument.create()
  out.setTitle(`${t.title}: the free taster`)
  out.setAuthor('Guided Childhood')
  out.setSubject('A free taster. The full pack is on Etsy and in the Guided Childhood app.')
  out.setCreator('scripts/build-tasters.mjs')
  const bold = await out.embedFont(StandardFonts.HelveticaBold)
  const regular = await out.embedFont(StandardFonts.Helvetica)

  const link = etsyUrl(t.etsyListing) ?? `${SITE}/free/${t.slug}`
  const left = 'FREE TASTER'
  const count = `${t.pages.length} of ${t.pageCount} pages`
  const middle = t.etsyListing
    ? `${count} · the full pack is on Etsy`
    : t.inApp
      ? `${count} · the full pack is in the Guided Childhood app`
      : `${count} · more free printables at guidedchildhood.com/free`
  const right = link.replace(/^https:\/\/(www\.)?/, '')

  const copied = await out.copyPages(src, t.pages.map(n => n - 1))
  for (const page of copied) {
    out.addPage(page)
    const { width } = page.getSize()
    const h = 22, y = 0
    page.drawRectangle({ x: 0, y, width, height: h, color: BUTTER })
    page.drawRectangle({ x: 0, y: h, width, height: 1.2, color: INK })
    const size = 7.6
    page.drawText(left, { x: 14, y: y + 7.6, size, font: bold, color: INK })
    const lw = bold.widthOfTextAtSize(left, size)
    page.drawText(middle, { x: 14 + lw + 10, y: y + 7.6, size, font: regular, color: INK })
    const rw = bold.widthOfTextAtSize(right, size)
    // A cream pill behind the link, so it reads as the thing to tap.
    page.drawRectangle({ x: width - rw - 22, y: y + 4, width: rw + 12, height: 14, color: BUTTER_LT, borderColor: INK, borderWidth: 0.6 })
    page.drawText(right, { x: width - rw - 16, y: y + 7.6, size, font: bold, color: INK })
    addLink(out, page, 0, y, width, h, link)
  }

  fs.mkdirSync(OUT, { recursive: true })
  const pdfPath = path.join(OUT, `${t.slug}-taster-a4.pdf`)
  fs.writeFileSync(pdfPath, await out.save())

  // Previews at 740 pixels wide, the size the free pages already use.
  for (let i = 1; i <= t.pages.length; i++) {
    const base = path.join(OUT, `${t.slug}-taster-p${i}`)
    execFileSync('pdftoppm', ['-png', '-singlefile', '-scale-to-x', '740', '-scale-to-y', '-1', '-f', String(i), '-l', String(i), pdfPath, base])
  }
  return { slug: t.slug, pages: t.pages.length, link }
}

async function main() {
  const { tasters } = JSON.parse(fs.readFileSync(DATA, 'utf8'))
  const only = process.argv[2]
  const rows = only ? tasters.filter(t => t.slug === only) : tasters
  if (only && rows.length === 0) throw new Error(`no taster called ${only}`)
  for (const t of rows) {
    const r = await buildOne(t)
    console.log(`${r.slug}: ${r.pages} pages, band links to ${r.link}`)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(err => { console.error(err.message); process.exit(1) })
}
