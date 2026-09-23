// WHAT A SOURCE ROW'S STATUS SHOWS ON THE LESSON PAGE.
//
// The teacher's panel, "Where the claims come from", marks each row with one
// of three words: checked against the primary document, not yet checked, or
// a mechanism that needs no figure. Four lessons written in September stored
// something better in the same field: the note itself, saying what was
// checked and how the lesson uses the source ("Confirmed, including that the
// exclusion cannot be deactivated early", "DEMOTED and deliberately not
// used"). The page knew three words and drew anything else as "Mechanism, no
// figure". So 24 notes never showed, and a source a lesson deliberately
// refuses to rely on was badged as though it backed the lesson (found 23
// September 2026).
//
// The fix is to show what was written. A note is not squeezed into one of
// the three badges, because only its author knows which it would be, and the
// note already says so in words. scripts/check-evidence-status.mjs holds
// every row in content/modules to this, and the lesson page to rendering
// through it.

export const EVIDENCE_BADGE = {
  verified: 'Checked',
  verify: 'Not yet checked',
  mechanism: 'Mechanism, no figure',
} as const

export type EvidenceKeyword = keyof typeof EVIDENCE_BADGE

export type EvidenceStatus =
  | { kind: EvidenceKeyword; badge: string }
  | { kind: 'note'; note: string }

export function evidenceStatus(status: unknown): EvidenceStatus {
  const s = typeof status === 'string' ? status.trim() : ''
  if (Object.prototype.hasOwnProperty.call(EVIDENCE_BADGE, s)) {
    const k = s as EvidenceKeyword
    return { kind: k, badge: EVIDENCE_BADGE[k] }
  }
  // No status at all means nobody has said it was checked, so it says so
  // rather than borrowing a better badge. The guard fails on it as well.
  if (!s) return { kind: 'verify', badge: EVIDENCE_BADGE.verify }
  return { kind: 'note', note: s }
}
