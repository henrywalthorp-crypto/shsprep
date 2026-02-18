#!/usr/bin/env ts-node
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a: number, b: number) { return Math.floor(Math.random() * (b - a + 1)) + a; }
function diffMix(n: number): number[] {
  const d1 = Math.round(n * 0.3), d3 = Math.round(n * 0.3), d2 = n - d1 - d3;
  return [...Array(d1).fill(1), ...Array(d2).fill(2), ...Array(d3).fill(3)];
}
function gcd(a: number, b: number): number { a = Math.abs(a); b = Math.abs(b); return b === 0 ? a : gcd(b, a % b); }

let usedStems = new Set<string>();
function unique(stem: string): string {
  let s = stem;
  let attempt = 0;
  while (usedStems.has(s) && attempt < 20) { s = stem + ` (variant ${++attempt})`; }
  usedStems.add(s);
  return s;
}

function q(section: string, category: string, diff: number, stem: string, options: [string, string, string, string], correct: number, explanation: string, cm: [string, string], skills: string[], tags: string[], stimulus?: string): Question {
  const labels = ['A', 'B', 'C', 'D'];
  const wrongLabels = labels.filter((_, i) => i !== correct);
  return {
    section, category, difficulty: diff, type: 'multiple_choice',
    stem: unique(stem),
    ...(stimulus ? { stimulus } : {}),
    options: options.map((text, i) => ({ label: labels[i], text })),
    correctAnswer: labels[correct],
    explanation,
    commonMistakes: [
      { label: wrongLabels[0], explanation: cm[0] },
      { label: wrongLabels[1], explanation: cm[1] },
    ],
    skills, tags,
  };
}

// ============ MATH-ALGEBRA (57) ============
function mathAlgebra(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(57);
  let i = 0;

  // Linear equations (15)
  for (let j = 0; j < 15; j++) {
    const a = randInt(2, 9), x = randInt(-8, 10), b = randInt(1, 20);
    const c = a * x + b;
    qs.push(q('math', 'math.algebra.linear_equations', d[i++],
      `Solve for x: ${a}x + ${b} = ${c}`,
      [String(x), String(x + 2), String(x - 1), String(-x)], 0,
      `${a}x = ${c} - ${b} = ${c-b}, x = ${(c-b)}/${a} = ${x}`,
      ['Arithmetic error when dividing', 'Subtracted incorrectly'],
      ['solve-linear-equations'], ['algebra', 'linear-equations']));
  }

  // Systems (10)
  for (let j = 0; j < 10; j++) {
    const x = randInt(1, 7), y = randInt(1, 7);
    const a1 = randInt(1, 4), b1 = randInt(1, 4);
    let a2 = randInt(1, 4), b2 = randInt(1, 4);
    if (a1 * b2 === a2 * b1) b2++;
    const c1 = a1*x + b1*y, c2 = a2*x + b2*y;
    qs.push(q('math', 'math.algebra.systems', d[i++],
      `Solve: ${a1}x + ${b1}y = ${c1} and ${a2}x + ${b2}y = ${c2}. Find x.`,
      [String(x), String(y), String(x+1), String(x-1)], 0,
      `Using elimination/substitution: x = ${x}, y = ${y}`,
      ['Confused x and y', 'Arithmetic error in elimination'],
      ['systems-of-equations'], ['algebra', 'systems']));
  }

  // Expressions (10)
  for (let j = 0; j < 10; j++) {
    const a = randInt(2, 7), b = randInt(1, 9), c = randInt(2, 7), dd = randInt(1, 9);
    qs.push(q('math', 'math.algebra.expressions', d[i++],
      `Simplify: (${a}x + ${b}) + (${c}x + ${dd})`,
      [`${a+c}x + ${b+dd}`, `${a+c}x + ${b-dd}`, `${a*c}x + ${b+dd}`, `${a+c}x - ${b+dd}`], 0,
      `Combine like terms: (${a}+${c})x + (${b}+${dd}) = ${a+c}x + ${b+dd}`,
      ['Subtracted constants', 'Multiplied coefficients'],
      ['simplify-expressions'], ['algebra', 'expressions']));
  }

  // Word problems (12)
  for (let j = 0; j < 12; j++) {
    const rate = randInt(5, 15), hours = randInt(3, 10);
    const total = rate * hours;
    const names = ['Maria', 'James', 'Aisha', 'Carlos', 'Priya', 'Devon', 'Kai', 'Zara', 'Marcus', 'Lily', 'Sam', 'Nina'];
    qs.push(q('math', 'math.algebra.word_problems', d[i++],
      `${names[j]} earns $${rate}/hour and made $${total}. How many hours did they work?`,
      [String(hours), String(hours+2), String(hours-1), String(rate)], 0,
      `$${total} ÷ $${rate} = ${hours} hours`,
      ['Division error', 'Confused rate with hours'],
      ['algebraic-word-problems'], ['algebra', 'word-problems']));
  }

  // Modeling (10)
  for (let j = 0; j < 10; j++) {
    const base = randInt(20, 50), per = randInt(2, 10);
    const items = ['tickets','books','pizzas','shirts','plants','games','songs','photos','miles','laps'];
    qs.push(q('math', 'math.algebraic_modeling', d[i++],
      `A store charges $${base} membership + $${per} per ${items[j]}. Which expression gives total cost for n ${items[j]}?`,
      [`${base} + ${per}n`, `${per} + ${base}n`, `${base*per}n`, `(${base} + ${per})n`], 0,
      `Fixed cost $${base} + variable $${per} per item = ${base} + ${per}n`,
      ['Swapped fixed and variable', 'Multiplied both together'],
      ['algebraic-modeling'], ['algebra', 'modeling']));
  }

  return qs.slice(0, 57);
}

// ============ MATH-EXPONENTS (50) ============
function mathExponents(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(50);
  let i = 0;

  for (let j = 0; j < 30; j++) {
    const base = randInt(2, 5), e1 = randInt(2, 6), e2 = randInt(2, 5);
    const t = j % 3;
    if (t === 0) {
      qs.push(q('math', 'math.algebra.exponents', d[i++],
        `Simplify: ${base}^${e1} × ${base}^${e2}`,
        [`${base}^${e1+e2}`, `${base}^${e1*e2}`, `${base*2}^${e1+e2}`, `${base}^${Math.abs(e1-e2)}`], 0,
        `Same base: add exponents. ${e1}+${e2}=${e1+e2}`,
        ['Multiplied exponents instead', 'Wrong base'],
        ['exponent-rules'], ['exponents']));
    } else if (t === 1) {
      const big = e1 + e2 + 2;
      qs.push(q('math', 'math.algebra.exponents', d[i++],
        `Simplify: ${base}^${big} ÷ ${base}^${e2}`,
        [`${base}^${big-e2}`, `${base}^${big+e2}`, `${base}^${big*e2}`, `1`], 0,
        `Same base: subtract exponents. ${big}-${e2}=${big-e2}`,
        ['Added exponents', 'Multiplied exponents'],
        ['exponent-rules'], ['exponents']));
    } else {
      qs.push(q('math', 'math.algebra.exponents', d[i++],
        `Simplify: (${base}^${e1})^${e2}`,
        [`${base}^${e1*e2}`, `${base}^${e1+e2}`, `${base*e2}^${e1}`, `${base}^${e1}`], 0,
        `Power of power: multiply exponents. ${e1}×${e2}=${e1*e2}`,
        ['Added exponents instead', 'Wrong rule applied'],
        ['exponent-rules'], ['exponents']));
    }
  }

  for (let j = 0; j < 20; j++) {
    const c1 = +(randInt(11, 49) / 10).toFixed(1), c2 = +(randInt(11, 49) / 10).toFixed(1);
    const e1 = randInt(2, 6), e2 = randInt(2, 6);
    const prod = +(c1 * c2).toFixed(2);
    const sumE = e1 + e2;
    let fc = prod, fe = sumE;
    if (prod >= 10) { fc = +(prod / 10).toFixed(2); fe = sumE + 1; }
    qs.push(q('math', 'math.scientific_notation', d[i++],
      `Multiply: (${c1} × 10^${e1})(${c2} × 10^${e2})`,
      [`${fc} × 10^${fe}`, `${prod} × 10^${sumE}`, `${+(c1+c2).toFixed(1)} × 10^${sumE}`, `${prod} × 10^${e1*e2}`], 0,
      `Multiply coefficients: ${c1}×${c2}=${prod}. Add exponents: ${e1}+${e2}=${sumE}. Adjust if needed.`,
      ['Forgot to adjust coefficient', 'Added coefficients instead'],
      ['scientific-notation'], ['scientific-notation']));
  }

  return qs.slice(0, 50);
}

// ============ MATH-INEQUALITIES (50) ============
function mathInequalities(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(50);
  let i = 0;

  for (let j = 0; j < 20; j++) {
    const a = randInt(2, 8), x = randInt(-5, 10), b = randInt(1, 15);
    const c = a * x + b;
    const ops = ['>', '<', '≥', '≤'];
    const op = ops[j % 4];
    const rev: Record<string,string> = {'>':'<','<':'>','≥':'≤','≤':'≥'};
    qs.push(q('math', 'math.algebra.inequalities', d[i++],
      `Solve: ${a}x + ${b} ${op} ${c}`,
      [`x ${op} ${x}`, `x ${rev[op]} ${x}`, `x ${op} ${x+1}`, `x ${op} ${-x}`], 0,
      `Subtract ${b}, divide by ${a}: x ${op} ${x}`,
      ['Flipped inequality unnecessarily', 'Arithmetic error'],
      ['solve-inequalities'], ['inequalities']));
  }

  for (let j = 0; j < 15; j++) {
    const a = randInt(2, 6), x = randInt(-5, 5), b = randInt(1, 10);
    const c = -a * x + b;
    const op = j % 2 === 0 ? '>' : '<';
    const flip = op === '>' ? '<' : '>';
    qs.push(q('math', 'math.algebra.inequalities', d[i++],
      `Solve: -${a}x + ${b} ${op} ${c}`,
      [`x ${flip} ${x}`, `x ${op} ${x}`, `x ${flip} ${-x}`, `x ${op} ${-x}`], 0,
      `Divide by -${a} and flip: x ${flip} ${x}`,
      ['Forgot to flip when dividing by negative', 'Sign error'],
      ['solve-inequalities', 'flip-inequality'], ['inequalities']));
  }

  for (let j = 0; j < 15; j++) {
    const a = randInt(1, 8);
    const t = j % 3;
    if (t === 0) {
      qs.push(q('math', 'math.algebra.absolute_value', d[i++],
        `Solve: |x| = ${a}`,
        [`x = ${a} or x = -${a}`, `x = ${a}`, `x = -${a}`, `No solution`], 0,
        `|x| = ${a} means x = ${a} or x = -${a}`,
        ['Only positive solution', 'Only negative solution'],
        ['absolute-value'], ['absolute-value']));
    } else if (t === 1) {
      qs.push(q('math', 'math.arithmetic.absolute_value', d[i++],
        `Solve: |x| < ${a}`,
        [`-${a} < x < ${a}`, `x < ${a}`, `x > -${a}`, `x < -${a} or x > ${a}`], 0,
        `|x| < ${a} means -${a} < x < ${a}`,
        ['Forgot lower bound', 'Used greater-than rule'],
        ['absolute-value-inequalities'], ['absolute-value', 'inequalities']));
    } else {
      qs.push(q('math', 'math.algebra.absolute_value', d[i++],
        `Solve: |x| > ${a}`,
        [`x < -${a} or x > ${a}`, `-${a} < x < ${a}`, `x > ${a}`, `x > -${a}`], 0,
        `|x| > ${a} means x < -${a} or x > ${a}`,
        ['Used less-than rule', 'Forgot negative part'],
        ['absolute-value-inequalities'], ['absolute-value', 'inequalities']));
    }
  }

  return qs.slice(0, 50);
}

// ============ MATH-RATIOS (58) ============
function mathRatios(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(58);
  let i = 0;

  for (let j = 0; j < 20; j++) {
    const a = randInt(2, 8), b = randInt(2, 8), m = randInt(2, 6);
    qs.push(q('math', 'math.arithmetic.ratios_proportions', d[i++],
      `Ratio of cats:dogs is ${a}:${b}. If there are ${a*m} cats, how many dogs?`,
      [String(b*m), String(b*m+a), String(a*m), String((a+b)*m)], 0,
      `Scale factor = ${a*m}/${a} = ${m}. Dogs = ${b}×${m} = ${b*m}`,
      ['Added instead of multiplying', 'Found total instead of just dogs'],
      ['ratios-proportions'], ['ratios']));
  }

  for (let j = 0; j < 18; j++) {
    const orig = randInt(20, 200), pct = randInt(10, 50);
    const inc = j % 2 === 0;
    const change = Math.round(orig * pct / 100);
    const nv = inc ? orig + change : orig - change;
    qs.push(q('math', 'math.arithmetic.percent_change', d[i++],
      `Price ${inc ? 'increases' : 'decreases'} from $${orig} by ${pct}%. New price?`,
      [`$${nv}`, `$${inc ? orig+pct : orig-pct}`, `$${change}`, `$${orig}`], 0,
      `${pct}% of $${orig} = $${change}. New = $${orig} ${inc?'+':'-'} $${change} = $${nv}`,
      ['Subtracted percentage directly', 'Gave change amount not final price'],
      ['percent-change'], ['percentages']));
  }

  for (let j = 0; j < 20; j++) {
    const rate = randInt(2, 10), t1 = randInt(2, 6), t2 = randInt(7, 15);
    const a1 = rate * t1, a2 = rate * t2;
    const items = ['pages','miles','problems','laps','cookies','boxes','widgets','songs','chapters','levels','rows','tasks','orders','reports','paintings','sketches','emails','letters','puzzles','models'];
    qs.push(q('math', 'math.proportional_reasoning', d[i++],
      `If someone completes ${a1} ${items[j]} in ${t1} hours, how many in ${t2} hours?`,
      [String(a2), String(a2+rate), String(a1+t2), String(a2-rate)], 0,
      `Rate = ${a1}/${t1} = ${rate}/hr. In ${t2}h: ${rate}×${t2} = ${a2}`,
      ['Added extra unit', 'Added instead of multiplying'],
      ['proportional-reasoning'], ['ratios', 'proportions']));
  }

  return qs.slice(0, 58);
}

// ============ MATH-ARITHMETIC (50) ============
function mathArithmetic(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(50);
  let i = 0;

  // Order of operations (15)
  for (let j = 0; j < 15; j++) {
    const a = randInt(2, 8), b = randInt(1, 5), c = randInt(2, 6);
    const ans = a + b * c;
    qs.push(q('math', 'math.arithmetic.order_of_operations', d[i++],
      `Evaluate: ${a} + ${b} × ${c}`,
      [String(ans), String((a+b)*c), String(a*b+c), String(a+b+c)], 0,
      `Multiply first: ${b}×${c}=${b*c}. Then add ${a}: ${ans}`,
      ['Added before multiplying', 'Ignored multiplication'],
      ['order-of-operations'], ['PEMDAS']));
  }

  // Fractions (10)
  for (let j = 0; j < 10; j++) {
    const n1 = randInt(1, 5), d1 = randInt(2, 8), n2 = randInt(1, 5), d2 = randInt(2, 8);
    const num = n1*d2 + n2*d1, den = d1*d2;
    const g = gcd(num, den);
    const sn = num/g, sd = den/g;
    qs.push(q('math', 'math.arithmetic.fractions', d[i++],
      `Calculate: ${n1}/${d1} + ${n2}/${d2}`,
      [sd===1 ? String(sn) : `${sn}/${sd}`, `${n1+n2}/${d1+d2}`, `${num}/${den}`, `${sn+1}/${sd}`], 0,
      `Common denominator ${den}: ${num}/${den} = ${sn}/${sd}`,
      ['Added numerators and denominators separately', 'Forgot to simplify'],
      ['fraction-operations'], ['fractions']));
  }

  // Decimals (5)
  for (let j = 0; j < 5; j++) {
    const a = +(randInt(10,99)/10).toFixed(1), b = +(randInt(10,99)/10).toFixed(1);
    const s = +(a+b).toFixed(1);
    qs.push(q('math', 'math.arithmetic.decimals', d[i++],
      `Calculate: ${a} + ${b}`,
      [String(s), String(+(s+1).toFixed(1)), String(+(s-0.1).toFixed(1)), String(+(a*b).toFixed(1))], 0,
      `${a} + ${b} = ${s}`,
      ['Carrying error', 'Multiplied instead of adding'],
      ['decimal-operations'], ['decimals']));
  }

  // GCF (6)
  for (let j = 0; j < 6; j++) {
    const a = randInt(12, 48), b = randInt(12, 48);
    const g = gcd(a, b);
    qs.push(q('math', 'math.number_theory.gcf_lcm', d[i++],
      `What is the GCF of ${a} and ${b}?`,
      [String(g), String(a*b/g), String(Math.min(a,b)), String(g === 1 ? 2 : g-1)], 0,
      `GCF(${a}, ${b}) = ${g}`,
      ['Found LCM instead', 'Used smaller number'],
      ['gcf-lcm'], ['number-theory', 'gcf']));
  }

  // LCM (6)
  for (let j = 0; j < 6; j++) {
    const a = randInt(4, 15), b = randInt(4, 15);
    const g = gcd(a, b), lcm = a*b/g;
    qs.push(q('math', 'math.number_theory.gcf_lcm', d[i++],
      `What is the LCM of ${a} and ${b}?`,
      [String(lcm), String(a*b), String(g), String(Math.max(a,b))], 0,
      `LCM = ${a}×${b}/GCF = ${a*b}/${g} = ${lcm}`,
      ['Multiplied without dividing by GCF', 'Found GCF instead'],
      ['gcf-lcm'], ['number-theory', 'lcm']));
  }

  // Primes (4)
  const primes = [11, 13, 17, 19, 23, 29, 31, 37];
  for (let j = 0; j < 4; j++) {
    const p = primes[j+2];
    qs.push(q('math', 'math.number_theory.primes', d[i++],
      `Which is prime?`,
      [String(p), String(p+1), String(p*2), String(p+6)], 0,
      `${p} has only factors 1 and itself`,
      [`${p+1} is even/composite`, `${p*2} is divisible by 2`],
      ['prime-numbers'], ['number-theory', 'primes']));
  }

  // Divisibility (4)
  for (let j = 0; j < 4; j++) {
    const rules = [
      { div: 3, num: randInt(10, 50) * 3, test: 'digits sum divisible by 3' },
      { div: 4, num: randInt(10, 50) * 4, test: 'last two digits divisible by 4' },
      { div: 6, num: randInt(10, 50) * 6, test: 'divisible by both 2 and 3' },
      { div: 9, num: randInt(10, 50) * 9, test: 'digits sum divisible by 9' },
    ];
    const r = rules[j];
    qs.push(q('math', 'math.number_theory.divisibility', d[i++],
      `Is ${r.num} divisible by ${r.div}?`,
      ['Yes', 'No', `Only by ${r.div - 1}`, 'Cannot determine'], 0,
      `${r.num} ÷ ${r.div} = ${r.num / r.div}. Rule: ${r.test}`,
      ['Misapplied divisibility rule', 'Not enough info is wrong — we can test directly'],
      ['divisibility-rules'], ['number-theory', 'divisibility']));
  }

  return qs.slice(0, 50);
}

// ============ MATH-GEOMETRY-SHAPES (44) ============
function mathGeometryShapes(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(44);
  let i = 0;

  // Angles (7)
  for (let j = 0; j < 7; j++) {
    const angle = randInt(30, 150);
    const sup = 180 - angle;
    qs.push(q('math', 'math.geometry.angles', d[i++],
      `What is the supplement of ${angle}°?`,
      [`${sup}°`, `${90-angle > 0 ? 90-angle : angle-90}°`, `${angle}°`, `${360-angle}°`], 0,
      `Supplementary = 180° - ${angle}° = ${sup}°`,
      ['Found complement instead', 'Subtracted from 360'],
      ['angle-relationships'], ['geometry', 'angles']));
  }

  // Triangles (7)
  for (let j = 0; j < 7; j++) {
    const a1 = randInt(30, 80), a2 = randInt(30, 80), a3 = 180 - a1 - a2;
    qs.push(q('math', 'math.geometry.triangles', d[i++],
      `Triangle has angles ${a1}° and ${a2}°. Find the third.`,
      [`${a3}°`, `${180-a1}°`, `${a1+a2}°`, `${360-a1-a2}°`], 0,
      `180 - ${a1} - ${a2} = ${a3}°`,
      ['Only subtracted one angle', 'Used 360 instead of 180'],
      ['triangle-angle-sum'], ['geometry', 'triangles']));
  }

  // Area (8)
  for (let j = 0; j < 8; j++) {
    const tri = j % 2 === 0;
    const b = randInt(4, 15), h = randInt(3, 12);
    const area = tri ? b*h/2 : b*h;
    qs.push(q('math', 'math.geometry.area', d[i++],
      tri ? `Triangle: base=${b}, height=${h}. Area?` : `Rectangle: ${b}×${h}. Area?`,
      [`${area} sq units`, tri ? `${b*h} sq units` : `${2*(b+h)} sq units`, `${area+b} sq units`, `${b+h} sq units`], 0,
      tri ? `½×${b}×${h} = ${area}` : `${b}×${h} = ${area}`,
      [tri ? 'Forgot to halve' : 'Found perimeter', 'Added instead of multiplying'],
      ['area-calculation'], ['geometry', 'area']));
  }

  // Circles (8)
  for (let j = 0; j < 8; j++) {
    const r = randInt(2, 10);
    const isA = j % 2 === 0;
    const ans = isA ? (3.14*r*r).toFixed(2) : (2*3.14*r).toFixed(2);
    qs.push(q('math', 'math.geometry.circles', d[i++],
      isA ? `Area of circle, r=${r}? (π≈3.14)` : `Circumference, r=${r}? (π≈3.14)`,
      [ans, isA ? (2*3.14*r).toFixed(2) : (3.14*r*r).toFixed(2), (3.14*r).toFixed(2), String(r*r)], 0,
      isA ? `πr²=3.14×${r}²=${ans}` : `2πr=2×3.14×${r}=${ans}`,
      [isA ? 'Found circumference' : 'Found area', 'Used πr instead'],
      ['circle-formulas'], ['geometry', 'circles']));
  }

  // Pythagorean (6)
  const triples = [[3,4,5],[5,12,13],[8,15,17],[7,24,25],[6,8,10],[9,12,15]];
  for (let j = 0; j < 6; j++) {
    const [a, b, c] = triples[j];
    qs.push(q('math', 'math.geometry.pythagorean_theorem', d[i++],
      `Right triangle legs ${a} and ${b}. Hypotenuse?`,
      [String(c), String(a+b), String(c+1), String(c-1)], 0,
      `√(${a}²+${b}²) = √${a*a+b*b} = ${c}`,
      ['Added legs', 'Arithmetic error'],
      ['pythagorean-theorem'], ['geometry', 'pythagorean']));
  }

  // Composite (4)
  for (let j = 0; j < 4; j++) {
    const l = randInt(8, 14), w = randInt(5, 9), cl = randInt(2, 3), cw = randInt(2, 3);
    const area = l*w - cl*cw;
    qs.push(q('math', 'math.geometry.composite', d[i++],
      `Rectangle ${l}×${w} with ${cl}×${cw} corner removed. Area?`,
      [`${area}`, `${l*w}`, `${cl*cw}`, `${l*w+cl*cw}`], 0,
      `${l*w} - ${cl*cw} = ${area}`,
      ['Forgot to subtract cutout', 'Only found cutout area'],
      ['composite-shapes'], ['geometry', 'composite']));
  }

  // Perimeter (4)
  for (let j = 0; j < 4; j++) {
    const l = randInt(5, 15), w = randInt(3, 10);
    const p = 2*(l+w);
    qs.push(q('math', 'math.geometry.perimeter_area', d[i++],
      `Perimeter of rectangle ${l}×${w}?`,
      [String(p), String(l*w), String(l+w), String(4*l)], 0,
      `P = 2(${l}+${w}) = ${p}`,
      ['Found area instead', 'Only added once without doubling'],
      ['perimeter'], ['geometry', 'perimeter']));
  }

  return qs.slice(0, 44);
}

// ============ MATH-GEOMETRY-3D (48) ============
function mathGeometry3D(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(48);
  let i = 0;

  // Volume (18)
  for (let j = 0; j < 18; j++) {
    const t = j % 3;
    if (t === 0) {
      const l = randInt(3, 10), w = randInt(2, 8), h = randInt(2, 8);
      qs.push(q('math', 'math.geometry.volume', d[i++],
        `Volume of rectangular prism ${l}×${w}×${h}?`,
        [`${l*w*h}`, `${2*(l*w+l*h+w*h)}`, `${l+w+h}`, `${l*w}`], 0,
        `V=lwh=${l}×${w}×${h}=${l*w*h}`,
        ['Found surface area', 'Only 2 dimensions'],
        ['volume'], ['geometry', '3d', 'volume']));
    } else if (t === 1) {
      const r = randInt(2, 7), h = randInt(3, 10);
      const v = (3.14*r*r*h).toFixed(2);
      qs.push(q('math', 'math.geometry.volume', d[i++],
        `Volume of cylinder r=${r}, h=${h}? (π≈3.14)`,
        [v, (3.14*2*r*h).toFixed(2), (3.14*r*r).toFixed(2), (r*r*h).toFixed(2)], 0,
        `V=πr²h=3.14×${r}²×${h}=${v}`,
        ['Used lateral area formula', 'Forgot π'],
        ['volume-cylinder'], ['geometry', '3d', 'cylinder']));
    } else {
      const s = randInt(2, 10);
      qs.push(q('math', 'math.geometry.volume', d[i++],
        `Volume of cube with side ${s}?`,
        [`${s**3}`, `${6*s*s}`, `${s*s}`, `${3*s}`], 0,
        `V=s³=${s}³=${s**3}`,
        ['Found surface area', 'Found face area'],
        ['volume-cube'], ['geometry', '3d', 'cube']));
    }
  }

  // Surface area (18)
  for (let j = 0; j < 18; j++) {
    const t = j % 3;
    if (t === 0) {
      const l = randInt(3, 8), w = randInt(2, 6), h = randInt(2, 6);
      const sa = 2*(l*w+l*h+w*h);
      qs.push(q('math', 'math.geometry.3d.surface_area', d[i++],
        `Surface area of prism ${l}×${w}×${h}?`,
        [`${sa}`, `${l*w*h}`, `${l*w+l*h+w*h}`, `${2*l*w}`], 0,
        `SA=2(lw+lh+wh)=2(${l*w}+${l*h}+${w*h})=${sa}`,
        ['Found volume', 'Forgot to multiply by 2'],
        ['surface-area'], ['geometry', '3d', 'surface-area']));
    } else if (t === 1) {
      const s = randInt(2, 9);
      qs.push(q('math', 'math.geometry.3d.surface_area', d[i++],
        `Surface area of cube with side ${s}?`,
        [`${6*s*s}`, `${s**3}`, `${4*s*s}`, `${s*s}`], 0,
        `SA=6s²=6×${s}²=${6*s*s}`,
        ['Found volume', 'Used 4 faces instead of 6'],
        ['surface-area-cube'], ['geometry', '3d', 'surface-area']));
    } else {
      const r = randInt(2, 6), h = randInt(3, 9);
      const sa = (2*3.14*r*r + 2*3.14*r*h).toFixed(2);
      qs.push(q('math', 'math.geometry.3d.surface_area', d[i++],
        `Total surface area of cylinder r=${r}, h=${h}? (π≈3.14)`,
        [sa, (3.14*r*r*h).toFixed(2), (2*3.14*r*h).toFixed(2), (3.14*r*r).toFixed(2)], 0,
        `SA=2πr²+2πrh=${sa}`,
        ['Found volume', 'Only lateral area'],
        ['surface-area-cylinder'], ['geometry', '3d']));
    }
  }

  // Cross sections (12)
  const cs = [
    ['cube', 'parallel to a face', 'Square', 'Rectangle', 'Triangle', 'Circle'],
    ['cylinder', 'perpendicular to its base', 'Rectangle', 'Circle', 'Triangle', 'Oval'],
    ['cylinder', 'parallel to its base', 'Circle', 'Rectangle', 'Oval', 'Square'],
    ['rectangular prism', 'parallel to a face', 'Rectangle', 'Triangle', 'Pentagon', 'Circle'],
    ['cone', 'parallel to its base', 'Circle', 'Triangle', 'Oval', 'Square'],
    ['sphere', 'through its center', 'Circle', 'Oval', 'Square', 'Semicircle'],
    ['cube', 'diagonally corner to corner', 'Rectangle', 'Square', 'Triangle', 'Hexagon'],
    ['cone', 'vertically through the apex', 'Triangle', 'Circle', 'Rectangle', 'Oval'],
    ['triangular prism', 'perpendicular to length', 'Triangle', 'Rectangle', 'Square', 'Pentagon'],
    ['rectangular prism', 'diagonally', 'Triangle', 'Rectangle', 'Pentagon', 'Hexagon'],
    ['cube', 'through the midpoints of three edges', 'Triangle', 'Square', 'Hexagon', 'Circle'],
    ['hemisphere', 'along its flat face', 'Circle', 'Semicircle', 'Oval', 'Rectangle'],
  ];
  for (let j = 0; j < 12; j++) {
    const [shape, cut, ans, w1, w2, w3] = cs[j];
    qs.push(q('math', 'math.geometry.3d.cross_sections', d[i++],
      `A ${shape} is cut ${cut}. Cross-section shape?`,
      [ans, w1, w2, w3], 0,
      `Cutting a ${shape} ${cut} produces a ${ans.toLowerCase()}.`,
      ['Common confusion about 3D cross-sections', 'Incorrect visualization'],
      ['cross-sections'], ['geometry', '3d', 'cross-sections']));
  }

  return qs.slice(0, 48);
}

// ============ MATH-COORDINATE (48) ============
function mathCoordinate(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(48);
  let i = 0;

  // Slope (14)
  for (let j = 0; j < 14; j++) {
    const x1 = randInt(-5, 5), y1 = randInt(-5, 5);
    const x2 = x1 + randInt(1, 6), y2 = y1 + randInt(-6, 6);
    const rise = y2-y1, run = x2-x1;
    const g = gcd(Math.abs(rise), Math.abs(run));
    const sn = rise/g, sd = run/g;
    const s = sd === 1 ? String(sn) : `${sn}/${sd}`;
    qs.push(q('math', 'math.geometry.coordinate_slope', d[i++],
      `Slope through (${x1},${y1}) and (${x2},${y2})?`,
      [s, sd===1 ? String(-sn) : `${-sn}/${sd}`, sd===1 ? String(sn+1) : `${run}/${rise||1}`, '0'], 0,
      `(${y2}-${y1})/(${x2}-${x1}) = ${rise}/${run} = ${s}`,
      ['Sign error', 'Swapped rise/run'],
      ['slope'], ['coordinate-geometry', 'slope']));
  }

  // Midpoint (10)
  for (let j = 0; j < 10; j++) {
    const x1 = randInt(-8,8)*2, y1 = randInt(-8,8)*2, x2 = randInt(-8,8)*2, y2 = randInt(-8,8)*2;
    const mx = (x1+x2)/2, my = (y1+y2)/2;
    qs.push(q('math', 'math.geometry.coordinate_midpoint', d[i++],
      `Midpoint of (${x1},${y1}) and (${x2},${y2})?`,
      [`(${mx}, ${my})`, `(${x1+x2}, ${y1+y2})`, `(${mx+1}, ${my-1})`, `(${x2-x1}, ${y2-y1})`], 0,
      `((${x1}+${x2})/2, (${y1}+${y2})/2) = (${mx}, ${my})`,
      ['Forgot to divide by 2', 'Found difference instead'],
      ['midpoint'], ['coordinate-geometry', 'midpoint']));
  }

  // Transformations (14)
  for (let j = 0; j < 14; j++) {
    const x = randInt(-5, 5), y = randInt(-5, 5);
    const t = j % 4;
    let stem: string, a: string, w1: string, w2: string, w3: string;
    if (t === 0) {
      stem = `Reflect (${x},${y}) over x-axis.`;
      a = `(${x},${-y})`; w1 = `(${-x},${y})`; w2 = `(${-x},${-y})`; w3 = `(${y},${x})`;
    } else if (t === 1) {
      stem = `Reflect (${x},${y}) over y-axis.`;
      a = `(${-x},${y})`; w1 = `(${x},${-y})`; w2 = `(${-x},${-y})`; w3 = `(${y},${x})`;
    } else if (t === 2) {
      const dx = randInt(-4,4), dy = randInt(-4,4);
      stem = `Translate (${x},${y}) by (${dx},${dy}).`;
      a = `(${x+dx},${y+dy})`; w1 = `(${x-dx},${y-dy})`; w2 = `(${x+dx},${y-dy})`; w3 = `(${x*2},${y*2})`;
    } else {
      stem = `Rotate (${x},${y}) 180° about origin.`;
      a = `(${-x},${-y})`; w1 = `(${x},${-y})`; w2 = `(${-x},${y})`; w3 = `(${y},${x})`;
    }
    qs.push(q('math', 'math.geometry.transformations', d[i++], stem,
      [a, w1, w2, w3], 0,
      t===0 ? 'x-axis reflection negates y' : t===1 ? 'y-axis reflection negates x' : t===2 ? 'Add translation vector' : '180° negates both',
      ['Wrong axis/direction', 'Partial transformation'],
      ['transformations'], ['coordinate-geometry', 'transformations']));
  }

  // Distance (10)
  for (let j = 0; j < 10; j++) {
    const x1 = randInt(0, 8), y1 = randInt(0, 8), x2 = x1+randInt(1,5), y2 = y1+randInt(1,5);
    const dx = x2-x1, dy = y2-y1;
    const dSq = dx*dx+dy*dy;
    const dist = Math.round(Math.sqrt(dSq)*100)/100;
    qs.push(q('math', 'math.geometry.coordinate_geometry', d[i++],
      `Distance between (${x1},${y1}) and (${x2},${y2})? Round to hundredths.`,
      [String(dist), String(dx+dy), String(Math.round((dist+1)*100)/100), String(dSq)], 0,
      `√(${dx}²+${dy}²)=√${dSq}≈${dist}`,
      ['Added differences instead', 'Forgot square root'],
      ['distance-formula'], ['coordinate-geometry', 'distance']));
  }

  return qs.slice(0, 48);
}

// ============ MATH-STATISTICS (49) ============
function mathStatistics(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(49);
  let i = 0;

  // Mean (10)
  for (let j = 0; j < 10; j++) {
    const n = randInt(4, 7);
    const nums = Array.from({length:n}, () => randInt(10, 100));
    const sum = nums.reduce((a,b) => a+b, 0);
    const mean = Math.round(sum/n*100)/100;
    qs.push(q('math', 'math.statistics.mean_median_mode', d[i++],
      `Mean of: ${nums.join(', ')}?`,
      [String(mean), String(sum), String(mean+5), String(nums.sort((a,b)=>a-b)[Math.floor(n/2)])], 0,
      `${sum}÷${n}=${mean}`,
      ['Found sum not mean', 'Found median'],
      ['mean'], ['statistics', 'mean']));
  }

  // Median (9)
  for (let j = 0; j < 9; j++) {
    const n = j%2===0 ? 5 : 6;
    const nums = Array.from({length:n}, () => randInt(5, 50)).sort((a,b) => a-b);
    const med = n%2===1 ? nums[Math.floor(n/2)] : (nums[n/2-1]+nums[n/2])/2;
    qs.push(q('math', 'math.statistics.mean_median_mode', d[i++],
      `Median of: ${nums.join(', ')}?`,
      [String(med), String(nums[0]), String(nums[n-1]), String(Math.round(nums.reduce((a,b)=>a+b,0)/n*100)/100)], 0,
      `Middle value(s) of sorted data: ${med}`,
      ['Chose smallest', 'Found mean instead'],
      ['median'], ['statistics', 'median']));
  }

  // Range (7)
  for (let j = 0; j < 7; j++) {
    const nums = Array.from({length:randInt(5,8)}, () => randInt(5, 95));
    const range = Math.max(...nums) - Math.min(...nums);
    qs.push(q('math', 'math.statistics.range', d[i++],
      `Range of: ${nums.join(', ')}?`,
      [String(range), String(Math.max(...nums)), String(Math.min(...nums)), String(range+3)], 0,
      `${Math.max(...nums)}-${Math.min(...nums)}=${range}`,
      ['Gave max not range', 'Gave min not range'],
      ['range'], ['statistics', 'range']));
  }

  // Data interpretation (12)
  for (let j = 0; j < 12; j++) {
    const subjects = ['Math','Science','English','History','Art'];
    const vals = subjects.map(() => randInt(10, 50));
    const maxI = vals.indexOf(Math.max(...vals));
    qs.push(q('math', 'math.statistics.data_interpretation', d[i++],
      `Bar graph shows favorites: ${subjects.map((s,k)=>`${s}:${vals[k]}`).join(', ')}. Most popular?`,
      [subjects[maxI], subjects[(maxI+1)%5], subjects[(maxI+2)%5], subjects[(maxI+3)%5]], 0,
      `${subjects[maxI]} has highest value (${vals[maxI]})`,
      ['Misread values', 'Wrong category'],
      ['data-interpretation'], ['statistics', 'data-interpretation']));
  }

  // Function tables (11)
  for (let j = 0; j < 11; j++) {
    const m = randInt(2, 5), b = randInt(-3, 5);
    const xs = [1,2,3,4,5];
    const ys = xs.map(x => m*x+b);
    const miss = randInt(2, 4);
    qs.push(q('math', 'math.functions.tables', d[i++],
      `y = mx+b. x: ${xs.join(',')} → y: ${ys.map((y,k) => k+1===miss ? '?' : y).join(',')}. Missing y?`,
      [String(ys[miss-1]), String(ys[miss-1]+m), String(ys[miss-1]-1), String(miss)], 0,
      `Pattern: y=${m}x+${b}. At x=${miss}: ${m}(${miss})+${b}=${ys[miss-1]}`,
      ['Off by one step', 'Confused x and y'],
      ['function-tables'], ['functions', 'tables']));
  }

  return qs.slice(0, 49);
}

// ============ MATH-PROBABILITY (50) ============
function mathProbability(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(50);
  let i = 0;

  // Basic (18)
  for (let j = 0; j < 18; j++) {
    const total = randInt(10, 30), fav = randInt(2, total-2);
    const g = gcd(fav, total);
    const items = ['red marbles','blue cards','green balls','yellow tokens','striped socks','spotted dice','round beads','square tiles','white buttons','black chips','silver coins','gold stars','purple gems','pink erasers','orange cones','brown acorns','gray stones','tan shells'];
    qs.push(q('math', 'math.probability.basic', d[i++],
      `Bag has ${total} items, ${fav} are ${items[j]}. P(picking one)?`,
      [`${fav/g}/${total/g}`, `${fav}/${total-fav}`, `${total-fav}/${total}`, `1/${total}`], 0,
      `P = ${fav}/${total} = ${fav/g}/${total/g}`,
      ['Wrong denominator', 'Found complement'],
      ['basic-probability'], ['probability']));
  }

  // Compound (14)
  for (let j = 0; j < 14; j++) {
    const n1 = 6, n2 = j%2===0 ? 6 : 2;
    const e1 = randInt(1, 6);
    qs.push(q('math', 'math.probability.compound', d[i++],
      `P(rolling ${e1} on die AND ${n2===6 ? `rolling ${randInt(1,6)} on another die` : 'heads on coin'})?`,
      [`1/${n1*n2}`, `1/${n1}`, `2/${n1*n2}`, `1/${n1+n2}`], 0,
      `Independent: multiply. 1/${n1} × 1/${n2} = 1/${n1*n2}`,
      ['Only one event', 'Added instead of multiplying'],
      ['compound-probability'], ['probability', 'compound']));
  }

  // Venn (18)
  for (let j = 0; j < 18; j++) {
    const total = randInt(30, 60), a = randInt(10, 25), b = randInt(10, 25);
    const both = randInt(3, Math.min(a, b)-1);
    const neither = total - a - b + both;
    const acts = [['soccer','basketball'],['piano','guitar'],['math club','science club'],['reading','writing'],['swim','run'],['chess','debate'],['art','music'],['coding','robotics'],['dance','drama']];
    const [a1, a2] = acts[j % acts.length];
    const qt = j % 5;
    let ans: number, desc: string;
    if (qt===0) { ans = a-both; desc = `only ${a1}`; }
    else if (qt===1) { ans = b-both; desc = `only ${a2}`; }
    else if (qt===2) { ans = neither; desc = 'neither'; }
    else if (qt===3) { ans = a+b-both; desc = 'at least one'; }
    else { ans = both; desc = 'both'; }
    qs.push(q('math', 'math.sets.venn_diagrams', d[i++],
      `Of ${total} students: ${a} do ${a1}, ${b} do ${a2}, ${both} do both. How many do ${desc}?`,
      [String(ans), String(ans+both), String(a+b), String(total-ans)], 0,
      qt===0 ? `${a}-${both}=${ans}` : qt===1 ? `${b}-${both}=${ans}` : qt===2 ? `${total}-(${a}+${b}-${both})=${ans}` : qt===3 ? `${a}+${b}-${both}=${ans}` : `Both=${both}`,
      ['Forgot overlap', 'Added without accounting for overlap'],
      ['venn-diagrams'], ['probability', 'venn-diagrams']));
  }

  return qs.slice(0, 50);
}

// ============ MATH-PATTERNS (50) ============
function mathPatterns(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(50);
  let i = 0;

  // Arithmetic sequences (20)
  for (let j = 0; j < 20; j++) {
    const a1 = randInt(-5, 20), dd = randInt(1, 8) * (j%3===0 ? -1 : 1);
    const terms = Array.from({length:5}, (_,k) => a1+k*dd);
    const n = randInt(6, 12);
    const ans = a1 + (n-1)*dd;
    qs.push(q('math', 'math.algebra.patterns_sequences', d[i++],
      `${n}th term of: ${terms.join(', ')}, ...?`,
      [String(ans), String(ans+dd), String(ans-dd), String(a1*n)], 0,
      `d=${dd}. a_${n} = ${a1}+(${n}-1)(${dd}) = ${ans}`,
      ['Off by one term', 'Multiplied first term by n'],
      ['arithmetic-sequences'], ['patterns', 'sequences']));
  }

  // Geometric (15)
  for (let j = 0; j < 15; j++) {
    const a1 = randInt(1, 4), r = randInt(2, 3);
    const terms = Array.from({length:4}, (_,k) => a1*r**k);
    const n = randInt(5, 7);
    const ans = a1 * r**(n-1);
    qs.push(q('math', 'math.sequences_patterns', d[i++],
      `${n}th term: ${terms.join(', ')}, ...?`,
      [String(ans), String(a1*r**n), String(terms[3]+a1*r), String(a1*n*r)], 0,
      `r=${r}. a_${n}=${a1}×${r}^${n-1}=${ans}`,
      ['Used r^n not r^(n-1)', 'Linear instead of exponential'],
      ['geometric-sequences'], ['patterns', 'sequences']));
  }

  // Pattern recognition (15)
  for (let j = 0; j < 15; j++) {
    const start = randInt(1, 5), inc = randInt(2, 4);
    const terms: number[] = [start];
    for (let k = 1; k <= 4; k++) terms.push(terms[k-1] + inc*k);
    const next = terms[4] + inc*5;
    qs.push(q('math', 'math.algebra.patterns_sequences', d[i++],
      `Next: ${terms.join(', ')}, ...?`,
      [String(next), String(next+inc), String(terms[4]+inc*4), String(terms[4]*2)], 0,
      `Differences increase by ${inc}. Next diff=${inc*5}, so ${terms[4]}+${inc*5}=${next}`,
      ['Added too much', 'Used previous difference'],
      ['pattern-recognition'], ['patterns']));
  }

  return qs.slice(0, 50);
}

// ============ MATH-WORD-PROBLEMS (46) ============
function mathWordProblems(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(46);
  let i = 0;

  // Rate/distance/time (12)
  for (let j = 0; j < 12; j++) {
    const r = randInt(30, 70), t = randInt(2, 8);
    const dist = r * t;
    const vehicles = ['car','train','cyclist','runner','bus','boat','plane','truck','hiker','skater','ferry','scooter'];
    qs.push(q('math', 'math.word_problems.rate_distance_time', d[i++],
      `A ${vehicles[j]} goes ${r} mph for ${t} hours. Distance?`,
      [`${dist} mi`, `${r+t} mi`, `${Math.round(dist/2)} mi`, `${r} mi`], 0,
      `d=rt=${r}×${t}=${dist}`,
      ['Added rate and time', 'Confused rate with distance'],
      ['rate-distance-time'], ['word-problems', 'rate-distance-time']));
  }

  // Age (10)
  for (let j = 0; j < 10; j++) {
    const age = randInt(10, 30), yrs = randInt(3, 8);
    const names = ['Alex','Beth','Carlos','Diana','Ethan','Fatima','George','Hannah','Isaac','Julia'];
    qs.push(q('math', 'math.word_problems.age_problems', d[i++],
      `${names[j]} is ${age}. How old were they ${yrs} years ago?`,
      [String(age-yrs), String(age+yrs), String(age-yrs-1), String(yrs)], 0,
      `${age}-${yrs}=${age-yrs}`,
      ['Added instead', 'Gave years not age'],
      ['age-problems'], ['word-problems', 'age']));
  }

  // Combined work (8)
  for (let j = 0; j < 8; j++) {
    const a = randInt(3, 8), b = randInt(3, 8);
    const combined = Math.round(a*b/(a+b)*100)/100;
    const tasks = ['paint a room','mow a lawn','fill a pool','clean an office','build a wall','wash cars','sort packages','assemble toys'];
    qs.push(q('math', 'math.word_problems.combined_work', d[i++],
      `A does "${tasks[j]}" in ${a}h, B in ${b}h. Together?`,
      [`${combined} hours`, `${a+b} hours`, `${Math.round((a+b)/2*100)/100} hours`, `${Math.min(a,b)} hours`], 0,
      `1/${a}+1/${b}=${a+b}/${a*b}. Time=${a*b}/${a+b}≈${combined}`,
      ['Added times', 'Averaged times'],
      ['combined-work'], ['word-problems', 'combined-work']));
  }

  // Unit conversion (8)
  for (let j = 0; j < 8; j++) {
    const convs = [
      {f:'feet',t:'inches',r:12,v:randInt(2,10)},{f:'yards',t:'feet',r:3,v:randInt(2,15)},
      {f:'pounds',t:'ounces',r:16,v:randInt(2,8)},{f:'gallons',t:'quarts',r:4,v:randInt(2,10)},
      {f:'hours',t:'minutes',r:60,v:randInt(2,5)},{f:'meters',t:'centimeters',r:100,v:randInt(2,8)},
      {f:'kilograms',t:'grams',r:1000,v:randInt(1,5)},{f:'miles',t:'feet',r:5280,v:randInt(1,3)},
    ];
    const c = convs[j];
    qs.push(q('math', 'math.measurement.unit_conversion', d[i++],
      `Convert ${c.v} ${c.f} to ${c.t}.`,
      [`${c.v*c.r} ${c.t}`, `${c.v+c.r} ${c.t}`, `${Math.round(c.v/c.r*1000)/1000} ${c.t}`, `${c.r} ${c.t}`], 0,
      `${c.v}×${c.r}=${c.v*c.r}`,
      ['Added instead of multiplying', 'Divided instead'],
      ['unit-conversion'], ['word-problems', 'unit-conversion']));
  }

  // General (8)
  for (let j = 0; j < 8; j++) {
    const p = randInt(5, 25), qty = randInt(3, 12), disc = randInt(10, 30);
    const total = p*qty;
    const final = Math.round(total*(100-disc)/100);
    qs.push(q('math', 'math.word_problems', d[i++],
      `${qty} items at $${p} each with ${disc}% off. Total?`,
      [`$${final}`, `$${total}`, `$${total-disc}`, `$${Math.round(total*disc/100)}`], 0,
      `${qty}×$${p}=$${total}. ${disc}% off: $${final}`,
      ['Forgot discount', 'Gave discount amount not final'],
      ['word-problems'], ['word-problems', 'discount']));
  }

  return qs.slice(0, 46);
}

// ============ ELA-GRAMMAR (55) ============
function elaGrammar(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(55);
  let i = 0;

  // Subject-verb (8)
  const svPairs: [string, string, string, string, string][] = [
    ['The group of students ___ ready.', 'is', 'are', 'were', '"Group" is singular'],
    ['Neither the cat nor the dogs ___ outside.', 'are', 'is', 'was', 'Verb agrees with closer subject (dogs=plural)'],
    ['Each of the books ___ interesting.', 'is', 'are', 'were', '"Each" is singular'],
    ['The news ___ shocking.', 'is', 'are', 'were', '"News" is uncountable/singular'],
    ['Mathematics ___ my best subject.', 'is', 'are', 'were', '"Mathematics" takes singular verb'],
    ['Everyone ___ finished.', 'has', 'have', 'are', '"Everyone" is singular'],
    ['One of the students ___ absent.', 'is', 'are', 'were', '"One" is the subject (singular)'],
    ['There ___ many options.', 'are', 'is', 'was', '"Options" is plural → "are"'],
  ];
  for (const [stem, correct, w1, w2, exp] of svPairs) {
    qs.push(q('ela', 'ela.revising.grammar.subject_verb', d[i++],
      `Choose the correct verb: "${stem}"`,
      [correct, w1, w2, 'be'], 0, exp,
      ['Wrong number agreement', 'Wrong tense'],
      ['subject-verb-agreement'], ['grammar', 'subject-verb']));
  }

  // Fragments (8)
  const frags: [string, string][] = [
    ['Running through the park.', 'She was running through the park.'],
    ['Because the storm approached.', 'We left because the storm approached.'],
    ['The tall building near the river.', 'The tall building near the river collapsed.'],
    ['After finishing homework.', 'After finishing homework, she relaxed.'],
    ['Which was the best choice.', 'That was the choice which was the best.'],
    ['Since the start of school.', 'She improved since the start of school.'],
    ['To win the championship.', 'They trained hard to win the championship.'],
    ['Walking slowly down the hall.', 'He was walking slowly down the hall.'],
  ];
  for (const [frag, fix] of frags) {
    qs.push(q('ela', 'ela.revising.grammar.fragments', d[i++],
      `Fix this fragment: "${frag}"`,
      [fix, frag + ' quickly.', 'And ' + frag.toLowerCase(), frag], 0,
      'A fragment needs a subject and predicate to be complete.',
      ['Still a fragment', 'Original unchanged'],
      ['fix-fragments'], ['grammar', 'fragments']));
  }

  // Run-ons (8)
  const runons: [string, string, string][] = [
    ['I love pizza it is delicious.', 'I love pizza; it is delicious.', 'I love pizza, it is delicious.'],
    ['She studied she passed.', 'She studied, so she passed.', 'She studied, she passed.'],
    ['The movie was long we liked it.', 'The movie was long, but we liked it.', 'The movie was long, we liked it.'],
    ['He ran fast he won.', 'He ran fast and won.', 'He ran fast, he won.'],
    ['The sun set stars appeared.', 'The sun set, and stars appeared.', 'The sun set, stars appeared.'],
    ['We went they were closed.', 'We went, but they were closed.', 'We went, they were closed.'],
    ['I read it was good.', 'I read it, and it was good.', 'I read, it was good.'],
    ['Rain fell we stayed in.', 'Rain fell, so we stayed in.', 'Rain fell, we stayed in.'],
  ];
  for (const [bad, fix, splice] of runons) {
    qs.push(q('ela', 'ela.revising.grammar.run_ons', d[i++],
      `Fix this run-on: "${bad}"`,
      [fix, splice, bad, bad.replace(' ', ', ')], 0,
      'Separate independent clauses with conjunction+comma, semicolon, or period.',
      ['Creates comma splice', 'Original run-on unchanged'],
      ['fix-run-ons'], ['grammar', 'run-ons']));
  }

  // Comma splice (4)
  const splices: [string, string][] = [
    ['I like cats, they are cute.', 'I like cats; they are cute.'],
    ['She ran fast, she still lost.', 'She ran fast, but she still lost.'],
    ['It rained, we stayed home.', 'It rained, so we stayed home.'],
    ['He smiled, she waved back.', 'He smiled, and she waved back.'],
  ];
  for (const [bad, fix] of splices) {
    qs.push(q('ela', 'ela.revising.grammar.comma_splice', d[i++],
      `Fix the comma splice: "${bad}"`,
      [fix, bad, bad.replace(',', ''), bad.replace(',', ' and then also')], 0,
      'A comma alone cannot join two independent clauses.',
      ['Still a comma splice', 'Creates a run-on'],
      ['fix-comma-splice'], ['grammar', 'comma-splice']));
  }

  // Parallel structure (7)
  const parQs: [string, string][] = [
    ['She likes swimming, hiking, and to bike.', 'She likes swimming, hiking, and biking.'],
    ['The job needs patience, skill, and being organized.', 'The job needs patience, skill, and organization.'],
    ['He promised to study, attend, and that he would finish.', 'He promised to study, attend, and finish.'],
    ['She is smart, talented, and works hard.', 'She is smart, talented, and hardworking.'],
    ['Mix, bake, and to decorate.', 'Mix, bake, and decorate.'],
    ['Read carefully, write clearly, and speaking well.', 'Read carefully, write clearly, and speak well.'],
    ['He enjoys reading, to cook, and painting.', 'He enjoys reading, cooking, and painting.'],
  ];
  for (const [bad, fix] of parQs) {
    qs.push(q('ela', 'ela.revising.grammar.parallel_structure', d[i++],
      `Create parallel structure: "${bad}"`,
      [fix, bad, bad.split(',').reverse().join(','), fix.replace('and ', 'and also ')], 0,
      'Items in a series must use matching grammatical forms.',
      ['Still not parallel', 'Reversed order doesn\'t fix parallelism'],
      ['parallel-structure'], ['grammar', 'parallel-structure']));
  }

  // Verb tense (6)
  const tenses: [string, string][] = [
    ['Yesterday she walk to school.', 'Yesterday she walked to school.'],
    ['He has went already.', 'He has gone already.'],
    ['She is study right now.', 'She is studying right now.'],
    ['They was playing.', 'They were playing.'],
    ['If I was you, I\'d study.', 'If I were you, I\'d study.'],
    ['She drunk all the water.', 'She drank all the water.'],
  ];
  for (const [bad, fix] of tenses) {
    qs.push(q('ela', 'ela.revising.grammar.verb_tense', d[i++],
      `Correct the verb: "${bad}"`,
      [fix, bad, bad.replace(/\.$/, ' soon.'), bad + ' always'], 0,
      'Verb form must match tense and context.',
      ['Original error unchanged', 'Adding words doesn\'t fix the verb'],
      ['verb-tense'], ['grammar', 'verb-tense']));
  }

  // Pronoun-antecedent (6)
  const proQs: [string, string, string][] = [
    ['Each student must bring their lunch.', 'Each student must bring his or her lunch.', 'Each student must bring our lunch.'],
    ['The dog wagged their tail.', 'The dog wagged its tail.', 'The dog wagged his tail.'],
    ['Neither boy brought their book.', 'Neither boy brought his book.', 'Neither boy brought our book.'],
    ['Someone left their phone.', 'Someone left his or her phone.', 'Someone left our phone.'],
    ['The committee gave their report.', 'The committee gave its report.', 'The committee gave his report.'],
    ['Everyone did their best.', 'Everyone did his or her best.', 'Everyone did its best.'],
  ];
  for (const [bad, fix, w] of proQs) {
    qs.push(q('ela', 'ela.revising.grammar.pronoun_antecedent', d[i++],
      `Fix pronoun agreement: "${bad}"`,
      [fix, bad, w, bad.replace('their', 'them')], 0,
      'Pronouns must agree in number with their antecedents.',
      ['Original error', 'Wrong pronoun choice'],
      ['pronoun-antecedent'], ['grammar', 'pronoun']));
  }

  // Extra subject-verb to reach 55 (8)
  const extraSV: [string, string, string][] = [
    ['The scissors ___ sharp.', 'are', 'is'],
    ['Fifty dollars ___ a lot.', 'is', 'are'],
    ['The committee ___ its decision.', 'has made', 'have made'],
    ['Three miles ___ a long walk.', 'is', 'are'],
    ['The data ___ clear.', 'are', 'is'],
    ['Politics ___ complicated.', 'is', 'are'],
    ['The pair of shoes ___ expensive.', 'is', 'are'],
    ['Neither he nor they ___ coming.', 'are', 'is'],
  ];
  for (const [stem, correct, wrong] of extraSV) {
    qs.push(q('ela', 'ela.revising.grammar.subject_verb', d[i++],
      `Choose correct verb: "${stem}"`,
      [correct, wrong, 'were', 'be'], 0,
      'Subject-verb agreement depends on the true subject number.',
      ['Wrong number', 'Wrong tense entirely'],
      ['subject-verb-agreement'], ['grammar', 'subject-verb']));
  }

  return qs.slice(0, 55);
}

// ============ ELA-PUNCTUATION (48) ============
function elaPunctuation(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(48);
  let i = 0;

  // Comma usage (14)
  const commaQs: [string, string, string, string, string][] = [
    ['After the game we went home.', 'After the game, we went home.', 'After, the game we went home.', 'After the game we, went home.', 'Comma after introductory phrase.'],
    ['She bought apples oranges and bananas.', 'She bought apples, oranges, and bananas.', 'She bought apples oranges, and bananas.', 'She bought, apples oranges and bananas.', 'Commas separate items in a list.'],
    ['My brother who lives in Texas visited.', 'My brother, who lives in Texas, visited.', 'My brother who lives in Texas, visited.', 'My brother, who lives in Texas visited.', 'Non-essential clause needs commas.'],
    ['Well I think you are right.', 'Well, I think you are right.', 'Well I think, you are right.', 'Well I, think you are right.', 'Comma after introductory word.'],
    ['The tall dark stranger entered.', 'The tall, dark stranger entered.', 'The, tall dark stranger entered.', 'The tall dark, stranger entered.', 'Commas between coordinate adjectives.'],
    ['She said I will go.', 'She said, "I will go."', '"She said I will go."', 'She, said I will go.', 'Comma before a direct quote.'],
    ['However we disagreed.', 'However, we disagreed.', 'However we, disagreed.', 'However we disagreed,.', 'Comma after conjunctive adverb.'],
    ['On the other hand it could work.', 'On the other hand, it could work.', 'On the other, hand it could work.', 'On, the other hand it could work.', 'Comma after transitional phrase.'],
    ['Yes I agree completely.', 'Yes, I agree completely.', 'Yes I, agree completely.', 'Yes I agree, completely.', 'Comma after introductory word.'],
    ['The dog a golden retriever barked.', 'The dog, a golden retriever, barked.', 'The dog a golden retriever, barked.', 'The dog, a golden retriever barked.', 'Appositive needs commas.'],
    ['In the morning the birds sing.', 'In the morning, the birds sing.', 'In, the morning the birds sing.', 'In the morning the birds, sing.', 'Comma after introductory prepositional phrase.'],
    ['Furthermore the data supports this.', 'Furthermore, the data supports this.', 'Furthermore the, data supports this.', 'Furthermore the data, supports this.', 'Comma after conjunctive adverb.'],
    ['I went to the store and I bought milk.', 'I went to the store, and I bought milk.', 'I went to the store and, I bought milk.', 'I, went to the store and I bought milk.', 'Comma before conjunction joining independent clauses.'],
    ['Before eating we washed our hands.', 'Before eating, we washed our hands.', 'Before, eating we washed our hands.', 'Before eating we washed, our hands.', 'Comma after introductory phrase.'],
  ];
  for (const [bad, fix, w1, w2, exp] of commaQs) {
    qs.push(q('ela', 'ela.revising.grammar.comma_usage', d[i++],
      `Add the correct comma: "${bad}"`,
      [fix, w1, w2, bad], 0, exp,
      ['Comma in wrong place', 'Original has no comma'],
      ['comma-usage'], ['punctuation', 'commas']));
  }

  // Semicolons/colons (14)
  const semiQs: [string, string, string, string, string][] = [
    ['I like tea she likes coffee.', 'I like tea; she likes coffee.', 'I like tea, she likes coffee.', 'I like; tea she likes coffee.', 'Semicolon joins related independent clauses.'],
    ['She had one goal to win.', 'She had one goal: to win.', 'She had one goal; to win.', 'She had; one goal to win.', 'Colon introduces what follows.'],
    ['Pack these items socks shirts shoes.', 'Pack these items: socks, shirts, shoes.', 'Pack these items; socks, shirts, shoes.', 'Pack: these items socks shirts shoes.', 'Colon introduces a list after a complete sentence.'],
    ['He was tired however he kept going.', 'He was tired; however, he kept going.', 'He was tired, however he kept going.', 'He was; tired however he kept going.', 'Semicolon before conjunctive adverb, comma after.'],
    ['She speaks three languages French Spanish English.', 'She speaks three languages: French, Spanish, and English.', 'She speaks three languages; French, Spanish, and English.', 'She speaks; three languages French Spanish English.', 'Colon introduces the list.'],
    ['It rained we stayed inside.', 'It rained; we stayed inside.', 'It rained, we stayed inside.', 'It; rained we stayed inside.', 'Semicolon separates independent clauses.'],
    ['The answer was clear we needed more time.', 'The answer was clear: we needed more time.', 'The answer was clear, we needed more time.', 'The answer; was clear we needed more time.', 'Colon for elaboration.'],
    ['I have visited Paris France London England.', 'I have visited Paris, France; London, England.', 'I have visited Paris France, London England.', 'I have; visited Paris France London England.', 'Semicolons separate items with internal commas.'],
    ['The store closes at nine therefore hurry.', 'The store closes at nine; therefore, hurry.', 'The store closes at nine, therefore hurry.', 'The store closes; at nine therefore hurry.', 'Semicolon before therefore, comma after.'],
    ['Two things matter effort and attitude.', 'Two things matter: effort and attitude.', 'Two things matter; effort and attitude.', 'Two; things matter effort and attitude.', 'Colon introduces the explanation.'],
    ['We left early the traffic was bad.', 'We left early; the traffic was bad.', 'We left early, the traffic was bad.', 'We; left early the traffic was bad.', 'Semicolon joins related clauses.'],
    ['She succeeded moreover she broke the record.', 'She succeeded; moreover, she broke the record.', 'She succeeded, moreover she broke the record.', 'She; succeeded moreover she broke the record.', 'Semicolon before conjunctive adverb.'],
    ['The recipe needs three spices cumin paprika salt.', 'The recipe needs three spices: cumin, paprika, and salt.', 'The recipe needs three spices; cumin paprika salt.', 'The recipe; needs three spices cumin paprika salt.', 'Colon introduces list.'],
    ['He was happy she was not.', 'He was happy; she was not.', 'He was happy, she was not.', 'He; was happy she was not.', 'Semicolon separates contrasting clauses.'],
  ];
  for (const [bad, fix, w1, w2, exp] of semiQs) {
    qs.push(q('ela', 'ela.revising.grammar.semicolon_colon', d[i++],
      `Add correct punctuation: "${bad}"`,
      [fix, w1, w2, bad], 0, exp,
      ['Wrong punctuation mark', 'No change leaves error'],
      ['semicolons-colons'], ['punctuation', 'semicolons']));
  }

  // Apostrophes (12)
  const apoQs: [string, string, string, string, string][] = [
    ['The dogs bone was buried.', "The dog's bone was buried.", 'The dogs\' bone was buried.', 'The dog bone was buried.', 'Singular possessive: dog\'s.'],
    ['Its a beautiful day.', "It's a beautiful day.", 'Its\' a beautiful day.', 'Its a beautiful day.', 'It\'s = it is (contraction).'],
    ['The childrens toys are here.', "The children's toys are here.", 'The childrens\' toys are here.', 'The children toys are here.', 'Children is already plural; add \'s.'],
    ['The two boys jackets matched.', "The two boys' jackets matched.", 'The two boy\'s jackets matched.', 'The two boys jackets\' matched.', 'Plural possessive: boys\'.'],
    ['Dont forget your keys.', "Don't forget your keys.", 'Do\'nt forget your keys.', 'Dont\' forget your keys.', 'Apostrophe replaces the missing o.'],
    ['James book is on the desk.', "James's book is on the desk.", 'James book\'s is on the desk.', 'Jame\'s book is on the desk.', 'Singular name ending in s: add \'s.'],
    ['The cats whiskers twitched.', "The cat's whiskers twitched.", 'The cats\' whiskers twitched.', 'The cat whiskers twitched.', 'One cat = singular possessive.'],
    ['Whos coming to dinner?', "Who's coming to dinner?", 'Whose coming to dinner?', 'Who\'s\' coming to dinner?', 'Who\'s = who is.'],
    ['The womens restroom is upstairs.', "The women's restroom is upstairs.", 'The womens\' restroom is upstairs.', 'The women restroom is upstairs.', 'Women is already plural; add \'s.'],
    ['They shouldve called earlier.', "They should've called earlier.", 'They shouldv\'e called earlier.', 'They should\'ve called earlier.', 'Apostrophe in should\'ve replaces ha.'],
    ['The teachers lounge is closed.', "The teachers' lounge is closed.", 'The teacher\'s lounge is closed.', 'The teachers lounge\'s is closed.', 'Multiple teachers = plural possessive.'],
    ['Lets go to the park.', "Let's go to the park.", 'Lets\' go to the park.', 'Le\'ts go to the park.', 'Let\'s = let us.'],
  ];
  for (const [bad, fix, w1, w2, exp] of apoQs) {
    qs.push(q('ela', 'ela.revising.mechanics.apostrophes', d[i++],
      `Fix the apostrophe: "${bad}"`,
      [fix, w1, w2, bad], 0, exp,
      ['Wrong apostrophe placement', 'No apostrophe leaves error'],
      ['apostrophes'], ['punctuation', 'apostrophes']));
  }

  // Colon usage (8)
  const colonQs: [string, string, string, string, string][] = [
    ['The meeting starts at 3 00 PM.', 'The meeting starts at 3:00 PM.', 'The meeting starts at 3;00 PM.', 'The meeting starts at 3.00 PM.', 'Colons separate hours and minutes.'],
    ['Dear Sir or Madam', 'Dear Sir or Madam:', 'Dear Sir or Madam;', 'Dear Sir or Madam,', 'Colon after formal greeting.'],
    ['He wanted one thing success.', 'He wanted one thing: success.', 'He wanted one thing; success.', 'He wanted one thing, success.', 'Colon before a single explanatory word.'],
    ['Warning do not enter.', 'Warning: do not enter.', 'Warning; do not enter.', 'Warning, do not enter.', 'Colon after a warning/label.'],
    ['The rule is simple study daily.', 'The rule is simple: study daily.', 'The rule is simple; study daily.', 'The rule is, simple study daily.', 'Colon introduces elaboration.'],
    ['Note this will be on the test.', 'Note: this will be on the test.', 'Note; this will be on the test.', 'Note, this will be on the test.', 'Colon after a label.'],
    ['She brought supplies paper pencils erasers.', 'She brought supplies: paper, pencils, erasers.', 'She brought supplies; paper, pencils, erasers.', 'She brought: supplies paper pencils erasers.', 'Colon introduces list after complete clause.'],
    ['The time is 12 30.', 'The time is 12:30.', 'The time is 12;30.', 'The time is 12.30.', 'Colon in time notation.'],
  ];
  for (const [bad, fix, w1, w2, exp] of colonQs) {
    qs.push(q('ela', 'ela.revising.punctuation.colon_usage', d[i++],
      `Add correct punctuation: "${bad}"`,
      [fix, w1, w2, bad], 0, exp,
      ['Used semicolon instead', 'No punctuation added'],
      ['colon-usage'], ['punctuation', 'colons']));
  }

  return qs.slice(0, 48);
}

// ============ ELA-STYLE (39) ============
function elaStyle(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(39);
  let i = 0;

  // Word choice (8)
  const wcQs: [string, string, string, string, string][] = [
    ['The food was really good.', 'exceptional', 'very good', 'nice', 'More precise than "good."'],
    ['She went through the data.', 'analyzed', 'looked at', 'saw', '"Analyzed" is more precise and academic.'],
    ['He got a prize.', 'received', 'got himself', 'had', '"Received" is more formal.'],
    ['The thing was important.', 'The discovery was significant.', 'The thing was very important.', 'The thing was big.', 'Replace vague "thing" with specific noun.'],
    ['It was a bad storm.', 'devastating', 'really bad', 'not good', 'More vivid and precise.'],
    ['She made a good point.', 'compelling', 'very good', 'nice', '"Compelling" is more precise.'],
    ['They did the experiment.', 'conducted', 'did up', 'made', '"Conducted" is the academic term.'],
    ['The results were nice.', 'promising', 'very nice', 'okay', '"Promising" conveys specific meaning.'],
  ];
  for (const [sent, correct, w1, w2, exp] of wcQs) {
    const isFull = correct.includes(' ');
    qs.push(q('ela', 'ela.revising.grammar.word_choice', d[i++],
      isFull ? `Which is more precise?\n\n"${sent}"` : `Which word best replaces the vague term?\n\n"${sent}"`,
      [correct, w1, w2, sent.split(' ').pop()!.replace('.', '')], 0, exp,
      ['Still vague', 'Even less precise'],
      ['precise-language'], ['style', 'word-choice']));
  }

  // Transitions (8)
  const transQs: [string, string, string, string, string, string][] = [
    ['Rain was forecast. _____ we packed umbrellas.', 'Therefore', 'However', 'Meanwhile', 'Instead', 'Cause-effect relationship.'],
    ['It seemed easy. _____ it took months.', 'However', 'Therefore', 'Similarly', 'In addition', 'Contrast between expectation and reality.'],
    ['She studied all night. _____ she passed.', 'As a result', 'However', 'Meanwhile', 'Instead', 'Shows consequence.'],
    ['He likes math. _____ he enjoys science.', 'Similarly', 'However', 'Therefore', 'Instead', 'Shows similarity.'],
    ['We planned a picnic. _____ it rained.', 'Unfortunately', 'Therefore', 'Similarly', 'In addition', 'Shows negative outcome.'],
    ['She finished her essay. _____ she started studying.', 'Then', 'However', 'Similarly', 'Therefore', 'Shows sequence.'],
    ['The data was unclear. _____ they repeated the experiment.', 'Consequently', 'However', 'Similarly', 'Meanwhile', 'Shows result.'],
    ['He trained daily. _____ he ate healthy food.', 'In addition', 'However', 'Therefore', 'Instead', 'Adds information.'],
  ];
  for (const [stem, correct, w1, w2, w3, exp] of transQs) {
    qs.push(q('ela', 'ela.revising.grammar.transitions', d[i++],
      `Which transition fits?\n\n"${stem}"`,
      [correct, w1, w2, w3], 0, exp,
      ['Wrong relationship type', 'Doesn\'t match context'],
      ['transitions'], ['style', 'transitions']));
  }

  // Conciseness (8)
  const concQs: [string, string][] = [
    ['Due to the fact that it rained, we stayed inside.', 'Because it rained, we stayed inside.'],
    ['She is a person who is very talented.', 'She is very talented.'],
    ['In my opinion, I think the plan will work.', 'I think the plan will work.'],
    ['At this point in time, we should leave.', 'We should leave now.'],
    ['The reason why he left is because he was tired.', 'He left because he was tired.'],
    ['She made a decision to go.', 'She decided to go.'],
    ['It is important to note that the results improved.', 'The results improved.'],
    ['He has the ability to sing well.', 'He can sing well.'],
  ];
  for (const [wordy, concise] of concQs) {
    qs.push(q('ela', 'ela.revising.style.conciseness', d[i++],
      `Which is more concise?\n\n"${wordy}"`,
      [concise, wordy, wordy + ' really.', wordy.replace('.', ', indeed.')], 0,
      'Eliminate unnecessary words while keeping meaning.',
      ['Still wordy', 'Adds words'],
      ['conciseness'], ['style', 'conciseness']));
  }

  // Precise language (7)
  const precQs: [string, string, string][] = [
    ['The building was big.', 'The skyscraper towered over the city.', 'The building was very big.'],
    ['She felt bad about it.', 'She felt remorseful about her decision.', 'She felt really bad about it.'],
    ['The dog went across the yard.', 'The dog sprinted across the yard.', 'The dog moved across the yard.'],
    ['It was a nice day.', 'It was a warm, cloudless afternoon.', 'It was a really nice day.'],
    ['He said something quietly.', 'He whispered a warning.', 'He said something very quietly.'],
    ['The food smelled good.', 'The fresh bread filled the kitchen with a warm aroma.', 'The food smelled really good.'],
    ['She looked at the painting.', 'She studied every brushstroke of the painting.', 'She looked at the painting closely.'],
  ];
  for (const [vague, precise, w] of precQs) {
    qs.push(q('ela', 'ela.revising.style.precise_language', d[i++],
      `Which revision is most precise?\n\nOriginal: "${vague}"`,
      [precise, w, vague, vague + ' always.'], 0,
      'Precise language uses specific, vivid details.',
      ['Just adds intensifiers', 'Original is vague'],
      ['precise-language'], ['style', 'precise-language']));
  }

  // Active/passive (8)
  const apQs: [string, string][] = [
    ['The ball was thrown by the pitcher.', 'The pitcher threw the ball.'],
    ['The cake was baked by my mother.', 'My mother baked the cake.'],
    ['The homework was completed by the students.', 'The students completed the homework.'],
    ['The song was sung by the choir.', 'The choir sang the song.'],
    ['The letter was written by Sarah.', 'Sarah wrote the letter.'],
    ['The window was broken by the storm.', 'The storm broke the window.'],
    ['The speech was delivered by the president.', 'The president delivered the speech.'],
    ['The game was won by our team.', 'Our team won the game.'],
  ];
  for (const [passive, active] of apQs) {
    qs.push(q('ela', 'ela.revising.style.active_passive', d[i++],
      `Convert to active voice: "${passive}"`,
      [active, passive, passive.replace('was ', 'has been '), passive.replace('.', ' recently.')], 0,
      'Active voice: subject performs the action directly.',
      ['Still passive', 'Changed tense but still passive'],
      ['active-passive-voice'], ['style', 'active-passive']));
  }

  return qs.slice(0, 39);
}

// ============ ELA-PASSAGE-REVISION (42) ============
function elaPassageRevision(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(42);
  let i = 0;

  // Best transition in passage (14)
  const transContexts: [string, string, string, string, string, string][] = [
    ['Paragraph 1 discusses benefits of exercise. Paragraph 2 discusses potential risks.', 'However', 'Therefore', 'Similarly', 'In addition', 'Contrasting ideas need a contrast transition.'],
    ['The first section explains the problem. The next provides solutions.', 'To address this', 'However', 'Similarly', 'In contrast', 'Moving from problem to solution.'],
    ['The author describes the old method. Then the new method.', 'In contrast', 'Therefore', 'Similarly', 'As a result', 'Comparing old vs new methods.'],
    ['Evidence A supports the claim. Evidence B also supports it.', 'Furthermore', 'However', 'Instead', 'Nevertheless', 'Adding supporting evidence.'],
    ['The experiment had limitations. The results were still valid.', 'Nevertheless', 'Therefore', 'Similarly', 'For example', 'Conceding a point while maintaining the argument.'],
    ['The paragraph describes causes. The next paragraph describes effects.', 'As a result', 'However', 'Similarly', 'For instance', 'Cause-to-effect transition.'],
    ['The writer lists advantages. The following section lists disadvantages.', 'On the other hand', 'Therefore', 'In addition', 'For example', 'Shifting to opposing view.'],
    ['The introduction presents the thesis. The body paragraph provides an example.', 'For instance', 'However', 'In conclusion', 'Nevertheless', 'Introducing supporting example.'],
    ['The passage argues for conservation. The next point strengthens the argument.', 'Moreover', 'However', 'Instead', 'In contrast', 'Strengthening with additional point.'],
    ['Data is presented. An interpretation follows.', 'This suggests that', 'However', 'Similarly', 'Instead', 'Drawing conclusion from data.'],
    ['The historical context is given. The current situation is described.', 'Today', 'However', 'Similarly', 'Therefore', 'Time transition from past to present.'],
    ['The first reason is economic. The second reason is ethical.', 'Additionally', 'However', 'Instead', 'In contrast', 'Adding another reason.'],
    ['A counterargument is presented. The author refutes it.', 'However', 'Therefore', 'Similarly', 'For example', 'Refuting a counterargument.'],
    ['The study\'s methods are described. The findings follow.', 'The results showed that', 'However', 'Similarly', 'Instead', 'Moving from methods to results.'],
  ];
  for (const [context, correct, w1, w2, w3, exp] of transContexts) {
    qs.push(q('ela', 'ela.revising.passage.best_transition', d[i++],
      `Which transition best connects these sections?\n\n${context}`,
      [correct, w1, w2, w3], 0, exp,
      ['Wrong relationship type', 'Doesn\'t fit the logical flow'],
      ['passage-transitions'], ['passage-revision', 'transitions']));
  }

  // Sentence revision (14)
  const sentRevQs: [string, string, string, string, string][] = [
    ['The student was studying for the test and the student was also reviewing notes and the student was very tired.',
     'Although tired, the student studied for the test and reviewed notes.',
     'The student was studying and reviewing and was tired.',
     'Tired, studying, reviewing, the student was.',
     'Combines ideas concisely and eliminates redundancy.'],
    ['There are many students who like to play soccer after school.',
     'Many students like to play soccer after school.',
     'There are students, many of them, who play soccer.',
     'Soccer is played by many students after school.',
     'Eliminates "there are" construction for directness.'],
    ['It is a well-known fact that exercise improves health.',
     'Exercise improves health.',
     'The fact that exercise improves health is well-known.',
     'That exercise improves health is well-known by all.',
     'Removes unnecessary preamble.'],
    ['The reason the game was cancelled was because of the rain.',
     'The game was cancelled because of the rain.',
     'Because of the rain is the reason the game was cancelled.',
     'Rain was the reason for the cancellation of the game.',
     'Eliminates redundant "the reason...was because."'],
    ['She was of the opinion that the project needed more time.',
     'She believed the project needed more time.',
     'Her opinion was that the project was needing more time.',
     'The project, she opined, was in need of additional time.',
     'More direct and concise.'],
    ['What I want to say is that we should start earlier.',
     'We should start earlier.',
     'The thing I want to say is about starting earlier.',
     'Starting earlier is what I\'m trying to say we should do.',
     'Removes filler phrase.'],
    ['He made the decision to resign from his position.',
     'He decided to resign.',
     'His decision was to resign from his position at work.',
     'The decision he made was resignation from the position.',
     'Uses strong verb instead of weak noun phrase.'],
    ['The book that was written by the author was published last year.',
     'The author\'s book was published last year.',
     'Last year the book was written and published by the author.',
     'Written by the author, the book, it was published.',
     'More concise and direct.'],
    ['Due to the fact that the weather was bad, the event was postponed.',
     'The event was postponed due to bad weather.',
     'Bad weather was the fact due to which the event was postponed.',
     'The postponement of the event was due to the fact of bad weather.',
     'Simplifies wordy phrase.'],
    ['At this point in time, we need to make a decision about the matter.',
     'We need to decide now.',
     'A decision about the matter needs to be made at this point.',
     'The matter requires a decision to be made at this time.',
     'Eliminates wordy phrases.'],
    ['The teacher gave an explanation of the concept to the students.',
     'The teacher explained the concept to the students.',
     'An explanation of the concept was given by the teacher.',
     'The concept had an explanation given about it by the teacher.',
     'Strong verb replaces weak "gave an explanation."'],
    ['It is necessary for all students to complete the assignment.',
     'All students must complete the assignment.',
     'Completion of the assignment is a necessity for students.',
     'The assignment, it is necessary that students complete it.',
     'More direct.'],
    ['In the event that it rains, the picnic will be cancelled.',
     'If it rains, the picnic will be cancelled.',
     'Raining being the event, cancellation of the picnic will occur.',
     'The picnic will be cancelled in the event of the occurrence of rain.',
     'Simpler conditional.'],
    ['She has a tendency to arrive late to meetings.',
     'She tends to arrive late to meetings.',
     'Her tendency is that of arriving late to the meetings.',
     'Arriving late to meetings is a tendency she has.',
     'Verb form is more concise.'],
  ];
  for (const [orig, fix, w1, w2, exp] of sentRevQs) {
    qs.push(q('ela', 'ela.revising.passage.sentence_revision', d[i++],
      `Which is the best revision?\n\n"${orig}"`,
      [fix, w1, w2, orig], 0, exp,
      ['Still awkward/wordy', 'Original problem unchanged'],
      ['sentence-revision'], ['passage-revision', 'sentence-revision']));
  }

  // Organization/transitions (14)
  const orgQs: [string, string, string, string, string, string][] = [
    ['A paragraph about causes is followed by one about effects.', 'As a result', 'However', 'For example', 'Similarly', 'Cause-effect needs a causal transition.'],
    ['The essay introduces a topic then gives background.', 'To understand this issue', 'In conclusion', 'However', 'On the other hand', 'Background transition.'],
    ['After listing pros, the essay switches to cons.', 'Conversely', 'Additionally', 'Therefore', 'For instance', 'Shifting to opposite perspective.'],
    ['The paragraph ends an argument and the next summarizes.', 'In conclusion', 'However', 'For example', 'Furthermore', 'Concluding transition.'],
    ['A general statement is followed by a specific example.', 'For example', 'However', 'In conclusion', 'Nevertheless', 'General to specific.'],
    ['The writer acknowledges opposition then returns to main argument.', 'Nonetheless', 'Similarly', 'For example', 'In addition', 'Returning after concession.'],
    ['Sequential steps are being described.', 'Next', 'However', 'In contrast', 'Nevertheless', 'Sequence transition.'],
    ['An analogy is being introduced.', 'Similarly', 'However', 'Therefore', 'In conclusion', 'Drawing comparison.'],
    ['The passage shifts from past to present.', 'Currently', 'However', 'Therefore', 'For example', 'Time shift transition.'],
    ['The argument is being reinforced.', 'Indeed', 'However', 'Instead', 'In contrast', 'Emphasis/reinforcement.'],
    ['A definition has been given, now an example follows.', 'To illustrate', 'However', 'In conclusion', 'Instead', 'Definition to example.'],
    ['The writer is about to present the main claim.', 'The central argument is that', 'However', 'For example', 'In addition', 'Introducing thesis.'],
    ['Multiple examples have been given, now wrapping up.', 'Taken together, these examples show', 'However', 'For instance', 'Similarly', 'Synthesizing examples.'],
    ['A story is about to be used as evidence.', 'Consider the following example', 'However', 'In conclusion', 'Instead', 'Introducing narrative evidence.'],
  ];
  for (const [context, correct, w1, w2, w3, exp] of orgQs) {
    qs.push(q('ela', 'ela.revising.organization.transitions', d[i++],
      `Which transition best fits this context?\n\n${context}`,
      [correct, w1, w2, w3], 0, exp,
      ['Wrong relationship', 'Doesn\'t fit passage flow'],
      ['organizational-transitions'], ['passage-revision', 'organization']));
  }

  return qs.slice(0, 42);
}

// ============ ELA-MAIN-IDEA (64) ============
function elaMainIdea(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(64);
  let i = 0;

  const passages: { text: string; questions: { stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] }[] = [
    {
      text: `In recent years, urban gardens have transformed vacant lots in cities across America into thriving green spaces. These gardens serve multiple purposes: they provide fresh produce to neighborhoods that lack grocery stores, they create gathering spaces for communities, and they help reduce the urban heat island effect by replacing concrete with vegetation. Studies from the University of Pennsylvania found that neighborhoods with community gardens experienced a 20% decrease in crime rates and a measurable increase in property values. Perhaps most importantly, these gardens give city residents a sense of ownership and pride in their neighborhoods. Volunteers of all ages work side by side, building relationships that cross generational and cultural divides. What began as a grassroots movement has now gained support from city governments, with many municipalities offering tax incentives for property owners who convert unused lots into garden spaces.`,
      questions: [
        { stem: 'What is the main idea of this passage?', correct: 'Urban gardens provide multiple benefits to city communities.', w1: 'Urban gardens are mainly used to grow food.', w2: 'Crime rates have decreased in all cities.', w3: 'City governments created community gardens.', exp: 'The passage discusses several benefits: food, community, environment, crime reduction.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the author\'s primary purpose?', correct: 'To inform readers about the benefits of urban gardens', w1: 'To persuade readers to start gardening', w2: 'To criticize cities for having vacant lots', w3: 'To compare urban and rural farming', exp: 'The author presents information about multiple benefits without explicitly arguing for action.', cat: 'ela.reading.authors_purpose' },
        { stem: 'How is this passage primarily organized?', correct: 'A central claim supported by multiple examples and evidence', w1: 'Chronological order of events', w2: 'Compare and contrast of two gardens', w3: 'Problem followed by a single solution', exp: 'The passage states gardens are beneficial then gives several supporting examples.', cat: 'ela.reading.text_structure' },
      ],
    },
    {
      text: `The octopus is widely regarded as one of the most intelligent invertebrates on Earth. With approximately 500 million neurons—comparable to a dog—the octopus demonstrates remarkable problem-solving abilities. In laboratory settings, octopuses have been observed unscrewing jar lids to access food, navigating complex mazes, and even using tools such as coconut shells for shelter. Their intelligence extends to social learning: an octopus can learn to perform a task simply by watching another octopus complete it. What makes octopus intelligence particularly fascinating is that it evolved independently from mammalian intelligence. While humans and other vertebrates centralized their neural processing in the brain, two-thirds of an octopus's neurons reside in its arms, meaning each arm can taste, touch, and even "think" somewhat independently. This distributed nervous system represents a fundamentally different approach to intelligence, challenging our assumptions about what it means to be smart.`,
      questions: [
        { stem: 'What is the central idea of this passage?', correct: 'Octopuses possess a unique and impressive form of intelligence.', w1: 'Octopuses are smarter than dogs.', w2: 'The octopus brain is identical to a human brain.', w3: 'Scientists have trained octopuses to perform tricks.', exp: 'The passage focuses on the remarkable and unique nature of octopus intelligence.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the author\'s purpose in mentioning the distributed nervous system?', correct: 'To show how octopus intelligence differs fundamentally from mammalian intelligence', w1: 'To prove octopuses are more intelligent than mammals', w2: 'To explain why octopuses have eight arms', w3: 'To describe octopus anatomy in detail', exp: 'The distributed system illustrates a different evolutionary approach to intelligence.', cat: 'ela.reading.authors_purpose' },
        { stem: 'Which text structure best describes this passage?', correct: 'Description with supporting details and examples', w1: 'Cause and effect', w2: 'Problem and solution', w3: 'Sequential/chronological', exp: 'The passage describes octopus intelligence using examples and comparisons.', cat: 'ela.reading.text_structure' },
      ],
    },
    {
      text: `When the Dust Bowl struck the American Great Plains in the 1930s, it was not simply a natural disaster—it was a catastrophe amplified by human decisions. For decades, farmers had plowed millions of acres of native grassland to plant wheat, driven by high prices during World War I and the belief that "rain follows the plow." The deep-rooted prairie grasses that had held the topsoil in place for thousands of years were replaced by shallow-rooted crops. When a severe drought hit in 1931, the exposed soil had nothing to anchor it. Massive dust storms, called "black blizzards," swept across the plains, burying homes and livestock. An estimated 2.5 million people fled the region, becoming environmental refugees. The Dust Bowl forced a fundamental rethinking of American agricultural practices and led to the creation of the Soil Conservation Service, which promoted techniques like crop rotation and contour plowing to prevent future soil erosion.`,
      questions: [
        { stem: 'What is the main idea of this passage?', correct: 'The Dust Bowl was worsened by poor farming practices and led to major agricultural reform.', w1: 'The Dust Bowl was caused only by drought.', w2: 'Wheat farming was profitable during WWI.', w3: 'The Soil Conservation Service solved all farming problems.', exp: 'The passage traces how human decisions worsened the disaster and the reforms that followed.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the author\'s primary purpose?', correct: 'To explain the causes and consequences of the Dust Bowl', w1: 'To argue against modern farming', w2: 'To entertain with dramatic stories', w3: 'To compare the 1930s to today', exp: 'The author provides an informative account of causes, effects, and outcomes.', cat: 'ela.reading.authors_purpose' },
        { stem: 'How is this passage organized?', correct: 'Cause and effect with chronological elements', w1: 'Compare and contrast', w2: 'Problem and solution only', w3: 'Description with no clear pattern', exp: 'The passage shows causes (farming practices + drought), effects (dust storms, migration), and the response.', cat: 'ela.reading.text_structure' },
      ],
    },
    {
      text: `Sleep deprivation among teenagers has reached epidemic proportions, and the consequences extend far beyond feeling drowsy in class. Research from the National Sleep Foundation shows that adolescents need 8 to 10 hours of sleep per night, yet the average American teenager gets only 7 hours. The biological explanation lies in a shift in circadian rhythms during puberty: the brain begins releasing melatonin later in the evening, making it physically difficult for teens to fall asleep before 11 p.m. Despite this biological reality, most high schools in the United States start before 8:00 a.m. The resulting sleep deficit has been linked to increased rates of depression, anxiety, obesity, and poor academic performance. Schools that have shifted to later start times—such as those in Seattle, which moved from 7:50 to 8:45 a.m.—have reported significant improvements in attendance, grades, and student well-being. These findings have prompted the American Academy of Pediatrics to recommend that no middle or high school start before 8:30 a.m.`,
      questions: [
        { stem: 'What is the main idea?', correct: 'Teen sleep deprivation is a serious problem that could be improved by later school start times.', w1: 'Teenagers are lazy and sleep too much.', w2: 'All schools should start at 8:45.', w3: 'Melatonin is the only cause of teen sleep problems.', exp: 'The passage links biological needs, current school schedules, and evidence for change.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the purpose of mentioning Seattle schools?', correct: 'To provide evidence that later start times improve student outcomes', w1: 'To show Seattle has the best schools', w2: 'To criticize other cities for not changing', w3: 'To explain how melatonin works', exp: 'Seattle serves as a concrete example supporting the argument for later start times.', cat: 'ela.reading.authors_purpose' },
      ],
    },
    {
      text: `The ancient Silk Road was not a single road but a vast network of trade routes connecting China to the Mediterranean world. For over 1,500 years, merchants, monks, soldiers, and scholars traveled these routes, carrying silk, spices, precious metals, and ideas across thousands of miles of desert, mountain, and steppe. The exchange was never one-directional: while Chinese silk flowed westward, Roman glassware, Indian spices, and Persian silverwork traveled eastward. Perhaps more significant than the physical goods were the intangible exchanges. Buddhism spread from India to China along the Silk Road. Mathematical concepts, including the numeral system we use today, traveled from India through the Islamic world to Europe. Medical knowledge, agricultural techniques, and artistic styles were shared and transformed as they passed from culture to culture. The Silk Road demonstrates that globalization is not a modern phenomenon—human societies have been interconnected for millennia.`,
      questions: [
        { stem: 'What is the central argument of this passage?', correct: 'The Silk Road facilitated cultural and intellectual exchange, showing globalization is ancient.', w1: 'The Silk Road was mainly used for trading silk.', w2: 'China was the most important Silk Road civilization.', w3: 'The Silk Road was a single road from China to Rome.', exp: 'The passage emphasizes both material and intangible exchanges and concludes that globalization is not new.', cat: 'ela.reading.main_idea' },
        { stem: 'How does the author organize the passage?', correct: 'From physical goods to intangible exchanges, building toward a larger conclusion', w1: 'Strictly chronological', w2: 'Compare and contrast of two cultures', w3: 'Problem and solution', exp: 'The passage moves from concrete trade to abstract ideas, then to a broad conclusion.', cat: 'ela.reading.text_structure' },
      ],
    },
    {
      text: `Coral reefs, often called the "rainforests of the sea," support approximately 25% of all marine species despite covering less than 1% of the ocean floor. These underwater ecosystems are built by tiny animals called coral polyps, which secrete calcium carbonate to form hard structures over hundreds of years. The relationship between coral polyps and microscopic algae called zooxanthellae is the foundation of reef health: the algae live within coral tissue, providing up to 90% of the coral's energy through photosynthesis, while the coral provides shelter and nutrients. When ocean temperatures rise even 1-2 degrees Celsius above normal, corals expel their zooxanthellae in a process called bleaching, turning white and becoming vulnerable to disease and death. Since 1998, three major global bleaching events have affected reefs worldwide. Scientists estimate that 50% of the world's coral reefs have already been lost, and without significant action to reduce carbon emissions, 90% could disappear by 2050.`,
      questions: [
        { stem: 'What is the main idea?', correct: 'Coral reefs are vital ecosystems threatened by rising ocean temperatures.', w1: 'Coral reefs cover most of the ocean.', w2: 'Zooxanthellae are the most important ocean species.', w3: 'All coral reefs will be gone by 2030.', exp: 'The passage describes reef importance and the threat of bleaching from warming.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the author\'s purpose?', correct: 'To explain coral reef ecology and warn about the threat of climate change', w1: 'To describe how to build artificial reefs', w2: 'To compare reefs to rainforests in detail', w3: 'To argue that marine species are unimportant', exp: 'The passage educates about reefs and highlights the urgency of the climate threat.', cat: 'ela.reading.authors_purpose' },
        { stem: 'What text structure is used to describe coral bleaching?', correct: 'Cause and effect', w1: 'Compare and contrast', w2: 'Chronological order', w3: 'Problem and solution', exp: 'Rising temperatures (cause) lead to bleaching and potential death (effect).', cat: 'ela.reading.text_structure' },
      ],
    },
    {
      text: `In 1928, Alexander Fleming returned from vacation to find mold growing on a bacterial culture plate he had left in his laboratory. Rather than discarding the contaminated sample, Fleming noticed something remarkable: the bacteria surrounding the mold had died. The mold, Penicillium notatum, was producing a substance that killed bacteria. Fleming named this substance penicillin, but he lacked the resources to develop it into a usable medicine. It would take more than a decade before Howard Florey and Ernst Boris Chain at Oxford University found a way to mass-produce penicillin. Their work came just in time: by 1944, enough penicillin was available to treat Allied soldiers wounded on D-Day. The discovery of penicillin ushered in the age of antibiotics, transforming medicine and saving an estimated 200 million lives since its introduction. Today, however, the overuse of antibiotics has led to antibiotic-resistant bacteria, posing one of the greatest threats to modern public health.`,
      questions: [
        { stem: 'What is the main idea?', correct: 'Penicillin\'s accidental discovery revolutionized medicine but now faces the challenge of resistance.', w1: 'Fleming intentionally created penicillin.', w2: 'Antibiotics have no side effects.', w3: 'Penicillin was only used in World War II.', exp: 'The passage covers discovery, development, impact, and current challenges.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the author\'s purpose in the final sentence?', correct: 'To highlight a modern consequence that complicates the success story', w1: 'To argue we should stop using antibiotics', w2: 'To praise Fleming\'s work', w3: 'To describe how antibiotics work', exp: 'The ending introduces a complication, showing the story is not entirely positive.', cat: 'ela.reading.authors_purpose' },
      ],
    },
    {
      text: `The concept of emotional intelligence, popularized by psychologist Daniel Goleman in the 1990s, refers to the ability to recognize, understand, and manage one's own emotions while also being attuned to the emotions of others. Unlike traditional IQ, which measures cognitive abilities like reasoning and memory, emotional intelligence encompasses skills such as empathy, self-awareness, impulse control, and social competence. Research has consistently shown that emotional intelligence is a stronger predictor of success in the workplace than IQ alone. Leaders with high emotional intelligence create more positive work environments, resolve conflicts more effectively, and inspire greater loyalty from their teams. Schools have begun incorporating social-emotional learning (SEL) programs into their curricula, teaching students to identify their feelings, manage stress, and communicate effectively. Studies of these programs show improvements not only in student behavior and mental health but also in academic achievement, suggesting that emotional skills support cognitive growth.`,
      questions: [
        { stem: 'What is the main idea?', correct: 'Emotional intelligence is a crucial skill that impacts success in work and school.', w1: 'IQ is not important.', w2: 'Daniel Goleman invented emotions.', w3: 'Schools should eliminate academic subjects.', exp: 'The passage explains EI, its workplace impact, and school applications.', cat: 'ela.reading.main_idea' },
        { stem: 'How is this passage structured?', correct: 'Definition, evidence of importance, and real-world applications', w1: 'Chronological narrative', w2: 'Compare and contrast only', w3: 'Cause and effect only', exp: 'The passage defines EI, shows evidence, then discusses school implementation.', cat: 'ela.reading.text_structure' },
      ],
    },
    {
      text: `Every winter, millions of monarch butterflies complete one of nature's most extraordinary migrations, traveling up to 3,000 miles from Canada and the northern United States to the oyamel fir forests of central Mexico. No single butterfly completes the entire round trip; instead, it takes multiple generations to travel north in spring, with each generation living only a few weeks. The final generation of summer, however, enters a state called reproductive diapause, living up to eight months to make the long journey south. Scientists are still unraveling how monarchs navigate with such precision, but evidence suggests they use a combination of the sun's position, Earth's magnetic field, and an internal circadian clock. Unfortunately, monarch populations have declined by approximately 80% over the past two decades due to habitat loss, pesticide use, and climate change. Conservation efforts now focus on planting milkweed—the only plant on which monarchs lay their eggs—along migration corridors.`,
      questions: [
        { stem: 'What is the main idea?', correct: 'Monarch butterflies undertake an extraordinary migration that is now threatened.', w1: 'All butterflies migrate to Mexico.', w2: 'Monarchs live for eight months.', w3: 'Milkweed is endangered.', exp: 'The passage describes the migration phenomenon and the threats it faces.', cat: 'ela.reading.main_idea' },
        { stem: 'What is the author\'s purpose?', correct: 'To explain the monarch migration and raise awareness of declining populations', w1: 'To convince readers to plant milkweed', w2: 'To compare monarchs to other butterflies', w3: 'To describe Mexico\'s forests', exp: 'The author informs about the migration and its threats.', cat: 'ela.reading.authors_purpose' },
      ],
    },
  ];

  // Generate questions from passages
  for (const p of passages) {
    for (const pq of p.questions) {
      if (i >= 64) break;
      qs.push(q('ela', pq.cat, d[i++], pq.stem,
        [pq.correct, pq.w1, pq.w2, pq.w3], 0, pq.exp,
        ['Wrong scope of main idea', 'Too narrow or specific'],
        ['reading-comprehension'], ['main-idea', 'reading'],
        p.text));
    }
  }

  // Fill remaining with more main idea questions using additional passages
  const extraPassages: { text: string; stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] = [
    { text: `The Great Pacific Garbage Patch is a massive collection of marine debris in the North Pacific Ocean. Contrary to popular imagination, it is not a solid island of trash but rather a diffuse soup of microplastics spread across an area twice the size of Texas. These tiny plastic fragments, many smaller than a grain of rice, are ingested by marine life at every level of the food chain, from plankton to whales. Recent studies have found microplastics in human blood, raising concerns about potential health effects. While cleanup efforts like The Ocean Cleanup project have made headlines, scientists emphasize that preventing plastic from entering the ocean in the first place is far more effective than trying to remove it afterward. This has led to growing support for policies banning single-use plastics and investing in biodegradable alternatives.`, stem: 'What is the main idea?', correct: 'Ocean plastic pollution is a diffuse, serious problem requiring prevention over cleanup.', w1: 'The garbage patch is a solid island.', w2: 'Cleanup projects have solved the problem.', w3: 'Microplastics only affect fish.', exp: 'The passage corrects misconceptions and argues for prevention.', cat: 'ela.reading.main_idea' },
    { text: `Jazz music emerged in the early 20th century from the African American communities of New Orleans, blending elements of blues, ragtime, and African rhythmic traditions. What distinguished jazz from earlier musical forms was its emphasis on improvisation—musicians were expected not merely to play written notes but to spontaneously create new melodies and harmonies in real time. This improvisational spirit reflected the broader cultural values of individual expression and collective collaboration. As jazz spread northward during the Great Migration, it evolved into numerous subgenres: swing in the 1930s, bebop in the 1940s, cool jazz in the 1950s, and free jazz in the 1960s. Each evolution reflected changing social conditions and artistic ambitions. Today, jazz is recognized worldwide as one of America's greatest cultural contributions, influencing genres from rock to hip-hop.`, stem: 'What is the central idea?', correct: 'Jazz evolved from African American traditions through improvisation and continues to influence music today.', w1: 'Jazz was only popular in New Orleans.', w2: 'Swing was the most important jazz subgenre.', w3: 'Jazz has no influence on modern music.', exp: 'The passage traces jazz from origins through evolution to modern influence.', cat: 'ela.reading.main_idea' },
    { text: `Water scarcity affects more than 2 billion people worldwide, and climate change is expected to worsen the crisis significantly. While much attention focuses on drought-stricken regions like sub-Saharan Africa, water stress is also increasing in developed nations. California has experienced repeated severe droughts, and cities like Cape Town, South Africa, came dangerously close to "Day Zero"—the day when municipal water supplies would run dry. Solutions range from high-tech desalination plants to ancient techniques like rainwater harvesting. Israel has become a world leader in water efficiency, recycling nearly 90% of its wastewater for agricultural use and pioneering drip irrigation technology. Experts agree that addressing water scarcity requires both technological innovation and changes in consumption patterns, as agriculture alone accounts for 70% of global freshwater use.`, stem: 'What is the main idea?', correct: 'Water scarcity is a growing global crisis requiring both technology and behavior change.', w1: 'Only Africa faces water scarcity.', w2: 'Desalination has solved the water crisis.', w3: 'Agriculture uses very little water.', exp: 'The passage describes the scope of the problem and the range of solutions needed.', cat: 'ela.reading.main_idea' },
    { text: `The human microbiome—the trillions of bacteria, viruses, and fungi living in and on our bodies—has emerged as one of the most exciting frontiers in medical research. Far from being mere passengers, these microorganisms play essential roles in digestion, immune function, and even mental health. The gut-brain axis, a communication network between intestinal bacteria and the brain, has been linked to conditions ranging from depression to autism. Studies of identical twins with different health outcomes suggest that the microbiome may explain why genetics alone cannot predict disease. Researchers are now exploring fecal microbiota transplants, probiotics, and dietary interventions to treat conditions from inflammatory bowel disease to allergies. While the science is still young, the microbiome represents a paradigm shift in how we understand human health.`, stem: 'What is the main idea?', correct: 'The human microbiome plays crucial roles in health and is reshaping medical understanding.', w1: 'All bacteria are harmful.', w2: 'The microbiome only affects digestion.', w3: 'Fecal transplants cure all diseases.', exp: 'The passage describes the microbiome\'s wide-ranging importance and research potential.', cat: 'ela.reading.main_idea' },
    { text: `Artificial intelligence is transforming education in ways both promising and concerning. Adaptive learning platforms use AI to personalize instruction, adjusting the difficulty and pace of material based on each student's performance. Early studies suggest these tools can be particularly effective for students who struggle in traditional classroom settings, providing patient, individualized practice. However, critics warn that over-reliance on AI could diminish the human connections that are central to effective teaching. Teachers provide mentorship, emotional support, and the kind of nuanced feedback that algorithms cannot replicate. There are also concerns about data privacy, as AI systems collect vast amounts of information about student behavior and performance. The challenge for educators and policymakers is to harness AI's potential while preserving the irreplaceable elements of human teaching.`, stem: 'What is the main idea?', correct: 'AI in education offers benefits but must be balanced with human teaching.', w1: 'AI should replace all teachers.', w2: 'AI has no role in education.', w3: 'Data privacy is not a concern.', exp: 'The passage presents both benefits and concerns, arguing for balance.', cat: 'ela.reading.main_idea' },
    { text: `The discovery of exoplanets—planets orbiting stars beyond our solar system—has revolutionized astronomy. Since the first confirmed detection in 1995, over 5,000 exoplanets have been identified using methods such as the transit technique, which detects tiny dips in starlight as a planet passes in front of its star. The James Webb Space Telescope, launched in 2021, can analyze the atmospheres of these distant worlds, searching for chemical signatures like water vapor and methane that might indicate habitability. Some of the most exciting discoveries involve planets in the "habitable zone"—the region around a star where temperatures could allow liquid water to exist. While finding life on another planet remains the ultimate goal, even confirming the presence of basic organic molecules would profoundly change humanity's understanding of its place in the universe.`, stem: 'What is the author\'s purpose?', correct: 'To explain how exoplanet discovery is advancing the search for life beyond Earth', w1: 'To argue that alien life definitely exists', w2: 'To describe how telescopes are built', w3: 'To compare our solar system to others', exp: 'The passage informs about exoplanet detection and its implications for finding life.', cat: 'ela.reading.authors_purpose' },
    { text: `Fast fashion—the rapid production of inexpensive clothing that mimics current trends—has transformed the global apparel industry. Brands like Zara and H&M can move a design from concept to store shelf in as little as two weeks, compared to the traditional fashion cycle of six months. While this has made trendy clothing accessible to consumers at all income levels, the environmental and social costs are staggering. The fashion industry is responsible for 10% of global carbon emissions and is the second-largest consumer of water worldwide. Garment workers in developing countries often work in dangerous conditions for wages below the poverty line. A growing "slow fashion" movement encourages consumers to buy fewer, higher-quality pieces, repair clothing instead of discarding it, and support brands committed to ethical production practices.`, stem: 'How is this passage organized?', correct: 'Description of the industry, its negative impacts, and an alternative approach', w1: 'Chronological history of fashion', w2: 'Compare and contrast of two brands', w3: 'Step-by-step process of making clothing', exp: 'The passage describes fast fashion, its costs, then presents slow fashion as an alternative.', cat: 'ela.reading.text_structure' },
    { text: `The placebo effect—when patients improve after receiving an inactive treatment they believe is real medicine—has long puzzled researchers. Recent neuroscience studies have revealed that placebos can trigger genuine physiological changes: the brain releases endorphins and dopamine in response to the expectation of relief, producing measurable reductions in pain, inflammation, and anxiety. Remarkably, studies have shown that placebos can work even when patients know they are receiving a placebo, a phenomenon called "open-label placebo." This has led some researchers to argue that the placebo effect is not about deception but about the therapeutic power of the patient-doctor relationship, the ritual of taking medicine, and the brain's capacity for self-healing. Understanding the placebo effect could lead to treatments that harness the body's natural healing mechanisms alongside conventional medicine.`, stem: 'What is the main idea?', correct: 'The placebo effect involves real physiological changes and could enhance medical treatment.', w1: 'Placebos are just sugar pills with no effect.', w2: 'Doctors should only use placebos.', w3: 'The placebo effect only works through deception.', exp: 'The passage explains that placebos trigger real changes and have therapeutic potential.', cat: 'ela.reading.main_idea' },
    { text: `Indigenous fire management practices, used for thousands of years by Aboriginal Australians, Native Americans, and other indigenous peoples, are gaining recognition as a powerful tool for preventing catastrophic wildfires. These "cultural burns" or "prescribed burns" involve deliberately setting small, controlled fires during cooler months to reduce the buildup of dry vegetation that fuels massive blazes. Unlike the fire suppression policies that dominated Western land management for over a century, indigenous burning works with fire rather than against it, maintaining ecosystem health while reducing wildfire risk. In California, collaborations between fire agencies and tribal communities have shown promising results, with culturally burned areas experiencing significantly less damage during subsequent wildfires. As climate change increases the frequency and intensity of wildfires worldwide, many experts argue that incorporating traditional ecological knowledge into modern fire management is not just wise—it's essential.`, stem: 'What is the author\'s purpose?', correct: 'To advocate for integrating indigenous fire management into modern wildfire prevention', w1: 'To describe how all wildfires start', w2: 'To criticize all Western land management', w3: 'To explain Aboriginal Australian culture', exp: 'The passage argues that indigenous burning practices are effective and should be adopted more widely.', cat: 'ela.reading.authors_purpose' },
    { text: `Neuroplasticity—the brain's ability to reorganize itself by forming new neural connections—has overturned centuries of scientific belief that the adult brain is fixed and unchangeable. Research now shows that the brain continues to adapt throughout life in response to learning, experience, and even injury. Stroke patients who were once told they would never recover lost functions have regained abilities through intensive rehabilitation that exploits neuroplasticity. London taxi drivers, who must memorize the city's complex street layout, have been found to have enlarged hippocampi—the brain region associated with spatial memory. Musicians who practice for years develop thicker cortical areas related to motor control and hearing. These findings have profound implications for education, therapy, and our understanding of human potential, suggesting that with the right stimulation and practice, the brain can continue growing and changing at any age.`, stem: 'What is the main idea?', correct: 'Neuroplasticity shows the brain can change and grow throughout life.', w1: 'Only children\'s brains can change.', w2: 'London taxi drivers are smarter than others.', w3: 'Stroke patients cannot recover.', exp: 'The passage describes evidence that the brain adapts throughout life with significant implications.', cat: 'ela.reading.main_idea' },
  ];

  for (const ep of extraPassages) {
    if (i >= 64) break;
    qs.push(q('ela', ep.cat, d[i++], ep.stem,
      [ep.correct, ep.w1, ep.w2, ep.w3], 0, ep.exp,
      ['Too narrow interpretation', 'Contradicts passage content'],
      ['reading-comprehension'], ['main-idea', 'reading'],
      ep.text));
  }

  // Fill any remaining with text-structure questions
  const tsExtras: { text: string; stem: string; correct: string; w1: string; w2: string; w3: string; exp: string }[] = [
    { text: `Scientists have long debated whether nature or nurture plays a greater role in shaping human behavior. Twin studies provide compelling evidence for the influence of genetics: identical twins raised apart often share remarkable similarities in personality, preferences, and even career choices. However, environmental factors clearly matter too. Children raised in stimulating environments with access to books and educational opportunities tend to score higher on cognitive tests than those from deprived backgrounds. Most researchers now agree that the nature-versus-nurture debate presents a false dichotomy. Genes and environment interact in complex ways, with genes influencing how individuals respond to their environments and environments activating or suppressing genetic tendencies.`, stem: 'How is this passage structured?', correct: 'Presents two sides of a debate then offers a synthesis', w1: 'Problem and solution', w2: 'Chronological', w3: 'Cause and effect only', exp: 'The passage presents nature, then nurture, then synthesizes both.' },
    { text: `The Amazon rainforest produces roughly 20% of the world's oxygen and contains 10% of all known species. However, deforestation has accelerated dramatically, with satellite data showing an area the size of a football field cleared every minute. The causes are primarily economic: cattle ranching, soy farming, and logging generate billions in revenue. Indigenous communities who have served as the forest's most effective guardians for millennia are being displaced. International pressure has led to some protective policies, but enforcement remains inconsistent. Scientists warn that the Amazon is approaching a "tipping point" beyond which the forest could transform into savanna, with catastrophic consequences for global climate patterns.`, stem: 'What text structure does the author use?', correct: 'Description of the problem with causes, stakeholders, and potential consequences', w1: 'Compare and contrast', w2: 'Sequential instructions', w3: 'Question and answer', exp: 'The passage describes a complex problem including causes, affected groups, and warnings.' },
    { text: `Before the invention of the printing press around 1440, books in Europe were copied by hand, primarily by monks in monasteries. A single book could take months to produce, making them extraordinarily expensive and accessible only to the wealthy and the clergy. Johannes Gutenberg's movable type press changed everything. By 1500, an estimated 20 million volumes had been printed across Europe. Literacy rates began to climb as books became affordable. The Protestant Reformation was fueled in part by the mass distribution of Martin Luther's writings. Scientific knowledge spread faster than ever before, contributing to the Renaissance and eventually the Scientific Revolution. The printing press did not merely change how information was distributed—it fundamentally transformed European society, economy, and intellectual life.`, stem: 'What is the author\'s purpose?', correct: 'To explain how the printing press transformed European civilization', w1: 'To describe how books are made', w2: 'To argue that monks were inefficient', w3: 'To compare Gutenberg to modern printers', exp: 'The passage traces the printing press\'s wide-ranging transformative effects.' },
    { text: `Space debris—defunct satellites, spent rocket stages, and fragments from collisions—poses an increasingly serious threat to space operations. NASA currently tracks over 27,000 pieces of orbital debris larger than 10 centimeters, but millions of smaller fragments also orbit Earth at speeds exceeding 17,000 miles per hour. At such velocities, even a paint fleck can damage a spacecraft window. The problem is self-reinforcing: collisions create more debris, which increases the probability of further collisions—a scenario known as the Kessler Syndrome. If left unchecked, cascading collisions could eventually render certain orbits unusable, threatening the satellites that provide GPS, weather forecasting, and telecommunications. Space agencies are now testing debris removal technologies, including nets, harpoons, and lasers, while also developing guidelines for responsible satellite disposal.`, stem: 'What is the main idea?', correct: 'Space debris is a growing threat that could make key orbits unusable without intervention.', w1: 'NASA has solved the debris problem.', w2: 'Only large debris is dangerous.', w3: 'Satellites are no longer needed.', exp: 'The passage describes the debris problem, Kessler Syndrome, and efforts to address it.' },
    { text: `The concept of universal basic income (UBI)—providing every citizen with a regular, unconditional cash payment—has moved from academic thought experiment to serious policy discussion. Finland, Kenya, and several U.S. cities have conducted pilot programs with encouraging results: recipients generally do not stop working, as critics feared, but instead use the funds to invest in education, start small businesses, or provide better care for their families. Proponents argue that UBI could address rising inequality and provide a safety net as automation eliminates traditional jobs. Opponents counter that the cost would be prohibitive and that it could reduce motivation to work. As AI continues to reshape the job market, the debate over UBI is likely to intensify.`, stem: 'How does the author present the topic?', correct: 'Balanced presentation of arguments for and against UBI', w1: 'Entirely in favor of UBI', w2: 'Entirely against UBI', w3: 'Historical narrative only', exp: 'The passage presents both proponents\' and opponents\' views fairly.' },
  ];

  for (const ts of tsExtras) {
    if (i >= 64) break;
    qs.push(q('ela', ts.stem.includes('purpose') ? 'ela.reading.authors_purpose' : 'ela.reading.text_structure', d[i++], ts.stem,
      [ts.correct, ts.w1, ts.w2, ts.w3], 0, ts.exp,
      ['Misidentified structure', 'Too specific'],
      ['reading-comprehension'], ['main-idea', 'text-structure'],
      ts.text));
  }

  return qs.slice(0, 64);
}

// ============ ELA-INFERENCE (66) ============
function elaInference(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(66);
  let i = 0;

  const inferencePassages: { text: string; questions: { stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] }[] = [
    {
      text: `Marcus stared at the acceptance letter, reading it for the third time. His mother stood in the doorway, her eyes glistening. "I always knew," she whispered. Marcus carefully folded the letter and placed it on the kitchen table, next to the stack of bills his mother had been sorting through. He picked up the brochure that had come with the letter—glossy photos of tree-lined walkways and modern buildings—and turned it over to the financial aid section. The numbers there told a different story than the congratulations on the front. His mother put her hand on his shoulder. "We'll figure it out," she said, though her voice wavered. Marcus nodded, but he was already thinking about the community college pamphlet in his backpack.`,
      questions: [
        { stem: 'What can you infer about Marcus\'s family?', correct: 'They are facing financial difficulties.', w1: 'They are wealthy.', w2: 'They don\'t care about education.', w3: 'They are angry about the letter.', exp: 'The stack of bills and concern about financial aid suggest financial struggle.', cat: 'ela.reading.inference' },
        { stem: 'Which evidence best supports Marcus\'s internal conflict?', correct: 'He was already thinking about the community college pamphlet in his backpack.', w1: 'He read the letter three times.', w2: 'His mother stood in the doorway.', w3: 'He folded the letter carefully.', exp: 'The community college pamphlet shows he\'s considering a cheaper alternative despite being accepted.', cat: 'ela.reading.best_evidence' },
        { stem: 'What claim does this passage best support?', correct: 'Financial barriers can limit educational choices even for qualified students.', w1: 'Community college is better than university.', w2: 'Parents should pay for college.', w3: 'Acceptance letters are meaningless.', exp: 'Marcus was accepted but financial concerns push him toward a cheaper option.', cat: 'ela.reading.claim_evidence' },
      ],
    },
    {
      text: `The town council meeting was tense. For two hours, residents had debated whether to approve a proposal from GreenTech Industries to build a solar panel manufacturing plant on 200 acres of farmland at the edge of town. Supporters pointed to the 500 jobs the plant would create and the tax revenue that could fund a new school. Opponents, many of them farmers, argued that the town's character would change forever and that the traffic alone would overwhelm their two-lane roads. Sarah Chen, a high school teacher who had lived in town her whole life, stood to speak last. "I've watched three of my best students leave this town after graduation because there were no jobs for them here," she said quietly. "I'd like to give the next generation a reason to stay."`,
      questions: [
        { stem: 'What can you infer about the town\'s economy?', correct: 'The town lacks sufficient employment opportunities for young people.', w1: 'The town is very wealthy.', w2: 'Everyone in town is a farmer.', w3: 'The town has too many factories.', exp: 'Sarah\'s comment about students leaving for lack of jobs indicates economic stagnation.', cat: 'ela.reading.inference' },
        { stem: 'Which is the best evidence that the town is divided on this issue?', correct: 'For two hours, residents had debated the proposal.', w1: 'Sarah Chen is a high school teacher.', w2: 'The plant would create 500 jobs.', w3: 'GreenTech Industries builds solar panels.', exp: 'The length and nature of the debate directly show division.', cat: 'ela.reading.best_evidence' },
        { stem: 'What claim does Sarah\'s statement best support?', correct: 'Economic development is necessary to retain young residents.', w1: 'All students should stay in their hometown.', w2: 'Teaching is an underpaid profession.', w3: 'Solar panels are the future of energy.', exp: 'Sarah connects job creation to keeping young people in town.', cat: 'ela.reading.claim_evidence' },
      ],
    },
    {
      text: `Dr. Amara leaned back in her chair and rubbed her temples. The data on her screen didn't lie, but she wished it did. Three years of research, two grant renewals, and her team's findings contradicted their original hypothesis entirely. The protein they had believed would inhibit tumor growth appeared, in their latest trial, to actually accelerate it under certain conditions. She could already imagine the review board's reaction. Some researchers, she knew, might be tempted to bury such results—to focus only on the trials that supported their expectations. But Dr. Amara opened a new document and began typing: "Our findings challenge the prevailing assumption..." She would publish the truth. Science, she reminded herself, progresses not by confirming what we want to believe, but by honestly reporting what we find.`,
      questions: [
        { stem: 'What can you infer about Dr. Amara\'s character?', correct: 'She values scientific integrity over personal career interests.', w1: 'She is incompetent at research.', w2: 'She wants to destroy other scientists\' work.', w3: 'She doesn\'t care about her findings.', exp: 'She chooses to publish contradictory results honestly despite the career risk.', cat: 'ela.reading.inference' },
        { stem: 'Which sentence best supports the claim that publishing honest results takes courage?', correct: '"She could already imagine the review board\'s reaction."', w1: '"Dr. Amara leaned back in her chair."', w2: '"Three years of research, two grant renewals."', w3: '"She opened a new document."', exp: 'Anticipating negative reactions shows she understands the personal cost.', cat: 'ela.reading.best_evidence' },
        { stem: 'Which claim is best supported by this passage?', correct: 'Scientific progress requires honest reporting even when results are disappointing.', w1: 'All scientific hypotheses are wrong.', w2: 'Grant funding corrupts research.', w3: 'Protein research is a waste of time.', exp: 'The passage explicitly connects honest reporting to scientific progress.', cat: 'ela.reading.claim_evidence' },
      ],
    },
    {
      text: `The old lighthouse had been dark for fifteen years when Maya first climbed its spiral staircase. Cobwebs draped across the railing like lace curtains, and each step groaned under her weight. At the top, the great lens was clouded with salt and grime, but when Maya wiped a section clean with her sleeve, the afternoon sun caught the glass and sent a rainbow dancing across the wall. She pulled out her notebook and began sketching. The town below had changed since the lighthouse was decommissioned—condos where fishing shacks had stood, a marina full of sailboats instead of trawlers. But from up here, if she squinted, she could almost see the town her grandmother had described in her stories. Maya closed her notebook and descended the stairs. She had a proposal to write.`,
      questions: [
        { stem: 'What can you infer Maya plans to do?', correct: 'She plans to propose restoring or preserving the lighthouse.', w1: 'She plans to demolish the lighthouse.', w2: 'She is writing a school essay.', w3: 'She wants to buy a condo.', exp: 'Her exploration, sketching, and "proposal to write" suggest restoration/preservation plans.', cat: 'ela.reading.inference' },
        { stem: 'Which detail best supports the inference that the town has changed significantly?', correct: '"Condos where fishing shacks had stood, a marina full of sailboats instead of trawlers."', w1: '"Cobwebs draped across the railing."', w2: '"She pulled out her notebook."', w3: '"The afternoon sun caught the glass."', exp: 'The direct comparison of old fishing structures to new luxury ones shows change.', cat: 'ela.reading.best_evidence' },
      ],
    },
    {
      text: `When the school board announced budget cuts that would eliminate the arts program, nobody expected the response that followed. Within a week, a petition with 3,000 signatures appeared. Local businesses offered to sponsor art supplies. A retired art teacher volunteered to teach classes for free. The student newspaper published an editorial pointing out that students in arts programs had higher GPAs and lower dropout rates than those without. At the next board meeting, the room was standing-room only. Student after student stood to testify: the shy girl who found her voice through theater, the struggling reader who discovered graphic novels, the at-risk teen who channeled his anger into painting instead of fights. Board member Tom Richardson, who had initially supported the cuts, was seen wiping his eyes during one testimony. The board voted unanimously to restore funding.`,
      questions: [
        { stem: 'What can you infer about the community\'s values?', correct: 'The community deeply values arts education and civic engagement.', w1: 'The community doesn\'t care about education.', w2: 'Only students opposed the cuts.', w3: 'The school board ignored public opinion.', exp: 'The widespread, diverse community response shows shared values around arts and participation.', cat: 'ela.reading.inference' },
        { stem: 'Which evidence best supports that arts programs have practical benefits?', correct: 'Students in arts programs had higher GPAs and lower dropout rates.', w1: '3,000 signatures appeared on a petition.', w2: 'The board voted unanimously.', w3: 'Tom Richardson wiped his eyes.', exp: 'GPA and dropout statistics provide concrete, measurable evidence of benefits.', cat: 'ela.reading.best_evidence' },
        { stem: 'What claim does this passage support?', correct: 'Community advocacy can reverse harmful policy decisions.', w1: 'School boards always make bad decisions.', w2: 'Art is more important than math.', w3: 'Budget cuts are never necessary.', exp: 'The community organized and successfully reversed the cuts.', cat: 'ela.reading.claim_evidence' },
      ],
    },
  ];

  for (const p of inferencePassages) {
    for (const pq of p.questions) {
      if (i >= 66) break;
      qs.push(q('ela', pq.cat, d[i++], pq.stem,
        [pq.correct, pq.w1, pq.w2, pq.w3], 0, pq.exp,
        ['Not supported by evidence', 'Too broad or specific'],
        ['reading-comprehension', 'inference'], ['inference', 'reading'],
        p.text));
    }
  }

  // Additional inference passages to reach 66
  const moreInf: { text: string; stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] = [
    { text: `The cafeteria fell silent when Kenji walked in wearing the rival school's jersey. His teammates at the lunch table exchanged glances. Kenji sat down as if nothing was wrong and opened his lunch. "Bet's a bet," he said with a shrug. His best friend Darius burst out laughing, and soon the whole table joined in. "Man, you should never have bet against their quarterback," Darius said. Kenji grinned. "Lesson learned."`, stem: 'Why is Kenji wearing the rival jersey?', correct: 'He lost a bet and had to wear it as a consequence.', w1: 'He transferred to the rival school.', w2: 'He doesn\'t like his own team.', w3: 'It was school spirit day.', exp: '"Bet\'s a bet" and Darius\'s comment about the quarterback confirm he lost a bet.', cat: 'ela.reading.inference' },
    { text: `The email from the CEO was only two sentences long. "Effective immediately, all departments will reduce headcount by 15%. Department heads will submit their plans by Friday." Jennifer read it twice, then looked at the photos on her desk—her team at last year's holiday party, all smiling. She had hired most of them herself. She pulled up the company directory and began scrolling through names, her stomach in knots.`, stem: 'What task is Jennifer facing?', correct: 'She must decide which employees to lay off.', w1: 'She is planning a party.', w2: 'She is hiring new employees.', w3: 'She is updating the company directory.', exp: 'The 15% headcount reduction and her scrolling through names with dread indicate layoffs.', cat: 'ela.reading.inference' },
    { text: `The river had risen six inches overnight. Old Tom checked the marks on the wooden post by the bridge—marks he'd been carving for forty years. The water was higher now than the flood of '97. He walked to the general store and bought extra sandbags without being asked. By noon, three other families had followed his lead.`, stem: 'What can you infer about Old Tom?', correct: 'He is experienced with floods and trusted by the community.', w1: 'He is afraid of water.', w2: 'He just moved to the area.', w3: 'He owns the general store.', exp: 'Forty years of markings and others following his lead show experience and trust.', cat: 'ela.reading.inference' },
    { text: `"Your essay shows improvement," Ms. Torres said carefully, sliding the paper across her desk. Aiden picked it up and saw the grade: C+. Three months ago, he would have crumpled it up. Instead, he looked at Ms. Torres's comments in the margins—precise suggestions circled in green ink—and nodded. "I'll revise it," he said. Ms. Torres smiled. "That's exactly what I was hoping to hear."`, stem: 'What can you infer about Aiden\'s growth?', correct: 'He has developed a more mature approach to academic feedback.', w1: 'He has always been a good student.', w2: 'He doesn\'t care about his grade.', w3: 'Ms. Torres gives unfair grades.', exp: 'The contrast with "three months ago" and his willingness to revise show growth.', cat: 'ela.reading.inference' },
    { text: `The documentary had just finished when Priya turned to her roommate. "Did you know they use that much water for a single hamburger?" she asked. Her roommate shrugged and went back to scrolling on her phone. That night, Priya went through the fridge and threw out three packages of ground beef. She opened her laptop and searched "vegetarian meal plans for beginners." By the end of the week, she had shared four articles about water conservation on social media and signed up for a community garden.`, stem: 'What inference can you make about Priya?', correct: 'The documentary motivated her to change her habits and raise awareness.', w1: 'She has always been vegetarian.', w2: 'She doesn\'t like her roommate.', w3: 'She is a professional environmentalist.', exp: 'The sequence of actions following the documentary shows it catalyzed behavioral change.', cat: 'ela.reading.inference' },
    { text: `Coach Rivera posted the varsity roster outside the gym at 3:15 p.m. By 3:20, a crowd had gathered. Some players high-fived and whooped. Others walked away quickly, heads down. Tyler found his name on the list and exhaled—he hadn't realized he'd been holding his breath. Then he saw that his twin brother Jake's name was absent. Tyler's celebration died on his lips. He found Jake in the parking lot, sitting in their shared car with the engine running.`, stem: 'Which evidence best shows Tyler\'s emotional conflict?', correct: '"Tyler\'s celebration died on his lips."', w1: '"He hadn\'t realized he\'d been holding his breath."', w2: '"Some players high-fived and whooped."', w3: '"Jake was sitting in their shared car."', exp: 'This moment captures the shift from joy to guilt/sadness upon seeing Jake didn\'t make it.', cat: 'ela.reading.best_evidence' },
    { text: `The city council approved the new highway extension by a vote of 7-2. Councilwoman Diaz, who voted against it, released a statement: "This route will displace 200 families from the historically Black neighborhood of Oakwood, the same community that lost its elementary school to 'urban renewal' in 1968 and its community center to a parking garage in 1995. At what point do we acknowledge the pattern?" The council's response noted that affected residents would receive "fair market value" for their homes and access to relocation assistance.`, stem: 'What claim does Councilwoman Diaz\'s statement support?', correct: 'The Oakwood community has been repeatedly harmed by development decisions.', w1: 'Highway extensions always displace people.', w2: 'The council made the right decision.', w3: 'Fair market value is always adequate.', exp: 'She cites three instances of the same community losing resources to development.', cat: 'ela.reading.claim_evidence' },
    { text: `The farmer's market was barely surviving when Lin proposed selling prepared foods alongside produce. "People don't just want ingredients anymore," she argued at the vendor meeting. "They want someone to show them what to do with a rutabaga." Some vendors scoffed, but within a month of Lin's taco stand opening—using ingredients sourced entirely from the other market vendors—foot traffic doubled. Now six vendors offer prepared foods, and the waiting list for vendor spots has twelve names on it.`, stem: 'What inference is best supported?', correct: 'Prepared food attracts more customers and benefits all vendors.', w1: 'People don\'t like raw produce.', w2: 'Lin\'s tacos are the best food at the market.', w3: 'The market should only sell prepared food.', exp: 'The doubling of foot traffic and long waitlist directly follow the prepared food addition.', cat: 'ela.reading.inference' },
    { text: `Grandpa's hands shook as he threaded the fishing line, something he used to do without even looking. Maya watched him from the bow of the boat but didn't offer to help. She had learned that lesson last summer. Instead she asked, "Tell me again about the catfish that broke your rod." His hands steadied as he began the story, and by the time he got to the part about falling into the lake, the line was perfectly threaded. Maya smiled to herself.`, stem: 'Why doesn\'t Maya offer to help?', correct: 'She knows her grandfather values his independence and the distraction helps him.', w1: 'She doesn\'t know how to help.', w2: 'She is angry at him.', w3: 'She thinks it\'s funny.', exp: '"She had learned that lesson" and using a story as distraction show understanding.', cat: 'ela.reading.inference' },
    { text: `The research team published two papers from the same study. The first, in a prestigious journal, emphasized that the new drug reduced symptoms by 15% compared to placebo. The second paper, published in a smaller journal, reported that 60% of participants experienced no improvement whatsoever and that the 15% improvement was driven almost entirely by a small subgroup of patients with a specific genetic marker. Both papers were technically accurate. Neither was dishonest. But a doctor reading only the first paper would have a very different understanding than one who read both.`, stem: 'What claim does this passage support?', correct: 'Selective presentation of accurate data can create misleading impressions.', w1: 'The drug is effective for everyone.', w2: 'The researchers committed fraud.', w3: 'Prestigious journals are always wrong.', exp: 'Both papers are truthful but selective; together they give a fuller, different picture.', cat: 'ela.reading.claim_evidence' },
    { text: `Before dawn, Maria laced up her running shoes in the dark apartment, careful not to wake her children. The half-marathon was in three weeks. She had started training six months ago, after the doctor showed her the blood work results. At first, she could barely run a block. Now she was up to eight miles. The medals from her daughter's soccer tournament clinked softly on the refrigerator as Maria opened it for a water bottle. She paused, looking at them. Then she grabbed a sticky note and wrote: "Mom's going to get a medal too." She stuck it to the fridge and headed out the door.`, stem: 'Why did Maria start running?', correct: 'Concerning health results motivated her to become more active.', w1: 'She has always been a runner.', w2: 'She wants to compete professionally.', w3: 'Her daughter encouraged her.', exp: 'Training started after the doctor showed her blood work results, implying health concerns.', cat: 'ela.reading.inference' },
    { text: `The school implemented a new cell phone policy: all devices locked in pouches during the school day. Teachers reported that class discussions became richer and more sustained. Several students who had been labeled as "disengaged" began participating for the first time. However, parents flooded the main office with complaints about not being able to reach their children during emergencies. One parent pointed out that during last year's lockdown drill, students had used their phones to text parents their location and status. The principal acknowledged the concern but noted that overall academic performance had improved measurably in the first month.`, stem: 'Which evidence best supports the claim that the policy improved learning?', correct: 'Several students who had been labeled as "disengaged" began participating for the first time.', w1: 'Parents flooded the main office with complaints.', w2: 'Students texted parents during the lockdown drill.', w3: 'The policy locked devices in pouches.', exp: 'Previously disengaged students participating is direct evidence of improved learning engagement.', cat: 'ela.reading.best_evidence' },
    { text: `In the weeks after the factory closed, the diner on Main Street noticed something unexpected. Instead of emptying out, the lunch counter was busier than ever. People who used to grab a sandwich and rush back to their shift now lingered over coffee, talking in low voices. The help-wanted section of the newspaper, once ignored, was passed from hand to hand. Someone started a board near the door where people could post odd jobs. "Need a fence painted—$50." "Babysitter available weekdays." The diner owner stopped charging for coffee refills.`, stem: 'What can you infer about the community\'s response to the factory closing?', correct: 'The community is coming together to support each other through economic hardship.', w1: 'People are happy the factory closed.', w2: 'The diner is making more money.', w3: 'No one is looking for work.', exp: 'Job boards, sharing newspapers, and free refills show mutual support during difficulty.', cat: 'ela.reading.inference' },
  ];

  for (const mi of moreInf) {
    if (i >= 66) break;
    qs.push(q('ela', mi.cat, d[i++], mi.stem,
      [mi.correct, mi.w1, mi.w2, mi.w3], 0, mi.exp,
      ['Not supported by passage', 'Too literal or narrow'],
      ['reading-comprehension', 'inference'], ['inference', 'reading'],
      mi.text));
  }

  // Fill remaining if needed with additional questions
  const fillInf: { text: string; stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] = [
    { text: `The museum exhibit featured a single photograph: a girl no older than ten standing in rubble, holding a teddy bear. Beneath it, a small placard read: "Aleppo, 2016." No other explanation was needed. Visitors stood before it in silence, some for several minutes. A guest book nearby was filled with messages in dozens of languages. The museum director later said it was the most impactful exhibit they had ever displayed, despite—or perhaps because of—its simplicity.`, stem: 'What can you infer about the exhibit\'s effect?', correct: 'The image powerfully conveyed the human cost of conflict without needing words.', w1: 'Visitors didn\'t understand the photograph.', w2: 'The museum normally shows complex exhibits.', w3: 'The teddy bear was the focus of the exhibit.', exp: 'Silence, lingering, and multilingual responses all indicate deep emotional impact.', cat: 'ela.reading.inference' },
    { text: `The first draft of Amira's college essay began: "I have always wanted to be a doctor." Her guidance counselor read it and asked, "Is that really true?" Amira thought about it. She remembered being five, wrapping bandages around her stuffed animals. But she also remembered being twelve and wanting to be an astronaut, and fifteen and dreaming of becoming a journalist. Her counselor suggested starting over. The final draft began: "I have wanted to be many things, and each one taught me something about who I actually am."`, stem: 'What does the revision reveal about Amira?', correct: 'She gained self-awareness and embraced her complex journey.', w1: 'She decided not to be a doctor.', w2: 'Her counselor wrote the essay for her.', w3: 'She doesn\'t know what she wants.', exp: 'The revised opening shows growth and honest self-reflection rather than a simple narrative.', cat: 'ela.reading.inference' },
    { text: `Two weeks after the election, yard signs still dotted the neighborhood—some for Martinez, some for Park. At the block party, which almost didn't happen this year, neighbors who had argued passionately online stood awkwardly with paper plates. It was seven-year-old Lily who broke the tension, running between the tables and asking every adult the same question: "Do you want to see my cartwheel?" By the time the streetlights came on, someone had started a kickball game, and the yard signs seemed a little less important.`, stem: 'What theme does this passage suggest?', correct: 'Human connection and community can transcend political divisions.', w1: 'Children should vote in elections.', w2: 'Block parties are always fun.', w3: 'People should remove yard signs quickly.', exp: 'Lily\'s innocent action and the resulting community activity show connection overcoming division.', cat: 'ela.reading.inference' },
    { text: `The bookstore had been in the family for three generations. When the owner, Mr. Patel, finally posted the "Closing Sale" sign, a line formed before opening. But the customers who came weren't looking for bargains—they brought photographs of themselves as children in the store, reading corners they'd claimed as their own, books that had changed their lives. Several people cried. One woman brought her own daughter, who was the same age she'd been in her favorite photo. Mr. Patel had planned to close in a week. It took a month to empty the shelves, because he kept stopping to listen to stories.`, stem: 'What can you infer about the bookstore\'s role?', correct: 'It served as a meaningful community gathering place beyond just selling books.', w1: 'It was only a business.', w2: 'Nobody bought books there.', w3: 'Mr. Patel wanted to close sooner.', exp: 'People bringing photos and stories, emotional responses, and lingering closings show deep community bonds.', cat: 'ela.reading.inference' },
    { text: `The debate tournament results were posted at 4:00 p.m. Lincoln High had placed second—again. Captain Janelle Walker gathered her team. "Second place means we were the best team that lost," she said. A few teammates laughed weakly. "But here's what I noticed today," she continued. "Every single one of you recovered from a tough cross-examination. Last year, one bad question would rattle us for the whole round. That's growth. And growth beats a trophy." She paused. "We'll get the trophy next year. But today, I'm proud."`, stem: 'What can you infer about Janelle as a leader?', correct: 'She focuses on growth and morale rather than just outcomes.', w1: 'She doesn\'t care about winning.', w2: 'She is disappointed in her team.', w3: 'She plans to quit the team.', exp: 'Her speech reframes second place as progress, showing emotional intelligence and leadership.', cat: 'ela.reading.inference' },
  ];

  for (const fi of fillInf) {
    if (i >= 66) break;
    qs.push(q('ela', fi.cat, d[i++], fi.stem,
      [fi.correct, fi.w1, fi.w2, fi.w3], 0, fi.exp,
      ['Not supported by text', 'Overly literal reading'],
      ['reading-comprehension', 'inference'], ['inference', 'reading'],
      fi.text));
  }

  return qs.slice(0, 66);
}

// ============ ELA-LITERARY (65) ============
function elaLiterary(): Question[] {
  const qs: Question[] = [];
  const d = diffMix(65);
  let i = 0;

  const litPassages: { text: string; questions: { stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] }[] = [
    {
      text: `The sunset painted the sky in shades of amber and crimson, as if the heavens themselves were on fire. Elena stood at the edge of the cliff, her hair whipping in the wind like dark ribbons. Below, the waves crashed against the rocks with the fury of a caged animal. She had come here every evening since her mother's passing, drawn by some invisible thread to this place where earth met sky met sea. The lighthouse behind her cast its steady beam across the water—patient, reliable, unchanging—everything her world no longer was. "I miss you," she whispered, and the wind carried her words out to sea, mixing them with the salt spray until they became part of the ocean itself.`,
      questions: [
        { stem: 'What literary device is used in "the waves crashed against the rocks with the fury of a caged animal"?', correct: 'Simile', w1: 'Metaphor', w2: 'Personification', w3: 'Alliteration', exp: 'The comparison uses "with the fury of" (like) to compare waves to a caged animal.', cat: 'ela.reading.figurative_language' },
        { stem: 'What is the overall tone of this passage?', correct: 'Melancholic and reflective', w1: 'Angry and bitter', w2: 'Joyful and celebratory', w3: 'Suspenseful and tense', exp: 'Grief, repeated visits, and the quiet whisper create a melancholic, reflective mood.', cat: 'ela.reading.tone_mood' },
        { stem: 'What does the lighthouse most likely symbolize?', correct: 'Stability and constancy in a changed world', w1: 'Danger and warning', w2: 'Elena\'s mother', w3: 'The power of nature', exp: 'The lighthouse is described as "patient, reliable, unchanging"—contrasting Elena\'s disrupted life.', cat: 'ela.reading.figurative_language' },
      ],
    },
    {
      text: `James kept his head down in the hallway, navigating the sea of backpacks and conversation with practiced invisibility. He had perfected the art of being unremarkable: gray clothes, neutral expression, always moving at exactly the speed of the crowd. It had taken him years to learn that in middle school, the safest place was the middle—not too smart, not too loud, not too anything. But in Ms. Rivera's creative writing class, something shifted. She had asked them to write about a moment that changed them, and James found himself writing about the night his father left. The words came like water from a broken dam, unstoppable and surprising even to himself. When Ms. Rivera asked if anyone wanted to share, James's hand rose before his brain could stop it.`,
      questions: [
        { stem: 'What does "navigating the sea of backpacks" represent?', correct: 'A metaphor comparing the crowded hallway to an ocean', w1: 'An actual sea', w2: 'A simile comparing students to fish', w3: 'Hyperbole about too many backpacks', exp: '"Sea of backpacks" is a metaphor — direct comparison without "like" or "as."', cat: 'ela.reading.figurative_language' },
        { stem: 'How does James change over the course of the passage?', correct: 'He moves from deliberate invisibility to unexpected vulnerability and self-expression.', w1: 'He becomes more popular.', w2: 'He gets in trouble.', w3: 'He decides to leave school.', exp: 'He goes from hiding to voluntarily sharing deeply personal writing.', cat: 'ela.reading.plot_character' },
        { stem: 'What does "the words came like water from a broken dam" suggest?', correct: 'His suppressed emotions finally found an outlet and poured out uncontrollably.', w1: 'He was writing about water.', w2: 'His writing was messy.', w3: 'He didn\'t like writing.', exp: 'The simile compares long-held emotions to water pressure released suddenly.', cat: 'ela.reading.figurative_language' },
        { stem: 'What is the tone of the final sentence?', correct: 'A mix of surprise and courage', w1: 'Anger and frustration', w2: 'Boredom and indifference', w3: 'Fear and panic', exp: '"Before his brain could stop it" shows his action surprised even himself—impulsive bravery.', cat: 'ela.reading.tone_mood' },
      ],
    },
    {
      text: `The old house crouched at the end of Maple Street like a tired watchman, its windows dark and hollow. Ivy had claimed the east wall entirely, and the porch sagged in the middle like a frown. Neighbors walked past quickly, crossing to the other side of the street. Children dared each other to touch the gate but never went further. Inside, however, the house kept its secrets well. Behind the peeling wallpaper, someone had painted a mural of a garden in full bloom—roses, sunflowers, butterflies frozen mid-flight. In the attic, boxes of love letters tied with silk ribbon sat beside a violin that, despite years of neglect, still held its tune. The house was not haunted by ghosts but by the memory of a life fully lived.`,
      questions: [
        { stem: 'What literary device is "The old house crouched... like a tired watchman"?', correct: 'Simile with personification', w1: 'Onomatopoeia', w2: 'Hyperbole', w3: 'Alliteration', exp: '"Crouched" personifies the house, and "like a tired watchman" makes it a simile.', cat: 'ela.reading.figurative_language' },
        { stem: 'What is the mood shift in this passage?', correct: 'From eerie and foreboding to warm and nostalgic', w1: 'From happy to sad', w2: 'From calm to terrifying', w3: 'From boring to exciting', exp: 'The exterior is dark/hollow; the interior reveals beauty and love.', cat: 'ela.reading.tone_mood' },
        { stem: 'What does "the house was not haunted by ghosts but by the memory of a life fully lived" mean?', correct: 'The house holds traces of a rich, meaningful past rather than supernatural presence.', w1: 'There are no ghosts in the house.', w2: 'Someone still lives there.', w3: 'The house should be demolished.', exp: 'The contrast between "ghosts" and "memory of a life fully lived" reframes "haunted" as filled with meaningful history.', cat: 'ela.reading.figurative_language' },
      ],
    },
    {
      text: `Dr. Chen stared at the equation on the whiteboard, her marker hovering in midair. The solution was elegant—almost too elegant. She had been working on this problem for eleven years, through two universities, one divorce, and countless sleepless nights. Her graduate students had come and gone, each contributing a small piece. Now, standing alone in the lab at 2 a.m., she could see how all the pieces fit together. She should have felt triumphant. Instead, she felt something closer to grief. The problem had been her constant companion, her North Star. Solving it meant losing the thing that had defined her for over a decade. She capped the marker and sat down heavily. Tomorrow she would celebrate. Tonight, she would mourn.`,
      questions: [
        { stem: 'What does "North Star" mean in this context?', correct: 'A guiding purpose that gave direction to her life and work', w1: 'A literal star she observed', w2: 'Her university\'s name', w3: 'A type of equation', exp: '"North Star" metaphorically represents guidance and constant direction.', cat: 'ela.reading.vocabulary_in_context' },
        { stem: 'Which best describes Dr. Chen\'s emotional complexity?', correct: 'She feels both accomplishment and loss simultaneously.', w1: 'She is purely happy.', w2: 'She is angry at her students.', w3: 'She regrets her career choice.', exp: 'She recognizes triumph but grieves losing her defining purpose.', cat: 'ela.reading.plot_character' },
        { stem: 'What is the tone of the final two sentences?', correct: 'Bittersweet and contemplative', w1: 'Angry and resentful', w2: 'Excited and energetic', w3: 'Confused and uncertain', exp: '"Celebrate" vs. "mourn" captures the bittersweet nature of her achievement.', cat: 'ela.reading.tone_mood' },
      ],
    },
  ];

  for (const p of litPassages) {
    for (const pq of p.questions) {
      if (i >= 65) break;
      qs.push(q('ela', pq.cat, d[i++], pq.stem,
        [pq.correct, pq.w1, pq.w2, pq.w3], 0, pq.exp,
        ['Misidentified device', 'Too literal interpretation'],
        ['literary-analysis'], ['literary', 'reading'],
        p.text));
    }
  }

  // More literary questions
  const moreLit: { text: string; stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] = [
    { text: `The snow blanketed the town in silence, muffling footsteps and conversations alike. Mrs. Patterson watched from her window as children built a snowman in the park, their laughter the only sound that dared to break through the white quiet. She pressed her hand against the cold glass. Somewhere inside her, a memory stirred—herself at that age, in that same park, reaching up to place a carrot nose on a snowman while her father steadied her. The memory was warm, impossibly warm, like holding a cup of tea on a winter morning.`, stem: 'What literary device is "the memory was warm... like holding a cup of tea"?', correct: 'Simile', w1: 'Metaphor', w2: 'Personification', w3: 'Irony', exp: '"Like" signals a simile comparing the warmth of memory to tea.', cat: 'ela.reading.figurative_language' },
    { text: `The courtroom was a theater, and every person in it played a role. The judge sat high on her bench like a queen on a throne, dispensing justice with measured words. The lawyers performed for the jury, their voices rising and falling with practiced emotion. Even the defendant wore his innocence like a costume, carefully buttoned and pressed. Only the victim's mother, sitting in the back row, seemed real. Her pain needed no script.`, stem: 'What extended metaphor structures this passage?', correct: 'The courtroom as a theater/performance', w1: 'Justice as a scale', w2: 'Law as a game', w3: 'The courtroom as a school', exp: 'Theater, roles, performed, costume, and script all extend the metaphor.', cat: 'ela.reading.figurative_language' },
    { text: `Autumn arrived like an uninvited guest, stripping the trees bare and scattering leaves across lawns with careless abandon. The garden that had bloomed so proudly in June now stood skeletal, its flowers reduced to brittle stems. Yet there was beauty in the decay—the way the light filtered golden through the remaining leaves, the satisfying crunch of frost-covered grass underfoot, the sharp clarity of the air that made everything seem more vivid, more real.`, stem: 'What is the mood of this passage?', correct: 'Wistful yet appreciative of beauty in change', w1: 'Purely depressing', w2: 'Excited and joyful', w3: 'Angry and resentful', exp: 'While noting decay, the passage finds beauty—creating a wistful, appreciative tone.', cat: 'ela.reading.tone_mood' },
    { text: `When I was young, my grandmother's kitchen was the center of the universe. Every surface held a jar or a bowl, ingredients for something always in progress. The air was thick with cumin and garlic, and the radio played scratchy boleros that my grandmother sang along to, never quite hitting the right notes but never caring. I would sit on the counter, my legs swinging, watching her hands move with the confidence of someone who had made this meal a thousand times. "Taste," she would say, holding out a wooden spoon. Everything she made tasted like love—which, I realize now, is not a flavor but a feeling.`, stem: 'What does "tasted like love" mean in context?', correct: 'The food evoked feelings of warmth, care, and belonging', w1: 'Love has a specific taste', w2: 'The food was very sweet', w3: 'The grandmother was a professional chef', exp: 'The narrator explains it\'s "not a flavor but a feeling"—connecting food to emotional warmth.', cat: 'ela.reading.vocabulary_in_context' },
    { text: `Marcus didn't speak for the first three weeks at his new school. Teachers mistook his silence for shyness or defiance, but it was neither. He was listening. He was mapping the social terrain the way a surveyor maps land before building—noting the fault lines between groups, the unspoken rules, the power dynamics that shifted between classes and lunch periods. By the fourth week, when he finally spoke, he knew exactly who to befriend and who to avoid. His first words in English class were a joke that made even the teacher laugh. No one suspected it had been rehearsed.`, stem: 'How would you describe Marcus as a character?', correct: 'Strategic and observant, carefully calculating his social approach', w1: 'Shy and fearful', w2: 'Defiant and rebellious', w3: 'Naturally funny and carefree', exp: 'His deliberate observation, mapping, and rehearsed joke reveal strategic intelligence.', cat: 'ela.reading.plot_character' },
    { text: `The letter arrived on a Tuesday, which seemed wrong somehow. Life-changing news should arrive on a more significant day—a Monday, perhaps, to start a new chapter, or a Friday, to give you the weekend to absorb it. But Tuesday it was, sandwiched between junk mail and a water bill, as if the universe wanted to remind her that the extraordinary and the ordinary share the same mailbox.`, stem: 'What literary device does the narrator use by commenting on the day?', correct: 'Irony—the contrast between the mundane day and life-changing content', w1: 'Foreshadowing', w2: 'Flashback', w3: 'Onomatopoeia', exp: 'The unexpected ordinariness of Tuesday for momentous news creates situational irony.', cat: 'ela.reading.figurative_language' },
    { text: `The championship trophy sat on Coach Williams's desk, collecting dust. He never polished it, never moved it to the display case in the hallway where the principal wanted it. Instead, he kept it next to a framed photograph of his team—not the championship team, but the team from two years before, the one that went 2-8. "That team taught me more about coaching than any trophy ever could," he told anyone who asked. In the photo, the players were laughing, arms around each other's shoulders, mud-streaked and grinning despite having just lost their season finale by thirty points.`, stem: 'What does the dusty trophy symbolize?', correct: 'That winning matters less to Coach Williams than growth and connection', w1: 'That he is a bad housekeeper', w2: 'That the championship was undeserved', w3: 'That trophies are worthless', exp: 'Neglecting the trophy while cherishing the losing team\'s photo shows his values.', cat: 'ela.reading.figurative_language' },
    { text: `"The test results are in," Dr. Okafor said, and the room held its breath. Not literally, of course—rooms don't breathe. But in that moment, every person in the waiting area stopped whatever they were doing. The man with the newspaper froze mid-page-turn. The woman knitting let her needles rest. Even the fish in the aquarium seemed to pause. Sarah gripped the armrest of her chair so tightly her knuckles went white.`, stem: 'What effect does the author create by describing everyone stopping?', correct: 'It heightens the tension and significance of the moment', w1: 'It shows the room is boring', w2: 'It describes a power outage', w3: 'It shows people are rude for eavesdropping', exp: 'The frozen moment technique amplifies the dramatic tension of awaiting results.', cat: 'ela.reading.tone_mood' },
    { text: `Grandmother used to say that stories were like seeds—you plant them in someone's mind and you never know what will grow. She herself had been planted with stories by her own grandmother, tales of the old country that grew into the roots of her identity. Now she planted them in me, and I could feel them taking hold, sprouting into questions and curiosities that reached toward the light. Some stories grew into trees that sheltered me. Others grew thorns that pricked at comfortable assumptions. All of them grew.`, stem: 'What extended metaphor organizes this passage?', correct: 'Stories as seeds/plants that grow in the mind', w1: 'Grandmother as a farmer', w2: 'Identity as a tree', w3: 'Questions as light', exp: 'Seeds, plant, grow, roots, sprouting, trees, thorns—all extend the seed metaphor.', cat: 'ela.reading.figurative_language' },
    { text: `The battlefield was quiet now, the kind of quiet that follows thunder. Smoke rose from the earth in thin columns, like prayers ascending. A single bird—how had it survived?—perched on a broken fence post and began to sing. Its song was absurdly beautiful, each note a small defiance against the destruction below. Private Torres, the youngest in his unit, listened from behind a shattered wall. He didn't know the name of the bird or the name of its song. But he knew, with a certainty that surprised him, that as long as something could still sing, not everything was lost.`, stem: 'What does the bird most likely symbolize?', correct: 'Hope and resilience persisting even amid devastation', w1: 'The enemy approaching', w2: 'Torres\'s childhood', w3: 'The futility of war', exp: 'A bird singing after battle, called "a small defiance," represents hope and resilience.', cat: 'ela.reading.figurative_language' },
    { text: `Ms. Rodriguez handed back the essays with a single word written at the top of each one. "Brave," said Keisha's. "Precise," said David's. "Growing," said Tyler's. She never gave letter grades on personal essays. "A letter can't capture what you put into this," she explained. "Words can." The students studied their words with more attention than they'd ever given a grade. Keisha traced the letters of "Brave" with her finger, wondering what Ms. Rodriguez had seen in her essay that she hadn't seen herself.`, stem: 'What does the passage suggest about the power of specific feedback?', correct: 'Personalized words can be more meaningful and motivating than generic grades.', w1: 'Teachers should never give grades.', w2: 'Students don\'t care about feedback.', w3: 'Writing essays is pointless.', exp: 'Students\' deep engagement with their individual words shows feedback\'s motivational power.', cat: 'ela.reading.plot_character' },
    { text: `The jazz club was underground in every sense—below street level and below the radar of the mainstream music scene. The walls sweated with condensation from packed bodies, and the air tasted of cigarette smoke and possibility. On the small stage, a woman with silver hair sat at the piano, her fingers moving across the keys like they were having a private conversation. She didn't play to the audience; she played to the music itself. The notes climbed and tumbled and sometimes fell into silences so complete they felt like part of the melody. Nobody moved. Nobody wanted to break the spell.`, stem: 'What does "her fingers moving across the keys like they were having a private conversation" suggest?', correct: 'Her playing was intimate and intuitive, as if the music arose naturally from within her', w1: 'She was talking to someone while playing', w2: 'She was playing quietly', w3: 'She was a beginner at piano', exp: 'The "private conversation" simile suggests deep, intuitive connection between player and instrument.', cat: 'ela.reading.figurative_language' },
  ];

  for (const ml of moreLit) {
    if (i >= 65) break;
    qs.push(q('ela', ml.cat, d[i++], ml.stem,
      [ml.correct, ml.w1, ml.w2, ml.w3], 0, ml.exp,
      ['Misidentified literary element', 'Too literal reading'],
      ['literary-analysis'], ['literary', 'reading'],
      ml.text));
  }

  // Additional to fill remaining
  const fillLit: { text: string; stem: string; correct: string; w1: string; w2: string; w3: string; exp: string; cat: string }[] = [
    { text: `The library was Nadia's sanctuary. While the apartment she shared with four siblings was a symphony of chaos—television blaring, babies crying, doors slamming—the library offered something she craved: silence thick enough to think in. She would find the same table in the back corner, spread her books like a fortress wall around her, and disappear into worlds where she could be anyone. The librarian, Mrs. Chen, seemed to understand without being told. She would place new books on Nadia's table like offerings, always choosing perfectly.`, stem: 'What does "symphony of chaos" suggest?', correct: 'The apartment is overwhelmingly noisy, with many competing sounds', w1: 'The family plays music together', w2: 'The apartment is organized', w3: 'Nadia likes music', exp: '"Symphony" implies many sounds; "chaos" makes it overwhelming, creating an oxymoronic metaphor.', cat: 'ela.reading.figurative_language' },
    { text: `Papa's hands told the story of his life better than any biography could. They were mapped with scars from the factory—thin white lines from metal edges, a missing fingertip from the press that malfunctioned in '93. But they were also the hands that had built my treehouse, board by careful board. The hands that held my mother's face when he told her she was beautiful. The hands that shook slightly now, as Parkinson's began its slow theft. I held them often these days, memorizing their geography before the tremors redrew the map entirely.`, stem: 'What literary device is "memorizing their geography before the tremors redrew the map"?', correct: 'Extended metaphor comparing hands to a landscape/map', w1: 'Simile', w2: 'Hyperbole', w3: 'Onomatopoeia', exp: '"Geography" and "redrew the map" continue the metaphor of hands as a landscape.', cat: 'ela.reading.figurative_language' },
    { text: `The debate team's bus broke down thirty miles from the tournament. While the coach called for help, the team of eight sat on the roadside and did what they did best—they argued. About whether to hitchhike (too dangerous), walk (too far), or call parents (too embarrassing). Finally, sophomore Maya suggested they use the time to practice. "We're going to be late anyway," she reasoned. "Might as well be prepared." By the time the replacement bus arrived two hours later, the team had run through every case twice. They arrived at the tournament disheveled and exhausted. They won first place.`, stem: 'What does this passage reveal about the team\'s character?', correct: 'They are resilient and can turn setbacks into opportunities.', w1: 'They are disorganized and unprepared.', w2: 'They always have bus problems.', w3: 'Maya is the only good debater.', exp: 'Practicing during a breakdown and then winning shows resilience and determination.', cat: 'ela.reading.plot_character' },
    { text: `Time moves differently in a hospital. Minutes stretch into hours in the waiting room, each tick of the clock a small cruelty. But inside the operating room, time contracts—surgeons speak of hours-long procedures that feel like minutes, their focus so complete that the outside world ceases to exist. For the family waiting, time is an enemy. For the surgeon, it is a tool. And for the patient, lying in the strange twilight of anesthesia, time simply stops, a bookmark placed between one chapter of life and the next.`, stem: 'What is the central literary technique in this passage?', correct: 'Personification and metaphor of time experienced differently by each person', w1: 'Flashback', w2: 'Foreshadowing', w3: 'Dialogue', exp: 'Time is personified (enemy, tool) and metaphorically described (bookmark) from multiple perspectives.', cat: 'ela.reading.figurative_language' },
    { text: `Ava's voice was a chameleon. In the principal's office, it was smooth and measured, each word chosen like a chess move. At home with her mother, it softened into something warmer, rounder, peppered with inside jokes and half-finished sentences that didn't need endings. With her friends, it was rapid-fire and loud, a machine gun of slang and laughter. And late at night, writing in her journal, her voice became something else entirely—raw, uncertain, asking questions she would never speak aloud. She sometimes wondered which voice was really hers. The answer, she suspected, was all of them.`, stem: 'What theme does this passage explore?', correct: 'The complexity of identity and how people adapt to different contexts', w1: 'Ava is dishonest with everyone', w2: 'People should always speak the same way', w3: 'Journals are important for self-expression', exp: 'The multiple voices show identity as multifaceted, with the conclusion embracing all versions.', cat: 'ela.reading.plot_character' },
    { text: `The first snow of winter always caught the city off guard, despite happening every year without fail. Buses slid sideways, pedestrians windmilled their arms on icy sidewalks, and television anchors reported the weather with the breathless urgency of a natural disaster. By the third snowfall, the city had remembered itself—salt trucks running on schedule, commuters in sensible boots, children building snow forts with architectural ambition. The transformation was predictable but somehow still satisfying, like rereading a favorite book and finding the ending just as good as you remembered.`, stem: 'What tone does the author use?', correct: 'Gently humorous and affectionate', w1: 'Critical and mocking', w2: 'Somber and serious', w3: 'Anxious and worried', exp: 'Playful descriptions (windmilled arms, breathless urgency) show warm humor, not criticism.', cat: 'ela.reading.tone_mood' },
    { text: `The garden was my mother's autobiography, written in flowers instead of words. The roses along the fence were her childhood—her own mother had grown the same variety in Puerto Rico. The lavender by the front walk was her college years; her roommate had given her the first cutting. The sunflowers, tall and defiant in the back corner, appeared the year my father left—"because we needed something that only looked up," she explained. And the small herb garden by the kitchen door? "That's now," she said simply. "Practical. Nourishing. Close to home."`, stem: 'What extended metaphor structures this passage?', correct: 'The garden as an autobiography/life story', w1: 'Flowers as a recipe', w2: 'The mother as a gardener only', w3: 'Puerto Rico as a paradise', exp: 'Each plant represents a life period, extending the metaphor of garden-as-autobiography.', cat: 'ela.reading.figurative_language' },
  ];

  for (const fl of fillLit) {
    if (i >= 65) break;
    qs.push(q('ela', fl.cat, d[i++], fl.stem,
      [fl.correct, fl.w1, fl.w2, fl.w3], 0, fl.exp,
      ['Misidentified literary element', 'Surface-level reading'],
      ['literary-analysis'], ['literary', 'reading'],
      fl.text));
  }

  return qs.slice(0, 65);
}

// ============ MAIN ============
function main() {
  const groups: { name: string; fn: () => Question[]; need: number }[] = [
    { name: 'math-algebra', fn: mathAlgebra, need: 57 },
    { name: 'math-exponents', fn: mathExponents, need: 50 },
    { name: 'math-inequalities', fn: mathInequalities, need: 50 },
    { name: 'math-ratios', fn: mathRatios, need: 58 },
    { name: 'math-arithmetic', fn: mathArithmetic, need: 50 },
    { name: 'math-geometry-shapes', fn: mathGeometryShapes, need: 44 },
    { name: 'math-geometry-3d', fn: mathGeometry3D, need: 48 },
    { name: 'math-coordinate', fn: mathCoordinate, need: 48 },
    { name: 'math-statistics', fn: mathStatistics, need: 49 },
    { name: 'math-probability', fn: mathProbability, need: 50 },
    { name: 'math-patterns', fn: mathPatterns, need: 50 },
    { name: 'math-word-problems', fn: mathWordProblems, need: 46 },
    { name: 'ela-grammar', fn: elaGrammar, need: 55 },
    { name: 'ela-punctuation', fn: elaPunctuation, need: 48 },
    { name: 'ela-style', fn: elaStyle, need: 39 },
    { name: 'ela-passage-revision', fn: elaPassageRevision, need: 42 },
    { name: 'ela-main-idea', fn: elaMainIdea, need: 64 },
    { name: 'ela-inference', fn: elaInference, need: 66 },
    { name: 'ela-literary', fn: elaLiterary, need: 65 },
  ];

  let totalGenerated = 0;

  for (const g of groups) {
    const questions = g.fn();
    const actual = Math.min(questions.length, g.need);
    const final = questions.slice(0, actual);
    const filePath = resolve(outDir, `round2_${g.name.replace(/-/g, '_')}.json`);
    writeFileSync(filePath, JSON.stringify(final, null, 2));
    console.log(`${g.name}: generated ${final.length}/${g.need}`);
    totalGenerated += final.length;
  }

  console.log(`\nTotal generated: ${totalGenerated}`);
}

main();