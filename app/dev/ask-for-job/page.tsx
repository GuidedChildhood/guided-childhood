import KidAskForJob, { type KidAsk } from '@/components/kid/KidAskForJob'
import { resolveTheme } from '@/lib/kid/theme'

// A harness for Ask for a job, built for the bug Justin found on the child app:
// "it's one of the 5 ask for a job but it's a list that I cannot add one."
//
// The real page needs the service key to resolve a link token, so it cannot be
// opened locally at all, which is why this went unnoticed. The fixture feeds
// the component the exact shape of Teo's real history: every one of the seven
// preset ideas already asked and approved, one still pending, and two
// printables. Before the fix that renders zero quick pick chips.
//
// It now takes ?accent= as well, for the second report on 9 August: "this page
// needs to be app chosen colours." Three lines on this screen sit directly on
// the page background rather than inside the white card, so they were the ones
// at risk of going white on cream once the background could be a pastel wash.
// ?accent=coral is the check that they did not.

export const dynamic = 'force-dynamic'

const ASKS: KidAsk[] = [
  { id: '1', title: 'Kiss my dad', emoji: '💛', status: 'pending' },
  { id: '2', title: 'Please can I do the My Kindness Bucket List printable', emoji: '💛', status: 'added' },
  { id: '3', title: 'Please can I do the Colour in Nova printable', emoji: '🟣', status: 'added' },
  { id: '4', title: 'Tidy kitchen', emoji: '⭐', status: 'added' },
  { id: '5', title: 'Garden', emoji: '⭐', status: 'declined' },
  { id: '6', title: 'Read to someone smaller', emoji: '📚', status: 'added' },
  { id: '7', title: 'Play football outside', emoji: '⚽', status: 'added' },
  { id: '8', title: 'Help with dinner', emoji: '🍳', status: 'added' },
  { id: '9', title: 'Tidy the garden', emoji: '🌿', status: 'added' },
  { id: '10', title: 'Sort my school bag', emoji: '🎒', status: 'added' },
  { id: '11', title: 'Wash the car', emoji: '🚗', status: 'added' },
  { id: '12', title: 'Clean my room', emoji: '🧹', status: 'added' },
]

export default async function AskForJobFixture({
  searchParams,
}: {
  searchParams: Promise<{ accent?: string }>
}) {
  const { accent } = await searchParams
  const theme = resolveTheme(accent ?? null)

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, padding: '22px 16px 50px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.7rem', color: theme.ink, margin: '0 0 4px' }}>
          Ask for a job
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.inkMuted, margin: '0 0 16px' }}>
          {theme.name}
        </p>
        <KidAskForJob token="0000000000000000ff" initialAsks={ASKS} childName="Teo" theme={theme} />
      </div>
    </div>
  )
}
