import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load .env.local manually since dotenv doesn't auto-load it
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BATCH_SIZE = 50;
const forceFlag = process.argv.includes('--force');

interface RawOption {
  label: string;
  text: string;
}

interface RawQuestion {
  id: string;
  section: string;
  category: string;
  subcategory?: string;
  difficulty: number;
  type: string;
  stem: string;
  stimulus?: string | null;
  options: RawOption[] | null;
  correctAnswer: string;
  passageId?: string | null;
  explanation: string;
  commonMistakes?: string[];
  skills?: string[];
  tags?: string[];
}

interface RawPassage {
  id?: string;
  passageId?: string;
  type?: string;
  genre?: string;
  title: string;
  text: string;
  wordCount?: number;
  word_count?: number;
}

interface QuestionBank {
  meta: { total: number; generated: string };
  math: RawQuestion[];
  ela_reading: { passages: RawPassage[]; questions: RawQuestion[] };
  ela_revising: RawQuestion[];
}

function mapPassageType(rawType: string): string {
  const map: Record<string, string> = {
    contemporary_fiction: 'fiction',
    classic_fiction: 'fiction',
    fiction: 'fiction',
    science: 'nonfiction',
    nonfiction: 'nonfiction',
    informational: 'nonfiction',
    historical: 'historical',
    historical_document: 'historical',
    historical_fiction: 'fiction',
    historical_nonfiction: 'historical',
    memoir: 'nonfiction',
    memoir_personal_narrative: 'nonfiction',
    stem_nonfiction: 'nonfiction',
    social_science_nonfiction: 'nonfiction',
    science_nature_essay: 'nonfiction',
    persuasive_argumentative: 'nonfiction',
    social_studies_civics: 'nonfiction',
    literary_fiction_coming_of_age: 'fiction',
    biography: 'nonfiction',
    poetry: 'poetry',
    persuasive: 'nonfiction',
    speech: 'historical',
    essay: 'nonfiction',
  };
  return map[rawType.toLowerCase()] || 'nonfiction';
}

function mapQuestionType(t: string): string {
  if (t === 'mc' || t === 'multiple_choice') return 'multiple_choice';
  if (t === 'grid-in' || t === 'grid_in') return 'grid_in';
  return 'multiple_choice';
}

function mapSection(category: string): string {
  return category.startsWith('math') ? 'math' : 'ela';
}

function buildOptions(opts: RawOption[] | null, correctAnswer: string) {
  if (!opts) return null;
  return opts.map((o) => ({
    label: o.label,
    text: o.text,
    isCorrect: o.label === correctAnswer,
  }));
}

async function seed() {
  // --- Idempotency check ---
  const { count, error: countErr } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true });

  if (countErr) {
    console.error('Error checking existing questions:', countErr.message);
    process.exit(1);
  }

  if ((count ?? 0) > 0 && !forceFlag) {
    console.log(`Database already has ${count} questions. Use --force to clear and re-seed.`);
    return;
  }

  if (forceFlag && (count ?? 0) > 0) {
    console.log('--force: clearing existing data...');
    // Delete questions first (FK), then passages
    await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('passages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('Cleared.');
  }

  // --- Load data ---
  const dataPath = resolve(__dirname, '..', 'content', 'questions', 'all_questions.json');
  const data: QuestionBank = JSON.parse(readFileSync(dataPath, 'utf-8'));

  let passagesInserted = 0;
  let questionsInserted = 0;
  const errors: string[] = [];
  const passageIdMap = new Map<string, string>(); // original id → UUID

  // --- A. Seed passages ---
  console.log(`Seeding ${data.ela_reading.passages.length} passages...`);
  for (const p of data.ela_reading.passages) {
    const pid = p.id ?? p.passageId ?? `unknown-${passagesInserted}`;
    const rawType = p.type ?? p.genre ?? 'nonfiction';
    const wordCount = p.wordCount ?? p.word_count ?? p.text.split(/\s+/).length;
    const { data: inserted, error } = await supabase
      .from('passages')
      .insert({
        type: mapPassageType(rawType),
        title: p.title,
        text: p.text,
        word_count: wordCount,
        review_status: 'published',
        metadata: { original_id: pid, original_type: rawType },
      })
      .select('id')
      .single();

    if (error) {
      errors.push(`Passage ${pid}: ${error.message}`);
    } else {
      passageIdMap.set(pid, inserted.id);
      passagesInserted++;
    }
  }
  console.log(`Passages inserted: ${passagesInserted}`);

  // --- B. Seed questions in batches ---
  const allQuestions: RawQuestion[] = [
    ...data.math,
    ...data.ela_reading.questions,
    ...data.ela_revising,
  ];

  console.log(`Seeding ${allQuestions.length} questions in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
    const batch = allQuestions.slice(i, i + BATCH_SIZE);
    const rows = batch.map((q) => ({
      section: mapSection(q.category),
      category: q.category,
      subcategory: q.subcategory ?? null,
      difficulty: String(q.difficulty) as '1' | '2' | '3',
      type: mapQuestionType(q.type),
      stem: q.stem,
      stimulus: q.stimulus ?? null,
      options: buildOptions(q.options, q.correctAnswer),
      correct_answer: q.correctAnswer,
      passage_id: q.passageId ? passageIdMap.get(q.passageId) ?? null : null,
      explanation: q.explanation,
      common_mistakes: q.commonMistakes ?? [],
      skills: q.skills ?? [],
      tags: q.tags ?? [],
      review_status: 'published' as const,
    }));

    const { error } = await supabase.from('questions').insert(rows);
    if (error) {
      errors.push(`Batch ${i}-${i + batch.length}: ${error.message}`);
    } else {
      questionsInserted += batch.length;
    }
    process.stdout.write(`  ${Math.min(i + BATCH_SIZE, allQuestions.length)}/${allQuestions.length}\r`);
  }

  // --- C. Report ---
  console.log(`\n✅ Done!`);
  console.log(`   Passages inserted: ${passagesInserted}`);
  console.log(`   Questions inserted: ${questionsInserted}`);
  if (errors.length) {
    console.error(`\n❌ ${errors.length} error(s):`);
    errors.forEach((e) => console.error(`   - ${e}`));
  }
}

seed().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
