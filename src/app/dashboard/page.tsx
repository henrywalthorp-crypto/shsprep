"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/context/role-context";
import {
  Layout,
  Target,
  CheckCircle2,
  Sparkles,
  Flame,
  Clock,
  ChevronRight,
  Zap,
  Users,
  UserPlus,
} from "lucide-react";
import ChildCard from "@/components/parent/ChildCard";
import LinkChildModal from "@/components/parent/LinkChildModal";
import type { LinkedChild } from "@/lib/types";

// ============================================================================
// Student Dashboard (original)
// ============================================================================

interface SummaryData {
  totalPracticed: number;
  overallAccuracy: number;
  currentStreak: number;
  weakestSkills: { category: string; mastery: number; accuracy: number }[];
  strongestSkills: { category: string; mastery: number; accuracy: number }[];
  recentSessions: {
    id: string;
    mode: string;
    section_filter: string | null;
    accuracy: number | null;
    total_questions: number;
    time_spent_seconds: number;
    completed_at: string;
  }[];
}

function SkeletonCard() {
  return <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse"><div className="h-4 bg-slate-200 rounded w-24 mb-3" /><div className="h-8 bg-slate-200 rounded w-16" /></div>;
}

function StudentDashboard() {
  const router = useRouter();
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics/summary")
      .then((r) => { if (!r.ok) throw new Error("Failed to load"); return r.json(); })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="max-w-4xl">
        <div className="bg-red-50 text-red-600 rounded-2xl p-6 text-center font-bold">Failed to load dashboard. Please try again.</div>
      </div>
    );
  }

  const isEmpty = data && data.totalPracticed === 0;

  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <Layout className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Dashboard</h1>
        </div>
        <p className="text-slate-400 font-medium">Track your progress and continue preparing for the SHSAT.</p>
      </header>

      <div className="grid grid-cols-4 gap-6 mb-12">
        {loading ? (
          <><SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard /></>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><Target className="w-5 h-5 text-[#4F46E5]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Questions</span></div>
              <div className="text-3xl font-black text-deep-forest">{data?.totalPracticed?.toLocaleString() ?? 0}</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><CheckCircle2 className="w-5 h-5 text-[#22C55E]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span></div>
              <div className="text-3xl font-black text-deep-forest">{data ? Math.round(data.overallAccuracy * 100) : 0}%</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><Flame className="w-5 h-5 text-[#F59E0B]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</span></div>
              <div className="text-3xl font-black text-deep-forest">{data?.currentStreak ?? 0} days</div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2"><Sparkles className="w-5 h-5 text-[#EC4899]" /><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions</span></div>
              <div className="text-3xl font-black text-deep-forest">{data?.recentSessions?.length ?? 0}</div>
            </div>
          </>
        )}
      </div>

      {isEmpty && (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-12 text-center mb-12">
          <div className="w-16 h-16 bg-[#D6FF62] rounded-2xl flex items-center justify-center mx-auto mb-6"><Zap className="w-8 h-8 text-deep-forest" /></div>
          <h2 className="text-2xl font-black text-deep-forest mb-3">Start Your First Practice Session!</h2>
          <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">Jump into practice mode to begin mastering SHSAT topics. We&apos;ll track your progress and help you focus on what matters most.</p>
          <button onClick={() => router.push("/dashboard/practice")} className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-95">Start Practicing</button>
        </div>
      )}

      {!loading && !isEmpty && data?.recentSessions && data.recentSessions.length > 0 && (
        <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm mb-8">
          <h2 className="font-black text-deep-forest text-lg mb-6">Recent Sessions</h2>
          <div className="space-y-3">
            {data.recentSessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#D6FF62]/20 rounded-xl flex items-center justify-center"><Zap className="w-5 h-5 text-[#84CC16]" /></div>
                  <div>
                    <div className="font-bold text-deep-forest text-sm">{s.section_filter ? s.section_filter.toUpperCase() : "Mixed"} — {s.mode.replace("_", " ")}</div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span>{s.total_questions} questions</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{Math.round(s.time_spent_seconds / 60)}m</span>
                      <span>{new Date(s.completed_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-black ${(s.accuracy ?? 0) >= 0.8 ? "text-[#22C55E]" : (s.accuracy ?? 0) >= 0.6 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
                  {s.accuracy != null ? Math.round(s.accuracy * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && !isEmpty && (
        <div className="grid grid-cols-2 gap-6">
          {data?.strongestSkills && data.strongestSkills.length > 0 && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-black text-deep-forest text-lg mb-4">Strongest Skills</h2>
              <div className="space-y-3">
                {data.strongestSkills.map((s) => (
                  <div key={s.category} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-deep-forest">{s.category}</span>
                    <span className="text-sm font-black text-[#22C55E]">{Math.round(s.accuracy * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {data?.weakestSkills && data.weakestSkills.length > 0 && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
              <h2 className="font-black text-deep-forest text-lg mb-4">Needs Improvement</h2>
              <div className="space-y-3">
                {data.weakestSkills.map((s) => (
                  <div key={s.category} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-deep-forest">{s.category}</span>
                    <span className="text-sm font-black text-[#F59E0B]">{Math.round(s.accuracy * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !isEmpty && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => router.push("/dashboard/practice")} className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-95 flex items-center gap-2">
            Continue Practicing <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Parent Dashboard
// ============================================================================

function ParentDashboard() {
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [linkOpen, setLinkOpen] = useState(false);

  const fetchChildren = () => {
    fetch("/api/parent/children")
      .then((r) => r.ok ? r.json() : { children: [] })
      .then((d) => setChildren(d.children || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchChildren(); }, []);

  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-black text-deep-forest font-display">Your Children&apos;s Progress</h1>
            </div>
            <p className="text-slate-400 font-medium">Monitor your child&apos;s SHSAT preparation journey.</p>
          </div>
          {children.length > 0 && (
            <button
              onClick={() => setLinkOpen(true)}
              className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-lg shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" /> Link a Child
            </button>
          )}
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-2 gap-6">
          <SkeletonCard /><SkeletonCard />
        </div>
      ) : children.length === 0 ? (
        <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-[#D6FF62] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-deep-forest" />
          </div>
          <h2 className="text-2xl font-black text-deep-forest mb-3">Link Your Child&apos;s Account</h2>
          <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">
            Link your child&apos;s SHS Prep account to track their SHSAT preparation progress, scores, and study activity.
          </p>
          <button
            onClick={() => setLinkOpen(true)}
            className="px-8 py-4 bg-[#4F46E5] text-white rounded-xl font-black text-sm shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338CA] transition-all active:scale-95 flex items-center gap-2 mx-auto"
          >
            <UserPlus className="w-5 h-5" /> Link a Child
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {children.map((child) => (
            <ChildCard key={child.id} child={child} />
          ))}
        </div>
      )}

      <LinkChildModal open={linkOpen} onOpenChange={setLinkOpen} onSuccess={fetchChildren} />
    </div>
  );
}

// ============================================================================
// Role-Aware Entry
// ============================================================================

export default function DashboardPage() {
  const { role } = useRole();

  if (role === "parent") return <ParentDashboard />;
  return <StudentDashboard />;
}
