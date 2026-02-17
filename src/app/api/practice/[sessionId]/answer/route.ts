// TODO: POST - Submit answer for current question
// - Body: { questionId, selectedAnswer, timeSpentSeconds }
// - Record practice_attempts row
// - Update student_skill_stats via engine
// - Return { isCorrect, explanation, commonMistakes, nextQuestion }

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
