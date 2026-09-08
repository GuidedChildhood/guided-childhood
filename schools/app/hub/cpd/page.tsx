import { db as supabase } from '@/lib/supabase/server-db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PrintButton from '@/components/PrintButton'

// Staff briefings: ten minutes before teaching a sensitive module. The
// Youth Select Committee 2026 report found teachers often lack confidence
// to deliver specialist content; these briefings are the confidence.

const mono: React.CSSProperties = { fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-muted)' }
const body: React.CSSProperties = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--ink)', lineHeight: 1.7 }
const h2: React.CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'var(--text-lg)', color: 'var(--ink)', margin: '0 0 6px' }
const label: React.CSSProperties = { fontFamily: 'var(--font-body)', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--ink)' }

const BRIEFINGS = [
  {
    module: 'M02 · Kind screens, calm bodies (KS1, Years 1 to 2)',
    covers: 'Noticing how the body feels after screen time, Pebble&rsquo;s three steps (feel it, name it, tell a grown up), and telling as safety, never telling tales.',
    register: 'Gentle and playful. The lesson is about feelings, not about screens being bad, and never becomes a lecture about screen time at home: children this age do not control their homes.',
    watchFor: 'A child who reaches a big feeling very fast, or mentions something yucky appearing on their screen. Say out loud, more than once, that nobody is ever in trouble for what appears or for telling. It is the single most important safeguarding message at this age.',
    disclosure: 'This age discloses sideways: a drawing, a whisper at the worksheet, a question at the door. Listen calmly, thank them for telling, do not promise secrecy, and log it on your concern form the same day.',
    line: 'The line that carries the lesson: you are never in trouble for telling.',
  },
  {
    module: 'M07 · Privacy and digital reputation (KS2, Years 3 to 6)',
    covers: 'The share test, the vault list, why delete does not unshare, and group chats as the friendly place where oversharing actually happens.',
    register: 'Curious and practical, never scary. Privacy is choosing, not hiding: sharing art, sport and jokes is encouraged when the share test passes, so the lesson must not land as share nothing.',
    watchFor: 'The group chat scenario landing on a live situation. A pupil may say someone has asked them for photos or personal details, or that they have shared something they regret. Keep the room on the scenario and pick the real thing up privately afterwards.',
    disclosure: 'Reassure first: you are not in trouble and telling me was right. Do not investigate the chat yourself and do not ask to see more than the pupil volunteers. Follow your safeguarding policy and log the concern the same day.',
    line: 'The line that carries the lesson: would I shout it in assembly?',
  },
  {
    module: 'M08 · Being kind and safe with others online (KS2, Years 3 to 6)',
    covers: 'Recognising online bullying, breaking the bystander pattern, reporting and blocking, telling an adult as strength.',
    register: 'Warm and practical. Some pupils in the room will have been on both sides of unkindness online. No shame anywhere: the lesson is about the three moves, not about who has done what.',
    watchFor: 'A pupil going quiet at the group chat scenario, or naming a live situation in class. Acknowledge, do not investigate in the room, follow up privately afterwards.',
    disclosure: 'Bullying disclosures follow your anti bullying and safeguarding policies. Thank the pupil, tell them they did the right thing, record in your school system.',
    line: 'The line that carries the lesson: telling someone who can help is the strongest move on the board.',
  },
  {
    module: 'M10 · Mood and screens (KS3, Years 7 to 9)',
    covers: 'The mood audit (close it, then ask: better, worse or nothing), why raw hours barely predict wellbeing, and each pupil reading their own week of honest one word logs instead of trusting an average.',
    register: 'Honest and unbothered. No moral panic, and no screens are fine either: the audit is theirs and the verdict is theirs. An honest example of your own (an app that leaves you flat) buys more honesty than any warning.',
    watchFor: 'The honesty doing its job. A pupil whose week reads worse everywhere, or an exit card mentioning persistent low mood, is information for the follow up, never for the class discussion.',
    disclosure: 'Everyday low mood answers are normal. Persistent low mood, or anything on a worksheet or exit card that concerns you, goes to your DSL through your safeguarding policy. Do not promise confidentiality, and respond warmly: thank you for telling me, you are not in trouble.',
    line: 'The line that carries the lesson: better, worse, or nothing?',
  },
  {
    module: 'M11 · Social media, group chats and the workarounds (KS3, Years 7 to 9)',
    covers: 'Behind every rule is a protection, what a VPN, a false age or a borrowed account actually switches off, and deciding with your eyes open. A VPN is named as a normal adult tool, not an evil one.',
    register: 'Straight and unshocked. Assume workarounds are live in the room and do not ask. The lesson promises that nobody confesses anything: keep that promise, and the room will keep listening.',
    watchFor: 'A pupil volunteering more than they meant to: a large chat with adults they do not know, unwanted contact, an account already running on a false age. Never follow it up in front of the class.',
    disclosure: 'Concerning contact or content follows your safeguarding policy, with the DSL the same day, and the pupil hears first that they are not in trouble. Treat any voluntary disclosure with care: the lesson told them nobody has to confess.',
    line: 'The line that carries the lesson: skip the rule, lose the protection.',
  },
  {
    module: 'M12 · Misinformation, deepfakes and AI content (KS3, Years 7 to 9)',
    covers: 'The three checks (who made this, what do other places say, how does it want me to feel), the three verdicts (believe, pause, do not share), and why AI made is a method, not a verdict.',
    register: 'Brisk, even fun: this is detective work, not doom. Guard the calibration: the checks must end in believe verdicts too, or the lesson has taught cynicism instead of checking.',
    watchFor: 'A pupil distressed by something they have seen or shared, or a live school rumour offered as an example. Stay on the slide&rsquo;s neutral examples: running the checks on a live rumour turns a lesson into an investigation.',
    disclosure: 'KCSIE names misinformation, disinformation and conspiracy theories as content harms. Distress about something seen or shared follows your safeguarding policy, recorded in your school system: the platform records nothing.',
    line: 'The line that carries the lesson: pause is a perfectly good verdict.',
  },
  {
    module: 'M14 · Bodies, image and pressure online (KS3, Years 7 to 9)',
    covers: 'Edited and idealised bodies, the economics of insecurity, healthy self image, and one careful, non graphic acknowledgement that some pupils will have seen pornography and that it distorts.',
    register: 'Calm, matter of fact, zero jokes. DiGi carries this module alone because character comedy would be wrong here.',
    watchFor: 'Bravado covering discomfort, and pupils for whom body image is a live struggle. Do not single anyone out, do not ask for personal examples, keep every discussion about the content on screen.',
    disclosure: 'A pupil may disclose distress about their body, eating, or something they have seen. Listen, do not promise secrecy, refer to the DSL the same day. The platform records nothing: use your school system.',
    line: 'The line that carries the lesson: who profits from you feeling worse about yourself?',
  },
  {
    module: 'M16 · Consent, images and the law (KS4, Years 10 to 11)',
    covers: 'Consent as ongoing and revocable, the UK law on under 18 images (including self images), pressure and coercion, and Report Remove as the confidential route out.',
    register: 'Straight talking and calm. Treat them as the near adults they are. The law section is factual, not threatening: the point is options, not fear.',
    watchFor: 'This content is live in most Year 10 and 11 cohorts. Watch for stillness, not noise. Never ask whether anything has happened to anyone.',
    disclosure: 'If a pupil discloses an image has been shared or demanded: do not ask to see anything, do not have the pupil forward anything, involve the DSL immediately. Report Remove (Childline and the IWF) lets under 18s get images taken down confidentially. The repeated message: you are not in trouble.',
    line: 'The line that carries the lesson: real consent, the actual law, and your options, before anything is shared.',
  },
  {
    module: 'M17 · Sextortion (KS4, Years 10 to 11)',
    covers: 'What sextortion is, how it starts, the scripts scammers use, and the three lifelines: do not pay, do not keep it secret, report it.',
    register: 'The calmest register in the whole scheme. Minimal decoration, no games, DiGi only. Read the scripts as written: they are engineered to lower the temperature.',
    watchFor: 'The NCA has issued national alerts about financially motivated sextortion targeting teenage boys. Assume it may be live in the room. A pupil asking detailed hypothetical questions may not be asking hypothetically.',
    disclosure: 'Immediate DSL involvement the same day. Never ask to see images or messages. The pupil hears three things before anything else: it is not your fault, you are not in trouble, this has a way out. Paying never makes it stop.',
    line: 'The line that carries the lesson: do not pay, do not keep it secret, report it.',
  },
  {
    module: 'M18 · Radicalisation and misogyny (KS4, Years 10 to 11)',
    covers: 'How pipelines work (entry content, escalating recommendations, us versus them framing), misogyny named plainly as the most common on ramp, and how belief grooming mirrors other grooming: isolate, flatter, escalate.',
    register: 'Serious and respectful of the boys in the room. The content targets them, they are not the enemy, the manipulation is. If the room polarises, return to the shared enemy: the recruiter who profits from their anger.',
    watchFor: 'Defensive reactions from pupils who recognise content they enjoy. Do not condemn the pupil, examine the technique. Concerning views expressed in the room are information, not a verdict: note them, do not debate them to destruction.',
    disclosure: 'The Prevent duty applies. Concerns about radicalisation follow your Prevent and safeguarding routes, not classroom debate. Record in your school system.',
    line: 'The line that carries the lesson: who wants me angry, and what do they get if I stay angry?',
  },
]

export default async function CpdBriefingsPage() {

  return (
    <main style={{ minHeight: '100vh', background: '#fff', padding: '32px 20px 80px' }}>
      <div style={{ maxWidth: '740px', margin: '0 auto' }}>
        <div className="gc-print-btn" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <Link href="/hub" style={{ ...mono, textDecoration: 'none' }}>← The Hub</Link>
          <PrintButton label="Print all briefings" />
        </div>

        <div style={mono}>Staff CPD · ten minutes before teaching each flagged module</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'var(--text-2xl)', color: 'var(--ink)', margin: '6px 0 8px' }}>
          Staff briefings for the sensitive modules
        </h1>
        <p style={{ ...body, marginBottom: '22px' }}>
          Every slide in these modules already carries a word for word script, so nobody teaches them
          unsupported. These briefings are the ten minutes before: the register to hold, what to watch
          for in the room, and exactly what to do with a disclosure. All ten safeguarding flagged
          modules have one. Read the one you need the night before, or run them as a staff meeting
          before the scheme starts, alongside the induction page in the Hub.
        </p>

        {BRIEFINGS.map(b => (
          <div key={b.module} style={{ border: '1.5px solid var(--border)', borderRadius: '14px', padding: '18px 22px', marginBottom: '16px', pageBreakInside: 'avoid' }}>
            <h2 style={h2}>{b.module}</h2>
            <p style={{ ...body, marginBottom: '8px' }}><span style={label}>What it covers: </span>{b.covers}</p>
            <p style={{ ...body, marginBottom: '8px' }}><span style={label}>The register to hold: </span>{b.register}</p>
            <p style={{ ...body, marginBottom: '8px' }}><span style={label}>Watch for: </span>{b.watchFor}</p>
            <p style={{ ...body, marginBottom: '8px' }}><span style={label}>Disclosures: </span>{b.disclosure}</p>
            <p style={{ ...body, fontStyle: 'italic' }}>{b.line}</p>
          </div>
        ))}

        <p style={{ ...body, fontSize: 'var(--text-sm)', color: 'var(--ink-muted)' }}>
          These briefings support your safeguarding training, they do not replace it. Your school&rsquo;s
          safeguarding policy and DSL always take precedence.
        </p>
      </div>
    </main>
  )
}
