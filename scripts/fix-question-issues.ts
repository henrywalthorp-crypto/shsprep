/**
 * QA Fix Script for SHSprep Questions
 * 
 * Fixes:
 * 1. common_mistakes format: converts plain strings like "A: reason" to {label, explanation} objects
 * 2. Reports skeleton questions (empty options) for manual review
 * 3. Reports duplicate stems for manual review
 * 
 * Run: npx tsx scripts/fix-question-issues.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BATCH_SIZE = 50

async function fixCommonMistakes() {
  console.log('\n=== FIX 1: Convert common_mistakes from plain strings to {label, explanation} objects ===\n')
  
  let offset = 0
  let totalFixed = 0
  let totalSkipped = 0
  
  while (true) {
    const { data: questions, error } = await supabase
      .from('questions')
      .select('id, common_mistakes')
      .not('common_mistakes', 'is', null)
      .range(offset, offset + BATCH_SIZE - 1)
    
    if (error) { console.error('Fetch error:', error); break }
    if (!questions || questions.length === 0) break
    
    for (const q of questions) {
      const cm = q.common_mistakes as any[]
      if (!cm || cm.length === 0) continue
      
      // Already in object format
      if (typeof cm[0] === 'object' && cm[0].label) {
        totalSkipped++
        continue
      }
      
      // Convert "A: reason text" or "A - reason text" to {label, explanation}
      const converted = cm.map((item: any) => {
        if (typeof item !== 'string') return item
        
        // Try to parse "X: explanation" or "X - explanation"
        const match = item.match(/^([A-D])[\s]*[:：\-–—]\s*(.+)$/s)
        if (match) {
          return { label: match[1], explanation: match[2].trim() }
        }
        // No label prefix - use as-is with empty label
        return { label: '', explanation: item.trim() }
      })
      
      const { error: updateError } = await supabase
        .from('questions')
        .update({ common_mistakes: converted })
        .eq('id', q.id)
      
      if (updateError) {
        console.error(`  Error updating ${q.id}:`, updateError.message)
      } else {
        totalFixed++
      }
    }
    
    offset += BATCH_SIZE
    if (questions.length < BATCH_SIZE) break
  }
  
  console.log(`  Fixed: ${totalFixed}`)
  console.log(`  Already OK: ${totalSkipped}`)
}

async function reportSkeletonQuestions() {
  console.log('\n=== REPORT: Skeleton questions (options with no text/label) ===\n')
  
  let offset = 0
  const skeletons: { id: string; category: string; correct_answer: string }[] = []
  
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, category, correct_answer, options')
      .range(offset, offset + 200 - 1)
    
    if (error || !data || data.length === 0) break
    
    for (const q of data) {
      const opts = q.options as any[]
      if (opts && opts.every((o: any) => !o.text && !o.label)) {
        skeletons.push({ id: q.id, category: q.category, correct_answer: q.correct_answer })
      }
    }
    
    offset += 200
    if (data.length < 200) break
  }
  
  console.log(`  Total skeleton questions: ${skeletons.length}`)
  
  const abcd = skeletons.filter(s => ['A','B','C','D'].includes(s.correct_answer))
  const numeric = skeletons.filter(s => !['A','B','C','D'].includes(s.correct_answer))
  
  console.log(`  With A-D answer (need option text populated): ${abcd.length}`)
  console.log(`  With numeric/text answer (need full option generation): ${numeric.length}`)
  console.log(`\n  These require AI-assisted content generation. IDs saved to skeleton-question-ids.json`)
  
  const fs = await import('fs')
  fs.writeFileSync(
    resolve(__dirname, 'skeleton-question-ids.json'),
    JSON.stringify(skeletons.map(s => s.id), null, 2)
  )
}

async function reportDuplicates() {
  console.log('\n=== REPORT: Duplicate stems ===\n')
  
  let offset = 0
  const stemMap = new Map<string, { id: string; category: string; correct_answer: string }[]>()
  
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('id, stem, category, correct_answer')
      .range(offset, offset + 200 - 1)
    
    if (error || !data || data.length === 0) break
    
    for (const q of data) {
      const existing = stemMap.get(q.stem) || []
      existing.push({ id: q.id, category: q.category, correct_answer: q.correct_answer })
      stemMap.set(q.stem, existing)
    }
    
    offset += 200
    if (data.length < 200) break
  }
  
  const dupes = [...stemMap.entries()].filter(([_, items]) => items.length > 1)
  console.log(`  Duplicate stem groups: ${dupes.length}`)
  console.log(`  Total duplicate questions: ${dupes.reduce((sum, [_, items]) => sum + items.length, 0)}`)
  
  for (const [stem, items] of dupes) {
    console.log(`\n  "${stem.slice(0, 80)}..."`)
    for (const item of items) {
      console.log(`    ${item.id} cat=${item.category} ans=${item.correct_answer}`)
    }
  }
}

async function main() {
  console.log('SHSprep Question QA Fix Script')
  console.log('==============================')
  
  await fixCommonMistakes()
  await reportSkeletonQuestions()
  await reportDuplicates()
  
  console.log('\n\nDone!')
}

main().catch(console.error)
