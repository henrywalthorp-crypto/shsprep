"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import ExamScoreCard from "@/components/parent/ExamScoreCard";
import type { ChildExamData } from "@/lib/types";

export default function ChildExamsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<ChildExamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/parent/children/${studentId}/exams`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="max-w-4xl space-y-6">
        <div className="h-12 w-64 bg-slate-200 rounded-2xl animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!data) {
    return <div className="max-w-4xl"><div className="bg-red-50 text-red-600 rounded-2xl p-6 text-center font-bold">Could not load exam data.</div></div>;
  }

  const trendData = data.exams
    .filter((e) => e.composite_score != null && e.completed_at)
    .map((e, i) => ({ name: `Exam ${i + 1}`, score: e.composite_score }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
      <header className="mb-8">
        <button onClick={() => router.push(`/dashboard/parent/${studentId}`)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#4F46E5] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-black text-deep-forest font-display">{data.student_name} — Mock Exam History</h1>
      </header>

      {data.exams.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-black text-deep-forest mb-2">No Exams Yet</h2>
          <p className="text-slate-400 font-medium">Your child hasn&apos;t taken any mock exams yet.</p>
        </div>
      ) : (
        <>
          {trendData.length > 1 && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-8">
              <h3 className="font-black text-deep-forest text-base mb-4">Score Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5, fill: "#4F46E5" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            {data.exams.map((exam) => (
              <ExamScoreCard
                key={exam.id}
                compositeScore={exam.composite_score}
                elaScore={exam.ela_scaled_score}
                mathScore={exam.math_scaled_score}
                completedAt={exam.completed_at}
                previousComposite={exam.previous_composite}
              />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
