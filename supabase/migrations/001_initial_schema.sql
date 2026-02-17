-- SHSPrep Database Schema
-- Aligned with SHSAT question taxonomy from SHSAT_RESEARCH.md

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS & AUTH
-- ============================================================================

CREATE TYPE user_role AS ENUM ('student', 'parent', 'admin');
CREATE TYPE grade_level AS ENUM ('6', '7', '8', '9');

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'student',
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  grade grade_level,
  target_school TEXT,                    -- preferred specialized HS
  avatar_url TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent-Student linking
CREATE TABLE parent_student_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(parent_id, student_id)
);

-- ============================================================================
-- QUESTION BANK
-- ============================================================================

CREATE TYPE section_type AS ENUM ('ela', 'math');
CREATE TYPE question_type AS ENUM (
  'multiple_choice', 'grid_in', 'multi_select', 
  'drag_drop', 'matrix_sort', 'inline_choice', 'dropdown'
);
CREATE TYPE difficulty_level AS ENUM ('1', '2', '3');
CREATE TYPE review_status AS ENUM ('draft', 'reviewed', 'approved', 'published');
CREATE TYPE passage_type AS ENUM ('fiction', 'nonfiction', 'poetry', 'historical');

-- Passages (for RC and passage-based R/E questions)
CREATE TABLE passages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type passage_type NOT NULL,
  title TEXT NOT NULL,
  text TEXT NOT NULL,
  word_count INT NOT NULL,
  reading_level TEXT,                     -- Lexile or grade equivalent
  metadata JSONB DEFAULT '{}',           -- extra info (author, era, topic)
  review_status review_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section section_type NOT NULL,
  category TEXT NOT NULL,                -- e.g., 'ela.revising.grammar.run_ons'
  subcategory TEXT,                      -- additional specificity
  difficulty difficulty_level NOT NULL DEFAULT '2',
  type question_type NOT NULL DEFAULT 'multiple_choice',
  
  -- Question content
  stem TEXT NOT NULL,                    -- question text / prompt
  stimulus TEXT,                         -- additional context shown above stem
  options JSONB,                         -- [{label: "A", text: "...", isCorrect: bool}]
  correct_answer TEXT NOT NULL,          -- "A"/"B"/"C"/"D" or numeric for grid-in
  
  -- Passage link (for passage-based questions)
  passage_id UUID REFERENCES passages(id) ON DELETE SET NULL,
  passage_question_order INT,            -- order within passage set
  
  -- Explanations
  explanation TEXT NOT NULL,             -- detailed solution walkthrough
  common_mistakes JSONB DEFAULT '[]',   -- why each wrong answer is wrong
  
  -- TEI config (for non-standard question types)
  tei_config JSONB,                      -- type-specific rendering data
  
  -- Metadata
  skills TEXT[] DEFAULT '{}',            -- specific skills tested
  tags TEXT[] DEFAULT '{}',              -- additional tags
  review_status review_status DEFAULT 'draft',
  
  -- Stats (updated via triggers/cron)
  times_attempted INT DEFAULT 0,
  times_correct INT DEFAULT 0,
  avg_time_seconds FLOAT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for question retrieval
CREATE INDEX idx_questions_section ON questions(section);
CREATE INDEX idx_questions_category ON questions(category);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_passage ON questions(passage_id);
CREATE INDEX idx_questions_review ON questions(review_status);
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX idx_questions_skills ON questions USING GIN(skills);

-- ============================================================================
-- PRACTICE SESSIONS & ATTEMPTS
-- ============================================================================

CREATE TYPE session_mode AS ENUM ('practice', 'timed_practice', 'exam', 'review');
CREATE TYPE session_status AS ENUM ('in_progress', 'completed', 'abandoned');

CREATE TABLE practice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  mode session_mode NOT NULL DEFAULT 'practice',
  status session_status NOT NULL DEFAULT 'in_progress',
  
  -- Filters used to generate this session
  section_filter section_type,
  category_filter TEXT,
  difficulty_filter difficulty_level,
  
  -- Timing
  time_limit_seconds INT,               -- NULL for untimed
  time_spent_seconds INT DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Results (computed on completion)
  total_questions INT DEFAULT 0,
  correct_count INT DEFAULT 0,
  accuracy FLOAT,                        -- correct_count / total_questions
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_student ON practice_sessions(student_id);
CREATE INDEX idx_sessions_status ON practice_sessions(status);
CREATE INDEX idx_sessions_mode ON practice_sessions(mode);

-- Individual question attempts within a session
CREATE TABLE practice_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES practice_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  selected_answer TEXT,                  -- what the student chose
  is_correct BOOLEAN,
  time_spent_seconds INT,
  attempt_order INT,                     -- position in session
  
  -- For adaptive engine
  confidence_before FLOAT,              -- student's skill level before this Q
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_session ON practice_attempts(session_id);
CREATE INDEX idx_attempts_student ON practice_attempts(student_id);
CREATE INDEX idx_attempts_question ON practice_attempts(question_id);
CREATE INDEX idx_attempts_correct ON practice_attempts(is_correct);

-- ============================================================================
-- FULL-LENGTH EXAMS
-- ============================================================================

CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES practice_sessions(id),
  
  -- Section scores
  ela_raw_score INT,
  math_raw_score INT,
  ela_scaled_score INT,
  math_scaled_score INT,
  composite_score INT,
  
  -- Section breakdowns
  ela_revising_correct INT,
  ela_revising_total INT,
  ela_reading_correct INT,
  ela_reading_total INT,
  math_mc_correct INT,
  math_mc_total INT,
  math_gridin_correct INT,
  math_gridin_total INT,
  
  time_spent_seconds INT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exams_student ON exams(student_id);

-- ============================================================================
-- SKILL TRACKING & ADAPTIVE ENGINE
-- ============================================================================

CREATE TABLE student_skill_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,                -- matches question category taxonomy
  
  -- Running stats
  total_attempted INT DEFAULT 0,
  total_correct INT DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  
  -- Trending
  recent_accuracy FLOAT DEFAULT 0,      -- last 20 attempts
  trend TEXT DEFAULT 'stable',           -- 'improving', 'declining', 'stable'
  
  -- Adaptive engine
  mastery_level FLOAT DEFAULT 0.5,      -- 0-1 scale, Bayesian updated
  last_practiced_at TIMESTAMPTZ,
  
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, category)
);

CREATE INDEX idx_skill_stats_student ON student_skill_stats(student_id);
CREATE INDEX idx_skill_stats_mastery ON student_skill_stats(mastery_level);

-- ============================================================================
-- WEEKLY PLANS
-- ============================================================================

CREATE TABLE weekly_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  
  -- Plan content (generated by adaptive engine)
  focus_skills TEXT[] DEFAULT '{}',      -- top 3 weakest skills to work on
  recommended_questions JSONB DEFAULT '[]', -- question IDs grouped by skill
  daily_targets JSONB DEFAULT '{}',      -- {mon: 15, tue: 15, ...}
  
  -- Progress tracking
  questions_completed INT DEFAULT 0,
  questions_target INT DEFAULT 75,       -- weekly goal
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, week_start)
);

CREATE INDEX idx_weekly_plans_student ON weekly_plans(student_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skill_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE passages ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Parents can view linked students
CREATE POLICY "Parents can view linked students" ON profiles FOR SELECT
  USING (id IN (
    SELECT student_id FROM parent_student_links WHERE parent_id = auth.uid()
  ));

-- Practice sessions: students own their sessions
CREATE POLICY "Students own their sessions" ON practice_sessions
  FOR ALL USING (student_id = auth.uid());

-- Parents can view linked student sessions
CREATE POLICY "Parents can view student sessions" ON practice_sessions FOR SELECT
  USING (student_id IN (
    SELECT student_id FROM parent_student_links WHERE parent_id = auth.uid()
  ));

-- Attempts: same pattern
CREATE POLICY "Students own their attempts" ON practice_attempts
  FOR ALL USING (student_id = auth.uid());

-- Exams: same pattern
CREATE POLICY "Students own their exams" ON exams
  FOR ALL USING (student_id = auth.uid());

-- Skill stats: same pattern
CREATE POLICY "Students own their skill stats" ON student_skill_stats
  FOR ALL USING (student_id = auth.uid());

-- Weekly plans: same pattern
CREATE POLICY "Students own their plans" ON weekly_plans
  FOR ALL USING (student_id = auth.uid());

-- Questions & Passages: readable by all authenticated users
CREATE POLICY "Published questions are readable" ON questions
  FOR SELECT USING (review_status = 'published');
CREATE POLICY "Published passages are readable" ON passages
  FOR SELECT USING (review_status = 'published');

-- Admins can do everything on questions/passages
CREATE POLICY "Admins manage questions" ON questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins manage passages" ON passages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER questions_updated_at BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER passages_updated_at BEFORE UPDATE ON passages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER sessions_updated_at BEFORE UPDATE ON practice_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER skill_stats_updated_at BEFORE UPDATE ON student_skill_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update question stats on new attempt
CREATE OR REPLACE FUNCTION update_question_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE questions SET
    times_attempted = times_attempted + 1,
    times_correct = times_correct + CASE WHEN NEW.is_correct THEN 1 ELSE 0 END
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attempt_updates_question_stats
  AFTER INSERT ON practice_attempts
  FOR EACH ROW EXECUTE FUNCTION update_question_stats();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
