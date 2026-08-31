import Link from 'next/link'
import type { Metadata } from 'next'

// THE PHILOSOPHY PAGE, open to the world by design (the open map decision
// extended, 31 August 2026): a head, a journalist or a hostile expert can
// trace every design decision in the scheme to a named source, see where we
// align, where we differ, and where the evidence is genuinely unsettled.
// Ordered regulators, then scientists, then practitioners, then schools,
// then us, so every claim sits on something checkable before we speak.
//
// EVERY sentence here comes from the verified research files in /research
// (grades VERIFIED or LIKELY with paraphrase). Rules enforced: never a
// causal mental illness claim, never an implied endorsement, never "safe"
// as a promise, no dashes in copy. If a claim cannot be traced, it does
// not go on this page.

export const metadata: Metadata = {
  title: 'Our Philosophy: Why Taught Beats Banned',
  description:
    'Why the Guided Childhood curriculum teaches staged digital readiness: the statutory guidance, the Cambridge and Oxford research, the clinical voices, and the schools that restrict and teach at the same time. Every claim sourced, every difference stated.',
  alternates: { canonical: 'https://schools.guidedchildhood.com/philosophy' },
}

const eyebrow = (color = 'var(--terracotta-dark)'): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color,
})

const h2: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontWeight: 900,
  fontSize: 'clamp(1.7rem, 3.4vw, 2.5rem)', letterSpacing: '-0.03em',
  lineHeight: 1.1, color: 'var(--ink)', marginBottom: '14px',
}

const body: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: 'var(--text-md)',
  color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: '68ch',
}

const card: React.CSSProperties = {
  background: '#fff', border: '1px solid var(--border)', borderRadius: '20px',
  padding: '24px 26px', boxShadow: '0 1px 2px rgba(46,40,24,0.05), 0 24px 50px -30px rgba(46,40,24,0.35)',
}

const srcLink: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600,
  color: 'var(--ink-muted)',
}

// One entry per source: what they hold, where we align, where we differ.
// The differ line is load bearing: it is what makes the align lines credible.
type Voice = {
  name: string
  who: string
  holds: string
  align: string
  differ: string
  source: { label: string; href: string }
}

const REGULATORS: Voice[] = [
  {
    name: 'The RSHE guidance',
    who: 'Department for Education, published July 2025',
    holds: 'Relationships, sex and health education must cover online harms, and the guidance becomes compulsory in schools on 1 September 2026. It names the areas schools must now teach, including deepfakes, misogynistic content, gambling and the harms of pornography.',
    align: 'We teach first by construction: every module is mapped to this guidance line by line, and the mapping matrix is public on this site.',
    differ: 'The guidance is mostly about protection from harm. We add the positive capability side: what a child should be able to do well, not only what they should avoid.',
    source: { label: 'gov.uk, RSHE guidance', href: 'https://www.gov.uk/government/publications/relationships-education-relationships-and-sex-education-rse-and-health-education' },
  },
  {
    name: 'Keeping Children Safe in Education 2026',
    who: 'Statutory safeguarding guidance, in force 1 September 2026',
    holds: 'Schools must address online risk through the four Cs of content, contact, conduct and commerce, and the 2026 edition names generative AI, deepfakes, misinformation, disinformation and conspiracy theories.',
    align: 'We adopt its risk spine verbatim, and the public mapping shows which module teaches each newly named risk.',
    differ: 'KCSIE never hands responsibility to the child. We progressively do, because a sixteen year old with no practised judgement is the risk the guidance cannot reach.',
    source: { label: 'gov.uk, KCSIE', href: 'https://www.gov.uk/government/publications/keeping-children-safe-in-education--2' },
  },
  {
    name: 'Education for a Connected World',
    who: 'UK Council for Internet Safety framework',
    holds: 'Eight strands of online life a child should understand, from self image to copyright, described age by age from 4 to 18.',
    align: 'It is the skeleton of our whole scheme: twenty one modules covering all eight strands, Reception to Year 13.',
    differ: 'It is a framework, not lessons. We are the lessons.',
    source: { label: 'gov.uk, EfCW framework', href: 'https://www.gov.uk/government/publications/education-for-a-connected-world' },
  },
]

const SCIENTISTS: Voice[] = [
  {
    name: 'Amy Orben and colleagues',
    who: 'MRC Cognition and Brain Sciences Unit, University of Cambridge',
    holds: 'Their 2022 Nature Communications study found age windows where social media use and lower life satisfaction are most closely linked: around 11 to 13 for girls, 14 to 15 for boys, and 19 for both. The work is correlational, the effects are small, and Orben herself says the causal evidence on smartphones and children remains limited.',
    align: 'The windows are the strongest peer reviewed basis for staging readiness by age rather than switching it on at a birthday, and our KS3 timing leans on them.',
    differ: 'We never cite this work as proof that social media causes mental illness, because its authors say it shows no such thing. Where the evidence is unsettled, our pages say so.',
    source: { label: 'Nature Communications, 2022', href: 'https://www.nature.com/articles/s41467-022-29296-3' },
  },
  {
    name: 'Sander van der Linden',
    who: 'Social Decision-Making Lab, University of Cambridge',
    holds: 'People resist manipulation best when they practise the techniques in weakened form first. His inoculation studies with Google Jigsaw, published in Science Advances, reached tens of millions through prebunking videos. Responding to the under 16 ban, he argued bans alone lack an evidence base and called for major investment in digital literacy, and Cambridge coverage describes him discussing a social media passport built on gradual, supervised exposure.',
    align: 'Inoculation is exactly how our misinformation modules teach: meet the trick in the classroom before the feed serves it for real. And gradual, supervised, earned exposure is our passport thesis stated by a Cambridge lab.',
    differ: 'His passport is an idea discussed in public research commentary, not our product, and he has no connection to us. We simply built the thing the argument points at.',
    source: { label: 'University of Cambridge, June 2026', href: 'https://www.cam.ac.uk/research/news/social-media-ban-for-under-16s-in-the-uk-cambridge-expert-reaction' },
  },
  {
    name: 'Andrew Przybylski and Pete Etchells',
    who: 'Oxford Internet Institute and Bath Spa University',
    holds: 'The largest studies of teenage screen use found moderate use was not linked to harm, and both argue the useful question is not how much screen time but what it contains and what it displaces.',
    align: 'Calibrated guidance over blanket rules is our first non negotiable: never a flat allow or deny, always a pathway.',
    differ: 'They would ask us to justify any specific age we stage a skill at, so every stage decision on this site says why it sits where it sits.',
    source: { label: 'Psychological Science, 2017', href: 'https://journals.sagepub.com/doi/10.1177/0956797616678438' },
  },
  {
    name: 'The school phones evidence, both sides',
    who: 'University of Birmingham 2025 and the Norwegian School of Economics 2024',
    holds: 'The first worldwide study of school phone policies, in The Lancet Regional Health Europe, found restrictive policies alone were not associated with better wellbeing or attainment, and its authors called for comprehensive approaches reaching home as well as school. A Norwegian study found middle school phone bans did improve girls’ grades and cut bullying. Both are real findings and we cite both.',
    align: 'Bans help inside the school gate. They do not build the judgement a child uses at home, at a friend’s house, and at sixteen. That gap is precisely what a taught curriculum fills.',
    differ: 'Neither study tested our curriculum. We claim the gap, not the cure.',
    source: { label: 'The Lancet Regional Health Europe, 2025', href: 'https://www.thelancet.com/journals/lanepe/article/PIIS2666-7762(25)00003-1/fulltext' },
  },
  {
    name: 'Candice Odgers',
    who: 'Professor of Psychological Science, University of California, Irvine',
    holds: 'Writing in Nature, she warned that the claim phones are rewiring children’s brains and causing an epidemic of mental illness is not supported by the science, and that blame aimed at social media can distract from real causes.',
    align: 'Her test is our editorial standard: nothing goes on these pages that could not be defended to her.',
    differ: 'She would challenge any implied claim that our programme improves mental health, so we never make one. The passport records preparation, never a health outcome.',
    source: { label: 'Nature, 2024', href: 'https://www.nature.com/articles/d41586-024-00902-2' },
  },
  {
    name: 'The Royal College of Paediatrics and Child Health',
    who: 'The UK professional body for children’s doctors',
    holds: 'Its screen time guidance found no evidence for a single safe or harmful threshold and recommends families negotiate screen use around each child’s needs, protecting sleep, activity and time together.',
    align: 'Negotiated, child specific screen agreements are what our routines modules teach children to build with their families.',
    differ: 'The guidance predates the ban debate, so we cite it for the negotiation principle, not for any position on the ban.',
    source: { label: 'RCPCH guidance', href: 'https://www.rcpch.ac.uk/resources/screen-time-online-harms-resources-members' },
  },
]

const PRACTITIONERS: Voice[] = [
  {
    name: 'Catherine Knibbs',
    who: 'UK child trauma psychotherapist and cyberpsychologist, author of Children, Technology and Healthy Development (2021) and Online Harms and Cybertrauma (2023)',
    holds: 'In Tech Smart Parenting (2025) she argues that asking whether to ban screens is the wrong question, and that blanket rules a child experiences as unfair push the child away from the adults they most need. Her clinical teaching is that the adult’s first reaction to what a child has seen decides whether that child ever tells again, and that confiscating the device as punishment teaches children to hide harm rather than report it.',
    align: 'That calm, no shame, no reflex confiscation response is written into our teacher scripts from the very first Reception lesson, and our help seeking strand exists so telling a grown up always stays safe.',
    differ: 'She is a therapist and safeguarding trainer with her own frame, and she has no connection to this product. We cite her published argument, nothing more.',
    source: { label: 'Routledge author page', href: 'https://www.routledge.com/authors/i18946-catherine-knibbs' },
  },
  {
    name: 'Dr Becky Kennedy and Good Inside',
    who: 'Clinical psychologist, author of Good Inside',
    holds: 'Sturdy leadership: the parent stays the calm, boundaried pilot of the plane, connection before correction, and a child’s hardest moments are the moments that most need a steady adult.',
    align: 'The register DiGi speaks in, and the way our parent notes talk to families, are shaped by that language of sturdy, warm authority.',
    differ: 'Good Inside is a parenting philosophy, not a digital curriculum, and no affiliation exists. The framing is kinship, not endorsement.',
    source: { label: 'goodinside.com', href: 'https://www.goodinside.com' },
  },
  {
    name: 'Devorah Heitner',
    who: 'Author of Screenwise, PhD, Northwestern University',
    holds: 'Children need mentoring more than monitoring in their digital lives: engaged adult guidance inside their digital world beats surveillance of it.',
    align: 'Mentorship is the whole method here. We hold no pupil data and sell no surveillance, because a watched child is not a taught child.',
    differ: 'None worth the name. This is the closest published kin to how the product works.',
    source: { label: 'Screenwise', href: 'https://devorahheitner.com/screenwise/' },
  },
  {
    name: 'Common Sense Media',
    who: 'The largest digital citizenship curriculum in the United States',
    holds: 'Digital citizenship can and should be taught in schools, free at the point of use, from kindergarten up.',
    align: 'We share the founding belief entirely: this is taught, not blocked. Their two decades of classroom material proved the category.',
    differ: 'Common Sense is built for American schools and carries no UK statutory mapping. We are built on the UK frameworks a head is inspected against, and we cite Common Sense as kinship, never as UK alignment.',
    source: { label: 'commonsense.org', href: 'https://www.commonsense.org/education' },
  },
]

const SCHOOLS_PROOF = [
  {
    title: 'The principles our lessons run on',
    body: 'Every lesson follows the principles of instruction Barak Rosenshine set out in 2012: review, small steps, worked examples, guided then independent practice, checks on every child. The same principles are summarised by Eton’s own teaching research centre and adopted across some of England’s largest school groups. Our six phase lesson is that research given a fixed, visible shape.',
    source: { label: 'American Educator, 2012', href: 'https://www.aft.org/ae/spring2012/rosenshine' },
  },
  {
    title: 'Retrieval first, every lesson',
    body: 'Each lesson opens with retrieval practice, the technique decades of research shows beats restudying for long term memory. Explicit, teacher led instruction of this kind is the method behind Michaela Community School, which recorded the highest Progress 8 score of any school in England three years running.',
    source: { label: 'Review of Educational Research, 2017', href: 'https://journals.sagepub.com/doi/abs/10.3102/0034654316689306' },
  },
  {
    title: 'What the best systems do',
    body: 'Singapore builds Cyber Wellness into its national Character and Citizenship syllabus from primary school. Finland has taught media literacy across its curriculum since 2014, starting in early childhood, and ranks first in Europe for media literacy every year the index has run. Estonia makes digital competence one of eight key competences for every pupil. The world’s strongest systems treat this as curriculum, not as an assembly.',
    source: { label: 'Singapore MOE, Cyber Wellness', href: 'https://www.moe.gov.sg/education-in-sg/our-programmes/cyber-wellness' },
  },
  {
    title: 'What the best private schools do',
    body: 'Eton hands its youngest boarders a simple Nokia instead of a smartphone, and pairs the restriction with structured digital education through its research centre. Alleyn’s in London collects phones in Years 7 to 11 and runs a taught Digital Academy alongside. The pattern at the top of the independent sector is restrict and teach, never restrict alone. This curriculum is the teach half, ready made.',
    source: { label: 'Alleyn’s Digital Academy', href: 'https://www.alleyns.org.uk/news/2023-01-18/alleyn-s-launches-digital-academy' },
  },
]

export default function PhilosophyPage() {
  return (
    <main style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '64px', padding: '0 clamp(16px, 4vw, 40px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: 'rgba(249,248,246,0.82)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-md)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', textDecoration: 'none', whiteSpace: 'nowrap' }}>
          ⭐ Guided Childhood <span style={{ color: 'var(--terracotta-dark)' }}>Schools</span>
        </Link>
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Link href="/curriculum" style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--ink-soft)', padding: '8px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>The map</Link>
        </nav>
      </header>

      <div style={{ maxWidth: '880px', margin: '0 auto', padding: '56px 20px 100px' }}>
        {/* Hero */}
        <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '10px' }}>Our philosophy · every claim sourced</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(2.1rem, 5.5vw, 3.2rem)', letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ink)', marginBottom: '18px', maxWidth: '18ch' }}>
          Readiness is taught. So we teach it.
        </h1>
        <p style={{ ...body, fontSize: 'var(--text-lg)', marginBottom: '14px' }}>
          The under 16 social media ban is coming, and it will take the apps. It will not build the judgement a young person uses the day full access arrives, or at a friend&rsquo;s house the evening before. We believe that judgement is a taught skill, built in stages across the whole of childhood, earned onto a passport a child is proud of, and practised before it is needed.
        </p>
        <p style={{ ...body, marginBottom: '40px' }}>
          This page shows where that belief comes from: the regulators we are mapped to, the scientists whose findings shaped the staging, the clinicians whose practice shaped the scripts, and the schools whose methods shaped the lessons. For each one we say where we align and where we differ, because a scheme that only quotes its friends agreeing has not been honest with you.
        </p>

        {/* Regulators */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '6px' }}>First, the law of the land</p>
          <h2 style={h2}>The regulators</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {REGULATORS.map(v => (
              <article key={v.name} style={card}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '2px' }}>{v.name}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '10px' }}>{v.who}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}>{v.holds}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '6px' }}><strong style={{ color: 'var(--green-dark)' }}>Where we align:</strong> {v.align}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}><strong style={{ color: 'var(--terracotta-dark)' }}>Where we differ:</strong> {v.differ}</p>
                <a href={v.source.href} style={srcLink} target="_blank" rel="noopener noreferrer">Source: {v.source.label} ↗</a>
              </article>
            ))}
          </div>
        </section>

        {/* Scientists */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '6px' }}>Then, the evidence, including the parts that cut against us</p>
          <h2 style={h2}>The scientists</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {SCIENTISTS.map(v => (
              <article key={v.name} style={card}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '2px' }}>{v.name}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '10px' }}>{v.who}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}>{v.holds}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '6px' }}><strong style={{ color: 'var(--green-dark)' }}>Where we align:</strong> {v.align}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}><strong style={{ color: 'var(--terracotta-dark)' }}>Where we hold back:</strong> {v.differ}</p>
                <a href={v.source.href} style={srcLink} target="_blank" rel="noopener noreferrer">Source: {v.source.label} ↗</a>
              </article>
            ))}
          </div>
        </section>

        {/* Practitioners */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '6px' }}>Then, the people in the room with children</p>
          <h2 style={h2}>The practitioners</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {PRACTITIONERS.map(v => (
              <article key={v.name} style={card}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', marginBottom: '2px' }}>{v.name}</h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--ink-muted)', marginBottom: '10px' }}>{v.who}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}>{v.holds}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '6px' }}><strong style={{ color: 'var(--green-dark)' }}>Where we align:</strong> {v.align}</p>
                <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}><strong style={{ color: 'var(--terracotta-dark)' }}>The honest line:</strong> {v.differ}</p>
                <a href={v.source.href} style={srcLink} target="_blank" rel="noopener noreferrer">Source: {v.source.label} ↗</a>
              </article>
            ))}
          </div>
        </section>

        {/* Schools proof */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '6px' }}>Then, the classrooms that prove the method</p>
          <h2 style={h2}>Built the way the best schools teach</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
            {SCHOOLS_PROOF.map(s => (
              <article key={s.title} style={{ ...card, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)' }}>{s.title}</h3>
                <p style={{ ...body, fontSize: 'var(--text-base)' }}>{s.body}</p>
                <a href={s.source.href} style={{ ...srcLink, marginTop: 'auto' }} target="_blank" rel="noopener noreferrer">Source: {s.source.label} ↗</a>
              </article>
            ))}
          </div>
        </section>

        {/* Where we stand */}
        <section style={{ marginBottom: '48px' }}>
          <p style={{ ...eyebrow('var(--green-dark)'), marginBottom: '6px' }}>And finally, us</p>
          <h2 style={h2}>Where we stand</h2>
          <div style={{ ...card, background: 'var(--stage-1, #FDF4D9)', border: '2px solid var(--terracotta)' }}>
            <ul style={{ margin: 0, paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Never allow or deny. Every answer in every lesson is a calibrated pathway, because judgement is the thing being taught.',
                'Staged, because the science is staged. Skills arrive when the evidence and the frameworks say a child can hold them, not at a marketing age.',
                'Assessment is Demonstrated or Not Yet. Never pass or fail, never a percentage, never a score stored against a child, and Not Yet simply rolls forward.',
                'School and home teach one message. Lessons in class earn credit toward the same passport to sixteen a family follows in the parents app.',
                'No pupil data, ever. No child accounts, no logins, no tracking. Paper carries the pupil work and one code opens the curriculum for a whole school.',
                'The ban is not the plan. It removes the apps until sixteen. The years before sixteen are exactly when the judgement has to be built, and that is the job this curriculum does.',
              ].map(line => (
                <li key={line} style={{ ...body, fontSize: 'var(--text-base)', color: 'var(--ink)' }}>{line}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* What we never say */}
        <section style={{ marginBottom: '48px' }}>
          <h2 style={{ ...h2, fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)' }}>What we will never tell you</h2>
          <div style={{ ...card, borderStyle: 'dashed' }}>
            <p style={{ ...body, fontSize: 'var(--text-base)', marginBottom: '10px' }}>
              We will never tell you social media has been proven to cause mental illness, because the researchers we cite say the causal evidence is unsettled. We will never tell you a child who completes this curriculum is safe online, because no curriculum can promise that. And no expert named on this page endorses this product: we cite their published work as the ground we build on, nothing more.
            </p>
            <p style={{ ...body, fontSize: 'var(--text-base)' }}>
              What we will say is this: readiness at sixteen is an educational judgement made by teachers and families with evidence in front of them. Preparation reduces risk. It does not remove it. A scheme that promises more than that is selling you something other than education.
            </p>
          </div>
        </section>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/curriculum" className="btn btn-gold" style={{ padding: '15px 30px', fontSize: 'var(--text-md)' }}>
            See the curriculum this builds
          </Link>
          <Link href="/hub/rshe-mapping" style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-md)', padding: '15px 28px', borderRadius: '16px', textDecoration: 'none', color: 'var(--ink)', background: '#fff', border: '2px solid var(--border)' }}>
            Check the statutory mapping
          </Link>
        </div>
      </div>
    </main>
  )
}
