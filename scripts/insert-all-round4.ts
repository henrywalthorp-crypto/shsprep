import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { readdirSync, readFileSync } from 'fs';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  const dir = resolve(__dirname, '../content/questions');
  const files = readdirSync(dir).filter(f => f.startsWith('round4_'));
  
  let totalInserted = 0;
  let totalSkipped = 0;
  
  for (const file of files) {
    const questions = JSON.parse(readFileSync(resolve(dir, file), 'utf-8'));
    console.log(`Processing ${file}: ${questions.length} questions`);
    
    // Check which stems already exist
    const stems = questions.map((q: any) => q.stem);
    const { data: existing } = await supabase
      .from('questions')
      .select('stem')
      .in('stem', stems);
    
    const existingStems = new Set((existing || []).map((e: any) => e.stem));
    
    const newQuestions = questions.filter((q: any) => !existingStems.has(q.stem));
    console.log(`  New: ${newQuestions.length}, Already exist: ${questions.length - newQuestions.length}`);
    
    if (newQuestions.length === 0) { totalSkipped += questions.length; continue; }
    
    // Insert in batches of 50
    for (let i = 0; i < newQuestions.length; i += 50) {
      const batch = newQuestions.slice(i, i + 50).map((q: any) => ({
        ...q,
        question_type: q.question_type || 'multiple_choice',
        review_status: 'published',
        common_mistakes: Array.isArray(q.common_mistakes) 
          ? q.common_mistakes.map((cm: any) => 
              typeof cm === 'string' ? { label: cm, explanation: cm } : cm
            )
          : [],
      }));
      
      const { error } = await supabase.from('questions').insert(batch);
      if (error) {
        console.error(`  Batch error:`, error.message);
        // Try one-by-one
        for (const q of batch) {
          const { error: e2 } = await supabase.from('questions').insert(q);
          if (e2) console.error(`  Single error (${q.stem.slice(0,40)}...):`, e2.message);
          else totalInserted++;
        }
      } else {
        totalInserted += batch.length;
      }
    }
  }
  
  console.log(`\nDone! Inserted: ${totalInserted}, Skipped (dupes): ${totalSkipped}`);
  
  // Final count
  const { count } = await supabase.from('questions').select('*', { count: 'exact', head: true });
  console.log(`Total questions in DB: ${count}`);
}

run().catch(console.error);
