'use client'
import KidQuestScreen from '@/app/k/[token]/KidQuestScreen'

export default function DevKidLessons() {
  return (
    <KidQuestScreen
      token="000000000000000000"
      childName="Teo"
      stageId={2}
      quests={[]}
      todayTicks={[]}
      weekStars={18}
      goal={null}
      streakDays={12}
      missions={[
        { id: 'm1', title: 'Is That Real?', stars: 10, status: 'sent' },
        { id: 'm2', title: 'Kind words online', stars: 8, status: 'done' },
      ]}
      adventures={[
        { code: 'a1', title: 'The screen that would not switch off', catchphrase: 'Screens wait', stageId: 2, posterUrl: null, done: false, timesCompleted: 0 },
        { code: 'a2', title: 'Who made this game want my time?', catchphrase: 'Notice the hook', stageId: 2, posterUrl: null, done: false, timesCompleted: 0 },
      ]}
      bank={{ child_id: 'c1', earned: 20, spent: 2, balance: 18, minutes: 90 }}
      printablesUnlocked={true}
      requests={[]}
    />
  )
}
