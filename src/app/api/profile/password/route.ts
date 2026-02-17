// TODO: POST - Change password
// - Validate current password
// - Call supabase.auth.updateUser({ password: newPassword })

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // TODO: Implement
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 })
}
