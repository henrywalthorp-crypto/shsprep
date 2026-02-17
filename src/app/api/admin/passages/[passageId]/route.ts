import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'
import { z } from 'zod'

const updatePassageSchema = z.object({
  type: z.enum(['fiction', 'nonfiction', 'poetry', 'historical']).optional(),
  title: z.string().min(1).optional(),
  text: z.string().min(1).optional(),
  word_count: z.number().optional(),
  reading_level: z.string().optional(),
  metadata: z.any().optional(),
  review_status: z.enum(['draft', 'reviewed', 'approved', 'published']).optional(),
})

type RouteContext = { params: Promise<{ passageId: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { passageId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { data: passage, error } = await supabase
      .from('passages')
      .select('*, questions(*)')
      .eq('id', passageId)
      .single()

    if (error || !passage) return NextResponse.json({ error: 'Passage not found' }, { status: 404 })
    return NextResponse.json({ passage })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { passageId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = updatePassageSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })

    const { data: passage, error } = await supabase
      .from('passages')
      .update(parsed.data)
      .eq('id', passageId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to update passage' }, { status: 500 })
    return NextResponse.json({ passage })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { passageId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Check for linked questions
    const { count } = await supabase
      .from('questions')
      .select('id', { count: 'exact', head: true })
      .eq('passage_id', passageId)

    if (count && count > 0) {
      return NextResponse.json({ error: `Cannot delete: ${count} questions linked to this passage` }, { status: 409 })
    }

    const { error } = await supabase.from('passages').delete().eq('id', passageId)
    if (error) return NextResponse.json({ error: 'Failed to delete passage' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
