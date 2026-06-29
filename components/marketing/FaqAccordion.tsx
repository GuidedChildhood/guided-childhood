'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'Is this just about social media?',
    a: 'No. Social media is one of twelve behaviour issues and eight digital literacy gaps that show up in family life. Guided Childhood covers all twenty. Gaming, sleep, mood, the TV demand at 6pm, AI literacy, online risks. The lot.',
  },
  {
    q: 'How much time does it actually take?',
    a: 'Three actions per week, each under five minutes. The weekly check-in takes two minutes. DiGi answers in seconds. Most parents spend ten minutes a week. That is genuinely all.',
  },
  {
    q: 'Is this about banning phones at home?',
    a: 'No. The research is clear: structure and timing protect children more than restriction. We give you the system to guide your child through the digital world, not to remove it from them.',
  },
  {
    q: 'My child is already a teenager. Is it too late?',
    a: 'No. There are more evenings, more car journeys, and more pickups ahead of you than behind you. The pathway starts from wherever you are. Stage 3 and 4 are specifically designed for parents who are starting mid-journey.',
  },
  {
    q: 'My partner is not on board yet.',
    a: 'Very common. Many members start on their own. The framework is evidence-based not fear-based, and most partners engage with that. Seeing it in action usually brings them around.',
  },
]

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            style={{ background: '#fff', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', fontFamily: 'var(--font-display)', fontSize: '.96rem', fontWeight: 700, color: open === i ? 'var(--terracotta)' : 'var(--ink)', border: 'none', width: '100%', textAlign: 'left', transition: 'color .15s' }}
          >
            {faq.q}
            <span style={{ fontSize: '.76rem', color: open === i ? 'var(--terracotta)' : 'var(--ink-muted)', transition: 'transform .25s', transform: open === i ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
          </button>
          {open === i && (
            <div style={{ background: 'var(--cream)', padding: '14px 22px 18px', fontSize: '.84rem', color: 'var(--ink-soft)', lineHeight: 1.78 }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
