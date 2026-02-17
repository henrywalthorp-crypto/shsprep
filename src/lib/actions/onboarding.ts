'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function saveOnboardingStep(step: string, data: Record<string, any>) {
  const supabase = await createServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  // Fetch existing onboarding_data to merge
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_data')
    .eq('id', user.id)
    .single()

  const existingData = (profile?.onboarding_data as Record<string, any>) || {}
  const updatedData = { ...existingData, [step]: data }

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_data: updatedData })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function completeOnboarding() {
  const supabase = await createServerClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ onboarding_complete: true })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
