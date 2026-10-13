// FROM THE REPO TO THE DASHBOARD.
//
// The issue file, its research and its render report go into the tables of
// migration 377 as a new version (one row per distinct content hash, so a
// re-sync of the same words writes nothing), the candidate stories become
// rows the founder can decide on, and the previews and PDFs go to the private
// guided-planet storage bucket, where the dashboard shows them by signed URL.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pad3 } from '../engine/html'
import { contentHash } from '../engine/hash'
import { current } from '../engine/workflow'
import { issueDir, loadIssue } from '../pdf-engine/render'
import { openStore } from './commands'
import { loadCandidates } from './cycle'

export async function sync(n: number): Promise<string> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return 'Not synced: NEXT_PUBLIC_SUPABASE_URL and a service key are needed (and migration 377 applied).'
  const { createClient } = await import('@supabase/supabase-js')
  const db = createClient(url, key)
  const { store } = await openStore()
  const issue = loadIssue(n)
  const dir = issueDir(n)
  const NNN = pad3(n)

  // The issue row exists before anything references it.
  await store.putIssue(await current(store, n))

  const report = existsSync(join(dir, 'dist', 'report.json')) ? JSON.parse(readFileSync(join(dir, 'dist', 'report.json'), 'utf8')) : null
  const research = existsSync(join(dir, 'research.json')) ? JSON.parse(readFileSync(join(dir, 'research.json'), 'utf8')) : null
  const v = await db.from('planet_issue_versions').upsert({ issue: n, content_hash: contentHash(issue), content: issue, research, render_report: report }, { onConflict: 'issue,content_hash', ignoreDuplicates: true })
  if (v.error) throw new Error(`version: ${v.error.message}`)

  const stories = loadCandidates(n)
  if (stories.length) {
    const s = await db.from('planet_stories').upsert(stories.map(c => ({ issue: n, id: c.id, record: c, total: c.total ?? null })), { onConflict: 'issue,id' })
    if (s.error) throw new Error(`stories: ${s.error.message}`)
  }

  let uploaded = 0
  const files: string[] = []
  const dist = join(dir, 'dist')
  if (existsSync(dist)) {
    for (const f of readdirSync(dist)) if (/\.(pdf|png|json)$/.test(f)) files.push(f)
    if (existsSync(join(dist, 'pages'))) for (const f of readdirSync(join(dist, 'pages'))) files.push(`pages/${f}`)
  }
  for (const f of files) {
    const type = f.endsWith('.pdf') ? 'application/pdf' : f.endsWith('.png') ? 'image/png' : 'application/json'
    const up = await db.storage.from('guided-planet').upload(`issue-${NNN}/${f}`, readFileSync(join(dist, f)), { contentType: type, upsert: true })
    if (up.error) throw new Error(`upload ${f}: ${up.error.message}`)
    uploaded++
  }
  return `Issue ${NNN} synced: version ${contentHash(issue).slice(0, 12)}, ${stories.length} stories, ${uploaded} files.`
}
