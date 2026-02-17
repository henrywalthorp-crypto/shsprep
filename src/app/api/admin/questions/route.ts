import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'
import { z } from 'zod'

const createQuestionSchema = z.object({
  section: z.enum(['ela', 'math']),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  difficulty: z.enum(['1', '2', '3']).default('2'),
  type: z.enum(['multiple_choice', 'grid_in', 'multi_select', 'drag_drop', 'matrix_sort', 'inline_choice', 'dropdown']).default('multiple_choice'),
  stem: z.string().min(1),
  stimulus: z.string().optional(),
  options: z.any().optional(),
  correct_answer: z.string().min(1),
  passage_id: z.string().uuid().optional(),
  passage_question_order: z.number().optional(),
  explanation: z.string().min(1),
  common_mistakes: z.any().optional(),
  tei_config: z.any().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = (page - 1) * limit

    let query = supabase
      .from('questions')
      .select('*', { count: 'exact' })

    if (section) query = query.eq('section', section)
    if (category) query = query.like('category', `${category}%`)
    if (difficulty) query = query.eq('difficulty', difficulty)
    if (status) query = query.eq('review_status', status)
    if (search) query = query.ilike('stem', `%${search}%`)

    const { data: questions, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })

    const total = count || 0
    return NextResponse.json({ questions, total, page, pages: Math.ceil(total / limit) })
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
    const parsed = createQuestionSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })

    const { data: question, error } = await supabase
      .from('questions')
      .insert({ ...parsed.data, review_status: 'draft' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to create question' }, { status: 500 })
    return NextResponse.json({ question }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
