// Lets a guard import the app's TypeScript the way the app writes it.
//
// The source imports `./lesson-credit` and `@/lib/content/literacy` with no
// extension, because Next resolves both. Node's type stripping resolves
// neither, so a guard that wants to run the REAL code (the rule of this repo:
// a guard its own documentation satisfies is not a guard) needs this hook.
//
//   node --experimental-strip-types --import ./scripts/lib/ts-resolve.mjs <file>
//
// Two moves, nothing else: `@/` becomes the repo root, and a relative or
// aliased specifier with no extension tries `.ts`, `.tsx` and `/index.ts`.
import { register } from 'node:module'
import { pathToFileURL } from 'node:url'

register(new URL('./ts-resolve-hook.mjs', import.meta.url), { parentURL: pathToFileURL(process.cwd() + '/') })
