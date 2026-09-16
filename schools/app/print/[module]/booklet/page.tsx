import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import { parseSlides } from '@gc/shared/lesson-slides'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'
import { PASSPORT_STAGES } from '@gc/shared/passport-stages'
import { AREAS, areaOf, placementOf, pageModules } from '@gc/shared/passport-areas'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import PrintButton from '@/components/PrintButton'
import { homeCodeQr, homeCodeLabel } from '@/lib/qr'
import { worksheetItems, splitSheets, SHEET_CAPACITY } from '@/lib/worksheet'
import { friendFor, printRegister, mono, display, text, FriendArt, FriendStrip, PrintSheet, Box, WriteLines, BigBox, TickRow, BigChoice, Number, ColourStar } from '@/components/print/kit'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title
  return { title: title ? `Pupil booklet: ${title}` : 'Pupil booklet: Module' }
}

// THE PUPIL BOOKLET, ON THE PRINT KIT (14 September 2026).
//
// The little companion each child holds before and during the lesson (JP
// brief, 6 July 2026), photocopied per pupil. Since 14 September it is in
// colour with the lesson's own Planet Friend on every sheet: waving on the
// cover, thinking beside the words to say, proud on the last page beside the
// number of the passport sticker this lesson earns. The register decides the
// sizes: a Reception booklet has one idea a page, faces to point at instead
// of tick boxes, a drawing box that runs to the foot of the page and a star
// to colour; a Year 10 booklet opens on an editorial cover, is quieter and
// denser, and the same friend is a small mark. Generated from the lesson
// row; nothing typed twice. The design council's pass of 14 September 2026
// (a Reception teacher and a Head of PSHE) shaped the Reception pages and the
// older cover; their findings are in plans/decisions.md.

type TeacherNotes = {
  worksheet_items?: unknown
  worksheet?: { verdict_options?: string[] }
  commitment_stem?: string
  tool?: { heading?: string }
}
type ParentNote = { family_question?: string }

export const revalidate = 3600

export default async function PupilBookletPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes, parent_note, home_code')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const concepts = slides.filter(s => s.type === 'concept') as { heading: string; body: string; emoji?: string }[]
  const quote = slides.find(s => s.type === 'quote') as { text: string; label?: string } | undefined
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const items = worksheetItems(notes)
  // The booklet used to print module 12's words on every module. The right
  // words were in the row all along: the worksheet's own verdicts and the
  // commitment stem the pack already reads.
  const verdicts = notes.worksheet?.verdict_options ?? []
  const stemRaw = notes.commitment_stem ?? ''
  const stemLabel = /^my promise/i.test(stemRaw) ? 'My promise' : 'My commitment'
  const stemBody = stemRaw.replace(/^my (commitment|promise):\s*/i, '')
  const stem = stemBody ? stemBody.charAt(0).toUpperCase() + stemBody.slice(1) : 'The one thing I will do this week is...'
  const familyQuestion = ((lesson.parent_note ?? {}) as ParentNote).family_question
  // The home code (migration 230): this is the sheet that goes home in a bag,
  // which makes it the one the code belongs on.
  const homeCode = (lesson as { home_code?: string | null }).home_code ?? null
  const qr = homeCode ? await homeCodeQr(homeCode, 92) : null

  const friend = friendFor(lesson.character_cast, lesson.key_stage)
  const reg = printRegister(lesson.key_stage)
  const young = reg.key === 'bouncy'
  // Years 7 up get the editorial cover: the title at display scale, one rule,
  // the friend as a mark. The ladder runs the other way on a cover, or a
  // Year 11 sheet has less presence than a Reception one (the Head of PSHE
  // pass, 14 September 2026). Emoji on the rundown stop at the same line.
  const editorial = reg.key === 'level' || reg.key === 'still'
  const eyebrow = `${lesson.key_stage} · ${lesson.year_band}`
  // The words to say: the lesson's own quote, or the module's tool when the
  // deck has no quote slide, so the band never prints empty.
  const sayIt = quote?.text?.trim() || notes.tool?.heading || null
  // The passport page this lesson fills, the area on it, and the number of
  // the sticker on the passport sheet that this lesson earns, so the last
  // page can say exactly which sticker goes in which ring.
  const placement = placementOf(lesson.module_id)
  const area = areaOf(lesson.module_id)
  const page = placement && placement !== 'after' ? PASSPORT_STAGES[placement] : null
  const stickerN = placement && placement !== 'after' ? pageModules(placement).find(m => m.moduleId === lesson.module_id)?.n ?? null : null
  const footer = `${lesson.title} · pupil booklet`
  // Verdict cards in sheets that each fit at the register's own size, so
  // every sheet keeps its footer at its foot (lib/worksheet.ts, splitSheets).
  const itemSheets = splitSheets(items, SHEET_CAPACITY[reg.key])

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff' }}>
      <div className="no-print" style={{ padding: '20px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={mono}>Pupil booklet · photocopy per pupil · colour or black and white</span>
        <PrintButton label="Print the booklet" />
      </div>

      {/* The cover: the friend, the title, whose booklet it is. */}
      <PrintSheet footer={footer} center>
        {editorial ? (
          <div style={{ padding: '10px 6px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: `3px solid ${friend.accent}`, paddingBottom: '12px' }}>
              <span style={{ ...mono, color: friend.ink, flex: '1 1 auto' }}>{eyebrow} · pupil booklet · with {friend.name}</span>
              <FriendArt friend={friend} mood="wave" size={reg.friendMm} />
            </div>
            <h1 style={{ ...display, fontSize: 'clamp(34px, 9vw, 56px)', lineHeight: 1.04, letterSpacing: '-0.01em', margin: '34px 0 18px', overflowWrap: 'anywhere' }}>{lesson.title}</h1>
            <p style={{ ...text, fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', maxWidth: '560px' }}>
              By the end of this lesson: {lesson.single_action_outcome.replace(/^I can/, 'you can')}
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', margin: '44px 0 0', borderTop: `1.5px solid ${friend.accent}`, paddingTop: '18px' }}>
              <span style={{ ...mono, color: friend.ink, whiteSpace: 'nowrap' }}>This booklet belongs to</span>
              <span style={{ flex: '1 1 auto', borderBottom: `2px solid ${friend.accent}`, height: `${reg.lineHeight - 10}px` }} />
            </div>
          </div>
        ) : (
          <>
            <div style={{ background: friend.soft, border: `2.5px solid ${friend.accent}`, borderRadius: `${reg.radius + 6}px`, padding: young ? '34px 30px 30px' : '30px 30px 26px', textAlign: 'center' }}>
              <FriendArt friend={friend} mood="wave" size={reg.friendMm} />
              <div style={{ ...mono, color: friend.ink, margin: '16px 0 8px' }}>{eyebrow} · with {friend.name}</div>
              <h1 style={{ ...display, fontSize: reg.title, margin: '0 auto 14px', maxWidth: '520px' }}>{lesson.title}</h1>
              <p style={{ ...text, fontSize: reg.body, color: 'var(--ink-soft)', maxWidth: '440px', margin: '0 auto' }}>
                By the end of this lesson: {lesson.single_action_outcome.replace(/^I can/, 'you can')}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', margin: '26px 10px 0' }}>
              <span style={{ ...mono, color: friend.ink, whiteSpace: 'nowrap' }}>This booklet belongs to</span>
              <span style={{ flex: '1 1 auto', borderBottom: `2px solid ${friend.accent}`, height: `${reg.lineHeight - 10}px` }} />
            </div>
          </>
        )}
        {young && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '30px' }}>
            <ColourStar size={70} label="Colour me" />
            <ColourStar size={70} label="And me" />
            <ColourStar size={70} label="Me too" />
          </div>
        )}
      </PrintSheet>

      {/* The rundown: what today is about, and the words to say. */}
      <PrintSheet footer={footer} fill={young}>
        <FriendStrip friend={friend} register={reg} eyebrow="Before we start · the rundown" />
        <h2 style={{ ...display, fontSize: reg.title, marginBottom: '16px' }}>What today is about</h2>
        {concepts.slice(0, 3).map((c, i) => (
          <div key={i} className="gc-avoid-break" style={{ display: 'flex', gap: '14px', alignItems: 'center', border: '1.5px solid var(--ink-light)', borderRadius: `${reg.radius}px`, padding: young ? '18px 20px' : '14px 18px', marginBottom: '10px' }}>
            <Number n={i + 1} friend={friend} size={young ? 40 : 32} />
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: young ? 'var(--text-xl)' : 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.25 }}>
              {c.emoji && !editorial ? `${c.emoji} ` : ''}{c.heading}
            </div>
          </div>
        ))}
        {sayIt && (
          <div className="gc-avoid-break" style={{ display: 'flex', gap: '16px', alignItems: 'center', background: friend.soft, border: `2px solid ${friend.accent}`, borderRadius: `${reg.radius}px`, padding: '16px 20px', marginTop: '18px' }}>
            <FriendArt friend={friend} mood="thinking" size={reg.markMm * 1.5} />
            <div>
              <div style={{ ...mono, color: friend.ink, marginBottom: '6px' }}>{quote?.label ?? `Say it like ${friend.name}`}</div>
              <p style={{ ...text, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: young ? 'var(--text-xl)' : 'var(--text-lg)', lineHeight: 1.3 }}>{sayIt}</p>
            </div>
          </div>
        )}
        {young && <BigBox label="Draw the thing we talked about" height={reg.boxHeight} friend={friend} grow />}
      </PrintSheet>

      {/* Follow along: my verdicts. */}
      {itemSheets.map((sheet, si) => (
      <PrintSheet key={si} footer={footer}>
        <FriendStrip friend={friend} register={reg} eyebrow={itemSheets.length > 1 ? `During the lesson · my answers · ${si + 1} of ${itemSheets.length}` : 'During the lesson · my answers'} />
        {si === 0 && (
          <>
            <h2 style={{ ...display, fontSize: reg.title, marginBottom: '6px' }}>My verdicts</h2>
            <p style={{ ...text, fontSize: reg.body, color: 'var(--ink-soft)', marginBottom: '14px' }}>
              {young ? `Your teacher reads each one. Point at your answer, then colour the circle you chose.` : 'Tick your verdict for each card, then write your reason. A verdict without a reason does not count.'}
            </p>
          </>
        )}
        {sheet.map(it => (
          <Box key={it.n} radius={reg.radius}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Number n={it.n} friend={friend} size={young ? 34 : 28} />
              <p style={{ ...text, fontSize: reg.body, fontWeight: 700, paddingTop: '4px' }}>{it.item}</p>
            </div>
            {young ? (
              verdicts.length > 0 && <BigChoice options={verdicts} friend={friend} />
            ) : (
              <>
                {verdicts.length > 0 && <TickRow options={verdicts} friend={friend} />}
                <div style={{ ...mono, marginTop: '10px' }}>{it.stem ?? 'Because'}</div>
                <WriteLines n={1} height={reg.lineHeight} />
              </>
            )}
          </Box>
        ))}
      </PrintSheet>
      ))}

      {/* The mission page, and the passport sticker's number. */}
      <PrintSheet footer={footer} last>
        <FriendStrip friend={friend} register={reg} eyebrow="After the lesson · your mission" mood="happy" />
        <h2 style={{ ...display, fontSize: reg.title, marginBottom: '14px' }}>Take it home</h2>
        <Box label={stemLabel} friend={friend} tint radius={reg.radius}>
          <p style={{ ...text, fontSize: reg.body, fontWeight: 700 }}>{stem}</p>
          <WriteLines n={young ? 2 : 1} height={reg.lineHeight} color={friend.accent} />
        </Box>
        {familyQuestion && (
          <Box label="Ask at home tonight" radius={reg.radius}>
            <p style={{ ...text, fontSize: reg.body, fontWeight: 700 }}>{familyQuestion}</p>
          </Box>
        )}
        {homeCode && (
          <Box label="For a grown up" radius={reg.radius}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {qr && (
                <div aria-hidden style={{ flexShrink: 0, lineHeight: 0, background: '#fff', border: '1.5px solid var(--border)', borderRadius: '8px', padding: '3px' }} dangerouslySetInnerHTML={{ __html: qr }} />
              )}
              <p style={{ ...text, fontSize: 'var(--text-base)', flex: '1 1 200px', minWidth: 0 }}>
                {qr ? 'Point your phone at the square, or go to ' : 'Go to '}
                <strong style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{homeCodeLabel(homeCode)}</strong>{' '}
                and this lesson goes onto your child&rsquo;s own passport. Code{' '}
                <strong style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.12em' }}>{homeCode}</strong>.
              </p>
            </div>
          </Box>
        )}

        {/* The sticker ticket: which sticker on the passport sheet this lesson
            earns, and which ring it goes in. The same number is printed in the
            ring and on the sticker, so a Reception child matches them without
            reading, and the booklet itself carries no ring nothing fills. */}
        <div className="gc-avoid-break" style={{ display: 'flex', flexWrap: 'wrap', gap: '18px 22px', alignItems: 'center', justifyContent: 'center', marginTop: '26px', padding: '18px 20px', border: `2px solid ${friend.accent}`, borderRadius: `${reg.radius + 4}px`, background: friend.soft }}>
          <FriendArt friend={friend} mood="happy" size={young ? reg.friendMm * 0.75 : reg.friendMm} />
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ ...display, fontSize: young ? 'var(--text-2xl)' : 'var(--text-xl)' }}>Well done.</p>
            <p style={{ ...text, fontSize: reg.body, color: 'var(--ink-soft)', marginTop: '4px' }}>
              {friend.name} is proud of you.{page && area && stickerN ? ` Sticker ${stickerN} on your passport sheet goes in ring ${stickerN} of the ${page.page} page, under ${AREAS[area].name}.` : ''}
            </p>
          </div>
          {page && area && stickerN && (
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <Number n={stickerN} friend={friend} size={young ? 64 : 48} />
              <span style={{ ...mono, color: friend.ink }}>Sticker {stickerN}</span>
            </div>
          )}
        </div>
        <div style={{ marginTop: '18px' }}><PrintBrandFooter /></div>
      </PrintSheet>
    </main>
  )
}
