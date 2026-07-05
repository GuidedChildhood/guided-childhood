'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Server actions for the educator workspace (Phase 2, spec section 11).
// Class codes not pupil accounts: pupils are display_name only.

function makeClassCode() {
  // Unambiguous characters only (no O/0, I/1/L). 6 chars, e.g. GC-K7XW4P
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `GC-${code}`
}

export async function createSchool(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const name = String(formData.get('name') ?? '').trim()
  const phase = String(formData.get('phase') ?? 'primary')
  if (!name) return

  // Generate the id here instead of asking the insert to return it: the
  // select policy on school_accounts requires an educators row, which does
  // not exist until the second insert below. RETURNING would fail RLS.
  const schoolId = crypto.randomUUID()

  const { error } = await supabase
    .from('school_accounts')
    .insert({ id: schoolId, name, phase, licence_tier: 'pilot' })
  if (error) redirect(`/educator?error=${encodeURIComponent(`Creating the school failed: ${error.message} (code ${error.code ?? 'unknown'})`)}`)

  const { error: eduError } = await supabase
    .from('school_educators')
    .insert({ school_id: schoolId, user_id: user.id, role: 'lead' })
  if (eduError) redirect(`/educator?error=${encodeURIComponent(`Joining you to the school failed: ${eduError.message} (code ${eduError.code ?? 'unknown'})`)}`)

  revalidatePath('/educator')
  redirect('/educator')
}

export async function createClass(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const schoolId = String(formData.get('school_id') ?? '')
  const yearGroup = String(formData.get('year_group') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  // One pupil per line, first name and initial only. Anything longer than
  // two words is trimmed to two: data minimisation is enforced, not advised.
  const pupilLines = String(formData.get('pupils') ?? '')
    .split('\n')
    .map(l => l.trim().split(/\s+/).slice(0, 2).join(' '))
    .filter(Boolean)

  if (!schoolId || !yearGroup || !name) return

  const { data: cls, error } = await supabase
    .from('school_classes')
    .insert({ school_id: schoolId, year_group: yearGroup, name, class_code: makeClassCode() })
    .select('id')
    .single()
  if (error || !cls) redirect(`/educator?error=${encodeURIComponent(`Creating the class failed: ${error?.message ?? 'the new class could not be read back'} (code ${error?.code ?? 'unknown'})`)}`)

  if (pupilLines.length > 0) {
    const { error: pupilError } = await supabase
      .from('pupils')
      .insert(pupilLines.map(display_name => ({ class_id: cls.id, display_name })))
    if (pupilError) redirect(`/educator?error=${encodeURIComponent(`Adding pupils failed: ${pupilError.message} (code ${pupilError.code ?? 'unknown'})`)}`)
  }

  revalidatePath('/educator')
  redirect(`/educator/classes/${cls.id}`)
}

// Recording a delivery is the register: one tap when the lesson is taught.
// Every pupil defaults to met so the teacher only touches exceptions.
export async function recordDelivery(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const classId = String(formData.get('class_id') ?? '')
  const lessonId = String(formData.get('lesson_id') ?? '')
  if (!classId || !lessonId) return

  const { data: delivery, error } = await supabase
    .from('lesson_deliveries')
    .insert({ class_id: classId, lesson_id: lessonId, teacher_id: user.id, mode: 'class' })
    .select('id')
    .single()
  if (error || !delivery) redirect(`/educator?error=${encodeURIComponent(`Recording the lesson failed: ${error?.message ?? 'the delivery could not be read back'} (code ${error?.code ?? 'unknown'})`)}`)

  const { data: pupils } = await supabase
    .from('pupils').select('id').eq('class_id', classId)
  if (pupils && pupils.length > 0) {
    await supabase.from('teacher_judgements').insert(
      pupils.map(p => ({ delivery_id: delivery.id, pupil_id: p.id, level: 'met' }))
    )
  }

  redirect(`/educator/deliveries/${delivery.id}`)
}

export async function setJudgement(deliveryId: string, pupilId: string, level: 'working_towards' | 'met' | 'exceeded') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('teacher_judgements')
    .upsert({ delivery_id: deliveryId, pupil_id: pupilId, level }, { onConflict: 'delivery_id,pupil_id' })
  if (error) return { error: `Saving the judgement failed: ${error.message}` }
  revalidatePath(`/educator/deliveries/${deliveryId}`)
  return { error: null }
}
