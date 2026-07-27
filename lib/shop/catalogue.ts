// The shop catalogue, as the app sees it. The rows come from the products
// table (migration 102) so a price can be corrected without a deploy; this file
// is only the shape, the money formatting and the one question the shop keeps
// asking: can this family buy this thing yet.
//
// Character art is deliberately not stored on the row. A product carries a
// character_key and the picture is resolved from lib/content/stage-characters,
// so re pointing Nova's art in one file moves the shop with everything else.

import { STAGE_CHARACTERS, type StageCharacter } from '@/lib/content/stage-characters'

export type ProductKind = 'passport' | 'stickers' | 'charm' | 'charm_set' | 'bracelet' | 'plush' | 'chart'

export type Product = {
  key: string
  name: string
  blurb: string
  price_pence: number
  kind: ProductKind
  character_key: string | null
  /** How many Planet Friends must be home before this can be bought. 0 is open
   *  to everyone, 5 wants the whole family. */
  min_earned: number
  personalised: boolean
  image_url: string | null
  sort: number
  active: boolean
}

export type BasketLine = { key: string; qty: number; personalisation?: Record<string, unknown> }

// Sold and shipped from the UK only for now. Every supplier in the research is
// UK based or ships here, and promising a family in Toronto a passport we have
// no way to post is worse than saying not yet.
export const SHIP_COUNTRIES = ['GB'] as const
export const MAX_QTY = 5

export function formatPence(pence: number): string {
  return pence % 100 === 0 ? `£${pence / 100}` : `£${(pence / 100).toFixed(2)}`
}

// DiGi is not a Planet Friend, DiGi is the guide, there from the first day. So
// a DiGi product has a character_key with no stage behind it and never needs
// earning. Anything else with a character_key maps to its stage.
export function characterForKey(key: string | null): StageCharacter | null {
  if (!key) return null
  return STAGE_CHARACTERS.find(c => c.key === key) ?? null
}

/**
 * Can this family buy this product right now. The single place the earned rule
 * is written down, used by the shop to grey a card AND by the checkout route to
 * refuse the sale, so what a parent is shown and what the server allows can
 * never disagree.
 */
export function canBuy(product: Product, earnedFriendCount: number): boolean {
  if (!product.active) return false
  return earnedFriendCount >= (product.min_earned ?? 0)
}

/** What to tell a child's grown up about a product they cannot buy yet. */
export function lockedReason(product: Product): string {
  // Not on sale at all beats not earned yet: telling a parent to go and earn
  // Cosmo for a charm that does not exist to buy would be a wasted promise.
  if (!product.active) return 'Coming soon'
  const character = characterForKey(product.character_key)
  if (character) return `Earn ${character.name} to unlock this`
  if (product.min_earned >= 5) return 'Earn all five Planet Friends to unlock this'
  if (product.min_earned === 1) return 'Earn your first Planet Friend to unlock this'
  return `Earn ${product.min_earned} Planet Friends to unlock this`
}

export function basketTotal(lines: BasketLine[], products: Product[]): number {
  return lines.reduce((sum, line) => {
    const p = products.find(x => x.key === line.key)
    return p ? sum + p.price_pence * line.qty : sum
  }, 0)
}
