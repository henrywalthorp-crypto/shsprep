"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  compositeScore: number | null;
  elaScore: number | null;
  mathScore: number | null;
  completedAt: string | null;
  previousComposite: number | null;
}

export default function ExamScoreCard({ compositeScore, elaScore, mathScore, completedAt, previousComposite }: Props) {
  const delta = compositeScore != null && previousComposite != null ? compositeScore - previousComposite : null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Composite Score</span>
          <div className="text-4xl font-black text-deep-forest mt-1">{compositeScore ?? "—"}</div>
        </div>
        {delta != null && delta !== 0 && (
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-black ${
            delta > 0 ? "bg-[#22C55E]/10 text-[#22C55E]" : "bg-[#EF4444]/10 text-[#EF4444]"
          }`}>
            {delta > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {delta > 0 ? "+" : ""}{delta}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-50 rounded-xl p-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ELA</span>
          <div className="text-xl font-black text-deep-forest">{elaScore ?? "—"}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Math</span>
          <div className="text-xl font-black text-deep-forest">{mathScore ?? "—"}</div>
        </div>
      </div>

      <div className="text-xs text-slate-400 font-medium">
        {completedAt ? new Date(completedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Not completed"}
      </div>
    </div>
  );
}
