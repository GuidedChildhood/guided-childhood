// The Scripts page revisit shelf, checked against the cases it exists for.
// Run: node --experimental-strip-types scripts/check-script-shelves.mjs
import assert from 'node:assert/strict'
import { revisitShelf, conversationTally } from '../lib/scripts/shelves.ts'

const now = new Date('2026-11-17T12:00:00Z')
const ago = d => new Date(now.getTime() - d * 86_400_000).toISOString()

const rows = [
  { script_sort_order: 1, status: 'used', worked: 'yes', completed_at: ago(30) },       // refresh
  { script_sort_order: 2, status: 'used', worked: 'yes', completed_at: ago(5) },        // too soon
  { script_sort_order: 3, status: 'used', worked: 'no', completed_at: ago(1) },         // did not land, first
  { script_sort_order: 4, status: 'read', worked: null, completed_at: ago(10) },        // try it
  { script_sort_order: 5, status: 'not_needed', worked: 'no', completed_at: ago(40) },  // never back
  { script_sort_order: 6, status: 'opened', worked: null, completed_at: ago(40) },      // opened only, no
  { script_sort_order: 7, status: 'read', worked: null, completed_at: ago(1) },         // too soon to nudge
]

const shelf = revisitShelf(rows, { now })
assert.deepEqual(shelf.map(s => s.sort_order), [3, 1, 4], 'did not land, then refresh, then try it')
assert.equal(shelf[0].reason, 'did-not-land')
assert.match(shelf[1].line, /month ago|weeks ago/)
assert.ok(!shelf.some(s => s.sort_order === 5), 'not needed never comes back')
assert.ok(!shelf.some(s => /[–—]/.test(s.line)), 'no dashes in copy')

assert.deepEqual(revisitShelf(rows, { now, exclude: new Set([3]) }).map(s => s.sort_order), [1, 4], 'a script shown above is not repeated')
assert.equal(revisitShelf(rows, { now, limit: 1 }).length, 1)

// A household row and a child row for one script: the newer one decides.
const twin = [
  { script_sort_order: 9, status: 'used', worked: 'yes', completed_at: ago(40), child_id: null },
  { script_sort_order: 9, status: 'used', worked: 'yes', completed_at: ago(2), child_id: 'c1' },
]
assert.equal(revisitShelf(twin, { now }).length, 0, 'the fresh row wins, so it is not due yet')

assert.deepEqual(conversationTally(rows), { had: 4, wentWell: 2 }, 'used or rated counts as had; yes counts as went well')

console.log('check-script-shelves ok: did not land leads, spaced refresh after 21 days, read only nudged after 3, not needed never returns')
