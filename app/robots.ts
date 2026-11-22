import type { MetadataRoute } from 'next'

import { SITE_URL as BASE_URL } from '@/lib/config/site'

// Both /dev and /ref- 404 on the live deployment (app/dev/layout.tsx and
// middleware.ts). Listed anyway, because belt and braces costs one line and a
// crawler that finds a stale link should not go looking. The rest is the
// signed in app, the API, a child's own app (/k, by token), lesson codes from
// paper (/home-code) and the print route the free PDFs are rendered from
// (/print-free, never a public page). Shared moment cards (/m) and scripts
// (/say) are meant to be shared, so they stay open.
const PRIVATE = ['/dashboard', '/api', '/auth', '/onboarding', '/dev', '/ref-', '/k/', '/home-code/', '/print-free/']

// AI SEARCH IS A FRONT DOOR, SO THE AI CRAWLERS ARE NAMED AND WELCOMED.
//
// Justin, 19 November 2026: Google and AI search should be the main way parents
// find us. The `*` rule already let these crawlers in; naming them makes the
// choice deliberate and survives a future `*` change. Covered: OpenAI's
// training, search and user fetchers, Anthropic's, Perplexity's, Google's AI
// training token, Apple's, and Bing (which also feeds ChatGPT search).
//
// A named group REPLACES the `*` group for that crawler rather than adding to
// it, so each one repeats the private list. Without that, GPTBot would be
// allowed into /dashboard by the very rule meant to welcome it.
const AI_AND_SEARCH_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE },
      { userAgent: AI_AND_SEARCH_CRAWLERS, allow: '/', disallow: PRIVATE },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
