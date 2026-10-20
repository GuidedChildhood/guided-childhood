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
import { createRequire } from 'node:module'
import { readFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
// Playwright from the project if installed, else the copy preinstalled in
// cloud sessions, so the renderer runs in both without an install.
const require = createRequire(import.meta.url)
let chromium
try { ({ chromium } = require('playwright')) } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')) }
const TEMPLATE = pathToFileURL(join(HERE, 'template.html')).href
const AD_TEMPLATE = pathToFileURL(join(HERE, 'ad-template.html')).href

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

// A project Playwright newer than the cloud's preinstalled browsers cannot
// find its own build, so fall back to the Chromium the session already has.
const browser = await chromium.launch().catch(() => chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }))

for (const deckPath of deckPaths) {
  const deck = JSON.parse(readFileSync(deckPath, 'utf8'))
  const name = deck.name || basename(deckPath, '.json')
  const outDir = join(HERE, 'out', name)
  mkdirSync(outDir, { recursive: true })

  // "template": "ad" is the ad studio's phone card (ad-template.html), drawn
  // at twice the size by default so a real screen inside it stays sharp.
  const isAd = deck.template === 'ad'
  const page = await browser.newPage({ deviceScaleFactor: deck.scale || (isAd ? 2 : 1) })
  await page.goto(isAd ? AD_TEMPLATE : TEMPLATE)
  await page.evaluate((d) => window.renderDeck(d), deck)
  // Fonts must be ready or the first card renders in a fallback face.
  await page.evaluate(() => document.fonts.ready)

  const cards = await page.locator(isAd ? '.ad' : '.card').all()
  for (let i = 0; i < cards.length; i++) {
    const cardName = await cards[i].getAttribute('data-name')
    const file = join(outDir, `${String(i + 1).padStart(2, '0')}-${cardName}.png`)
    await cards[i].screenshot({ path: file })
    console.log(`  ${file.replace(HERE + '/', '')}`)
  }
  console.log(`${name}: ${cards.length} cards`)
  await page.close()
}

await browser.close()
