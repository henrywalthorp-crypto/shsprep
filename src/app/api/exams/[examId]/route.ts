// TODO: GET - Get exam state (questions, answers so far, time remaining)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ examId: string }> }
) {
  const { examId } = await params
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
