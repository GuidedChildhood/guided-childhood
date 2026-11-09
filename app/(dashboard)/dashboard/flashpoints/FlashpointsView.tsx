import Link from 'next/link'
import BackTo from '@/components/nav/BackTo'
import type { AgeBand } from '@/lib/content/stages'
import { flashpointsForBand, shareText, type Flashpoint } from '@/lib/content/family-flashpoints'
import FlashpointActions from './FlashpointActions'
import OpenFromHash from './OpenFromHash'

// The page itself, from plain props, so the signed in route and the dev
// fixture (app/dev/flashpoints) draw exactly the same thing.

const card = {
  background: 'var(--white)', border: 'var(--edge)', borderRadius: 'var(--radius-card)', boxShadow: 'var(--lift)',
} as const

export default function FlashpointsView({ kid, band, childId, mine, scriptAt, from }: {
  kid: string | null
  band: AgeBand | null
  childId: string | null
  mine: Set<string>
  scriptAt: Map<string, number>
  from?: string
}) {
  const child = childId ? { id: childId } : null
  const ordered = flashpointsForBand(band)
  const yours = ordered.filter(f => mine.has(f.key))
  const atThisAge = ordered.filter(f => !mine.has(f.key) && band && f.bands.includes(band))
  const others = ordered.filter(f => !mine.has(f.key) && !(band && f.bands.includes(band)))
  const withChild = (href: string) => child ? `${href}${href.includes('?') ? '&' : '?'}child=${child.id}` : href

  const section = (label: string, rows: Flashpoint[], note?: string) => rows.length === 0 ? null : (
    <section style={{ marginTop: 26 }}>
      <p className="eyebrow" style={{ marginBottom: 4 }}>{label}</p>
      {note && <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '0 0 10px' }}>{note}</p>}
      <div style={{ display: 'grid', gap: 10, marginTop: note ? 0 : 8 }}>
        {rows.map(f => (
          <details key={f.key} id={f.key} className="flashpoint" style={{ ...card, scrollMarginTop: 80 }}>
            <summary style={{ listStyle: 'none', cursor: 'pointer', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 12, minHeight: 44 }}>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.25 }}>
                  {f.name}
                </span>
                <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', marginTop: 4, letterSpacing: '0.02em' }}>
                  {f.when}
                </span>
              </span>
              {mine.has(f.key) && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, background: 'var(--tint-butter)', border: 'var(--edge)', borderRadius: 999, padding: '3px 9px', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                  Ours
                </span>
              )}
              <span aria-hidden className="flashpoint-chevron" style={{ fontWeight: 900, color: 'var(--ink-muted)' }}>›</span>
            </summary>
            <div style={{ padding: '0 18px 18px', display: 'grid', gap: 14 }}>
              <div style={{ background: 'var(--tint-butter)', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', padding: '12px 14px' }}>
                <p className="eyebrow" style={{ marginBottom: 4 }}>First, for you</p>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)', lineHeight: 1.4, margin: 0 }}>{f.parentFirst}</p>
              </div>
              <Part label="What is going on">{f.mechanism}</Part>
              <Part label="The plan">{f.plan}</Part>
              <Part label={kid ? `${kid}'s part` : 'Their part'}>{f.childSide}</Part>
              <Part label="A stage earlier">{f.prevent}</Part>
              {f.proof.scripts.some(t => scriptAt.has(t)) && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: 6 }}>The words to say</p>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {f.proof.scripts.filter(t => scriptAt.has(t)).map(t => (
                      <Link key={t} href={withChild(`/dashboard/scripts/${scriptAt.get(t)}`)} style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, minHeight: 44,
                        padding: '8px 14px', borderRadius: 'var(--radius-tile)', border: 'var(--edge)', background: 'var(--cream)',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', textDecoration: 'none',
                      }}>
                        <span>{t}</span><span aria-hidden>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <FlashpointActions
                flashKey={f.key}
                childId={child?.id ?? null}
                claimed={mine.has(f.key)}
                headsUpWhen={headsUpWhen(f)}
                share={shareText(f, kid)}
                toolHref={f.proof.href ? withChild(f.proof.href) : null}
              />
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: 0 }}>
                Where this comes from: <a href={f.source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink-soft)' }}>{f.source.name}</a>
                {f.gap ? `. ${f.gap}` : ''}
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '20px 20px 56px' }}>
      <OpenFromHash />
      <style>{`
        .flashpoint summary::-webkit-details-marker { display: none; }
        .flashpoint .flashpoint-chevron { display: inline-block; transition: transform var(--dur-press, 120ms); }
        .flashpoint[open] .flashpoint-chevron { transform: rotate(90deg); }
      `}</style>
      <BackTo from={from} />
      <p className="eyebrow" style={{ marginBottom: 6 }}>The usual rows</p>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 7vw, 2.4rem)', letterSpacing: '-0.02em', lineHeight: 1.08, margin: '0 0 10px', color: 'var(--ink)' }}>
        These happen in every house
      </h1>
      <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: 0 }}>
        The room, the school run, the Sunday homework panic. Thirty rows most families have, when they tend to happen, and what heads them off. Tap the ones that happen in yours and we will send a heads up just before, and DiGi will know.
      </p>

      {section('Ours', yours, 'The heads up comes in your before school or after school window, on the day each one tends to happen.')}
      {section(kid ? `Common at ${kid}'s age` : 'Common at this age', atThisAge)}
      {section(band ? 'At other ages' : 'All thirty', others)}

      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55, margin: '26px 0 0' }}>
        Chosen from what UK parents raise most often on Coram Family Lives&apos; helpline, Mumsnet and the research, and ordered by judgement, because nobody counts these exactly. Every plan has a source you can open.
      </p>
    </div>
  )
}

function Part({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.55, margin: 0 }}>{children}</p>
    </div>
  )
}

const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** "Monday, before school", for the claim button's promise. */
function headsUpWhen(f: Flashpoint): string {
  const days = f.headsUp.days.map(d => DAY[d])
  const when = f.headsUp.window === 'morning' ? 'in the morning' : 'in the afternoon'
  return `${days.join(' and ')} ${when}`
}
