#!/usr/bin/env node
// THE CHARACTER VOICES GUARD (14 September 2026).
//
// Justin: "make sure the character voices are consistent, not to confuse
// kids." The audit that day found the curriculum map naming a different
// Planet Friend from the one the lesson used on nine modules, Orbit and Nova
// still written as the retired fox, and the KS1 hello playing on six KS3
// lessons. Migration 301 fixed the lesson rows; this holds the code side:
//
//   1. In the manifest, the friend key matches the first friend the cast
//      line names, so a card and its lesson cannot drift apart again.
//   2. No retired character (the fox, Vix, Teo, Olga, Alma, Sofia, Zara,
//      Oliver) and no "street smart" in the manifest, the intro lines or the
//      schools home page, case insensitively.
//   3. Orbit's intro line is Orbit's, not the KS1 line.
//   4. Migration 301 is in the tree and moves ks2-09 to Bloop.
//   5. The home page sells only friends the curriculum gives a lesson to.
//
// No database, no browser. Runs in the wiring workflow.
import { readFileSync, existsSync } from 'node:fs'

let failed = 0
const ok = (name, cond, detail = '') => {
  if (cond) return
  failed += 1
  console.error(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
}

const HOME = 'schools/app/page.tsx'
const manifest = readFileSync('shared/schools-curriculum.ts', 'utf8')
const FRIENDS = ['pebble', 'bloop', 'orbit', 'nova', 'cosmo', 'digi']

// 1. The friend key is the first friend the cast line names.
for (const m of manifest.matchAll(/moduleId: '([^']+)'[\s\S]*?character: '([a-z]+)', castLine: '([^']*)'/g)) {
  const [, id, key, cast] = m
  const first = cast.match(/Pebble|Bloop|Orbit|Nova|Cosmo|DiGi/)?.[0]?.toLowerCase()
  ok(`${id}: the friend key (${key}) matches the cast line (${cast})`, first === key,
    'the card on the map and the lesson on the wall must show the same friend')
  ok(`${id}: a known friend`, FRIENDS.includes(key))
}

// 2. No retired cast, no fox, no street smart.
//
// The home page is on this list because it was NOT, and that is exactly how
// "Street smart: scams, workarounds, AI and the road to work" survived the
// morning the fox was retired from every lesson (14 September 2026). The /i
// flag is here for the same reason: the phrase on the page was capitalised,
// so even the right file would have passed the old regex.
const intro = readFileSync('shared/intro-characters.ts', 'utf8')
const homePage = readFileSync(HOME, 'utf8')
for (const [file, src] of [['shared/schools-curriculum.ts', manifest], ['shared/intro-characters.ts', intro], [HOME, homePage]]) {
  const body = src.replace(/\/\/.*$/gm, '')
  ok(`${file} names no retired character`, !/\b(Vix|Teo|Olga|Alma|Sofia|Zara|Oliver)\b|the fox|street smart|🦊/i.test(body),
    'the cast is Pebble, Bloop, Orbit, Nova, Cosmo, DiGi and DiGi Junior (digi-squad/README.md)')
}

// 3. Orbit's own hello.
ok("Orbit's intro line is not the KS1 line", !/boss of your screen/.test(intro))
ok("Orbit's intro line asks a big question", /orbit: \{[\s\S]*?line: '[^']*question[^']*'/.test(intro))

// 4. The migration.
const MIG = 'supabase/migrations/301_character_voices_consistent.sql'
ok(`${MIG} exists`, existsSync(MIG))
if (existsSync(MIG)) {
  const sql = readFileSync(MIG, 'utf8')
  ok('migration 301 moves ks2-09 to Bloop', /character_cast = 'Bloop'[\s\S]*?ks2-09-copyright-ownership/.test(sql))
  ok('migration 301 retires the fox', /Orbit the fox/.test(sql) && /fox''s pockets/.test(sql))
}

// 5. The home page sells only friends the curriculum gives a lesson to.
//
// A face on the sales page that fronts no module is a claim with no proof
// path in the product (THE-STORY.md). Cosmo fronts nothing today, so the
// page filters him out on its own; when the sixth form lessons are written
// in his voice and the manifest says so, he comes back with nobody having to
// remember. This rule is what stops the filter being quietly removed.
{
  const src = readFileSync(HOME, 'utf8')
  ok('the home page filters its cast by what the manifest actually teaches',
    /const FRONTS_A_MODULE = new Set\(MODULES\.map\(m => m\.character\)\)/.test(src) && /SQUAD\.filter\(c => FRONTS_A_MODULE\.has\(c\.key\)\)/.test(src),
    'without the filter a friend who teaches nothing is still sold on the front page')
  ok('the home page renders the filtered cast, not the raw list', /\{CAST\.map\(/.test(src) && !/\{SQUAD\.map\(/.test(src))
  // Every friend the page can sell must be a real cast member.
  for (const m of src.matchAll(/\{ key: '([a-z]+)',/g)) {
    ok(`the home page cast entry '${m[1]}' is a real friend`, FRIENDS.includes(m[1]))
  }
}

if (failed) {
  console.error(`\ncharacter voices: ${failed} problem${failed === 1 ? '' : 's'}.\n`)
  process.exit(1)
}
console.log('character voices: one friend per card and lesson, no retired cast, Orbit says hello as Orbit.')
