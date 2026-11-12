#!/usr/bin/env node
// LOADS AN AD ROUND INTO FACEBOOK AND INSTAGRAM ADS, SWITCHED OFF.
//
// Justin, 11 November 2026: the system should do the uploading too, as Cody
// Schneider's talk describes (plans/2026-11-11-ad-system-plan.md, step 8,
// brought forward). Until today the ad studio rule was that nothing here
// touches Ads Manager. This is the one exception, and it is fenced:
//
//   EVERYTHING IS CREATED PAUSED. The campaign, the ad set and every ad. A
//   paused ad set with a budget spends nothing. Switching it on, and so
//   spending money, is Justin's hand in Ads Manager and nobody else's. This
//   script has no code path that sets ACTIVE, and the self test fails if one
//   appears.
//
//   WRITES ONLY, AND FEW. The talk's own warning: agents get ad accounts
//   banned by hammering the API. A round is about twenty calls, one at a time,
//   a second apart. It never reads results from Meta. What an ad did is read
//   from our own tables (opens, stage checks begun, signups per link code).
//
//   THE GATE FIRST. It refuses a deck that does not pass `npm run ad-gate`,
//   and it sends only what is in the deck: the rendered card, the words in
//   `ad`, and the card's own link. It invents nothing.
//
//   DRY BY DEFAULT. Without --go it prints every call it would make and
//   sends none. The first real run should follow a dry run Justin has read.
//
//   ONCE. Every id that comes back is written to content/ads/meta/<round>.json
//   as it arrives, so a second run picks up where the first stopped and never
//   makes a second copy.
//
//   npm run ad-upload -- <round>            dry run, prints the calls
//   npm run ad-upload -- <round> --go       sends them, everything paused
//   npm run ad-upload -- --self-test        the whole run against a stand in
//
// The keys live in .env.local and Vercel only (content/ads/SETUP.md says which
// and how to make them). Never in chat, never in the repo.
//
// NOT YET RUN AGAINST THE LIVE API. There was no token on 11 November 2026, so
// the calls are written from Meta's Marketing API reference and proved only
// against the stand in. The first --go may need a field adjusting; the receipt
// means that costs nothing but a second run.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://www.guidedchildhood.com' // lib/config/site.ts SITE_URL
const GRAPH = 'https://graph.facebook.com'
const PAUSED = 'PAUSED'

const plain = (html) => String(html ?? '').replace(/<[^>]+>/g, '').replace(/&rarr;/g, '').replace(/\s+/g, ' ').trim()

// The card's own link, with the UTMs the source link route keeps (shared/utm.ts,
// migration 388). medium is paid, so the same card's organic post and its
// advert are counted apart on the same code.
export function linkFor(round, card) {
  const q = new URLSearchParams({ utm_source: 'facebook', utm_medium: 'paid', utm_campaign: round, utm_content: card.name })
  return `${SITE}/v/${card.src}?${q}`
}

// Every call a round makes, in order. `needs` names an id from an earlier
// call; the runner fills it in from the receipt.
export function plan(deck, config, env) {
  const act = `act_${String(env.META_AD_ACCOUNT_ID).replace(/^act_/, '')}`
  const round = deck.round
  const ends = new Date(Date.now() + config.days * 86400000).toISOString()
  const calls = [
    {
      key: 'campaign', path: `${act}/campaigns`,
      body: {
        name: `GC ${round}`, objective: 'OUTCOME_TRAFFIC', status: PAUSED,
        special_ad_categories: [], is_adset_budget_sharing_enabled: false,
      },
    },
    {
      key: 'adset', path: `${act}/adsets`, needs: { campaign_id: 'campaign' },
      body: {
        name: `GC ${round} · ${config.audienceName}`, status: PAUSED,
        daily_budget: config.dailyBudgetPence, end_time: ends,
        billing_event: 'IMPRESSIONS', optimization_goal: 'LINK_CLICKS',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP', targeting: config.targeting,
      },
    },
  ]
  for (const card of deck.cards) {
    const link = linkFor(round, card)
    const story = {
      page_id: env.META_PAGE_ID,
      link_data: {
        link, message: card.ad.text, name: plain(card.ad.headline), description: plain(card.ad.description),
        call_to_action: { type: 'LEARN_MORE', value: { link } },
      },
    }
    if (env.META_INSTAGRAM_ID) story.instagram_user_id = env.META_INSTAGRAM_ID
    calls.push(
      { key: `image:${card.src}`, path: `${act}/adimages`, image: card.file, take: 'hash' },
      {
        key: `creative:${card.src}`, path: `${act}/adcreatives`, needs: { 'object_story_spec.link_data.image_hash': `image:${card.src}` },
        body: { name: `${round} · ${card.name}`, object_story_spec: story },
      },
      {
        key: `ad:${card.src}`, path: `${act}/ads`, needs: { adset_id: 'adset', 'creative.creative_id': `creative:${card.src}` },
        body: { name: `${round} · ${card.name}`, status: PAUSED, creative: {} },
      },
    )
  }
  return calls
}

function setPath(obj, path, value) {
  const keys = path.split('.')
  let o = obj
  for (const k of keys.slice(0, -1)) o = o[k] ??= {}
  o[keys.at(-1)] = value
}

// Runs the plan. `send` is the network; `receipt` is what has already been made.
export async function run(calls, { send, receipt, save, wait = 1000, log = console.log }) {
  for (const call of calls) {
    if (receipt[call.key]) { log(`  have   ${call.key}  ${receipt[call.key]}`); continue }
    const body = structuredClone(call.body || {})
    for (const [path, from] of Object.entries(call.needs || {})) {
      if (!receipt[from]) throw new Error(`${call.key} needs ${from}, which has not been made`)
      setPath(body, path, receipt[from])
    }
    const res = await send(call, body)
    const id = call.take === 'hash' ? Object.values(res.images || {})[0]?.hash : res.id
    if (!id) throw new Error(`${call.key}: Meta sent no id back: ${JSON.stringify(res).slice(0, 300)}`)
    receipt[call.key] = id
    save(receipt)
    log(`  made   ${call.key}  ${id}`)
    if (wait) await new Promise((r) => setTimeout(r, wait))
  }
  return receipt
}

function liveSend(env) {
  const version = env.META_API_VERSION || 'v27.0'
  return async (call, body) => {
    const form = new FormData()
    form.set('access_token', env.META_ACCESS_TOKEN)
    if (call.image) form.set('bytes', readFileSync(call.image).toString('base64'))
    for (const [k, v] of Object.entries(body)) form.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v))
    const res = await fetch(`${GRAPH}/${version}/${call.path}`, { method: 'POST', body: form })
    const json = await res.json()
    if (!res.ok || json.error) {
      const e = json.error || {}
      throw new Error(`${call.key}: Meta said no (${res.status}). ${e.message || ''} ${e.error_user_msg || ''}`.trim())
    }
    return json
  }
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

function loadRound(round) {
  const deckPath = join(ROOT, 'tools/social-cards/decks', `${round}.json`)
  if (!existsSync(deckPath)) throw new Error(`no deck at tools/social-cards/decks/${round}.json`)
  const deck = JSON.parse(readFileSync(deckPath, 'utf8'))
  if (deck.round !== round) throw new Error(`that deck's round is "${deck.round}", not "${round}"`)
  const gate = spawnSync(process.execPath, [join(ROOT, 'scripts/check-ad-round.mjs'), deckPath], { encoding: 'utf8' })
  if (gate.status !== 0) throw new Error(`the deck does not pass the ad gate, so nothing is uploaded:\n${gate.stdout}`)
  deck.cards.forEach((card, i) => {
    card.file = join(ROOT, 'content/packs', round, `${String(i + 1).padStart(2, '0')}-${card.name}.png`)
    if (!existsSync(card.file)) throw new Error(`no rendered card at content/packs/${round}/${String(i + 1).padStart(2, '0')}-${card.name}.png`)
  })
  return deck
}

async function selfTest() {
  const deck = {
    round: '2026-01-01-test',
    cards: [1, 2].map((n) => ({ name: `card-${n}`, src: `t-card-${n}`, file: null, ad: { text: 'Words.', headline: 'What stage is your child?', description: 'Three questions, no sign up.' } })),
  }
  const config = { dailyBudgetPence: 500, days: 7, audienceName: 'UK', targeting: { geo_locations: { countries: ['GB'] } } }
  const env = { META_AD_ACCOUNT_ID: '123', META_PAGE_ID: '456' }
  const calls = plan(deck, config, env)
  const sent = []
  let n = 0
  const send = async (call, body) => { sent.push({ call, body }); n++; return call.take === 'hash' ? { images: { x: { hash: `h${n}` } } } : { id: `id${n}` } }
  const receipt = {}
  await run(calls, { send, receipt, save: () => {}, wait: 0, log: () => {} })
  const fail = (m) => { console.error(`self test: ${m}`); process.exit(1) }

  if (sent.length !== 2 + 3 * 2) fail(`expected 8 calls, sent ${sent.length}`)
  const flat = JSON.stringify(sent)
  if (flat.includes('ACTIVE')) fail('something was sent as ACTIVE')
  for (const s of sent) if ('status' in (s.call.body || {}) && s.body.status !== PAUSED) fail(`${s.call.key} is not paused`)
  for (const k of ['campaign', 'adset', 'ad:t-card-1', 'ad:t-card-2']) if (sent.find((s) => s.call.key === k)?.body.status !== PAUSED) fail(`${k} carries no paused status`)
  const ad = sent.find((s) => s.call.key === 'ad:t-card-2').body
  if (ad.adset_id !== receipt.adset || ad.creative.creative_id !== receipt['creative:t-card-2']) fail('an ad is not tied to its own ad set and creative')
  const creative = sent.find((s) => s.call.key === 'creative:t-card-1').body
  if (creative.object_story_spec.link_data.image_hash !== receipt['image:t-card-1']) fail('a creative does not carry its own image')
  if (!creative.object_story_spec.link_data.link.startsWith(`${SITE}/v/t-card-1?`)) fail('a creative does not link to its own code')
  if (!creative.object_story_spec.link_data.link.includes('utm_medium=paid')) fail('the link is not marked paid')

  // A second run makes nothing new.
  const before = sent.length
  await run(calls, { send, receipt, save: () => {}, wait: 0, log: () => {} })
  if (sent.length !== before) fail('a second run sent calls again')

  // A run that dies half way picks up, and does not repeat what it made.
  const half = {}
  let count = 0
  const dying = async (call, body) => { if (++count === 4) throw new Error('network'); return send(call, body) }
  await run(calls, { send: dying, receipt: half, save: () => {}, wait: 0, log: () => {} }).catch(() => {})
  const made = Object.keys(half).length
  const start = sent.length
  await run(calls, { send, receipt: half, save: () => {}, wait: 0, log: () => {} })
  if (sent.length - start !== calls.length - made) fail('the second half repeated a call')

  // No code path can switch anything on.
  const self = readFileSync(fileURLToPath(import.meta.url), 'utf8')
  if (/status:\s*['"]ACTIVE/.test(self)) fail('this file sets a status of ACTIVE somewhere')
  console.log('ad upload self test: 8 calls for 2 cards, all paused, each ad tied to its own image and link, a second run sends nothing, a broken run picks up')
}

const args = process.argv.slice(2)
if (args.includes('--self-test')) { await selfTest(); process.exit(0) }

const round = args.find((a) => !a.startsWith('--'))
const go = args.includes('--go')
if (!round) { console.error('usage: npm run ad-upload -- <round> [--go]'); process.exit(1) }

try {
  const deck = loadRound(round)
  const config = JSON.parse(readFileSync(join(ROOT, 'content/ads/meta/config.json'), 'utf8'))
  const env = readEnv()
  const missing = ['META_ACCESS_TOKEN', 'META_AD_ACCOUNT_ID', 'META_PAGE_ID'].filter((k) => !env[k])
  const receiptPath = join(ROOT, 'content/ads/meta', `${round}.json`)
  const receipt = existsSync(receiptPath) ? JSON.parse(readFileSync(receiptPath, 'utf8')) : {}
  const save = (r) => { mkdirSync(dirname(receiptPath), { recursive: true }); writeFileSync(receiptPath, JSON.stringify(r, null, 2) + '\n') }

  if (!go) {
    const calls = plan(deck, config, { META_AD_ACCOUNT_ID: env.META_AD_ACCOUNT_ID || '<ad account>', META_PAGE_ID: env.META_PAGE_ID || '<page>', META_INSTAGRAM_ID: env.META_INSTAGRAM_ID })
    console.log(`DRY RUN, nothing sent. ${calls.length} calls for ${deck.cards.length} cards, everything paused.\n`)
    console.log(`  budget if switched on: £${(config.dailyBudgetPence / 100).toFixed(2)} a day for ${config.days} days, £${((config.dailyBudgetPence * config.days) / 100).toFixed(2)} at most`)
    console.log(`  audience: ${config.audienceName}\n`)
    for (const c of calls) {
      const done = receipt[c.key] ? `  (already made: ${receipt[c.key]})` : ''
      console.log(`  POST ${c.path}  ${c.key}${done}`)
      if (c.key.startsWith('creative:')) console.log(`       link  ${c.body.object_story_spec.link_data.link}`)
    }
    if (missing.length) console.log(`\nNot set yet, needed before --go: ${missing.join(', ')}. See content/ads/SETUP.md.`)
    else console.log('\nKeys are set. Run again with --go to send, everything paused.')
    process.exit(0)
  }

  if (missing.length) throw new Error(`not set: ${missing.join(', ')}. See content/ads/SETUP.md.`)
  console.log(`Sending ${round} to Meta, everything paused.`)
  await run(plan(deck, config, env), { send: liveSend(env), receipt, save })
  console.log(`\nDone. Nothing is live and nothing is spending. The ids are in content/ads/meta/${round}.json.`)
  console.log('To run it: open Ads Manager, check the audience and the budget on the ad set, and switch on only what you choose.')
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
