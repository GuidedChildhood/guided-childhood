import Link from 'next/link'
import ScriptDepth from '@/components/scripts/ScriptDepth'
import ScriptReader from '@/components/scripts/ScriptReader'
import RehearseWithDigi, { type RehearseFixture } from '@/components/scripts/RehearseWithDigi'
import ScriptHelpPrompt from '@/components/scripts/ScriptHelpPrompt'
import ScriptStatusButtons from '@/components/scripts/ScriptStatusButtons'
import MarkReadOnEnd from '@/components/scripts/MarkReadOnEnd'
import { card, cardPad, eyebrow } from '@/components/scripts/card-system'

// The whole script detail page as one presentational view: the page route
// fetches the data, this file owns how it looks. One card system, one spacing
// rhythm (24px between sections, 12px inside a group), everything on one grid.
// Extracted so the fixture page can render the exact same layout without a
// database. Presentation only, no data logic lives here.

const STAGE_META: Record<string, { label: string; color: string; bg: string }> = {
  foundation:  { label: 'Foundation · Ages 4 to 7',  color: 'var(--ink)', bg: 'var(--stage-1)' },
  builder:     { label: 'Builder · Ages 8 to 10',    color: 'var(--ink)', bg: 'var(--stage-2)' },
  explorer:    { label: 'Explorer · Ages 11 to 13',  color: 'var(--ink)', bg: 'var(--stage-3)' },
  shaper:      { label: 'Shaper · Ages 13 to 15',    color: 'var(--ink)', bg: 'var(--stage-4)' },
  independent: { label: 'Independent · Ages 16 and above', color: 'var(--ink)', bg: 'var(--stage-5)' },
}

export type ScriptDetailData = {
  stage_id: string
  title: string
  situation: string
  say_this: string
  not_this: string
  why_it_works: string
  tonight: string
  is_free: boolean
}

type NavScript = { sort_order: number; title: string } | null

type Props = {
  script: ScriptDetailData
  sortOrder: number
  showBanNote: boolean
  voiceUrl: string | null
  isPaid: boolean
  childName: string | null
  childPhone: string | null
  childId: string | null
  childHasApp: boolean
  workedRating: 'yes' | 'somewhat' | 'no' | null
  scriptStatus: 'opened' | 'read' | 'used' | 'not_needed'
  /** Arrived from the road or the passport, so the exits point back there. */
  backToPathway?: boolean
  stageSlug?: string | null
  /**
   * The ?child= this page was opened with, threaded into every script link so
   * the choice survives Previous, Next and the deck. The read tick and the
   * status buttons both resolve the child from the URL they are on, so a link
   * that drops the param quietly hands the tick to the primary child.
   */
  childIdParam?: string | null
  prevScript: NavScript
  nextScript: NavScript
  depthInitial: { ifTheyPushBack?: string; checkBack?: string; forYourChild?: string }
  rehearseFixture?: RehearseFixture
}

const chip: React.CSSProperties = {
  ...eyebrow,
  fontSize: 'var(--text-sm)',
  padding: '5px 11px',
  borderRadius: 100,
  display: 'inline-flex',
  alignItems: 'center',
}

export default function ScriptDetailView({
  script, sortOrder, showBanNote, voiceUrl, isPaid,
  childName, childPhone, childId, childHasApp, workedRating, scriptStatus,
  backToPathway = false, stageSlug = null, childIdParam = null,
  prevScript, nextScript, depthInitial, rehearseFixture,
}: Props) {
  const stageMeta = STAGE_META[script.stage_id] ?? STAGE_META.foundation
  const withChild = (href: string) =>
    childIdParam ? `${href}${href.includes('?') ? '&' : '?'}child=${childIdParam}` : href

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 20px 56px' }}>

      {/* Back and the deck door, one quiet row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '8px' }}>
        {/* Back to where they came from. A parent who followed their own
            pathway here and is handed "All scripts" has been quietly moved to
            a different place from the one they were in. */}
        <Link
          href={backToPathway ? '/dashboard/pathway' : withChild('/dashboard/scripts')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
        >
          {backToPathway ? '← Back to the pathway' : '← All scripts'}
        </Link>
        <Link
          href={withChild(`/dashboard/scripts/${sortOrder}/deck`)}
          className="btn btn-green"
          style={{ padding: '8px 16px', fontSize: 'var(--text-sm)' }}
        >
          Try as deck
        </Link>
      </div>

      {/* Title block, given room to breathe. Chips share one baseline, then
          the title, the situation, and a single quiet read line. */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <span style={{ ...chip, color: stageMeta.color, background: stageMeta.bg }}>
            {stageMeta.label}
          </span>
          {script.is_free && (
            <span style={{ ...chip, color: 'var(--terracotta-dark)', background: 'var(--terracotta-lt)' }}>
              Free
            </span>
          )}
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(1.9rem, 6vw, 2.6rem)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '14px' }}>
          {script.title}
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.65, maxWidth: '62ch', margin: 0 }}>
          {script.situation}
        </p>

        {/* Marked as read: a small tick and one line, never a grey slab */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginTop: '20px' }}>
          <span aria-hidden style={{
            width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
            background: 'var(--tint-sage)', color: 'var(--ink)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-sm)',
          }}>✓</span>
          <span style={{ fontSize: 'var(--text-md)', color: 'var(--ink-muted)', lineHeight: 1.45 }}>
            Marked as read just by opening it. It counts on your path today.
          </span>
        </div>

        {/* DiGi picks the likely script for tonight, but the parent knows the
            evening best, so the way to search for a better fitting one is always
            one tap away, right here on the pick. */}
        <div style={{ marginTop: '16px' }}>
          <Link href={withChild('/dashboard/scripts')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--terracotta-dark)', textDecoration: 'none' }}>
            Not the right words for tonight? Search all scripts →
          </Link>
        </div>
      </div>

      {/* Everything below sits on one grid with one rhythm */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Ban world note */}
        {showBanNote && (
          <div style={{ ...card, padding: cardPad }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: '8px' }}>
              UK social media ban context
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>
              This script is updated for the UK ban on social media for under 16s. The approach stays the same: relational, not restrictive. The law is the start of the conversation, not the end of it.
            </p>
          </div>
        )}

        {/* The four core steps, led by the say this hero */}
        <ScriptReader
          sayThis={script.say_this}
          notThis={script.not_this}
          whyItWorks={script.why_it_works}
          tonight={script.tonight}
          stageId={script.stage_id}
          voiceUrl={voiceUrl}
        />

        {/* Rehearse the words with DiGi before the real conversation */}
        <RehearseWithDigi
          sortOrder={sortOrder}
          scriptTitle={script.title}
          situation={script.situation}
          sayThis={script.say_this}
          notThis={script.not_this}
          childName={childName}
          isPaid={isPaid}
          fixture={rehearseFixture}
        />

        {/* The deeper half: push back, check back, and the note for the child */}
        <ScriptDepth
          sortOrder={sortOrder}
          initial={depthInitial}
          childName={childName}
          childPhone={childPhone}
          childId={childId}
          childHasApp={childHasApp}
          stageId={script.stage_id}
        />

        {/* THE END OF THE SCRIPT, and the point at which reading it counts.
            Justin, twice: once read through it needs to update the pathway. It
            sits here rather than at the very bottom of the page on purpose: the
            words end here, and everything below is what to do next. */}
        <MarkReadOnEnd sortOrder={sortOrder} settled={scriptStatus === 'used' || scriptStatus === 'not_needed'} />

        {/* Did it help? DiGi asks, and the answer shapes what it suggests next. */}
        <ScriptHelpPrompt sortOrder={sortOrder} initialWorked={workedRating} />
        <ScriptStatusButtons sortOrder={sortOrder} status={scriptStatus} />

        {/* DiGi CTA */}
        <div style={{ ...card, padding: cardPad, display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ ...eyebrow, color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
              DiGi
            </div>
            <p style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: 0 }}>
              Need help adapting this for your situation? Ask DiGi.
            </p>
          </div>
          <Link
            href={`/dashboard/digi?q=${encodeURIComponent(`I need help with the script: ${script.title}. My situation: `)}`}
            className="btn btn-gold"
            style={{ flexShrink: 0, padding: '11px 20px', fontSize: 'var(--text-base)' }}
          >
            Ask DiGi about this
          </Link>
        </div>

        {/* Turn the words into something that lasts: a shared family agreement */}
        <Link
          href="/dashboard/agreement"
          style={{ ...card, display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none', padding: cardPad }}
        >
          <span aria-hidden style={{ fontSize: 'var(--text-xl)', flexShrink: 0 }}>🤝</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)', marginBottom: '3px' }}>
              Make it a family agreement
            </div>
            <div style={{ fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
              Turn this conversation into a simple agreement you both sign, so the rule holds after the moment passes.
            </div>
          </div>
          <span aria-hidden style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)', flexShrink: 0 }}>→</span>
        </Link>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {prevScript ? (
            <Link
              href={withChild(`/dashboard/scripts/${prevScript.sort_order}`)}
              style={{ ...card, borderRadius: 16, flex: 1, padding: '14px 16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}
            >
              <span style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>← Previous</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prevScript.title}</span>
            </Link>
          ) : (
            <Link
              href={withChild('/dashboard/scripts')}
              style={{ ...card, borderRadius: 16, flex: 1, padding: '14px 16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '5px', minWidth: 0 }}
            >
              <span style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)' }}>All topics</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)' }}>Back to scripts</span>
            </Link>
          )}

          {nextScript && (
            <Link
              href={withChild(`/dashboard/scripts/${nextScript.sort_order}`)}
              style={{ ...card, borderRadius: 16, flex: 1, padding: '14px 16px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '5px', textAlign: 'right', minWidth: 0 }}
            >
              <span style={{ ...eyebrow, fontSize: 'var(--text-sm)', color: 'var(--terracotta-dark)' }}>Next →</span>
              <span style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{nextScript.title}</span>
            </Link>
          )}
        </div>

        {/* The one tap way back to the daily path after doing this step, so a
            parent sent here from home always has a clear return to the next
            thing rather than reaching for the browser back button. */}
        {/* Two exits when they came from the road, because after reading one
            script the useful next move is either the NEXT script for this
            stage or the road itself, and neither is the daily home page. */}
        {backToPathway && stageSlug && (
          <Link
            href={withChild(`/dashboard/scripts/next?stage=${stageSlug}`)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: '#fff', color: 'var(--ink)', textDecoration: 'none',
              border: '1.5px solid var(--border)', borderRadius: 16, padding: '13px 20px',
              fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
              marginBottom: 10,
            }}
          >
            The next one for this stage →
          </Link>
        )}
        <Link
          href={backToPathway ? '/dashboard/pathway' : '/dashboard'}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'var(--terracotta)', color: 'var(--ink)', textDecoration: 'none',
            borderRadius: 16, padding: '15px 20px',
            fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)',
            boxShadow: '0 5px 0 var(--terracotta-dark)',
          }}
        >
          {backToPathway ? 'Back to your pathway →' : 'Continue your pathway →'}
        </Link>

      </div>
    </div>
  )
}
