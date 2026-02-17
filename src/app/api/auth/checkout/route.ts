import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Stripe not configured yet' })
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Stripe not configured yet' })
}
