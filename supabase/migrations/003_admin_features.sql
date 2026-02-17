-- 003_admin_features.sql
-- Admin RLS policies for analytics access + promote_to_admin function

-- Admin policies for practice_sessions (view all for analytics)
CREATE POLICY "Admins view all sessions" ON practice_sessions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin policies for practice_attempts (view all for analytics)
CREATE POLICY "Admins view all attempts" ON practice_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin policies for student_skill_stats (view all for analytics)
CREATE POLICY "Admins view all skill stats" ON student_skill_stats
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin policies for exams (view all for analytics)
CREATE POLICY "Admins view all exams" ON exams
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admin can view all profiles (for user management/analytics)
CREATE POLICY "Admins view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Function to promote a user to admin role
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET role = 'admin' WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
