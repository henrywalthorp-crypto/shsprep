import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

export async function POST() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'student') {
      return NextResponse.json({ error: 'Forbidden: student role required' }, { status: 403 })
    }

    // Generate and update invite code (retry on collision)
    let inviteCode: string
    let attempts = 0
    while (true) {
      inviteCode = generateInviteCode()
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ invite_code: inviteCode })
        .eq('id', user.id)

      if (!updateError) break

      attempts++
      if (attempts >= 5) {
        return NextResponse.json({ error: 'Failed to generate unique invite code' }, { status: 500 })
      }
    }

    return NextResponse.json({ inviteCode })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
