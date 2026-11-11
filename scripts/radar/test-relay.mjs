// End to end test of the relay: a research candidate arrives the way ChatGPT
// would send it, and is followed all the way to PUBLISHED.
//
// Everything happens in a throwaway register and against a COPY of the post
// register, so no real record ever carries a test pack and no real number is
// spent. The last checks prove that by comparing digests of the live files.
//
// Two things here are simulated, and are named as simulated wherever they
// appear, because the brief's rule is that one component is never silently
// substituted for another:
//
//   The candidate document. ChatGPT cannot be started from a script, so the
//   test writes the document ChatGPT would write. It is marked as a test in
//   its own createdBy field.
//
//   The production response. The pack is the shared fixture from
//   fixtures.mjs, not something ChatGPT wrote.
//
// What this does not cover is the transport to and from Drive, which a Node
// process cannot reach. That was run for real on 10 November and is recorded
// in content/research-register/sync-state.json and the run log.

import { mkdtempSync, readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

const LIVE_DIR = join(process.cwd(), 'content/research-register')
const LIVE = { index: join(LIVE_DIR, 'index.json'), jsonl: join(LIVE_DIR, 'studies.jsonl'), posts: join(process.cwd(), 'content/gdc-post-register.md') }
const digest = (p) => createHash('sha256').update(readFileSync(p)).digest('hex')
const before = Object.fromEntries(Object.entries(LIVE).map(([k, p]) => [k, digest(p)]))

const TMP = mkdtempSync(join(tmpdir(), 'radar-relay-test-'))
process.env.RADAR_REGISTER = TMP
const POSTS = join(TMP, 'gdc-post-register.md')
// The copy has the test study's own row taken out, so that here the story has
// no number yet. POSTS_WITH_ROW keeps it, for the check that a row claimed by
// hand is adopted and not claimed a second time.
const POSTS_WITH_ROW = join(TMP, 'gdc-post-register-with-row.md')
copyFileSync(LIVE.posts, POSTS_WITH_ROW)
writeFileSync(POSTS, readFileSync(LIVE.posts, 'utf8').split('\n').filter((l) => !l.includes('GDC-RR-0754a1641c.**')).join('\n'))

const reg = await import('./register.mjs')
const P = await import('./pipeline.mjs')
const K = await import('./candidates.mjs')
const C = await import('./contract.mjs')
const D = await import('./daily.mjs')
const F = await import('./packformat.mjs')
const { fixturePackText } = await import('./fixtures.mjs')

let failed = 0; let count = 0
const check = (name, ok, detail = '') => {
  count += 1
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}${detail ? `  [${String(detail).slice(0, 120)}]` : ''}`)
  if (!ok) failed += 1
}
const section = (t) => console.log(`\n${t}`)
const isHold = (r) => r?.verdict === 'HOLD' && r.reasons?.length > 0
const opt = { postRegisterPath: POSTS }

// The candidate: the one study we hold a real review and a passing fixture
// pack for, arriving as if it were new. The throwaway register is empty, so
// here it IS new.
const DOI = '10.1177/13591045261487468'
const batch = {
  schema: K.SCHEMA_ID,
  batchId: '2026-11-10-test-relay',
  createdAt: '2026-11-10T08:00:00Z',
  createdBy: 'TEST, simulated ChatGPT 08:00 run, written by scripts/radar/test-relay.mjs',
  candidates: [
    { candidateId: 'C-TEST-01', researchId: null, title: 'Mental Health Effects of Social Media Use Among Adolescents Across Educational Stages: A Meta-Analysis',
      sourceType: 'journal-article', originalUrl: `https://doi.org/${DOI}`, doi: DOI, publisher: 'Clinical Child Psychology and Psychiatry', publicationDate: '2026-11-06',
      summary: 'A meta analysis pooling correlations between social media use and adolescent mental health.',
      candidateClaims: [{ claim: 'The pooled correlation is far larger than earlier estimates, which proves social media damages children.', figure: 'r = 0.308', whereInSource: 'abstract' }],
      limitations: ['It pools correlations, so it cannot show cause.'], suggestedFormats: ['linkedin', 'reel'] },
    { candidateId: 'C-TEST-02', researchId: null, title: 'A second candidate with nothing to check it against', sourceType: 'news-report', originalUrl: 'not a link', publicationDate: 'yesterday', candidateClaims: [], limitations: [] },
  ],
}
const asJson = JSON.stringify(batch, null, 1)

// ===========================================================================
section('1. THE INBOX: reading what Drive returns')
// ===========================================================================
check('a plain JSON file is read', K.extractJson(asJson).ok)
check('JSON inside a code fence in a markdown file is read', K.extractJson(`# Candidates\n\n\`\`\`json\n${asJson}\n\`\`\`\n`).ok)
const mangled = `\uFEFF${asJson.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/_/g, '\\_').replace(/\n/g, '\r\n')}`
check('a Google Doc export with a byte order mark and Drive escapes is read', K.extractJson(mangled).ok, K.extractJson(mangled).how)
check('smart quotes from a word processor do not defeat it', K.extractJson(asJson.replace(/"schema"/, '\u201Cschema\u201D')).ok)
check('prose with no JSON in it is a HOLD, not an empty batch', isHold(K.ingestBatch('Today I found three interesting studies about phones.', opt)))
check('a document in another shape is a HOLD', isHold(K.ingestBatch(JSON.stringify({ posts: [] }), opt)))
check('a batch claiming an invented research id is refused', K.validateBatch({ ...batch, candidates: [{ ...batch.candidates[0], researchId: 'GDC-RR-ffffffffff' }] }).candidates[0].errors.some((e) => /not in the research register/.test(e)))
check('thirteen candidates is a dump, not a selection, and is refused', !K.validateBatch({ ...batch, candidates: Array.from({ length: 13 }, (_, i) => ({ ...batch.candidates[0], candidateId: `C-${i}xx` })) }).ok)

// ===========================================================================
section('2. INGEST: new, held, and never twice')
// ===========================================================================
const first = K.ingestBatch(mangled, { ...opt, source: { fileId: 'drive-test-id', title: 'CANDIDATES 2026-11-10' } })
const got = first.results.find((r) => r.candidateId === 'C-TEST-01')
const ID = got?.researchId
check('the batch is read and every candidate has an outcome', first.verdict === 'PASS' && first.results.length === 2)
check('the new candidate becomes a register record', got?.outcome === 'INGESTED' && !!reg.get(ID), ID)
check('it enters as DISCOVERED, exactly like a record the radar found itself', reg.get(ID).status === 'DISCOVERED' && !reg.get(ID).claudeStatus)
check('its claims are stored as UNVERIFIED, under candidate, and nowhere a figure could be quoted from', /UNVERIFIED/.test(reg.get(ID).candidate.standing) && !reg.get(ID).claudeReview)
check('the broken candidate is HELD with its reasons', first.results.find((r) => r.candidateId === 'C-TEST-02').outcome === 'HELD' && first.results.find((r) => r.candidateId === 'C-TEST-02').reasons.length >= 3)
const versionAfterFirst = reg.get(ID).version
const again = K.ingestBatch(mangled, opt)
check('the same document a second time changes nothing', again.alreadyIngested === true && reg.get(ID).version === versionAfterFirst && reg.all().length === 1)
const revised = K.ingestBatch(JSON.stringify({ ...batch, createdAt: '2026-11-10T08:05:00Z' }, null, 1), opt)
check('a revised copy of the same batch does not take the candidate in twice', revised.results.find((r) => r.candidateId === 'C-TEST-01').outcome === 'ALREADY INGESTED' && reg.all().length === 1)
const tomorrow = K.ingestBatch(JSON.stringify({ ...batch, batchId: '2026-11-11-test-relay', candidates: [{ ...batch.candidates[0], candidateId: 'C-TEST-09' }] }), opt)
check('the same study sent tomorrow under a new id is a DUPLICATE of the register', tomorrow.results[0].outcome === 'DUPLICATE' && tomorrow.results[0].where === 'RESEARCH REGISTER' && reg.all().length === 1, tomorrow.results[0].reasons[0])
check('and the record notes that it was sent again', reg.get(ID).candidateRefs?.length === 1)

section('2b. DEDUPLICATION against what has been written and published')
const fresh = { candidateId: 'C-TEST-X1', title: 'An entirely unrelated paper about hedgehog migration in suburban gardens', sourceType: 'journal-article', originalUrl: 'https://doi.org/10.5555/hedgehogs.2026', doi: '10.5555/hedgehogs.2026', publicationDate: '2026-11-01', candidateClaims: [{ claim: 'Hedgehogs move further in wet autumns.' }], limitations: ['One county.'] }
check('something new is not called a duplicate', K.dedupe(fresh, opt).duplicate === false)
check('a source already cited in a published or archived post is caught', K.dedupe(fresh, { ...opt, corpus: [{ id: 'GDC-030', title: 'Hedgehogs', body: 'The paper: https://doi.org/10.5555/hedgehogs.2026' }] }).where === 'PUBLISHED OR ARCHIVED POST')
check('a source already in ChatGPT\'s posting pack is caught', K.dedupe(fresh, { ...opt, corpus: [], postingPackText: 'Queued: doi.org/10.5555/hedgehogs.2026 for Thursday' }).where === 'POSTING PACK')
const row = C.parsePostRegister(POSTS).find((r) => r.posted)
check('a title that repeats a numbered post is caught in the post register', K.dedupe({ ...fresh, title: row.title }, { ...opt, corpus: [] }).where === 'POST REGISTER', `GDC-${row.number}`)

// ===========================================================================
section('3. VERIFICATION: the dossier and the directed review')
// ===========================================================================
check('no number can be claimed for a candidate that has not been reviewed', isHold(P.claimNumber(ID, opt)))
check('no handoff can be built from a candidate', isHold(P.handoff(ID, opt)))
const review = JSON.parse(readFileSync(join(process.cwd(), 'scripts/radar/reviews/GDC-RR-0754a1641c.json'), 'utf8'))
review.studyId = ID
check('a review cannot be stored before the automatic check has run', isHold(P.storeReview(ID, review)))
// The automatic check needs the network, so its result is written here as the
// dossier would write it. test-drop and the live run exercise the real one.
reg.upsert({ ...reg.get(ID), status: 'VERIFIED', claudeStatus: 'PENDING', dossier: { studyId: ID, checkedAt: new Date().toISOString(), doi: DOI, doiResolves: true, automaticVerdict: 'RECORD CONFIRMED', notes: [] } }, { reason: 'test, dossier as the automatic check would store it', actor: 'test' })
check('a review with no claims is refused', isHold(P.storeReview(ID, { ...review, claims: [] })))
check('a review that found no limits is refused', isHold(P.storeReview(ID, { ...review, limitations: [] })))
check('a review with a made up claim status is refused', isHold(P.storeReview(ID, { ...review, claims: [{ claim: 'x is true', status: 'PROBABLY', basis: 'a feeling' }] })))
check('a review dated in the future is refused', isHold(P.storeReview(ID, { ...review, reviewedAt: new Date(Date.now() + 3600000).toISOString() })))
check('a review with a dash in it is refused, because its text goes into the handoff', isHold(P.storeReview(ID, { ...review, oneStory: 'A study \u2014 a big one' })))
check('a review for a different record is refused', isHold(P.storeReview(ID, { ...review, studyId: 'GDC-RR-0000000000' })))
check('status has not moved while reviews were being refused', reg.get(ID).status === 'VERIFIED' && reg.get(ID).claudeStatus !== 'CLAUDE REVIEWED')
const stored = P.storeReview(ID, { ...review, recommendedPlatforms: ['LinkedIn post'] })
check('a complete review is stored and the story becomes EDITORIAL READY', stored.verdict === 'PASS' && reg.get(ID).status === 'EDITORIAL READY' && reg.get(ID).claudeStatus === 'CLAUDE REVIEWED')
check('the sender\'s causal claim is nowhere in the cleared figures', !JSON.stringify(reg.get(ID).claudeReview.verifiedStatistics).includes('proves'))

// ===========================================================================
section('4. THE NUMBER: claimed in the GitHub register, once')
// ===========================================================================
const adopt = P.claimNumber(ID, { postRegisterPath: POSTS_WITH_ROW })
check('a row already claimed by hand for this record is adopted, not claimed twice', adopt.verdict === 'PASS' && adopt.claimed === false && adopt.gdcPostNumber === '054' && C.parsePostRegister(POSTS_WITH_ROW).length === C.parsePostRegister(LIVE.posts).length)
reg.upsert({ ...reg.get(ID), gdcPostNumber: null }, { reason: 'test, back to no number for the fresh claim', actor: 'test' })
const freeBefore = C.nextFreeNumber(POSTS)
const rowsBefore = C.parsePostRegister(POSTS).length
const claimed = P.claimNumber(ID, opt)
check('the next free number is claimed', claimed.verdict === 'PASS' && claimed.claimed === true && claimed.gdcPostNumber === freeBefore, `GDC-${claimed.gdcPostNumber}`)
check('exactly one row was added to the register file', C.parsePostRegister(POSTS).length === rowsBefore + 1 && C.parsePostRegister(POSTS).some((r) => r.number === freeBefore && r.claimed && r.state.includes(ID)))
check('the next free number moved on by one', C.nextFreeNumber(POSTS) === String(Number(freeBefore) + 1).padStart(3, '0') && readFileSync(POSTS, 'utf8').includes(`**Next free number: ${C.nextFreeNumber(POSTS)}.**`))
check('claiming again returns the same number and adds nothing', P.claimNumber(ID, opt).gdcPostNumber === freeBefore && P.claimNumber(ID, opt).claimed === false && C.parsePostRegister(POSTS).length === rowsBefore + 1)
check('no number is claimed twice', C.internalNumberConflicts(POSTS).length === 0)
const NUM = claimed.gdcPostNumber

// ===========================================================================
section('5. THE HANDOFF QUEUE, and what the production side reads')
// ===========================================================================
const hands = await D.handoffs(opt)
check('the daily handoff stage builds the handoff', hands.verdict === 'PASS' && hands.detail.built.length === 1 && reg.get(ID).handoff?.version === 1, JSON.stringify(hands.detail.built))
const second = await D.handoffs(opt)
check('running it again builds nothing', second.detail.built.length === 0 && second.detail.alreadyCurrent.includes(ID) && reg.get(ID).handoff.version === 1)
const manifest = JSON.parse(readFileSync(join(TMP, 'manifest.json'), 'utf8'))
check('the story is in the manifest queue with its number and handoff version', manifest.queue.length === 1 && manifest.queue[0].researchId === ID && manifest.queue[0].gdcPostNumber === NUM && manifest.queue[0].handoffVersion === 1)
const brief = F.stage2Brief()
check('the start here document lists the story under WHAT TO WRITE', brief.text.includes(`STORY 1 OF 1: ${ID}, GDC-${NUM}`))
check('with its own cleared figures', brief.text.includes('r = 0.308') && brief.text.includes('I squared = 93.85 percent'))
check('and tells ChatGPT which formats to produce and no others', /Formats to produce: LinkedIn post\. Nothing else\./.test(brief.text))
check('it says how to send candidates and what happened to the last ones', brief.text.includes('HOW TO SEND RESEARCH TO CLAUDE') && brief.text.includes('C-TEST-01: taken in as') && brief.text.includes('C-TEST-02: held.'))
check('it carries no dash', !/[\u2010-\u2015\u2212]/.test(brief.text))

// ===========================================================================
section('6. THE PRODUCTION RESPONSE (simulated) AND FINAL QA')
// ===========================================================================
const commit = reg.get(ID).handoff.sourceCommit
const packText = fixturePackText(commit, { handoffVersion: 1 }).replace('GDC POST NUMBER: 054', `GDC POST NUMBER: ${NUM}`)
const packDir = join(TMP, 'returned-packs'); mkdirSync(packDir)
// A pack that also carries a Reel script, which the handoff did not ask for.
writeFileSync(join(packDir, 'pack-v1.txt'), packText.replace('=== VISUAL BRIEF ===', '=== REEL SCRIPT ===\nLook at this number. It is big. Should you trust it?\n\n=== VISUAL BRIEF ==='))
const qa1 = await D.packs(packDir, opt)
check('a pack with a format the handoff did not ask for is HELD at QA', qa1.verdict === 'HOLD' && /Reel or Short script/.test(qa1.reasons.join(' ')), qa1.reasons[0])
check('a held pack does not reach the approval desk', isHold(P.readyForApproval(ID)) && P.founderStatus(reg.get(ID)) === null)
writeFileSync(join(packDir, 'pack-v1.txt'), packText)
const qa2 = await D.packs(packDir, opt)
check('the corrected pack passes every automatic check', qa2.verdict === 'PASS' && qa2.detail.results[0].failed === 0, `${qa2.detail.results[0].checked} checks`)
const qa3 = await D.packs(packDir, opt)
check('the same pack text a second time is not submitted twice', qa3.detail.results[0].note === 'already checked, unchanged')
check('QA alone is not enough: no Claude review yet, so it is not ready', isHold(P.readyForApproval(ID)))
check('the pack review is stored', P.reviewPack(ID, { verdict: 'PASS', notes: 'TEST. Simulated review of the fixture pack.' }).verdict === 'PASS')
check('still not ready: nothing verifiably in Drive', isHold(P.readyForApproval(ID)))
check('a verified save is recorded', P.recordPackSave(ID, { fileId: 'test-pack', verification: C.verifyDownload(packText, { base64: Buffer.from(packText).toString('base64') }) }).verdict === 'PASS')
check('now it is READY FOR JUSTIN', P.readyForApproval(ID).verdict === 'PASS' && P.founderStatus(reg.get(ID)) === 'READY FOR JUSTIN')

// ===========================================================================
section('7. APPROVAL: four statuses, and only Justin moves them')
// ===========================================================================
check('ChatGPT cannot send a pack back', isHold(P.requestChanges(ID, { requestedBy: 'ChatGPT', note: 'make it punchier' })))
check('Claude cannot send a pack back from the approval desk', isHold(P.requestChanges(ID, { requestedBy: 'Claude', note: 'make it punchier' })))
check('a change request needs Justin\'s words', isHold(P.requestChanges(ID, { requestedBy: 'Justin', note: '' })))
check('Justin asks for changes', P.requestChanges(ID, { requestedBy: 'Justin', note: 'TEST ONLY. Shorter opening please.' }).verdict === 'PASS' && P.founderStatus(reg.get(ID)) === 'CHANGES REQUESTED')
check('the version he objected to cannot be approved', isHold(P.approve(ID, { approvedBy: 'Justin', instruction: 'approve it' })))
check('and cannot go back to ready without a new version', isHold(P.readyForApproval(ID)))
check('the start here document carries his request back', F.stage2Brief().text.includes('Justin asked for changes: TEST ONLY. Shorter opening please.'))
// The next version: QA, review and a verified save, all over again.
await new Promise((r) => setTimeout(r, 15))
const v2 = F.parsePackText(packText.replace('I nearly used a number this week', 'This week I nearly used a number'))
check('the new version goes through QA again', P.submitPack(v2, opt).verdict === 'PASS' && reg.get(ID).packReview === null && !reg.get(ID).packDrive)
P.reviewPack(ID, { verdict: 'PASS', notes: 'TEST. Simulated review of version 2.' })
P.recordPackSave(ID, { fileId: 'test-pack-v2', verification: { ok: true, level: 'TEXT IDENTICAL', problems: [] } })
check('and returns to READY FOR JUSTIN with the request marked answered', P.readyForApproval(ID).verdict === 'PASS' && P.founderStatus(reg.get(ID)) === 'READY FOR JUSTIN' && !!reg.get(ID).founderDecision.resolvedAt)
check('nothing can be published before approval', isHold(await P.publish(ID, 'https://www.linkedin.com/posts/x', { check: async () => ({ provesItIsLive: true, verdict: 'URL RESOLVES', httpStatus: 200 }) })))
check('Justin approves', P.approve(ID, { approvedBy: 'Justin', instruction: 'TEST ONLY, simulated approval in the throwaway register' }).verdict === 'PASS' && P.founderStatus(reg.get(ID)) === 'APPROVED')
check('he can still withdraw it before posting', P.requestChanges(ID, { requestedBy: 'Justin', note: 'TEST ONLY. Hold on, one more change.' }).verdict === 'PASS' && reg.get(ID).status === 'ASSETS READY' && !reg.get(ID).approval && P.founderStatus(reg.get(ID)) === 'CHANGES REQUESTED')
await new Promise((r) => setTimeout(r, 15))
P.submitPack(F.parsePackText(packText.replace('I nearly used a number this week', 'I almost used a number this week')), opt)
P.reviewPack(ID, { verdict: 'PASS', notes: 'TEST. Simulated review of version 3.' })
P.recordPackSave(ID, { fileId: 'test-pack-v3', verification: { ok: true, level: 'TEXT IDENTICAL', problems: [] } })
P.readyForApproval(ID)
P.approve(ID, { approvedBy: 'Justin', instruction: 'TEST ONLY, simulated approval of version 3' })
check('PUBLISHED is refused with no URL', isHold(await P.publish(ID, '')))
check('PUBLISHED is refused when the URL does not answer', isHold(await P.publish(ID, 'https://www.linkedin.com/posts/nope', { check: async () => ({ provesItIsLive: false, verdict: 'NOT LIVE', httpStatus: 404 }) })) && P.founderStatus(reg.get(ID)) === 'APPROVED')
check('PUBLISHED only when a URL has been checked, in the throwaway register', (await P.publish(ID, 'https://www.linkedin.com/posts/test', { check: async (url) => ({ url, provesItIsLive: true, verdict: 'URL RESOLVES', httpStatus: 200 }) })).verdict === 'PASS' && P.founderStatus(reg.get(ID)) === 'PUBLISHED')
check('a published pack cannot be sent back', isHold(P.requestChanges(ID, { requestedBy: 'Justin', note: 'too late' })))

// ===========================================================================
section('8. THE RUN LOG AND THE DAILY SUMMARY')
// ===========================================================================
const inboxDir = join(TMP, 'inbox'); mkdirSync(inboxDir)
writeFileSync(join(inboxDir, 'drive-id-2__CANDIDATES.json'), JSON.stringify({ ...batch, batchId: '2026-11-12-test', candidates: [fresh] }))
const run = await D.morning({ inboxDir, network: false, ...opt })
const st = (name) => run.stages.find((s) => s.stage === name)
check('the morning run logs every stage it reached', ['PREFLIGHT', 'INBOX', 'DISCOVER', 'DOSSIER', 'REVIEW'].every((s) => !!st(s)))
check('the inbox stage took the new candidate in', st('INBOX').verdict === 'PASS' && st('INBOX').detail.batches[0].results[0].outcome === 'INGESTED', JSON.stringify(st('INBOX').detail?.batches?.[0]?.results?.[0] || st('INBOX').reasons))
check('a stage that was skipped says so and says why', st('DISCOVER').verdict === 'SKIPPED' && st('DISCOVER').reasons.length === 1)
const noInbox = await D.morning({ network: false, ...opt })
check('a run handed no inbox reports the inbox as SKIPPED, never as empty', noInbox.stages.find((s) => s.stage === 'INBOX').verdict === 'SKIPPED')
check('a stage that runs twice keeps one entry and counts the attempt', noInbox.stages.filter((s) => s.stage === 'INBOX').length === 1 && noInbox.stages.find((s) => s.stage === 'INBOX').attempts === 2)
D.record('DRIVE SYNC', 'HOLD', { reasons: ['TEST. The queue copy did not match what was sent.'], by: 'claude' })
D.disagreement('TEST. ChatGPT calls GDC-052 The Class Chat. The register has 052 as a retired post with another title.')
let threw = false
try { D.record('DRIVE SYNC', 'FINE') } catch { threw = true }
check('a verdict outside the five words is refused', threw)
const sum = D.summary()
check('the summary opens with what needs Justin', sum.indexOf('NEEDS YOU') < sum.indexOf('WHAT RAN') && sum.includes('DRIVE SYNC was held: TEST.'))
check('it carries the disagreement only he can settle', sum.includes('Disagreement to settle: TEST. ChatGPT calls GDC-052'))
check('it names the stages that did not run', /PACK REVIEW\s+NOT RUN/.test(sum) && /APPROVAL DESK\s+NOT RUN/.test(sum))
check('it says nothing was posted', sum.includes('Nothing was posted, scheduled or sent.'))
check('and has no dash in it', !/[\u2010-\u2015\u2212]/.test(sum))

// ===========================================================================
section('NOTHING REAL WAS TOUCHED')
// ===========================================================================
check('the live research register index is byte for byte unchanged', digest(LIVE.index) === before.index)
check('the live research register history is byte for byte unchanged', digest(LIVE.jsonl) === before.jsonl)
check('the live post register is unchanged, so no real number was spent', digest(LIVE.posts) === before.posts)

console.log(`\n${failed ? `${failed} of ${count} checks FAILED` : `all ${count} relay checks passed`}`)
console.log(`throwaway register: ${TMP}`)
process.exit(failed ? 1 : 0)
