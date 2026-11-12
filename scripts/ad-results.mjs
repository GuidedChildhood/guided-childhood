#!/usr/bin/env node
// THE WEEKLY RESULTS READ: WHAT EACH ADVERT DID, JUDGED ON ONE NUMBER.
//
// Step 3 of plans/2026-11-11-ad-system-plan.md, and the "read the numbers"
// half of the weekly loop (.claude/skills/ad-studio, Phase 7). Both talks
// Justin brought (12 November 2026) end on the same loop: make, test, read,
// keep the winner, vary it, again. Until this file the loop had no read.
//
// TWO SOURCES, KEPT APART ON PURPOSE.
//   Meta says who saw it: reach, impressions, link clicks, spend, frequency.
//     Read once per advert per run, from the ids in the uploader's receipt
//     (content/ads/meta/<round>.json). Five or so calls a week. The talk's
//     warning stands: agents get ad accounts banned by hammering the API.
//   Our tables say what they did: opens, stage checks begun, signups, paying,
//     per link code (migrations 372, 379, 388). That read is SQL, run with the
//     Supabase connector, because this laptop holds no database key. The
//     query is in the skill, and its result is passed in with --counts.
//
// THE VERDICT is the rule in content/ads/results-log.md: the most stage checks
// begun per thousand people reached, with at least 300 reached; below that it
// is too early. Once money is spent, the cost of one stage check begun too.
// Never likes, never views.
//
//   npm run ad-results -- <round>                       Meta numbers only
//   npm run ad-results -- <round> --counts <file.json>  joined with our counts
//   npm run ad-results -- --self-test
//
// Writes content/ads/results/<round>.json and prints the table. Changes
// nothing on Meta: every call is a read.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const GRAPH = 'https://graph.facebook.com'
const MIN_REACH = 300

// One advert's row from the two sources. Pure, so the self test can drive it.
export function judge(rows) {
  const out = rows.map((r) => {
    const reach = Number(r.reach || 0)
    const started = Number(r.started || 0)
    const spend = Number(r.spend || 0)
    return {
      ...r,
      per_thousand: reach ? Math.round((started / reach) * 1000 * 10) / 10 : 0,
      cost_per_check: started && spend ? Math.round((spend / started) * 100) / 100 : null,
      enough: reach >= MIN_REACH,
    }
  })
  const ready = out.filter((r) => r.enough)
  const best = ready.length ? Math.max(...ready.map((r) => r.per_thousand)) : null
  for (const r of out) {
    r.verdict = !r.enough ? 'too early' : r.per_thousand === best && best > 0 ? 'winner' : 'loser'
  }
  return out
}

async function metaInsights(receipt, env) {
  const version = env.META_API_VERSION || 'v27.0'
  const rows = []
  for (const [key, id] of Object.entries(receipt)) {
    if (!key.startsWith('ad:')) continue
    const q = new URLSearchParams({
      fields: 'reach,impressions,inline_link_clicks,spend,frequency',
      date_preset: 'maximum',
      access_token: env.META_ACCESS_TOKEN,
    })
    const res = await fetch(`${GRAPH}/${version}/${id}/insights?${q}`)
    const json = await res.json()
    if (json.error) throw new Error(`${key}: Meta said no. ${json.error.message}`)
    const d = json.data?.[0] || {}
    rows.push({
      code: key.slice(3), ad_id: id,
      reach: Number(d.reach || 0), impressions: Number(d.impressions || 0),
      link_clicks: Number(d.inline_link_clicks || 0), spend: Number(d.spend || 0),
      frequency: Number(d.frequency || 0),
    })
    await new Promise((r) => setTimeout(r, 1000))
  }
  return rows
}

function readEnv() {
  const env = { ...process.env }
  const file = join(ROOT, '.env.local')
  if (existsSync(file)) {
    for (const line of readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^(META_[A-Z_]+)=(.*)$/)
      if (m && !env[m[1]]) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '')
    }
  }
  return env
}

function print(rows) {
  const head = ['code', 'reach', 'clicks', 'spend £', 'opened', 'started', 'signups', 'per 1,000', '£ per check', 'verdict']
  console.log(head.join(' | '))
  for (const r of rows) {
    console.log([r.code, r.reach, r.link_clicks ?? '', r.spend?.toFixed?.(2) ?? '', r.opened ?? '', r.started ?? '', r.signups ?? '', r.per_thousand, r.cost_per_check ?? '', r.verdict].join(' | '))
  }
}

function selfTest() {
  const rows = judge([
    { code: 'a', reach: 1200, started: 18, spend: 12 },
    { code: 'b', reach: 900, started: 4, spend: 9 },
    { code: 'c', reach: 120, started: 3, spend: 1 },
    { code: 'd', reach: 0, started: 0 },
  ])
  const by = Object.fromEntries(rows.map((r) => [r.code, r]))
  const fail = (m) => { console.error(`self test: ${m}`); process.exit(1) }
  if (by.a.verdict !== 'winner') fail('the best per thousand over 300 reached is not the winner')
  if (by.b.verdict !== 'loser') fail('a weaker card over 300 reached is not a loser')
  if (by.c.verdict !== 'too early') fail('a card under 300 reached is judged anyway')
  if (by.d.per_thousand !== 0 || by.d.verdict !== 'too early') fail('a card with no reach is not too early')
  if (by.a.per_thousand !== 15 || by.a.cost_per_check !== 0.67) fail(`the sums are wrong: ${by.a.per_thousand}, ${by.a.cost_per_check}`)
  const self = readFileSync(fileURLToPath(import.meta.url), 'utf8')
  if (/method:\s*['"]POST/.test(self)) fail('this file writes to Meta; it must only read')
  console.log('ad results self test: winner, loser and too early judged by the results log rule, sums right, reads only')
}

const args = process.argv.slice(2)
if (args.includes('--self-test')) { selfTest(); process.exit(0) }

const round = args.find((a) => !a.startsWith('--'))
const countsAt = args.indexOf('--counts')
if (!round) { console.error('usage: npm run ad-results -- <round> [--counts file.json]'); process.exit(1) }

try {
  const receiptPath = join(ROOT, 'content/ads/meta', `${round}.json`)
  const env = readEnv()
  let rows = []
  if (existsSync(receiptPath) && env.META_ACCESS_TOKEN) {
    rows = await metaInsights(JSON.parse(readFileSync(receiptPath, 'utf8')), env)
  } else {
    console.log(existsSync(receiptPath) ? 'No META_ACCESS_TOKEN, so no Meta numbers.' : `Nothing uploaded for ${round} yet, so no Meta numbers; organic reach comes from the post insights.`)
  }
  if (countsAt > -1) {
    const counts = JSON.parse(readFileSync(resolve(args[countsAt + 1]), 'utf8'))
    for (const c of counts) {
      const row = rows.find((r) => r.code === c.code) || (rows[rows.length] = { code: c.code })
      Object.assign(row, { opened: Number(c.opened || 0), started: Number(c.started || 0), signups: Number(c.signups || 0), paying: Number(c.paying || 0) }, c.reach != null && !row.reach ? { reach: Number(c.reach) } : {})
    }
  }
  const judged = judge(rows)
  const out = join(ROOT, 'content/ads/results', `${round}.json`)
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, JSON.stringify({ round, read: new Date().toISOString().slice(0, 10), rows: judged }, null, 2) + '\n')
  print(judged)
  console.log(`\nSaved to content/ads/results/${round}.json`)
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
