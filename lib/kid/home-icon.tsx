import { ImageResponse } from 'next/og'
import fs from 'node:fs/promises'
import path from 'node:path'
import { buddyFor } from '@/lib/kid/buddy'
import { characterByKey } from '@/lib/content/stage-characters'

// ONE ICON PER CHILD, ON A TABLET THE FAMILY SHARES.
//
// Justin, 15 September 2026: "although an override to add the app so it can be
// added on an iPad for example to co use, so we could build that in." Then, on
// the day: "let's do the iPad part for children that don't have their own
// phone."
//
// Installing on a shared iPad already worked. What did not work was TWO
// children installed on the same one. Every child's icon was DiGi the star on
// the same teal, under the same words, so a family with a four year old and a
// nine year old got two identical icons side by side. The younger of them
// cannot read, so there was nothing on that Home Screen to tell them apart, and
// tapping the wrong one opens a sibling's jobs and a sibling's star bank.
//
// That is a defect that exists ONLY because the device is shared, which is
// exactly the case Justin asked for, and it was created by a decision that was
// right for a personal phone.
//
// THE NAME STAYS OFF THE ICON. A Home Screen is visible to anyone holding the
// device, and a manifest ends up in the phone's app list and in backups, so no
// child's name is printed on either. That is the Children's Code data
// minimisation point and it is not being traded away here.
//
// The Friend does the work instead. The child has already chosen a buddy, it is
// their face across every screen of their own app, it identifies nothing to a
// stranger, and a four year old recognises a picture years before they can read
// a word. So Pebble on gold and Bloop on green are two icons a child who cannot
// read can still tell apart at a glance.
//
// Fails soft to DiGi, which is what every icon was until now, so a missing row,
// an unreadable buddy or a database that is simply not there costs a family the
// distinction and never the icon.

// EVERY PIECE OF ART THIS READS LIVES UNDER ONE FOLDER, AND THAT IS LOAD BEARING.
//
// The first cut built the whole path from a variable, `path.join(process.cwd(),
// art)`. Turbopack's file tracer cannot follow that, so rather than guess it
// traced THE ENTIRE PROJECT into this route's bundle. Locally that is a
// warning and the build still passes. On Vercel the function then exceeds the
// size limit and the deployment fails outright, which is exactly what happened
// on the first push of this change while every other check was green.
//
// Scoping the join to a fixed subfolder and varying only the leaf is the fix
// Next itself names in that warning, and the folder segments have to be
// LITERALS at the call site. A `const ART_ROOT = ['public', 'digi-squad']`
// spread into path.join reads as dynamic to the analyser and is no better than
// the variable it replaced: it still matched 12,591 files. So the two segments
// are written out at each read below, and `file` is the only part that varies.
const DIGI = { file: 'DiGi-star.svg', colour: '#173C46' }

/** The art file (under public/digi-squad) and the ground for whatever buddy is saved. */
export function iconArtFor(buddy: string | null | undefined): { file: string; colour: string } {
  const { key } = buddyFor(buddy)
  const character = characterByKey(key)
  // characterByKey misses for 'digi', which is not a Planet Friend, and for a
  // key saved before a rename. Both land on the star.
  if (!character) return DIGI
  // The cutouts are all /digi-squad/friends/<name>.png, so this is the leaf
  // under ART_ROOT and nothing above it can be varied by a database value.
  const file = character.cutout.replace(/^\/digi-squad\//, '')
  if (file === character.cutout) return DIGI
  return { file, colour: character.colour }
}

/**
 * The Home Screen icon: the child's Friend, centred on the Friend's own colour.
 *
 * Read off disk rather than fetched, because these run inside the icon route
 * and an image one network hop away is an image that is sometimes not there.
 * The art is local for exactly that reason (see stage-characters.ts).
 */
export async function renderHomeIcon(buddy: string | null | undefined, size: number) {
  const { file, colour } = iconArtFor(buddy)
  let src: string
  try {
    const bytes = await fs.readFile(path.join(process.cwd(), 'public', 'digi-squad', file))
    const mime = file.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
    src = `data:${mime};base64,${bytes.toString('base64')}`
  } catch {
    const bytes = await fs.readFile(path.join(process.cwd(), 'public', 'digi-squad', 'DiGi-star.svg'))
    src = `data:image/svg+xml;base64,${bytes.toString('base64')}`
  }
  // THREE QUARTERS, AND NOT MORE, because the manifest declares these
  // `maskable`. Android crops a maskable icon to whatever shape the launcher
  // uses and only the middle 80 percent is guaranteed to survive, so a
  // character drawn larger to fill the tile is a character with its feet cut
  // off on half the tablets in the country. The ground reading as a band of
  // colour around it is the point rather than a waste: at Home Screen size the
  // colour is what a four year old picks their app out by.
  const inner = Math.round(size * 0.76)
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: colour,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={inner} height={inner} alt="" />
      </div>
    ),
    { width: size, height: size },
  )
}

/** The buddy saved on the child a link token belongs to. Never throws. */
export async function buddyForToken(token: string): Promise<string | null> {
  if (!/^[0-9a-f]{18}$/.test(token)) return null
  try {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const supabase = createAdminClient()
    const { data: link } = await supabase
      .from('kid_links').select('child_id').eq('token', token).maybeSingle()
    if (!link?.child_id) return null
    const { data: child } = await supabase
      .from('children').select('buddy').eq('id', link.child_id).maybeSingle()
    return (child?.buddy as string | null) ?? null
  } catch {
    // No service key, no row, no network: the star, exactly as before.
    return null
  }
}
