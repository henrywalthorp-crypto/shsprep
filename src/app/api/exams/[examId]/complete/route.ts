import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

// Simple linear scaling for MVP
// Real SHSAT uses equating; this approximates with linear mapping
function scaleScore(rawScore: number, totalQuestions: number): number {
  // Scale to approximately 200-800 range per section
  const pct = totalQuestions > 0 ? rawScore / totalQuestions : 0
  return Math.round(200 + pct * 600)
}

export async function POST(
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

    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Exam already completed' }, { status: 400 })
    }

    // Get all attempts with question details
    const { data: attempts } = await supabase
      .from('practice_attempts')
      .select('is_correct, time_spent_seconds, questions(section, category, type)')
      .eq('session_id', examId)

    // Compute section breakdowns
    let elaRevisingCorrect = 0, elaRevisingTotal = 0
    let elaReadingCorrect = 0, elaReadingTotal = 0
    let mathMcCorrect = 0, mathMcTotal = 0
    let mathGridinCorrect = 0, mathGridinTotal = 0

    for (const a of attempts || []) {
      const q = a.questions as unknown as { section: string; category: string; type: string }
      if (!q) continue

      if (q.section === 'ela') {
        if (q.category.startsWith('ela.revising')) {
          elaRevisingTotal++
          if (a.is_correct) elaRevisingCorrect++
        } else {
          elaReadingTotal++
          if (a.is_correct) elaReadingCorrect++
        }
      } else {
        if (q.type === 'grid_in') {
          mathGridinTotal++
          if (a.is_correct) mathGridinCorrect++
        } else {
          mathMcTotal++
          if (a.is_correct) mathMcCorrect++
        }
      }
    }

    const elaRaw = elaRevisingCorrect + elaReadingCorrect
    const elaTotal = elaRevisingTotal + elaReadingTotal
    const mathRaw = mathMcCorrect + mathGridinCorrect
    const mathTotal = mathMcTotal + mathGridinTotal
    const elaScaled = scaleScore(elaRaw, elaTotal)
    const mathScaled = scaleScore(mathRaw, mathTotal)
    const compositeScore = elaScaled + mathScaled

    const totalTimeSpent = attempts?.reduce((s, a) => s + (a.time_spent_seconds || 0), 0) || 0

    // Mark session completed
    const totalCorrect = elaRaw + mathRaw
    const totalQuestions = (attempts?.length) || 0
    await supabase
      .from('practice_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        correct_count: totalCorrect,
        accuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
        time_spent_seconds: totalTimeSpent,
      })
      .eq('id', examId)

    // Create exam record
    const { data: exam, error: eError } = await supabase
      .from('exams')
      .insert({
        student_id: user.id,
        session_id: examId,
        ela_raw_score: elaRaw,
        math_raw_score: mathRaw,
        ela_scaled_score: elaScaled,
        math_scaled_score: mathScaled,
        composite_score: compositeScore,
        ela_revising_correct: elaRevisingCorrect,
        ela_revising_total: elaRevisingTotal,
        ela_reading_correct: elaReadingCorrect,
        ela_reading_total: elaReadingTotal,
        math_mc_correct: mathMcCorrect,
        math_mc_total: mathMcTotal,
        math_gridin_correct: mathGridinCorrect,
        math_gridin_total: mathGridinTotal,
        time_spent_seconds: totalTimeSpent,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (eError) {
      return NextResponse.json({ error: 'Failed to create exam record' }, { status: 500 })
    }

    return NextResponse.json({
      examId: exam.id,
      elaRawScore: elaRaw,
      mathRawScore: mathRaw,
      elaScaledScore: elaScaled,
      mathScaledScore: mathScaled,
      compositeScore,
      breakdown: {
        elaRevising: { correct: elaRevisingCorrect, total: elaRevisingTotal },
        elaReading: { correct: elaReadingCorrect, total: elaReadingTotal },
        mathMultipleChoice: { correct: mathMcCorrect, total: mathMcTotal },
        mathGridIn: { correct: mathGridinCorrect, total: mathGridinTotal },
      },
      timeSpent: totalTimeSpent,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
