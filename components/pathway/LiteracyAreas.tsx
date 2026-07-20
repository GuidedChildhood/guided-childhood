import Link from 'next/link'
import { READINESS } from '@/lib/content/readiness'

// The whole promise in four things a parent can hold in their head, read
// like a good school report: clear, never shaming. Each area gets a quiet
// status tag (green On track, warm amber One thing to do, grey Comes at
// age N), the real numbers big and bold, a slim progress bar where a
// count exists, and when there is something to do, one butter button that
// goes exactly where the fix happens. Age honest throughout: a five year
// old is not doing AI literacy yet, and the row says when it comes and
// why, grounded in the research, rather than showing a fake bar.

const STAGE_LABELS = ['Foundation', 'Builder', 'Explorer', 'Shaper', 'Independent'] as const

type Area = { key: string; icon: string; name: string; startStage: number; blurb: string; comesWhy: string; comesAge: string }

const AREAS: Area[] = [
  {
    key: 'safe', icon: '🛡️', name: 'Safe online', startStage: 1,
    blurb: 'Device settings set, worries worked through, and DiGi asking gently along the way.',
    comesWhy: '', comesAge: '4',
  },
  {
    key: 'balance', icon: '⚖️', name: 'Healthy balance', startStage: 1,
    blurb: 'Real world jobs against screen time, held in a good balance.',
    comesWhy: '', comesAge: '4',
  },
  {
    key: 'ai', icon: '🤖', name: 'AI and chatbots', startStage: 3,
    blurb: 'What AI is, how chatbots work, and how to tell what is real.',
    comesWhy: 'Orben and Odgers place the algorithm conversation in the 11 to 13 window, when abstract thinking can hold it.',
    comesAge: '11',
  },
  {
    key: 'social', icon: '💬', name: 'Social media ready', startStage: 3,
    blurb: 'The judgement for the platforms, built in good time before 16.',
    comesWhy: 'Built before any account exists, so the skills are there first. From 13, DiGi asks what they are actually seeing.',
    comesAge: '11',
  },
]

export type { AreaStatus } from '@/lib/pathway/literacy-status'
import type { AreaStatus } from '@/lib/pathway/literacy-status'

// The status tag, the calm school report way: a small tinted chip in the
// GOV.UK style, never an alarm. A tick lives on green only, and there is
// no cross glyph anywhere on this surface.
type ChipTone = 'green' | 'amber' | 'grey'

const CHIP_LOOKS: Record<ChipTone, { bg: string; color: string; border: string }> = {
  green: { bg: 'var(--tint-green)', color: 'var(--retro-green-dark)', border: 'var(--retro-green)' },
  amber: { bg: 'var(--terracotta-lt)', color: 'var(--stage-1-text)', border: 'var(--terracotta)' },
  grey: { bg: 'var(--cream)', color: 'var(--ink-muted)', border: 'var(--border)' },
}

function StatusChip({ tone, children }: { tone: ChipTone; children: React.ReactNode }) {
  const look = CHIP_LOOKS[tone]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
      background: look.bg, color: look.color, border: `1px solid ${look.border}`,
      borderRadius: 6, padding: '4px 10px',
      fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap',
      lineHeight: 1.3,
    }}>
      {tone === 'green' && <span aria-hidden style={{ fontSize: '11px', lineHeight: 1 }}>✓</span>}
      {children}
    </span>
  )
}

// What genuinely moves each reading, in plain words, mirroring exactly
// what getLiteracyStatuses computes. AI has no weekly DiGi question in
// the reading, so its line stays lessons only, never a claimed input.
const MOVES: Record<string, string> = {
  safe: 'Device guides done, worries worked through with DiGi, and the safe online lessons passed.',
  balance: 'Jobs earn stars, screen runs through the timer, balance lessons passed.',
  ai: 'The stage lessons for this age, passed one by one.',
  social: "The stage lessons passed, and from 13 DiGi's weekly question.",
}

// A count like "3 of 18 device guides set" becomes a slim bar toward on
// track, so an early number reads as a journey started, never a wall of
// red. No count in the value means no bar, the numbers speak alone.
function progressFrom(value?: string): { done: number; total: number } | null {
  const m = value?.match(/(\d+) of (\d+)/)
  if (!m) return null
  const total = Number(m[2])
  if (total <= 0) return null
  return { done: Math.min(Number(m[1]), total), total }
}

// The balance reading carries earned and used minutes instead of a
// count, so its bar shows how much of the earned time the screen has
// used: earning jobs grows the pot and the bar eases back, screen time
// through the timer fills it. Both are the real inputs of the reading.
function balanceFrom(value?: string): { done: number; total: number } | null {
  const earned = value?.match(/(\d+) min earned/)
  const used = value?.match(/(\d+) min used/)
  if (!earned || !used) return null
  const e = Number(earned[1])
  if (e <= 0) return null
  return { done: Math.min(Number(used[1]), e), total: e }
}

function ProgressBar({ done, total, tone }: { done: number; total: number; tone: ChipTone }) {
  const pct = Math.round((done / total) * 100)
  return (
    <span
      role="progressbar"
      aria-valuenow={done}
      aria-valuemin={0}
      aria-valuemax={total}
      style={{ display: 'block', height: 6, borderRadius: 100, background: 'var(--border)', marginTop: 8, overflow: 'hidden' }}
    >
      <span style={{
        display: 'block', height: '100%', borderRadius: 100,
        width: `${pct}%`, minWidth: done > 0 ? 8 : 0,
        background: tone === 'green' ? 'var(--retro-green)' : 'var(--terracotta)',
      }} />
    </span>
  )
}

export default function LiteracyAreas({ stageId, childName, statuses = {} }: {
  stageId: number
  childName?: string
  statuses?: Partial<Record<string, AreaStatus>>
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  const current = Math.min(5, Math.max(1, stageId))

  return (
    <div style={{ padding: '0 20px', maxWidth: '720px', margin: '0 auto 20px' }}>
      <div style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: '20px', padding: '22px 20px 8px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 6px' }}>
          The four things we build
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 12px', maxWidth: '620px' }}>
          Everything {kid} does adds up to these four, ready by 16. Green means on track. Amber comes with the one next step, never a mark against anyone.
        </p>
        <Link href="/dashboard/pathway" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14, background: 'var(--terracotta-lt)', border: '1px solid var(--terracotta)', borderRadius: 100, padding: '5px 12px', textDecoration: 'none' }}>
          <span aria-hidden style={{ fontSize: 13 }}>🪪</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, color: 'var(--terracotta-dark)' }}>
            These four earn the {READINESS[current - 1].stamp} stamp on the road to 16 →
          </span>
        </Link>

        {AREAS.map(area => {
          const active = current >= area.startStage
          const live = active ? statuses[area.key] : undefined

          // Not this age yet: say when it comes and why, never a fake bar.
          if (!active) {
            return (
              <div key={area.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 0', borderTop: '1px solid var(--border)' }}>
                <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', filter: 'grayscale(0.6) opacity(0.7)' }}>{area.icon}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink-soft)', lineHeight: 1.25 }}>
                      {area.name}
                    </span>
                    <StatusChip tone="grey">Comes at age {area.comesAge}</StatusChip>
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: 6 }}>
                    {area.comesWhy} It starts in the {STAGE_LABELS[area.startStage - 1]} stage.
                  </span>
                </span>
              </div>
            )
          }

          const onTrack = (live?.tone ?? 'green') === 'green'
          const chipTone: ChipTone = onTrack ? 'green' : 'amber'
          const bar = progressFrom(live?.value) ?? balanceFrom(live?.value)

          const inner = (
            <>
              <span style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '13px', background: 'var(--tint-sage)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{area.icon}</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '18px', color: 'var(--ink)', lineHeight: 1.25 }}>
                    {area.name}
                  </span>
                  <StatusChip tone={chipTone}>{onTrack ? 'On track' : 'One thing to do'}</StatusChip>
                </span>
                {/* The proof, big and bold: the real numbers behind the reading */}
                {live?.value && (
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '20px', color: 'var(--ink)', lineHeight: 1.2, marginTop: 7 }}>
                    {live.value}
                  </span>
                )}
                {bar && <ProgressBar done={bar.done} total={bar.total} tone={chipTone} />}
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '15.5px', color: 'var(--ink-soft)', lineHeight: 1.6, marginTop: 7 }}>
                  {live?.note ?? area.blurb}
                </span>
                {/* The day to day wiring, quiet and true: what a parent
                    does that actually moves this reading. */}
                <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-muted)', lineHeight: 1.6, marginTop: 6 }}>
                  <span style={{ fontWeight: 700 }}>What moves this:</span> {MOVES[area.key]}
                </span>
                {/* One next step, the butter button, straight to where the
                    fix happens. Next step language, never failure. */}
                {!onTrack && live?.improve && (
                  <Link href={live.href ?? '/dashboard/lessons'} style={{
                    display: 'inline-flex', alignItems: 'flex-start', gap: 8, marginTop: 12,
                    background: 'var(--terracotta)', color: 'var(--ink)',
                    borderRadius: '12px', padding: '11px 16px', textDecoration: 'none',
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '14px',
                    lineHeight: 1.4, boxShadow: '0 3px 0 var(--terracotta-dark)',
                  }}>
                    <span>{live.improve}</span>
                    <span aria-hidden style={{ flexShrink: 0 }}>→</span>
                  </Link>
                )}
              </span>
            </>
          )

          // A green row is one quiet link to where this area lives. An
          // amber row keeps the navigation on its single action button.
          return onTrack ? (
            <Link
              key={area.key}
              href={live?.href ?? '/dashboard/lessons'}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, textDecoration: 'none', padding: '18px 0', borderTop: '1px solid var(--border)' }}
            >
              {inner}
            </Link>
          ) : (
            <div
              key={area.key}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '18px 0', borderTop: '1px solid var(--border)' }}
            >
              {inner}
            </div>
          )
        })}
      </div>
    </div>
  )
}
