import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(
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

    const { data: session, error: sError } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('student_id', user.id)
      .single()

    if (sError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Session already completed' }, { status: 400 })
    }

    // Get all attempts with question categories
    const { data: attempts } = await supabase
      .from('practice_attempts')
      .select('is_correct, time_spent_seconds, question_id, questions(category)')
      .eq('session_id', sessionId)

    const totalQuestions = attempts?.length || 0
    const totalCorrect = attempts?.filter(a => a.is_correct).length || 0
    const accuracy = totalQuestions > 0 ? totalCorrect / totalQuestions : 0
    const totalTimeSpent = attempts?.reduce((sum, a) => sum + (a.time_spent_seconds || 0), 0) || 0

    // Skill breakdown
    const skillMap: Record<string, { correct: number; total: number }> = {}
    for (const a of attempts || []) {
      const cat = (a.questions as unknown as { category: string })?.category || 'unknown'
      if (!skillMap[cat]) skillMap[cat] = { correct: 0, total: 0 }
      skillMap[cat].total++
      if (a.is_correct) skillMap[cat].correct++
    }

    const skillBreakdown = Object.entries(skillMap).map(([category, stats]) => ({
      category,
      correct: stats.correct,
      total: stats.total,
      accuracy: stats.total > 0 ? stats.correct / stats.total : 0,
    }))

    // Update session
    await supabase
      .from('practice_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        correct_count: totalCorrect,
        accuracy,
        time_spent_seconds: totalTimeSpent,
      })
      .eq('id', sessionId)

    return NextResponse.json({
      accuracy,
      totalCorrect,
      totalQuestions,
      skillBreakdown,
      timeSpent: totalTimeSpent,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
