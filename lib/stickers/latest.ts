import type { SupabaseClient } from '@supabase/supabase-js'
import { STICKERS } from './catalog'
import { starWeekStartIso } from '@/lib/quests/star-week'

// What a child has earned lately, for the parent's side.
//
// Justin, 14 September 2026: "letting parents know stickers earned and why",
// and on the first one, the passport line. The push says it at the moment;
// this is the reading Home and the passport strip use afterwards, so the news
// is still there when the parent opens the app an hour later.
//
// Reads earned_stickers only, which is the catalogue's own record. Daily
// stickers are counted separately (kid_days, via lib/kid/today-state) and are
// not repeated here.

export type RecentSticker = { key: string; name: string; earnedAt: string; why: string }

export type StickerNews = {
  /** Every catalogue sticker this child holds. */
  total: number
  /** The ones written since Monday, newest first. */
  recent: RecentSticker[]
  /** True when the newest one is also the only one: the first ever. */
  firstEver: boolean
}

const EMPTY: StickerNews = { total: 0, recent: [], firstEver: false }

export async function readStickerNews(supabase: Pick<SupabaseClient, 'from'>, childId: string | null): Promise<StickerNews> {
  if (!childId) return EMPTY
  try {
    const { data, error } = await supabase
      .from('earned_stickers')
      .select('sticker_key, earned_at')
      .eq('child_id', childId)
      .order('earned_at', { ascending: false })
      .limit(200)
    if (error || !data) return EMPTY
    // "This week" is the star week, Monday in London, the one definition the
    // rest of the product uses, so the strip and the Sunday email agree.
    const weekStart = new Date(starWeekStartIso()).getTime()
    const byKey = new Map(STICKERS.map(s => [s.key, s]))
    const recent: RecentSticker[] = []
    for (const r of data as { sticker_key: string; earned_at: string | null }[]) {
      const at = r.earned_at ?? ''
      if (!at || new Date(at).getTime() < weekStart) continue
      const s = byKey.get(r.sticker_key)
      // A sorted stamp is keyed on the worry and named by it; the catalogue
      // does not know it, so it reads as a stamp.
      recent.push({
        key: r.sticker_key,
        name: s?.name ?? (r.sticker_key.startsWith('sorted-') ? 'A worry sorted' : r.sticker_key),
        earnedAt: at,
        why: s?.earn ?? 'Five stars at your check in',
      })
    }
    return { total: data.length, recent, firstEver: data.length === 1 && recent.length === 1 }
  } catch { return EMPTY }
}
