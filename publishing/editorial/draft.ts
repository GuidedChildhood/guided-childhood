// WEEK TWO: THE PAGES, DRAFTED FROM THE APPROVED STORIES.
//
// Claude writes issues/<NNN>/issue.json for the new edition: the same twelve
// templates as the last issue, the approved stories in place of the old ones,
// every number cited to a verified source from the research record. Then the
// engine does what it does to any issue: the editorial gate, then a full
// render with the layout checks. Whatever fails goes back to Claude as a list
// of plain findings ("page 7 body overflows by 9mm"), up to four rounds. A
// draft that still fails stays in DESIGNING with its report, for a person.
//
// The model never sees the founder gates and never decides what is true: it
// can only cite sources the research step verified (they are given to it with
// their quotes), and the validator refuses anything else.

import Anthropic from '@anthropic-ai/sdk'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pad3 } from '../engine/html'
import type { Issue, Source } from '../engine/schema'
import { validateIssue, type Finding } from '../engine/validate'
import type { Candidate } from '../research/scoring'
import { issueDir, renderEdition } from '../pdf-engine/render'

export const DRAFT_MODEL = process.env.PLANET_DRAFT_MODEL || 'claude-opus-5-5'

const RULES = `House rules, all of them enforced by code after you write:
- Readers are 7 to 12, reading with a grown up. Short sentences. Warm, plain, direct. UK English.
- No dashes of any kind in the copy, and no hyphen used as punctuation between words. Write compound words as two words ("how to video", "school aged").
- No stock phrases (dive into, delve, game changer, it is worth noting, in today's world, when it comes to, and the like).
- Every number, age, date or named project carries a citation marker like [[s3]], naming a source in "sources" whose verification is "verified", and the page's "refs" lists every id it cites, in order of first use.
- Association is never written as causation. Say what research cannot tell us.
- Characters: Bloop is the guide (curious, always one piece short, never makes a child feel slow). One friend per page, from: bloop, pebble, orbit, nova, cosmo, digi. Poses: happy, wave, thinking (digi only: standing).
- Activities never need a phone, an account or social media. Offer offline alternatives.
- Never ask a child for a surname, an address or a photo.
- Not a sales brochure: one grown ups line on page 12 only.`

export function draftPrompt(prev: Issue, stories: Candidate[], meta: { number: number; month: string; edition?: string }, findings: Finding[] = []): string {
  const sources: Source[] = stories.map((c, i) => ({
    id: `s${i + 1}`, org: c.source.org, title: c.headline, url: c.source.url, published: c.source.published, accessed: c.researched,
    evidence: c.source.evidence as Source['evidence'], verification: 'verified', supports: c.summary,
    quote: c.numericalClaims.filter(n => n.verified && n.quote).map(n => n.quote).join(' ... ') || undefined, note: c.limitations,
  }))
  return `You are drafting Issue ${pad3(meta.number)} of The Guided Planet for ${meta.month}.

${RULES}

THE STRUCTURE. Use exactly the same twelve page templates, in the same order, as the previous issue below. Keep every field its template needs. Keep the art slots' "vector" and "recipe" values; rewrite every "alt". Update number, slug (issue-${pad3(meta.number)}), month, edition, onlineUrl, the passport's sourcesUrl and the grown ups url's src parameter. Lengths: stay within about 10 percent of the previous issue's word count on each page, because the page boxes are fixed and the layout check measures them.

THE APPROVED STORIES, with the only sources you may cite (use these exact ids and copy them into "sources"):
${JSON.stringify(sources, null, 1)}

Evergreen pages (welcome, the invention activity, the paper game, the week, the passport) need no citations unless they state a fact.
${findings.length ? `\nYOUR LAST DRAFT FAILED THESE CHECKS. Fix every one and change nothing else:\n${findings.map(f => `- page ${f.page ?? '?'} ${f.rule}: ${f.detail}`).join('\n')}\n` : ''}
THE PREVIOUS ISSUE, as the structural example (its words are not to be reused):
${JSON.stringify({ ...prev, sources: undefined }, null, 1)}

Return ONLY the new issue as one JSON object.`
}

export async function draftIssue(n: number, stories: Candidate[], meta: { month: string; edition?: string }, opts: { rounds?: number; client?: Anthropic } = {}) {
  const prevN = n - 1
  const prevFile = join(issueDir(prevN), 'issue.json')
  if (!existsSync(prevFile)) throw new Error(`no previous issue to take the structure from (issues/${pad3(prevN)})`)
  const prev: Issue = JSON.parse(readFileSync(prevFile, 'utf8'))
  const client = opts.client ?? new Anthropic()
  const out = join(issueDir(n), 'issue.json')
  let findings: Finding[] = []
  for (let round = 1; round <= (opts.rounds ?? 4); round++) {
    const msg = await client.messages.stream({
      model: DRAFT_MODEL, max_tokens: 64000, output_config: { effort: 'high' },
      messages: [{ role: 'user', content: draftPrompt(prev, stories, { number: n, ...meta }, findings) }],
    } as Anthropic.Messages.MessageCreateParamsStreaming).finalMessage()
    if (msg.stop_reason === 'refusal') throw new Error('the drafting request was declined')
    const text = msg.content.map(b => (b.type === 'text' ? b.text : '')).join('')
    const issue = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)) as Issue
    writeFileSync(out, JSON.stringify(issue, null, 2) + '\n')
    findings = validateIssue(issue).filter(f => f.level === 'error')
    if (!findings.length) {
      const report = await renderEdition(n)
      findings = Object.values(report.layout).flat().filter(f => f.level === 'error')
      // The three PDFs share one layout, so a finding is reported once.
      findings = findings.filter((f, i, all) => all.findIndex(g => g.page === f.page && g.rule === f.rule && g.detail === f.detail) === i)
      if (report.ok) return { ok: true as const, rounds: round }
    }
  }
  return { ok: false as const, findings }
}

export const _rules = RULES
