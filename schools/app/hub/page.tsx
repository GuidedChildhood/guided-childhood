import Link from 'next/link'
import { PAGE, PAGE_SHELL } from '@gc/shared/page-scale'
import HappyIcon, { type HappyIconName } from '@gc/shared/components/HappyIcon'
import { CRAYON, type CrayonName } from '@gc/shared/happy-news'
import YourSchoolPanel from './YourSchoolPanel'
import { navAccess } from '@/lib/licence'

export const metadata = { title: 'The Hub' }

// THE HUB: everything a school needs around the lessons, one click deep.
// The anti Jigsaw: their Knowledge Hub buries compliance gold in a messy
// portal. Ours is one clean page: statutory mapping, policy and parents,
// data protection, safeguarding, CPD, FAQs. Every document prints.

const eyebrow: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--ink-muted)',
}

// THE DRAWN ICONS (20 September 2026). The tiles drew fourteen emoji, which
// is another company's artwork in another company's style, rendering
// differently on every laptop in a staffroom. Justin: "can we use happy news
// icons on lessons, since we have icons". Each tile now carries one of the
// house's own drawn icons on a crayon disc with an ink edge, the same finish
// the parents app gives its passport and its jobs board. The disc colours
// rotate through the crayon box so the grid reads as a cheerful scatter and
// never as a category the head has to decode.
// THE HUB AS A LAUNCHER (23 November 2026). Justin: Apple level, obvious
// buttons, not too texty (plans/2026-11-23-schools-ux-review.md). It was 19
// cards of equal weight, a long paragraph each, and a form: 971 words before
// a head found anything. Now it asks one question, "What do you need today?",
// and answers with six jobs. Each job opens its main page from the title and
// its other pages from the chips under it, so every document is still one tap
// away and none needs a paragraph to be found.
type Link_ = { href: string; label: string }
type Job = { icon: HappyIconName; disc: CrayonName; title: string; line: string; main: Link_; more: Link_[] }

const JOBS: Job[] = [
  {
    icon: 'calendar', disc: 'butter', title: 'Teach this week', line: 'Find the lesson for your year group.',
    main: { href: '/start', label: 'Find my lesson' },
    more: [
      { href: '/curriculum', label: 'The whole map' },
      { href: '/hub/year-plan', label: 'Year plan' },
      { href: '/hub/progression', label: 'Progression map' },
      { href: '/print/look-back', label: 'Look back quiz' },
      { href: '/hub/vocabulary', label: 'Vocabulary' },
      { href: '/languages/fr', label: 'KS2 French' },
    ],
  },
  {
    icon: 'quiz', disc: 'green', title: 'Show what we cover', line: 'For governors, Ofsted and a deep dive.',
    main: { href: '/hub/rshe-mapping', label: 'RSHE mapping' },
    more: [
      { href: '/hub/computing-mapping', label: 'Computing map' },
      { href: '/hub/coverage', label: 'What has been taught' },
      { href: '/hub/subject-lead', label: 'Subject lead kit' },
    ],
  },
  {
    icon: 'passport', disc: 'sky', title: 'Our records', line: 'Which class had which lesson, and how it went.',
    main: { href: '/hub/progress', label: 'Class progress' },
    more: [
      { href: '/hub/tracker', label: 'Lesson tracker' },
      { href: '/hub/passport', label: 'Passport pages' },
    ],
  },
  {
    icon: 'shield', disc: 'coral', title: 'Safeguarding', line: 'The DSL view of every sensitive lesson.',
    main: { href: '/hub/dsl', label: 'Safeguarding crosswalk' },
    more: [
      { href: '/hub/cpd', label: 'Staff briefings' },
      { href: '#your-school', label: 'Your safeguarding names' },
    ],
  },
  {
    icon: 'friends', disc: 'pink', title: 'Parents', line: 'Bring families with you.',
    main: { href: '/hub/parents', label: 'Parent pack' },
    more: [
      { href: '/hub/faq', label: 'Common questions' },
    ],
  },
  {
    icon: 'read', disc: 'teal', title: 'Staff and policy', line: 'Start the scheme and file the paperwork.',
    main: { href: '/hub/induction', label: 'Fifteen minute induction' },
    more: [
      { href: '/hub/policy', label: 'Policy text' },
      { href: '/hub/data-protection', label: 'Data protection' },
      { href: '/hub/ai-governance', label: 'AI governance' },
      { href: '/hub/accessibility', label: 'Accessibility' },
    ],
  },
]

// The disc: a crayon fill under an ink edge, the drawn icon on top. Sized in
// em so a head on Larger Text gets a bigger disc rather than a squeezed one.
function Disc({ icon, disc }: { icon: HappyIconName; disc: CrayonName }) {
  return (
    <span aria-hidden style={{
      flexShrink: 0, width: '2.9em', height: '2.9em', borderRadius: '50%',
      background: CRAYON[disc], border: '2px solid var(--ink)', boxSizing: 'border-box',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 3px 0 var(--ink)',
    }}>
      <HappyIcon name={icon} size={30} />
    </span>
  )
}

export default async function HubPage() {
  // The French link shows only to whoever the languages area is open to
  // (lib/languages-access.ts languagesOpenToSchools): while it is private,
  // that is Justin's own languages code, and nobody else sees the way in.
  const { languages } = await navAccess()
  const jobs = JOBS.map(j => ({ ...j, more: j.more.filter(m => languages || !m.href.startsWith('/languages')) }))
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', padding: PAGE_SHELL }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ ...eyebrow, color: 'var(--green-dark)', marginBottom: 'var(--space-1)' }}>The Hub</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, ...PAGE.page, color: 'var(--ink)', margin: '0 0 var(--space-2)' }}>
          What do you need today?
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)', color: 'var(--ink-soft)', lineHeight: 1.6, margin: '0 0 var(--space-5)' }}>
          Everything around the lessons. Every page prints.
        </p>

        <div className="gc-hub-jobs">
          {jobs.map(j => (
            <section key={j.title} className="gc-hub-job" aria-labelledby={`job-${j.disc}`}>
              <Link href={j.main.href} className="gc-tap gc-hub-main">
                <Disc icon={j.icon} disc={j.disc} />
                <span style={{ minWidth: 0 }}>
                  <span id={`job-${j.disc}`} className="gc-hub-title">{j.title}</span>
                  <span className="gc-hub-line">{j.line}</span>
                  <span className="gc-hub-go">{j.main.label} →</span>
                </span>
              </Link>
              <ul className="gc-hub-more" aria-label={`More for ${j.title.toLowerCase()}`}>
                {j.more.map(m => (
                  <li key={m.href}>{m.href.startsWith('#') ? <a href={m.href} className="gc-tap">{m.label}</a> : <Link href={m.href} className="gc-tap">{m.label}</Link>}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* THE ONE THING ONLY THE SCHOOL CAN SAY (20 September 2026): the
            names the safeguarding slides carry. Below the jobs now, reached
            from the Safeguarding job, because it is set once and the jobs are
            what a teacher comes for. */}
        <div style={{ marginTop: 'var(--space-6)' }}>
          <YourSchoolPanel />
        </div>
      </div>
      <style>{`
        .gc-hub-jobs { display: grid; grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); gap: var(--space-3); }
        .gc-hub-job { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius-card); padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); box-shadow: 0 1px 2px rgba(23,60,70,0.04), 0 14px 36px -20px rgba(23,60,70,0.30); }
        .gc-hub-main { display: flex; gap: var(--space-3); align-items: flex-start; text-decoration: none; color: inherit; border-radius: 12px; }
        .gc-hub-title { display: block; font-family: var(--font-display); font-weight: 900; font-size: var(--text-xl); color: var(--ink); line-height: 1.15; }
        .gc-hub-line { display: block; font-family: var(--font-body); font-size: var(--text-base); color: var(--ink-soft); line-height: 1.45; margin-top: 4px; }
        .gc-hub-go { display: inline-block; margin-top: var(--space-2); font-family: var(--font-display); font-weight: 800; font-size: var(--text-base); color: var(--ink); text-decoration: underline; text-decoration-color: var(--butter); text-decoration-thickness: 3px; text-underline-offset: 4px; }
        .gc-hub-main:hover .gc-hub-go { text-decoration-color: var(--ink); }
        .gc-hub-more { list-style: none; margin: auto 0 0; padding: var(--space-3) 0 0; border-top: 1px solid var(--border); display: flex; flex-wrap: wrap; gap: var(--space-2); }
        .gc-hub-more a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 14px; border-radius: var(--radius-pill); border: 1.5px solid var(--border); background: var(--cream); font-family: var(--font-body); font-weight: 700; font-size: var(--text-sm); color: var(--ink); text-decoration: none; }
        .gc-hub-more a:hover { border-color: var(--ink); }
        .gc-hub-main:focus-visible, .gc-hub-more a:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
      `}</style>
    </main>
  )
}
