// TODO: GET - Session history list
// - Query params: limit, offset, mode
// - Return past practice sessions with scores

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
