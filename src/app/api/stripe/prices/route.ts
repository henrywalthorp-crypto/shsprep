import { NextResponse } from 'next/server'
import { PLANS } from '@/lib/stripe'

export async function GET() {
  const plans = [
    {
      id: 'monthly',
      name: PLANS.monthly.name,
      price: PLANS.monthly.price,
      interval: PLANS.monthly.interval,
      popular: false,
    },
    {
      id: 'annual',
      name: PLANS.annual.name,
      price: PLANS.annual.price,
      interval: PLANS.annual.interval,
      popular: true,
      savings: '58%',
    },
  ]

  return NextResponse.json({ plans })
}
