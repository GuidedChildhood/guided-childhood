'use client'
import KidPath from '@/components/kid/KidPath'
import { quizForBand } from '@/lib/content/school-quizzes'
export default function Page() {
  return (
    <KidPath
      token="000000000000000000"
      childName="Alma" stageId={3} stageName="Explorer" ages="11 to 13" stamp="How it works"
      jobs={[{ id: 'j1', title: 'Make your bed', emoji: '🛏️', stars: 1, state: 'todo' }]}
      lessons={[{ id: '1', title: 'Passwords are secrets', emoji: '🛡️', done: true, score: 5, locked: false }]}
      games={[{ key: 'animal-pairs', title: 'Animal Match', emoji: '🐾' }]}
      printables={[{ key: 'sunday-quest', title: 'Sunday build kit', emoji: '🧱', stars: 5, sheetUrl: 'https://example.com/a.png', status: 'todo' }]}
      quiz={quizForBand('11-13')}
      dayIndex={0}
      chestClaimed={false} quizClaimed={false}
      usedTodayMinutes={30} guideMinutes={90} balanceStars={26}
    />
  )
}
