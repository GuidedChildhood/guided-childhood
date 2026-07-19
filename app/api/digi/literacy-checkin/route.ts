import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { digiModelsFor } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

export const dynamic = 'force-dynamic'

// DiGi's weekly literacy question, asked and graded. GET returns this week's
// question for the family (safe online always, social media from stage 4, one
// per strand per week). POST grades the answer with DiGi into green or red
// plus one warm line, stores it, and the strand ticks read it from there.

const QUESTIONS: Record<'safe' | 'social', string[]> = {
  safe: [
    'When something online worries your child, do they come and tell you? What happened last time?',
    'If your child saw something upsetting on a screen this week, how confident are you they would say so? Why?',
    'What is your child watching or playing most right now, and have you sat with them during it lately?',
  ],
  social: [
    'Has your child used or asked about any social platform lately? Which one, and what did you do?',
    'Do you know what your child is seeing in their feeds this week? How do you know?',
    'Has your child mentioned anything a friend showed them on social media recently? How did that conversation go?',
  ],
}

function weekIndex(): number {
  return Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const url = new URL(request.url)
  const stage = Number(url.searchParams.get('stage') || '1')
  // Social questions begin from 13, stage 4. Safe online runs from the start.
  const strand: 'safe' | 'social' = stage >= 4 && weekIndex() % 2 === 0 ? 'social' : 'safe'

  // Already answered this strand in the last 7 days: nothing to ask.
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: recent } = await supabase
    .from('literacy_checkins').select('id').eq('user_id', user.id)
    .eq('strand', strand).gte('created_at', since).limit(1).maybeSingle()
  if (recent) return NextResponse.json({ question: null })

  const bank = QUESTIONS[strand]
  return NextResponse.json({ strand, question: bank[weekIndex() % bank.length] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { strand, question, answer } = await request.json().catch(() => ({}))
  if ((strand !== 'safe' && strand !== 'social') || !question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: 'strand, question and answer are required' }, { status: 400 })
  }

  // DiGi grades warmly: green means the protective pattern is present, red
  // means it needs a hand, never a judgement of the parent. Best effort with
  // a strict shape; on any model trouble we store a neutral green so the
  // parent's answer is never lost or punished by an outage.
  let grade: 'green' | 'red' = 'green'
  let note = 'Thank you. DiGi has noted this for the week.'
  for (const model of digiModelsFor('feedback')) {
    try {
      const res = await Promise.race([
        anthropic.messages.create({
          model,
          max_tokens: 120,
          system: `You grade one parent answer about their child's digital life for the "${strand === 'safe' ? 'Safe online' : 'Social media ready'}" strand. Reply with EXACTLY two lines. Line 1: GREEN if the protective pattern is present (child tells parent, parent aware and involved, conversation open), RED if it is absent or unclear. Line 2: one warm plain sentence for the parent, naming what is working or the one small next step. Never shame. No dashes.`,
          messages: [{ role: 'user', content: `Question: "${question}"\nParent answered: "${answer}"` }],
        }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 6000)),
      ])
      const text = firstText(res).trim()
      const [line1, ...rest] = text.split('\n')
      if (/red/i.test(line1)) grade = 'red'
      const candidate = rest.join(' ').trim()
      if (candidate) note = candidate
      break
    } catch (err) {
      const isModelError = err instanceof Anthropic.APIError && (err.status === 404 || err.status === 400)
      if (!isModelError) break
    }
  }

  const { error } = await supabase.from('literacy_checkins').insert({
    user_id: user.id, strand, question: String(question).slice(0, 1000),
    answer: String(answer).slice(0, 3000), grade, grade_note: note.slice(0, 500),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ grade, note })
}
