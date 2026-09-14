'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { StickerNews } from '@/lib/stickers/latest'

// Good news on the parent's Home: what their child earned this week and why.
//
// Justin, 14 September 2026: "once they achieve first badge we should link to
// order passport and sticker sheet and the system should say congratulations,
// you or they have earned a badge or sticker, it will be added to their
// passport: either purchase one with stickers and add as they go along, or
// print when complete from the system."
//
// The push says it at the moment; this is where it still is an hour later.
// Only ever good news, never a chore: nothing to tap to make it go away except
// the small "Seen" which remembers the newest key on this device, so the same
// sticker does not greet them every morning for a week.

const SEEN_KEY = 'gc_sticker_news_seen'

export default function StickerNewsCard({ news, childName, childId }: {
  news: StickerNews
  childName: string | null
  childId: string | null
}) {
  const newest = news.recent[0] ?? null
  const [seen, setSeen] = useState<string | null>(null)
  useEffect(() => {
    try { setSeen(localStorage.getItem(SEEN_KEY) ?? '') } catch { setSeen('') }
  }, [])
  if (!newest || seen === null || seen === newest.key) return null

  const who = childName && childName !== 'Your child' ? childName : 'Your child'
  // The query starts in the literal, right after the path, so the wiring
  // check can still read the route each link points at: with the variable
  // first it read `/dashboard/keepsakes*` and called it a dead link.
  const child = childId ?? ''
  const dismiss = () => {
    try { localStorage.setItem(SEEN_KEY, newest.key) } catch { /* private mode */ }
    setSeen(newest.key)
  }
  const others = news.recent.slice(1, 4).map(r => r.name)

  return (
    <div data-sticker-news data-first={news.firstEver ? '1' : '0'} style={{
      background: 'var(--tint-butter)', border: '2px solid var(--ink)', borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--lift)', padding: '18px 18px 16px', marginBottom: 16,
    }}>
      <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }}>
        {news.firstEver ? 'Their first sticker' : 'New in their passport'}
      </p>
      <h3 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
        🏅 {news.firstEver ? `Congratulations, ${who} earned their first sticker` : `${who} earned ${newest.name}`}
      </h3>
      <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
        {news.firstEver ? `${newest.name}: ${newest.why.toLowerCase()}. ` : `${newest.why}. `}
        {others.length > 0 && `Also this week: ${others.join(', ')}. `}
        {news.firstEver
          ? 'It is in their passport now. Buy the printed passport and the sticker sheet and add each one as they earn it, or print the passport when it is complete.'
          : `That is ${news.total} in their book.`}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginTop: 12 }}>
        {news.firstEver ? (
          <>
            <Link href={`/dashboard/keepsakes?child=${child}#p-passport_printed`} style={{ background: 'var(--terracotta)', color: 'var(--ink)', borderRadius: 'var(--radius-btn)', padding: '11px 16px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
              Passport and stickers
            </Link>
            <Link href={`/dashboard/keepsakes/passport-print?child=${child}`} style={{ color: 'var(--ink)', fontWeight: 800, fontSize: 'var(--text-base)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              See the print out
            </Link>
          </>
        ) : (
          <Link href={`/dashboard/pathway?child=${child}#stickers`} style={{ background: '#fff', color: 'var(--ink)', border: '2px solid var(--ink)', borderRadius: 'var(--radius-btn)', padding: '10px 16px', textDecoration: 'none', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', boxShadow: 'var(--lift)' }}>
            See their book
          </Link>
        )}
        <button type="button" onClick={dismiss} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          Seen
        </button>
      </div>
    </div>
  )
}
