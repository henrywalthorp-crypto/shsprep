// TODO: GET  - List student's exams with scores
// TODO: POST - Start new full-length exam (57 ELA + 57 Math)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function POST(request: NextRequest) {
  // TODO: Generate fixed exam question set, create session + exam row
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
