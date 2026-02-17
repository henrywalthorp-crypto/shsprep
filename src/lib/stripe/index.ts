import Stripe from 'stripe'

function createStripeClient(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
    typescript: true,
  })
}

export const stripe = createStripeClient()

export const PLANS = {
  monthly: {
    name: 'Monthly',
    price: 3000, // $30.00
    interval: 'month' as const,
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID!,
  },
  annual: {
    name: 'Annual',
    price: 15000, // $150.00
    interval: 'year' as const,
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID!,
  },
} as const

export type PlanType = keyof typeof PLANS

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

// All subscriptions end Dec 31 of the current cycle year
export function getSubscriptionEndDate(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), 11, 31, 23, 59, 59) // Dec 31 of current year
}

// Helper to check if user has active subscription
export function isSubscriptionActive(status: string | null, endsAt: string | null): boolean {
  if (!status || status === 'free') return false
  if (status === 'active') {
    // Check if past Dec 31 expiry
    if (endsAt && new Date(endsAt) < new Date()) return false
    return true
  }
  if (status === 'canceled' && endsAt) {
    return new Date(endsAt) > new Date()
  }
  return false
}
