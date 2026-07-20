import ScriptDetailView from '@/components/scripts/ScriptDetailView'
import RehearseWithDigi from '@/components/scripts/RehearseWithDigi'

// Fixture reference page for the script detail redesign: the REAL components
// with made up props, no database, so the page and the rehearsal conversation
// can be screenshotted. Default view is the full page, ?view=chat shows the
// rehearsal open with the thinking state and the reply chips. Not linked from
// anywhere.

export const dynamic = 'force-dynamic'

const SCRIPT = {
  stage_id: 'shaper',
  title: 'Your online footprint and your future',
  situation: 'Your teenager posts publicly without a second thought and does not believe anything they share now could matter in five years.',
  say_this: 'Everything you post is building a picture of who you are. I want that picture to be one you are proud of at eighteen.',
  not_this: 'Delete that right now or the phone goes away for good.',
  why_it_works: 'Teenagers respond to identity, not fear. Framing the footprint as a picture they are painting of themselves puts them in charge of it, and research on adolescent motivation shows ownership beats threat every time a habit needs to change.',
  tonight: 'Sit together and look at one public profile they use. Ask them to pick the post they are most proud of, and tell them why you liked it too.',
  is_free: true,
}

const DEPTH = {
  ifTheyPushBack: 'Stay with the picture, not the punishment. Try: I am not asking you to delete anything tonight. I am asking you to look at it the way a stranger would, because one day a coach or an employer will.',
  checkBack: 'In a few days, ask them to show you something they chose not to post. Celebrating the decision not to share is the strongest signal the idea has landed.',
  forYourChild: 'I looked at your page today and I saw so much of what makes you brilliant. Keep building a picture you are proud of. I am always in your corner.',
}

const CHAT_FIXTURE = {
  open: true,
  busy: true,
  messages: [
    { role: 'assistant' as const, content: 'Why does it even matter? Literally everyone posts stuff. Nobody is going to care about this in five years, you are being so dramatic about it.' },
    { role: 'user' as const, content: 'I get that it feels normal, and I am not trying to catch you out. Everything you post is building a picture of who you are. I want that picture to be one you are proud of at eighteen.' },
  ],
}

export default async function RefScriptPremium({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view } = await searchParams

  if (view === 'chat') {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--cream)', padding: '28px 16px 48px', display: 'flex', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ width: 'min(100%, 560px)' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', margin: '0 0 12px' }}>
            The rehearsal conversation
          </p>
          <RehearseWithDigi
            scriptTitle={SCRIPT.title}
            situation={SCRIPT.situation}
            sayThis={SCRIPT.say_this}
            notThis={SCRIPT.not_this}
            childName="Teo"
            isPaid
            fixture={CHAT_FIXTURE}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--cream)', fontFamily: 'var(--font-body)' }}>
      <ScriptDetailView
        script={SCRIPT}
        sortOrder={12}
        showBanNote
        voiceUrl="/fixture-voice.mp3"
        isPaid
        childName="Teo"
        childPhone={null}
        childId={null}
        childHasApp={false}
        workedRating={null}
        prevScript={{ sort_order: 11, title: 'Group chats and being left out' }}
        nextScript={{ sort_order: 13, title: 'When a stranger follows them' }}
        depthInitial={DEPTH}
      />
    </div>
  )
}
