"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Play,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Zap,
  Target,
  Clock,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Calculator,
  Loader2,
} from "lucide-react";

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

export default function PracticePage() {
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
      const body: Record<string, unknown> = {
        mode,
        questionCount,
      };
      if (section !== "both") body.section = section;
      if (difficulty) body.difficulty = difficulty;

      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
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
        toast.error("Failed to submit answer");
        return;
      }

      const fb: FeedbackData = await res.json();
      setFeedback(fb);
      setAnswered((a) => a + 1);
      if (fb.isCorrect) setCorrect((c) => c + 1);
      setPhase("feedback");
    } catch {
      toast.error("Network error");
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
      } catch {}
      setPhase("results");
    }
  }, [feedback, sessionId]);

  // ===== SETUP SCREEN =====
  if (phase === "setup") {
    return (
      <div className="max-w-3xl">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-black text-deep-forest font-display">Practice Questions</h1>
          </div>
          <p className="text-slate-400 font-medium">Configure your practice session and start mastering SHSAT topics.</p>
        </header>

        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-8 space-y-8">
          {/* Section */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Section</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "both", label: "Both", icon: Target },
                { id: "ela", label: "ELA", icon: BookOpen },
                { id: "math", label: "Math", icon: Calculator },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm flex items-center gap-3 transition-all ${
                    section === s.id
                      ? "border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5]"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Difficulty (Optional)</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: "", label: "Any" },
                { id: "1", label: "Easy" },
                { id: "2", label: "Medium" },
                { id: "3", label: "Hard" },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    difficulty === d.id
                      ? "border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5]"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question count */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Number of Questions</label>
            <div className="grid grid-cols-4 gap-3">
              {[10, 20, 30, 50].map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`p-3 rounded-xl border-2 font-bold text-sm transition-all ${
                    questionCount === n
                      ? "border-[#4F46E5] bg-[#4F46E5]/5 text-[#4F46E5]"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Mode */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Mode</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "practice" as const, label: "Untimed", desc: "No time pressure" },
                { id: "timed_practice" as const, label: "Timed", desc: "90 sec per question" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    mode === m.id
                      ? "border-[#4F46E5] bg-[#4F46E5]/5"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className={`font-bold text-sm ${mode === m.id ? "text-[#4F46E5]" : "text-slate-600"}`}>{m.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startSession}
            disabled={starting}
            className="w-full py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {starting ? "Starting..." : "Start Practice"}
          </button>
        </div>
      </div>
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
          <div className="flex items-center gap-4">
            {timeLimit && (
              <span className={`text-sm font-bold flex items-center gap-1 ${
                timeElapsed > timeLimit * 0.8 ? "text-[#EF4444]" : "text-slate-400"
              }`}>
                <Clock className="w-4 h-4" />
                {formatTime(Math.max(0, timeLimit - timeElapsed))}
              </span>
            )}
            <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-4 h-4" />{formatTime(timeElapsed)}
            </span>
          </div>
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
            {/* Stimulus / passage */}
            {currentQuestion.stimulus && (
              <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
                <div className="prose prose-sm text-slate-700 max-w-none whitespace-pre-wrap">{currentQuestion.stimulus}</div>
              </div>
            )}

            {/* Question stem */}
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-8 mb-6">
              <p className="text-lg font-bold text-deep-forest leading-relaxed">{currentQuestion.stem}</p>
            </div>

            {/* Options */}
            {currentQuestion.options && (
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswer === opt.label;
                  const inFeedback = phase === "feedback" && feedback;
                  const isCorrectOption = inFeedback && opt.label === feedback?.correctAnswer;
                  const isWrong = inFeedback && isSelected && !feedback?.isCorrect;

                  let borderClass = "border-slate-200 hover:border-slate-300";
                  let bgClass = "bg-white";
                  if (inFeedback && isCorrectOption) {
                    borderClass = "border-[#22C55E]";
                    bgClass = "bg-[#22C55E]/5";
                  } else if (inFeedback && isWrong) {
                    borderClass = "border-[#EF4444]";
                    bgClass = "bg-[#EF4444]/5";
                  } else if (isSelected) {
                    borderClass = "border-[#4F46E5]";
                    bgClass = "bg-[#4F46E5]/5";
                  }

                  return (
                    <button
                      key={opt.label}
                      disabled={phase === "feedback"}
                      onClick={() => setSelectedAnswer(opt.label)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${borderClass} ${bgClass}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        inFeedback && isCorrectOption
                          ? "bg-[#22C55E] text-white"
                          : inFeedback && isWrong
                          ? "bg-[#EF4444] text-white"
                          : isSelected
                          ? "bg-[#4F46E5] text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {inFeedback && isCorrectOption ? <CheckCircle2 className="w-5 h-5" /> :
                         inFeedback && isWrong ? <XCircle className="w-5 h-5" /> :
                         opt.label}
                      </div>
                      <span className="font-bold text-deep-forest text-sm">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Feedback panel */}
            {phase === "feedback" && feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-6 mb-6 border ${
                  feedback.isCorrect ? "bg-[#22C55E]/5 border-[#22C55E]/20" : "bg-[#EF4444]/5 border-[#EF4444]/20"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  {feedback.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-[#22C55E]" />
                  ) : (
                    <XCircle className="w-6 h-6 text-[#EF4444]" />
                  )}
                  <span className={`font-black text-lg ${feedback.isCorrect ? "text-[#22C55E]" : "text-[#EF4444]"}`}>
                    {feedback.isCorrect ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-3">{feedback.explanation}</p>
                {feedback.commonMistakes && feedback.commonMistakes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Common Mistakes</span>
                    {feedback.commonMistakes.map((m, i) => (
                      <p key={i} className="text-xs text-slate-500 mt-1"><strong>{m.label}:</strong> {m.explanation}</p>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              {phase === "question" && (
                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer || submitting}
                  className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Submit Answer
                </button>
              )}
              {phase === "feedback" && (
                <button
                  onClick={nextQuestion}
                  className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all flex items-center gap-2"
                >
                  {feedback?.nextQuestion ? "Next Question" : "See Results"} <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ===== RESULTS SCREEN =====
  if (phase === "results") {
    const r = results;
    return (
      <div className="max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#D6FF62] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-deep-forest" />
            </div>
            <h1 className="text-3xl font-black text-deep-forest font-display mb-2">Session Complete!</h1>
            <p className="text-slate-400 font-medium">Here&apos;s how you did.</p>
          </div>

          {/* Score summary */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <div className="text-4xl font-black text-deep-forest">{r ? Math.round(r.accuracy * 100) : Math.round((correct / Math.max(answered, 1)) * 100)}%</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Accuracy</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <div className="text-4xl font-black text-deep-forest">{r ? r.totalCorrect : correct}/{r ? r.totalQuestions : answered}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Correct</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
              <div className="text-4xl font-black text-deep-forest">{formatTime(r?.timeSpent ?? timeElapsed)}</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Time</div>
            </div>
          </div>

          {/* Skill breakdown */}
          {r?.skillBreakdown && r.skillBreakdown.length > 0 && (
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-6 mb-8">
              <h2 className="font-black text-deep-forest text-lg mb-4">Skill Breakdown</h2>
              <div className="space-y-3">
                {r.skillBreakdown.map((s) => (
                  <div key={s.category} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-deep-forest flex-1">{s.category}</span>
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.accuracy >= 0.8 ? "bg-[#22C55E]" : s.accuracy >= 0.6 ? "bg-[#F59E0B]" : "bg-[#EF4444]"}`}
                        style={{ width: `${s.accuracy * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-slate-500 w-16 text-right">{s.correct}/{s.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <button
              onClick={() => { setPhase("setup"); setSelectedAnswer(null); setFeedback(null); setResults(null); }}
              className="px-6 py-4 bg-white border-2 border-slate-200 text-deep-forest rounded-xl font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Practice Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
