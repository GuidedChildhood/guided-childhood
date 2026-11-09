// The queue Stage 2 reads to answer one question: what do I work on next?
//
// Requirement 7 of the build brief: "Ensure ChatGPT can identify the next
// EDITORIAL READY story without guessing." So this is deliberately small,
// flat and sorted. ChatGPT reads manifest.json, takes queue[0], opens the
// handoff doc named in it, and produces. No searching and no judgement about
// which story is next.
//
// It is generated, never hand edited. The register is the source of truth.

import { writeFileSync } from 'node:fs'
import * as reg from './register.mjs'

export function buildManifest() {
  const rank = { BREAKING: 0, HIGH: 1, BANK: 2, LOW: 3 }
  const ready = reg.byStatus('EDITORIAL READY').sort((a, b) =>
    (rank[a.editorialPriority] ?? 9) - (rank[b.editorialPriority] ?? 9)
    || String(a.firstFound).localeCompare(String(b.firstFound)))

  return {
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    purpose: 'Stage 1 to Stage 2 queue. Take queue[0], open its handoffDoc, produce the pack, save it back to Drive. Nothing publishes without Justin.',
    rules: [
      'Do not assign a GDC post number here. content/gdc-post-register.md is the only place a number is claimed.',
      'Only figures listed in the handoff under FIGURES CLEARED FOR USE may appear in copy.',
      'A story with claudeStatus other than CLAUDE REVIEWED is not eligible, whatever else it says.',
      'Mark PUBLISHED only after a live URL has been checked. scripts/radar/posted.mjs does that check.',
    ],
    counts: reg.stats(),
    queue: ready.map((r) => ({
      researchId: r.studyId,
      title: r.title,
      proposedTitle: r.claudeReview?.proposedTitle || null,
      editorialPriority: r.editorialPriority || 'BANK',
      urgency: r.claudeReview?.urgency || null,
      claudeStatus: r.claudeStatus || 'PENDING',
      claudeVerdict: r.claudeReview?.verdict || null,
      recommendedPlatforms: r.claudeReview?.recommendedPlatforms || [],
      gdcPostNumber: r.gdcPostNumber || null,
      primaryUrl: r.url || null,
      doi: r.doi || null,
      publishedDate: r.dossier?.crossrefOnlineDate || r.published || null,
      design: r.dossier?.design || null,
      figuresCleared: (r.claudeReview?.verifiedStatistics || []).length,
      handoffDoc: r.driveHandoffDoc || null,
      handoffJsonInRepo: r.handoff?.json || null,
      firstFound: r.firstFound,
      registerVersion: r.version,
    })),
    blockedSources: 'see scripts/radar/sources.mjs BLOCKED_SOURCES for what the radar cannot reach and why',
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const m = buildManifest()
  const out = process.argv[2] || 'content/research-register/manifest.json'
  writeFileSync(out, JSON.stringify(m, null, 1))
  console.log(`manifest written to ${out}`)
  console.log(`queue length ${m.queue.length}`)
  if (m.queue[0]) console.log(`next: ${m.queue[0].researchId}  ${m.queue[0].editorialPriority}  ${m.queue[0].title.slice(0, 60)}`)
}
