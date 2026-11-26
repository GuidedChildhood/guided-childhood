// The Mumsnet post of 24 November must never pass again, and a plain parent
// reply must. Run with: node --test scripts/forum-tells.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { forumTells } from './forum-tells.mjs'
import { ownShare } from './own-words.mjs'

const MUMSNET = [
  "Hello. I'm a dad, not a company with a marketing team, and I'll be upfront: I",
  "at 6pm on a Tuesday. So I built a tool that tries to answer that.",
  "and it gives you the words to use tonight and a plan for their age.",
  "1. Did the advice sound like something you would actually say to your child?",
  "Blunt is good.",
  "https://www.guidedchildhood.com/starter-pack?utm_source=mumsnet&utm_medium=forum",
  "Thank you for reading, and for any time you can give it.",
]

test('every line of the Mumsnet post that gave it away is caught', () => {
  for (const line of MUMSNET) assert.ok(forumTells(line).length > 0, line)
})

test('a plain reply in a parent\'s own words passes', () => {
  const reply = "Ha, fair. Ours was the car. Every trip turned into a row about what to watch, so we tried a timer on the dash and it lasted about a week."
  assert.deepEqual(forumTells(reply), [])
})

test('own words: light fixes keep a post his, a rewrite does not', () => {
  const draft = "im justin dad of 3 near bath. built a thing for the screen rows in our house. looking for 10 parents to try it and tell me whats rubbish"
  const fixed = "I'm Justin, dad of 3 near Bath. Built a thing for the screen rows in our house. Looking for 10 parents to try it and tell me what's rubbish."
  const rewritten = "Hello. I'm a father of three and I've built a tool to help families manage screen time. I'd value honest feedback from ten parents."
  assert.ok(ownShare(draft, fixed) >= 0.9)
  assert.ok(ownShare(draft, rewritten) < 0.5)
})
