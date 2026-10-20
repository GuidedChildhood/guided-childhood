// THE WORKFLOW, and the two doors only the founder can open.
//
//   DRAFT → RESEARCHED → VERIFIED → EDITORIAL REVIEW ─(approval one)→ APPROVED
//         → DESIGNING → PROOF READY ─(approval two)→ FINAL APPROVED → PUBLISHED
//
// Everything that moves an issue forward without a door is automatic: the
// monthly routine does it and records that it did. The two doors are
// EDITORIAL REVIEW → APPROVED ("here are the proposed stories") and
// PROOF READY → FINAL APPROVED ("here is the finished newspaper"). Only an
// actor of kind 'founder' can open them, and each records what it approved by
// hash. PUBLISHED needs a founder too, and refuses unless the files about to
// go out are byte for byte the ones that were approved.
//
// Every transition, decision and refusal is an event. The event log is the
// audit trail and it is append only: there is no function here that edits or
// deletes one.

import type { Store } from './store'

export const STATES = [
  'DRAFT', 'RESEARCHED', 'VERIFIED', 'EDITORIAL_REVIEW', 'APPROVED',
  'DESIGNING', 'PROOF_READY', 'FINAL_APPROVED', 'PUBLISHED',
] as const
export type State = typeof STATES[number]

export const LABEL: Record<State, string> = {
  DRAFT: 'Draft', RESEARCHED: 'Researched', VERIFIED: 'Verified', EDITORIAL_REVIEW: 'Editorial review',
  APPROVED: 'Approved', DESIGNING: 'Designing', PROOF_READY: 'Proof ready', FINAL_APPROVED: 'Final approved', PUBLISHED: 'Published',
}

export type Actor = { kind: 'founder' | 'automation'; id: string }

export type IssueState = {
  number: number
  state: State
  storiesHash?: string        // what approval one approved
  contentHash?: string        // the issue file at proof
  pdfHash?: string            // the download PDF at proof
  approvedContentHash?: string
  approvedPdfHash?: string
  updatedAt: string
}

export type Event = {
  issue: number
  at: string
  actor: Actor
  action: string
  from?: State
  to?: State
  detail?: Record<string, unknown>
}

// The moves the routine may make on its own, and the moves only Justin can.
const AUTOMATIC: Partial<Record<State, State[]>> = {
  DRAFT: ['RESEARCHED'],
  RESEARCHED: ['VERIFIED'],
  VERIFIED: ['EDITORIAL_REVIEW'],
  APPROVED: ['DESIGNING'],
  DESIGNING: ['PROOF_READY'],
}
const FOUNDER: Partial<Record<State, State[]>> = {
  EDITORIAL_REVIEW: ['APPROVED', 'RESEARCHED'],   // approve the stories, or send back for changes
  PROOF_READY: ['FINAL_APPROVED', 'DESIGNING'],   // approve the paper, or ask for revisions
  FINAL_APPROVED: ['PUBLISHED', 'DESIGNING'],     // authorise publication, or reopen
}

export class GateError extends Error {}

export function allowed(from: State, to: State, actor: Actor): boolean {
  const list = (actor.kind === 'founder' ? mergeLists(AUTOMATIC, FOUNDER) : AUTOMATIC)[from] ?? []
  return list.includes(to)
}
function mergeLists(a: Partial<Record<State, State[]>>, b: Partial<Record<State, State[]>>) {
  const out: Partial<Record<State, State[]>> = {}
  for (const s of STATES) out[s] = [...(a[s] ?? []), ...(b[s] ?? [])]
  return out
}

const now = () => new Date().toISOString()

export async function current(store: Store, issue: number): Promise<IssueState> {
  return (await store.getIssue(issue)) ?? { number: issue, state: 'DRAFT', updatedAt: now() }
}

// The one function that moves an issue. Every guard lives here, so no caller
// can route around one.
export async function transition(store: Store, issue: number, to: State, actor: Actor, detail: Record<string, unknown> = {}): Promise<IssueState> {
  const s = await current(store, issue)
  const from = s.state
  const refuse = async (why: string): Promise<never> => {
    await store.addEvent({ issue, at: now(), actor, action: 'refused', from, to, detail: { ...detail, why } })
    throw new GateError(why)
  }
  if (!allowed(from, to, actor)) return refuse(`${actor.kind} cannot move issue ${issue} from ${from} to ${to}`)

  const next: IssueState = { ...s, state: to, updatedAt: now() }

  if (to === 'EDITORIAL_REVIEW') {
    if (typeof detail.storiesHash !== 'string') return refuse('a review needs the story selection it is asking about (storiesHash)')
    next.storiesHash = detail.storiesHash
  }
  if (from === 'EDITORIAL_REVIEW' && to === 'APPROVED') {
    // Justin may approve the proposal as it stands, or a selection he changed
    // (a story dropped, a held one brought in). reviewedHash is the proposal he
    // was shown, so a stale screen cannot approve a list that has since moved;
    // storiesHash is what he approved, and it is what design is held to.
    if (typeof detail.storiesHash !== 'string') return refuse('approval one must name the story selection it approves (storiesHash)')
    const shown = typeof detail.reviewedHash === 'string' ? detail.reviewedHash : detail.storiesHash
    if (s.storiesHash && s.storiesHash !== shown) return refuse('the proposal changed since it was put up for review. Reload and look again.')
    next.storiesHash = detail.storiesHash
  }
  if (to === 'PROOF_READY') {
    if (typeof detail.contentHash !== 'string' || typeof detail.pdfHash !== 'string') return refuse('a proof needs the content hash and the PDF hash it was made from')
    if (detail.renderOk !== true) return refuse('the render report has errors, so there is no proof to show')
    next.contentHash = detail.contentHash
    next.pdfHash = detail.pdfHash
    delete next.approvedContentHash
    delete next.approvedPdfHash
  }
  if (from === 'PROOF_READY' && to === 'FINAL_APPROVED') {
    if (detail.contentHash !== s.contentHash || detail.pdfHash !== s.pdfHash) return refuse('the approval is for a different proof than the one on file')
    next.approvedContentHash = s.contentHash
    next.approvedPdfHash = s.pdfHash
  }
  if (to === 'PUBLISHED') {
    if (!s.approvedContentHash || !s.approvedPdfHash) return refuse('nothing has final approval')
    if (detail.contentHash !== s.approvedContentHash) return refuse('the issue file has changed since final approval. Render a new proof and approve it.')
    if (detail.pdfHash !== s.approvedPdfHash) return refuse('the PDF about to go out is not the PDF that was approved')
  }
  if ((from === 'PROOF_READY' || from === 'FINAL_APPROVED') && to === 'DESIGNING') {
    delete next.approvedContentHash
    delete next.approvedPdfHash
  }

  await store.putIssue(next)
  await store.addEvent({ issue, at: now(), actor, action: 'transition', from, to, detail })
  return next
}

// A decision on one story at approval one: approve, reject, or ask for a
// revision with a note. Recorded, never silently applied.
export async function decideStory(store: Store, issue: number, storyId: string, decision: 'approved' | 'rejected' | 'revise', actor: Actor, note?: string) {
  if (actor.kind !== 'founder') throw new GateError('only the founder decides on stories')
  const s = await current(store, issue)
  if (s.state !== 'EDITORIAL_REVIEW') throw new GateError(`stories are decided at editorial review, and issue ${issue} is ${LABEL[s.state]}`)
  await store.setStoryDecision(issue, storyId, decision, note)
  await store.addEvent({ issue, at: now(), actor, action: 'story-decision', detail: { storyId, decision, note } })
}

// What the founder is being asked for right now, in one sentence, or null.
export function waitingOn(s: IssueState): string | null {
  if (s.state === 'EDITORIAL_REVIEW') return 'Approval one: here are the proposed stories. Approve or request changes.'
  if (s.state === 'PROOF_READY') return 'Approval two: here is the finished newspaper. Approve publication or request revisions.'
  if (s.state === 'FINAL_APPROVED') return 'Approved. Authorise publication when you are ready.'
  return null
}

// Approval two's second half: Justin authorises publication from the
// dashboard, and the routine, which holds the files, carries it out. The
// authorisation is an event bound to the approved PDF, so a routine can only
// ever publish the exact file Justin saw.
export async function authorise(store: Store, issue: number, channels: string[], actor: Actor) {
  if (actor.kind !== 'founder') throw new GateError('only the founder authorises publication')
  const s = await current(store, issue)
  if (s.state !== 'FINAL_APPROVED' && s.state !== 'PUBLISHED') throw new GateError(`issue ${issue} is ${LABEL[s.state]}; publication needs final approval first`)
  await store.addEvent({ issue, at: now(), actor, action: 'publication-authorised', detail: { channels, pdfHash: s.approvedPdfHash, contentHash: s.approvedContentHash } })
}

export async function authorisationFor(store: Store, issue: number, channel: string, pdfHash: string): Promise<Actor | null> {
  const ev = (await store.events(issue)).filter(e => e.action === 'publication-authorised' && e.detail?.pdfHash === pdfHash && Array.isArray(e.detail?.channels) && (e.detail.channels as string[]).includes(channel))
  return ev.length ? ev[ev.length - 1].actor : null
}
