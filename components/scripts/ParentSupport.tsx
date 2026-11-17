import { INK_EDGE } from '@/components/scripts/card-system'

// "If this one is hard for you": the part of a script that is about the
// parent, not the child.
//
// Justin, 17 November 2026: make scripts "super supportive for parents,
// including known parenting struggles and how to support". Every script
// already had the words, the words to avoid, why it works, tonight's step, the
// push back and a rehearsal with DiGi. None of it said anything to the adult
// holding the phone, who is often tired, guilty about screens, and braced for
// the row.
//
// Six lines, the same on every script, because these are the struggles every
// parent brings to every conversation, not facts about one topic. It is UI
// support copy, not a script, so it lives here rather than in the scripts
// table (non negotiable 6 is about the words a parent says to a child).
//
// What each line rests on, so the copy never claims more than this:
//   calm first      co-regulation: children borrow an adult's calm before they
//                   can make their own (the attachment literature our trust
//                   framework already stands on, digi/07-trust-framework.md)
//   side by side    the same framework's "pick the moment"; a practice point,
//                   offered as one, never as a finding
//   repair          rupture and repair (Tronick); the trust framework's
//                   "repair over punishment"
//   practise once   parent training programmes that had parents practise the
//                   new skill with their own child showed larger effects
//                   (Kaminski et al 2008, 77 programmes); hence the link up to
//                   Rehearse with DiGi
//   guilt           not a claim, a kindness; 54 percent of UK parents regret
//                   the first smartphone (THE-STORY, section 2)
//   same page       consistency between carers is one of the components with
//                   larger effects in the same 2008 review
//
// Closed by default. A parent mid row came for the words, which sit above;
// this is for the parent who has a minute before the conversation.

const LINES: { head: string; body: string }[] = [
  { head: 'Calm first, then talk.', body: 'If you are wound up, wait. Children borrow our calm before they can make their own, so your voice is half the message.' },
  { head: 'Pick the moment, not the fight.', body: 'Side by side often goes better than face to face: in the car, on a walk, over the washing up. Never in the middle of the row.' },
  { head: 'Practise it once.', body: 'Saying the words out loud before you need them is what makes them come out right. Rehearse with DiGi, just below, takes two minutes.' },
  { head: 'It will not go perfectly.', body: 'If it goes wrong, come back later and say "I did not handle that well earlier. Can we try again?" Repair teaches more than getting it right first time.' },
  { head: 'Feeling guilty about screens?', body: 'Most parents do, and over half regret giving the first phone when they did. You are here reading the words, which is the plan most families never get.' },
  { head: 'Not on the same page as their other parent?', body: 'Share this script with them first, so you both say the same thing. Saying it the same way is what makes it stick.' },
]

export default function ParentSupport() {
  return (
    <details style={{ background: 'var(--tint-sage)', border: INK_EDGE, borderRadius: 'var(--radius-card)', padding: '4px 18px' }}>
      <summary style={{ cursor: 'pointer', listStyle: 'none', minHeight: 48, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', color: 'var(--ink)' }}>
        <span aria-hidden>💛</span>
        <span style={{ flex: 1 }}>If this one is hard for you</span>
        <span aria-hidden style={{ color: 'var(--ink-muted)', fontSize: 'var(--text-sm)' }}>›</span>
      </summary>
      <ul style={{ listStyle: 'none', margin: '4px 0 14px', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {LINES.map(l => (
          <li key={l.head} style={{ fontSize: 'var(--text-base)', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--ink)', fontWeight: 800 }}>{l.head}</strong> {l.body}
          </li>
        ))}
      </ul>
    </details>
  )
}
