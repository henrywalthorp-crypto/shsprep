"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, FileText, Clock, BarChart2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import ChildStats from "@/components/parent/ChildStats";
import ChildActivityFeed from "@/components/parent/ChildActivityFeed";
import type { ChildDetail } from "@/lib/types";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-slate-200 rounded-2xl animate-pulse ${className || "h-48"}`} />;
}

export default function ChildDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<ChildDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/parent/children/${studentId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId]);

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <SkeletonBlock className="h-12 w-64" />
        <div className="grid grid-cols-4 gap-6"><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /><SkeletonBlock /></div>
        <div className="grid grid-cols-2 gap-6"><SkeletonBlock className="h-64" /><SkeletonBlock className="h-64" /></div>
        <SkeletonBlock className="h-64" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red-50 text-red-600 rounded-2xl p-6 text-center font-bold">Student not found or access denied.</div>
      </div>
    );
  }

  const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EC4899"];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
      <header className="mb-8">
        <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#4F46E5] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Children
        </button>
        <h1 className="text-3xl font-black text-deep-forest font-display">{data.first_name} {data.last_name}</h1>
        <p className="text-slate-400 font-medium">
          {data.grade ? `Grade ${data.grade}` : ""}
          {data.grade && data.target_school ? " · " : ""}
          {data.target_school || ""}
        </p>
      </header>

      <div className="mb-8">
        <ChildStats
          totalQuestions={data.total_questions}
          overallAccuracy={data.overall_accuracy}
          currentStreak={data.current_streak}
          sessionsThisWeek={data.sessions_this_week}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Accuracy trend */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="font-black text-deep-forest text-base mb-4">Accuracy Trend (4 Weeks)</h3>
          {data.accuracy_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.accuracy_trend}>
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(v: number) => [`${Math.round(v)}%`, "Accuracy"]}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#4F46E5" strokeWidth={3} dot={{ r: 5, fill: "#4F46E5" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Section breakdown */}
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
          <h3 className="font-black text-deep-forest text-base mb-4">Section Breakdown</h3>
          {data.section_breakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.section_breakdown}>
                <XAxis dataKey="section" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  formatter={(v: number) => [`${Math.round(v)}%`, "Accuracy"]}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {data.section_breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">No data yet</div>
          )}
        </div>
      </div>

      <div className="mb-8">
        <ChildActivityFeed sessions={data.recent_sessions.slice(0, 10)} studentId={studentId} />
      </div>

      <div className="flex gap-4">
        {[
          { label: "View Skills", href: `/dashboard/parent/${studentId}/skills`, icon: BarChart2 },
          { label: "View Exams", href: `/dashboard/parent/${studentId}/exams`, icon: BookOpen },
          { label: "View All Sessions", href: `/dashboard/parent/${studentId}/sessions`, icon: Clock },
        ].map((link) => (
          <button
            key={link.href}
            onClick={() => router.push(link.href)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-deep-forest hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
          >
            <link.icon className="w-4 h-4" /> {link.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
