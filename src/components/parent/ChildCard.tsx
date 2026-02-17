"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Target, Flame, Clock, ChevronRight } from "lucide-react";
import type { LinkedChild } from "@/lib/types";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

function accuracyColor(acc: number): string {
  if (acc > 70) return "border-l-[#22C55E]";
  if (acc > 40) return "border-l-[#F59E0B]";
  return "border-l-[#EF4444]";
}

export default function ChildCard({ child }: { child: LinkedChild }) {
  const router = useRouter();
  const acc = Math.round(child.overall_accuracy);

  return (
    <div
      onClick={() => router.push(`/dashboard/parent/${child.id}`)}
      className={`bg-white rounded-2xl p-6 border border-slate-100 border-l-4 ${accuracyColor(acc)} shadow-sm hover:shadow-md transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-black text-deep-forest text-lg">{child.first_name} {child.last_name}</h3>
          <p className="text-sm text-slate-400 font-medium">
            {child.grade ? `Grade ${child.grade}` : ""}
            {child.grade && child.target_school ? " · " : ""}
            {child.target_school || ""}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#4F46E5] transition-colors" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Target className="w-3.5 h-3.5 text-[#4F46E5]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
          </div>
          <span className={`text-xl font-black ${acc > 70 ? "text-[#22C55E]" : acc > 40 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
            {acc}%
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span>
          </div>
          <span className="text-xl font-black text-deep-forest">{child.current_streak}d</span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active</span>
          </div>
          <span className="text-sm font-bold text-slate-500">{timeAgo(child.last_active_at)}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-50 text-xs text-slate-400 font-medium">
        {child.total_questions.toLocaleString()} questions practiced
      </div>
    </div>
  );
}
