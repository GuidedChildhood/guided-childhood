// The production store: the tables of migration 377, through the service role
// client. Used by the dashboard's API route and by the monthly routine when it
// has database secrets. Same interface as the file store, same guards above it.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { GenerationRecord, Release, Store } from './store'
import type { Event, IssueState, State } from './workflow'

const must = <T>(r: { data: T | null; error: { message: string } | null }, what: string): T | null => {
  if (r.error) throw new Error(`${what}: ${r.error.message}`)
  return r.data
}

type Meta = (issue: number) => { slug: string; edition: string; month: string }

export class SupabaseStore implements Store {
  private db: SupabaseClient
  private meta: Meta
  constructor(db: SupabaseClient, meta: Meta) { this.db = db; this.meta = meta }

  async getIssue(issue: number): Promise<IssueState | null> {
    const row = must(await this.db.from('planet_issues').select('*').eq('number', issue).maybeSingle(), 'read issue') as Record<string, string | number | null> | null
    if (!row) return null
    return {
      number: row.number as number, state: row.state as State, updatedAt: row.updated_at as string,
      storiesHash: (row.stories_hash as string) ?? undefined, contentHash: (row.content_hash as string) ?? undefined,
      pdfHash: (row.pdf_hash as string) ?? undefined, approvedContentHash: (row.approved_content_hash as string) ?? undefined,
      approvedPdfHash: (row.approved_pdf_hash as string) ?? undefined,
    }
  }
  async putIssue(s: IssueState) {
    must(await this.db.from('planet_issues').upsert({
      number: s.number, ...this.meta(s.number), state: s.state, updated_at: s.updatedAt,
      stories_hash: s.storiesHash ?? null, content_hash: s.contentHash ?? null, pdf_hash: s.pdfHash ?? null,
      approved_content_hash: s.approvedContentHash ?? null, approved_pdf_hash: s.approvedPdfHash ?? null,
    }), 'write issue')
  }
  async addEvent(e: Event) {
    must(await this.db.from('planet_issue_events').insert({ issue: e.issue, at: e.at, actor_kind: e.actor.kind, actor_id: e.actor.id, action: e.action, from_state: e.from ?? null, to_state: e.to ?? null, detail: e.detail ?? {} }), 'write event')
  }
  async events(issue: number): Promise<Event[]> {
    const rows = must(await this.db.from('planet_issue_events').select('*').eq('issue', issue).order('at'), 'read events') as Record<string, unknown>[] | null
    return (rows ?? []).map(r => ({ issue, at: r.at as string, actor: { kind: r.actor_kind as 'founder' | 'automation', id: r.actor_id as string }, action: r.action as string, from: (r.from_state as State) ?? undefined, to: (r.to_state as State) ?? undefined, detail: r.detail as Record<string, unknown> }))
  }
  async setStoryDecision(issue: number, id: string, decision: 'approved' | 'rejected' | 'revise', note?: string) {
    must(await this.db.from('planet_stories').update({ decision, decision_note: note ?? null, decided_at: new Date().toISOString() }).eq('issue', issue).eq('id', id), 'decide story')
  }
  async storyDecisions(issue: number) {
    const rows = must(await this.db.from('planet_stories').select('id, decision, decision_note').eq('issue', issue), 'read stories') as { id: string; decision: string | null; decision_note: string | null }[] | null
    const out: Record<string, { decision: string; note?: string }> = {}
    for (const r of rows ?? []) if (r.decision) out[r.id] = { decision: r.decision, note: r.decision_note ?? undefined }
    return out
  }
  async getRelease(issue: number, channel: string): Promise<Release | null> {
    const r = must(await this.db.from('planet_releases').select('*').eq('issue', issue).eq('channel', channel).maybeSingle(), 'read release') as Record<string, unknown> | null
    return r ? { issue, channel, key: r.key as string, status: r.status as Release['status'], at: r.at as string, external: (r.external as string) ?? undefined, detail: r.detail as Record<string, unknown> } : null
  }
  async putRelease(r: Release) {
    must(await this.db.from('planet_releases').upsert({ issue: r.issue, channel: r.channel, key: r.key, status: r.status, at: r.at, external: r.external ?? null, detail: r.detail ?? {} }), 'write release')
  }
  async addGeneration(g: GenerationRecord) {
    must(await this.db.from('planet_generations').upsert({ ...g, credits: g.credits ?? null, estimate: g.estimate ?? null }), 'write generation')
  }
  async generations(issue: number) {
    return (must(await this.db.from('planet_generations').select('*').eq('issue', issue).order('at'), 'read generations') ?? []) as GenerationRecord[]
  }
  async budget(issue: number) {
    const r = must(await this.db.from('planet_budgets').select('*').eq('issue', issue).maybeSingle(), 'read budget') as { credits: number; approved_by: string; at: string } | null
    return r ? { credits: Number(r.credits), approvedBy: r.approved_by, at: r.at } : null
  }
  async setBudget(issue: number, credits: number, approvedBy: string) {
    must(await this.db.from('planet_budgets').upsert({ issue, credits, approved_by: approvedBy, at: new Date().toISOString() }), 'write budget')
  }
}
