import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { selectQuestions } from '@/lib/questions/engine'
import type { EngineSkillStats, Question, SessionConfig } from '@/lib/types'

const startPracticeSchema = z.object({
  section: z.enum(['ela', 'math']).optional(),
  category: z.string().optional(),
  difficulty: z.enum(['1', '2', '3']).optional(),
  mode: z.enum(['practice', 'timed_practice']),
  questionCount: z.number().int().min(10).max(50),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = startPracticeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { section, category, difficulty, mode, questionCount } = parsed.data

    // Fetch all available questions matching filters
    let query = supabase
      .from('questions')
      .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id, passage_question_order')

    if (section) query = query.eq('section', section)
    if (category) query = query.like('category', `${category}%`)
    if (difficulty) query = query.eq('difficulty', difficulty)

    const { data: availableQuestions, error: qError } = await query
    if (qError || !availableQuestions || availableQuestions.length === 0) {
      return NextResponse.json({ error: 'No questions available matching criteria' }, { status: 404 })
    }

    // Fetch student's skill stats for adaptive selection
    const { data: allStats } = await supabase
      .from('student_skill_stats')
      .select('*')
      .eq('student_id', user.id)

    const engineStats: EngineSkillStats[] = (allStats || []).map(s => ({
      category: s.category,
      totalAttempted: s.total_attempted,
      totalCorrect: s.total_correct,
      accuracy: s.accuracy,
      recentAccuracy: s.recent_accuracy,
      trend: s.trend,
      masteryLevel: s.mastery_level,
      lastPracticedAt: s.last_practiced_at,
    }))

    // Fetch recently answered question IDs for cooldown
    const { data: recentAttempts } = await supabase
      .from('practice_attempts')
      .select('question_id')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    const recentQuestionIds = recentAttempts?.map(a => a.question_id) || []

    // Use adaptive engine to select questions
    const sessionConfig: SessionConfig = {
      section,
      category,
      difficulty,
      mode,
      questionCount,
    }

    const selections = selectQuestions(
      engineStats,
      sessionConfig,
      availableQuestions as Question[],
      recentQuestionIds
    )

    // Get the actual question objects for selected IDs
    let questions = availableQuestions
    if (selections.length > 0) {
      const selectedIds = new Set(selections.map(s => s.questionId))
      questions = availableQuestions.filter(q => selectedIds.has(q.id))
      // Maintain the order from the engine
      const idOrder = new Map(selections.map((s, i) => [s.questionId, i]))
      questions.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0))
    }

    // Fallback: if engine returned fewer than requested, use raw query results
    if (questions.length === 0) {
      questions = availableQuestions.slice(0, questionCount)
    }

    // Create session
    const timeLimitSeconds = mode === 'timed_practice' ? questionCount * 90 : null

    const { data: session, error: sError } = await supabase
      .from('practice_sessions')
      .insert({
        student_id: user.id,
        mode,
        status: 'in_progress',
        section_filter: section || null,
        category_filter: category || null,
        difficulty_filter: difficulty || null,
        time_limit_seconds: timeLimitSeconds,
        total_questions: questions.length,
      })
      .select()
      .single()

    if (sError || !session) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Return first question
    const firstQuestion = questions[0]

    return NextResponse.json({
      sessionId: session.id,
      firstQuestion,
      totalQuestions: questions.length,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
