import { createClient } from '@/lib/supabase/server'
import { firstText } from '@/lib/digi/text'
import { digiModelsFor } from '@/lib/config/digi'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY ?? 'build-placeholder' })

export const dynamic = 'force-dynamic'

// DiGi's weekly literacy question, asked and graded. GET returns this week's
// question for the family (safe online always, fair play in the rotation,
// social media from stage 4, one per strand per week). POST grades the answer
// with DiGi into green or red plus one warm line, stores it, and the strand
// ticks read it from there. A green fair play week grants each child a bonus
// star, the small thank you that makes timer honesty the paying path.

type Strand = 'safe' | 'social' | 'fairplay'

const QUESTIONS: Record<Strand, string[]> = {
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
  fairplay: [
    'Did screen time mostly go through the timer this week, TV and consoles too? What slipped past, if anything?',
    'Hand on heart, how much screen happened off the timer this week? What would make the timer the easy path?',
    'When your child wanted a screen this week, did the ask and the timer come first? What happened the times they did not?',
  ],
}

const STRAND_LABEL: Record<Strand, string> = {
  safe: 'Safe online', social: 'Social media ready', fairplay: 'Fair play',
}

const GRADE_RULE: Record<Strand, string> = {
  safe: 'GREEN if the protective pattern is present (child tells parent, parent aware and involved, conversation open), RED if it is absent or unclear.',
  social: 'GREEN if the protective pattern is present (child tells parent, parent aware and involved, conversation open), RED if it is absent or unclear.',
  fairplay: 'GREEN if screens mostly went through the agreed timer this week and the parent knows what slipped, RED if screens mostly happened off the timer or the parent has no idea. Honesty about a slip still leans GREEN, the telling is the pattern we want.',
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
  // Social questions begin from 13, stage 4. Safe online and fair play run
  // from the start, taking turns so no week carries more than one question.
  const strand: Strand = stage >= 4
    ? (['social', 'safe', 'fairplay'] as const)[weekIndex() % 3]
    : (['safe', 'fairplay'] as const)[weekIndex() % 2]

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
  if ((strand !== 'safe' && strand !== 'social' && strand !== 'fairplay') || !question?.trim() || !answer?.trim()) {
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
          system: `You grade one parent answer about their child's digital life for the "${STRAND_LABEL[strand as Strand]}" strand. Reply with EXACTLY two lines. Line 1: ${GRADE_RULE[strand as Strand]} Line 2: one warm plain sentence for the parent, naming what is working or the one small next step. Never shame. No dashes.`,
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
  // A database still on the two strand constraint (before migration 086)
  // cannot store fairplay yet: the parent's answer and DiGi's warm read are
  // still returned, nothing is lost but the streak, which starts counting
  // once the migration lands.
  if (error && strand !== 'fairplay') return NextResponse.json({ error: error.message }, { status: 500 })

  // A green fair play week pays: one bonus star per child, and the streak of
  // consecutive green fair play weeks comes back for the card to celebrate.
  // Both fail soft before migration 086.
  let streak = 0
  if (strand === 'fairplay') {
    if (grade === 'green' && !error) {
      try {
        const { data: kids } = await supabase.from('children').select('id').eq('parent_id', user.id)
        for (const k of kids ?? []) {
          await supabase.from('star_bonuses').insert({
            user_id: user.id, child_id: k.id, stars: 1,
            note: 'Fair play week: screens went through the timer ⭐',
          })
        }
      } catch { /* the grade still lands without the bonus */ }
    }
    try {
      const { data: prior } = await supabase
        .from('literacy_checkins').select('grade')
        .eq('user_id', user.id).eq('strand', 'fairplay')
        .order('created_at', { ascending: false }).limit(12)
      for (const row of prior ?? []) {
        if (row.grade === 'green') streak++
        else break
      }
    } catch { /* streak stays 0 */ }
  }

  return NextResponse.json({ grade, note, streak })
}
