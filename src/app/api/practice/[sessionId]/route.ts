// TODO: GET - Get current session state (current question, progress, time)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
