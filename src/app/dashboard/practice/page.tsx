"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { PracticeErrorBoundary } from "@/components/practice/ErrorBoundary";
import { PracticeSetup } from "@/components/practice/PracticeSetup";
import { QuestionView } from "@/components/practice/QuestionView";
import { FeedbackView } from "@/components/practice/FeedbackView";
import { ResultsView } from "@/components/practice/ResultsView";
import { PracticeTimer } from "@/components/practice/PracticeTimer";

type Phase = "setup" | "question" | "feedback" | "results";

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

interface ResultsData {
  accuracy: number;
  totalCorrect: number;
  totalQuestions: number;
  skillBreakdown: { category: string; correct: number; total: number; accuracy: number }[];
  timeSpent: number;
}

function PracticePageContent() {
  const router = useRouter();

  // Setup state
  const [section, setSection] = useState<string>("both");
  const [difficulty, setDifficulty] = useState<string>("");
  const [questionCount, setQuestionCount] = useState(20);
  const [mode, setMode] = useState<"practice" | "timed_practice">("practice");

  // Session state
  const [phase, setPhase] = useState<Phase>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionData | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [results, setResults] = useState<ResultsData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  // Timer
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionStartRef = useRef(Date.now());

  useEffect(() => {
    if (phase === "question" || phase === "feedback") {
      timerRef.current = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const startSession = async () => {
    setStarting(true);
    try {
      const body: Record<string, unknown> = { mode, questionCount };
      if (section !== "both") body.section = section;
      if (difficulty) body.difficulty = difficulty;

      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to start session" }));
        if (res.status === 403 && err.redirect) {
          router.push(err.redirect);
          return;
        }
        toast.error(err.error || "Failed to start session");
        return;
      }

      const data = await res.json();
      setSessionId(data.sessionId);
      setCurrentQuestion(data.firstQuestion);
      setTotalQuestions(data.totalQuestions);
      setAnswered(0);
      setCorrect(0);
      setTimeElapsed(0);
      setTimeLimit(mode === "timed_practice" ? questionCount * 90 : null);
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
        const err = await res.json().catch(() => ({ error: "Failed to submit answer" }));
        toast.error(err.error || "Failed to submit answer");
        return;
      }

      const fb: FeedbackData = await res.json();
      setFeedback(fb);
      setAnswered((a) => a + 1);
      if (fb.isCorrect) setCorrect((c) => c + 1);
      setPhase("feedback");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
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
        const res = await fetch(`/api/practice/${sessionId}/complete`, { method: "POST" });
        if (res.ok) {
          const r: ResultsData = await res.json();
          setResults(r);
        }
      } catch {
        // Results are optional - we can still show local stats
      }
      setPhase("results");
    }
  }, [feedback, sessionId]);

  const resetToSetup = () => {
    setPhase("setup");
    setSelectedAnswer(null);
    setFeedback(null);
    setResults(null);
  };

  // ===== SETUP SCREEN =====
  if (phase === "setup") {
    return (
      <>
        <PracticeSetup
          section={section} setSection={setSection}
          difficulty={difficulty} setDifficulty={setDifficulty}
          questionCount={questionCount} setQuestionCount={setQuestionCount}
          mode={mode} setMode={setMode}
          onStart={startSession}
          starting={starting}
        />
      </>
    );
  }

  // ===== QUESTION / FEEDBACK SCREEN =====
  if ((phase === "question" || phase === "feedback") && currentQuestion) {
    const progressPct = totalQuestions > 0 ? (answered / totalQuestions) * 100 : 0;

    return (
      <div className="max-w-3xl">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400">
              Question {answered + (phase === "question" ? 1 : 0)} of {totalQuestions}
            </span>
            <span className={`text-[10px] font-black px-2 py-1 rounded ${
              currentQuestion.section === "math" ? "bg-[#D6FF62]/30 text-[#84CC16]" : "bg-[#A3E9FF]/30 text-[#0EA5E9]"
            }`}>
              {currentQuestion.section?.toUpperCase()} — {currentQuestion.category}
            </span>
          </div>
          <PracticeTimer timeElapsed={timeElapsed} timeLimit={timeLimit} />
        </div>

        {/* Progress bar */}
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

  // ===== RESULTS SCREEN =====
  if (phase === "results") {
    return (
      <ResultsView
        results={results}
        correct={correct}
        answered={answered}
        timeElapsed={timeElapsed}
        formatTime={formatTime}
        onPracticeAgain={resetToSetup}
        onBackToDashboard={() => router.push("/dashboard")}
      />
    );
  }

  return null;
}

export default function PracticePage() {
  return (
    <PracticeErrorBoundary>
      <PracticePageContent />
    </PracticeErrorBoundary>
  );
}
