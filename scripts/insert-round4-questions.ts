import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface RawQuestion {
  section: string;
  category: string;
  difficulty: number;
  type: string;
  stem: string;
  stimulus?: string | null;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  commonMistakes: { label: string; explanation: string }[];
  skills?: string[];
  tags?: string[];
}

async function main() {
  const questionsDir = resolve(__dirname, '..', 'content', 'questions');
  const files = readdirSync(questionsDir).filter(f => f.startsWith('round4_') && f.endsWith('.json'));

  console.log(`Found ${files.length} Round 4 question files`);

  // Get existing stems to avoid duplicates
  console.log('Checking for existing questions to avoid duplicates...');
  const existingStems = new Set<string>();
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.from('questions').select('stem').range(offset, offset + 999);
    if (error) {
      console.error('Error fetching existing questions:', error);
      break;
    }
    if (!data || data.length === 0) break;
    data.forEach(q => existingStems.add(q.stem.trim()));
    offset += data.length;
    if (data.length < 1000) break;
  }
  console.log(`Found ${existingStems.size} existing questions in database`);

  let totalInserted = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  for (const file of files) {
    const filePath = resolve(questionsDir, file);
    const questions: RawQuestion[] = JSON.parse(readFileSync(filePath, 'utf-8'));
    console.log(`\\nProcessing ${file}: ${questions.length} questions`);

    // Filter out duplicates
    const newQuestions = questions.filter(q => !existingStems.has(q.stem.trim()));
    const skipped = questions.length - newQuestions.length;
    totalSkipped += skipped;
    
    if (skipped > 0) console.log(`  Skipped ${skipped} duplicates`);
    if (newQuestions.length === 0) { 
      console.log(`  All duplicates, skipping file`); 
      continue; 
    }

    // Transform questions to database format
    const rows = newQuestions.map(q => ({
      section: q.category.startsWith('math') ? 'math' : 'ela',
      category: q.category,
      subcategory: null,
      difficulty: String(Math.min(q.difficulty, 3)), // Map 4,5 to 3
      type: 'multiple_choice',
      stem: q.stem,
      stimulus: q.stimulus ?? null,
      options: q.options,
      correct_answer: q.correctAnswer,
      passage_id: null,
      explanation: q.explanation,
      common_mistakes: q.commonMistakes,
      skills: q.skills ?? [],
      tags: q.tags ?? [],
      review_status: 'published',
    }));

    // Insert in batches of 50
    console.log(`  Inserting ${rows.length} new questions...`);
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error } = await supabase.from('questions').insert(batch);
      if (error) {
        errors.push(`${file} batch ${i}-${i + batch.length}: ${error.message}`);
        console.error(`  Error in batch ${i}-${i + batch.length}: ${error.message}`);
      } else {
        totalInserted += batch.length;
        console.log(`  ✅ Inserted batch ${i + 1}-${Math.min(i + 50, rows.length)}/${rows.length}`);
      }
      
      // Add existing stems to prevent duplicates in subsequent batches
      batch.forEach(q => existingStems.add(q.stem.trim()));
    }
  }

  console.log(`\\n🎉 INSERTION COMPLETE!`);
  console.log(`📊 Total inserted: ${totalInserted} questions`);
  console.log(`⏭️  Total skipped (duplicates): ${totalSkipped} questions`);
  
  if (errors.length) {
    console.error(`\\n❌ ${errors.length} error(s) occurred:`);
    errors.forEach(e => console.error(`  - ${e}`));
  }

  // Final count verification
  console.log('\\n--- Final Database Count Verification ---');
  const { count: totalCount, error: countError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('Error getting final count:', countError);
  } else {
    console.log(`📈 Total questions in database: ${totalCount}`);
    console.log(`🎯 Target: 3,800 questions (200 per group × 19 groups)`);
    
    if (totalCount && totalCount >= 3800) {
      console.log(`✅ SUCCESS! Target reached or exceeded.`);
    } else {
      console.log(`⚠️  Still need ${3800 - (totalCount || 0)} more questions to reach target.`);
    }
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});