import { existsSync, realpathSync } from 'node:fs'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { dirname, resolve as pres } from 'node:path'
const ROOT = process.env.GC_ROOT
const tryFile = (p) => { for (const c of [p, p + '.ts', p + '.tsx', p + '/index.ts']) if (existsSync(c) && !c.endsWith('/') && !existsSync(c + '/.') ) return c; for (const c of [p + '.ts', p + '/index.ts']) if (existsSync(c)) return c; return null }
export async function resolve(spec, ctx, next) {
  if (spec.startsWith('@/')) { const f = tryFile(pres(ROOT, spec.slice(2))); if (f) return { url: pathToFileURL(realpathSync(f)).href, shortCircuit: true } }
  if ((spec.startsWith('./') || spec.startsWith('../')) && ctx.parentURL?.startsWith('file:')) {
    const base = dirname(fileURLToPath(ctx.parentURL)); const p = pres(base, spec)
    if (!existsSync(p) || !/\.\w+$/.test(spec)) { const f = tryFile(p); if (f) return { url: pathToFileURL(realpathSync(f)).href, shortCircuit: true } }
  }
  try { return await next(spec, ctx) } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND' && e.url) { const f = tryFile(fileURLToPath(e.url)); if (f) return { url: pathToFileURL(realpathSync(f)).href, shortCircuit: true } }
    throw e
  }
}
