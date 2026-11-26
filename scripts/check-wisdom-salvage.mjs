// The Sunday wisdom rebuild keeps the complete pieces of a broken reply.
// Run: node --experimental-strip-types scripts/check-wisdom-salvage.mjs
import assert from 'node:assert/strict'
import { parseItemArray } from '../lib/school/parse-items.ts'

const piece = n => `{"topic":"Topic ${n}","age_band":null,"what_works":"A pattern, with its caveat.","evidence_count":${n}}`
// Cut short mid piece, the way the 22 November run broke.
const cut = `{"wisdom":[${[1, 2, 3, 4, 5].map(piece).join(',')},{"topic":"Topic 6","what_wo`
assert.equal(parseItemArray(cut).length, 5, 'five complete pieces survive a cut reply')
// A stray character between pieces.
const stray = `{"wisdom":[${piece(1)},${piece(2)} x ${piece(3)},${piece(4)}]}`
assert.equal(parseItemArray(stray).length, 4, 'a stray character costs nothing')
// A clean reply is read whole.
assert.equal(parseItemArray(`{"wisdom":[${piece(1)},${piece(2)}]}`).length, 2)
console.log('check-wisdom-salvage ok: a broken wisdom reply keeps its complete pieces')
