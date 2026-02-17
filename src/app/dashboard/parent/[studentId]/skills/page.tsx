"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, AlertTriangle } from "lucide-react";
import SkillsOverview from "@/components/parent/SkillsOverview";
import type { ChildSkillData } from "@/lib/types";

export default function ChildSkillsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<ChildSkillData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/parent/children/${studentId}/skills`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-12 w-64 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return <div className="max-w-4xl"><div className="bg-red-50 text-red-600 rounded-2xl p-6 text-center font-bold">Could not load skill data.</div></div>;
  }

  const sorted = [...data.skills].sort((a, b) => b.mastery_level - a.mastery_level);
  const strengths = sorted.slice(0, 5);
  const needsWork = [...data.skills].sort((a, b) => a.mastery_level - b.mastery_level).slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
      <header className="mb-8">
        <button onClick={() => router.push(`/dashboard/parent/${studentId}`)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#4F46E5] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-black text-deep-forest font-display">{data.student_name} — Skills Breakdown</h1>
      </header>

      <div className="mb-8">
        <SkillsOverview skills={data.skills} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-[#F59E0B]" />
            <h3 className="font-black text-deep-forest text-base">Strengths</h3>
          </div>
          <div className="space-y-3">
            {strengths.map((s) => (
              <div key={s.category} className="flex items-center justify-between">
                <span className="text-sm font-bold text-deep-forest">{s.category}</span>
                <span className="text-sm font-black text-[#22C55E]">{Math.round(s.mastery_level)}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            <h3 className="font-black text-deep-forest text-base">Needs Work</h3>
          </div>
          <div className="space-y-3">
            {needsWork.map((s) => (
              <div key={s.category} className="flex items-center justify-between">
                <span className="text-sm font-bold text-deep-forest">{s.category}</span>
                <span className="text-sm font-black text-[#F59E0B]">{Math.round(s.mastery_level)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
