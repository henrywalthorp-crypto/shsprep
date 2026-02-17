// Adaptive Question Selection Engine
// Implements Bayesian mastery estimation + spaced repetition for SHSAT prep

// ============================================================================
// Types
// ============================================================================

export interface StudentSkillStats {
  category: string
  totalAttempted: number
  totalCorrect: number
  accuracy: number
  recentAccuracy: number
  trend: 'improving' | 'declining' | 'stable'
  masteryLevel: number // 0-1 scale
  lastPracticedAt: Date | null
}

export interface Question {
  id: string
  section: 'ela' | 'math'
  category: string
  subcategory: string | null
  difficulty: '1' | '2' | '3'
  type: string
  passageId: string | null
}

export interface QuestionSelection {
  questions: Question[]
  reasoning: string // Why these questions were selected (for debugging)
}

export interface SessionConfig {
  section?: 'ela' | 'math'
  category?: string
  difficulty?: '1' | '2' | '3'
  mode: 'practice' | 'timed_practice' | 'exam' | 'review'
  questionCount: number
}

export interface AnswerResult {
  isCorrect: boolean
  updatedMastery: number
  updatedTrend: 'improving' | 'declining' | 'stable'
}

// ============================================================================
// Constants
// ============================================================================

const LEARNING_RATE = 0.1 // K factor for Bayesian update
const RECENT_WINDOW = 20 // Number of recent attempts for trend calculation
const COOLDOWN_QUESTIONS = 50 // Don't repeat questions within this many attempts
const DIFFICULTY_BANDS = {
  low: { min: 0, max: 0.4, difficulty: '1' as const },
  mid: { min: 0.4, max: 0.7, difficulty: '2' as const },
  high: { min: 0.7, max: 1.0, difficulty: '3' as const },
}

// Weights for question scoring
const WEIGHTS = {
  weaknessPriority: 0.4, // Prioritize weak skills
  spacedRepetition: 0.25, // Prioritize skills not practiced recently
  difficultyMatch: 0.2, // Match difficulty to mastery level
  variety: 0.15, // Ensure topic variety within session
}

// ============================================================================
// Core Engine
// ============================================================================

/**
 * Select questions for a new practice session based on student's skill profile.
 *
 * Algorithm:
 * 1. Score each category by: weakness (low mastery) + staleness (not practiced recently)
 * 2. Select top categories proportionally
 * 3. Within each category, pick questions at appropriate difficulty
 * 4. Exclude recently-seen questions
 * 5. Group passage-based questions together
 */
export async function selectQuestions(
  _studentId: string,
  _skillStats: StudentSkillStats[],
  _config: SessionConfig,
  _recentQuestionIds: string[] // Last COOLDOWN_QUESTIONS question IDs
): Promise<QuestionSelection> {
  // TODO: Implement
  // 1. If config has category filter, only consider that category
  // 2. Score categories using WEIGHTS
  // 3. Determine difficulty per category using DIFFICULTY_BANDS
  // 4. Query questions from Supabase with filters
  // 5. Exclude recentQuestionIds
  // 6. Handle passage grouping (all questions for a passage must appear together)
  // 7. Return ordered question list

  return {
    questions: [],
    reasoning: 'Not implemented',
  }
}

/**
 * Select the next question adaptively during an active session.
 * Called after each answer to determine what to show next.
 */
export async function selectNextQuestion(
  _studentId: string,
  _skillStats: StudentSkillStats[],
  _sessionQuestionIds: string[], // Questions already in this session
  _config: SessionConfig
): Promise<Question | null> {
  // TODO: Implement
  // Similar to selectQuestions but picks one at a time
  // Takes into account answers given so far in this session
  return null
}

/**
 * Update mastery level after a student answers a question.
 * Uses Bayesian update: new_mastery = mastery + K * (is_correct - mastery)
 */
export function updateMastery(
  currentMastery: number,
  isCorrect: boolean
): number {
  const outcome = isCorrect ? 1 : 0
  return currentMastery + LEARNING_RATE * (outcome - currentMastery)
}

/**
 * Determine difficulty level appropriate for a given mastery level.
 */
export function getDifficultyForMastery(mastery: number): '1' | '2' | '3' {
  if (mastery < DIFFICULTY_BANDS.low.max) return '1'
  if (mastery < DIFFICULTY_BANDS.mid.max) return '2'
  return '3'
}

/**
 * Calculate trend based on recent accuracy vs overall accuracy.
 */
export function calculateTrend(
  overallAccuracy: number,
  recentAccuracy: number
): 'improving' | 'declining' | 'stable' {
  const diff = recentAccuracy - overallAccuracy
  if (diff > 0.1) return 'improving'
  if (diff < -0.1) return 'declining'
  return 'stable'
}

/**
 * Score a category for question selection priority.
 * Higher score = more likely to be selected.
 */
export function scoreCategory(
  stats: StudentSkillStats,
  now: Date = new Date()
): number {
  // Weakness priority: lower mastery = higher score
  const weaknessScore = 1 - stats.masteryLevel

  // Spaced repetition: longer since last practice = higher score
  let stalenessScore = 1
  if (stats.lastPracticedAt) {
    const hoursSince = (now.getTime() - stats.lastPracticedAt.getTime()) / (1000 * 60 * 60)
    stalenessScore = Math.min(hoursSince / 168, 1) // Max out at 1 week
  }

  // Combine with weights
  return (
    WEIGHTS.weaknessPriority * weaknessScore +
    WEIGHTS.spacedRepetition * stalenessScore
  )
}
