import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = pathToFileURL(process.cwd() + '/')

export async function resolve(specifier, context, nextResolve) {
  let spec = specifier
  if (spec.startsWith('@/')) spec = new URL(spec.slice(2), ROOT).href
  // The shared package is a file: dependency with no exports map, so a bare
  // `@gc/shared/x` has to become the repo's own `shared/x` before the
  // extension search below can find it.
  if (spec.startsWith('@gc/shared/')) spec = new URL('shared/' + spec.slice('@gc/shared/'.length), ROOT).href
  const relative = spec.startsWith('./') || spec.startsWith('../') || spec.startsWith('file:')
  if (relative && !/\.[a-z]+$/i.test(spec)) {
    const base = spec.startsWith('file:') ? spec : new URL(spec, context.parentURL).href
    for (const suffix of ['.ts', '.tsx', '/index.ts']) {
      const candidate = base + suffix
      if (existsSync(fileURLToPath(candidate))) return nextResolve(candidate, context)
    }
  }
  return nextResolve(spec, context)
}
