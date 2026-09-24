import { createClient } from '@/lib/supabase/server'
import { sessionUser } from '@/lib/supabase/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getChildren } from '@/lib/children/server'
import { getAllStagesProgress } from '@/lib/pathway/progress'
import { getPassedStageQuizzes } from '@/lib/pathway/stage-quiz-status'
import { isStageStamped } from '@/lib/pathway/stamped'
import { getStickerBook } from '@/lib/stickers/book'
import { characterForStage } from '@/lib/content/stage-characters'
import { STAGES } from '@/lib/content/stages'
import { FOLD_STEPS } from '@gc/shared/zine'
import { STAGE_IDS, STAGE_COLOURS, PASSPORT_PRINT_RESET } from '@/lib/pathway/passport-print-style'
import PassportZineSheet, { type ZineStage } from '@/components/pathway/PassportZineSheet'
import PrintButton from '../PrintButton'

// THE PASSPORT A PARENT CAN MAKE TONIGHT.
//
// Justin, 16 September 2026, approving plans/2026-09-16-per-child-passport-
// plan.md: "yes build and quote form."
//
// WHY THIS EXISTS BESIDE THE A6 FILE. The sibling route prints nine A6 pages,
// one per sheet, which is right for the printer who binds the £14 keepsake
// and wrong for a parent at a home printer: most will not do A6, and the ones
// that try scale it onto A4 with a margin you could park in. A zine has no
// such problem. One sheet of A4, one slit, three folds, any printer, any
// paper, and a child has a passport the size of a real one.
//
// FIVE STAGES AND THREE COVERS IS EIGHT, which is exactly the zine. That is
// not a coincidence we engineered: it is the reason this was the right
// format. The book already had eight faces.
//
// THE FREE ONE SELLS THE PAID ONE. A parent who has folded the paper passport
// knows what a bound one is worth in a way a photograph on a shop page never
// tells them, so this page ends by offering the printed one rather than
// pretending it does not exist.
//
// EVERY NUMBER IS REAL. Stamps, lessons and the stage check come from the
// same readings the passport on screen uses, so the paper can never show a
// stamp the app has not given.
//
// LAYOUT LIVES IN THE COMPONENT (components/pathway/PassportZineSheet), so
// the fiddly part can be checked at both sizes from a ref fixture without a
// login, the way ref-passport-book already is. This file does the reads.

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Fold your own passport · Guided Childhood' }

export default async function PassportZinePage({ searchParams }: { searchParams: Promise<{ child?: string }> }) {
  const { child: childParam } = await searchParams
  const supabase = await createClient()
  const user = await sessionUser(supabase)
  if (!user) redirect('/login')

  const { child } = await getChildren<{ id: string; name: string | null; age_band: string | null; stage_id: string | null; passport_code: string | null; is_primary: boolean | null }>(
    supabase, user.id, childParam, 'id, name, age_band, stage_id, passport_code')
  const childName = child?.name && child.name !== 'Your child' ? child.name : 'Your child'
  const currentStageNum = child?.stage_id ? STAGE_IDS.indexOf(child.stage_id as typeof STAGE_IDS[number]) + 1 : null

  const [progress, passed, book] = await Promise.all([
    getAllStagesProgress(supabase, user.id, 0, child?.id ?? null),
    getPassedStageQuizzes(supabase, user.id, child?.id ?? null),
    child ? getStickerBook(supabase, user.id, { id: child.id, age_band: child.age_band ?? null }).catch(() => null) : Promise.resolve(null),
  ])
  const earned = (book?.stickers ?? []).filter(s => s.earned)
  const stampedCount = STAGE_IDS.filter((id, i) => isStageStamped(progress[id], passed, i + 1)).length

  const stages: ZineStage[] = STAGE_IDS.map((id, i) => {
    const n = i + 1
    const p = progress[id]
    return {
      n,
      name: STAGES[i].name,
      ages: STAGES[i].ages,
      focus: STAGES[i].focus,
      colour: STAGE_COLOURS[i],
      cutout: characterForStage(n)?.cutout ?? null,
      stamped: isStageStamped(p, passed, n),
      isCurrent: currentStageNum === n,
      lessonsDone: p?.lessonsDone ?? 0,
      lessonsTotal: p?.lessonsTotal ?? 0,
      checkPassed: passed.has(n),
    }
  })

  const display: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.01em' }
  const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }

  return (
    <div className="gc-zine" style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px 60px' }}>
      <style>{`
        @media print {
          /* MARGIN ZERO, AND THE SHEET IS THE WHOLE PAPER. A zine's creases
             are the paper's own quarters, so insetting the artwork inside a
             margin moves every fold: a 285mm sheet centred on A4 puts the
             artwork's quarter 4.5mm away from the paper's. The safe area is
             held inside the panels instead, and the fold ticks on the outer
             edge let a family line a crease up even if a driver scales the
             job. See lib/pathway/passport-print-style.ts for the zoom. */
          @page { size: A4 landscape; margin: 0; }
          ${PASSPORT_PRINT_RESET}
          .gc-zine { max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .gc-zine-screen { display: none !important; }
          .gc-zine-wrap { overflow: visible !important; margin: 0 !important; }
        }
      `}</style>

      <div className="gc-zine-screen" style={{ marginBottom: 18 }}>
        <p style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--terracotta-dark)', margin: '0 0 6px' }}>Print, fold, cut</p>
        <h1 style={{ ...display, fontSize: 'var(--text-2xl)', margin: '0 0 8px', color: 'var(--ink)' }}>
          Fold {childName}&rsquo;s passport tonight
        </h1>
        <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px', maxWidth: '54ch' }}>
          One sheet of A4, one slit, three folds, and it is a passport the size of a real one. Every number on it is
          the real one: {stampedCount} of 5 pages stamped and {earned.length} sticker{earned.length === 1 ? '' : 's'} earned.
          Print it again whenever a page stamps.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <PrintButton />
          <Link href={`/dashboard/keepsakes/passport-print${child ? `?child=${child.id}` : ''}`} style={{ ...display, fontWeight: 800, color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Or the printer&rsquo;s version ›
          </Link>
        </div>

        <ol style={{ margin: '20px 0 0', padding: '0 0 0 20px', maxWidth: '60ch', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FOLD_STEPS.map(step => (
            <li key={step} style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55 }}>{step}</li>
          ))}
        </ol>
        {/* THE ONE SETTING THAT DECIDES WHETHER THIS LOOKS LIKE A PASSPORT.
            Chrome ships with Background graphics off and buried under More
            settings, and every colour on this sheet is a CSS background. The
            print block forces it where the browser allows, and this line is
            for the browsers that do not. */}
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.55, marginTop: 12, maxWidth: '60ch' }}>
          Tick background graphics in the print box, or the burgundy cover comes out white. Print it landscape at full
          size: if your printer offers fit to page, turn that off, because the panels are sized to fold and scaling
          them moves the creases.
        </p>
      </div>

      <div className="gc-zine-wrap" style={{ overflowX: 'auto' }}>
        <PassportZineSheet
          childName={childName}
          passportCode={child?.passport_code ?? null}
          stages={stages}
          stampedCount={stampedCount}
          stickerCount={earned.length}
        />
      </div>

      <div className="gc-zine-screen" style={{ marginTop: 22, background: '#fff', border: 'var(--edge)', borderRadius: 'var(--radius-card)', padding: '18px 20px', maxWidth: '60ch' }}>
        <p style={{ ...mono, fontSize: 'var(--text-xs)', color: 'var(--ink-muted)', margin: '0 0 6px' }}>Want the real thing?</p>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 10px' }}>
          The printed passport is bound, on proper paper, with a sticker sheet, and it arrives in the post. The paper
          one is the same book, which is the best way to know whether you want it.
        </p>
        <Link href={`/dashboard/keepsakes${child ? `?child=${child.id}` : ''}#p-passport_printed`} style={{ ...display, fontWeight: 800, color: 'var(--terracotta-dark)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          See the printed one ›
        </Link>
      </div>
    </div>
  )
}
