import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    const { data: sessions, error, count } = await supabase
      .from('practice_sessions')
      .select('id, mode, section_filter, accuracy, total_questions, time_spent_seconds, completed_at', { count: 'exact' })
      .eq('student_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
    }

    return NextResponse.json({
      sessions: (sessions || []).map(s => ({
        id: s.id,
        mode: s.mode,
        section: s.section_filter,
        accuracy: s.accuracy,
        questionsCount: s.total_questions,
        timeSpent: s.time_spent_seconds,
        completedAt: s.completed_at,
      })),
      total: count,
      limit,
      offset,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
