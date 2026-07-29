'use client'
import AddRoutine from '@/app/(dashboard)/dashboard/quests/routines/AddRoutine'

// Dev harness for the Add a routine page. Reads /api/quests, stubbed in
// Playwright so the packs, the tick list and the add can be looked at.
export default function AddRoutineHarness() { return <AddRoutine /> }
