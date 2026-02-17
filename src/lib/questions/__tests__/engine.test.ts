import { describe, it, expect } from 'vitest'
import {
  updateMastery,
  getDifficultyForMastery,
  calculateTrend,
  selectQuestions,
  generateExamQuestionSet,
  scoreExam,
} from '../engine'
import type { Question, EngineSkillStats, SessionConfig } from '@/lib/types'

// ============================================================================
// Helpers
// ============================================================================

function makeQuestion(overrides: Partial<Question> & { id: string }): Question {
  return {
    section: 'math',
    category: 'math.algebra',
    subcategory: null,
    difficulty: '2',
    type: 'multiple_choice',
    stem: 'Test question',
    stimulus: null,
    options: [{ label: 'A', text: 'Answer', id: 'a' }],
    correct_answer: 'A',
    passage_id: null,
    passage_question_order: null,
    explanation: 'Because.',
    common_mistakes: [],
    tei_config: null,
    review_status: 'published',
    tags: [],
    created_by: 'test',
    created_at: '2025-01-01',
    updated_at: '2025-01-01',
    ...overrides,
  } as Question
}

function makeStats(overrides: Partial<EngineSkillStats> = {}): EngineSkillStats {
  return {
    category: 'math.algebra',
    totalAttempted: 10,
    totalCorrect: 5,
    accuracy: 0.5,
    recentAccuracy: 0.5,
    trend: 'stable',
    masteryLevel: 0.5,
    lastPracticedAt: null,
    ...overrides,
  }
}

// ============================================================================
// updateMastery
// ============================================================================

describe('updateMastery', () => {
  it('correct answer increases mastery', () => {
    expect(updateMastery(0.5, true)).toBeGreaterThan(0.5)
  })

  it('incorrect answer decreases mastery', () => {
    expect(updateMastery(0.5, false)).toBeLessThan(0.5)
  })

  it('uses K=0.05 for easy difficulty', () => {
    const result = updateMastery(0.5, true, '1')
    // 0.5 + 0.05 * (1 - 0.5) = 0.525
    expect(result).toBeCloseTo(0.525, 10)
  })

  it('uses K=0.1 for medium difficulty', () => {
    const result = updateMastery(0.5, true, '2')
    // 0.5 + 0.1 * (1 - 0.5) = 0.55
    expect(result).toBeCloseTo(0.55, 10)
  })

  it('uses K=0.15 for hard difficulty', () => {
    const result = updateMastery(0.5, true, '3')
    // 0.5 + 0.15 * (1 - 0.5) = 0.575
    expect(result).toBeCloseTo(0.575, 10)
  })

  it('clamps to minimum 0.01', () => {
    // Start near 0, incorrect answer
    const result = updateMastery(0.01, false, '3')
    // 0.01 + 0.15 * (0 - 0.01) = 0.01 - 0.0015 = 0.0085 → clamped to 0.01
    expect(result).toBeGreaterThanOrEqual(0.01)
  })

  it('clamps to maximum 0.99', () => {
    const result = updateMastery(0.99, true, '3')
    // 0.99 + 0.15 * (1 - 0.99) = 0.99 + 0.0015 = 0.9915 → clamped to 0.99
    expect(result).toBeLessThanOrEqual(0.99)
  })

  it('edge: mastery at 0 with correct answer', () => {
    const result = updateMastery(0, true, '2')
    // 0 + 0.1 * (1 - 0) = 0.1
    expect(result).toBeCloseTo(0.1, 10)
  })

  it('edge: mastery at 1 with incorrect answer', () => {
    const result = updateMastery(1, false, '2')
    // 1 + 0.1 * (0 - 1) = 0.9
    expect(result).toBeCloseTo(0.9, 10)
  })
})

// ============================================================================
// getDifficultyForMastery
// ============================================================================

describe('getDifficultyForMastery', () => {
  it('low mastery returns difficulty 1', () => {
    expect(getDifficultyForMastery(0.1)).toBe('1')
    expect(getDifficultyForMastery(0.2)).toBe('1')
  })

  it('medium mastery returns difficulty 2', () => {
    expect(getDifficultyForMastery(0.5)).toBe('2')
  })

  it('high mastery returns difficulty 3', () => {
    expect(getDifficultyForMastery(0.8)).toBe('3')
    expect(getDifficultyForMastery(0.99)).toBe('3')
  })

  it('boundary: 0.35 returns difficulty 2', () => {
    expect(getDifficultyForMastery(0.35)).toBe('2')
  })

  it('boundary: just below 0.35 returns difficulty 1', () => {
    expect(getDifficultyForMastery(0.349)).toBe('1')
  })

  it('boundary: 0.65 returns difficulty 2', () => {
    expect(getDifficultyForMastery(0.65)).toBe('2')
  })

  it('boundary: just above 0.65 returns difficulty 3', () => {
    expect(getDifficultyForMastery(0.651)).toBe('3')
  })
})

// ============================================================================
// calculateTrend
// ============================================================================

describe('calculateTrend', () => {
  it('all correct returns stable or improving', () => {
    const result = calculateTrend([true, true, true, true, true, true])
    expect(['stable', 'improving']).toContain(result)
  })

  it('improving pattern (wrong then right)', () => {
    const results = [false, false, false, false, true, true, true, true]
    expect(calculateTrend(results)).toBe('improving')
  })

  it('declining pattern (right then wrong)', () => {
    const results = [true, true, true, true, false, false, false, false]
    expect(calculateTrend(results)).toBe('declining')
  })

  it('empty array returns stable', () => {
    expect(calculateTrend([])).toBe('stable')
  })

  it('less than 4 results returns stable', () => {
    expect(calculateTrend([true, false, true])).toBe('stable')
  })

  it('exactly 4 results works', () => {
    const result = calculateTrend([false, false, true, true])
    expect(result).toBe('improving')
  })

  it('mixed results within threshold returns stable', () => {
    // First half: 2/3 correct, second half: 2/3 correct → stable
    const results = [true, true, false, true, true, false]
    expect(calculateTrend(results)).toBe('stable')
  })
})

// ============================================================================
// selectQuestions
// ============================================================================

describe('selectQuestions', () => {
  const questions = [
    makeQuestion({ id: 'q1', category: 'math.algebra', difficulty: '1' }),
    makeQuestion({ id: 'q2', category: 'math.algebra', difficulty: '2' }),
    makeQuestion({ id: 'q3', category: 'math.geometry', difficulty: '2' }),
    makeQuestion({ id: 'q4', category: 'math.geometry', difficulty: '3' }),
    makeQuestion({ id: 'q5', category: 'math.numbers', difficulty: '1' }),
  ]

  const config: SessionConfig = {
    mode: 'practice',
    questionCount: 3,
  }

  it('returns correct number of questions', () => {
    const result = selectQuestions([], config, questions)
    expect(result).toHaveLength(3)
  })

  it('respects difficulty filter', () => {
    const filtered = selectQuestions([], { ...config, difficulty: '2' }, questions)
    for (const s of filtered) {
      expect(s.difficulty).toBe('2')
    }
  })

  it('prioritizes weak categories', () => {
    const stats = [
      makeStats({ category: 'math.algebra', masteryLevel: 0.9 }),
      makeStats({ category: 'math.geometry', masteryLevel: 0.1 }),
      makeStats({ category: 'math.numbers', masteryLevel: 0.5 }),
    ]
    // Run multiple times - weak category (geometry) should appear more often
    let geometryCount = 0
    const runs = 50
    for (let i = 0; i < runs; i++) {
      const result = selectQuestions(stats, { ...config, questionCount: 1 }, questions)
      if (result[0]?.category === 'math.geometry') geometryCount++
    }
    // Geometry (weakest) should be selected significantly more than random (20%)
    expect(geometryCount).toBeGreaterThan(runs * 0.2)
  })

  it('handles empty available questions', () => {
    const result = selectQuestions([], config, [])
    expect(result).toHaveLength(0)
  })

  it('handles no student stats (new user)', () => {
    const result = selectQuestions([], config, questions)
    expect(result.length).toBeGreaterThan(0)
    expect(result.length).toBeLessThanOrEqual(3)
  })

  it('filters by section', () => {
    const mixed = [
      makeQuestion({ id: 'e1', section: 'ela', category: 'ela.reading' }),
      makeQuestion({ id: 'm1', section: 'math', category: 'math.algebra' }),
    ]
    const result = selectQuestions([], { ...config, section: 'ela', questionCount: 1 }, mixed)
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('ela.reading')
  })

  it('excludes recently seen questions', () => {
    const result = selectQuestions([], { ...config, questionCount: 5 }, questions, ['q1', 'q2', 'q3', 'q4'])
    // Only q5 should be available
    expect(result).toHaveLength(1)
    expect(result[0].questionId).toBe('q5')
  })
})

// ============================================================================
// generateExamQuestionSet
// ============================================================================

describe('generateExamQuestionSet', () => {
  // Build a large pool of questions
  function buildExamPool(): Question[] {
    const pool: Question[] = []
    let id = 0

    // 20 ELA revising
    for (let i = 0; i < 20; i++) {
      pool.push(makeQuestion({
        id: `rev-${id++}`,
        section: 'ela',
        category: 'ela.revising.grammar',
        difficulty: (['1', '2', '3'] as const)[i % 3],
      }))
    }

    // 60 ELA reading (standalone)
    for (let i = 0; i < 60; i++) {
      pool.push(makeQuestion({
        id: `read-${id++}`,
        section: 'ela',
        category: 'ela.reading.main_idea',
        difficulty: (['1', '2', '3'] as const)[i % 3],
      }))
    }

    // 70 Math MC
    for (let i = 0; i < 70; i++) {
      pool.push(makeQuestion({
        id: `mc-${id++}`,
        section: 'math',
        category: 'math.algebra',
        type: 'multiple_choice',
        difficulty: (['1', '2', '3'] as const)[i % 3],
      }))
    }

    // 10 Math grid-in
    for (let i = 0; i < 10; i++) {
      pool.push(makeQuestion({
        id: `gi-${id++}`,
        section: 'math',
        category: 'math.algebra',
        type: 'grid_in',
        difficulty: (['1', '2', '3'] as const)[i % 3],
      }))
    }

    return pool
  }

  it('returns exactly 114 questions', () => {
    const pool = buildExamPool()
    const ids = generateExamQuestionSet(pool)
    expect(ids).toHaveLength(114)
  })

  it('has 57 ELA + 57 Math', () => {
    const pool = buildExamPool()
    const ids = new Set(generateExamQuestionSet(pool))
    const poolMap = new Map(pool.map(q => [q.id, q]))
    const elaCount = [...ids].filter(id => poolMap.get(id)!.section === 'ela').length
    const mathCount = [...ids].filter(id => poolMap.get(id)!.section === 'math').length
    expect(elaCount).toBe(57)
    expect(mathCount).toBe(57)
  })

  it('has correct ELA split (~11 revising + ~46 reading)', () => {
    const pool = buildExamPool()
    const ids = new Set(generateExamQuestionSet(pool))
    const poolMap = new Map(pool.map(q => [q.id, q]))
    const revising = [...ids].filter(id => poolMap.get(id)!.category.startsWith('ela.revising')).length
    const reading = [...ids].filter(id => poolMap.get(id)!.category.startsWith('ela.reading')).length
    expect(revising).toBe(11)
    expect(reading).toBe(46)
  })

  it('has correct math type split (~52 MC + ~5 grid-in)', () => {
    const pool = buildExamPool()
    const ids = new Set(generateExamQuestionSet(pool))
    const poolMap = new Map(pool.map(q => [q.id, q]))
    const mathIds = [...ids].filter(id => poolMap.get(id)!.section === 'math')
    const mc = mathIds.filter(id => poolMap.get(id)!.type === 'multiple_choice').length
    const gi = mathIds.filter(id => poolMap.get(id)!.type === 'grid_in').length
    expect(mc).toBe(52)
    expect(gi).toBe(5)
  })

  it('handles insufficient questions gracefully', () => {
    const small = [
      makeQuestion({ id: 's1', section: 'ela', category: 'ela.revising.x' }),
      makeQuestion({ id: 's2', section: 'math', category: 'math.algebra', type: 'multiple_choice' }),
    ]
    // Should not throw
    const ids = generateExamQuestionSet(small)
    expect(ids.length).toBeLessThanOrEqual(114)
  })

  it('returns no duplicates', () => {
    const pool = buildExamPool()
    const ids = generateExamQuestionSet(pool)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

// ============================================================================
// scoreExam
// ============================================================================

describe('scoreExam', () => {
  function makeAttempt(id: string, section: string, category: string, type: string, isCorrect: boolean) {
    return {
      questionId: id,
      isCorrect,
      question: makeQuestion({ id, section: section as any, category, type: type as any }),
    }
  }

  it('perfect score', () => {
    const attempts = [
      ...Array.from({ length: 11 }, (_, i) => makeAttempt(`r${i}`, 'ela', 'ela.revising.x', 'multiple_choice', true)),
      ...Array.from({ length: 46 }, (_, i) => makeAttempt(`rd${i}`, 'ela', 'ela.reading.x', 'multiple_choice', true)),
      ...Array.from({ length: 52 }, (_, i) => makeAttempt(`m${i}`, 'math', 'math.algebra', 'multiple_choice', true)),
      ...Array.from({ length: 5 }, (_, i) => makeAttempt(`g${i}`, 'math', 'math.algebra', 'grid_in', true)),
    ]
    const score = scoreExam(attempts)
    expect(score.elaRawScore).toBe(57)
    expect(score.mathRawScore).toBe(57)
    expect(score.compositeScore).toBe(score.elaScaledScore + score.mathScaledScore)
    expect(score.elaRevisingCorrect).toBe(11)
    expect(score.elaReadingCorrect).toBe(46)
    expect(score.mathMcCorrect).toBe(52)
    expect(score.mathGridInCorrect).toBe(5)
  })

  it('zero score', () => {
    const attempts = [
      ...Array.from({ length: 57 }, (_, i) => makeAttempt(`e${i}`, 'ela', 'ela.reading.x', 'multiple_choice', false)),
      ...Array.from({ length: 57 }, (_, i) => makeAttempt(`m${i}`, 'math', 'math.algebra', 'multiple_choice', false)),
    ]
    const score = scoreExam(attempts)
    expect(score.elaRawScore).toBe(0)
    expect(score.mathRawScore).toBe(0)
  })

  it('mixed score with section breakdowns', () => {
    const attempts = [
      makeAttempt('r1', 'ela', 'ela.revising.x', 'multiple_choice', true),
      makeAttempt('r2', 'ela', 'ela.revising.x', 'multiple_choice', false),
      makeAttempt('rd1', 'ela', 'ela.reading.x', 'multiple_choice', true),
      makeAttempt('rd2', 'ela', 'ela.reading.x', 'multiple_choice', true),
      makeAttempt('rd3', 'ela', 'ela.reading.x', 'multiple_choice', false),
      makeAttempt('m1', 'math', 'math.algebra', 'multiple_choice', true),
      makeAttempt('m2', 'math', 'math.algebra', 'multiple_choice', false),
      makeAttempt('g1', 'math', 'math.algebra', 'grid_in', true),
    ]
    const score = scoreExam(attempts)
    expect(score.elaRawScore).toBe(3)
    expect(score.mathRawScore).toBe(2)
    expect(score.elaRevisingCorrect).toBe(1)
    expect(score.elaRevisingTotal).toBe(2)
    expect(score.elaReadingCorrect).toBe(2)
    expect(score.elaReadingTotal).toBe(3)
    expect(score.mathMcCorrect).toBe(1)
    expect(score.mathMcTotal).toBe(2)
    expect(score.mathGridInCorrect).toBe(1)
    expect(score.mathGridInTotal).toBe(1)
    expect(score.compositeScore).toBe(score.elaScaledScore + score.mathScaledScore)
  })
})
