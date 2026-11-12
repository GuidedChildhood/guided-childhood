// The approval sheet: one document with everything that is in front of Justin.
//
// The Post Desk is where he copies a post from. This is the paper behind it:
// for every pack that is READY FOR JUSTIN, CHANGES REQUESTED or APPROVED, the
// copy in every format the handoff asked for, what the research does not
// show, what the checks said, who wrote and who edited it, and what to do
// before pressing post. It is generated from the register and the stored
// pack, so it cannot say something the gates did not.
//
// It is text, written to Drive as one Google Doc by the Claude run and
// verified like every other copy. Reading it approves nothing. Approval is
// Justin saying so, or posting.

import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import * as reg from './register.mjs'
import { repoState, sha256, DRIVE } from './contract.mjs'
import { founderStatus } from './pipeline.mjs'

const ORDER = ['CHANGES REQUESTED', 'READY FOR JUSTIN', 'APPROVED']
const plain = (s) => String(s || '').replace(/(\d)\s*[‐-―−]\s*/g, '$1 to ').replace(/\s*[‐-―−]\s*/g, ', ')

function loadJson(rel) {
  const p = join(reg.DIR, rel)
  if (!existsSync(p)) return null
  try { return JSON.parse(readFileSync(p, 'utf8')) } catch { return null }
}

/** Everything about one pack, as lines of text. */
function sheet(rec) {
  const L = []; const line = (s = '') => L.push(s)
  const id = rec.studyId
  const pack = loadJson(`packs/pack-${id}.json`) || {}
  const qa = loadJson(`packs/qa-${id}.json`) || {}
  const review = rec.claudeReview || {}
  const number = rec.gdcPostNumber ? `GDC-${String(rec.gdcPostNumber).padStart(3, '0')}` : 'NO NUMBER'
  const status = founderStatus(rec)

  line('='.repeat(64))
  line(`${number}   ${status}`)
  line(plain(review.proposedTitle || rec.title))
  line(`Research ${id}. Source: ${rec.doi ? `https://doi.org/${rec.doi}` : rec.url}`)
  if (status === 'CHANGES REQUESTED') line(`You asked, on ${String(rec.founderDecision?.at).slice(0, 10)}: ${rec.founderDecision?.note}`)
  if (status === 'APPROVED') line(`You approved it on ${String(rec.approval?.approvedAt).slice(0, 10)}: "${rec.approval?.instruction}". Post it and send the link.`)
  line()
  line('LINKEDIN POST')
  line(pack.linkedin?.body || '(no LinkedIn copy stored)')
  line()
  line('FIRST COMMENT')
  line(pack.linkedin?.firstComment || '(none)')
  line()
  for (const [label, body] of [['INSTAGRAM CAPTION', pack.instagram?.caption], ['FACEBOOK CAPTION', pack.facebook?.caption], ['NEWSLETTER', pack.newsletter?.body], ['REEL OR SHORT SCRIPT', pack.reel?.script]]) {
    if (body) { line(label); line(body); line() }
  }
  const declined = Object.entries(pack.declined || {})
  if (declined.length) {
    line('FORMATS NOT PRODUCED, AND WHY')
    for (const [k, why] of declined) line(`  ${k}: ${plain(why)}`)
    line()
  }
  line('VISUAL AND MOTION')
  const assets = pack.visual?.assetsUsed || []
  const made = rec.assets || []
  const vd = rec.visualDecision
  line(vd ? `  Decision: ${vd.choice}. ${plain(vd.reason)}` : '  Decision: not recorded for this pack.')
  line(assets.length ? `  Approved assets named in the pack: ${assets.join(', ')}` : '  The pack itself names no asset. It is cleared as text only.')
  if (pack.visual?.brief) line(`  Brief: ${plain(pack.visual.brief)}`)
  for (const a of made) {
    if (a.failed) { line(`  ${a.kind.toUpperCase()}, ${a.role}: PRODUCTION FAILED. ${plain(a.failure)} Nothing was put in its place.`); continue }
    const f = a.facts || {}
    line(`  ${a.kind.toUpperCase()}, ${a.role}: ${a.file}`)
    if (a.kind === 'motion') line(`    ${f.seconds} seconds, ${f.width} by ${f.height}, ${f.codec}, sound: ${f.audio}. Plays from first frame to last: ${f.playsThrough ? 'yes' : 'NO'}.`)
    line(`    Checked: ${a.verified ? 'yes' : `NO. ${(a.problems || []).join('; ')}`}. Looked at: ${a.review ? `${a.review.verdict}. ${plain(a.review.notes)}` : 'not yet'}`)
    line(`    To watch or download: ${a.drive?.verified ? `https://drive.google.com/file/d/${a.drive.fileId}/view (${a.drive.level})` : 'NOT in Drive yet. It is in GitHub at the path above.'}`)
  }
  line()
  line('EVIDENCE AND OVERCLAIM NOTES')
  line(`  Confidence: ${plain(review.evidenceConfidence || 'not recorded')}`)
  for (const x of review.whatThisDoesNotProve || []) line(`  Does not show: ${plain(x)}`)
  for (const x of (review.notQuotable || []).slice(0, 6)) line(`  Not to be said: ${plain(x)}`)
  if (pack.evidence?.notes) line(`  The writer's own notes: ${plain(pack.evidence.notes)}`)
  line()
  line('WHAT THE CHECKS SAID')
  const checks = qa.checks || []
  line(`  Automatic checks: ${qa.verdict || 'not run'}, ${checks.filter((c) => c.pass).length} of ${checks.length} passed${qa.checkedAt ? `, ${String(qa.checkedAt).slice(0, 16).replace('T', ' ')} UTC` : ''}.`)
  for (const f of qa.failures || []) line(`  FAILED: ${f.check}. ${plain(f.why)}`)
  line(`  Written by: ${pack.author || 'ChatGPT, Stage 2'}${pack.editOf ? `. Version ${pack.packVersion || '?'} is an edit of ${pack.editOf}.` : '.'}`)
  line(`  Claude review of the pack: ${rec.packReview?.verdict || 'not done'}${rec.packReview?.reviewedAt ? `, ${String(rec.packReview.reviewedAt).slice(0, 10)}` : ''}`)
  for (const l of String(rec.packReview?.notes || '').split('\n').filter(Boolean)) line(`    ${plain(l)}`)
  line(`  In Drive: ${rec.packDrive?.verified ? `saved and read back, ${rec.packDrive.level}` : 'NOT verified'}${rec.packDrive?.fileId ? `, https://docs.google.com/document/d/${rec.packDrive.fileId}/edit` : ''}`)
  line()
  line('BEFORE YOU POST')
  line('  1. Read it aloud once. If a line is not how you would say it, change it or send it back.')
  line('  2. Post the LinkedIn copy with no link in the body.')
  line('  3. Add the first comment straight away. It carries the source.')
  line(`  4. ${made.some((a) => a.kind === 'motion' && a.verified && a.role === 'optional') ? 'The film is optional. The post is cleared without it. If you use it, upload the MP4 itself to the post, never a link to it.' : made.some((a) => a.verified) ? 'Upload the file named under VISUAL AND MOTION to the post itself.' : assets.length ? 'Attach the named image.' : 'No image goes with this one.'}`)
  line('  5. Send Claude the link to the live post. It is marked PUBLISHED only once that link answers.')
  line('  6. The row in the post register moves to POSTED on your word, not before.')
  line()
  return L
}

/**
 * The whole desk. Returns { text, sha256, title, count }.
 */
export function approvalDesk() {
  const r = repoState()
  const mine = reg.all().filter((x) => ORDER.includes(founderStatus(x)))
    .sort((a, b) => ORDER.indexOf(founderStatus(a)) - ORDER.indexOf(founderStatus(b)) || String(a.gdcPostNumber).localeCompare(String(b.gdcPostNumber)))
  const published = reg.all().filter((x) => founderStatus(x) === 'PUBLISHED')
  const L = []; const line = (s = '') => L.push(s)
  line('GDC APPROVAL DESK')
  line('Everything that is waiting for Justin, in one place. GitHub is the authority. This is a copy.')
  line(`The folder this sits in never moves: https://drive.google.com/drive/folders/${DRIVE.APPROVAL_DESK_FOLDER}`)
  line('Nothing is shown here while it is a draft. A pack appears only once every check, the review and the Drive save have passed.')
  line()
  line('THE FOUR STATUSES')
  line('  READY FOR JUSTIN    passed every check and Claude\'s review. Yours to read.')
  line('  CHANGES REQUESTED   you sent it back. The next version returns here once it has been checked again.')
  line('  APPROVED            you said yes. Not yet posted.')
  line('  PUBLISHED           a live link was checked and answered.')
  line('  Only you move a pack between them. Tell Claude "approve 054", "054 changes: ..." or send the link once it is posted.')
  line()
  line('NOW')
  for (const s of ORDER) line(`  ${s}: ${mine.filter((x) => founderStatus(x) === s).map((x) => `GDC-${String(x.gdcPostNumber).padStart(3, '0')}`).join(', ') || 'none'}`)
  line(`  PUBLISHED through this pipeline: ${published.map((x) => `GDC-${String(x.gdcPostNumber).padStart(3, '0')}`).join(', ') || 'none yet'}`)
  line(`  Where you copy posts from: the Post Desk. Where every other story sits: the Radar Desk.`)
  line()
  if (!mine.length) line('Nothing is waiting for you.')
  for (const rec of mine) for (const l of sheet(rec)) line(l)
  line('Nothing here has been posted, scheduled or sent by anyone but you.')
  const text = L.join('\n')
  return { text, sha256: sha256(text), count: mine.length, commit: r.commit,
    title: `GDC APPROVAL DESK [${r.shortCommit}${r.dirty ? ' DIRTY' : ''}] ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`, folder: DRIVE.STAGE2_FOLDER }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const d = approvalDesk()
  if (process.argv[2]) { const { writeFileSync } = await import('node:fs'); writeFileSync(process.argv[2], d.text); console.log(d.title); console.log(`${d.count} pack(s), sha256 ${d.sha256}`) } else console.log(d.text)
}
