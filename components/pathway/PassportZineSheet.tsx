import { ZINE_PANELS } from '@gc/shared/zine'
import { AREA_ORDER, AREAS, AREA_EMOJI } from '@gc/shared/passport-areas'
import { BRAND_DOMAIN, LOGO_BARS } from '@gc/shared/brand'
import { BURGUNDY, GOLD, PAGE_CREAM, PAGE_INK, PAGE_INK_SOFT, PAGE_INK_FAINT } from '@/lib/pathway/passport-print-style'

// THE PASSPORT AS ONE SHEET OF A4: eight panels, one slit, three folds.
//
// PURE LAYOUT, no reads. The page above it does the Supabase work and hands
// down finished numbers, which is what lets the ref fixture render the same
// sheet with made up props and lets this be checked at both sizes without a
// login. Same reason app/ref-passport-book exists.
//
// A panel is A4 landscape divided by four across and two down, so about
// 74mm by 105mm: near enough A7. Everything here is sized for that, in
// millimetres rather than pixels, because the thing being laid out is paper.
// The top row prints upside down; see shared/zine.ts for why.

export type ZineStage = {
  n: number
  name: string
  ages: string
  focus: string
  colour: string
  /** The Planet Friend's cutout art, or null where there is none. */
  cutout: string | null
  stamped: boolean
  isCurrent: boolean
  lessonsDone: number
  lessonsTotal: number
  checkPassed: boolean
}

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }
const display: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '-0.01em' }

export default function PassportZineSheet({
  childName, passportCode, stages, stampedCount, stickerCount,
}: {
  childName: string
  passportCode: string | null
  stages: ZineStage[]
  stampedCount: number
  stickerCount: number
}) {
  const faces: Record<number, React.ReactNode> = {
    // 1 and 8 are the outside of the folded book: cover and back.
    1: (
      <div style={{ height: '100%', background: BURGUNDY, color: GOLD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2mm', textAlign: 'center', padding: '5mm', boxShadow: 'inset 0 0 0 2mm rgba(237,195,95,0.35)' }}>
        <span style={{ ...mono, fontSize: '6.5px', opacity: 0.85 }}>Guided Childhood</span>
        {/* THE LOGO, NOT AN EMOJI. A passport control emoji renders in the
            system's colour font, which puts a blue and white glyph in the
            middle of a burgundy and gold cover. The four rising bars are the
            actual mark (shared/brand.ts), they are gold because we draw them
            gold, and they print the same on every machine. */}
        <span aria-hidden style={{ width: '13mm', height: '13mm', borderRadius: '50%', border: `1.5px solid ${GOLD}`, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.8mm', padding: '3mm 0 3.6mm' }}>
          {LOGO_BARS.map((h, i) => (
            <span key={i} style={{ width: '0.9mm', height: `${(h / 16) * 6}mm`, background: GOLD, borderRadius: '0.4mm' }} />
          ))}
        </span>
        <span style={{ ...display, fontSize: '15px', lineHeight: 1.05 }}>Digital Literacy<br />Passport</span>
        <span style={{ ...mono, fontSize: '8px', marginTop: '2mm' }}>{childName}</span>
        {passportCode && <span style={{ ...mono, fontSize: '6.5px', opacity: 0.8 }}>№ {passportCode}</span>}
      </div>
    ),
    2: (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '5mm' }}>
        <span style={{ ...mono, fontSize: '6.5px', color: PAGE_INK_FAINT }}>This passport belongs to</span>
        <span style={{ ...display, fontSize: '16px', marginTop: '1mm', color: PAGE_INK, lineHeight: 1.1 }}>{childName}</span>
        {passportCode && <span style={{ ...mono, fontSize: '6.5px', color: PAGE_INK_SOFT, marginTop: '0.8mm' }}>№ {passportCode}</span>}
        <p style={{ fontSize: '8px', lineHeight: 1.5, color: PAGE_INK_SOFT, margin: '3mm 0 0' }}>
          Five pages, one for every stage from four to sixteen. A page stamps when its lessons are passed and its
          check is done, so a stamp is earned rather than a birthday reached.
        </p>
        <p style={{ fontSize: '8px', lineHeight: 1.5, color: PAGE_INK_SOFT, margin: '2mm 0 0' }}>
          Colour a page in when it stamps, or stick its sticker on.
        </p>

        {/* THE FOUR THINGS EVERY PAGE BUILDS, exactly as the class edition
            lists them on its own inside cover. Two editions of one book, so
            a child who folds the class one in school and this one at home is
            holding the same object rather than two products. */}
        <div style={{ marginTop: '3mm' }}>
          <span style={{ ...mono, fontSize: '5.5px', color: PAGE_INK_FAINT }}>What every page builds</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2mm', marginTop: '1.5mm' }}>
            {AREA_ORDER.map(key => (
              <span key={key} style={{ fontSize: '7px', fontWeight: 700, color: PAGE_INK, display: 'flex', gap: '1mm', alignItems: 'center', lineHeight: 1.2 }}>
                <span aria-hidden>{AREA_EMOJI[key]}</span>{AREAS[key].short}
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '2mm', display: 'flex', alignItems: 'baseline', gap: '2mm' }}>
          <span style={{ ...display, fontSize: '18px', color: PAGE_INK }}>{stampedCount}</span>
          <span style={{ ...mono, fontSize: '6.5px', color: PAGE_INK_FAINT }}>of 5 stamped today</span>
        </div>
      </div>
    ),
    8: (
      <div style={{ height: '100%', background: BURGUNDY, color: GOLD, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5mm', textAlign: 'center', padding: '5mm' }}>
        <span style={{ ...display, fontSize: '16px', lineHeight: 1.1 }}>{stickerCount}</span>
        <span style={{ ...mono, fontSize: '6.5px', opacity: 0.9 }}>sticker{stickerCount === 1 ? '' : 's'} earned so far</span>
        <p style={{ fontSize: '7.5px', lineHeight: 1.5, opacity: 0.85, margin: '2mm 0 0' }}>
          The days, the jobs, the time outside and the things learned along the way. They live in the app, and the
          sheet fills this book.
        </p>
        <span style={{ ...mono, fontSize: '6.5px', marginTop: 'auto', opacity: 0.8 }}>{BRAND_DOMAIN}</span>
      </div>
    ),
  }

  for (const s of stages) {
    faces[s.n + 2] = (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
        <div aria-hidden style={{ height: '3mm', background: s.colour, flexShrink: 0 }} />
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '3mm 5mm 5mm' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '2mm' }}>
            <div style={{ minWidth: 0 }}>
              <span style={{ ...mono, fontSize: '6px', color: s.colour, filter: 'brightness(0.8)', display: 'block' }}>Stage {s.n} · {s.ages}</span>
              <span style={{ ...display, fontSize: '13px', color: PAGE_INK, display: 'block', lineHeight: 1.1 }}>{s.name}</span>
            </div>
            {s.cutout && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.cutout} alt="" width={34} height={34} style={{ width: '9mm', height: '9mm', objectFit: 'contain', flexShrink: 0, filter: s.stamped || s.isCurrent ? 'none' : 'grayscale(1)', opacity: s.stamped || s.isCurrent ? 1 : 0.45 }} />
            )}
          </div>

          {/* A ring on every page, so a page that is not stamped reads as
              waiting rather than as empty. The same choice the A6 file makes. */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '3mm 0 2mm' }}>
            <div style={{
              width: '17mm', height: '17mm', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
              border: s.stamped ? `1.2mm solid ${s.colour}` : '0.6mm dashed rgba(42,31,20,0.3)',
              background: s.stamped ? '#fff' : 'transparent', transform: s.stamped ? 'rotate(-8deg)' : 'none',
              color: s.stamped ? s.colour : 'rgba(42,31,20,0.35)',
            }}>
              <span style={{ fontSize: '13px', lineHeight: 1 }}>{s.stamped ? '✓' : ''}</span>
              <span style={{ ...mono, fontSize: '5.5px' }}>{s.stamped ? 'Stamped' : 'Not yet'}</span>
            </div>
          </div>

          <p style={{ fontSize: '7.5px', lineHeight: 1.45, color: PAGE_INK_SOFT, margin: 0, textAlign: 'center' }}>{s.focus}</p>

          {/* THE MIDDLE OF THE PAGE IS THE CHILD'S. A passport page with a
              ring, a sentence and then five centimetres of nothing reads as
              unfinished, and a keepsake a child cannot touch is a printout.
              So the space gets a job: somewhere for the sticker, and one
              line to write on. It is also what makes this the same object as
              the class edition, which is a cut out, fold and stick task. */}
          <div style={{ marginTop: '3mm', border: '0.4mm dashed rgba(42,31,20,0.3)', borderRadius: '2mm', height: '15mm', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ ...mono, fontSize: '5.5px', color: PAGE_INK_FAINT }}>Stick your sticker here</span>
          </div>
          <div style={{ marginTop: '3mm' }}>
            <span style={{ ...mono, fontSize: '5.5px', color: PAGE_INK_FAINT }}>The best thing I learned</span>
            <div style={{ borderBottom: `0.3mm solid ${s.colour}`, height: '5mm' }} />
            <div style={{ borderBottom: `0.3mm solid ${s.colour}`, height: '5mm' }} />
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '2mm', display: 'flex', flexDirection: 'column', gap: '1.2mm' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5mm' }}>
              <span style={{ flex: 1, height: '1.6mm', borderRadius: '1mm', background: 'rgba(42,31,20,0.1)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${s.lessonsTotal > 0 ? Math.round((s.lessonsDone / s.lessonsTotal) * 100) : 0}%`, background: s.colour }} />
              </span>
              <span style={{ ...mono, fontSize: '5.5px', color: PAGE_INK_SOFT, whiteSpace: 'nowrap' }}>{s.lessonsDone} of {s.lessonsTotal}</span>
            </div>
            <span style={{ ...mono, fontSize: '5.5px', color: PAGE_INK_FAINT }}>Check {s.checkPassed ? 'passed' : 'to do'} · page {s.n} of 5</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section
      aria-label={`${childName}'s passport, eight panels on one sheet`}
      style={{
        width: '297mm', height: '210mm', background: '#fff', boxSizing: 'border-box',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '1fr 1fr',
        position: 'relative', margin: '0 auto',
      }}
    >
      {ZINE_PANELS.map(({ n, upside }) => (
        <div key={`${upside ? 't' : 'b'}${n}`} style={{ position: 'relative', overflow: 'hidden', border: '0.2mm dotted rgba(42,31,20,0.35)', background: PAGE_CREAM, color: PAGE_INK, fontFamily: 'var(--font-body)' }}>
          <div style={{ position: 'absolute', inset: 0, transform: upside ? 'rotate(180deg)' : 'none' }}>
            {faces[n]}
          </div>
        </div>
      ))}

      {/* The slit runs along the middle crease and crosses ONLY the two middle
          panels. Cutting the whole way is the one mistake that ruins the
          sheet, so it is labelled on the paper rather than left to the
          instructions on the screen. */}
      <div aria-hidden style={{ position: 'absolute', left: '25%', right: '25%', top: '50%', borderTop: '0.5mm dashed rgba(42,31,20,0.8)', transform: 'translateY(-0.25mm)' }} />
      <span aria-hidden style={{ position: 'absolute', left: 'calc(25% - 7mm)', top: '50%', transform: 'translateY(-55%)', fontSize: '14px', background: '#fff', padding: '0 1mm' }}>✂</span>
      <span aria-hidden style={{ position: 'absolute', left: 'calc(50% - 11mm)', top: '50%', transform: 'translateY(-50%)', ...mono, fontSize: '6.5px', background: '#fff', padding: '0 1mm', color: PAGE_INK_SOFT }}>cut here only</span>
    </section>
  )
}
