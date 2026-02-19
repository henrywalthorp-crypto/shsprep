import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function run() {
  // Create tables using raw SQL via rpc or REST.
  // Supabase JS doesn't support DDL, so we use the REST SQL endpoint.
  
  const sql = `
    -- Lesson Units (topic groups on the road)
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

    -- Individual lessons within units
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

    -- Practice questions embedded in lessons
    CREATE TABLE IF NOT EXISTS lesson_questions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
      question_order INTEGER NOT NULL,
      question_id UUID REFERENCES questions(id) ON DELETE SET NULL,
      inline_question JSONB,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(lesson_id, question_order)
    );

    -- Student progress per lesson
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

    -- Student progress per unit
    CREATE TABLE IF NOT EXISTS student_unit_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
      unit_id UUID REFERENCES lesson_units(id) ON DELETE CASCADE,
      status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      UNIQUE(student_id, unit_id)
    );

    -- RLS policies
    ALTER TABLE lesson_units ENABLE ROW LEVEL SECURITY;
    ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
    ALTER TABLE lesson_questions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE student_lesson_progress ENABLE ROW LEVEL SECURITY;
    ALTER TABLE student_unit_progress ENABLE ROW LEVEL SECURITY;

    -- Public read for lesson content
    DO $$ BEGIN
      CREATE POLICY "lesson_units_read" ON lesson_units FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    
    DO $$ BEGIN
      CREATE POLICY "lessons_read" ON lessons FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    
    DO $$ BEGIN
      CREATE POLICY "lesson_questions_read" ON lesson_questions FOR SELECT USING (true);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    -- Students can read/write their own progress
    DO $$ BEGIN
      CREATE POLICY "student_lesson_progress_own" ON student_lesson_progress
        FOR ALL USING (auth.uid() = student_id);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    
    DO $$ BEGIN
      CREATE POLICY "student_unit_progress_own" ON student_unit_progress
        FOR ALL USING (auth.uid() = student_id);
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `;

  // Execute via Supabase Management API (SQL Editor)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );

  // The REST rpc endpoint won't work for DDL. Let's use the SQL endpoint directly.
  console.log('Note: DDL must be run directly in Supabase SQL Editor or via pg connection.');
  console.log('SQL to execute:');
  console.log(sql);
}

run().catch(console.error);
