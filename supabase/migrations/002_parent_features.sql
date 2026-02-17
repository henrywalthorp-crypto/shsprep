-- Parent Features Migration
-- Adds invite codes, parent-student linking RLS, and parent read access

-- Add invite code to profiles (for student-parent linking)
ALTER TABLE profiles ADD COLUMN invite_code VARCHAR(8) UNIQUE;

-- Function to generate random 6-char alphanumeric invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_count INT;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 6));
    SELECT COUNT(*) INTO exists_count FROM profiles WHERE invite_code = code;
    EXIT WHEN exists_count = 0;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Auto-generate invite code for new students
CREATE OR REPLACE FUNCTION set_student_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'student' AND NEW.invite_code IS NULL THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_invite_code
  BEFORE INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_student_invite_code();

-- RLS for parent_student_links
CREATE POLICY "Parents can link to students" ON parent_student_links
  FOR INSERT WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Users can view own links" ON parent_student_links
  FOR SELECT USING (parent_id = auth.uid() OR student_id = auth.uid());

CREATE POLICY "Either party can unlink" ON parent_student_links
  FOR DELETE USING (parent_id = auth.uid() OR student_id = auth.uid());

-- Parents can view linked students' skill stats
CREATE POLICY "Parents can view student skill stats" ON student_skill_stats
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parent_student_links WHERE parent_id = auth.uid())
  );

-- Parents can view linked students' exams
CREATE POLICY "Parents can view student exams" ON exams
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parent_student_links WHERE parent_id = auth.uid())
  );

-- Parents can view linked students' weekly plans
CREATE POLICY "Parents can view student weekly plans" ON weekly_plans
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parent_student_links WHERE parent_id = auth.uid())
  );

-- Parents can view linked students' practice attempts (for detailed analysis)
CREATE POLICY "Parents can view student attempts" ON practice_attempts
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parent_student_links WHERE parent_id = auth.uid())
  );
