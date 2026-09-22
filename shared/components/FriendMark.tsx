import { CHARACTERS, type CharacterKey } from '../schools-curriculum'

// THE FRIEND, SMALL AND STILL.
//
// FriendPlate is the friend in a lesson: client side, GSAP, five moods, a
// register that sets the amplitude. That is right for a beat and wrong for a
// 22px chip on a card, and the schools pages carry up to twenty nine of those
// on one screen. So the marketing and curriculum surfaces get this instead:
// the same plate device, the real cutout, no motion and no client bundle.
//
// It exists because those surfaces were drawing the friends as EMOJI. Every
// character record already carried its art in `img` next to the emblem, and
// three places reached past it for the emblem: the map preview, the stage
// module tiles and the curriculum character band. Pebble was a seedling, Nova
// a compass, Cosmo a rocket. A parent or a head who has just watched a lesson
// then meets five symbols that are not the five characters, on the page that
// is selling them the characters.
//
// The emblem is still the fallback, so a future character with no art yet
// degrades to a symbol rather than to an empty ring.
export default function FriendMark({
  character,
  size = 22,
  ring = true,
}: {
  character: CharacterKey
  size?: number
  // Off inside a container that already draws its own circle and border, so
  // the curriculum band does not end up with two rings.
  ring?: boolean
}) {
  const c = CHARACTERS[character]
  return (
    <span
      aria-hidden
      style={{
        width: size, height: size, flexShrink: 0, borderRadius: '50%',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        background: ring ? '#fff' : 'transparent',
        border: ring ? `1.5px solid ${c.accent}` : 'none',
        fontSize: Math.round(size * 0.6),
      }}
    >
      {c.img ? (
        // A plain img for the same reason FriendPlate uses one: a CDN cutout,
        // a fixed size, and one file family that never changes.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={c.img}
          alt=""
          draggable={false}
          style={{ width: '82%', height: '82%', objectFit: 'contain', display: 'block' }}
        />
      ) : c.emblem}
    </span>
  )
}
