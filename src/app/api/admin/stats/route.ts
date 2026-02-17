import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'

export async function GET() {
  try {
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Total questions + by section
    const { count: totalQuestions } = await supabase.from('questions').select('id', { count: 'exact', head: true })
    const { count: mathCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('section', 'math')
    const { count: elaCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('section', 'ela')

    // By review_status
    const { count: draftCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('review_status', 'draft')
    const { count: reviewedCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('review_status', 'reviewed')
    const { count: approvedCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('review_status', 'approved')
    const { count: publishedCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('review_status', 'published')

    // By difficulty
    const { count: diff1 } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('difficulty', '1')
    const { count: diff2 } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('difficulty', '2')
    const { count: diff3 } = await supabase.from('questions').select('id', { count: 'exact', head: true }).eq('difficulty', '3')

    // Top categories
    const { data: allQuestions } = await supabase.from('questions').select('category')
    const categoryCounts: Record<string, number> = {}
    allQuestions?.forEach(q => { categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1 })
    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, count]) => ({ category, count }))

    // Passages
    const { count: totalPassages } = await supabase.from('passages').select('id', { count: 'exact', head: true })
    const { data: passageTypes } = await supabase.from('passages').select('type')
    const passageTypeCounts: Record<string, number> = {}
    passageTypes?.forEach(p => { passageTypeCounts[p.type] = (passageTypeCounts[p.type] || 0) + 1 })

    // Avg questions per passage
    const { data: passagesWithQ } = await supabase.from('passages').select('id, questions(count)')
    const avgQuestionsPerPassage = passagesWithQ && passagesWithQ.length > 0
      ? passagesWithQ.reduce((sum, p) => {
          const qCount = Array.isArray(p.questions) ? p.questions.length : ((p.questions as unknown as { count: number })?.count || 0)
          return sum + qCount
        }, 0) / passagesWithQ.length
      : 0

    // Recently added (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { count: recentCount } = await supabase.from('questions').select('id', { count: 'exact', head: true }).gte('created_at', sevenDaysAgo)

    return NextResponse.json({
      questions: {
        total: totalQuestions || 0,
        bySection: { math: mathCount || 0, ela: elaCount || 0 },
        byStatus: { draft: draftCount || 0, reviewed: reviewedCount || 0, approved: approvedCount || 0, published: publishedCount || 0 },
        byDifficulty: { '1': diff1 || 0, '2': diff2 || 0, '3': diff3 || 0 },
        topCategories,
        recentlyAdded: recentCount || 0,
      },
      passages: {
        total: totalPassages || 0,
        byType: passageTypeCounts,
        avgQuestionsPerPassage: Math.round(avgQuestionsPerPassage * 10) / 10,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
