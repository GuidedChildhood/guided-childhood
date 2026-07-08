// One look per moment category: a deep band colour for the curved card
// header and a pale tint for the card body, Good Inside deck style but in
// the Guided Childhood palette. Used by the in app full screen card, the
// public share page and the social unfurl image, so a shared moment looks
// identical everywhere.

export type MomentLook = { band: string; tint: string }

const LOOKS: Record<string, MomentLook> = {
  Morning:     { band: '#E3A93C', tint: '#FBF0D7' },
  Digital:     { band: '#3D739A', tint: '#D8E8F8' },
  School:      { band: '#2F8F6B', tint: '#DEF0E7' },
  Food:        { band: '#C4663D', tint: '#F8E4DA' },
  Evening:     { band: '#173C46', tint: '#DCE9EC' },
  Transitions: { band: '#3D739A', tint: '#E8F0EE' },
  Emotions:    { band: '#B85C7E', tint: '#F5E4EB' },
}

export function momentLook(category: string): MomentLook {
  return LOOKS[category] ?? LOOKS.Morning
}
