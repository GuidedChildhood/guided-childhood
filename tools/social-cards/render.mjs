#!/usr/bin/env node
/**
 * Renders a deck of social cards to real PNGs, at the exact pixel sizes
 * Instagram and Facebook want.
 *
 *   node tools/social-cards/render.mjs decks/handover-02.json
 *   node tools/social-cards/render.mjs decks/*.json
 *
 * Output lands in tools/social-cards/out/<deck name>/01-<card name>.png
 *
 * Uses the same self hosted Nunito and IBM Plex Mono the app and the Etsy
 * branding use, so a card, a printable and the app all match exactly.
 */
import { chromium } from 'playwright'
import { readFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const TEMPLATE = pathToFileURL(join(HERE, 'template.html')).href

const args = process.argv.slice(2)
const deckPaths = args.length
  ? args.map((a) => resolve(a))
  : readdirSync(join(HERE, 'decks'))
      .filter((f) => f.endsWith('.json'))
      .map((f) => join(HERE, 'decks', f))

if (!deckPaths.length) {
  console.error('No decks found. Put a .json deck in tools/social-cards/decks/')
  process.exit(1)
}

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

for (const deckPath of deckPaths) {
  const deck = JSON.parse(readFileSync(deckPath, 'utf8'))
  const name = deck.name || basename(deckPath, '.json')
  const outDir = join(HERE, 'out', name)
  mkdirSync(outDir, { recursive: true })

  await page.goto(TEMPLATE)
  await page.evaluate((d) => window.renderDeck(d), deck)
  // Fonts must be ready or the first card renders in a fallback face.
  await page.evaluate(() => document.fonts.ready)

  const cards = await page.locator('.card').all()
  for (let i = 0; i < cards.length; i++) {
    const cardName = await cards[i].getAttribute('data-name')
    const file = join(outDir, `${String(i + 1).padStart(2, '0')}-${cardName}.png`)
    await cards[i].screenshot({ path: file })
    console.log(`  ${file.replace(HERE + '/', '')}`)
  }
  console.log(`${name}: ${cards.length} cards`)
}

await browser.close()
