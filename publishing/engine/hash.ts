// What an approval approves.
//
// An approval in the dashboard records the content hash of the issue it was
// given against (and, at the final gate, the hash of the PDF too). Change one
// word after approval and the hash moves, the approval no longer matches, and
// the gate closes again. That is the whole of "no content may be published
// without explicit final approval", enforced rather than hoped for.
//
// The hash is over canonical JSON (keys sorted), so reformatting the file or
// reordering keys does not void an approval, and changing any value does.

import { createHash } from 'node:crypto'

export function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`
  if (v && typeof v === 'object') {
    return `{${Object.keys(v as Record<string, unknown>).sort().map(k => `${JSON.stringify(k)}:${canonical((v as Record<string, unknown>)[k])}`).join(',')}}`
  }
  return JSON.stringify(v)
}

export const sha256 = (s: string | Buffer) => createHash('sha256').update(s).digest('hex')

export const contentHash = (issue: unknown) => sha256(canonical(issue))

// The story selection that Approval One signs: the chosen stories and their
// sources, not the finished copy, which does not exist yet at that gate.
export const storiesHash = (stories: { id: string; headline: string; sourceUrl: string }[]) =>
  sha256(canonical(stories.map(s => ({ id: s.id, headline: s.headline, sourceUrl: s.sourceUrl })).sort((a, b) => a.id.localeCompare(b.id))))
