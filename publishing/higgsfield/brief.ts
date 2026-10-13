// THE ILLUSTRATION BRIEF, AND THE CREDIT GATE.
//
// For an issue, read every art slot that names a recipe and produce the exact
// generation requests: the house style, the recipe, the slot's own subject
// (its alt text), the model and the tier. Nothing here spends a credit. The
// brief is what a Claude session runs through the Higgsfield connector
// (publishing/higgsfield/README.md), and only within the budget Justin has
// approved for the issue.
//
// THE GATE, in order:
//   1. No budget approved for the issue: drafts and finals are both blocked.
//   2. Drafts first. A final for a slot is only runnable once a draft for that
//      slot has been approved by Justin in the dashboard.
//   3. Spent (credits Higgsfield reported) plus this run's estimate must stay
//      within the budget. An unknown estimate counts as over budget until the
//      ledger has a measured figure, so an unpriced run always asks first.
//   4. A slot that already has an approved final is never regenerated.

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PUB } from '../engine/library'
import type { Issue } from '../engine/schema'
import type { GenerationRecord } from '../engine/store'
import { artSlots } from '../engine/validate'

type Recipe = { use: string; aspect: string; minPx: [number, number]; composition: string; lighting: string; characterPlacement: string; output: string }
type Book = {
  house: { style: string; palette: string; never: string }
  models: Record<'draft' | 'final', { model: string; params: Record<string, string>; creditsPerImage: number | null }>
  recipes: Record<string, Recipe>
}

export const recipes = (): Book => JSON.parse(readFileSync(join(PUB, 'higgsfield', 'recipes.json'), 'utf8'))

export type Request = {
  slot: string; page: number; recipe: string; tier: 'draft' | 'final'
  model: string; params: Record<string, string>; aspect: string; minPx: [number, number]
  prompt: string; estimate: number | null
  runnable: boolean; blockedBy?: string
}

const CAST = /\b(Bloop|Pebble|Orbit|Nova|Cosmo|DiGi)\b/i

export function buildPrompt(book: Book, r: Recipe, subject: string): string {
  if ([subject, r.composition, r.characterPlacement, r.lighting].some(t => CAST.test(t))) throw new Error('a generation prompt may not name a Planet Friend: characters are placed from the approved library, never generated')
  return [
    book.house.style,
    `Scene: ${r.composition}`,
    `This picture: ${subject}`,
    `Lighting: ${r.lighting}`,
    `Characters: ${r.characterPlacement}`,
    `Palette: ${book.house.palette}`,
    `Never: ${book.house.never}`,
    `Output: ${r.output}`,
  ].join('\n')
}

// Credits actually charged, from the ledger. Estimates are never counted as spend.
export const spent = (ledger: GenerationRecord[]) => ledger.reduce((s, g) => s + (g.credits ?? 0), 0)

// The measured cost of a tier, once the ledger has one, beats the recipe book.
function measured(ledger: GenerationRecord[], tier: 'draft' | 'final'): number | null {
  const done = ledger.filter(g => g.tier === tier && typeof g.credits === 'number')
  return done.length ? Math.max(...done.map(g => g.credits as number)) : null
}

export function brief(issue: Issue, ledger: GenerationRecord[], budget: number | null): { requests: Request[]; spent: number; budget: number | null; plannedDrafts: number | null; plannedFinals: number | null } {
  const book = recipes()
  const reqs: Request[] = []
  for (const p of issue.pages) for (const a of artSlots(p)) {
    if (!a.recipe) continue
    const r = book.recipes[a.recipe]
    if (!r) throw new Error(`page ${p.n} names recipe ${a.recipe}, which is not in recipes.json`)
    const slotLedger = ledger.filter(g => g.slot === a.slot)
    const draftApproved = slotLedger.some(g => g.tier === 'draft' && g.status === 'approved')
    const finalApproved = slotLedger.some(g => g.tier === 'final' && g.status === 'approved')
    for (const tier of ['draft', 'final'] as const) {
      const m = book.models[tier]
      reqs.push({
        slot: a.slot, page: p.n, recipe: a.recipe, tier, model: m.model, params: m.params, aspect: r.aspect, minPx: r.minPx,
        // The alt text describes the finished page, Bloop included, so it is
        // never the prompt: a prompt that names a character asks for one.
        prompt: buildPrompt(book, r, a.paint ?? 'Follow the scene above exactly.'),
        estimate: measured(ledger, tier) ?? m.creditsPerImage,
        runnable: false,
        blockedBy: finalApproved ? 'already has an approved final' : tier === 'final' && !draftApproved ? 'needs an approved draft first' : undefined,
      })
    }
  }
  // Walk the budget in page order: drafts first, then finals.
  let room = budget === null ? null : budget - spent(ledger)
  for (const tier of ['draft', 'final'] as const) for (const q of reqs.filter(x => x.tier === tier)) {
    if (q.blockedBy) continue
    if (room === null) { q.blockedBy = 'no credit budget approved for this issue'; continue }
    if (q.estimate === null) { q.blockedBy = 'cost not yet measured: approve this run on its own'; continue }
    if (q.estimate > room) { q.blockedBy = `over budget (${room} credits left)`; continue }
    q.runnable = true
    room -= q.estimate
  }
  const sum = (t: 'draft' | 'final') => reqs.filter(x => x.tier === t).every(x => x.estimate !== null) ? reqs.filter(x => x.tier === t).reduce((s, x) => s + (x.estimate ?? 0), 0) : null
  return { requests: reqs, spent: spent(ledger), budget, plannedDrafts: sum('draft'), plannedFinals: sum('final') }
}

export function briefMarkdown(issue: Issue, b: ReturnType<typeof brief>): string {
  const lines = [
    `# Illustration brief, The Guided Planet Issue ${String(issue.number).padStart(3, '0')}`,
    '',
    `Budget approved: ${b.budget === null ? 'none yet' : `${b.budget} credits`}. Spent so far: ${b.spent} credits (as reported by Higgsfield).`,
    `All drafts: ${b.plannedDrafts ?? 'unknown'} credits. All finals: ${b.plannedFinals ?? 'not yet measured'}.`,
    '',
    'Characters are never generated. Every request below is an environment or a prop; the layout engine places the approved cutouts.',
    '',
    '| Page | Slot | Tier | Model | Aspect | Estimate | Runnable |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...b.requests.map(r => `| ${r.page} | ${r.slot} | ${r.tier} | ${r.model} | ${r.aspect} | ${r.estimate ?? 'unknown'} | ${r.runnable ? 'yes' : `no: ${r.blockedBy}`} |`),
    '',
    '## Prompts',
    '',
    ...b.requests.filter(r => r.tier === 'draft').flatMap(r => [`### ${r.slot} (page ${r.page}, recipe ${r.recipe})`, '', '```', r.prompt, '```', '']),
  ]
  return lines.join('\n')
}
