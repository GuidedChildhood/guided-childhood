import { SITE_URL } from '@/lib/config/site'

// STRUCTURED DATA, WRITTEN ONCE.
//
// Search engines and AI answer engines read JSON-LD to know what a page is:
// who runs the site, which questions a page answers, what an app costs. Every
// block on the site goes through <JsonLd>, so the escaping is done in one
// place: a "</script>" inside an answer would otherwise end the tag early.

type Thing = Record<string, unknown>

export function JsonLd({ data }: { data: Thing | Thing[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

/** Who runs the site. In the root layout, so every page carries it. */
export const ORGANIZATION: Thing = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Guided Childhood',
  url: SITE_URL,
  logo: `${SITE_URL}/icons/icon-512.png`,
  description: 'A clear digital pathway from first screen to 16. Age by age lessons, habits and quests for UK families, evidence informed, finished with their Digital Passport.',
  founder: { '@type': 'Person', name: 'Justin Phillips' },
  areaServed: { '@type': 'Country', name: 'United Kingdom' },
  email: 'hello@guidedchildhood.com',
  knowsAbout: ['digital parenting', 'screen time', 'online safety', 'children and social media', 'parental controls', 'digital wellbeing', 'AI literacy for children', 'digital literacy curriculum', 'under 16 social media ban'],
  slogan: 'A clear digital pathway from first screen to 16.',
}

/** A list of questions and answers, exactly as the page shows them. */
export function faqPage(faqs: { q: string; a: string }[]): Thing {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}
