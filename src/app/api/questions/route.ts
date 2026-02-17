import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('questions')
      .select('id, section, category, subcategory, difficulty, type, stem, stimulus, options, passage_id, skills, tags, times_attempted, times_correct', { count: 'exact' })

    if (section) query = query.eq('section', section)
    if (difficulty) query = query.eq('difficulty', difficulty)
    if (category) query = query.like('category', `${category}%`)

    query = query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    const { data: questions, error, count } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
    }

    return NextResponse.json({ questions, total: count, limit, offset })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
