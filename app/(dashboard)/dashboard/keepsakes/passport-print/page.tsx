import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getChildren } from '@/lib/children/server'
import { getAllStagesProgress, type StageId } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import { loadStoredStamps } from '@/lib/pathway/stamp-store'
import { getStickerBook } from '@/lib/stickers/book'
import { stickerArt } from '@/lib/stickers/catalog'
import StickerBadge from '@/components/pathway/StickerBadge'
import { characterForStage } from '@/lib/content/stage-characters'
import PrintButton from './PrintButton'
import StageSticker from '@/components/passport/StageSticker'
import { STAGE_STICKERS, PAPER_RULE } from '@/lib/pathway/stage-stickers'
import { pageCount } from '@/lib/pathway/page-count'
import { STAGE_IDS, STAGE_COLOURS, BURGUNDY_FLAT, GOLD, PASSPORT_PRINT_RESET, PAGE_CREAM, PAGE_INK, PAGE_INK_SOFT } from '@/lib/pathway/passport-print-style'

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

const STAGE_NAMES = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent']
const STAGE_AGES = ['Ages 4 to 7', 'Ages 8 to 10', 'Ages 11 to 13', 'Ages 13 to 15', 'Age 16 and up']

export default async function PassportPrintPage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
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
  // Stored stamps first (migration 378): the booklet prints the stamps the
  // record holds, so adding a module never takes one off a printed page.
  const storedStamps = await loadStoredStamps(supabase, child?.id ?? null)
  // The stage pages print the one stamp rule now, so the five section rows
  // (buildPassportSections) are no longer read here (17 November 2026).
  const earned = (book?.stickers ?? []).filter(s => s.earned)
  const stampedCount = STAGE_IDS.filter((id, i) => isStageStamped(progress[id], passed, i + 1, storedStamps)).length

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
          ${PASSPORT_PRINT_RESET}
          .gc-passport-print { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .gc-pp-screen { display: none !important; }
          .gc-pp-pages { display: block !important; }
          .gc-pp-page { box-shadow: none !important; border-radius: 0 !important; page-break-after: always; break-after: page; margin: 0 !important; }
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
        {/* SAY WHOSE FILE THIS IS. A6 at one page per sheet is right for the
            printer who binds the keepsake and wrong for a parent at a home
            printer: most will not do A6, and the ones that try scale it onto
            A4 with an enormous margin. The zine is the one to press print on. */}
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px', maxWidth: '52ch' }}>
          It is sized for a commercial printer rather than the one in your house.{' '}
          <Link href={`/dashboard/keepsakes/passport-print/zine${child ? `?child=${child.id}` : ''}`} style={{ color: 'var(--terracotta-dark)', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            To fold one tonight on plain A4, use the one sheet version.
          </Link>
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
        <div className="gc-pp-page" data-page="cover" style={{ ...page, background: BURGUNDY_FLAT, color: GOLD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24, textAlign: 'center', boxShadow: `inset 0 0 0 3mm rgba(237,195,95,0.35), ${page.boxShadow}` }}>
          <span style={{ ...mono, fontSize: 11, opacity: 0.85 }}>Guided Childhood</span>
          {/* The app's title and the five friends in foil, a friend in colour
              once its page is stamped (17 November 2026: the printed book is
              the app's burgundy passport, not a different object). */}
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.01em' }}>Digital Childhood<br />Passport</span>
          <span style={{ display: 'flex', gap: 5, marginTop: 6 }}>
            {STAGE_STICKERS.map((st, i) => {
              const on = isStageStamped(progress[STAGE_IDS[i]], passed, st.n, storedStamps)
              return (
                <span key={st.n} style={{ width: 26, height: 26, borderRadius: '50%', overflow: 'hidden', border: `1.5px solid ${GOLD}`, background: on ? PAGE_CREAM : 'rgba(237,195,95,0.10)', display: 'inline-flex' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={st.img} alt="" width={26} height={26} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: on ? 'none' : 'grayscale(1) brightness(1.35) sepia(0.7) opacity(0.45)' }} />
                </span>
              )
            })}
          </span>
          <span style={{ ...mono, fontSize: 12, marginTop: 8 }}>{childName}</span>
          {child?.passport_code && <span style={{ ...mono, fontSize: 10, opacity: 0.8 }}>№ {child.passport_code}</span>}
        </div>

        {/* INSIDE COVER */}
        <div className="gc-pp-page" data-page="inside" style={{ ...page, padding: '22px 20px' }}>
          <p style={{ ...mono, fontSize: 9, color: '#A08247', margin: '0 0 10px' }}>This passport belongs to</p>
          <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 26, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{childName}</p>
          {child?.passport_code && <p style={{ ...mono, fontSize: 10, color: '#6B5C42', margin: '0 0 18px' }}>№ {child.passport_code}</p>}
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: '#4A3B25', margin: '0 0 12px' }}>
            Five stages from four to sixteen, and a Planet Friend sticker for each. A stage is done when: {PAPER_RULE.charAt(0).toLowerCase() + PAPER_RULE.slice(1)} The stickers at the back are the days, the jobs and the time outside along the way.
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
          const stamped = isStageStamped(p, passed, n, storedStamps)
          const colour = STAGE_COLOURS[i]
          const friend = characterForStage(n)
          const c = pageCount(p, passed.has(n))
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

              {/* THE STICKER SPOT (17 November 2026). The stage's Planet Friend
                  in colour once the page is stamped in the app, a dashed
                  circle to stick it on until then, and the line it says was
                  learnt. Then the one rule, the three things the stamp reads
                  (lib/pathway/stamped.ts), never the rows that earn nothing. */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 6px' }}>
                {stamped
                  ? <StageSticker s={STAGE_STICKERS[i]} earned size={70} showName={false} />
                  : (
                    <div style={{ width: 70, height: 70, borderRadius: '50%', border: '2px dashed rgba(42,31,20,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'rgba(42,31,20,0.45)' }}>
                      <span style={{ ...mono, fontSize: 7, lineHeight: 1.4 }}>Stick<br />{STAGE_STICKERS[i].friend}<br />here</span>
                    </div>
                  )}
              </div>
              <p style={{ fontSize: 10.5, lineHeight: 1.4, color: PAGE_INK_SOFT, textAlign: 'center', margin: '0 0 8px', fontStyle: stamped ? 'normal' : 'italic' }}>
                {stamped ? `“${STAGE_STICKERS[i].learnt}”` : `Earns ${STAGE_STICKERS[i].friend}: ${STAGE_STICKERS[i].learnt.charAt(0).toLowerCase()}${STAGE_STICKERS[i].learnt.slice(1)}`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {[
                  { k: 'l', label: `Lessons passed · ${c.lessons.done} of ${c.lessons.total}`, done: c.lessons.total > 0 && c.lessons.done >= c.lessons.total, show: c.lessons.total > 0 },
                  { k: 's', label: `Talks done · ${c.scripts.done} of ${c.scripts.total}`, done: c.scripts.done >= c.scripts.total, show: c.scripts.total > 0 },
                  { k: 'c', label: c.check.done ? 'Big check passed' : 'Big check', done: c.check.done, show: true },
                ].filter(r => r.show).map(r => (
                  <div key={r.k} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', border: `1.5px solid ${r.done ? colour : 'rgba(42,31,20,0.3)'}`, background: r.done ? colour : 'transparent', flexShrink: 0 }} aria-hidden />
                    <span style={{ fontSize: 11, fontWeight: 700, color: PAGE_INK }}>{r.label}</span>
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
        <div className="gc-pp-page" data-page="back" style={{ ...page, background: BURGUNDY_FLAT, color: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
          <p style={{ ...mono, fontSize: 10, lineHeight: 1.8, margin: 0 }}>Guided Childhood<br />guidedchildhood.com<br /><span style={{ opacity: 0.7 }}>A staged path from four to sixteen</span></p>
        </div>
      </div>
    </div>
  )
}
