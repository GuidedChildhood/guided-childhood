#!/usr/bin/env node
// THE CREATIVE DIRECTOR GATE: EVERY AD CARD PASSES THE RULES BEFORE JUSTIN
// SEES IT.
//
// Justin, 11 November 2026, building the ad system from Cody Schneider's
// marketing engineer talk (plans/2026-11-11-ad-system-plan.md, step 1). The
// one point in that talk worth taking whole: a reviewer scores every ad
// before a human does, and a failing ad goes round again rather than up for
// approval. The ad studio gates (.claude/skills/ad-studio, phase 4) were a
// checklist somebody had to remember, and the ad campaign council of
// 19 October found five breaks in a round that had already been "checked":
// the hook cut in half, butter used as a ground, borrowed words, a promised
// outcome, a tilted callout.
//
// So this checks what a machine can be right about. Taste stays with the
// vision pass in the skill (render, score each card out of ten, fix anything
// under eight) and then with Justin. Every rule here is a written decision:
//
//   the hook     every card ends "What stage is your child?" and, under it,
//                "Three questions, no sign up." (THE-STORY section 9, the
//                council's fix 2: the hook was on 2 of 9 cards)
//   a link code  every card carries `src`, its own source link code, unique
//                across every round. The code is the join from the card's
//                exact spec to stage checks begun, signups and payment
//                (migrations 372, 379, 388). Without one a test cannot be read.
//   real screens every image is a capture in content/ads/screens (visual
//                system section 1: never an invented screen). A generated
//                scene may sit behind one, from content/ads/scenes, never
//                instead of one
//   no dashes    non negotiable 4
//   the copy     a round card carries `ad`: the words that run beside it on
//                Facebook and Instagram, held to the same rules, so the deck
//                is the whole advert
//   the gates    no borrowed proof (user counts, ratings, percentages without
//                a source), no unnamed expert, no outcome promised for a child
//                (ready, safe), no words a competitor owns or a fear button
//                (ad studio phase 4, the council's colour and copy rules)
//   the look     butter is one mark, never a ground; one <mark> per headline;
//                the only question on the card is the CTA; no tilted callouts
//
// WHICH DECKS. A deck is an ad round when it carries `"round"`. That field is
// the ledger: the round's name, dated, and each card's `src` inside it. The
// older decks (ad-round-phone, ad-studio-examples, first-phone-ad) predate
// the council and the rules, and rewriting them to satisfy a guard written
// afterwards is churn, so they are only reported with --all, never failed.
//
//   npm run ad-gate                     every round deck, fails on a break
//   npm run ad-gate -- <deck.json>      one deck (round or not), fails on a break
//   npm run ad-gate -- --all            every ad deck, the older ones reported only
//   npm run ad-gate -- --self-test      the rules against a known bad and good card

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DECKS = join(ROOT, 'tools/social-cards/decks')
const SCREENS = 'content/ads/screens/'
const SCENES = 'content/ads/scenes/'

const HOOK_ASK = 'What stage is your child?'
const HOOK_LINE = 'Three questions, no sign up.'

// BRANDS (12 November 2026, Justin: build this for The Social Billboard and
// Guided Childhood Schools too). A deck names its brand with "brand"; no
// brand means Guided Childhood. Each brand's hook and its own banned words
// live in content/ads/brands/<id>.json, so one gate serves all three.
export function loadBrand(id = 'guided-childhood') {
  const file = join(ROOT, 'content/ads/brands', `${id}.json`)
  if (!existsSync(file)) throw new Error(`no brand profile at content/ads/brands/${id}.json`)
  const b = JSON.parse(readFileSync(file, 'utf8'))
  return {
    ...b,
    banned: (b.extra_banned || []).map((r) => ({ re: new RegExp(r.re, 'i'), why: r.why })),
  }
}
const GC = { hook: { ask: HOOK_ASK, line: HOOK_LINE }, banned: [], id: 'guided-childhood' }

// The same shape the database holds a link code to (migration 372), so a code
// that passes here can be made on the founder links page as it is.
const CODE = /^[a-z0-9]+(-[a-z0-9]+)*$/
const RESERVED = new Set(['direct', 'referral', 'school'])
const ROUND = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/

const TEXT_FIELDS = ['eyebrow', 'headline', 'sub', 'pill', 'small']

// The same dash the copy guard counts (scripts/check-ai-tells.mjs): U+2010 to
// U+2015 and the minus sign, plus a hyphen standing alone as punctuation.
// Built from code points so this file itself holds no dash character.
const cp = (n) => String.fromCodePoint(n)
const DASH = new RegExp(`[${cp(0x2010)}-${cp(0x2015)}${cp(0x2212)}]|\\s-\\s|&[mn]dash;`)

// Each rule names where it was decided, so the message says why, not just no.
const BANNED = [
  { re: /\b\d[\d,.]*\s*(%|per\s?cent|percent)/i, why: 'a percentage with no source on the card (evidence rule, visual system section 12)', unless: 'evidence' },
  { re: /\b\d[\d,.]*\s*k?\+?\s*(parents|families|users|downloads|members|reviews)\b/i, why: 'borrowed proof: a user or review count (ad studio gate 3)' },
  { re: /★|\b(rated|trusted by|award\w*|as seen in|parents love)\b/i, why: 'borrowed proof: ratings, awards or "parents love" (ad studio gate 3, council do not copy list)' },
  { re: /\b(experts?|psychologists?|clinicians?|doctors?)\b/i, why: 'an expert with no name (ad studio gate 4)', unless: 'expert' },
  { re: /\b(safe|safer|safely|safety|ready|guarantee\w*|cure\w*)\b/i, why: 'an outcome promised for a child; we give the stage and the next step (ad studio gate 5)' },
  { re: /\bbattles?\b|five more minutes/i, why: 'a competitor\'s words ("battle" is Qustodio\'s, "five more minutes" Kairoo\'s and Ohana\'s, council 19 October)' },
  { re: /\b(predators?|groom\w*|dangers?|dangerous|terrif\w*)\b/i, why: 'a fear button (ad studio phase 3)' },
  { re: /\baddict\w*/i, why: '"addicted" diagnoses a child; say what the parent sees instead' },
]

function plain(html) {
  return String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&rarr;|&larr;|&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function images(card) {
  const out = []
  if (card.screen?.image) out.push(['screen', card.screen.image])
  if (card.phone?.image) out.push(['phone', card.phone.image])
  if (card.back?.image) out.push(['back', card.back.image])
  for (const [i, c] of (card.callouts || []).entries()) if (c.image) out.push([`callout ${i + 1}`, c.image])
  return out
}

// One card against every rule. Returns the breaks as plain sentences.
export function checkCard(card, { fileExists = (p) => existsSync(join(ROOT, p)), brand = GC } = {}) {
  const ASK = brand.hook.ask, LINE = brand.hook.line
  const breaks = []

  // A link code, in the shape the database will take.
  if (!card.src) breaks.push('no `src`: every card needs its own link code, or its result cannot be read')
  else if (!CODE.test(card.src) || card.src.length < 3 || card.src.length > 40) breaks.push(`src "${card.src}" is not a link code (lower case words joined by single hyphens, 3 to 40 long)`)
  else if (RESERVED.has(card.src)) breaks.push(`src "${card.src}" is reserved for links that carry no code`)

  // The hook, whole, on every card.
  if (!plain(card.pill).includes(ASK)) breaks.push(`the button must say "${ASK}"`)
  if (plain(card.small) !== LINE) breaks.push(`the line under the button must be exactly "${LINE}"`)

  // Real screens only.
  for (const [where, path] of images(card)) {
    if (!path.startsWith(SCREENS)) breaks.push(`${where} image ${path} is not a real capture in ${SCREENS}`)
    else if (!fileExists(path)) breaks.push(`${where} image ${path} does not exist`)
  }

  // A scene is a generated photograph of a room or objects behind the real
  // screen (visual system section 15: never a person, a character or a
  // screen). It lives apart from the real captures so the two cannot be mixed up.
  if (card.scene) {
    const p = card.scene.image || ''
    if (!p.startsWith(SCENES)) breaks.push(`scene image ${p} is not in ${SCENES}`)
    else if (!fileExists(p)) breaks.push(`scene image ${p} does not exist`)
    if (!card.screen?.image) breaks.push('a scene needs a real screen on top of it; a generated picture alone proves nothing')
  }

  // The copy.
  // The words that run beside the card on Facebook and Instagram are held to
  // the same rules as the card. Its headline is the hook, so it may ask.
  const adCopy = Object.entries(card.ad || {}).map(([k, v]) => [`ad ${k}`, v])
  const fields = TEXT_FIELDS.map((f) => [f, card[f]])
    .concat((card.callouts || []).map((c, i) => [`callout ${i + 1} label`, c.label]))
    .concat(adCopy)
  for (const [field, raw] of fields) {
    if (!raw) continue
    const text = plain(raw)
    if (DASH.test(raw) || DASH.test(text)) breaks.push(`${field} has a dash: "${text}"`)
    for (const rule of BANNED.concat(brand.banned || [])) {
      if (rule.unless && card[rule.unless]) continue
      const hit = text.match(rule.re)
      if (hit) breaks.push(`${field} says "${hit[0]}": ${rule.why}`)
    }
    if (field !== 'pill' && field !== 'ad headline' && text.includes('?')) breaks.push(`${field} asks a question; the only question on the card is the button (council 19 October)`)
  }

  // The look.
  if (card.ground === 'butter') breaks.push('ground is butter: butter is one mark, never a surface (council 19 October)')
  const marks = (String(card.headline ?? '').match(/<mark>/g) || []).length
  if (marks > 1) breaks.push(`headline has ${marks} gold marks; one gold detail per card (visual system section 16)`)
  for (const [i, c] of (card.callouts || []).entries()) {
    if (c.tilt) breaks.push(`callout ${i + 1} is tilted; callouts sit flat (council 19 October)`)
  }

  return breaks
}

function loadDecks() {
  return readdirSync(DECKS)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ path: join(DECKS, f), deck: JSON.parse(readFileSync(join(DECKS, f), 'utf8')) }))
    .filter(({ deck }) => deck.template === 'ad')
}

function checkDeck({ path, deck }, seen) {
  const brand = deck.brand ? loadBrand(deck.brand) : GC
  const breaks = []
  if (deck.round && !ROUND.test(deck.round)) breaks.push(`round "${deck.round}" must be dated: yyyy-mm-dd-name`)
  for (const [i, card] of (deck.cards || []).entries()) {
    const label = `card ${i + 1} (${card.name || 'unnamed'})`
    for (const b of checkCard(card, { brand })) breaks.push(`${label}: ${b}`)
    // A round card carries the words that run beside it, so the deck is the
    // whole advert and the uploader (scripts/ad-upload-meta.mjs) invents nothing.
    if (deck.round) {
      if (!card.ad?.text) breaks.push(`${label}: no ad.text, the words that run above the card`)
      if (plain(card.ad?.headline) !== brand.hook.ask) breaks.push(`${label}: ad.headline must be "${brand.hook.ask}"`)
      if (plain(card.ad?.description) !== brand.hook.line) breaks.push(`${label}: ad.description must be "${brand.hook.line}"`)
      if (brand.hook_status && /PROPOSED/.test(brand.hook_status)) breaks.push(`${label}: ${brand.name}'s hook is not agreed yet (${brand.hook_status})`)
    }
    if (card.src) {
      const where = `${relative(ROOT, path)} ${label}`
      if (seen.has(card.src)) breaks.push(`${label}: src "${card.src}" is already used by ${seen.get(card.src)}; one code per card, ever, or two cards share one result`)
      else seen.set(card.src, where)
    }
  }
  return breaks
}

function selfTest() {
  const good = {
    name: 'good', src: 'ig-1111-mid-match',
    eyebrow: 'The words for tonight', headline: 'They cannot stop in the <mark>middle of a match.</mark>',
    sub: 'The words for that moment, for their age.', pill: 'What stage is your child? &rarr;', small: 'Three questions, no sign up.',
    phone: { image: 'content/ads/screens/script.png' },
  }
  const bad = {
    name: 'bad', ground: 'butter',
    eyebrow: 'Trusted by 10,000 parents', headline: 'End the <mark>screen</mark> <mark>battle</mark> ' + String.fromCodePoint(0x2014) + ' tonight?',
    sub: 'Experts say 90% of kids are addicted. Keep them safe.', pill: 'Start now', small: 'Free',
    phone: { image: 'public/marketing/kid-page.png' }, callouts: [{ image: 'content/ads/screens/nope.png', tilt: 3 }],
  }
  const exists = (p) => p !== 'content/ads/screens/nope.png'
  const g = checkCard(good, { fileExists: exists })
  const b = checkCard(bad, { fileExists: exists }).join('\n')
  const want = ['no `src`', 'What stage is your child?', 'Three questions', 'not a real capture', 'does not exist', 'a dash', 'user or review count', 'expert with no name', 'percentage', 'promised', "competitor's words", 'addicted', 'asks a question', 'ground is butter', '2 gold marks', 'tilted']
  const missed = want.filter((w) => !b.includes(w))
  if (g.length) console.error('self test: the good card broke:\n  ' + g.join('\n  '))
  if (missed.length) console.error('self test: the bad card was not caught on: ' + missed.join(', '))
  const sb = loadBrand('social-billboard')
  const sbBad = checkCard({ ...good, pill: sb.hook.ask, small: sb.hook.line, sub: 'Age-appropriate videos, rated 9/10, no ads.' }, { fileExists: exists, brand: sb }).join('\n')
  const sbMissed = ['age banded', 'numeric scores', 'pre roll'].filter((w) => !sbBad.includes(w))
  if (sbMissed.length) console.error('self test: the Social Billboard rules missed: ' + sbMissed.join(', '))
  if (g.length || missed.length || sbMissed.length) process.exit(1)
  console.log(`ad gate self test: the good card passes, the bad card is caught on all ${want.length} rules, and a brand's own rules apply to its decks`)
}

const args = process.argv.slice(2)
if (args.includes('--self-test')) {
  selfTest()
  process.exit(0)
}

const all = args.includes('--all')
const named = args.filter((a) => !a.startsWith('--'))
const decks = named.length
  ? named.map((p) => ({ path: resolve(p), deck: JSON.parse(readFileSync(resolve(p), 'utf8')) }))
  : loadDecks().filter(({ deck }) => all || deck.round)

// Codes are unique across every round deck, so read them all first even when
// one deck is named.
const seen = new Map()
let failed = 0
let reported = 0
for (const d of decks) {
  const binding = named.length > 0 || Boolean(d.deck.round)
  const breaks = checkDeck(d, seen)
  const rel = relative(ROOT, d.path)
  if (!breaks.length) {
    console.log(`PASS ${rel} (${d.deck.cards?.length || 0} cards)`)
    continue
  }
  if (binding) failed += breaks.length
  else reported += breaks.length
  console.log(`${binding ? 'FAIL' : 'OLD '} ${rel}${binding ? '' : ' (before the gate; reported, not failed)'}`)
  for (const b of breaks) console.log(`  ${b}`)
}

if (!decks.length) console.log('ad gate: no round decks yet. A deck becomes a round when it carries "round": "yyyy-mm-dd-name".')
if (reported) console.log(`\n${reported} breaks in decks made before the gate, reported only.`)
if (failed) {
  console.log(`\n${failed} breaks. Fix the card and render again; nothing goes to Justin until this passes.`)
  process.exit(1)
}
if (decks.length) console.log('\nad gate: passed. Next, the vision pass in the ad studio skill.')
