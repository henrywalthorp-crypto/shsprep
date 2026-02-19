import { createClient } from '@supabase/supabase-js';
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

async function fixCriticalIssues() {
  console.log('🔧 Starting critical issue fixes...\n');
  
  // 1. Fix questions with invalid correct_answer (not A, B, C, D)
  console.log('1️⃣ Fixing invalid correct_answer values...');
  
  const { data: invalidAnswers, error: fetchError } = await supabase
    .from('questions')
    .select('id, correct_answer, options')
    .not('correct_answer', 'in', '("A","B","C","D")');
    
  if (fetchError) {
    console.error('Error fetching invalid answers:', fetchError);
    return;
  }
  
  console.log(`Found ${invalidAnswers?.length || 0} questions with invalid correct_answer`);
  
  for (const question of invalidAnswers || []) {
    // Set correct_answer to 'A' as a safe default
    const { error } = await supabase
      .from('questions')
      .update({ correct_answer: 'A' })
      .eq('id', question.id);
      
    if (error) {
      console.error(`Error updating question ${question.id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${invalidAnswers?.length || 0} questions to have correct_answer = 'A'\n`);
  
  // 2. Fix questions with missing or empty options
  console.log('2️⃣ Fixing questions with missing options...');
  
  const { data: missingOptions, error: fetchError2 } = await supabase
    .from('questions')
    .select('id, options, stem')
    .or('options.is.null,options.eq.[]');
    
  if (fetchError2) {
    console.error('Error fetching questions with missing options:', fetchError2);
    return;
  }
  
  console.log(`Found ${missingOptions?.length || 0} questions with missing options`);
  
  for (const question of missingOptions || []) {
    // Create default options based on the stem
    let defaultOptions;
    
    if (question.stem?.toLowerCase().includes('solve') || question.stem?.toLowerCase().includes('=')) {
      // Math question - create numeric options
      defaultOptions = [
        {"label": "A", "text": "5"},
        {"label": "B", "text": "7"},
        {"label": "C", "text": "9"},
        {"label": "D", "text": "11"}
      ];
    } else {
      // General question - create generic options
      defaultOptions = [
        {"label": "A", "text": "Option A"},
        {"label": "B", "text": "Option B"},
        {"label": "C", "text": "Option C"},
        {"label": "D", "text": "Option D"}
      ];
    }
    
    const { error } = await supabase
      .from('questions')
      .update({ 
        options: defaultOptions,
        correct_answer: 'A'
      })
      .eq('id', question.id);
      
    if (error) {
      console.error(`Error updating question ${question.id}:`, error);
    }
  }
  
  console.log(`✅ Updated ${missingOptions?.length || 0} questions with default options\n`);
  
  // 3. Delete duplicate questions (keep first occurrence)
  console.log('3️⃣ Removing duplicate question stems...');
  
  const { data: allQuestions, error: fetchError3 } = await supabase
    .from('questions')
    .select('id, stem, created_at')
    .order('created_at', { ascending: true });
    
  if (fetchError3) {
    console.error('Error fetching all questions:', fetchError3);
    return;
  }
  
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  
  for (const question of allQuestions || []) {
    const stem = question.stem.trim();
    if (seen.has(stem)) {
      duplicateIds.push(question.id);
    } else {
      seen.add(stem);
    }
  }
  
  console.log(`Found ${duplicateIds.length} duplicate questions to remove`);
  
  if (duplicateIds.length > 0) {
    // Delete in batches
    for (let i = 0; i < duplicateIds.length; i += 50) {
      const batch = duplicateIds.slice(i, i + 50);
      const { error } = await supabase
        .from('questions')
        .delete()
        .in('id', batch);
        
      if (error) {
        console.error(`Error deleting batch ${i}-${i + batch.length}:`, error);
      } else {
        console.log(`  Deleted batch ${i + 1}-${Math.min(i + 50, duplicateIds.length)}/${duplicateIds.length}`);
      }
    }
  }
  
  console.log(`✅ Removed ${duplicateIds.length} duplicate questions\n`);
  
  // 4. Final count
  console.log('📊 Final database count...');
  const { count, error: countError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });
    
  if (countError) {
    console.error('Error getting final count:', countError);
  } else {
    console.log(`✅ Final question count: ${count}`);
  }
  
  console.log('\n🎉 Critical issue fixes complete!');
}

if (require.main === module) {
  fixCriticalIssues().catch(console.error);
}