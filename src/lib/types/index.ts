// ============================================================================
// Shared TypeScript types — mirrors DB schema exactly
// ============================================================================

// Enums matching Postgres enums
export type UserRole = 'student' | 'parent' | 'admin'
export type GradeLevel = '6' | '7' | '8' | '9'
export type SectionType = 'ela' | 'math'
export type QuestionType =
  | 'multiple_choice'
  | 'grid_in'
  | 'multi_select'
  | 'drag_drop'
  | 'matrix_sort'
  | 'inline_choice'
  | 'dropdown'
export type DifficultyLevel = '1' | '2' | '3'
export type ReviewStatus = 'draft' | 'reviewed' | 'approved' | 'published'
export type PassageType = 'fiction' | 'nonfiction' | 'poetry' | 'historical'
export type SessionMode = 'practice' | 'timed_practice' | 'exam' | 'review'
export type SessionStatus = 'in_progress' | 'completed' | 'abandoned'
export type TrendDirection = 'improving' | 'declining' | 'stable'

// ============================================================================
// DB Row Types
// ============================================================================

export interface Profile {
  id: string
  role: UserRole
  first_name: string
  last_name: string
  email: string
  grade: GradeLevel | null
  target_school: string | null
  avatar_url: string | null
  onboarding_complete: boolean
  created_at: string
  updated_at: string
}

export interface Passage {
  id: string
  type: PassageType
  title: string
  text: string
  word_count: number
  reading_level: string | null
  metadata: Record<string, unknown>
  review_status: ReviewStatus
  created_at: string
  updated_at: string
}

export interface QuestionOption {
  label: string
  text: string
  isCorrect: boolean
}

export interface CommonMistake {
  label: string
  explanation: string
}

export interface Question {
  id: string
  section: SectionType
  category: string
  subcategory: string | null
  difficulty: DifficultyLevel
  type: QuestionType
  stem: string
  stimulus: string | null
  options: QuestionOption[] | null
  correct_answer: string
  passage_id: string | null
  passage_question_order: number | null
  explanation: string
  common_mistakes: CommonMistake[]
  tei_config: Record<string, unknown> | null
  skills: string[]
  tags: string[]
  review_status: ReviewStatus
  times_attempted: number
  times_correct: number
  avg_time_seconds: number | null
  created_at: string
  updated_at: string
}

export interface PracticeSession {
  id: string
  student_id: string
  mode: SessionMode
  status: SessionStatus
  section_filter: SectionType | null
  category_filter: string | null
  difficulty_filter: DifficultyLevel | null
  time_limit_seconds: number | null
  time_spent_seconds: number
  started_at: string
  completed_at: string | null
  total_questions: number
  correct_count: number
  accuracy: number | null
  created_at: string
  updated_at: string
}

export interface PracticeAttempt {
  id: string
  session_id: string
  question_id: string
  student_id: string
  selected_answer: string | null
  is_correct: boolean | null
  time_spent_seconds: number | null
  attempt_order: number | null
  confidence_before: number | null
  created_at: string
}

export interface Exam {
  id: string
  student_id: string
  session_id: string | null
  ela_raw_score: number | null
  math_raw_score: number | null
  ela_scaled_score: number | null
  math_scaled_score: number | null
  composite_score: number | null
  ela_revising_correct: number | null
  ela_revising_total: number | null
  ela_reading_correct: number | null
  ela_reading_total: number | null
  math_mc_correct: number | null
  math_mc_total: number | null
  math_gridin_correct: number | null
  math_gridin_total: number | null
  time_spent_seconds: number | null
  completed_at: string | null
  created_at: string
}

export interface StudentSkillStats {
  id: string
  student_id: string
  category: string
  total_attempted: number
  total_correct: number
  accuracy: number
  recent_accuracy: number
  trend: TrendDirection
  mastery_level: number
  last_practiced_at: string | null
  updated_at: string
}

export interface WeeklyPlan {
  id: string
  student_id: string
  week_start: string
  focus_skills: string[]
  recommended_questions: Record<string, unknown>[]
  daily_targets: Record<string, number>
  questions_completed: number
  questions_target: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Engine Types
// ============================================================================

export interface SessionConfig {
  section?: SectionType
  category?: string
  difficulty?: DifficultyLevel
  mode: SessionMode
  questionCount: number
}

export interface QuestionSelection {
  questionId: string
  category: string
  difficulty: DifficultyLevel
  reason: string
}

export interface EngineSkillStats {
  category: string
  totalAttempted: number
  totalCorrect: number
  accuracy: number
  recentAccuracy: number
  trend: TrendDirection
  masteryLevel: number
  lastPracticedAt: string | null
}

export interface ExamScore {
  elaRawScore: number
  mathRawScore: number
  elaScaledScore: number
  mathScaledScore: number
  compositeScore: number
  elaRevisingCorrect: number
  elaRevisingTotal: number
  elaReadingCorrect: number
  elaReadingTotal: number
  mathMcCorrect: number
  mathMcTotal: number
  mathGridInCorrect: number
  mathGridInTotal: number
}

// ============================================================================
// API Types
// ============================================================================

export interface SubmitAnswerRequest {
  sessionId: string
  questionId: string
  answer: string
  timeSpent: number
}

export interface SubmitAnswerResponse {
  isCorrect: boolean
  correctAnswer: string
  explanation: string
  nextQuestion: QuestionSelection | null
  updatedMastery: number
}

export interface StartSessionRequest {
  section?: SectionType
  category?: string
  difficulty?: DifficultyLevel
  mode: SessionMode
  questionCount: number
}

export interface StartSessionResponse {
  sessionId: string
  questions: QuestionSelection[]
}
