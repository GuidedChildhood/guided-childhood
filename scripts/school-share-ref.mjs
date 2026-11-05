// Which school is ref 1a2b3c4d? (5 November 2026)
//
// A lesson share link names its school by a ref, a pseudonym of the school's
// access code, never the code (shared/parent-share.ts). The admin schools page
// counts families by ref. This turns a code into its ref, so a row can be named:
//
//   PARENT_SHARE_SECRET=... node --experimental-strip-types scripts/school-share-ref.mjs stmarys-2026 [kingsoak-2026 ...]
//
// With no codes it reads SCHOOLS_ACCESS_CODES and SCHOOLS_PILOT_CODES from the
// environment and prints every one. The secret must be the production value.

import { schoolShareRef } from '../shared/parent-share.ts'

const secret = process.env.PARENT_SHARE_SECRET || ''
if (!secret) {
  console.error('Set PARENT_SHARE_SECRET to the value both Vercel projects use.')
  process.exit(1)
}

const fromEnv = [process.env.SCHOOLS_ACCESS_CODES, process.env.SCHOOLS_PILOT_CODES]
  .flatMap(v => (v || '').split(','))
  .map(e => e.split(':')[0].trim())
  .filter(Boolean)
const codes = process.argv.slice(2).length ? process.argv.slice(2) : fromEnv
if (!codes.length) {
  console.error('Name at least one access code, or set SCHOOLS_ACCESS_CODES.')
  process.exit(1)
}
for (const code of codes) console.log(`${await schoolShareRef(code, secret)}  ${code.trim().toLowerCase()}`)
