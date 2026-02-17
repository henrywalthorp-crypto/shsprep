// Supabase middleware helper — refreshes auth session on every request
// Used by src/middleware.ts

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — IMPORTANT: don't remove this
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow auth API routes without authentication
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return supabaseResponse
  }

  // Protect dashboard routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/sign-in'
    return NextResponse.redirect(url)
  }

  // HARD PAYWALL: check subscription for dashboard routes (except /dashboard/profile)
  if (user && request.nextUrl.pathname.startsWith('/dashboard') && !request.nextUrl.pathname.startsWith('/dashboard/profile')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status, subscription_ends_at')
      .eq('id', user.id)
      .single()

    const status = profile?.subscription_status
    const endsAt = profile?.subscription_ends_at

    // Check if subscription is active
    let isActive = false
    if (status === 'active') {
      isActive = !(endsAt && new Date(endsAt) < new Date())
    } else if (status === 'canceled' && endsAt) {
      isActive = new Date(endsAt) > new Date()
    }

    if (!isActive) {
      const url = request.nextUrl.clone()
      url.pathname = '/signup/paywall'
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from sign-in/signup (but not paywall)
  if (user && (request.nextUrl.pathname === '/sign-in' || request.nextUrl.pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
