#!/usr/bin/env node
// Render one story: the MP4 and the PNG.
//
//   node scripts/render.mjs <spec.json> [outDir]
//
// The PNG is the last frame of the film, rendered losslessly, so the still and
// the film can never say different things. Nothing renders unless the gate
// passes. For a real story the outputs go next to the spec in
// content/motion/GDC-NNN/, ready for scripts/radar/assets.mjs to record. A
// demonstration goes to tools/motion-engine/out/, which git ignores.

import { readFileSync, writeFileSync, mkdirSync, existsSync, renameSync, statSync } from 'node:fs'
import { join, dirname, basename, resolve, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { bundle } from '@remotion/bundler'
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer'
import { checkSpec } from './gate.mjs'

const ENGINE = dirname(dirname(fileURLToPath(import.meta.url)))
const ROOT = join(ENGINE, '..', '..')

// The browser Remotion drives. On a machine without one Remotion fetches its
// own headless Chrome; in the cloud container the Playwright one is used.
const HEADLESS_SHELL = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'
const browserExecutable = process.env.REMOTION_BROWSER || (existsSync(HEADLESS_SHELL) ? HEADLESS_SHELL : null)

// Quality. 16 is near lossless. A story card for Drive and Metricool uses 21,
// which looks the same at 1080 by 1350 and keeps the file under the 3 MB a
// Drive upload from a session can carry. Set MOTION_CRF to change it.
const CRF = Number(process.env.MOTION_CRF || 16)
const specPath = process.argv[2]
if (!specPath) { console.error('usage: node scripts/render.mjs <spec.json> [outDir]'); process.exit(2) }
const spec = JSON.parse(readFileSync(resolve(specPath), 'utf8'))

let record = null
if (!spec.notForPublication) {
  if (spec.draft) { console.error('HOLD: the spec is still a draft. A person shortens and checks it, then sets "draft": false.'); process.exit(1) }
  process.chdir(ROOT)
  // The register finds its folder from the working directory. Point it at the
  // repository's own, whichever folder this script was started from.
  process.env.RADAR_REGISTER ||= join(ROOT, 'content/research-register')
  const reg = await import(join(ROOT, 'scripts/radar/register.mjs'))
  record = reg.get(spec.researchId)
}
const gate = checkSpec(spec, record)
for (const w of gate.warnings) console.log(`NOTE  ${w}`)
if (gate.verdict !== 'PASS') {
  for (const r of gate.reasons) console.error(`HOLD  ${r}`)
  process.exit(1)
}

const name = spec.gdcPostNumber ? `gdc-${spec.gdcPostNumber}` : basename(specPath).replace(/\.json$/, '')
const outDir = resolve(process.argv[3] || (spec.gdcPostNumber ? join(ROOT, 'content/motion', `GDC-${spec.gdcPostNumber}`) : join(ENGINE, 'out', name)))
mkdirSync(outDir, { recursive: true })
const mp4 = join(outDir, `${name}.mp4`)
const png = join(outDir, `${name}.png`)

const t0 = Date.now()
console.log('Bundling the composition')
const serveUrl = await bundle({ entryPoint: join(ENGINE, 'src/index.ts'), publicDir: join(ENGINE, 'public'), onProgress: () => {} })
const inputProps = { spec }
const composition = await selectComposition({ serveUrl, id: 'ResearchCard', inputProps, browserExecutable })
console.log(`Rendering ${composition.width} by ${composition.height}, ${composition.fps} fps, ${composition.durationInFrames} frames`)

let last = -10
await renderMedia({
  serveUrl, composition, inputProps, browserExecutable,
  codec: 'h264', crf: CRF, pixelFormat: 'yuv420p', x264Preset: 'slow', muted: true,
  // Lossless frames: JPEG frames soften the edges of type before the encoder
  // ever sees them, and come out as full range video some phones will not play.
  imageFormat: 'png', colorSpace: 'bt709',
  outputLocation: mp4 + '.tmp.mp4',
  chromiumOptions: { gl: 'swangle' },
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10) * 10; if (p >= last + 10) { last = p; console.log(`  ${p}%`) } },
})

// Move the index to the front so LinkedIn and phones start playing before the
// whole file arrives. A copy of the streams, never a re-encode.
const fs = spawnSync('ffmpeg', ['-v', 'error', '-y', '-i', mp4 + '.tmp.mp4', '-c', 'copy', '-movflags', '+faststart', mp4])
if (fs.status !== 0) { console.error(`HOLD  ffmpeg could not finish the file: ${fs.stderr}`); process.exit(1) }
spawnSync('rm', ['-f', mp4 + '.tmp.mp4'])

await renderStill({ serveUrl, composition, inputProps, browserExecutable, frame: composition.durationInFrames - 1, output: png, imageFormat: 'png', chromiumOptions: { gl: 'swangle' } })

const sha = (f) => createHash('sha256').update(readFileSync(f)).digest('hex')
const report = {
  engine: 'gc-motion-engine 0.1.0',
  renderedAt: new Date().toISOString(),
  seconds: Math.round((Date.now() - t0) / 100) / 10,
  spec: relative(ROOT, resolve(specPath)),
  gdcPostNumber: spec.gdcPostNumber || null,
  researchId: spec.researchId || null,
  notForPublication: Boolean(spec.notForPublication),
  wordsOnCard: gate.words,
  gateWarnings: gate.warnings,
  mp4: { file: relative(ROOT, mp4), bytes: statSync(mp4).size, sha256: sha(mp4) },
  png: { file: relative(ROOT, png), bytes: statSync(png).size, sha256: sha(png) },
}
writeFileSync(join(outDir, 'render-report.json'), JSON.stringify(report, null, 2) + '\n')
console.log(`Rendered in ${report.seconds} s`)
console.log(`  ${report.mp4.file}`)
console.log(`  ${report.png.file}`)
console.log(`Next: node scripts/check.mjs ${relative(process.cwd(), outDir) || '.'}`)
