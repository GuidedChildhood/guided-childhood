import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'For Schools | Guided Childhood',
  description: 'Full digital education from EYFS to Sixth Form. 21 modules, every lesson with teacher plan, pupil worksheet, slides and parent note. Mapped to RSE, Online Safety Act, and Ofsted requirements.',
}

const CURRICULUM = [
  { stage: 'EYFS and KS1', years: 'Reception to Year 2', age: 'Ages 4 to 7', topics: ['Screens and kindness', 'Family screen routines', 'What is real online', 'Being safe with strangers'], color: 'var(--stage-1)', text: 'var(--terracotta)' },
  { stage: 'KS2', years: 'Years 3 to 6', age: 'Ages 7 to 11', topics: ['Screen routines that work', 'Gaming without meltdowns', 'How algorithms decide what you see', 'Why people share and what stays online'], color: 'var(--stage-4)', text: 'var(--terracotta)' },
  { stage: 'KS3', years: 'Years 7 to 9', age: 'Ages 11 to 14', topics: ['Mood, sleep and screens', 'Social media and social comparison', 'Deepfakes and AI-generated content', 'Group chats, pressure and privacy'], color: 'var(--stage-3)', text: 'var(--terracotta)' },
  { stage: 'KS4', years: 'Years 10 to 11', age: 'Ages 14 to 16', topics: ['Manipulation and consent online', 'Sextortion: what it is and what to do', 'Radicalisation and extremist recruitment', 'Digital reputation and permanence'], color: 'var(--stage-5)', text: 'var(--terracotta)' },
  { stage: 'KS5 and Sixth Form', years: 'Years 12 to 13', age: 'Ages 16 to 18', topics: ['AI literacy and critical thinking', 'Data rights and platform accountability', 'Digital identity post-18', 'Full independent navigation skills'], color: 'var(--stage-2)', text: 'var(--terracotta)' },
]

const PRICING = [
  { tier: 'Small', pupils: 'Up to 300 pupils', price: '£299', period: '/year', features: ['Unlimited teacher logins', 'Full curriculum pack all stages', 'Assembly materials', 'Policy and compliance templates', 'School dashboard'], cta: 'Enquire', featured: false },
  { tier: 'Medium', pupils: '300 to 800 pupils', price: '£499', period: '/year', features: ['Everything in small school', 'Parent evening pack', 'Staff CPD training module'], cta: 'Enquire', featured: true },
  { tier: 'Large / MAT', pupils: '800+ pupils or multi-academy trust', price: '£999+', period: '/year', features: ['Everything in medium school', 'Multi-site dashboard', 'Co-branded materials', 'Bespoke onboarding'], cta: 'Contact us', featured: false },
]

const MAILCHIMP_ENQUIRY = 'https://mailchi.mp/thesocialbillboard/school'

export default function SchoolsPage() {
  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em', textDecoration: 'none' }}>Guided Childhood</Link>
        <nav style={{ display: 'flex', gap: '2px' }}>
          {[['Home', '/'], ['For parents', '/'], ['Pricing', '#pricing']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 500, color: 'var(--ink-soft)', padding: '6px 13px', borderRadius: '100px', textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
        <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ padding: '9px 22px', fontSize: '.82rem' }}>
          Enquire
        </a>
      </header>

      {/* Hero */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', textAlign: 'center', background: 'var(--stage-2)', borderBottom: '1px solid var(--stage-2)' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '14px' }}>For schools and headteachers</p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-.04em', color: 'var(--ink)', marginBottom: '20px' }}>
            The ban handles access.<br /><em style={{ fontStyle: 'italic', fontWeight: 300, color: 'var(--terracotta)' }}>We handle readiness.</em><br />Ofsted will ask about the second part.
          </h1>
          <p style={{ fontSize: 'clamp(.92rem, 1.5vw, 1.1rem)', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '560px', margin: '0 auto 28px' }}>
            21 modules. EYFS to Sixth Form. Every lesson with a teacher plan, pupil worksheet, slides, and parent note. Zero prep. Full statutory alignment. Ofsted ready.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              Request a free pilot →
            </a>
            <Link href="#curriculum" className="btn btn-outline" style={{ fontSize: '1rem', padding: '16px 32px' }}>
              See the curriculum
            </Link>
          </div>
          <p style={{ marginTop: '16px', fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--ink-light)' }}>Free one-term pilot for selected schools. 48-hour response.</p>
        </div>
      </section>

      {/* 4-step how it works */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: 'var(--cream)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>How it works</p>
            <h2>Up and running in 48 hours.</h2>
          </div>
          <div className="four-col" style={{ display: 'grid', gap: '0' }}>
            {[
              { num: '01', title: 'School takes a licence', body: 'Annual licence. Immediate access for all teaching staff. No per-seat pricing, no login complications.' },
              { num: '02', title: 'Teachers log in', body: 'Every teacher has a dashboard. Lessons assigned by year group. Download or present directly. Zero prep.' },
              { num: '03', title: 'Lesson lands in the home', body: 'Every lesson includes a parent note. What was covered, the key message, and one conversation to have at home.' },
              { num: '04', title: 'Evidence ready for Ofsted', body: 'Statutory alignment document, attendance records, and curriculum overview. Your DSL has everything they need.' },
            ].map((step, i, arr) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px 20px', position: 'relative', borderRight: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '2px solid var(--stage-2)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', fontWeight: 700, color: 'var(--terracotta)' }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section id="curriculum" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>The curriculum</p>
            <h2 style={{ marginBottom: '12px' }}>21 modules. EYFS to Sixth Form.</h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>One coherent programme that builds from first screens to full independence. Not a bolt-on. Not a one off assembly. A proper scheme of work.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {CURRICULUM.map((stage, i) => (
              <div key={i} className="curriculum-row" style={{ display: 'grid', background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                <div style={{ background: stage.color, padding: '24px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: stage.text, marginBottom: '6px' }}>{stage.stage}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '.9rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '4px' }}>{stage.years}</div>
                  <div style={{ fontSize: '.75rem', color: 'var(--ink-muted)' }}>{stage.age}</div>
                </div>
                <div style={{ padding: '24px 26px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignContent: 'center' }}>
                  {stage.topics.map((topic, j) => (
                    <span key={j} style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '100px', padding: '5px 14px', fontSize: '.78rem', color: 'var(--ink-soft)', fontWeight: 500 }}>{topic}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '12px', padding: '20px 24px', marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--terracotta)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>✓</span>
            <p style={{ fontSize: '.83rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>Every lesson includes: teacher plan with learning objectives, pupil-facing worksheet, slide deck (editable), and a parent note. No additional prep needed.</p>
          </div>
        </div>
      </section>

      {/* CPD + DiGi */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: 'var(--cream)' }}>
        <div className="two-col" style={{ maxWidth: '1040px', margin: '0 auto', gap: '24px' }}>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Staff CPD</p>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '14px' }}>2-hour CPD module for DSLs and PSHE leads</h3>
            <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.78, marginBottom: '16px' }}>Covers the research base behind the programme, how to use the curriculum effectively, safeguarding application, and how to communicate with parents about digital issues at home.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Grounded in Odgers, Orben, Przybylski and Livingstone', 'KCSIE and Online Safety Act implications', 'Practical parent communication templates', 'Included in all licences'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '.83rem', color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'var(--deep-teal)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
            <p className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '12px' }}>School DiGi</p>
            <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '14px' }}>Your school safeguarding AI advisor</h3>
            <p style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.65)', lineHeight: 1.78, marginBottom: '16px' }}>School DiGi gives DSLs, PSHE leads, and teachers an instant reference for any digital safeguarding question. GDPR compliant. No student data. Available on any device.</p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Instant answers on safeguarding scenarios', 'Platform-specific guidance (TikTok, Discord, Roblox, etc)', 'Parent letter templates on demand', 'Available in Medium and Large licences'].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '8px', fontSize: '.83rem', color: 'rgba(255,255,255,.65)' }}>
                  <span style={{ color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Free assembly pack */}
      <section style={{ padding: '36px 32px', background: 'var(--stage-5)', borderTop: '1px solid var(--stage-5)', borderBottom: '1px solid var(--stage-5)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '8px' }}>Free · No strings · Ready to use today</p>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Free assembly pack for any school</h3>
            <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', maxWidth: '480px', lineHeight: 1.7 }}>A complete 45-minute assembly on digital life today, with slides, speaker notes, and a pupil handout. Works from Year 5 upward. No Guided Childhood licence needed.</p>
          </div>
          <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--terracotta)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.88rem', padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 5px 0 var(--terracotta-dark)', whiteSpace: 'nowrap' }}>
            Get the free assembly pack →
          </a>
        </div>
      </section>

      {/* Statutory alignment */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>Statutory alignment</p>
            <h2 style={{ marginBottom: '12px' }}>Covers everything Ofsted will ask about</h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>Your DSL gets a full alignment document showing exactly how each module maps to statutory requirements. No gaps. No guesswork.</p>
          </div>
          <div className="four-col" style={{ display: 'grid', gap: '12px' }}>
            {[
              { label: 'Online Safety Act 2023', desc: 'Platform duties and education requirements for under-18s.', color: 'var(--stage-2)', text: 'var(--terracotta)' },
              { label: 'Statutory RSE and RSHE', desc: 'Healthy relationships online, age-appropriate sex and relationships education.', color: 'var(--stage-4)', text: 'var(--terracotta)' },
              { label: 'Education for a Connected World (DfE)', desc: 'Full mapping to all eight strand areas, EYFS to age 18.', color: 'var(--stage-1)', text: 'var(--terracotta)' },
              { label: 'DfE AI in Education Guidance 2025', desc: 'AI literacy, deepfakes, data rights, and responsible use from KS3 upward.', color: 'var(--stage-5)', text: 'var(--terracotta)' },
            ].map((item, i) => (
              <div key={i} style={{ background: item.color, borderRadius: '14px', padding: '22px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: item.text, marginBottom: '10px' }}>{item.label}</div>
                <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '12px', padding: '16px 20px', marginTop: '16px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ color: 'var(--terracotta)', fontSize: '1rem', flexShrink: 0, marginTop: '2px' }}>✓</span>
            <p style={{ fontSize: '.82rem', color: 'var(--ink-soft)', lineHeight: 1.65 }}>KCSIE Part 2: every module addresses the safeguarding obligations for online safety. Your DSL receives a dedicated KCSIE alignment document as part of the licence.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: 'var(--cream)', scrollMarginTop: '70px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <p className="eyebrow" style={{ color: 'var(--terracotta)', marginBottom: '12px' }}>School pricing</p>
            <h2 style={{ marginBottom: '12px' }}>Simple annual licences</h2>
            <p style={{ fontSize: '1rem', color: 'var(--ink-soft)', lineHeight: 1.8, maxWidth: '500px', margin: '0 auto' }}>One licence covers all your teachers, all year groups, all 21 modules. No per-seat fees. No per-lesson charges.</p>
          </div>
          <div className="three-col" style={{ display: 'grid', gap: '12px' }}>
            {PRICING.map((plan, i) => (
              <div key={i} style={{ background: plan.featured ? 'var(--stage-2)' : '#fff', border: `2px solid ${plan.featured ? 'var(--terracotta)' : 'var(--border)'}`, borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', ...(plan.featured ? { transform: 'scale(1.025)' } : {}) }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.6rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '5px' }}>{plan.tier}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '.72rem', color: 'var(--ink-muted)', marginBottom: '14px' }}>{plan.pupils}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '20px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: '.76rem', color: 'var(--ink-muted)', marginLeft: '4px' }}>{plan.period}</span>
                </div>
                <div style={{ height: '1px', background: plan.featured ? 'var(--terracotta-lt)' : 'var(--border)', marginBottom: '16px' }} />
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px', flex: 1 }}>
                  {plan.features.map((feat, fi) => (
                    <li key={fi} style={{ display: 'flex', gap: '8px', fontSize: '.82rem', color: 'var(--ink-soft)', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--terracotta)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ width: '100%', padding: '14px', borderRadius: '12px', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '.85rem', textDecoration: 'none', display: 'block', textAlign: 'center', ...(plan.featured ? { background: 'var(--terracotta)', color: 'var(--ink)' } : { background: 'transparent', color: 'var(--ink)', border: '2px solid var(--border)' }) }}>
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '.78rem', color: 'var(--ink-muted)', marginTop: '20px' }}>
            10% discount on 2-year commitments · Free assembly pack for all enquiries · All teacher logins included
          </p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(60px, 8vw, 80px) 32px', background: 'var(--terracotta-dark)', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', marginBottom: '16px' }}>Ready to talk? We'll get back within 48 hours.</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.78, marginBottom: '28px' }}>Free pilot available for selected schools. Assembly pack available for every school, free, today.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--stage-5)', color: 'var(--ink)', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 5px 0 var(--terracotta-dark)' }}>
              Enquire now →
            </a>
            <a href={MAILCHIMP_ENQUIRY} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,.15)', border: '2px solid rgba(255,255,255,.3)', color: '#fff', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '1rem', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none' }}>
              Get the free assembly pack
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', padding: '28px 32px' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.86rem', fontWeight: 700, color: 'var(--ink-muted)', textDecoration: 'none' }}>← Guided Childhood</Link>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-light)' }}>© 2026 The Social Billboard · Justin Phillips</p>
        </div>
      </footer>
    </div>
  )
}
