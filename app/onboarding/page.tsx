'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getStageFromAgeBand, type StarterAnswers } from '@/lib/content/stages'
import Link from 'next/link'

export default function OnboardingPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'saving' | 'redirecting' | 'no_answers'>('loading')

  useEffect(() => {
    async function run() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      let answers: StarterAnswers | null = null
      try {
        const saved = localStorage.getItem('gc_starter_answers')
        if (saved) answers = JSON.parse(saved)
      } catch {}

      if (!answers) {
        // Check if already onboarded
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single()

        if (profile?.onboarding_complete) {
          router.push('/dashboard')
        } else {
          setStatus('no_answers')
        }
        return
      }

      setStatus('saving')
      const stage = getStageFromAgeBand(answers.ageBand)

      await supabase.from('profiles').upsert({
        id: user.id,
        onboarding_answers: answers,
        onboarding_complete: true,
      })

      // Create a placeholder child record from the onboarding answers
      const { data: existingChildren } = await supabase
        .from('children')
        .select('id')
        .eq('parent_id', user.id)
        .limit(1)

      if (!existingChildren || existingChildren.length === 0) {
        await supabase.from('children').insert({
          parent_id: user.id,
          name: 'Your child',
          age_band: answers.ageBand,
          stage_id: stage.id,
          is_primary: true,
        })
      }

      localStorage.removeItem('gc_starter_answers')
      setStatus('redirecting')
      router.push('/dashboard')
    }

    run()
  }, [router])

  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: 'var(--cream)' }}>
      <div style={{ textAlign: 'center', maxWidth: '380px' }}>

        {(status === 'loading' || status === 'saving' || status === 'redirecting') && (
          <>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--green-dark)', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px' }}>
              {status === 'loading' ? 'Loading your pathway...' : status === 'saving' ? 'Saving your pathway...' : 'Taking you to your dashboard...'}
            </p>
          </>
        )}

        {status === 'no_answers' && (
          <>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Let us find your starting point</h1>
            <p style={{ color: 'var(--ink-muted)', marginBottom: '28px', fontSize: '15px' }}>
              Answer three quick questions and we will map your child's stage.
            </p>
            <Link href="/starter-pack" className="btn btn-gold">
              Start the pathway check
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
