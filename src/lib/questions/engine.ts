// Adaptive Question Selection Engine
// Implements Bayesian mastery estimation + spaced repetition for SHSAT prep

import type {
  DifficultyLevel,
  EngineSkillStats,
  ExamScore,
  Question,
  QuestionSelection,
  SessionConfig,
  TrendDirection,
} from '@/lib/types'

// ============================================================================
// Constants
// ============================================================================

const DIFFICULTY_K: Record<string, number> = { '1': 0.05, '2': 0.1, '3': 0.15 }
const COOLDOWN_QUESTIONS = 50

const WEIGHTS = {
  weakness: 0.4,
  staleness: 0.25,
  difficultyMatch: 0.2,
  variety: 0.15,
}

// SHSAT scaled score approximation (piecewise linear from public data)
// Raw → Scaled mapping: 0→200, 28→350, 57→800 (approximate)
function rawToScaled(raw: number, total: number): number {
  const pct = total > 0 ? raw / total : 0
  // Simple piecewise: 200 + 600 * pct^0.8 (concave curve rewarding higher raw)
  return Math.round(200 + 600 * Math.pow(pct, 0.8))
}

// ============================================================================
// Core Functions
// ============================================================================

/**
 * Bayesian mastery update.
 * K varies by difficulty: easy=0.05, medium=0.1, hard=0.15
 */
export function updateMastery(
  currentMastery: number,
  isCorrect: boolean,
  difficulty: DifficultyLevel = '2'
): number {
  const K = DIFFICULTY_K[difficulty] ?? 0.1
  const outcome = isCorrect ? 1 : 0
  const updated = currentMastery + K * (outcome - currentMastery)
  return Math.max(0.01, Math.min(0.99, updated))
}

/**
 * Map mastery to appropriate difficulty.
 */
export function getDifficultyForMastery(mastery: number): DifficultyLevel {
  if (mastery < 0.35) return '1'
  if (mastery <= 0.65) return '2'
  return '3'
}

/**
 * Calculate performance trend from recent results.
 * Compares first half vs second half of last 20 results.
 */
export function calculateTrend(recentResults: boolean[]): TrendDirection {
  const window = recentResults.slice(-20)
  if (window.length < 4) return 'stable'
  const mid = Math.floor(window.length / 2)
  const firstHalf = window.slice(0, mid)
  const secondHalf = window.slice(mid)
  const firstAcc = firstHalf.filter(Boolean).length / firstHalf.length
  const secondAcc = secondHalf.filter(Boolean).length / secondHalf.length
  const diff = secondAcc - firstAcc
  if (diff > 0.1) return 'improving'
  if (diff < -0.1) return 'declining'
  return 'stable'
}

/**
 * Score a category for selection priority. Higher = more likely to be selected.
 */
function scoreCategory(
  stats: EngineSkillStats,
  targetDifficulty: DifficultyLevel,
  recentCategories: string[],
  now: number = Date.now()
): number {
  // Weakness: lower mastery → higher score
  const weaknessScore = 1 - stats.masteryLevel

  // Staleness: longer since last practice → higher score
  let stalenessScore = 1
  if (stats.lastPracticedAt) {
    const hoursSince = (now - new Date(stats.lastPracticedAt).getTime()) / (1000 * 60 * 60)
    stalenessScore = Math.min(hoursSince / 168, 1) // caps at 1 week
  }

  // Difficulty match: how well does the target difficulty match this category's ideal?
  const idealDiff = getDifficultyForMastery(stats.masteryLevel)
  const diffMatchScore = idealDiff === targetDifficulty ? 1 : 0.5

  // Variety penalty: if category appeared in last 2 selections, penalize
  const recentCount = recentCategories.slice(-2).filter((c) => c === stats.category).length
  const varietyScore = recentCount === 0 ? 1 : recentCount === 1 ? 0.3 : 0

  return (
    WEIGHTS.weakness * weaknessScore +
    WEIGHTS.staleness * stalenessScore +
    WEIGHTS.difficultyMatch * diffMatchScore +
    WEIGHTS.variety * varietyScore
  )
}

/**
 * Select an optimal set of questions for a practice session.
 *
 * Uses weakness priority, spaced repetition, difficulty matching,
 * variety constraints, and passage grouping.
 */
export function selectQuestions(
  skillStats: EngineSkillStats[],
  config: SessionConfig,
  availableQuestions: Question[],
  recentQuestionIds: string[] = []
): QuestionSelection[] {
  const recentSet = new Set(recentQuestionIds.slice(-COOLDOWN_QUESTIONS))

  // Filter available questions
  let pool = availableQuestions.filter((q) => !recentSet.has(q.id))
  if (config.section) pool = pool.filter((q) => q.section === config.section)
  if (config.category) pool = pool.filter((q) => q.category === config.category)
  if (config.difficulty) pool = pool.filter((q) => q.difficulty === config.difficulty)

  if (pool.length === 0) return []

  // Build stats lookup
  const statsMap = new Map(skillStats.map((s) => [s.category, s]))

  // Build passage groups: passageId → question[]
  const passageGroups = new Map<string, Question[]>()
  const standaloneQuestions: Question[] = []
  for (const q of pool) {
    if (q.passage_id) {
      const group = passageGroups.get(q.passage_id) || []
      group.push(q)
      passageGroups.set(q.passage_id, group)
    } else {
      standaloneQuestions.push(q)
    }
  }
  // Sort passage groups by passage_question_order
  for (const group of passageGroups.values()) {
    group.sort((a, b) => (a.passage_question_order ?? 0) - (b.passage_question_order ?? 0))
  }

  const selected: QuestionSelection[] = []
  const selectedIds = new Set<string>()
  const recentCategories: string[] = []
  const target = config.questionCount

  while (selected.length < target) {
    // Score all candidate questions
    type Candidate = { question: Question; score: number; reason: string; batch: Question[] }
    const candidates: Candidate[] = []

    // Score standalone questions
    for (const q of standaloneQuestions) {
      if (selectedIds.has(q.id)) continue
      const stats = statsMap.get(q.category)
      const mastery = stats?.masteryLevel ?? 0.5
      const targetDiff = config.difficulty ?? getDifficultyForMastery(mastery)
      const s = stats
        ? scoreCategory(stats, targetDiff, recentCategories)
        : 0.5 // default score for unknown categories
      const diffBonus = q.difficulty === targetDiff ? 0.2 : 0
      candidates.push({
        question: q,
        score: s + diffBonus,
        reason: stats
          ? `mastery=${mastery.toFixed(2)}, trend=${stats.trend}`
          : 'new category',
        batch: [q],
      })
    }

    // Score passage groups (use average score across questions in the group)
    for (const [passageId, group] of passageGroups) {
      if (group.some((q) => selectedIds.has(q.id))) continue
      const cat = group[0].category
      const stats = statsMap.get(cat)
      const mastery = stats?.masteryLevel ?? 0.5
      const targetDiff = config.difficulty ?? getDifficultyForMastery(mastery)
      const s = stats ? scoreCategory(stats, targetDiff, recentCategories) : 0.5
      candidates.push({
        question: group[0],
        score: s,
        reason: `passage group (${group.length} questions), passage=${passageId.slice(0, 8)}`,
        batch: group,
      })
    }

    if (candidates.length === 0) break

    // Sort by score descending, pick top
    candidates.sort((a, b) => b.score - a.score)

    // Add some randomness: pick from top 3 with weighted probability
    const topN = candidates.slice(0, Math.min(3, candidates.length))
    const totalScore = topN.reduce((sum, c) => sum + c.score, 0)
    let rand = Math.random() * totalScore
    let pick = topN[0]
    for (const c of topN) {
      rand -= c.score
      if (rand <= 0) {
        pick = c
        break
      }
    }

    // Add all questions in the batch (passage grouping)
    for (const q of pick.batch) {
      if (selected.length >= target) break
      selected.push({
        questionId: q.id,
        category: q.category,
        difficulty: q.difficulty,
        reason: pick.reason,
      })
      selectedIds.add(q.id)
      recentCategories.push(q.category)
    }
  }

  return selected
}

/**
 * Adaptive single-question selection for mid-session use.
 * Adjusts based on recent performance.
 */
export function selectNextQuestion(
  skillStats: EngineSkillStats[],
  recentQuestions: { questionId: string; category: string; isCorrect: boolean }[],
  availableQuestions: Question[]
): QuestionSelection | null {
  const recentIds = new Set(recentQuestions.map((r) => r.questionId))
  const pool = availableQuestions.filter((q) => !recentIds.has(q.id))
  if (pool.length === 0) return null

  const statsMap = new Map(skillStats.map((s) => [s.category, s]))
  const recentCategories = recentQuestions.slice(-5).map((r) => r.category)

  // Check last few answers for streaks
  const lastResults = recentQuestions.slice(-3).map((r) => r.isCorrect)
  const streak = lastResults.length === 3 && lastResults.every((r) => r === lastResults[0])

  let best: { question: Question; score: number; reason: string } | null = null

  for (const q of pool) {
    const stats = statsMap.get(q.category)
    const mastery = stats?.masteryLevel ?? 0.5

    // If on a correct streak, bump difficulty; if wrong streak, ease off
    let adjustedMastery = mastery
    if (streak && lastResults[0]) adjustedMastery = Math.min(mastery + 0.15, 0.99)
    if (streak && !lastResults[0]) adjustedMastery = Math.max(mastery - 0.15, 0.01)

    const targetDiff = getDifficultyForMastery(adjustedMastery)
    const s = stats ? scoreCategory(stats, targetDiff, recentCategories) : 0.5
    const diffBonus = q.difficulty === targetDiff ? 0.2 : 0
    const total = s + diffBonus

    if (!best || total > best.score) {
      const reason = streak
        ? `adaptive: ${lastResults[0] ? 'correct' : 'incorrect'} streak, targeting difficulty=${targetDiff}`
        : `mastery=${mastery.toFixed(2)}`
      best = { question: q, score: total, reason }
    }
  }

  if (!best) return null

  return {
    questionId: best.question.id,
    category: best.question.category,
    difficulty: best.question.difficulty,
    reason: best.reason,
  }
}

/**
 * Generate a full exam question set: 57 ELA + 57 Math.
 * ELA: ~11 revising/editing + ~46 reading comprehension
 * Math: ~52 multiple choice + ~5 grid-in
 * Difficulty mix: ~30% easy, ~50% medium, ~20% hard
 */
export function generateExamQuestionSet(availableQuestions: Question[]): string[] {
  const ela = availableQuestions.filter((q) => q.section === 'ela')
  const math = availableQuestions.filter((q) => q.section === 'math')

  const elaRevising = ela.filter((q) => q.category.startsWith('ela.revising'))
  const elaReading = ela.filter((q) => q.category.startsWith('ela.reading'))
  const mathMc = math.filter((q) => q.type === 'multiple_choice')
  const mathGridIn = math.filter((q) => q.type === 'grid_in')

  function pickWithDifficultyMix(pool: Question[], count: number): Question[] {
    const easyTarget = Math.round(count * 0.3)
    const medTarget = Math.round(count * 0.5)
    const hardTarget = count - easyTarget - medTarget

    const byDiff: Record<string, Question[]> = { '1': [], '2': [], '3': [] }
    for (const q of pool) {
      byDiff[q.difficulty]?.push(q)
    }
    // Shuffle each bucket
    for (const arr of Object.values(byDiff)) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }

    const result: Question[] = [
      ...byDiff['1'].slice(0, easyTarget),
      ...byDiff['2'].slice(0, medTarget),
      ...byDiff['3'].slice(0, hardTarget),
    ]

    // If we don't have enough of one difficulty, fill from others
    if (result.length < count) {
      const usedIds = new Set(result.map((q) => q.id))
      const remaining = pool.filter((q) => !usedIds.has(q.id))
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
      }
      result.push(...remaining.slice(0, count - result.length))
    }

    return result.slice(0, count)
  }

  // Handle passage grouping for ELA reading: pick passages, include all their questions
  const passageGroups = new Map<string, Question[]>()
  const standaloneReading: Question[] = []
  for (const q of elaReading) {
    if (q.passage_id) {
      const group = passageGroups.get(q.passage_id) || []
      group.push(q)
      passageGroups.set(q.passage_id, group)
    } else {
      standaloneReading.push(q)
    }
  }

  // Select reading questions by picking passage groups
  const readingSelected: Question[] = []
  const passageEntries = [...passageGroups.entries()]
  // Shuffle passages
  for (let i = passageEntries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[passageEntries[i], passageEntries[j]] = [passageEntries[j], passageEntries[i]]
  }
  for (const [, group] of passageEntries) {
    if (readingSelected.length + group.length <= 46) {
      readingSelected.push(...group.sort((a, b) => (a.passage_question_order ?? 0) - (b.passage_question_order ?? 0)))
    }
    if (readingSelected.length >= 46) break
  }
  // Fill remaining from standalone
  if (readingSelected.length < 46) {
    readingSelected.push(...standaloneReading.slice(0, 46 - readingSelected.length))
  }

  const revisingSelected = pickWithDifficultyMix(elaRevising, 11)
  const mathMcSelected = pickWithDifficultyMix(mathMc, 52)
  const mathGridInSelected = pickWithDifficultyMix(mathGridIn, 5)

  return [
    ...revisingSelected.map((q) => q.id),
    ...readingSelected.map((q) => q.id),
    ...mathMcSelected.map((q) => q.id),
    ...mathGridInSelected.map((q) => q.id),
  ]
}

/**
 * Score a completed exam. Computes raw scores, estimates scaled scores, and composite.
 */
export function scoreExam(
  attempts: { questionId: string; isCorrect: boolean; question: Question }[]
): ExamScore {
  const ela = attempts.filter((a) => a.question.section === 'ela')
  const math = attempts.filter((a) => a.question.section === 'math')

  const elaRevising = ela.filter((a) => a.question.category.startsWith('ela.revising'))
  const elaReading = ela.filter((a) => a.question.category.startsWith('ela.reading'))
  const mathMc = math.filter((a) => a.question.type === 'multiple_choice')
  const mathGridIn = math.filter((a) => a.question.type === 'grid_in')

  const count = (arr: typeof attempts) => arr.filter((a) => a.isCorrect).length

  const elaRaw = count(ela)
  const mathRaw = count(math)

  return {
    elaRawScore: elaRaw,
    mathRawScore: mathRaw,
    elaScaledScore: rawToScaled(elaRaw, ela.length),
    mathScaledScore: rawToScaled(mathRaw, math.length),
    compositeScore: rawToScaled(elaRaw, ela.length) + rawToScaled(mathRaw, math.length),
    elaRevisingCorrect: count(elaRevising),
    elaRevisingTotal: elaRevising.length,
    elaReadingCorrect: count(elaReading),
    elaReadingTotal: elaReading.length,
    mathMcCorrect: count(mathMc),
    mathMcTotal: mathMc.length,
    mathGridInCorrect: count(mathGridIn),
    mathGridInTotal: mathGridIn.length,
  }
}
