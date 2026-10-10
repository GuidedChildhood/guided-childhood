#!/usr/bin/env node
// Check a render: a contact sheet (one frame every 10 s, read left to right,
// tile k is at k times 10 s; this ffmpeg has no drawtext) and the
// loudness of every "Your turn" window, which must be silent.
//   node tools/verify.mjs renders/es-half.mp4 es
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
const [file, lang] = process.argv.slice(2)
const root = new URL('../', import.meta.url).pathname
const dur = parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${root + file}"`).toString())
const n = Math.ceil(dur / 10), cols = 6, rows = Math.ceil(n / cols)
const sheet = file.replace(/\.mp4$/, '-sheet.png')
execSync(`ffmpeg -v error -y -i "${root + file}" -vf "fps=1/10,scale=480:270,tile=${cols}x${rows}:padding=4:margin=4:color=#1A1A2E" -frames:v 1 -update 1 "${root + sheet}"`)
console.log(`${file}: ${dur.toFixed(1)}s, sheet ${sheet}`)
const pauses = JSON.parse(readFileSync(`${root}renders/pauses-${lang}.json`, 'utf8'))
let bad = 0
for (const [a, b] of pauses) {
  // Leave 50 ms at each edge for the encoder's fade of the line before.
  const out = execSync(`ffmpeg -v info -ss ${a + 0.05} -t ${b - a - 0.1} -i "${root + file}" -vn -af volumedetect -f null - 2>&1 || true`).toString()
  const max = parseFloat((out.match(/max_volume: (-?[\d.]+|-inf)/) || [])[1] ?? '-inf')
  const ok = !(max > -50)
  if (!ok) bad++
  console.log(`  pause ${a.toFixed(2)} to ${b.toFixed(2)}  peak ${isFinite(max) ? max.toFixed(1) + ' dB' : 'silent'}  ${ok ? 'ok' : 'NOT SILENT'}`)
}
console.log(bad ? `${bad} Your turn windows are not silent` : `all ${pauses.length} Your turn windows silent`)
process.exitCode = bad ? 1 : 0
