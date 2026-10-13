// The printed paper itself: both issues render clean through the SAME
// templates (acceptance criterion 10), the PDFs are twelve embedded font A4
// pages, the text is selectable, the art is separate from the words, and the
// pages still look like the approved baselines (visual regression).
//
// Slow (a minute or so): it renders both issues. Refresh the baselines after a
// design change Justin has approved with UPDATE_BASELINES=1.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'
import { renderEdition, issueDir, loadIssue } from '../pdf-engine/render'
import { contentHash, sha256 } from '../engine/hash'
import { FileStore } from '../engine/store'
import { transition, type Actor } from '../engine/workflow'
import { publish } from '../distribution/publish'
import { PUB } from '../engine/library'

const BASE = join(PUB, 'tests', 'baselines')
const W = 300 // baselines are small: enough to catch a moved block, cheap to keep in git

async function diffRatio(a: string, b: Buffer) {
  const [x, y] = await Promise.all([sharp(a).resize(W).raw().toBuffer(), sharp(b).resize(W).raw().toBuffer()])
  if (x.length !== y.length) return 1
  let changed = 0
  for (let i = 0; i < x.length; i += 3) if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 60) changed++
  return changed / (x.length / 3)
}

for (const n of [1, 2]) {
  test(`issue ${n} renders clean through the shared templates`, { timeout: 240000 }, async () => {
    const r = await renderEdition(n)
    const errs = [...r.editorial, ...Object.values(r.layout).flat()].filter(f => f.level === 'error')
    assert.deepEqual(errs, [], JSON.stringify(errs.slice(0, 5)))
    assert.ok(r.ok)
    for (const p of r.pdf) {
      assert.equal(p.pages, 12, p.file)
      assert.ok(p.fontsEmbedded, p.file)
    }
  })

  test(`issue ${n}: the words are text, not pictures`, () => {
    const NNN = String(n).padStart(3, '0')
    const text = execFileSync('pdftotext', ['-layout', join(issueDir(n), 'dist', `guided-planet-${NNN}.pdf`), '-'], { encoding: 'utf8' })
    const issue = loadIssue(n)
    for (const p of issue.pages) if ('headline' in p) {
      const words = p.headline.replace(/[.?,]/g, '').split(/\s+/).slice(0, 3).join(' ')
      assert.ok(text.replace(/[.?,]/g, '').replace(/\s+/g, ' ').includes(words), `page ${p.n} headline "${words}" is not selectable text`)
    }
  })

  test(`issue ${n} still looks like its approved baseline`, { timeout: 60000 }, async () => {
    const dir = join(BASE, `issue-${String(n).padStart(3, '0')}`)
    const pages = join(issueDir(n), 'dist', 'pages')
    if (process.env.UPDATE_BASELINES || !existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
      for (const f of readdirSync(pages)) await sharp(join(pages, f)).resize(W).png({ palette: true }).toFile(join(dir, f))
      return
    }
    for (const f of readdirSync(dir)) {
      const ratio = await diffRatio(join(dir, f), readFileSync(join(pages, f)))
      assert.ok(ratio < Number(process.env.PLANET_BASELINE_TOLERANCE ?? 0.02), `${f} changed: ${(ratio * 100).toFixed(1)}% of pixels moved. If the change is approved, run with UPDATE_BASELINES=1.`)
    }
  })
}

test('publishing is idempotent: a channel runs once per approved PDF', { timeout: 60000 }, async () => {
  const work = mkdtempSync(join(tmpdir(), 'planet-pub-'))
  const dir = join(work, 'issue'); const web = join(work, 'web')
  mkdirSync(join(dir, 'dist'), { recursive: true }); mkdirSync(join(dir, 'package'), { recursive: true }); mkdirSync(web, { recursive: true })
  cpSync(join(issueDir(1), 'dist'), join(dir, 'dist'), { recursive: true })
  cpSync(join(issueDir(1), 'distribution.json'), join(dir, 'distribution.json'))
  writeFileSync(join(dir, 'package', 'email.html'), '<p>test</p>')
  writeFileSync(join(web, 'vercel.json'), JSON.stringify({ rewrites: [] }))

  const store = new FileStore(join(work, 'store'))
  const routine: Actor = { kind: 'automation', id: 't' }, justin: Actor = { kind: 'founder', id: 'justin' }
  const pdfHash = sha256(readFileSync(join(dir, 'dist', 'guided-planet-001.pdf')))
  const c = contentHash(loadIssue(1))
  await transition(store, 1, 'RESEARCHED', routine); await transition(store, 1, 'VERIFIED', routine)
  await transition(store, 1, 'EDITORIAL_REVIEW', routine, { storiesHash: 'h' })
  await assert.rejects(publish(1, 'website', store, justin, { dir, webRoot: web }), /final approval/)
  await transition(store, 1, 'APPROVED', justin, { storiesHash: 'h' }); await transition(store, 1, 'DESIGNING', routine)
  await transition(store, 1, 'PROOF_READY', routine, { contentHash: c, pdfHash, renderOk: true })
  await transition(store, 1, 'FINAL_APPROVED', justin, { contentHash: c, pdfHash })

  // The routine with no authorisation is refused.
  await assert.rejects(publish(1, 'website', store, routine, { dir, webRoot: web }), /no publication authorised/)

  const first = await publish(1, 'website', store, justin, { dir, webRoot: web })
  assert.equal(first.already, false)
  assert.ok(existsSync(join(web, 'public', 'guided-planet', 'issue-001', 'index.html')))
  assert.ok(existsSync(join(web, 'public', 'guided-planet', 'issue-001', 'guided-planet-001.pdf')))
  const again = await publish(1, 'website', store, justin, { dir, webRoot: web })
  assert.equal(again.already, true)
  const rewrites = JSON.parse(readFileSync(join(web, 'vercel.json'), 'utf8')).rewrites
  assert.equal(rewrites.length, 2)

  // Mailchimp: a draft campaign, made once, never sent.
  process.env.MAILCHIMP_API_KEY = 'k'; process.env.MAILCHIMP_SERVER = 'us1'; process.env.MAILCHIMP_AUDIENCE_ID = 'list'
  const calls: string[] = []
  const fake = (async (url: string, init?: RequestInit) => { calls.push(`${init?.method} ${url}`); return new Response(JSON.stringify({ id: 'camp1' }), { status: 200 }) }) as unknown as typeof fetch
  await publish(1, 'mailchimp', store, justin, { dir, webRoot: web, fetch: fake })
  await publish(1, 'mailchimp', store, justin, { dir, webRoot: web, fetch: fake })
  assert.deepEqual(calls, ['POST https://us1.api.mailchimp.com/3.0/campaigns', 'PUT https://us1.api.mailchimp.com/3.0/campaigns/camp1/content'])
  assert.ok(!calls.some(c => c.includes('/actions/send')), 'the engine must never send a campaign')
})
