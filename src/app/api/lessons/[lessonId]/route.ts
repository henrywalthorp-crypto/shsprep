import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Get lesson with its unit info and questions
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select(`
      id, lesson_number, title, subtitle, content, estimated_minutes,
      unit_id,
      lesson_units (id, title, track, unit_number, icon, color),
      lesson_questions (id, question_order, question_id, inline_question)
    `)
    .eq('id', lessonId)
    .order('question_order', { referencedTable: 'lesson_questions' })
    .single();

  if (error || !lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  // Get or create progress
  const { data: progress } = await supabase
    .from('student_lesson_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('lesson_id', lessonId)
    .single();

  // Mark as in_progress if not already
  if (!progress || progress.status === 'available' || progress.status === 'locked') {
    await supabase.from('student_lesson_progress').upsert(
      {
        student_id: user.id,
        lesson_id: lessonId,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      },
      { onConflict: 'student_id,lesson_id' }
    );
  }

  return NextResponse.json({ lesson, progress });
}
