// Makes the maskable app icons Android and the Microsoft Store need.
//
// Why a separate file: the manifest used to say "maskable any" on the one
// icon, which is the pattern Chrome's own docs warn against. The existing icon
// fills the square, so a phone that crops it to a circle or a squircle cuts the
// tips off DiGi's star. A maskable icon keeps everything that matters inside
// the centre circle (80 percent of the width) and bleeds its background to the
// edges, so whatever shape the launcher cuts, nothing is lost.
//
// Source is the existing public/icons/icon-512.png, never a regenerated star:
// the transparent panel the star sits in (between two cream strips) is cropped
// out and laid on a solid white canvas at 72 percent, so the glow stays soft.
//
// Run: node scripts/app-stores/make-maskable-icons.mjs
import sharp from 'sharp'

const SRC = 'public/icons/icon-512.png'
// The transparent panel inside icon-512, found by reading its pixels (cream strips
// sit either side of x 18 and x 494).
const PANEL = { left: 18, top: 0, width: 476, height: 512 }
const SCALE = 0.72

const panel = await sharp(SRC).extract(PANEL).toBuffer()
for (const size of [192, 512]) {
  const w = Math.round(PANEL.width * SCALE * size / 512)
  const h = Math.round(PANEL.height * SCALE * size / 512)
  const inner = await sharp(panel).resize(w, h).toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: '#FFFFFF' } })
    .composite([{ input: inner, left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) }])
    .png()
    .toFile(`public/icons/icon-maskable-${size}.png`)
  console.log(`public/icons/icon-maskable-${size}.png`)
}
