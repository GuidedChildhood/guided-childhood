import { createClient } from '@/lib/supabase/server'
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

export default async function DigiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [profileResult, childResult, convResult, feedbackResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
    supabase.from('children').select('age_band, name').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('digi_conversations')
      .select('messages, messages_today, last_message_date')
      .eq('user_id', user.id)
      .single(),
    supabase.from('digi_feedback')
      .select('question, parent_response, responded_at')
      .eq('user_id', user.id)
      .eq('feedback_date', today)
      .maybeSingle(),
  ])

  const isPaid = profileResult.data?.subscription_status === 'active'

  const stage = childResult.data?.age_band
    ? getStageFromAgeBand(childResult.data.age_band as AgeBand)
    : STAGES[2]

  const childName = childResult.data?.name ?? null
  const stagePrompts = getStagePrompts(stage.id, childName)

  const conv = convResult.data
  const isNewDay = !conv || conv.last_message_date !== today
  const initialCount = isNewDay ? 0 : (conv?.messages_today ?? 0)

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
      initialMessages={initialMessages}
      initialCount={initialCount}
      isPaid={isPaid}
      stagePrompts={stagePrompts}
      pendingReflection={pendingReflection}
      stageId={stage.id}
      stageName={stage.name}
    />
  )
}
