import { createClient } from '@supabase/supabase-js';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
import { CATEGORY_GROUPS } from '../src/lib/questions/categories';

dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Question {
  id: number;
  section: string;
  category: string;
  difficulty: string;
  type: string;
  stem: string;
  stimulus: string | null;
  options: { label: string; text: string }[];
  correct_answer: string;
  explanation: string;
  common_mistakes: any;
  skills: string[];
  tags: string[];
  review_status: string;
}

// Get all known category keys
const allKnownCategories = new Set<string>();
for (const group of CATEGORY_GROUPS) {
  for (const key of group.keys) {
    allKnownCategories.add(key);
  }
}

const elaReadingCategories = new Set([
  'ela.reading.main_idea',
  'ela.reading.inference', 
  'ela.reading.figurative_language',
  'ela.reading.tone_mood',
  'ela.reading.plot_character',
  'ela.reading.vocabulary_in_context',
  'ela.reading.authors_purpose',
  'ela.reading.text_structure',
  'ela.reading.best_evidence',
  'ela.reading.claim_evidence',
  'ela.reading.claim_vs_evidence'
]);

async function fetchAllQuestions(): Promise<Question[]> {
  console.log('📥 Fetching all questions from database...');
  const allQuestions: Question[] = [];
  let offset = 0;
  
  while (true) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .range(offset, offset + 999);
      
    if (error) {
      console.error('Error fetching questions:', error);
      break;
    }
    
    if (!data || data.length === 0) break;
    
    allQuestions.push(...data as Question[]);
    offset += data.length;
    console.log(`  Fetched ${allQuestions.length} questions...`);
    
    if (data.length < 1000) break;
  }
  
  console.log(`✅ Total questions fetched: ${allQuestions.length}`);
  return allQuestions;
}

async function runQAAudit() {
  console.log('🔍 Starting comprehensive QA audit...\n');
  
  const questions = await fetchAllQuestions();
  const issues: string[] = [];
  
  console.log('📊 Running quality checks...\n');
  
  // 1. Check correct_answer is valid (A, B, C, or D)
  let invalidAnswers = 0;
  for (const q of questions) {
    if (!['A', 'B', 'C', 'D'].includes(q.correct_answer)) {
      issues.push(`Question ${q.id}: Invalid correct_answer '${q.correct_answer}'`);
      invalidAnswers++;
    }
  }
  console.log(`✅ Correct answers: ${invalidAnswers} invalid (${questions.length - invalidAnswers} valid)`);
  
  // 2. Check options has exactly 4 items
  let wrongOptionCount = 0;
  for (const q of questions) {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      issues.push(`Question ${q.id}: Has ${q.options?.length || 0} options, should be 4`);
      wrongOptionCount++;
    }
  }
  console.log(`✅ Option count: ${wrongOptionCount} wrong (${questions.length - wrongOptionCount} correct)`);
  
  // 3. Check no empty options
  let emptyOptions = 0;
  for (const q of questions) {
    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        if (!opt.text || opt.text.trim() === '') {
          issues.push(`Question ${q.id}: Empty option text for label '${opt.label}'`);
          emptyOptions++;
          break;
        }
      }
    }
  }
  console.log(`✅ Empty options: ${emptyOptions} questions with empty options`);
  
  // 4. Check no duplicate options within questions
  let duplicateOptions = 0;
  for (const q of questions) {
    if (Array.isArray(q.options)) {
      const texts = q.options.map(opt => opt.text?.trim().toLowerCase());
      const uniqueTexts = new Set(texts);
      if (texts.length !== uniqueTexts.size) {
        issues.push(`Question ${q.id}: Has duplicate option texts`);
        duplicateOptions++;
      }
      
      // Also check labels are A, B, C, D
      const labels = q.options.map(opt => opt.label);
      const expectedLabels = ['A', 'B', 'C', 'D'];
      if (labels.sort().join('') !== expectedLabels.sort().join('')) {
        issues.push(`Question ${q.id}: Incorrect option labels: ${labels.join(', ')}`);
      }
    }
  }
  console.log(`✅ Duplicate options: ${duplicateOptions} questions with duplicate option texts`);
  
  // 5. Check common_mistakes format
  let wrongMistakeFormat = 0;
  for (const q of questions) {
    if (!Array.isArray(q.common_mistakes)) {
      issues.push(`Question ${q.id}: common_mistakes is not an array`);
      wrongMistakeFormat++;
    } else {
      // Check if it's old string format or new object format
      let hasOldFormat = false;
      let hasNewFormat = false;
      
      for (const mistake of q.common_mistakes) {
        if (typeof mistake === 'string') {
          hasOldFormat = true;
        } else if (mistake && typeof mistake === 'object' && mistake.label && mistake.explanation) {
          hasNewFormat = true;
        } else {
          issues.push(`Question ${q.id}: Invalid common_mistake format: ${JSON.stringify(mistake)}`);
          wrongMistakeFormat++;
          break;
        }
      }
      
      if (hasOldFormat && hasNewFormat) {
        issues.push(`Question ${q.id}: Mixed common_mistakes format (both string and object)`);
        wrongMistakeFormat++;
      }
    }
  }
  console.log(`✅ Common mistakes format: ${wrongMistakeFormat} with wrong format`);
  
  // 6. Check category matches known keys
  let unknownCategories = 0;
  const foundCategories = new Set<string>();
  for (const q of questions) {
    foundCategories.add(q.category);
    if (!allKnownCategories.has(q.category)) {
      issues.push(`Question ${q.id}: Unknown category '${q.category}'`);
      unknownCategories++;
    }
  }
  console.log(`✅ Category validation: ${unknownCategories} unknown categories`);
  console.log(`   Found ${foundCategories.size} unique categories in database`);
  
  // 7. Check ELA reading questions have stimulus
  let missingStimulus = 0;
  for (const q of questions) {
    if (elaReadingCategories.has(q.category)) {
      if (!q.stimulus || q.stimulus.trim() === '') {
        issues.push(`Question ${q.id}: ELA reading question missing stimulus`);
        missingStimulus++;
      }
    }
  }
  console.log(`✅ ELA stimulus: ${missingStimulus} reading questions missing stimulus`);
  
  // 8. Check for duplicate stems
  console.log('\\n🔍 Checking for duplicate question stems...');
  const stemCounts = new Map<string, number[]>();
  for (const q of questions) {
    const stem = q.stem.trim();
    if (!stemCounts.has(stem)) {
      stemCounts.set(stem, []);
    }
    stemCounts.get(stem)!.push(q.id);
  }
  
  let duplicateStems = 0;
  for (const [stem, ids] of stemCounts.entries()) {
    if (ids.length > 1) {
      issues.push(`Duplicate stem (${ids.length} questions): "${stem.slice(0, 100)}..." - IDs: ${ids.join(', ')}`);
      duplicateStems++;
    }
  }
  console.log(`✅ Duplicate stems: ${duplicateStems} duplicate question stems found`);
  
  // 9. Category group counts
  console.log('\\n📈 Category group question counts:');
  const groupCounts = new Map<string, number>();
  
  for (const group of CATEGORY_GROUPS) {
    let count = 0;
    for (const key of group.keys) {
      const keyCount = questions.filter(q => q.category === key).length;
      count += keyCount;
    }
    groupCounts.set(group.id, count);
    const status = count >= 180 ? '✅' : count >= 150 ? '⚠️' : '❌';
    console.log(`  ${status} ${group.label}: ${count} questions`);
  }
  
  // Summary
  console.log('\\n🎯 AUDIT SUMMARY:');
  console.log(`📊 Total questions: ${questions.length}`);
  console.log(`🚨 Total issues found: ${issues.length}`);
  console.log(`📋 Breakdown:`);
  console.log(`   - Invalid correct answers: ${invalidAnswers}`);
  console.log(`   - Wrong option count: ${wrongOptionCount}`);
  console.log(`   - Empty options: ${emptyOptions}`);
  console.log(`   - Duplicate options: ${duplicateOptions}`);
  console.log(`   - Wrong mistake format: ${wrongMistakeFormat}`);
  console.log(`   - Unknown categories: ${unknownCategories}`);
  console.log(`   - Missing stimulus: ${missingStimulus}`);
  console.log(`   - Duplicate stems: ${duplicateStems}`);
  
  if (issues.length > 0) {
    console.log('\\n🐛 DETAILED ISSUES:');
    issues.slice(0, 50).forEach(issue => console.log(`   - ${issue}`));
    if (issues.length > 50) {
      console.log(`   ... and ${issues.length - 50} more issues`);
    }
  }
  
  console.log('\\n🏆 FINAL STATUS:');
  if (issues.length === 0) {
    console.log('🎉 Perfect! No quality issues found.');
  } else if (issues.length < 100) {
    console.log('✅ Good! Minor issues found but overall quality is high.');
  } else {
    console.log('⚠️  Some quality issues found. Consider reviewing and fixing.');
  }
}

if (require.main === module) {
  runQAAudit().catch(console.error);
}