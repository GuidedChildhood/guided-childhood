// Renders one French lesson film: steps the GSAP timeline in film.html frame by
// frame, then lays the sound under it. Deterministic, no screen recording.
// Usage, from the repo root:
//   node content/languages/fr-films/engine/render.mjs <lesson folder> <audio> <out.mp4>
// The lesson folder holds cue.json. Audio is the song, or the preview voice track.
import pw from '../../../../node_modules/playwright/index.js'
import { readFileSync, mkdirSync, rmSync, copyFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ENGINE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(ENGINE, '../../../..')
const [lesson, audio, out] = process.argv.slice(2)
if (!lesson || !audio || !out) { console.error('usage: render.mjs <lesson folder> <audio> <out.mp4>'); process.exit(1) }
const cue = JSON.parse(readFileSync(join(lesson, 'cue.json'), 'utf8'))
const FPS = 25

// The stage loads its pictures and GSAP from beside it.
const work = join(lesson, 'work'); rmSync(work, { recursive: true, force: true }); mkdirSync(join(work, 'frames'), { recursive: true })
copyFileSync(join(ENGINE, 'film.html'), join(work, 'film.html'))
copyFileSync(join(ROOT, 'node_modules/gsap/dist/gsap.min.js'), join(work, 'gsap.min.js'))
copyFileSync(join(ROOT, 'schools/public/digi-squad/french/nova-french.png'), join(work, 'nova.png'))
copyFileSync(join(ROOT, 'schools/public/digi-squad/french/bloop-french.png'), join(work, 'bloop.png'))

const exe = existsSync('/opt/pw-browsers/chromium') ? { executablePath: '/opt/pw-browsers/chromium' } : {}
const b = await pw.chromium.launch(exe)
const p = await b.newPage({ viewport: { width: 1280, height: 720 } })
await p.addInitScript(c => { window.CUE = c }, cue)
await p.goto('file://' + resolve(work, 'film.html'))
await p.evaluate(() => window.ready)
const frames = Math.round(cue.length * FPS)
for (let f = 0; f < frames; f++) {
  await p.evaluate(t => window.seek(t), f / FPS)
  await p.screenshot({ path: join(work, 'frames', String(f).padStart(5, '0') + '.png') })
}
await b.close()
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', join(work, 'frames/%05d.png'), '-i', audio,
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-c:a', 'aac', '-b:a', '160k', '-shortest', out])
rmSync(work, { recursive: true, force: true })
console.log('made', out, frames, 'frames')
