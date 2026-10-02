#!/usr/bin/env node
/**
 * Renders The Social Billboard weekly playlist cards to PNG at the exact
 * sizes the post needs: 1200 x 630 landscape and 1080 x 1080 square.
 *
 *   node tools/tsb-playlist-card/render.mjs                 # every deck
 *   node tools/tsb-playlist-card/render.mjs decks/space.json
 *
 * Output: tools/tsb-playlist-card/out/<deck>/<card>.png plus <card>.alt.txt
 * with the alt text to paste into the post.
 *
 * The sky backgrounds in backgrounds/ were made on Higgsfield (gpt_image_2_5)
 * with no text, so the words stay crisp and editable here.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, join, resolve, basename } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const TEMPLATE = pathToFileURL(join(HERE, 'template.html')).href

const args = process.argv.slice(2)
const deckPaths = args.length
  ? args.map((a) => resolve(a))
  : readdirSync(join(HERE, 'decks')).filter((f) => f.endsWith('.json')).map((f) => join(HERE, 'decks', f))

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })

for (const deckPath of deckPaths) {
  const deck = JSON.parse(readFileSync(deckPath, 'utf8'))
  const name = deck.name || basename(deckPath, '.json')
  const outDir = join(HERE, 'out', name)
  mkdirSync(outDir, { recursive: true })

  await page.goto(TEMPLATE)
  await page.evaluate((d) => (d.kind === 'carousel' ? window.renderCarousel(d) : window.renderDeck(d)), deck)
  await page.evaluate(() => document.fonts.ready)
  // Background images must have decoded or the first card screenshots the plain navy.
  await page.waitForFunction(() => Array.from(document.images).every((i) => i.complete), null, { timeout: 5000 }).catch(() => {})
  await page.waitForTimeout(300)

  const cards = await page.locator('.card, .slide').all()
  for (let i = 0; i < cards.length; i++) {
    const cardName = await cards[i].getAttribute('data-name')
    const file = join(outDir, `${cardName}.png`)
    await cards[i].screenshot({ path: file })
    const alt = (deck.cards || deck.slides)[i].alt
    if (alt) writeFileSync(join(outDir, `${cardName}.alt.txt`), alt + '\n')
    console.log(`  ${file.replace(HERE + '/', '')}`)
  }
  console.log(`${name}: ${cards.length} cards`)
}
await browser.close()
