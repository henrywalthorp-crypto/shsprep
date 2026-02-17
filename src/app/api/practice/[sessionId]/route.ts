import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await params

    // Get session
    const { data: session, error: sError } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('student_id', user.id)
      .single()

    if (sError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Get attempts for this session
    const { data: attempts } = await supabase
      .from('practice_attempts')
      .select('question_id, is_correct, attempt_order')
      .eq('session_id', sessionId)
      .order('attempt_order', { ascending: true })

    const answered = attempts?.length || 0
    const correct = attempts?.filter(a => a.is_correct).length || 0
    const answeredIds = new Set(attempts?.map(a => a.question_id) || [])

    // Get questions for session (by filters)
    let query = supabase
      .from('questions')
      .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id')

    if (session.section_filter) query = query.eq('section', session.section_filter)
    if (session.category_filter) query = query.like('category', `${session.category_filter}%`)
    if (session.difficulty_filter) query = query.eq('difficulty', session.difficulty_filter)

    query = query.limit(session.total_questions)

    const { data: questions } = await query

    // Find next unanswered question
    const currentQuestion = questions?.find(q => !answeredIds.has(q.id)) || null

    return NextResponse.json({
      session: {
        id: session.id,
        mode: session.mode,
        status: session.status,
        timeLimit: session.time_limit_seconds,
        startedAt: session.started_at,
      },
      currentQuestion,
      progress: {
        answered,
        total: session.total_questions,
        correct,
      },
      timeSpent: session.time_spent_seconds,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
