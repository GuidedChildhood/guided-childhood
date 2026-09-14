import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getChildren } from '@/lib/children/server'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import { buildPassportSections } from '@/lib/pathway/passport-sections'
import { getStickerBook } from '@/lib/stickers/book'
import { stickerArt } from '@/lib/stickers/catalog'
import StickerBadge from '@/components/pathway/StickerBadge'
import { characterForStage } from '@/lib/content/stage-characters'
import PrintButton from './PrintButton'

// The printed passport, page by page, at A6.
//
// Justin, 14 September 2026: "also image of passport print out." The £14
// keepsake had a generated photo on its card and nothing behind it: the orders
// board says fulfilment is by hand and there was no file to send a printer.
// This page is both things at once. On screen it is the preview a parent
// looks at before they buy; printed (or saved as PDF from the print dialog)
// it is A6, one passport page per sheet, and it is what the printer receives.
//
// Built from the same readings the passport on screen uses: stage progress,
// the stage check, the five rows per stage, and the child's sticker book. So
// the booklet in the post can never show a stamp the app has not given.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'The printed passport · Guided Childhood' }

const STAGE_IDS: StageId[] = ['foundation', 'builder', 'explorer', 'shaper', 'independent']
const STAGE_NAMES = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent']
const STAGE_AGES = ['Ages 4 to 7', 'Ages 8 to 10', 'Ages 11 to 13', 'Ages 13 to 15', 'Age 16 and up']
const STAGE_COLOURS = ['#EDC35F', '#2F8F6B', '#2E6F8E', '#7A5CC0', '#D4600A']

const BURGUNDY = 'linear-gradient(160deg, #6B2333 0%, #571C2A 55%, #4A1723 100%)'
const GOLD = '#EDC35F'

export default async function PassportPrintPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { child } = await getChildren<{ id: string; name: string | null; age_band: string | null; stage_id: string | null; passport_code: string | null; is_primary: boolean | null }>(
    supabase, user.id, childParam, 'id, name, age_band, stage_id, passport_code')
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'Your child'
  const currentStageNum = child?.stage_id ? STAGE_IDS.indexOf(child.stage_id as StageId) + 1 : null

  const [progress, passed, book] = await Promise.all([
    getAllStagesProgress(supabase, user.id, 0, child?.id ?? null),
    getPassedStageQuizzes(supabase, user.id, child?.id ?? null),
    child ? getStickerBook(supabase, user.id, { id: child.id, age_band: child.age_band ?? null }).catch(() => null) : Promise.resolve(null),
  ])
  const sections = await buildPassportSections(
    supabase, user.id, child ? { id: child.id, age_band: child.age_band } : null, progress, currentStageNum,
    { openMoments: 0, solvedMoments: 0, parentReport: null },
  ).catch(() => ({} as Awaited<ReturnType<typeof buildPassportSections>>))
  const earned = (book?.stickers ?? []).filter(s => s.earned)
  const stampedCount = STAGE_IDS.filter((id, i) => isStageStamped(progress[id], passed, i + 1)).length

  const page: React.CSSProperties = {
    width: '105mm', height: '148mm', boxSizing: 'border-box', overflow: 'hidden',
    background: '#FFFCF3', color: '#2A1F14', position: 'relative',
    fontFamily: 'var(--font-body)', boxShadow: '0 6px 18px rgba(26,26,46,0.18)', borderRadius: 3,
  }
  const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }

  return (
    <div className="gc-passport-print" style={{ maxWidth: 720, margin: '0 auto', padding: '20px 16px 60px' }}>
      <style>{`
        @media print {
          @page { size: A6 portrait; margin: 0; }
          body { background: #fff !important; }
          .gc-passport-print { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .gc-pp-screen { display: none !important; }
          .gc-pp-pages { display: block !important; }
          .gc-pp-page { box-shadow: none !important; border-radius: 0 !important; page-break-after: always; break-after: page; margin: 0 !important; }
          .bottom-tab-bar, nav, header, [data-rightnow] { display: none !important; }
        }
      `}</style>

      <div className="gc-pp-screen" style={{ marginBottom: 18 }}>
        <p style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', margin: '0 0 6px' }}>The printed passport</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', letterSpacing: '-0.02em', margin: '0 0 8px', color: 'var(--ink)' }}>
          {childName}&apos;s passport, page by page
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px', maxWidth: '52ch' }}>
          This is the A6 booklet as it prints today: {stampedCount} of 5 pages stamped and {earned.length} sticker{earned.length === 1 ? '' : 's'} earned. It is built from the real stamps, so it changes as {childName} does. Order it and this is the file the printer gets.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <PrintButton />
          <Link href={`/dashboard/keepsakes${child ? `?child=${child.id}` : ''}#p-passport_printed`} style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Order the printed one ›
          </Link>
        </div>
      </div>

      <div className="gc-pp-pages" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center' }}>
        {/* COVER */}
        <div className="gc-pp-page" data-page="cover" style={{ ...page, background: BURGUNDY, color: GOLD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24, textAlign: 'center', boxShadow: `inset 0 0 0 3mm rgba(237,195,95,0.35), ${page.boxShadow}` }}>
          <span style={{ ...mono, fontSize: 11, opacity: 0.85 }}>Guided Childhood</span>
          <span style={{ width: 62, height: 62, borderRadius: '50%', border: `3px solid ${GOLD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }} aria-hidden>🛂</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.01em' }}>Digital Literacy<br />Passport</span>
          <span style={{ ...mono, fontSize: 12, marginTop: 8 }}>{childName}</span>
          {child?.passport_code && <span style={{ ...mono, fontSize: 10, opacity: 0.8 }}>№ {child.passport_code}</span>}
        </div>

        {/* INSIDE COVER */}
        <div className="gc-pp-page" data-page="inside" style={{ ...page, padding: '22px 20px' }}>
          <p style={{ ...mono, fontSize: 9, color: '#A08247', margin: '0 0 10px' }}>This passport belongs to</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{childName}</p>
          {child?.passport_code && <p style={{ ...mono, fontSize: 10, color: '#6B5C42', margin: '0 0 18px' }}>№ {child.passport_code}</p>}
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4A3B25', margin: '0 0 12px' }}>
            Five stages from four to sixteen. Each page stamps when its lessons are passed and its check is done. The stickers at the back are the days, the jobs, the time outside and the things learned along the way.
          </p>
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4A3B25', margin: 0 }}>
            Add each sticker from the sheet as it is earned in the app, or keep this copy until the whole book is stamped.
          </p>
          <p style={{ ...mono, fontSize: 9, color: '#A08247', position: 'absolute', bottom: 16, left: 20 }}>guidedchildhood.com</p>
        </div>

        {/* ONE PAGE PER STAGE */}
        {STAGE_IDS.map((id, i) => {
          const n = i + 1
          const p = progress[id]
          const stamped = isStageStamped(p, passed, n)
          const colour = STAGE_COLOURS[i]
          const friend = characterForStage(n)
          const rows = sections[n]?.sections ?? []
          const isCurrent = currentStageNum === n
          return (
            <div key={id} className="gc-pp-page" data-page={`stage-${n}`} data-stamped={stamped ? '1' : '0'} style={{ ...page, padding: '18px 18px 16px', borderTop: `6mm solid ${colour}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div>
                  <p style={{ ...mono, fontSize: 9, color: colour, margin: '0 0 2px', filter: 'brightness(0.8)' }}>Stage {n} · {STAGE_AGES[i]}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 22, margin: 0, letterSpacing: '-0.02em' }}>{STAGE_NAMES[i]}</p>
                </div>
                {friend && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={friend.cutout} alt={friend.name} width={54} height={54} style={{ width: 54, height: 54, objectFit: 'contain', filter: stamped || isCurrent ? 'none' : 'grayscale(1)', opacity: stamped || isCurrent ? 1 : 0.45 }} />
                )}
              </div>

              {/* The stamp: a ring on every page, filled and tilted once earned,
                  so an unstamped page reads as waiting rather than empty. */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 10px' }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  border: stamped ? `3px solid ${colour}` : '2px dashed rgba(42,31,20,0.3)',
                  background: stamped ? '#fff' : 'transparent', transform: stamped ? 'rotate(-8deg)' : 'none',
                  color: stamped ? colour : 'rgba(42,31,20,0.35)',
                }}>
                  <span style={{ fontSize: 22, lineHeight: 1 }}>{stamped ? '✓' : ''}</span>
                  <span style={{ ...mono, fontSize: 8 }}>{stamped ? 'Stamped' : 'Not yet'}</span>
                </div>
              </div>

              <p style={{ ...mono, fontSize: 9, color: '#6B5C42', margin: '0 0 6px' }}>
                Lessons {p?.lessonsDone ?? 0} of {p?.lessonsTotal ?? 0} · Check {passed.has(n) ? 'passed' : 'to do'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {rows.map(r => (
                  <div key={r.key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 14, textAlign: 'center', fontSize: 11 }} aria-hidden>{r.emoji}</span>
                    <span style={{ flex: 1, fontSize: 11, fontWeight: 700, color: '#2A1F14' }}>{r.label}</span>
                    <span style={{ width: 54, height: 6, borderRadius: 3, background: 'rgba(42,31,20,0.1)', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', width: `${Math.max(0, Math.min(100, r.pct))}%`, background: colour }} />
                    </span>
                    <span style={{ ...mono, fontSize: 8, width: 26, textAlign: 'right', color: '#6B5C42' }}>{Math.round(r.pct)}%</span>
                  </div>
                ))}
              </div>
              <p style={{ ...mono, fontSize: 8, color: '#A08247', position: 'absolute', bottom: 12, right: 18 }}>{n} of 5</p>
            </div>
          )
        })}

        {/* THE STICKERS */}
        <div className="gc-pp-page" data-page="stickers" style={{ ...page, padding: '18px 16px' }}>
          <p style={{ ...mono, fontSize: 9, color: '#A08247', margin: '0 0 2px' }}>My stickers</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 18, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            {earned.length} earned so far
          </p>
          {earned.length === 0 ? (
            <p style={{ fontSize: 12, color: '#6B5C42', lineHeight: 1.5 }}>The first sticker comes with the first full day, the first lesson or the first job. This page fills from the sheet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px 4px', justifyItems: 'center' }}>
              {earned.slice(0, 20).map(s => {
                const art = stickerArt(s)
                return (
                  <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 52 }}>
                    <span style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: `2px solid ${s.colour}`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {art
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={art} alt={s.name} width={32} height={32} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                        : <StickerBadge s={s} size={30} />}
                    </span>
                    <span style={{ fontSize: 7.5, fontFamily: 'var(--font-mono)', fontWeight: 700, textAlign: 'center', lineHeight: 1.1, color: '#4A3B25' }}>{s.name}</span>
                  </div>
                )
              })}
            </div>
          )}
          <p style={{ ...mono, fontSize: 8, color: '#A08247', position: 'absolute', bottom: 12, left: 16 }}>Peel the rest from the sheet as they come</p>
        </div>

        {/* BACK */}
        <div className="gc-pp-page" data-page="back" style={{ ...page, background: BURGUNDY, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <p style={{ ...mono, fontSize: 10, lineHeight: 1.8, margin: 0 }}>Guided Childhood<br />guidedchildhood.com<br /><span style={{ opacity: 0.7 }}>A staged path from four to sixteen</span></p>
        </div>
      </div>
    </div>
  )
}
