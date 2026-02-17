import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { updateMastery, calculateTrend } from '@/lib/questions/engine'

const answerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.string().min(1),
  timeSpent: z.number().int().min(0),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { sessionId } = await params
    const body = await request.json()
    const parsed = answerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { questionId, answer, timeSpent } = parsed.data

    // Verify session belongs to user
    const { data: session, error: sError } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('student_id', user.id)
      .single()

    if (sError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (session.status !== 'in_progress') {
      return NextResponse.json({ error: 'Session is not in progress' }, { status: 400 })
    }

    // Get question with correct answer
    const { data: question, error: qError } = await supabase
      .from('questions')
      .select('*')
      .eq('id', questionId)
      .single()

    if (qError || !question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const isCorrect = answer === question.correct_answer

    // Count existing attempts for ordering
    const { count: attemptCount } = await supabase
      .from('practice_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId)

    // Create attempt
    const { error: aError } = await supabase
      .from('practice_attempts')
      .insert({
        session_id: sessionId,
        question_id: questionId,
        student_id: user.id,
        selected_answer: answer,
        is_correct: isCorrect,
        time_spent_seconds: timeSpent,
        attempt_order: (attemptCount || 0) + 1,
      })

    if (aError) {
      return NextResponse.json({ error: 'Failed to record attempt' }, { status: 500 })
    }

    // Update session time
    await supabase
      .from('practice_sessions')
      .update({ time_spent_seconds: (session.time_spent_seconds || 0) + timeSpent })
      .eq('id', sessionId)

    // Update skill stats
    const { data: existingStats } = await supabase
      .from('student_skill_stats')
      .select('*')
      .eq('student_id', user.id)
      .eq('category', question.category)
      .single()

    if (existingStats) {
      const newTotal = existingStats.total_attempted + 1
      const newCorrect = existingStats.total_correct + (isCorrect ? 1 : 0)
      const newAccuracy = newCorrect / newTotal
      const newMastery = updateMastery(existingStats.mastery_level, isCorrect, question.difficulty)
      const newTrend = calculateTrend([isCorrect]) // simplified — full trend needs recent results array

      await supabase
        .from('student_skill_stats')
        .update({
          total_attempted: newTotal,
          total_correct: newCorrect,
          accuracy: newAccuracy,
          mastery_level: newMastery,
          trend: newTrend,
          last_practiced_at: new Date().toISOString(),
        })
        .eq('id', existingStats.id)
    } else {
      await supabase
        .from('student_skill_stats')
        .insert({
          student_id: user.id,
          category: question.category,
          total_attempted: 1,
          total_correct: isCorrect ? 1 : 0,
          accuracy: isCorrect ? 1 : 0,
          recent_accuracy: isCorrect ? 1 : 0,
          mastery_level: updateMastery(0.5, isCorrect, question.difficulty),
          trend: 'stable',
          last_practiced_at: new Date().toISOString(),
        })
    }

    // Find next question
    const answeredIds = await supabase
      .from('practice_attempts')
      .select('question_id')
      .eq('session_id', sessionId)

    const answeredSet = new Set(answeredIds.data?.map(a => a.question_id) || [])

    let nextQuery = supabase
      .from('questions')
      .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id')

    if (session.section_filter) nextQuery = nextQuery.eq('section', session.section_filter)
    if (session.category_filter) nextQuery = nextQuery.like('category', `${session.category_filter}%`)
    if (session.difficulty_filter) nextQuery = nextQuery.eq('difficulty', session.difficulty_filter)

    nextQuery = nextQuery.limit(session.total_questions)

    const { data: allQuestions } = await nextQuery
    const nextQuestion = allQuestions?.find(q => !answeredSet.has(q.id)) || null

    return NextResponse.json({
      isCorrect,
      correctAnswer: question.correct_answer,
      explanation: question.explanation,
      commonMistakes: question.common_mistakes,
      nextQuestion,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
