import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { parseSlides, visibleSlides } from '@gc/shared/lesson-slides'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'
import { standaloneTitle } from '@/lib/taster'
import { PrintBrandFooter } from '@gc/shared/components/PrintBrand'
import PrintButton from '@/components/PrintButton'
import { worksheetItems } from '@/lib/worksheet'
import { startedReason } from '@/lib/booklet-level'
import { friendFor, printRegister, mono, display, text, FriendArt, PrintSheet, Box } from '@/components/print/kit'

export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title ?? standaloneTitle(moduleId)
  return { title: title ? `Support mat: ${title}` : 'Support mat: Module' }
}

// THE SUPPORT MAT (23 November 2026).
//
// One sheet on the table, one for every two pupils, taken from the French
// scheme's support mats: the lesson's key words with what they mean, the
// verdicts to choose between, the sentence starters, and the words to say.
// It sits beside any of the three booklets (lib/booklet-level.ts) and costs a
// pupil nothing to use, so the help is on the table rather than in a queue for
// the adult. Generated from the lesson row, so every module has one.

type TeacherNotes = {
  keywords?: { word?: string; definition?: string }[]
  worksheet?: { verdict_options?: string[] }
  worksheet_items?: unknown
  commitment_stem?: string
  tool?: { heading?: string }
}

export const revalidate = 3600

export default async function SupportMatPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const slides = visibleSlides(parseSlides(lesson.slides) ?? [], 'classroom').slides
  const quote = slides.find(s => s.type === 'quote') as { text: string } | undefined
  const sayIt = quote?.text?.trim() || notes.tool?.heading || null
  const keywords = (notes.keywords ?? []).filter(k => k.word && k.definition).slice(0, 6)
  const verdicts = notes.worksheet?.verdict_options ?? []
  // The starters: each different stem the cards use, then the reason starter.
  const starters = [...new Set([...worksheetItems(notes).map(startedReason), 'I think this because', 'I would tell a grown up if'])].slice(0, 4)
  const friend = friendFor(lesson.character_cast, lesson.key_stage)
  const reg = printRegister(lesson.key_stage)

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: 'var(--white)' }}>
      <div className="no-print" style={{ padding: '20px 8px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <span style={mono}>Support mat: one for every two pupils. Laminate it and use it all term</span>
        <PrintButton label="Print the support mat" />
      </div>
      <p className="no-print" style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', padding: '8px 8px 0' }}>
        Goes with any of the three booklets: <Link href={`/print/${lesson.module_id}/booklet`}>Expected</Link>, <Link href={`/print/${lesson.module_id}/booklet?level=adapted`}>Adapted</Link> or <Link href={`/print/${lesson.module_id}/booklet?level=inclusion`}>Inclusion</Link>.
      </p>

      <PrintSheet footer={`${lesson.title}, support mat`} last>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: `3px solid ${friend.accent}`, paddingBottom: '10px', marginBottom: '14px' }}>
          <FriendArt friend={friend} mood="thinking" size={reg.markMm * 1.6} />
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ ...mono, color: friend.ink }}>{lesson.key_stage}, {lesson.year_band}, support mat</div>
            <h1 style={{ ...display, fontSize: reg.title, margin: '4px 0 0' }}>{lesson.title}</h1>
          </div>
        </div>
        <p style={{ ...text, fontSize: reg.body, fontWeight: 700, marginBottom: '12px' }}>{lesson.single_action_outcome}</p>

        {keywords.length > 0 && (
          <Box label="Key words" friend={friend} radius={reg.radius}>
            {keywords.map(k => (
              <p key={k.word} style={{ ...text, fontSize: reg.body, marginBottom: '6px' }}><strong>{k.word}</strong>: {k.definition}</p>
            ))}
          </Box>
        )}
        {verdicts.length > 0 && (
          <Box label="The choices" friend={friend} tint radius={reg.radius}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{verdicts.map(w => <span key={w} style={{ ...text, fontSize: reg.body, fontWeight: 700, border: `1.5px solid ${friend.accent}`, borderRadius: '999px', padding: '2px 12px' }}>{w}</span>)}</div>
          </Box>
        )}
        <Box label="Sentence starters" radius={reg.radius}>
          {starters.map(st => <p key={st} style={{ ...text, fontSize: reg.body, marginBottom: '4px' }}>{st} ...</p>)}
        </Box>
        {sayIt && (
          <Box label={`Say it like ${friend.name}`} friend={friend} tint radius={reg.radius}>
            <p style={{ ...text, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: reg.body }}>{sayIt}</p>
          </Box>
        )}
        <div style={{ marginTop: '14px' }}><PrintBrandFooter /></div>
      </PrintSheet>
    </main>
  )
}
