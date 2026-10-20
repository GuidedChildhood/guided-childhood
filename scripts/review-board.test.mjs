// Tests for the review board's book keeper (scripts/review-board.mjs).
// Run: node --test scripts/review-board.test.mjs
//
// Every test works in its own temporary folder (REVIEW_BOARD_DIR) on a fixed
// day (REVIEW_BOARD_TODAY), so nothing touches plans/review-board.

import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  LENSES, ingest, alerts, answer, addTask, renderDashboard, loadState, saveState, addDays, daysBetween,
  recordAnswer, readAnswers, pulseLine, pulseFromRows, renderReport,
} from './review-board.mjs'

const SCRIPT = new URL('./review-board.mjs', import.meta.url).pathname

beforeEach(() => {
  process.env.REVIEW_BOARD_DIR = mkdtempSync(join(tmpdir(), 'review-board-'))
  process.env.REVIEW_BOARD_TODAY = '2026-10-16'
})

const card = (lens, score, extra = {}) => ({
  lens, score, previous: null, headline: `${lens} headline`, moved_because: 'first run',
  strengths: [], gaps: [{ fix: `${lens} gap`, owner: 'claude', size: 'small', points: 1, proof: 'x' }],
  questions_for_justin: [], sources: [], ...extra,
})

function sampleRun(date = '2026-10-16', over = {}) {
  return {
    date,
    report: `plans/review-board/runs/${date}.md`,
    scorecards: LENSES.filter(l => l.id !== 'business-running').map((l, i) => card(l.id, i === 0 ? 10 : 6)),
    skeptic: [],
    chief: {
      scorecard: card('business-running', 7),
      roundup: 'A quiet week.',
      one_thing: 'Get the first paying family.',
      tasks: [
        { id: 'ico-registration', title: 'Register with the ICO', owner: 'justin', size: 'small', priority: 1, due: '2026-10-20', lenses: ['business-running'] },
        { id: 'paywall-copy', title: 'Name what a chatbot cannot do on the paywall', owner: 'claude', size: 'small', priority: 1, lenses: ['will-pay'] },
      ],
      completed: [],
      declined: [],
    },
    ...over,
  }
}

test('dates add and count across a month', () => {
  assert.equal(addDays('2026-10-30', 3), '2026-11-02')
  assert.equal(daysBetween('2026-10-13', '2026-10-20'), 7)
})

test('alerts on an empty board say it has not run, in one line', () => {
  const out = alerts(loadState())
  assert.match(out, /has not run yet/)
  assert.equal(out.split('\n').length, 1)
})

test('ingest writes eleven scores and the tasks, with default due dates', () => {
  const state = loadState()
  const summary = ingest(state, sampleRun())
  assert.equal(summary.lenses, 11)
  assert.equal(summary.added, 2)
  const run = state.board.runs[0]
  assert.equal(run.scores['value-above-ai'], 10)
  assert.equal(run.scores['business-running'], 7)
  assert.equal(run.top_gap['marketing'], 'marketing gap')
  const claude = state.tasks.tasks.find(t => t.id === 'paywall-copy')
  assert.equal(claude.due, '2026-10-23', 'a small claude task gets seven days')
  assert.equal(claude.status, 'open')
})

test('ingest refuses an unknown lens or a score out of range', () => {
  assert.throws(() => ingest(loadState(), sampleRun('2026-10-16', { scorecards: [card('vibes', 5)] })), /unknown lens/)
  assert.throws(() => ingest(loadState(), sampleRun('2026-10-16', { scorecards: [card('marketing', 11)] })), /whole number/)
})

test('the skeptic only ever lowers a score, and its reason is kept', () => {
  const state = loadState()
  const run = sampleRun()
  run.skeptic = [
    { lens: 'value-above-ai', verdict: 'lowered', score: 8, reason: 'no proof for the marketing line' },
    { lens: 'marketing', verdict: 'lowered', score: 9, reason: 'cannot raise' },
  ]
  const summary = ingest(state, run)
  assert.equal(state.board.runs[0].scores['value-above-ai'], 8)
  assert.equal(state.board.runs[0].scores['marketing'], 6, 'a lowered verdict above the score changes nothing')
  assert.deepEqual(summary.lowered, ['value-above-ai 10 to 8'])
  assert.equal(state.board.runs[0].skeptic['value-above-ai'].from, 10)
})

test('a second run carries tasks forward by id and closes completed ones', () => {
  const state = loadState()
  ingest(state, sampleRun('2026-10-09'))
  const second = sampleRun('2026-10-16')
  second.chief.tasks = [{ id: 'paywall-copy', title: 'Reworded', owner: 'claude', size: 'small', priority: 2 }]
  second.chief.completed = [{ id: 'ico-registration', proof: 'decision 15 October' }]
  const summary = ingest(state, second)
  assert.equal(summary.added, 0)
  assert.equal(summary.updated, 1)
  assert.equal(summary.closed, 1)
  assert.equal(state.tasks.tasks.length, 2)
  assert.equal(state.tasks.tasks.find(t => t.id === 'paywall-copy').title, 'Reworded')
  assert.equal(state.tasks.tasks.find(t => t.id === 'ico-registration').status, 'done')
  assert.equal(state.board.runs.length, 2)
})

test('rerunning the same date replaces that run rather than adding a second', () => {
  const state = loadState()
  ingest(state, sampleRun())
  ingest(state, sampleRun())
  assert.equal(state.board.runs.length, 1)
})

test('alerts ask about Justin tasks once a day, and go quiet once asked', () => {
  const state = loadState()
  ingest(state, sampleRun())
  let out = alerts(state)
  assert.match(out, /AskUserQuestion/)
  assert.match(out, /\[ico-registration\]/)
  assert.doesNotMatch(out, /\[paywall-copy\]/, 'Claude tasks are never put to Justin')
  answer(state, 'asked', 'ico-registration')
  out = alerts(state)
  assert.doesNotMatch(out, /AskUserQuestion/)
  assert.match(out, /GREEN/)
})

test('a past due Justin task turns the alert red, and a snooze hides it', () => {
  process.env.REVIEW_BOARD_TODAY = '2026-10-22'
  const state = loadState()
  ingest(state, sampleRun('2026-10-16'))
  let out = alerts(state)
  assert.match(out, /^REVIEW BOARD: RED/)
  assert.match(out, /2 days late/)
  answer(state, 'snooze', 'ico-registration', '7')
  out = alerts(state)
  assert.doesNotMatch(out, /RED/)
})

test('a stale board is amber, and the alert stays short', () => {
  process.env.REVIEW_BOARD_TODAY = '2026-11-01'
  const state = loadState()
  ingest(state, sampleRun('2026-10-16'))
  for (let i = 0; i < 9; i++) addTask(state, { owner: 'justin', title: `Thing ${i}` })
  const out = alerts(state)
  assert.match(out, /has not run for 16 days/)
  assert.ok(out.split('\n').length <= 12, `alerts printed ${out.split('\n').length} lines`)
  assert.equal((out.match(/^\s+\[/gm) || []).length, 4, 'at most four questions, the AskUserQuestion limit')
})

test('done, drop and add record the answer', () => {
  const state = loadState()
  ingest(state, sampleRun())
  answer(state, 'done', 'ico-registration', 'registered')
  assert.equal(state.tasks.tasks.find(t => t.id === 'ico-registration').status, 'done')
  answer(state, 'drop', 'paywall-copy', 'not needed')
  assert.equal(state.tasks.tasks.find(t => t.id === 'paywall-copy').status, 'dropped')
  const t = addTask(state, { owner: 'justin', title: 'Film the Saturday clips' })
  assert.equal(t.id, 'film-the-saturday-clips')
  assert.equal(t.due, '2026-10-23')
  assert.throws(() => answer(state, 'done', 'nope'), /no task with id/)
})

test('the dashboard draws every lens, escapes text, and has no dashes in its copy', () => {
  const state = loadState()
  const run = sampleRun()
  run.chief.one_thing = 'Fix <script>alert(1)</script> the paywall'
  ingest(state, run)
  const html = renderDashboard(state)
  for (const l of LENSES) assert.ok(html.includes(`id="lens-${l.id}"`), `missing ${l.id}`)
  assert.ok(!html.includes('<script>alert'), 'text must be escaped')
  const text = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<[^>]+>/g, ' ')
  assert.ok(!/[–—]/.test(text), 'no en or em dashes in the copy')
  assert.ok(!/\s-\s/.test(text), 'no spaced hyphens used as dashes in the copy')
})

test('the CLI alerts command never fails, even on a broken file', () => {
  const dir = process.env.REVIEW_BOARD_DIR
  saveState({ board: { runs: [] }, tasks: { tasks: [] } })
  // Corrupt the tasks file.
  writeFileSync(join(dir, 'tasks.json'), '{ not json')
  const r = spawnSync(process.execPath, [SCRIPT, 'alerts'], { env: process.env, encoding: 'utf8' })
  assert.equal(r.status, 0)
  assert.match(r.stdout, /could not read the board/)
})

test('the CLI ingest round trip writes the dashboard file', () => {
  const dir = process.env.REVIEW_BOARD_DIR
  const runFile = join(dir, 'run.json')
  writeFileSync(runFile, JSON.stringify(sampleRun()))
  const r = spawnSync(process.execPath, [SCRIPT, 'ingest', runFile], { env: process.env, encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  assert.match(r.stdout, /ingested run 2026-10-16: 11 lenses/)
  assert.match(readFileSync(join(dir, 'dashboard.html'), 'utf8'), /<title>Review Board<\/title>/)
  const report = readFileSync(join(dir, 'runs', '2026-10-16.md'), 'utf8')
  assert.match(report, /# Review board, 2026-10-16/)
  assert.match(report, /## 4\. Will pay over AI: 6 out of 10/)
  assert.match(report, /Register with the ICO/)
  assert.ok(!/[\u2013\u2014]/.test(report), 'no en or em dashes in the report')
})

test('an answer is its own file, survives a reload, and the weekly ingest folds it in', () => {
  const dir = process.env.REVIEW_BOARD_DIR
  let state = loadState()
  ingest(state, sampleRun('2026-10-09'))
  saveState(state)
  recordAnswer(loadState(), 'done', 'ico-registration', 'registered on the 14th')
  recordAnswer(loadState(), 'notyet', 'ico-registration')
  assert.equal(readAnswers().length, 2)
  state = loadState()
  const t = state.tasks.tasks.find(x => x.id === 'ico-registration')
  assert.equal(t.status, 'done', 'a later not yet cannot reopen a done task')
  const onDisk = JSON.parse(readFileSync(join(dir, 'tasks.json'), 'utf8'))
  assert.equal(onDisk.tasks.find(x => x.id === 'ico-registration').status, 'open', 'tasks.json itself is untouched')
  const runFile = join(dir, 'run.json')
  writeFileSync(runFile, JSON.stringify(sampleRun('2026-10-16')))
  const r = spawnSync(process.execPath, [SCRIPT, 'ingest', runFile], { env: process.env, encoding: 'utf8' })
  assert.equal(r.status, 0, r.stderr)
  assert.equal(readAnswers().length, 0, 'answers folded and cleared')
  const folded = JSON.parse(readFileSync(join(dir, 'tasks.json'), 'utf8'))
  assert.equal(folded.tasks.find(x => x.id === 'ico-registration').status, 'done')
})

test('an answer about a task this branch has not seen yet waits quietly', () => {
  const dir = process.env.REVIEW_BOARD_DIR
  fs.mkdirSync(join(dir, 'answers'), { recursive: true })
  writeFileSync(join(dir, 'answers', '2026-10-16-ghost-done.json'), JSON.stringify({ id: 'ghost', verb: 'done', date: '2026-10-16', at: 'x' }))
  assert.doesNotThrow(() => loadState())
})

// ── real behaviour from the product pulse (board-reads-real-numbers) ─────────

const pulseRows = () => ({
  generatedAt: '2026-10-16T05:00:00Z',
  today: '2026-10-16',
  families: ['a', 'b', 'c', 'd'],
  sessions: [
    { user_id: 'a', session_date: '2026-10-05' }, { user_id: 'a', session_date: '2026-10-15' },
    { user_id: 'b', session_date: '2026-10-06' },
    { user_id: 'c', session_date: '2026-10-14' },
  ],
  signals: {
    memory: ['a', 'b', 'c', 'z'], childLink: ['a', 'c'], secondCheckIn: ['a'],
    scriptVerdict: ['c'], followUpAnswered: ['c'],
  },
})

test('the rows become the line the product pulse would give, through the product own functions', async () => {
  const pulse = await pulseFromRows(pulseRows())
  assert.ok(pulse, 'the .ts functions load')
  assert.equal(pulse.habit.dayDoneRate7d, 67)
  assert.equal(pulse.habit.returnedD7, 50)
  assert.equal(pulse.valueSignals.secondCheckInFamilies, 1)
  assert.equal(pulse.valueSignals.reachedThree, 2, 'a has three, c has four, b only one, z is not a family')
  const line = pulseLine(pulse)
  assert.match(line, /day done rate 67%/)
  assert.match(line, /seven day return 50%/)
  assert.match(line, /second check in 1;/)
  assert.match(line, /three of the five value signals 2 of 4 families\./)
  assert.doesNotMatch(line, /[–—]|\s-\s/, 'no dashes')
})

test('anything the pulse cannot give prints unknown, never zero', async () => {
  assert.match(pulseLine(null), /unknown \(the product pulse was not read this run\)/)
  assert.match(pulseLine({ generatedAt: 'soon' }), /has no date/)
  assert.match(pulseLine({ generatedAt: '2026-10-01T00:00:00Z', habit: {}, valueSignals: null }), /too old/)
  const half = pulseLine({ generatedAt: '2026-10-16T05:00:00Z', habit: { dayDoneRate7d: null, returnedD7: 0 }, valueSignals: null })
  assert.match(half, /day done rate unknown/)
  assert.match(half, /seven day return 0%/, 'a real zero stays a zero')
  assert.match(half, /second check in unknown/)
  assert.match(half, /value signals unknown\./)
  assert.equal(await pulseFromRows({ today: '2026-10-16', families: [] }), null, 'rows missing a part are not guessed at')
  assert.equal(await pulseFromRows('nonsense'), null)
})

test('the pulse command reads a rows file, and a missing file prints unknown', () => {
  const dir = process.env.REVIEW_BOARD_DIR
  const rows = join(dir, 'rows.json')
  writeFileSync(rows, JSON.stringify(pulseRows()))
  const ok = spawnSync(process.execPath, [SCRIPT, 'pulse', '--rows', rows], { env: process.env, encoding: 'utf8' })
  assert.equal(ok.status, 0, ok.stderr)
  assert.match(ok.stdout, /day done rate 67%/)
  const none = spawnSync(process.execPath, [SCRIPT, 'pulse', '--rows', join(dir, 'nope.json')], { env: process.env, encoding: 'utf8' })
  assert.equal(none.status, 0)
  assert.match(none.stdout, /Real behaviour: unknown/)
  const bare = spawnSync(process.execPath, [SCRIPT, 'pulse'], { env: process.env, encoding: 'utf8' })
  assert.match(bare.stdout, /Real behaviour: unknown/)
})

test('the report carries the line the run gave it, or says unknown', () => {
  const state = loadState()
  const withLine = sampleRun('2026-10-16', { pulse_line: 'Real behaviour, from the product pulse of 2026-10-16: day done rate 67%.' })
  ingest(state, withLine)
  assert.match(renderReport(withLine, state), /## Real behaviour this week\n\nReal behaviour, from the product pulse of 2026-10-16: day done rate 67%\./)
  const without = sampleRun('2026-10-16')
  assert.match(renderReport(without, state), /## Real behaviour this week\n\nReal behaviour: unknown/)
})
