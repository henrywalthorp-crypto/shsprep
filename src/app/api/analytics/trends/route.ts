import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get completed sessions
    const { data: sessions, error } = await supabase
      .from('practice_sessions')
      .select('accuracy, total_questions, completed_at')
      .eq('student_id', user.id)
      .eq('status', 'completed')
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch trends' }, { status: 500 })
    }

    // Group by week
    const weeklyMap: Record<string, { totalAccuracy: number; count: number; questions: number }> = {}
    const monthlyMap: Record<string, { totalAccuracy: number; count: number; questions: number }> = {}

    for (const s of sessions || []) {
      if (!s.completed_at) continue
      const d = new Date(s.completed_at)

      // Week key (ISO week start - Monday)
      const day = d.getDay()
      const monday = new Date(d)
      monday.setDate(d.getDate() - ((day + 6) % 7))
      const weekKey = monday.toISOString().slice(0, 10)

      // Month key
      const monthKey = d.toISOString().slice(0, 7)

      if (!weeklyMap[weekKey]) weeklyMap[weekKey] = { totalAccuracy: 0, count: 0, questions: 0 }
      weeklyMap[weekKey].totalAccuracy += (s.accuracy || 0)
      weeklyMap[weekKey].count++
      weeklyMap[weekKey].questions += (s.total_questions || 0)

      if (!monthlyMap[monthKey]) monthlyMap[monthKey] = { totalAccuracy: 0, count: 0, questions: 0 }
      monthlyMap[monthKey].totalAccuracy += (s.accuracy || 0)
      monthlyMap[monthKey].count++
      monthlyMap[monthKey].questions += (s.total_questions || 0)
    }

    const weekly = Object.entries(weeklyMap).map(([week, d]) => ({
      week,
      avgAccuracy: d.count > 0 ? d.totalAccuracy / d.count : 0,
      questionsCompleted: d.questions,
    }))

    const monthly = Object.entries(monthlyMap).map(([month, d]) => ({
      month,
      avgAccuracy: d.count > 0 ? d.totalAccuracy / d.count : 0,
      questionsCompleted: d.questions,
    }))

    return NextResponse.json({ weekly, monthly })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
