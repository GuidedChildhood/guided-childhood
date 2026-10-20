// THE CHARACTER LIBRARY, with the approval enforced.
//
// publishing/library/characters.json lists every approved Planet Friend file
// with its sha256. Before a page can show a friend, the file is fetched (or
// read from the repo), hashed, and compared. A file whose hash differs is not
// approved art, whatever its name, and the render stops. That is how "never
// regenerate a character" (brand/GDC_SOCIAL_VISUAL_SYSTEM.md section 1) becomes
// a property of the engine rather than a promise in a document.
//
// The cache lives in publishing/.cache (git ignored). The download PDF uses a
// smaller copy of each still, made here with sharp, so the file a parent
// downloads stays small while the print PDF keeps full resolution.

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { FriendRef } from './schema'

export const ROOT = join(dirname(new URL(import.meta.url).pathname), '..', '..')
export const PUB = join(ROOT, 'publishing')
const CACHE = join(PUB, '.cache', 'library')

export type LibraryAsset = {
  id: string; friend: string; pose: string
  url?: string; path?: string
  sha256: string; width: number | null; height: number | null; alpha: boolean; vector?: boolean
}

export function manifest(): LibraryAsset[] {
  return JSON.parse(readFileSync(join(PUB, 'library', 'characters.json'), 'utf8')).assets
}

export const assetIdFor = (f: FriendRef) => f.id === 'digi' ? 'digi-star' : `${f.id}-${f.pose}`

const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex')

// Fetch or read, then prove it is the approved file. Returns the local path.
export async function approvedFile(id: string): Promise<string> {
  const a = manifest().find(x => x.id === id)
  if (!a) throw new Error(`${id} is not in the approved character library`)
  if (a.path) {
    const p = join(ROOT, a.path)
    const got = sha(readFileSync(p))
    if (got !== a.sha256) throw new Error(`${a.path} no longer matches its approved hash. A changed character file needs Justin's approval and a new manifest entry.`)
    return p
  }
  mkdirSync(CACHE, { recursive: true })
  const local = join(CACHE, `${id}.png`)
  if (!existsSync(local) || sha(readFileSync(local)) !== a.sha256) {
    const res = await fetch(a.url as string)
    if (!res.ok) throw new Error(`could not fetch approved art ${id}: HTTP ${res.status}`)
    const buf = Buffer.from(await res.arrayBuffer())
    if (sha(buf) !== a.sha256) throw new Error(`the file at ${a.url} is not the approved ${id} (hash mismatch)`)
    writeFileSync(local, buf)
  }
  return local
}

// A lighter copy for the download PDF and the web edition: 600px, still with
// its transparency, quantised to a palette. Same picture, a fraction of the
// bytes. Vector art passes through untouched.
export async function lightFile(id: string): Promise<string> {
  const src = await approvedFile(id)
  if (src.endsWith('.svg')) return src
  const out = join(CACHE, `${id}-600.png`)
  if (!existsSync(out)) {
    const sharp = (await import('sharp')).default
    await sharp(src).resize(600, 600, { fit: 'inside' }).png({ palette: true, quality: 90, compressionLevel: 9 }).toFile(out)
  }
  return out
}

export async function resolveFriends(refs: FriendRef[], variant: 'print' | 'light'): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  for (const f of refs) {
    const id = assetIdFor(f)
    if (!out.has(id)) out.set(id, variant === 'print' ? await approvedFile(id) : await lightFile(id))
  }
  return out
}
