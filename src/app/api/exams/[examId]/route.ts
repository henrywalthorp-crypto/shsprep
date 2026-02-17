import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { examId } = await params

    const { data: session, error: sError } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', examId)
      .eq('student_id', user.id)
      .eq('mode', 'exam')
      .single()

    if (sError || !session) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 })
    }

    // Get attempts
    const { data: attempts } = await supabase
      .from('practice_attempts')
      .select('question_id, is_correct, attempt_order')
      .eq('session_id', examId)
      .order('attempt_order', { ascending: true })

    const answered = attempts?.length || 0
    const correct = attempts?.filter(a => a.is_correct).length || 0
    const answeredIds = new Set(attempts?.map(a => a.question_id) || [])

    // Get all exam questions (ELA + Math)
    const { data: elaQ } = await supabase
      .from('questions')
      .select('id, section, category, difficulty, type, stem, stimulus, options, passage_id')
      .eq('section', 'ela')
      .limit(57)

    const { data: mathQ } = await supabase
      .from('questions')
      .select('id, section, category, difficulty, type, stem, stimulus, options, passage_id')
      .eq('section', 'math')
      .limit(57)

    const allQuestions = [...(elaQ || []), ...(mathQ || [])]
    const currentQuestion = allQuestions.find(q => !answeredIds.has(q.id)) || null

    // Calculate time remaining
    const startedAt = new Date(session.started_at).getTime()
    const elapsed = Math.floor((Date.now() - startedAt) / 1000)
    const timeRemaining = Math.max((session.time_limit_seconds || 10800) - elapsed, 0)

    return NextResponse.json({
      session: {
        id: session.id,
        mode: session.mode,
        status: session.status,
        startedAt: session.started_at,
        timeLimit: session.time_limit_seconds,
      },
      currentQuestion,
      progress: { answered, total: session.total_questions, correct },
      timeRemaining,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
