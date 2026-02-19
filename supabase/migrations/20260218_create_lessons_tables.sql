-- Lesson Units
CREATE TABLE IF NOT EXISTS lesson_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track TEXT NOT NULL CHECK (track IN ('math', 'ela')),
  unit_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  lessons_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(track, unit_number)
);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id UUID REFERENCES lesson_units(id) ON DELETE CASCADE,
  lesson_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content JSONB NOT NULL DEFAULT '[]',
  estimated_minutes INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(unit_id, lesson_number)
);

-- Lesson questions
CREATE TABLE IF NOT EXISTS lesson_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_order INTEGER NOT NULL,
  question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
  inline_question JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lesson_id, question_order)
);

-- Student lesson progress
CREATE TABLE IF NOT EXISTS student_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  score INTEGER,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

-- Student unit progress
CREATE TABLE IF NOT EXISTS student_unit_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES lesson_units(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, unit_id)
);

-- RLS
ALTER TABLE lesson_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_unit_progress ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "lesson_units_public_read" ON lesson_units FOR SELECT USING (true);
CREATE POLICY "lessons_public_read" ON lessons FOR SELECT USING (true);
CREATE POLICY "lesson_questions_public_read" ON lesson_questions FOR SELECT USING (true);

-- Own progress
CREATE POLICY "slp_own" ON student_lesson_progress FOR ALL USING (auth.uid() = student_id);
CREATE POLICY "sup_own" ON student_unit_progress FOR ALL USING (auth.uid() = student_id);
