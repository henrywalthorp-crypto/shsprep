import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const track = searchParams.get('track') || 'math';

  // Get units with their lessons
  const { data: units, error } = await supabase
    .from('lesson_units')
    .select(`
      id, track, unit_number, title, description, icon, color, lessons_count,
      lessons (id, lesson_number, title, subtitle, estimated_minutes)
    `)
    .eq('track', track)
    .order('unit_number')
    .order('lesson_number', { referencedTable: 'lessons' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get student progress
  const { data: lessonProgress } = await supabase
    .from('student_lesson_progress')
    .select('lesson_id, status, score, completed_at')
    .eq('student_id', user.id);

  const { data: unitProgress } = await supabase
    .from('student_unit_progress')
    .select('unit_id, status, completed_at')
    .eq('student_id', user.id);

  const lessonProgressMap = new Map(
    (lessonProgress || []).map(p => [p.lesson_id, p])
  );
  const unitProgressMap = new Map(
    (unitProgress || []).map(p => [p.unit_id, p])
  );

  // Build response with progress status
  const result = units?.map((unit, unitIndex) => {
    const unitProg = unitProgressMap.get(unit.id);
    const unitStatus = unitProg?.status || (unitIndex === 0 ? 'available' : 'locked');

    const lessons = (unit.lessons || []).map((lesson: any, lessonIndex: number) => {
      const prog = lessonProgressMap.get(lesson.id);
      let status = prog?.status || 'locked';

      // First lesson of first unit is always available
      if (unitIndex === 0 && lessonIndex === 0 && status === 'locked') {
        status = 'available';
      }

      // If previous lesson is completed, this one is available
      if (status === 'locked' && lessonIndex > 0) {
        const prevLesson = (unit.lessons as any[])[lessonIndex - 1];
        const prevProg = lessonProgressMap.get(prevLesson.id);
        if (prevProg?.status === 'completed') {
          status = 'available';
        }
      }

      // If previous unit's last lesson is completed, first lesson of this unit is available
      if (status === 'locked' && lessonIndex === 0 && unitIndex > 0) {
        const prevUnit = units[unitIndex - 1];
        const prevLessons = prevUnit.lessons as any[] || [];
        if (prevLessons.length > 0) {
          const lastLesson = prevLessons[prevLessons.length - 1];
          const lastProg = lessonProgressMap.get(lastLesson.id);
          if (lastProg?.status === 'completed') {
            status = 'available';
          }
        }
      }

      return {
        ...lesson,
        status,
        score: prog?.score,
        completed_at: prog?.completed_at,
      };
    });

    return {
      ...unit,
      lessons,
      status: unitStatus === 'locked' && unitIndex === 0 ? 'available' : unitStatus,
    };
  });

  return NextResponse.json({ units: result });
}
