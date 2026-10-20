// Every stage check start, counted by source (migration 379), checked without
// a database.
//
// Review board, 13 October 2026: the target is 1,000 stage checks and nothing
// could say how many had begun, or which post sent them. The things that would
// make the Friday number lie again are pinned here:
//
//   a start with no film cookie going uncounted, which is where we started
//   a reload counted as a second start
//   ?src= on the printed Planet Post going unread again
//   the no link rows becoming a way in (/v/direct)
//   the counts reachable from a browser, which they never need to be
//
// Usage: node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs scripts/check-stage-sources.mjs

import { readFileSync } from 'node:fs'
import { startCode, CHANNELS, LINK_CHANNELS, CHANNEL_LABEL, SHARE_CODE, NO_LINK_CODES } from '../lib/video/link.ts'

let failures = 0
const check = (name, ok, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ' + detail : ''}`)
}
const read = p => readFileSync(p, 'utf8')

// ── WHICH CODE A START COUNTS AGAINST ──────────────────────────────────────
check('a followed link wins', startCode({ video: 'fb-1021-phone-policy', referral: 'SARAH47', school: 'st-marys' }) === 'fb-1021-phone-policy')
check('then a member’s referral link', startCode({ referral: 'SARAH47', school: 'st-marys' }) === 'referral')
check('then a school newsletter', startCode({ school: 'st-marys' }) === 'school')
check('and with no link at all the start is still counted', startCode({}) === 'direct')
check('a reload is not a second start', startCode({ video: 'digi-hero', started: 'digi-hero' }) === null
  && startCode({ started: 'direct' }) === null)
check('a new follow after a direct start is a new start', startCode({ video: 'digi-hero', started: 'direct' }) === 'digi-hero')
check('a cookie that could not be a code counts as no link', startCode({ video: '../x' }) === 'direct')

check('every channel has a label', CHANNELS.every(c => typeof CHANNEL_LABEL[c] === 'string' && CHANNEL_LABEL[c].length > 1))
check('the no link rows are never offered as a link',
  Object.values(NO_LINK_CODES).every(c => !LINK_CHANNELS.includes(c)))

// ── THE TABLE ───────────────────────────────────────────────────────────────
const sql = read('supabase/migrations/379_stage_checks_by_source.sql').replace(/--[^\n]*/g, '')
const channelList = sql.match(/check \(channel in \(([\s\S]*?)\)\)/)?.[1] ?? ''
check('the database allows exactly the channels the app knows',
  CHANNELS.every(c => channelList.includes(`'${c}'`)) && (channelList.match(/'/g) ?? []).length === CHANNELS.length * 2)
check('the no link rows are switched off, so /v/direct is not a way in',
  /\('direct',[^\n]*false\)/.test(sql) && /\('referral',[^\n]*false\)/.test(sql) && /\('school',[^\n]*false\)/.test(sql))
check('the printed and published ?src= codes are links from day one',
  ['planet-post-1', 'guided-planet-001', 'guided-planet-002'].every(c => sql.includes(`'${c}'`)))
check('the share action’s code is a link', sql.includes(`'${SHARE_CODE}'`))
check('the counts are service role only',
  /revoke all on public\.video_link_counts from anon, authenticated/.test(sql)
  && !/grant[^;]*video_link_counts[^;]*to[^;]*(anon|authenticated)/.test(sql))

// ── THE WAYS IN ─────────────────────────────────────────────────────────────
const started = read('app/api/video-link/started/route.ts')
check('the start counter counts every visitor, not only film cookie holders',
  /startCode\(\{/.test(started) && /REF_COOKIE/.test(started) && /SCHOOL_LINK_COOKIE/.test(started))
const pack = read('app/(marketing)/starter-pack/page.tsx')
check('the stage check reads ?src= and hands it to the server',
  /params\.get\('src'\)/.test(pack) && /fetch\('\/api\/video-link\/follow'/.test(pack))
check('and takes it out of the address bar, so a reload is not a second follow', /params\.delete\('src'\)/.test(pack))
const v = read('app/v/[code]/route.ts')
const follow = read('app/api/video-link/follow/route.ts')
check('/v/ and ?src= follow a link the same way', /followLink\(/.test(v) && /followLink\(/.test(follow)
  && /rememberLink\(/.test(v) && /rememberLink\(/.test(follow))
check('a follow only counts a live link', /\.eq\('active', true\)/.test(read('lib/video/follow.ts')))

// ── THE FOUNDER PAGE AND THE SUNDAY BATCH ──────────────────────────────────
const page = read('app/(dashboard)/dashboard/admin/videos/page.tsx')
check('the founder page is founder only', /!== FOUNDER_EMAIL\) redirect\('\/dashboard'\)/.test(page))
check('and leads with the Friday number', /fridayNumber/.test(page) && /data-friday-number/.test(read('app/(dashboard)/dashboard/admin/videos/VideoLinks.tsx')))
const week = read('tools/social-cards/week.mjs')
check('the Sunday batch gives every Facebook post its own link', /postCode\('fb'/.test(week) && /guidedchildhood\.com\/v\/\$\{code\}/.test(week))

console.log(`\n${failures === 0 ? 'all passed' : failures + ' failed'}`)
process.exit(failures === 0 ? 0 : 1)
