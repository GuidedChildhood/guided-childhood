// Rhythm: a meter, not a gate.
//
// Justin, 9 November 2026: how do we avoid AI detection, since the detectors
// look for groupings of words, and is there a tool.
//
// Two corrections are built into what this does.
//
// First, the modern detectors are not mainly looking for groupings of words.
// That was the old method, perplexity and burstiness, and GPTZero moved off it
// in 2023 for an end to end classifier. The phrase half of the problem is
// already covered by check-ai-tells.mjs, which fails the build on dashes and
// stock phrases. This file is the other half.
//
// Second, and this is why this file prints rather than fails: you cannot aim at
// a detector. Independent testing has put real world false positive rates
// around 18 percent, and one 2026 follow up found a mean of 61.3 percent on
// essays by non native English writers, because careful, plain, evenly built
// prose is exactly what the statistical methods call machine written. Chasing a
// score would mean rewriting good sentences to beat a number that is noise, and
// it would make the writing worse.
//
// So the target here is not a detector. It is Justin. The baseline below is
// built from his own writing, and a draft is measured against that rather than
// against an abstract ideal. If a draft has the rhythm of the things he wrote
// himself, it reads like him, which is the actual goal. Sounding less like a
// machine is a side effect of sounding more like a person, and only the first
// of those is worth aiming at.
//
// ai-tells.md calls these the soft tells, "the writer's ear, not the guard",
// and says a guard firing on them would cost more than it caught. That is
// right, which is why nothing here exits non zero. It reports and you judge.
//
// Usage:
//   npm run rhythm -- <file...>        measure these files against the baseline
//   npm run rhythm -- --baseline       print the baseline itself

import { readFileSync, existsSync } from 'node:fs'

const ROOT = new URL('..', import.meta.url).pathname

// Justin's own prose. His scenes in his own words, and the founding story.
// GDC-053 is deliberately not in here: he wrote it, but we then applied a
// scrutiny pass, so it is no longer a clean sample of him unedited.
const BASELINE_FILES = [
  'content/brand-story/founder-context.md',
  'content/brand-story/founding-story.md',
]

const args = process.argv.slice(2)
const WANT_BASELINE = args.includes('--baseline')
const targets = args.filter(a => !a.startsWith('--'))

// ── Pulling the copy out of the markdown ────────────────────────────────────
// Only prose counts. Headings, tables, quotes, code, list scaffolding and our
// own planning notes are not what a reader reads.
const isProse = line =>
  line.trim() &&
  !/^\s*#{1,6}\s/.test(line) &&
  !/^\s*\|/.test(line) &&
  !/^\s*>/.test(line) &&
  !/^\s*[-*+]\s/.test(line) &&
  !/^\s*\d+\.\s/.test(line) &&
  !/^\s*```/.test(line) &&
  !/^\s*\*\*(Venue|Preview|Job|Plan|Card|Justin)/.test(line) &&
  !/^\s*[-=_]{3,}\s*$/.test(line)

function paragraphs (text) {
  return text
    .split(/\n\s*\n/)
    .map(block => block.split('\n').filter(isProse).join(' ').trim())
    .filter(p => p.length > 0)
    .map(p => p.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1')
                .replace(/`(.+?)`/g, '$1').replace(/\s{2,}/g, ' '))
}

function sentences (para) {
  // Split on terminal punctuation followed by a space and a capital, so that
  // "16." or "3.36 hours" does not become a sentence boundary.
  return para.split(/(?<=[.!?])\s+(?=[A-Z"'])/).map(s => s.trim()).filter(Boolean)
}

const words = s => s.split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w))

const mean = xs => xs.reduce((a, b) => a + b, 0) / (xs.length || 1)
const stdev = xs => {
  if (xs.length < 2) return 0
  const m = mean(xs)
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1))
}
// Coefficient of variation: the spread as a share of the average. This is the
// burstiness number. Uniform prose scores low. A person scores high.
const cv = xs => (mean(xs) ? stdev(xs) / mean(xs) : 0)

const ADVERBS = /\b(genuinely|honestly|truly|incredibly|absolutely|utterly|frankly|simply|really|very)\b/gi

function measure (text) {
  const paras = paragraphs(text)
  const sents = paras.flatMap(sentences)
  const sLens = sents.map(s => words(s).length).filter(n => n > 0)
  const pLens = paras.map(p => words(p).length).filter(n => n > 0)

  // Repeated sentence openers: the first two words, lowercased.
  const openers = {}
  for (const s of sents) {
    const w = words(s).slice(0, 2).join(' ').toLowerCase()
    if (w) openers[w] = (openers[w] || 0) + 1
  }
  // Rates, not counts. A raw count of repeated openers is misleading in a long
  // piece and flagged "it is" across every issue on 9 November, which looked
  // like a fingerprint until it was normalised and turned out to be 1.7 times
  // his own rate rather than a habit he does not have. Compare to him.
  const openerRate = {}
  for (const [w, n] of Object.entries(openers)) openerRate[w] = n / sents.length
  const repeated = Object.entries(openers)
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])

  // The rule of three: "a, b and c" inside one sentence.
  const triads = sents.filter(s => /\w+,\s+\w[\w ]*,\s+and?\s+\w/.test(s)).length

  const all = words(text.toLowerCase()).map(w => w.replace(/[^a-z']/g, ''))
  const unique = new Set(all.filter(Boolean))

  return {
    words: sLens.reduce((a, b) => a + b, 0),
    paras: pLens.length,
    sents: sLens.length,
    sMean: mean(sLens),
    sCV: cv(sLens),
    sMin: Math.min(...sLens),
    sMax: Math.max(...sLens),
    short: sLens.filter(n => n <= 5).length,
    long: sLens.filter(n => n >= 35).length,
    pMean: mean(pLens),
    pCV: cv(pLens),
    repeated,
    triads,
    triadRate: sLens.length ? (triads / sLens.length) * 100 : 0,
    openerRate,
    adverbs: (text.match(ADVERBS) || []).length,
    ttr: all.length ? unique.size / all.length : 0,
  }
}

function baseline () {
  const texts = BASELINE_FILES
    .filter(f => existsSync(ROOT + f))
    .map(f => readFileSync(ROOT + f, 'utf8'))
  if (!texts.length) return null
  return { ...measure(texts.join('\n\n')), files: BASELINE_FILES.length }
}

const pct = n => (n * 100).toFixed(0) + '%'
const f1 = n => n.toFixed(1)

function verdict (m, b) {
  const out = []
  // Sentence burstiness is the one that matters most, so it gets the real test.
  if (b && m.sCV < b.sCV * 0.8) {
    out.push(`sentences are more uniform than his: ${pct(m.sCV)} against ${pct(b.sCV)}. Break one up or let one run.`)
  }
  if (b && m.pCV < b.pCV * 0.8) {
    out.push(`paragraphs are more even than his: ${pct(m.pCV)} against ${pct(b.pCV)}. Lumpy is human.`)
  }
  if (!m.short) out.push('no sentence of five words or fewer. One very short one changes the whole rhythm.')
  if (m.triadRate > 6) out.push(`${m.triads} rule of three sentences, ${f1(m.triadRate)}% of them. One is rhythm, four is a machine.`)
  if (m.adverbs > Math.max(3, m.sents * 0.03)) out.push(`${m.adverbs} reflex adverbs. Genuinely, honestly, really, simply.`)
  // An opener only counts against a draft if it runs well ahead of his own
  // rate for the same opener. Four of anything in two thousand words is normal.
  if (b) {
    for (const [w, n] of m.repeated.slice(0, 6)) {
      if (n < 4) break
      const mine = n / m.sents
      const his = b.openerRate[w] || 0
      if (his === 0 && n >= 5) {
        out.push(`"${w}" opens ${n} sentences and he never opens one that way.`)
      } else if (his > 0 && mine > his * 2.5) {
        out.push(`"${w}" opens ${n} sentences, ${(mine / his).toFixed(1)} times his rate.`)
      }
    }
  }
  return out
}

const b = baseline()

if (!b) {
  console.log('No baseline: none of the founder files were found.')
  process.exit(0)
}

if (WANT_BASELINE || !targets.length) {
  console.log(`\nBASELINE, from ${b.files} files of Justin's own writing`)
  console.log(`  ${b.words} words, ${b.sents} sentences, ${b.paras} paragraphs`)
  console.log(`  sentence length  mean ${f1(b.sMean)}, spread ${pct(b.sCV)}, shortest ${b.sMin}, longest ${b.sMax}`)
  console.log(`  paragraph length mean ${f1(b.pMean)}, spread ${pct(b.pCV)}`)
  console.log(`  ${b.short} sentences of 5 words or fewer, ${b.long} of 35 or more`)
  console.log(`  rule of three in ${f1(b.triadRate)}% of sentences, ${b.adverbs} reflex adverbs`)
  console.log(`\nThe spread figures are what matters. Aim near his, not above a threshold.\n`)
  if (!targets.length) process.exit(0)
}

for (const t of targets) {
  if (!existsSync(t)) { console.log(`\n${t}: not found`); continue }
  const m = measure(readFileSync(t, 'utf8'))
  if (!m.sents) { console.log(`\n${t}: no prose found`); continue }
  const v = verdict(m, b)
  console.log(`\n${t}`)
  console.log(`  ${m.words} words, ${m.sents} sentences, ${m.paras} paragraphs`)
  console.log(`  sentence spread ${pct(m.sCV)} (his ${pct(b.sCV)}), mean ${f1(m.sMean)} (his ${f1(b.sMean)}), ${m.sMin} to ${m.sMax} words`)
  console.log(`  paragraph spread ${pct(m.pCV)} (his ${pct(b.pCV)})`)
  console.log(`  ${m.short} very short sentences, ${m.long} long ones, ${m.triads} triads, ${m.adverbs} reflex adverbs`)
  if (v.length) {
    console.log('  read back:')
    for (const line of v) console.log(`    ${line}`)
  } else {
    console.log('  read back: nothing measurable to flag. The ear still has the last word.')
  }
}

console.log('\nNothing here fails a build. These are the soft tells and they are a judgement.\n')
