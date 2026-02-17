import { createServerClient } from '@/lib/supabase/server'
import { verifyParentStudentLink } from '@/lib/parent/verify-link'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
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

    // Parse query params
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const section = searchParams.get('section')
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from('practice_sessions')
      .select('id, mode, status, section_filter, total_questions, correct_count, accuracy, time_spent_seconds, started_at, completed_at', { count: 'exact' })
      .eq('student_id', studentId)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (section) {
      query = query.eq('section_filter', section)
    }

    const { data: sessions, count, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
    }

    return NextResponse.json({
      sessions: sessions || [],
      total: count || 0,
      page,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
