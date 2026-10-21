'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { PostHog } from 'posthog-js'
import { isTrackedPath, cleanEvent, type STAGE_CHECK_STEPS } from '@/lib/analytics/posthog-policy'

// PostHog, on the public pages only. What it may see, and why, is
// lib/analytics/posthog-policy.ts; this file only decides when to load it.
//
// Off until NEXT_PUBLIC_POSTHOG_KEY is set. The SDK is a dynamic import that
// runs the first time a public page is open, so the child app and the
// dashboard never download it unless a parent arrived from a public page,
// and then cleanEvent drops everything they do there.
//
// persistence 'memory' is the privacy page's promise in code: no cookie and
// nothing in localStorage, so there is nothing to consent to. The cost is
// that a returning visitor counts as new, which the question we are asking
// (which page sends parents to the stage check) does not need.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

let loading: Promise<PostHog> | null = null

function start(): Promise<PostHog> {
  loading ??= import('posthog-js').then(({ default: posthog }) => {
    const host = window.location.host
    posthog.init(KEY!, {
      // First party: /ingest is rewritten to PostHog's EU cloud in next.config.ts.
      api_host: '/ingest',
      ui_host: 'https://eu.posthog.com',
      persistence: 'memory',
      person_profiles: 'never',
      capture_pageview: 'history_change',
      capture_pageleave: 'if_capture_pageview',
      autocapture: false,
      rageclick: false,
      capture_dead_clicks: false,
      capture_heatmaps: false,
      capture_exceptions: false,
      capture_performance: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_product_tours: true,
      disable_conversations: true,
      disable_web_experiments: true,
      disable_external_dependency_loading: true,
      advanced_disable_flags: true,
      before_send: event => cleanEvent(event, host),
    })
    return posthog
  })
  return loading
}

/**
 * Send one of our own named events. Starts PostHog itself when needed,
 * because React runs a page's effects before the layout's, so the stage
 * check's first step would otherwise fire before Analytics had loaded it.
 */
export function track(event: 'stage_check_step', props: { step: (typeof STAGE_CHECK_STEPS)[number] }): void
export function track(event: 'account_created'): void
export function track(event: string, props?: Record<string, unknown>) {
  if (!KEY || !isTrackedPath(window.location.pathname)) return
  start().then(ph => ph.capture(event, props)).catch(() => {})
}

export default function Analytics() {
  const pathname = usePathname()
  useEffect(() => {
    if (!KEY || !isTrackedPath(pathname)) return
    start().catch(() => {})
  }, [pathname])
  return null
}
