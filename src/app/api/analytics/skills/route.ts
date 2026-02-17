import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: skills, error } = await supabase
      .from('student_skill_stats')
      .select('category, mastery_level, accuracy, total_attempted, trend')
      .eq('student_id', user.id)
      .order('category', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
    }

    return NextResponse.json({
      skills: (skills || []).map(s => ({
        category: s.category,
        mastery: s.mastery_level,
        accuracy: s.accuracy,
        totalAttempted: s.total_attempted,
        trend: s.trend,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
