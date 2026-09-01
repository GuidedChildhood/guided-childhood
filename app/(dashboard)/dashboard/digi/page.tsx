import { createClient } from '@/lib/supabase/server'
import { getChildren } from '@/lib/children/server'
import { inStarterTrial, isAllowlisted } from '@/lib/access'
import { getTrialConfig } from '@/lib/config/trial'
import { redirect } from 'next/navigation'
import { getStageFromAgeBand, type AgeBand, STAGES } from '@/lib/content/stages'
import DigiChat from './DigiChat'

function getStagePrompts(stageId: number, childName: string | null): string[] {
  const name = (childName && childName !== 'Your child') ? childName : null
  const n = (s: string) => name ? s.replace('[name]', name) : s.replace(' [name]', '').replace('[name] ', '')
  const prompts: Record<number, string[]> = {
    1: [
      n('When is the right time to give [name] their first device?'),
      n('How do I set up the bedroom rule with [name] without pushback?'),
      n('[name] is asking for a tablet. What should I do first?'),
    ],
    2: [
      n('How do I introduce the bedroom rule with [name] without a fight?'),
      n('[name] wants to game online. What should I watch for?'),
      n('What does a healthy screen time routine look like for [name] right now?'),
    ],
    3: [
      n('[name]\'s mood drops after Instagram. What do I say tonight?'),
      n('[name] wants TikTok. How do I handle this?'),
      n('How do I talk to [name] about the algorithm without sounding preachy?'),
    ],
    4: [
      n('[name] is secretive about their phone. How do I approach this?'),
      n('[name] found something upsetting online. What do I do right now?'),
      n('How do I keep the conversation open with [name] without being controlling?'),
    ],
    5: [
      n('How do I talk to [name] about deepfakes and AI content?'),
      n('[name] measures their worth by their follower count. How do I help?'),
      n('Is [name] actually ready for full digital independence?'),
    ],
  }
  return prompts[stageId] ?? prompts[3]
}

type StoredMessage = { role: string; content: string; timestamp?: string }

export default async function DigiPage({ searchParams }: { searchParams: Promise<{ child?: string; ask?: string }> }) {
  // Which child this page is about, so the switcher in the layout actually
  // changes the page rather than only the pills. See lib/children/server.ts.
  // ?ask= arrives from a dip at the check in with the question already
  // written, so a parent lands here one tap from sending rather than having
  // to retype what the app already knows. Capped so a mangled link cannot
  // stuff the box.
  const { child: childParam, ask } = await searchParams
  const initialAsk = typeof ask === 'string' ? ask.slice(0, 300) : null
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [profileResult, childResult, convResult, feedbackResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status, trial_ends_at').eq('id', user.id).single(),
    // In the same wave as before: getChildren returns a promise like any
    // other read, so honouring ?child= costs no extra round trip.
    getChildren<{ id: string; name: string | null; age_band: string | null; is_primary: boolean | null }>(
      supabase, user.id, childParam, 'age_band, name'),
    // Every thread, one per child since migration 235. The selected child's
    // is picked below once ?child= has resolved; the count badge sums them
    // all, because the daily cap is per family, not per thread.
    supabase.from('digi_conversations')
      .select('child_id, messages, messages_today, last_message_date')
      .eq('user_id', user.id),
    supabase.from('digi_feedback')
      .select('question, parent_response, responded_at')
      .eq('user_id', user.id)
      .eq('feedback_date', today)
      .maybeSingle(),
  ])

  // The same question the route asks, asked the same way, so the badge in the
  // header and the 429 can never disagree: is the trial running, and is this
  // somebody the allowlist exempts. Null means no limit at all.
  const capped = inStarterTrial(profileResult.data) && !isAllowlisted(user.email)
  const dailyLimit = capped ? (await getTrialConfig()).digiDailyLimit : null

  const stage = childResult.child?.age_band
    ? getStageFromAgeBand(childResult.child.age_band as AgeBand)
    : STAGES[2]

  const childName = childResult.child?.name ?? null
  const stagePrompts = getStagePrompts(stage.id, childName)

  // A short evergreen set of example questions that stays under the chat, so a
  // parent who has already asked something still sees the kind of thing DiGi is
  // for. The first is the screen time question parents ask most, framed by the
  // child's own age so it reads like their question, then a few from the stage.
  const AGE_LABEL: Record<string, string> = {
    '4-7': 'a 4 to 7 year old',
    '8-10': 'an 8 to 10 year old',
    '11-13': 'an 11 to 13 year old',
    '13-15': 'a 13 to 15 year old',
    '16+': 'a 16 year old',
  }
  const ageLabel = childResult.child?.age_band ? (AGE_LABEL[childResult.child.age_band as string] ?? 'my child') : 'my child'
  const faqPrompts = [
    `How long should ${ageLabel} be on a screen each day?`,
    ...stagePrompts,
  ].slice(0, 4)

  type ConvRow = {
    child_id: string | null
    messages: StoredMessage[] | null
    messages_today: number | null
    last_message_date: string | null
  }
  const convRows = (convResult.data ?? []) as ConvRow[]
  // The history shown is the SELECTED child's own thread, so the toggle at
  // the top changes the conversation, not just the prompts. Justin, 1
  // September 2026: "the history moves with child select so DiGi can take
  // correct details into thinking."
  const conv = convRows.find(r => (r.child_id ?? null) === (childResult.child?.id ?? null)) ?? null
  const initialCount = convRows.reduce(
    (n, r) => n + (r.last_message_date === today ? (r.messages_today ?? 0) : 0), 0)

  // Empty entries (saved by a failed stream) render as blank bubbles and the
  // reflective marker is a separate card, so both are stripped for display.
  const rawMessages: StoredMessage[] = (conv?.messages ?? []).slice(-20)
  const initialMessages = rawMessages
    .filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.role === 'assistant' ? (m.content.split(/\n\s*---\s*\n/)[0]?.trim() || m.content) : m.content,
    }))

  const todayFeedback = feedbackResult.data
  const pendingReflection = todayFeedback
    ? { question: todayFeedback.question, answered: !!todayFeedback.parent_response }
    : null

  return (
    <DigiChat
      // Remounted per child. DigiChat seeds its message list into state on
      // mount, so without the key a soft navigation between children would
      // keep the previous child's bubbles on screen under the new name.
      key={childResult.child?.id ?? 'family'}
      initialMessages={initialMessages}
      initialAsk={initialAsk}
      initialCount={initialCount}
      dailyLimit={dailyLimit}
      stagePrompts={stagePrompts}
      faqPrompts={faqPrompts}
      pendingReflection={pendingReflection}
      stageId={stage.id}
      stageName={stage.name}
      childName={childName}
    />
  )
}
