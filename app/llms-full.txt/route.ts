import { SITE_URL } from '@/lib/config/site'
import { GUIDES, withIssue } from '@/lib/content/guides'
import { APPS } from '@/lib/app-safety/apps'
import { appFaqs } from '@/lib/app-safety/app-faqs'
import { HUB_PATH, appPath, directAnswer, leadControl, minAgeLine, ratingsLine } from '@/lib/app-safety/content'

// /llms-full.txt: THE ANSWERS THEMSELVES, FOR AI ANSWER ENGINES.
//
// 28 November 2026. /llms.txt is the map: what the site is and which pages
// matter. This is the companion the llms.txt convention (llmstxt.org) names:
// the content in plain text, so ChatGPT, Perplexity, Claude, Gemini and
// Copilot can quote an answer with its source without crawling 300 pages.
//
// Every line is built from the same data the pages show (lib/app-safety and
// lib/content/guides.ts), so it cannot say anything the page does not. The
// paid scripts are named only by the guide pages, never printed here.

export const dynamic = 'force-static'

const url = (path: string) => `${SITE_URL}${path}`

export function GET() {
  const lines: string[] = [
    '# Guided Childhood: answers for parents',
    '',
    '> Plain answers to the screen, phone and app questions UK parents ask, from Guided Childhood. Every app fact links to the company, rating body or store page it came from. Advice is given as a pathway for a child\'s age, never a yes or no. Each answer ends at a free three question stage check: ' + url('/starter-pack'),
    '',
    `The map of the site is at ${url('/llms.txt')}.`,
    '',
    '## Guides',
    '',
  ]

  for (const g of GUIDES) {
    const { issue } = withIssue(g)
    lines.push(
      `### ${g.question}`,
      '',
      `${g.ages}. ${url(`/guides/${g.slug}`)}`,
      '',
      g.intro,
      '',
      `Why it keeps happening: ${issue.mechanism}`,
      '',
      `What works: ${issue.response}`,
      '',
      `With a younger child: ${issue.prevent}`,
      '',
      `Source: ${issue.source.name}, ${issue.source.url}`,
      '',
    )
  }

  lines.push('## App safety guide', '', `Every app, with a page for each age from 6 to 15: ${url(HUB_PATH)}`, '')

  for (const a of APPS) {
    const control = leadControl(a)
    lines.push(
      `### Is ${a.name} safe for children?`,
      '',
      `${url(appPath(a.slug))}, checked ${a.checked}.`,
      '',
      `${a.whatItIs}`,
      '',
      directAnswer(a, null),
      '',
      `Minimum age: ${minAgeLine(a)} Source: ${a.minAge.sourceUrl}`,
      '',
      `Ratings: ${ratingsLine(a)}`,
      '',
      'What to know:',
      ...a.risks.map(r => `- ${r.title}: ${r.detail} (${r.sourceUrl})`),
      '',
      'Settings:',
      ...a.controls.map(c => `- ${c.name}: ${c.what} (${c.sourceUrl})`),
      '',
      ...(control ? [`Start with: ${control}.`, ''] : []),
      ...appFaqs(a.slug).flatMap(f => [`Q: ${f.q}`, `A: ${f.a} (${f.sourceUrl})`, '']),
    )
  }

  lines.push('## Contact', '', '- hello@guidedchildhood.com', '')

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
