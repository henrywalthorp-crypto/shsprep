# Lessons Tab — Design Document

## Research Summary

### How Top Platforms Do It
- **Duolingo**: Linear path with branching, bite-sized lessons (5-10 min), XP system, streaks, skill levels (0→5), "crown" system per skill, visual path with locked/unlocked nodes
- **Khan Academy**: Mastery-based progression, unit → lesson → practice → quiz → unit test, progress bars per skill, prerequisite graph
- **Brilliant**: Interactive problems first (not lectures), guided discovery, daily challenges, concept-by-concept building

### Key Design Decisions
1. **Visual metaphor**: Car on a road (Fardin's request) — a winding road with stops/checkpoints, car animates to current position
2. **Progression**: Linear within each track (Math / ELA), must complete lesson to unlock next
3. **Lesson structure**: Concept explanation → worked examples → practice questions (3-5 per lesson)
4. **Granularity**: Each "stop" on the road = 1 lesson (~10-15 min). Multiple stops grouped into a "unit" (topic area)

## SHSAT Curriculum Progression

### Math Track (easier → harder)
1. **Arithmetic Foundations** — Order of operations, fractions, decimals
2. **Number Theory** — Divisibility, primes, GCF/LCM
3. **Ratios & Proportions** — Ratios, rates, proportional reasoning
4. **Percents** — Percent calculations, percent change, applications
5. **Exponents & Scientific Notation** — Rules, notation, operations
6. **Algebra Basics** — Expressions, simplifying, evaluating
7. **Linear Equations** — Solving 1-variable, word problems
8. **Inequalities & Absolute Value** — Solving, graphing, absolute value
9. **Systems of Equations** — Substitution, elimination
10. **Patterns & Sequences** — Arithmetic, geometric sequences
11. **Geometry: Angles & Lines** — Angle relationships, parallel lines
12. **Geometry: Triangles** — Properties, Pythagorean theorem
13. **Geometry: Circles & Polygons** — Area, circumference, composite shapes
14. **Geometry: 3D Shapes** — Volume, surface area
15. **Coordinate Geometry** — Slope, midpoint, distance, graphing
16. **Transformations** — Reflections, rotations, translations
17. **Statistics & Data** — Mean/median/mode, data interpretation
18. **Probability & Counting** — Basic/compound probability, Venn diagrams
19. **Word Problems Mastery** — Rate/distance/time, work, age, multi-step

### ELA Track (foundational → advanced)
1. **Grammar: Subject-Verb Agreement** — Matching subjects and verbs
2. **Grammar: Fragments & Run-Ons** — Identifying and fixing
3. **Grammar: Verb Tense** — Consistency, correct usage
4. **Grammar: Pronoun Agreement** — Antecedent matching
5. **Grammar: Modifiers** — Misplaced, dangling
6. **Grammar: Parallel Structure** — Parallelism in lists, comparisons
7. **Punctuation: Commas** — Rules, comma splices
8. **Punctuation: Semicolons & Colons** — Correct usage
9. **Punctuation: Dashes & Apostrophes** — Usage rules
10. **Style: Conciseness** — Eliminating wordiness
11. **Style: Word Choice & Tone** — Precise language, register
12. **Style: Transitions** — Connecting ideas smoothly
13. **Passage Organization** — Topic sentences, paragraph order
14. **Sentence Revision** — Combining, improving clarity
15. **Reading: Main Idea & Purpose** — Central idea, author's purpose
16. **Reading: Inference** — Drawing conclusions from text
17. **Reading: Evidence** — Finding supporting evidence
18. **Reading: Vocabulary in Context** — Word meaning from context
19. **Reading: Literary Devices** — Figurative language, tone, mood
20. **Reading: Text Structure** — Compare/contrast, cause/effect, chronological

## Database Schema

### `lesson_units` table
```sql
CREATE TABLE lesson_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track TEXT NOT NULL CHECK (track IN ('math', 'ela')),
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji
  color TEXT, -- hex color for the road stop
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(track, unit_number)
);
```

### `lessons` table
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES lesson_units(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  -- Content as structured JSON:
  -- { sections: [{ type: 'text'|'example'|'tip'|'practice', content: string, question_id?: uuid }] }
  content JSONB NOT NULL DEFAULT '{}',
  estimated_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(unit_id, lesson_number)
);
```

### `lesson_questions` table (practice questions within lessons)
```sql
CREATE TABLE lesson_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  -- Can reference existing questions table or embed inline
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  -- Or inline question (for lesson-specific questions)
  inline_question JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lesson_id, question_order)
);
```

### `student_lesson_progress` table
```sql
CREATE TABLE student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  score INTEGER, -- percentage score on practice questions
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);
```

### `student_unit_progress` table
```sql
CREATE TABLE student_unit_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES lesson_units(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, unit_id)
);
```

## UI Design — Road Map

### Visual Concept
- A winding road (SVG path) that snakes down the page
- Each unit = a "zone" on the road with distinct color/theme
- Each lesson = a circular stop/node on the road
- A small car icon sits at the student's current position
- Completed stops: filled with checkmark, bright color
- Current stop: pulsing/glowing animation
- Locked stops: grayed out with lock icon
- Road has scenery decorations (trees, buildings, clouds) for visual appeal

### Layout
- Full-width road visualization at top
- Two track tabs: "Math Track" / "ELA Track"
- Click a stop → opens lesson view (slide-in or new page)
- Lesson view: scrollable content with text, examples, tips, then practice questions at the end
- Must score ≥70% on practice questions to "complete" and unlock next lesson

### MVP Scope (for Fardin's review)
- Road visualization with Math track (first 5 units, ~5 lessons each)
- Build one complete unit with full lesson content: **Arithmetic Foundations** (5 lessons)
- Car animation on the road
- Lesson viewer with text/examples/practice flow
- Progress tracking (localStorage for MVP, then Supabase)
- "Beta" badge on the tab
- ELA track shows as "Coming Soon"

## Tech Implementation
- Road: SVG path rendered with React, stops positioned along the path
- Car: Framer Motion animated along the SVG path based on progress
- Lesson content: Stored as structured JSON in DB, rendered with a component tree
- API: /api/lessons (list units + lessons), /api/lessons/[lessonId] (get content), /api/lessons/[lessonId]/complete (mark done)
- State: Zustand or React Context for lesson progress
