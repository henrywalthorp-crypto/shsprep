// TODO: GET - OAuth callback handler (Google)
// - Exchange auth code for session using supabase.auth.exchangeCodeForSession()
// - Check if profile exists and onboarding is complete
// - Redirect to /dashboard or /signup/onboarding accordingly

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // TODO: Implement
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
