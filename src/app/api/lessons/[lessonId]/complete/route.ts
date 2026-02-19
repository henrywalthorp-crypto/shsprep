import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { score } = await request.json();

  // Must score at least 70% to complete
  if (score < 70) {
    return NextResponse.json({
      error: 'You need at least 70% to complete this lesson. Try again!',
      passed: false,
      score,
    }, { status: 200 });
  }

  // Mark lesson as completed
  await supabase.from('student_lesson_progress').upsert(
    {
      student_id: user.id,
      lesson_id: lessonId,
      status: 'completed',
      score,
      completed_at: new Date().toISOString(),
    },
    { onConflict: 'student_id,lesson_id' }
  );

  // Check if all lessons in the unit are completed
  const { data: lesson } = await supabase
    .from('lessons')
    .select('unit_id')
    .eq('id', lessonId)
    .single();

  if (lesson) {
    const { data: unitLessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('unit_id', lesson.unit_id);

    const lessonIds = (unitLessons || []).map(l => l.id);

    const { data: completedLessons } = await supabase
      .from('student_lesson_progress')
      .select('lesson_id')
      .eq('student_id', user.id)
      .in('lesson_id', lessonIds)
      .eq('status', 'completed');

    if (completedLessons && completedLessons.length >= lessonIds.length) {
      // All lessons done — mark unit completed
      await supabase.from('student_unit_progress').upsert(
        {
          student_id: user.id,
          unit_id: lesson.unit_id,
          status: 'completed',
          completed_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,unit_id' }
      );
    }

    // Make next lesson available
    const { data: currentLesson } = await supabase
      .from('lessons')
      .select('lesson_number, unit_id')
      .eq('id', lessonId)
      .single();

    if (currentLesson) {
      const { data: nextLesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('unit_id', currentLesson.unit_id)
        .eq('lesson_number', currentLesson.lesson_number + 1)
        .single();

      if (nextLesson) {
        await supabase.from('student_lesson_progress').upsert(
          {
            student_id: user.id,
            lesson_id: nextLesson.id,
            status: 'available',
          },
          { onConflict: 'student_id,lesson_id' }
        );
      }
    }
  }

  return NextResponse.json({ passed: true, score });
}
