import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getGroupById } from '@/lib/questions/categories'

// GET: get progress for all category groups
export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all practice attempts for this student with question categories
    const { data: attempts, error } = await supabase
      .from('practice_attempts')
      .select('question_id, is_correct, questions:question_id(category)')
      .eq('student_id', user.id)

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    return NextResponse.json({ attempts: attempts || [] })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: start a targeted practice session for a specific group
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single()

    if (!profile || (profile.subscription_status !== 'active' && profile.subscription_status !== 'trialing')) {
      return NextResponse.json({ error: 'Subscription required', redirect: '/signup/paywall' }, { status: 403 })
    }

    const { groupId, questionCount = 10 } = await request.json()
    const group = getGroupById(groupId)
    if (!group) {
      return NextResponse.json({ error: 'Invalid category group' }, { status: 400 })
    }

    // Fetch questions matching any of the group's category keys
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id')
      .in('category', group.keys)
      .eq('review_status', 'published')
      .limit(questionCount)

    if (qErr || !questions || questions.length === 0) {
      // Fallback: try without review_status filter
      const { data: fallbackQ, error: fbErr } = await supabase
        .from('questions')
        .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id')
        .in('category', group.keys)
        .limit(questionCount)

      if (fbErr || !fallbackQ || fallbackQ.length === 0) {
        return NextResponse.json({ error: 'No questions available for this topic' }, { status: 404 })
      }

      return createSession(supabase, user.id, fallbackQ, group.section, group.keys[0], questionCount)
    }

    return createSession(supabase, user.id, questions, group.section, group.keys[0], questionCount)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function createSession(
  supabase: any,
  userId: string,
  questions: any[],
  section: string,
  category: string,
  questionCount: number
) {
  // Create practice session
  const { data: session, error: sErr } = await supabase
    .from('practice_sessions')
    .insert({
      student_id: userId,
      mode: 'practice',
      status: 'in_progress',
      section_filter: section,
      category_filter: category,
      total_questions: Math.min(questions.length, questionCount),
    })
    .select('id')
    .single()

  if (sErr) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  // Shuffle and pick
  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, questionCount)
  const firstQuestion = shuffled[0]

  // Pre-queue remaining questions
  const remaining = shuffled.slice(1)

  return NextResponse.json({
    sessionId: session.id,
    firstQuestion,
    totalQuestions: shuffled.length,
    remainingQuestionIds: remaining.map((q: any) => q.id),
  })
}
