"use client";

import React from "react";
import {
  Play,
  Zap,
  Target,
  BookOpen,
  Calculator,
  Loader2,
} from "lucide-react";

interface PracticeSetupProps {
  section: string;
  setSection: (s: string) => void;
  difficulty: string;
  setDifficulty: (d: string) => void;
  questionCount: number;
  setQuestionCount: (n: number) => void;
  mode: "practice" | "timed_practice";
  setMode: (m: "practice" | "timed_practice") => void;
  onStart: () => void;
  starting: boolean;
}

export function PracticeSetup({
  section, setSection,
  difficulty, setDifficulty,
  questionCount, setQuestionCount,
  mode, setMode,
  onStart, starting,
}: PracticeSetupProps) {
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
          onClick={onStart}
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
