"use client";

import React from "react";
import { Target, CheckCircle2, Flame, Sparkles } from "lucide-react";

interface Props {
  totalQuestions: number;
  overallAccuracy: number;
  currentStreak: number;
  sessionsThisWeek: number;
}

function colorForValue(value: number, thresholds: [number, number] = [40, 70]): string {
  if (value >= thresholds[1]) return "text-[#22C55E]";
  if (value >= thresholds[0]) return "text-[#F59E0B]";
  return "text-[#EF4444]";
}

export default function ChildStats({ totalQuestions, overallAccuracy, currentStreak, sessionsThisWeek }: Props) {
  const acc = Math.round(overallAccuracy);
  const cards = [
    { icon: Target, color: "text-[#4F46E5]", label: "Questions", value: totalQuestions.toLocaleString(), valueColor: "text-deep-forest" },
    { icon: CheckCircle2, color: "text-[#22C55E]", label: "Accuracy", value: `${acc}%`, valueColor: colorForValue(acc) },
    { icon: Flame, color: "text-[#F59E0B]", label: "Streak", value: `${currentStreak} days`, valueColor: currentStreak > 0 ? "text-deep-forest" : "text-[#EF4444]" },
    { icon: Sparkles, color: "text-[#EC4899]", label: "This Week", value: String(sessionsThisWeek), valueColor: colorForValue(sessionsThisWeek, [1, 3]) },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <c.icon className={`w-5 h-5 ${c.color}`} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.label}</span>
          </div>
          <div className={`text-3xl font-black ${c.valueColor}`}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}
