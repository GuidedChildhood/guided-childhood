#!/usr/bin/env node
// Tests for the film check and the analytics register. Throwaway files only:
// nothing here touches the live research register or the live analytics
// register. Skips the film checks, saying so, where ffmpeg is not installed.
import { mkdtempSync, writeFileSync, readFileSync, truncateSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { probeVideo, haveFfmpeg, assetProblems } from './assets.mjs'
import { parsePaste, importPosts, publishedAtFromId, checkpointFor, report, loadRegister, applyTags, due, MIN_GROUP } from '../analytics/linkedin.mjs'

let pass = 0; let fail = 0
const ok = (name, cond, detail = '') => { if (cond) { pass++ } else { fail++; console.log(`FAIL  ${name} ${detail}`) } }
const dir = mkdtempSync(join(tmpdir(), 'gdc-assets-'))

if (haveFfmpeg()) {
  const good = join(dir, 'good.mp4')
  spawnSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=0xF6F0E4:s=540x674:r=30:d=4', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', good])
  const g = probeVideo(good)
  ok('a real four second film verifies', g.ok, g.problems.join('; '))
  ok('it reports no sound', g.facts?.audio === 'none, silent')
  ok('it reports that it plays through', g.facts?.playsThrough === true)
  const cut = join(dir, 'cut.mp4'); writeFileSync(cut, readFileSync(good)); truncateSync(cut, Math.floor(statSync(good).size * 0.6))
  ok('a film cut off part way does not verify', !probeVideo(cut).ok)
  const fake = join(dir, 'fake.mp4'); writeFileSync(fake, 'this is not a film '.repeat(200))
  ok('a text file named .mp4 does not verify', !probeVideo(fake).ok)
  const short = join(dir, 'short.mp4')
  spawnSync('ffmpeg', ['-v', 'error', '-f', 'lavfi', '-i', 'color=c=white:s=320x400:r=30:d=1', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', short])
  ok('a one second film is refused as too short', !probeVideo(short).ok)
} else {
  console.log('SKIPPED the film checks: ffmpeg is not installed here.')
}
ok('a missing file does not verify', !probeVideo(join(dir, 'nothing.mp4')).ok)
ok('an unverified asset holds a pack', assetProblems({ assets: [{ kind: 'motion', role: 'optional', file: 'x.mp4', verified: false, problems: ['cut off'], review: null }] }).length === 2)
ok('a verified, reviewed, optional asset does not hold a pack', assetProblems({ assets: [{ kind: 'motion', role: 'optional', file: 'x.mp4', verified: true, review: { verdict: 'PASS' } }] }).length === 0)
ok('a required asset that is not in Drive holds a pack', assetProblems({ assets: [{ kind: 'motion', role: 'required', file: 'x.mp4', verified: true, review: { verdict: 'PASS' } }] }).length === 1)
ok('a failed optional film does not hold a pack', assetProblems({ assets: [{ kind: 'motion', role: 'optional', failed: true, failure: 'render crashed' }] }).length === 0)
ok('a failed required film holds a pack', assetProblems({ assets: [{ kind: 'motion', role: 'required', failed: true, failure: 'render crashed' }] }).length === 1)
ok('no asset at all does not hold a pack', assetProblems({}).length === 0)

// The analytics register, on a made up screen in the real layout.
const U = (id) => `https://www.linkedin.com/feed/update/urn:li:activity:${id}?x=1`
const block = ({ id, age, paras, extras = [], counts = [], impressions }) => [
  `[Justin Phillips posted this • ${age}${age}](${U(id)})`,
  paras.join(' '),
  ...paras.map((p, i) => `[${p}${i === paras.length - 1 ? '…show more' : ''}](${U(id)})`), '',
  ...extras.map((e) => `[${e}](${U(id)})`), '',
  ...counts.map((c) => `* ${c}`),
  `[ ${impressions}](https://www.linkedin.com/analytics/post-summary/urn:li:activity:${id})`,
  `[Impressions](https://www.linkedin.com/analytics/post-summary/urn:li:activity:${id})`, '',
].join('\n')
const idAt = (iso) => String(BigInt(Date.parse(iso)) << 22n)
const cap = '2026-11-11T11:00:00Z'
const A = idAt('2026-11-08T08:00:00Z'); const B = idAt('2026-11-10T08:00:00Z'); const C = idAt('2026-10-20T08:00:00Z'); const D = idAt('2026-11-11T09:00:00Z')
const screen = [
  block({ id: A, age: '3d', paras: ['A study followed 100 pupils. It found little.', 'What would you count?'], extras: ['The title', 'Justin Phillips on LinkedIn • 2 min read'], counts: ['29', '', '18 comments', '5 reposts'], impressions: '4,545' }),
  block({ id: B, age: '1d', paras: ['One lesson gives three moves.', 'When would you use it?'], extras: ['The Class Chat', '7 pages'], counts: ['2'], impressions: '231' }),
  block({ id: C, age: '3w', paras: ['An older post.', 'A question?'], counts: ['8', '', '2 comments'], impressions: '22' }),
  block({ id: D, age: '2h', paras: ['A new post.', 'A question?'], impressions: '48' }),
].join('\n')
const posts = parsePaste(screen)
ok('every post on the screen is read', posts.length === 4, String(posts.length))
ok('impressions lose their comma', posts[0].metrics.impressions === 4545)
ok('reactions, comments and reposts are read', posts[0].metrics.reactions === 29 && posts[0].metrics.comments === 18 && posts[0].metrics.reposts === 5)
ok('a count the screen does not show is null, not zero', posts[1].metrics.comments === null && posts[3].metrics.reactions === null)
ok('what the screen never shows is null', posts[0].metrics.clicks === null && posts[0].metrics.saves === null && posts[0].metrics.followerChange === null)
ok('an article share is recognised', posts[0].format === 'article share')
ok('a document is recognised with its pages', posts[1].format === 'document, 7 pages')
ok('the hook is the first sentence', posts[0].hook === 'A study followed 100 pupils.')
ok('the title of an attachment is not counted as body', posts[0].words === 12, String(posts[0].words))
ok('the publication time comes from the id', publishedAtFromId(A) === '2026-11-08T08:00:00.000Z')
ok('a nonsense id gives no date', publishedAtFromId('12345') === null)
ok('checkpoints are bands, not exact hours', checkpointFor(24) === '24h' && checkpointFor(75) === '72h' && checkpointFor(168) === '7d' && checkpointFor(45) === null)
const regPath = join(dir, 'reg.json')
const r1 = importPosts(posts, { capturedAt: cap, windowDays: 7, sourceText: screen, path: regPath })
ok('the import adds every post', r1.added === 4)
const r2 = importPosts(posts, { capturedAt: cap, windowDays: 7, sourceText: screen, path: regPath })
ok('the same screen is not imported twice', r2.already === true && Object.values(loadRegister(regPath).posts).every((p) => p.snapshots.length === 1))
const reg = loadRegister(regPath)
ok('a post from before the window is marked partial', reg.posts[C].snapshots[0].partial === true && reg.posts[A].snapshots[0].partial === false)
ok('a partial reading is never given a checkpoint', reg.posts[C].snapshots[0].checkpoint === null)
ok('a three day old post lands on the 72 hour checkpoint', reg.posts[A].snapshots[0].checkpoint === '72h')
let threw = false; try { importPosts(posts, { path: regPath }) } catch { threw = true }
ok('an import with no capture time is refused', threw)
applyTags({ [A]: { lane: 'evidence led', registerRow: 'GDC-049', registerStatus: 'RETIRED 9 Nov, not posted' }, [B]: { lane: 'product led' } }, { path: regPath })
const text = report({ path: regPath })
ok('the report says the sample is under ten', /Under ten, so nothing below is a rule/.test(text))
ok('the report will not rank a small group', text.includes('is too few') && !/\| yes \|/.test(text))
ok('a post under a day old is kept out of the comparison', /Too early to read/.test(text) && !/\| 48 \|/.test(text))
ok('a partial post is kept out of the comparison', /partial counts only/.test(text))
ok('a live post the number register calls retired is listed, not changed', /register says RETIRED 9 Nov, not posted/.test(text))
ok('the report names what was not captured', /Clicks, saves, sends, follower change/.test(text))
ok('the report has no dash', !new RegExp('[\\u2010-\\u2015\\u2212]').test(text))
ok('a second reading on a later day is a second snapshot', (() => { const later = posts.map((p) => ({ ...p, metrics: { ...p.metrics, impressions: (p.metrics.impressions || 0) + 10 } })); importPosts(later, { capturedAt: '2026-11-12T11:00:00Z', windowDays: 7, sourceText: screen + ' later', path: regPath }); return loadRegister(regPath).posts[A].snapshots.length === 2 })())
ok('due lists a checkpoint that could be read now', due({ at: '2026-11-15T09:00:00Z', path: regPath }).some((x) => x.activityId === A && x.checkpoint === '7d'))
ok('the ranking floor is five', MIN_GROUP === 5)

console.log(`${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
