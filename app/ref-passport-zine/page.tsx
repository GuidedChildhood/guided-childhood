import PassportZineSheet, { type ZineStage } from '@/components/pathway/PassportZineSheet'
import { STAGES } from '@/lib/content/stages'
import { characterForStage } from '@/lib/content/stage-characters'
import { STAGE_COLOURS } from '@/lib/pathway/passport-print-style'

// The fold, with made up numbers, so the fiddly part can be seen at both
// sizes and saved as a PDF without a login. Same job as ref-passport-book,
// and the middleware 404s every /ref- route in production.
//
// A DELIBERATELY AWKWARD FAMILY: two pages stamped, one in progress, two
// untouched, one stage with no lessons at all. A fixture where everything is
// full proves only that a full page fits.

export const metadata = { title: 'Ref: the passport zine' }

const STAMPED = new Set([1, 2])
const DONE: Record<number, [number, number]> = { 1: [8, 8], 2: [10, 10], 3: [4, 11], 4: [0, 9], 5: [0, 0] }

export default function RefPassportZine() {
  const stages: ZineStage[] = STAGES.map((s, i) => {
    const n = i + 1
    const [done, total] = DONE[n]
    return {
      n, name: s.name, ages: s.ages, focus: s.focus,
      colour: STAGE_COLOURS[i],
      cutout: characterForStage(n)?.cutout ?? null,
      stamped: STAMPED.has(n),
      isCurrent: n === 3,
      lessonsDone: done, lessonsTotal: total,
      checkPassed: STAMPED.has(n),
    }
  })

  return (
    <div style={{ padding: '20px 16px 60px', overflowX: 'auto' }}>
      <PassportZineSheet
        childName="Alma Rose"
        passportCode="GC-4K7P"
        stages={stages}
        stampedCount={STAMPED.size}
        stickerCount={23}
      />
    </div>
  )
}
