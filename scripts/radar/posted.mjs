// "Get Claude to check at the end that the post has actually been posted."
// Justin, 9 November 2026.
//
// What this can and cannot do, measured rather than assumed, on 9 November:
//
//   a LinkedIn post URL that does not exist   returns 404
//   the LinkedIn root                         returns 200
//
// So a liveness check is real: a 404 means the post is not there. What a 200
// does NOT prove is that the post is yours, says what you meant, or is public,
// because logged out LinkedIn serves a wall rather than the post body. There is
// no LinkedIn tool in this session and no API key, so the content cannot be
// read. That is the honest ceiling and the output says so every time.
//
// This is why nothing is ever marked PUBLISHED without a URL. A tick on the
// desk is Justin's memory. A URL that answers is evidence.

import { get } from './sources.mjs'
import * as reg from './register.mjs'

const PLATFORMS = [
  { name: 'LinkedIn', re: /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed\/update|pulse)\//i,
    note: 'LinkedIn serves a login wall to a logged out request, so a 200 confirms the URL resolves, not that the post is public or that it is the right one.' },
  { name: 'Substack', re: /^https?:\/\/[a-z0-9-]+\.substack\.com\/p\//i,
    note: 'A Substack post page is normally readable, so a 200 here is stronger evidence than on LinkedIn.' },
  { name: 'Instagram', re: /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\//i,
    note: 'Instagram blocks logged out reads heavily. Treat any result as weak.' },
  { name: 'YouTube', re: /^https?:\/\/(www\.)?(youtube\.com\/(watch|shorts)|youtu\.be)\//i, note: '' },
]

/**
 * Check one URL. Returns a verdict and never pretends to more certainty than
 * the HTTP status supports.
 */
export async function checkUrl(url) {
  const platform = PLATFORMS.find((p) => p.re.test(url))
  const r = await get(url, { ttlHours: 0, retries: 1, timeoutMs: 20000 })

  let verdict
  if (r.status === 404 || r.status === 410) verdict = 'NOT LIVE'
  else if (r.status >= 200 && r.status < 300) verdict = 'URL RESOLVES'
  else if (r.status === 401 || r.status === 403 || r.status === 999) verdict = 'BLOCKED, CANNOT TELL'
  else if (r.status === 0) verdict = 'NO ANSWER, CANNOT TELL'
  else verdict = `UNEXPECTED ${r.status}`

  return {
    url,
    platform: platform?.name || 'unrecognised platform',
    httpStatus: r.status,
    verdict,
    bytes: (r.body || '').length,
    checkedAt: new Date().toISOString(),
    ceiling: platform?.note || 'No platform rule for this URL, so only the HTTP status is being reported.',
    provesItIsLive: verdict === 'URL RESOLVES',
    provesItIsOurs: false,
    provesTheContent: false,
  }
}

/**
 * Mark a research record PUBLISHED, but only on evidence.
 * Refuses on a 404 and refuses when the check could not reach the page.
 */
export async function markPublished(studyId, url, { force = false } = {}) {
  const rec = reg.get(studyId)
  if (!rec) throw new Error(`no such study: ${studyId}`)
  const check = await checkUrl(url)

  if (!check.provesItIsLive && !force) {
    return { ok: false, check, message:
      `Not marking ${studyId} PUBLISHED. The URL check came back ${check.verdict} (HTTP ${check.httpStatus}). ` +
      'Either the post is not there, or this container cannot see it. Pass force only if you have the post open in front of you.' }
  }

  reg.upsert({ ...rec, status: 'PUBLISHED', publishedUrl: url, publishedCheck: check, publishedAt: new Date().toISOString() },
    { reason: force ? 'marked PUBLISHED on Justin\'s word, URL check could not confirm' : `marked PUBLISHED, URL check ${check.verdict}`, actor: 'radar:posted' })

  return { ok: true, check, message:
    `${studyId} marked PUBLISHED. The URL answers (HTTP ${check.httpStatus}). ` +
    `What that does not prove: ${check.ceiling}` }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , a, b] = process.argv
  if (!a) {
    console.log('usage:')
    console.log('  node scripts/radar/posted.mjs <url>                 check a URL only')
    console.log('  node scripts/radar/posted.mjs <studyId> <url>       check and mark PUBLISHED')
    process.exit(0)
  }
  const run = b ? markPublished(a, b) : checkUrl(a).then((c) => ({ ok: true, check: c, message: '' }))
  run.then(({ ok, check, message }) => {
    console.log(`\n${check.verdict}   HTTP ${check.httpStatus}   ${check.bytes} bytes`)
    console.log(`platform: ${check.platform}`)
    console.log(`live: ${check.provesItIsLive}   ours: ${check.provesItIsOurs} (cannot be checked)   content: ${check.provesTheContent} (cannot be checked)`)
    console.log(`\n${check.ceiling}`)
    if (message) console.log(`\n${message}`)
    if (!ok) process.exitCode = 1
  })
}
