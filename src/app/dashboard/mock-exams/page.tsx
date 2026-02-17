"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  BarChart2,
  Trophy,
  Target,
  TrendingUp,
  Zap,
  Loader2,
} from "lucide-react";
import type { Exam } from "@/lib/types";

function SkeletonCard() {
  return <div className="bg-white rounded-[24px] border border-slate-100 p-6 animate-pulse"><div className="h-14 bg-slate-200 rounded-2xl mb-4" /><div className="h-8 bg-slate-200 rounded w-1/2" /></div>;
}

export default function MockExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((d) => setExams(d.exams || []))
      .catch(() => toast.error("Failed to load exams"))
      .finally(() => setLoading(false));
  }, []);

  const startExam = async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/exams", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to start exam");
        return;
      }
      const data = await res.json();
      toast.success("Exam started! Redirecting to practice...");
      // The exam creates a practice session, redirect to it
      router.push(`/dashboard/practice`);
    } catch {
      toast.error("Network error");
    } finally {
      setStarting(false);
    }
  };

  const completedExams = exams.filter((e) => e.completed_at);
  const bestScore = completedExams.length > 0
    ? Math.max(...completedExams.map((e) => e.composite_score || 0))
    : 0;
  const avgScore = completedExams.length > 0
    ? Math.round(completedExams.reduce((a, e) => a + (e.composite_score || 0), 0) / completedExams.length)
    : 0;
  const improvement = completedExams.length >= 2
    ? (completedExams[0]?.composite_score || 0) - (completedExams[completedExams.length - 1]?.composite_score || 0)
    : 0;

  return (
    <div className="max-w-6xl">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Mock Exams</h1>
        </div>
        <p className="text-slate-400 font-medium">Take full-length practice exams to simulate the real SHSAT experience.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-12">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse"><div className="h-4 bg-slate-200 rounded w-20 mb-3" /><div className="h-8 bg-slate-200 rounded w-12" /></div>)
        ) : (
          <>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><Trophy className="w-5 h-5 text-[#F59E0B]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Best Score</span></div>
              <div className="text-3xl font-black text-deep-forest">{bestScore || "—"}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><Target className="w-5 h-5 text-[#4F46E5]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Average</span></div>
              <div className="text-3xl font-black text-deep-forest">{avgScore || "—"}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><CheckCircle2 className="w-5 h-5 text-[#22C55E]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completed</span></div>
              <div className="text-3xl font-black text-deep-forest">{completedExams.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><TrendingUp className="w-5 h-5 text-[#D6FF62]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Improvement</span></div>
              <div className="text-3xl font-black text-deep-forest">{improvement > 0 ? `+${improvement}` : improvement || "—"}</div>
            </div>
          </>
        )}
      </div>

      {/* Start new exam button */}
      <div className="mb-8">
        <button
          onClick={startExam}
          disabled={starting}
          className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          {starting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {starting ? "Starting..." : "Start New Mock Exam"}
        </button>
      </div>

      {/* Exam list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-[#D6FF62] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-deep-forest" />
          </div>
          <h2 className="text-2xl font-black text-deep-forest mb-3">No Exams Yet</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Take your first mock exam to see how you&apos;d perform on the real SHSAT.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam, i) => {
            const isCompleted = !!exam.completed_at;
            return (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isCompleted ? "bg-[#D6FF62]" : "bg-[#EEF2FF]"}`}>
                        <BookOpen className={`w-6 h-6 ${isCompleted ? "text-deep-forest" : "text-[#4F46E5]"}`} />
                      </div>
                      <div>
                        <h3 className="font-black text-deep-forest text-lg">Mock Exam</h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {isCompleted ? new Date(exam.completed_at!).toLocaleDateString() : "In progress"}
                        </p>
                      </div>
                    </div>
                    {isCompleted ? (
                      <div className="flex items-center gap-1.5 text-[#22C55E] bg-[#22C55E]/10 px-3 py-1.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[#F59E0B] bg-[#F59E0B]/10 px-3 py-1.5 rounded-full">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-black uppercase tracking-wider">In Progress</span>
                      </div>
                    )}
                  </div>

                  {isCompleted && exam.composite_score && (
                    <div className="bg-slate-50 rounded-2xl p-5 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Composite</div>
                          <div className="text-3xl font-black text-deep-forest">{exam.composite_score}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase">ELA</div>
                            <div className="text-lg font-bold text-slate-600">{exam.ela_scaled_score ?? "—"}</div>
                          </div>
                          <div>
                            <div className="text-[9px] font-black text-slate-400 uppercase">Math</div>
                            <div className="text-lg font-bold text-slate-600">{exam.math_scaled_score ?? "—"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isCompleted && (
                    <button className="w-full py-4 rounded-xl font-black text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                      <BarChart2 className="w-4 h-4" /> Review Results
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pro tip */}
      <div className="mt-12 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-[24px] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-[#D6FF62]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Pro Tip</span>
            </div>
            <h3 className="text-2xl font-black mb-2">Simulate Real Test Conditions</h3>
            <p className="text-white/70 font-medium max-w-lg">
              Take your mock exams in a quiet environment with no distractions. Time yourself strictly and don&apos;t peek at answers until you&apos;re done!
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-10 h-10 text-[#D6FF62]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
