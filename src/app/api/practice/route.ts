// TODO: POST - Start new practice session
// - Body: { section?, category?, difficulty?, mode, questionCount? }
// - Create practice_sessions row
// - Use adaptive engine to select initial question batch
// - Return session ID + first question

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
