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

    // Verify parent role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden: parent role required' }, { status: 403 })
    }

    // Verify link
    const isLinked = await verifyParentStudentLink(supabase, user.id, studentId)
    if (!isLinked) {
      return NextResponse.json({ error: 'Not linked to this student' }, { status: 403 })
    }

    // Fetch student profile
    const { data: student } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade, target_school, created_at, updated_at')
      .eq('id', studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Aggregate skill stats
    const { data: skillStats } = await supabase
      .from('student_skill_stats')
      .select('*')
      .eq('student_id', studentId)

    const totalPracticed = (skillStats || []).reduce((sum, s) => sum + (s.total_attempted || 0), 0)
    const totalCorrect = (skillStats || []).reduce((sum, s) => sum + (s.total_correct || 0), 0)
    const overallAccuracy = totalPracticed > 0 ? Math.round((totalCorrect / totalPracticed) * 100) : 0

    // Recent sessions (last 10)
    const { data: recentSessions } = await supabase
      .from('practice_sessions')
      .select('id, mode, status, section_filter, total_questions, correct_count, accuracy, time_spent_seconds, started_at, completed_at')
      .eq('student_id', studentId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(10)

    // Skill summary
    const skillSummary = (skillStats || []).map(s => ({
      category: s.category,
      mastery: s.mastery_level,
      accuracy: s.accuracy,
      totalAttempted: s.total_attempted,
      trend: s.trend,
    }))

    return NextResponse.json({
      student: {
        id: student.id,
        firstName: student.first_name,
        lastName: student.last_name,
        grade: student.grade,
        targetSchool: student.target_school,
        createdAt: student.created_at,
      },
      stats: {
        totalPracticed,
        totalCorrect,
        overallAccuracy,
      },
      recentSessions: recentSessions || [],
      skills: skillSummary,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
