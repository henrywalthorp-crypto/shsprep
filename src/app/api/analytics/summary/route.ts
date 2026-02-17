import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Total practiced & accuracy
    const { data: attempts } = await supabase
      .from('practice_attempts')
      .select('is_correct, created_at')
      .eq('student_id', user.id)

    const totalPracticed = attempts?.length || 0
    const totalCorrect = attempts?.filter(a => a.is_correct).length || 0
    const overallAccuracy = totalPracticed > 0 ? totalCorrect / totalPracticed : 0

    // Current streak (consecutive days with practice)
    const daySet = new Set<string>()
    for (const a of attempts || []) {
      daySet.add(new Date(a.created_at).toISOString().slice(0, 10))
    }
    const sortedDays = Array.from(daySet).sort().reverse()
    let currentStreak = 0
    const today = new Date()
    for (let i = 0; i < sortedDays.length; i++) {
      const expected = new Date(today)
      expected.setDate(expected.getDate() - i)
      const expectedStr = expected.toISOString().slice(0, 10)
      if (sortedDays[i] === expectedStr) {
        currentStreak++
      } else {
        break
      }
    }

    // Skills
    const { data: skills } = await supabase
      .from('student_skill_stats')
      .select('category, mastery_level, accuracy')
      .eq('student_id', user.id)
      .order('mastery_level', { ascending: true })

    const weakestSkills = (skills || []).slice(0, 5).map(s => ({
      category: s.category,
      mastery: s.mastery_level,
      accuracy: s.accuracy,
    }))

    const strongestSkills = (skills || []).slice(-5).reverse().map(s => ({
      category: s.category,
      mastery: s.mastery_level,
      accuracy: s.accuracy,
    }))

    // Recent sessions
    const { data: recentSessions } = await supabase
      .from('practice_sessions')
      .select('id, mode, section_filter, accuracy, total_questions, time_spent_seconds, completed_at')
      .eq('student_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(5)

    return NextResponse.json({
      totalPracticed,
      overallAccuracy,
      currentStreak,
      weakestSkills,
      strongestSkills,
      recentSessions,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
