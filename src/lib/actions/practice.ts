'use server'

import { createServerClient } from '@/lib/supabase/server'
import {
  updateMastery,
  selectNextQuestion,
  getDifficultyForMastery,
  calculateTrend,
} from '@/lib/questions/engine'
import type {
  Question,
  EngineSkillStats,
  DifficultyLevel,
  SubmitAnswerResponse,
  QuestionSelection,
} from '@/lib/types'

/**
 * Submit an answer for a question in a practice session.
 * Checks correctness, updates mastery, selects next question adaptively.
 */
export async function submitAnswer(
  sessionId: string,
  questionId: string,
  answer: string,
  timeSpent: number
): Promise<SubmitAnswerResponse> {
  const supabase = await createServerClient()

  // Get current user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  // Get the question
  const { data: question, error: qError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single()
  if (qError || !question) throw new Error('Question not found')

  const q = question as Question
  const isCorrect = answer.trim().toUpperCase() === q.correct_answer.trim().toUpperCase()

  // Get current attempt count for ordering
  const { count } = await supabase
    .from('practice_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId)

  // Get current skill stats for this category
  const { data: skillRow } = await supabase
    .from('student_skill_stats')
    .select('*')
    .eq('student_id', user.id)
    .eq('category', q.category)
    .single()

  const currentMastery = (skillRow?.mastery_level as number) ?? 0.5

  // Create practice_attempts row
  const { error: attemptError } = await supabase.from('practice_attempts').insert({
    session_id: sessionId,
    question_id: questionId,
    student_id: user.id,
    selected_answer: answer,
    is_correct: isCorrect,
    time_spent_seconds: Math.round(timeSpent),
    attempt_order: (count ?? 0) + 1,
    confidence_before: currentMastery,
  })
  if (attemptError) throw new Error('Failed to record attempt')

  // Update mastery
  const newMastery = updateMastery(currentMastery, isCorrect, q.difficulty)

  // Get recent results for trend
  const { data: recentAttempts } = await supabase
    .from('practice_attempts')
    .select('is_correct')
    .eq('student_id', user.id)
    .eq('question_id', questionId) // attempts for same category
    .order('created_at', { ascending: false })
    .limit(20)

  // Actually get attempts for same category via questions
  const { data: categoryAttempts } = await supabase
    .from('practice_attempts')
    .select('is_correct, questions!inner(category)')
    .eq('student_id', user.id)
    .eq('questions.category', q.category)
    .order('created_at', { ascending: false })
    .limit(20)

  const recentResults = (categoryAttempts ?? recentAttempts ?? []).map(
    (a: { is_correct: boolean | null }) => a.is_correct === true
  )
  const trend = calculateTrend(recentResults)
  const totalAttempted = (skillRow?.total_attempted ?? 0) + 1
  const totalCorrect = (skillRow?.total_correct ?? 0) + (isCorrect ? 1 : 0)
  const recentAcc = recentResults.length > 0
    ? recentResults.filter(Boolean).length / recentResults.length
    : 0

  // Upsert student_skill_stats
  await supabase.from('student_skill_stats').upsert(
    {
      student_id: user.id,
      category: q.category,
      total_attempted: totalAttempted,
      total_correct: totalCorrect,
      accuracy: totalAttempted > 0 ? totalCorrect / totalAttempted : 0,
      recent_accuracy: recentAcc,
      trend,
      mastery_level: newMastery,
      last_practiced_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,category' }
  )

  // Update session stats
  await supabase
    .from('practice_sessions')
    .update({
      total_questions: (count ?? 0) + 1,
      correct_count: isCorrect
        ? ((await supabase
            .from('practice_attempts')
            .select('*', { count: 'exact', head: true })
            .eq('session_id', sessionId)
            .eq('is_correct', true)).count ?? 0)
        : undefined,
    })
    .eq('id', sessionId)

  // Select next question adaptively
  const { data: allStats } = await supabase
    .from('student_skill_stats')
    .select('*')
    .eq('student_id', user.id)

  const { data: sessionAttempts } = await supabase
    .from('practice_attempts')
    .select('question_id, is_correct, questions!inner(category)')
    .eq('session_id', sessionId)
    .order('attempt_order', { ascending: true })

  const { data: session } = await supabase
    .from('practice_sessions')
    .select('section_filter, category_filter, difficulty_filter')
    .eq('id', sessionId)
    .single()

  // Get available questions pool
  let questionsQuery = supabase
    .from('questions')
    .select('*')
    .eq('review_status', 'published')

  if (session?.section_filter) {
    questionsQuery = questionsQuery.eq('section', session.section_filter)
  }
  if (session?.category_filter) {
    questionsQuery = questionsQuery.eq('category', session.category_filter)
  }

  const { data: availableQuestions } = await questionsQuery

  const engineStats: EngineSkillStats[] = (allStats ?? []).map((s) => ({
    category: s.category as string,
    totalAttempted: s.total_attempted as number,
    totalCorrect: s.total_correct as number,
    accuracy: s.accuracy as number,
    recentAccuracy: s.recent_accuracy as number,
    trend: s.trend as EngineSkillStats['trend'],
    masteryLevel: s.mastery_level as number,
    lastPracticedAt: s.last_practiced_at as string | null,
  }))

  const recentQs = (sessionAttempts ?? []).map((a) => ({
    questionId: a.question_id as string,
    category: (a as unknown as { questions: { category: string } }).questions.category,
    isCorrect: a.is_correct === true,
  }))

  const nextQuestion = selectNextQuestion(
    engineStats,
    recentQs,
    (availableQuestions ?? []) as Question[]
  )

  return {
    isCorrect,
    correctAnswer: q.correct_answer,
    explanation: q.explanation,
    nextQuestion,
    updatedMastery: newMastery,
  }
}

/**
 * Skip a question — records as incorrect with no answer, selects next.
 */
export async function skipQuestion(
  sessionId: string,
  questionId: string
): Promise<{ nextQuestion: QuestionSelection | null }> {
  // Treat skip as incorrect with 0 time
  const result = await submitAnswer(sessionId, questionId, '', 0)
  return { nextQuestion: result.nextQuestion }
}
