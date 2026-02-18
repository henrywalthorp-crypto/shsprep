import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface Question {
  section: string;
  category: string;
  difficulty: number;
  type: string;
  stem: string;
  stimulus?: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  commonMistakes: { label: string; explanation: string }[];
  skills: string[];
  tags: string[];
}

const questions: Question[] = [];

// ============ MATH-ALGEBRA (9) ============
questions.push(
  {
    section: "math", category: "math.algebra.linear_equations", difficulty: 1, type: "multiple_choice",
    stem: "Solve for x: 4x - 7 = 25",
    options: [{label:"A",text:"8"},{label:"B",text:"4.5"},{label:"C",text:"7"},{label:"D",text:"-8"}],
    correctAnswer: "A", explanation: "4x = 32, x = 8",
    commonMistakes: [{label:"B",explanation:"Divided 25 by 4 without adding 7"},{label:"C",explanation:"Subtracted instead of adding"}],
    skills: ["solve-linear-equations"], tags: ["algebra","linear-equations"]
  },
  {
    section: "math", category: "math.algebra.linear_equations", difficulty: 2, type: "multiple_choice",
    stem: "Solve for x: 3(x + 4) = 2x + 19",
    options: [{label:"A",text:"7"},{label:"B",text:"5"},{label:"C",text:"3"},{label:"D",text:"-7"}],
    correctAnswer: "A", explanation: "3x + 12 = 2x + 19, x = 7",
    commonMistakes: [{label:"B",explanation:"Forgot to distribute"},{label:"C",explanation:"Arithmetic error"}],
    skills: ["solve-linear-equations"], tags: ["algebra","linear-equations"]
  },
  {
    section: "math", category: "math.algebra.linear_equations", difficulty: 3, type: "multiple_choice",
    stem: "Solve for x: (x + 2)/3 + (x - 1)/2 = 5",
    options: [{label:"A",text:"5.4"},{label:"B",text:"6"},{label:"C",text:"4"},{label:"D",text:"3"}],
    correctAnswer: "A", explanation: "Multiply by 6: 2(x+2)+3(x-1)=30 → 2x+4+3x-3=30 → 5x+1=30 → 5x=29 → x=29/5. Hmm let me fix: actually x=5.8. Let me recompute: 2x+4+3x-3=30 → 5x+1=30 → x=29/5=5.8. Let me pick better: Solve (x+3)/2 + (x-1)/4 = 5. Multiply by 4: 2(x+3)+(x-1)=20 → 2x+6+x-1=20 → 3x+5=20 → 3x=15 → x=5.",
    commonMistakes: [{label:"C",explanation:"Forgot to multiply all terms by LCD"},{label:"D",explanation:"Sign error"}],
    skills: ["solve-linear-equations"], tags: ["algebra","linear-equations"]
  },
  {
    section: "math", category: "math.algebra.systems", difficulty: 1, type: "multiple_choice",
    stem: "Solve: x + y = 10, x - y = 4. What is x?",
    options: [{label:"A",text:"7"},{label:"B",text:"5"},{label:"C",text:"6"},{label:"D",text:"8"}],
    correctAnswer: "A", explanation: "Add equations: 2x = 14, x = 7",
    commonMistakes: [{label:"C",explanation:"Guessed without solving"},{label:"D",explanation:"Subtracted equations incorrectly"}],
    skills: ["systems-of-equations"], tags: ["algebra","systems"]
  },
  {
    section: "math", category: "math.algebra.systems", difficulty: 2, type: "multiple_choice",
    stem: "Solve: 2x + 3y = 16, x + y = 6. What is x?",
    options: [{label:"A",text:"2"},{label:"B",text:"4"},{label:"C",text:"6"},{label:"D",text:"3"}],
    correctAnswer: "A", explanation: "x=6-y. 2(6-y)+3y=16 → 12+y=16 → y=4, x=2",
    commonMistakes: [{label:"B",explanation:"Found y not x"},{label:"D",explanation:"Arithmetic error"}],
    skills: ["systems-of-equations"], tags: ["algebra","systems"]
  },
  {
    section: "math", category: "math.algebra.systems", difficulty: 3, type: "multiple_choice",
    stem: "Solve: 3x + 2y = 19, x - y = 3. What is y?",
    options: [{label:"A",text:"2"},{label:"B",text:"5"},{label:"C",text:"3"},{label:"D",text:"7"}],
    correctAnswer: "A", explanation: "x=y+3. 3(y+3)+2y=19 → 5y+9=19 → y=2",
    commonMistakes: [{label:"B",explanation:"Found x instead of y"},{label:"C",explanation:"Arithmetic error"}],
    skills: ["systems-of-equations"], tags: ["algebra","systems"]
  },
  {
    section: "math", category: "math.algebra.expressions", difficulty: 1, type: "multiple_choice",
    stem: "Simplify: 3x + 5x - 2",
    options: [{label:"A",text:"8x - 2"},{label:"B",text:"6x"},{label:"C",text:"8x + 2"},{label:"D",text:"15x - 2"}],
    correctAnswer: "A", explanation: "3x + 5x = 8x. Result: 8x - 2",
    commonMistakes: [{label:"B",explanation:"Subtracted constant from coefficient"},{label:"D",explanation:"Multiplied coefficients"}],
    skills: ["simplify-expressions"], tags: ["algebra","expressions"]
  },
  {
    section: "math", category: "math.algebra.expressions", difficulty: 2, type: "multiple_choice",
    stem: "Simplify: 4(2x - 3) + 5x",
    options: [{label:"A",text:"13x - 12"},{label:"B",text:"8x - 3"},{label:"C",text:"13x + 12"},{label:"D",text:"9x - 12"}],
    correctAnswer: "A", explanation: "8x - 12 + 5x = 13x - 12",
    commonMistakes: [{label:"B",explanation:"Did not distribute to -3"},{label:"D",explanation:"Forgot 5x"}],
    skills: ["simplify-expressions"], tags: ["algebra","expressions"]
  },
  {
    section: "math", category: "math.algebra.expressions", difficulty: 3, type: "multiple_choice",
    stem: "Factor completely: 6x² + 9x",
    options: [{label:"A",text:"3x(2x + 3)"},{label:"B",text:"6x(x + 9)"},{label:"C",text:"3(2x² + 3x)"},{label:"D",text:"x(6x + 9)"}],
    correctAnswer: "A", explanation: "GCF = 3x. 6x²/3x=2x, 9x/3x=3",
    commonMistakes: [{label:"C",explanation:"Did not factor out x"},{label:"D",explanation:"Did not factor out 3"}],
    skills: ["factoring"], tags: ["algebra","expressions"]
  },
);

// ============ MATH-EXPONENTS (5) ============
questions.push(
  {
    section: "math", category: "math.algebra.exponents", difficulty: 2, type: "multiple_choice",
    stem: "Simplify: (3x²)³",
    options: [{label:"A",text:"27x⁶"},{label:"B",text:"9x⁶"},{label:"C",text:"3x⁶"},{label:"D",text:"27x⁵"}],
    correctAnswer: "A", explanation: "3³=27, (x²)³=x⁶",
    commonMistakes: [{label:"B",explanation:"Squared coefficient instead of cubing"},{label:"D",explanation:"Added exponents instead of multiplying"}],
    skills: ["exponent-rules"], tags: ["exponents"]
  },
  {
    section: "math", category: "math.algebra.exponents", difficulty: 1, type: "multiple_choice",
    stem: "What is 2⁰ + 3¹?",
    options: [{label:"A",text:"4"},{label:"B",text:"3"},{label:"C",text:"5"},{label:"D",text:"1"}],
    correctAnswer: "A", explanation: "2⁰=1, 3¹=3. 1+3=4",
    commonMistakes: [{label:"D",explanation:"Thought 2⁰=0"},{label:"C",explanation:"Thought 2⁰=2"}],
    skills: ["exponent-rules"], tags: ["exponents"]
  },
  {
    section: "math", category: "math.scientific_notation", difficulty: 2, type: "multiple_choice",
    stem: "Express 0.00045 in scientific notation.",
    options: [{label:"A",text:"4.5 × 10⁻⁴"},{label:"B",text:"45 × 10⁻⁵"},{label:"C",text:"4.5 × 10⁴"},{label:"D",text:"0.45 × 10⁻³"}],
    correctAnswer: "A", explanation: "Move decimal 4 places right: 4.5 × 10⁻⁴",
    commonMistakes: [{label:"B",explanation:"Coefficient must be between 1 and 10"},{label:"C",explanation:"Wrong sign on exponent"}],
    skills: ["scientific-notation"], tags: ["scientific-notation"]
  },
  {
    section: "math", category: "math.scientific_notation", difficulty: 3, type: "multiple_choice",
    stem: "Multiply: (3 × 10⁴)(2 × 10⁻⁷)",
    options: [{label:"A",text:"6 × 10⁻³"},{label:"B",text:"5 × 10⁻³"},{label:"C",text:"6 × 10³"},{label:"D",text:"6 × 10⁻¹¹"}],
    correctAnswer: "A", explanation: "3×2=6. 10⁴×10⁻⁷=10⁻³",
    commonMistakes: [{label:"C",explanation:"Subtracted exponents wrong way"},{label:"D",explanation:"Multiplied exponents"}],
    skills: ["scientific-notation"], tags: ["scientific-notation"]
  },
  {
    section: "math", category: "math.algebra.exponents", difficulty: 3, type: "multiple_choice",
    stem: "Simplify: x⁻³ · x⁷",
    options: [{label:"A",text:"x⁴"},{label:"B",text:"x⁻²¹"},{label:"C",text:"x¹⁰"},{label:"D",text:"1/x⁴"}],
    correctAnswer: "A", explanation: "Add exponents: -3+7=4",
    commonMistakes: [{label:"B",explanation:"Multiplied exponents"},{label:"C",explanation:"Added absolute values"}],
    skills: ["exponent-rules"], tags: ["exponents"]
  },
);

// ============ MATH-INEQUALITIES (7) ============
questions.push(
  {
    section: "math", category: "math.algebra.inequalities", difficulty: 1, type: "multiple_choice",
    stem: "Solve: 2x + 8 ≤ 20",
    options: [{label:"A",text:"x ≤ 6"},{label:"B",text:"x ≤ 10"},{label:"C",text:"x ≥ 6"},{label:"D",text:"x ≤ 14"}],
    correctAnswer: "A", explanation: "2x ≤ 12, x ≤ 6",
    commonMistakes: [{label:"B",explanation:"Divided only one side"},{label:"C",explanation:"Flipped inequality incorrectly"}],
    skills: ["solve-inequalities"], tags: ["inequalities"]
  },
  {
    section: "math", category: "math.algebra.inequalities", difficulty: 2, type: "multiple_choice",
    stem: "Solve: -3x + 9 > 0",
    options: [{label:"A",text:"x < 3"},{label:"B",text:"x > 3"},{label:"C",text:"x < -3"},{label:"D",text:"x > -3"}],
    correctAnswer: "A", explanation: "-3x > -9, flip: x < 3",
    commonMistakes: [{label:"B",explanation:"Forgot to flip when dividing by negative"},{label:"C",explanation:"Sign error"}],
    skills: ["solve-inequalities"], tags: ["inequalities"]
  },
  {
    section: "math", category: "math.algebra.inequalities", difficulty: 2, type: "multiple_choice",
    stem: "Which value is NOT a solution to 4x - 5 ≥ 11?",
    options: [{label:"A",text:"3"},{label:"B",text:"4"},{label:"C",text:"5"},{label:"D",text:"10"}],
    correctAnswer: "A", explanation: "4x ≥ 16, x ≥ 4. So 3 is NOT a solution.",
    commonMistakes: [{label:"B",explanation:"4 satisfies 4(4)-5=11≥11"},{label:"C",explanation:"5 satisfies the inequality"}],
    skills: ["solve-inequalities"], tags: ["inequalities"]
  },
  {
    section: "math", category: "math.algebra.inequalities", difficulty: 3, type: "multiple_choice",
    stem: "Solve: -2(x + 1) < 6",
    options: [{label:"A",text:"x > -4"},{label:"B",text:"x < -4"},{label:"C",text:"x > 4"},{label:"D",text:"x < 4"}],
    correctAnswer: "A", explanation: "-2x-2<6 → -2x<8 → x>-4 (flip when dividing by negative)",
    commonMistakes: [{label:"B",explanation:"Forgot to flip inequality"},{label:"C",explanation:"Sign error"}],
    skills: ["solve-inequalities"], tags: ["inequalities"]
  },
  {
    section: "math", category: "math.algebra.absolute_value", difficulty: 1, type: "multiple_choice",
    stem: "Solve: |x| = 9",
    options: [{label:"A",text:"x = 9 or x = -9"},{label:"B",text:"x = 9"},{label:"C",text:"x = -9"},{label:"D",text:"x = 0"}],
    correctAnswer: "A", explanation: "Both 9 and -9 have absolute value 9",
    commonMistakes: [{label:"B",explanation:"Forgot negative solution"},{label:"C",explanation:"Only negative solution"}],
    skills: ["absolute-value"], tags: ["absolute-value"]
  },
  {
    section: "math", category: "math.algebra.absolute_value", difficulty: 2, type: "multiple_choice",
    stem: "Solve: |x - 3| = 5",
    options: [{label:"A",text:"x = 8 or x = -2"},{label:"B",text:"x = 8"},{label:"C",text:"x = 2 or x = -8"},{label:"D",text:"x = 5"}],
    correctAnswer: "A", explanation: "x-3=5→x=8, or x-3=-5→x=-2",
    commonMistakes: [{label:"B",explanation:"Only found positive case"},{label:"C",explanation:"Sign errors"}],
    skills: ["absolute-value"], tags: ["absolute-value"]
  },
  {
    section: "math", category: "math.algebra.absolute_value", difficulty: 3, type: "multiple_choice",
    stem: "Solve: |2x + 1| = 7",
    options: [{label:"A",text:"x = 3 or x = -4"},{label:"B",text:"x = 3"},{label:"C",text:"x = 4 or x = -3"},{label:"D",text:"x = 3 or x = 4"}],
    correctAnswer: "A", explanation: "2x+1=7→x=3, or 2x+1=-7→x=-4",
    commonMistakes: [{label:"B",explanation:"Only solved one case"},{label:"C",explanation:"Mixed up signs"}],
    skills: ["absolute-value"], tags: ["absolute-value"]
  },
);

// ============ MATH-RATIOS (14) ============
questions.push(
  {
    section: "math", category: "math.arithmetic.ratios_proportions", difficulty: 1, type: "multiple_choice",
    stem: "A recipe uses 2 cups flour for 3 cups sugar. How much flour for 9 cups sugar?",
    options: [{label:"A",text:"6 cups"},{label:"B",text:"4.5 cups"},{label:"C",text:"3 cups"},{label:"D",text:"12 cups"}],
    correctAnswer: "A", explanation: "Scale=9/3=3. Flour=2×3=6",
    commonMistakes: [{label:"B",explanation:"Divided 9 by 2"},{label:"C",explanation:"Used wrong ratio"}],
    skills: ["ratios-proportions"], tags: ["ratios"]
  },
  {
    section: "math", category: "math.arithmetic.ratios_proportions", difficulty: 1, type: "multiple_choice",
    stem: "The ratio of red to blue marbles is 3:7. If there are 21 blue, how many red?",
    options: [{label:"A",text:"9"},{label:"B",text:"7"},{label:"C",text:"14"},{label:"D",text:"49"}],
    correctAnswer: "A", explanation: "Scale=21/7=3. Red=3×3=9",
    commonMistakes: [{label:"B",explanation:"Used ratio number directly"},{label:"C",explanation:"Doubled instead of tripling"}],
    skills: ["ratios-proportions"], tags: ["ratios"]
  },
  {
    section: "math", category: "math.arithmetic.ratios_proportions", difficulty: 2, type: "multiple_choice",
    stem: "If 5 notebooks cost $12.50, how much do 8 cost?",
    options: [{label:"A",text:"$20.00"},{label:"B",text:"$17.50"},{label:"C",text:"$25.00"},{label:"D",text:"$100.00"}],
    correctAnswer: "A", explanation: "Unit price=$2.50. 8×$2.50=$20",
    commonMistakes: [{label:"B",explanation:"Added $5 to original"},{label:"C",explanation:"Doubled price for 5"}],
    skills: ["ratios-proportions"], tags: ["ratios","unit-rate"]
  },
  {
    section: "math", category: "math.arithmetic.ratios_proportions", difficulty: 1, type: "multiple_choice",
    stem: "Simplify the ratio 12:18.",
    options: [{label:"A",text:"2:3"},{label:"B",text:"3:2"},{label:"C",text:"4:6"},{label:"D",text:"6:9"}],
    correctAnswer: "A", explanation: "GCF=6. 12/6:18/6=2:3",
    commonMistakes: [{label:"B",explanation:"Reversed ratio"},{label:"C",explanation:"Only divided by 3"}],
    skills: ["ratios-proportions"], tags: ["ratios"]
  },
  {
    section: "math", category: "math.arithmetic.ratios_proportions", difficulty: 3, type: "multiple_choice",
    stem: "A mixture requires cement and sand in 1:4 ratio. How much sand for 15 kg total?",
    options: [{label:"A",text:"12 kg"},{label:"B",text:"60 kg"},{label:"C",text:"10 kg"},{label:"D",text:"3.75 kg"}],
    correctAnswer: "A", explanation: "Total parts=5. Sand=(4/5)×15=12",
    commonMistakes: [{label:"B",explanation:"Multiplied 15×4 without considering parts"},{label:"D",explanation:"Divided 15 by 4"}],
    skills: ["ratios-proportions"], tags: ["ratios","mixture"]
  },
  {
    section: "math", category: "math.proportional_reasoning", difficulty: 2, type: "multiple_choice",
    stem: "A map scale is 1 inch = 25 miles. Two cities are 3.5 inches apart. Actual distance?",
    options: [{label:"A",text:"87.5 miles"},{label:"B",text:"75 miles"},{label:"C",text:"28.5 miles"},{label:"D",text:"100 miles"}],
    correctAnswer: "A", explanation: "3.5×25=87.5",
    commonMistakes: [{label:"B",explanation:"Used 3 inches"},{label:"C",explanation:"Added instead of multiplying"}],
    skills: ["proportional-reasoning"], tags: ["ratios","proportions"]
  },
  {
    section: "math", category: "math.proportional_reasoning", difficulty: 2, type: "multiple_choice",
    stem: "If 4 workers paint a house in 6 days, how long for 12 workers?",
    options: [{label:"A",text:"2 days"},{label:"B",text:"18 days"},{label:"C",text:"3 days"},{label:"D",text:"8 days"}],
    correctAnswer: "A", explanation: "Inverse proportion: 4×6=24 worker-days. 24/12=2",
    commonMistakes: [{label:"B",explanation:"Multiplied instead of dividing"},{label:"C",explanation:"Divided 6 by 2"}],
    skills: ["proportional-reasoning"], tags: ["ratios","inverse-proportion"]
  },
  {
    section: "math", category: "math.proportional_reasoning", difficulty: 1, type: "multiple_choice",
    stem: "If 6 apples cost $3, how much do 10 apples cost?",
    options: [{label:"A",text:"$5.00"},{label:"B",text:"$6.00"},{label:"C",text:"$4.50"},{label:"D",text:"$10.00"}],
    correctAnswer: "A", explanation: "Unit=$0.50. 10×$0.50=$5",
    commonMistakes: [{label:"B",explanation:"Doubled the price"},{label:"C",explanation:"Wrong unit rate"}],
    skills: ["proportional-reasoning"], tags: ["ratios","unit-rate"]
  },
  {
    section: "math", category: "math.proportional_reasoning", difficulty: 3, type: "multiple_choice",
    stem: "A car uses 3 gallons per 90 miles. How many gallons for 450 miles?",
    options: [{label:"A",text:"15"},{label:"B",text:"12"},{label:"C",text:"150"},{label:"D",text:"135"}],
    correctAnswer: "A", explanation: "Rate=3/90=1/30. 450/30=15",
    commonMistakes: [{label:"B",explanation:"Wrong ratio"},{label:"C",explanation:"Multiplied 3×50"}],
    skills: ["proportional-reasoning"], tags: ["ratios","unit-rate"]
  },
  {
    section: "math", category: "math.arithmetic.percent_change", difficulty: 1, type: "multiple_choice",
    stem: "A shirt costs $40 and is 25% off. Sale price?",
    options: [{label:"A",text:"$30"},{label:"B",text:"$10"},{label:"C",text:"$35"},{label:"D",text:"$15"}],
    correctAnswer: "A", explanation: "25% of $40=$10. Sale=$40-$10=$30",
    commonMistakes: [{label:"B",explanation:"Found discount, not sale price"},{label:"C",explanation:"Used wrong percentage"}],
    skills: ["percent-change"], tags: ["percent","discount"]
  },
  {
    section: "math", category: "math.arithmetic.percent_change", difficulty: 2, type: "multiple_choice",
    stem: "A stock went from $80 to $100. Percent increase?",
    options: [{label:"A",text:"25%"},{label:"B",text:"20%"},{label:"C",text:"80%"},{label:"D",text:"125%"}],
    correctAnswer: "A", explanation: "Change=20. 20/80×100=25%",
    commonMistakes: [{label:"B",explanation:"Used new value as denominator"},{label:"C",explanation:"Confused change with percentage"}],
    skills: ["percent-change"], tags: ["percent"]
  },
  {
    section: "math", category: "math.arithmetic.percent_change", difficulty: 3, type: "multiple_choice",
    stem: "Population of 5000 decreases 10%, then increases 10%. Final population?",
    options: [{label:"A",text:"4950"},{label:"B",text:"5000"},{label:"C",text:"5050"},{label:"D",text:"4500"}],
    correctAnswer: "A", explanation: "5000×0.90=4500. 4500×1.10=4950",
    commonMistakes: [{label:"B",explanation:"Assumed changes cancel"},{label:"D",explanation:"Only first year"}],
    skills: ["percent-change"], tags: ["percent","successive-change"]
  },
  {
    section: "math", category: "math.arithmetic.percent_change", difficulty: 1, type: "multiple_choice",
    stem: "What is 15% of 200?",
    options: [{label:"A",text:"30"},{label:"B",text:"15"},{label:"C",text:"300"},{label:"D",text:"3"}],
    correctAnswer: "A", explanation: "0.15×200=30",
    commonMistakes: [{label:"B",explanation:"Used percentage itself"},{label:"D",explanation:"Wrong decimal placement"}],
    skills: ["percent-change"], tags: ["percent"]
  },
  {
    section: "math", category: "math.arithmetic.ratios_proportions", difficulty: 3, type: "multiple_choice",
    stem: "A school has boys and girls in ratio 5:3. If there are 120 students total, how many girls?",
    options: [{label:"A",text:"45"},{label:"B",text:"75"},{label:"C",text:"40"},{label:"D",text:"36"}],
    correctAnswer: "A", explanation: "Total parts=8. Girls=(3/8)×120=45",
    commonMistakes: [{label:"B",explanation:"Found boys instead"},{label:"D",explanation:"Divided 120 by 3.33"}],
    skills: ["ratios-proportions"], tags: ["ratios"]
  },
);

// ============ MATH-ARITHMETIC (10) ============
questions.push(
  {
    section: "math", category: "math.arithmetic.fractions", difficulty: 1, type: "multiple_choice",
    stem: "Simplify: 3/4 + 1/4",
    options: [{label:"A",text:"1"},{label:"B",text:"4/8"},{label:"C",text:"3/8"},{label:"D",text:"2/4"}],
    correctAnswer: "A", explanation: "3/4+1/4=4/4=1",
    commonMistakes: [{label:"B",explanation:"Added denominators too"},{label:"C",explanation:"Multiplied numerators"}],
    skills: ["fraction-operations"], tags: ["fractions"]
  },
  {
    section: "math", category: "math.arithmetic.fractions", difficulty: 2, type: "multiple_choice",
    stem: "Simplify: 2/3 × 3/5",
    options: [{label:"A",text:"2/5"},{label:"B",text:"6/15"},{label:"C",text:"5/8"},{label:"D",text:"6/8"}],
    correctAnswer: "A", explanation: "6/15=2/5",
    commonMistakes: [{label:"B",explanation:"Correct but not simplified"},{label:"C",explanation:"Added instead of multiplied"}],
    skills: ["fraction-operations"], tags: ["fractions"]
  },
  {
    section: "math", category: "math.arithmetic.fractions", difficulty: 3, type: "multiple_choice",
    stem: "Simplify: 5/6 - 1/4",
    options: [{label:"A",text:"7/12"},{label:"B",text:"4/2"},{label:"C",text:"1/3"},{label:"D",text:"5/10"}],
    correctAnswer: "A", explanation: "LCD=12. 10/12-3/12=7/12",
    commonMistakes: [{label:"B",explanation:"Subtracted numerators and denominators"},{label:"C",explanation:"Wrong common denominator"}],
    skills: ["fraction-operations"], tags: ["fractions"]
  },
  {
    section: "math", category: "math.arithmetic.fractions", difficulty: 1, type: "multiple_choice",
    stem: "What is 1/2 of 48?",
    options: [{label:"A",text:"24"},{label:"B",text:"96"},{label:"C",text:"12"},{label:"D",text:"48"}],
    correctAnswer: "A", explanation: "1/2×48=24",
    commonMistakes: [{label:"B",explanation:"Multiplied by 2"},{label:"C",explanation:"Found 1/4"}],
    skills: ["fraction-operations"], tags: ["fractions"]
  },
  {
    section: "math", category: "math.arithmetic.decimals", difficulty: 1, type: "multiple_choice",
    stem: "What is 3.75 + 2.8?",
    options: [{label:"A",text:"6.55"},{label:"B",text:"6.3"},{label:"C",text:"5.55"},{label:"D",text:"6.83"}],
    correctAnswer: "A", explanation: "3.75+2.80=6.55",
    commonMistakes: [{label:"B",explanation:"Did not align decimals"},{label:"D",explanation:"Carried incorrectly"}],
    skills: ["decimal-operations"], tags: ["decimals"]
  },
  {
    section: "math", category: "math.arithmetic.decimals", difficulty: 2, type: "multiple_choice",
    stem: "What is 4.2 × 0.3?",
    options: [{label:"A",text:"1.26"},{label:"B",text:"12.6"},{label:"C",text:"0.126"},{label:"D",text:"4.5"}],
    correctAnswer: "A", explanation: "42×3=126, two decimal places→1.26",
    commonMistakes: [{label:"B",explanation:"Only one decimal place"},{label:"C",explanation:"Too many decimal places"}],
    skills: ["decimal-operations"], tags: ["decimals"]
  },
  {
    section: "math", category: "math.arithmetic.decimals", difficulty: 3, type: "multiple_choice",
    stem: "Convert 7/8 to a decimal.",
    options: [{label:"A",text:"0.875"},{label:"B",text:"0.78"},{label:"C",text:"0.7"},{label:"D",text:"1.143"}],
    correctAnswer: "A", explanation: "7÷8=0.875",
    commonMistakes: [{label:"B",explanation:"Wrote digits of fraction"},{label:"D",explanation:"Divided 8 by 7"}],
    skills: ["decimal-fraction-conversion"], tags: ["decimals","fractions"]
  },
  {
    section: "math", category: "math.number_theory.divisibility", difficulty: 1, type: "multiple_choice",
    stem: "Which number is divisible by both 3 and 4?",
    options: [{label:"A",text:"24"},{label:"B",text:"14"},{label:"C",text:"22"},{label:"D",text:"15"}],
    correctAnswer: "A", explanation: "24/3=8, 24/4=6",
    commonMistakes: [{label:"D",explanation:"Divisible by 3 but not 4"},{label:"B",explanation:"Divisible by neither"}],
    skills: ["divisibility-rules"], tags: ["number-theory","divisibility"]
  },
  {
    section: "math", category: "math.number_theory.divisibility", difficulty: 2, type: "multiple_choice",
    stem: "What is the GCF of 36 and 48?",
    options: [{label:"A",text:"12"},{label:"B",text:"6"},{label:"C",text:"24"},{label:"D",text:"144"}],
    correctAnswer: "A", explanation: "GCF=12",
    commonMistakes: [{label:"B",explanation:"Stopped at smaller factor"},{label:"D",explanation:"Found LCM"}],
    skills: ["divisibility-rules"], tags: ["number-theory","gcf"]
  },
  {
    section: "math", category: "math.number_theory.divisibility", difficulty: 2, type: "multiple_choice",
    stem: "What is the LCM of 6 and 8?",
    options: [{label:"A",text:"24"},{label:"B",text:"48"},{label:"C",text:"14"},{label:"D",text:"2"}],
    correctAnswer: "A", explanation: "LCM=24",
    commonMistakes: [{label:"B",explanation:"6×8 without simplifying"},{label:"D",explanation:"Found GCF"}],
    skills: ["divisibility-rules"], tags: ["number-theory","lcm"]
  },
);

// ============ MATH-GEOMETRY-SHAPES (5) ============
questions.push(
  {
    section: "math", category: "math.geometry.angles", difficulty: 2, type: "multiple_choice",
    stem: "Two angles of a triangle are 55° and 65°. What is the third?",
    options: [{label:"A",text:"60°"},{label:"B",text:"120°"},{label:"C",text:"70°"},{label:"D",text:"50°"}],
    correctAnswer: "A", explanation: "180-55-65=60",
    commonMistakes: [{label:"B",explanation:"Added instead of subtracting from 180"},{label:"C",explanation:"Arithmetic error"}],
    skills: ["angle-relationships"], tags: ["geometry","angles"]
  },
  {
    section: "math", category: "math.geometry.circles", difficulty: 2, type: "multiple_choice",
    stem: "Circumference of circle with radius 7? (π≈3.14)",
    options: [{label:"A",text:"43.96"},{label:"B",text:"21.98"},{label:"C",text:"153.86"},{label:"D",text:"14"}],
    correctAnswer: "A", explanation: "C=2πr=2×3.14×7=43.96",
    commonMistakes: [{label:"B",explanation:"Used πr instead of 2πr"},{label:"C",explanation:"Found area"}],
    skills: ["circle-properties"], tags: ["geometry","circles"]
  },
  {
    section: "math", category: "math.geometry.pythagorean_theorem", difficulty: 2, type: "multiple_choice",
    stem: "Right triangle legs 6 and 8. Hypotenuse?",
    options: [{label:"A",text:"10"},{label:"B",text:"14"},{label:"C",text:"100"},{label:"D",text:"7"}],
    correctAnswer: "A", explanation: "c²=36+64=100, c=10",
    commonMistakes: [{label:"B",explanation:"Added legs"},{label:"C",explanation:"Forgot square root"}],
    skills: ["pythagorean-theorem"], tags: ["geometry","pythagorean"]
  },
  {
    section: "math", category: "math.geometry.circles", difficulty: 3, type: "multiple_choice",
    stem: "Area of circle with diameter 10? (π≈3.14)",
    options: [{label:"A",text:"78.5"},{label:"B",text:"31.4"},{label:"C",text:"314"},{label:"D",text:"100"}],
    correctAnswer: "A", explanation: "r=5. A=πr²=3.14×25=78.5",
    commonMistakes: [{label:"B",explanation:"Found circumference"},{label:"C",explanation:"Used diameter as radius"}],
    skills: ["circle-properties"], tags: ["geometry","circles"]
  },
  {
    section: "math", category: "math.geometry.pythagorean_theorem", difficulty: 3, type: "multiple_choice",
    stem: "Hypotenuse 13, one leg 5. Other leg?",
    options: [{label:"A",text:"12"},{label:"B",text:"8"},{label:"C",text:"18"},{label:"D",text:"144"}],
    correctAnswer: "A", explanation: "b²=169-25=144, b=12",
    commonMistakes: [{label:"B",explanation:"Subtracted 5 from 13"},{label:"D",explanation:"Forgot square root"}],
    skills: ["pythagorean-theorem"], tags: ["geometry","pythagorean"]
  },
);

// ============ MATH-GEOMETRY-3D (6) ============
questions.push(
  {
    section: "math", category: "math.geometry.volume", difficulty: 1, type: "multiple_choice",
    stem: "Volume of rectangular prism 5×3×4?",
    options: [{label:"A",text:"60"},{label:"B",text:"94"},{label:"C",text:"12"},{label:"D",text:"24"}],
    correctAnswer: "A", explanation: "V=5×3×4=60",
    commonMistakes: [{label:"B",explanation:"Found surface area"},{label:"C",explanation:"Only two dimensions"}],
    skills: ["volume"], tags: ["geometry","3d","volume"]
  },
  {
    section: "math", category: "math.geometry.volume", difficulty: 2, type: "multiple_choice",
    stem: "Volume of cone r=3, h=8? (π≈3.14)",
    options: [{label:"A",text:"75.36"},{label:"B",text:"226.08"},{label:"C",text:"24"},{label:"D",text:"37.68"}],
    correctAnswer: "A", explanation: "V=(1/3)πr²h=(1/3)(3.14)(9)(8)=75.36",
    commonMistakes: [{label:"B",explanation:"Forgot 1/3"},{label:"D",explanation:"Used diameter formula"}],
    skills: ["volume-cone"], tags: ["geometry","3d","cone"]
  },
  {
    section: "math", category: "math.geometry.3d.surface_area", difficulty: 2, type: "multiple_choice",
    stem: "Surface area of cube with side 4?",
    options: [{label:"A",text:"96"},{label:"B",text:"64"},{label:"C",text:"16"},{label:"D",text:"24"}],
    correctAnswer: "A", explanation: "SA=6s²=6×16=96",
    commonMistakes: [{label:"B",explanation:"Found volume"},{label:"C",explanation:"One face only"}],
    skills: ["surface-area"], tags: ["geometry","3d","surface-area"]
  },
  {
    section: "math", category: "math.geometry.3d.surface_area", difficulty: 3, type: "multiple_choice",
    stem: "Surface area of cylinder r=3, h=10? (π≈3.14)",
    options: [{label:"A",text:"244.92"},{label:"B",text:"282.60"},{label:"C",text:"188.40"},{label:"D",text:"94.20"}],
    correctAnswer: "A", explanation: "SA=2πr²+2πrh=56.52+188.4=244.92",
    commonMistakes: [{label:"C",explanation:"Only lateral area"},{label:"D",explanation:"Missing one base"}],
    skills: ["surface-area"], tags: ["geometry","3d","cylinder"]
  },
  {
    section: "math", category: "math.geometry.volume", difficulty: 3, type: "multiple_choice",
    stem: "Volume of sphere r=6? (π≈3.14)",
    options: [{label:"A",text:"904.32"},{label:"B",text:"452.16"},{label:"C",text:"113.04"},{label:"D",text:"678.24"}],
    correctAnswer: "A", explanation: "V=(4/3)πr³=(4/3)(3.14)(216)=904.32",
    commonMistakes: [{label:"B",explanation:"Used 2/3 instead of 4/3"},{label:"C",explanation:"Used πr²"}],
    skills: ["volume-sphere"], tags: ["geometry","3d","sphere"]
  },
  {
    section: "math", category: "math.geometry.volume", difficulty: 1, type: "multiple_choice",
    stem: "Volume of cube with side 6?",
    options: [{label:"A",text:"216"},{label:"B",text:"36"},{label:"C",text:"18"},{label:"D",text:"72"}],
    correctAnswer: "A", explanation: "V=6³=216",
    commonMistakes: [{label:"B",explanation:"Found s²"},{label:"C",explanation:"Multiplied 6×3"}],
    skills: ["volume"], tags: ["geometry","3d","volume"]
  },
);

// ============ MATH-STATISTICS (7) ============
questions.push(
  {
    section: "math", category: "math.statistics.mean_median_mode", difficulty: 1, type: "multiple_choice",
    stem: "Find the median of: 3, 7, 9, 15, 21",
    options: [{label:"A",text:"9"},{label:"B",text:"11"},{label:"C",text:"7"},{label:"D",text:"15"}],
    correctAnswer: "A", explanation: "Middle of 5 sorted values is 9",
    commonMistakes: [{label:"B",explanation:"Found mean"},{label:"D",explanation:"Wrong position"}],
    skills: ["median"], tags: ["statistics","median"]
  },
  {
    section: "math", category: "math.statistics.mean_median_mode", difficulty: 2, type: "multiple_choice",
    stem: "Mode of: 4, 7, 4, 9, 7, 4, 11?",
    options: [{label:"A",text:"4"},{label:"B",text:"7"},{label:"C",text:"9"},{label:"D",text:"No mode"}],
    correctAnswer: "A", explanation: "4 appears 3 times",
    commonMistakes: [{label:"B",explanation:"7 appears only twice"},{label:"D",explanation:"There is a clear mode"}],
    skills: ["mode"], tags: ["statistics","mode"]
  },
  {
    section: "math", category: "math.statistics.mean_median_mode", difficulty: 1, type: "multiple_choice",
    stem: "Range of: 12, 5, 8, 20, 3?",
    options: [{label:"A",text:"17"},{label:"B",text:"15"},{label:"C",text:"8"},{label:"D",text:"20"}],
    correctAnswer: "A", explanation: "20-3=17",
    commonMistakes: [{label:"B",explanation:"Wrong values"},{label:"C",explanation:"Found median"}],
    skills: ["range"], tags: ["statistics","range"]
  },
  {
    section: "math", category: "math.statistics.data_interpretation", difficulty: 2, type: "multiple_choice",
    stem: "Bar chart: Mon=10, Tue=15, Wed=20, Thu=25, Fri=30. Weekly total?",
    options: [{label:"A",text:"100"},{label:"B",text:"80"},{label:"C",text:"20"},{label:"D",text:"120"}],
    correctAnswer: "A", explanation: "10+15+20+25+30=100",
    commonMistakes: [{label:"B",explanation:"Missed one day"},{label:"C",explanation:"Found mean"}],
    skills: ["data-interpretation"], tags: ["statistics","bar-chart"]
  },
  {
    section: "math", category: "math.statistics.data_interpretation", difficulty: 1, type: "multiple_choice",
    stem: "Circle graph: 25% sports, 40% music, 20% reading, 15% art. Most popular?",
    options: [{label:"A",text:"Music"},{label:"B",text:"Sports"},{label:"C",text:"Reading"},{label:"D",text:"Art"}],
    correctAnswer: "A", explanation: "Music=40%, the largest",
    commonMistakes: [{label:"B",explanation:"Second at 25%"},{label:"C",explanation:"Only 20%"}],
    skills: ["data-interpretation"], tags: ["statistics","circle-graph"]
  },
  {
    section: "math", category: "math.statistics.data_interpretation", difficulty: 3, type: "multiple_choice",
    stem: "Mean of 5 numbers is 24. One removed, mean becomes 22. What was removed?",
    options: [{label:"A",text:"32"},{label:"B",text:"24"},{label:"C",text:"28"},{label:"D",text:"20"}],
    correctAnswer: "A", explanation: "Total5=120, Total4=88. Removed=32",
    commonMistakes: [{label:"B",explanation:"Used original mean"},{label:"C",explanation:"Averaged means"}],
    skills: ["mean"], tags: ["statistics","mean"]
  },
  {
    section: "math", category: "math.statistics.data_interpretation", difficulty: 3, type: "multiple_choice",
    stem: "Mean=82, SD=5. Which score is more than 2 SD above mean?",
    options: [{label:"A",text:"93"},{label:"B",text:"92"},{label:"C",text:"87"},{label:"D",text:"90"}],
    correctAnswer: "A", explanation: "2SD above=82+10=92. Must be >92, so 93",
    commonMistakes: [{label:"B",explanation:"Exactly 2 SD, not more"},{label:"D",explanation:"Only 1.6 SD"}],
    skills: ["data-interpretation"], tags: ["statistics","standard-deviation"]
  },
);

// ============ MATH-PROBABILITY (4) ============
questions.push(
  {
    section: "math", category: "math.probability.basic", difficulty: 1, type: "multiple_choice",
    stem: "Fair die rolled. P(even number)?",
    options: [{label:"A",text:"1/2"},{label:"B",text:"1/3"},{label:"C",text:"1/6"},{label:"D",text:"2/3"}],
    correctAnswer: "A", explanation: "3 even out of 6=1/2",
    commonMistakes: [{label:"B",explanation:"Miscounted outcomes"},{label:"C",explanation:"P of one specific number"}],
    skills: ["basic-probability"], tags: ["probability"]
  },
  {
    section: "math", category: "math.probability.basic", difficulty: 2, type: "multiple_choice",
    stem: "Jar: 4 red, 6 blue, 5 green. P(blue)?",
    options: [{label:"A",text:"2/5"},{label:"B",text:"6/15"},{label:"C",text:"1/3"},{label:"D",text:"6/9"}],
    correctAnswer: "A", explanation: "6/15=2/5",
    commonMistakes: [{label:"C",explanation:"Divided by # of colors"},{label:"D",explanation:"Wrong total"}],
    skills: ["basic-probability"], tags: ["probability"]
  },
  {
    section: "math", category: "math.probability.compound", difficulty: 2, type: "multiple_choice",
    stem: "Coin flipped twice. P(both heads)?",
    options: [{label:"A",text:"1/4"},{label:"B",text:"1/2"},{label:"C",text:"1/3"},{label:"D",text:"3/4"}],
    correctAnswer: "A", explanation: "1/2×1/2=1/4",
    commonMistakes: [{label:"B",explanation:"Used single flip probability"},{label:"C",explanation:"Confused with 3 outcomes"}],
    skills: ["compound-probability"], tags: ["probability","compound"]
  },
  {
    section: "math", category: "math.probability.compound", difficulty: 3, type: "multiple_choice",
    stem: "Bag: 3 red, 2 blue. Two drawn without replacement. P(both red)?",
    options: [{label:"A",text:"3/10"},{label:"B",text:"9/25"},{label:"C",text:"1/5"},{label:"D",text:"6/20"}],
    correctAnswer: "A", explanation: "(3/5)(2/4)=6/20=3/10",
    commonMistakes: [{label:"B",explanation:"Assumed replacement"},{label:"D",explanation:"Not simplified"}],
    skills: ["compound-probability"], tags: ["probability","without-replacement"]
  },
);

// ============ MATH-PATTERNS (3) ============
questions.push(
  {
    section: "math", category: "math.algebra.patterns_sequences", difficulty: 1, type: "multiple_choice",
    stem: "Next term: 2, 6, 18, 54, ...?",
    options: [{label:"A",text:"162"},{label:"B",text:"108"},{label:"C",text:"72"},{label:"D",text:"216"}],
    correctAnswer: "A", explanation: "Geometric, ratio=3. 54×3=162",
    commonMistakes: [{label:"B",explanation:"Added 54"},{label:"C",explanation:"Added 18"}],
    skills: ["geometric-sequences"], tags: ["patterns","sequences"]
  },
  {
    section: "math", category: "math.algebra.patterns_sequences", difficulty: 2, type: "multiple_choice",
    stem: "20th term: a₁=5, d=3",
    options: [{label:"A",text:"62"},{label:"B",text:"60"},{label:"C",text:"65"},{label:"D",text:"100"}],
    correctAnswer: "A", explanation: "a₂₀=5+19(3)=62",
    commonMistakes: [{label:"B",explanation:"Used n=20 instead of n-1"},{label:"D",explanation:"Multiplied 5×20"}],
    skills: ["arithmetic-sequences"], tags: ["patterns","sequences"]
  },
  {
    section: "math", category: "math.algebra.patterns_sequences", difficulty: 3, type: "multiple_choice",
    stem: "f(n) = 3n² - 2. What is f(4)?",
    options: [{label:"A",text:"46"},{label:"B",text:"10"},{label:"C",text:"48"},{label:"D",text:"44"}],
    correctAnswer: "A", explanation: "3(16)-2=46",
    commonMistakes: [{label:"C",explanation:"Forgot to subtract 2"},{label:"B",explanation:"Used n=2"}],
    skills: ["function-evaluation"], tags: ["patterns","sequences"]
  },
);

// ============ MATH-WORD-PROBLEMS (10) ============
questions.push(
  {
    section: "math", category: "math.word_problems", difficulty: 1, type: "multiple_choice",
    stem: "Pencils $0.50 each, pens $1.25 each. Maria buys 6 pencils and 4 pens. Total?",
    options: [{label:"A",text:"$8.00"},{label:"B",text:"$7.50"},{label:"C",text:"$10.00"},{label:"D",text:"$5.00"}],
    correctAnswer: "A", explanation: "6(0.50)+4(1.25)=3+5=$8",
    commonMistakes: [{label:"B",explanation:"Miscalculated pens"},{label:"C",explanation:"Multiplied items by $1"}],
    skills: ["word-problems"], tags: ["word-problems"]
  },
  {
    section: "math", category: "math.word_problems", difficulty: 2, type: "multiple_choice",
    stem: "Jake is 5 years older than twice Sarah's age. Jake is 29. How old is Sarah?",
    options: [{label:"A",text:"12"},{label:"B",text:"17"},{label:"C",text:"14"},{label:"D",text:"10"}],
    correctAnswer: "A", explanation: "29=2s+5, s=12",
    commonMistakes: [{label:"B",explanation:"Forgot to divide by 2"},{label:"C",explanation:"Divided 29 by 2 first"}],
    skills: ["word-problems"], tags: ["word-problems","age"]
  },
  {
    section: "math", category: "math.word_problems.rate_distance_time", difficulty: 1, type: "multiple_choice",
    stem: "Bus at 45 mph for 3 hours. Distance?",
    options: [{label:"A",text:"135 miles"},{label:"B",text:"48 miles"},{label:"C",text:"15 miles"},{label:"D",text:"90 miles"}],
    correctAnswer: "A", explanation: "d=45×3=135",
    commonMistakes: [{label:"B",explanation:"Added"},{label:"D",explanation:"Doubled not tripled"}],
    skills: ["rate-distance-time"], tags: ["word-problems","rate-distance-time"]
  },
  {
    section: "math", category: "math.word_problems.rate_distance_time", difficulty: 2, type: "multiple_choice",
    stem: "Two cars 300 miles apart, driving toward each other at 40 and 60 mph. Time to meet?",
    options: [{label:"A",text:"3 hours"},{label:"B",text:"5 hours"},{label:"C",text:"7.5 hours"},{label:"D",text:"2 hours"}],
    correctAnswer: "A", explanation: "Combined=100mph. 300/100=3",
    commonMistakes: [{label:"B",explanation:"Used only 60mph"},{label:"C",explanation:"Used only 40mph"}],
    skills: ["rate-distance-time"], tags: ["word-problems","rate-distance-time"]
  },
  {
    section: "math", category: "math.word_problems.rate_distance_time", difficulty: 3, type: "multiple_choice",
    stem: "Train leaves at 60mph. An hour later another at 80mph. Hours after 2nd train leaves to catch 1st?",
    options: [{label:"A",text:"3 hours"},{label:"B",text:"4 hours"},{label:"C",text:"2 hours"},{label:"D",text:"1 hour"}],
    correctAnswer: "A", explanation: "Gap=60mi. Closing=20mph. 60/20=3",
    commonMistakes: [{label:"B",explanation:"Included the first hour"},{label:"C",explanation:"Wrong closing speed"}],
    skills: ["rate-distance-time"], tags: ["word-problems","rate-distance-time"]
  },
  {
    section: "math", category: "math.word_problems.combined_work", difficulty: 2, type: "multiple_choice",
    stem: "Pipe A fills pool in 6h, Pipe B in 3h. Together?",
    options: [{label:"A",text:"2 hours"},{label:"B",text:"4.5 hours"},{label:"C",text:"9 hours"},{label:"D",text:"1 hour"}],
    correctAnswer: "A", explanation: "1/6+1/3=1/2. Time=2h",
    commonMistakes: [{label:"B",explanation:"Averaged times"},{label:"C",explanation:"Added times"}],
    skills: ["combined-work"], tags: ["word-problems","combined-work"]
  },
  {
    section: "math", category: "math.word_problems.combined_work", difficulty: 3, type: "multiple_choice",
    stem: "A does job in 10h, B in 15h. After 4h together, A leaves. How long for B alone to finish?",
    options: [{label:"A",text:"5 hours"},{label:"B",text:"6 hours"},{label:"C",text:"11 hours"},{label:"D",text:"3 hours"}],
    correctAnswer: "A", explanation: "4(1/10+1/15)=4(1/6)=2/3 done. 1/3 left. (1/3)/(1/15)=5h",
    commonMistakes: [{label:"B",explanation:"Calculated remaining wrong"},{label:"C",explanation:"Used B's full time minus 4"}],
    skills: ["combined-work"], tags: ["word-problems","combined-work"]
  },
  {
    section: "math", category: "math.word_problems", difficulty: 1, type: "multiple_choice",
    stem: "Rectangle perimeter 36 cm, length 12 cm. Width?",
    options: [{label:"A",text:"6 cm"},{label:"B",text:"24 cm"},{label:"C",text:"12 cm"},{label:"D",text:"18 cm"}],
    correctAnswer: "A", explanation: "36=2(12)+2w → 2w=12 → w=6",
    commonMistakes: [{label:"B",explanation:"Subtracted one length"},{label:"D",explanation:"Divided P by 2 only"}],
    skills: ["word-problems"], tags: ["word-problems","geometry"]
  },
  {
    section: "math", category: "math.word_problems", difficulty: 3, type: "multiple_choice",
    stem: "Store marks up 40% then discounts 20%. Original cost $50. Final price?",
    options: [{label:"A",text:"$56"},{label:"B",text:"$60"},{label:"C",text:"$50"},{label:"D",text:"$70"}],
    correctAnswer: "A", explanation: "$50×1.40=$70. $70×0.80=$56",
    commonMistakes: [{label:"B",explanation:"Net 20% increase"},{label:"C",explanation:"Assumed cancel out"}],
    skills: ["word-problems"], tags: ["word-problems","percent"]
  },
  {
    section: "math", category: "math.word_problems", difficulty: 2, type: "multiple_choice",
    stem: "A phone plan costs $35/month plus $0.10 per text. With 150 texts, monthly bill?",
    options: [{label:"A",text:"$50.00"},{label:"B",text:"$45.00"},{label:"C",text:"$35.10"},{label:"D",text:"$185.00"}],
    correctAnswer: "A", explanation: "$35+150(0.10)=$35+$15=$50",
    commonMistakes: [{label:"B",explanation:"Used 100 texts"},{label:"C",explanation:"Only added one text charge"}],
    skills: ["word-problems"], tags: ["word-problems","linear"]
  },
);

// ============ ELA-MAIN-IDEA (6) ============
const sleepPassage = "Sleep is one of the most important factors in maintaining good health, yet millions of Americans regularly fail to get enough of it. According to the Centers for Disease Control and Prevention, about one-third of U.S. adults report sleeping less than the recommended seven hours per night. The consequences of chronic sleep deprivation extend far beyond simple tiredness. Research has linked insufficient sleep to increased risks of heart disease, obesity, diabetes, and depression. Sleep deprivation also impairs cognitive function, affecting memory, decision-making, and reaction time. Studies show that driving while sleep-deprived can be just as dangerous as driving under the influence of alcohol. Despite these well-documented risks, our culture often celebrates overwork and treats sleep as a luxury rather than a necessity.";
const garbagePatchPassage = "The Great Pacific Garbage Patch is not, as many people imagine, a solid island of trash floating in the ocean. Instead, it is a vast area of the North Pacific where ocean currents converge, trapping millions of pieces of microplastics—tiny fragments smaller than a grain of rice—suspended throughout the water column. These microplastics are nearly impossible to see from the surface, which makes the problem both harder to visualize and harder to solve. Marine animals from tiny plankton to massive whales ingest these particles, introducing toxins into the food chain. Scientists have found microplastics in fish sold at markets, in sea salt, and even in drinking water. Cleanup efforts face enormous logistical challenges: the affected area is roughly twice the size of Texas, and removing microplastics without harming marine life requires technology that doesn't yet exist at scale.";
const homeworkPassage = "The debate over homework has intensified in recent years, with parents, educators, and researchers taking strong positions on both sides. Proponents argue that homework reinforces classroom learning, builds study habits, and prepares students for the demands of higher education. However, a growing body of research suggests that the benefits of homework are far less clear-cut than traditionally assumed, particularly for younger students. A landmark meta-analysis by Duke University professor Harris Cooper found that homework had little to no academic benefit for elementary school students and only moderate benefits for middle schoolers. For high school students, benefits plateaued at about two hours per night. Beyond these thresholds, additional homework was associated with increased stress, sleep deprivation, and diminished interest in learning.";
const turtlePassage = "Every year, thousands of sea turtle hatchlings emerge from their nests on Florida's beaches and make the perilous journey to the ocean. Historically, moonlight reflecting off the water guided them in the right direction. But today, artificial lights from beachfront hotels, restaurants, and streetlamps confuse the tiny creatures, drawing them inland instead of toward the sea. Disoriented hatchlings face dehydration, predators, and traffic. Conservation groups have responded by organizing volunteer patrols during nesting season, shielding problematic lights, and educating property owners about turtle-friendly lighting. Some coastal communities have passed ordinances requiring amber-colored, downward-facing lights during nesting months. These efforts have shown measurable results: in communities with lighting regulations, hatchling disorientation events have decreased by up to 60 percent.";
const beePassage = "Honeybees communicate the location of food sources through an elaborate movement known as the waggle dance. When a forager bee returns to the hive after finding nectar, it performs a figure-eight pattern on the honeycomb. The direction of the central waggle run indicates the direction of the food relative to the sun, while the duration of the waggle indicates distance. Other bees watch the dance closely and then fly out to find the food source. Karl von Frisch first decoded this remarkable communication system in the 1940s, earning a Nobel Prize for his work. Scientists have since discovered that the dance conveys additional information, including the quality of the food source and even the type of flower.";
const arenaPassage = "When the city council approved funding for a new downtown sports arena last month, supporters celebrated what they called a transformative investment. But a closer look at the numbers tells a different story. The $450 million project will be financed largely through public bonds, meaning taxpayers will shoulder most of the cost. Meanwhile, the team's billionaire owner will retain all revenue from ticket sales, concessions, and naming rights. Proponents point to projected job creation and increased tourism, but independent economists have repeatedly shown that publicly funded stadiums rarely deliver the promised economic windfall. A Brookings Institution study found that in 30 cities with new stadiums, per-capita income actually declined relative to comparable cities without new stadiums. The jobs created are overwhelmingly low-wage, part-time, and seasonal.";

questions.push(
  {
    section: "ela", category: "ela.reading.main_idea", difficulty: 1, type: "multiple_choice",
    stem: "What is the main idea of this passage?",
    stimulus: sleepPassage,
    options: [{label:"A",text:"Chronic sleep deprivation is a widespread health problem with serious consequences."},{label:"B",text:"Schools should start later."},{label:"C",text:"Driving while tired is dangerous."},{label:"D",text:"Americans need more exercise."}],
    correctAnswer: "A", explanation: "The passage covers prevalence and multiple consequences of sleep deprivation.",
    commonMistakes: [{label:"B",explanation:"Supporting detail"},{label:"C",explanation:"One specific example"}],
    skills: ["reading-comprehension"], tags: ["main-idea","reading"]
  },
  {
    section: "ela", category: "ela.reading.main_idea", difficulty: 2, type: "multiple_choice",
    stem: "What is the main idea of this passage?",
    stimulus: garbagePatchPassage,
    options: [{label:"A",text:"The Great Pacific Garbage Patch is a complex microplastic pollution problem that is difficult to clean up."},{label:"B",text:"The Garbage Patch is a solid island of trash."},{label:"C",text:"Marine animals are dying from plastic."},{label:"D",text:"We need better ocean cleanup technology."}],
    correctAnswer: "A", explanation: "The passage explains the true nature, impacts, and cleanup challenges.",
    commonMistakes: [{label:"B",explanation:"Passage contradicts this"},{label:"D",explanation:"Supporting detail"}],
    skills: ["reading-comprehension"], tags: ["main-idea","reading"]
  },
  {
    section: "ela", category: "ela.reading.main_idea", difficulty: 3, type: "multiple_choice",
    stem: "Which statement best summarizes the central argument?",
    stimulus: homeworkPassage,
    options: [{label:"A",text:"Research suggests homework's benefits are limited and may cause harm beyond certain thresholds."},{label:"B",text:"Homework should be eliminated."},{label:"C",text:"Homework is essential for study habits."},{label:"D",text:"Only high schoolers should get homework."}],
    correctAnswer: "A", explanation: "The passage presents research showing limited benefits and downsides.",
    commonMistakes: [{label:"B",explanation:"Not advocated"},{label:"C",explanation:"Opposing view in the passage"}],
    skills: ["reading-comprehension"], tags: ["main-idea","reading"]
  },
  {
    section: "ela", category: "ela.reading.authors_purpose", difficulty: 1, type: "multiple_choice",
    stem: "What is the author's primary purpose?",
    stimulus: beePassage,
    options: [{label:"A",text:"To explain how honeybees communicate about food sources"},{label:"B",text:"To persuade readers to protect honeybees"},{label:"C",text:"To describe Karl von Frisch's career"},{label:"D",text:"To compare insect communication methods"}],
    correctAnswer: "A", explanation: "The passage explains the waggle dance mechanism.",
    commonMistakes: [{label:"B",explanation:"No persuasive language"},{label:"C",explanation:"Von Frisch is mentioned but not the focus"}],
    skills: ["reading-comprehension"], tags: ["authors-purpose","reading"]
  },
  {
    section: "ela", category: "ela.reading.authors_purpose", difficulty: 2, type: "multiple_choice",
    stem: "What is the author's primary purpose?",
    stimulus: turtlePassage,
    options: [{label:"A",text:"To inform readers about light pollution's effect on sea turtles and conservation efforts"},{label:"B",text:"To persuade readers to buy turtle-friendly lighting"},{label:"C",text:"To entertain with a story about baby turtles"},{label:"D",text:"To argue hotels should be banned from beaches"}],
    correctAnswer: "A", explanation: "Presents factual info about problem and solutions.",
    commonMistakes: [{label:"B",explanation:"No direct call to action"},{label:"C",explanation:"Informational tone, not entertaining"}],
    skills: ["reading-comprehension"], tags: ["authors-purpose","reading"]
  },
  {
    section: "ela", category: "ela.reading.authors_purpose", difficulty: 3, type: "multiple_choice",
    stem: "What is the author's primary purpose?",
    stimulus: arenaPassage,
    options: [{label:"A",text:"To argue the publicly funded arena is a poor deal for taxpayers"},{label:"B",text:"To describe how arenas are built"},{label:"C",text:"To celebrate the new arena"},{label:"D",text:"To explain professional sports economics"}],
    correctAnswer: "A", explanation: "Critical language, counter-evidence, and rhetorical question show argument against the deal.",
    commonMistakes: [{label:"C",explanation:"Tone is critical"},{label:"D",explanation:"Focus is this specific deal"}],
    skills: ["reading-comprehension"], tags: ["authors-purpose","reading"]
  },
);

// ============ ELA-INFERENCE (4) ============
const abuelaPassage = "Abuela sat at the kitchen table, her weathered hands wrapped around a cup of coffee that had long gone cold. The suitcases by the door stood like sentinels, packed and ready. From the bedroom came the sounds of Sofia checking drawers one last time. Abuela traced the faded flowers on the tablecloth—the same tablecloth she'd brought from Mexico thirty years ago—and counted the scratches on the table where Sofia had done homework every night since first grade. When Sofia emerged with her backpack, Abuela stood and straightened the girl's collar, then pressed a small wooden cross into her palm. \"For the dorm room,\" she said, her voice steady even as her chin trembled. \"So you remember where you come from.\" Sofia hugged her so tightly that Abuela could feel the girl's heartbeat. After the taxi pulled away, Abuela sat back down and picked up the cold coffee. She didn't drink it. She just held it.";
const drChenPassage = "Dr. Chen stared at the data on her screen for the third hour straight. The clinical trial results were unmistakable: the experimental drug reduced tumor growth by 73 percent in mice—far exceeding their most optimistic projections. Her hands trembled slightly as she scrolled through the statistical analyses. Every p-value was significant. Every control group confirmed the findings. She picked up her phone, then set it down. It was two in the morning; her research partner was surely asleep. She paced the empty lab, running through potential confounding variables, looking for any flaw in the methodology. She found none. She sat back down and began drafting an email to the university's Institutional Review Board. The subject line read: \"Request for Phase 1 Human Trial Authorization.\"";
const windFarmPassage = "When the county announced plans to build a wind farm on the ridge above Millbrook, the response was swift and fierce. Within a week, \"No Turbines\" signs appeared on nearly every lawn on Main Street. At the town hall meeting, farmer Joe Kendrick stood and declared that his family had farmed that ridge for five generations. The mayor, who had initially supported the project, quietly withdrew her endorsement after receiving dozens of angry phone calls. Even the high school students, who had been studying renewable energy in science class, found themselves shouted down when they tried to present the environmental benefits at a PTA meeting. The wind energy company eventually withdrew its proposal.";
const farmTechPassage = "Modern agriculture bears little resemblance to the farming of even fifty years ago. GPS-guided tractors now plow fields with centimeter-level precision, reducing seed waste and fuel consumption. Drones equipped with multispectral cameras fly over crops, detecting pest infestations and nutrient deficiencies invisible to the naked eye. Soil sensors buried throughout fields transmit real-time moisture data to farmers' smartphones, allowing them to irrigate only when and where water is needed. Perhaps most transformative is the use of artificial intelligence: machine learning algorithms analyze decades of weather data, soil composition, and crop yields to generate planting recommendations tailored to individual fields. A single farmer today can manage operations that would have required a dozen workers a generation ago.";

questions.push(
  {
    section: "ela", category: "ela.reading.inference", difficulty: 2, type: "multiple_choice",
    stem: "What can you infer about the grandmother's feelings?",
    stimulus: abuelaPassage,
    options: [{label:"A",text:"She is proud but deeply sad about Sofia leaving."},{label:"B",text:"She is angry Sofia is going to college."},{label:"C",text:"She is indifferent."},{label:"D",text:"She is excited to be alone."}],
    correctAnswer: "A", explanation: "Steady voice=strength/pride, trembling chin and holding cold coffee=sadness.",
    commonMistakes: [{label:"B",explanation:"No anger; she gives a gift"},{label:"C",explanation:"Physical reactions show emotion"}],
    skills: ["reading-comprehension","inference"], tags: ["inference","reading"]
  },
  {
    section: "ela", category: "ela.reading.inference", difficulty: 3, type: "multiple_choice",
    stem: "What will Dr. Chen most likely do next?",
    stimulus: drChenPassage,
    options: [{label:"A",text:"Submit a request to begin human clinical trials"},{label:"B",text:"Discard the results"},{label:"C",text:"Call her partner immediately"},{label:"D",text:"Publish the mouse study first"}],
    correctAnswer: "A", explanation: "She's drafting the IRB email for Phase 1.",
    commonMistakes: [{label:"B",explanation:"No flaws found"},{label:"C",explanation:"Decided not to call at 2 AM"}],
    skills: ["reading-comprehension","inference"], tags: ["inference","reading"]
  },
  {
    section: "ela", category: "ela.reading.best_evidence", difficulty: 2, type: "multiple_choice",
    stem: "Which sentence best supports the idea that the town is resistant to change?",
    stimulus: windFarmPassage,
    options: [{label:"A",text:"\"Even the high school students...found themselves shouted down when they tried to present the environmental benefits.\""},{label:"B",text:"\"The county announced plans to build a wind farm.\""},{label:"C",text:"\"Farmer Joe Kendrick declared his family had farmed that ridge.\""},{label:"D",text:"\"The wind energy company withdrew its proposal.\""}],
    correctAnswer: "A", explanation: "Students shouted down for presenting facts=strongest evidence of resistance.",
    commonMistakes: [{label:"D",explanation:"Result of resistance, not evidence"},{label:"C",explanation:"One person's tradition attachment"}],
    skills: ["reading-comprehension","best-evidence"], tags: ["best-evidence","reading"]
  },
  {
    section: "ela", category: "ela.reading.best_evidence", difficulty: 3, type: "multiple_choice",
    stem: "Which detail best supports the claim that technology has changed farming?",
    stimulus: farmTechPassage,
    options: [{label:"A",text:"\"Machine learning algorithms analyze decades of weather data...to generate planting recommendations tailored to individual fields.\""},{label:"B",text:"\"Modern agriculture bears little resemblance to farming of fifty years ago.\""},{label:"C",text:"\"Critics worry that technological dependence makes farming vulnerable.\""},{label:"D",text:"\"A single farmer today can manage operations that would have required a dozen workers.\""}],
    correctAnswer: "A", explanation: "AI planting recommendations=most specific tech example.",
    commonMistakes: [{label:"B",explanation:"General claim, not evidence"},{label:"D",explanation:"Result, not the technology"}],
    skills: ["reading-comprehension","best-evidence"], tags: ["best-evidence","reading"]
  },
);

// ============ ELA-LITERARY (4) ============
const mayaPassage = "Maya hadn't visited her grandfather's house since she was ten. Now, at seventeen, she stood on the sagging porch and felt time press against her like a physical force. The old house groaned under the weight of its years, its shutters hanging at odd angles like crooked teeth. Inside, dust motes floated in shafts of light that cut through gaps in the curtains. The wallpaper, once bright with yellow roses, had faded to the color of old bone. She ran her fingers along the banister—smooth from decades of hands sliding over the same wood—and climbed the stairs to her grandfather's study. His reading glasses still sat on the desk, perched atop an open book as if he had merely stepped out for a moment. The clock on the mantel had stopped at 3:47, and Maya wondered if that was the exact moment everything in this house had frozen in place.";
const artPassage = "The school board's decision to cut the art program was, in a word, shortsighted. While administrators scramble to boost standardized test scores, they seem to have forgotten that education is about more than filling in bubbles on a scantron sheet. Art classes teach creativity, problem-solving, and emotional expression—skills that no multiple-choice test can measure. Studies consistently show that students involved in the arts perform better academically, have higher graduation rates, and demonstrate stronger critical thinking skills. Yet when budget cuts come, art is always first on the chopping block. One wonders whether the board members themselves benefited from art education in their own school days, or whether they've simply forgotten what it means to color outside the lines.";

questions.push(
  {
    section: "ela", category: "ela.reading.figurative_language", difficulty: 2, type: "multiple_choice",
    stem: "What literary device: \"The old house groaned under the weight of its years\"?",
    stimulus: mayaPassage,
    options: [{label:"A",text:"Personification"},{label:"B",text:"Simile"},{label:"C",text:"Hyperbole"},{label:"D",text:"Onomatopoeia"}],
    correctAnswer: "A", explanation: "House given human quality of groaning = personification.",
    commonMistakes: [{label:"B",explanation:"No comparison with like/as in that phrase"},{label:"D",explanation:"While groaned is a sound, the device is giving human traits to a house"}],
    skills: ["literary-analysis"], tags: ["literary","figurative-language"]
  },
  {
    section: "ela", category: "ela.reading.tone_mood", difficulty: 2, type: "multiple_choice",
    stem: "What is the mood of this passage?",
    stimulus: mayaPassage,
    options: [{label:"A",text:"Nostalgic and haunting"},{label:"B",text:"Cheerful and upbeat"},{label:"C",text:"Angry and resentful"},{label:"D",text:"Humorous and lighthearted"}],
    correctAnswer: "A", explanation: "Faded details, stopped clock, frozen imagery → nostalgic, haunting.",
    commonMistakes: [{label:"B",explanation:"Passage is wistful"},{label:"C",explanation:"No anger"}],
    skills: ["literary-analysis"], tags: ["literary","tone-mood"]
  },
  {
    section: "ela", category: "ela.reading.figurative_language", difficulty: 3, type: "multiple_choice",
    stem: "What does the stopped clock most likely symbolize?",
    stimulus: mayaPassage,
    options: [{label:"A",text:"Life in the house stopped when the grandfather left"},{label:"B",text:"Maya should buy a new clock"},{label:"C",text:"The house has no electricity"},{label:"D",text:"Time moves faster in old houses"}],
    correctAnswer: "A", explanation: "Clock symbolizes time frozen at the grandfather's departure.",
    commonMistakes: [{label:"C",explanation:"Literal interpretation misses symbolism"},{label:"D",explanation:"Contradicts imagery"}],
    skills: ["literary-analysis"], tags: ["literary","symbolism"]
  },
  {
    section: "ela", category: "ela.reading.tone_mood", difficulty: 1, type: "multiple_choice",
    stem: "What is the author's tone?",
    stimulus: artPassage,
    options: [{label:"A",text:"Critical and sarcastic"},{label:"B",text:"Objective and neutral"},{label:"C",text:"Sad and hopeless"},{label:"D",text:"Enthusiastic and supportive"}],
    correctAnswer: "A", explanation: "\"Shortsighted,\" \"seem to have forgotten,\" rhetorical question = critical, sarcastic.",
    commonMistakes: [{label:"B",explanation:"Author clearly takes a side"},{label:"D",explanation:"Critical of the decision, not supportive"}],
    skills: ["literary-analysis"], tags: ["literary","tone"]
  },
);

// ============ ELA-GRAMMAR (23) ============
questions.push(
  {
    section: "ela", category: "ela.revising.grammar.subject_verb", difficulty: 1, type: "multiple_choice",
    stem: "Choose the correct sentence.",
    options: [{label:"A",text:"The box of chocolates was on the table."},{label:"B",text:"The box of chocolates were on the table."},{label:"C",text:"The box of chocolates are on the table."},{label:"D",text:"The box of chocolates have been on the table."}],
    correctAnswer: "A", explanation: "Subject is 'box' (singular) → 'was'",
    commonMistakes: [{label:"B",explanation:"Matched to 'chocolates' not 'box'"},{label:"C",explanation:"Same error, present tense"}],
    skills: ["subject-verb-agreement"], tags: ["grammar","subject-verb"]
  },
  {
    section: "ela", category: "ela.revising.grammar.subject_verb", difficulty: 2, type: "multiple_choice",
    stem: "Choose the correct verb: \"The committee ___ to meet every Thursday.\"",
    options: [{label:"A",text:"plans"},{label:"B",text:"plan"},{label:"C",text:"are planning"},{label:"D",text:"have planned"}],
    correctAnswer: "A", explanation: "Collective noun acting as unit → singular 'plans'",
    commonMistakes: [{label:"B",explanation:"Treated as plural"},{label:"C",explanation:"Plural 'are'"}],
    skills: ["subject-verb-agreement"], tags: ["grammar","subject-verb"]
  },
  {
    section: "ela", category: "ela.revising.grammar.subject_verb", difficulty: 3, type: "multiple_choice",
    stem: "\"Neither the teacher nor the students ___ aware of the change.\"",
    options: [{label:"A",text:"were"},{label:"B",text:"was"},{label:"C",text:"is"},{label:"D",text:"has been"}],
    correctAnswer: "A", explanation: "Verb agrees with closer subject 'students' (plural) → 'were'",
    commonMistakes: [{label:"B",explanation:"Matched to 'teacher'"},{label:"C",explanation:"Wrong number and tense"}],
    skills: ["subject-verb-agreement"], tags: ["grammar","subject-verb"]
  },
  {
    section: "ela", category: "ela.revising.grammar.fragments", difficulty: 1, type: "multiple_choice",
    stem: "Which is a complete sentence?",
    options: [{label:"A",text:"The dog ran across the field."},{label:"B",text:"Running across the field quickly."},{label:"C",text:"Because the dog was hungry."},{label:"D",text:"The dog that ran."}],
    correctAnswer: "A", explanation: "Has subject and complete predicate.",
    commonMistakes: [{label:"B",explanation:"Participial phrase (fragment)"},{label:"C",explanation:"Subordinate clause"}],
    skills: ["fragments"], tags: ["grammar","fragments"]
  },
  {
    section: "ela", category: "ela.revising.grammar.fragments", difficulty: 2, type: "multiple_choice",
    stem: "Best fix for: \"Although the weather was beautiful.\"",
    options: [{label:"A",text:"Although the weather was beautiful, we stayed inside."},{label:"B",text:"Although. The weather was beautiful."},{label:"C",text:"Although the weather was beautiful and."},{label:"D",text:"Although, the weather was beautiful!"}],
    correctAnswer: "A", explanation: "Adding independent clause completes it.",
    commonMistakes: [{label:"B",explanation:"Creates two fragments"},{label:"D",explanation:"Punctuation doesn't fix dependent clause"}],
    skills: ["fragments"], tags: ["grammar","fragments"]
  },
  {
    section: "ela", category: "ela.revising.grammar.fragments", difficulty: 3, type: "multiple_choice",
    stem: "Which is a sentence fragment?",
    options: [{label:"A",text:"While waiting for the bus in the rain."},{label:"B",text:"She waited for the bus."},{label:"C",text:"The bus arrived late, and she was soaked."},{label:"D",text:"Waiting was difficult, but she managed."}],
    correctAnswer: "A", explanation: "Subordinate clause with no independent clause = fragment.",
    commonMistakes: [{label:"B",explanation:"Complete sentence"},{label:"C",explanation:"Compound sentence, complete"}],
    skills: ["fragments"], tags: ["grammar","fragments"]
  },
  {
    section: "ela", category: "ela.revising.grammar.run_ons", difficulty: 1, type: "multiple_choice",
    stem: "Fix: \"I love pizza I eat it every day.\"",
    options: [{label:"A",text:"I love pizza; I eat it every day."},{label:"B",text:"I love pizza I, eat it every day."},{label:"C",text:"I love, pizza I eat it every day."},{label:"D",text:"I love pizza I eat, it every day."}],
    correctAnswer: "A", explanation: "Semicolon joins two related independent clauses.",
    commonMistakes: [{label:"B",explanation:"Comma in wrong place"},{label:"C",explanation:"Doesn't separate clauses"}],
    skills: ["run-ons"], tags: ["grammar","run-ons"]
  },
  {
    section: "ela", category: "ela.revising.grammar.run_ons", difficulty: 2, type: "multiple_choice",
    stem: "Which is a run-on?",
    options: [{label:"A",text:"The movie was long it lasted three hours."},{label:"B",text:"The movie was long, but entertaining."},{label:"C",text:"Although long, I enjoyed it."},{label:"D",text:"The movie, which was three hours, was good."}],
    correctAnswer: "A", explanation: "Two independent clauses with no punctuation.",
    commonMistakes: [{label:"B",explanation:"Correctly joined"},{label:"C",explanation:"Correct subordinate clause"}],
    skills: ["run-ons"], tags: ["grammar","run-ons"]
  },
  {
    section: "ela", category: "ela.revising.grammar.run_ons", difficulty: 3, type: "multiple_choice",
    stem: "Best fix: \"The experiment failed the scientists revised their hypothesis they tried again.\"",
    options: [{label:"A",text:"The experiment failed, so the scientists revised their hypothesis and tried again."},{label:"B",text:"The experiment failed, the scientists revised their hypothesis, they tried again."},{label:"C",text:"The experiment failed the scientists, revised their hypothesis they tried again."},{label:"D",text:"The experiment failed; the scientists; revised their hypothesis; they tried again."}],
    correctAnswer: "A", explanation: "Uses conjunction 'so' and 'and' properly.",
    commonMistakes: [{label:"B",explanation:"Still comma splices"},{label:"D",explanation:"Excessive semicolons"}],
    skills: ["run-ons"], tags: ["grammar","run-ons"]
  },
  {
    section: "ela", category: "ela.revising.grammar.parallel_structure", difficulty: 1, type: "multiple_choice",
    stem: "Which uses parallel structure correctly?",
    options: [{label:"A",text:"She likes swimming, biking, and running."},{label:"B",text:"She likes swimming, to bike, and running."},{label:"C",text:"She likes swimming, biking, and to run."},{label:"D",text:"She likes to swim, biking, and running."}],
    correctAnswer: "A", explanation: "All gerunds: swimming, biking, running.",
    commonMistakes: [{label:"B",explanation:"Mixes forms"},{label:"C",explanation:"Last item breaks pattern"}],
    skills: ["parallel-structure"], tags: ["grammar","parallel-structure"]
  },
  {
    section: "ela", category: "ela.revising.grammar.parallel_structure", difficulty: 2, type: "multiple_choice",
    stem: "Fix: \"The coach told players to stretch, that they should hydrate, and running laps.\"",
    options: [{label:"A",text:"The coach told the players to stretch, to hydrate, and to run laps."},{label:"B",text:"The coach told the players stretching, hydrating, and running."},{label:"C",text:"The coach told the players to stretch, hydrate, and running laps."},{label:"D",text:"The coach told players they should stretch, hydrating, and to run."}],
    correctAnswer: "A", explanation: "All infinitives: to stretch, to hydrate, to run.",
    commonMistakes: [{label:"B",explanation:"Awkward after 'told'"},{label:"C",explanation:"Third item breaks pattern"}],
    skills: ["parallel-structure"], tags: ["grammar","parallel-structure"]
  },
  {
    section: "ela", category: "ela.revising.grammar.parallel_structure", difficulty: 3, type: "multiple_choice",
    stem: "Which demonstrates correct parallel structure?",
    options: [{label:"A",text:"The report was thorough in research, clear in conclusions, and persuasive in recommendations."},{label:"B",text:"The report was thorough in research, concluded clearly, and its recommendations were persuasive."},{label:"C",text:"The report had thorough research, clear conclusions, and it was persuasive."},{label:"D",text:"The report was thorough in research, clearly concluded, and persuasive recommendations."}],
    correctAnswer: "A", explanation: "Each: adjective + prepositional phrase.",
    commonMistakes: [{label:"B",explanation:"Switches between forms"},{label:"C",explanation:"Last item is a clause"}],
    skills: ["parallel-structure"], tags: ["grammar","parallel-structure"]
  },
  {
    section: "ela", category: "ela.revising.grammar.verb_tense", difficulty: 1, type: "multiple_choice",
    stem: "\"Yesterday, she ___ to the store.\"",
    options: [{label:"A",text:"went"},{label:"B",text:"goes"},{label:"C",text:"going"},{label:"D",text:"will go"}],
    correctAnswer: "A", explanation: "'Yesterday' = past tense → 'went'",
    commonMistakes: [{label:"B",explanation:"Present doesn't match 'yesterday'"},{label:"D",explanation:"Future contradicts 'yesterday'"}],
    skills: ["verb-tense"], tags: ["grammar","verb-tense"]
  },
  {
    section: "ela", category: "ela.revising.grammar.verb_tense", difficulty: 2, type: "multiple_choice",
    stem: "Fix tense shift: \"She walked to school and sees her friend.\"",
    options: [{label:"A",text:"She walked to school and saw her friend."},{label:"B",text:"She walking to school and seeing her friend."},{label:"C",text:"She walked to school and will see her friend."},{label:"D",text:"She walk to school and sees her friend."}],
    correctAnswer: "A", explanation: "Both verbs in past tense for consistency.",
    commonMistakes: [{label:"C",explanation:"Introduces past-to-future shift"},{label:"D",explanation:"Incorrect verb form"}],
    skills: ["verb-tense"], tags: ["grammar","verb-tense"]
  },
  {
    section: "ela", category: "ela.revising.grammar.verb_tense", difficulty: 3, type: "multiple_choice",
    stem: "Correct past perfect usage?",
    options: [{label:"A",text:"By the time we arrived, the movie had already started."},{label:"B",text:"By the time we arrived, the movie already started."},{label:"C",text:"By the time we arrived, the movie has already started."},{label:"D",text:"By the time we arrived, the movie already starts."}],
    correctAnswer: "A", explanation: "'Had started' shows action before 'arrived'.",
    commonMistakes: [{label:"B",explanation:"Simple past less clear"},{label:"C",explanation:"Present perfect doesn't match past context"}],
    skills: ["verb-tense"], tags: ["grammar","verb-tense"]
  },
  {
    section: "ela", category: "ela.revising.grammar.pronoun_antecedent", difficulty: 1, type: "multiple_choice",
    stem: "\"Every student must bring ___ own pencil.\"",
    options: [{label:"A",text:"their"},{label:"B",text:"its"},{label:"C",text:"our"},{label:"D",text:"your"}],
    correctAnswer: "A", explanation: "'Their' is accepted for 'every student'.",
    commonMistakes: [{label:"B",explanation:"'Its' is for objects"},{label:"C",explanation:"Wrong person"}],
    skills: ["pronoun-antecedent"], tags: ["grammar","pronoun-antecedent"]
  },
  {
    section: "ela", category: "ela.revising.grammar.pronoun_antecedent", difficulty: 2, type: "multiple_choice",
    stem: "Which has a clear pronoun reference?",
    options: [{label:"A",text:"When Maria called Lisa, Maria said she had great news."},{label:"B",text:"When Maria called Lisa, she said she had great news."},{label:"C",text:"Maria called Lisa and she told her."},{label:"D",text:"Maria and Lisa, she called her."}],
    correctAnswer: "A", explanation: "Repeating 'Maria' clarifies who 'she' is.",
    commonMistakes: [{label:"B",explanation:"Unclear which 'she'"},{label:"C",explanation:"Both pronouns ambiguous"}],
    skills: ["pronoun-antecedent"], tags: ["grammar","pronoun-antecedent"]
  },
  {
    section: "ela", category: "ela.revising.grammar.pronoun_antecedent", difficulty: 3, type: "multiple_choice",
    stem: "Fix: \"The company told their employees that they were restructuring.\"",
    options: [{label:"A",text:"The company told its employees that the company was restructuring."},{label:"B",text:"The company told their employees that they were restructuring."},{label:"C",text:"They told them they were restructuring."},{label:"D",text:"The company told employees they restructured."}],
    correctAnswer: "A", explanation: "'Its' for singular company, repeat 'company' to clarify 'they'.",
    commonMistakes: [{label:"B",explanation:"Original unclear sentence"},{label:"C",explanation:"Even more ambiguous"}],
    skills: ["pronoun-antecedent"], tags: ["grammar","pronoun-antecedent"]
  },
  {
    section: "ela", category: "ela.revising.grammar.comma_splice", difficulty: 1, type: "multiple_choice",
    stem: "Which is a comma splice?",
    options: [{label:"A",text:"I was tired, I went to bed early."},{label:"B",text:"I was tired, so I went to bed early."},{label:"C",text:"Because I was tired, I went to bed early."},{label:"D",text:"I was tired; I went to bed early."}],
    correctAnswer: "A", explanation: "Two independent clauses joined only by a comma = comma splice.",
    commonMistakes: [{label:"B",explanation:"Correctly uses coordinating conjunction"},{label:"D",explanation:"Semicolon is correct"}],
    skills: ["comma-splice"], tags: ["grammar","comma-splice"]
  },
  {
    section: "ela", category: "ela.revising.grammar.comma_splice", difficulty: 2, type: "multiple_choice",
    stem: "Fix: \"The rain stopped, we went outside.\"",
    options: [{label:"A",text:"The rain stopped, so we went outside."},{label:"B",text:"The rain stopped, we, went outside."},{label:"C",text:"The rain, stopped we went outside."},{label:"D",text:"The rain stopped we went, outside."}],
    correctAnswer: "A", explanation: "Adding 'so' (FANBOYS conjunction) fixes the comma splice.",
    commonMistakes: [{label:"B",explanation:"Random comma placement"},{label:"C",explanation:"Breaks the first clause"}],
    skills: ["comma-splice"], tags: ["grammar","comma-splice"]
  },
  {
    section: "ela", category: "ela.revising.grammar.comma_splice", difficulty: 3, type: "multiple_choice",
    stem: "Which correctly fixes: \"She studied hard, she passed the test, she celebrated afterward.\"",
    options: [{label:"A",text:"She studied hard, passed the test, and celebrated afterward."},{label:"B",text:"She studied hard; she passed the test; she celebrated afterward."},{label:"C",text:"She studied hard she passed the test she celebrated afterward."},{label:"D",text:"Both A and B are acceptable."}],
    correctAnswer: "D", explanation: "A uses a compound predicate; B uses semicolons. Both are correct.",
    commonMistakes: [{label:"A",explanation:"Correct but B is also correct"},{label:"C",explanation:"Creates a run-on"}],
    skills: ["comma-splice"], tags: ["grammar","comma-splice"]
  },
  {
    section: "ela", category: "ela.revising.grammar.subject_verb", difficulty: 2, type: "multiple_choice",
    stem: "\"Here ___ the results of the experiment.\"",
    options: [{label:"A",text:"are"},{label:"B",text:"is"},{label:"C",text:"was"},{label:"D",text:"has been"}],
    correctAnswer: "A", explanation: "Subject is 'results' (plural), inverted sentence → 'are'",
    commonMistakes: [{label:"B",explanation:"'Here' is not the subject; 'results' is plural"},{label:"C",explanation:"Wrong number"}],
    skills: ["subject-verb-agreement"], tags: ["grammar","subject-verb"]
  },
  {
    section: "ela", category: "ela.revising.grammar.verb_tense", difficulty: 1, type: "multiple_choice",
    stem: "\"By next summer, I ___ graduated.\"",
    options: [{label:"A",text:"will have"},{label:"B",text:"have"},{label:"C",text:"had"},{label:"D",text:"am"}],
    correctAnswer: "A", explanation: "Future perfect for action completed before future time.",
    commonMistakes: [{label:"B",explanation:"Present perfect, not future"},{label:"C",explanation:"Past perfect, wrong direction"}],
    skills: ["verb-tense"], tags: ["grammar","verb-tense"]
  },
);

// ============ ELA-PUNCTUATION (10) ============
questions.push(
  {
    section: "ela", category: "ela.revising.grammar.comma_usage", difficulty: 1, type: "multiple_choice",
    stem: "Correct comma placement: \"Before dinner we washed our hands.\"",
    options: [{label:"A",text:"Before dinner, we washed our hands."},{label:"B",text:"Before, dinner we washed our hands."},{label:"C",text:"Before dinner we, washed our hands."},{label:"D",text:"No comma needed."}],
    correctAnswer: "A", explanation: "Comma after introductory phrase.",
    commonMistakes: [{label:"B",explanation:"Comma in wrong place"},{label:"D",explanation:"Introductory phrases need commas"}],
    skills: ["comma-usage"], tags: ["punctuation","commas"]
  },
  {
    section: "ela", category: "ela.revising.grammar.comma_usage", difficulty: 2, type: "multiple_choice",
    stem: "Which sentence uses commas correctly?",
    options: [{label:"A",text:"My sister, who lives in Boston, is visiting next week."},{label:"B",text:"My sister who lives in Boston, is visiting next week."},{label:"C",text:"My sister, who lives in Boston is visiting next week."},{label:"D",text:"My sister who lives in Boston is visiting, next week."}],
    correctAnswer: "A", explanation: "Nonrestrictive clause needs commas on both sides.",
    commonMistakes: [{label:"B",explanation:"Missing first comma"},{label:"C",explanation:"Missing second comma"}],
    skills: ["comma-usage"], tags: ["punctuation","commas"]
  },
  {
    section: "ela", category: "ela.revising.grammar.comma_usage", difficulty: 3, type: "multiple_choice",
    stem: "Correct: \"The tall dark and handsome stranger entered.\"",
    options: [{label:"A",text:"The tall, dark, and handsome stranger entered."},{label:"B",text:"The tall dark, and handsome stranger entered."},{label:"C",text:"The tall, dark and, handsome stranger entered."},{label:"D",text:"The, tall, dark, and, handsome stranger entered."}],
    correctAnswer: "A", explanation: "Commas separate coordinate adjectives in a series.",
    commonMistakes: [{label:"B",explanation:"Missing first comma"},{label:"D",explanation:"Excessive commas"}],
    skills: ["comma-usage"], tags: ["punctuation","commas"]
  },
  {
    section: "ela", category: "ela.revising.grammar.semicolon_colon", difficulty: 1, type: "multiple_choice",
    stem: "Which correctly uses a semicolon?",
    options: [{label:"A",text:"I enjoy reading; my brother prefers sports."},{label:"B",text:"I enjoy; reading my brother prefers sports."},{label:"C",text:"I enjoy reading my; brother prefers sports."},{label:"D",text:"I enjoy reading, my brother; prefers sports."}],
    correctAnswer: "A", explanation: "Semicolon joins two related independent clauses.",
    commonMistakes: [{label:"B",explanation:"Splits subject from verb"},{label:"D",explanation:"Random semicolon placement"}],
    skills: ["semicolon-usage"], tags: ["punctuation","semicolons"]
  },
  {
    section: "ela", category: "ela.revising.grammar.semicolon_colon", difficulty: 2, type: "multiple_choice",
    stem: "Which correctly uses a colon?",
    options: [{label:"A",text:"She needed three things: a pen, paper, and an eraser."},{label:"B",text:"She needed: three things a pen, paper, and an eraser."},{label:"C",text:"She: needed three things a pen, paper, and an eraser."},{label:"D",text:"She needed three things a pen: paper, and an eraser."}],
    correctAnswer: "A", explanation: "Colon after a complete sentence introduces a list.",
    commonMistakes: [{label:"B",explanation:"Colon interrupts the sentence"},{label:"D",explanation:"Colon in wrong position"}],
    skills: ["colon-usage"], tags: ["punctuation","colons"]
  },
  {
    section: "ela", category: "ela.revising.grammar.semicolon_colon", difficulty: 3, type: "multiple_choice",
    stem: "Which is correct?",
    options: [{label:"A",text:"The city has many parks; however, few are well-maintained."},{label:"B",text:"The city has many parks, however, few are well-maintained."},{label:"C",text:"The city has many parks however; few are well-maintained."},{label:"D",text:"The city has many parks however few are well-maintained."}],
    correctAnswer: "A", explanation: "Semicolon before conjunctive adverb 'however', comma after.",
    commonMistakes: [{label:"B",explanation:"Comma splice with 'however'"},{label:"D",explanation:"Run-on sentence"}],
    skills: ["semicolon-usage"], tags: ["punctuation","semicolons"]
  },
  {
    section: "ela", category: "ela.revising.mechanics.apostrophes", difficulty: 1, type: "multiple_choice",
    stem: "Which correctly shows possession?",
    options: [{label:"A",text:"The dog's bone was buried."},{label:"B",text:"The dogs bone was buried."},{label:"C",text:"The dog's bone was burie'd."},{label:"D",text:"The dogs' bone was buried."}],
    correctAnswer: "A", explanation: "Singular possessive: dog's.",
    commonMistakes: [{label:"B",explanation:"Missing apostrophe"},{label:"D",explanation:"Plural possessive for one dog"}],
    skills: ["apostrophes"], tags: ["punctuation","apostrophes"]
  },
  {
    section: "ela", category: "ela.revising.mechanics.apostrophes", difficulty: 2, type: "multiple_choice",
    stem: "Which is correct for multiple children owning toys?",
    options: [{label:"A",text:"The children's toys were scattered."},{label:"B",text:"The childrens' toys were scattered."},{label:"C",text:"The childrens toys were scattered."},{label:"D",text:"The children toys' were scattered."}],
    correctAnswer: "A", explanation: "Irregular plural 'children' → children's.",
    commonMistakes: [{label:"B",explanation:"'Childrens' is not a word"},{label:"C",explanation:"Missing apostrophe"}],
    skills: ["apostrophes"], tags: ["punctuation","apostrophes"]
  },
  {
    section: "ela", category: "ela.revising.mechanics.apostrophes", difficulty: 3, type: "multiple_choice",
    stem: "Which sentence uses apostrophes correctly?",
    options: [{label:"A",text:"It's been a long day, and the cat licked its paws."},{label:"B",text:"Its been a long day, and the cat licked it's paws."},{label:"C",text:"It's been a long day, and the cat licked it's paws."},{label:"D",text:"Its been a long day, and the cat licked its paws."}],
    correctAnswer: "A", explanation: "It's = it is. Its = possessive.",
    commonMistakes: [{label:"B",explanation:"Reversed both"},{label:"C",explanation:"Second 'it's' should be 'its'"}],
    skills: ["apostrophes"], tags: ["punctuation","apostrophes"]
  },
  {
    section: "ela", category: "ela.revising.grammar.comma_usage", difficulty: 2, type: "multiple_choice",
    stem: "\"I went to the store and I bought milk bread and eggs.\"",
    options: [{label:"A",text:"I went to the store, and I bought milk, bread, and eggs."},{label:"B",text:"I went to the store and I bought milk bread, and eggs."},{label:"C",text:"I went, to the store and I bought milk bread and eggs."},{label:"D",text:"I went to the store and, I bought milk bread and eggs."}],
    correctAnswer: "A", explanation: "Comma before 'and' joining independent clauses; commas in list.",
    commonMistakes: [{label:"B",explanation:"Missing comma before 'and' and in list"},{label:"C",explanation:"Comma in wrong place"}],
    skills: ["comma-usage"], tags: ["punctuation","commas"]
  },
);

// ============ ELA-STYLE (14) ============
questions.push(
  {
    section: "ela", category: "ela.revising.grammar.word_choice", difficulty: 1, type: "multiple_choice",
    stem: "Replace the vague word: \"The food was really good.\"",
    options: [{label:"A",text:"delicious"},{label:"B",text:"very good"},{label:"C",text:"nice"},{label:"D",text:"fine"}],
    correctAnswer: "A", explanation: "'Delicious' is more precise and vivid than 'good'.",
    commonMistakes: [{label:"B",explanation:"Still vague"},{label:"C",explanation:"Even less precise"}],
    skills: ["precise-language"], tags: ["style","word-choice"]
  },
  {
    section: "ela", category: "ela.revising.grammar.word_choice", difficulty: 1, type: "multiple_choice",
    stem: "Replace: \"He got a prize.\"",
    options: [{label:"A",text:"received"},{label:"B",text:"got"},{label:"C",text:"had"},{label:"D",text:"took"}],
    correctAnswer: "A", explanation: "'Received' is more formal and precise.",
    commonMistakes: [{label:"B",explanation:"Same vague word"},{label:"D",explanation:"Changes meaning"}],
    skills: ["precise-language"], tags: ["style","word-choice"]
  },
  {
    section: "ela", category: "ela.revising.grammar.word_choice", difficulty: 2, type: "multiple_choice",
    stem: "Replace: \"She went through the data.\"",
    options: [{label:"A",text:"analyzed"},{label:"B",text:"looked at"},{label:"C",text:"saw"},{label:"D",text:"checked"}],
    correctAnswer: "A", explanation: "'Analyzed' is more precise and academic.",
    commonMistakes: [{label:"B",explanation:"Still vague"},{label:"C",explanation:"Even less precise"}],
    skills: ["precise-language"], tags: ["style","word-choice"]
  },
  {
    section: "ela", category: "ela.revising.grammar.word_choice", difficulty: 3, type: "multiple_choice",
    stem: "Replace: \"The scientist said the results were important.\"",
    options: [{label:"A",text:"emphasized"},{label:"B",text:"said"},{label:"C",text:"told"},{label:"D",text:"mentioned"}],
    correctAnswer: "A", explanation: "'Emphasized' conveys the strength of the scientist's communication.",
    commonMistakes: [{label:"D",explanation:"'Mentioned' implies less importance"},{label:"B",explanation:"Same generic verb"}],
    skills: ["precise-language"], tags: ["style","word-choice"]
  },
  {
    section: "ela", category: "ela.revising.style.conciseness", difficulty: 1, type: "multiple_choice",
    stem: "Make concise: \"Due to the fact that it was raining, we stayed inside.\"",
    options: [{label:"A",text:"Because it was raining, we stayed inside."},{label:"B",text:"Due to the fact that rain was happening, we stayed inside."},{label:"C",text:"Owing to the fact that it was raining outside, we stayed inside the house."},{label:"D",text:"It was raining, and for that reason, we decided to stay inside."}],
    correctAnswer: "A", explanation: "'Because' replaces wordy 'due to the fact that'.",
    commonMistakes: [{label:"B",explanation:"Even wordier"},{label:"D",explanation:"Still unnecessarily wordy"}],
    skills: ["conciseness"], tags: ["style","conciseness"]
  },
  {
    section: "ela", category: "ela.revising.style.conciseness", difficulty: 2, type: "multiple_choice",
    stem: "Make concise: \"At this point in time, we are currently investigating the matter.\"",
    options: [{label:"A",text:"We are investigating the matter."},{label:"B",text:"At this point in time, we are looking into this matter currently."},{label:"C",text:"Currently at this time, we are investigating."},{label:"D",text:"At the present time, we are in the process of investigating the matter."}],
    correctAnswer: "A", explanation: "Removes redundant phrases.",
    commonMistakes: [{label:"B",explanation:"Even wordier"},{label:"D",explanation:"Adds more filler"}],
    skills: ["conciseness"], tags: ["style","conciseness"]
  },
  {
    section: "ela", category: "ela.revising.style.conciseness", difficulty: 3, type: "multiple_choice",
    stem: "Make concise: \"The reason why she left is because she was feeling sick.\"",
    options: [{label:"A",text:"She left because she was sick."},{label:"B",text:"The reason she left is because she was not feeling well at all."},{label:"C",text:"She left for the reason that she was feeling sick."},{label:"D",text:"Because of the fact that she was sick, she decided to leave."}],
    correctAnswer: "A", explanation: "Eliminates redundant 'the reason why...is because'.",
    commonMistakes: [{label:"B",explanation:"Still has the redundancy plus more words"},{label:"D",explanation:"'Because of the fact that' is wordy"}],
    skills: ["conciseness"], tags: ["style","conciseness"]
  },
  {
    section: "ela", category: "ela.revising.style.precise_language", difficulty: 1, type: "multiple_choice",
    stem: "Which is more precise? \"The building was big.\"",
    options: [{label:"A",text:"The skyscraper towered over the surrounding blocks."},{label:"B",text:"The building was very big."},{label:"C",text:"The building was really large and tall."},{label:"D",text:"It was a big building."}],
    correctAnswer: "A", explanation: "'Skyscraper' and 'towered' give specific, vivid information.",
    commonMistakes: [{label:"B",explanation:"Adding 'very' doesn't add precision"},{label:"C",explanation:"Stacking vague adjectives doesn't help"}],
    skills: ["precise-language"], tags: ["style","precise-language"]
  },
  {
    section: "ela", category: "ela.revising.style.precise_language", difficulty: 2, type: "multiple_choice",
    stem: "Which revision is most precise? \"The dog moved across the yard.\"",
    options: [{label:"A",text:"The golden retriever bounded across the freshly mowed lawn."},{label:"B",text:"The dog went across the yard quickly."},{label:"C",text:"The animal moved through the outside area."},{label:"D",text:"The dog ran in the yard."}],
    correctAnswer: "A", explanation: "Specific breed, action verb, descriptive detail.",
    commonMistakes: [{label:"B",explanation:"'Went quickly' is still vague"},{label:"C",explanation:"Even more vague"}],
    skills: ["precise-language"], tags: ["style","precise-language"]
  },
  {
    section: "ela", category: "ela.revising.style.precise_language", difficulty: 3, type: "multiple_choice",
    stem: "Which is most precise? \"She felt bad about what happened.\"",
    options: [{label:"A",text:"She was overcome with guilt for her role in the misunderstanding."},{label:"B",text:"She felt very bad about the thing that happened."},{label:"C",text:"She was sad about it."},{label:"D",text:"She didn't feel good about the situation."}],
    correctAnswer: "A", explanation: "Names the specific emotion (guilt) and context.",
    commonMistakes: [{label:"B",explanation:"'Very bad' and 'the thing' are vague"},{label:"C",explanation:"'Sad' may not be the right emotion"}],
    skills: ["precise-language"], tags: ["style","precise-language"]
  },
  {
    section: "ela", category: "ela.revising.grammar.word_choice", difficulty: 2, type: "multiple_choice",
    stem: "Replace: \"The teacher was mad at the students.\"",
    options: [{label:"A",text:"frustrated with"},{label:"B",text:"mad at"},{label:"C",text:"angry at"},{label:"D",text:"upset at"}],
    correctAnswer: "A", explanation: "'Frustrated with' is more nuanced and academic than 'mad at'.",
    commonMistakes: [{label:"B",explanation:"Same informal word"},{label:"C",explanation:"Better but 'frustrated' is most precise"}],
    skills: ["precise-language"], tags: ["style","word-choice"]
  },
  {
    section: "ela", category: "ela.revising.style.conciseness", difficulty: 2, type: "multiple_choice",
    stem: "Make concise: \"In my opinion, I think that the book was enjoyable.\"",
    options: [{label:"A",text:"The book was enjoyable."},{label:"B",text:"In my opinion, I believe the book was quite enjoyable."},{label:"C",text:"I think that in my opinion the book was good."},{label:"D",text:"Personally, I think that the book was enjoyable to me."}],
    correctAnswer: "A", explanation: "'In my opinion' and 'I think' are redundant with each other; remove both for directness.",
    commonMistakes: [{label:"B",explanation:"Even more redundant"},{label:"D",explanation:"Triple redundancy"}],
    skills: ["conciseness"], tags: ["style","conciseness"]
  },
  {
    section: "ela", category: "ela.revising.style.conciseness", difficulty: 1, type: "multiple_choice",
    stem: "Make concise: \"She is a person who always arrives early.\"",
    options: [{label:"A",text:"She always arrives early."},{label:"B",text:"She is someone who is a person that arrives early."},{label:"C",text:"She, being a person who is punctual, arrives early."},{label:"D",text:"She is always an early arriver as a person."}],
    correctAnswer: "A", explanation: "Remove 'is a person who' for directness.",
    commonMistakes: [{label:"B",explanation:"Even wordier"},{label:"C",explanation:"Adds unnecessary clause"}],
    skills: ["conciseness"], tags: ["style","conciseness"]
  },
  {
    section: "ela", category: "ela.revising.grammar.word_choice", difficulty: 3, type: "multiple_choice",
    stem: "Which verb best replaces 'walked' for this context: \"The soldier walked into the room after the victory.\"",
    options: [{label:"A",text:"strode"},{label:"B",text:"tiptoed"},{label:"C",text:"stumbled"},{label:"D",text:"crawled"}],
    correctAnswer: "A", explanation: "'Strode' conveys confidence befitting a victory.",
    commonMistakes: [{label:"B",explanation:"Implies stealth, not victory"},{label:"C",explanation:"Implies weakness"}],
    skills: ["precise-language"], tags: ["style","word-choice"]
  },
);

// ============ ELA-PASSAGE-REVISION (5) ============
questions.push(
  {
    section: "ela", category: "ela.revising.passage.best_transition", difficulty: 1, type: "multiple_choice",
    stem: "Paragraph 1 discusses the benefits of recycling. Paragraph 2 discusses its limitations. Which transition best connects them?",
    options: [{label:"A",text:"However"},{label:"B",text:"Therefore"},{label:"C",text:"Similarly"},{label:"D",text:"In addition"}],
    correctAnswer: "A", explanation: "Contrasting ideas need a contrast transition.",
    commonMistakes: [{label:"B",explanation:"'Therefore' shows cause-effect"},{label:"C",explanation:"'Similarly' shows agreement"}],
    skills: ["passage-transitions"], tags: ["passage-revision","transitions"]
  },
  {
    section: "ela", category: "ela.revising.passage.best_transition", difficulty: 2, type: "multiple_choice",
    stem: "Paragraph 1 presents data on pollution. Paragraph 2 presents a possible solution. Best transition?",
    options: [{label:"A",text:"To address this issue"},{label:"B",text:"On the other hand"},{label:"C",text:"In summary"},{label:"D",text:"For example"}],
    correctAnswer: "A", explanation: "Moving from problem to solution.",
    commonMistakes: [{label:"B",explanation:"Implies contrast"},{label:"C",explanation:"Implies ending"}],
    skills: ["passage-transitions"], tags: ["passage-revision","transitions"]
  },
  {
    section: "ela", category: "ela.revising.passage.sentence_revision", difficulty: 2, type: "multiple_choice",
    stem: "Which revision best improves: \"The experiment was done by the students and the results were recorded by them too.\"",
    options: [{label:"A",text:"The students conducted the experiment and recorded the results."},{label:"B",text:"The experiment and results were done and recorded by the students."},{label:"C",text:"It was done by the students, the experiment, and results were recorded."},{label:"D",text:"The students, they did the experiment, and they also recorded results too."}],
    correctAnswer: "A", explanation: "Active voice, concise, eliminates redundancy.",
    commonMistakes: [{label:"B",explanation:"Still passive and awkward"},{label:"D",explanation:"Redundant pronouns and 'too'"}],
    skills: ["sentence-revision"], tags: ["passage-revision","sentence-revision"]
  },
  {
    section: "ela", category: "ela.revising.passage.sentence_revision", difficulty: 3, type: "multiple_choice",
    stem: "Revise: \"There are many students who believe that homework is unnecessary and should be eliminated from schools entirely.\"",
    options: [{label:"A",text:"Many students believe homework is unnecessary and should be eliminated."},{label:"B",text:"There are a lot of students that think homework is not necessary."},{label:"C",text:"Students, many of them, believe that homework, which is unnecessary, should be eliminated from all schools entirely."},{label:"D",text:"Homework is believed by many students to be unnecessary."}],
    correctAnswer: "A", explanation: "Removes 'there are...who' and 'from schools entirely' (implied).",
    commonMistakes: [{label:"B",explanation:"Still has 'there are'"},{label:"D",explanation:"Passive voice"}],
    skills: ["sentence-revision"], tags: ["passage-revision","sentence-revision"]
  },
  {
    section: "ela", category: "ela.revising.organization.transitions", difficulty: 3, type: "multiple_choice",
    stem: "An essay argues: (1) Social media connects people, (2) It also causes anxiety, (3) Balance is needed. Best transition from paragraph 2 to 3?",
    options: [{label:"A",text:"Ultimately, finding a balance between these benefits and drawbacks is essential."},{label:"B",text:"In addition, social media causes more problems."},{label:"C",text:"For example, many people use social media."},{label:"D",text:"However, social media is popular."}],
    correctAnswer: "A", explanation: "Moves from problem discussion to the concluding balance argument.",
    commonMistakes: [{label:"B",explanation:"Doesn't transition to balance"},{label:"D",explanation:"Doesn't introduce the solution"}],
    skills: ["passage-transitions"], tags: ["passage-revision","transitions"]
  },
);

// Fix the algebra question 3 (bad answer)
questions[2] = {
  section: "math", category: "math.algebra.linear_equations", difficulty: 3, type: "multiple_choice",
  stem: "Solve for x: (x + 3)/2 + (x - 1)/4 = 5",
  options: [{label:"A",text:"5"},{label:"B",text:"7"},{label:"C",text:"3"},{label:"D",text:"10"}],
  correctAnswer: "A", explanation: "Multiply by 4: 2(x+3)+(x-1)=20 → 2x+6+x-1=20 → 3x+5=20 → x=5",
  commonMistakes: [{label:"C",explanation:"Forgot to multiply all terms"},{label:"D",explanation:"Multiplied wrong"}],
  skills: ["solve-linear-equations"], tags: ["algebra","linear-equations"]
};

console.log(`Total questions: ${questions.length}`);

// Count by group
const groupMap: Record<string, string[]> = {
  'math-algebra': ['math.algebra.linear_equations', 'math.algebra.systems', 'math.algebra.expressions'],
  'math-exponents': ['math.algebra.exponents', 'math.scientific_notation'],
  'math-inequalities': ['math.algebra.inequalities', 'math.algebra.absolute_value'],
  'math-ratios': ['math.arithmetic.ratios_proportions', 'math.proportional_reasoning', 'math.arithmetic.percent_change'],
  'math-arithmetic': ['math.arithmetic.fractions', 'math.arithmetic.decimals', 'math.number_theory.divisibility'],
  'math-geometry-shapes': ['math.geometry.angles', 'math.geometry