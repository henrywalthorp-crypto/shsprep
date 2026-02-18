import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

const outDir = resolve(__dirname, '..', 'content', 'questions');
mkdirSync(outDir, { recursive: true });

interface Question {
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
  skills: string[];
  tags: string[];
}

function difficultyMix(n: number): number[] {
  // ~30/40/30 split
  const d1 = Math.round(n * 0.3);
  const d3 = Math.round(n * 0.3);
  const d2 = n - d1 - d3;
  const result: number[] = [];
  for (let i = 0; i < d1; i++) result.push(1);
  for (let i = 0; i < d2; i++) result.push(2);
  for (let i = 0; i < d3; i++) result.push(3);
  return result;
}

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle<T>(arr: T[]): T[] { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// ============ MATH-ALGEBRA (57 questions) ============
function generateMathAlgebra(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(57);
  const categories = ['math.algebra.linear_equations', 'math.algebra.systems', 'math.algebra.expressions', 'math.algebra.word_problems', 'math.algebraic_modeling'];
  let idx = 0;

  // Linear equations (15)
  for (let i = 0; i < 15; i++) {
    const a = randInt(2, 9);
    const x = randInt(-10, 10);
    const b = randInt(1, 20);
    const c = a * x + b;
    const wrong1 = x + randInt(1, 3);
    const wrong2 = x - randInt(1, 3);
    const wrong3 = -x;
    const opts = [x, wrong1, wrong2, wrong3];
    questions.push({
      section: 'math',
      category: 'math.algebra.linear_equations',
      difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Solve for x: ${a}x + ${b} = ${c}`,
      options: [
        { label: 'A', text: String(x) },
        { label: 'B', text: String(wrong1) },
        { label: 'C', text: String(wrong2) },
        { label: 'D', text: String(wrong3) },
      ],
      correctAnswer: 'A',
      explanation: `Subtract ${b} from both sides: ${a}x = ${c - b}. Divide by ${a}: x = ${x}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Arithmetic error when dividing.' },
        { label: 'C', explanation: 'Subtracted incorrectly.' },
      ],
      skills: ['solve-linear-equations'],
      tags: ['algebra', 'linear-equations'],
    });
  }

  // Systems (12)
  for (let i = 0; i < 12; i++) {
    const x = randInt(1, 8);
    const y = randInt(1, 8);
    const a1 = randInt(1, 5); const b1 = randInt(1, 5);
    const a2 = randInt(1, 5); const b2 = randInt(1, 5);
    if (a1 * b2 === a2 * b1) { // skip parallel
      const x2 = x + 1; const y2 = y + 1;
      questions.push({
        section: 'math', category: 'math.algebra.systems', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Solve the system:\n${a1}x + ${b1}y = ${a1 * x2 + b1 * y2}\n${a2}x + ${b2 + 1}y = ${a2 * x2 + (b2 + 1) * y2}\n\nWhat is x + y?`,
        options: [
          { label: 'A', text: String(x2 + y2) },
          { label: 'B', text: String(x2 + y2 + 1) },
          { label: 'C', text: String(x2 + y2 - 1) },
          { label: 'D', text: String(x2 - y2) },
        ],
        correctAnswer: 'A',
        explanation: `Solving the system gives x = ${x2}, y = ${y2}, so x + y = ${x2 + y2}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Sign error in elimination.' },
          { label: 'C', explanation: 'Arithmetic error.' },
        ],
        skills: ['systems-of-equations'],
        tags: ['algebra', 'systems'],
      });
    } else {
      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x + b2 * y;
      questions.push({
        section: 'math', category: 'math.algebra.systems', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Solve the system:\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}\n\nWhat is the value of x?`,
        options: [
          { label: 'A', text: String(x) },
          { label: 'B', text: String(y) },
          { label: 'C', text: String(x + 1) },
          { label: 'D', text: String(x - 1) },
        ],
        correctAnswer: 'A',
        explanation: `Using elimination or substitution, x = ${x} and y = ${y}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Confused x and y values.' },
          { label: 'C', explanation: 'Arithmetic error in elimination.' },
        ],
        skills: ['systems-of-equations'],
        tags: ['algebra', 'systems'],
      });
    }
  }

  // Expressions (10)
  for (let i = 0; i < 10; i++) {
    const a = randInt(2, 6);
    const b = randInt(1, 9);
    const c = randInt(2, 6);
    const d = randInt(1, 9);
    const result = `${a + c}x + ${b + d}`;
    const wrong1 = `${a + c}x + ${b - d}`;
    const wrong2 = `${a * c}x + ${b + d}`;
    const wrong3 = `${a + c}x - ${b + d}`;
    questions.push({
      section: 'math', category: 'math.algebra.expressions', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Simplify: (${a}x + ${b}) + (${c}x + ${d})`,
      options: [
        { label: 'A', text: result },
        { label: 'B', text: wrong1 },
        { label: 'C', text: wrong2 },
        { label: 'D', text: wrong3 },
      ],
      correctAnswer: 'A',
      explanation: `Combine like terms: ${a}x + ${c}x = ${a + c}x, and ${b} + ${d} = ${b + d}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Subtracted constants instead of adding.' },
        { label: 'C', explanation: 'Multiplied coefficients instead of adding.' },
      ],
      skills: ['simplify-expressions'],
      tags: ['algebra', 'expressions'],
    });
  }

  // Word problems (10)
  for (let i = 0; i < 10; i++) {
    const rate = randInt(5, 15);
    const hours = randInt(3, 10);
    const total = rate * hours;
    const names = ['Maria', 'James', 'Aisha', 'Carlos', 'Priya', 'Devon', 'Kai', 'Zara', 'Marcus', 'Lily'];
    const name = names[i % names.length];
    questions.push({
      section: 'math', category: 'math.algebra.word_problems', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `${name} earns $${rate} per hour. If ${name} earned $${total} in total, how many hours did ${name} work?`,
      options: [
        { label: 'A', text: String(hours) },
        { label: 'B', text: String(hours + 2) },
        { label: 'C', text: String(hours - 1) },
        { label: 'D', text: String(rate) },
      ],
      correctAnswer: 'A',
      explanation: `${total} ÷ ${rate} = ${hours} hours.`,
      commonMistakes: [
        { label: 'B', explanation: 'Division error.' },
        { label: 'D', explanation: 'Confused the rate with the number of hours.' },
      ],
      skills: ['algebraic-word-problems'],
      tags: ['algebra', 'word-problems'],
    });
  }

  // Algebraic modeling (10)
  for (let i = 0; i < 10; i++) {
    const base = randInt(20, 50);
    const perUnit = randInt(2, 10);
    const items = ['tickets', 'books', 'pizzas', 'shirts', 'plants', 'games', 'songs', 'photos', 'miles', 'laps'];
    const item = items[i % items.length];
    questions.push({
      section: 'math', category: 'math.algebraic_modeling', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A store charges a $${base} membership fee plus $${perUnit} per ${item.slice(0, -1)} purchased. Which expression represents the total cost for n ${item}?`,
      options: [
        { label: 'A', text: `${base} + ${perUnit}n` },
        { label: 'B', text: `${perUnit} + ${base}n` },
        { label: 'C', text: `${base * perUnit}n` },
        { label: 'D', text: `${base}n + ${perUnit}` },
      ],
      correctAnswer: 'A',
      explanation: `The fixed cost is $${base} and the variable cost is $${perUnit} per item, giving ${base} + ${perUnit}n.`,
      commonMistakes: [
        { label: 'B', explanation: 'Swapped the fixed and variable parts.' },
        { label: 'C', explanation: 'Multiplied both values together.' },
      ],
      skills: ['algebraic-modeling'],
      tags: ['algebra', 'modeling'],
    });
  }

  return questions.slice(0, 57);
}

// ============ MATH-EXPONENTS (50 questions) ============
function generateMathExponents(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(50);
  let idx = 0;

  // Exponent rules (30)
  for (let i = 0; i < 30; i++) {
    const base = randInt(2, 5);
    const exp1 = randInt(2, 6);
    const exp2 = randInt(2, 5);
    const types = ['multiply', 'divide', 'power'];
    const type = types[i % 3];
    let stem: string, answer: string, w1: string, w2: string, w3: string;
    if (type === 'multiply') {
      stem = `Simplify: ${base}^${exp1} × ${base}^${exp2}`;
      answer = `${base}^${exp1 + exp2}`;
      w1 = `${base}^${exp1 * exp2}`;
      w2 = `${base * base}^${exp1 + exp2}`;
      w3 = `${base}^${Math.abs(exp1 - exp2)}`;
    } else if (type === 'divide') {
      const bigExp = Math.max(exp1, exp2) + 2;
      const smallExp = Math.min(exp1, exp2);
      stem = `Simplify: ${base}^${bigExp} ÷ ${base}^${smallExp}`;
      answer = `${base}^${bigExp - smallExp}`;
      w1 = `${base}^${bigExp + smallExp}`;
      w2 = `${base}^${bigExp * smallExp}`;
      w3 = `1/${base}^${bigExp - smallExp}`;
    } else {
      stem = `Simplify: (${base}^${exp1})^${exp2}`;
      answer = `${base}^${exp1 * exp2}`;
      w1 = `${base}^${exp1 + exp2}`;
      w2 = `${base * exp2}^${exp1}`;
      w3 = `${base}^${exp1}`;
    }
    questions.push({
      section: 'math', category: 'math.algebra.exponents', difficulty: diffs[idx++],
      type: 'multiple_choice', stem,
      options: [
        { label: 'A', text: answer },
        { label: 'B', text: w1 },
        { label: 'C', text: w2 },
        { label: 'D', text: w3 },
      ],
      correctAnswer: 'A',
      explanation: type === 'multiply'
        ? `When multiplying same bases, add exponents: ${exp1} + ${exp2} = ${exp1 + exp2}.`
        : type === 'divide'
        ? `When dividing same bases, subtract exponents.`
        : `When raising a power to a power, multiply exponents: ${exp1} × ${exp2} = ${exp1 * exp2}.`,
      commonMistakes: [
        { label: 'B', explanation: type === 'multiply' ? 'Multiplied exponents instead of adding.' : 'Added exponents instead of subtracting.' },
        { label: 'C', explanation: 'Applied the wrong exponent rule.' },
      ],
      skills: ['exponent-rules'],
      tags: ['exponents'],
    });
  }

  // Scientific notation (20)
  for (let i = 0; i < 20; i++) {
    const coeff = (randInt(10, 99) / 10);
    const exp = randInt(-5, 8);
    const types = ['convert', 'multiply', 'identify'];
    const type = types[i % 3];
    if (type === 'convert') {
      const val = coeff * Math.pow(10, exp);
      const valStr = exp >= 0 && exp <= 4 ? String(val) : val.toExponential();
      questions.push({
        section: 'math', category: 'math.scientific_notation', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Write ${coeff} × 10^${exp} in standard form. Which is correct?`,
        options: [
          { label: 'A', text: `${coeff} × 10^${exp}` },
          { label: 'B', text: `${coeff * 10} × 10^${exp - 1}` },
          { label: 'C', text: `${coeff / 10} × 10^${exp + 1}` },
          { label: 'D', text: `${coeff} × 10^${exp + 2}` },
        ],
        correctAnswer: 'A',
        explanation: `${coeff} × 10^${exp} is already in proper scientific notation since 1 ≤ ${coeff} < 10.`,
        commonMistakes: [
          { label: 'B', explanation: 'Incorrectly adjusted the coefficient.' },
          { label: 'D', explanation: 'Changed the exponent without adjusting the coefficient.' },
        ],
        skills: ['scientific-notation'],
        tags: ['scientific-notation'],
      });
    } else {
      const c1 = (randInt(10, 50) / 10);
      const c2 = (randInt(10, 50) / 10);
      const e1 = randInt(2, 6);
      const e2 = randInt(2, 6);
      const product = c1 * c2;
      const sumExp = e1 + e2;
      let finalCoeff = product;
      let finalExp = sumExp;
      if (product >= 10) { finalCoeff = product / 10; finalExp = sumExp + 1; }
      questions.push({
        section: 'math', category: 'math.scientific_notation', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Multiply: (${c1} × 10^${e1}) × (${c2} × 10^${e2})`,
        options: [
          { label: 'A', text: `${finalCoeff} × 10^${finalExp}` },
          { label: 'B', text: `${product} × 10^${sumExp}` },
          { label: 'C', text: `${c1 + c2} × 10^${e1 + e2}` },
          { label: 'D', text: `${c1 * c2} × 10^${e1 * e2}` },
        ],
        correctAnswer: 'A',
        explanation: `Multiply coefficients: ${c1} × ${c2} = ${product}. Add exponents: ${e1} + ${e2} = ${sumExp}. Adjust to proper scientific notation.`,
        commonMistakes: [
          { label: 'B', explanation: 'Forgot to adjust coefficient to be between 1 and 10.' },
          { label: 'C', explanation: 'Added coefficients instead of multiplying.' },
        ],
        skills: ['scientific-notation-operations'],
        tags: ['scientific-notation', 'multiplication'],
      });
    }
  }

  return questions.slice(0, 50);
}

// ============ MATH-INEQUALITIES (50 questions) ============
function generateMathInequalities(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(50);
  let idx = 0;

  // Basic inequalities (20)
  for (let i = 0; i < 20; i++) {
    const a = randInt(2, 8);
    const x = randInt(-5, 10);
    const b = randInt(1, 15);
    const c = a * x + b;
    const ops = ['>', '<', '≥', '≤'];
    const op = ops[i % 4];
    const reverseOps: Record<string, string> = { '>': '<', '<': '>', '≥': '≤', '≤': '≥' };
    questions.push({
      section: 'math', category: 'math.algebra.inequalities', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Solve: ${a}x + ${b} ${op} ${c}`,
      options: [
        { label: 'A', text: `x ${op} ${x}` },
        { label: 'B', text: `x ${reverseOps[op]} ${x}` },
        { label: 'C', text: `x ${op} ${x + 1}` },
        { label: 'D', text: `x ${op} ${-x}` },
      ],
      correctAnswer: 'A',
      explanation: `Subtract ${b}: ${a}x ${op} ${c - b}. Divide by ${a}: x ${op} ${x}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Flipped the inequality sign unnecessarily.' },
        { label: 'C', explanation: 'Arithmetic error.' },
      ],
      skills: ['solve-inequalities'],
      tags: ['inequalities'],
    });
  }

  // Negative coefficient (flip sign) (15)
  for (let i = 0; i < 15; i++) {
    const a = -randInt(2, 6);
    const x = randInt(-5, 5);
    const b = randInt(1, 10);
    const c = a * x + b;
    const op = i % 2 === 0 ? '>' : '<';
    const flipped = op === '>' ? '<' : '>';
    questions.push({
      section: 'math', category: 'math.algebra.inequalities', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Solve: ${a}x + ${b} ${op} ${c}`,
      options: [
        { label: 'A', text: `x ${flipped} ${x}` },
        { label: 'B', text: `x ${op} ${x}` },
        { label: 'C', text: `x ${flipped} ${-x}` },
        { label: 'D', text: `x ${op} ${-x}` },
      ],
      correctAnswer: 'A',
      explanation: `Subtract ${b}: ${a}x ${op} ${c - b}. Divide by ${a} (negative), so flip the sign: x ${flipped} ${x}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Forgot to flip the inequality when dividing by a negative.' },
        { label: 'C', explanation: 'Sign error on the solution.' },
      ],
      skills: ['solve-inequalities', 'flip-inequality'],
      tags: ['inequalities', 'negative-coefficients'],
    });
  }

  // Absolute value (15)
  for (let i = 0; i < 15; i++) {
    const a = randInt(1, 8);
    const types = ['equation', 'less', 'greater'];
    const type = types[i % 3];
    if (type === 'equation') {
      questions.push({
        section: 'math', category: 'math.algebra.absolute_value', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Solve: |x| = ${a}`,
        options: [
          { label: 'A', text: `x = ${a} or x = -${a}` },
          { label: 'B', text: `x = ${a}` },
          { label: 'C', text: `x = -${a}` },
          { label: 'D', text: `No solution` },
        ],
        correctAnswer: 'A',
        explanation: `|x| = ${a} means x = ${a} or x = -${a}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Only found the positive solution.' },
          { label: 'C', explanation: 'Only found the negative solution.' },
        ],
        skills: ['absolute-value'],
        tags: ['absolute-value'],
      });
    } else if (type === 'less') {
      questions.push({
        section: 'math', category: 'math.arithmetic.absolute_value', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Solve: |x| < ${a}`,
        options: [
          { label: 'A', text: `-${a} < x < ${a}` },
          { label: 'B', text: `x < ${a}` },
          { label: 'C', text: `x > -${a}` },
          { label: 'D', text: `x < -${a} or x > ${a}` },
        ],
        correctAnswer: 'A',
        explanation: `|x| < ${a} means -${a} < x < ${a}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Forgot the lower bound.' },
          { label: 'D', explanation: 'Used the greater-than rule instead.' },
        ],
        skills: ['absolute-value-inequalities'],
        tags: ['absolute-value', 'inequalities'],
      });
    } else {
      questions.push({
        section: 'math', category: 'math.algebra.absolute_value', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Solve: |x| > ${a}`,
        options: [
          { label: 'A', text: `x < -${a} or x > ${a}` },
          { label: 'B', text: `-${a} < x < ${a}` },
          { label: 'C', text: `x > ${a}` },
          { label: 'D', text: `x > -${a}` },
        ],
        correctAnswer: 'A',
        explanation: `|x| > ${a} means x < -${a} or x > ${a}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Used the less-than rule instead.' },
          { label: 'C', explanation: 'Forgot the negative solution.' },
        ],
        skills: ['absolute-value-inequalities'],
        tags: ['absolute-value', 'inequalities'],
      });
    }
  }

  return questions.slice(0, 50);
}

// ============ MATH-RATIOS (58 questions) ============
function generateMathRatios(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(58);
  let idx = 0;

  // Ratios and proportions (20)
  for (let i = 0; i < 20; i++) {
    const a = randInt(2, 8); const b = randInt(2, 8);
    const mult = randInt(2, 6);
    questions.push({
      section: 'math', category: 'math.arithmetic.ratios_proportions', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `The ratio of cats to dogs is ${a}:${b}. If there are ${a * mult} cats, how many dogs are there?`,
      options: [
        { label: 'A', text: String(b * mult) },
        { label: 'B', text: String(b * mult + a) },
        { label: 'C', text: String(a * mult) },
        { label: 'D', text: String((a + b) * mult) },
      ],
      correctAnswer: 'A',
      explanation: `${a * mult} ÷ ${a} = ${mult}. Dogs = ${b} × ${mult} = ${b * mult}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added instead of multiplying.' },
        { label: 'D', explanation: 'Found the total, not just dogs.' },
      ],
      skills: ['ratios-proportions'],
      tags: ['ratios'],
    });
  }

  // Percent change (18)
  for (let i = 0; i < 18; i++) {
    const original = randInt(20, 200);
    const pct = randInt(10, 50);
    const increase = i % 2 === 0;
    const change = Math.round(original * pct / 100);
    const newVal = increase ? original + change : original - change;
    questions.push({
      section: 'math', category: 'math.arithmetic.percent_change', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A price ${increase ? 'increases' : 'decreases'} from $${original} by ${pct}%. What is the new price?`,
      options: [
        { label: 'A', text: `$${newVal}` },
        { label: 'B', text: `$${increase ? original + pct : original - pct}` },
        { label: 'C', text: `$${change}` },
        { label: 'D', text: `$${original}` },
      ],
      correctAnswer: 'A',
      explanation: `${pct}% of $${original} = $${change}. New price = $${original} ${increase ? '+' : '-'} $${change} = $${newVal}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Subtracted the percentage directly instead of calculating the percent of the original.' },
        { label: 'C', explanation: 'Found only the change amount, not the new price.' },
      ],
      skills: ['percent-change'],
      tags: ['percentages', 'percent-change'],
    });
  }

  // Proportional reasoning (20)
  for (let i = 0; i < 20; i++) {
    const rate = randInt(2, 10);
    const time1 = randInt(2, 6);
    const time2 = randInt(7, 15);
    const items = ['pages', 'miles', 'problems', 'laps', 'cookies', 'boxes', 'widgets', 'songs', 'chapters', 'levels'];
    const item = items[i % items.length];
    const ans1 = rate * time1;
    const ans2 = rate * time2;
    questions.push({
      section: 'math', category: 'math.proportional_reasoning', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `If a student reads ${ans1} ${item} in ${time1} hours, how many ${item} can they read in ${time2} hours at the same rate?`,
      options: [
        { label: 'A', text: String(ans2) },
        { label: 'B', text: String(ans2 + rate) },
        { label: 'C', text: String(ans1 + time2) },
        { label: 'D', text: String(ans2 - rate) },
      ],
      correctAnswer: 'A',
      explanation: `Rate = ${ans1} ÷ ${time1} = ${rate} ${item}/hour. In ${time2} hours: ${rate} × ${time2} = ${ans2}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added an extra unit.' },
        { label: 'C', explanation: 'Added instead of multiplying.' },
      ],
      skills: ['proportional-reasoning'],
      tags: ['ratios', 'proportions'],
    });
  }

  return questions.slice(0, 58);
}

// ============ MATH-ARITHMETIC (50 questions) ============
function generateMathArithmetic(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(50);
  let idx = 0;

  // Fractions (12)
  for (let i = 0; i < 12; i++) {
    const n1 = randInt(1, 5); const d1 = randInt(2, 8);
    const n2 = randInt(1, 5); const d2 = randInt(2, 8);
    const ops = ['+', '-', '×'];
    const op = ops[i % 3];
    let ansNum: number, ansDen: number;
    if (op === '+') { ansNum = n1 * d2 + n2 * d1; ansDen = d1 * d2; }
    else if (op === '-') { ansNum = n1 * d2 - n2 * d1; ansDen = d1 * d2; }
    else { ansNum = n1 * n2; ansDen = d1 * d2; }
    // Simplify
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(ansNum, ansDen);
    const sn = ansNum / g; const sd = ansDen / g;
    if (sd === 0 || ansNum === 0 && op === '-') { idx++; continue; }
    questions.push({
      section: 'math', category: 'math.arithmetic.fractions', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Calculate: ${n1}/${d1} ${op} ${n2}/${d2}`,
      options: [
        { label: 'A', text: sd === 1 ? String(sn) : `${sn}/${sd}` },
        { label: 'B', text: `${n1 + n2}/${d1 + d2}` },
        { label: 'C', text: `${ansNum}/${ansDen}` },
        { label: 'D', text: `${Math.abs(sn) + 1}/${sd}` },
      ],
      correctAnswer: 'A',
      explanation: op === '×' ? `Multiply numerators and denominators: ${n1}×${n2}/${d1}×${d2} = ${ansNum}/${ansDen} = ${sn}/${sd}.` :
        `Common denominator is ${d1 * d2}. ${op === '+' ? 'Add' : 'Subtract'} numerators: ${ansNum}/${ansDen} = ${sn}/${sd}.`,
      commonMistakes: [
        { label: 'B', explanation: op !== '×' ? 'Added numerators and denominators separately (wrong!).' : 'Added instead of multiplying.' },
        { label: 'C', explanation: 'Forgot to simplify.' },
      ],
      skills: ['fraction-operations'],
      tags: ['fractions', 'arithmetic'],
    });
  }

  // Order of operations (12)
  for (let i = 0; i < 12; i++) {
    const a = randInt(2, 8); const b = randInt(1, 5); const c = randInt(2, 6);
    const answer = a + b * c;
    questions.push({
      section: 'math', category: 'math.arithmetic.order_of_operations', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Evaluate: ${a} + ${b} × ${c}`,
      options: [
        { label: 'A', text: String(answer) },
        { label: 'B', text: String((a + b) * c) },
        { label: 'C', text: String(a * b + c) },
        { label: 'D', text: String(a + b + c) },
      ],
      correctAnswer: 'A',
      explanation: `Multiplication first: ${b} × ${c} = ${b * c}. Then add: ${a} + ${b * c} = ${answer}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added before multiplying (left to right error).' },
        { label: 'D', explanation: 'Ignored multiplication entirely.' },
      ],
      skills: ['order-of-operations'],
      tags: ['PEMDAS', 'order-of-operations'],
    });
  }

  // Decimals (8)
  for (let i = 0; i < 8; i++) {
    const a = (randInt(10, 99) / 10);
    const b = (randInt(10, 99) / 10);
    const sum = Math.round((a + b) * 10) / 10;
    questions.push({
      section: 'math', category: 'math.arithmetic.decimals', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Calculate: ${a} + ${b}`,
      options: [
        { label: 'A', text: String(sum) },
        { label: 'B', text: String(Math.round((sum + 1) * 10) / 10) },
        { label: 'C', text: String(Math.round((sum - 0.1) * 10) / 10) },
        { label: 'D', text: String(Math.round(a * b * 10) / 10) },
      ],
      correctAnswer: 'A',
      explanation: `Line up decimal points and add: ${a} + ${b} = ${sum}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Carrying error.' },
        { label: 'D', explanation: 'Multiplied instead of adding.' },
      ],
      skills: ['decimal-operations'],
      tags: ['decimals', 'arithmetic'],
    });
  }

  // Divisibility / GCF / LCM / Primes (18)
  for (let i = 0; i < 6; i++) {
    const a = randInt(12, 48); const b = randInt(12, 48);
    const gcdVal = (function g(x: number, y: number): number { return y === 0 ? x : g(y, x % y); })(a, b);
    questions.push({
      section: 'math', category: 'math.number_theory.gcf_lcm', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the GCF of ${a} and ${b}?`,
      options: [
        { label: 'A', text: String(gcdVal) },
        { label: 'B', text: String(a * b / gcdVal) },
        { label: 'C', text: String(gcdVal * 2 <= Math.min(a, b) ? gcdVal * 2 : gcdVal + 1) },
        { label: 'D', text: String(Math.min(a, b)) },
      ],
      correctAnswer: 'A',
      explanation: `Find factors of both numbers. The greatest common factor is ${gcdVal}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Found the LCM instead of GCF.' },
        { label: 'D', explanation: 'Used the smaller number, which may not be a factor of the larger.' },
      ],
      skills: ['gcf-lcm'],
      tags: ['number-theory', 'gcf'],
    });
  }
  for (let i = 0; i < 6; i++) {
    const a = randInt(4, 15); const b = randInt(4, 15);
    const gcdVal = (function g(x: number, y: number): number { return y === 0 ? x : g(y, x % y); })(a, b);
    const lcmVal = a * b / gcdVal;
    questions.push({
      section: 'math', category: 'math.number_theory.gcf_lcm', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the LCM of ${a} and ${b}?`,
      options: [
        { label: 'A', text: String(lcmVal) },
        { label: 'B', text: String(a * b) },
        { label: 'C', text: String(gcdVal) },
        { label: 'D', text: String(Math.max(a, b)) },
      ],
      correctAnswer: 'A',
      explanation: `LCM(${a}, ${b}) = ${a} × ${b} ÷ GCF = ${a * b} ÷ ${gcdVal} = ${lcmVal}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Multiplied without dividing by GCF.' },
        { label: 'C', explanation: 'Found GCF instead of LCM.' },
      ],
      skills: ['gcf-lcm'],
      tags: ['number-theory', 'lcm'],
    });
  }

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
  for (let i = 0; i < 6; i++) {
    const n = randInt(20, 60);
    const isPrime = primes.includes(n);
    const nextPrime = primes.find(p => p > n) || 53;
    questions.push({
      section: 'math', category: 'math.number_theory.primes', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Which of the following is a prime number?`,
      options: [
        { label: 'A', text: String(primes[i + 4]) },
        { label: 'B', text: String(primes[i + 4] + 1) },
        { label: 'C', text: String(primes[i + 4] * 2) },
        { label: 'D', text: String(primes[i + 4] + 6) },
      ],
      correctAnswer: 'A',
      explanation: `${primes[i + 4]} is prime — its only factors are 1 and itself.`,
      commonMistakes: [
        { label: 'B', explanation: `${primes[i + 4] + 1} is even (or composite).` },
        { label: 'C', explanation: `${primes[i + 4] * 2} is divisible by 2.` },
      ],
      skills: ['prime-numbers'],
      tags: ['number-theory', 'primes'],
    });
  }

  return questions.slice(0, 50);
}

// ============ MATH-GEOMETRY-SHAPES (44 questions) ============
function generateMathGeometryShapes(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(44);
  let idx = 0;

  // Angles (8)
  for (let i = 0; i < 8; i++) {
    const angle = randInt(30, 150);
    const supplement = 180 - angle;
    const complement = 90 - angle;
    const isSupplement = i % 2 === 0 || angle > 90;
    questions.push({
      section: 'math', category: 'math.geometry.angles', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: isSupplement
        ? `What is the supplement of a ${angle}° angle?`
        : `What is the complement of a ${angle}° angle?`,
      options: [
        { label: 'A', text: `${isSupplement ? supplement : complement}°` },
        { label: 'B', text: `${isSupplement ? complement : supplement}°` },
        { label: 'C', text: `${angle}°` },
        { label: 'D', text: `${360 - angle}°` },
      ],
      correctAnswer: 'A',
      explanation: isSupplement
        ? `Supplementary angles sum to 180°: 180 - ${angle} = ${supplement}°.`
        : `Complementary angles sum to 90°: 90 - ${angle} = ${complement}°.`,
      commonMistakes: [
        { label: 'B', explanation: `Confused supplementary and complementary.` },
        { label: 'D', explanation: `Subtracted from 360° instead.` },
      ],
      skills: ['angle-relationships'],
      tags: ['geometry', 'angles'],
    });
  }

  // Triangles (8)
  for (let i = 0; i < 8; i++) {
    const a1 = randInt(30, 80); const a2 = randInt(30, 80);
    const a3 = 180 - a1 - a2;
    questions.push({
      section: 'math', category: 'math.geometry.triangles', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A triangle has angles of ${a1}° and ${a2}°. What is the third angle?`,
      options: [
        { label: 'A', text: `${a3}°` },
        { label: 'B', text: `${180 - a1}°` },
        { label: 'C', text: `${a1 + a2}°` },
        { label: 'D', text: `${360 - a1 - a2}°` },
      ],
      correctAnswer: 'A',
      explanation: `Angles in a triangle sum to 180°: 180 - ${a1} - ${a2} = ${a3}°.`,
      commonMistakes: [
        { label: 'B', explanation: 'Only subtracted one angle.' },
        { label: 'D', explanation: 'Subtracted from 360° instead of 180°.' },
      ],
      skills: ['triangle-angle-sum'],
      tags: ['geometry', 'triangles'],
    });
  }

  // Area of rectangles/triangles (8)
  for (let i = 0; i < 8; i++) {
    const isTriangle = i % 2 === 0;
    const b = randInt(4, 15); const h = randInt(3, 12);
    const area = isTriangle ? b * h / 2 : b * h;
    questions.push({
      section: 'math', category: 'math.geometry.area', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: isTriangle
        ? `A triangle has base ${b} cm and height ${h} cm. What is its area?`
        : `A rectangle has length ${b} cm and width ${h} cm. What is its area?`,
      options: [
        { label: 'A', text: `${area} cm²` },
        { label: 'B', text: isTriangle ? `${b * h} cm²` : `${2 * (b + h)} cm²` },
        { label: 'C', text: `${area + b} cm²` },
        { label: 'D', text: `${b + h} cm²` },
      ],
      correctAnswer: 'A',
      explanation: isTriangle
        ? `Area = ½ × base × height = ½ × ${b} × ${h} = ${area} cm².`
        : `Area = length × width = ${b} × ${h} = ${area} cm².`,
      commonMistakes: [
        { label: 'B', explanation: isTriangle ? 'Forgot to divide by 2.' : 'Found perimeter instead of area.' },
        { label: 'D', explanation: 'Added dimensions instead of multiplying.' },
      ],
      skills: ['area-calculation'],
      tags: ['geometry', 'area'],
    });
  }

  // Circles (8)
  for (let i = 0; i < 8; i++) {
    const r = randInt(2, 10);
    const isArea = i % 2 === 0;
    const answer = isArea ? Math.round(Math.PI * r * r * 100) / 100 : Math.round(2 * Math.PI * r * 100) / 100;
    questions.push({
      section: 'math', category: 'math.geometry.circles', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: isArea
        ? `What is the area of a circle with radius ${r}? (Use π ≈ 3.14)`
        : `What is the circumference of a circle with radius ${r}? (Use π ≈ 3.14)`,
      options: [
        { label: 'A', text: isArea ? `${(3.14 * r * r).toFixed(2)}` : `${(2 * 3.14 * r).toFixed(2)}` },
        { label: 'B', text: isArea ? `${(3.14 * 2 * r).toFixed(2)}` : `${(3.14 * r * r).toFixed(2)}` },
        { label: 'C', text: isArea ? `${(3.14 * r).toFixed(2)}` : `${(3.14 * r).toFixed(2)}` },
        { label: 'D', text: `${(r * r).toFixed(2)}` },
      ],
      correctAnswer: 'A',
      explanation: isArea
        ? `Area = πr² = 3.14 × ${r}² = ${(3.14 * r * r).toFixed(2)}.`
        : `Circumference = 2πr = 2 × 3.14 × ${r} = ${(2 * 3.14 * r).toFixed(2)}.`,
      commonMistakes: [
        { label: 'B', explanation: isArea ? 'Found circumference instead.' : 'Found area instead.' },
        { label: 'C', explanation: 'Used πr instead of the correct formula.' },
      ],
      skills: ['circle-formulas'],
      tags: ['geometry', 'circles'],
    });
  }

  // Pythagorean theorem (6)
  const pythTriples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]];
  for (let i = 0; i < 6; i++) {
    const [a, b, c] = pythTriples[i];
    questions.push({
      section: 'math', category: 'math.geometry.pythagorean_theorem', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A right triangle has legs of ${a} and ${b}. What is the hypotenuse?`,
      options: [
        { label: 'A', text: String(c) },
        { label: 'B', text: String(a + b) },
        { label: 'C', text: String(c + 1) },
        { label: 'D', text: String(Math.round(Math.sqrt(a * a + b * b) * 10) / 10 + 2) },
      ],
      correctAnswer: 'A',
      explanation: `c² = a² + b² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${c*c}. c = ${c}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added the legs instead of using Pythagorean theorem.' },
        { label: 'C', explanation: 'Arithmetic error.' },
      ],
      skills: ['pythagorean-theorem'],
      tags: ['geometry', 'pythagorean-theorem'],
    });
  }

  // Composite shapes (6)
  for (let i = 0; i < 6; i++) {
    const l = randInt(6, 12); const w = randInt(4, 8); const cutL = randInt(1, 3); const cutW = randInt(1, 3);
    const area = l * w - cutL * cutW;
    questions.push({
      section: 'math', category: 'math.geometry.composite', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A rectangle is ${l} cm × ${w} cm with a ${cutL} cm × ${cutW} cm rectangle cut from one corner. What is the remaining area?`,
      options: [
        { label: 'A', text: `${area} cm²` },
        { label: 'B', text: `${l * w} cm²` },
        { label: 'C', text: `${l * w + cutL * cutW} cm²` },
        { label: 'D', text: `${cutL * cutW} cm²` },
      ],
      correctAnswer: 'A',
      explanation: `Full area = ${l} × ${w} = ${l * w}. Cut area = ${cutL} × ${cutW} = ${cutL * cutW}. Remaining = ${l * w} - ${cutL * cutW} = ${area} cm².`,
      commonMistakes: [
        { label: 'B', explanation: 'Forgot to subtract the cut area.' },
        { label: 'D', explanation: 'Calculated only the cut-out area.' },
      ],
      skills: ['composite-shapes'],
      tags: ['geometry', 'composite-shapes'],
    });
  }

  return questions.slice(0, 44);
}

// ============ MATH-GEOMETRY-3D (48 questions) ============
function generateMathGeometry3D(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(48);
  let idx = 0;

  // Volume (20)
  for (let i = 0; i < 20; i++) {
    const shapes = ['rectangular prism', 'cylinder', 'cube'];
    const shape = shapes[i % 3];
    if (shape === 'rectangular prism') {
      const l = randInt(3, 10); const w = randInt(2, 8); const h = randInt(2, 8);
      const v = l * w * h;
      questions.push({
        section: 'math', category: 'math.geometry.volume', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What is the volume of a rectangular prism with length ${l}, width ${w}, and height ${h}?`,
        options: [
          { label: 'A', text: `${v} cubic units` },
          { label: 'B', text: `${2 * (l*w + l*h + w*h)} cubic units` },
          { label: 'C', text: `${l + w + h} cubic units` },
          { label: 'D', text: `${l * w} cubic units` },
        ],
        correctAnswer: 'A',
        explanation: `V = lwh = ${l} × ${w} × ${h} = ${v}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Found surface area instead.' },
          { label: 'D', explanation: 'Only multiplied two dimensions.' },
        ],
        skills: ['volume'],
        tags: ['geometry', '3d', 'volume'],
      });
    } else if (shape === 'cylinder') {
      const r = randInt(2, 7); const h = randInt(3, 10);
      const v = (3.14 * r * r * h).toFixed(2);
      questions.push({
        section: 'math', category: 'math.geometry.volume', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What is the volume of a cylinder with radius ${r} and height ${h}? (Use π ≈ 3.14)`,
        options: [
          { label: 'A', text: `${v}` },
          { label: 'B', text: `${(3.14 * 2 * r * h).toFixed(2)}` },
          { label: 'C', text: `${(3.14 * r * r).toFixed(2)}` },
          { label: 'D', text: `${(r * r * h).toFixed(2)}` },
        ],
        correctAnswer: 'A',
        explanation: `V = πr²h = 3.14 × ${r}² × ${h} = ${v}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Used 2πrh (lateral area) instead of πr²h.' },
          { label: 'D', explanation: 'Forgot π.' },
        ],
        skills: ['volume-cylinder'],
        tags: ['geometry', '3d', 'cylinder'],
      });
    } else {
      const s = randInt(2, 10);
      const v = s * s * s;
      questions.push({
        section: 'math', category: 'math.geometry.volume', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What is the volume of a cube with side length ${s}?`,
        options: [
          { label: 'A', text: `${v}` },
          { label: 'B', text: `${6 * s * s}` },
          { label: 'C', text: `${s * s}` },
          { label: 'D', text: `${3 * s}` },
        ],
        correctAnswer: 'A',
        explanation: `V = s³ = ${s}³ = ${v}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Found surface area (6s²) instead.' },
          { label: 'C', explanation: 'Found s² (area of one face).' },
        ],
        skills: ['volume-cube'],
        tags: ['geometry', '3d', 'cube'],
      });
    }
  }

  // Surface area (18)
  for (let i = 0; i < 18; i++) {
    const shapes = ['rectangular prism', 'cube', 'cylinder'];
    const shape = shapes[i % 3];
    if (shape === 'rectangular prism') {
      const l = randInt(3, 8); const w = randInt(2, 6); const h = randInt(2, 6);
      const sa = 2 * (l*w + l*h + w*h);
      questions.push({
        section: 'math', category: 'math.geometry.3d.surface_area', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What is the surface area of a rectangular prism: ${l} × ${w} × ${h}?`,
        options: [
          { label: 'A', text: `${sa} sq units` },
          { label: 'B', text: `${l * w * h} sq units` },
          { label: 'C', text: `${l*w + l*h + w*h} sq units` },
          { label: 'D', text: `${2 * l * w} sq units` },
        ],
        correctAnswer: 'A',
        explanation: `SA = 2(lw + lh + wh) = 2(${l*w} + ${l*h} + ${w*h}) = ${sa}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Found volume instead.' },
          { label: 'C', explanation: 'Forgot to multiply by 2.' },
        ],
        skills: ['surface-area'],
        tags: ['geometry', '3d', 'surface-area'],
      });
    } else if (shape === 'cube') {
      const s = randInt(2, 9);
      const sa = 6 * s * s;
      questions.push({
        section: 'math', category: 'math.geometry.3d.surface_area', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What is the surface area of a cube with side length ${s}?`,
        options: [
          { label: 'A', text: `${sa}` },
          { label: 'B', text: `${s * s * s}` },
          { label: 'C', text: `${4 * s * s}` },
          { label: 'D', text: `${s * s}` },
        ],
        correctAnswer: 'A',
        explanation: `SA = 6s² = 6 × ${s}² = ${sa}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Found volume (s³) instead.' },
          { label: 'C', explanation: 'Used 4 faces instead of 6.' },
        ],
        skills: ['surface-area-cube'],
        tags: ['geometry', '3d', 'surface-area'],
      });
    } else {
      const r = randInt(2, 6); const h = randInt(3, 9);
      const sa = (2 * 3.14 * r * r + 2 * 3.14 * r * h).toFixed(2);
      questions.push({
        section: 'math', category: 'math.geometry.3d.surface_area', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Find the total surface area of a cylinder with radius ${r} and height ${h}. (π ≈ 3.14)`,
        options: [
          { label: 'A', text: sa },
          { label: 'B', text: (3.14 * r * r * h).toFixed(2) },
          { label: 'C', text: (2 * 3.14 * r * h).toFixed(2) },
          { label: 'D', text: (3.14 * r * r + 2 * 3.14 * r * h).toFixed(2) },
        ],
        correctAnswer: 'A',
        explanation: `SA = 2πr² + 2πrh = 2(3.14)(${r})² + 2(3.14)(${r})(${h}) = ${sa}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Found volume instead.' },
          { label: 'C', explanation: 'Found only the lateral area.' },
        ],
        skills: ['surface-area-cylinder'],
        tags: ['geometry', '3d', 'surface-area'],
      });
    }
  }

  // Cross sections (10)
  const crossSectionQs = [
    { shape: 'cube', cut: 'parallel to a face', result: 'Square', w1: 'Rectangle', w2: 'Triangle', w3: 'Circle' },
    { shape: 'cylinder', cut: 'perpendicular to the base', result: 'Rectangle', w1: 'Circle', w2: 'Triangle', w3: 'Oval' },
    { shape: 'cylinder', cut: 'parallel to the base', result: 'Circle', w1: 'Rectangle', w2: 'Oval', w3: 'Square' },
    { shape: 'rectangular prism', cut: 'parallel to a face', result: 'Rectangle', w1: 'Triangle', w2: 'Pentagon', w3: 'Circle' },
    { shape: 'cone', cut: 'parallel to the base', result: 'Circle', w1: 'Triangle', w2: 'Oval', w3: 'Square' },
    { shape: 'sphere', cut: 'through the center', result: 'Circle', w1: 'Oval', w2: 'Square', w3: 'Semicircle' },
    { shape: 'cube', cut: 'diagonally through two opposite edges', result: 'Rectangle', w1: 'Square', w2: 'Triangle', w3: 'Hexagon' },
    { shape: 'cone', cut: 'perpendicular through the apex', result: 'Triangle', w1: 'Circle', w2: 'Rectangle', w3: 'Oval' },
    { shape: 'rectangular prism', cut: 'diagonally through one face', result: 'Triangle', w1: 'Rectangle', w2: 'Pentagon', w3: 'Trapezoid' },
    { shape: 'triangular prism', cut: 'perpendicular to the length', result: 'Triangle', w1: 'Rectangle', w2: 'Square', w3: 'Pentagon' },
  ];
  for (let i = 0; i < 10; i++) {
    const q = crossSectionQs[i];
    questions.push({
      section: 'math', category: 'math.geometry.3d.cross_sections', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A ${q.shape} is cut ${q.cut}. What shape is the cross section?`,
      options: [
        { label: 'A', text: q.result },
        { label: 'B', text: q.w1 },
        { label: 'C', text: q.w2 },
        { label: 'D', text: q.w3 },
      ],
      correctAnswer: 'A',
      explanation: `Cutting a ${q.shape} ${q.cut} produces a ${q.result.toLowerCase()}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Common confusion about cross-section shapes.' },
        { label: 'C', explanation: 'Incorrect visualization of the cut.' },
      ],
      skills: ['cross-sections'],
      tags: ['geometry', '3d', 'cross-sections'],
    });
  }

  return questions.slice(0, 48);
}

// ============ MATH-COORDINATE (48 questions) ============
function generateMathCoordinate(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(48);
  let idx = 0;

  // Slope (16)
  for (let i = 0; i < 16; i++) {
    const x1 = randInt(-5, 5); const y1 = randInt(-5, 5);
    const x2 = x1 + randInt(1, 6); const y2 = y1 + randInt(-6, 6);
    const rise = y2 - y1; const run = x2 - x1;
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(Math.abs(rise), Math.abs(run));
    const sn = rise / g; const sd = run / g;
    const slopeStr = sd === 1 ? String(sn) : `${sn}/${sd}`;
    questions.push({
      section: 'math', category: 'math.geometry.coordinate_slope', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2})?`,
      options: [
        { label: 'A', text: slopeStr },
        { label: 'B', text: sd === 1 ? String(-sn) : `${-sn}/${sd}` },
        { label: 'C', text: sd === 1 ? String(sn + 1) : `${run}/${rise || 1}` },
        { label: 'D', text: '0' },
      ],
      correctAnswer: 'A',
      explanation: `Slope = (y₂ - y₁)/(x₂ - x₁) = (${y2} - ${y1})/(${x2} - ${x1}) = ${rise}/${run} = ${slopeStr}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Sign error in the subtraction.' },
        { label: 'C', explanation: 'Swapped rise and run.' },
      ],
      skills: ['slope'],
      tags: ['coordinate-geometry', 'slope'],
    });
  }

  // Midpoint (12)
  for (let i = 0; i < 12; i++) {
    const x1 = randInt(-8, 8) * 2; const y1 = randInt(-8, 8) * 2; // even for clean midpoints
    const x2 = randInt(-8, 8) * 2; const y2 = randInt(-8, 8) * 2;
    const mx = (x1 + x2) / 2; const my = (y1 + y2) / 2;
    questions.push({
      section: 'math', category: 'math.geometry.coordinate_midpoint', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the midpoint of (${x1}, ${y1}) and (${x2}, ${y2})?`,
      options: [
        { label: 'A', text: `(${mx}, ${my})` },
        { label: 'B', text: `(${x1 + x2}, ${y1 + y2})` },
        { label: 'C', text: `(${mx + 1}, ${my - 1})` },
        { label: 'D', text: `(${x2 - x1}, ${y2 - y1})` },
      ],
      correctAnswer: 'A',
      explanation: `Midpoint = ((${x1}+${x2})/2, (${y1}+${y2})/2) = (${mx}, ${my}).`,
      commonMistakes: [
        { label: 'B', explanation: 'Added but forgot to divide by 2.' },
        { label: 'D', explanation: 'Found the difference instead of the midpoint.' },
      ],
      skills: ['midpoint'],
      tags: ['coordinate-geometry', 'midpoint'],
    });
  }

  // Transformations (12)
  for (let i = 0; i < 12; i++) {
    const x = randInt(-5, 5); const y = randInt(-5, 5);
    const types = ['reflect-x', 'reflect-y', 'translate', 'rotate-180'];
    const type = types[i % 4];
    let stem: string, answer: string, w1: string, w2: string, w3: string;
    if (type === 'reflect-x') {
      stem = `Reflect (${x}, ${y}) over the x-axis. What are the new coordinates?`;
      answer = `(${x}, ${-y})`; w1 = `(${-x}, ${y})`; w2 = `(${-x}, ${-y})`; w3 = `(${y}, ${x})`;
    } else if (type === 'reflect-y') {
      stem = `Reflect (${x}, ${y}) over the y-axis. What are the new coordinates?`;
      answer = `(${-x}, ${y})`; w1 = `(${x}, ${-y})`; w2 = `(${-x}, ${-y})`; w3 = `(${y}, ${x})`;
    } else if (type === 'translate') {
      const dx = randInt(-4, 4); const dy = randInt(-4, 4);
      stem = `Translate (${x}, ${y}) by (${dx}, ${dy}). What are the new coordinates?`;
      answer = `(${x+dx}, ${y+dy})`; w1 = `(${x-dx}, ${y-dy})`; w2 = `(${x+dx}, ${y-dy})`; w3 = `(${x*dx}, ${y*dy})`;
    } else {
      stem = `Rotate (${x}, ${y}) 180° about the origin. What are the new coordinates?`;
      answer = `(${-x}, ${-y})`; w1 = `(${x}, ${-y})`; w2 = `(${-x}, ${y})`; w3 = `(${y}, ${x})`;
    }
    questions.push({
      section: 'math', category: 'math.geometry.transformations', difficulty: diffs[idx++],
      type: 'multiple_choice', stem,
      options: [
        { label: 'A', text: answer },
        { label: 'B', text: w1 },
        { label: 'C', text: w2 },
        { label: 'D', text: w3 },
      ],
      correctAnswer: 'A',
      explanation: type === 'reflect-x' ? 'Reflecting over x-axis negates the y-coordinate.'
        : type === 'reflect-y' ? 'Reflecting over y-axis negates the x-coordinate.'
        : type === 'translate' ? 'Add the translation vector to each coordinate.'
        : 'Rotating 180° negates both coordinates.',
      commonMistakes: [
        { label: 'B', explanation: 'Reflected over the wrong axis or direction.' },
        { label: 'C', explanation: 'Applied transformation incorrectly to one coordinate.' },
      ],
      skills: ['transformations'],
      tags: ['coordinate-geometry', 'transformations'],
    });
  }

  // Coordinate geometry misc (8)
  for (let i = 0; i < 8; i++) {
    const x1 = randInt(0, 8); const y1 = randInt(0, 8);
    const x2 = x1 + randInt(1, 5); const y2 = y1 + randInt(1, 5);
    const dx = x2 - x1; const dy = y2 - y1;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);
    const distRound = Math.round(dist * 100) / 100;
    questions.push({
      section: 'math', category: 'math.geometry.coordinate_geometry', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the distance between (${x1}, ${y1}) and (${x2}, ${y2})? Round to nearest hundredth.`,
      options: [
        { label: 'A', text: String(distRound) },
        { label: 'B', text: String(dx + dy) },
        { label: 'C', text: String(Math.round((dist + 1) * 100) / 100) },
        { label: 'D', text: String(distSq) },
      ],
      correctAnswer: 'A',
      explanation: `d = √((${dx})² + (${dy})²) = √(${dx*dx} + ${dy*dy}) = √${distSq} ≈ ${distRound}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added differences instead of using distance formula.' },
        { label: 'D', explanation: 'Forgot to take the square root.' },
      ],
      skills: ['distance-formula'],
      tags: ['coordinate-geometry', 'distance'],
    });
  }

  return questions.slice(0, 48);
}

// ============ MATH-STATISTICS (49 questions) ============
function generateMathStatistics(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(49);
  let idx = 0;

  // Mean (12)
  for (let i = 0; i < 12; i++) {
    const n = randInt(4, 7);
    const nums = Array.from({ length: n }, () => randInt(10, 100));
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    const meanRound = Math.round(mean * 100) / 100;
    questions.push({
      section: 'math', category: 'math.statistics.mean_median_mode', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the mean of: ${nums.join(', ')}?`,
      options: [
        { label: 'A', text: String(meanRound) },
        { label: 'B', text: String(sum) },
        { label: 'C', text: String(Math.round((meanRound + 5) * 100) / 100) },
        { label: 'D', text: String(nums.sort((a, b) => a - b)[Math.floor(n / 2)]) },
      ],
      correctAnswer: 'A',
      explanation: `Mean = sum ÷ count = ${sum} ÷ ${n} = ${meanRound}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Found the sum but forgot to divide.' },
        { label: 'D', explanation: 'Found the median, not the mean.' },
      ],
      skills: ['mean'],
      tags: ['statistics', 'mean'],
    });
  }

  // Median (10)
  for (let i = 0; i < 10; i++) {
    const n = i % 2 === 0 ? 5 : 6;
    const nums = Array.from({ length: n }, () => randInt(5, 50)).sort((a, b) => a - b);
    const median = n % 2 === 1 ? nums[Math.floor(n / 2)] : (nums[n/2 - 1] + nums[n/2]) / 2;
    questions.push({
      section: 'math', category: 'math.statistics.mean_median_mode', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Find the median of: ${nums.join(', ')}`,
      options: [
        { label: 'A', text: String(median) },
        { label: 'B', text: String(nums[0]) },
        { label: 'C', text: String(nums[nums.length - 1]) },
        { label: 'D', text: String(Math.round(nums.reduce((a, b) => a + b, 0) / n * 100) / 100) },
      ],
      correctAnswer: 'A',
      explanation: `The median is the middle value of the sorted data: ${median}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Chose the smallest value.' },
        { label: 'D', explanation: 'Found the mean instead.' },
      ],
      skills: ['median'],
      tags: ['statistics', 'median'],
    });
  }

  // Range (7)
  for (let i = 0; i < 7; i++) {
    const nums = Array.from({ length: randInt(5, 8) }, () => randInt(5, 95));
    const range = Math.max(...nums) - Math.min(...nums);
    questions.push({
      section: 'math', category: 'math.statistics.range', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the range of: ${nums.join(', ')}?`,
      options: [
        { label: 'A', text: String(range) },
        { label: 'B', text: String(Math.max(...nums)) },
        { label: 'C', text: String(Math.min(...nums)) },
        { label: 'D', text: String(range + randInt(1, 5)) },
      ],
      correctAnswer: 'A',
      explanation: `Range = max - min = ${Math.max(...nums)} - ${Math.min(...nums)} = ${range}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Gave the maximum, not the range.' },
        { label: 'C', explanation: 'Gave the minimum, not the range.' },
      ],
      skills: ['range'],
      tags: ['statistics', 'range'],
    });
  }

  // Data interpretation (12)
  for (let i = 0; i < 12; i++) {
    const items = ['Math', 'Science', 'English', 'History', 'Art'];
    const vals = items.map(() => randInt(10, 50));
    const total = vals.reduce((a, b) => a + b, 0);
    const maxIdx = vals.indexOf(Math.max(...vals));
    questions.push({
      section: 'math', category: 'math.statistics.data_interpretation', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A bar graph shows students' favorite subjects: ${items.map((item, j) => `${item}: ${vals[j]}`).join(', ')}. Which subject is most popular?`,
      options: [
        { label: 'A', text: items[maxIdx] },
        { label: 'B', text: items[(maxIdx + 1) % 5] },
        { label: 'C', text: items[(maxIdx + 2) % 5] },
        { label: 'D', text: items[(maxIdx + 3) % 5] },
      ],
      correctAnswer: 'A',
      explanation: `${items[maxIdx]} has the highest value (${vals[maxIdx]}).`,
      commonMistakes: [
        { label: 'B', explanation: 'Misread the graph values.' },
        { label: 'C', explanation: 'Confused the categories.' },
      ],
      skills: ['data-interpretation'],
      tags: ['statistics', 'data-interpretation'],
    });
  }

  // Function tables (8)
  for (let i = 0; i < 8; i++) {
    const m = randInt(2, 5); const b = randInt(-3, 5);
    const xs = [1, 2, 3, 4, 5];
    const ys = xs.map(x => m * x + b);
    const missing = randInt(2, 4);
    questions.push({
      section: 'math', category: 'math.functions.tables', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `In the table, y = mx + b. x: ${xs.join(', ')} → y: ${ys.map((y, j) => j + 1 === missing ? '?' : y).join(', ')}. What is the missing value?`,
      options: [
        { label: 'A', text: String(ys[missing - 1]) },
        { label: 'B', text: String(ys[missing - 1] + m) },
        { label: 'C', text: String(ys[missing - 1] - 1) },
        { label: 'D', text: String(missing) },
      ],
      correctAnswer: 'A',
      explanation: `The pattern is y = ${m}x + ${b}. For x = ${missing}: y = ${m}(${missing}) + ${b} = ${ys[missing - 1]}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added one extra step.' },
        { label: 'D', explanation: 'Confused x and y values.' },
      ],
      skills: ['function-tables'],
      tags: ['functions', 'tables'],
    });
  }

  return questions.slice(0, 49);
}

// ============ MATH-PROBABILITY (50 questions) ============
function generateMathProbability(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(50);
  let idx = 0;

  // Basic probability (20)
  for (let i = 0; i < 20; i++) {
    const total = randInt(10, 30);
    const favorable = randInt(2, total - 2);
    const items = ['red marbles', 'blue cards', 'green balls', 'yellow tokens', 'striped socks', 'spotted fish', 'round beads', 'square tiles', 'white buttons', 'black chips'];
    const containers = ['bag', 'box', 'jar', 'basket', 'drawer', 'bucket', 'pouch', 'bin', 'case', 'sack'];
    const item = items[i % items.length];
    const container = containers[i % containers.length];
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const g = gcd(favorable, total);
    const probStr = `${favorable / g}/${total / g}`;
    questions.push({
      section: 'math', category: 'math.probability.basic', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `A ${container} contains ${total} items, ${favorable} of which are ${item}. What is the probability of randomly selecting a ${item.replace(/s$/, '')}?`,
      options: [
        { label: 'A', text: probStr },
        { label: 'B', text: `${favorable}/${total - favorable}` },
        { label: 'C', text: `${total - favorable}/${total}` },
        { label: 'D', text: `1/${total}` },
      ],
      correctAnswer: 'A',
      explanation: `P = favorable/total = ${favorable}/${total} = ${probStr}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Used (total - favorable) as denominator.' },
        { label: 'C', explanation: 'Found the complement probability.' },
      ],
      skills: ['basic-probability'],
      tags: ['probability'],
    });
  }

  // Compound probability (15)
  for (let i = 0; i < 15; i++) {
    const n1 = 6; // die
    const n2 = i % 2 === 0 ? 6 : 2; // die or coin
    const e1 = randInt(1, 6);
    const e2 = n2 === 6 ? randInt(1, 6) : 1;
    const prob = `1/${n1 * n2}`;
    const item2 = n2 === 6 ? `rolling a ${e2} on the second die` : 'getting heads on a coin flip';
    questions.push({
      section: 'math', category: 'math.probability.compound', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `What is the probability of rolling a ${e1} on a die AND ${item2}?`,
      options: [
        { label: 'A', text: prob },
        { label: 'B', text: `1/${n1}` },
        { label: 'C', text: `2/${n1 * n2}` },
        { label: 'D', text: `1/${n1 + n2}` },
      ],
      correctAnswer: 'A',
      explanation: `For independent events, multiply: 1/${n1} × 1/${n2} = 1/${n1 * n2}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Only considered one event.' },
        { label: 'D', explanation: 'Added denominators instead of multiplying.' },
      ],
      skills: ['compound-probability'],
      tags: ['probability', 'compound'],
    });
  }

  // Venn diagrams (15)
  for (let i = 0; i < 15; i++) {
    const total = randInt(30, 60);
    const a = randInt(10, 25); const b = randInt(10, 25);
    const both = randInt(3, Math.min(a, b) - 1);
    const neither = total - a - b + both;
    const activities = [['soccer', 'basketball'], ['piano', 'guitar'], ['math club', 'science club'], ['reading', 'writing'], ['swimming', 'running']];
    const [act1, act2] = activities[i % activities.length];
    const questions_types = ['only_a', 'only_b', 'neither', 'at_least_one', 'both'];
    const qtype = questions_types[i % 5];
    let answer: number, stem_end: string;
    if (qtype === 'only_a') { answer = a - both; stem_end = `play ONLY ${act1}`; }
    else if (qtype === 'only_b') { answer = b - both; stem_end = `play ONLY ${act2}`; }
    else if (qtype === 'neither') { answer = neither; stem_end = `play neither`; }
    else if (qtype === 'at_least_one') { answer = a + b - both; stem_end = `play at least one`; }
    else { answer = both; stem_end = `play both`; }
    questions.push({
      section: 'math', category: 'math.sets.venn_diagrams', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Of ${total} students, ${a} play ${act1}, ${b} play ${act2}, and ${both} play both. How many ${stem_end}?`,
      options: [
        { label: 'A', text: String(answer) },
        { label: 'B', text: String(answer + both) },
        { label: 'C', text: String(a + b) },
        { label: 'D', text: String(total - answer) },
      ],
      correctAnswer: 'A',
      explanation: qtype === 'only_a' ? `Only ${act1} = ${a} - ${both} = ${answer}.`
        : qtype === 'only_b' ? `Only ${act2} = ${b} - ${both} = ${answer}.`
        : qtype === 'neither' ? `Neither = ${total} - (${a} + ${b} - ${both}) = ${neither}.`
        : qtype === 'at_least_one' ? `At least one = ${a} + ${b} - ${both} = ${answer}.`
        : `Both = ${both}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Forgot to subtract the overlap.' },
        { label: 'C', explanation: 'Added without accounting for overlap.' },
      ],
      skills: ['venn-diagrams'],
      tags: ['probability', 'venn-diagrams', 'sets'],
    });
  }

  return questions.slice(0, 50);
}

// ============ MATH-PATTERNS (50 questions) ============
function generateMathPatterns(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(50);
  let idx = 0;

  // Arithmetic sequences (20)
  for (let i = 0; i < 20; i++) {
    const a1 = randInt(-5, 20);
    const d = randInt(-5, 8);
    if (d === 0) continue;
    const terms = Array.from({ length: 5 }, (_, j) => a1 + j * d);
    const n = randInt(6, 12);
    const answer = a1 + (n - 1) * d;
    questions.push({
      section: 'math', category: 'math.algebra.patterns_sequences', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Find the ${n}th term of the sequence: ${terms.join(', ')}, ...`,
      options: [
        { label: 'A', text: String(answer) },
        { label: 'B', text: String(answer + d) },
        { label: 'C', text: String(answer - d) },
        { label: 'D', text: String(a1 * n) },
      ],
      correctAnswer: 'A',
      explanation: `Common difference = ${d}. aₙ = ${a1} + (${n}-1)(${d}) = ${answer}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Off by one term.' },
        { label: 'D', explanation: 'Multiplied first term by n instead of using the formula.' },
      ],
      skills: ['arithmetic-sequences'],
      tags: ['patterns', 'sequences'],
    });
  }

  // Geometric sequences (15)
  for (let i = 0; i < 15; i++) {
    const a1 = randInt(1, 5);
    const r = randInt(2, 4);
    const terms = Array.from({ length: 4 }, (_, j) => a1 * Math.pow(r, j));
    const n = randInt(5, 7);
    const answer = a1 * Math.pow(r, n - 1);
    questions.push({
      section: 'math', category: 'math.sequences_patterns', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Find the ${n}th term: ${terms.join(', ')}, ...`,
      options: [
        { label: 'A', text: String(answer) },
        { label: 'B', text: String(a1 * Math.pow(r, n)) },
        { label: 'C', text: String(terms[terms.length - 1] + a1 * r) },
        { label: 'D', text: String(a1 * n * r) },
      ],
      correctAnswer: 'A',
      explanation: `Common ratio = ${r}. aₙ = ${a1} × ${r}^(${n}-1) = ${answer}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Used r^n instead of r^(n-1).' },
        { label: 'D', explanation: 'Multiplied linearly instead of exponentially.' },
      ],
      skills: ['geometric-sequences'],
      tags: ['patterns', 'sequences'],
    });
  }

  // Pattern recognition (15)
  for (let i = 0; i < 15; i++) {
    const types = ['square', 'triangular', 'custom'];
    const type = types[i % 3];
    if (type === 'square') {
      const terms = [1, 4, 9, 16, 25];
      const next = 36;
      questions.push({
        section: 'math', category: 'math.algebra.patterns_sequences', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What is the next number in the pattern: ${terms.join(', ')}, ...?`,
        options: [
          { label: 'A', text: String(next) },
          { label: 'B', text: String(next + i) },
          { label: 'C', text: '30' },
          { label: 'D', text: '35' },
        ],
        correctAnswer: 'A',
        explanation: 'These are perfect squares: 1², 2², 3², 4², 5². Next is 6² = 36.',
        commonMistakes: [
          { label: 'C', explanation: 'Added 5 to 25 (assumed constant difference).' },
          { label: 'D', explanation: 'Added the wrong increment.' },
        ],
        skills: ['pattern-recognition'],
        tags: ['patterns'],
      });
    } else if (type === 'triangular') {
      const terms = [1, 3, 6, 10, 15];
      questions.push({
        section: 'math', category: 'math.sequences_patterns', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `What comes next: ${terms.join(', ')}, ...?`,
        options: [
          { label: 'A', text: '21' },
          { label: 'B', text: '20' },
          { label: 'C', text: '18' },
          { label: 'D', text: '25' },
        ],
        correctAnswer: 'A',
        explanation: 'Differences increase by 1: +2, +3, +4, +5, +6. Next = 15 + 6 = 21.',
        commonMistakes: [
          { label: 'B', explanation: 'Added 5 instead of 6.' },
          { label: 'C', explanation: 'Added 3.' },
        ],
        skills: ['pattern-recognition'],
        tags: ['patterns', 'triangular-numbers'],
      });
    } else {
      const start = randInt(1, 5);
      const d1 = randInt(2, 4);
      // Increasing differences
      const terms = [start];
      for (let j = 1; j <= 4; j++) terms.push(terms[j-1] + d1 * j);
      const next = terms[4] + d1 * 5;
      questions.push({
        section: 'math', category: 'math.algebra.patterns_sequences', difficulty: diffs[idx++],
        type: 'multiple_choice',
        stem: `Find the next number: ${terms.join(', ')}, ...`,
        options: [
          { label: 'A', text: String(next) },
          { label: 'B', text: String(next + d1) },
          { label: 'C', text: String(terms[4] + d1 * 4) },
          { label: 'D', text: String(terms[4] * 2) },
        ],
        correctAnswer: 'A',
        explanation: `The differences increase by ${d1} each time. Next difference = ${d1 * 5}, so next term = ${terms[4]} + ${d1 * 5} = ${next}.`,
        commonMistakes: [
          { label: 'B', explanation: 'Added too much.' },
          { label: 'C', explanation: 'Used the previous difference instead of the next one.' },
        ],
        skills: ['pattern-recognition'],
        tags: ['patterns', 'sequences'],
      });
    }
  }

  return questions.slice(0, 50);
}

// ============ MATH-WORD-PROBLEMS (46 questions) ============
function generateMathWordProblems(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(46);
  let idx = 0;

  // Rate/distance/time (12)
  for (let i = 0; i < 12; i++) {
    const rate = randInt(30, 70);
    const time = randInt(2, 8);
    const dist = rate * time;
    const names = ['A car', 'A train', 'A cyclist', 'A runner', 'A bus', 'A boat', 'A plane', 'An athlete', 'A truck', 'A hiker', 'A skater', 'A ferry'];
    questions.push({
      section: 'math', category: 'math.word_problems.rate_distance_time', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `${names[i]} travels at ${rate} mph for ${time} hours. How far does it travel?`,
      options: [
        { label: 'A', text: `${dist} miles` },
        { label: 'B', text: `${rate + time} miles` },
        { label: 'C', text: `${Math.round(dist / 2)} miles` },
        { label: 'D', text: `${rate} miles` },
      ],
      correctAnswer: 'A',
      explanation: `Distance = rate × time = ${rate} × ${time} = ${dist} miles.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added rate and time.' },
        { label: 'D', explanation: 'Confused rate with distance.' },
      ],
      skills: ['rate-distance-time'],
      tags: ['word-problems', 'rate-distance-time'],
    });
  }

  // Age problems (10)
  for (let i = 0; i < 10; i++) {
    const currentAge = randInt(10, 30);
    const yearsAgo = randInt(3, 8);
    const pastAge = currentAge - yearsAgo;
    const names = ['Alex', 'Beth', 'Carlos', 'Diana', 'Ethan', 'Fatima', 'George', 'Hannah', 'Isaac', 'Julia'];
    questions.push({
      section: 'math', category: 'math.word_problems.age_problems', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `${names[i]} is currently ${currentAge} years old. How old was ${names[i]} ${yearsAgo} years ago?`,
      options: [
        { label: 'A', text: String(pastAge) },
        { label: 'B', text: String(currentAge + yearsAgo) },
        { label: 'C', text: String(pastAge - 1) },
        { label: 'D', text: String(yearsAgo) },
      ],
      correctAnswer: 'A',
      explanation: `${currentAge} - ${yearsAgo} = ${pastAge}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added instead of subtracting.' },
        { label: 'D', explanation: 'Gave the number of years, not the age.' },
      ],
      skills: ['age-problems'],
      tags: ['word-problems', 'age'],
    });
  }

  // Combined work (8)
  for (let i = 0; i < 8; i++) {
    const a = randInt(3, 8); const b = randInt(3, 8);
    const combined = (a * b) / (a + b);
    const combinedRound = Math.round(combined * 100) / 100;
    const tasks = ['paint a room', 'mow a lawn', 'fill a pool', 'clean an office', 'build a wall', 'wash cars', 'sort packages', 'assemble toys'];
    questions.push({
      section: 'math', category: 'math.word_problems.combined_work', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Worker A can ${tasks[i]} in ${a} hours. Worker B can do the same in ${b} hours. How long to finish working together? Round to nearest hundredth.`,
      options: [
        { label: 'A', text: `${combinedRound} hours` },
        { label: 'B', text: `${a + b} hours` },
        { label: 'C', text: `${Math.round((a + b) / 2 * 100) / 100} hours` },
        { label: 'D', text: `${Math.min(a, b)} hours` },
      ],
      correctAnswer: 'A',
      explanation: `Combined rate = 1/${a} + 1/${b} = ${a + b}/${a * b}. Time = ${a * b}/${a + b} ≈ ${combinedRound} hours.`,
      commonMistakes: [
        { label: 'B', explanation: 'Added times (would be if they worked separately in sequence).' },
        { label: 'C', explanation: 'Averaged the times (not how combined work works).' },
      ],
      skills: ['combined-work'],
      tags: ['word-problems', 'combined-work'],
    });
  }

  // Unit conversion (8)
  for (let i = 0; i < 8; i++) {
    const conversions = [
      { from: 'feet', to: 'inches', factor: 12, val: randInt(2, 10) },
      { from: 'yards', to: 'feet', factor: 3, val: randInt(2, 15) },
      { from: 'miles', to: 'feet', factor: 5280, val: randInt(1, 3) },
      { from: 'pounds', to: 'ounces', factor: 16, val: randInt(2, 8) },
      { from: 'gallons', to: 'quarts', factor: 4, val: randInt(2, 10) },
      { from: 'hours', to: 'minutes', factor: 60, val: randInt(2, 5) },
      { from: 'meters', to: 'centimeters', factor: 100, val: randInt(2, 8) },
      { from: 'kilograms', to: 'grams', factor: 1000, val: randInt(1, 5) },
    ];
    const c = conversions[i];
    const answer = c.val * c.factor;
    questions.push({
      section: 'math', category: 'math.measurement.unit_conversion', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Convert ${c.val} ${c.from} to ${c.to}.`,
      options: [
        { label: 'A', text: `${answer} ${c.to}` },
        { label: 'B', text: `${c.val + c.factor} ${c.to}` },
        { label: 'C', text: `${Math.round(c.val / c.factor * 1000) / 1000} ${c.to}` },
        { label: 'D', text: `${c.factor} ${c.to}` },
      ],
      correctAnswer: 'A',
      explanation: `${c.val} ${c.from} × ${c.factor} ${c.to}/${c.from.replace(/s$/, '')} = ${answer} ${c.to}.`,
      commonMistakes: [
        { label: 'C', explanation: 'Divided instead of multiplying.' },
        { label: 'D', explanation: 'Gave the conversion factor, not the answer.' },
      ],
      skills: ['unit-conversion'],
      tags: ['word-problems', 'unit-conversion'],
    });
  }

  // General word problems (8)
  for (let i = 0; i < 8; i++) {
    const price = randInt(5, 25);
    const qty = randInt(3, 12);
    const total = price * qty;
    const discount = randInt(10, 30);
    const discounted = Math.round(total * (100 - discount) / 100);
    questions.push({
      section: 'math', category: 'math.word_problems', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `${qty} items cost $${price} each. With a ${discount}% discount, what is the total?`,
      options: [
        { label: 'A', text: `$${discounted}` },
        { label: 'B', text: `$${total}` },
        { label: 'C', text: `$${total - discount}` },
        { label: 'D', text: `$${Math.round(total * discount / 100)}` },
      ],
      correctAnswer: 'A',
      explanation: `Total = ${qty} × $${price} = $${total}. Discount = ${discount}% of $${total} = $${Math.round(total * discount / 100)}. Final = $${discounted}.`,
      commonMistakes: [
        { label: 'B', explanation: 'Forgot to apply the discount.' },
        { label: 'D', explanation: 'Gave the discount amount, not the final price.' },
      ],
      skills: ['word-problems'],
      tags: ['word-problems', 'discount'],
    });
  }

  return questions.slice(0, 46);
}

// ============ ELA-GRAMMAR (55 questions) ============
function generateElaGrammar(): Question[] {
  const questions: Question[] = [];
  const diffs = difficultyMix(55);
  let idx = 0;

  // Subject-verb agreement (10)
  const svSentences = [
    { stem: 'Which sentence has correct subject-verb agreement?', correct: 'The group of students is ready.', wrongs: ['The group of students are ready.', 'The group of students were ready.', 'The group of students be ready.'], exp: '"Group" is singular, so it takes "is."' },
    { stem: 'Choose the sentence with correct subject-verb agreement.', correct: 'Neither the teacher nor the students were late.', wrongs: ['Neither the teacher nor the students was late.', 'Neither the teacher nor the students is late.', 'Neither the teacher nor the students be late.'], exp: 'With "neither...nor," the verb agrees with the closer subject ("students" = plural).' },
    { stem: 'Which is grammatically correct?', correct: 'Each of the players has a uniform.', wrongs: ['Each of the players have a uniform.', 'Each of the players are having a uniform.', 'Each of the players having a uniform.'], exp: '"Each" is singular and takes "has."' },
    { stem: 'Select the correct sentence.', correct: 'The news is surprising.', wrongs: ['The news are surprising.', 'The news were surprising.', 'The news have been surprising.'], exp: '"News" is an uncountable noun, always singular.' },
    { stem: 'Which sentence is correct?', correct: 'Mathematics is my favorite subject.', wrongs: ['Mathematics are my favorite subject.', 'Mathematics were my favorite subject.', 'Mathematics have been my favorite subjects.'], exp: '"Mathematics" is treated as singular.' },
    { stem: 'Choose the correct version.', correct: 'The scissors are on the table.', wrongs: ['The scissors is on the table.', 'The scissors was on the table.', 'The scissors has been on the table.'], exp: '"Scissors" is always plural.' },
    { stem: 'Which is correct?', correct: 'Everyone has finished the test.', wrongs: ['Everyone have finished the test.', 'Everyone are finishing the test.', 'Everyone were finished with the test.'], exp: '"Everyone" is singular.' },
    { stem: 'Select the grammatically correct sentence.', correct: 'The team wins every game.', wrongs: ['The team win every game.', 'The team are winning every game.', 'The team have won every game.'], exp: '"Team" (collective noun) is singular in American English.' },
    { stem: 'Which sentence uses correct agreement?', correct: 'One of my friends lives nearby.', wrongs: ['One of my friends live nearby.', 'One of my friends are living nearby.', 'One of my friends have lived nearby.'], exp: '"One" is the subject, which is singular.' },
    { stem: 'Choose the correct sentence.', correct: 'There are many reasons to study.', wrongs: ['There is many reasons to study.', 'There was many reasons to study.', 'There has been many reasons to study.'], exp: '"Reasons" is plural, so use "are."' },
  ];
  for (const s of svSentences) {
    questions.push({
      section: 'ela', category: 'ela.revising.grammar.subject_verb', difficulty: diffs[idx++],
      type: 'multiple_choice', stem: s.stem,
      options: [
        { label: 'A', text: s.correct },
        { label: 'B', text: s.wrongs[0] },
        { label: 'C', text: s.wrongs[1] },
        { label: 'D', text: s.wrongs[2] },
      ],
      correctAnswer: 'A',
      explanation: s.exp,
      commonMistakes: [
        { label: 'B', explanation: 'Incorrect verb form for the subject.' },
        { label: 'C', explanation: 'Wrong tense or number agreement.' },
      ],
      skills: ['subject-verb-agreement'],
      tags: ['grammar', 'subject-verb'],
    });
  }

  // Fragments (8)
  const fragmentQs = [
    { frag: 'Running through the park on a sunny day.', fix: 'She was running through the park on a sunny day.', w1: 'Running through the park on a sunny day quickly.', w2: 'While running through the park on a sunny day.' },
    { frag: 'Because the storm was approaching.', fix: 'We left because the storm was approaching.', w1: 'Because the storm was approaching quickly.', w2: 'Because of the storm was approaching.' },
    { frag: 'The tall building near the river.', fix: 'The tall building near the river collapsed.', w1: 'The tall building near the river yesterday.', w2: 'Near the river the tall building.' },
    { frag: 'Which was the best movie.', fix: 'That was the movie which was the best.', w1: 'Which was the best movie ever.', w2: 'The best movie which was.' },
    { frag: 'After completing the assignment.', fix: 'After completing the assignment, she relaxed.', w1: 'After completing the assignment finally.', w2: 'After completing the assignment and.' },
    { frag: 'The student who studied hard.', fix: 'The student who studied hard passed the test.', w1: 'The student who studied hard and well.', w2: 'Who studied hard the student.' },
    { frag: 'To win the championship this year.', fix: 'They trained hard to win the championship this year.', w1: 'To win the championship this year hopefully.', w2: 'Winning the championship to this year.' },
    { frag: 'Since the beginning of the school year.', fix: 'She has improved since the beginning of the school year.', w1: 'Since the beginning of the school year now.', w2: 'The beginning since of the school year.' },
  ];
  for (const q of fragmentQs) {
    questions.push({
      section: 'ela', category: 'ela.revising.grammar.fragments', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Which revision corrects this fragment?\n\n"${q.frag}"`,
      options: [
        { label: 'A', text: q.fix },
        { label: 'B', text: q.w1 },
        { label: 'C', text: q.w2 },
        { label: 'D', text: q.frag },
      ],
      correctAnswer: 'A',
      explanation: 'A fragment lacks a complete thought. Adding a subject and/or predicate creates a complete sentence.',
      commonMistakes: [
        { label: 'B', explanation: 'Still a fragment — just added words without completing the thought.' },
        { label: 'D', explanation: 'This is the original fragment, unchanged.' },
      ],
      skills: ['fix-fragments'],
      tags: ['grammar', 'fragments'],
    });
  }

  // Run-ons (8)
  const runOnQs = [
    { bad: 'I love pizza it is my favorite food.', fix: 'I love pizza; it is my favorite food.', w1: 'I love pizza, it is my favorite food.', w2: 'I love pizza it is, my favorite food.' },
    { bad: 'She studied hard she passed the test.', fix: 'She studied hard, so she passed the test.', w1: 'She studied hard, she passed the test.', w2: 'She studied hard she passed, the test.' },
    { bad: 'The movie was long we enjoyed it anyway.', fix: 'The movie was long, but we enjoyed it anyway.', w1: 'The movie was long, we enjoyed it anyway.', w2: 'The movie was long we, enjoyed it anyway.' },
    { bad: 'He ran fast he won the race.', fix: 'He ran fast and won the race.', w1: 'He ran fast, he won the race.', w2: 'He ran fast he, won the race.' },
    { bad: 'The sun set the stars appeared.', fix: 'The sun set, and the stars appeared.', w1: 'The sun set, the stars appeared.', w2: 'The sun set the stars, appeared.' },
    { bad: 'We went to the store they were closed.', fix: 'We went to the store, but they were closed.', w1: 'We went to the store, they were closed.', w2: 'We went to, the store they were closed.' },
    { bad: 'I read the book it was interesting.', fix: 'I read the book, and it was interesting.', w1: 'I read the book, it was interesting.', w2: 'I read the, book it was interesting.' },
    { bad: 'The alarm rang everyone evacuated.', fix: 'The alarm rang, and everyone evacuated.', w1: 'The alarm rang, everyone evacuated.', w2: 'The alarm rang everyone, evacuated.' },
  ];
  for (const q of runOnQs) {
    questions.push({
      section: 'ela', category: 'ela.revising.grammar.run_ons', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Which revision correctly fixes this run-on?\n\n"${q.bad}"`,
      options: [
        { label: 'A', text: q.fix },
        { label: 'B', text: q.w1 },
        { label: 'C', text: q.w2 },
        { label: 'D', text: q.bad },
      ],
      correctAnswer: 'A',
      explanation: 'Run-on sentences need proper punctuation or a conjunction to separate independent clauses.',
      commonMistakes: [
        { label: 'B', explanation: 'This creates a comma splice (another error).' },
        { label: 'D', explanation: 'This is the original run-on.' },
      ],
      skills: ['fix-run-ons'],
      tags: ['grammar', 'run-ons'],
    });
  }

  // Parallel structure (8)
  const parallelQs = [
    { stem: 'She likes swimming, hiking, and to ride bikes.', fix: 'She likes swimming, hiking, and riding bikes.', w: 'She likes swimming, hiking, and bike rides.' },
    { stem: 'The job requires patience, creativity, and being organized.', fix: 'The job requires patience, creativity, and organization.', w: 'The job requires patience, creativity, and to organize.' },
    { stem: 'He promised to study harder, attend class, and that he would complete homework.', fix: 'He promised to study harder, attend class, and complete homework.', w: 'He promised to study harder, attending class, and completing homework.' },
    { stem: 'The coach told them to practice, to focus, and they should rest.', fix: 'The coach told them to practice, to focus, and to rest.', w: 'The coach told them practicing, to focus, and to rest.' },
    { stem: 'She is smart, talented, and works hard.', fix: 'She is smart, talented, and hardworking.', w: 'She is smart, talented, and she works hard.' },
    { stem: 'The recipe calls for mixing, baking, and to decorate.', fix: 'The recipe calls for mixing, baking, and decorating.', w: 'The recipe calls for to mix, baking, and decorating.' },
    { stem: 'Students must read carefully, write clearly, and speaking confidently.', fix: 'Students must read carefully, write clearly, and speak confidently.', w: 'Students must reading carefully, writing clearly, and speaking confidently.' },
    { stem: 'He enjoys reading, to cook, and painting.', fix: 'He enjoys reading, cooking, and painting.', w: 'He enjoys to read, cooking, and painting.' },
  ];
  for (const q of parallelQs) {
    questions.push({
      section: 'ela', category: 'ela.revising.grammar.parallel_structure', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Which revision creates parallel structure?\n\n"${q.stem}"`,
      options: [
        { label: 'A', text: q.fix },
        { label: 'B', text: q.w },
        { label: 'C', text: q.stem },
        { label: 'D', text: q.stem.split(',').reverse().join(',') },
      ],
      correctAnswer: 'A',
      explanation: 'Parallel structure requires matching grammatical forms in a series.',
      commonMistakes: [
        { label: 'B', explanation: 'Still not parallel — mixed forms remain.' },
        { label: 'C', explanation: 'This is the original non-parallel sentence.' },
      ],
      skills: ['parallel-structure'],
      tags: ['grammar', 'parallel-structure'],
    });
  }

  // Verb tense (7)
  const tenseQs = [
    { stem: 'Yesterday, she walk to school.', fix: 'Yesterday, she walked to school.', w1: 'Yesterday, she walks to school.', w2: 'Yesterday, she walking to school.' },
    { stem: 'By next year, I will graduated.', fix: 'By next year, I will have graduated.', w1: 'By next year, I will graduating.', w2: 'By next year, I graduated.' },
    { stem: 'He has went to the store already.', fix: 'He has gone to the store already.', w1: 'He has going to the store already.', w2: 'He have gone to the store already.' },
    { stem: 'She is study for the exam right now.', fix: 'She is studying for the exam right now.', w1: 'She is studied for the exam right now.', w2: 'She are studying for the exam right now.' },
    { stem: 'They was playing basketball yesterday.', fix: 'They were playing basketball yesterday.', w1: 'They is playing basketball yesterday.', w2: 'They has been playing basketball yesterday.' },
    { stem: 'If I was you, I would study more.', fix: 'If I were you, I would study more.', w1: 'If I am you, I would study more.', w2: 'If I be you, I would study more.' },
    { stem: 'She drunk all the water.', fix: 'She drank all the water.', w1: 'She has drunk all the water.', w2: 'She drinking all the water.' },
  ];
  for (const q of tenseQs) {
    questions.push({
      section: 'ela', category: 'ela.revising.grammar.verb_tense', difficulty: diffs[idx++],
      type: 'multiple_choice',
      stem: `Which revision corrects the verb error?\n\n"${q.stem}"`,
      options: [
        { label: 'A', text: q.fix },
        { label: 'B', text: q.w1 },
        { label: 'C', text: q.w2 },
        { label: 'D', text: q.stem },
      ],
      correctAnswer: 'A',
      explanation: 'The correct verb tense must match the time context of the sentence.',
      commonMistakes: [
        { label: 'B', explanation: 'Still uses incorrect verb form.' },
        { label: 'D', explanation: 'Original sentence with the error.' },
      ],
      skills: ['verb-tense'],
      tags: ['grammar', 'verb-tense'],
    });
  }

  // Pronoun-antecedent (6)
  const pronounQs = [
    { stem: 'Each student must bring their own lunch.', fix: 'Each student must bring his or her own lunch.', w: 'Each student must bring our own lunch.' },
    { stem: 'Everyone should do their best.', fix: 'Everyone should do his or her best.', w: 'Everyone should do its best.' },
    { stem: 'The dog wagged their tail.', fix: 'The dog wagged its tail.', w: 'The dog wagged his tail.' },
    { stem: 'Neither boy brought their homework.', fix: 'Neither boy brought his homework.', w: 'Neither boy brought our homework.' },
    { stem: 'Someone left their phone.', fix: 'Someone left his or her phone.', w: 'Someone left our phone.' },
    { stem: 'The committee announced their decision.', fix: 'The committee announced its decision.', w: 'The committee announced his decision.' },
  ];
  for (const q of pronounQs) {
    questions.push({
      section: 'ela', category: 'ela