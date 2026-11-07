// Puts a real printable page into a real life scene for the Etsy photo set.
//
//   node content/printables/scene-composite.mjs <scene> <page.png> <out.png> [size]
//
// Justin, 6 November 2026: "add images that show the print out used in real
// life, real images of classroom, fridge, kitchen, Christmas day, using
// Higgsfield to generate real images". The scenes in listing-scenes/ were
// made on Higgsfield with one blank sheet facing the camera (job IDs in
// listing-scenes/README.md). An image model cannot draw our pages faithfully,
// so the page is never generated: this script lays the real page render onto
// the blank sheet, so every photo shows exactly what the buyer gets.
//
// How: grow the sheet from the middle of the frame (neighbouring pixels that
// stay pale and close in colour), fit a straight line to each of its four
// edges from the middle of each side (so magnets and pins over a corner do
// not bend it), intersect the lines for the corners, then map the page into
// that quad with a homography. The page is multiplied by the sheet's own
// light, so shadows and window glow stay on the paper, and anything inside
// the quad that is not sheet (a magnet, a pin) is kept from the scene.
import { createRequire } from 'module'
import { readFileSync, existsSync } from 'fs'
import { basename, dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'
const require = createRequire(import.meta.url)
const PW = process.env.PW_CORE ?? '/Users/justinphillips/guided-childhood/node_modules/playwright-core'
const { chromium } = require(PW)
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const HERE = dirname(fileURLToPath(import.meta.url))

const [scene, pagePath, outPath, sizeArg] = process.argv.slice(2)
const TOL = +(process.env.SHEET_TOL || 42)
const QUADS = existsSync(join(HERE, 'listing-scenes', 'quads.json')) ? JSON.parse(readFileSync(join(HERE, 'listing-scenes', 'quads.json'), 'utf8')) : {}
const sceneKey = basename(scene).replace(/\.(png|jpe?g)$/, '')
const fixedQuad = QUADS[sceneKey] || null
if (!scene || !pagePath || !outPath) {
  console.error('Usage: node scene-composite.mjs <scene name or png> <page.png> <out.png> [size, default 2000]')
  process.exit(1)
}
// Scenes live in listing-scenes/ as JPEG (the 2160px enlargements) or PNG.
const scenePath = existsSync(scene) ? scene : [`${scene}.jpg`, `${scene}.png`].map(f => join(HERE, 'listing-scenes', f)).find(existsSync)
const dataUrl = p => `data:image/${/\.jpe?g$/i.test(p) ? 'jpeg' : 'png'};base64,` + readFileSync(p).toString('base64')

const browser = await chromium.launch({ executablePath: existsSync(CHROME) ? CHROME : undefined })
const page = await browser.newPage()
const result = await page.evaluate(async ({ sceneUrl, pageUrl, size, TOL, fixedQuad, SOFTNESS, jpeg }) => {
  const load = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src })
  const [sc, pg] = await Promise.all([load(sceneUrl), load(pageUrl)])
  const W = sc.naturalWidth, H = sc.naturalHeight
  const c0 = new OffscreenCanvas(W, H), x0 = c0.getContext('2d')
  x0.drawImage(sc, 0, 0)
  const S = x0.getImageData(0, 0, W, H).data
  const at = (x, y) => (y * W + x) * 4
  const lum = i => 0.299 * S[i] + 0.587 * S[i + 1] + 0.114 * S[i + 2]
  const pale = i => lum(i) > 165 && Math.max(S[i], S[i + 1], S[i + 2]) - Math.min(S[i], S[i + 1], S[i + 2]) < 40

  // 1. Grow the sheet from the centre.
  const mask = new Uint8Array(W * H)
  let seed = null
  for (let r = 0; r < 60 && !seed; r += 4) for (const [dx, dy] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) {
    const sx = (W >> 1) + dx, sy = (H >> 1) + dy
    if (pale(at(sx, sy))) { seed = [sx, sy]; break }
  }
  if (!seed) return { error: 'no pale sheet near the middle of the scene' }
  const s0 = at(seed[0], seed[1]), SR = S[s0], SG = S[s0 + 1], SB = S[s0 + 2]
  const stack = [seed]; mask[seed[1] * W + seed[0]] = 1
  while (stack.length) {
    const [x, y] = stack.pop(), i = at(x, y)
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || mask[ny * W + nx]) continue
      const j = at(nx, ny)
      if (!pale(j)) continue
      // Small steps only, and never far from the paper colour at the centre,
      // so a white fridge door next to white paper stays outside the sheet.
      if (Math.abs(S[j] - S[i]) + Math.abs(S[j + 1] - S[i + 1]) + Math.abs(S[j + 2] - S[i + 2]) > 9) continue
      if (Math.abs(S[j] - SR) + Math.abs(S[j + 1] - SG) + Math.abs(S[j + 2] - SB) > TOL) continue
      mask[ny * W + nx] = 1; stack.push([nx, ny])
    }
  }
  // 2. Edge points per row and column, then a least squares line through the
  // middle 60 percent of each side.
  let minY = H, maxY = 0, minX = W, maxX = 0, area = 0
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (mask[y * W + x]) { area++; if (y < minY) minY = y; if (y > maxY) maxY = y; if (x < minX) minX = x; if (x > maxX) maxX = x }
  if (area < W * H * 0.04) return { error: 'sheet found is too small: ' + area }
  const fit = pts => { // x = a*t + b over (t, x)
    const n = pts.length; let st = 0, sx = 0, stt = 0, stx = 0
    for (const [t, x] of pts) { st += t; sx += x; stt += t * t; stx += t * x }
    const a = (n * stx - st * sx) / (n * stt - st * st); return [a, (sx - a * st) / n]
  }
  const rows = [], cols = []
  for (let y = Math.round(minY + (maxY - minY) * 0.2); y <= minY + (maxY - minY) * 0.8; y++) {
    let l = -1, r = -1
    for (let x = 0; x < W; x++) if (mask[y * W + x]) { if (l < 0) l = x; r = x }
    if (l >= 0) rows.push([y, l, r])
  }
  for (let x = Math.round(minX + (maxX - minX) * 0.2); x <= minX + (maxX - minX) * 0.8; x++) {
    let t = -1, b = -1
    for (let y = 0; y < H; y++) if (mask[y * W + x]) { if (t < 0) t = y; b = y }
    if (t >= 0) cols.push([x, t, b])
  }
  const L = fit(rows.map(([y, l]) => [y, l])), R = fit(rows.map(([y, , r]) => [y, r + 1]))
  const T = fit(cols.map(([x, t]) => [x, t])), B = fit(cols.map(([x, , b]) => [x, b + 1]))
  // Intersect x = a1*y + b1 with y = a2*x + b2.
  const meet = ([a1, b1], [a2, b2]) => { const x = (a1 * b2 + b1) / (1 - a1 * a2); return [x, a2 * x + b2] }
  // A measured quad (listing-scenes/quads.json) wins over the fitted one.
  // quads.json is measured on the 1024px scenes; scale it to this scene.
  const quad = fixedQuad ? fixedQuad.map(([x, y]) => [x * W / 1024, y * W / 1024]) : [meet(L, T), meet(R, T), meet(R, B), meet(L, B)] // tl tr br bl

  // 3. Output canvas at the target size.
  const k = size / W
  const out = new OffscreenCanvas(size, size), xo = out.getContext('2d')
  xo.imageSmoothingQuality = 'high'
  xo.drawImage(sc, 0, 0, size, size)
  const O = xo.getImageData(0, 0, size, size)
  const D = O.data
  const pc = new OffscreenCanvas(pg.naturalWidth, pg.naturalHeight), xp = pc.getContext('2d')
  xp.drawImage(pg, 0, 0)
  const P = xp.getImageData(0, 0, pc.width, pc.height).data, PW = pc.width, PH = pc.height

  // Homography from the output quad to the unit square.
  const q = quad.map(([x, y]) => [x * k, y * k])
  const solve = (src, dst) => { // 8x8 for h, mapping src[i] -> dst[i]
    const A = [], bb = []
    for (let i = 0; i < 4; i++) {
      const [x, y] = src[i], [u, v] = dst[i]
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); bb.push(u)
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); bb.push(v)
    }
    for (let c = 0; c < 8; c++) {
      let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r
      ;[A[c], A[p]] = [A[p], A[c]]; [bb[c], bb[p]] = [bb[p], bb[c]]
      for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let cc = c; cc < 8; cc++) A[r][cc] -= f * A[c][cc]; bb[r] -= f * bb[c] }
    }
    return bb.map((v, i) => v / A[i][i])
  }
  const h = solve(q, [[0, 0], [1, 0], [1, 1], [0, 1]])
  // The sheet's own light: its brightest typical value is "white paper".
  const lums = []
  for (let i = 0; i < W * H; i += 7) if (mask[i]) lums.push(lum(i * 4))
  lums.sort((a, b) => a - b)
  const white = lums[Math.floor(lums.length * 0.9)] || 240
  const xs = q.map(p => p[0]), ys = q.map(p => p[1])
  const x1 = Math.max(0, Math.floor(Math.min(...xs)) - 1), x2 = Math.min(size - 1, Math.ceil(Math.max(...xs)) + 1)
  const y1 = Math.max(0, Math.floor(Math.min(...ys)) - 1), y2 = Math.min(size - 1, Math.ceil(Math.max(...ys)) + 1)
  // What makes a composite look pasted on: a page sharper than the room
  // around it, hard stair stepped edges, ink blacker and brighter than ink on
  // paper ever is, and paper with no fibre or grain. So each output pixel is
  // the average of 9 samples spread a little over its footprint (soft like a
  // lens, and the edge coverage is antialiased), the ink sits in the paper
  // (blacks lifted, colour calmed a touch), and the paper gets a faint fibre
  // and the photo's fine grain. SOFT widens the footprint in output pixels.
  const SOFT = SOFTNESS
  const hash = (x, y) => { let n = x * 374761393 + y * 668265263; n = (n ^ (n >> 13)) * 1274126177; return ((n ^ (n >> 16)) & 0xffff) / 0xffff }
  const vnoise = (x, y) => { // smooth value noise for the paper fibre
    const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1)
    return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy
  }
  const sample = (u, v, out) => {
    const fx = u * (PW - 1), fy = v * (PH - 1), ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy
    const i00 = (iy * PW + ix) * 4, i10 = (iy * PW + Math.min(PW - 1, ix + 1)) * 4
    const i01 = (Math.min(PH - 1, iy + 1) * PW + ix) * 4, i11 = (Math.min(PH - 1, iy + 1) * PW + Math.min(PW - 1, ix + 1)) * 4
    for (let c = 0; c < 3; c++) out[c] += (P[i00 + c] * (1 - ax) + P[i10 + c] * ax) * (1 - ay) + (P[i01 + c] * (1 - ax) + P[i11 + c] * ax) * ay
  }
  const offs = [-1, 0, 1].map(t => t * (0.5 + SOFT) / 1.5)
  const acc = [0, 0, 0]
  for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) {
    acc[0] = acc[1] = acc[2] = 0
    let hits = 0
    for (const oy of offs) for (const ox of offs) {
      const X = x + 0.5 + ox, Y = y + 0.5 + oy
      const w = h[6] * X + h[7] * Y + 1
      const u = (h[0] * X + h[1] * Y + h[2]) / w, v = (h[3] * X + h[4] * Y + h[5]) / w
      if (u < 0 || v < 0 || u > 1 || v > 1) continue
      sample(u, v, acc); hits++
    }
    if (!hits) continue
    const sx = Math.min(W - 1, Math.floor(x / k)), sy = Math.min(H - 1, Math.floor(y / k))
    // A magnet or pin over the paper is coloured or dark; shadowed paper is
    // grey. Keep the scene where it is coloured or dark, so the magnets stay
    // on top and a shadow never punches a hole in the page.
    { const si = at(sx, sy), mx = Math.max(S[si], S[si + 1], S[si + 2]), mn = Math.min(S[si], S[si + 1], S[si + 2])
      if (mx - mn > 38 || lum(si) < 110) continue }
    const di = (y * size + x) * 4
    const shade = Math.min(1.04, Math.max(0.55, (0.299 * D[di] + 0.587 * D[di + 1] + 0.114 * D[di + 2]) / white))
    const cover = hits / 9
    const r = acc[0] / hits, g = acc[1] / hits, b = acc[2] / hits
    const l = 0.299 * r + 0.587 * g + 0.114 * b
    const fibre = 1 + (vnoise(x / 5, y / 5) - 0.5) * 0.014 + (vnoise(x / 1.6, y / 1.6) - 0.5) * 0.012
    const grain = (hash(x + 911, y + 37) - 0.5) * 5
    for (const [c, val] of [[0, r], [1, g], [2, b]]) {
      // Ink in paper: colour calmed 7 percent towards its own grey, blacks
      // lifted to the darkest a home printer lays down.
      let ink = l + (val - l) * 0.93
      ink = 22 + ink * (233 / 255)
      const lit = ink * shade * fibre * 0.975 + D[di + c] * 0.025 + grain
      D[di + c] = Math.max(0, Math.min(255, lit * cover + D[di + c] * (1 - cover)))
    }
  }
  xo.putImageData(O, 0, 0)
  // A .jpg out path saves a JPEG at 92: a fifth of the size, and what Etsy
  // takes (10 MB a file). The grain makes a PNG of a photo very large.
  const blob = await out.convertToBlob(jpeg ? { type: 'image/jpeg', quality: 0.92 } : { type: 'image/png' })
  const buf = new Uint8Array(await blob.arrayBuffer())
  let bin = ''; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000))
  return { png: btoa(bin), quad: quad.map(p => p.map(Math.round)), white: Math.round(white), area }
}, { sceneUrl: dataUrl(scenePath), pageUrl: dataUrl(resolve(pagePath)), size: +(sizeArg || 2000), TOL, fixedQuad, SOFTNESS: +(process.env.SOFT ?? 0.7), jpeg: /\.jpe?g$/i.test(outPath) })
await browser.close()
if (result.error) { console.error('scene-composite:', result.error); process.exit(1) }
const { writeFileSync } = await import('fs')
writeFileSync(outPath, Buffer.from(result.png, 'base64'))
console.log(`${outPath}: sheet corners ${JSON.stringify(result.quad)} (scene px), paper white ${result.white}`)
