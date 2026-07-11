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
  // Filled once Justin's voice is cloned and the say this line is generated
  // per script. Until then every script uses the device voice.
}

export function scriptVoiceUrl(sortOrder: number): string | null {
  return SCRIPT_VOICE[sortOrder] ?? null
}
