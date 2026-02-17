// TODO: GET - Get single question with passage (if linked)

import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const { questionId } = await params
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
