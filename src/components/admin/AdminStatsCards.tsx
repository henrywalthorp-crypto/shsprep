"use client";

import {
  FileQuestion,
  CheckCircle2,
  Clock,
  Calculator,
  BookOpen,
  FileText,
} from "lucide-react";

export interface AdminStats {
  totalQuestions: number;
  published: number;
  pendingReview: number;
  mathQuestions: number;
  elaQuestions: number;
  passages: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  sub,
}: {
  icon: any;
  label: string;
  value: number;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black text-deep-forest">
        {value.toLocaleString()}
      </div>
      {sub && <p className="text-xs text-slate-400 mt-1 font-medium">{sub}</p>}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-24 mb-3" />
      <div className="h-8 bg-slate-200 rounded w-16" />
    </div>
  );
}

export default function AdminStatsCards({
  stats,
  loading,
}: {
  stats: AdminStats | null;
  loading: boolean;
}) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const pct = stats.totalQuestions
    ? `${Math.round((stats.published / stats.totalQuestions) * 100)}% published`
    : undefined;

  return (
    <div className="grid grid-cols-3 gap-6">
      <StatCard icon={FileQuestion} label="Total Questions" value={stats.totalQuestions} color="text-[#4F46E5]" sub={pct} />
      <StatCard icon={CheckCircle2} label="Published" value={stats.published} color="text-emerald-500" />
      <StatCard icon={Clock} label="Pending Review" value={stats.pendingReview} color="text-amber-500" />
      <StatCard icon={Calculator} label="Math" value={stats.mathQuestions} color="text-blue-500" />
      <StatCard icon={BookOpen} label="ELA" value={stats.elaQuestions} color="text-purple-500" />
      <StatCard icon={FileText} label="Passages" value={stats.passages} color="text-pink-500" />
    </div>
  );
}
