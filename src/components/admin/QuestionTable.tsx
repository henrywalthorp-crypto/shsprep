"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Trash2, CheckCircle2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Question, SectionType, DifficultyLevel } from "@/lib/types";

const diffLabel: Record<string, string> = { "1": "Easy", "2": "Medium", "3": "Hard" };
const diffColor: Record<string, string> = {
  "1": "bg-emerald-100 text-emerald-700",
  "2": "bg-amber-100 text-amber-700",
  "3": "bg-red-100 text-red-700",
};

type SortKey = "id" | "section" | "category" | "difficulty" | "review_status" | "stem";
type SortDir = "asc" | "desc";

export default function QuestionTable({
  questions,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
  onBulkPublish,
  onBulkDelete,
}: {
  questions: Question[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onBulkPublish?: (ids: string[]) => void;
  onBulkDelete?: (ids: string[]) => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    const copy = [...questions];
    copy.sort((a, b) => {
      const av = (a as any)[sortKey] ?? "";
      const bv = (b as any)[sortKey] ?? "";
      const cmp = String(av).localeCompare(String(bv));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [questions, sortKey, sortDir]);

  const toggleAll = () => {
    if (selected.size === sorted.length) setSelected(new Set());
    else setSelected(new Set(sorted.map((q) => q.id)));
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const totalPages = Math.ceil(total / pageSize);
  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === "asc" ? <ChevronUp className="w-3 h-3 inline ml-1" /> : <ChevronDown className="w-3 h-3 inline ml-1" />
    ) : null;

  const th = "px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest cursor-pointer hover:text-slate-600 select-none";

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <p className="text-slate-400 font-bold">No questions found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-[#4F46E5]/5 border-b border-slate-100">
          <span className="text-sm font-bold text-[#4F46E5]">{selected.size} selected</span>
          <button
            onClick={() => onBulkPublish?.(Array.from(selected))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Publish
          </button>
          <button
            onClick={() => onBulkDelete?.(Array.from(selected))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      )}

      <table className="w-full">
        <thead className="border-b border-slate-100">
          <tr>
            <th className="px-4 py-3 w-10">
              <input
                type="checkbox"
                checked={selected.size === sorted.length && sorted.length > 0}
                onChange={toggleAll}
                className="rounded border-slate-300"
              />
            </th>
            <th className={th} onClick={() => toggleSort("id")}>ID<SortIcon col="id" /></th>
            <th className={th} onClick={() => toggleSort("section")}>Section<SortIcon col="section" /></th>
            <th className={th} onClick={() => toggleSort("category")}>Category<SortIcon col="category" /></th>
            <th className={th} onClick={() => toggleSort("difficulty")}>Difficulty<SortIcon col="difficulty" /></th>
            <th className={th} onClick={() => toggleSort("review_status")}>Status<SortIcon col="review_status" /></th>
            <th className={th} onClick={() => toggleSort("stem")}>Stem<SortIcon col="stem" /></th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((q) => (
            <tr
              key={q.id}
              onClick={() => router.push(`/dashboard/admin/questions/${q.id}`)}
              className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selected.has(q.id)}
                  onChange={() => toggle(q.id)}
                  className="rounded border-slate-300"
                />
              </td>
              <td className="px-4 py-3 text-xs font-mono text-slate-500">{q.id.slice(0, 8)}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${q.section === "math" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                  {q.section.toUpperCase()}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-medium text-deep-forest">{q.category}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${diffColor[q.difficulty] ?? ""}`}>
                  {diffLabel[q.difficulty] ?? q.difficulty}
                </span>
              </td>
              <td className="px-4 py-3"><StatusBadge status={q.review_status} /></td>
              <td className="px-4 py-3 text-sm text-slate-600 max-w-[300px] truncate">{q.stem}</td>
              <td className="px-4 py-3 text-right text-xs text-slate-400">→</td>
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">
            Page {page} of {totalPages} · {total} questions
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
