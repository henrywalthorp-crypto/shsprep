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

    const { data: exams, error } = await supabase
      .from('exams')
      .select('id, composite_score, ela_scaled_score, math_scaled_score, ela_raw_score, math_raw_score, ela_revising_correct, ela_revising_total, ela_reading_correct, ela_reading_total, math_mc_correct, math_mc_total, math_gridin_correct, math_gridin_total, time_spent_seconds, completed_at, created_at')
      .eq('student_id', studentId)
      .order('completed_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 })
    }

    return NextResponse.json({
      exams: (exams || []).map(e => ({
        id: e.id,
        compositeScore: e.composite_score,
        elaScaled: e.ela_scaled_score,
        mathScaled: e.math_scaled_score,
        elaRaw: e.ela_raw_score,
        mathRaw: e.math_raw_score,
        elaRevisingCorrect: e.ela_revising_correct,
        elaRevisingTotal: e.ela_revising_total,
        elaReadingCorrect: e.ela_reading_correct,
        elaReadingTotal: e.ela_reading_total,
        mathMcCorrect: e.math_mc_correct,
        mathMcTotal: e.math_mc_total,
        mathGridInCorrect: e.math_gridin_correct,
        mathGridInTotal: e.math_gridin_total,
        timeSpentSeconds: e.time_spent_seconds,
        completedAt: e.completed_at,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
