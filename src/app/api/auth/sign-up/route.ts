// TODO: POST - Register new user with email/password
// - Validate input (email, password, first_name, last_name, role)
// - Call supabase.auth.signUp() with user metadata
// - Profile auto-created via DB trigger (handle_new_user)
// - Return session or redirect to onboarding

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
