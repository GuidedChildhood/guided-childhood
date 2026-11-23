import { isTrackedPath } from './posthog-policy'

// VERCEL SPEED INSIGHTS: what it may send (22 November 2026, the search lens).
//
// Speed Insights measures how fast pages load on real phones (Core Web
// Vitals), which Google uses in ranking. It sets no cookie. We hold it to the
// same public pages PostHog may count (lib/analytics/posthog-policy.ts), so it
// never runs on a child's pages or inside an account, and every URL leaves
// without its query string, so nothing a family typed travels with it.

type SpeedEvent = { type: 'vital'; url: string; route?: string }

/** Keep a public page's speed reading, without its query string; drop everything else. */
export function speedBeforeSend<T extends SpeedEvent>(event: T): T | null {
  let url: URL
  try { url = new URL(event.url) } catch { return null }
  if (!isTrackedPath(url.pathname)) return null
  return { ...event, url: `${url.origin}${url.pathname}` }
}
