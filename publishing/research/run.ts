// THE MONTHLY RESEARCH SWEEP.
//
// Week one of the cycle. Claude searches the source registry
// (research/sources.json) for 10 to 15 candidate stories, each with the exact
// words on the source page that back every number. Then OUR code, not the
// model, does the verification: it fetches each source page and checks the
// quoted words are really on it. A candidate whose quote is not found is
// 'flagged'; one whose page refuses automated reading is 'unverified' and
// waits for a person with a browser. Only 'verified' candidates can reach the
// shortlist (scoring.ts), and only verified sources can print (validate.ts).
//
// No web search, no research: there is deliberately no fallback to the
// model's own memory, because a children's newspaper that prints a
// remembered statistic is the failure this whole module exists to prevent.
//
// The model is a setting, PLANET_RESEARCH_MODEL, default claude-opus-5-5
// (DIGI_MODEL is DiGi's and is not borrowed). With no ANTHROPIC_API_KEY the
// sweep writes its brief to issues/<NNN>/research-brief.md for a Claude Code
// routine to run with its own web tools, which is how Issue 001 was researched.

import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PUB } from '../engine/library'
import { rank, type Candidate } from './scoring'

export const RESEARCH_MODEL = process.env.PLANET_RESEARCH_MODEL || 'claude-opus-5-5'

type Registry = { sources: { org: string; where: string[]; categories: string[]; notes?: string }[]; categories: string[] }

export function researchBrief(issue: number, theme: string | undefined, previous: string[]): string {
  const reg: Registry = JSON.parse(readFileSync(join(PUB, 'research', 'sources.json'), 'utf8'))
  const story = readFileSync(join(PUB, '..', 'THE-STORY.md'), 'utf8').split('## 4.')[0]
  return `You are the research desk of The Guided Planet, a monthly illustrated newspaper for UK children aged 7 to 12 and their families, made by The Guided Digital Childhood. Its job is the good side of screens: children creating, discovering and connecting with technology, and the judgement to go with it. It is never anti screen, never an uncritical celebration of technology, never a sales brochure.

Our thesis, from THE-STORY.md:
${story.slice(0, 3500)}

Find 10 to 15 candidate stories for Issue ${issue}${theme ? `, theme: ${theme}` : ''}, published in roughly the last six months, UK first, exceptional international stories welcome. Sweep these sources first, in this order:
${reg.sources.map(s => `- ${s.org}: ${s.where.join(', ')}${s.notes ? ` (${s.notes})` : ''}`).join('\n')}

Categories: ${reg.categories.join('; ')}.

Avoid repeating these earlier headlines unless there is genuinely new news: ${previous.join(' | ') || 'none yet'}.

RULES, which are not negotiable:
- Every number, age, date and named project must come from a page you actually fetched. Copy the exact words from that page into "quote". If you cannot find the words, leave the claim out.
- Never invent a statistic, quotation, participant, project or success story. Never present association as causation.
- Note limitations, conflicting evidence, and who funded the work.
- Prefer primary sources: the organisation's own page, the paper's DOI, the official report.
- Image permissions: say what the site's terms allow, or "not reproduced".

Return ONLY a JSON array. Each element:
{"id":"c01","headline":"...","category":"one of the categories","source":{"org":"...","url":"https://...","published":"as stated on the page","evidence":"systematic review|peer reviewed study|official report|official programme page|educational resource|press release|news report"},"summary":"two plain sentences","ageRelevance":"...","numericalClaims":[{"claim":"...","quote":"exact words from the page"}],"limitations":"...","conflictingEvidence":"...","imagePermissions":"...","recommendation":"lead|include|brief|hold|reject","scores":{"relevance":0-25,"evidence":0-25,"curiosity":0-20,"family":0-15,"visual":0-10,"timeliness":0-5}}`
}

// Ask Claude, with its own web search and fetch, for the candidate list.
export async function sweep(issue: number, theme: string | undefined, previous: string[]): Promise<Candidate[]> {
  const client = new Anthropic()
  const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: researchBrief(issue, theme, previous) }]
  let text = ''
  // A long search can pause; resume until the model finishes its turn.
  for (let turn = 0; turn < 6; turn++) {
    const params = {
      model: RESEARCH_MODEL,
      max_tokens: 64000,
      output_config: { effort: 'high' as const },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      tools: [
        { type: 'web_search_20260209', name: 'web_search', max_uses: 40 },
        { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 60 },
      ],
      messages,
    }
    const msg = await client.beta.messages.stream(params as unknown as Anthropic.Beta.Messages.MessageCreateParamsStreaming).finalMessage()
    if (msg.stop_reason === 'refusal') throw new Error('the research request was declined; nothing was invented to fill the gap')
    messages.push({ role: 'assistant', content: msg.content })
    text = msg.content.map(b => (b.type === 'text' ? b.text : '')).join('\n')
    if (msg.stop_reason !== 'pause_turn') break
  }
  const start = text.indexOf('['), end = text.lastIndexOf(']')
  if (start < 0 || end < start) throw new Error('the research reply carried no candidate list')
  const raw = JSON.parse(text.slice(start, end + 1)) as Candidate[]
  const today = new Date().toISOString().slice(0, 10)
  return raw
    .filter(c => c && typeof c.headline === 'string' && /^https:\/\//.test(c.source?.url ?? ''))
    .map(c => ({ ...c, researched: today, verification: 'unverified' as const, numericalClaims: (c.numericalClaims ?? []).map(n => ({ ...n, verified: false })) }))
}

// OUR verification: fetch the page, find the quoted words. Whitespace,
// curly quotes and dashes are normalised, nothing else. A page that refuses
// us is not proof of anything either way, so it stays unverified for a person.
export async function verifyCandidate(c: Candidate, fetcher: typeof fetch = fetch): Promise<Candidate> {
  let body = ''
  try {
    const res = await fetcher(c.source.url, { headers: { 'user-agent': 'Mozilla/5.0 (The Guided Planet research check)' }, redirect: 'follow' })
    if (!res.ok) return { ...c, verification: 'unverified', note: [c.note, `The source answered HTTP ${res.status}; a person needs to check it in a browser.`].filter(Boolean).join(' ') }
    body = normalise(stripTags(await res.text()))
  } catch (e) {
    return { ...c, verification: 'unverified', note: [c.note, `The source could not be fetched (${(e as Error).message}).`].filter(Boolean).join(' ') }
  }
  const claims = c.numericalClaims.map(n => ({ ...n, verified: !!n.quote && body.includes(normalise(n.quote)) }))
  const allFound = claims.every(n => n.verified)
  return { ...c, numericalClaims: claims, verification: allFound ? 'verified' : 'flagged', note: allFound ? c.note : [c.note, `Quoted words not found on the page: ${claims.filter(n => !n.verified).map(n => `"${n.quote ?? n.claim}"`).join('; ')}.`].filter(Boolean).join(' ') }
}

export const normalise = (s: string) => s
  .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/[‐-―−]/g, '-').replace(/ /g, ' ')
  .replace(/\s+/g, ' ').toLowerCase().trim()
const stripTags = (h: string) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, "'").replace(/&quot;|&ldquo;|&rdquo;/g, '"')

export async function runResearch(issue: number, dir: string, opts: { theme?: string; previous: string[] }) {
  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    writeFileSync(join(dir, 'research-brief.md'), `# Research brief, Issue ${String(issue).padStart(3, '0')}\n\nNo API key in this environment, so this brief is for a Claude Code session or routine to run with its own web tools. Write the result to research.json in this folder, in the shape publishing/research/scoring.ts calls Candidate, then run \`npm run planet -- cycle\`.\n\n${researchBrief(issue, opts.theme, opts.previous)}\n`)
    return { ok: false as const, reason: 'no API key: research-brief.md written for a routine to run' }
  }
  const found = await sweep(issue, opts.theme, opts.previous)
  const checked: Candidate[] = []
  for (const c of found) checked.push(await verifyCandidate(c))
  const ranked = rank(checked, opts.previous)
  writeFileSync(join(dir, 'research.json'), JSON.stringify({ issue, researched: new Date().toISOString().slice(0, 10), method: `Swept by ${RESEARCH_MODEL} with web search; every quote checked against its page by publishing/research/run.ts.`, candidates: ranked }, null, 2) + '\n')
  return { ok: true as const, count: ranked.length, verified: ranked.filter(c => c.verification === 'verified').length }
}
