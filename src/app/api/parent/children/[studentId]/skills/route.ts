import { createServerClient } from '@/lib/supabase/server'
import { verifyParentStudentLink } from '@/lib/parent/verify-link'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden: parent role required' }, { status: 403 })
    }

    const isLinked = await verifyParentStudentLink(supabase, user.id, studentId)
    if (!isLinked) {
      return NextResponse.json({ error: 'Not linked to this student' }, { status: 403 })
    }

    const { data: skillStats, error } = await supabase
      .from('student_skill_stats')
      .select('category, mastery_level, accuracy, total_attempted, trend')
      .eq('student_id', studentId)
      .order('category')

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }

    const skills = (skillStats || []).map(s => ({
      category: s.category,
      mastery: s.mastery_level,
      accuracy: s.accuracy,
      totalAttempted: s.total_attempted,
      trend: s.trend,
    }))

    return NextResponse.json({ skills })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
