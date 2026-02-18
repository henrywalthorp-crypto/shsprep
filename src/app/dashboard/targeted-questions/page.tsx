"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Crosshair,
  ChevronRight,
  CheckCircle2,
  Play,
  ArrowLeft,
  Lock,
} from "lucide-react";

import { PracticeErrorBoundary } from "@/components/practice/ErrorBoundary";
import { QuestionView } from "@/components/practice/QuestionView";
import { FeedbackView } from "@/components/practice/FeedbackView";
import { PracticeTimer } from "@/components/practice/PracticeTimer";

// ── Category data (mirrored from server) ────────────────────────────────────
interface CategoryGroup {
  id: string;
  label: string;
  section: "math" | "ela";
  description: string;
  icon: string;
  targetCount: number;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: "math-algebra", label: "Algebra & Equations", section: "math", description: "Linear equations, systems of equations, and algebraic expressions", icon: "🔢", targetCount: 50 },
  { id: "math-exponents", label: "Exponents & Powers", section: "math", description: "Exponent rules, scientific notation, and powers", icon: "⚡", targetCount: 50 },
  { id: "math-inequalities", label: "Inequalities", section: "math", description: "Solving and graphing inequalities, absolute value inequalities", icon: "⚖️", targetCount: 50 },
  { id: "math-ratios", label: "Ratios, Proportions & Percents", section: "math", description: "Ratios, proportions, percent calculations, and percent change", icon: "📊", targetCount: 50 },
  { id: "math-arithmetic", label: "Arithmetic & Number Sense", section: "math", description: "Fractions, decimals, order of operations, and number properties", icon: "🧮", targetCount: 50 },
  { id: "math-geometry-shapes", label: "Geometry — Shapes & Angles", section: "math", description: "Angles, triangles, circles, area, perimeter, and composite shapes", icon: "📐", targetCount: 50 },
  { id: "math-geometry-3d", label: "Geometry — 3D & Volume", section: "math", description: "Volume, surface area, and cross-sections of 3D shapes", icon: "🧊", targetCount: 50 },
  { id: "math-coordinate", label: "Coordinate Geometry & Transformations", section: "math", description: "Coordinate plane, slope, midpoint, distance, and transformations", icon: "📍", targetCount: 50 },
  { id: "math-statistics", label: "Statistics & Data Analysis", section: "math", description: "Mean, median, mode, range, data interpretation, and graphs", icon: "📈", targetCount: 50 },
  { id: "math-probability", label: "Probability & Counting", section: "math", description: "Basic and compound probability, Venn diagrams, and counting", icon: "🎲", targetCount: 50 },
  { id: "math-patterns", label: "Patterns & Sequences", section: "math", description: "Number patterns, arithmetic and geometric sequences", icon: "🔄", targetCount: 50 },
  { id: "math-word-problems", label: "Word Problems", section: "math", description: "Rate/distance/time, work problems, age problems, and multi-step", icon: "📝", targetCount: 50 },
  { id: "ela-main-idea", label: "Main Idea & Summary", section: "ela", description: "Identifying main ideas, themes, and summarizing passages", icon: "💡", targetCount: 50 },
  { id: "ela-inference", label: "Inference & Evidence", section: "ela", description: "Drawing inferences and identifying supporting evidence", icon: "🔍", targetCount: 50 },
  { id: "ela-literary", label: "Literary Analysis", section: "ela", description: "Figurative language, tone, mood, and character analysis", icon: "📖", targetCount: 50 },
  { id: "ela-grammar", label: "Grammar & Sentence Structure", section: "ela", description: "Subject-verb agreement, fragments, run-ons, modifiers, and parallelism", icon: "✏️", targetCount: 50 },
  { id: "ela-punctuation", label: "Punctuation & Mechanics", section: "ela", description: "Commas, semicolons, colons, apostrophes, and dashes", icon: "🔤", targetCount: 50 },
  { id: "ela-style", label: "Style, Tone & Word Choice", section: "ela", description: "Conciseness, word choice, active/passive voice, and register", icon: "🎨", targetCount: 50 },
  { id: "ela-passage-revision", label: "Passage Organization & Revision", section: "ela", description: "Transitions, sentence placement, paragraph order, and revision", icon: "🔧", targetCount: 50 },
];

type Phase = "browse" | "question" | "feedback" | "results";

interface QuestionData {
  id: string;
  section: string;
  category: string;
  subcategory: string | null;
  difficulty: string;
  type: string;
  stem: string;
  stimulus: string | null;
  options: { label: string; text: string; isCorrect?: boolean }[] | null;
  passage_id: string | null;
}

interface FeedbackData {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  commonMistakes: { label: string; explanation: string }[];
  nextQuestion: QuestionData | null;
}

interface GroupProgress {
  completed: number;
  correct: number;
}

function TargetedQuestionsContent() {
  const router = useRouter();
  const [sectionFilter, setSectionFilter] = useState<"all" | "math" | "ela">("all");
  const [phase, setPhase] = useState<Phase>("browse");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, GroupProgress>>({});
  const [loading, setLoading] = useState(true);

  // Practice state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [remainingIds, setRemainingIds] = useState<string[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = React.useRef(Date.now());

  // Load progress
  useEffect(() => {
    fetch("/api/analytics/skills")
      .then((r) => r.json())
      .then((data) => {
        const prog: Record<string, GroupProgress> = {};
        // Map skill stats to groups
        for (const skill of data.skills || []) {
          const group = findGroupForCategory(skill.category);
          if (group) {
            if (!prog[group.id]) prog[group.id] = { completed: 0, correct: 0 };
            prog[group.id].completed += skill.totalAttempted;
            prog[group.id].correct += Math.round(skill.totalAttempted * skill.accuracy);
          }
        }
        setProgress(prog);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Timer
  useEffect(() => {
    if (phase === "question" || phase === "feedback") {
      timerRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  function findGroupForCategory(rawKey: string): CategoryGroup | undefined {
    // Check each group's expected keys using prefix matching
    return CATEGORY_GROUPS.find((g) => {
      // For simplicity, match the raw key against group IDs by section+prefix
      const section = rawKey.startsWith("math") ? "math" : "ela";
      if (g.section !== section) return false;
      // Simple heuristic: check if the key contains the group's distinguishing terms
      return matchKeyToGroup(rawKey, g.id);
    });
  }

  function matchKeyToGroup(key: string, groupId: string): boolean {
    const map: Record<string, string[]> = {
      "math-algebra": ["algebra.linear", "algebra.systems", "algebra.expressions", "algebra.word", "algebraic_modeling"],
      "math-exponents": ["exponents", "scientific_notation"],
      "math-inequalities": ["inequalities", "absolute_value"],
      "math-ratios": ["ratios", "proportion", "percent"],
      "math-arithmetic": ["fractions", "decimals", "order_of_operations", "number_theory", "primes", "gcf_lcm", "divisibility"],
      "math-geometry-shapes": ["geometry.angles", "geometry.triangles", "geometry.area", "geometry.perimeter", "geometry.circles", "geometry.composite", "geometry.shaded", "geometry.pythagorean"],
      "math-geometry-3d": ["geometry.volume", "geometry.3d"],
      "math-coordinate": ["geometry.coordinate", "geometry.transformations"],
      "math-statistics": ["statistics.mean", "statistics.range", "statistics.data", "data_interpretation", "functions.tables"],
      "math-probability": ["probability", "venn_diagrams"],
      "math-patterns": ["patterns_sequences", "sequences_patterns"],
      "math-word-problems": ["word_problems", "combined_work", "rate_distance", "unit_conversion"],
      "ela-main-idea": ["reading.main_idea", "reading.authors_purpose", "reading.text_structure"],
      "ela-inference": ["reading.inference", "reading.best_evidence", "reading.claim"],
      "ela-literary": ["reading.figurative", "reading.tone_mood", "reading.plot_character", "reading.vocabulary"],
      "ela-grammar": ["grammar.subject_verb", "grammar.fragments", "grammar.sentence_fragment", "grammar.run_ons", "grammar.comma_splice", "grammar.compound", "grammar.modifiers", "grammar.misplaced", "grammar.dangling", "grammar.parallel", "grammar.pronoun", "grammar.verb_tense", "grammar.subjunctive", "grammar.restrictive"],
      "ela-punctuation": ["grammar.comma_usage", "grammar.semicolon", "punctuation.", "mechanics."],
      "ela-style": ["grammar.clarity", "grammar.wordiness", "grammar.word_choice", "grammar.transitions", "style."],
      "ela-passage-revision": ["revising.passage", "organization."],
    };
    const patterns = map[groupId] || [];
    return patterns.some((p) => key.includes(p));
  }

  const startTargetedPractice = async (groupId: string) => {
    setStarting(true);
    setActiveGroupId(groupId);
    try {
      const res = await fetch("/api/targeted-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId, questionCount: 10 }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to start" }));
        if (res.status === 403 && err.redirect) {
          router.push(err.redirect);
          return;
        }
        toast.error(err.error || "Failed to start practice");
        return;
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setCurrentQuestion(data.firstQuestion);
      setTotalQuestions(data.totalQuestions);
      setRemainingIds(data.remainingQuestionIds || []);
      setAnswered(0);
      setCorrect(0);
      setTimeElapsed(0);
      setSelectedAnswer(null);
      setFeedback(null);
      questionStartRef.current = Date.now();
      setPhase("question");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setStarting(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion || !sessionId) return;
    setSubmitting(true);
    const timeSpent = Math.round((Date.now() - questionStartRef.current) / 1000);

    try {
      const res = await fetch(`/api/practice/${sessionId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          answer: selectedAnswer,
          timeSpent,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to submit" }));
        toast.error(err.error || "Failed to submit answer");
        return;
      }

      const fb: FeedbackData = await res.json();
      setFeedback(fb);
      setAnswered((a) => a + 1);
      if (fb.isCorrect) setCorrect((c) => c + 1);
      setPhase("feedback");
    } catch {
      toast.error("Network error.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextQuestion = useCallback(async () => {
    if (feedback?.nextQuestion) {
      setCurrentQuestion(feedback.nextQuestion);
      setSelectedAnswer(null);
      setFeedback(null);
      questionStartRef.current = Date.now();
      setPhase("question");
    } else {
      // Complete session
      try {
        await fetch(`/api/practice/${sessionId}/complete`, { method: "POST" });
      } catch { /* ok */ }
      setPhase("results");
    }
  }, [feedback, sessionId]);

  const backToBrowse = () => {
    setPhase("browse");
    setActiveGroupId(null);
    setSelectedAnswer(null);
    setFeedback(null);
    // Refresh progress
    fetch("/api/analytics/skills")
      .then((r) => r.json())
      .then((data) => {
        const prog: Record<string, GroupProgress> = {};
        for (const skill of data.skills || []) {
          const group = findGroupForCategory(skill.category);
          if (group) {
            if (!prog[group.id]) prog[group.id] = { completed: 0, correct: 0 };
            prog[group.id].completed += skill.totalAttempted;
            prog[group.id].correct += Math.round(skill.totalAttempted * skill.accuracy);
          }
        }
        setProgress(prog);
      })
      .catch(() => {});
  };

  const filteredGroups = sectionFilter === "all"
    ? CATEGORY_GROUPS
    : CATEGORY_GROUPS.filter((g) => g.section === sectionFilter);

  const mathGroups = filteredGroups.filter((g) => g.section === "math");
  const elaGroups = filteredGroups.filter((g) => g.section === "ela");

  // ── BROWSE VIEW ─────────────────────────────────────────────────────────
  if (phase === "browse") {
    return (
      <div className="max-w-6xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
              <Crosshair className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-deep-forest font-display">Targeted Questions</h1>
          </div>
          <p className="text-slate-400 font-medium">
            Focus on specific SHSAT topics. Pick a category and practice until you master it.
          </p>
        </header>

        {/* Section filter */}
        <div className="flex gap-2 mb-8">
          {(["all", "math", "ela"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setSectionFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                sectionFilter === f
                  ? "bg-[#4F46E5] text-white"
                  : "bg-white text-slate-400 border border-slate-100 hover:border-[#4F46E5] hover:text-[#4F46E5]"
              }`}
            >
              {f === "all" ? "All Topics" : f === "math" ? "Math" : "ELA"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {mathGroups.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Math</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {mathGroups.map((group) => (
                    <TopicCard
                      key={group.id}
                      group={group}
                      progress={progress[group.id]}
                      onStart={() => startTargetedPractice(group.id)}
                      starting={starting && activeGroupId === group.id}
                    />
                  ))}
                </div>
              </>
            )}

            {elaGroups.length > 0 && (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">English Language Arts</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {elaGroups.map((group) => (
                    <TopicCard
                      key={group.id}
                      group={group}
                      progress={progress[group.id]}
                      onStart={() => startTargetedPractice(group.id)}
                      starting={starting && activeGroupId === group.id}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  // ── QUESTION / FEEDBACK VIEW ────────────────────────────────────────────
  if ((phase === "question" || phase === "feedback") && currentQuestion) {
    const activeGroup = CATEGORY_GROUPS.find((g) => g.id === activeGroupId);
    const progressPct = totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0;

    return (
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={backToBrowse} className="text-slate-400 hover:text-deep-forest transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold text-slate-400">
              {activeGroup?.icon} {activeGroup?.label} — Question {answered + (phase === "question" ? 1 : 0)} of {totalQuestions}
            </span>
          </div>
          <PracticeTimer timeElapsed={timeElapsed} timeLimit={null} />
        </div>

        <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <motion.div
            className="h-full bg-[#4F46E5] rounded-full"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id + phase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {phase === "question" ? (
              <QuestionView
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onSelectAnswer={setSelectedAnswer}
                onSubmit={submitAnswer}
                submitting={submitting}
              />
            ) : feedback ? (
              <FeedbackView
                question={currentQuestion}
                feedback={feedback}
                selectedAnswer={selectedAnswer}
                onNext={nextQuestion}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ── RESULTS VIEW ────────────────────────────────────────────────────────
  if (phase === "results") {
    const activeGroup = CATEGORY_GROUPS.find((g) => g.id === activeGroupId);
    const pct = answered > 0 ? Math.round((correct / answered) * 100) : 0;

    return (
      <div className="max-w-xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-8 text-center"
        >
          <div className="text-4xl mb-4">{activeGroup?.icon}</div>
          <h2 className="text-2xl font-black text-deep-forest mb-2">{activeGroup?.label}</h2>
          <p className="text-slate-400 font-medium mb-8">Session Complete</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-2xl font-black text-deep-forest">{correct}/{answered}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className={`text-2xl font-black ${pct >= 80 ? "text-[#22C55E]" : pct >= 60 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
                {pct}%
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-2xl font-black text-deep-forest">
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => startTargetedPractice(activeGroupId!)}
              className="flex-1 bg-[#4F46E5] text-white py-3 rounded-xl font-bold hover:bg-[#4338CA] transition-colors"
            >
              Practice Again
            </button>
            <button
              onClick={backToBrowse}
              className="flex-1 bg-slate-100 text-deep-forest py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Back to Topics
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}

// ── Topic Card Component ──────────────────────────────────────────────────
function TopicCard({
  group,
  progress,
  onStart,
  starting,
}: {
  group: CategoryGroup;
  progress?: GroupProgress;
  onStart: () => void;
  starting: boolean;
}) {
  const completed = progress?.completed ?? 0;
  const target = group.targetCount;
  const pct = Math.min(Math.round((completed / target) * 100), 100);
  const accuracy = progress && progress.completed > 0
    ? Math.round((progress.correct / progress.completed) * 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 cursor-pointer group transition-all hover:border-[#4F46E5]/20 hover:shadow-md"
      onClick={onStart}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{group.icon}</span>
          <div>
            <h3 className="font-bold text-deep-forest text-sm">{group.label}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{group.description}</p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {starting ? (
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center">
              <Play className="w-4 h-4 text-[#4F46E5]" />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              pct >= 100 ? "bg-[#22C55E]" : pct > 0 ? "bg-[#4F46E5]" : "bg-slate-200"
            }`}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
          {completed}/{target}
        </span>
        {accuracy !== null && (
          <span className={`text-xs font-bold ${accuracy >= 80 ? "text-[#22C55E]" : accuracy >= 60 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
            {accuracy}%
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function TargetedQuestionsPage() {
  return (
    <PracticeErrorBoundary>
      <TargetedQuestionsContent />
    </PracticeErrorBoundary>
  );
}
