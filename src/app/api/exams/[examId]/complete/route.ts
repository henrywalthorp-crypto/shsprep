// TODO: POST - Submit completed exam
// - Compute raw scores per section
// - Apply scaling formula for scaled/composite scores
// - Update exams row with all score fields
// - Return full score breakdown

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
