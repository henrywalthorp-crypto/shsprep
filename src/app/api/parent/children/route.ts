import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify parent role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden: parent role required' }, { status: 403 })
    }

    // Get linked students
    const { data: links, error: linksError } = await supabase
      .from('parent_student_links')
      .select('student_id')
      .eq('parent_id', user.id)

    if (linksError) {
      return NextResponse.json({ error: 'Failed to fetch linked students' }, { status: 500 })
    }

    if (!links || links.length === 0) {
      return NextResponse.json({ children: [] })
    }

    const studentIds = links.map(l => l.student_id)

    // Fetch profiles for linked students
    const { data: students } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade, target_school, updated_at')
      .in('id', studentIds)

    // Fetch aggregate skill stats per student
    const { data: skillStats } = await supabase
      .from('student_skill_stats')
      .select('student_id, total_attempted, total_correct, accuracy, last_practiced_at')
      .in('student_id', studentIds)

    // Fetch recent session dates
    const { data: recentSessions } = await supabase
      .from('practice_sessions')
      .select('student_id, completed_at')
      .in('student_id', studentIds)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })

    // Build response
    const children = (students || []).map(student => {
      const stats = (skillStats || []).filter(s => s.student_id === student.id)
      const totalPracticed = stats.reduce((sum, s) => sum + (s.total_attempted || 0), 0)
      const totalCorrect = stats.reduce((sum, s) => sum + (s.total_correct || 0), 0)
      const overallAccuracy = totalPracticed > 0 ? Math.round((totalCorrect / totalPracticed) * 100) : 0

      const lastSession = (recentSessions || []).find(s => s.student_id === student.id)
      const lastActive = lastSession?.completed_at || student.updated_at

      return {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        grade: student.grade,
        targetSchool: student.target_school,
        lastActive,
        overallAccuracy,
        totalPracticed,
      }
    })

    return NextResponse.json({ children })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
