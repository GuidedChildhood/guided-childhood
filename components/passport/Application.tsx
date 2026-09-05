import Link from 'next/link'
import type { ChecklistSection } from '@/components/pathway/PassportStamps'
import type { StageProgress } from '@/lib/pathway/progress'

// ═══ THE APPLICATION'S WORKING PARTS ════════════════════════════════════════
//
// The one next task rail and the four strand cards, from the approved mock
// (18 August). The Mercury skeleton band two: what to do right now, with
// exactly ONE task lit in butter, Duolingo style, never four equal choices.
// Then the four strands as Monzo style section cards that count DOWN.
//
// Two grammars on one board, and it is deliberate (the Zopa separation):
// three strands are completable and carry tick anatomy; the balance is a
// MAINTAINED condition and carries weather, a status pill and a next reading
// day, so it can never be mistaken for a box to tick once. The balance close
// up (the zone band) lives in its own component; this card is its door.
//
// ── EVERY LINK CARRIES THE CHILD ────────────────────────────────────────────
//
// The plumbing session's rail puts ?child= in the URL and their nav carries
// it forward; a link out of here that dropped it would silently reset the
// parent's choice, and the passport is the page where the choice is most
// deliberate. withChild appends it to every href, alongside the from= the
// rows already carry.

export function withChild(href: string, childParam: string | null | undefined): string {
  if (!childParam) return href
  const [base, hash] = href.split('#')
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}child=${encodeURIComponent(childParam)}${hash ? `#${hash}` : ''}`
}

// The five checklist rows become the four strands: devices, moments, lessons
// and the words, and the balance (which reads the jobs and screen rows
// together). Order is the order a family meets them in the product.
export type Strand = {
  key: 'devices' | 'moments' | 'lessons' | 'balance'
  label: string
  emoji: string
  /** Done for the completable three; the balance never reports done. */
  done: boolean
  /** One short line of state, in the row's own words. */
  detail: string
  href: string
  /** The maintained strand, drawn in the weather grammar. */
  weather?: { word: string; tone: 'green' | 'amber'; readsAgain: string }
}

/** The next Sunday, named as a day: the balance reads weekly and says when. */
export function nextReadingDay(now: Date = new Date()): string {
  const day = now.getUTCDay()
  return day === 0 ? 'next Sunday' : 'Sunday'
}

export function buildStrands(
  sections: ChecklistSection[],
  progress: StageProgress | null,
  childParam: string | null | undefined,
  now: Date = new Date(),
): Strand[] {
  const by = new Map(sections.map(s => [s.key, s]))
  const devices = by.get('devices')
  const moments = by.get('moments')
  const lessons = by.get('lessons')
  const jobs = by.get('jobs')
  const balance = by.get('balance')

  const out: Strand[] = []
  if (devices) {
    out.push({
      key: 'devices', label: 'Devices', emoji: devices.emoji,
      done: devices.pct >= 100,
      detail: devices.pct >= 100 ? 'Set up right' : devices.detail,
      href: withChild(devices.href, childParam),
    })
  }
  if (moments) {
    out.push({
      key: 'moments', label: 'Moments', emoji: moments.emoji,
      done: moments.pct >= 100,
      detail: moments.pct >= 100 ? 'Worked through' : moments.detail,
      href: withChild(moments.href, childParam),
    })
  }
  if (lessons) {
    // Scripts join the strand in words, because the stamp already counts them
    // and until today no row showed them: a family could sit at four green
    // strands and an unstamped page, wondering what was left.
    const scriptsBit = progress && progress.scriptsTotal > 0
      ? `, ${progress.scriptsDone} of ${progress.scriptsTotal} words`
      : ''
    const done = lessons.pct >= 100 && (!progress || progress.scriptsDone >= progress.scriptsTotal)
    out.push({
      key: 'lessons', label: 'Lessons and the words', emoji: lessons.emoji,
      done,
      detail: done
        ? 'All done, then the check'
        : progress
          ? `${progress.lessonsDone} of ${progress.lessonsTotal} lessons${scriptsBit}, then the check`
          : `${lessons.detail}, then the check`,
      href: withChild(lessons.href, childParam),
    })
  }
  if (jobs || balance) {
    const jobsOk = (jobs?.pct ?? 100) >= 100
    const screenOk = (balance?.pct ?? 100) >= 100
    const green = jobsOk && screenOk
    out.push({
      key: 'balance', label: 'The balance', emoji: '⚖️',
      done: false,
      detail: green
        ? 'Jobs kept up, screens in the zone'
        : !screenOk
          ? (balance?.detail ?? 'Worth a look this week')
          : (jobs?.detail ?? 'Jobs need a look'),
      href: withChild(balance?.href ?? jobs?.href ?? '/dashboard/stats', childParam),
      weather: {
        word: green ? 'In balance' : 'Worth a look',
        tone: green ? 'green' : 'amber',
        readsAgain: `Reads again ${nextReadingDay(now)}`,
      },
    })
  }
  return out
}

/** The first thing still open, in strand order: the one task the rail lights. */
export function nextTask(strands: Strand[]): Strand | null {
  return strands.find(s => !s.done && s.key !== 'balance')
    ?? strands.find(s => s.key === 'balance' && s.weather?.tone === 'amber')
    ?? null
}

// ── THE RAIL: ONE TASK LIT, THE REST WAIT ───────────────────────────────────

export function NextOnTheApplication({ strands, checkHref }: { strands: Strand[]; checkHref: string | null }) {
  const next = nextTask(strands)
  const after = strands.filter(s => s !== next && !s.done && s.key !== 'balance')[0] ?? null

  // Nothing open and the check is offered: the check IS the next task.
  if (!next && checkHref) {
    return (
      <div style={{ margin: '14px 0 4px' }}>
        <p className="eyebrow" style={{ marginBottom: 8 }}>Next on the application</p>
        <Link href={checkHref} style={{
          display: 'block', textDecoration: 'none',
          background: 'var(--terracotta)', color: 'var(--ink)',
          border: '2px solid var(--terracotta-dark)', borderRadius: 14,
          boxShadow: '0 4px 0 var(--terracotta-dark)', padding: '13px 15px',
          fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
        }}>
          DiGi&rsquo;s five question check earns the stamp
          <span style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-sm)', color: '#5C4708', marginTop: 2 }}>
            The questions are their own lessons said back. Four of five passes.
          </span>
        </Link>
      </div>
    )
  }
  if (!next) return null

  return (
    <div style={{ margin: '14px 0 4px' }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>Next on the application</p>
      <Link href={next.href} style={{
        display: 'block', textDecoration: 'none',
        background: 'var(--terracotta)', color: 'var(--ink)',
        border: '2px solid var(--terracotta-dark)', borderRadius: 14,
        boxShadow: '0 4px 0 var(--terracotta-dark)', padding: '13px 15px',
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-md)',
      }}>
        <span aria-hidden style={{ marginRight: 8 }}>{next.emoji}</span>
        {next.label}
        <span style={{ display: 'block', fontWeight: 700, fontSize: 'var(--text-sm)', color: '#5C4708', marginTop: 2 }}>
          {next.detail}
        </span>
      </Link>
      {after && (
        <div style={{
          opacity: 0.6, background: '#fff', border: '2px solid var(--ink)',
          borderRadius: 12, padding: '9px 14px', marginTop: 8,
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--ink)',
        }}>
          Then · {after.label.toLowerCase()}
        </div>
      )}
    </div>
  )
}

// ── THE FOUR STRAND CARDS, TWO GRAMMARS ─────────────────────────────────────

export function StrandCards({ strands, kid }: { strands: Strand[]; kid: string }) {
  const leftCount = strands.filter(s => !s.done && s.key !== 'balance').length
  return (
    <div style={{ margin: '18px 0 4px' }}>
      <p className="eyebrow" style={{ marginBottom: 8 }}>
        {leftCount === 0
          ? 'Every strand is in'
          : `${leftCount === 1 ? 'One strand' : leftCount === 2 ? 'Two strands' : `${leftCount} strands`} left for the stamp`}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 9 }}>
        {strands.map(s => (
          <Link key={s.key} href={s.href} style={{
            position: 'relative', textDecoration: 'none',
            background: s.weather ? 'var(--tint-sage)' : s.done ? 'var(--tint-sage)' : '#fff',
            border: `1.5px solid ${s.done || s.weather ? '#C9DDD5' : 'var(--border)'}`,
            borderRadius: 14, padding: '11px 12px 10px', minHeight: 74,
          }}>
            {/* Tick anatomy for the completable three; the maintained strand
                gets a status pill instead, and never an empty circle that begs
                to be filled. */}
            {s.weather ? (
              <span style={{
                display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
                fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                background: '#fff', color: s.weather.tone === 'green' ? 'var(--retro-green)' : 'var(--terracotta-dark)',
                border: `1px solid ${s.weather.tone === 'green' ? '#C9DDD5' : 'var(--terracotta)'}`,
                borderRadius: 100, padding: '2px 8px', marginBottom: 4,
              }}>
                {s.weather.word}
              </span>
            ) : (
              <span aria-hidden style={{
                position: 'absolute', top: 9, right: 10, width: 20, height: 20, borderRadius: 100,
                border: s.done ? '1.6px solid var(--retro-green)' : '1.6px dashed var(--ink-muted)',
                color: 'var(--retro-green)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 'var(--text-xs)', fontWeight: 900, background: s.done ? '#fff' : 'transparent',
              }}>
                {s.done ? '✓' : ''}
              </span>
            )}
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.2, paddingRight: s.weather ? 0 : 26 }}>
              <span aria-hidden style={{ marginRight: 6 }}>{s.emoji}</span>
              {s.key === 'balance' ? `${kid}'s balance` : s.label}
            </span>
            <span style={{ display: 'block', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)', lineHeight: 1.35, marginTop: 3 }}>
              {s.weather ? s.weather.readsAgain : s.detail}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
