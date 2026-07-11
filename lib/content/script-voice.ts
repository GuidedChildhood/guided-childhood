// Justin's own voice, reading the say this line of a script aloud.
//
// The script reader's Hear it aloud button plays this recording when one
// exists for the script, and falls back to the device voice when it does not.
// Populated as Justin records them: he records the say this line in his own
// voice, the mp3 goes in public/script-voice/<sort_order>.mp3, and the
// script's sort_order maps to that path here. No clone, no database change,
// no runtime key, the reader just plays the file when one exists.
//
// Keyed by the script sort_order (the same id used in the URL
// /dashboard/scripts/<sort_order>).

export const SCRIPT_VOICE: Record<number, string> = {
  // First social platform request, generated in Justin's cloned voice
  // (Higgsfield, ElevenLabs engine). Served from the generation CDN for now;
  // move to our own hosting once the voice is signed off across the set.
  4: 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/hf_20260711_124947_9e608878-8eb3-4594-9a1a-ffc71d423e98.mp3',
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
