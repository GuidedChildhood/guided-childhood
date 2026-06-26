import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getStageFromAgeBand, type AgeBand, STAGES } from '@/lib/content/stages'
import DigiChat from './DigiChat'

const STAGE_PROMPTS: Record<number, string[]> = {
  1: [
    'When is a good age to give my child their first device?',
    'How do I set up the bedroom rule without pushback?',
    'My child is asking for a tablet. What should I do first?',
  ],
  2: [
    'How do I introduce the bedroom rule without a fight?',
    'My child wants to game online. Is that safe at this age?',
    'What does a healthy screen time routine look like for this age?',
  ],
  3: [
    'Her mood drops after Instagram. What do I say tonight?',
    'My son wants TikTok. How do I handle this?',
    'How do I talk about the algorithm without sounding preachy?',
  ],
  4: [
    'He is secretive about his phone. How do I approach this?',
    'She found something upsetting online. What do I do right now?',
    'How do I keep the conversation open without being controlling?',
  ],
  5: [
    'How do I talk about deepfakes and AI content with my teenager?',
    'She measures her worth by her follower count. How do I help?',
    'What does genuine digital independence look like at 16?',
  ],
}

type StoredMessage = { role: string; content: string; timestamp?: string }

export default async function DigiPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, childResult, convResult] = await Promise.all([
    supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
    supabase.from('children').select('age_band').eq('parent_id', user.id).eq('is_primary', true).single(),
    supabase.from('digi_conversations')
      .select('messages, messages_today, last_message_date')
      .eq('user_id', user.id)
      .single(),
  ])

  const isPaid = profileResult.data?.subscription_status === 'active'

  const stage = childResult.data?.age_band
    ? getStageFromAgeBand(childResult.data.age_band as AgeBand)
    : STAGES[2]

  const stagePrompts = STAGE_PROMPTS[stage.id] ?? STAGE_PROMPTS[3]

  const conv = convResult.data
  const today = new Date().toISOString().split('T')[0]
  const isNewDay = !conv || conv.last_message_date !== today
  const initialCount = isNewDay ? 0 : (conv?.messages_today ?? 0)

  const rawMessages: StoredMessage[] = (conv?.messages ?? []).slice(-20)
  const initialMessages = rawMessages
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  return (
    <DigiChat
      initialMessages={initialMessages}
      initialCount={initialCount}
      isPaid={isPaid}
      stagePrompts={stagePrompts}
    />
  )
}
