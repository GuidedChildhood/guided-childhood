#!/usr/bin/env node
// The review board's book keeper.
//
// Justin, 13 October 2026: a set of agents that check the platform every week
// on ten questions and keep reviewing until each one is ten out of ten, with a
// dashboard, an easy alert system, and a check at the start of every session
// that asks him whether the outstanding tasks are done.
//
// The agents live in .claude/agents/review-*.md and the weekly run in
// .claude/skills/review-board/SKILL.md. This file is the part that has to be
// exact, so it is code and not a prompt:
//
//   alerts     what the SessionStart hook prints. It never throws and never
//              prints more than five lines, because every session pays for
//              it on every turn. Each task is asked about at most once a day,
//              so five sessions in a day do not nag five times.
//   ingest     takes one weekly run (the eleven lens scorecards, the skeptic's
//              verdicts, the chief of staff's task list) and writes it into
//              scorecard.json and tasks.json, then redraws the dashboard.
//   done, notyet, snooze, drop, add, list
//              the answers to the questions, recorded so the next session
//              does not ask again. Each answer is its own small file in
//              answers/, never an edit to tasks.json, because every session
//              works on its own branch: two sessions answering on the same day
//              would otherwise collide on one file. An answer reaches later
//              sessions when the branch carrying it merges, and the weekly
//              ingest folds the answers into tasks.json and clears the folder.
//   dashboard  draws plans/review-board/dashboard.html from the two files.
//
// No dependencies. The state is two JSON files in the repo, so the history is
// in git and a score can always be traced to the run that gave it.

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')

export const LENSES = [
  { id: 'value-above-ai', n: 1, name: 'Value above AI', question: 'Does it give a parent something a free chatbot cannot?' },
  { id: 'solves-problem', n: 2, name: 'Solves the problem', question: 'Does the nightly fight get smaller, and can the parent see it?' },
  { id: 'right-audience', n: 3, name: 'Right audience', question: 'Is the perfect customer right, and does every page speak to them?' },
  { id: 'will-pay', n: 4, name: 'Will pay over AI', question: 'Would they pay rather than ask a chatbot for free?' },
  { id: 'simplicity-flow', n: 5, name: 'Simple to use', question: 'What should change to keep the flow simple?' },
  { id: 'keeps-coming-back', n: 6, name: 'Keeps coming back', question: 'The Duolingo test: a reason to return tomorrow?' },
  { id: 'marketing', n: 7, name: 'Marketing', question: 'Is this the best way to bring parents to the stage check?' },
  { id: 'ux-expert', n: 8, name: 'UX expert', question: 'Would the screens sit beside the best family apps?' },
  { id: 'competitor-watch', n: 9, name: 'Competitor watch', question: 'What did they ship, and what can we use?' },
  { id: 'ai-tools-watch', n: 10, name: 'AI and tools watch', question: 'What new AI or tool would help us?' },
  { id: 'search', n: 11, name: 'Search', question: 'Do parents find us in Google and AI answers, and reach the stage check?' },
  { id: 'business-running', n: 12, name: 'Business running', question: 'Is everything moving, and is nothing stuck?' },
]
const LENS_IDS = new Set(LENSES.map(l => l.id))

/** How many days a task gets, by owner and size, when the run gives no date. */
const DUE_DAYS = { justin: 7, small: 7, medium: 14, large: 28 }
/** The board runs weekly; past this many days the alert says it is stale. */
const STALE_AFTER_DAYS = 8
/** AskUserQuestion takes at most four questions in one call. */
const MAX_ASK = 4

// ── paths and dates ──────────────────────────────────────────────────────────

export function boardDir() {
  return process.env.REVIEW_BOARD_DIR || join(ROOT, 'plans/review-board')
}
const paths = () => {
  const dir = boardDir()
  return {
    dir,
    scorecard: join(dir, 'scorecard.json'),
    tasks: join(dir, 'tasks.json'),
    dashboard: join(dir, 'dashboard.html'),
    answers: join(dir, 'answers'),
  }
}

/** Today in London, as YYYY-MM-DD. REVIEW_BOARD_TODAY overrides it for tests. */
export function today() {
  if (process.env.REVIEW_BOARD_TODAY) return process.env.REVIEW_BOARD_TODAY
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date())
}
export function addDays(date, days) {
  const d = new Date(date + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}
export function daysBetween(from, to) {
  return Math.round((Date.parse(to + 'T12:00:00Z') - Date.parse(from + 'T12:00:00Z')) / 86400000)
}
const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s)

// ── state ────────────────────────────────────────────────────────────────────

function readJson(file, fallback) {
  if (!existsSync(file)) return structuredClone(fallback)
  return JSON.parse(readFileSync(file, 'utf8'))
}
/** The answer files, oldest first. */
export function readAnswers() {
  const dir = paths().answers
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ file: join(dir, f), ...JSON.parse(readFileSync(join(dir, f), 'utf8')) }))
    .sort((a, b) => String(a.at).localeCompare(String(b.at)))
}

/** tasks.json with every answer file applied on top. */
export function loadState() {
  const p = paths()
  const state = {
    board: readJson(p.scorecard, { dashboard_url: null, runs: [] }),
    tasks: readJson(p.tasks, { tasks: [] }),
  }
  for (const a of readAnswers()) {
    // An answer about a task this branch has never heard of waits for the
    // merge that brings the task; it is not an error.
    if (state.tasks.tasks.some(t => t.id === a.id)) answer(state, a.verb, a.id, a.arg, a.date)
  }
  return state
}

/** Writes one answer as its own file, and applies it to the state in hand. */
export function recordAnswer(state, verb, id, arg) {
  const t = answer(state, verb, id, arg)
  const dir = paths().answers
  mkdirSync(dir, { recursive: true })
  const at = new Date().toISOString()
  const date = today()
  let file = join(dir, `${date}-${id}-${verb}.json`)
  for (let i = 2; existsSync(file); i++) file = join(dir, `${date}-${id}-${verb}-${i}.json`)
  writeFileSync(file, JSON.stringify({ id, verb, arg: arg ?? null, date, at }, null, 2) + '\n')
  return { task: t, file }
}

/** The weekly ingest folds the answers into tasks.json, so the folder empties. */
export function clearAnswers() {
  for (const a of readAnswers()) rmSync(a.file)
}
export function saveState({ board, tasks }) {
  const p = paths()
  mkdirSync(p.dir, { recursive: true })
  if (board) writeFileSync(p.scorecard, JSON.stringify(board, null, 2) + '\n')
  if (tasks) writeFileSync(p.tasks, JSON.stringify(tasks, null, 2) + '\n')
}

const lastRun = board => board.runs.length ? board.runs[board.runs.length - 1] : null

/** A task is waiting when it is open and not snoozed past today. */
export function isWaiting(task, on) {
  return task.status === 'open' && !(task.snooze_until && task.snooze_until > on)
}

// ── ingest one weekly run ────────────────────────────────────────────────────

function checkScorecard(card, where) {
  if (!card || !LENS_IDS.has(card.lens)) throw new Error(`${where}: unknown lens ${JSON.stringify(card?.lens)}`)
  if (!Number.isInteger(card.score) || card.score < 0 || card.score > 10) {
    throw new Error(`${where}: ${card.lens} score must be a whole number from 0 to 10, got ${JSON.stringify(card.score)}`)
  }
}

/**
 * Writes one run into the state. `run` is the JSON the review-board skill
 * assembles: { date, report, scorecards, skeptic, chief }. Returns a short
 * summary of what changed.
 */
export function ingest(state, run) {
  const date = run.date
  if (!isDate(date)) throw new Error(`run.date must be YYYY-MM-DD, got ${JSON.stringify(date)}`)
  const cards = [...(run.scorecards || [])]
  if (run.chief?.scorecard) cards.push({ ...run.chief.scorecard, lens: 'business-running' })
  cards.forEach((c, i) => checkScorecard(c, `scorecard ${i + 1}`))

  // The skeptic only ever lowers. A ten that did not survive it is not a ten.
  const lowered = []
  for (const v of run.skeptic || []) {
    const card = cards.find(c => c.lens === v.lens)
    if (!card || v.verdict !== 'lowered' || !Number.isInteger(v.score)) continue
    if (v.score < card.score) {
      lowered.push(`${v.lens} ${card.score} to ${v.score}`)
      card.skeptic = { from: card.score, reason: v.reason || '' }
      card.score = v.score
    }
    for (const g of v.added_gaps || []) (card.gaps ||= []).push(g)
  }

  const entry = {
    date,
    report: run.report || null,
    one_thing: run.chief?.one_thing || null,
    roundup: run.chief?.roundup || null,
    scores: {},
    headlines: {},
    top_gap: {},
    skeptic: {},
  }
  for (const c of cards) {
    entry.scores[c.lens] = c.score
    entry.headlines[c.lens] = c.headline || ''
    const gap = (c.gaps || [])[0]
    if (gap?.fix) entry.top_gap[c.lens] = gap.fix
    if (c.skeptic) entry.skeptic[c.lens] = c.skeptic
  }
  const runs = state.board.runs.filter(r => r.date !== date)
  runs.push(entry)
  runs.sort((a, b) => a.date.localeCompare(b.date))
  state.board.runs = runs

  // Tasks: carry forward by id, never a second copy.
  let added = 0
  let updated = 0
  let closed = 0
  const list = state.tasks.tasks
  for (const t of run.chief?.tasks || []) {
    if (!t.id || !t.title) continue
    const owner = t.owner === 'justin' ? 'justin' : 'claude'
    const size = ['small', 'medium', 'large'].includes(t.size) ? t.size : 'medium'
    const existing = list.find(x => x.id === t.id)
    if (existing) {
      if (existing.status !== 'open') continue
      Object.assign(existing, {
        title: t.title,
        owner,
        size,
        priority: t.priority ?? existing.priority,
        lenses: t.lenses || existing.lenses,
        proof: t.proof || existing.proof,
        due: isDate(t.due) ? t.due : existing.due,
      })
      updated++
    } else {
      list.push({
        id: t.id,
        title: t.title,
        owner,
        size,
        priority: t.priority ?? 2,
        lenses: t.lenses || [],
        proof: t.proof || '',
        due: isDate(t.due) ? t.due : addDays(date, owner === 'justin' ? DUE_DAYS.justin : DUE_DAYS[size]),
        status: 'open',
        created: date,
        asked: null,
        snooze_until: null,
        closed: null,
        note: '',
      })
      added++
    }
  }
  for (const c of run.chief?.completed || []) {
    const t = list.find(x => x.id === c.id)
    if (t && t.status === 'open') {
      Object.assign(t, { status: 'done', closed: date, note: c.proof || t.note })
      closed++
    }
  }
  return { date, lenses: cards.length, lowered, added, updated, closed }
}

// ── answers to the questions ─────────────────────────────────────────────────

function findTask(state, id) {
  const t = state.tasks.tasks.find(x => x.id === id)
  if (!t) throw new Error(`no task with id ${id}. List them with: npm run review-board -- list`)
  return t
}
export function answer(state, verb, id, arg, on = today()) {
  const t = findTask(state, id)
  if (verb === 'done') Object.assign(t, { status: 'done', closed: on, asked: on, note: arg || t.note })
  else if (verb === 'notyet') Object.assign(t, { asked: on, note: arg || t.note })
  else if (verb === 'snooze') {
    const days = Number.parseInt(arg ?? '7', 10)
    if (!Number.isInteger(days) || days < 1) throw new Error('snooze takes a number of days, for example: snooze <id> 7')
    Object.assign(t, { asked: on, snooze_until: addDays(on, days) })
  } else if (verb === 'drop') Object.assign(t, { status: 'dropped', closed: on, asked: on, note: arg || t.note })
  else if (verb === 'asked') t.asked = on
  else throw new Error(`unknown answer ${verb}`)
  return t
}

export function addTask(state, { owner, title, due, priority, size }) {
  if (!title) throw new Error('add needs --title')
  const on = today()
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').slice(0, 6).join('-') || 'task'
  let id = base
  for (let i = 2; state.tasks.tasks.some(t => t.id === id); i++) id = `${base}-${i}`
  const o = owner === 'claude' ? 'claude' : 'justin'
  const s = ['small', 'medium', 'large'].includes(size) ? size : 'small'
  const task = {
    id, title, owner: o, size: s,
    priority: Number.parseInt(priority ?? '2', 10) || 2,
    lenses: [], proof: 'added by hand',
    due: isDate(due) ? due : addDays(on, o === 'justin' ? DUE_DAYS.justin : DUE_DAYS[s]),
    status: 'open', created: on, asked: null, snooze_until: null, closed: null, note: '',
  }
  state.tasks.tasks.push(task)
  return task
}

// ── the two things Justin needs to know ─────────────────────────────────────
//
// Justin, 22 November 2026: "make review board super easy to read and simple
// with just what I need to do and if anything I need to be aware of not
// working." The alert and the dashboard both say exactly two things, from the
// same two functions, so they can never disagree: his own open tasks, most
// urgent first, and the real breakages or risks. Everything else is folded.

// Words a clause opens with when it is background ("the advice is already
// proactive in code") rather than the thing to do ("sit beside one parent").
const CONTEXT_OPENERS = new Set(['the', 'a', 'an', 'this', 'that', 'it', 'its', "it's", 'pr', 'nobody', 'we', 'our', 'there', 'these', 'those', 'already', 'still'])

/**
 * A task title cut to one plain line. `action` picks the first clause that is
 * something to do; `problem` keeps the opening clause, which on a fix is what
 * is broken. The full title stays one tap away on the dashboard.
 */
export function shortTitle(title, max = 100, mode = 'action') {
  const body = String(title ?? '')
    .replace(/^Step to ten for [^:]+:\s*/i, '')
    .replace(/\s*\([^)]*\)/g, '')
    .trim()
  const clauses = body.split(/, so |, but |, and |, or |; |\. /).map(c => c.trim()).filter(Boolean)
  const opener = c => c.split(/\s+/)[0].toLowerCase().replace(/[^a-z']/g, '')
  let t = (mode === 'action' && clauses.find(c => !CONTEXT_OPENERS.has(opener(c)) && !/^\d/.test(c))) || clauses[0] || body
  t = t.replace(/[.,;:\s]+$/, '')
  if (t.length > max) t = t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[.,;:\s]+$/, '').replace(/\s+(and|or|the|a|to|of|in|at|for)$/i, '') + '…'
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const lowerFirst = t => /^[A-Z][a-z]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t

/** Justin's waiting tasks: late first, then priority, then soonest due. */
export function justinTodo(state, on = today()) {
  return state.tasks.tasks
    .filter(t => t.owner === 'justin' && isWaiting(t, on))
    .sort((a, b) => ((a.due < on) === (b.due < on) ? 0 : a.due < on ? -1 : 1)
      || a.priority - b.priority || a.due.localeCompare(b.due))
}

/** How late or how soon, in words. */
export function whenText(t, on = today()) {
  if (t.due < on) {
    const d = daysBetween(t.due, on)
    return `${d} day${d === 1 ? '' : 's'} late`
  }
  if (t.due === on) return 'due today'
  return `due ${fmtDate(t.due)}`
}

/**
 * Only what is really broken or at risk, each one plain line saying what it
 * means for Justin. Never a score that merely sits below ten.
 */
export function notWorking(state, on = today()) {
  const runs = state.board.runs
  const run = lastRun(state.board)
  const out = []
  if (!run) return ['The weekly board has never run, so there are no scores yet.']
  const age = daysBetween(run.date, on)
  if (age > STALE_AFTER_DAYS) out.push(`The Friday board has not run for ${age} days, so the scores are old. The routine has probably failed.`)
  const prev = runs.length > 1 ? runs[runs.length - 2] : null
  if (prev) {
    for (const l of LENSES) {
      const s = run.scores[l.id]
      const b = prev.scores[l.id]
      if (Number.isInteger(s) && Number.isInteger(b) && s < b) out.push(`${l.name} dropped from ${b} to ${s} at the last run.`)
    }
  }
  const claudeLate = state.tasks.tasks.filter(t => t.owner === 'claude' && isWaiting(t, on) && t.due < on)
  const topLate = claudeLate.filter(t => t.priority === 1)
  for (const t of topLate) out.push(`Claude's top fix is ${whenText(t, on)}: ${lowerFirst(shortTitle(t.title, 100, 'problem'))}.`)
  const rest = claudeLate.length - topLate.length
  if (rest > 0) out.push(`${rest} more of Claude's own tasks are late, so the scores will not move until a session picks them up.`)
  return out
}

/**
 * The text the SessionStart hook adds to every session. At most five lines,
 * because every session pays for it on every turn. Each task is put to Justin
 * at most once a day, at most four at a time (the AskUserQuestion limit).
 */
export function alerts(state) {
  const on = today()
  const run = lastRun(state.board)
  const todo = justinTodo(state, on)
  const broken = notWorking(state, on)
  if (!run) return 'REVIEW BOARD. Not working: the weekly board has never run. Run it with the review-board skill when Justin asks, or wait for the Friday routine.'
  if (!todo.length && !broken.length) return 'REVIEW BOARD. Nothing for Justin to do, nothing broken.'

  const late = todo.filter(t => t.due < on).length
  const toAsk = todo.filter(t => t.asked !== on).slice(0, MAX_ASK)
  const lines = []
  lines.push(todo.length
    ? `REVIEW BOARD. What you need to do: ${todo.length} task${todo.length === 1 ? '' : 's'} for Justin${late ? `, ${late} late` : ''}${toAsk.length ? '' : ', all asked about today'}.`
    : 'REVIEW BOARD. What you need to do: nothing for Justin.')
  if (toAsk.length) {
    lines.push(`Before his request, ask with AskUserQuestion, one question each, options Done, Not yet, Snooze a week, Drop it: ${toAsk.map(t => `[${t.id}] ${shortTitle(t.title, 90)} (${whenText(t, on)})`).join('; ')}.`)
    lines.push('Record each: npm run review-board -- done|notyet|drop <id> [note], or snooze <id> 7, and commit plans/review-board/answers with this session\'s work. A routine with nobody to answer skips this.')
  }
  lines.push(broken.length ? `Not working: ${broken.join(' ')}` : 'Not working: nothing.')
  if (state.board.dashboard_url) lines.push(`Dashboard: ${state.board.dashboard_url}`)
  return lines.join('\n')
}

// ── the run report ───────────────────────────────────────────────────────────

/** The full report for one run, as markdown, drawn from the run file itself. */
export function renderReport(run, state) {
  const entry = state.board.runs.find(r => r.date === run.date)
  const prevRun = state.board.runs.filter(r => r.date < run.date).slice(-1)[0] || null
  const cards = [...(run.scorecards || [])]
  if (run.chief?.scorecard) cards.push({ ...run.chief.scorecard, lens: 'business-running' })
  const byLens = Object.fromEntries(cards.map(c => [c.lens, c]))
  const out = []
  const tens = Object.values(entry.scores).filter(s => s === 10).length
  out.push(`# Review board, ${run.date}`, '')
  out.push(`${tens} of ${Object.keys(entry.scores).length} lenses at ten. Drawn by \`npm run review-board -- ingest\` from the run file; the dashboard is \`plans/review-board/dashboard.html\`.`, '')
  if (entry.one_thing) out.push(`**The one thing this week.** ${entry.one_thing}`, '')
  out.push('| # | Lens | Last run | This run | Skeptic |', '| --- | --- | --- | --- | --- |')
  for (const l of LENSES) {
    if (!Number.isInteger(entry.scores[l.id])) continue
    const before = prevRun?.scores[l.id]
    const sk = entry.skeptic[l.id]
    out.push(`| ${l.n} | ${l.name} | ${Number.isInteger(before) ? before : 'first run'} | ${entry.scores[l.id]} | ${sk ? `lowered from ${sk.from}` : ''} |`)
  }
  out.push('')
  out.push('## Real behaviour this week', '', typeof run.pulse_line === 'string' && run.pulse_line.trim() ? run.pulse_line.trim() : pulseLine(null), '')
  if (entry.roundup) out.push('## The round up', '', entry.roundup, '')
  for (const l of LENSES) {
    const c = byLens[l.id]
    if (!c) continue
    out.push(`## ${l.n}. ${l.name}: ${entry.scores[l.id]} out of 10`, '')
    if (c.headline) out.push(c.headline, '')
    if (c.moved_because) out.push(`*Why it moved:* ${c.moved_because}`, '')
    if (entry.skeptic[l.id]) out.push(`*The skeptic:* ${entry.skeptic[l.id].reason}`, '')
    if (c.strengths?.length) {
      out.push('**What is strong**', '')
      for (const s of c.strengths) out.push(`- ${s.claim} (\`${s.proof}\`)`)
      out.push('')
    }
    if (c.gaps?.length) {
      out.push('**The gaps to ten**', '')
      for (const g of c.gaps) out.push(`- ${g.fix} *${g.owner}, ${g.size}, ${g.points ?? '?'} point${g.points === 1 ? '' : 's'}.* Proof: ${g.proof}`)
      out.push('')
    }
    if (c.questions_for_justin?.length) {
      out.push('**Questions for Justin**', '')
      for (const q of c.questions_for_justin) out.push(`- ${q}`)
      out.push('')
    }
    if (c.sources?.length) {
      out.push('**Sources**', '')
      for (const s of c.sources) out.push(`- ${s}`)
      out.push('')
    }
  }
  const tasks = run.chief?.tasks || []
  if (tasks.length) {
    out.push('## The task list from this run', '', '| Priority | Owner | Task | Due | Lenses |', '| --- | --- | --- | --- | --- |')
    for (const t of [...tasks].sort((a, b) => (a.priority ?? 2) - (b.priority ?? 2))) {
      out.push(`| P${t.priority ?? 2} | ${t.owner} | ${t.title} (\`${t.id}\`) | ${t.due || ''} | ${(t.lenses || []).join(', ')} |`)
    }
    out.push('')
  }
  const declined = run.chief?.declined || []
  if (declined.length) {
    out.push('## Declined or parked, with the reason', '')
    for (const d of declined) out.push(`- **${d.verdict}** (${d.lens}): ${d.fix} *${d.reason}*`)
    out.push('')
  }
  return out.join('\n')
}

// ── the dashboard ────────────────────────────────────────────────────────────

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const fmtDate = d => isDate(d)
  ? new Date(d + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })
  : ''

function spark(points) {
  const w = 120
  const h = 32
  const pad = 4
  if (!points.length) return ''
  const x = i => points.length === 1 ? w - pad : pad + (i * (w - 2 * pad)) / (points.length - 1)
  const y = v => h - pad - (v / 10) * (h - 2 * pad)
  const line = points.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')
  const area = points.length > 1 ? `<polygon points="${x(0).toFixed(1)},${h - pad} ${line} ${x(points.length - 1).toFixed(1)},${h - pad}" class="spark-area"/>` : ''
  const last = points[points.length - 1]
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="100%" height="${h}" role="img" aria-label="Score each week: ${points.join(', ')}">`
    + `<line x1="${pad}" x2="${w - pad}" y1="${y(10)}" y2="${y(10)}" class="spark-ten"/>`
    + area
    + (points.length > 1 ? `<polyline points="${line}" class="spark-line"/>` : '')
    + `<circle cx="${x(points.length - 1).toFixed(1)}" cy="${y(last).toFixed(1)}" r="3.2" class="spark-dot"/></svg>`
}

function ladder(score) {
  let cells = ''
  for (let i = 1; i <= 10; i++) cells += `<span class="rung${i <= score ? ' on' : ''}"></span>`
  return `<div class="ladder" aria-hidden="true">${cells}</div>`
}

function band(score) {
  if (score === 10) return 'ten'
  if (score >= 8) return 'close'
  if (score >= 6) return 'mid'
  return 'low'
}

export function renderDashboard(state) {
  const on = today()
  const runs = state.board.runs
  const run = lastRun(state.board)
  const prev = runs.length > 1 ? runs[runs.length - 2] : null
  const todo = justinTodo(state, on)
  const late = todo.filter(t => t.due < on).length
  const broken = notWorking(state, on)
  const snoozed = state.tasks.tasks.filter(t => t.owner === 'justin' && t.status === 'open' && !isWaiting(t, on))
  const claude = state.tasks.tasks.filter(t => t.owner === 'claude' && t.status === 'open')
  const doneRecent = state.tasks.tasks.filter(t => t.status === 'done' && t.closed && daysBetween(t.closed, on) <= 14)
  const tens = run ? Object.values(run.scores).filter(s => s === 10).length : 0
  const total = run ? Object.keys(run.scores).length : LENSES.length

  const summary = [
    todo.length ? `${todo.length} thing${todo.length === 1 ? '' : 's'} for you${late ? `, ${late} late` : ''}.` : 'Nothing for you to do.',
    broken.length ? `${broken.length} thing${broken.length === 1 ? '' : 's'} not working.` : 'Nothing broken.',
  ].join(' ')

  const todoRow = t => `<li class="todo${t.due < on ? ' late' : ''}" data-id="${esc(t.id)}">
  <details class="todo-text"><summary><span class="todo-title">${esc(shortTitle(t.title))}</span><span class="when">${esc(whenText(t, on))}</span></summary><p class="full">${esc(t.title)}</p></details>
  <div class="answer"><button type="button" class="btn yes" data-verb="done">Done</button><button type="button" class="btn no" data-verb="notyet">Not yet</button></div>
  <p class="copied" hidden></p>
</li>`

  const lensCard = l => {
    const score = run?.scores[l.id]
    const has = Number.isInteger(score)
    const before = prev?.scores[l.id]
    const delta = has && Number.isInteger(before) ? score - before : null
    const chip = delta === null ? '' : delta > 0 ? `<span class="chip up">up ${delta}</span>` : delta < 0 ? `<span class="chip down">down ${-delta}</span>` : ''
    const history = runs.map(r => r.scores[l.id]).filter(Number.isInteger)
    const sk = run?.skeptic?.[l.id]
    return `<article class="lens ${has ? band(score) : 'none'}" id="lens-${l.id}">
  <header class="lens-head"><h3>${esc(l.name)}</h3><span class="big">${has ? score : '?'}</span>${chip}</header>
  ${has ? ladder(score) : ''}
  ${history.length > 1 ? spark(history) : ''}
  ${run?.headlines[l.id] ? `<p class="lens-line">${esc(run.headlines[l.id])}</p>` : ''}
  ${sk ? `<p class="lens-skeptic">The skeptic took it from ${sk.from} to ${score}: ${esc(sk.reason)}</p>` : ''}
  ${run?.top_gap[l.id] ? `<p class="lens-gap"><span class="label">To reach ten</span>${esc(run.top_gap[l.id])}</p>` : ''}
</article>`
  }

  const plainList = (items, meta) => items.length
    ? `<ul class="plain">${items.map(t => `<li><span>${esc(shortTitle(t.title))}</span><span class="when">${esc(meta(t))}</span></li>`).join('')}</ul>`
    : '<p class="empty">None.</p>'
  const byPri = (a, b) => a.priority - b.priority || a.due.localeCompare(b.due)

  const history = runs.length
    ? `<div class="table-wrap"><table class="history"><thead><tr><th scope="col">Lens</th>${runs.map(r => `<th scope="col">${fmtDate(r.date)}</th>`).join('')}</tr></thead><tbody>${LENSES.map(l => `<tr><th scope="row">${esc(l.name)}</th>${runs.map(r => {
      const s = r.scores[l.id]
      return `<td class="${Number.isInteger(s) ? band(s) : ''}">${Number.isInteger(s) ? s : ''}</td>`
    }).join('')}</tr>`).join('')}</tbody></table></div>`
    : '<p class="empty">The first run fills this in.</p>'

  const fold = (title, sub, body, open = false) => `<details class="fold"${open ? ' open' : ''}><summary><span class="fold-title">${title}</span><span class="fold-sub">${sub}</span></summary><div class="fold-body">${body}</div></details>`

  return `<title>Review Board</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Ten seconds on a phone: what Justin needs to do, then what is not working.
   Everything else is folded below, one tap to open. */
:root {
  --bg: #F1EFEA; --card: #FFFFFF; --ink: #1A1A2E; --ink-soft: #52526A; --muted: #65657C;
  --line: #EAEAF0; --butter: #EDC35F; --butter-dark: #C99A28; --butter-lt: #FEF7E0;
  --ok: #2F8F6B; --ok-lt: #E6F4EE; --ok-dark: #1F6B4F; --warn: #B7791F; --bad: #C94F3D; --bad-lt: #FBECE9;
  --rung-off: #E7E3D8; --yes-ink: #FFFFFF; --btn-line: #D9D6CC;
  --display: 'Nunito', ui-rounded, 'Segoe UI', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #1B1812; --card: #26221A; --ink: #F4F1E8; --ink-soft: #CFC9B8; --muted: #ABA591;
  --line: #3A3428; --butter-lt: #3A3018; --ok: #5CC49B; --ok-lt: #1D3229; --ok-dark: #2F7A5C;
  --warn: #E6B45A; --bad: #EE8A78; --bad-lt: #3D221D; --rung-off: #3A3428; --btn-line: #4A4334; --yes-ink: #1A1A2E; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #1B1812; --card: #26221A; --ink: #F4F1E8; --ink-soft: #CFC9B8; --muted: #ABA591;
  --line: #3A3428; --butter-lt: #3A3018; --ok: #5CC49B; --ok-lt: #1D3229; --ok-dark: #2F7A5C;
  --warn: #E6B45A; --bad: #EE8A78; --bad-lt: #3D221D; --rung-off: #3A3428; --btn-line: #4A4334; --yes-ink: #1A1A2E; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--display); font-size: 17px; line-height: 1.45; }
.wrap { max-width: 720px; margin: 0 auto; padding: 24px 16px 56px; display: grid; gap: 22px; }
h1, h2, h3 { margin: 0; text-wrap: balance; }
p { margin: 0; }
.eyebrow, .label, .chip, .when, .fold-sub, .history th[scope="col"] { font-family: var(--mono); letter-spacing: .03em; }
.eyebrow { font-size: 12px; text-transform: uppercase; color: var(--muted); }
.head h1 { font-size: clamp(28px, 7vw, 38px); font-weight: 900; line-height: 1.1; margin-top: 4px; }
.head .summary { color: var(--ink-soft); font-weight: 700; margin-top: 6px; }
section > h2 { font-size: 22px; font-weight: 900; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
.count { font-family: var(--mono); font-size: 13px; font-weight: 600; background: var(--butter); color: #1A1A2E; border-radius: 999px; padding: 2px 10px; }
.todos { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.todo { background: var(--card); border: 1px solid var(--line); border-left: 6px solid var(--butter); border-radius: 16px; padding: 14px; display: grid; gap: 12px; }
.todo.late { border-left-color: var(--bad); }
.todo-text summary { list-style: none; cursor: pointer; display: grid; gap: 4px; }
.todo-text summary::-webkit-details-marker { display: none; }
.todo-title { font-weight: 800; font-size: 18px; }
.when { font-size: 13px; color: var(--muted); }
.todo.late .when { color: var(--bad); font-weight: 600; }
.full { margin-top: 8px; color: var(--ink-soft); font-size: 15px; }
.answer { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.btn { font: inherit; font-weight: 800; font-size: 17px; min-height: 48px; border-radius: 16px; cursor: pointer; border: 2px solid transparent; }
.btn.yes { background: var(--ok); color: var(--yes-ink); box-shadow: 0 5px 0 var(--ok-dark); }
.btn.no { background: var(--card); color: var(--ink); border-color: var(--btn-line); box-shadow: 0 5px 0 var(--btn-line); }
.btn:active { transform: translateY(3px); box-shadow: 0 2px 0 var(--btn-line); }
.btn:focus-visible, summary:focus-visible { outline: 3px solid var(--butter-dark); outline-offset: 2px; }
.copied { font-size: 14px; color: var(--ink-soft); background: var(--butter-lt); border-radius: 10px; padding: 8px 10px; overflow-wrap: anywhere; }
.copied code { font-family: var(--mono); font-size: 13px; user-select: all; }
.alerts { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.alerts li { background: var(--bad-lt); border-radius: 14px; padding: 12px 14px; font-weight: 700; display: flex; gap: 10px; }
.alerts li::before { content: ''; flex: none; width: 10px; height: 10px; margin-top: 7px; border-radius: 50%; background: var(--bad); }
.clear { background: var(--ok-lt); border-radius: 14px; padding: 12px 14px; font-weight: 700; color: var(--ink); }
.empty { color: var(--muted); }
.fold { background: var(--card); border: 1px solid var(--line); border-radius: 16px; }
.fold > summary { cursor: pointer; padding: 14px 16px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 2px 12px; list-style: none; }
.fold > summary::-webkit-details-marker { display: none; }
.fold > summary::after { content: '+'; grid-column: 2; grid-row: 1 / span 2; font-weight: 900; font-size: 24px; line-height: 1; color: var(--muted); }
.fold[open] > summary::after { content: '×'; }
.fold-title { font-weight: 900; font-size: 18px; grid-column: 1; }
.fold-sub { font-size: 12px; color: var(--muted); grid-column: 1; }
.fold-body { padding: 0 16px 16px; display: grid; gap: 14px; }
.fold .fold { border-color: var(--line); background: var(--bg); }
.one { background: var(--butter); color: #1A1A2E; border-radius: 14px; padding: 12px 14px; font-weight: 800; box-shadow: 0 5px 0 var(--butter-dark); }
.one .eyebrow { color: #52422A; }
.grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
.lens { background: var(--bg); border-radius: 14px; padding: 12px; display: grid; gap: 8px; align-content: start; min-width: 0; }
.lens-head { display: flex; align-items: baseline; gap: 8px; }
.lens-head h3 { font-size: 16px; font-weight: 800; flex: 1; }
.lens-head .big { font-size: 26px; font-weight: 900; line-height: 1; font-variant-numeric: tabular-nums; }
.lens.low .big { color: var(--bad); } .lens.mid .big { color: var(--warn); } .lens.ten .big { color: var(--ok); }
.chip { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--card); color: var(--ink-soft); white-space: nowrap; }
.chip.up { background: var(--ok-lt); color: var(--ok); } .chip.down { background: var(--bad-lt); color: var(--bad); }
.ladder { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; }
.rung { height: 6px; border-radius: 3px; background: var(--rung-off); }
.lens.low .rung.on { background: var(--bad); } .lens.mid .rung.on { background: var(--warn); }
.lens.close .rung.on { background: var(--butter); } .lens.ten .rung.on { background: var(--ok); }
.spark { display: block; }
.spark-ten { stroke: var(--line); stroke-dasharray: 3 3; }
.spark-line { fill: none; stroke: var(--ink-soft); stroke-width: 1.8; stroke-linejoin: round; }
.spark-area { fill: var(--butter-lt); }
.spark-dot { fill: var(--butter-dark); }
.lens-line { font-size: 14px; }
.lens-skeptic { font-size: 13px; color: var(--ink-soft); font-style: italic; }
.lens-gap { font-size: 14px; background: var(--butter-lt); border-radius: 10px; padding: 8px 10px; display: grid; gap: 2px; }
.label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
.plain { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.plain li { display: grid; gap: 2px; padding-bottom: 8px; border-bottom: 1px solid var(--line); font-size: 15px; }
.plain li:last-child { border-bottom: 0; padding-bottom: 0; }
.roundup { white-space: pre-line; color: var(--ink-soft); font-size: 15px; }
.table-wrap { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; }
.history { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; font-size: 14px; }
.history th, .history td { padding: 6px 10px; border-bottom: 1px solid var(--line); text-align: center; white-space: nowrap; }
.history th[scope="row"] { text-align: left; font-weight: 700; }
.history th[scope="col"] { font-size: 12px; color: var(--muted); font-weight: 600; }
.history td.low { color: var(--bad); font-weight: 800; } .history td.mid { color: var(--warn); font-weight: 800; } .history td.ten { color: var(--ok); font-weight: 900; }
.how { color: var(--ink-soft); font-size: 14px; display: grid; gap: 6px; }
.how code { font-family: var(--mono); font-size: 13px; }
</style>
<main class="wrap">
  <header class="head">
    <p class="eyebrow">Review board · ${fmtDate(on)}</p>
    <h1>Your week, simply</h1>
    <p class="summary">${esc(summary)}</p>
  </header>

  <section aria-labelledby="todo-h">
    <h2 id="todo-h">What you need to do${todo.length ? ` <span class="count">${todo.length}</span>` : ''}</h2>
    ${todo.length ? `<ul class="todos">${todo.map(todoRow).join('\n')}</ul>` : '<p class="clear">Nothing waiting on you.</p>'}
  </section>

  <section aria-labelledby="broken-h">
    <h2 id="broken-h">Not working, worth knowing</h2>
    ${broken.length ? `<ul class="alerts">${broken.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : '<p class="clear">Nothing is broken.</p>'}
  </section>

  ${fold('Everything else', run ? `${tens} of ${total} at ten · run ${fmtDate(run.date)}` : 'no run yet', `
    ${run?.one_thing ? `<div class="one"><p class="eyebrow">The one thing this week</p><p>${esc(run.one_thing)}</p></div>` : ''}
    ${fold('The twelve scores', `${tens} of ${total} at ten`, `<div class="grid">${LENSES.map(lensCard).join('\n')}</div>`)}
    ${fold("Claude's list", `${claude.length} open`, plainList([...claude].sort(byPri), t => whenText(t, on)))}
    ${snoozed.length ? fold('Your snoozed tasks', `${snoozed.length}`, plainList(snoozed, t => `back ${fmtDate(t.snooze_until)}`)) : ''}
    ${doneRecent.length ? fold('Done in the last fortnight', `${doneRecent.length}`, plainList(doneRecent, t => `done ${fmtDate(t.closed)}`)) : ''}
    ${run?.roundup ? fold('The round up', 'from the chief of staff', `<p class="roundup">${esc(run.roundup)}</p>`) : ''}
    ${fold('Every week so far', `${runs.length} run${runs.length === 1 ? '' : 's'}`, history)}
    <div class="how">
      <p>The board runs every Friday. Twelve lenses score the platform out of ten, a skeptic challenges any nine or ten, and the chief of staff turns the gaps into the tasks above.</p>
      <p>Done and Not yet copy a line for Claude. Paste it into any Claude session and your answer is recorded. Every session also asks you once a day.</p>
      ${run?.report ? `<p>Full report, with strengths, gaps and sources: <code>${esc(run.report)}</code></p>` : ''}
    </div>
  `)}
</main>
<script>
document.querySelectorAll('.todo .btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var row = btn.closest('.todo');
    var line = 'npm run review-board -- ' + btn.dataset.verb + ' ' + row.dataset.id;
    var note = row.querySelector('.copied');
    var show = function (copied) {
      note.hidden = false;
      note.innerHTML = '';
      note.append(copied ? 'Copied. Paste it into any Claude session: ' : 'Paste this into any Claude session: ');
      var c = document.createElement('code');
      c.textContent = line;
      note.append(c);
    };
    try {
      navigator.clipboard.writeText(line).then(function () { show(true); }, function () { show(false); });
    } catch (e) { show(false); }
  });
});
</script>
`
}

// ── real behaviour from the product pulse ───────────────────────────────────
//
// Task board-reads-real-numbers. The lenses score from code; this is the one
// line of what families actually did. The sums are lib/home/habit-metrics.ts
// and lib/home/value-signals.ts, loaded from the repo so the board and the
// admin product pulse (app/api/admin/product-pulse/route.ts) cannot disagree.
//
// Evidence or silence: any figure the source cannot give prints "unknown",
// never zero and never a guess. A pulse older than PULSE_MAX_AGE_DAYS is
// unknown too, because last month's number is not this week's behaviour.

const PULSE_MAX_AGE_DAYS = 2

const isNum = n => typeof n === 'number' && Number.isFinite(n)
const pct = n => (isNum(n) ? `${n}%` : 'unknown')
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`

/** One line from a computed pulse: { generatedAt, habit, valueSignals }. Never throws. */
export function pulseLine(pulse, on = today()) {
  const unknown = why => `Real behaviour: unknown (${why}).`
  if (!pulse || typeof pulse !== 'object') return unknown('the product pulse was not read this run')
  const at = typeof pulse.generatedAt === 'string' ? pulse.generatedAt.slice(0, 10) : null
  if (!isDate(at)) return unknown('the product pulse has no date')
  if (daysBetween(at, on) > PULSE_MAX_AGE_DAYS) return unknown(`the product pulse is from ${at}, too old to call this week's`)
  const h = pulse.habit && typeof pulse.habit === 'object' ? pulse.habit : {}
  const v = pulse.valueSignals && typeof pulse.valueSignals === 'object' ? pulse.valueSignals : null
  const doneNote = isNum(h.dayDoneFamilies7d) ? ` (${plural(h.dayDoneFamilies7d, 'family', 'families')} finished a day in the last seven)` : ''
  const second = v && isNum(v.secondCheckInFamilies) ? String(v.secondCheckInFamilies) : 'unknown'
  const three = v && isNum(v.reachedThree) && isNum(v.families)
    ? `${v.reachedThree} of ${plural(v.families, 'family', 'families')}`
    : 'unknown'
  return `Real behaviour, from the product pulse of ${at}: day done rate ${pct(h.dayDoneRate7d)}${doneNote}; seven day return ${pct(h.returnedD7)}; families with a second check in ${second}; families reaching three of the five value signals ${three}. ${firstWeekLine(pulse.firstWeek)} ${stageCheckLine(pulse.stageChecksWeek)}`
}

/**
 * First week, three felt: of the families whose first week ended in the last
 * fortnight, how many reach three of the five value signals. The value above
 * AI lens's ten row asks for the first week to make three of them felt, not
 * just present. Unknown when the rows did not carry it.
 */
export function firstWeekLine(v) {
  if (!v || typeof v !== 'object' || !isNum(v.families) || !isNum(v.reachedThree)) return 'First week, three felt: unknown.'
  if (v.families === 0) return 'First week, three felt: no family finished a first week in the last fortnight.'
  return `First week, three felt: ${v.reachedThree} of ${plural(v.families, 'family', 'families')} past their first week.`
}

/**
 * The marketing lens's weekly number: stage checks begun in seven days, per
 * channel of the /v/ link that brought them. Unknown when the rows did not
 * carry it (an older pulse file), never zero.
 */
export function stageCheckLine(rows) {
  if (!Array.isArray(rows)) return 'Stage checks begun in the last seven days, by channel: unknown.'
  const clean = rows.filter(r => r && typeof r.channel === 'string' && isNum(r.n) && r.n > 0)
  const total = clean.reduce((a, r) => a + r.n, 0)
  if (!total) return 'Stage checks begun in the last seven days, by channel: none through a link.'
  return `Stage checks begun in the last seven days, by channel: ${total} (${clean.map(r => `${r.channel} ${r.n}`).join(', ')}).`
}

/**
 * Turn the rows plans/review-board/product-pulse.sql returns into a computed
 * pulse, using the product's own functions. Returns null when the rows are
 * not usable or the functions cannot be loaded (Node before 22.18 cannot read
 * .ts), and the caller prints unknown.
 */
export async function pulseFromRows(rows) {
  if (!rows || typeof rows !== 'object') return null
  const arr = x => (Array.isArray(x) ? x : null)
  const sessions = arr(rows.sessions), families = arr(rows.families)
  const sig = rows.signals && typeof rows.signals === 'object' ? rows.signals : null
  if (!sessions || !families || !sig || !isDate(rows.today)) return null
  const names = ['memory', 'childLink', 'secondCheckIn', 'scriptVerdict', 'followUpAnswered']
  if (names.some(n => !arr(sig[n]))) return null
  try {
    const { habitMetrics } = await import(pathToFileURL(join(ROOT, 'lib/home/habit-metrics.ts')).href)
    const { valueSignals } = await import(pathToFileURL(join(ROOT, 'lib/home/value-signals.ts')).href)
    const signalRows = Object.fromEntries(names.map(n => [n, sig[n]]))
    const firstWeek = arr(rows.firstWeekFamilies)
    return {
      generatedAt: rows.generatedAt,
      stageChecksWeek: arr(rows.stageChecksWeek),
      // Null when the rows predate the field: unknown, never zero.
      firstWeek: firstWeek ? valueSignals({ families: firstWeek, ...signalRows }) : null,
      habit: habitMetrics(sessions, rows.today),
      valueSignals: valueSignals({ families, ...Object.fromEntries(names.map(n => [n, sig[n]])) }),
    }
  } catch {
    return null
  }
}

/** Read a json file, or null when it is missing or not json. */
function readJsonFile(file) {
  try { return JSON.parse(readFileSync(file, 'utf8')) } catch { return null }
}

/** The line for the report, from a rows file or a computed pulse file. */
export async function pulseLineFromFiles({ rows, file }) {
  if (rows) return pulseLine(await pulseFromRows(readJsonFile(rows)))
  if (file) return pulseLine(readJsonFile(file))
  return pulseLine(null)
}

// ── command line ─────────────────────────────────────────────────────────────

function flags(args) {
  const out = { _: [] }
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) out[args[i].slice(2)] = args[i + 1] ?? ''
    else { out._.push(args[i]); continue }
    i++
  }
  return out
}

function writeDashboard(state) {
  const p = paths()
  mkdirSync(p.dir, { recursive: true })
  writeFileSync(p.dashboard, renderDashboard(state))
  return relative(process.cwd(), p.dashboard)
}

function main(argv) {
  const [cmd, ...rest] = argv
  if (cmd === 'alerts') {
    // The hook must never break a session. Anything wrong prints one line.
    try {
      const out = alerts(loadState())
      if (out) console.log(out)
    } catch (err) {
      console.log(`REVIEW BOARD: could not read the board (${err.message}). Carry on with the session.`)
    }
    return 0
  }
  const state = loadState()
  if (cmd === 'ingest') {
    const file = rest[0]
    if (!file) throw new Error('ingest needs the run file: npm run review-board -- ingest <run.json>')
    const summary = ingest(state, JSON.parse(readFileSync(file, 'utf8')))
    saveState(state)
    clearAnswers()
    const run = JSON.parse(readFileSync(file, 'utf8'))
    const reportPath = join(paths().dir, 'runs', `${summary.date}.md`)
    mkdirSync(dirname(reportPath), { recursive: true })
    writeFileSync(reportPath, renderReport(run, state))
    state.board.runs.find(r => r.date === summary.date).report = relative(ROOT, reportPath)
    saveState({ board: state.board })
    const dash = writeDashboard(state)
    console.log(`ingested run ${summary.date}: ${summary.lenses} lenses, ${summary.added} new tasks, ${summary.updated} carried forward, ${summary.closed} closed`)
    if (summary.lowered.length) console.log(`the skeptic lowered: ${summary.lowered.join('; ')}`)
    console.log(`dashboard: ${dash}`)
    console.log(`report: ${relative(process.cwd(), reportPath)}`)
    return 0
  }
  if (['done', 'notyet', 'snooze', 'drop'].includes(cmd)) {
    const [id, ...more] = rest
    if (!id) throw new Error(`${cmd} needs a task id`)
    const { task: t, file } = recordAnswer(state, cmd, id, more.join(' ') || undefined)
    console.log(`${t.id}: ${t.status}${t.snooze_until && t.status === 'open' ? `, snoozed to ${t.snooze_until}` : ''}`)
    console.log(`recorded in ${relative(process.cwd(), file)}; commit it with this session's work`)
    return 0
  }
  if (cmd === 'add') {
    const f = flags(rest)
    const t = addTask(state, { owner: f.owner, title: f.title, due: f.due, priority: f.priority, size: f.size })
    saveState(state)
    writeDashboard(state)
    console.log(`added ${t.id} for ${t.owner}, due ${t.due}`)
    return 0
  }
  if (cmd === 'list') {
    const all = rest.includes('--all')
    const on = today()
    const items = state.tasks.tasks.filter(t => all || t.status === 'open')
    if (!items.length) { console.log('no tasks'); return 0 }
    for (const t of items.sort((a, b) => a.owner.localeCompare(b.owner) || a.priority - b.priority)) {
      const late = t.status === 'open' && t.due < on ? ' LATE' : ''
      console.log(`${t.owner.padEnd(7)} P${t.priority} ${t.status.padEnd(7)} ${t.due}${late}  ${t.id}  ${t.title}`)
    }
    return 0
  }
  if (cmd === 'pulse') {
    const f = flags(rest)
    return pulseLineFromFiles({ rows: f.rows, file: f.file }).then(line => { console.log(line); return 0 })
  }
  if (cmd === 'dashboard') {
    console.log(`dashboard: ${writeDashboard(state)}`)
    return 0
  }
  if (cmd === 'set-url') {
    state.board.dashboard_url = rest[0] || null
    saveState({ board: state.board })
    console.log(`dashboard url: ${state.board.dashboard_url}`)
    return 0
  }
  console.log('usage: npm run review-board -- alerts | ingest <run.json> | done|notyet|drop <id> [note] | snooze <id> <days> | add --owner justin --title "..." | list [--all] | pulse --rows <rows.json> | pulse --file <pulse.json> | dashboard | set-url <url>')
  return cmd ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = await main(process.argv.slice(2))
  } catch (err) {
    console.error(err.message)
    process.exitCode = 1
  }
}
