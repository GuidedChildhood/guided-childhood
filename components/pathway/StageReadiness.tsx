import Link from 'next/link'
import DigiCharacter from '@gc/shared/components/DigiCharacter'

// The end of stage readiness read, DiGi's voice. As a family nears the end of a
// stage, DiGi does the one thing a good teacher does before a milestone: reads
// where they actually are and names what is left in plain words.
//
// The check itself is the CHILD'S, and lives on their own link. It gathers the
// questions their lessons already asked, so they are the one who answers them,
// and the pass is what earns the stamp. This card stops at handing over: it
// tells the grown up when the check is unlocked and where the child takes it.
//
// Never a test of the child in how it is described. The grown up is told what is
// left, not what their child got wrong.

type AmberItem = { name: string; improve: string; href: string }

export default function StageReadiness({
  stageId, stageName, stampName, childId, childName, greens, activeAreas, lessonsLeft, ambers,
  alreadyPassed, kidToken,
}: {
  stageId: number
  stageName: string
  stampName: string
  childId?: string | null
  childName?: string | null
  greens: number
  activeAreas: number
  lessonsLeft: number
  ambers: AmberItem[]
  alreadyPassed: boolean
  // The child's own link, so the grown up can send them straight to the check.
  // Absent when no link has been made yet, and the card says so rather than
  // offering a button that goes nowhere.
  kidToken?: string | null
}) {
  const kid = childName && childName !== 'Your child' ? childName : 'your child'
  // The together check's address, carrying the child so the page under it
  // reads the right passport. stageId rides so a readiness card shown for a
  // catch up stage one day sits that stage's check, not the current one.
  const checkHref = `/dashboard/pathway/check?stage=${stageId}${childId ? `&child=${childId}` : ''}&from=passport`
  const allGreen = ambers.length === 0 && lessonsLeft === 0

  const card: React.CSSProperties = {
    background: '#fff', border: '1.5px solid var(--border)', borderRadius: 20,
    padding: '20px 20px 22px', boxShadow: '0 4px 0 rgba(26,26,46,0.05)',
  }
  const digiHead = (mood: 'wave' | 'happy' | 'speak' | 'thinking') => (
    <span style={{ flexShrink: 0, width: 46, height: 46, borderRadius: '50%', background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <DigiCharacter size={30} mood={mood} />
    </span>
  )

  // Already stamped: quiet confirmation, nothing to do.
  if (alreadyPassed) {
    return (
      <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 20px' }}>
        <div style={{ ...card, background: 'var(--tint-green)', border: '1.5px solid var(--retro-green)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            {digiHead('happy')}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', color: 'var(--retro-green-dark)', lineHeight: 1.15 }}>
                {stampName} stamped
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.5, margin: '6px 0 0' }}>
                {kid} passed the {stageName} check on their own link. That stage is done and the
                stamp is theirs.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '0 20px', maxWidth: 720, margin: '0 auto 20px' }}>
      <div style={{ ...card, background: allGreen ? 'var(--tint-green)' : '#fff', border: `1.5px solid ${allGreen ? 'var(--retro-green)' : 'var(--border)'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          {digiHead(allGreen ? 'happy' : 'speak')}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 3 }}>
              End of stage check
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-xl)', letterSpacing: '-0.01em', color: allGreen ? 'var(--retro-green-dark)' : 'var(--ink)', lineHeight: 1.15 }}>
              {allGreen
                ? `${kid} is ready for the ${stampName} stamp`
                : `Almost at the ${stampName} stamp`}
            </div>
          </div>
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-lg)', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '13px 0 0' }}>
          {allGreen
            ? `Every part of the ${stageName} stage is done, ${greens} of ${activeAreas} strands green. The check is waiting on ${kid}'s own link, five questions drawn from the lessons they worked through.`
            : `${greens} of ${activeAreas} strands are green. Here is the little that is left before the ${stageName} stamp lands.`}
        </p>

        {!allGreen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 13 }}>
            {ambers.map(a => (
              <Link key={a.name} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '12px 14px',
              }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>{a.name}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 1 }}>{a.improve}</span>
                </span>
                <span aria-hidden style={{ flexShrink: 0, color: 'var(--terracotta-dark)', fontSize: 'var(--text-xl)', fontWeight: 800 }}>→</span>
              </Link>
            ))}
            {lessonsLeft > 0 && (
              <Link href="/dashboard/lessons" style={{
                display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none',
                background: 'var(--terracotta-lt)', border: '1.5px solid var(--terracotta)', borderRadius: 12, padding: '12px 14px',
              }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', lineHeight: 1.2 }}>
                    {lessonsLeft} stage {lessonsLeft === 1 ? 'lesson' : 'lessons'} to finish
                  </span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.4, marginTop: 1 }}>Ten minutes each, done together.</span>
                </span>
                <span aria-hidden style={{ flexShrink: 0, color: 'var(--terracotta-dark)', fontSize: 'var(--text-xl)', fontWeight: 800 }}>→</span>
              </Link>
            )}
          </div>
        )}

        {allGreen && (
          kidToken ? (
            <>
              <Link
                href={`/k/${kidToken}/quiz`}
                style={{
                  display: 'block', textAlign: 'center', textDecoration: 'none',
                  marginTop: 16, width: '100%', background: 'var(--terracotta)', color: 'var(--ink)',
                  borderRadius: 14, padding: '14px 18px', boxSizing: 'border-box',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
                  boxShadow: '0 4px 0 var(--terracotta-dark)',
                }}
              >
                Open the check on {kid}&rsquo;s link
              </Link>
              {/* The quiet second door. Their own app is the front door because
                  sitting the check there is the child owning their own
                  passport; this is for the evening the tablet is flat or left
                  at the other house. Same questions, same pass mark, same
                  stamp. */}
              <Link
                href={checkHref}
                style={{
                  display: 'block', textAlign: 'center', marginTop: 9,
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
                  color: 'var(--ink-muted)', textDecoration: 'underline', letterSpacing: '0.04em',
                }}
              >
                Or sit it together on this screen
              </Link>
            </>
          ) : (
            <>
              {/* THE DEAD END IS GONE (18 August 2026). This used to be a
                  paragraph telling the family to go and set up a child link,
                  full stop, which meant no app could ever mean no stamp: the
                  parent side recorder existed in the API with nothing calling
                  it. Justin: "should push for app but yes when no app parents
                  can do together." So the ask to set up the app stays, and
                  the check no longer waits for it. */}
              <Link
                href={checkHref}
                style={{
                  display: 'block', textAlign: 'center', textDecoration: 'none',
                  marginTop: 16, width: '100%', background: 'var(--terracotta)', color: 'var(--ink)',
                  borderRadius: 14, padding: '14px 18px', boxSizing: 'border-box',
                  fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)',
                  boxShadow: '0 4px 0 var(--terracotta-dark)',
                }}
              >
                Sit the check together
              </Link>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--ink-muted)', lineHeight: 1.5, margin: '9px 0 0', textAlign: 'center' }}>
                Five questions, out loud, side by side. With their own link the check
                lands on {kid}&rsquo;s app instead: set one up on the quests page.
              </p>
            </>
          )
        )}
      </div>
    </div>
  )
}
