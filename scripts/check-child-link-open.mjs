#!/usr/bin/env node
// THE CHILD LINK OPENS WITH NO PASSWORD (Justin, 15 November 2026).
//
// Setup now tells a parent: "Send them their own link. It opens their app,
// nothing to download, no password." That is only true while /k/ stays out of
// the signed in prefixes and the child page never asks for a session. This
// fails the moment either changes, so the promise and the code move together.
//
// Node builtins only.   node scripts/check-child-link-open.mjs
import { readFileSync } from 'node:fs'

const fails = []
const mw = readFileSync('middleware.ts', 'utf8')
const prefixes = (mw.match(/protectedPrefixes\s*=\s*\[([^\]]*)\]/) || [])[1] ?? ''
if (!prefixes) fails.push('middleware.ts: protectedPrefixes not found, cannot check /k/')
if (/['"]\/k['"\/]/.test(prefixes)) fails.push('middleware.ts: /k/ is behind sign in')

const page = readFileSync('app/k/[token]/page.tsx', 'utf8')
if (/auth\.getUser\(|redirect\(\s*['"]\/login/.test(page)) fails.push('app/k/[token]/page.tsx: the child page asks for a signed in user')

const steps = readFileSync('lib/setup/steps.ts', 'utf8')
if (!/no password/i.test(steps)) fails.push('lib/setup/steps.ts: the setup step no longer says no password (update this guard with it)')

if (fails.length) {
  console.error('check-child-link-open FAILED\n')
  for (const f of fails) console.error('  ' + f)
  process.exit(1)
}
console.log('check-child-link-open ok: the child link opens with no sign in, as setup promises.')
