// ============================================================================
// SHSAT Question Category System
// Maps raw DB keys → clean labels and groups them into student-facing topics
// ============================================================================

export interface CategoryGroup {
  id: string;
  label: string;
  section: 'math' | 'ela';
  description: string;
  icon: string; // emoji
  /** Raw DB category keys that map to this group */
  keys: string[];
  targetCount: number; // target questions per group
}

// ============================================================================
// Category Groups — the student-facing topic list
// ============================================================================

export const CATEGORY_GROUPS: CategoryGroup[] = [
  // ── MATH ──────────────────────────────────────────────────────────────────
  {
    id: 'math-algebra',
    label: 'Algebra & Equations',
    section: 'math',
    description: 'Linear equations, systems of equations, and algebraic expressions',
    icon: '🔢',
    keys: [
      'math.algebra.linear_equations',
      'math.algebra.systems',
      'math.algebra.expressions',
      'math.algebra.word_problems',
      'math.algebraic_modeling',
    ],
    targetCount: 100,
  },
  {
    id: 'math-exponents',
    label: 'Exponents & Powers',
    section: 'math',
    description: 'Exponent rules, scientific notation, and powers',
    icon: '⚡',
    keys: [
      'math.algebra.exponents',
      'math.algebra.exponents_geometry',
      'math.scientific_notation',
      'math.arithmetic.scientific_notation',
    ],
    targetCount: 100,
  },
  {
    id: 'math-inequalities',
    label: 'Inequalities',
    section: 'math',
    description: 'Solving and graphing inequalities, absolute value inequalities',
    icon: '⚖️',
    keys: [
      'math.algebra.inequalities',
      'math.algebra.absolute_value',
      'math.absolute_value',
      'math.arithmetic.absolute_value',
    ],
    targetCount: 100,
  },
  {
    id: 'math-ratios',
    label: 'Ratios, Proportions & Percents',
    section: 'math',
    description: 'Ratios, proportions, percent calculations, and percent change',
    icon: '📊',
    keys: [
      'math.arithmetic.ratios_proportions',
      'math.ratio_proportion',
      'math.proportional_reasoning',
      'math.arithmetic.percent',
      'math.arithmetic.percentages',
      'math.arithmetic.percent_change',
      'math.percent_applications',
      'math.data_interpretation.percent',
      'math.statistics.percent_stats',
      'math.word_problems.percent_change',
      'math.word_problems.ratio_proportion',
    ],
    targetCount: 100,
  },
  {
    id: 'math-arithmetic',
    label: 'Arithmetic & Number Sense',
    section: 'math',
    description: 'Fractions, decimals, order of operations, and number properties',
    icon: '🧮',
    keys: [
      'math.arithmetic.fractions',
      'math.arithmetic.decimals',
      'math.arithmetic.order_of_operations',
      'math.number_theory.divisibility',
      'math.number_theory.gcf_lcm',
      'math.number_theory.primes',
    ],
    targetCount: 100,
  },
  {
    id: 'math-geometry-shapes',
    label: 'Geometry — Shapes & Angles',
    section: 'math',
    description: 'Angles, triangles, circles, area, perimeter, and composite shapes',
    icon: '📐',
    keys: [
      'math.geometry.angles',
      'math.geometry.angles_algebra',
      'math.geometry.triangles',
      'math.geometry.area',
      'math.geometry.area_algebra',
      'math.geometry.area_percent',
      'math.geometry.perimeter_area',
      'math.geometry.circles',
      'math.geometry.circles_algebra',
      'math.geometry.composite',
      'math.geometry.shaded_region',
      'math.geometry.pythagorean',
      'math.geometry.pythagorean_theorem',
    ],
    targetCount: 100,
  },
  {
    id: 'math-geometry-3d',
    label: 'Geometry — 3D & Volume',
    section: 'math',
    description: 'Volume, surface area, and cross-sections of 3D shapes',
    icon: '🧊',
    keys: [
      'math.geometry.volume',
      'math.geometry.volume_algebra',
      'math.geometry.3d.surface_area',
      'math.geometry.3d.cross_sections',
    ],
    targetCount: 100,
  },
  {
    id: 'math-coordinate',
    label: 'Coordinate Geometry & Transformations',
    section: 'math',
    description: 'Coordinate plane, slope, midpoint, distance, and transformations',
    icon: '📍',
    keys: [
      'math.geometry.coordinate',
      'math.geometry.coordinate_geometry',
      'math.geometry.coordinate_midpoint',
      'math.geometry.coordinate_slope',
      'math.geometry.pythagorean_coordinate',
      'math.geometry.transformations',
    ],
    targetCount: 100,
  },
  {
    id: 'math-statistics',
    label: 'Statistics & Data Analysis',
    section: 'math',
    description: 'Mean, median, mode, range, data interpretation, and graphs',
    icon: '📈',
    keys: [
      'math.statistics.mean_median',
      'math.statistics.mean_median_mode',
      'math.statistics.range',
      'math.statistics.data_interpretation',
      'math.data_interpretation',
      'math.functions.tables',
    ],
    targetCount: 100,
  },
  {
    id: 'math-probability',
    label: 'Probability & Counting',
    section: 'math',
    description: 'Basic and compound probability, Venn diagrams, and counting',
    icon: '🎲',
    keys: [
      'math.probability.basic',
      'math.probability.compound',
      'math.statistics.probability',
      'math.sets.venn_diagrams',
    ],
    targetCount: 100,
  },
  {
    id: 'math-patterns',
    label: 'Patterns & Sequences',
    section: 'math',
    description: 'Number patterns, arithmetic and geometric sequences',
    icon: '🔄',
    keys: [
      'math.algebra.patterns_sequences',
      'math.sequences_patterns',
    ],
    targetCount: 100,
  },
  {
    id: 'math-word-problems',
    label: 'Word Problems',
    section: 'math',
    description: 'Rate/distance/time, work problems, age problems, and multi-step',
    icon: '📝',
    keys: [
      'math.word_problems',
      'math.word_problems.age_problems',
      'math.word_problems.combined_work',
      'math.word_problems.rate_distance_time',
      'math.arithmetic.combined_work',
      'math.arithmetic.rate_distance_time',
      'math.measurement.unit_conversion',
    ],
    targetCount: 100,
  },

  // ── ELA — READING ─────────────────────────────────────────────────────────
  {
    id: 'ela-main-idea',
    label: 'Main Idea & Summary',
    section: 'ela',
    description: 'Identifying main ideas, themes, and summarizing passages',
    icon: '💡',
    keys: [
      'ela.reading.main_idea',
      'ela.reading.authors_purpose',
      'ela.reading.text_structure',
    ],
    targetCount: 100,
  },
  {
    id: 'ela-inference',
    label: 'Inference & Evidence',
    section: 'ela',
    description: 'Drawing inferences and identifying supporting evidence',
    icon: '🔍',
    keys: [
      'ela.reading.inference',
      'ela.reading.best_evidence',
      'ela.reading.claim_evidence',
      'ela.reading.claim_vs_evidence',
    ],
    targetCount: 100,
  },
  {
    id: 'ela-literary',
    label: 'Literary Analysis',
    section: 'ela',
    description: 'Figurative language, tone, mood, and character analysis',
    icon: '📖',
    keys: [
      'ela.reading.figurative_language',
      'ela.reading.tone_mood',
      'ela.reading.plot_character',
      'ela.reading.vocabulary_in_context',
    ],
    targetCount: 100,
  },
  {
    id: 'ela-grammar',
    label: 'Grammar & Sentence Structure',
    section: 'ela',
    description: 'Subject-verb agreement, fragments, run-ons, modifiers, and parallelism',
    icon: '✏️',
    keys: [
      'ela.revising.grammar.subject_verb',
      'ela.revising.grammar.subject_verb_agreement',
      'ela.revising.grammar.fragments',
      'ela.revising.grammar.sentence_fragment',
      'ela.revising.grammar.run_ons',
      'ela.revising.grammar.comma_splice',
      'ela.revising.grammar.compound_complex_sentences',
      'ela.revising.grammar.modifiers',
      'ela.revising.grammar.misplaced_modifier',
      'ela.revising.grammar.dangling_modifiers',
      'ela.revising.grammar.parallel_structure',
      'ela.revising.grammar.parallelism',
      'ela.revising.grammar.pronoun_antecedent',
      'ela.revising.grammar.verb_tense',
      'ela.revising.grammar.verb_tense_consistency',
      'ela.revising.grammar.subjunctive_mood',
      'ela.revising.grammar.restrictive_nonrestrictive',
    ],
    targetCount: 100,
  },
  {
    id: 'ela-punctuation',
    label: 'Punctuation & Mechanics',
    section: 'ela',
    description: 'Commas, semicolons, colons, apostrophes, and dashes',
    icon: '🔤',
    keys: [
      'ela.revising.grammar.comma_usage',
      'ela.revising.grammar.semicolon_colon',
      'ela.revising.punctuation.colon_usage',
      'ela.revising.punctuation.dash_vs_parentheses',
      'ela.revising.punctuation.semicolons_in_lists',
      'ela.revising.mechanics.apostrophes',
    ],
    targetCount: 100,
  },
  {
    id: 'ela-style',
    label: 'Style, Tone & Word Choice',
    section: 'ela',
    description: 'Conciseness, word choice, active/passive voice, and register',
    icon: '🎨',
    keys: [
      'ela.revising.grammar.clarity_concision',
      'ela.revising.grammar.wordiness',
      'ela.revising.grammar.word_choice',
      'ela.revising.grammar.transitions',
      'ela.revising.style.conciseness',
      'ela.revising.style.precise_language',
      'ela.revising.style.active_passive',
      'ela.revising.style.audience_register',
      'ela.revising.style.sentence_combining',
      'ela.revising.style.integrating_quotations',
    ],
    targetCount: 100,
  },
  {
    id: 'ela-passage-revision',
    label: 'Passage Organization & Revision',
    section: 'ela',
    description: 'Transitions, sentence placement, paragraph order, and revision',
    icon: '🔧',
    keys: [
      'ela.revising.passage',
      'ela.revising.passage.best_transition',
      'ela.revising.passage.irrelevant_sentence',
      'ela.revising.passage.paragraph_organization',
      'ela.revising.passage.sentence_placement',
      'ela.revising.passage.sentence_revision',
      'ela.revising.organization.topic_sentence',
      'ela.revising.organization.transitions',
    ],
    targetCount: 100,
  },
];

// ============================================================================
// Lookup Helpers
// ============================================================================

/** Map from raw DB category key → CategoryGroup */
const _keyToGroup = new Map<string, CategoryGroup>();
for (const g of CATEGORY_GROUPS) {
  for (const k of g.keys) {
    _keyToGroup.set(k, g);
  }
}

/** Get the clean label for a raw category key */
export function getCategoryLabel(rawKey: string): string {
  const group = _keyToGroup.get(rawKey);
  if (group) return group.label;
  // Fallback: humanize the key
  return rawKey
    .replace(/^(math|ela)\./i, '')
    .replace(/\./g, ' → ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Get the CategoryGroup for a raw category key */
export function getCategoryGroup(rawKey: string): CategoryGroup | undefined {
  return _keyToGroup.get(rawKey);
}

/** Get group by group ID */
export function getGroupById(groupId: string): CategoryGroup | undefined {
  return CATEGORY_GROUPS.find((g) => g.id === groupId);
}

/** Get all groups for a section */
export function getGroupsBySection(section: 'math' | 'ela'): CategoryGroup[] {
  return CATEGORY_GROUPS.filter((g) => g.section === section);
}
