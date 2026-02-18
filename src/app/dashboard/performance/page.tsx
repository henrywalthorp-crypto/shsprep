"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  TrendingUp,
  TrendingDown,
  Target,
  CheckCircle2,
  Flame,
  Clock,
  Zap,
  Brain,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getCategoryLabel } from "@/lib/questions/categories";

interface Skill {
  category: string;
  mastery: number;
  accuracy: number;
  totalAttempted: number;
  trend: string;
}

interface HistorySession {
  id: string;
  mode: string;
  section: string | null;
  accuracy: number;
  questionsCount: number;
  timeSpent: number;
  completedAt: string;
}

interface TrendPoint {
  week: string;
  avgAccuracy: number;
  questionsCompleted: number;
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`bg-slate-200 rounded animate-pulse ${className}`} />;
}

export default function PerformancePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics/skills").then((r) => r.json()),
      fetch("/api/analytics/history").then((r) => r.json()),
      fetch("/api/analytics/trends").then((r) => r.json()),
    ])
      .then(([sk, hist, tr]) => {
        setSkills(sk.skills || []);
        setHistory(hist.sessions || []);
        setTrends(tr.weekly || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Also compute totals from skill stats (more reliable since they update per-answer)
  const totalQuestionsFromSkills = skills.reduce((a, s) => a + s.totalAttempted, 0);
  const totalQuestionsFromHistory = history.reduce((a, s) => a + s.questionsCount, 0);
  const totalQuestions = Math.max(totalQuestionsFromSkills, totalQuestionsFromHistory);
  const avgAccuracyFromSkills = skills.length > 0 
    ? skills.reduce((a, s) => a + s.accuracy * s.totalAttempted, 0) / Math.max(totalQuestionsFromSkills, 1)
    : 0;
  const avgAccuracyFromHistory = history.length > 0 
    ? history.reduce((a, s) => a + (s.accuracy || 0), 0) / history.length 
    : 0;
  const avgAccuracy = totalQuestionsFromSkills > 0 ? avgAccuracyFromSkills : avgAccuracyFromHistory;
  const totalTime = history.reduce((a, s) => a + s.timeSpent, 0);

  const strengths = [...skills].sort((a, b) => b.accuracy - a.accuracy).slice(0, 4);
  const weaknesses = [...skills].sort((a, b) => a.accuracy - b.accuracy).slice(0, 4);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "improving") return <TrendingUp className="w-4 h-4 text-[#22C55E]" />;
    if (trend === "declining") return <TrendingDown className="w-4 h-4 text-[#EF4444]" />;
    return <div className="w-4 h-4 rounded-full bg-slate-300" />;
  };

  const isEmpty = !loading && skills.length === 0 && history.length === 0;

  return (
    <div className="max-w-6xl">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Performance</h1>
        </div>
        <p className="text-slate-400 font-medium">Track your progress, identify strengths and weaknesses, and see how you&apos;re improving over time.</p>
      </header>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-24 rounded-2xl" />)}
          </div>
          <SkeletonBlock className="h-64 rounded-[24px]" />
        </div>
      ) : isEmpty ? (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-[#D6FF62] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <BarChart2 className="w-8 h-8 text-deep-forest" />
          </div>
          <h2 className="text-2xl font-black text-deep-forest mb-3">No Data Yet</h2>
          <p className="text-slate-400 font-medium max-w-md mx-auto">
            Complete some practice sessions to see your performance analytics here.
          </p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-[#4F46E5]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Questions</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">{totalQuestions.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg Accuracy</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">{Math.round(avgAccuracy * 100)}%</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-[#F59E0B]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sessions</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">{history.length}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#EC4899]" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Study Time</span>
              </div>
              <div className="text-2xl font-black text-deep-forest">{(totalTime / 3600).toFixed(1)}h</div>
            </div>
          </div>

          {/* Accuracy trend chart */}
          {trends.length > 0 && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-8">
              <h2 className="font-black text-deep-forest text-lg mb-6">Accuracy Trend</h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={trends.map(t => ({ ...t, accuracy: Math.round(t.avgAccuracy * 100) }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: "#94A3B8" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="accuracy" stroke="#4F46E5" strokeWidth={3} dot={{ fill: "#4F46E5", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Skill mastery bars */}
          {skills.length > 0 && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-8">
              <h2 className="font-black text-deep-forest text-lg mb-6">Skill Mastery</h2>
              <ResponsiveContainer width="100%" height={Math.max(200, skills.length * 40)}>
                <BarChart data={skills.map(s => ({ name: getCategoryLabel(s.category), mastery: Math.round(s.mastery * 100) }))} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                  <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 11, fill: "#64748B" }} />
                  <Tooltip />
                  <Bar dataKey="mastery" fill="#D6FF62" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Strengths & weaknesses */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#22C55E]" />
                </div>
                <h2 className="font-black text-deep-forest text-lg">Strengths</h2>
              </div>
              <div className="space-y-4">
                {strengths.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-deep-forest">{getCategoryLabel(item.category)}</span>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={item.trend} />
                        <span className="text-sm font-black text-[#22C55E]">{Math.round(item.accuracy * 100)}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${item.accuracy * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{item.totalAttempted} questions practiced</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#EF4444]/10 rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#EF4444]" />
                </div>
                <h2 className="font-black text-deep-forest text-lg">Areas to Improve</h2>
              </div>
              <div className="space-y-4">
                {weaknesses.map((item) => (
                  <div key={item.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-deep-forest">{getCategoryLabel(item.category)}</span>
                      <div className="flex items-center gap-2">
                        <TrendIcon trend={item.trend} />
                        <span className="text-sm font-black text-[#F59E0B]">{Math.round(item.accuracy * 100)}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${item.accuracy * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{item.totalAttempted} questions practiced</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Session history table */}
          {history.length > 0 && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-black text-deep-forest text-lg mb-6">Session History</h2>
              <div className="space-y-3">
                {history.map((s) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-deep-forest text-sm">
                        {s.section ? s.section.toUpperCase() : "Mixed"} — {s.mode.replace("_", " ")}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {s.questionsCount} questions • {Math.round(s.timeSpent / 60)}m • {new Date(s.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`text-xl font-black ${
                      s.accuracy >= 0.8 ? "text-[#22C55E]" : s.accuracy >= 0.6 ? "text-[#F59E0B]" : "text-[#EF4444]"
                    }`}>
                      {Math.round(s.accuracy * 100)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
