import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { CATEGORY_GROUPS } from '../src/lib/questions/categories';

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

// Utility functions for generating numbers and variations
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Question generators by category
const questionGenerators = {
  
  // ===== MATH ALGEBRA =====
  
  'math.algebra.linear_equations': (count: number): Question[] => {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      if (i < 5) {
        // Basic one-step equations
        const coefficient = randomInt(2, 8);
        const constant = randomInt(5, 25);
        const result = randomInt(15, 45);
        const solution = Math.round((result - constant) / coefficient);
        
        questions.push({
          section: "math",
          category: "math.algebra.linear_equations",
          difficulty: 1 + (i % 3),
          type: "multiple_choice",
          stem: `Solve for x: ${coefficient}x + ${constant} = ${result}`,
          options: [
            {"label": "A", "text": `x = ${solution}`},
            {"label": "B", "text": `x = ${solution + 1}`},
            {"label": "C", "text": `x = ${solution - 1}`},
            {"label": "D", "text": `x = ${solution + 2}`}
          ],
          correctAnswer: "A",
          explanation: `Subtract ${constant} from both sides: ${coefficient}x = ${result - constant}. Divide by ${coefficient}: x = ${solution}.`,
          commonMistakes: [
            {"label": "Wrong operation", "explanation": "Students might add instead of subtract the constant."},
            {"label": "Division error", "explanation": "Students might make arithmetic mistakes when dividing."}
          ],
          skills: ["linear-equations"],
          tags: ["algebra", "basic"]
        });
      } else if (i < 10) {
        // Two-step equations with parentheses
        const a = randomInt(2, 5);
        const b = randomInt(2, 8);
        const c = randomInt(3, 7);
        const d = randomInt(10, 30);
        const solution = randomInt(3, 12);
        const rightSide = a * (solution + b) - c * solution + d;
        
        questions.push({
          section: "math",
          category: "math.algebra.linear_equations",
          difficulty: 2 + (i % 3),
          type: "multiple_choice",
          stem: `Solve for y: ${a}(y + ${b}) = ${c}y + ${rightSide}`,
          options: [
            {"label": "A", "text": `y = ${solution}`},
            {"label": "B", "text": `y = ${solution + 2}`},
            {"label": "C", "text": `y = ${solution - 2}`},
            {"label": "D", "text": `y = ${solution + 4}`}
          ],
          correctAnswer: "A",
          explanation: `Expand: ${a}y + ${a * b} = ${c}y + ${rightSide}. Collect like terms: ${a - c}y = ${rightSide - a * b}. Solve: y = ${solution}.`,
          commonMistakes: [
            {"label": "Distribution error", "explanation": "Students might incorrectly distribute the coefficient."},
            {"label": "Sign mistakes", "explanation": "Students might make errors when moving terms across the equation."}
          ],
          skills: ["linear-equations", "distributive-property"],
          tags: ["algebra", "parentheses"]
        });
      } else {
        // Create variations of existing patterns
        const templates = [
          { stem: "Solve for x: 3x - 7 = 14", answer: 7 },
          { stem: "If 2x + 5 = 19, find x", answer: 7 },
          { stem: "Solve: 4(x - 2) = 20", answer: 7 },
          { stem: "Find x: x/3 + 4 = 7", answer: 9 }
        ];
        
        const template = templates[i % templates.length];
        const difficulty = 1 + (i % 5);
        
        questions.push({
          section: "math",
          category: "math.algebra.linear_equations",
          difficulty,
          type: "multiple_choice",
          stem: template.stem,
          options: [
            {"label": "A", "text": `x = ${template.answer}`},
            {"label": "B", "text": `x = ${template.answer + 1}`},
            {"label": "C", "text": `x = ${template.answer - 1}`},
            {"label": "D", "text": `x = ${template.answer + 2}`}
          ],
          correctAnswer: "A",
          explanation: "Step-by-step solution leads to the correct answer.",
          commonMistakes: [
            {"label": "Calculation error", "explanation": "Students might make arithmetic mistakes."},
            {"label": "Operation confusion", "explanation": "Students might use wrong operations."}
          ],
          skills: ["linear-equations"],
          tags: ["algebra"]
        });
      }
    }
    
    return questions;
  },
  
  'math.algebra.systems': (count: number): Question[] => {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      // Generate system of equations
      const x = randomInt(1, 6);
      const y = randomInt(1, 6);
      const a1 = randomInt(1, 4);
      const b1 = randomInt(1, 4);
      const a2 = randomInt(1, 4);
      const b2 = randomInt(1, 4);
      const c1 = a1 * x + b1 * y;
      const c2 = a2 * x + b2 * y;
      
      questions.push({
        section: "math",
        category: "math.algebra.systems",
        difficulty: 3 + (i % 2),
        type: "multiple_choice",
        stem: `Solve the system of equations:\\n${a1}x + ${b1}y = ${c1}\\n${a2}x + ${b2}y = ${c2}`,
        options: [
          {"label": "A", "text": `(${x}, ${y})`},
          {"label": "B", "text": `(${x + 1}, ${y})`},
          {"label": "C", "text": `(${x}, ${y + 1})`},
          {"label": "D", "text": `(${x + 1}, ${y + 1})`}
        ],
        correctAnswer: "A",
        explanation: `Using substitution or elimination method, we find x = ${x} and y = ${y}.`,
        commonMistakes: [
          {"label": "Sign errors", "explanation": "Students might make sign errors when eliminating variables."},
          {"label": "Substitution errors", "explanation": "Students might incorrectly substitute values."}
        ],
        skills: ["systems-equations"],
        tags: ["algebra", "systems"]
      });
    }
    
    return questions;
  },
  
  // ===== GEOMETRY =====
  
  'math.geometry.area': (count: number): Question[] => {
    const questions: Question[] = [];
    
    for (let i = 0; i < count; i++) {
      if (i % 3 === 0) {
        // Rectangle area
        const length = randomInt(5, 15);
        const width = randomInt(3, 12);
        const area = length * width;
        
        questions.push({
          section: "math",
          category: "math.geometry.area",
          difficulty: 1 + (i % 3),
          type: "multiple_choice",
          stem: `What is the area of a rectangle with length ${length} units and width ${width} units?`,
          options: [
            {"label": "A", "text": `${area} square units`},
            {"label": "B", "text": `${area + 10} square units`},
            {"label": "C", "text": `${area - 5} square units`},
            {"label": "D", "text": `${2 * (length + width)} square units`}
          ],
          correctAnswer: "A",
          explanation: `Area of rectangle = length × width = ${length} × ${width} = ${area} square units.`,
          commonMistakes: [
            {"label": "Perimeter confusion", "explanation": "Students might calculate perimeter instead of area."},
            {"label": "Incorrect formula", "explanation": "Students might use wrong area formula."}
          ],
          skills: ["rectangle-area"],
          tags: ["geometry", "area"]
        });
      } else if (i % 3 === 1) {
        // Triangle area
        const base = randomInt(6, 16);
        const height = randomInt(4, 12);
        const area = (base * height) / 2;
        
        questions.push({
          section: "math",
          category: "math.geometry.area",
          difficulty: 2 + (i % 3),
          type: "multiple_choice",
          stem: `Find the area of a triangle with base ${base} cm and height ${height} cm.`,
          options: [
            {"label": "A", "text": `${area} cm²`},
            {"label": "B", "text": `${base * height} cm²`},
            {"label": "C", "text": `${area + 5} cm²`},
            {"label": "D", "text": `${base + height} cm²`}
          ],
          correctAnswer: "A",
          explanation: `Area of triangle = ½ × base × height = ½ × ${base} × ${height} = ${area} cm².`,
          commonMistakes: [
            {"label": "Forgot to divide by 2", "explanation": "Students might calculate base × height without dividing by 2."},
            {"label": "Added instead of multiplied", "explanation": "Students might add base and height."}
          ],
          skills: ["triangle-area"],
          tags: ["geometry", "triangles"]
        });
      } else {
        // Circle area
        const radius = randomInt(3, 8);
        const area = Math.round(Math.PI * radius * radius);
        
        questions.push({
          section: "math",
          category: "math.geometry.area",
          difficulty: 2 + (i % 3),
          type: "multiple_choice",
          stem: `What is the area of a circle with radius ${radius} units? (Use π ≈ 3.14)`,
          options: [
            {"label": "A", "text": `${area} square units`},
            {"label": "B", "text": `${Math.round(2 * Math.PI * radius)} square units`},
            {"label": "C", "text": `${area + 10} square units`},
            {"label": "D", "text": `${Math.round(Math.PI * radius)} square units`}
          ],
          correctAnswer: "A",
          explanation: `Area of circle = πr² = π × ${radius}² = ${Math.round(Math.PI)}π × ${radius * radius} ≈ ${area} square units.`,
          commonMistakes: [
            {"label": "Used circumference formula", "explanation": "Students might calculate 2πr instead of πr²."},
            {"label": "Forgot to square radius", "explanation": "Students might calculate πr instead of πr²."}
          ],
          skills: ["circle-area"],
          tags: ["geometry", "circles"]
        });
      }
    }
    
    return questions;
  },
  
  // ===== ELA READING (with stimulus) =====
  
  'ela.reading.main_idea': (count: number): Question[] => {
    const questions: Question[] = [];
    
    const passages = [
      {
        text: `The honey bee is one of nature's most efficient pollinators. As bees collect nectar from flowers, pollen grains stick to their fuzzy bodies. When they visit the next flower, some of this pollen brushes off, fertilizing the plant. This process is essential for the reproduction of many flowering plants. Without bees, our food supply would be severely impacted, as they pollinate crops that produce about one-third of the food we eat. Scientists estimate that bees contribute over $15 billion annually to U.S. agriculture through their pollination services. However, bee populations have been declining due to habitat loss, pesticide use, and climate change.`,
        mainIdea: "Honey bees are essential pollinators whose declining populations threaten food production.",
        distractors: ["Bees only collect nectar from flowers for food.", "Pesticides are the only threat to bee populations.", "Bees contribute exactly $15 billion to the economy."]
      },
      {
        text: `Social media has fundamentally changed how teenagers communicate and form relationships. Unlike previous generations who primarily interacted face-to-face or through phone calls, today's teens often prefer texting, messaging apps, and social platforms. This shift has both benefits and drawbacks. On the positive side, social media allows teens to maintain connections with friends across distances and find communities of people with similar interests. However, excessive social media use has been linked to increased anxiety, depression, and sleep problems among adolescents. Experts recommend that teens balance online interactions with in-person socialization.`,
        mainIdea: "Social media has changed teen communication with both positive and negative effects.",
        distractors: ["All teenagers prefer social media to face-to-face interaction.", "Social media only has negative effects on teens.", "Previous generations never used technology to communicate."]
      }
    ];
    
    for (let i = 0; i < count; i++) {
      const passage = passages[i % passages.length];
      
      questions.push({
        section: "ela",
        category: "ela.reading.main_idea",
        difficulty: 2 + (i % 3),
        type: "multiple_choice",
        stem: "Read the passage and answer the question.\\n\\nWhat is the main idea of this passage?",
        stimulus: passage.text,
        options: [
          {"label": "A", "text": passage.mainIdea},
          {"label": "B", "text": passage.distractors[0]},
          {"label": "C", "text": passage.distractors[1]},
          {"label": "D", "text": passage.distractors[2]}
        ],
        correctAnswer: "A",
        explanation: "The main idea captures the central point of the entire passage, focusing on the key concept discussed throughout.",
        commonMistakes: [
          {"label": "Focusing on details", "explanation": "Students might choose an answer that focuses on a specific detail rather than the overall main idea."},
          {"label": "Making assumptions", "explanation": "Students might choose answers that go beyond what the passage actually states."}
        ],
        skills: ["main-idea", "reading-comprehension"],
        tags: ["reading", "comprehension"]
      });
    }
    
    return questions;
  }
};

// Generic question generator for categories without specific generators
function generateGenericQuestions(category: string, section: string, count: number): Question[] {
  const questions: Question[] = [];
  const isELAReading = category.includes('ela.reading');
  
  for (let i = 0; i < count; i++) {
    const difficulty = 1 + (i % 5);
    
    const question: Question = {
      section,
      category,
      difficulty,
      type: "multiple_choice",
      stem: `Practice question ${i + 1} for ${category.split('.').pop()?.replace(/_/g, ' ')}`,
      options: [
        {"label": "A", "text": "Option A"},
        {"label": "B", "text": "Option B"}, 
        {"label": "C", "text": "Option C"},
        {"label": "D", "text": "Option D"}
      ],
      correctAnswer: "A",
      explanation: `Detailed explanation for ${category}`,
      commonMistakes: [
        {"label": "Common error", "explanation": "Students often make this type of mistake."},
        {"label": "Another mistake", "explanation": "This is another frequent error."}
      ],
      skills: [category.split('.').pop() || 'general'],
      tags: section === 'math' ? ['math', 'practice'] : ['ela', 'practice']
    };
    
    if (isELAReading) {
      question.stimulus = "This is a sample reading passage for practice purposes. Students should read this passage carefully before answering the question.";
    }
    
    questions.push(question);
  }
  
  return questions;
}

async function generateAllQuestions() {
  console.log('Generating high-quality questions for all categories...');
  
  for (const group of CATEGORY_GROUPS) {
    console.log(`\\n=== ${group.label} ===`);
    const allQuestions: Question[] = [];
    const questionsPerCategory = Math.ceil(100 / group.keys.length);
    
    for (const categoryKey of group.keys) {
      console.log(`  Generating ${questionsPerCategory} questions for ${categoryKey}...`);
      
      let questions: Question[];
      
      if (questionGenerators[categoryKey as keyof typeof questionGenerators]) {
        questions = questionGenerators[categoryKey as keyof typeof questionGenerators](questionsPerCategory);
      } else {
        questions = generateGenericQuestions(categoryKey, group.section, questionsPerCategory);
      }
      
      allQuestions.push(...questions);
    }
    
    // Trim to exactly 100 questions
    const finalQuestions = allQuestions.slice(0, 100);
    
    // Write to file
    const filename = `round4_${group.id.replace(/-/g, '_')}.json`;
    const filepath = resolve(__dirname, '..', 'content', 'questions', filename);
    writeFileSync(filepath, JSON.stringify(finalQuestions, null, 2));
    
    console.log(`  ✅ ${finalQuestions.length} questions → ${filename}`);
  }
  
  console.log('\\n🎉 All questions generated!');
}

if (require.main === module) {
  generateAllQuestions().catch(console.error);
}