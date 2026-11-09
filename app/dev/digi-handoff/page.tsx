import DigiChat from '@/app/(dashboard)/dashboard/digi/DigiChat'
import DigiAskLink from '@/components/digi/DigiAskLink'
import { resolveDigiHandoff, sealDigiPrompt } from '@/lib/digi/prompt-token'

// Dev fixture: DiGi being handed a question without the question in the URL
// (lib/digi/handoff.ts). The real page needs a signed in parent and a
// database; this renders the same DigiChat with the same handoff resolver, for
// a pretend parent, so all three routes in can be checked in a browser:
//
//   ?p=<sealed>  a link minted on the server (a card, a push, a suggestion)
//   ?held=1      a question held in this tab by a DigiAskLink tap
//   ?q= / ?ask=  the old words in the URL, still honoured, then stripped
//
// Unauthenticated, /api/digi answers 401 and DiGi gives its honest fallback,
// which is fine: the check is that the question arrived, not the answer.

const FIXTURE_PARENT = 'dev-fixture-parent'
const SEND = 'Olga is 9 and asked to keep her phone till nine. What do we say tonight?'
const DRAFT = 'Screen time battles is tough at today\'s check in for Olga. What is our next move?'

export default async function DigiHandoffFixture({ searchParams }: { searchParams: Promise<{ p?: string; q?: string; ask?: string }> }) {
  const params = await searchParams
  const handoff = resolveDigiHandoff(params, FIXTURE_PARENT)
  const sealedSend = sealDigiPrompt(FIXTURE_PARENT, SEND, 'send')
  const sealedDraft = sealDigiPrompt(FIXTURE_PARENT, DRAFT, 'draft')
  const foreign = sealDigiPrompt('someone-else', SEND, 'send')
  const link = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--ink)', padding: '8px 10px', border: 'var(--edge)', borderRadius: 'var(--radius-tile)', background: 'var(--white)', textDecoration: 'none' } as const
  return (
    <div style={{ background: 'var(--cream)', minHeight: '100dvh' }}>
      <nav data-fixture-links style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '12px 16px' }}>
        <a style={link} href={`/dev/digi-handoff?p=${sealedSend}`}>Sealed, send</a>
        <a style={link} href={`/dev/digi-handoff?p=${sealedDraft}`}>Sealed, draft</a>
        <a style={link} href={`/dev/digi-handoff?p=${foreign}`}>Another parent&apos;s link</a>
        <DigiAskLink style={link} prompt={SEND} data-fixture-hold>Held in the tab</DigiAskLink>
      </nav>
      <DigiChat
        // Constant, like the real page's child id: a key that followed ?p= would
        // remount the chat when the router refresh lands on the clean URL.
        key="fixture"
        initialMessages={[]}
        handoff={handoff}
        initialCount={0}
        dailyLimit={null}
        stagePrompts={['What does a healthy screen time routine look like right now?']}
        stageId={2}
        stageName="Explorer"
        childName="Olga"
        knownNames={['Olga']}
      />
    </div>
  )
}
