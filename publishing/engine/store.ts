// WHERE THE WORKFLOW KEEPS ITS STATE.
//
// Two stores with one interface. The Supabase store (store-supabase.ts) is the
// real one: the dashboard reads and writes it, and it holds the audit trail
// (migration 377). The file store keeps the same records as JSON beside the
// issue, for local runs, tests and a routine that has no database secrets. The
// workflow cannot tell them apart, which is the point: every guard is tested
// against the same code that runs in production.

import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Event, IssueState } from './workflow'

export type Release = {
  issue: number
  channel: string               // website, drive, mailchimp, resend, linkedin, facebook, instagram
  key: string                   // the idempotency key: issue, channel and the PDF hash
  status: 'prepared' | 'sent' | 'failed' | 'manual'
  at: string
  external?: string             // the id or URL the channel gave back
  detail?: Record<string, unknown>
}

export type GenerationRecord = {
  id: string                    // our id for the attempt
  issue: number
  slot: string
  recipe: string
  tier: 'draft' | 'final'
  prompt: string
  model: string
  status: 'planned' | 'submitted' | 'completed' | 'approved' | 'rejected' | 'failed'
  credits?: number              // as reported by Higgsfield, never estimated here
  estimate?: number
  job?: string                  // Higgsfield job id
  url?: string
  reason?: string               // why it was rejected or failed
  at: string
}

export interface Store {
  getIssue(issue: number): Promise<IssueState | null>
  putIssue(s: IssueState): Promise<void>
  addEvent(e: Event): Promise<void>
  events(issue: number): Promise<Event[]>
  setStoryDecision(issue: number, storyId: string, decision: 'approved' | 'rejected' | 'revise', note?: string): Promise<void>
  storyDecisions(issue: number): Promise<Record<string, { decision: string; note?: string }>>
  getRelease(issue: number, channel: string): Promise<Release | null>
  putRelease(r: Release): Promise<void>
  addGeneration(g: GenerationRecord): Promise<void>
  generations(issue: number): Promise<GenerationRecord[]>
  budget(issue: number): Promise<{ credits: number; approvedBy?: string; at?: string } | null>
  setBudget(issue: number, credits: number, approvedBy: string): Promise<void>
}

type FileState = {
  issue?: IssueState
  stories: Record<string, { decision: string; note?: string }>
  releases: Record<string, Release>
  generations: GenerationRecord[]
  budget?: { credits: number; approvedBy?: string; at?: string }
}

export class FileStore implements Store {
  constructor(private dir: string) {}
  private path(issue: number) { return join(this.dir, String(issue).padStart(3, '0'), 'state.json') }
  private log(issue: number) { return join(this.dir, String(issue).padStart(3, '0'), 'events.jsonl') }
  private read(issue: number): FileState {
    const p = this.path(issue)
    return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : { stories: {}, releases: {}, generations: [] }
  }
  private write(issue: number, s: FileState) {
    mkdirSync(join(this.dir, String(issue).padStart(3, '0')), { recursive: true })
    writeFileSync(this.path(issue), JSON.stringify(s, null, 2) + '\n')
  }
  async getIssue(issue: number) { return this.read(issue).issue ?? null }
  async putIssue(st: IssueState) { const s = this.read(st.number); s.issue = st; this.write(st.number, s) }
  async addEvent(e: Event) {
    mkdirSync(join(this.dir, String(e.issue).padStart(3, '0')), { recursive: true })
    appendFileSync(this.log(e.issue), JSON.stringify(e) + '\n')
  }
  async events(issue: number) {
    const p = this.log(issue)
    return existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l) as Event) : []
  }
  async setStoryDecision(issue: number, id: string, decision: 'approved' | 'rejected' | 'revise', note?: string) {
    const s = this.read(issue); s.stories[id] = { decision, note }; this.write(issue, s)
  }
  async storyDecisions(issue: number) { return this.read(issue).stories }
  async getRelease(issue: number, channel: string) { return this.read(issue).releases[channel] ?? null }
  async putRelease(r: Release) { const s = this.read(r.issue); s.releases[r.channel] = r; this.write(r.issue, s) }
  async addGeneration(g: GenerationRecord) { const s = this.read(g.issue); s.generations.push(g); this.write(g.issue, s) }
  async generations(issue: number) { return this.read(issue).generations }
  async budget(issue: number) { return this.read(issue).budget ?? null }
  async setBudget(issue: number, credits: number, approvedBy: string) {
    const s = this.read(issue); s.budget = { credits, approvedBy, at: new Date().toISOString() }; this.write(issue, s)
  }
}
