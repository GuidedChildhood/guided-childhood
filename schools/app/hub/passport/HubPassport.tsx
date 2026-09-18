'use client'

import { useEffect, useState } from 'react'
import PassportPage from '@gc/shared/components/PassportPage'
import { STAGE_BY_NUMBER, pageModules } from '@gc/shared/passport-areas'
import { PASSPORT_STAGES } from '@gc/shared/passport-stages'
import { clearTaught, markTaught, readTaught, TAUGHT_EVENT, unmarkTaught } from '@gc/shared/schools-taught'

// Every module that fills a page: the KS5 modules sit after the passport and
// have none, so the count is the pages' own, never the catalogue's.
const PAGE_MODULE_COUNT = STAGE_BY_NUMBER.reduce((n, stage) => n + pageModules(stage).length, 0)

// THE FIVE PAGES, SIDE BY SIDE, WITH THIS SCREEN'S FILL.
//
// The teacher's progression view. Every module in the scheme fills one page
// of the passport to sixteen, and the passport beat at the end of each lesson
// is where the class fills it in. This page shows what that has added up to
// on this screen, page by page, and lets a teacher tick the lessons they
// taught before the beat existed, so a class half way through the year is not
// shown an empty book.
//
// Counted here and nowhere else: no pupil, no login, no upload (shared/
// schools-taught). The child's own passport is filled at home with the home
// code on the parent note, and it never records where a page was filled.

export default function HubPassport() {
  const [taught, setTaught] = useState<string[]>([])
  useEffect(() => {
    const sync = () => setTaught(readTaught())
    sync()
    window.addEventListener(TAUGHT_EVENT, sync)
    return () => window.removeEventListener(TAUGHT_EVENT, sync)
  }, [])

  const toggle = (id: string) => { if (taught.includes(id)) unmarkTaught(id); else markTaught(id) }
  const forget = () => {
    if (taught.length === 0) return
    if (window.confirm('Forget every page this screen has filled? The passports at home are not touched.')) clearTaught()
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)', alignItems: 'start' }}>
        {STAGE_BY_NUMBER.map(placement => {
          const mods = pageModules(placement)
          return (
            <section key={placement} aria-label={`${PASSPORT_STAGES[placement].page} page`}>
              <PassportPage placement={placement} taught={taught} compact />
              {mods.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 4px 0' }}>
                  {mods.map(m => {
                    const done = taught.includes(m.moduleId)
                    return (
                      <li key={m.moduleId}>
                        <button
                          type="button"
                          onClick={() => toggle(m.moduleId)}
                          aria-pressed={done}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left',
                            background: 'none', border: 'none', padding: '6px 4px', cursor: 'pointer',
                            fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', fontWeight: 600,
                            color: done ? 'var(--ink)' : 'var(--ink-soft)',
                          }}
                        >
                          <span aria-hidden style={{
                            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                            border: `2px solid ${done ? 'var(--retro-green)' : 'var(--border)'}`,
                            background: done ? 'var(--retro-green)' : '#fff', color: '#fff',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900,
                          }}>{done ? '✓' : ''}</span>
                          <span style={{ minWidth: 0 }}>{m.n}. {m.title}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', margin: '10px 4px 0', lineHeight: 1.5 }}>
                  No school lessons fill this page. It fills at home, through the parents app.
                </p>
              )}
            </section>
          )
        })}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, marginTop: 28 }}>
        <button type="button" onClick={forget} className="btn btn-outline" disabled={taught.length === 0} style={{ fontSize: 'var(--text-base)' }}>
          Forget this screen&rsquo;s record
        </button>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)' }}>
          {taught.length}{' '}of{' '}{PAGE_MODULE_COUNT}{' '}lessons with a page filled on this screen
        </span>
      </div>
    </div>
  )
}
