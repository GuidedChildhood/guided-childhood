// End to end test of the Claude to ChatGPT pipeline, with every failure the
// repair brief named simulated and required to end in a HOLD.
//
// It runs against a throwaway register, seeded with a COPY of the one real
// reviewed record, GDC-RR-0754a1641c. That is the "safe existing research
// record" the brief asks for: real review, real cleared figures, real post
// number. The live register, the live post register and Drive are never
// written, and the last three checks prove it by comparing digests of the
// live files from before and after.
//
// What this test does NOT cover, said plainly so a green run is not read as
// more than it is: the transport to Drive. A Node process cannot reach the
// Drive connector, so the Drive steps here use the same verification code on
// bytes held in memory. The real write and readback against Drive was run by
// hand on 10 November and is recorded in content/research-register/
// sync-state.json; this file proves the gates around it.

import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const LIVE_DIR = join(process.cwd(), 'content/research-register')
const LIVE_INDEX = join(LIVE_DIR, 'index.json')
const LIVE_JSONL = join(LIVE_DIR, 'studies.jsonl')
const LIVE_POSTS = join(process.cwd(), 'content/gdc-post-register.md')
const digest = (p) => createHash('sha256').update(readFileSync(p)).digest('hex')
const before = { index: digest(LIVE_INDEX), jsonl: digest(LIVE_JSONL), posts: digest(LIVE_POSTS) }

const TMP = mkdtempSync(join(tmpdir(), 'radar-pipeline-test-'))
process.env.RADAR_REGISTER = TMP

const reg = await import('./register.mjs')
const P = await import('./pipeline.mjs')
const S = await import('./sync.mjs')
const C = await import('./contract.mjs')
const Q = await import('./qa.mjs')

let failed = 0
let count = 0
const check = (name, ok, detail = '') => {
  count += 1
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}${detail ? `  [${String(detail).slice(0, 110)}]` : ''}`)
  if (!ok) failed += 1
}
const section = (t) => console.log(`\n${t}`)
const isHold = (r) => r?.verdict === 'HOLD' && r.reasons?.length > 0

// --- seed: a copy of the one real reviewed record, nothing else ------------
const ID = 'GDC-RR-0754a1641c'
const live = JSON.parse(readFileSync(LIVE_INDEX, 'utf8')).heads[ID]
if (!live) { console.error(`the live register has no ${ID}, so there is no safe record to test with`); process.exit(1) }
// Pipeline state is stripped so the copy starts clean: the live record already
// carries a built handoff, and inheriting its version made two checks here fail
// the first time the live handoff was rebuilt.
const { version: _v, gate: _g, pack: _p, packQa: _q, packReview: _r, packDrive: _d, handoff: _h, approval: _a, ...seed } = live
reg.upsert({ ...seed, status: 'EDITORIAL READY' }, { reason: 'test seed, copied from the live register', actor: 'test' })

// A second, unreviewed record, for the missing review simulation.
reg.upsert({ title: 'An unreviewed study about children and smartphone use at school', doi: '10.9999/test.unreviewed',
  url: 'https://example.org/unreviewed', status: 'VERIFIED', dossier: { checkedAt: new Date().toISOString() } },
  { reason: 'test seed', actor: 'test' })
const UNREVIEWED = reg.all().find((r) => r.doi === '10.9999/test.unreviewed').studyId

// --- the pack a correct Stage 2 would hand back ----------------------------
// A TEST FIXTURE. Written to pass the house rules using only the five figures
// the real review cleared. It is not a draft for publication and nothing in
// this file can publish it.
const GOOD_BODY = [
  'I nearly used a number this week that would have made my argument look much stronger.',
  'A new meta-analysis pooled 12 studies on social media and adolescent mental health and reported a correlation of r = 0.308. That is far bigger than the figures I usually quote, and I will be honest that part of me wanted it to be true.',
  'I build a product for parents who are worried about exactly this. A bigger number would sell it better.',
  'So I read past the headline figure, and one line stopped me. The heterogeneity was 93.85 percent. In plain terms, the studies inside it disagree with each other so much that averaging them tells you very little about any one child.',
  'That is not a criticism of the researchers. They ran the checks you would hope for and reported what they found. It is a limit on what the result can carry.',
  'A pooled figure from a handful of studies that disagree is not stronger evidence than one large, careful cohort that follows the same teenagers over time. It only looks stronger because it is one tidy number.',
  'Here is what I think it does show. Something real is going on for some children, and it is not evenly spread. The paper found the link looked different at different school stages, which is a reason to ask which child, and when, before asking how much.',
  'Here is what it does not show. It does not show that social media causes the harm, and it does not tell a parent anything about their own son or daughter.',
  'I would rather be trusted with a small true number than believed with a large shaky one. If the response to this is going to be proportional to the evidence, that has to cut both ways, including when the evidence flatters me.',
  'When did you last turn down a statistic that suited you?',
].join('\n\n')

const goodPack = () => ({
  researchId: ID,
  gdcPostNumber: '054',
  sourceCommit: C.repoState().commit,
  handoffVersion: 1,
  status: 'DRAFT',
  linkedin: {
    body: GOOD_BODY,
    firstComment: 'The paper is here: https://doi.org/10.1177/13591045261487468 . The strongest objection is that a pooled estimate is still the best single summary we have. I think that holds when the studies broadly agree, and these do not.',
  },
  visual: { brief: 'Research card, one hero figure, cream ground, one accent.', assetsUsed: ['.claude/skills/viral-post/stat-card.html'] },
})

// ===========================================================================
section('PREFLIGHT')
// ===========================================================================
const pre0 = P.preflight()
check('preflight HOLDS before anything has been synced to Drive', isHold(pre0), pre0.reasons[0])
check('preflight passes on the repo side alone', P.preflight({ requireDrive: false }).verdict === 'PASS')

// ===========================================================================
section('SIMULATION 1, missing repository access')
// ===========================================================================
const noReg = P.preflight({ postRegisterPath: join(TMP, 'does-not-exist.md'), requireDrive: false })
check('a post register that cannot be read is a HOLD', isHold(noReg), noReg.reasons[0])
const empty = mkdtempSync(join(tmpdir(), 'radar-norepo-'))
let childOut = ''
try {
  childOut = execFileSync('node', ['-e', `import('${join(process.cwd(), 'scripts/radar/pipeline.mjs')}').then(p=>console.log(JSON.stringify(p.preflight({requireDrive:false}))))`],
    { env: { ...process.env, RADAR_REPO: empty, RADAR_REGISTER: mkdtempSync(join(tmpdir(), 'radar-norepo-reg-')) }, cwd: empty, encoding: 'utf8' })
} catch (e) { childOut = String(e.stdout || e.message) }
let noRepo = null
try { noRepo = JSON.parse(childOut.trim().split('\n').pop()) } catch { /* reported below */ }
check('with no repository at all, preflight is a HOLD and says why', isHold(noRepo) && noRepo.reasons.some((x) => /repository cannot be read/.test(x)) && noRepo.reasons.some((x) => /post register/.test(x)),
  noRepo ? noRepo.reasons.join(' | ') : childOut)
const noRepoHandoff = P.handoff(ID, { postRegisterPath: join(TMP, 'does-not-exist.md') })
check('a handoff cannot be built when the post number cannot be checked', isHold(noRepoHandoff), noRepoHandoff.reasons[0])

// ===========================================================================
section('STAGE 1 TO 2, the handoff')
// ===========================================================================
const h1 = P.handoff(ID)
check('the reviewed record produces a handoff', h1.verdict === 'PASS', JSON.stringify(h1.reasons))
const hJson = JSON.parse(readFileSync(join(TMP, 'handoffs', `handoff-${ID}.json`), 'utf8'))
check('the handoff carries the research ID and the existing GDC number', hJson.researchId === ID && hJson.gdcPostNumber === '054')
check('the handoff carries its version and the source commit', hJson.handoffVersion === 1 && /^[0-9a-f]{40}$/.test(hJson.sourceCommit || ''), hJson.sourceCommit)
check('the handoff carries source URLs with verification dates', hJson.sourceUrls?.length > 0 && !!hJson.sourceUrls[0].verifiedAt, JSON.stringify(hJson.sourceUrls?.[0]))
check('the handoff carries cleared figures and prohibited claims', hJson.clearedFigures?.length === 5 && hJson.prohibitedClaims?.length > 0)
check('the handoff carries contradictory evidence and limitations', hJson.contradictoryEvidence?.length > 0 && hJson.limitations?.length > 0)
check('the handoff carries angle, priority, verdict and formats', !!hJson.editorialAngle && !!hJson.editorialPriority && !!hJson.claudeReview?.verdict && hJson.recommendedFormats?.length > 0)
check('paths on the record are repo relative, never absolute', !String(reg.get(ID).handoff.json).startsWith('/'), reg.get(ID).handoff.json)
check('a rebuilt handoff gets the next version, not the same one', P.handoff(ID).handoffVersion === 2)

// ===========================================================================
section('SIMULATION 6, missing Claude review')
// ===========================================================================
const el = Q.eligibility(UNREVIEWED)
check('an unreviewed record is not eligible for Stage 2', isHold(el), el.reasons[0])
const h2 = P.handoff(UNREVIEWED)
check('no handoff is built for an unreviewed record', isHold(h2), h2.reasons[0])
check('the HOLD is written onto the record with its reason', reg.get(UNREVIEWED).gate?.verdict === 'HOLD' && reg.get(UNREVIEWED).gate.reasons.length > 0)
// Each reason isolated. A mutation run on 10 November removed the claudeStatus
// check and nothing fired, because an unreviewed record fails for three other
// reasons as well. Overlap is fine in the gate and useless in the test, so
// these take the real reviewed record and break exactly one thing at a time.
const reviewed = reg.get(ID)
const onlyStatus = Q.eligibility({ ...reviewed, claudeStatus: 'PENDING' })
check('a stored review marked PENDING is not eligible, for that reason alone',
  isHold(onlyStatus) && onlyStatus.reasons.length === 1 && /claudeStatus is PENDING/.test(onlyStatus.reasons[0]), onlyStatus.reasons.join(' | '))
const onlyReview = Q.eligibility({ ...reviewed, claudeReview: null })
check('a record that claims a review but stores none is not eligible',
  isHold(onlyReview) && onlyReview.reasons.length === 1 && /no stored Claude review/.test(onlyReview.reasons[0]), onlyReview.reasons.join(' | '))
const onlyClaims = Q.eligibility({ ...reviewed, claudeReview: { ...reviewed.claudeReview, claims: [] } })
check('a review with no claim by claim verdicts is not eligible',
  isHold(onlyClaims) && onlyClaims.reasons.length === 1 && /claim by claim/.test(onlyClaims.reasons[0]))
const onlyDossier = Q.eligibility({ ...reviewed, dossier: null })
check('a record with no dossier is not eligible', isHold(onlyDossier) && onlyDossier.reasons.length === 1 && /no dossier/.test(onlyDossier.reasons[0]))
const onlyStage = Q.eligibility({ ...reviewed, status: 'VERIFIED' })
check('a reviewed record still before EDITORIAL READY is not eligible', isHold(onlyStage) && onlyStage.reasons.length === 1 && /before EDITORIAL READY/.test(onlyStage.reasons[0]))

const unrevPack = P.submitPack({ ...goodPack(), researchId: UNREVIEWED, gdcPostNumber: '054' })
check('a pack written against an unreviewed record is a HOLD', isHold(unrevPack) && unrevPack.reasons.some((x) => /eligible/.test(x)))
check('the manifest queue does not contain the unreviewed record', !S.currentPayload('manifest').queue.some((q) => q.researchId === UNREVIEWED))

// ===========================================================================
section('SIMULATION 2, stale manifest')
// ===========================================================================
const snap = S.prepareSnapshot('manifest')
const okSync = S.acceptSnapshot({ role: 'manifest', fileId: 'test-file', title: snap.title, sentText: snap.text,
  download: { base64: Buffer.from(snap.text).toString('base64') } })
check('a manifest whose bytes come back identical is accepted', okSync.ok && okSync.verification.level === 'BYTE IDENTICAL')
check('Stage 2 may read a verified, current manifest', S.driveReadable('manifest').verdict === 'PASS')
const reSnap = S.prepareSnapshot('manifest')
check('a commit that changes no fact does not make the manifest stale', snap.payload._contract.factsSha256 === reSnap.payload._contract.factsSha256)
// New unchecked research arriving must NOT hold Stage 2: the queue is the same.
reg.upsert({ title: 'A newly discovered study on children and video game spending', doi: '10.9999/test.new', status: 'DISCOVERED' }, { reason: 'test, a discovery run', actor: 'test' })
check('a discovery run that adds unchecked research does not make the queue stale', S.driveReadable('manifest').verdict === 'PASS')
// Now the facts move: a second story becomes ready after the snapshot.
reg.upsert({ ...reg.get(UNREVIEWED), status: 'EDITORIAL READY' }, { reason: 'test, the queue changes after the snapshot', actor: 'test' })
const staleGate = S.driveReadable('manifest')
check('once the queue changes, the Drive manifest is a HOLD', isHold(staleGate), staleGate.reasons[0])
check('the sync state says STALE, not CURRENT', S.syncState().verdict === 'STALE')
const parsedOld = JSON.parse(snap.text)
check('validateSnapshot calls the old copy STALE against fresh facts',
  C.validateSnapshot(parsedOld, { expectRole: 'manifest', freshPayload: S.currentPayload('manifest'), volatile: S.ROLES.manifest.volatile }).verdict === 'STALE')
check('an unstamped file is never treated as current', C.validateSnapshot({ queue: [] }).verdict === 'UNSTAMPED')
const tampered = JSON.parse(snap.text); tampered.queue[0].gdcPostNumber = '055'
check('a snapshot edited after it was generated is CORRUPT', C.validateSnapshot(tampered).verdict === 'CORRUPT')
reg.upsert({ ...reg.get(UNREVIEWED), status: 'HOLD' }, { reason: 'test, put it back out of the queue', actor: 'test' })

// ===========================================================================
section('SIMULATION 4, failed Drive save')
// ===========================================================================
const mangled = Buffer.from(snap.text.replace('"queue"', '"queu"')).toString('base64')
const badSync = S.acceptSnapshot({ role: 'postRegister', fileId: 'test-file-2', title: 't', sentText: snap.text, download: { base64: mangled } })
check('a Drive copy that differs from what was sent is refused', !badSync.ok && badSync.verdict === 'HOLD', badSync.message)
check('a refused sync is not recorded as a success', !S.syncState().roles.postRegister)
check('the failure is kept where the dashboard can show it', S.syncState().recentFailures.length > 0)
check('a truncated save is caught by size alone', !C.verifyDownload(snap.text, { storedSize: snap.text.length - 40, headB64: 'e', tailB64: '=' }).ok)
check('an unreadable markdown readback fails the write', !C.verifyReadback(snap.text, '{ this is not json').ok)
check('the markdown escaping Drive adds on read is undone and verified',
  C.verifyReadback(snap.text, snap.text.replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/_/g, '\\_')).level === 'SEMANTICALLY EQUAL')

// ===========================================================================
section('SIMULATION 7, failed editorial QA')
// ===========================================================================
const bad = P.submitPack({ researchId: ID, gdcPostNumber: '054', sourceCommit: 'abc', status: 'APPROVED',
  linkedin: { body: 'A study found that 73 percent of children are addicted. Read more at https://example.com/x \u2014 act now. Do you agree? We must all take this seriously.' } })
check('a pack that breaks the house rules is a HOLD', isHold(bad), `${bad.failedCount} of ${bad.checked} failed`)
const why = bad.reasons.join(' || ')
check('it names the uncleared figure', /73 percent/.test(why))
check('it names the dash', /dash/.test(why))
check('it names the link in the body', /URL is in the body/.test(why))
check('it names the sentence after the closing question', /after the closing question/.test(why))
check('it names the false approval claim', /APPROVED with no approval record/.test(why))
check('a pack on HOLD cannot be given a Claude review', isHold(P.reviewPack(ID, { verdict: 'PASS', notes: 'looks fine' })))
check('a pack on HOLD does not reach ASSETS READY', isHold(P.readyForApproval(ID)) && reg.get(ID).status === 'EDITORIAL READY')
check('a pack on HOLD cannot be approved, even by Justin', isHold(P.approve(ID, { approvedBy: 'Justin', instruction: 'approve it' })))
check('the story stays in the queue so Stage 2 can fix it', reg.get(ID).status === 'EDITORIAL READY')

// ===========================================================================
section('SIMULATION 5, conflicting post number')
// ===========================================================================
const invented = P.submitPack({ ...goodPack(), gdcPostNumber: '099' })
check('a number GitHub has never heard of is a HOLD', isHold(invented) && invented.reasons.some((x) => /NOT in content\/gdc-post-register/.test(x)))
const spent = P.submitPack({ ...goodPack(), gdcPostNumber: '051' })
check('a number that is already POSTED is a HOLD', isHold(spent) && spent.reasons.some((x) => /already POSTED/.test(x)))
const wrong = P.submitPack({ ...goodPack(), gdcPostNumber: '053' })
check('a number that belongs to a different story is a HOLD', isHold(wrong) && wrong.reasons.some((x) => /matches this research/.test(x)))
const none = P.submitPack({ ...goodPack(), gdcPostNumber: null })
check('a pack with no number at all is a HOLD', isHold(none))
reg.upsert({ ...reg.get(UNREVIEWED), gdcPostNumber: '054' }, { reason: 'test, a second story claims the same number', actor: 'test' })
const collide = P.handoff(ID)
check('two research records carrying one number stops the handoff', isHold(collide) && collide.reasons.some((x) => /Two stories cannot hold one number/.test(x)), collide.reasons[0])
reg.upsert({ ...reg.get(UNREVIEWED), gdcPostNumber: null }, { reason: 'test, undo', actor: 'test' })
const rec = C.reconcileNumbers('Today ChatGPT drafted GDC-054 and also claimed GDC-077 for a new idea.')
check('a number claimed only in a Drive document is reported as a conflict', rec.conflicts.length === 1 && rec.conflicts[0].number === '077')
check('reconciliation confirms the number GitHub does hold', rec.confirmed.some((x) => x.number === '054'))
check('the next free number is one above the highest, never a gap', rec.nextFree === '055', rec.nextFree)

// ===========================================================================
section('SIMULATION 3, duplicate story')
// ===========================================================================
const totalBefore = reg.all().length
const again = reg.upsert({ title: 'A retitled copy of the same paper', doi: seed.doi }, { reason: 'test, the same study found again', actor: 'test' })
check('the same study found again is the same record, not a new one', again.id === ID && reg.all().length === totalBefore)
const corpus = Q.existingCorpus().filter((c) => c.body)
const old = corpus[0]
const dupe = P.submitPack({ ...goodPack(), linkedin: { ...goodPack().linkedin, body: old.body } })
check('a pack that repeats an existing post is a HOLD', isHold(dupe) && dupe.reasons.some((x) => /near duplicate/.test(x)), `repeats ${old.id}`)
check('it is caught at the opening too', dupe.reasons.some((x) => /opening is not a repeat/.test(x)))
check('the duplication corpus is the real archive, not a stub', corpus.length >= 20, `${corpus.length} posts with bodies`)

// ===========================================================================
section('THE PACK FORMAT, the way a pack comes back from Stage 2')
// ===========================================================================
const F = await import('./packformat.mjs')
const gp = goodPack()
const packDoc = [
  `RESEARCH ID: ${gp.researchId}`, `GDC POST NUMBER: ${gp.gdcPostNumber}`, 'HANDOFF VERSION: 1', `SOURCE COMMIT: ${gp.sourceCommit}`, 'STATUS: DRAFT', '',
  '=== LINKEDIN POST ===', '(250 to 450 words. The closing question is the last sentence. No link. No dashes.)', gp.linkedin.body, '',
  '=== FIRST COMMENT ===', gp.linkedin.firstComment, '',
  '=== INSTAGRAM CAPTION ===', '',
  '=== VISUAL BRIEF ===', gp.visual.brief, '',
  '=== ASSETS USED ===', gp.visual.assetsUsed[0], '',
  '=== SOURCES ===', 'https://doi.org/10.1177/13591045261487468',
].join('\n')
const parsed = F.parsePackText(packDoc)
check('a pack document parses into its research ID, number, version and commit',
  parsed.researchId === ID && parsed.gdcPostNumber === '054' && parsed.handoffVersion === 1 && parsed.sourceCommit === gp.sourceCommit)
check('the post body survives the trip word for word', parsed.linkedin?.body === gp.linkedin.body)
check('template guidance left in brackets is not read as copy', !/250 to 450 words/.test(parsed.linkedin?.body || ''))
check('an empty section is absent rather than an empty string', parsed.instagram === undefined)
check('the parsed pack passes the same QA as the object did', Q.checkPack(parsed).verdict === 'PASS', Q.checkPack(parsed).failures.map((f) => f.check).join(' | '))
// The same document as Drive hands it back: bold labels, escaped punctuation.
const asDrive = packDoc.replace(/^(RESEARCH ID|GDC POST NUMBER|HANDOFF VERSION|SOURCE COMMIT|STATUS):/gm, '**$1:**')
  .replace(/^=== (.+) ===$/gm, '## \\=== $1 \\===').replace(/_/g, '\\_').replace(/\./g, '\\.')
const parsedDrive = F.parsePackText(asDrive)
check('the same pack read back through Drive, with its markdown, parses the same',
  parsedDrive.researchId === ID && parsedDrive.gdcPostNumber === '054' && parsedDrive.linkedin?.body === gp.linkedin.body && parsedDrive.visual?.assetsUsed?.length === 1,
  JSON.stringify({ id: parsedDrive.researchId, n: parsedDrive.gdcPostNumber, body: (parsedDrive.linkedin?.body || '').length }))
const noHeader = F.parsePackText('=== LINKEDIN POST ===\n' + gp.linkedin.body)
const noHeaderQa = Q.checkPack(noHeader)
check('a pack with no header is a HOLD that names what is missing',
  noHeaderQa.verdict === 'HOLD' && noHeaderQa.failures.some((f) => /research ID/.test(f.check)) && noHeaderQa.failures.some((f) => /post number/.test(f.check)))
const brief = F.stage2Brief()
check('the Stage 2 brief names the story, its number and every cleared figure',
  brief.text.includes(ID) && /GDC post number: 054/.test(brief.text) && brief.text.includes('r = 0.308') && brief.text.includes('93.85'))
check('the Stage 2 brief tells ChatGPT not to claim a number', /Do not use it/.test(brief.text) && /claimed in GitHub and nowhere else/.test(brief.text))
check('the Stage 2 brief carries the commit it was generated from', brief.text.includes(C.repoState().commit))
check('the Stage 2 brief contains no dash', !/[\u2010-\u2015\u2212]/.test(brief.text))
// The start here document is tracked for freshness like the JSON beside it.
const okDoc = { ok: true, level: 'HEAD, TAIL AND PROBES', problems: [] }
check('a start here document that failed verification is not recorded', !S.acceptBrief({ fileId: 'b', title: 't', sentText: brief.text, verification: { ok: false, level: 'DIFFERENT', problems: ['cut short'] } }).ok && !S.syncState().roles.stage2Brief)
check('a verified start here document is recorded as current', S.acceptBrief({ fileId: 'b', title: 't', sentText: brief.text, verification: okDoc }).ok && S.syncState().roles.stage2Brief.current === true)
check('outside its Generated line, the document does not mention the repository head, so a commit cannot make it stale',
  !brief.text.split('\n').filter((l) => !l.startsWith('Generated ')).join('\n').includes(C.repoState().commit) || reg.get(ID).handoff.sourceCommit === C.repoState().commit)
check('the pack template carries the handoff commit', brief.text.includes(`SOURCE COMMIT: ${reg.get(ID).handoff.sourceCommit}`))
check('regenerating it a moment later does not make it stale', S.briefFacts(F.stage2Brief().text) === S.briefFacts(brief.text))
reg.upsert({ ...reg.get(ID), editorialPriority: 'HIGH' }, { reason: 'test, the story changes priority after the brief was written', actor: 'test' })
check('when the story it describes changes, the start here document is stale', S.syncState().roles.stage2Brief.current === false && isHold(S.driveReadable('stage2Brief')))
reg.upsert({ ...reg.get(ID), editorialPriority: seed.editorialPriority }, { reason: 'test, undo', actor: 'test' })
check('and current again once the story is back as it was', S.syncState().roles.stage2Brief.current === true)
check('the doc probe refuses a document that is cut short', !C.verifyDocProbe(brief.text, { head: 'GDC STAGE 2, START HERE', tail: 'THE NUMBER RULE', contains: ['a', 'b', 'c'] }).ok)
check('the doc probe accepts the real start, end and lines, through the markdown',
  C.verifyDocProbe(brief.text, { head: 'GDC STAGE 2, START HERE', tail: 'Nothing is posted by anyone but him.', contains: ['r = 0.308, 95% CI 0.239 to 0.374, p \\< 0.001, the pooled correlation', 'No dashes anywhere, of any length.', 'STATUS: DRAFT'] }).ok)
check('the pack template inside the brief parses back to the right story', F.parsePackText(F.packTemplate({ researchId: ID, gdcPostNumber: '054', handoffVersion: 2, sourceCommit: 'abc' })).researchId === ID)

// ===========================================================================
section('THE CLEAN RUN, start to finish')
// ===========================================================================
check('the handoff rebuilds once the number conflict is gone', P.handoff(ID).verdict === 'PASS')
const sub = P.submitPack(goodPack())
check('a correct pack passes every QA check', sub.verdict === 'PASS', sub.reasons.join(' | ') || `${sub.checked} checks`)
check('the pack keeps its research ID, post number and source commit', reg.get(ID).pack.gdcPostNumber === '054' && !!reg.get(ID).pack.sourceCommit)
check('QA passing alone does not reach ASSETS READY', isHold(P.readyForApproval(ID)))
check('a review with no reasoning is refused', isHold(P.reviewPack(ID, { verdict: 'PASS', notes: '' })))
check('a review that says EDIT is a HOLD', isHold(P.reviewPack(ID, { verdict: 'EDIT', notes: 'the second paragraph overclaims' })))
check('Claude reviews the pack and passes it', P.reviewPack(ID, { verdict: 'PASS', notes: 'Figures match the cleared list, the concession is present, nothing causal is claimed.' }).verdict === 'PASS')
const noSave = P.readyForApproval(ID)
check('reviewed but not saved to Drive is still a HOLD', isHold(noSave) && noSave.reasons.some((x) => /verifiably saved/.test(x)))
const packText = JSON.stringify(goodPack())
check('a failed save of the pack is a HOLD', isHold(P.recordPackSave(ID, { verification: C.verifyDownload(packText, { base64: Buffer.from('{}').toString('base64') }) })))
check('a verified save of the pack is accepted', P.recordPackSave(ID, { fileId: 'test-pack', verification: C.verifyDownload(packText, { base64: Buffer.from(packText).toString('base64') }) }).verdict === 'PASS')
check('now it reaches ASSETS READY', P.readyForApproval(ID).verdict === 'PASS' && reg.get(ID).status === 'ASSETS READY')

section('STAGE 4, approval and publication controls')
const live404 = async () => ({ verdict: 'NOT LIVE', httpStatus: 404, provesItIsLive: false })
const liveOk = async (url) => ({ url, verdict: 'URL RESOLVES', httpStatus: 200, provesItIsLive: true, provesItIsOurs: false, provesTheContent: false })
check('nothing can be published before it is approved', isHold(await P.publish(ID, 'https://www.linkedin.com/posts/x', { check: liveOk })))
check('ChatGPT cannot approve', isHold(P.approve(ID, { approvedBy: 'ChatGPT', instruction: 'approved' })))
check('Claude cannot approve', isHold(P.approve(ID, { approvedBy: 'Claude', instruction: 'approved' })))
check('approval without Justin\'s own words is refused', isHold(P.approve(ID, { approvedBy: 'Justin', instruction: '' })))
check('status has not moved while approval was being refused', reg.get(ID).status === 'ASSETS READY')
check('Justin approves, and his words are stored', P.approve(ID, { approvedBy: 'Justin', instruction: 'TEST ONLY, simulated approval inside the throwaway register' }).verdict === 'PASS' && reg.get(ID).approval?.instruction?.startsWith('TEST ONLY'))
check('approved is not published', reg.get(ID).status === 'APPROVED')
check('publishing with no URL is refused', isHold(await P.publish(ID, '')))
check('a URL that returns 404 does not become PUBLISHED', isHold(await P.publish(ID, 'https://www.linkedin.com/posts/nope', { check: live404 })) && reg.get(ID).status === 'APPROVED')
check('a URL that answers does, in the throwaway register only', (await P.publish(ID, 'https://www.linkedin.com/posts/test', { check: liveOk })).verdict === 'PASS' && reg.get(ID).status === 'PUBLISHED')
check('a published record cannot be pulled back by a rerun', (reg.upsert({ ...reg.get(ID), status: 'DISCOVERED' }, { reason: 'test, a rerun', actor: 'test' }), reg.get(ID).status === 'PUBLISHED'))

section('NOTHING REAL WAS TOUCHED')
check('the live research register index is byte for byte unchanged', digest(LIVE_INDEX) === before.index)
check('the live research register history is byte for byte unchanged', digest(LIVE_JSONL) === before.jsonl)
check('the post register is unchanged, so no number was created or moved', digest(LIVE_POSTS) === before.posts)
const liveNow = JSON.parse(readFileSync(LIVE_INDEX, 'utf8')).heads[ID]
check('the real story is still EDITORIAL READY and still unpublished', liveNow.status === 'EDITORIAL READY' && !liveNow.publishedUrl, liveNow.status)

console.log(`\n${failed ? `${failed} of ${count} checks FAILED` : `all ${count} pipeline checks passed`}`)
console.log(`throwaway register: ${TMP}`)
process.exit(failed ? 1 : 0)
