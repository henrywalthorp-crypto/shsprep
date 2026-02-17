// TODO: GET - List/filter questions
// - Query params: section, category, difficulty, type, limit, offset
// - Only return published questions (RLS handles this)
// - Admin can see all statuses

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
