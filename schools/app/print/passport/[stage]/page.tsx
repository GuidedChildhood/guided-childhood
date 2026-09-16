import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CHARACTERS } from '@gc/shared/schools-curriculum'
import { PASSPORT_STAGES } from '@gc/shared/passport-stages'
import { AREAS, AREA_ORDER, STAGE_NUMBER, areaOf, pageModules, type AreaKey } from '@gc/shared/passport-areas'
import { BRAND_NAME, BRAND_DOMAIN } from '@gc/shared/brand'
import PrintButton from '@/components/PrintButton'
import { printRegister, mono, display, text, mm, FriendArt, Stamp, Sticker, ColourStar, type Friend } from '@/components/print/kit'
import { editionFor, EDITIONS, ZINE_TOP, ZINE_BOTTOM, FOLD_STEPS, AREA_EMOJI } from '@/lib/passport-print'

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = await params
  const e = editionFor(stage)
  return { robots: { index: false, follow: false }, title: e ? `Passport print out: ${PASSPORT_STAGES[e.stage].page}` : 'Passport print out' }
}

// THE PASSPORT PRINT OUT, ONE EDITION (14 September 2026).
//
// Two landscape sheets. Sheet A is the passport itself: eight panels on one
// side of one A4 sheet, folded and cut into a booklet the size of a real
// passport, the top row printed upside down so the fold works
// (lib/passport-print.ts, ZINE_TOP and ZINE_BOTTOM, with a page number on
// every panel so a teacher can check it before a class does). Sheet B is
// the stickers: one per lesson on the page, numbered to match the ring
// beside that lesson's line on its area panel, the stage stamp, and the fold
// steps. One sticker per ring, the same number on both, so a Reception child
// matches them without reading a lesson title (the Reception teacher pass,
// 14 September 2026). The words on the area panels are the `I can` line of
// every lesson on the page, read from the lesson rows, so the passport says
// what the scheme teaches and nothing it does not.

export const revalidate = 3600

type Row = { module_id: string; title: string; key_stage: string; single_action_outcome: string }

function Panel({ n, upside, friend, children }: { n: number; upside: boolean; friend: Friend; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', border: '1px dotted var(--ink-muted)', overflow: 'hidden' }}>
      {/* The number sits in its own 6mm strip under the content, so nothing on the panel can run into it. */}
      <div style={{ position: 'absolute', inset: 0, transform: upside ? 'rotate(180deg)' : 'none', padding: '4.5mm 5mm 8mm', display: 'flex', flexDirection: 'column' }}>
        {children}
        <span style={{ ...mono, fontSize: '7px', color: 'var(--ink-muted)', position: 'absolute', right: '4mm', bottom: '2.5mm', letterSpacing: '0.1em', lineHeight: 1 }}>{n} of 8</span>
      </div>
    </div>
  )
}

export default async function PassportPrintPage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage } = await params
  const edition = editionFor(stage)
  if (!edition) notFound()

  const page = PASSPORT_STAGES[edition.stage]
  const friend: Friend = { key: edition.friend, ...CHARACTERS[edition.friend] }
  const reg = printRegister(page.keyStage.split('/')[0])
  const young = edition.young
  const manifest = pageModules(edition.stage)
  const ids = manifest.map(m => m.moduleId)
  const { data } = ids.length
    ? await supabase.from('school_lessons').select('module_id, title, key_stage, single_action_outcome').in('module_id', ids)
    : { data: [] as Row[] }
  const rows = new Map(((data ?? []) as Row[]).map(r => [r.module_id, r]))
  const lessons = manifest
    .map(m => ({ moduleId: m.moduleId, n: m.n, title: rows.get(m.moduleId)?.title ?? m.title, ican: rows.get(m.moduleId)?.single_action_outcome ?? '', area: areaOf(m.moduleId) }))
    .sort((a, b) => a.n - b.n)
  const byArea: Record<AreaKey, typeof lessons> = { safe: [], balance: [], ai: [], social: [] }
  for (const l of lessons) if (l.area) byArea[l.area].push(l)

  // Where the panel's label already ends in "I can", the line under it drops
  // its own first two words, so a page never reads "I can · I can spot".
  const icanLine = (line: string) => (/I can$/.test(edition.prove) ? line.replace(/^I can\s+/i, '') : line)
  const body: React.CSSProperties = { ...text, fontSize: young ? '12px' : '10.5px', lineHeight: 1.4 }
  const small: React.CSSProperties = { ...mono, fontSize: '7.5px', letterSpacing: '0.1em', color: friend.ink }
  const h: React.CSSProperties = { ...display, fontSize: young ? '18px' : '15px', lineHeight: 1.15 }

  // The eight faces, in reading order.
  const faces: Record<number, React.ReactNode> = {
    1: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', background: friend.soft, margin: '-4.5mm -5mm -8mm', padding: '4.5mm 5mm 8mm' }}>
        <span style={small}>My digital passport · page {STAGE_NUMBER[edition.stage]} of 5</span>
        <FriendArt friend={friend} mood="wave" size={young ? 34 : 26} />
        <span style={{ ...display, fontSize: young ? '21px' : '18px', lineHeight: 1.1, marginTop: '2mm' }}>{page.page}</span>
        <span style={{ ...text, fontSize: '9.5px', color: 'var(--ink-soft)', marginTop: '1mm' }}>{edition.strap} · {edition.years}</span>
        <div style={{ marginTop: 'auto', width: '100%', textAlign: 'left' }}>
          <span style={small}>This passport belongs to</span>
          <div style={{ borderBottom: `1.5px solid ${friend.accent}`, height: young ? '8mm' : '6mm' }} />
        </div>
      </div>
    ),
    2: (
      <>
        <span style={small}>What this page is for</span>
        <p style={{ ...body, marginTop: '2mm' }}>{edition.about}</p>
        <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5mm' }}>
          {AREA_ORDER.map(a => (
            <span key={a} style={{ ...text, fontSize: '9px', fontWeight: 700, display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span aria-hidden>{AREA_EMOJI[a]}</span>{AREAS[a].name}
            </span>
          ))}
        </div>
      </>
    ),
    7: (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
        <span style={small}>The stamp</span>
        <div style={{ margin: '2mm 0' }}><Stamp friend={friend} label="" size={young ? 34 : 30} ghost /></div>
        <p style={{ ...body, fontSize: young ? '11px' : '9.5px' }}>{edition.stamp}</p>
        {edition.signed ? (
          <div style={{ marginTop: 'auto', width: '100%', textAlign: 'left' }}>
            <span style={small}>Signed</span><div style={{ borderBottom: `1px solid ${friend.accent}`, height: '5mm' }} />
            <span style={{ ...small, display: 'block', marginTop: '1.5mm' }}>Date</span><div style={{ borderBottom: `1px solid ${friend.accent}`, height: '5mm' }} />
          </div>
        ) : (
          <div style={{ marginTop: 'auto', display: 'flex', gap: '4mm' }}>
            {[0, 1, 2].map(i => <ColourStar key={i} size={young ? 34 : 26} label={i === 1 ? 'Colour a star' : ''} />)}
          </div>
        )}
      </div>
    ),
    8: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <span style={small}>Home and school, one passport</span>
        <p style={{ ...body, fontSize: '9.5px', marginTop: '2mm' }}>{edition.home}</p>
        <p style={{ ...text, fontSize: '8.5px', color: 'var(--ink-muted)', marginTop: '2mm' }}>Made from one sheet. If the page numbers run 1 to 8 as you turn, you folded it right.</p>
        <div style={{ marginTop: 'auto' }}>
          <span style={{ ...display, fontSize: '11px' }}>{BRAND_NAME} Schools</span>
          <span style={{ ...mono, fontSize: '7.5px', color: friend.ink, display: 'block' }}>{BRAND_DOMAIN}</span>
        </div>
      </div>
    ),
  }
  const ringMm = young ? 15 : 12
  AREA_ORDER.forEach((a, i) => {
    const list = byArea[a]
    faces[3 + i] = (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
          {young && <FriendArt friend={friend} mood="thinking" size={9} />}
          <span style={{ ...small, flex: '1 1 auto' }}>{young ? '' : <span aria-hidden>{AREA_EMOJI[a]} </span>}{AREAS[a].name}</span>
        </div>
        {list.length ? (
          <>
            <span style={{ ...display, fontSize: young ? '13px' : '11px', marginTop: '1.5mm' }}>{edition.prove}</span>
            {/* One ring per lesson, numbered like its sticker, beside the line it proves. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: young ? '2mm' : '1.5mm', marginTop: '1.5mm' }}>
              {list.map(l => (
                <div key={l.moduleId} style={{ display: 'flex', alignItems: 'center', gap: '2.5mm' }}>
                  <Stamp friend={friend} label="" size={ringMm} n={l.n} inline />
                  <span style={{ ...body, fontSize: young ? '11px' : '9.5px', lineHeight: 1.3, flex: '1 1 auto', minWidth: 0 }}>{icanLine(l.ican || l.title)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={{ ...body, color: 'var(--ink-soft)', marginTop: '2mm' }}>{edition.athome}</p>
        )}
      </div>
    )
  })

  const others = EDITIONS.filter(e => e.stage !== edition.stage)

  return (
    <main className="gc-passport-main" style={{ background: '#fff', color: 'var(--ink)', padding: '0 8px 40px' }}>
      <style>{`@page { size: A4 landscape; margin: 8mm 9mm; } @media print { .gc-passport-main { padding: 0 !important; } .gc-passport-wrap { overflow: visible !important; margin: 0 !important; } .gc-passport-a { page-break-after: always; break-after: page; } .gc-passport-b { page-break-after: auto; break-after: auto; } }`}</style>
      <div className="no-print" style={{ maxWidth: '1060px', margin: '0 auto', padding: '20px 0 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <Link href="/print/passport" style={{ ...mono, textDecoration: 'none' }}>← The passport print out</Link>
          <h1 style={{ ...display, fontSize: 'var(--text-xl)', marginTop: '6px' }}>{page.page} · {edition.years} · with {friend.name}</h1>
          <p style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: '4px' }}>Two landscape sheets: the passport to fold and cut, and the stickers. Print in colour if you can; it photocopies clean in black and white.</p>
        </div>
        <PrintButton label="Print both sheets" />
      </div>

      {/* Sheet A: the one sheet passport. */}
      <div className="gc-passport-wrap" style={{ overflowX: 'auto', margin: '0 auto', maxWidth: '1060px' }}>
        <section className="gc-passport-sheet gc-passport-a" style={{ width: '279mm', height: '190mm', position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '1fr 1fr', background: '#fff', border: '1px solid var(--border)' }}>
          {ZINE_TOP.map(n => <Panel key={`t${n}`} n={n} upside friend={friend}>{faces[n]}</Panel>)}
          {ZINE_BOTTOM.map(n => <Panel key={`b${n}`} n={n} upside={false} friend={friend}>{faces[n]}</Panel>)}
          {/* The slit: along the middle crease, across the two middle panels only. */}
          <div aria-hidden style={{ position: 'absolute', left: '25%', right: '25%', top: '50%', borderTop: '2px dashed var(--ink)', transform: 'translateY(-1px)' }} />
          <span aria-hidden style={{ position: 'absolute', left: 'calc(25% - 7mm)', top: '50%', transform: 'translateY(-55%)', fontSize: '14px', background: '#fff', padding: '0 1mm' }}>✂</span>
          <span aria-hidden style={{ position: 'absolute', left: 'calc(50% - 9mm)', top: '50%', transform: 'translateY(-50%)', ...mono, fontSize: '7px', background: '#fff', padding: '0 1mm', color: 'var(--ink-muted)' }}>cut here only</span>
        </section>
      </div>

      {/* Sheet B: the stickers and the fold. */}
      <div className="gc-passport-wrap" style={{ overflowX: 'auto', margin: '18px auto 0', maxWidth: '1060px' }}>
        <section className="gc-passport-sheet gc-passport-b" style={{ width: '279mm', height: '184mm', boxSizing: 'border-box', background: '#fff', border: '1px solid var(--border)', padding: '5mm 8mm', display: 'flex', flexDirection: 'column', gap: '3mm', pageBreakAfter: 'auto' }}>
          <div style={{ display: 'flex', gap: '6mm', alignItems: 'center', background: friend.soft, border: `2px solid ${friend.accent}`, borderRadius: '14px', padding: '3mm 5mm' }}>
            <FriendArt friend={friend} mood="happy" size={18} />
            <div style={{ flex: '1 1 auto' }}>
              <span style={{ ...mono, color: friend.ink }}>Stickers for the {page.page} page · {edition.years}</span>
              <h2 style={{ ...display, fontSize: 'var(--text-lg)', marginTop: '2px' }}>Cut out, match the number, stick it in the ring</h2>
              <p style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: '2px' }}>Print on sticker paper, or on plain paper and glue. One sticker per lesson, numbered like the ring it fills, and {friend.name} for the stamp when every ring is full.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3mm 4mm', alignItems: 'flex-start' }}>
            {lessons.map(l => <Sticker key={l.moduleId} friend={friend} n={l.n} label={AREAS[l.area ?? 'safe'].name} size={young ? 42 : 36} mood="happy" plain={!young} />)}
            <Sticker friend={friend} label={`${page.page} stamp`} size={young ? 56 : 48} mood="happy" />
          </div>
          <div style={{ marginTop: 'auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '6mm', alignItems: 'center', border: '1.5px solid var(--ink-light)', borderRadius: '14px', padding: '3mm 5mm' }}>
            <div>
              <span style={{ ...mono, color: friend.ink }}>How to fold the passport sheet</span>
              <ol style={{ margin: '2px 0 0', paddingLeft: '5mm' }}>
                {FOLD_STEPS.map((s, i) => <li key={i} style={{ ...text, fontSize: 'var(--text-xs)', marginBottom: '1px' }}>{s}</li>)}
              </ol>
            </div>
            <div aria-hidden style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 12mm)', gridTemplateRows: 'repeat(2, 16mm)', border: '1px solid var(--ink-muted)' }}>
              {[...ZINE_TOP.map(n => ({ n, up: true })), ...ZINE_BOTTOM.map(n => ({ n, up: false }))].map(({ n, up }, i) => (
                <span key={i} style={{ border: '1px dotted var(--ink-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '9px', color: n === 1 ? friend.ink : 'var(--ink-muted)', fontWeight: 700, transform: up ? 'rotate(180deg)' : 'none', background: n === 1 ? friend.soft : '#fff' }}>{n}</span>
              ))}
            </div>
          </div>
        </section>
      </div>

      <p className="no-print" style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', maxWidth: '1060px', margin: '16px auto 0' }}>
        The other pages: {others.map((e, i) => <span key={e.stage}>{i ? ' · ' : ''}<Link href={`/print/passport/${e.stage}`} style={{ color: 'var(--ink)', fontWeight: 700 }}>{PASSPORT_STAGES[e.stage].page}</Link></span>)}
      </p>
    </main>
  )
}
