import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { isSubscriptionActive } from '@/lib/stripe'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_plan, subscription_ends_at')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const isActive = isSubscriptionActive(profile.subscription_status, profile.subscription_ends_at)
    
    let daysRemaining: number | null = null
    if (isActive && profile.subscription_ends_at) {
      const endDate = new Date(profile.subscription_ends_at)
      const now = new Date()
      daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    }

    return NextResponse.json({
      status: profile.subscription_status || 'inactive',
      plan: profile.subscription_plan,
      endsAt: profile.subscription_ends_at,
      isActive,
      daysRemaining,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
