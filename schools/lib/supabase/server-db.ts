// TEMPORARY LOCAL STAND IN for filming (teacher film v3, 24 November 2026).
// Never commit. The real file is backed up in the session scratchpad and is
// restored after the captures. Reads content/modules/*.json, nothing else.
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), '..', 'content', 'modules')
function lessons(): Record<string, unknown>[] {
  return readdirSync(dir).filter(f => f.endsWith('.json')).map(f => {
    const d = JSON.parse(readFileSync(join(dir, f), 'utf8'))
    const { row, ...rest } = d
    return { id: d.module_id, home_code: null, ...row, ...rest }
  })
}

type Row = Record<string, unknown>
function builder(table: string) {
  let rows: Row[] = table === 'school_lessons' ? lessons() : []
  let single = false
  const api: Record<string, unknown> = {}
  const self = new Proxy(api, {
    get(_t, prop: string) {
      if (prop === 'then') {
        const data = single ? (rows[0] ?? null) : rows
        return (res: (v: unknown) => unknown) => Promise.resolve({ data, error: null, count: rows.length }).then(res)
      }
      if (prop === 'eq') return (k: string, v: unknown) => { rows = rows.filter(r => r[k] === v); return self }
      if (prop === 'in') return (k: string, v: unknown[]) => { rows = rows.filter(r => v.includes(r[k])); return self }
      if (prop === 'order') return (k: string, o?: { ascending?: boolean }) => { rows = [...rows].sort((a, b) => ((a[k] as number) > (b[k] as number) ? 1 : -1) * (o?.ascending === false ? -1 : 1)); return self }
      if (prop === 'maybeSingle' || prop === 'single') return () => { single = true; return self }
      if (prop === 'insert' || prop === 'update' || prop === 'upsert' || prop === 'delete') return () => { rows = []; return self }
      return () => self
    },
  })
  return self
}

export const db = {
  from: (t: string) => builder(t),
  schema: () => ({ from: (t: string) => builder(t) }),
} as unknown as ReturnType<typeof import('@supabase/supabase-js').createClient>
