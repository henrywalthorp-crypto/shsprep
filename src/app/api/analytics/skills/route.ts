// TODO: GET - Per-skill breakdown from student_skill_stats
// - Return all categories with mastery_level, accuracy, trend
// - Sorted by weakest first

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
