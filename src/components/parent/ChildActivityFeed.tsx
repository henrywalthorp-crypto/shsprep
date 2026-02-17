"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Clock, Zap, ChevronRight } from "lucide-react";
import type { ChildSession } from "@/lib/types";

interface Props {
  sessions: ChildSession[];
  studentId: string;
}

export default function ChildActivityFeed({ sessions, studentId }: Props) {
  const router = useRouter();

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm text-center text-slate-400 font-medium py-12">
        No recent practice sessions yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-deep-forest text-lg">Recent Activity</h2>
        <button
          onClick={() => router.push(`/dashboard/parent/${studentId}/sessions`)}
          className="text-sm font-bold text-[#4F46E5] hover:underline flex items-center gap-1"
        >
          View All <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3">
        {sessions.map((s) => {
          const acc = s.accuracy != null ? Math.round(s.accuracy * 100) : 0;
          return (
            <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#D6FF62]/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[#84CC16]" />
                </div>
                <div>
                  <div className="font-bold text-deep-forest text-sm">
                    {s.section_filter ? s.section_filter.toUpperCase() : "Mixed"} — {s.mode.replace("_", " ")}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                    <span>{s.total_questions} questions</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(s.time_spent_seconds / 60)}m
                    </span>
                    <span>{new Date(s.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className={`text-xl font-black ${acc >= 80 ? "text-[#22C55E]" : acc >= 60 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
                {acc}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
