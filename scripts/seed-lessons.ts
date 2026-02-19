import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── Math Units (full roadmap) ───────────────────────────────────────────────
const mathUnits = [
  { unit_number: 1, title: 'Arithmetic Foundations', description: 'Order of operations, fractions, and decimals', icon: '🧮', color: '#C8F27B' },
  { unit_number: 2, title: 'Number Theory', description: 'Divisibility, primes, GCF & LCM', icon: '🔢', color: '#93E1D8' },
  { unit_number: 3, title: 'Ratios & Proportions', description: 'Ratios, rates, and proportional reasoning', icon: '⚖️', color: '#F9B384' },
  { unit_number: 4, title: 'Percents', description: 'Percent calculations, change, and applications', icon: '📊', color: '#D9D9E9' },
  { unit_number: 5, title: 'Exponents & Scientific Notation', description: 'Exponent rules and scientific notation', icon: '⚡', color: '#FFD6E0' },
  { unit_number: 6, title: 'Algebra Basics', description: 'Expressions, simplifying, and evaluating', icon: '🔤', color: '#C8F27B' },
  { unit_number: 7, title: 'Linear Equations', description: 'Solving equations and word problems', icon: '📐', color: '#93E1D8' },
  { unit_number: 8, title: 'Inequalities', description: 'Solving, graphing, and absolute value', icon: '↔️', color: '#F9B384' },
  { unit_number: 9, title: 'Systems of Equations', description: 'Substitution and elimination', icon: '🔗', color: '#D9D9E9' },
  { unit_number: 10, title: 'Patterns & Sequences', description: 'Arithmetic and geometric sequences', icon: '🔄', color: '#FFD6E0' },
  { unit_number: 11, title: 'Angles & Lines', description: 'Angle relationships and parallel lines', icon: '📏', color: '#C8F27B' },
  { unit_number: 12, title: 'Triangles', description: 'Properties and Pythagorean theorem', icon: '📐', color: '#93E1D8' },
  { unit_number: 13, title: 'Circles & Polygons', description: 'Area, circumference, and composite shapes', icon: '⭕', color: '#F9B384' },
  { unit_number: 14, title: '3D Shapes', description: 'Volume and surface area', icon: '🧊', color: '#D9D9E9' },
  { unit_number: 15, title: 'Coordinate Geometry', description: 'Slope, midpoint, distance', icon: '📍', color: '#FFD6E0' },
  { unit_number: 16, title: 'Transformations', description: 'Reflections, rotations, translations', icon: '🔀', color: '#C8F27B' },
  { unit_number: 17, title: 'Statistics & Data', description: 'Mean, median, mode, data interpretation', icon: '📈', color: '#93E1D8' },
  { unit_number: 18, title: 'Probability & Counting', description: 'Basic/compound probability', icon: '🎲', color: '#F9B384' },
  { unit_number: 19, title: 'Word Problem Mastery', description: 'Rate, distance, time, work problems', icon: '📝', color: '#D9D9E9' },
];

// ── ELA Units ───────────────────────────────────────────────────────────────
const elaUnits = [
  { unit_number: 1, title: 'Subject-Verb Agreement', description: 'Matching subjects and verbs correctly', icon: '✏️', color: '#C8F27B' },
  { unit_number: 2, title: 'Fragments & Run-Ons', description: 'Identifying and fixing sentence errors', icon: '🔧', color: '#93E1D8' },
  { unit_number: 3, title: 'Verb Tense', description: 'Consistency and correct tense usage', icon: '⏰', color: '#F9B384' },
  { unit_number: 4, title: 'Pronoun Agreement', description: 'Matching pronouns to antecedents', icon: '👤', color: '#D9D9E9' },
  { unit_number: 5, title: 'Modifiers', description: 'Misplaced and dangling modifiers', icon: '🎯', color: '#FFD6E0' },
  { unit_number: 6, title: 'Parallel Structure', description: 'Parallelism in lists and comparisons', icon: '📊', color: '#C8F27B' },
  { unit_number: 7, title: 'Comma Rules', description: 'Correct comma usage and comma splices', icon: '✍️', color: '#93E1D8' },
  { unit_number: 8, title: 'Semicolons & Colons', description: 'When and how to use them', icon: '🔤', color: '#F9B384' },
  { unit_number: 9, title: 'Dashes & Apostrophes', description: 'Usage rules and common mistakes', icon: '➖', color: '#D9D9E9' },
  { unit_number: 10, title: 'Conciseness', description: 'Eliminating wordiness', icon: '✂️', color: '#FFD6E0' },
  { unit_number: 11, title: 'Word Choice & Tone', description: 'Precise language and register', icon: '🎨', color: '#C8F27B' },
  { unit_number: 12, title: 'Transitions', description: 'Connecting ideas smoothly', icon: '🔗', color: '#93E1D8' },
  { unit_number: 13, title: 'Passage Organization', description: 'Topic sentences and paragraph order', icon: '📋', color: '#F9B384' },
  { unit_number: 14, title: 'Sentence Revision', description: 'Combining and improving clarity', icon: '🔄', color: '#D9D9E9' },
  { unit_number: 15, title: 'Main Idea & Purpose', description: 'Central idea and author\'s purpose', icon: '💡', color: '#FFD6E0' },
  { unit_number: 16, title: 'Inference', description: 'Drawing conclusions from text', icon: '🔍', color: '#C8F27B' },
  { unit_number: 17, title: 'Evidence', description: 'Finding supporting evidence', icon: '📎', color: '#93E1D8' },
  { unit_number: 18, title: 'Vocabulary in Context', description: 'Word meaning from context clues', icon: '📖', color: '#F9B384' },
  { unit_number: 19, title: 'Literary Devices', description: 'Figurative language, tone, mood', icon: '🎭', color: '#D9D9E9' },
  { unit_number: 20, title: 'Text Structure', description: 'Compare/contrast, cause/effect', icon: '🏗️', color: '#FFD6E0' },
];

// ── Arithmetic Foundations Lessons (full content) ───────────────────────────
const arithmeticLessons = [
  {
    lesson_number: 1,
    title: 'Order of Operations (PEMDAS)',
    subtitle: 'The rules that govern how we calculate',
    estimated_minutes: 12,
    content: [
      {
        type: 'text',
        content: '## Why Order Matters\n\nImagine you see the expression **2 + 3 × 4**. Is the answer 20 or 14? Without a standard set of rules, different people would get different answers. That\'s why mathematicians agreed on a specific order — called the **order of operations**.'
      },
      {
        type: 'text',
        content: '## PEMDAS\n\nThe order of operations follows this hierarchy:\n\n1. **P**arentheses — Do what\'s inside parentheses first\n2. **E**xponents — Calculate powers and roots\n3. **M**ultiplication and **D**ivision — Left to right\n4. **A**ddition and **S**ubtraction — Left to right\n\n> 🔑 **Key Point:** Multiplication and division have the *same* priority. So do addition and subtraction. When they appear together, work **left to right**.'
      },
      {
        type: 'example',
        content: '### Example 1\n\nEvaluate: **8 + 2 × (3² − 1)**\n\n**Step 1:** Parentheses first → inside we have 3² − 1\n**Step 2:** Exponent inside parentheses → 9 − 1 = 8\n**Step 3:** Multiply → 2 × 8 = 16\n**Step 4:** Add → 8 + 16 = **24**'
      },
      {
        type: 'example',
        content: '### Example 2\n\nEvaluate: **48 ÷ 6 × 2 + 1**\n\n**Step 1:** Division and multiplication left to right → 48 ÷ 6 = 8\n**Step 2:** Continue left to right → 8 × 2 = 16\n**Step 3:** Add → 16 + 1 = **17**\n\n> ⚠️ **Common Mistake:** Students sometimes do 6 × 2 = 12 first, then 48 ÷ 12 = 4. Remember: go left to right for operations of equal priority!'
      },
      {
        type: 'tip',
        content: '### SHSAT Tip\n\nThe SHSAT loves to test whether you know that multiplication/division go left-to-right, not "multiplication before division." Watch for expressions like **24 ÷ 4 × 3** — the answer is 18, not 2.'
      },
      { type: 'practice', content: 'Now try some practice problems!' }
    ],
    questions: [
      {
        stem: 'What is the value of 5 + 3 × 2² − 4?',
        options: ['13', '28', '17', '9'],
        correct_answer: 'A',
        explanation: 'Exponent: 2² = 4. Multiply: 3 × 4 = 12. Add: 5 + 12 = 17. Subtract: 17 − 4 = 13.',
      },
      {
        stem: 'Evaluate: 36 ÷ 6 ÷ 2 + 1',
        options: ['4', '3', '12', '10'],
        correct_answer: 'A',
        explanation: 'Left to right: 36 ÷ 6 = 6, then 6 ÷ 2 = 3, then 3 + 1 = 4.',
      },
      {
        stem: 'What is the value of 4 × (7 − 3)² ÷ 8?',
        options: ['8', '2', '16', '32'],
        correct_answer: 'A',
        explanation: 'Parentheses: 7 − 3 = 4. Exponent: 4² = 16. Multiply: 4 × 16 = 64. Divide: 64 ÷ 8 = 8.',
      },
    ]
  },
  {
    lesson_number: 2,
    title: 'Fractions: Adding & Subtracting',
    subtitle: 'Finding common denominators and simplifying',
    estimated_minutes: 15,
    content: [
      {
        type: 'text',
        content: '## Fractions Review\n\nA fraction represents a part of a whole. The **numerator** (top) tells how many parts you have. The **denominator** (bottom) tells how many equal parts the whole is divided into.\n\nTo add or subtract fractions, you need a **common denominator** — the denominators must be the same.'
      },
      {
        type: 'text',
        content: '## Finding the Least Common Denominator (LCD)\n\nThe LCD is the smallest number that both denominators divide into evenly.\n\n**Method:** List multiples of each denominator until you find the smallest one in common.\n\n- LCD of 4 and 6: Multiples of 4: 4, 8, **12**, 16... Multiples of 6: 6, **12**, 18... → LCD = 12\n- LCD of 3 and 5: Multiples of 3: 3, 6, 9, 12, **15**... Multiples of 5: 5, 10, **15**... → LCD = 15'
      },
      {
        type: 'example',
        content: '### Example 1: Adding Fractions\n\nCalculate: **²⁄₃ + ¹⁄₄**\n\n**Step 1:** LCD of 3 and 4 = 12\n**Step 2:** Convert: ²⁄₃ = ⁸⁄₁₂ and ¹⁄₄ = ³⁄₁₂\n**Step 3:** Add numerators: ⁸⁄₁₂ + ³⁄₁₂ = **¹¹⁄₁₂**'
      },
      {
        type: 'example',
        content: '### Example 2: Subtracting Mixed Numbers\n\nCalculate: **3¹⁄₂ − 1³⁄₄**\n\n**Step 1:** Convert to improper: 3¹⁄₂ = ⁷⁄₂ and 1³⁄₄ = ⁷⁄₄\n**Step 2:** LCD of 2 and 4 = 4\n**Step 3:** Convert: ⁷⁄₂ = ¹⁴⁄₄\n**Step 4:** Subtract: ¹⁴⁄₄ − ⁷⁄₄ = ⁷⁄₄ = **1³⁄₄**'
      },
      {
        type: 'tip',
        content: '### SHSAT Tip\n\nAlways simplify your answer! If the answer choices show simplified fractions and you have ⁶⁄₈, convert to ³⁄₄. Also, watch out for mixed numbers vs improper fractions — check what format the answer choices use.'
      },
      { type: 'practice', content: 'Practice time!' }
    ],
    questions: [
      {
        stem: 'What is ³⁄₅ + ¹⁄₃?',
        options: ['14/15', '4/8', '4/15', '2/5'],
        correct_answer: 'A',
        explanation: 'LCD of 5 and 3 is 15. 3/5 = 9/15, 1/3 = 5/15. 9/15 + 5/15 = 14/15.',
      },
      {
        stem: 'What is 5¹⁄₆ − 2²⁄₃?',
        options: ['2¹⁄₂', '3¹⁄₂', '2¹⁄₃', '3¹⁄₆'],
        correct_answer: 'A',
        explanation: 'Convert: 5 1/6 = 31/6, 2 2/3 = 8/3 = 16/6. 31/6 − 16/6 = 15/6 = 5/2 = 2 1/2.',
      },
      {
        stem: 'What is ⁷⁄₈ − ¹⁄₄ + ¹⁄₂?',
        options: ['1¹⁄₈', '⁹⁄₈', '⁵⁄₈', '³⁄₄'],
        correct_answer: 'A',
        explanation: 'LCD = 8. 7/8 − 2/8 + 4/8 = 9/8 = 1 1/8.',
      },
    ]
  },
  {
    lesson_number: 3,
    title: 'Fractions: Multiplying & Dividing',
    subtitle: 'Cross-cancellation and reciprocals',
    estimated_minutes: 12,
    content: [
      {
        type: 'text',
        content: '## Multiplying Fractions\n\nMultiplying fractions is straightforward:\n\n**Multiply numerators. Multiply denominators. Simplify.**\n\n$$\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\times c}{b \\times d}$$\n\n> 💡 **Pro Tip:** Cross-cancel *before* multiplying to keep numbers small. If any numerator shares a common factor with any denominator, divide both by that factor first.'
      },
      {
        type: 'example',
        content: '### Example: Cross-Cancellation\n\nCalculate: **⁴⁄₉ × ³⁄₈**\n\n**Without cross-cancelling:** 4 × 3 = 12, 9 × 8 = 72, then simplify 12/72 = 1/6\n\n**With cross-cancelling:** 4 and 8 share factor 4 → reduce to 1 and 2. 3 and 9 share factor 3 → reduce to 1 and 3.\nNow: ¹⁄₃ × ¹⁄₂ = **¹⁄₆** ✨ Much cleaner!'
      },
      {
        type: 'text',
        content: '## Dividing Fractions\n\nTo divide by a fraction, **multiply by its reciprocal** (flip the second fraction).\n\n$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c}$$\n\nRemember: **Keep, Change, Flip** — Keep the first fraction, change ÷ to ×, flip the second.'
      },
      {
        type: 'example',
        content: '### Example\n\nCalculate: **²⁄₃ ÷ ⁴⁄₅**\n\n**Step 1:** Keep ²⁄₃, change to ×, flip ⁴⁄₅ to ⁵⁄₄\n**Step 2:** ²⁄₃ × ⁵⁄₄ = ¹⁰⁄₁₂ = **⁵⁄₆**'
      },
      {
        type: 'tip',
        content: '### SHSAT Tip\n\nWhen a problem says "what fraction of X is Y," it\'s asking for Y ÷ X. For example: "What fraction of 2/3 is 1/2?" means 1/2 ÷ 2/3 = 1/2 × 3/2 = 3/4.'
      },
      { type: 'practice', content: 'Try these!' }
    ],
    questions: [
      {
        stem: 'What is ⁵⁄₆ × ⁹⁄₁₀?',
        options: ['3/4', '45/60', '1/2', '15/16'],
        correct_answer: 'A',
        explanation: 'Cross-cancel: 5 and 10 → 1 and 2. 9 and 6 → 3 and 2. Result: 3/4.',
      },
      {
        stem: 'What is ⁷⁄₈ ÷ ¹⁄₄?',
        options: ['3¹⁄₂', '7/32', '7/4', '2'],
        correct_answer: 'A',
        explanation: '7/8 × 4/1 = 28/8 = 7/2 = 3 1/2.',
      },
      {
        stem: 'A recipe calls for ²⁄₃ cup of sugar. If you want to make ¹⁄₂ of the recipe, how much sugar do you need?',
        options: ['1/3 cup', '1/6 cup', '2/6 cup', '4/3 cups'],
        correct_answer: 'A',
        explanation: '2/3 × 1/2 = 2/6 = 1/3 cup.',
      },
    ]
  },
  {
    lesson_number: 4,
    title: 'Decimals: Operations & Conversions',
    subtitle: 'Adding, subtracting, multiplying decimals and converting to fractions',
    estimated_minutes: 12,
    content: [
      {
        type: 'text',
        content: '## Decimal Place Values\n\nDecimals extend our number system to the right of the decimal point:\n\n| Position | Name | Value |\n|---|---|---|\n| 0.1 | Tenths | 1/10 |\n| 0.01 | Hundredths | 1/100 |\n| 0.001 | Thousandths | 1/1000 |'
      },
      {
        type: 'text',
        content: '## Adding & Subtracting Decimals\n\n**Line up the decimal points**, then add/subtract as usual. Fill in zeros if needed.\n\n```\n  12.450\n+  3.075\n-------\n  15.525\n```'
      },
      {
        type: 'text',
        content: '## Multiplying Decimals\n\n1. Multiply as if there were no decimal points\n2. Count the **total decimal places** in both numbers\n3. Place the decimal point that many places from the right\n\n**Example:** 0.3 × 0.04 → 3 × 4 = 12, total decimal places = 1 + 2 = 3, so 0.012'
      },
      {
        type: 'text',
        content: '## Converting Decimals ↔ Fractions\n\n**Decimal → Fraction:** Read it as a fraction. 0.75 = 75/100 = 3/4\n\n**Fraction → Decimal:** Divide numerator by denominator. 3/8 = 3 ÷ 8 = 0.375\n\n### Common Conversions to Memorize\n| Fraction | Decimal | Percent |\n|---|---|---|\n| 1/4 | 0.25 | 25% |\n| 1/3 | 0.333... | 33.3% |\n| 1/2 | 0.5 | 50% |\n| 2/3 | 0.666... | 66.7% |\n| 3/4 | 0.75 | 75% |'
      },
      {
        type: 'tip',
        content: '### SHSAT Tip\n\nWhen comparing fractions and decimals on the SHSAT, convert everything to the same form (usually decimals). For ordering questions, this saves time and prevents errors.'
      },
      { type: 'practice', content: 'Practice time!' }
    ],
    questions: [
      {
        stem: 'What is 3.25 × 0.4?',
        options: ['1.3', '13', '0.13', '1.03'],
        correct_answer: 'A',
        explanation: '325 × 4 = 1300. Total decimal places: 2 + 1 = 3. Place decimal: 1.300 = 1.3.',
      },
      {
        stem: 'Which of the following lists the numbers in order from least to greatest? 0.35, ¹⁄₃, 0.3',
        options: ['0.3, ¹⁄₃, 0.35', '¹⁄₃, 0.3, 0.35', '0.35, ¹⁄₃, 0.3', '0.3, 0.35, ¹⁄₃'],
        correct_answer: 'A',
        explanation: 'Convert: 0.3 = 0.300, 1/3 ≈ 0.333, 0.35 = 0.350. Order: 0.300 < 0.333 < 0.350.',
      },
      {
        stem: 'What is 10.5 − 3.875?',
        options: ['6.625', '7.625', '6.375', '7.375'],
        correct_answer: 'A',
        explanation: '10.500 − 3.875 = 6.625.',
      },
    ]
  },
  {
    lesson_number: 5,
    title: 'Mixed Operations & Word Problems',
    subtitle: 'Putting it all together with real SHSAT-style problems',
    estimated_minutes: 15,
    content: [
      {
        type: 'text',
        content: '## Combining Skills\n\nReal SHSAT problems rarely test just one skill in isolation. They combine fractions, decimals, order of operations, and word problem interpretation. This lesson brings everything together.'
      },
      {
        type: 'text',
        content: '## Strategy: Translate Words to Math\n\n| Word/Phrase | Operation |\n|---|---|\n| "sum of", "more than", "increased by" | Addition (+) |\n| "difference", "less than", "decreased by" | Subtraction (−) |\n| "product of", "times", "of" | Multiplication (×) |\n| "quotient", "divided by", "per" | Division (÷) |\n| "is", "equals", "results in" | Equals (=) |'
      },
      {
        type: 'example',
        content: '### Example 1\n\nA store sells notebooks for $2.50 each. Sarah buys 3 notebooks and pays with a $10 bill. She then spends ²⁄₅ of her change on a pen. How much does the pen cost?\n\n**Step 1:** Cost of notebooks: 3 × $2.50 = $7.50\n**Step 2:** Change: $10 − $7.50 = $2.50\n**Step 3:** Pen cost: ²⁄₅ × $2.50 = $1.00'
      },
      {
        type: 'example',
        content: '### Example 2\n\nWhat is the value of ¹⁄₂ + 0.75 × (4 − 2²)?  \n\n**Step 1:** Parentheses: 4 − 2² = 4 − 4 = 0\n**Step 2:** Multiply: 0.75 × 0 = 0\n**Step 3:** Add: 0.5 + 0 = **0.5**\n\n> This is a trick question! The exponent makes the parenthetical expression zero.'
      },
      {
        type: 'tip',
        content: '### SHSAT Tip\n\nBefore calculating, **read ALL answer choices**. Sometimes you can eliminate 2-3 wrong answers with a quick estimate. If the answer should be around 6, and options are 0.6, 6, 60, and 600 — you already know it\'s 6 before computing precisely.'
      },
      { type: 'practice', content: 'Final practice!' }
    ],
    questions: [
      {
        stem: 'A tank contains 15³⁄₄ gallons of water. After using 4.5 gallons and then adding 2¹⁄₄ gallons, how many gallons are in the tank?',
        options: ['13¹⁄₂', '13³⁄₄', '12¹⁄₂', '14'],
        correct_answer: 'A',
        explanation: '15 3/4 − 4.5 + 2 1/4 = 15.75 − 4.5 + 2.25 = 11.25 + 2.25 = 13.5 = 13 1/2.',
      },
      {
        stem: 'If ³⁄₈ of a number is 24, what is ²⁄₃ of that number?',
        options: ['42²⁄₃', '16', '48', '64'],
        correct_answer: 'A',
        explanation: '3/8 × n = 24, so n = 24 × 8/3 = 64. Then 2/3 × 64 = 128/3 = 42 2/3.',
      },
      {
        stem: 'Evaluate: (0.5)² + ¹⁄₂ × 6 − 1.25',
        options: ['2', '2.25', '1.75', '3'],
        correct_answer: 'A',
        explanation: '(0.5)² = 0.25. 1/2 × 6 = 3. 0.25 + 3 − 1.25 = 2.',
      },
    ]
  },
];

async function run() {
  console.log('Seeding lesson units...');

  // Insert math units
  for (const u of mathUnits) {
    const { error } = await supabase.from('lesson_units').upsert(
      { track: 'math', ...u, lessons_count: u.unit_number === 1 ? 5 : 0 },
      { onConflict: 'track,unit_number' }
    );
    if (error) console.error(`Math unit ${u.unit_number}:`, error.message);
  }

  // Insert ELA units
  for (const u of elaUnits) {
    const { error } = await supabase.from('lesson_units').upsert(
      { track: 'ela', ...u, lessons_count: 0 },
      { onConflict: 'track,unit_number' }
    );
    if (error) console.error(`ELA unit ${u.unit_number}:`, error.message);
  }

  console.log('Units seeded. Fetching math unit 1 ID...');

  // Get math unit 1 ID
  const { data: unit1 } = await supabase
    .from('lesson_units')
    .select('id')
    .eq('track', 'math')
    .eq('unit_number', 1)
    .single();

  if (!unit1) { console.error('Could not find math unit 1'); return; }

  console.log(`Math Unit 1 ID: ${unit1.id}`);
  console.log('Seeding lessons and questions...');

  for (const lesson of arithmeticLessons) {
    const { questions, ...lessonData } = lesson;

    // Upsert lesson
    const { data: l, error: le } = await supabase
      .from('lessons')
      .upsert(
        { unit_id: unit1.id, ...lessonData },
        { onConflict: 'unit_id,lesson_number' }
      )
      .select('id')
      .single();

    if (le) { console.error(`Lesson ${lesson.lesson_number}:`, le.message); continue; }
    console.log(`  Lesson ${lesson.lesson_number}: ${lesson.title} (${l.id})`);

    // Insert practice questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const { error: qe } = await supabase
        .from('lesson_questions')
        .upsert(
          {
            lesson_id: l.id,
            question_order: i + 1,
            inline_question: {
              stem: q.stem,
              options: q.options,
              correct_answer: q.correct_answer,
              explanation: q.explanation,
              question_type: 'multiple_choice',
            },
          },
          { onConflict: 'lesson_id,question_order' }
        );
      if (qe) console.error(`  Q${i + 1}:`, qe.message);
    }
  }

  console.log('Done! Verifying...');

  const { count: unitCount } = await supabase.from('lesson_units').select('*', { count: 'exact', head: true });
  const { count: lessonCount } = await supabase.from('lessons').select('*', { count: 'exact', head: true });
  const { count: qCount } = await supabase.from('lesson_questions').select('*', { count: 'exact', head: true });

  console.log(`Units: ${unitCount}, Lessons: ${lessonCount}, Questions: ${qCount}`);
}

run().catch(console.error);
