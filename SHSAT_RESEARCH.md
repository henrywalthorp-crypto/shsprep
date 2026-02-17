# SHSAT Deep Research — Question Types, Format & Content Strategy

## Exam Overview

| Attribute | Detail |
|---|---|
| **Total Questions** | 114 (57 ELA + 57 Math) |
| **Scored Questions** | 94 (47 ELA + 47 Math) — 20 are unscored field-test items |
| **Duration** | 180 minutes (3 hours), student-managed across sections |
| **Format (2025)** | Digital, computer-based, non-adaptive |
| **Format (2026)** | Digital, **computer-adaptive (CAT)** — difficulty adjusts per student |
| **Scoring** | 1 raw point per correct answer, no penalty for wrong answers |
| **Calculator** | NOT allowed |
| **Target** | 8th grade ELA and Math standards |

---

## Section 1: English Language Arts (57 questions)

### A. Revising/Editing (9–11 questions)

#### Part A: Standalone Items (4–6 questions)
Students read a single sentence or short paragraph and identify/fix errors.

**Grammar/Mechanics topics tested:**
- Sentence boundaries (run-ons, fragments, comma splices)
- Subject-verb agreement
- Pronoun-antecedent agreement
- Verb tense consistency
- Comma usage (introductory phrases, appositives, compound sentences)
- Modifier placement (dangling/misplaced modifiers)
- Parallelism
- Clarity and concision
- Word choice / commonly confused words
- Transitions between ideas

**Question format:** "Which edit should be made to correct the sentence?" or "Which version best improves clarity?"

#### Part B: Passage-Based Items (4–6 questions)
Students read a short passage (5–10 sentences) and answer questions about:
- **Sentence placement** — "Where should sentence X be moved to improve flow?"
- **Irrelevant sentences** — "Which sentence is irrelevant to the paragraph?"
- **Best transition** — "Which transition best connects these ideas?"
- **Sentence revision** — "Which revision of sentence X best maintains the style?"
- **Paragraph organization** — reordering for logical coherence

### B. Reading Comprehension (46–48 questions)

**6 passages** (~2,400 total words), each followed by 6–8 questions.

#### Passage Types:
1. **Contemporary/Classic Fiction** (1–2) — character-driven narratives, interior monologue
2. **Historical Fiction / Biography Narrative** (1) — factual era + fictionalized perspective
3. **STEM / Social-Science Nonfiction** (1–2) — ecology, technology, history; may include charts/diagrams
4. **Poetry** (1) — 20–35 lines, reflective, loaded with shifts and figurative language

#### Question Types:

| Type | What It Tests | Frequency |
|---|---|---|
| **Main/Central Idea** | Biggest takeaway of entire passage or stanza | High |
| **Best Evidence** | Which quote supports the previous answer? | High |
| **Inference** | What can be logically concluded from the text? | High |
| **Vocabulary-in-Context** | Meaning of word/phrase as used in a specific sentence | Medium |
| **Author's Purpose/Structure** | Why include a detail? How does a paragraph function? | Medium |
| **Claim vs. Evidence** | Distinguish opinion/argument from verifiable fact | Medium |
| **Figurative Language/Tone** | Effect of imagery, repetition, irony | Medium |
| **Plot/Character** | Conflict, motive, turning point | Medium (fiction) |
| **Graphic-Based** | What does the chart/diagram show or add? | Low (1–2 per test) |

---

## Section 2: Mathematics (57 questions)

### Format
- **47 Multiple-Choice** (4 options each)
- **5 Grid-In** (open-ended, student writes numeric answer)
- **5 Unscored** field-test items (student doesn't know which)

### Topic Distribution

| Domain | Estimated % | Key Topics |
|---|---|---|
| **Arithmetic & Number Sense** | ~20% | Fractions, decimals, percentages, ratios, proportions, unit conversions, order of operations, absolute value |
| **Algebra** | ~30% | Expressions, linear equations, inequalities, systems, word problems, patterns & sequences, exponents |
| **Geometry** | ~25% | Perimeter, area, volume, angles (triangles, parallel lines), coordinate geometry, transformations, Pythagorean theorem, circle properties |
| **Statistics & Probability** | ~10% | Mean, median, mode, range, basic probability, data interpretation |
| **Word Problems (Multi-step)** | ~15% | Rate/distance/time, ratio/proportion scenarios, percent change, combined work, age problems |

### Math Question Characteristics
- Problems are often **multi-step** requiring 2–3 operations
- Heavy emphasis on **word problems** — translating English to math
- Grid-in questions require exact numeric answers (fractions, decimals, or integers)
- No calculator — mental math and estimation skills critical
- Trick answers exploit common errors (sign mistakes, order-of-operations violations)

---

## 2025/2026 Digital Changes: Technology Enhanced Items (TEIs)

Starting 2025, some MC/grid-in questions are being replaced by TEIs:

| TEI Type | Description | Section |
|---|---|---|
| **Multi-Select** | Select ALL correct answers (not just one) | Both |
| **Drag-and-Drop** | Drag items to correct positions/categories | Both |
| **Matrix Sorting** | Drag statements into correct category columns | ELA |
| **Fill-in-Blank (Dropdown)** | Choose from dropdown options within text | ELA |
| **Inline Choice** | Select correct option embedded in passage | Both |

### 2026 CAT (Computer-Adaptive) Changes
- Questions adapt difficulty based on performance
- **Cannot go back** to previous questions (except within a reading passage set)
- Higher performance → harder questions → higher scoring ceiling
- Passage-based RC questions still presented as a set

---

## Practice Question Creation Strategy

### Design Principles
1. **Original content only** — never copy from DOE, Princeton Review, or any copyrighted source
2. **Model real patterns** — match the exact question structures, difficulty curves, and distractor logic from official tests
3. **Grade-appropriate** — aligned with 8th grade Common Core standards
4. **Diverse topics** — rotate through all subject areas and question types proportionally
5. **Quality distractors** — wrong answers should exploit common student mistakes, not be obviously wrong

### Question Type Taxonomy (for our database)

#### ELA Categories
```
ela.revising.grammar.run_ons
ela.revising.grammar.fragments
ela.revising.grammar.subject_verb_agreement
ela.revising.grammar.pronoun_antecedent
ela.revising.grammar.verb_tense
ela.revising.grammar.comma_usage
ela.revising.grammar.modifiers
ela.revising.grammar.parallelism
ela.revising.grammar.clarity_concision
ela.revising.grammar.word_choice
ela.revising.grammar.transitions
ela.revising.passage.sentence_placement
ela.revising.passage.irrelevant_sentence
ela.revising.passage.best_transition
ela.revising.passage.sentence_revision
ela.revising.passage.paragraph_organization
ela.reading.main_idea
ela.reading.best_evidence
ela.reading.inference
ela.reading.vocabulary_in_context
ela.reading.authors_purpose
ela.reading.claim_vs_evidence
ela.reading.figurative_language
ela.reading.plot_character
ela.reading.graphic_based
ela.reading.tone_mood
```

#### Math Categories
```
math.arithmetic.fractions
math.arithmetic.decimals
math.arithmetic.percentages
math.arithmetic.ratios_proportions
math.arithmetic.order_of_operations
math.arithmetic.absolute_value
math.algebra.expressions
math.algebra.linear_equations
math.algebra.inequalities
math.algebra.systems
math.algebra.exponents
math.algebra.patterns_sequences
math.algebra.word_problems
math.geometry.perimeter_area
math.geometry.volume
math.geometry.angles
math.geometry.triangles
math.geometry.coordinate_geometry
math.geometry.transformations
math.geometry.pythagorean_theorem
math.geometry.circles
math.statistics.mean_median_mode
math.statistics.probability
math.statistics.data_interpretation
math.word_problems.rate_distance_time
math.word_problems.percent_change
math.word_problems.combined_work
math.word_problems.age_problems
math.word_problems.ratio_proportion
```

### Question Difficulty Levels
- **Level 1 (Easy)** — ~30% of questions. Direct application of a single concept.
- **Level 2 (Medium)** — ~45% of questions. Requires 2 steps or combining concepts.
- **Level 3 (Hard)** — ~25% of questions. Multi-step, requires insight or non-obvious approach.

### Question Data Model
```typescript
interface Question {
  id: string;
  section: 'ela' | 'math';
  category: string;           // from taxonomy above
  subcategory: string;
  difficulty: 1 | 2 | 3;
  type: 'multiple_choice' | 'grid_in' | 'multi_select' | 'drag_drop' | 'inline_choice';
  
  // For MC questions
  stem: string;               // question text (may include passage reference)
  options?: { label: string; text: string; }[];  // A, B, C, D
  correctAnswer: string;      // "A" | "B" | numeric for grid-in
  
  // For passage-based questions
  passageId?: string;         // links to a passage
  
  // Metadata
  explanation: string;        // detailed solution explanation
  commonMistakes: string[];   // what errors lead to each wrong answer
  skills: string[];           // specific skills tested
  tags: string[];             // additional tags for filtering
  
  // TEI-specific
  teiConfig?: {
    type: 'multi_select' | 'drag_drop' | 'matrix_sort' | 'dropdown' | 'inline_choice';
    items?: any[];
    zones?: any[];
  };
  
  createdAt: Date;
  updatedAt: Date;
  reviewStatus: 'draft' | 'reviewed' | 'approved' | 'published';
}

interface Passage {
  id: string;
  type: 'fiction' | 'nonfiction' | 'poetry' | 'historical';
  title: string;
  text: string;
  wordCount: number;
  readingLevel: string;       // Lexile or grade equivalent
  source: 'original';         // always original
  questions: string[];        // question IDs
}
```

### Question Generation Workflow

#### Phase 1: Content Templates
1. Study 10+ official practice tests to internalize patterns
2. Create **question templates** for each type (stem structure, distractor patterns)
3. Build a **passage template library** (fiction prompts, nonfiction topic outlines, poetry structures)

#### Phase 2: Batch Generation
1. Generate questions in batches of 10–20 per category
2. Each question must include:
   - Full stem text
   - 4 options (MC) or grid-in answer
   - Correct answer with explanation
   - Analysis of why each wrong answer is wrong
   - Difficulty rating
   - Category/subcategory tags

#### Phase 3: Quality Review
1. Cross-check difficulty calibration against official tests
2. Verify no copyright overlap
3. Test with actual students for validation
4. Adjust based on performance data

### MVP Question Targets (Phase 1)

| Section | Type | Count | Priority |
|---|---|---|---|
| Math MC | All categories | 200 | P0 |
| Math Grid-In | All categories | 30 | P0 |
| ELA Standalone R/E | Grammar types | 60 | P0 |
| ELA Passage R/E | Passage-based | 30 (6 passages × 5 Qs) | P1 |
| ELA Reading Comp | All question types | 180 (6 passage sets × 5 types × 6 Qs) | P1 |
| **Total MVP** | | **~500** | |

### Passage Content Strategy

#### Fiction Passages
- Original short fiction excerpts (~400 words)
- Topics: coming-of-age, cultural identity, overcoming obstacles, discovery
- Style: accessible 8th grade reading level with some complex vocabulary

#### Nonfiction Passages  
- Original informational texts (~400 words)
- Topics: science discoveries, historical events, technology, environmental issues, social phenomena
- May include a simple chart, graph, or diagram

#### Poetry
- Original poems (20–35 lines)
- Styles: free verse, structured (sonnet, ballad)
- Themes: nature, identity, memory, change

---

## Competitive Landscape (for product positioning)

| Competitor | Strengths | Weaknesses |
|---|---|---|
| Khan's Tutorial | In-person NYC classes | No digital platform |
| TestPrepSHSAT.com | Free practice materials | Dated UI, limited analytics |
| Princeton Review | Brand recognition | Expensive, generic approach |
| SHSAT Buddy | Daily drills, mobile-friendly | Limited question bank |
| VEGA AI | AI-powered prep | New, unproven |
| Bobby-Tariq | Popular NYC prep center | In-person only |

### Our Differentiators
1. **Adaptive practice** — mirrors the 2026 CAT format
2. **Performance analytics** — skill-level tracking with visual dashboards
3. **Original question bank** — continuously growing, never stale
4. **Free tier available** — accessible to all NYC students
5. **Digital-first** — practice on the same interface as the real test
