// The manual drop lane.
//
// Four of the most UK relevant sources we have cannot be fetched from this
// container at all. Ofcom, the ICO, the Cochrane Library and eSafety Australia
// all sit behind a Cloudflare bot challenge, and on 10 November the archive
// route that might have gone round it was tested and closed too: every path to
// web.archive.org is reset or refused here. See PROBE.md.
//
// So the radar stops pretending it can reach them and gives them a door
// instead. Justin puts the PDF in Drive, it is read and saved as text, and this
// file puts it in the register through exactly the same gates as a fetched
// study: scored, deduped, versioned, status DISCOVERED.
//
// A dropped document is better evidence than a fetched one, not worse, because
// we hold the whole text rather than an abstract. That is recorded on the
// record as fullTextPath, and it is the one case where a dossier may quote a
// figure from the body of a document rather than from its summary.
//
// What this file will NOT do:
//   assign a status above DISCOVERED. A document Justin supplied is still
//   unreviewed, and gate J applies to it exactly as it does to everything else.
//   claim a Claude review. claudeStatus stays unset until a directed run.
//
// Usage:
//   node scripts/radar/ingest.mjs <file.pdf|file.txt|file.md> \
//     --title "Children and parents: media use and attitudes 2026" \
//     --url https://www.ofcom.org.uk/... \
//     --publisher Ofcom \
//     --published 2026-09-25 \
//     [--official] [--authors "Ofcom"] [--actor radar:drop]

import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { join, basename, extname } from 'node:path'
import * as reg from './register.mjs'
import { score } from './score.mjs'

const DOCS = join(reg.DIR, 'documents')

/** Official publishers whose material is a primary source for policy status. */
const OFFICIAL = /^(ofcom|ico|information commissioner|dfe|department for education|dsit|dhsc|nhs|who|unicef|esafety|acma|ofsted|parliament|house of commons|house of lords|gov\.uk|cochrane)/i

/**
 * Pull readable text out of whatever was dropped. A PDF goes through
 * pdftotext, which is present in this container; anything else is read as
 * text. -layout is deliberately NOT used: we want reading order, not columns
 * preserved, because the text is for matching and quoting rather than display.
 */
export function extractText(file) {
  const ext = extname(file).toLowerCase()
  if (ext === '.pdf') {
    try {
      return execFileSync('pdftotext', ['-q', '-enc', 'UTF-8', file, '-'], {
        encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
      })
    } catch (e) {
      throw new Error(`could not read PDF ${basename(file)}: ${e.message}`)
    }
  }
  return readFileSync(file, 'utf8')
}

/** Collapse the whitespace a PDF extraction leaves behind, keeping paragraphs. */
export function tidy(text) {
  return String(text || '')
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * A document has no abstract, so one is taken from the top of the text for the
 * scorer and the brief to work with. The whole text stays on disk either way,
 * which is the point of this lane.
 */
export function leadText(text, chars = 4000) {
  const t = tidy(text)
  if (t.length <= chars) return t
  // Cut at a paragraph break rather than mid sentence where one is near.
  const cut = t.slice(0, chars)
  const lastBreak = cut.lastIndexOf('\n\n')
  return (lastBreak > chars * 0.5 ? cut.slice(0, lastBreak) : cut).trim()
}

/**
 * Put a dropped document in the register.
 * Returns { id, action, version, band, score, fullTextPath, words }.
 */
export function ingestDocument({
  file, text, title, url = '', publisher = '', published = '',
  authors = '', official = null, actor = 'radar:drop', reason = '',
}) {
  if (!title) throw new Error('a dropped document needs a title')
  const raw = text != null ? text : extractText(file)
  const body = tidy(raw)
  if (body.length < 200) throw new Error(`only ${body.length} characters of text came out, so there is nothing to ingest`)

  const isOfficial = official == null ? OFFICIAL.test(publisher || '') : !!official

  // Score on the title plus the lead, the same fields a fetched record scores
  // on, so a dropped document cannot jump the ranking by being longer.
  const lead = leadText(body)
  const sc = score({ title, abstract: lead, isOfficial, isPreprint: false })

  const rec = {
    title,
    url,
    journal: publisher || 'document',
    published: published || '',
    authors: authors || publisher || '',
    abstract: lead,
    isPreprint: false,
    peerReviewed: false,
    isOfficial,
    streams: ['drop'],
    foundBy: ['manual-drop'],
    status: 'DISCOVERED',
    relevanceScore: sc.score,
    relevanceBand: sc.band,
    relevanceParts: sc.parts,
    // Provenance, because the protocol's whole instruction is to keep it.
    //
    // Deliberately no timestamp in here. The first version of this lane stamped
    // droppedAt on every ingest, so re-dropping an identical document wrote a
    // new version each time, which is exactly the "a daily run would double the
    // file" problem register.mjs guards against. The register already holds
    // firstFound and lastChecked, and those are the honest answer to when a
    // document arrived and when it was last seen.
    provenance: {
      lane: 'manual-drop',
      reasonThisLaneExists: 'the publisher cannot be fetched from the container, see PROBE.md',
      originalFile: file ? basename(file) : 'supplied text',
      droppedBy: actor,
    },
    fullTextAvailable: true,
    words: body.split(/\s+/).length,
    // The register row, not the text file, is the permanent record. The text
    // itself is a local cache and is not committed: a GOV.UK attachment can be
    // fetched again, and a dropped PDF's original lives in Drive. The digest is
    // what makes that safe, because a re-fetch can be proved to be the same
    // document rather than a quietly revised one.
    textSha256: createHash('sha256').update(body).digest('hex'),
    textBytes: Buffer.byteLength(body),
  }

  const id = rec.studyId || reg.studyId(rec)
  mkdirSync(DOCS, { recursive: true })
  const fullTextPath = join(DOCS, `${id}.txt`)
  // Append only applies here too: an existing text file is never overwritten
  // with different content, it gets a new numbered version beside it.
  let writeTo = fullTextPath
  if (existsSync(fullTextPath) && readFileSync(fullTextPath, 'utf8') !== body) {
    let n = 2
    while (existsSync(join(DOCS, `${id}.v${n}.txt`))) n += 1
    writeTo = join(DOCS, `${id}.v${n}.txt`)
  }
  writeFileSync(writeTo, body)

  const res = reg.upsert({ ...rec, fullTextPath: writeTo }, {
    reason: reason || `document dropped by ${actor}, ${rec.words} words of full text`,
    actor,
  })

  return { ...res, band: sc.band, score: sc.score, fullTextPath: writeTo, words: rec.words }
}

/**
 * Ingest a GOV.UK publication's PDF in full, by its path.
 *
 * This is the half of the regulator gap that needs nobody to do anything.
 * Research commissioned by Ofcom or the ICO through a government department is
 * published on GOV.UK, and GOV.UK serves its attachments from a host we can
 * reach, so the full report is readable even though both regulators' own sites
 * refuse us. The other half, material published only on ofcom.org.uk or
 * esafety.gov.au, still needs the PDF putting in Drive.
 *
 * Returns { ok, ...ingest result } or { ok: false, error }.
 */
export async function ingestGovukPublication(path, { actor = 'radar:govuk', which = 0 } = {}) {
  const S = await import('./sources.mjs')
  const { ok, publication, error, status } = await S.govukPublication(path)
  if (!ok) return { ok: false, error: error || `HTTP ${status}` }
  if (!publication.pdfs.length) return { ok: false, error: 'the publication has no PDF attachment', publication }

  const pdf = publication.pdfs[which] || publication.pdfs[0]
  mkdirSync(DOCS, { recursive: true })
  const tmp = join(DOCS, `.incoming-${Date.now()}.pdf`)
  const dl = await S.getFile(pdf.url, tmp)
  if (!dl.ok) return { ok: false, error: `could not download the PDF: ${dl.error}`, publication }

  try {
    const out = ingestDocument({
      file: tmp,
      // The attachment's own title is usually the fuller one, but it is
      // sometimes truncated, so the longer of the two wins.
      title: (pdf.title.length > publication.title.length ? pdf.title : publication.title),
      url: publication.url,
      publisher: publication.organisations[0] || 'GOV.UK',
      published: publication.published,
      authors: publication.organisations.join(', '),
      official: true,
      actor,
      reason: `GOV.UK publication attachment, ${publication.organisations.join(', ') || 'GOV.UK'}`,
    })
    // Record where it really came from, since the lane is not a manual drop.
    const r = reg.get(out.id)
    reg.upsert({
      ...r,
      provenance: {
        lane: 'govuk-attachment',
        reasonThisLaneExists: 'the regulator site is blocked but GOV.UK serves the same report',
        govukPath: publication.url,
        pdfUrl: pdf.url,
        droppedBy: actor,
      },
    }, { reason: 'provenance corrected to the GOV.UK attachment lane', actor })
    return { ok: true, ...out, publication }
  } finally {
    try { unlinkSync(tmp) } catch { /* the temp PDF is not worth an error */ }
  }
}

function arg(name, dflt = '') {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : dflt
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const govuk = arg('govuk')
  if (govuk) {
    const out = await ingestGovukPublication(govuk, { actor: arg('actor', 'radar:govuk') })
    if (!out.ok) {
      console.error('govuk ingest failed:', out.error)
      process.exit(1)
    }
    console.log(`${out.action} ${out.id} v${out.version}`)
    console.log(`  ${out.publication.title}`)
    console.log(`  band ${out.band}, score ${out.score}, ${out.words.toLocaleString()} words of full text`)
    console.log(`  full text: ${out.fullTextPath}`)
    console.log('  status DISCOVERED. It is not reviewed, and the brief will say so.')
    process.exit(0)
  }

  const file = process.argv[2]
  if (!file || file.startsWith('--')) {
    console.error('usage: node scripts/radar/ingest.mjs <file> --title "..." [--url ...] [--publisher ...] [--published YYYY-MM-DD] [--official]')
    console.error('   or: node scripts/radar/ingest.mjs --govuk /government/publications/<slug>')
    process.exit(1)
  }
  try {
    const out = ingestDocument({
      file,
      title: arg('title'),
      url: arg('url'),
      publisher: arg('publisher'),
      published: arg('published'),
      authors: arg('authors'),
      official: process.argv.includes('--official') ? true : null,
      actor: arg('actor', 'radar:drop'),
    })
    console.log(`${out.action} ${out.id} v${out.version}`)
    console.log(`  band ${out.band}, score ${out.score}, ${out.words} words of full text`)
    console.log(`  full text: ${out.fullTextPath}`)
    console.log('  status DISCOVERED. It is not reviewed, and the brief will say so.')
  } catch (e) {
    console.error('ingest failed:', e.message)
    process.exit(1)
  }
}
