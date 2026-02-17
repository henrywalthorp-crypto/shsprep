// TODO: POST - Save onboarding responses
// - Body: { feeling, confidence_subjects, current_score, target_score, worries }
// - Update profile with onboarding data
// - Mark onboarding_complete = true
// - Seed initial student_skill_stats based on confidence selections

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
