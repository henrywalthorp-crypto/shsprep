import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const unlinkSchema = z.object({
  studentId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden: parent role required' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = unlinkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 })
    }

    const { studentId } = parsed.data

    const { error: deleteError } = await supabase
      .from('parent_student_links')
      .delete()
      .eq('parent_id', user.id)
      .eq('student_id', studentId)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to unlink' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
