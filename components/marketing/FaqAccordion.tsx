'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'What exactly do I get?',
    a: 'The stage pathway from age 4 to 16, built for the moment social media arrives at 16. Daily moments with the exact words for the friction points of the day: the morning routine, homework, the gaming handover, bedtime. 160 scripts for the hard conversations. DiGi, the AI parenting advisor trained on the research, available at 11pm. Device setting checklists, per device and per age, iPhone first. The wellbeing tracker with weekly check ins. The family agreement builder you print and both sign. 100 lessons for digital home schooling. And a weekly advice email written like a parent, not a robot. School reminders, where you forward the school\'s emails and the dates appear as alerts, are coming soon.',
  },
  {
    q: 'Is this just about social media?',
    a: 'No. Social media is one of twelve behaviour issues and eight digital literacy gaps that show up in family life. Guided Childhood covers all twenty. Gaming, sleep, mood, the TV demand at 6pm, AI literacy, online risks. The lot.',
  },
  {
    q: 'How much time does it actually take?',
    a: 'One daily moment takes about five minutes. The weekly check in takes two. DiGi answers in seconds. If all you do this week is read one script before a hard conversation, that still counts.',
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
