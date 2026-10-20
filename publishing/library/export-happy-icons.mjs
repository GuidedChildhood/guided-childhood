// The Happy News icons, from the app's own component, for the paper.
//
//   node publishing/library/export-happy-icons.mjs [--check]
//
// shared/components/HappyIcon.tsx is the drawn icon set the child app, the
// printables and the lessons all use (ink lines, crayon fills). The print
// engine has no React, so this compiles that component with the TypeScript
// already in the repo, renders every icon to an SVG string, and writes
// publishing/library/happy-icons.json. One artwork, never a redrawn copy.
// --check fails if the JSON no longer matches the component, which the engine
// tests run, so the paper can never drift from the app.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import ts from 'typescript'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'publishing', 'library', 'happy-icons.json')
const TMP = join(ROOT, 'publishing', '.cache', 'happy-icons')
mkdirSync(TMP, { recursive: true })

const compile = (src, file) => ts.transpileModule(readFileSync(join(ROOT, src), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
  fileName: file,
}).outputText

writeFileSync(join(TMP, 'happy-news.mjs'), compile('shared/happy-news.ts', 'happy-news.ts'))
writeFileSync(join(TMP, 'HappyIcon.mjs'), compile('shared/components/HappyIcon.tsx', 'HappyIcon.tsx').replace(/from ['"]\.\.\/happy-news['"]/, "from './happy-news.mjs'").replace(/^'use client'\s*;?/m, ''))

const { renderToStaticMarkup } = await import('react-dom/server')
const { createElement } = await import('react')
const mod = await import(pathToFileURL(join(TMP, 'HappyIcon.mjs')).href + `?t=${Date.now()}`)
const icons = {}
for (const name of mod.HAPPY_ICON_NAMES) icons[name] = renderToStaticMarkup(createElement(mod.default, { name, size: 64 }))
const json = JSON.stringify({ source: 'shared/components/HappyIcon.tsx', regenerate: 'node publishing/library/export-happy-icons.mjs', icons }, null, 1) + '\n'

if (process.argv.includes('--check')) {
  const now = readFileSync(OUT, 'utf8')
  if (now !== json) { console.log('FAIL  publishing/library/happy-icons.json is out of date with HappyIcon.tsx. Run node publishing/library/export-happy-icons.mjs'); process.exit(1) }
  console.log(`PASS  ${Object.keys(icons).length} Happy News icons match the app`)
} else {
  writeFileSync(OUT, json)
  console.log(`wrote ${Object.keys(icons).length} icons to publishing/library/happy-icons.json`)
}
