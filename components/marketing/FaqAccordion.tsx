'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'What exactly do I get?',
    // In the parent's words first, the parts list after (the board's audience
    // lens, 12 November 2026). It used to be fifteen features in one breath.
    a: 'Help with the moments that actually happen in your house. The words to say tonight when the screen will not go off, the phone ask comes, or the group chat goes wrong. A plan for your child\'s age, from 4 to 16, so you know what to do this week and what is coming next. A quick check in that shows you, week by week, whether things are getting better. Your child gets their own app, where real jobs earn the screen time you agree. And DiGi, who remembers your family and is there at 11pm. Inside that: 160 scripts for the hard conversations, lessons by age, device setting guides, printables, and school reminders from your inbox.',
  },
  {
    q: 'Does this prepare my child for the under 16 social media ban?',
    a: 'Yes, that is the core of it. The ban, planned for spring 2027, delays the apps until 16 but teaches nothing. We build the judgement in the years before: lessons in misinformation, algorithms and AI literacy, and a passport earned stage by stage, so 16 arrives as a step, not a cliff edge. Arriving with habits beats arriving with rules.',
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
    q: 'How does DiGi work and stay safe?',
    a: 'DiGi draws on a knowledge bank built from the work of named researchers, and its answers are checked against the science every week. Every reply passes a safety check before it reaches you, and DiGi never simply allows or denies, it guides. It is a guide for everyday family life, not a crisis line: for anything serious it will always point you to real people who can help.',
  },
  {
    q: 'My child is already a teenager. Is it too late?',
    a: 'No. There are more evenings, more car journeys, and more pickups ahead of you than behind you. The pathway starts from wherever you are. Stage 3 and 4 are specifically designed for parents who are starting mid journey.',
  },
  {
    q: 'My partner is not on board yet.',
    a: 'Very common. Many members start on their own. The framework is evidence based not fear based, and most partners engage with that. Seeing it in action usually brings them around.',
  },
]

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3px' }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-tile)', overflow: 'hidden' }}>
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
