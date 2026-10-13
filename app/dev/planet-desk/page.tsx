import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import PlanetDesk, { type DeskData } from '@/app/(dashboard)/dashboard/admin/planet/[n]/PlanetDesk'
import type { State } from '@/publishing/engine/workflow'
import { rank, type Candidate } from '@/publishing/research/scoring'

// Dev fixture for The Guided Planet's newspaper desk, with Issue 001's real
// research and sources and no database. Buttons post and fail here, which is
// fine: the fixture is for eyes and thumbs on a phone and a desktop.
//
//   /dev/planet-desk                   approval one, the stories
//   /dev/planet-desk?state=PROOF_READY  approval two, the paper

export default async function PlanetDeskFixture({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const state = ((await searchParams).state ?? 'EDITORIAL_REVIEW') as State
  const dir = join(process.cwd(), 'publishing', 'issues', '001')
  const research = JSON.parse(readFileSync(join(dir, 'research.json'), 'utf8'))
  const issue = JSON.parse(readFileSync(join(dir, 'issue.json'), 'utf8'))
  const report = JSON.parse(readFileSync(join(dir, 'dist', 'report.json'), 'utf8'))
  const data: DeskData = {
    issue: 1, state, storiesHash: 'fixture', contentHash: report.contentHash, pdfHash: 'fixture',
    stories: rank(research.candidates as Candidate[]).map((c, i) => ({ id: c.id, record: c as unknown as DeskData['stories'][number]['record'], total: c.total ?? null, decision: i < 5 ? 'approved' : null, note: null })),
    sources: issue.sources, report, previews: Array(12).fill(null), pdf: null, sourcesPdf: null,
    generations: [], budget: null, releases: [],
  }
  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 18px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', fontWeight: 900, margin: '0 0 12px' }}>The Curiosity Edition</h1>
      <PlanetDesk data={data} />
    </div>
  )
}
