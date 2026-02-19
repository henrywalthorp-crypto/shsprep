"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  X,
  ChevronRight,
  Clock,
  BookOpen,
  Lightbulb,
  Sparkles,
  Trophy,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface ContentSection {
  type: "text" | "example" | "tip" | "practice";
  content: string;
}

interface InlineQuestion {
  stem: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface LessonQuestion {
  id: string;
  question_order: number;
  inline_question: InlineQuestion;
}

interface LessonData {
  id: string;
  lesson_number: number;
  title: string;
  subtitle: string;
  content: ContentSection[];
  estimated_minutes: number;
  unit_id: string;
  lesson_units: {
    id: string;
    title: string;
    track: string;
    unit_number: number;
    icon: string;
    color: string;
  };
  lesson_questions: LessonQuestion[];
}

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"learn" | "practice" | "results">("learn");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<{ correct: boolean; selected: string }[]>([]);

  useEffect(() => {
    fetch(`/api/lessons/${lessonId}`)
      .then((r) => r.json())
      .then((d) => {
        setLesson(d.lesson);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-deep-forest border-t-transparent" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-text-gray">Lesson not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-deep-forest font-bold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const questions = lesson.lesson_questions || [];
  const score = answers.length > 0
    ? Math.round((answers.filter((a) => a.correct).length / answers.length) * 100)
    : 0;

  const handleAnswer = (option: string, optionIndex: number) => {
    if (selectedAnswer) return;
    const letter = String.fromCharCode(65 + optionIndex); // A, B, C, D
    setSelectedAnswer(letter);
    setShowExplanation(true);
  };

  const handleNext = () => {
    const q = questions[currentQ];
    const isCorrect = selectedAnswer === q.inline_question.correct_answer;
    setAnswers([...answers, { correct: isCorrect, selected: selectedAnswer! }]);
    setSelectedAnswer(null);
    setShowExplanation(false);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      // Calculate final score
      const finalAnswers = [...answers, { correct: isCorrect, selected: selectedAnswer! }];
      const finalScore = Math.round(
        (finalAnswers.filter((a) => a.correct).length / finalAnswers.length) * 100
      );
      setPhase("results");

      // Submit score
      fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: finalScore }),
      });
    }
  };

  const handleRetry = () => {
    setPhase("practice");
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const unit = lesson.lesson_units;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.push("/dashboard/lessons")}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-deep-forest" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{unit.icon}</span>
            <span className="text-xs font-bold text-text-gray uppercase tracking-wider">
              {unit.title} · Lesson {lesson.lesson_number}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-deep-forest font-display tracking-tight">
            {lesson.title}
          </h1>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-gray bg-white px-3 py-1.5 rounded-lg border border-gray-200">
          <Clock className="w-3.5 h-3.5" />
          {lesson.estimated_minutes} min
        </div>
      </div>

      {/* Phase: Learn */}
      {phase === "learn" && (
        <div className="space-y-6">
          {lesson.content.map((section, i) => {
            if (section.type === "practice") {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center py-8"
                >
                  <div className="inline-flex items-center gap-2 text-deep-forest mb-4">
                    <Sparkles className="w-5 h-5 text-mint" />
                    <span className="font-bold text-lg font-display">Ready to practice?</span>
                  </div>
                  <p className="text-text-gray text-sm mb-6">
                    Answer {questions.length} questions to complete this lesson. You need 70% to pass.
                  </p>
                  <button
                    onClick={() => setPhase("practice")}
                    className="px-8 py-3 bg-deep-forest text-white rounded-xl font-bold text-sm hover:bg-deep-forest/90 transition-all shadow-lg shadow-deep-forest/20 flex items-center gap-2 mx-auto"
                  >
                    Start Practice
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "rounded-2xl p-6",
                  section.type === "text" && "bg-white border border-gray-200",
                  section.type === "example" && "bg-pastel-green/40 border border-pastel-green",
                  section.type === "tip" && "bg-pastel-orange/20 border border-pastel-orange/40"
                )}
              >
                {section.type === "example" && (
                  <div className="flex items-center gap-2 text-deep-forest mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Worked Example</span>
                  </div>
                )}
                {section.type === "tip" && (
                  <div className="flex items-center gap-2 text-orange-700 mb-3">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">Pro Tip</span>
                  </div>
                )}
                <div className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-deep-forest prose-p:text-deep-forest/80 prose-strong:text-deep-forest prose-blockquote:border-mint prose-blockquote:text-deep-forest/70 prose-th:text-deep-forest prose-td:text-deep-forest/80">
                  <ReactMarkdown>{section.content}</ReactMarkdown>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Phase: Practice */}
      {phase === "practice" && questions.length > 0 && (
        <div>
          {/* Progress bar */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + (showExplanation ? 1 : 0)) / questions.length) * 100}%` }}
                className="h-full bg-mint rounded-full"
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-bold text-text-gray">
              {currentQ + 1}/{questions.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              {/* Question stem */}
              <h3 className="text-lg font-bold text-deep-forest mb-6 font-display">
                {questions[currentQ].inline_question.stem}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentQ].inline_question.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === letter;
                  const isCorrect = letter === questions[currentQ].inline_question.correct_answer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option, idx)}
                      disabled={!!selectedAnswer}
                      className={cn(
                        "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3",
                        !showResult && !isSelected && "border-gray-200 hover:border-deep-forest/30 hover:bg-gray-50",
                        !showResult && isSelected && "border-deep-forest bg-deep-forest/5",
                        showResult && isCorrect && "border-mint bg-mint/10",
                        showResult && isSelected && !isCorrect && "border-red-400 bg-red-50",
                        showResult && !isSelected && !isCorrect && "border-gray-100 opacity-50"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0",
                          !showResult && "bg-gray-100 text-deep-forest",
                          showResult && isCorrect && "bg-mint text-deep-forest",
                          showResult && isSelected && !isCorrect && "bg-red-400 text-white"
                        )}
                      >
                        {showResult && isCorrect ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : showResult && isSelected && !isCorrect ? (
                          <X className="w-4 h-4 stroke-[3]" />
                        ) : (
                          letter
                        )}
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        showResult && isCorrect ? "text-deep-forest font-bold" : "text-deep-forest/80"
                      )}>
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-pastel-green/30 rounded-xl border border-pastel-green"
                >
                  <p className="text-xs font-black text-deep-forest uppercase tracking-widest mb-2">
                    Explanation
                  </p>
                  <p className="text-sm text-deep-forest/80">
                    {questions[currentQ].inline_question.explanation}
                  </p>
                </motion.div>
              )}

              {/* Next button */}
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex justify-end"
                >
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-deep-forest text-white rounded-xl font-bold text-sm hover:bg-deep-forest/90 transition-all flex items-center gap-2"
                  >
                    {currentQ + 1 < questions.length ? "Next Question" : "See Results"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Phase: Results */}
      {phase === "results" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-gray-200 p-8 text-center"
        >
          {(() => {
            const finalScore = Math.round(
              (answers.filter((a) => a.correct).length / answers.length) * 100
            );
            const passed = finalScore >= 70;

            return (
              <>
                <div className={cn(
                  "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4",
                  passed ? "bg-mint/20" : "bg-red-50"
                )}>
                  {passed ? (
                    <Trophy className="w-10 h-10 text-mint" />
                  ) : (
                    <RotateCcw className="w-10 h-10 text-red-400" />
                  )}
                </div>

                <h2 className="text-2xl font-bold text-deep-forest font-display mb-2">
                  {passed ? "Lesson Complete!" : "Not Quite..."}
                </h2>
                <p className="text-text-gray mb-6">
                  {passed
                    ? "Great work! You've mastered this lesson."
                    : "You need 70% to pass. Review the lesson and try again!"}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-50 mb-8">
                  <span className="text-3xl font-bold text-deep-forest font-display">
                    {finalScore}%
                  </span>
                  <span className="text-sm text-text-gray">
                    ({answers.filter((a) => a.correct).length}/{answers.length} correct)
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {!passed && (
                    <button
                      onClick={handleRetry}
                      className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm text-deep-forest hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Try Again
                    </button>
                  )}
                  <button
                    onClick={() => router.push("/dashboard/lessons")}
                    className="px-6 py-2.5 bg-deep-forest text-white rounded-xl font-bold text-sm hover:bg-deep-forest/90 transition-all flex items-center gap-2"
                  >
                    {passed ? "Continue" : "Review Lesson"}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
