import { createServerClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const linkSchema = z.object({
  inviteCode: z.string().min(1).max(8).transform(v => v.toUpperCase().trim()),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify parent role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'parent') {
      return NextResponse.json({ error: 'Forbidden: parent role required' }, { status: 403 })
    }

    // Validate body
    const body = await request.json()
    const parsed = linkSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 })
    }

    const { inviteCode } = parsed.data

    // Find student with this invite code
    const { data: student } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, grade, role')
      .eq('invite_code', inviteCode)
      .single()

    if (!student || student.role !== 'student') {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 })
    }

    // Check not already linked
    const { data: existing } = await supabase
      .from('parent_student_links')
      .select('id')
      .eq('parent_id', user.id)
      .eq('student_id', student.id)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Already linked to this student' }, { status: 409 })
    }

    // Create link
    const { error: insertError } = await supabase
      .from('parent_student_links')
      .insert({ parent_id: user.id, student_id: student.id })

    if (insertError) {
      return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      student: {
        firstName: student.first_name,
        lastName: student.last_name,
        grade: student.grade,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
