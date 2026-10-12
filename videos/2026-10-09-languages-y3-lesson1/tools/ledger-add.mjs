#!/usr/bin/env node
// Append generated audio to assets/ledger.tsv: one arg per file, "path|stamp|jobid".
// The text is looked up in beats.json from the path, so the ledger always
// records exactly what was sent. en/x = shared English, en/es_x = the Spanish
// film's English, es/x = Spanish native, fr/x = French native.
import { readFileSync, appendFileSync } from 'node:fs'
const B = JSON.parse(readFileSync(new URL('../beats.json', import.meta.url), 'utf8'))
const U = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD'
for (const a of process.argv.slice(2)) {
  const [path, stamp, job] = a.split('|')
  const m = path.match(/audio\/(en|es|fr)\/(?:(es|fr)_)?(\w+)\.mp3$/)
  let text
  if (m[1] === 'en') text = m[2] ? B.films[m[2]].en[m[3]] : B.shared_en[m[3]]
  else text = B.films[m[1]].tl[m[3]]
  if (!text) throw new Error('no text for ' + path)
  appendFileSync(new URL('../assets/ledger.tsv', import.meta.url), `${path}\t${job}\t${U}/hf_20261009_${stamp}_${job}.mp3\t${text}\n`)
}
