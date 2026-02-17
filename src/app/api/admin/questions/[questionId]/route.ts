import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'
import { z } from 'zod'

const updateQuestionSchema = z.object({
  section: z.enum(['ela', 'math']).optional(),
  category: z.string().min(1).optional(),
  subcategory: z.string().optional(),
  difficulty: z.enum(['1', '2', '3']).optional(),
  type: z.enum(['multiple_choice', 'grid_in', 'multi_select', 'drag_drop', 'matrix_sort', 'inline_choice', 'dropdown']).optional(),
  stem: z.string().min(1).optional(),
  stimulus: z.string().optional(),
  options: z.any().optional(),
  correct_answer: z.string().min(1).optional(),
  passage_id: z.string().uuid().nullable().optional(),
  passage_question_order: z.number().optional(),
  explanation: z.string().min(1).optional(),
  common_mistakes: z.any().optional(),
  tei_config: z.any().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  review_status: z.enum(['draft', 'reviewed', 'approved', 'published']).optional(),
})

type RouteContext = { params: Promise<{ questionId: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { questionId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: question, error } = await supabase
      .from('questions')
      .select('*, passage:passages(*)')
      .eq('id', questionId)
      .single()

    if (error || !question) return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { questionId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = updateQuestionSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })

    const { data: question, error } = await supabase
      .from('questions')
      .update(parsed.data)
      .eq('id', questionId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to update question' }, { status: 500 })
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { questionId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { error } = await supabase.from('questions').delete().eq('id', questionId)
    if (error) return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
