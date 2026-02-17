"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Clock, Upload, Eye, ChevronRight, Zap } from "lucide-react";
import AdminStatsCards, { type AdminStats } from "@/components/admin/AdminStatsCards";
import StatusBadge from "@/components/admin/StatusBadge";
import type { Question } from "@/lib/types";

export default function AdminOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recent, setRecent] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.ok ? r.json() : null),
      fetch("/api/admin/questions?limit=10&sort=updated_at&order=desc").then((r) => r.ok ? r.json() : null),
    ])
      .then(([s, q]) => {
        if (s) setStats(s);
        if (q?.questions) setRecent(q.questions);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 bg-[#4F46E5] rounded-xl flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-black text-deep-forest font-display">Admin Overview</h1>
        </div>
        <p className="text-slate-400 font-medium">Manage questions, passages, and review content.</p>
      </header>

      <div className="mb-10">
        <AdminStatsCards stats={stats} loading={loading} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Review Pending", icon: Eye, href: "/dashboard/admin/questions?status=draft", color: "text-amber-500" },
          { label: "Upload Questions", icon: Upload, href: "/dashboard/admin/upload", color: "text-[#4F46E5]" },
          { label: "View All Questions", icon: Zap, href: "/dashboard/admin/questions", color: "text-emerald-500" },
        ].map((a) => (
          <button
            key={a.label}
            onClick={() => router.push(a.href)}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <a.icon className={`w-5 h-5 ${a.color}`} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-deep-forest text-sm">{a.label}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-black text-deep-forest text-lg mb-4">Recent Activity</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="text-slate-400 text-sm font-medium text-center py-8">No questions yet.</p>
        ) : (
          <div className="space-y-2">
            {recent.map((q) => (
              <div
                key={q.id}
                onClick={() => router.push(`/dashboard/admin/questions/${q.id}`)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${q.section === "math" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                    {q.section.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-deep-forest truncate">{q.stem}</span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={q.review_status} />
                  <span className="text-xs text-slate-400">{new Date(q.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
