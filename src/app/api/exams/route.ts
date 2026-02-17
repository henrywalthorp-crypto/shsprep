import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isSubscriptionActive } from '@/lib/stripe'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: exams, error } = await supabase
      .from('exams')
      .select('*')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 })
    }

    return NextResponse.json({ exams })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check subscription - exams require premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_ends_at')
      .eq('id', user.id)
      .single()

    if (!isSubscriptionActive(profile?.subscription_status, profile?.subscription_ends_at)) {
      return NextResponse.json(
        { error: 'Active subscription required', redirect: '/signup/paywall' },
        { status: 403 }
      )
    }

    // Select 57 ELA questions
    const { data: elaQuestions } = await supabase
      .from('questions')
      .select('id')
      .eq('section', 'ela')
      .limit(57)

    // Select 57 Math questions
    const { data: mathQuestions } = await supabase
      .from('questions')
      .select('id')
      .eq('section', 'math')
      .limit(57)

    const elaCount = elaQuestions?.length || 0
    const mathCount = mathQuestions?.length || 0
    const totalQuestions = elaCount + mathCount

    if (totalQuestions === 0) {
      return NextResponse.json({ error: 'Not enough questions available' }, { status: 404 })
    }

    // Create exam session (3 hours = 10800 seconds)
    const { data: session, error: sError } = await supabase
      .from('practice_sessions')
      .insert({
        student_id: user.id,
        mode: 'exam',
        status: 'in_progress',
        time_limit_seconds: 10800,
        total_questions: totalQuestions,
      })
      .select()
      .single()

    if (sError || !session) {
      return NextResponse.json({ error: 'Failed to create exam session' }, { status: 500 })
    }

    return NextResponse.json({
      examId: session.id,
      totalQuestions,
      timeLimit: 10800,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
