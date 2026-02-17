import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { verifyAdmin } from '@/lib/admin/verify-admin'
import { z } from 'zod'

const bulkQuestionSchema = z.object({
  section: z.enum(['ela', 'math']),
  category: z.string().min(1),
  subcategory: z.string().optional(),
  difficulty: z.enum(['1', '2', '3']).default('2'),
  type: z.enum(['multiple_choice', 'grid_in', 'multi_select', 'drag_drop', 'matrix_sort', 'inline_choice', 'dropdown']).default('multiple_choice'),
  stem: z.string().min(1),
  stimulus: z.string().optional(),
  options: z.any().optional(),
  correct_answer: z.string().min(1),
  explanation: z.string().min(1),
  common_mistakes: z.any().optional(),
  tei_config: z.any().optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  // Passage fields for reading questions
  passage: z.object({
    type: z.enum(['fiction', 'nonfiction', 'poetry', 'historical']),
    title: z.string().min(1),
    text: z.string().min(1),
    word_count: z.number(),
    reading_level: z.string().optional(),
    metadata: z.any().optional(),
  }).optional(),
  passage_question_order: z.number().optional(),
})

const bulkBodySchema = z.object({
  questions: z.array(bulkQuestionSchema),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { isAdmin } = await verifyAdmin(supabase)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const parsed = bulkBodySchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Validation failed', details: parsed.error.issues }, { status: 400 })

    const errors: { index: number; error: string }[] = []
    let inserted = 0
    // Cache passages by title to avoid duplicates within batch
    const passageCache = new Map<string, string>()

    for (let i = 0; i < parsed.data.questions.length; i++) {
      const { passage, ...questionData } = parsed.data.questions[i]
      let passage_id: string | undefined

      if (passage) {
        const cacheKey = passage.title
        if (passageCache.has(cacheKey)) {
          passage_id = passageCache.get(cacheKey)
        } else {
          // Check if passage exists
          const { data: existing } = await supabase
            .from('passages')
            .select('id')
            .eq('title', passage.title)
            .single()

          if (existing) {
            passage_id = existing.id
          } else {
            const { data: newPassage, error: pErr } = await supabase
              .from('passages')
              .insert({ ...passage, review_status: 'draft' })
              .select('id')
              .single()
            if (pErr) {
              errors.push({ index: i, error: `Passage creation failed: ${pErr.message}` })
              continue
            }
            passage_id = newPassage!.id
          }
          passageCache.set(cacheKey, passage_id!)
        }
      }

      const { error: qErr } = await supabase
        .from('questions')
        .insert({
          ...questionData,
          passage_id,
          review_status: 'draft',
        })

      if (qErr) {
        errors.push({ index: i, error: qErr.message })
      } else {
        inserted++
      }
    }

    return NextResponse.json({ inserted, errors })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
