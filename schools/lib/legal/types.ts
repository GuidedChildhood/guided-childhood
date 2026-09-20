// THE SHAPE OF A LEGAL DOCUMENT ON THE SCHOOLS SITE.
//
// Three documents share it (the terms, the privacy notice and the data
// processing agreement, 13 September 2026), so one renderer draws all three
// and a guard can read all three the same way. Every clause is numbered so a
// solicitor, a DPO or a business manager can cite it, and every document
// carries a version and a date so a school knows which one it accepted.
//
// Plain data on purpose. No JSX in here: the words are the product, and a
// file of words is what a solicitor's pass reads and returns.

export type Clause = { n: string; text: string; bullets?: string[] }

export type Section = {
  id: string
  n: number
  title: string
  /** An unnumbered line under the heading, used where a section's clauses
   *  all hang off one condition (the Article 28 terms). */
  lead?: string
  clauses: Clause[]
}

export type AnnexRow = { label: string; text: string }

export type Annex = { id: string; title: string; intro?: string; rows: AnnexRow[] }

export type SignatureLine = { label: string; value?: string }

export type SignatureBlock = { heading: string; lines: SignatureLine[] }

export type Related = { href: string; label: string }

export type LegalDoc = {
  slug: 'terms' | 'privacy' | 'dpa'
  eyebrow: string
  title: string
  description: string
  version: string
  dated: string
  /** The "In plain words" box: what the document says, in Justin's voice. */
  plain: string[]
  sections: Section[]
  annexes?: Annex[]
  signatures?: { left: SignatureBlock; right: SignatureBlock; note: string }
  related: Related[]
}

type ClauseInput = string | { text: string; bullets: string[] }

/** Number a section's clauses as n.1, n.2 ... from plain strings. */
export function section(n: number, id: string, title: string, clauses: ClauseInput[], lead?: string): Section {
  return {
    id, n, title, lead,
    clauses: clauses.map((c, i) =>
      typeof c === 'string' ? { n: `${n}.${i + 1}`, text: c } : { n: `${n}.${i + 1}`, text: c.text, bullets: c.bullets }
    ),
  }
}

/** The one version line every document shows at the top and the foot. */
export const LEGAL_VERSION = '1.0'
export const LEGAL_DATED = '20 September 2026'
