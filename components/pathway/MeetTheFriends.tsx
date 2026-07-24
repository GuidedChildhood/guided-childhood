import Image from 'next/image'
import DigiCharacter from '@/components/digi/DigiCharacter'
import { STAGE_CHARACTERS } from '@/lib/content/stage-characters'

// Meet the family: a small warm intro that sits on the passport tab where the
// five point badge used to be. DiGi, the golden guide, then each Planet Friend
// the child meets, one per stage all the way to 16. The same cast the child
// meets on their first open, shown here so the parent knows who they are. A
// plain strip, no scores, no collection, just an introduction.

export default function MeetTheFriends({ childName }: { childName?: string | null }) {
  const name = childName && childName !== 'Your child' ? childName : 'Your child'
  return (
    <div style={{
      background: 'var(--cream)', border: '1.5px solid var(--border)',
      borderRadius: '18px', padding: '18px 18px 16px', marginBottom: '22px',
    }}>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--terracotta-dark)', marginBottom: '6px' }}>
        Meet the family
      </div>
      <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', lineHeight: 1.55, margin: '0 0 14px' }}>
        DiGi is {name}&apos;s guide, there the whole way. They meet a new Planet Friend at every stage, one to grow up alongside, all the way to 16.
      </p>

      {/* The cast, in a row that scrolls sideways on a narrow screen: DiGi first,
          then a Planet Friend per stage in their own colour. */}
      <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', flexShrink: 0, width: 62 }}>
          <span style={{
            width: 56, height: 56, borderRadius: '50%', background: '#fff',
            border: '2.5px solid var(--terracotta)', boxShadow: '0 3px 0 rgba(26,26,46,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <DigiCharacter size={38} mood="wave" once />
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: 'var(--ink)' }}>DiGi</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.2 }}>Your guide</span>
        </div>

        {STAGE_CHARACTERS.map(friend => (
          <div key={friend.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', flexShrink: 0, width: 62 }}>
            <span style={{
              width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', background: '#fff',
              border: `2.5px solid ${friend.colour}`, boxShadow: '0 3px 0 rgba(26,26,46,0.10)',
              position: 'relative', flexShrink: 0,
            }}>
              <Image src={friend.img} alt={friend.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '12px', color: 'var(--ink)' }}>{friend.name}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', textAlign: 'center', lineHeight: 1.2 }}>{friend.ages.replace('Ages ', '')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
