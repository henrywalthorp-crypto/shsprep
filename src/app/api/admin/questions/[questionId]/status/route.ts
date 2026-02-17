import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'
import { z } from 'zod'

const statusSchema = z.object({
  status: z.enum(['draft', 'reviewed', 'approved', 'published']),
})

type RouteContext = { params: Promise<{ questionId: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { questionId } = await context.params
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = statusSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })

    const { data: question, error } = await supabase
      .from('questions')
      .update({ review_status: parsed.data.status })
      .eq('id', questionId)
      .select()
      .single()

    if (error) return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
    return NextResponse.json({ question })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
