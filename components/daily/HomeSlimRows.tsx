import Link from 'next/link'

// Everything else on the narrowed home folds to these slim rows: family
// quests with the live approve count, the road to 16 with the stamp position,
// and DiGi. Sunday adds the weekly round up row and nothing else changes, so
// the habit has one shape. Pure server markup, every row one tap to its page.

function SlimRow({ href, emoji, title, meta, badge }: {
  href: string; emoji: string; title: string; meta: string; badge?: string
}) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none',
      background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px',
      padding: '13px 14px', boxShadow: '0 3px 0 rgba(26,26,46,0.05)',
    }}>
      <span style={{ width: 38, height: 38, borderRadius: '12px', background: 'var(--terracotta-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '19px', flexShrink: 0 }}>{emoji}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '15px', color: 'var(--ink)', lineHeight: 1.2 }}>{title}</span>
        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{meta}</span>
      </span>
      {badge && (
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10.5px', fontWeight: 700, background: 'var(--tint-blue)', color: 'var(--ink)', borderRadius: '100px', padding: '4px 10px', flexShrink: 0 }}>{badge}</span>
      )}
      <span aria-hidden style={{ color: 'var(--ink-muted)', fontWeight: 800 }}>›</span>
    </Link>
  )
}

export default function HomeSlimRows({
  approveCount, stageName, stageNum, showRoundup, handoverName,
}: {
  approveCount: number
  stageName: string
  stageNum: number
  showRoundup: boolean
  // Set when the child is old enough to run their own side and no kid link
  // exists yet: the warm nudge to hand them their app.
  handoverName?: string | null
}) {
  return (
    <div style={{ display: 'grid', gap: '9px', marginBottom: '20px' }}>
      <SlimRow
        href="/dashboard/quests"
        emoji="🧹"
        title="Family quests"
        meta={approveCount > 0 ? 'A quest is waiting for your tick' : 'Jobs, stars and the screen time deal'}
        badge={approveCount > 0 ? `${approveCount} to approve` : undefined}
      />
      {handoverName && (
        <Link href="/dashboard/quests?tab=share" style={{
          display: 'block', textDecoration: 'none', margin: '-3px 4px 0',
          fontFamily: 'var(--font-body)', fontSize: '12.5px', color: 'var(--ink-soft)', lineHeight: 1.5,
        }}>
          {handoverName} can tick their own jobs now. <span style={{ fontWeight: 700, color: 'var(--terracotta-dark)' }}>Share the QR code to hand them their side →</span>
        </Link>
      )}
      <SlimRow
        href="/dashboard/pathway"
        emoji="🛣️"
        title="The road to 16"
        meta={`${stageName} stage · stamp ${stageNum} of 5 on the way`}
      />
      <SlimRow
        href="/dashboard/digi"
        emoji="💬"
        title="Ask DiGi anything"
        meta="He knows your setup, your quests and your week"
      />
      {showRoundup && (
        <SlimRow
          href="/dashboard/week"
          emoji="🗞️"
          title="Your weekly round up"
          meta="The week just gone, read back in a minute"
          badge="Sunday"
        />
      )}
    </div>
  )
}
