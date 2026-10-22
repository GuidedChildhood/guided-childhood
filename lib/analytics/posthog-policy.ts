// WHAT POSTHOG IS ALLOWED TO SEE.
//
// Justin, 21 October 2026: "Add post hog." The plan, and the why of every rule
// below, is plans/2026-10-21-posthog-plan.md. The short version: gum (PR 1376)
// tells us what Google shows; this tells us what a parent does after the
// click, which page sent them to the stage check and how far they got.
//
// Every event passes through cleanEvent before it leaves the browser (it is
// PostHog's before_send), so this file is the one place the promise is kept:
//
//   1. Only the public pages. An allowlist, not a blocklist, so a new route is
//      private until someone decides otherwise. The child app (/k), the family
//      codes (/home-code, /r, /m), the dashboard, onboarding and auth are
//      never on it. We are pre DPIA, and a child's page is not ours to count.
//   2. Only the events named here, and for our own events only the
//      properties named here, plus the ones PostHog needs to accept them.
//      Never a name, an age, an answer or an email.
//   3. Every URL cleaned. Query strings go, apart from utm_* and ref, so a
//      school code or a video link token never leaves. An internal URL whose
//      path is not public is cut to the bare host.
//
// Pure and dependency free, so `npm run posthog-test` runs it under plain node.

import type { CaptureResult } from 'posthog-js'

/** The public pages: the home page and the marketing group, the stage check first. */
export const TRACKED_PATHS = [
  '/starter-pack',
  '/scripts',
  '/pathway',
  '/passport',
  '/five-questions',
  '/evidence',
  '/free',
  '/get-started',
  '/join',
  '/digi-squad',
  '/ban-workarounds',
  '/digitalwellbeing',
  '/contact',
  '/privacy',
  '/terms',
] as const

/** The stage check's steps, the only values stage_check_step may carry. */
export const STAGE_CHECK_STEPS = ['intro', 'q1', 'q2', 'q4', 'reassure', 'result', 'account'] as const

/** Our own events and the properties each may carry. */
const OWN_EVENTS: Record<string, string[]> = {
  stage_check_step: ['step'],
  account_created: [],
}

/** PostHog's own events we want. Anything else (autocapture, exceptions, surveys) is dropped. */
const SDK_EVENTS = new Set(['$pageview', '$pageleave'])

/**
 * PostHog's own properties without a $: the project key and the anonymous
 * visit id. Strip these and PostHog refuses the event.
 */
const SDK_KEYS = new Set(['token', 'distinct_id'])

/** Query parameters that say where a visit came from, and nothing about who. */
const KEPT_PARAMS = /^(utm_[a-z]+|ref)$/

/** Property keys that carry a URL or a path, wherever PostHog puts them. */
const URL_KEY = /(url|referrer|pathname|href)$/i

export function isTrackedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
  if (path === '/') return true
  return TRACKED_PATHS.some(p => path === p || path.startsWith(`${p}/`))
}

/**
 * One URL or path, cleaned. Our own: kept as path plus utm and ref when the
 * path is public, the bare host when it is not. Someone else's (a referrer
 * from Google or LinkedIn): origin and path, no query.
 */
export function cleanUrl(value: string, ownHost: string): string {
  if (!value || value === '$direct') return value
  const isPath = value.startsWith('/')
  let u: URL
  try { u = new URL(value, `https://${ownHost}`) } catch { return '' }
  const own = isPath || u.host === ownHost
  if (!own) return `${u.origin}${u.pathname}`
  if (!isTrackedPath(u.pathname)) return isPath ? '' : u.origin
  const kept = [...u.searchParams.entries()].filter(([k]) => KEPT_PARAMS.test(k))
  const query = kept.length ? `?${new URLSearchParams(kept)}` : ''
  return isPath ? `${u.pathname}${query}` : `${u.origin}${u.pathname}${query}`
}

function cleanProps(props: Record<string, unknown> | undefined, ownHost: string) {
  if (!props) return props
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    out[k] = typeof v === 'string' && URL_KEY.test(k) ? cleanUrl(v, ownHost) : v
  }
  return out
}

/** The path an event happened on, or null when it cannot be told (then it is dropped). */
function pageOf(props: Record<string, unknown>, ownHost: string): string | null {
  if (typeof props.$current_url === 'string') {
    try { return new URL(props.$current_url, `https://${ownHost}`).pathname } catch { return null }
  }
  return typeof props.$pathname === 'string' ? props.$pathname : null
}

/**
 * PostHog's before_send. Returns null to drop the event. The page it happened
 * on must be public; the event must be one we named; our own events keep only
 * their named properties plus PostHog's own $ ones.
 */
export function cleanEvent(event: CaptureResult | null, ownHost: string): CaptureResult | null {
  if (!event) return null
  const props = event.properties || {}
  if (!isTrackedPath(pageOf(props, ownHost))) return null

  let properties = props
  if (!SDK_EVENTS.has(event.event)) {
    const allowed = OWN_EVENTS[event.event]
    if (!allowed) return null
    properties = Object.fromEntries(Object.entries(props).filter(([k]) => k.startsWith('$') || SDK_KEYS.has(k) || allowed.includes(k)))
    if (event.event === 'stage_check_step' && !(STAGE_CHECK_STEPS as readonly unknown[]).includes(properties.step)) return null
  }

  return {
    ...event,
    properties: cleanProps(properties, ownHost) as CaptureResult['properties'],
    $set: cleanProps(event.$set, ownHost),
    $set_once: cleanProps(event.$set_once, ownHost),
  }
}
