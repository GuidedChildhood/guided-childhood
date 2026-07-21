// Warm age scenes for the lesson route: one parent and child illustration per
// stage, drawn in the Guided Childhood picture book style on the Higgsfield
// account behind the tile CDN (21 July 2026 batch). Cosy and close for the
// little ones, side by side and independent for the teens, so a parent sees
// themselves and their child in the work, not a stock icon. Served from the
// cloudfront CDN allowed in next.config. Restyle later = one Higgsfield batch
// and a URL swap here, never a code change.

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DfAawD3Umi5iqU3oLyR59j3JKD/'

// stageNum (1 to 5) to the route scene.
const STAGE_SCENES: Record<number, string> = {
  1: BASE + 'hf_20260721_114937_50d26069-a893-4189-8773-d3b90e8fcfae.png',
  2: BASE + 'hf_20260721_120257_e2cf0257-bd59-47fe-9374-6dffb46cf9c6.png',
  3: BASE + 'hf_20260721_115541_b131cc81-422f-4df0-8417-e8c287ace411.png',
  4: BASE + 'hf_20260721_120259_64f6fede-4573-4610-b8b2-efb90cc5267a.png',
  5: BASE + 'hf_20260721_115552_82831b37-521b-4edc-9330-4a5c01a91916.png',
}

export function sceneCoverForStage(stageNum: number): string | null {
  return STAGE_SCENES[stageNum] ?? null
}
