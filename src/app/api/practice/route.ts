import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

    // Build question query
    let query = supabase
      .from('questions')
      .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id')

    if (section) query = query.eq('section', section)
    if (category) query = query.like('category', `${category}%`)
    if (difficulty) query = query.eq('difficulty', difficulty)

    query = query.limit(questionCount)

    const { data: questions, error: qError } = await query
    if (qError || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions available matching criteria' }, { status: 404 })
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

    // Return first question without correct answer
    const firstQuestion = questions[0]
    const { ...safeQuestion } = firstQuestion

    return NextResponse.json({
      sessionId: session.id,
      firstQuestion: safeQuestion,
      totalQuestions: questions.length,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
