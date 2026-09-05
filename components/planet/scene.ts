// The planet scene's fixed geometry, shared by the scene, the parts and the
// root. Scene coordinates: 390 wide, 560 tall, the planet a circle whose top
// is the horizon the Friends stand on.

export const SCENE_W = 390
export const SCENE_H = 560
export const PLANET = { cx: 195, cy: 700, r: 400 }

/** The y of the planet's surface at x. */
export function surfaceY(x: number): number {
  const dx = x - PLANET.cx
  return PLANET.cy - Math.sqrt(Math.max(0, PLANET.r * PLANET.r - dx * dx))
}

/**
 * Where each slot is drawn (slice 3). Ground and horizon parts stand on the
 * point (their feet), sky parts hang from it (their centre). The ids and
 * zones are the pure rules' in lib/planet/logic.ts SLOTS.
 */
export const SLOT_POS: Record<string, { x: number; y: number }> = {
  sky1: { x: 330, y: 150 },
  sky2: { x: 62, y: 192 },
  sky3: { x: 240, y: 44 },
  hz1: { x: 150, y: surfaceY(150) },
  hz2: { x: 240, y: surfaceY(240) },
  g1: { x: 100, y: 405 },
  g2: { x: 295, y: 405 },
  g3: { x: 60, y: 482 },
  g4: { x: 330, y: 482 },
  g5: { x: 140, y: 542 },
  g6: { x: 250, y: 546 },
  ring: { x: PLANET.cx, y: 445 },
}

/** Scene coordinates for a pointer, from the scene's own svg element. */
export function sceneFromClient(svg: SVGSVGElement, clientX: number, clientY: number): { x: number; y: number } {
  const pt = svg.createSVGPoint()
  pt.x = clientX
  pt.y = clientY
  const ctm = svg.getScreenCTM()
  if (!ctm) return { x: 0, y: 0 }
  const p = pt.matrixTransform(ctm.inverse())
  return { x: p.x, y: p.y }
}
