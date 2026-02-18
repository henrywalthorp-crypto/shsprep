import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { stripe, PLANS, isStripeConfigured, PlanType, getSubscriptionEndDate } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const stripeConfigured = isStripeConfigured()
    if (!stripeConfigured || !stripe) {
      console.error('[stripe/checkout] Stripe not configured:', { hasSecretKey: !!process.env.STRIPE_SECRET_KEY })
      return NextResponse.json({ error: 'Payment system temporarily unavailable', url: null }, { status: 503 })
    }

    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('[stripe/checkout] auth failed:', authError?.message)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, successUrl, cancelUrl } = body as {
      plan: PlanType
      successUrl?: string
      cancelUrl?: string
    }

    if (!plan || !PLANS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || profile?.email,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const endDate = getSubscriptionEndDate()
    const cycleYear = endDate.getFullYear()

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PLANS[plan].priceId, quantity: 1 }],
      success_url: successUrl || `${appUrl}/dashboard?upgraded=true`,
      cancel_url: cancelUrl || `${appUrl}/signup/paywall`,
      metadata: {
        supabase_user_id: user.id,
        plan,
        cycle_year: cycleYear.toString(),
        subscription_ends_at: endDate.toISOString(),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[stripe/checkout] error:', message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
