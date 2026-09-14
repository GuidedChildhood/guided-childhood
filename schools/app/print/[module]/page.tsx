import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import { parseSlides, type ChoiceSlide } from '@gc/shared/lesson-slides'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'
import { PASSPORT_STAGES } from '@gc/shared/passport-stages'
import { AREAS, areaOf, placementOf } from '@gc/shared/passport-areas'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import PrintButton from '@/components/PrintButton'
import { worksheetItems, hasAnswerKey } from '@/lib/worksheet'
import { friendFor, printRegister, mono, display, text, FriendArt, FriendHeader, FriendStrip, PrintSheet, Box, WriteLines, TickRow, Number, CutLine } from '@/components/print/kit'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title
  return { title: title ? `Paper pack: ${title}` : 'Paper pack: Module' }
}

// THE PAPER PACK, ON THE PRINT KIT (14 September 2026).
//
// Every printable a teacher needs for a lesson, generated from the lesson
// row in one click: the teacher one pager with statutory tags, the tool
// bookmarks, the worksheet with its answer key, the start and exit cards and
// the parent note. Equity rule made real: the whole lesson runs from this
// pack with one photocopier and no screens. Since 14 September the pupil
// sheets carry the lesson's Planet Friend in colour, sized by the key stage's
// register, and the teacher sheets carry the same friend as a small mark.

type TeacherNotes = {
  learning_objective?: string
  timing?: string
  misconceptions?: string[]
  differentiation?: { support?: string; stretch?: string }
  paper_fallback?: string
  worksheet_items?: unknown
  // v3: per module print content, so every module's pack carries its own
  // tool and verdict language. Reference module fallbacks keep old rows printing.
  tool?: { heading?: string; lines?: string[]; strapline?: string }
  worksheet?: { title?: string; directions?: string; verdict_options?: string[] }
  commitment_stem?: string
}
type ParentNote = { headline?: string; taught?: string; try_this?: string; family_question?: string; passport?: string }
type DslNote = { note?: string }

export const revalidate = 3600

export default async function PrintPackPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params

  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, statutory_hooks, efcw_strands, evidence_anchor, character_cast, slides, teacher_notes, parent_note, dsl_note, home_code')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const checks = slides.filter((s): s is ChoiceSlide => s.type === 'choice')
  const retrieval = checks[0]
  const exitChecks = checks.slice(-2)
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const parent = (lesson.parent_note ?? {}) as ParentNote
  const dsl = (lesson.dsl_note ?? {}) as DslNote
  const items = worksheetItems(notes)

  // Module specific print content with reference lesson fallbacks.
  const tool = {
    heading: notes.tool?.heading ?? 'The three checks',
    lines: notes.tool?.lines ?? [
      '1. Who made this, and how do they know?',
      '2. What do other places say?',
      '3. How is it trying to make me feel?',
    ],
    strapline: notes.tool?.strapline ?? 'Three checks, under a minute. Check before you share.',
  }
  const worksheetTitle = notes.worksheet?.title ?? 'Run the three checks'
  const worksheetDirections = notes.worksheet?.directions ?? 'For each item: run the checks, circle a verdict, and give your reason. A verdict without a reason does not count.'
  const verdictOptions = notes.worksheet?.verdict_options ?? ['Believe', 'Pause', 'Do not share']
  const commitmentStem = notes.commitment_stem ?? 'My commitment: the next time I see a shocking post I will...'
  const homeCode = (lesson as { home_code?: string | null }).home_code ?? null

  const friend = friendFor((lesson as { character_cast?: string | null }).character_cast, lesson.key_stage)
  const reg = printRegister(lesson.key_stage)
  const young = reg.key === 'bouncy'
  const eyebrow = `${lesson.key_stage} · ${lesson.year_band}`
  const placement = placementOf(lesson.module_id)
  const area = areaOf(lesson.module_id)
  const page = placement && placement !== 'after' ? PASSPORT_STAGES[placement] : null
  const teacherFooter = `${lesson.title} · teacher sheet`
  const pupilFooter = `${lesson.title} · photocopy per pupil`

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff', color: 'var(--ink)' }}>
      <div className="no-print" style={{ padding: '20px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={mono}>Paper pack · print one, photocopy per pupil where marked</span>
        <PrintButton label="Print the pack" />
      </div>

      {/* Sheet 1: the teacher one pager. */}
      <PrintSheet footer={teacherFooter}>
        <FriendHeader friend={friend} register={reg} small mood="thinking" eyebrow={`${eyebrow} · Teacher one pager`} title={lesson.title} sub={`Action outcome: ${lesson.single_action_outcome}`} />
        <div style={{ display: 'grid', gridTemplateColumns: notes.timing ? '1fr 1fr' : '1fr', gap: '0 12px' }}>
          {notes.learning_objective && <Box label="Objective"><p style={text}>{notes.learning_objective}</p></Box>}
          {notes.timing && <Box label="Timing"><p style={text}>{notes.timing}</p></Box>}
        </div>
        <Box label="Statutory coverage (for your records and the subject lead)">
          <p style={text}>{(lesson.statutory_hooks ?? []).join(' · ')}</p>
          <p style={{ ...text, marginTop: '4px' }}>Education for a Connected World strand{(lesson.efcw_strands ?? []).length === 1 ? '' : 's'}: {(lesson.efcw_strands ?? []).join(', ')} · Evidence anchor: {lesson.evidence_anchor}</p>
        </Box>
        {notes.misconceptions && notes.misconceptions.length > 0 && (
          <Box label="Misconceptions to expect">
            {notes.misconceptions.map((m, i) => (
              <p key={i} style={{ ...text, display: 'flex', gap: '8px', marginTop: i ? '4px' : 0 }}><span style={{ color: friend.accent, fontWeight: 900 }}>•</span><span>{m}</span></p>
            ))}
          </Box>
        )}
        {notes.differentiation && (
          <Box label="Differentiation">
            {notes.differentiation.support && <p style={text}><strong>Support:</strong> {notes.differentiation.support}</p>}
            {notes.differentiation.stretch && <p style={{ ...text, marginTop: '4px' }}><strong>Stretch:</strong> {notes.differentiation.stretch}</p>}
          </Box>
        )}
        {dsl.note && <Box label="Safeguarding note" style={{ borderColor: 'var(--coral)' }}><p style={text}>{dsl.note}</p></Box>}
        {notes.paper_fallback && <Box label="No screen? No problem"><p style={text}>{notes.paper_fallback}</p></Box>}
      </PrintSheet>

      {/* Sheet 2: the tool bookmarks, four to a sheet. */}
      <PrintSheet footer={pupilFooter}>
        <FriendStrip friend={friend} register={reg} eyebrow="Photocopy per 4 pupils · cut along the lines · bookmark" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="gc-avoid-break" style={{ border: '1.5px dashed var(--ink)', borderRadius: '14px', padding: '16px 16px 14px', minHeight: '112mm', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FriendArt friend={friend} mood="thinking" size={reg.markMm} />
                <div style={{ ...mono, color: friend.ink }}>{tool.heading}</div>
              </div>
              <div style={{ borderTop: `2px solid ${friend.accent}` }} />
              {tool.lines.map((line, j) => (
                <p key={j} style={{ ...text, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: young ? 'var(--text-lg)' : 'var(--text-md)', lineHeight: 1.3 }}>{line}</p>
              ))}
              <p style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', marginTop: 'auto' }}>{tool.strapline}</p>
            </div>
          ))}
        </div>
      </PrintSheet>

      {/* Sheet 3: the worksheet, photocopy per pupil. */}
      <PrintSheet footer={pupilFooter}>
        <FriendHeader friend={friend} register={reg} mood="thinking" eyebrow={`${eyebrow} · Worksheet`} title={worksheetTitle} sub={worksheetDirections} nameLine="Name" />
        {items.map(it => (
          <Box key={it.n} radius={reg.radius}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Number n={it.n} friend={friend} size={young ? 34 : 28} />
              <p style={{ ...text, fontSize: reg.body, fontWeight: 700, paddingTop: '4px' }}>{it.item}</p>
            </div>
            <TickRow options={verdictOptions} friend={friend} big={young} />
            <div style={{ ...mono, marginTop: '10px' }}>{it.stem ?? 'Because'}</div>
            <WriteLines n={young ? 2 : 1} height={reg.lineHeight} />
          </Box>
        ))}
      </PrintSheet>

      {/* Sheet 4: the answer key. Teacher copy, one only, never photocopied.
          The teaching point matters more than the verdict here: knowing item 4
          is "ask a grown up" is almost useless on its own; knowing WHY is the
          whole lesson, and it is the sentence to say out loud. */}
      {hasAnswerKey(items) && (
        <PrintSheet footer={teacherFooter}>
          <FriendStrip friend={friend} register={reg} eyebrow="Teacher copy · one only · do not photocopy" />
          <h2 style={{ ...display, fontSize: 'var(--text-xl)', marginBottom: '6px' }}>Answer key: {worksheetTitle}</h2>
          <p style={{ ...text, color: 'var(--ink-soft)' }}>
            Keep this beside you while they work. The line under each answer is what to say
            when a child has it the other way round, and it is worth saying even when they
            have it right.
          </p>
          {items.map(it => (
            <Box key={it.n}>
              <p style={{ ...text, fontWeight: 700 }}>{it.n}. {it.item}</p>
              {it.expected_verdict && <p style={{ ...text, marginTop: '6px', fontWeight: 800, color: 'var(--green-dark)' }}>Answer: {it.expected_verdict}</p>}
              {it.teaching_point && <p style={{ ...text, marginTop: '4px' }}>{it.teaching_point}</p>}
            </Box>
          ))}
        </PrintSheet>
      )}

      {/* Sheet 5: the start and exit cards, photocopy per pupil, cut in half. */}
      <PrintSheet footer={pupilFooter}>
        <FriendStrip friend={friend} register={reg} eyebrow="Photocopy per pupil · cut in half · start and end of lesson" />
        {retrieval && (
          <div className="gc-avoid-break" style={{ border: '1.5px dashed var(--ink)', borderRadius: '14px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <FriendArt friend={friend} mood="thinking" size={reg.markMm} />
              <div style={{ ...mono, color: friend.ink }}>Start card · remember last lesson</div>
            </div>
            <p style={{ ...text, fontSize: reg.body, fontWeight: 700 }}>{retrieval.question}</p>
            <div style={{ marginTop: '8px' }}>
              {(retrieval.options ?? []).map((o, i) => (
                <p key={i} style={{ ...text, fontSize: reg.body, display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ width: '16px', height: '16px', border: '1.5px solid var(--ink)', borderRadius: '4px', flexShrink: 0 }} />
                  <span><strong>{String.fromCharCode(65 + i)}.</strong> {o.text}</span>
                </p>
              ))}
            </div>
          </div>
        )}
        <CutLine />
        <div className="gc-avoid-break" style={{ border: '1.5px dashed var(--ink)', borderRadius: '14px', padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <FriendArt friend={friend} mood="happy" size={reg.markMm} />
            <div style={{ ...mono, color: friend.ink }}>Exit card · what I know now</div>
          </div>
          {exitChecks.map((c, idx) => (
            <div key={idx} style={{ marginTop: idx ? '10px' : 0 }}>
              <p style={{ ...text, fontSize: reg.body, fontWeight: 700 }}>{c.question}</p>
              {(c.options ?? []).map((o, i) => (
                <p key={i} style={{ ...text, fontSize: reg.body, display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                  <span style={{ width: '16px', height: '16px', border: '1.5px solid var(--ink)', borderRadius: '4px', flexShrink: 0 }} />
                  <span><strong>{String.fromCharCode(65 + i)}.</strong> {o.text}</span>
                </p>
              ))}
            </div>
          ))}
          <p style={{ ...text, fontSize: reg.body, fontWeight: 700, marginTop: '12px' }}>{commitmentStem}</p>
          <WriteLines n={young ? 2 : 1} height={reg.lineHeight} />
        </div>
      </PrintSheet>

      {/* Sheet 6: the parent note. Photocopy per pupil, goes home. */}
      <PrintSheet footer={`${lesson.title} · goes home`} last>
        <FriendHeader friend={friend} register={reg} mood="wave" eyebrow={`Goes home · ${eyebrow} · with ${friend.name}`} title={parent.headline ?? 'What we taught today'} />
        {parent.taught && <p style={{ ...text, fontSize: 'var(--text-md)' }}>{parent.taught}</p>}
        {/* The module's own tool, from the same fallback chain as sheet one. */}
        <Box label={tool.heading} friend={friend} tint>
          {tool.lines.map((l, i) => (
            <p key={i} style={{ ...text, fontWeight: 700, marginTop: i ? '2px' : 0 }}>{/^\d/.test(l) ? '' : `${i + 1}. `}{l}</p>
          ))}
        </Box>
        {parent.try_this && <Box label="Try this at home"><p style={text}>{parent.try_this}</p></Box>}
        {parent.family_question && <Box label="Dinner table question"><p style={{ ...text, fontWeight: 700 }}>{parent.family_question}</p></Box>}
        {/* Both halves of the school to home bridge, in reading order: the
            passport line says what the family is part of, the home code lets
            them act on it. */}
        {(parent.passport || page) && (
          <Box label="The passport" friend={friend}>
            {parent.passport && <p style={text}>{parent.passport}</p>}
            {page && area && <p style={{ ...text, marginTop: parent.passport ? '4px' : 0 }}>Today filled the <strong>{page.page}</strong> page: <strong>{AREAS[area].name}</strong>.</p>}
          </Box>
        )}
        {homeCode && (
          <div className="gc-avoid-break" style={{ display: 'flex', alignItems: 'center', gap: '16px', border: `2px solid ${friend.accent}`, borderRadius: '16px', padding: '12px 16px', marginTop: '10px' }}>
            <div style={{ flex: '1 1 auto' }}>
              <div style={{ ...mono, color: friend.ink, marginBottom: '4px' }}>On the Guided Childhood app at home?</div>
              <p style={text}>Enter this code on the Lessons page and your child&rsquo;s passport records what we covered today.</p>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-xl)', letterSpacing: '0.14em', color: 'var(--ink)', background: friend.soft, border: `1.5px solid ${friend.accent}`, borderRadius: '12px', padding: '10px 14px', whiteSpace: 'nowrap' }}>{homeCode}</div>
          </div>
        )}
        <p style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-light)', marginTop: '14px' }}>Guided Childhood Schools · no login needed, nothing to sign up for. This note is yours.</p>
        <PrintBrandFooter />
      </PrintSheet>
    </main>
  )
}
