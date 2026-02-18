import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { stripe, PLANS, isStripeConfigured, PlanType, getSubscriptionEndDate } from '@/lib/stripe'

// Diagnostic endpoint - DELETE after debugging
export async function GET() {
  return NextResponse.json({
    stripeConfigured: isStripeConfigured(),
    hasStripeClient: !!stripe,
    hasSecretKey: !!process.env.STRIPE_SECRET_KEY,
    secretKeyPrefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'MISSING',
    hasMonthlyPrice: !!process.env.STRIPE_MONTHLY_PRICE_ID,
    hasAnnualPrice: !!process.env.STRIPE_ANNUAL_PRICE_ID,
    monthlyPriceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'MISSING',
    annualPriceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'MISSING',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'MISSING',
  })
}

export async function POST(request: NextRequest) {
  try {
    const stripeConfigured = isStripeConfigured()
    console.log('[stripe/checkout] configured:', stripeConfigured, 'stripe client:', !!stripe)
    if (!stripeConfigured || !stripe) {
      return NextResponse.json({ 
        error: 'Payments not configured', 
        debug: { hasSecretKey: !!process.env.STRIPE_SECRET_KEY, hasMonthlyPrice: !!process.env.STRIPE_MONTHLY_PRICE_ID },
        url: null 
      }, { status: 503 })
    }

    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log('[stripe/checkout] auth:', { userId: user?.id, authError: authError?.message })
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized', debug: { authError: authError?.message } }, { status: 401 })
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
    return NextResponse.json({ error: 'Internal server error', debug: message }, { status: 500 })
  }
}
