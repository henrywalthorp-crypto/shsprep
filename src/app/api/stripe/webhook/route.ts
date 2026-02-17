import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured, getSubscriptionEndDate } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const endDate = getSubscriptionEndDate()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        const plan = session.metadata?.plan
        if (userId) {
          await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_plan: plan || 'monthly',
              stripe_customer_id: session.customer as string,
              subscription_ends_at: endDate.toISOString(),
            })
            .eq('id', userId)
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase.from('payment_history').insert({
            profile_id: profile.id,
            stripe_payment_intent_id: invoice.payment_intent as string,
            stripe_subscription_id: invoice.subscription as string,
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            description: invoice.lines?.data?.[0]?.description || 'Subscription payment',
          })

          await supabase
            .from('profiles')
            .update({
              subscription_status: 'active',
              subscription_ends_at: endDate.toISOString(),
            })
            .eq('id', profile.id)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due' })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            subscription_ends_at: endDate.toISOString(),
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string
        const priceId = subscription.items.data[0]?.price?.id

        let plan = 'monthly'
        if (priceId === process.env.STRIPE_ANNUAL_PRICE_ID) plan = 'annual'

        await supabase
          .from('profiles')
          .update({
            subscription_status: subscription.status === 'active' ? 'active' : subscription.status,
            subscription_plan: plan,
            subscription_ends_at: endDate.toISOString(),
          })
          .eq('stripe_customer_id', customerId)
        break
      }

      default:
        return NextResponse.json({ received: true, handled: false }, { status: 200 })
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
