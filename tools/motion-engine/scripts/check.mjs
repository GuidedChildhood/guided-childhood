#!/usr/bin/env node
// Check a render before anyone calls it done.
//
//   node scripts/check.mjs <outDir>
//
// Measures, never assumes: the file format, every frame decoding, the index at
// the front, the still's size, whether anything moves after the words have
// landed, whether the motion has any one frame jumps (a stutter or a flicker),
// and whether the PNG is the same picture as the film's last frame. Exits 1 on
// any failure, with every failure listed.

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawnSync, execFileSync } from 'node:child_process'

const W = 1080, H = 1350, FPS = 30
const LANDED = 154 // every word has landed by this frame (BEATS.allLanded)
const SMALL_W = 270, SMALL_H = 338 // analysis size, a quarter

const dir = resolve(process.argv[2] || '.')
const files = readdirSync(dir)
const mp4 = files.find((f) => f.endsWith('.mp4') && !f.includes('.tmp'))
const png = files.find((f) => f.endsWith('.png'))
const fails = []
const facts = {}

if (!mp4) fails.push('no MP4 in the folder')
if (!png) fails.push('no PNG in the folder')
if (fails.length) { console.log(fails.map((f) => `FAIL  ${f}`).join('\n')); process.exit(1) }
const MP4 = join(dir, mp4), PNG = join(dir, png)

// 1. Format.
const info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,codec_type,width,height,r_frame_rate,pix_fmt,nb_frames:format=duration,size', '-of', 'json', MP4]).toString())
const v = info.streams.find((s) => s.codec_type === 'video')
const a = info.streams.find((s) => s.codec_type === 'audio')
facts.video = { codec: v.codec_name, width: v.width, height: v.height, fps: v.r_frame_rate, pixfmt: v.pix_fmt, frames: Number(v.nb_frames), seconds: Number(info.format.duration), bytes: Number(info.format.size) }
if (v.width !== W || v.height !== H) fails.push(`the film is ${v.width} by ${v.height}, not ${W} by ${H}`)
if (v.r_frame_rate !== `${FPS}/1`) fails.push(`the film runs at ${v.r_frame_rate}, not ${FPS}/1`)
if (v.codec_name !== 'h264') fails.push(`the codec is ${v.codec_name}, not h264`)
if (v.pix_fmt !== 'yuv420p') fails.push(`the pixel format is ${v.pix_fmt}, not yuv420p, which some phones will not play`)
if (a) fails.push('there is an audio stream, and these films are silent')
if (facts.video.seconds < 12 || facts.video.seconds > 18) fails.push(`the film is ${facts.video.seconds} seconds, outside 12 to 18`)

// 2. Every frame decodes.
const dec = spawnSync('ffmpeg', ['-v', 'error', '-i', MP4, '-f', 'null', '-'])
facts.fullDecode = dec.status === 0 && !String(dec.stderr).trim() ? 'clean' : String(dec.stderr).slice(0, 300)
if (facts.fullDecode !== 'clean') fails.push(`frames did not decode cleanly: ${facts.fullDecode}`)

// 3. The index is at the front, so a phone starts playing at once.
const buf = readFileSync(MP4)
const boxes = []
for (let o = 0; o < buf.length && boxes.length < 12;) {
  let size = buf.readUInt32BE(o); const type = buf.toString('latin1', o + 4, o + 8)
  if (size === 1) size = Number(buf.readBigUInt64BE(o + 8))
  boxes.push(type); if (size < 8) break; o += size
}
facts.boxOrder = boxes.join(' ')
if (boxes.indexOf('moov') === -1 || boxes.indexOf('moov') > boxes.indexOf('mdat')) fails.push(`the index is not at the front: ${facts.boxOrder}`)

// 4. The still.
const pi = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height,codec_name', '-of', 'json', PNG]).toString()).streams[0]
facts.png = { codec: pi.codec_name, width: pi.width, height: pi.height }
if (pi.width !== W || pi.height !== H || pi.codec_name !== 'png') fails.push(`the still is ${pi.codec_name} ${pi.width} by ${pi.height}, not a ${W} by ${H} PNG`)

// 5. Motion. Every frame at a quarter size, in grey.
const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', MP4, '-vf', `scale=${SMALL_W}:${SMALL_H}:flags=area,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 30 })
const N = SMALL_W * SMALL_H
const n = Math.floor(raw.length / N)
const diff = []
for (let i = 1; i < n; i++) {
  let s = 0
  for (let p = 0; p < N; p++) s += Math.abs(raw[i * N + p] - raw[(i - 1) * N + p])
  diff.push(s / N)
}
const after = diff.slice(LANDED + 2)
const before = diff.slice(0, LANDED + 2)
facts.motion = {
  frames: n,
  meanChangeWhileBuilding: +(before.reduce((x, y) => x + y, 0) / before.length).toFixed(3),
  largestChangeAfterLanding: +Math.max(...after).toFixed(3),
  meanChangeAfterLanding: +(after.reduce((x, y) => x + y, 0) / after.length).toFixed(3),
  stillSeconds: +((n - LANDED) / FPS).toFixed(1),
}
// After landing only the light drifts. A word moving would show as a change
// far above that. 0.6 of a grey level on average, at a quarter size, is the line.
if (facts.motion.largestChangeAfterLanding > 0.6) fails.push(`something still moves after the words land: a change of ${facts.motion.largestChangeAfterLanding} grey levels`)
if (facts.motion.stillSeconds < 5) fails.push(`only ${facts.motion.stillSeconds} seconds to read the finished card, and the brief asks for five`)
// A stutter or a flicker is one frame that changes far more than both its
// neighbours. Smooth easing never does that.
const spikes = []
for (let i = 1; i < diff.length - 1; i++) {
  const nb = Math.max(diff[i - 1], diff[i + 1])
  if (diff[i] > 1.0 && diff[i] > nb * 3) spikes.push(i + 1)
}
facts.motion.oneFrameJumps = spikes
if (spikes.length) fails.push(`one frame jumps at frames ${spikes.join(', ')}: a stutter or a flicker`)

// 6. The PNG and the film's last frame are the same picture.
const lastFrame = raw.subarray((n - 1) * N, n * N)
const pngRaw = execFileSync('ffmpeg', ['-v', 'error', '-i', PNG, '-vf', `scale=${SMALL_W}:${SMALL_H}:flags=area,format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 26 })
let d = 0
for (let p = 0; p < N; p++) d += Math.abs(lastFrame[p] - pngRaw[p])
facts.stillMatchesLastFrame = +(d / N).toFixed(3)
if (facts.stillMatchesLastFrame > 1.5) fails.push(`the PNG differs from the film's last frame by ${facts.stillMatchesLastFrame} grey levels`)

// 7. Contrast of every text colour on the ivory canvas (WCAG 2).
const lum = (h) => { const c = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] }
const ratio = (fg, bg) => { const [x, y] = [lum(fg), lum(bg)]; return +((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2) }
const theme = readFileSync(new URL('../src/theme.ts', import.meta.url), 'utf8')
const hex = (k) => (theme.match(new RegExp(`${k}: '(#[0-9A-Fa-f]{6})'`)) || [])[1]
const bg = hex('ivoryDeep') // the darkest point of the canvas, the hardest case
facts.contrast = { ink: ratio(hex('ink'), bg), inkSoft: ratio(hex('inkSoft'), bg), goldInk: ratio(hex('goldInk'), bg) }
for (const [k, r] of Object.entries(facts.contrast)) if (r < 4.5) fails.push(`${k} text is ${r} to 1 on the canvas, under the 4.5 to 1 floor`)

writeFileSync(join(dir, 'check-report.json'), JSON.stringify({ checkedAt: new Date().toISOString(), passed: fails.length === 0, fails, facts }, null, 2) + '\n')
console.log(JSON.stringify(facts, null, 2))
if (fails.length) { console.log(fails.map((f) => `FAIL  ${f}`).join('\n')); process.exit(1) }
console.log('PASS  every check')
