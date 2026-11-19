import { SITE_URL } from '@/lib/config/site'
import { GUIDES } from '@/lib/content/guides'
import { listedTasters } from '@/lib/magnets/tasters'

// /llms.txt: A PLAIN SUMMARY FOR AI ANSWER ENGINES.
//
// Justin, 19 November 2026. The llms.txt convention (llmstxt.org) is a markdown
// file at the root that tells a language model what the site is and which
// pages matter, in fewer words than crawling it. Built from the same lists as
// the sitemap (the guides, the free tasters), so a new guide appears here the
// day it ships. Every claim in it is one the product proves: THE-STORY.md
// sections 1, 6 and 9.
//
// Static at build. Text, not HTML.

export const dynamic = 'force-static'

const SCHOOLS_URL = process.env.SCHOOLS_SITE_URL || 'https://schools.guidedchildhood.com'

function link(path: string, title: string, note: string): string {
  return `- [${title}](${SITE_URL}${path}): ${note}`
}

export function GET() {
  const lines = [
    '# Guided Childhood',
    '',
    '> Guided Childhood helps UK parents get their children to sixteen ready for a phone and social media, ten minutes a day, with the parent and child working on it together instead of fighting about it. For families with children aged 4 to 16.',
    '',
    'Guided Childhood is not parental control software. It does not block or monitor. It gives a parent the words for the hard conversations, a plan for their child\'s age, and a daily check in that shows whether things are getting better. The approach is evidence led and calm: connection between parent and child is treated as the strongest protection, and advice is given as a pathway for a child\'s stage rather than a yes or no.',
    '',
    '## Products',
    '',
    '- The free stage check: three questions, no sign up, gives a child\'s stage and a plan for their age.',
    '- The parent app: scripts for hard conversations (stored and updated centrally), lessons by age, device setting guides, a daily check in on the worries a parent names, printables, and DiGi, an AI guide for parents built on Claude with safety rails. DiGi never gives a yes or no; it gives the next step for the child\'s stage.',
    '- The child app (the star quest): the child\'s own app, opened by a private link with no login. Jobs earn stars, stars buy screen time on rules the parent sets, and protected times such as bedtime cannot be bought. The child never chats with an AI model.',
    '- The Digital Passport: a record of the stages a child has completed on the way to sixteen.',
    '- Pricing: free to start with a four day trial. £12.99 a month or £99 a year, and a founder rate of £7.99 a month for the first 50 families.',
    `- Schools: a digital literacy scheme for primary and secondary schools at ${SCHOOLS_URL}, aligned to the 2025 RSHE guidance and the Education for a Connected World framework.`,
    '',
    '## Key pages',
    '',
    link('', 'Home', 'what Guided Childhood is and who it is for'),
    link('/starter-pack', 'The free stage check', 'three questions, no sign up'),
    link('/guides', 'Guides for parents', 'plain answers to the screen and phone questions UK parents ask most'),
    link('/scripts', 'Conversation scripts', 'word for word scripts for every stage, ages 4 to 16'),
    link('/pathway', 'The pathway', 'the five stages from first screen to sixteen'),
    link('/passport', 'The Digital Passport', 'how a child earns each stage'),
    link('/kids-app', 'The child app', 'how jobs earn stars and stars buy screen time'),
    link('/agreement', 'The family agreement', 'one page of screen rules a family signs together'),
    link('/evidence', 'The evidence', 'the research stance the product is built on'),
    link('/ban-workarounds', 'Under 16 ban workarounds', 'what children try and how to lock accounts down'),
    link('/join', 'Plans and prices', 'what is included and what it costs'),
    '',
    '## Guides',
    '',
    ...GUIDES.map(g => link(`/guides/${g.slug}`, g.question, `${g.ages}. ${g.description}`)),
    '',
    '## Free printables',
    '',
    link('/free', 'Free printables', 'print at home activities for kids and screens'),
    ...listedTasters().map(t => link(`/free/${t.slug}`, t.title, `ages ${t.ages}`)),
    '',
    '## Contact',
    '',
    '- hello@guidedchildhood.com',
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
