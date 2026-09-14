import { db as supabase } from '@/lib/supabase/server-db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'
import { parseSlides, type ObjectiveSlide, type KeywordsSlide } from '@gc/shared/lesson-slides'
import { CURRICULUM as MODULE_MANIFEST } from '@gc/shared/schools-curriculum'
import { friendFor, printRegister, mono, display, text, FriendArt, FriendHeader, PrintSheet, Box, WriteLines } from '@/components/print/kit'

// The tab names the module, so a teacher with eight tabs open can find this
// one. Read from the manifest rather than the row: no second database read.
export async function generateMetadata({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const title = MODULE_MANIFEST.find(m => m.moduleId === moduleId)?.title
  return { title: title ? `Knowledge organiser: ${title}` : 'Knowledge organiser: Module' }
}

// THE PUPIL KNOWLEDGE ORGANISER, ON THE PRINT KIT (14 September 2026).
//
// One page per module, the Jigsaw PKO equivalent but cleaner: what I am
// learning, my words, the tool to learn by heart, and the before and after
// reflection so pupils see their own learning move. Since 14 September the
// friend thinks at the top of the page in colour, the words sit in cards a
// child can find again, and the tool is in the friend's tint, because it is
// the one block that goes in the book and comes out again next term.

type TeacherNotes = {
  keywords?: { word: string; definition: string }[]
  tool?: { heading?: string; lines?: string[]; strapline?: string }
}

export const revalidate = 3600

export default async function KnowledgeOrganiserPage({ params }: { params: Promise<{ module: string }> }) {
  const { module: moduleId } = await params
  const { data: lesson } = await supabase
    .from('school_lessons')
    .select('module_id, title, key_stage, year_band, single_action_outcome, character_cast, slides, teacher_notes')
    .eq('module_id', moduleId)
    .maybeSingle()
  if (!lesson) notFound()

  const slides = parseSlides(lesson.slides) ?? []
  const notes = (lesson.teacher_notes ?? {}) as TeacherNotes
  const objective = slides.find((s): s is ObjectiveSlide => s.type === 'objective')
  // An EYFS objective slide carries no gains list (found on the 14 September
  // render); the box simply does not print rather than crashing the sheet.
  const gains = objective?.gains ?? []
  const keywordSlide = slides.find((s): s is KeywordsSlide => s.type === 'keywords')
  const words = notes.keywords ?? keywordSlide?.words.map(w => ({ word: w.word, definition: w.meaning })) ?? []
  const tool = notes.tool ?? {
    heading: 'The three checks',
    lines: ['1. Who made this, and how do they know?', '2. What do other places say?', '3. How is it trying to make me feel?'],
    strapline: 'Three checks, under a minute.',
  }
  const friend = friendFor((lesson as { character_cast?: string | null }).character_cast, lesson.key_stage)
  const reg = printRegister(lesson.key_stage)
  const young = reg.key === 'bouncy'

  return (
    <main style={{ maxWidth: '740px', margin: '0 auto', background: '#fff', color: 'var(--ink)', padding: '0 8px 40px' }}>
      <div className="no-print" style={{ padding: '20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <Link href="/print" style={{ ...mono, textDecoration: 'none' }}>← Print room</Link>
        <PrintButton label="Print, one per pupil" />
      </div>
      <PrintSheet footer={`${lesson.title} · knowledge organiser · keep this in your book`} last>
        <FriendHeader friend={friend} register={reg} mood="thinking" eyebrow={`${lesson.key_stage} · ${lesson.year_band} · My knowledge organiser`} title={lesson.title} nameLine="Name and class" />

        <Box label="By the end I can say" friend={friend} tint radius={reg.radius}>
          <p style={{ ...text, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: young ? 'var(--text-lg)' : 'var(--text-md)' }}>&ldquo;{lesson.single_action_outcome}&rdquo;</p>
        </Box>

        <div style={{ display: 'grid', gridTemplateColumns: gains.length > 0 ? '1fr 1fr' : '1fr', gap: '0 12px' }}>
          <Box label="Before we start · what do I already think?" radius={reg.radius}>
            <WriteLines n={young ? 2 : 3} height={reg.lineHeight - 4} />
          </Box>
          {gains.length > 0 && (
            <Box label="What I am learning to do" radius={reg.radius}>
              {gains.map((g, i) => (
                <p key={i} style={{ ...text, fontSize: reg.body, display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: i ? '6px' : 0 }}>
                  <span style={{ width: '16px', height: '16px', border: '1.5px solid var(--ink)', borderRadius: '4px', flexShrink: 0, marginTop: '4px' }} />
                  <span>{g}</span>
                </p>
              ))}
            </Box>
          )}
        </div>

        {words.length > 0 && (
          <Box label="My words for this topic" radius={reg.radius}>
            <div style={{ display: 'grid', gridTemplateColumns: words.length > 2 && !young ? '1fr 1fr' : '1fr', gap: '8px 14px' }}>
              {words.map(w => (
                <div key={w.word} style={{ borderLeft: `3px solid ${friend.accent}`, paddingLeft: '10px' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: young ? 'var(--text-lg)' : 'var(--text-md)', color: friend.ink }}>{w.word}</div>
                  <p style={{ ...text, fontSize: young ? reg.body : 'var(--text-sm)' }}>{w.definition}</p>
                </div>
              ))}
            </div>
          </Box>
        )}

        <div className="gc-avoid-break" style={{ display: 'flex', gap: '16px', alignItems: 'center', background: friend.soft, border: `2px solid ${friend.accent}`, borderRadius: `${reg.radius}px`, padding: '14px 18px', marginTop: '10px' }}>
          <FriendArt friend={friend} mood="happy" size={reg.markMm * 1.6} />
          <div style={{ flex: '1 1 auto' }}>
            <div style={{ ...mono, color: friend.ink, marginBottom: '6px' }}>{tool.heading} · learn this by heart</div>
            {(tool.lines ?? []).map((line, i) => (
              <p key={i} style={{ ...text, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: young ? 'var(--text-lg)' : 'var(--text-md)', lineHeight: 1.3, marginTop: i ? '2px' : 0 }}>{line}</p>
            ))}
            {tool.strapline && <p style={{ ...text, fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', marginTop: '6px' }}>{tool.strapline}</p>}
          </div>
        </div>

        <Box label="After the lesson · what changed in my thinking?" radius={reg.radius}>
          <WriteLines n={young ? 2 : 3} height={reg.lineHeight - 4} />
          <p style={{ ...text, fontSize: reg.body, fontWeight: 700, marginTop: '10px' }}>One place I will use this in real life:</p>
          <WriteLines n={1} height={reg.lineHeight - 4} />
        </Box>
      </PrintSheet>
    </main>
  )
}
