import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Verify that a parent is linked to a student.
 * Used by all /parent/children/[studentId]/* routes.
 */
export async function verifyParentStudentLink(
  supabase: SupabaseClient,
  parentId: string,
  studentId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('parent_student_links')
    .select('id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single()

  if (error || !data) return false
  return true
}
