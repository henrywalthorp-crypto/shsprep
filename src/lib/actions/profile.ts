'use server'

import { createServerClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

/**
 * Update the current user's profile.
 */
export async function updateProfile(data: {
  firstName?: string
  lastName?: string
  grade?: string
  targetSchool?: string
}): Promise<Profile> {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  const updates: Record<string, unknown> = {}
  if (data.firstName !== undefined) updates.first_name = data.firstName
  if (data.lastName !== undefined) updates.last_name = data.lastName
  if (data.grade !== undefined) updates.grade = data.grade
  if (data.targetSchool !== undefined) updates.target_school = data.targetSchool

  const { data: profile, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw new Error('Failed to update profile')
  return profile as Profile
}

/**
 * Fetch the current user's profile.
 */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createServerClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null
  return profile as Profile
}
