import IssueOfTheWeek from '@/components/home/IssueOfTheWeek'
import { pickIssue } from '@/lib/home/issue-of-week'
import { issuesForBand } from '@/lib/content/device-issues'
import type { AgeBand } from '@/lib/content/stages'

// Layout harness for the fix of the week card. No auth, no data: the bank's
// scripts stood in with fake numbers, so the card for every band can be
// looked at, fresh and kept up. ?band=8-10 (default), ?kept=1.
export default async function Page({ searchParams }: { searchParams: Promise<{ band?: string; kept?: string }> }) {
  const sp = await searchParams
  const band = (['4-7', '8-10', '11-13', '13-15', '16+'].includes(sp.band ?? '') ? sp.band : '8-10') as AgeBand
  const rows = issuesForBand(band).flatMap((i, n) => i.proof.scripts.map((t, k) => ({ sort_order: n * 10 + k + 1, title: t, is_free: k === 0 })))
  const acted = sp.kept === '1' ? new Set(rows.map(r => r.sort_order)) : new Set<number>()
  const pick = pickIssue(band, rows, acted, 2)
  return (
    <div style={{ padding: '24px 20px', maxWidth: 720, margin: '0 auto' }}>
      {pick && <IssueOfTheWeek pick={{ ...pick, href: '/dashboard/scripts' }} childName="Teo" />}
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>?band=4-7, 8-10, 11-13, 13-15, 16+ and ?kept=1</p>
    </div>
  )
}
