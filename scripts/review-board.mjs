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
//              prints more than a dozen lines, because every session pays for
//              it on every turn. Each task is asked about at most once a day,
//              so five sessions in a day do not nag five times.
//   ingest     takes one weekly run (the ten lens scorecards, the skeptic's
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
  { id: 'business-running', n: 11, name: 'Business running', question: 'Is everything moving, and is nothing stuck?' },
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

// ── the session start alert ──────────────────────────────────────────────────

/**
 * The text the SessionStart hook adds to every session. Short on purpose: it
 * is paid for on every turn. Green and quiet when there is nothing to ask.
 */
export function alerts(state) {
  const on = today()
  const run = lastRun(state.board)
  const open = state.tasks.tasks.filter(t => isWaiting(t, on))
  const justin = open.filter(t => t.owner === 'justin')
  const overdue = justin.filter(t => t.due < on)
  const toAsk = justin
    .filter(t => t.asked !== on)
    .sort((a, b) => (a.due < on) === (b.due < on) ? (a.priority - b.priority) || a.due.localeCompare(b.due) : (a.due < on ? -1 : 1))
    .slice(0, MAX_ASK)
  const claude = open.filter(t => t.owner === 'claude')
  const claudeLate = claude.filter(t => t.due < on)

  const lines = []
  if (!run) {
    lines.push('REVIEW BOARD: AMBER. The weekly board has not run yet. Run it with the review-board skill when Justin asks, or wait for the Friday routine.')
    return lines.join('\n')
  }
  const age = daysBetween(run.date, on)
  const tens = Object.values(run.scores).filter(s => s === 10).length
  const total = Object.keys(run.scores).length
  const lowest = Object.entries(run.scores).sort((a, b) => a[1] - b[1]).slice(0, 2)
    .map(([id, s]) => `${LENSES.find(l => l.id === id)?.name ?? id} ${s}`).join(', ')

  const red = overdue.length > 0
  const amber = age > STALE_AFTER_DAYS || claudeLate.length > 0
  const state_ = red ? 'RED' : amber ? 'AMBER' : 'GREEN'

  if (!toAsk.length && !red && !amber) {
    lines.push(`REVIEW BOARD: GREEN. ${tens} of ${total} lenses at ten (run ${run.date}). Nothing to ask Justin today.`)
    return lines.join('\n')
  }

  lines.push(`REVIEW BOARD: ${state_}. ${tens} of ${total} lenses at ten, lowest ${lowest} (run ${run.date}, ${age} days ago).`)
  if (red) lines.push(`RED: ${overdue.length} of Justin's tasks are past due.`)
  if (age > STALE_AFTER_DAYS) lines.push(`AMBER: the board has not run for ${age} days. The weekly routine may have failed; say so to Justin.`)
  if (claudeLate.length) lines.push(`AMBER: ${claudeLate.length} of Claude's own tasks are past due (npm run review-board -- list).`)
  if (toAsk.length) {
    lines.push(`Before starting on Justin's request, ask him with AskUserQuestion, one question per task, options Done, Not yet, Snooze a week, Drop it:`)
    for (const t of toAsk) {
      const late = t.due < on ? `, ${daysBetween(t.due, on)} days late` : `, due ${t.due}`
      lines.push(`  [${t.id}] ${t.title}${late}`)
    }
    lines.push('Record each answer: npm run review-board -- done|notyet|drop <id> [note], or snooze <id> 7. Commit the files it writes in plans/review-board/answers with this session\'s work, so later sessions see them. Then do what he asked.')
    lines.push('A scheduled routine with nobody to answer skips the questions.')
  }
  if (state.board.dashboard_url) lines.push(`Dashboard: ${state.board.dashboard_url}`)
  return lines.join('\n')
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
  const open = state.tasks.tasks.filter(t => t.status === 'open')
  const justin = open.filter(t => t.owner === 'justin')
  const claude = open.filter(t => t.owner === 'claude')
  const overdueJ = justin.filter(t => isWaiting(t, on) && t.due < on)
  const doneRecent = state.tasks.tasks.filter(t => t.status === 'done' && t.closed && daysBetween(t.closed, on) <= 14)

  const tens = run ? Object.values(run.scores).filter(s => s === 10).length : 0
  const total = run ? Object.keys(run.scores).length : LENSES.length
  const age = run ? daysBetween(run.date, on) : null
  const health = !run ? 'amber' : overdueJ.length ? 'red' : age > STALE_AFTER_DAYS ? 'amber' : 'green'
  const healthWord = { red: 'Needs you', amber: 'Check', green: 'All clear' }[health]
  const healthLine = !run
    ? 'The board has not run yet.'
    : overdueJ.length
      ? `${overdueJ.length} of your tasks ${overdueJ.length === 1 ? 'is' : 'are'} past due.`
      : age > STALE_AFTER_DAYS
        ? `The last run was ${age} days ago. The Friday routine may have missed.`
        : justin.length
          ? `${justin.length} task${justin.length === 1 ? '' : 's'} waiting on you, none late.`
          : 'Nothing is waiting on you.'

  const heldTen = id => runs.length >= 2 && runs.slice(-2).every(r => r.scores[id] === 10)

  const cards = LENSES.map(l => {
    const score = run?.scores[l.id]
    const has = Number.isInteger(score)
    const before = prev?.scores[l.id]
    const delta = has && Number.isInteger(before) ? score - before : null
    const chip = delta === null ? '<span class="chip">first score</span>'
      : delta > 0 ? `<span class="chip up">up ${delta}</span>`
        : delta < 0 ? `<span class="chip down">down ${-delta}</span>`
          : '<span class="chip">no change</span>'
    const history = runs.map(r => r.scores[l.id]).filter(Number.isInteger)
    const sk = run?.skeptic?.[l.id]
    return `<article class="lens ${has ? band(score) : 'none'}" id="lens-${l.id}">
  <header class="lens-head"><span class="lens-n">${String(l.n).padStart(2, '0')}</span><h3>${esc(l.name)}</h3>${heldTen(l.id) ? '<span class="chip ten">held ten</span>' : ''}</header>
  <p class="lens-q">${esc(l.question)}</p>
  <div class="lens-score"><span class="big">${has ? score : '?'}</span><span class="of">out of 10</span>${has ? chip : ''}</div>
  ${has ? ladder(score) : ''}
  ${history.length ? spark(history) : ''}
  ${run?.headlines[l.id] ? `<p class="lens-line">${esc(run.headlines[l.id])}</p>` : ''}
  ${sk ? `<p class="lens-skeptic">The skeptic took it from ${sk.from} to ${score}: ${esc(sk.reason)}</p>` : ''}
  ${run?.top_gap[l.id] ? `<p class="lens-gap"><span class="label">To reach ten</span>${esc(run.top_gap[l.id])}</p>` : ''}
</article>`
  }).join('\n')

  const taskRow = t => {
    const late = t.due < on && isWaiting(t, on)
    const snoozed = t.snooze_until && t.snooze_until > on
    const when = snoozed ? `snoozed to ${fmtDate(t.snooze_until)}` : late ? `${daysBetween(t.due, on)} days late` : `due ${fmtDate(t.due)}`
    return `<li class="task${late ? ' late' : ''}${snoozed ? ' snoozed' : ''}">
  <span class="pri p${t.priority}">P${t.priority}</span>
  <div class="task-body"><p class="task-title">${esc(t.title)}</p>
  <p class="task-meta"><span class="mono">${esc(t.id)}</span> · ${esc(t.size)} · ${when}${t.lenses?.length ? ' · ' + t.lenses.map(id => esc(LENSES.find(l => l.id === id)?.name ?? id)).join(', ') : ''}</p></div>
</li>`
  }
  const byPri = (a, b) => a.priority - b.priority || a.due.localeCompare(b.due)
  const list = (items, empty) => items.length
    ? `<ul class="tasks">${[...items].sort(byPri).map(taskRow).join('\n')}</ul>`
    : `<p class="empty">${empty}</p>`

  const history = runs.length
    ? `<div class="table-wrap"><table class="history"><thead><tr><th scope="col">Lens</th>${runs.map(r => `<th scope="col">${fmtDate(r.date)}</th>`).join('')}</tr></thead><tbody>${LENSES.map(l => `<tr><th scope="row">${esc(l.name)}</th>${runs.map(r => {
      const s = r.scores[l.id]
      return `<td class="${Number.isInteger(s) ? band(s) : ''}">${Number.isInteger(s) ? s : ''}</td>`
    }).join('')}</tr>`).join('')}</tbody></table></div>`
    : '<p class="empty">The first run fills this in.</p>'

  return `<title>Review Board</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Nunito:wght@400;600;700;800;900&display=swap">
<style>
/* Layout: a school report pinned to the fridge. Health first, then the one thing,
   then eleven subjects each with its ten rung ladder, then who owes what. */
:root {
  --bg: #F1EFEA; --card: #FFFFFF; --ink: #1A1A2E; --ink-soft: #52526A; --muted: #65657C;
  --line: #EAEAF0; --butter: #EDC35F; --butter-dark: #C99A28; --butter-lt: #FEF7E0;
  --ok: #2F8F6B; --ok-lt: #E6F4EE; --warn: #B7791F; --warn-lt: #FDF3DD; --bad: #C94F3D; --bad-lt: #FBECE9;
  --rung-off: #E7E3D8;
  --display: 'Nunito', ui-rounded, 'Segoe UI', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #1B1812; --card: #26221A; --ink: #F4F1E8; --ink-soft: #CFC9B8; --muted: #ABA591;
  --line: #3A3428; --butter: #EDC35F; --butter-dark: #C99A28; --butter-lt: #3A3018;
  --ok: #5CC49B; --ok-lt: #1D3229; --warn: #E6B45A; --warn-lt: #3A2F17; --bad: #EE8A78; --bad-lt: #3D221D;
  --rung-off: #3A3428; color-scheme: dark; } }
:root[data-theme="dark"] {
  --bg: #1B1812; --card: #26221A; --ink: #F4F1E8; --ink-soft: #CFC9B8; --muted: #ABA591;
  --line: #3A3428; --butter: #EDC35F; --butter-dark: #C99A28; --butter-lt: #3A3018;
  --ok: #5CC49B; --ok-lt: #1D3229; --warn: #E6B45A; --warn-lt: #3A2F17; --bad: #EE8A78; --bad-lt: #3D221D;
  --rung-off: #3A3428; color-scheme: dark; }
body { background: var(--bg); color: var(--ink); font-family: var(--display); font-size: 16px; line-height: 1.5; }
.wrap { max-width: 1120px; margin: 0 auto; padding-inline: 16px; padding-block: 28px 56px; display: grid; gap: 28px; }
h1, h2, h3 { margin: 0; text-wrap: balance; }
p { margin: 0; }
.eyebrow, .label, .chip, .lens-n, .pri, .mono, .history th[scope="col"] { font-family: var(--mono); letter-spacing: .04em; }
.eyebrow { font-size: 12px; text-transform: uppercase; color: var(--muted); }
.top { display: grid; gap: 16px; grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); align-items: stretch; }
.title h1 { font-size: clamp(30px, 5vw, 44px); font-weight: 900; line-height: 1.05; }
.title p { color: var(--ink-soft); margin-top: 8px; max-width: 60ch; }
.tally { font-variant-numeric: tabular-nums; margin-top: 16px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
.tally .big { font-size: 56px; font-weight: 900; line-height: 1; }
.tally .of { color: var(--ink-soft); font-weight: 700; }
.health { border-radius: 16px; padding: 18px 20px; display: grid; gap: 6px; align-content: center; border: 2px solid; }
.health.green { background: var(--ok-lt); border-color: var(--ok); }
.health.amber { background: var(--warn-lt); border-color: var(--warn); }
.health.red { background: var(--bad-lt); border-color: var(--bad); }
.health .state { font-weight: 900; font-size: 22px; display: flex; align-items: center; gap: 10px; }
.dot { width: 14px; height: 14px; border-radius: 50%; display: inline-block; }
.green .dot { background: var(--ok); } .amber .dot { background: var(--warn); } .red .dot { background: var(--bad); }
.health p { color: var(--ink-soft); }
.one { background: var(--butter); color: #1A1A2E; border-radius: 16px; padding: 18px 20px; box-shadow: 0 5px 0 var(--butter-dark); display: grid; gap: 4px; }
.one .eyebrow { color: #52422A; }
.one p.text { font-size: 20px; font-weight: 800; }
section > h2 { font-size: 24px; font-weight: 900; margin-bottom: 12px; }
section > .sub { color: var(--ink-soft); margin: -6px 0 14px; }
.grid { display: grid; gap: 14px; grid-template-columns: repeat(auto-fill, minmax(min(100%, 250px), 1fr)); }
.lens { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px; display: grid; gap: 10px; align-content: start; min-width: 0; }
.lens.ten { border-color: var(--ok); }
.lens-head { display: flex; align-items: center; gap: 8px; }
.lens-head h3 { font-size: 17px; font-weight: 800; flex: 1; }
.lens-n { font-size: 12px; color: var(--muted); }
.lens-q { color: var(--muted); font-size: 14px; }
.lens-score { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; font-variant-numeric: tabular-nums; }
.lens-score .big { font-size: 40px; font-weight: 900; line-height: 1; }
.lens.low .big { color: var(--bad); } .lens.mid .big { color: var(--warn); } .lens.close .big { color: var(--ink); } .lens.ten .big { color: var(--ok); }
.lens-score .of { color: var(--muted); font-size: 13px; font-weight: 700; }
.chip { font-size: 11px; padding: 3px 8px; border-radius: 999px; background: var(--bg); color: var(--ink-soft); white-space: nowrap; }
.chip.up, .chip.ten { background: var(--ok-lt); color: var(--ok); }
.chip.down { background: var(--bad-lt); color: var(--bad); }
.ladder { display: grid; grid-template-columns: repeat(10, 1fr); gap: 3px; }
.rung { height: 8px; border-radius: 3px; background: var(--rung-off); }
.lens.low .rung.on { background: var(--bad); } .lens.mid .rung.on { background: var(--warn); }
.lens.close .rung.on { background: var(--butter); } .lens.ten .rung.on { background: var(--ok); }
.spark { display: block; }
.spark-ten { stroke: var(--line); stroke-dasharray: 3 3; }
.spark-line { fill: none; stroke: var(--ink-soft); stroke-width: 1.8; stroke-linejoin: round; }
.spark-area { fill: var(--butter-lt); }
.spark-dot { fill: var(--butter-dark); }
.lens-line { font-size: 15px; }
.lens-skeptic { font-size: 13px; color: var(--ink-soft); font-style: italic; }
.lens-gap { font-size: 14px; background: var(--butter-lt); border-radius: 10px; padding: 8px 10px; display: grid; gap: 2px; }
.label { font-size: 11px; text-transform: uppercase; color: var(--muted); }
.two { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr)); }
.panel { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 16px; min-width: 0; }
.panel h2 { font-size: 20px; font-weight: 900; margin-bottom: 4px; }
.panel .sub { color: var(--muted); font-size: 14px; margin-bottom: 12px; }
.tasks { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.task { display: flex; gap: 10px; align-items: flex-start; padding: 10px; border-radius: 12px; background: var(--bg); }
.task.late { background: var(--bad-lt); }
.task.snoozed { opacity: .7; }
.task-body { min-width: 0; }
.task-title { font-weight: 700; }
.task-meta { font-size: 13px; color: var(--muted); overflow-wrap: anywhere; }
.task.late .task-meta { color: var(--bad); }
.mono { font-size: 12px; }
.pri { font-size: 11px; font-weight: 600; padding: 3px 7px; border-radius: 8px; background: var(--line); color: var(--ink-soft); flex: none; }
.pri.p1 { background: var(--butter); color: #1A1A2E; }
.empty { color: var(--muted); }
.roundup p { max-width: 68ch; white-space: pre-line; }
.table-wrap { overflow-x: auto; background: var(--card); border: 1px solid var(--line); border-radius: 16px; }
.history { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; font-size: 14px; }
.history th, .history td { padding: 8px 12px; border-bottom: 1px solid var(--line); text-align: center; white-space: nowrap; }
.history th[scope="row"] { text-align: left; font-weight: 700; }
.history th[scope="col"] { font-size: 12px; color: var(--muted); font-weight: 600; }
.history td.low { color: var(--bad); font-weight: 800; } .history td.mid { color: var(--warn); font-weight: 800; }
.history td.ten { color: var(--ok); font-weight: 900; }
.how { color: var(--ink-soft); font-size: 14px; display: grid; gap: 6px; }
.how code { font-family: var(--mono); font-size: 13px; background: var(--card); padding: 1px 6px; border-radius: 6px; border: 1px solid var(--line); }
@media (max-width: 720px) { .top { grid-template-columns: minmax(0, 1fr); } .tally .big { font-size: 44px; } }
</style>
<main class="wrap">
  <div class="top">
    <div class="title">
      <p class="eyebrow">Guided Childhood · weekly review board${run ? ` · run ${fmtDate(run.date)}` : ''}</p>
      <h1>Review Board</h1>
      <p>Eleven lenses score the platform out of ten every week. A lens is finished when it holds ten for two weeks running, and any ten has to survive the skeptic first.</p>
      <div class="tally"><span class="big">${tens}</span><span class="of">of ${total} lenses at ten</span></div>
    </div>
    <div class="health ${health}">
      <p class="eyebrow">Today, ${fmtDate(on)}</p>
      <p class="state"><span class="dot"></span>${healthWord}</p>
      <p>${esc(healthLine)}</p>
      ${claude.length ? `<p>${claude.length} task${claude.length === 1 ? '' : 's'} on Claude's list.</p>` : ''}
    </div>
  </div>
  ${run?.one_thing ? `<div class="one"><p class="eyebrow">The one thing this week</p><p class="text">${esc(run.one_thing)}</p></div>` : ''}
  <section>
    <h2>The eleven lenses</h2>
    <div class="grid">
${cards}
    </div>
  </section>
  <div class="two">
    <div class="panel"><h2>Waiting on you</h2><p class="sub">Only you can do these. Every Claude session asks about them once a day.</p>${list(justin, 'Nothing is waiting on you.')}</div>
    <div class="panel"><h2>Claude's list</h2><p class="sub">Any session can pick these up, one at a time, when your request leaves room.</p>${list(claude, 'Nothing on Claude\'s list.')}</div>
  </div>
  ${doneRecent.length ? `<div class="panel"><h2>Done in the last fortnight</h2><ul class="tasks">${doneRecent.map(t => `<li class="task"><span class="pri">done</span><div class="task-body"><p class="task-title">${esc(t.title)}</p><p class="task-meta">${fmtDate(t.closed)}${t.note ? ' · ' + esc(t.note) : ''}</p></div></li>`).join('')}</ul></div>` : ''}
  ${run?.roundup ? `<section class="roundup"><h2>The round up</h2><div class="panel"><p>${esc(run.roundup)}</p></div></section>` : ''}
  <section><h2>Every week so far</h2>${history}</section>
  <section class="how"><h2>How this works</h2>
    <p>The board runs every Friday morning. Ten lens agents score the platform, the skeptic challenges any nine or ten, and the chief of staff turns the gaps into the two lists above.</p>
    <p>At the start of every Claude session you are asked about anything waiting on you, at most once a day per task. Your answers are recorded and this page is redrawn.</p>
    ${run?.report ? `<p>Full report for this run: <code>${esc(run.report)}</code></p>` : ''}
  </section>
</main>
`
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
    const dash = writeDashboard(state)
    console.log(`ingested run ${summary.date}: ${summary.lenses} lenses, ${summary.added} new tasks, ${summary.updated} carried forward, ${summary.closed} closed`)
    if (summary.lowered.length) console.log(`the skeptic lowered: ${summary.lowered.join('; ')}`)
    console.log(`dashboard: ${dash}`)
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
  console.log('usage: npm run review-board -- alerts | ingest <run.json> | done|notyet|drop <id> [note] | snooze <id> <days> | add --owner justin --title "..." | list [--all] | dashboard | set-url <url>')
  return cmd ? 1 : 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main(process.argv.slice(2))
  } catch (err) {
    console.error(err.message)
    process.exitCode = 1
  }
}
