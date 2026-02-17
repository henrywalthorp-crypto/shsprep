import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'
import { z } from 'zod'

const createPassageSchema = z.object({
  type: z.enum(['fiction', 'nonfiction', 'poetry', 'historical']),
  title: z.string().min(1),
  text: z.string().min(1),
  word_count: z.number(),
  reading_level: z.string().optional(),
  metadata: z.any().optional(),
  review_status: z.enum(['draft', 'reviewed', 'approved', 'published']).default('draft'),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = (page - 1) * limit

    let query = supabase
      .from('passages')
      .select('*, questions(count)', { count: 'exact' })

    if (type) query = query.eq('type', type)
    if (status) query = query.eq('review_status', status)

    const { data: passages, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'Failed to fetch passages' }, { status: 500 })

    const total = count || 0
    return NextResponse.json({ passages, total, page, pages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = createPassageSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })

    const { data: passage, error } = await supabase
      .from('passages')
      .insert(parsed.data)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to create passage' }, { status: 500 })
    return NextResponse.json({ passage }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
