'use client'
import { useState } from 'react'
import Link from 'next/link'
import CharacterIntro from '@/components/lessons/CharacterIntro'
import LessonStep from '@/components/lessons/LessonStep'
import DigiJuniorPause from '@/components/lessons/DigiJuniorPause'

type Phase = 'intro' | 'lesson' | 'done'

const LESSON = {
  character: 'teo' as const,
  greeting: "Hi! I'm Teo and I'm here to help you today! 🎉 You know how I love football? Well today we're going to find out why your brain treats screens exactly like a REALLY exciting match. Ready? Let's kick off!",
  lessonTitle: 'Why your brain loves screens so much',
  ageStage: 'Stage 2 to 3 · Ages 7 to 11',
  steps: [
    {
      type: 'learn' as const,
      heading: 'Your brain has a cheer squad',
      body: 'Every time something exciting happens on a screen — a notification, a goal, a new level — your brain releases a chemical called dopamine. It is like your brain\'s own crowd going wild. That burst of excitement feels amazing.',
      characterSays: 'It is exactly like scoring a goal! That rush you feel? That is real. Your brain made it happen. And here is the thing about brains — they always want to feel that rush again.',
      funFact: 'A notification sound triggers nearly the same dopamine response as scoring a point in a game. Your brain cannot always tell the difference.',
    },
    {
      type: 'think' as const,
      heading: 'Think about the last time you were watching something and someone told you to stop',
      body: 'You probably felt a bit annoyed, right? Maybe even really annoyed? That is not you being badly behaved. That is your brain genuinely wanting more of that good feeling. It is biology, not bad behaviour.',
      characterSays: 'When I have to stop in the middle of a match it is SO hard. I used to think I was just bad at stopping. But I was not. My brain just had not learned to wind down yet. That is what we are going to fix today.',
    },
    {
      type: 'discover' as const,
      heading: 'The 20-minute wind-down secret',
      body: 'Your brain needs about 20 minutes to calm down after screen time. During that time it is still excited, still looking for the next thing. If you go straight to sleep or homework during those 20 minutes, everything feels harder than it needs to.',
      characterSays: 'I call it the cool-down lap. Footballers do not sprint off the pitch and collapse straight away. They do a cool-down lap. Now I do one after screen time too. Works every time.',
      funFact: 'Children who have a 20-minute gap between screens and sleep fall asleep 35% faster on average, according to University of Auckland research.',
    },
    {
      type: 'challenge' as const,
      heading: 'Can you name your dopamine triggers?',
      body: 'Think about what you watch or play that gives you that biggest rush feeling. The notification sound? A win in a game? A funny video? Knowing your triggers is the first step to being the boss of them.',
      characterSays: 'Mine is when a new episode starts automatically. That little countdown feels impossible to resist! Now I know that, I can pause it before it starts. Knowledge is power, like a team knowing the other team\'s best move.',
    },
  ],
  pause: {
    message: "BEEP BOOP! 🤖 Brilliant work so far! DiGi Junior here for a quick breather. Take a deep breath with me before we do the big mission...",
  },
  mission: {
    heading: 'Teo\'s Screen Time Mission',
    body: 'This week, try the cool-down lap. When your screen time ends, do 20 minutes of something calm before sleeping or doing homework. Walk around, draw something, chat to someone. Tell a grown-up you are trying it.',
    reward: 'Next time you see Teo he\'ll want to know how the cool-down lap went!',
  },
  familyQuestion: 'Ask a grown-up: what is the thing that is hardest for YOU to stop doing once you start?',
}

export default function LessonPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentStep, setCurrentStep] = useState(0)
  const [showPause, setShowPause] = useState(false)

  const totalSteps = LESSON.steps.length
  const halfwayPoint = Math.floor(totalSteps / 2)

  function handleStepNext() {
    const next = currentStep + 1
    if (next === halfwayPoint) {
      setShowPause(true)
    } else if (next >= totalSteps) {
      setPhase('done')
    } else {
      setCurrentStep(next)
    }
  }

  function handlePauseContinue() {
    setShowPause(false)
    setCurrentStep(halfwayPoint)
  }

  if (phase === 'intro') {
    return (
      <CharacterIntro
        character={LESSON.character}
        greeting={LESSON.greeting}
        lessonTitle={LESSON.lessonTitle}
        ageStage={LESSON.ageStage}
        onStart={() => setPhase('lesson')}
      />
    )
  }

  if (phase === 'done') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0d2b1a 0%, #1a4a2e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ maxWidth: '540px', width: '100%', textAlign: 'center' }}>

          {/* Trophy */}
          <div style={{ fontSize: '5rem', marginBottom: '16px', animation: 'bounce 1s ease-in-out infinite' }}>🏆</div>
          <h1 style={{ color: '#fff', marginBottom: '12px' }}>Mission complete!</h1>
          <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '28px' }}>
            You just learned why your brain loves screens and how to be the boss of yours. Teo is proud of you.
          </p>

          {/* Mission card */}
          <div style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--stage-5)', marginBottom: '10px' }}>
              🚀 {LESSON.mission.heading}
            </div>
            <p style={{ color: '#fff', lineHeight: 1.65, marginBottom: '12px', fontSize: '.95rem' }}>{LESSON.mission.body}</p>
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: '.82rem', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>{LESSON.mission.reward}</p>
          </div>

          {/* Family question */}
          <div style={{ background: 'var(--stage-2)', borderRadius: '14px', padding: '16px 20px', marginBottom: '32px', textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>
              💬 Talk about it tonight
            </div>
            <p style={{ color: 'var(--ink)', fontSize: '.9rem', lineHeight: 1.6, margin: 0 }}>{LESSON.familyQuestion}</p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/digi-squad" className="btn btn-gold" style={{ fontSize: '.85rem' }}>
              Meet the whole squad
            </Link>
            <Link href="/starter-pack" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)', fontSize: '.85rem' }}>
              Get more lessons
            </Link>
          </div>

          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  const step = LESSON.steps[currentStep]
  const progress = ((currentStep) / totalSteps) * 100

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* Lesson nav bar */}
      <div style={{ position: 'sticky', top: 0, zIndex: 200, background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', padding: '12px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/digi-squad" style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--ink-muted)', textDecoration: 'none', letterSpacing: '.05em', flexShrink: 0 }}>
            ← Squad
          </Link>

          {/* Progress bar */}
          <div style={{ flex: 1, height: '6px', background: 'var(--border)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--stage-1)', borderRadius: '100px', width: `${progress}%`, transition: 'width 0.4s ease' }} />
          </div>

          {/* Character chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--stage-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>⚽</div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', fontWeight: 600, color: 'var(--ink-soft)' }}>Teo</span>
          </div>
        </div>
      </div>

      {/* Lesson body */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* Lesson title */}
        <div style={{ marginBottom: '36px' }}>
          <p className="eyebrow" style={{ marginBottom: '8px' }}>Lesson with Teo · {LESSON.ageStage}</p>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)' }}>{LESSON.lessonTitle}</h1>
        </div>

        {/* DiGi Junior pause point */}
        {showPause ? (
          <DigiJuniorPause
            message={LESSON.pause.message}
            onContinue={handlePauseContinue}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <LessonStep
              type={step.type}
              character={LESSON.character}
              heading={step.heading}
              body={step.body}
              characterSays={step.characterSays}
              funFact={'funFact' in step ? step.funFact : undefined}
              stepNumber={currentStep + 1}
            />

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{ background: 'none', border: '2px solid var(--border)', borderRadius: '100px', padding: '10px 20px', fontFamily: 'var(--font-mono)', fontSize: '.78rem', color: currentStep === 0 ? 'var(--ink-light)' : 'var(--ink-soft)', cursor: currentStep === 0 ? 'default' : 'pointer' }}
              >
                ← Back
              </button>

              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--ink-muted)' }}>
                {currentStep + 1} of {totalSteps}
              </span>

              <button
                onClick={handleStepNext}
                className="btn btn-gold"
                style={{ fontSize: '.82rem', padding: '12px 28px', cursor: 'pointer' }}
              >
                {currentStep + 1 === totalSteps ? 'Finish! 🎉' : 'Next →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
