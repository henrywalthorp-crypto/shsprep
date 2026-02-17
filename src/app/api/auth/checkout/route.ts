// TODO: POST - Create Stripe checkout session
// TODO: GET  - Verify checkout completion by session_id

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO: Create Stripe checkout session with price ID
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}

export async function GET(request: NextRequest) {
  // TODO: Verify payment session, update user subscription status
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
