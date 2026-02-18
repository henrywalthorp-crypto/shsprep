import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  commonMistakes: { label: string; explanation: string }[] | string[];
  skills?: string[];
  tags?: string[];
}

async function main() {
  const questionsDir = resolve(__dirname, '..', 'content', 'questions');
  const files = readdirSync(questionsDir).filter(f => f.startsWith('round2_') && f.endsWith('.json'));

  console.log(`Found ${files.length} round2 question files`);

  // Get existing stems to avoid duplicates
  const existingStems = new Set<string>();
  let offset = 0;
  while (true) {
    const { data, error } = await supabase.from('questions').select('stem').range(offset, offset + 999);
    if (error || !data || data.length === 0) break;
    data.forEach(q => existingStems.add(q.stem.trim()));
    offset += data.length;
    if (data.length < 1000) break;
  }
  console.log(`Existing questions: ${existingStems.size}`);

  let totalInserted = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  for (const file of files) {
    const filePath = resolve(questionsDir, file);
    const questions: RawQuestion[] = JSON.parse(readFileSync(filePath, 'utf-8'));
    console.log(`\nProcessing ${file}: ${questions.length} questions`);

    const newQuestions = questions.filter(q => !existingStems.has(q.stem.trim()));
    const skipped = questions.length - newQuestions.length;
    totalSkipped += skipped;
    if (skipped > 0) console.log(`  Skipped ${skipped} duplicates`);
    if (newQuestions.length === 0) { console.log(`  All duplicates, skipping file`); continue; }

    const rows = newQuestions.map(q => ({
      section: q.category.startsWith('math') ? 'math' : 'ela',
      category: q.category,
      subcategory: null,
      difficulty: String(q.difficulty),
      type: 'multiple_choice',
      stem: q.stem,
      stimulus: q.stimulus ?? null,
      options: q.options.map(o => ({
        label: o.label,
        text: o.text,
        isCorrect: o.label === q.correctAnswer,
      })),
      correct_answer: q.correctAnswer,
      passage_id: null,
      explanation: q.explanation,
      common_mistakes: q.commonMistakes,
      skills: q.skills ?? [],
      tags: q.tags ?? [],
      review_status: 'published',
    }));

    // Insert in batches of 50
    for (let i = 0; i < rows.length; i += 50) {
      const batch = rows.slice(i, i + 50);
      const { error } = await supabase.from('questions').insert(batch);
      if (error) {
        errors.push(`${file} batch ${i}: ${error.message}`);
        console.error(`  Error: ${error.message}`);
      } else {
        totalInserted += batch.length;
        console.log(`  Inserted ${Math.min(i + 50, rows.length)}/${rows.length}`);
      }
    }
  }

  console.log(`\n✅ Total inserted: ${totalInserted} (skipped ${totalSkipped} duplicates)`);
  if (errors.length) {
    console.error(`❌ ${errors.length} error(s):`);
    errors.forEach(e => console.error(`  - ${e}`));
  }

  // Verify counts
  console.log('\n--- Verification: Category group counts ---');
  const groups: Record<string, string[]> = {
    'math-algebra': ['math.algebra.linear_equations', 'math.algebra.systems', 'math.algebra.expressions', 'math.algebra.word_problems', 'math.algebraic_modeling'],
    'math-exponents': ['math.algebra.exponents', 'math.scientific_notation'],
    'math-inequalities': ['math.algebra.inequalities', 'math.algebra.absolute_value', 'math.arithmetic.absolute_value'],
    'math-ratios': ['math.arithmetic.ratios_proportions', 'math.ratio_proportion', 'math.proportional_reasoning', 'math.arithmetic.percent_change', 'math.percent_applications'],
    'math-arithmetic': ['math.arithmetic.fractions', 'math.arithmetic.decimals', 'math.arithmetic.order_of_operations', 'math.number_theory.divisibility', 'math.number_theory.gcf_lcm', 'math.number_theory.primes'],
    'math-geometry-shapes': ['math.geometry.angles', 'math.geometry.triangles', 'math.geometry.area', 'math.geometry.perimeter_area', 'math.geometry.circles', 'math.geometry.composite', 'math.geometry.pythagorean_theorem'],
    'math-geometry-3d': ['math.geometry.volume', 'math.geometry.3d.surface_area', 'math.geometry.3d.cross_sections'],
    'math-coordinate': ['math.geometry.coordinate_geometry', 'math.geometry.transformations', 'math.geometry.coordinate_slope', 'math.geometry.coordinate_midpoint'],
    'math-statistics': ['math.statistics.mean_median_mode', 'math.statistics.range', 'math.statistics.data_interpretation', 'math.data_interpretation', 'math.functions.tables'],
    'math-probability': ['math.probability.basic', 'math.probability.compound', 'math.statistics.probability', 'math.sets.venn_diagrams'],
    'math-patterns': ['math.algebra.patterns_sequences', 'math.sequences_patterns'],
    'math-word-problems': ['math.word_problems', 'math.word_problems.age_problems', 'math.word_problems.combined_work', 'math.word_problems.rate_distance_time', 'math.measurement.unit_conversion'],
    'ela-main-idea': ['ela.reading.main_idea', 'ela.reading.authors_purpose', 'ela.reading.text_structure'],
    'ela-inference': ['ela.reading.inference', 'ela.reading.best_evidence', 'ela.reading.claim_evidence'],
    'ela-literary': ['ela.reading.figurative_language', 'ela.reading.tone_mood', 'ela.reading.plot_character', 'ela.reading.vocabulary_in_context'],
    'ela-grammar': ['ela.revising.grammar.subject_verb', 'ela.revising.grammar.fragments', 'ela.revising.grammar.run_ons', 'ela.revising.grammar.comma_splice', 'ela.revising.grammar.parallel_structure', 'ela.revising.grammar.pronoun_antecedent', 'ela.revising.grammar.verb_tense'],
    'ela-punctuation': ['ela.revising.grammar.comma_usage', 'ela.revising.grammar.semicolon_colon', 'ela.revising.punctuation.colon_usage', 'ela.revising.mechanics.apostrophes'],
    'ela-style': ['ela.revising.grammar.word_choice', 'ela.revising.grammar.transitions', 'ela.revising.style.conciseness', 'ela.revising.style.precise_language', 'ela.revising.style.active_passive'],
    'ela-passage-revision': ['ela.revising.passage', 'ela.revising.passage.best_transition', 'ela.revising.passage.sentence_revision', 'ela.revising.organization.transitions'],
  };

  for (const [group, categories] of Object.entries(groups)) {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .in('category', categories);
    if (error) {
      console.error(`  ${group}: ERROR - ${error.message}`);
    } else {
      const status = (count ?? 0) >= 100 ? '✅' : `⚠️ (${100 - (count ?? 0)} short)`;
      console.log(`  ${status} ${group}: ${count}`);
    }
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
