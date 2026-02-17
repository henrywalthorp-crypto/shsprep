"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import type { ChildSession, ChildSessionsData } from "@/lib/types";

const PAGE_SIZE = 15;

export default function ChildSessionsPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  const [data, setData] = useState<ChildSessionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  const fetchSessions = useCallback(() => {
    setLoading(true);
    const qs = new URLSearchParams({ offset: String(page * PAGE_SIZE), limit: String(PAGE_SIZE) });
    if (sectionFilter !== "all") qs.set("section", sectionFilter);
    fetch(`/api/parent/children/${studentId}/sessions?${qs}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [studentId, page, sectionFilter]);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl">
      <header className="mb-8">
        <button onClick={() => router.push(`/dashboard/parent/${studentId}`)} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-[#4F46E5] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-black text-deep-forest font-display">{data?.student_name || "Student"} — Practice History</h1>
      </header>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={sectionFilter}
            onChange={(e) => { setSectionFilter(e.target.value); setPage(0); }}
            className="p-2 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-deep-forest focus:ring-2 focus:ring-[#4F46E5]"
          >
            <option value="all">All Sections</option>
            <option value="math">Math</option>
            <option value="ela">ELA</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center"><div className="h-6 w-6 animate-spin rounded-full border-4 border-[#4F46E5] border-t-transparent mx-auto" /></div>
        ) : !data || data.sessions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-medium">No sessions found.</div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["Date", "Section", "Focus", "Questions", "Accuracy", "Time"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.sessions.map((s) => {
                  const acc = s.accuracy != null ? Math.round(s.accuracy * 100) : 0;
                  return (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-deep-forest">{new Date(s.completed_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-black uppercase px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                          {s.section_filter || "Mixed"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">{s.category_filter || "—"}</td>
                      <td className="px-6 py-4 text-sm font-bold text-deep-forest">{s.total_questions}</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-black ${acc >= 80 ? "text-[#22C55E]" : acc >= 60 ? "text-[#F59E0B]" : "text-[#EF4444]"}`}>
                          {acc}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {Math.round(s.time_spent_seconds / 60)}m
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-medium">
                  Page {page + 1} of {totalPages} · {data.total} sessions total
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
