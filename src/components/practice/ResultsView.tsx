"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, ArrowLeft } from "lucide-react";

interface ResultsData {
  accuracy: number;
  totalCorrect: number;
  totalQuestions: number;
  skillBreakdown: { category: string; correct: number; total: number; accuracy: number }[];
  timeSpent: number;
}

interface ResultsViewProps {
  results: ResultsData | null;
  correct: number;
  answered: number;
  timeElapsed: number;
  formatTime: (s: number) => string;
  onPracticeAgain: () => void;
  onBackToDashboard: () => void;
}

export function ResultsView({ results: r, correct, answered, timeElapsed, formatTime, onPracticeAgain, onBackToDashboard }: ResultsViewProps) {
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
            onClick={onPracticeAgain}
            className="px-6 py-4 bg-white border-2 border-slate-200 text-deep-forest rounded-xl font-black text-sm hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Practice Again
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
