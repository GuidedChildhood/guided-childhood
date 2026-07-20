// REFERENCE ONLY, never linked from the app. The REAL BrowseTile from the
// lessons hub with the new passed badge, next to an undone and a locked tile,
// so the pass state can be reviewed and screenshotted without a database.
// Delete this route once the lesson test build is approved.

import BrowseTile from '@/components/ui/BrowseTile'

export default function RefLessonPassedCard() {
  return (
    <div style={{ maxWidth: '620px', margin: '0 auto', padding: '32px 20px 48px' }}>
      <p className="eyebrow" style={{ marginBottom: '10px' }}>Lessons hub · card states</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
        <BrowseTile
          href="#"
          stageNum={2}
          title="Is that really true?"
          sub="Critical thinking"
          emoji="🔍"
          done
          doneLabel="✓ Passed · 4 right"
        />
        <BrowseTile
          href="#"
          stageNum={2}
          title="Kind words online"
          sub="Being social"
          emoji="🤝"
        />
        <BrowseTile
          href="#"
          stageNum={2}
          title="Games and your brain"
          sub="Healthy balance"
          emoji="🎮"
          locked
        />
      </div>
    </div>
  )
}
