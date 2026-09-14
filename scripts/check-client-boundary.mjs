// A server file must never CALL a named export of a 'use client' module.
//
// Justin, 14 September 2026, from his phone: "clicked use device time in
// child's app and error." Every child, every time. The child's Ask for screen
// time page (a server component) imported askDevicesFrom by name from
// components/kid/KidAskScreenTime.tsx, which is 'use client', and called it
// while rendering.
//
// ── WHY THAT IS FATAL, AND WHY NOTHING NOTICED ──────────────────────────────
//
// Next compiles a 'use client' module into the SERVER graph as client
// REFERENCES, not as code. Its own flight loader replaces every named export
// with a function whose only behaviour is to throw:
//
//   function () { throw new Error("Attempted to call askDevicesFrom() from the
//     server but askDevicesFrom is on the client...") }
//
// (node_modules/next/dist/build/webpack/loaders/next-flight-loader/index.js)
//
// So the import resolves, TypeScript sees an ordinary function and is happy,
// and the call throws on every request. Three things then hid it:
//
//   1. tsc cannot see the boundary at all. It type checks the source, and the
//      source is a real function.
//   2. The route is `export const dynamic = 'force-dynamic'`, so `next build`
//      never renders it. The build was green the whole time.
//   3. The only other place the screen was exercised, the dev fixture at
//      /dev/kid-ask, is itself a client page importing the DEFAULT export, so
//      it never crossed the boundary.
//
// It took a founder on a phone to find it. That is the expensive way, so this
// runs in CI instead.
//
// ── WHAT IS AND IS NOT A FAULT ──────────────────────────────────────────────
//
// Fine, and common: a server file importing the DEFAULT export of a client
// module and rendering it as a component. That is the whole point of the
// boundary. Also fine: `import type { X }`, and a named type used only in a
// type position, because types are erased before any of this happens.
//
// The fault is a VALUE import of a named export that is then used as a value:
// called, or passed somewhere that will call it. This checks the shape that
// actually crashed, a named value import from a client module inside a file
// that is not itself 'use client'.
//
//   node --experimental-strip-types scripts/check-client-boundary.mjs

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'

const ROOT = process.cwd()
const ROOTS = ['app', 'components', 'lib']
const problems = []

function walk(dir, out = []) {
  let entries
  try { entries = readdirSync(dir) } catch { return out }
  for (const name of entries) {
    if (name === 'node_modules' || name === '.next' || name.startsWith('.')) continue
    const full = join(dir, name)
    let st
    try { st = statSync(full) } catch { continue }
    if (st.isDirectory()) walk(full, out)
    else if (/\.(tsx?|jsx?)$/.test(name)) out.push(full)
  }
  return out
}

const files = ROOTS.flatMap(r => walk(join(ROOT, r)))

// A module is a client module when its FIRST real line is the directive.
const clientCache = new Map()
function isClientModule(file) {
  if (clientCache.has(file)) return clientCache.get(file)
  let src
  try { src = readFileSync(file, 'utf8') } catch { clientCache.set(file, false); return false }
  const first = src.split('\n').map(l => l.trim()).find(l => l && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*'))
  const v = first === "'use client'" || first === '"use client"'
  clientCache.set(file, v)
  return v
}

// Resolve an import specifier to a file on disk. Only local ones matter.
const EXTS = ['.tsx', '.ts', '.jsx', '.js']
function resolveLocal(spec, fromFile) {
  let base
  if (spec.startsWith('@/')) base = join(ROOT, spec.slice(2))
  else if (spec.startsWith('.')) base = resolve(dirname(fromFile), spec)
  else return null
  for (const e of ['', ...EXTS]) {
    const p = base + e
    try { if (statSync(p).isFile()) return p } catch { /* keep looking */ }
  }
  for (const e of EXTS) {
    const p = join(base, 'index' + e)
    try { if (statSync(p).isFile()) return p } catch { /* keep looking */ }
  }
  return null
}

const IMPORT = /import\s+([^'"]+?)\s+from\s*['"]([^'"]+)['"]/g

for (const file of files) {
  if (isClientModule(file)) continue // a client file may import client names freely
  const src = readFileSync(file, 'utf8')
  // Comments out, so a named import written inside an explanation is not a hit.
  const code = src.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')

  for (const m of code.matchAll(IMPORT)) {
    const clause = m[1]
    const spec = m[2]
    if (clause.trim().startsWith('type ')) continue // import type { X } from ...
    const target = resolveLocal(spec, file)
    if (!target || !isClientModule(target)) continue

    // The braced part of the clause is the named imports.
    const braced = /\{([^}]*)\}/.exec(clause)
    if (!braced) continue // default only: correct and normal
    const names = braced[1].split(',').map(s => s.trim()).filter(Boolean)
      // `type X` inside the braces is erased too.
      .filter(n => !n.startsWith('type '))
      .map(n => (n.split(/\s+as\s+/)[1] ?? n).trim())
    if (names.length === 0) continue

    // Used as a VALUE? A call, or a bare reference that is not in a type slot.
    for (const name of names) {
      const called = new RegExp(`(^|[^.\\w])${name}\\s*\\(`).test(code)
      if (called) {
        problems.push(`${file.replace(ROOT + '/', '')}: calls ${name}(), a named export of the client module ${spec}. On the server that is a client reference whose only behaviour is to throw, so this crashes on every request. Move ${name} into lib/ and import it from there.`)
      }
    }
  }
}

if (problems.length > 0) {
  console.error('check-client-boundary FAILED\n')
  for (const p of problems) console.error('  ' + p)
  console.error('\nSee the note at the top of this file for why this crashes and why tsc and next build both miss it.')
  process.exit(1)
}
console.log(`check-client-boundary ok: ${files.length} files, no server file calls a named export of a client module`)
