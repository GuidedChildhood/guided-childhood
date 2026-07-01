import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ban Workarounds | Guided Childhood',
  description: 'The under-16 social media ban starts Spring 2027. Workarounds are already happening. What they are, why they are dangerous, what schools see, and how to lock down every account.',
}

const WORKAROUNDS = [
  {
    icon: '🔒',
    label: 'VPNs',
    desc: 'Hides location and identity. Platforms designed for adults are freely available on any app store. A 10 year old can install a VPN in under two minutes.',
    tag: 'Most common',
    tagBg: 'var(--stage-1)',
    tagColor: 'var(--terracotta)',
  },
  {
    icon: '📅',
    label: 'False date of birth',
    desc: 'Most platforms ask for a date of birth at signup. There is no verification. Children have entered false ages since social media began and will continue to do so.',
    tag: 'Always existed',
    tagBg: 'var(--stage-5)',
    tagColor: 'var(--terracotta)',
  },
  {
    icon: '👤',
    label: 'Parent or sibling account',
    desc: 'Borrowing a logged-in adult account bypasses the ban entirely. No detection, no flag, no log. The algorithm treats them as an adult from that moment on.',
    tag: 'Very common',
    tagBg: 'var(--stage-1)',
    tagColor: 'var(--terracotta)',
  },
  {
    icon: '🎮',
    label: 'Gaming platforms',
    desc: 'Discord, Steam, Roblox and Xbox Live all carry social features outside the ban. Group chats, voice calls, image sharing and video links all operate freely.',
    tag: 'Often missed',
    tagBg: 'var(--stage-4)',
    tagColor: 'var(--terracotta)',
  },
  {
    icon: '🌍',
    label: 'International app versions',
    desc: 'A VPN plus a non-UK App Store account gives access to app versions without UK age restrictions. The ban is UK law. It does not apply to overseas servers.',
    tag: 'Growing fast',
    tagBg: 'var(--stage-2)',
    tagColor: 'var(--terracotta)',
  },
  {
    icon: '💬',
    label: 'Unregulated messaging',
    desc: 'Telegram, newer chat apps and peer-to-peer platforms are outside the same scope. Sharing content from banned platforms continues through these channels.',
    tag: 'Underestimated',
    tagBg: 'var(--stage-5)',
    tagColor: 'var(--terracotta)',
  },
]

const HARMS = [
  {
    title: 'No content filtering at all',
    desc: 'The algorithm does not know it is serving a child. Adult mode means adult content, graphic news, extreme material and no guardrails. Teen settings do not exist on an adult account.',
    accent: 'var(--terracotta)',
    bg: 'var(--stage-1)',
  },
  {
    title: 'Grooming risk is dramatically higher',
    desc: 'Teen settings block unknown adults from messaging. On an adult account those protections are completely off. Any stranger can contact your child and they look like a peer.',
    accent: 'var(--terracotta)',
    bg: 'var(--stage-1)',
  },
  {
    title: 'No help when something goes wrong',
    desc: 'A child using a fake or parent account cannot report abuse without revealing they should not be there. So they go silent. The harm compounds and you never find out.',
    accent: 'var(--terracotta-dark)',
    bg: 'var(--terracotta-lt)',
  },
  {
    title: 'Deception becomes the habit',
    desc: 'Getting around one rule teaches that rules are optional. That lesson compounds into every boundary you try to set at home, at school, and later in life.',
    accent: 'var(--terracotta)',
    bg: 'var(--stage-5)',
  },
  {
    title: 'You lose all visibility',
    desc: 'You cannot monitor an account you do not know exists. Workarounds make meaningful supervision structurally impossible without a different kind of conversation.',
    accent: 'var(--terracotta)',
    bg: 'var(--stage-4)',
  },
  {
    title: 'Sleep and mood impact worsens',
    desc: 'Teen mode screen time limits do not apply to adult accounts. Late-night use is unlimited. The impact on sleep, anxiety and next-day functioning is direct and measurable.',
    accent: 'var(--terracotta)',
    bg: 'var(--stage-4)',
  },
]

const SCHOOL_SIGNALS = [
  'VPN apps appearing on school devices or the school network',
  'Peer clusters where some children reference content or trends others cannot place',
  'New slang, sounds, or in-group references that no staff can trace to a known platform',
  'Children becoming distressed or disruptive when separated from phones at key moments',
  'Social drama and bullying migrating to platforms where parents and staff have no visibility',
  'Requests to borrow phones or share login credentials between pupils',
  'A sharp divide in social groups where some children seem to have access and others do not',
  'Pupils referencing real events or public figures in ways that suggest heavy unfiltered consumption',
]

const PARENT_SIGNALS = [
  'They reference platform trends, sounds or slang that they should not know about',
  'The phone screen is cleared or apps are deleted before it is handed over',
  'They pick up your device or someone else\'s the moment you leave the room',
  'They become unusually upset or agitated when home WiFi goes down',
  'New account notifications appear in your email that you did not create',
  'They describe people they know online but cannot explain where they met them',
  'Their mood after being online is noticeably worse than before they started',
  'They seem to know about current events from sources you cannot identify',
]

const PLATFORMS = [
  {
    name: 'Instagram',
    bg: 'var(--stage-4)',
    text: 'var(--terracotta)',
    steps: [
      'Settings and privacy → Account → Saved login info. Delete all saved logins on every device.',
      'Settings → Security → Two-factor authentication. Use an authenticator app not SMS.',
      'Settings → Security → Active sessions. Review and log out every unrecognised device.',
      'Remove your Instagram password from the phone browser and any password manager on shared devices.',
      'Set your profile to Private so it is not searchable by people you do not follow.',
    ],
  },
  {
    name: 'TikTok',
    bg: 'var(--stage-2)',
    text: 'var(--terracotta)',
    steps: [
      'Profile → Settings → Security → Two-step verification. Enable it now.',
      'Settings → Digital Wellbeing → Screen Time Management. Set a PIN only you know.',
      'Settings → Security → Manage devices. Remove any you do not use.',
      'Remove TikTok from saved passwords in your phone settings.',
      'Check the linked email and phone number under Account are definitely yours.',
    ],
  },
  {
    name: 'Snapchat',
    bg: 'var(--stage-5)',
    text: 'var(--terracotta)',
    steps: [
      'Settings → Two-Factor Authentication. Enable with an authenticator app.',
      'Settings → Manage → Sessions. Remove any unrecognised devices immediately.',
      'Settings → My Account → Mobile Number. Confirm it is your current number.',
      'Remove Snapchat from saved passwords on any shared device or browser.',
      'Settings → Apps and Permissions. Remove any third-party apps that have access.',
    ],
  },
  {
    name: 'YouTube',
    bg: 'var(--stage-1)',
    text: 'var(--terracotta)',
    steps: [
      'Do not save your Google password on any shared device or family browser profile.',
      'Google Account → Security → Your devices. Remove every device you no longer use.',
      'Enable two-step verification on your Google account.',
      'Google Account → Security → Third-party apps with account access. Remove anything unfamiliar.',
      'For children under 13 use a separate supervised account with YouTube Kids only.',
    ],
  },
  {
    name: 'WhatsApp',
    bg: 'var(--stage-2)',
    text: 'var(--terracotta)',
    steps: [
      'Settings → Account → Two-step verification. Set a six-digit PIN only you know.',
      'Settings → Privacy → App Lock. Enable fingerprint or face lock.',
      'Settings → Linked Devices. Log out of all Web and desktop sessions.',
      'Settings → Privacy → Groups. Set "Who can add me to groups" to My Contacts Only.',
      'Never use WhatsApp Web on a shared or family computer.',
    ],
  },
  {
    name: 'Discord',
    bg: 'var(--stage-4)',
    text: 'var(--terracotta)',
    steps: [
      'User Settings → My Account → Two-Factor Authentication. Enable it.',
      'User Settings → Devices. Log out of all sessions on unrecognised devices.',
      'Do not save your Discord password on shared devices or in browser autocomplete.',
      'Check Privacy and Safety settings. Enable Safe Direct Messaging to filter content.',
      'Review every server you are in. Leave any you do not use so the account is not a guest pass.',
    ],
  },
]

export default function BanWorkaroundsPage() {
  return (
    <div style={{ background: 'var(--cream)' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 300, height: '60px', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(247,243,238,.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontSize: '.95rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-.01em', textDecoration: 'none' }}>Guided Childhood</Link>
        <nav className="nav-links-desktop" style={{ gap: '2px' }}>
          {[['For parents', '/'], ['For schools', '/schools'], ['Join', '/join']].map(([label, href]) => (
            <Link key={label} href={href} style={{ fontFamily: 'var(--font-body)', fontSize: '.82rem', fontWeight: 500, color: 'var(--ink-soft)', padding: '6px 13px', borderRadius: '100px', textDecoration: 'none' }}>{label}</Link>
          ))}
        </nav>
        <Link href="/starter-pack" className="btn btn-green" style={{ padding: '9px 22px', fontSize: '.78rem' }}>
          Get the starter pack
        </Link>
      </header>

      {/* Hero */}
      <section style={{ background: 'var(--terracotta)', padding: 'clamp(56px, 8vw, 96px) 24px clamp(48px, 6vw, 80px)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.3)', borderRadius: '100px', padding: '5px 14px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: '#fff', marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Ban takes effect Spring 2027
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 1.1, maxWidth: '820px', margin: '0 auto 20px' }}>
            The ban is coming.<br />Workarounds already are.
          </h1>
          <p style={{ color: 'rgba(255,255,255,.88)', fontSize: 'clamp(1rem, 2vw, 1.2rem)', lineHeight: 1.65, maxWidth: '600px', margin: '0 auto 36px' }}>
            The Children&rsquo;s Wellbeing and Schools Act 2026 bans under-16s from social media in Spring 2027. Children are already learning how to get around it. Here is what that looks like, why it is dangerous, and exactly what to do.
          </p>
          <Link href="/starter-pack" className="btn btn-gold">
            Start my pathway free
          </Link>
        </div>
      </section>

      {/* What workarounds look like */}
      <section className="section-lg">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ marginBottom: '12px' }}>How they get in</p>
            <h2>Six workarounds every parent needs to know</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '560px', margin: '16px auto 0', lineHeight: 1.65 }}>
              None of these require technical skill. Most take under five minutes. All of them are already being shared in school corridors.
            </p>
          </div>
          <div className="three-col">
            {WORKAROUNDS.map((w) => (
              <div key={w.label} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{w.icon}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', background: w.tagBg, color: w.tagColor, padding: '3px 9px', borderRadius: '100px', whiteSpace: 'nowrap', marginTop: '2px' }}>{w.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0' }}>{w.label}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.65, margin: 0 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The real harms */}
      <section className="section-lg" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ marginBottom: '12px' }}>Why workarounds are worse than no ban</p>
            <h2>Getting through is not the same as being safe</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '580px', margin: '16px auto 0', lineHeight: 1.65 }}>
              When a child accesses a platform via a workaround, every safety feature designed for under-16s is gone. They are treated as an adult. That changes everything.
            </p>
          </div>
          <div className="three-col">
            {HARMS.map((h) => (
              <div key={h.title} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '14px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px', borderTop: `4px solid ${h.accent}` }}>
                <h3 style={{ fontSize: '1rem', lineHeight: 1.3 }}>{h.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: '.88rem', lineHeight: 1.65, margin: 0 }}>{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What schools are seeing */}
      <section className="section-lg">
        <div className="container">
          <div className="two-col" style={{ gap: '64px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>For schools and teachers</p>
              <h2 style={{ marginBottom: '20px' }}>Eight signals to watch for in the classroom</h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '32px' }}>
                Schools are already managing the fallout before the ban arrives. These signals suggest workaround use is happening in your school community right now.
              </p>
              <Link href="/schools" className="btn btn-ink" style={{ fontSize: '.78rem', padding: '12px 24px' }}>
                Schools resources
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SCHOOL_SIGNALS.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--stage-2)', border: '1.5px solid var(--stage-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--terracotta)', fontWeight: 800, fontSize: '.7rem', flexShrink: 0, marginTop: '1px' }}>
                    {i + 1}
                  </span>
                  <p style={{ color: 'var(--ink-soft)', fontSize: '.9rem', lineHeight: 1.55, margin: 0 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Warning signs at home */}
      <section className="section-lg" style={{ background: 'var(--deep-teal)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <p className="eyebrow" style={{ color: 'var(--green)', marginBottom: '12px' }}>For parents at home</p>
            <h2 style={{ color: '#fff' }}>Eight signs your child may already be using a workaround</h2>
            <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '1.05rem', maxWidth: '560px', margin: '16px auto 0', lineHeight: 1.65 }}>
              Most parents find out months after the fact. These are the early signals that give you a chance to have the conversation before a pattern is set.
            </p>
          </div>
          <div className="two-col-issues" style={{ maxWidth: '860px', margin: '0 auto' }}>
            {PARENT_SIGNALS.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: '10px', padding: '16px' }}>
                <span style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '.72rem', flexShrink: 0, marginTop: '1px' }}>
                  {i + 1}
                </span>
                <p style={{ color: 'rgba(255,255,255,.82)', fontSize: '.9rem', lineHeight: 1.6, margin: 0 }}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform lockdown guide */}
      <section className="section-lg" style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <p className="eyebrow" style={{ marginBottom: '12px' }}>Step by step</p>
            <h2>Lock down your accounts so they cannot be borrowed</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.05rem', maxWidth: '580px', margin: '16px auto 0', lineHeight: 1.65 }}>
              The most common workaround is the simplest. Your logged-in accounts on a shared or accessible device. These steps close that gap on every major platform.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '860px', margin: '0 auto' }}>
            {PLATFORMS.map((p) => (
              <div key={p.name} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ background: p.bg, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: p.text }}>{p.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: p.text, opacity: 0.7 }}>{p.steps.length} steps</span>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {p.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.text, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '.7rem', flexShrink: 0, marginTop: '1px' }}>
                        {i + 1}
                      </span>
                      <p style={{ color: 'var(--ink-soft)', fontSize: '.88rem', lineHeight: 1.6, margin: 0 }}>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ color: 'var(--ink-muted)', fontSize: '.82rem', textAlign: 'center', marginTop: '24px', lineHeight: 1.6 }}>
            These steps are accurate as of June 2026. Platform interfaces change. If a setting has moved, look under Security or Privacy in that platform&rsquo;s settings.
          </p>
        </div>
      </section>

      {/* The conversation to have */}
      <section className="section-lg">
        <div className="container">
          <div className="two-col" style={{ gap: '64px' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '16px' }}>What to say</p>
              <h2 style={{ marginBottom: '20px' }}>The conversation matters more than the settings</h2>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '16px' }}>
                Locking down your accounts is the practical step. But it does not replace a conversation with your child about why the workaround is a problem.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '16px' }}>
                Not because the ban says so. Because getting around a safety measure leaves them genuinely exposed, with no way to ask for help if something goes wrong.
              </p>
              <p style={{ color: 'var(--ink-soft)', lineHeight: 1.7, marginBottom: '32px' }}>
                Guided Childhood gives you that script. Stage 4 (ages 13 to 16) includes a full workaround conversation guide written for parents, not for Ofsted inspectors.
              </p>
              <Link href="/starter-pack" className="btn btn-gold">
                Start my pathway free
              </Link>
            </div>

            {/* DiGi chat preview */}
            <div className="digi-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <div className="digi-avatar">D</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9rem', color: 'var(--ink)' }}>DiGi</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>Your digital guide</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div className="digi-avatar-sm">D</div>
                  <div className="bubble-digi">I found out my son has been using a VPN to access TikTok. He is 12. What do I say?</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                  <div className="digi-avatar-sm" style={{ background: 'var(--stage-4)', color: 'var(--terracotta)' }}>JP</div>
                  <div className="bubble-parent">Start with curiosity, not accusation. Try: &ldquo;I noticed you have a VPN. Tell me about that.&rdquo; Let him explain before you respond.</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div className="digi-avatar-sm">D</div>
                  <div className="bubble-digi">What if he gets defensive?</div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                  <div className="digi-avatar-sm" style={{ background: 'var(--stage-4)', color: 'var(--terracotta)' }}>JP</div>
                  <div className="bubble-parent">That is normal. Say: &ldquo;I am not angry. I want to understand. Because on a VPN the platform does not know you are a child, and the things that protect you are all switched off.&rdquo;</div>
                </div>

                <div style={{ background: 'var(--stage-2)', border: '1px solid var(--stage-2)', borderRadius: '10px', padding: '14px 16px', marginTop: '4px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--terracotta)', marginBottom: '8px' }}>Stage 4 script · full version in your guide</div>
                  <p style={{ fontSize: '.82rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                    Includes: how to respond without destroying trust, what to do next, and how to set a new agreement around privacy and access.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research context */}
      <section style={{ background: 'var(--cream)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'clamp(40px, 6vw, 72px) 32px' }}>
        <div className="container">
          <div className="three-col" style={{ gap: '32px' }}>
            <div style={{ padding: '0 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--terracotta)', marginBottom: '8px' }}>73%</div>
              <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>of UK teenagers who know about the ban say they plan to find a workaround before it takes effect.</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-light)', marginTop: '8px' }}>Ofcom · Children and Parents Media Use and Attitudes 2025</p>
            </div>
            <div style={{ padding: '0 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--terracotta)', marginBottom: '8px' }}>2 min</div>
              <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>Average time it takes a child to install and connect a VPN to access a blocked platform, based on platform testing.</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-light)', marginTop: '8px' }}>Internet Watch Foundation · 2025</p>
            </div>
            <div style={{ padding: '0 8px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--terracotta)', marginBottom: '8px' }}>6 in 10</div>
              <p style={{ fontSize: '.88rem', color: 'var(--ink-soft)', lineHeight: 1.6, margin: 0 }}>Secondary school teachers report pupils already discussing ban workarounds during school time and on school devices.</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.7rem', color: 'var(--ink-light)', marginTop: '8px' }}>NASUWT Teacher Survey · 2025</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: 'var(--terracotta-dark)', padding: 'clamp(64px, 9vw, 104px) 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,.03)', pointerEvents: 'none' }} />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <p className="eyebrow" style={{ color: 'var(--green)', marginBottom: '16px' }}>Guided Childhood</p>
          <h2 style={{ color: '#fff', marginBottom: '20px' }}>
            The settings buy you time.<br />The guide gives you the conversation.
          </h2>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.65 }}>
            The free starter pack includes your child&rsquo;s stage, the workaround script for their age, and a 10-minute weekly check-in to keep you ahead of what is happening.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/starter-pack" className="btn btn-gold">
              Start my pathway free
            </Link>
            <Link href="/join" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
              See full membership
            </Link>
          </div>
          <p style={{ color: 'rgba(255,255,255,.45)', fontFamily: 'var(--font-mono)', fontSize: '.72rem', marginTop: '24px', letterSpacing: '.05em' }}>
            No account required for the starter pack. Takes three minutes.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 24px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.88rem', color: 'var(--ink)', textDecoration: 'none' }}>Guided Childhood</Link>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[['Home', '/'], ['For schools', '/schools'], ['Join', '/join'], ['Digital wellbeing', 'https://wellbeing.guidedchildhood.com/']].map(([label, href]) => (
            <Link
              key={label} href={href}
              {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              style={{ fontFamily: 'var(--font-body)', fontSize: '.78rem', color: 'var(--ink-muted)', textDecoration: 'none' }}
            >{label}</Link>
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '.68rem', color: 'var(--ink-light)', margin: 0 }}>
          &copy; 2026 Guided Childhood
        </p>
      </footer>

    </div>
  )
}
