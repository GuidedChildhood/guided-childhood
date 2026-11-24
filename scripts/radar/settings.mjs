// The content engine's settings, read from config/content-engine.json
// (Justin, 24 November 2026: "one canonical configuration ... straightforward
// for me to change settings without editing multiple code files").
//
// Code reads settings through here and nowhere else, so a change to the JSON
// takes effect everywhere at once. A missing or broken file is an error, not a
// silent fallback: a run that quietly used old defaults would be the scattered
// rules problem again.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const SETTINGS_PATH = process.env.CONTENT_ENGINE_SETTINGS
  || fileURLToPath(new URL('../../config/content-engine.json', import.meta.url))

const REQUIRED = ['pause', 'linkedin', 'formats', 'scheduling', 'permissions', 'newsletter', 'notifications']

export function loadSettings(path = SETTINGS_PATH) {
  let s
  try { s = JSON.parse(readFileSync(path, 'utf8')) } catch (e) {
    throw new Error(`content engine settings unreadable at ${path}: ${e.message}`)
  }
  const missing = REQUIRED.filter((k) => !s[k])
  if (missing.length) throw new Error(`content engine settings missing: ${missing.join(', ')}`)
  if (s.permissions.E_automatic_publishing !== 'off' && s.permissions.E_automatic_publishing !== 'on') {
    throw new Error('permissions.E_automatic_publishing must be "off" or "on"')
  }
  return s
}

export const SETTINGS = loadSettings()

/** May ChatGPT schedule cleared posts right now? */
export function schedulingAllowed(s = SETTINGS) {
  return !s.pause.all && !s.pause.scheduling && /^standing/i.test(String(s.permissions.D_scheduling))
}

/** Automatic publishing is never inferred: only the exact word "on" turns it on. */
export function autoPublishAllowed(s = SETTINGS) {
  return !s.pause.all && s.permissions.E_automatic_publishing === 'on'
}

/** A format that is required, where appropriate, or only when asked. */
export function formatRule(name, s = SETTINGS) { return s.formats[name] || 'not_set' }
