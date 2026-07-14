'use client'
import LessonsBrowser, { type WatchItem, type LibraryItem } from '@/app/(dashboard)/dashboard/lessons/LessonsBrowser'
import { PRINTABLES } from '@/lib/printables/registry'

const watch: WatchItem[] = [
  { code: 'a', stageNum: 1, stageName: '', title: 'First screens, first rules', catchphrase: 'Little and together', strand: 'screens', posterUrl: null, journeyStep: 1, duration: 'About 2 minutes', done: false },
  { code: 'b', stageNum: 2, stageName: '', title: 'The screen that would not switch off', catchphrase: 'Screens wait, we play first', strand: 'screens', posterUrl: null, journeyStep: 1, duration: 'About 3 minutes', done: false },
  { code: 'c', stageNum: 2, stageName: '', title: 'Kind words online', catchphrase: 'Type it like you would say it', strand: 'kindness', posterUrl: null, journeyStep: 2, duration: 'About 2 minutes', done: true },
  { code: 'd', stageNum: 3, stageName: '', title: 'Is that photo real?', catchphrase: 'Look twice', strand: 'misinformation', posterUrl: null, journeyStep: 1, duration: 'About 3 minutes', done: false },
  { code: 'e', stageNum: 4, stageName: '', title: 'Who sees what you post?', catchphrase: 'Once it is out, it is out', strand: 'privacy', posterUrl: null, journeyStep: 1, duration: 'About 4 minutes', done: false },
]
const library: LibraryItem[] = [
  { id: 'l1', href: '#', stageNum: 2, stageLabel: 'Builder', stageAges: '8 to 10', categoryLabel: 'Screen habits', title: 'Screens and sleep', keyMessage: 'Screens off an hour before bed', locked: false, done: true },
  { id: 'l2', href: '#', stageNum: 3, stageLabel: 'Explorer', stageAges: '11 to 13', categoryLabel: 'Safety', title: 'Who is on the other side?', keyMessage: 'Not everyone online is who they say', locked: false, done: false },
]

export default function DevLessons() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 20px 48px', background: 'var(--cream)', minHeight: '100dvh' }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: 8 }}>Lessons</h1>
      <LessonsBrowser childId="x" childName="Teo" childStageNum={2} watchItems={watch} libraryItems={library} printables={PRINTABLES} isPaid={true} />
    </div>
  )
}
