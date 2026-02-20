# Question Cleanup + KaTeX Implementation Plan

## Phase 1: KaTeX Setup (task-023)
**Why first:** Need rendering in place before regenerating questions with LaTeX.

### Steps
1. **Install dependencies**
   ```bash
   npm install katex react-katex
   npm install -D @types/katex
   ```

2. **Create `<MathText>` component** (`src/components/ui/MathText.tsx`)
   - Accepts a string prop
   - Regex-splits on `$$...$$` (block) and `$...$` (inline) delimiters
   - Renders plain text segments as-is, math segments via `<InlineMath>` or `<BlockMath>`
   - Handles edge cases: escaped `\$`, nested delimiters, malformed LaTeX (fallback to raw text)
   - Import KaTeX CSS in root layout

3. **Update rendering components**
   - `src/components/practice/QuestionView.tsx` — wrap `question.stem` and `opt.text` in `<MathText>`
   - `src/components/practice/FeedbackView.tsx` — wrap explanation and common_mistakes in `<MathText>`
   - `src/app/dashboard/lessons/[lessonId]/page.tsx` — wrap lesson content and inline question stems/options/explanations
   - `src/app/dashboard/targeted-questions/page.tsx` — if it renders question previews

4. **Test with sample LaTeX strings**
   - `$\frac{3}{4} + \frac{1}{2}$` → rendered fraction
   - `$x^2 - 5x + 6 = 0$` → equation
   - `$\triangle ABC \sim \triangle DEF$` → geometry
   - `$$\frac{x + 3}{2} = 7$$` → block equation
   - Plain text without `$` → unchanged

5. **Build and verify** — `next build` passes, no hydration errors

---

## Phase 2: Skeleton Cleanup (task-022)

### Step 1: Identify and delete skeletons
```sql
-- A question is a skeleton if ANY option text matches 'Option [A-D]'
-- or the stem starts with 'Practice question'
```

Script: `scripts/cleanup-skeletons.ts`
- Query all 3,758 questions
- Flag as skeleton if:
  - Any option `.text` matches `/^Option\s*[A-D]$/i`
  - Stem matches `/^Practice question \d+/i`
  - Any option `.text` is empty string
- Log count per category group
- Delete all flagged questions
- Verify remaining count (~1,941 good questions)

### Step 2: Verify remaining question quality
After deletion, audit the survivors:
- Every question has 4 options with non-empty, distinct text
- `correct_answer` is one of A/B/C/D
- `stem` is a real question (>20 chars, contains `?` or ends with expression)
- `common_mistakes` is array of `{label, explanation}` objects
- ELA reading questions have `stimulus` field
- No duplicate stems

---

## Phase 3: Regenerate with LaTeX (task-026)

### Per-group process (19 groups × ~100 questions each)
1. Count how many questions each group needs to reach 200
2. Generate questions with these rules:
   - **Math questions**: All mathematical expressions in LaTeX
     - Fractions: `$\frac{a}{b}$`
     - Exponents: `$x^2$`, `$3^4$`
     - Equations: `$2x + 5 = 13$`
     - Geometry: `$\triangle ABC$`, `$\angle XYZ$`, `$\overline{AB}$`
     - Inequalities: `$x > 5$`, `$-3 \leq x < 7$`
     - Square roots: `$\sqrt{144}$`
     - Pi: `$\pi r^2$`
   - **ELA questions**: No LaTeX needed (plain text)
   - All questions: `question_type: 'multiple_choice'`, 4 options as `{text, label, isCorrect}`
   - Difficulty 1-5 (weighted 2-4)
   - Step-by-step explanation (with LaTeX for math)
   - 2-3 `common_mistakes` as `{label, explanation}` objects
   - ELA reading: `stimulus` field with 200-400 word passage

3. **Validation before insertion** (hard requirements):
   - ❌ No option text matching `/option\s*[a-d]/i`
   - ❌ No empty option text
   - ❌ No duplicate option text within a question
   - ❌ No stem < 20 characters
   - ❌ No stem starting with "Practice question"
   - ✅ Exactly 4 options
   - ✅ `correct_answer` is A, B, C, or D
   - ✅ At least one option marked `isCorrect: true`
   - ✅ Math stems/options contain `$` (LaTeX) where mathematical expressions appear

4. Insert in batches, check for stem duplicates against existing DB

### Estimated output
- ~1,800 new questions across 19 groups
- Final DB: ~3,750 questions (all real, ~200/group)
- All math rendered in LaTeX

---

## Execution Order
1. KaTeX setup + MathText component + update renderers → commit
2. Delete skeletons → commit
3. Regenerate batch 1 (math groups, ~1,200 questions) → commit
4. Regenerate batch 2 (ELA groups, ~600 questions) → commit
5. Full QA audit of entire DB → commit
6. Final build + push

## Risk Mitigation
- KaTeX CSS adds ~28KB gzipped — acceptable, lazy-load if needed
- Malformed LaTeX in existing good questions — MathText component catches errors and falls back to raw text
- Regeneration quality — validate every single question programmatically before insertion, no exceptions
