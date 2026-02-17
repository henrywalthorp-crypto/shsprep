// TODO: POST - Complete practice session
// - Compute final accuracy, total questions, time spent
// - Update practice_sessions row (status='completed')
// - Return session summary with per-skill breakdown

import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
